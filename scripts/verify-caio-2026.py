"""Independent numerical, executable-code, and source-fidelity checks.

Usage: python scripts/verify-caio-2026.py [PDF_DIRECTORY]
Requires numpy, pandas, scikit-learn; source checks also require pdfplumber.
Runs only the reviewed Python question snippets, with in-memory sample data.
"""
from contextlib import redirect_stdout
from fractions import Fraction
from io import StringIO
from itertools import product
import json
import math
from pathlib import Path
import re
import sys
from unittest.mock import patch

import numpy as np
import pandas as pd
from sklearn.naive_bayes import BernoulliNB, MultinomialNB

ROOT = Path(__file__).resolve().parents[1]
EXAMS = json.loads((ROOT / 'src/data/caio-2026-exams.json').read_text(encoding='utf-8'))
QUESTIONS = {(paper, q['number']): q for paper, exam in zip('abc', EXAMS) for q in exam['questions']}


def answers(paper, number):
    return re.findall(r'^\([a-e]\) `(.+)`$', QUESTIONS[paper, number]['correctAnswer'], re.M)


def numerical(paper, number, expected):
    actual = answers(paper, number)
    for index, value in expected.items():
        assert float(actual[index]) == float(value), (paper, number, index, actual, expected)


def execute(paper, number, values=None, frame=None, array=None):
    q = QUESTIONS[paper, number]
    code = '\n'.join(re.findall(r'```python\n(.*?)\n```', q['text'], re.S))
    if number >= 26:
        replacements = iter(answers(paper, number))
        code = re.sub(r'_{3,}', lambda _: next(replacements), code)
    compile(code, f'{paper}-{number}', 'exec')
    scope = dict(values or {})
    output = StringIO()
    with patch.object(pd, 'read_csv', return_value=frame), patch.object(np, 'loadtxt', return_value=array), redirect_stdout(output):
        exec(code, scope)
    return scope, output.getvalue().strip()


# Verify printed outputs by executing source snippets and comparing to key text.
for paper in 'abc':
    for number in (1, 2):
        _, printed = execute(paper, number)
        assert printed == QUESTIONS[paper, number]['correctAnswer'][3:], (paper, number, printed)

orders = pd.DataFrame({'order_id': [1,2,3], 'customer': ['a','b','c'], 'date': ['2026-01-01']*3,
                       'amount': [10.,20.,np.nan], 'region': ['N','N','S']})
scope, _ = execute('a', 26, frame=orders)
assert scope['g'].to_dict() == {('N', 1): 30.}
students = pd.DataFrame({'hours': list(range(40)), 'score': list(range(40)), 'passed': [0]*20+[1]*20})
scope, result = execute('a', 27, frame=students)
assert 0 <= float(result) <= 1
np.testing.assert_allclose(scope['scaler'].mean_, scope['X_train'].mean())
X = np.array([[1.,2.], [3.,4.], [5.,7.]])
y = np.array([1.,3.,2.])
w = np.array([.2,-.4])
b = .3
scope, _ = execute('a', 29, dict(X=X, y=y, w=w.copy(), b=b, alpha=.1))
gradient, bias_gradient = scope['compute_gradient'](X,y,w,b)
loss = lambda weight, bias: np.mean((X@weight+bias-y)**2)/2
eps = 1e-6
finite_difference = [(loss(w+eps*np.eye(2)[i],b)-loss(w-eps*np.eye(2)[i],b))/(2*eps) for i in range(2)]
np.testing.assert_allclose(gradient, finite_difference, atol=1e-8)
assert math.isclose(bias_gradient,(loss(w,b+eps)-loss(w,b-eps))/(2*eps),abs_tol=1e-8)
np.testing.assert_allclose(scope['w'], w-.1*gradient)

movies = pd.DataFrame({'title': [f' title {i} ' for i in range(12)], 'year': [2026]*12,
                       'genre': ['A']*12, 'rating': [4.]*11+[np.nan]})
scope, _ = execute('b', 26, frame=movies)
assert scope['g'].loc['A','mean'] == 4 and scope['g'].loc['A','count'] == 12
assert scope['df']['title'].iloc[0] == 'title 0'
array = np.column_stack([np.arange(20.), np.arange(20.)**2])
scope, _ = execute('b', 27, array=array)
np.testing.assert_array_equal(scope['clean'][scope['idx'],0], np.arange(15.,20.))
scope, _ = execute('b', 28, dict(X=np.arange(30.).reshape(-1,1), y=np.arange(30.)**2))
assert len(scope['scores']) == 5 and np.isfinite(scope['scores']).all()
assert scope['model'].get_params()['polynomialfeatures__degree'] == 3

# A leading missing value in sensor B must not inherit sensor A's last value.
readings = pd.DataFrame({'ts': ['2026-01-01','2026-01-03','2026-01-01','2026-01-03'],
                         'sensor': ['A','A','B','B'], 'value': [1.,3.,np.nan,9.]})
scope, _ = execute('c', 26, frame=readings)
assert scope['daily'].loc['A'].iloc[1] == 1
assert pd.isna(scope['daily'].loc['B'].iloc[0]) and pd.isna(scope['daily'].loc['B'].iloc[1])

