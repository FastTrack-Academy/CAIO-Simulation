"""Independently check authored drill arithmetic and execute all code questions.

Run: python scripts/verify-cjaio-drills.py
No third-party packages required. This executes only the reviewed original drill
code shipped in this repository, not student submissions.
"""
import ast
import contextlib
from fractions import Fraction as F
from itertools import product
import io
import json
from math import comb
from pathlib import Path
import re
from statistics import mean, median

ROOT = Path(__file__).resolve().parents[1]
EXAMS = json.loads((ROOT / 'src/data/cjaio-drills.json').read_text(encoding='utf-8'))


def blocks(text):
    return re.findall(r'```python\n(.*?)\n```', text, re.S)


def execute(source):
    namespace = {}
    captured = io.StringIO()
    with contextlib.redirect_stdout(captured):
        exec(compile(source, '<reviewed-drill-code>', 'exec'), namespace)
    return captured.getvalue().strip(), namespace


def question(drill, number):
    return EXAMS[drill - 1]['questions'][number - 1]


def answer(drill, number):
    return question(drill, number)['correctAnswer']


def option(drill, number):
    return answer(drill, number).split('. ', 1)[1]


def squared(point, center):
    return sum((a-b)**2 for a, b in zip(point, center))


def gini(positive, negative):
    total = positive + negative
    return 1 - F(positive, total)**2 - F(negative, total)**2


def mse(actual, predicted):
    return sum((a-b)**2 for a,b in zip(actual, predicted)) / len(actual)


code_checks = 0
for drill, exam in enumerate(EXAMS, 1):
    for q in exam['questions']:
        for source in blocks(q['text']):
            ast.parse(source)
            if q['type'] == 'multiple-choice' or q['number'] == 19:
                output, _ = execute(source)
                expected = option(drill, q['number']) if q['type'] == 'multiple-choice' else q['correctAnswer']
                assert output == expected, (drill, q['number'], output, expected)
                code_checks += 1

# Fill both blanks, rather than checking isolated expressions.
filled = blocks(question(1, 20)['text'])[0].replace('____________________', 'counts.get(item, 0) + 1', 1)
filled = filled.replace('____________________', 'counts["pen"] - counts["book"]', 1)
assert execute(filled)[0] == '1'
filled = blocks(question(2, 20)['text'])[0].replace('____________________', 'total >= target', 1)
filled = filled.replace('____________________', 'i', 1)
assert execute(filled)[0] == '2'
for drill, expected in [(1, (4,3,3)), (2, (4,3,3))]:
    _, state = execute(blocks(question(drill, 21)['text'])[0])
    assert tuple(state[key] for key in ['left','right','checks']) == expected
    assert all(f'{key}={value}' in answer(drill, 21) for key,value in zip(['left','right','checks'],expected))

# Probability: count unordered draws independently of the sequential explanations.
assert F(comb(2,1)*comb(4,1), comb(6,2)) == F(option(1,5)) == F(8,15)
assert F(comb(3,2)*comb(2,1), comb(5,3)) == F(option(2,5)) == F(3,5)
data = [2,4,5,9,10,18]
assert mean(data) == 8 and median(data) == 7
assert option(1,6) == 'Mean = 8; median = 7'
assert F(60-45,45) == F(1,3) and option(2,6).startswith('Week 3 to Week 4')
assert F(4,6)*gini(2,2) == F(option(1,11)) == F(1,3)
split_x = F(1,2)*gini(3,1) + F(1,2)*gini(1,3)
split_y = F(2,8)*gini(2,0) + F(6,8)*gini(2,4)
assert split_y == F(1,3) < split_x == F(3,8)
assert option(2,11).startswith('Y,')
probabilities = [F(35,100), F(55,100), F(70,100), F(90,100)]
assert sum(F(1,2) <= p < F(3,4) for p in probabilities) == int(option(2,12)) == 2

