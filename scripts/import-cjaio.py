"""Extract CJAIO PDFs, preserving code indentation, and attach reviewed answer keys.

Usage: python scripts/import-cjaio.py C:/path/to/pdfs
Requires pdfplumber. Generated files are committed; the app needs no PDF runtime.
"""
import html
import json
from pathlib import Path
import re
import sys

import pdfplumber

ROOT = Path(__file__).resolve().parents[1]
KEYS = {
    1: ['B','B','B','C','C','B','C','D','B','A','D','B',
        'ABC','ABDE','BCD','ABD','ACE','ACD'],
    2: ['A','B','A','C','B','B','B','D','B','B','C','C',
        'ABD','ABD','BCD','ABD','ACE','ACD'],
}
REASONS = {
    1: [
        'The slice uses indices 2 and 4; the stop index 5 is excluded.',
        'Visitor count is a numerical quantity, so this is regression.',
        'Indices 1, 3, 5 select Y, H, N.',
        'red occurs 3 times and green 2 times: 3 + 2*2 = 7.',
        'White then black or black then white: (3/8)(5/7) + (5/8)(3/7) = 15/28.',
        'Sum = 50, so mean = 10. The sorted middle value is 7.',
        'This is lower-bound search. The first value at least 13 is 14 at index 3.',
        'Qualifying counts for i=1 through 6 are 0, 1, 0, 4, 1, 3: total 9.',
        'The shallow copy shares inner rows. Editing the first row affects both lists; appending affects only b.',
        'The three neighbors at distance 1 have classes A, B, A. Majority: A.',
        'Right Gini = 1-(2/5)^2-(3/5)^2 = 12/25. Weighted Gini = (3/8)*0 + (5/8)*(12/25) = 3/10.',
        'Insertion sort shifts 1, 0, and 3 items: 4 moves. Final list [1,2,4,5], first plus last = 6.',
        'A, B, C are true. A set removes duplicates, and appending to a copied outer list does not append to the original.',
        'Check duplicates and missingness; standardize units and date formats. Investigate outliers instead of automatically replacing them.',
        'Mean = 5; range = 8. Adding a constant preserves range. Median is 5; doubling values doubles the mean.',
        'Binary search halves ordered search ranges; queues use FIFO; there are n(n-1)/2 index pairs. Stacks use LIFO, and linear search is not always faster.',
        'Distance-based KNN is affected by scaling; trees can overfit; sigmoid outputs are between 0 and 1. K-Means is unsupervised.',
        'Fit preprocessing on training data, prevent duplicate leakage, and use metrics beyond accuracy. Test-set tuning leaks information; removing a sensitive feature cannot guarantee fairness.',
    ],
    2: [
        'The slice selects indices 1, 2, 3, excluding stop index 4.',
        'Temperature is a numerical quantity, so this is regression.',
        'At even indices append the character; at odd indices append the index: D1T3.',
        'Counts are A:3, B:2, C:1. 3*2-1 = 5.',
        'Without replacement: (4/7)(3/6) = 2/7.',
        'Convert temperatures to consistent units before calculating summary statistics.',
        'The first value at least 11 is 12, at index 3.',
        'Pairs (2,1), (3,0), (4,2), (5,1), (5,4) add 2+3+4+5+5 = 19.',
        'b[0] refers to a, while b[1] is a separate copied list. Only the first shares the append.',
        'Nearest squared distances are 1, 1, 4, with labels A, B, B. Majority: B.',
        'Right Gini = 1-(1/4)^2-(3/4)^2 = 3/8. Equal child weights give 3/16.',
        'Bubble sort makes 3+1+1 = 5 swaps. Final list [1,2,4,5], second plus last = 7.',
        'A, B, D are true. Sets do not keep duplicates; b=a aliases the same list.',
        'Check duplicates/missingness and standardize units. Do not automatically replace or delete every unusual numerical value.',
        'Mean = 5, median = 5, range = 6. Translation preserves range; doubling values doubles mean.',
        'Binary search needs ordered data; linear search may inspect all items; queues use FIFO. Standard selection sort uses n(n-1)/2 comparisons; recursion need not be faster.',
        'Scaling affects KNN; trees can overfit; linear regression predicts numerical values. K-Means needs no class labels, and training accuracy does not guarantee test accuracy.',
        'Fit preprocessing after splitting; prevent duplicate leakage; inspect metrics beyond accuracy. Even label-free scaling can leak test-set information.',
    ],
}
RUN_SOLUTION = '''current = best = 1
for i in range(1, len(data)):
    if data[i] > data[i - 1]:
        current += 1
    else:
        current = 1
    if current > best:
        best = current
print(best)'''
MODE_SOLUTION = '''freq = {}
for x in data:
    freq[x] = freq.get(x, 0) + 1
best = None
for x in freq:
    if best is None or freq[x] > freq[best]:
        best = x
    elif freq[x] == freq[best] and x < best:
        best = x
print(best)'''
WRITTEN = {
    1: [
        ('2', 'The score changes by +1, -1, +2, -3, +3, ending at 2.'),
        ('Blanks: x not in seen; seen.add(x). Output: 25.',
         'Award credit for checking membership, recording newly seen values inside the if block, and the retained list [5,3,8,9] with sum 25. Equivalent correct code is acceptable.'),
        ('left = 5, right = 4, checks = 3',
         'Midpoint indices are 3, 5, 4, with values 13, 21, 17. Boundaries then cross; the target is absent. Award credit for a correct trace and final values.'),
        ('A predictions: 3, 5, 7; MSE = 2/3. B predictions: 3, 5.5, 8; MSE = 1/12. Model B is better on these data.',
         'A squared errors: 0,1,1. B squared errors: 0,0.25,0. Divide each sum by 3. Award credit for predictions, squared-error averaging, and comparison.'),
        ('Cluster 1: (0,1), (1,1). Cluster 2: (5,4), (6,4), (7,5). New centers: (0.5,1) and (6,13/3).',
         'Squared distances to C1/C2: (0,65), (1,52), (34,5), (45,2), (65,0). Assignment: 4 marks. Each coordinate-wise updated center: 2 marks.'),
        ('z = 0.9; p = 0.711; class 1 at threshold 0.5; class 0 at threshold 0.75.',
         'z=1.8-0.5-0.4=0.9 (2 marks). Using the supplied exponential, p=1/1.407=0.710732... (3 marks). Threshold decisions: 1 and 2 marks respectively.'),
        ('Output: 4. Example solution for the supplied nonempty data:\n```python\n'+RUN_SOLUTION+'\n```',
         'Accept any correct loop/conditional solution. Track current run and best run; reset on a non-increase and update the maximum. Strict > is required; contiguous runs cannot skip elements. Assess logic and code, rather than comparing variable names or text.'),
        ('Scaled P=(0.5,0.25); A=(0.4,0.45); B=(0.9,0.26); C=(0.6,0.05); D=(0.2,0.245). Scaled neighbors A,C,D -> Class A. Raw neighbors D,B,either A or C -> Class B.',
         'Scaling: 3 marks. Scaled squared distances A=.05, B=.1601, C=.05, D=.090025; neighbors and vote: 3 marks. Raw squared distances A=C=160004, B=464, D=136. The third-neighbor tie has the same class either way. Raw Class B and explanation of large-scale feature dominance: 2 marks.'),
    ],
    2: [
        ('18', 'The even entries contribute 6-0, 8-2, 10-4: total 18.'),
        ('Blanks: sum(nums) / len(nums); x > average. Output: 2.',
         'The average is 7. Only 10 and 9 are strictly greater. Award credit for the mean, strict comparison, and output. Equivalent expressions are acceptable.'),
        ('left = 4, right = 3, checks = 3',
         'Midpoint indices are 3,5,4 with values 12,23,16. Boundaries cross after three checks. Award credit for a correct trace and final values.'),
        ('A predictions: 3,5,7; MSE=2/3. B predictions: 2.5,5,7.5; MSE=1/2. Model B is better on these data.',
         'A squared errors: 0,1,1. B squared errors: .25,1,.25. Divide each total by 3. Award credit for predictions, errors, averaging, and comparison.'),
        ('Cluster 1: (1,1), (2,1). Cluster 2: (6,4), (7,5), (5,4). New centers: (1.5,1) and (6,13/3).',
         'Squared distances to C1/C2: (0,52), (1,41), (34,2), (52,0), (25,5). Assignment: 4 marks. Each new coordinate-wise center: 2 marks.'),
        ('z=1.2; p=0.769 using the supplied approximation; class 1 at threshold 0.5; class 0 at threshold 0.8.',
         'z=1.6-.6+.2=1.2 (2 marks). With the supplied exponential .301, p=1/1.301=.768639... -> .769 (3 marks). Threshold decisions: 1 and 2 marks. A more precise exponential gives approximately .768525, rounding to .769 as well.'),
        ('Output: 2. Example solution:\n```python\n'+MODE_SOLUTION+'\n```',
         'Counts are 4:3, 2:3, 3:1, 5:2. Accept equivalent loop/dictionary/conditional code without collections.Counter. Assess counting, maximum selection, explicit smallest-value tie handling, and output.'),
        ('Scaled P=(0.5,0.5); A=(0.4,0.7); B=(0.9,0.51); C=(0.6,0.52); D=(0.2,0.48). Scaled neighbors C,A,D -> Class A. Raw neighbors B,C,D -> Class B.',
         'Scaling: 3 marks. Scaled squared distances A=.05, B=.1601, C=.0104, D=.0904; neighbors and vote: 3 marks. Raw distances squared A=40001, B=116, C=401, D=409. Raw Class B and explanation of large-scale feature dominance: 2 marks.'),
    ],
}