entropy = lambda p: -p*math.log2(p)-(1-p)*math.log2(1-p)
hp,hl,hr = entropy(7/12),entropy(5/6),entropy(2/6)
numerical('a',28,dict(enumerate(round(v,2) for v in [hp,hl,hr,(hl+hr)/2,hp-(hl+hr)/2])))
sigmoid = lambda z: 1/(1+math.exp(-z))
numerical('a',30,{0:-.5,1:round(sigmoid(-.5),2),2:0,3:-3.5,4:round(sigmoid(-3.5),2)})
points=np.array([[1.,1.],[1.,2.],[4.,4.],[5.,4.]])
centers=np.array([[1.,1.],[5.,5.]])
labels=((points[:,None]-centers)**2).sum(axis=2).argmin(axis=1)
updated=np.array([points[labels==i].mean(axis=0) for i in range(2)])
numerical('a',31,dict(enumerate(updated.ravel())))
np.testing.assert_array_equal(labels,((points[:,None]-updated)**2).sum(axis=2).argmin(axis=1))
numerical('a',32,{0:1+5,1:2+2,3:2+3})
numerical('a',33,{0:25,1:-2.5,2:round(math.exp(-2.5),3),3:9,4:round(math.exp(-.9),3)})
numerical('a',34,{4:sum(a<b and b!=c for a,b,c in product(range(1,4),repeat=3))})
slope,intercept=np.linalg.lstsq(np.column_stack([[1,2,3],np.ones(3)]),[2,3,5],rcond=None)[0]
numerical('a',35,{0:2,1:round(10/3,2),2:round(slope,2),3:round(intercept,2),4:round(4*slope+intercept,2)})
numerical('b',29,{0:.4,1:round(4/6,3),2:round(2/6,3),3:round(.6*(2/8)*(3/8),3)})
eigenvalues=np.linalg.eigvalsh([[4,2],[2,3]])[::-1]
numerical('b',30,{0:7,1:8,2:round(eigenvalues[0],2),3:round(eigenvalues[1],2),4:round(eigenvalues[0]/7,2)})
numerical('b',31,{3:6})
numerical('b',33,{0:4,1:1,3:sum(x<y and y!=z for x,y,z in product(range(1,5),repeat=3))})
numerical('b',34,{0:1,1:9,2:2,3:16,4:6})
F=Fraction
dw,db=F(-11,3),F(-5,3)
new_w,new_b=-F(1,10)*dw,-F(1,10)*db
mse=sum((new_w*x+new_b-y)**2 for x,y in [(1,1),(2,2),(3,2)])/3
numerical('b',35,dict(enumerate(round(float(v),2) for v in [dw,db,new_w,new_b,mse])))
gini=lambda p: 1-p*p-(1-p)**2
numerical('c',27,{0:round(gini(3/8),2),1:0,2:round(5/8*gini(3/5),2),3:round(gini(3/8)-5/8*gini(3/5),2),4:3.5})
vocab=['buy','cheap','now','deal','see','lunch']
docs=['buy cheap','buy now','cheap deal','see now','see deal','lunch now']
counts=np.array([[d.split().count(v) for v in vocab] for d in docs])
nb=MultinomialNB().fit(counts,[1,1,1,0,0,0])
test=np.array([[1,0,1,0,0,0]])
prob=np.exp(nb.feature_log_prob_)
posterior=nb.predict_proba(test)[0,1]
numerical('c',28,{0:round(prob[1,0],2),1:round(prob[1,2],2),2:round(prob[0,0],2),3:round(posterior,2)})
assert round(BernoulliNB().fit(counts,[1,1,1,0,0,0]).predict_proba(test)[0,1],2)==.73
numerical('c',29,{0:-1.3,1:0,3:1.2,4:4.7})
numerical('c',30,{1:3,3:5})
numerical('c',31,{2:5,3:3})
models=[(a,b,c) for a,b,c in product([False,True],repeat=3) if (not a or b) and (not b or c)]
numerical('c',32,{0:8,1:len(models),3:sum(not a for a,b,c in models),4:sum(b and not c for a,b,c in models)})
solutions=[(x,y,z) for x,y,z in product('RGB',repeat=3) if x!=y and y!=z]
numerical('c',33,{3:sum(x=='R' for x,y,z in solutions),4:len(solutions)})
numerical('c',34,{0:20+10*30,1:5+10*50,2:(80+870)/1000,3:(60+885)/1000})
numerical('c',35,{0:2,1:9,2:6,3:round(2*math.sqrt(2),3),4:36})

if len(sys.argv)>1:
    import pdfplumber
    def compact(text):
        return re.sub(r'\s+', '', text)
    for paper, exam in zip('abc',EXAMS):
        with pdfplumber.open(Path(sys.argv[1])/exam['source']) as pdf:
            source='\n'.join(page.extract_text() for page in pdf.pages[1:])
        source=re.sub(r'2026-27 CAIO National Qualifier Practical Competition www\.iaiocanada\.com|Page \d+ of \d+', '', source)
        blocks=re.split(r'Question \d+ [^\n]+\n\d+ Points\n',source)[1:]
        assert len(blocks)==35
        for q,block in zip(exam['questions'],blocks):
            block=re.sub(r'Write your answer for each blank below:|\([a-e]\) _+', '', block)
            imported=q['text'].split('\n\n**Platform note:**')[0].split('\n\nWrite five answers labeled')[0]
            imported=re.sub(r'```(?:python|text)?', '', imported)
            imported+='\n'+'\n'.join(q['options'])
            assert compact(imported)==compact(block), (paper,q['number'],'Source text mismatch')
print('Passed executable code, numerical answers, alternate NB model, and optional source-fidelity checks.')