# KNN rankings: compare independently generated exact squared distances.
query = (4,3)
labeled = [((3,3),'A'),((4,5),'B'),((5,3),'A'),((4,0),'B'),((8,3),'B')]
labels = [label for point,label in sorted(labeled, key=lambda pair: squared(pair[0], query))[:3]]
assert labels.count('A') == 2 and option(1,10) == 'Class A'
query = (0,0)
labeled = [((1,0),'A'),((0,2),'B'),((2,1),'B'),((-3,0),'A')]
nearest = [label for point,label in sorted(labeled,key=lambda pair:squared(pair[0],query))]
assert nearest[:3] == ['A','B','B'] and option(2,10) == 'k=1 predicts A; k=3 predicts B.'
points = [(16,180),(36,104),(24,20),(8,96)]
query = (20,100)
ranges = (40,400)
raw = [squared(p,query) for p in points]
scaled = [sum(F(a-b,r)**2 for a,b,r in zip(p,query,ranges)) for p in points]
assert raw == [6416,272,6416,160]
assert scaled == [F(5,100),F(1601,10000),F(5,100),F(901,10000)]
assert sorted(range(4),key=lambda i:scaled[i])[:3] == [0,2,3]
assert sorted(range(4),key=lambda i:raw[i])[:3] == [3,1,0]
assert 'Class A' in answer(1,26) and 'Class B' in answer(1,26)

# Regression and sigmoid arithmetic are separate from the authoring script.
x = [0,1,2]
assert mse([1,4,5],[F(2)*v+1 for v in x]) == F(1,3)
assert mse([1,4,5],[F(3)*v+1 for v in x]) == F(4,3)
assert 'Model A has lower MSE' in answer(1,22)
x = [1,2,3]
assert mse([2,4,6],[F(3)*v-1 for v in x]) == F(5,3)
assert mse([2,4,6],[F(2)*v+1 for v in x]) == F(1)
assert 'Prefer B' in answer(2,22)
assert round(1/(1+0.223),3) == .818
assert round(1/(1+4.482),3) == .182
assert '0.818' in answer(1,24) and '0.818' in answer(2,24) and '0.182' in answer(2,24)


def kmeans_step(points, centers):
    clusters = [[],[]]
    for p in points:
        distances = [squared(p,c) for c in centers]
        cluster = min(range(2),key=lambda i:distances[i])
        clusters[cluster].append(p)
    centers = [tuple(F(sum(p[j] for p in group),len(group)) for j in range(2)) for group in clusters]
    return clusters,centers


groups,centers = kmeans_step([(0,0),(2,0),(5,3),(7,3)],[(0,0),(6,4)])
assert groups == [[(0,0),(2,0)],[(5,3),(7,3)]]
assert centers == [(1,0),(6,3)]
points = [(0,0),(2,0),(3,0),(9,0),(10,0)]
groups,centers = kmeans_step(points,[(0,0),(4,0)])
assert groups == [[(0,0),(2,0)],[(3,0),(9,0),(10,0)]]
assert centers == [(1,0),(F(22,3),0)]
groups,centers = kmeans_step(points,centers)
assert groups == [[(0,0),(2,0),(3,0)],[(9,0),(10,0)]]
assert centers == [(F(5,3),0),(F(19,2),0)]
assert '22/3' in answer(2,23) and '5/3' in answer(2,23) and '19/2' in answer(2,23)

# Test teacher program examples on edge cases, ties, and every short ternary list.
equal_output,equal_namespace = execute(blocks(answer(1,25))[0])
run_output,run_namespace = execute(blocks(answer(2,25))[0])
assert equal_output == '3' and run_output == '(0, 3)'
tested = 0
for length in range(7):
    for values in product((-1,0,1),repeat=length):
        values = list(values)
        equal_expected = max([0]+[j-i+1 for i in range(length) for j in range(i,length) if len(set(values[i:j+1])) == 1])
        candidates = [(i,j-i+1) for i in range(length) for j in range(i,length) if all(values[k]>values[k-1] for k in range(i+1,j+1))]
        run_expected = min(candidates,key=lambda item:(-item[1],item[0])) if candidates else (-1,0)
        assert equal_namespace['longest_equal_run'](values) == equal_expected
        assert run_namespace['longest_run'](values) == run_expected
        tested += 1

assert F(0+90,100) == F(9,10) and F(8+80,100) == F(22,25)
assert F(0,10) == 0 and F(8,10) == F(4,5)
assert '90%' in answer(2,26) and '88%' in answer(2,26) and '80%' in answer(2,26)
print(f'PASS: {code_checks} executable objective questions, both fill-in programs/search traces, probability, statistics, distances, Gini, MSE, K-Means, sigmoid, evaluation; both teacher programs tested on {tested} lists each.')