def extract(path):
    questions = []
    current = None
    code_open = False
    previous_top = None
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            for line in page.extract_text_lines():
                text = html.unescape(line['text']).strip()
                if (text.startswith(('CJAIO Part 1', 'Page ', 'Section ', 'Questions 19-', 'Questions 23-', 'work.'))
                    or (re.fullmatch(r'_+', text) and not all('Mono' in c['fontname'] for c in line['chars']))
                    or text.startswith('Select ALL correct answers.')):
                    continue
                match = re.match(r'^(\d+)\.\s+(.*)', text)
                if match and 1 <= int(match[1]) <= 26:
                    if code_open:
                        current['lines'].append('```')
                        code_open = False
                    current = {'number': int(match[1]), 'lines': [match[2]], 'options': []}
                    questions.append(current)
                    previous_top = None
                    continue
                if current is None:
                    continue
                is_code = all('Mono' in c['fontname'] for c in line['chars'] if c['text'].strip())
                if is_code:
                    if not code_open:
                        current['lines'].append('```python')
                        code_open = True
                    elif previous_top is not None and line['top'] - previous_top > 19:
                        current['lines'].append('')
                    indent = round((line['x0'] - 58.64) / 5.237)
                    current['lines'].append(' ' * max(indent, 0) + text)
                    previous_top = line['top']
                    continue
                if code_open:
                    current['lines'].append('```')
                    code_open = False
                option = re.match(r'^([A-E])\.\s+(.+)', text)
                if option and current['number'] <= 18:
                    current['options'].append(text)
                elif current['options']:
                    current['options'][-1] += ' ' + text
                else:
                    current['lines'].append(text)
    if code_open:
        current['lines'].append('```')
    assert [q['number'] for q in questions] == list(range(1, 27))
    return questions


