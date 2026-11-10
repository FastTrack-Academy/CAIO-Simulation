import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// Load the pure grading module without a new test runner or a particular Node
// TypeScript-loader version. TypeScript is already a project dependency.
const source = readFileSync(new URL('../src/lib/grading.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { checkAnswer, getAttemptGrade, getQuestionGrade, MANUAL_MARKS_KEY, parseSelections } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

const sets = JSON.parse(readFileSync(new URL('../src/data/cjaio-exams.json', import.meta.url), 'utf8'));
const drills = JSON.parse(readFileSync(new URL('../src/data/cjaio-drills.json', import.meta.url), 'utf8'));
const caio2026 = JSON.parse(readFileSync(new URL('../src/data/caio-2026-exams.json', import.meta.url), 'utf8'));

test('the live catalog includes the 2025 and 2026 papers without changing saved exam IDs', () => {
  const require = createRequire(import.meta.url);
  const source = readFileSync(new URL('../src/data/all-exams.ts', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  const loaded = { exports: {} };
  const dataRequire = path => require(fileURLToPath(new URL(`../src/data/${path}`, import.meta.url)));
  new Function('require', 'module', 'exports', compiled)(dataRequire, loaded, loaded.exports);
  const exams = loaded.exports.default;
  const older = exams.filter(exam => exam.competition === 'CAIO' && exam.year === 2025);
  const newer = exams.filter(exam => exam.competition === 'CAIO' && exam.year === 2026);
  assert.deepEqual(older.map(exam => exam.id), ['exam_1', 'exam_2', 'exam_3']);
  assert.deepEqual(newer.map(exam => exam.id), ['caio_2026_a', 'caio_2026_b', 'caio_2026_c']);
  for (const exam of [...older, ...newer]) {
    assert(exam.name.startsWith(String(exam.year)));
    assert.equal(exam.durationMinutes, 90);
    assert.equal(exam.questions.length, 35);
    assert(exam.questions.every(q => q.id === `${exam.id}_q${q.number}`));
  }
  assert(exams.filter(exam => exam.name.startsWith("Max's")).every(exam => exam.year === undefined));
  assert.equal(exams.filter(exam => exam.competition === 'CJAIO').length, 4);
});

test('2026 CAIO papers preserve the 35-question, 100-point format and unique IDs', () => {
  assert.equal(caio2026.length, 3);
  const legacy = JSON.parse(readFileSync(new URL('../src/data/exams.json', import.meta.url), 'utf8'));
  const all = [...legacy, ...sets, ...drills, ...caio2026];
  assert.equal(new Set(all.map(e => e.id)).size, all.length);
  const questions = all.flatMap(e => e.questions);
  assert.equal(new Set(questions.map(q => q.id)).size, questions.length);
  for (const exam of caio2026) {
    assert.equal(exam.competition, 'CAIO');
    assert.equal(exam.durationMinutes, 90);
    assert.equal(exam.questions.reduce((sum,q) => sum+q.points,0), 100);
    assert.deepEqual(exam.questions.map(q => q.number), Array.from({length:35},(_,i)=>i+1));
    assert.equal(exam.questions.filter(q => q.type === 'multiple-choice').length,15);
    assert.equal(exam.questions.filter(q => q.type === 'multi-select').length,10);
    assert.equal(exam.questions.filter(q => q.type === 'text-input').length,10);
    for (const q of exam.questions) {
      assert(q.explanation.trim());
      assert.equal((q.text.match(/```/g) || []).length % 2,0);
      if (q.number <= 25) {
        assert.equal(q.points,2);
        assert.equal(q.options.length,5);
        if (q.type === 'multiple-choice') {
          assert(q.options.includes(q.correctAnswer));
          for (const option of q.options) assert.equal(checkAnswer(option,q.correctAnswer,q.type), option === q.correctAnswer);
        } else {
          assert(parseSelections(q.correctAnswer).length > 0);
          assert(checkAnswer(q.correctAnswer,q.correctAnswer,q.type));
          assert(!checkAnswer('["A","B","C","D","E"]',q.correctAnswer,q.type));
        }
      } else {
        assert.equal(q.points,5);
        assert.equal(q.grading,'manual');
        assert.equal((q.text.match(/_{3,}/g) || []).length,5);
        assert.equal((q.correctAnswer.match(/^\([a-e]\)/gm) || []).length,5);
      }
    }
  }
});

test('2026 CAIO grading supports complete attempts, pending work, and teacher credit', () => {
  for (const [index, exam] of caio2026.entries()) {
    const answers = Object.fromEntries(exam.questions.map(q => [q.id,q.correctAnswer]));
    const pendingCount = [10,13,11][index];
    const score = [50,44,48][index];
    assert.deepEqual(getAttemptGrade(exam,answers), {score,pendingCount,pendingPoints:100-score,gradedPoints:score});
    assert.deepEqual(getAttemptGrade(exam,{}), {score:0,pendingCount:0,pendingPoints:0,gradedPoints:100});
    answers[MANUAL_MARKS_KEY] = JSON.stringify(Object.fromEntries(exam.questions.filter(q=>q.grading==='manual').map(q=>[q.id,q.points])));
    assert.equal(getAttemptGrade(exam,JSON.parse(JSON.stringify(answers))).score,100);
    const marks = JSON.parse(answers[MANUAL_MARKS_KEY]);
    marks[exam.questions[25].id]=3;
    answers[MANUAL_MARKS_KEY]=JSON.stringify(marks);
    assert.equal(getAttemptGrade(exam,answers).score,98);
  }
});

test('clearing a teacher-marked select-all response is skipped rather than pending', () => {
  const q = caio2026[1].questions[15];
  assert.equal(q.grading,'manual');
  assert.deepEqual(getQuestionGrade(q,{[q.id]:'[]'}), {status:'incorrect',score:0});
  assert.deepEqual(getQuestionGrade(q,{[q.id]:'["B","D"]'}), {status:'pending',score:0});
});

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
  for (const exam of caio2026) {
    for (const q of exam.questions) {
      for (const text of [q.text, ...q.options, q.correctAnswer, q.explanation]) {
        const rendered = renderToStaticMarkup(createElement(MathRenderer, { text }));
        assert(!rendered.includes('```'), `${q.id}: unrendered code fence`);
        if (text.includes('```')) assert(rendered.includes('<pre><code>'), `${q.id}: missing code block`);
      }
    }
  }
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
