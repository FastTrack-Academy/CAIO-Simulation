import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';
import { createRequire } from 'node:module';

// Load the pure grading module without a new test runner or a particular Node
// TypeScript-loader version. TypeScript is already a project dependency.
const source = readFileSync(new URL('../src/lib/grading.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { checkAnswer, getAttemptGrade, getQuestionGrade, MANUAL_MARKS_KEY, parseSelections } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

const sets = JSON.parse(readFileSync(new URL('../src/data/cjaio-exams.json', import.meta.url), 'utf8'));
const drills = JSON.parse(readFileSync(new URL('../src/data/cjaio-drills.json', import.meta.url), 'utf8'));

test('attempt payload uses a nullable completion timestamp until submission', async () => {
  const source = readFileSync(new URL('../src/lib/attempt-persistence.ts', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
  const { toAttemptRow } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
  const attempt = { id: 'attempt_test', studentId: 'student', examId: 'cjaio_set_1', score: 0,
    totalPoints: 100, answers: { q1: 'A' }, flagged: ['q2'], timeSpent: 5,
    timeLeft: 3595, completedAt: '', isCompleted: false };
  const draft = toAttemptRow(attempt);
  assert.equal(draft.completed_at, null);
  assert.equal(draft.is_completed, false);
  assert.deepEqual(draft.answers, attempt.answers);
  assert.deepEqual(draft.flagged, attempt.flagged);
  assert.equal(draft.time_left, 3595);
  const submittedAt = '2026-10-27T16:30:00.000Z';
  const submitted = toAttemptRow({ ...attempt, isCompleted: true, completedAt: submittedAt });
  assert.equal(submitted.completed_at, submittedAt);
  assert.equal(submitted.is_completed, true);
});

test('legacy indented code options render as code and keep math and unsafe text intact', () => {
  const require = createRequire(import.meta.url);
  const { createElement } = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const rendererSource = readFileSync(new URL('../src/components/MathRenderer.tsx', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(rendererSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const loaded = { exports: {} };
  new Function('require', 'module', 'exports', compiled)(require, loaded, loaded.exports);
  const { MathRenderer } = loaded.exports;
  const caio = JSON.parse(readFileSync(new URL('../src/data/exams.json', import.meta.url), 'utf8'));
  const legacyOption = caio[0].questions.find(q => q.options.some(option => option.includes('```'))).options[0];
  const html = renderToStaticMarkup(createElement(MathRenderer, { text: legacyOption }));
  assert(html.includes('<pre><code>'));
  assert(!html.includes('```'));
  assert(html.includes('100'));
  const mixed = renderToStaticMarkup(createElement(MathRenderer, { text: '$x^2$ and <script>alert(1)</script> and `print(2)`' }));
  assert(mixed.includes('class="katex"'));
  assert(mixed.includes('&lt;script&gt;'));
  assert(!mixed.includes('<script>'));
  assert(mixed.includes('class="inline-code"'));
});

test('the equivalent and harder drills use the CJAIO format and have independent stable IDs', () => {
  const caio = JSON.parse(readFileSync(new URL('../src/data/exams.json', import.meta.url), 'utf8'));
  assert.equal(drills.length, 2);
  assert.match(drills[0].difficulty, /^Equivalent to CJAIO practice sets$/);
  assert.match(drills[1].difficulty, /^Harder than CJAIO practice sets$/);
  const allQuestions = [...caio, ...sets, ...drills].flatMap(exam => exam.questions);
  assert.equal(new Set(allQuestions.map(q => q.id)).size, allQuestions.length);
  const referenceText = new Set(sets.flatMap(exam => exam.questions.map(q => q.text)));
  for (const exam of drills) {
    assert.equal(exam.competition, 'CJAIO');
    assert.equal(exam.durationMinutes, 60);
    assert.equal(exam.questions.length, 26);
    assert.equal(exam.questions.reduce((sum, q) => sum + q.points, 0), 100);
    assert.deepEqual(exam.questions.map(q => q.number), Array.from({ length: 26 }, (_, i) => i + 1));
    assert.equal(exam.questions.filter(q => q.type === 'multiple-choice').length, 12);
    assert.equal(exam.questions.filter(q => q.type === 'multi-select').length, 6);
    assert.equal(exam.questions.filter(q => q.type === 'text-input').length, 8);
    for (const q of exam.questions) {
      assert(!referenceText.has(q.text));
      assert(q.explanation.length > 30);
      if (q.type === 'multiple-choice') assert(q.options.includes(q.correctAnswer));
      if (q.type === 'multi-select') {
        assert.equal(q.options.length, 5);
        const selected = JSON.parse(q.correctAnswer);
        assert(selected.length > 1 && selected.every(letter => /^[A-E]$/.test(letter)));
      }
    }
  }
});

test('both drills can be submitted, wait for teacher marking, and receive full or partial credit', () => {
  for (const exam of drills) {
    const answers = Object.fromEntries(exam.questions.map(q => [q.id, q.correctAnswer]));
    assert.deepEqual(getAttemptGrade(exam, answers), { score: 53, pendingCount: 7, pendingPoints: 47, gradedPoints: 53 });
    const manual = Object.fromEntries(exam.questions.filter(q => q.grading === 'manual').map(q => [q.id, q.points]));
    answers[MANUAL_MARKS_KEY] = JSON.stringify(manual);
    assert.equal(getAttemptGrade(exam, answers).score, 100);
    manual[exam.questions[24].id] = 6.5;
    answers[MANUAL_MARKS_KEY] = JSON.stringify(manual);
    assert.equal(getAttemptGrade(exam, answers).score, 98.5);
    assert.equal(getQuestionGrade(exam.questions[24], answers).status, 'partial');
  }
});

test('both imported papers preserve question structure, points, blanks, and code indentation', () => {
  assert.equal(sets.length, 2);
  for (const exam of sets) {
    assert.equal(exam.competition, 'CJAIO');
    assert.equal(exam.durationMinutes, 60);
    assert.deepEqual(exam.questions.map(q => q.number), Array.from({ length: 26 }, (_, i) => i + 1));
    assert.equal(new Set(exam.questions.map(q => q.id)).size, 26);
    assert.equal(exam.questions.reduce((sum, q) => sum + q.points, 0), 100);
    assert.equal(exam.questions.filter(q => q.type === 'multiple-choice').length, 12);
    assert.equal(exam.questions.filter(q => q.type === 'multi-select').length, 6);
    assert.equal(exam.questions.filter(q => q.type === 'text-input').length, 8);
    assert.ok(exam.questions[6].text.includes('while left <= right:\n    mid ='));
    assert.ok(exam.questions.every(q => !q.text.includes('&lt;') && !q.text.includes('&gt;')));
    assert.ok(exam.questions.slice(0, 18).every(q => q.options.length === 5));
  }
  assert.match(sets[0].questions[19].text, /result.append\(x\)\n        _+/);
});

test('select-all marking is order independent and requires exactly the correct selection', () => {
  assert.equal(checkAnswer('["C","A","B"]', '["A","B","C"]', 'multi-select'), true);
  for (const wrong of ['["A"]', '["A","B","C","D"]', 'A', '[]', '["A",9]', 'null']) {
    assert.equal(checkAnswer(wrong, '["A","B","C"]', 'multi-select'), false, wrong);
  }
  assert.deepEqual(parseSelections('["C","A","C"]'), ['A', 'C']);
});

test('correct objective responses earn 53 points while 47 written points remain pending', () => {
  for (const exam of sets) {
    const answers = Object.fromEntries(exam.questions.map(q => [q.id, q.correctAnswer]));
    assert.deepEqual(getAttemptGrade(exam, answers), { score: 53, pendingCount: 7, pendingPoints: 47, gradedPoints: 53 });
    const marks = Object.fromEntries(exam.questions.filter(q => q.grading === 'manual').map(q => [q.id, q.points]));
    answers[MANUAL_MARKS_KEY] = JSON.stringify(marks);
    assert.deepEqual(getAttemptGrade(exam, answers), { score: 100, pendingCount: 0, pendingPoints: 0, gradedPoints: 100 });
  }
});

test('manual marking accepts partial credit without exact string matching and survives JSON persistence', () => {
  const q = sets[0].questions[24];
  const answers = { [q.id]: 'An equivalent correct program using different variable names' };
  assert.equal(getQuestionGrade(q, answers).status, 'pending');
  const persisted = JSON.parse(JSON.stringify({ ...answers, [MANUAL_MARKS_KEY]: JSON.stringify({ [q.id]: 6.5 }) }));
  assert.deepEqual(getQuestionGrade(q, persisted), { status: 'partial', score: 6.5 });
  for (const invalid of [-1, 9, '8', null]) {
    assert.equal(getQuestionGrade(q, { ...answers, [MANUAL_MARKS_KEY]: JSON.stringify({ [q.id]: invalid }) }).status, 'pending');
  }
  assert.equal(getQuestionGrade(q, { ...answers, [MANUAL_MARKS_KEY]: '{broken' }).status, 'pending');
  assert.deepEqual(getQuestionGrade(q, {}), { status: 'incorrect', score: 0 });
});

test('legacy CAIO answer matching remains available', () => {
  assert.equal(checkAnswer('D. Recall', 'D. Recall', 'multiple-choice'), true);
  assert.equal(checkAnswer('A. Accuracy', 'D. Recall', 'multiple-choice'), false);
  assert.equal(checkAnswer(' x = "hello" ; ', '`x = \'hello\'`', 'text-input'), true);
});