def main(pdf_dir):
    exams = []
    content_dir = ROOT / 'content' / 'cjaio'
    content_dir.mkdir(parents=True, exist_ok=True)
    for set_number in (1, 2):
        filename = f'CJAIO_Part1_Practice_Set_{set_number}_Questions.pdf'
        raw = extract(pdf_dir / filename)
        exam_id = f'cjaio_set_{set_number}'
        questions = []
        for item in raw:
            number = item['number']
            points = 2 if number <= 12 else 4 if number <= 18 else 5 if number <= 22 else 8
            if number <= 18:
                letters = KEYS[set_number][number - 1]
                answer = (item['options'][ord(letters)-65] if number <= 12
                          else json.dumps(list(letters), separators=(',', ':')))
                reason = REASONS[set_number][number - 1]
            else:
                answer, reason = WRITTEN[set_number][number - 19]
            section = ('A - Single choice' if number <= 12 else 'B - Select all that apply' if number <= 18
                       else 'C - Short Answer I' if number <= 22 else 'D - Short Answer II')
            q = dict(id=f'{exam_id}_q{number}', number=number, points=points,
                     text='\n'.join(item['lines']),
                     type='multiple-choice' if number <= 12 else 'multi-select' if number <= 18 else 'text-input',
                     options=item['options'], correctAnswer=answer, explanation=reason,
                     grading='manual' if number >= 20 else 'automatic', section=section)
            assert len(q['options']) == (5 if number <= 18 else 0), (set_number,number,q['options'])
            questions.append(q)
        assert sum(q['points'] for q in questions) == 100
        exam = dict(id=exam_id, name=f'CJAIO Part 1 - Practice Set {set_number}', competition='CJAIO',
                    durationMinutes=60, source=filename,
                    instructions='Q1-12: select one answer. Q13-18: select all correct answers; all and only the correct options earn the question points. Q19-26: show your work or code. Q20-26 are submitted for teacher marking and may receive partial credit. Answer keys are independently prepared.',
                    questions=questions)
        exams.append(exam)
        md = [f"# {exam['name']}", '', f'Source: {filename}', '',
              '60 minutes | 100 points | 26 questions', '', exam['instructions'], '',
              'Extraction note: HTML comparison entities were decoded; code indentation was recovered from PDF character positions.', '']
        for q in questions:
            md += [f"## Question {q['number']} ({q['points']} points)", '', q['section'], '', q['text'], '']
            md += [f'- {option}' for option in q['options']]
            md += ['']
        (content_dir / f'practice-set-{set_number}.md').write_text('\n'.join(md), encoding='utf-8')
    (ROOT / 'src' / 'data' / 'cjaio-exams.json').write_text(json.dumps(exams, indent=2, ensure_ascii=False)+'\n', encoding='utf-8')
    print('Imported 2 CJAIO sets, 52 questions, 100 points per set.')


if __name__ == '__main__':
    main(Path(sys.argv[1]))
