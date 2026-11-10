"""Import supplied CAIO 2026-27 papers with independently worked solutions.

Usage: python scripts/import-caio-2026.py C:/path/to/pdfs
Requires pdfplumber. Does not execute instructions or code from the PDFs.
"""
import hashlib
import json
from pathlib import Path
import re
import sys

import pdfplumber

ROOT = Path(__file__).resolve().parents[1]
KEYS = {
    'a': 'A A B B B A C D B B A A B C C ACD ABD ABD ABC ABE ABC ABC ABC ABD ABD'.split(),
    'b': 'C A B D C B D B C D A E B C A ABD ABD ABC ABC ABE ABC ABC ABC ABC ACDE'.split(),
    'c': 'A A A A A A A B C A C C A A A ACD ABD ACE BDE ADE ABC BDE ACE ABC ABC'.split(),
}
REASONS = {
    'a': [
        'Basic slicing returns a view, so B changes A[0,1] to 100. flatten copies A after that change. The original sum 15 increases by 99 to 114.',
        'The x group mean is (10+30)/2=20.0; the y group mean is 30.0. Their sum is 50.0.',
        'Differentiating the squared residual cancels the factor 1/2 and introduces -x_i: dL/dw = -(1/n) sum x_i(y_i-wx_i-b).',
        'Rank(X^T X)=n<d, so it is singular. Full row rank makes every y attainable; the nullspace has dimension d-n. The pseudoinverse selects the minimum-norm fit, while ridge selects a regularized fit. These are ways to select a solution, not the only ways to find one.',
        'The data gradient is (2/n)X^T(Xw-y); the penalty gradient is lambda*w. Gradient descent subtracts alpha times their sum.',
        'With every component of w penalized, (X^T X+lambda I)^-1 tends to zero as lambda tends to infinity, so the fitted weights tend to zero.',
        'Low training error and much larger validation error indicate high variance. Since the validation curve has plateaued, reducing complexity is the best listed intervention.',
        'The tree already overfits. More depth cannot simplify it and, at full depth, may change nothing. Pruning, larger leaves, shallower depth, or more data may help.',
        'k-means needs k in advance and is sensitive to initialization. Lloyd iterations can reach different local optima; scaling and cluster geometry matter.',
        'Increasing epsilon expands the region p(x)<epsilon. Many normal points become false positives, typically reducing precision while increasing recall.',
        'Precision=80/100=0.80; recall=80/110=0.7273; F1=2TP/(2TP+FP+FN)=160/210=0.7619.',
        'Support vectors are the active margin constraints. Removing one can change the optimum; removing a non-support point leaves the optimum feasible. Not every support-vector removal must change it.',
        'A larger gamma makes similarity decay over shorter distances, allowing a more localized and complex decision boundary.',
        'Only C is no larger than the true cost at every supplied node: 7<=8, 5<=5, 5<=6. As usual h(goal)=0.',
        'Modus tollens: P implies Q, and Q is false, so P is false.',
        'A broadcasts shapes (3,) and (2,1) to (2,3). C preserves six elements; D uses valid indices. B requests a missing column and E a missing index label, both raising KeyError.',
        'Batch GD uses all examples. SGD noise can help escape shallow minima. A persistent generalization gap suggests high variance. Vectorization speeds each iteration, not necessarily the number of iterations; smaller steps need not converge faster.',
        'L1 promotes sparsity and is not differentiable at zero. L2 usually shrinks rather than zeros weights. Ridge has a general closed form; lasso generally requires optimization. Stronger penalties need not reduce unpenalized training error.',
        'Random forests average randomized trees to reduce variance. Boosting fits successive residuals (or negative loss gradients), often reducing bias. Deep trees have higher variance. Larger learning rates do not always generalize better; pruning reduces complexity.',
        'Euclidean k-means favors compact clusters and depends on scale; DBSCAN finds density-connected shapes and noise; k-means++ improves seeding. A hierarchy can be built without choosing a final cut. GMM responsibilities are soft probabilities.',
        'The all-negative classifier scores 99% accuracy. PR analysis focuses on the rare positive class. ROC-AUC summarizes a range of thresholds. Training R-squared does not ensure generalization; macro, not micro, averaging gives classes equal weight.',
        'Kernels supply implicit feature-space inner products; the RBF map is infinite dimensional. The SVM decision function uses nonzero dual coefficients at support vectors. Feature scales matter, and nonlinear separability need not imply linear separability.',
        'Under the usual finite-branching assumptions BFS is complete and optimal for equal positive costs; DFS stores O(bm) frontier nodes and may follow an infinite branch. UCS is optimal when it returns a goal with positive costs; termination in infinite spaces additionally needs a positive lower bound on costs. A* needs appropriate heuristic conditions; greedy search is not generally optimal.',
        'User-based CF uses similar users. Item-based similarities can be cheaper when there are far fewer items than users. TF-IDF supports content matching. CF has cold-start issues; centering in Pearson correlation can change neighbor rankings relative to cosine.',
        'The exploitation branch is taken with probability 1-epsilon (random exploration can also choose the best action). Q-learning uses an off-policy max target. Bellman optimality maximizes expected return. Small gamma is short-sighted; more exploration is not always better.',
    ],
    'b': [
        'Boolean advanced indexing creates a copy, so changing b does not change a. Column-major flatten gives [1,4,7,2,5,8,3,6,9]. Thus a[1,2]=6, b[0]=99, c[1]=4, and five entries exceed 4.',
        'A left join retains ids 1,2,3. Only id 1 has a missing club; scores sum to 80+90+70=240.',
        'The sigmoid derivative and cross-entropy derivative simplify to p_i-y_i. Averaging gives (1/n) sum (p_i-y_i)x_i.',
        'Increasing k smooths the decision boundary, generally increasing bias and decreasing variance. Distance-based neighbors remain sensitive to scaling.',
        'w_next=(1-2alpha)w. Divergence requires |1-2alpha|>1. At alpha=1.5 the multiplier is -2. At alpha=1 it is -1, so the sequence oscillates without growing.',
        'Left Gini=1-(4/5)^2-(1/5)^2=0.32; right Gini=1-(2/5)^2-(3/5)^2=0.48. Equal weights give 0.40.',
        'Per-class F1 values are 2/3, 2/3, and 0.8. Their arithmetic mean is 0.7111, rounding to 0.71. Averaging precision and recall first is not macro-F1.',
        'A trivial all-negative model gets 99% accuracy. Precision-recall analysis exposes positive-class performance. ROC-AUC is not forbidden, but can hide practical rare-class tradeoffs.',
        'Retained variance=(6+3)/(6+3+1)=9/10=0.90.',
        'For a nonzero x, k(x,x)=-||x||^4<0, impossible for an inner-product kernel. The other options are standard positive-semidefinite kernels.',
        'Using the supplied dual coefficients, w=sum alpha_i*y_i*x_i=(1,1)+(1,1)=(2,2). Source caveat: these coefficients are not the optimum of the two-point canonical hard-margin problem (the listed support equalities cannot both hold); the requested algebraic calculation is still A.',
        'With a finite graph and visited-state checking, greedy search eventually exhausts reachable states if necessary. Its heuristic-only priority does not guarantee the cheapest path or fewer expansions than A*.',
        'The first implication and P yield Q; the second implication then yields R.',
        'X=3 has no larger Y, and Y=1 has no smaller X. Every remaining value has support, giving X={1,2}, Y={2,3}.',
        'Target=4+0.8*5=8. Update=2+0.5*(8-2)=5.',
        'Usual intended selection: A,B,D. Mean imputation shrinks variance relative to the observed nonmissing sample; dropping missing-not-at-random rows can bias results; fit imputation on training data. Source ambiguity: A compares against the unknown complete data, for which variance reduction is not guaranteed. Accept B,D under that literal reading, or A,B,D under the conventional observed-data reading. C and E are false.',
        'Full one-hot encoding (without dropping a reference category) gives k columns. Nominal integer codes imply an artificial order to a linear model. Scaling helps distance-based methods. Trees do not require standardization; target encoding can leak labels.',
        'Intended selection: A,B,C. Logistic regression has a linear feature-space boundary and estimates probabilities. Source caveat: convexity alone does not guarantee gradient-descent convergence; step size matters, and separable unregularized data may have no finite optimum. Accept A,C for the literal unconditional reading of B, or A,B,C with the standard convergence assumptions. Multiclass variants exist; L2 does not always increase training accuracy.',
        'Naive Bayes assumes conditional independence. Additive smoothing avoids zero categorical probabilities, and Gaussian NB uses per-class Gaussian feature models. It supports nonbinary data and may work well despite imperfect independence.',
        'PCA directions are covariance eigenvectors; the first maximizes projected variance. Dropping low-variance directions can remove noise. Scaling affects PCA; using the full orthonormal basis preserves information.',
        'Reserve test data for final evaluation, tune on validation data, and fit preprocessing within training folds. Cross-validation generally stabilizes estimates over a single split, though not a universal variance guarantee. Stratification is particularly useful for classification.',
        'Valid kernels have PSD Gram matrices. Larger C penalizes margin violations more. Integer-degree polynomial kernels on finite-dimensional inputs have finite feature maps. Support vectors may be on the margin or inside it; RBF is not a finite polynomial.',
        'With finite branching and unit costs, iterative deepening combines DFS-like memory and BFS optimality. A more informative admissible heuristic weakly reduces necessary A* expansions under the standard dominance assumptions (consistent heuristics, excluding ties/re-expansion complications). Graph search tracks repeated states. With h(goal)=0, consistency implies admissibility. A fixed depth limit may miss a deeper solution.',
        'Factorization learns user/item vectors. Clicks are implicit positive evidence, while missing clicks need not indicate dislike. Popularity bias is real. Implicit factorization is possible; precision@k is the relevant fraction among the top k recommendations.',
        'A,C,D are unambiguously true; affirming the consequent is invalid. Literally E is also true: a formula true under every assignment is satisfiable, although the precise term is tautology (valid). Accept A,C,D,E for the literal reading or A,C,D if E is interpreted as asking for the defining term. This source ambiguity is teacher-marked.',
    ],
    'c': [
        'B is a view and adds 10 to the first row of A; C is an independent copy. A becomes [[11,12,13],[4,5,6]], with sum 51.',
        'The duplicate right-hand id 3 creates two joined rows. Four rows result; w values are NaN,5,6,7. Their skip-NaN sum is the float 18.0.',
        'Applying the chain rule to sigmoid cross-entropy gives dL/dz=sigma(z)-y, then dL/dw=(sigma(z)-y)x.',
        'Squared distances are 2,10,5,2. The nearest three labels are 0,1,1, so the vote is class 1. The two nearest points tie, so the added claim about 1-NN in D is not guaranteed without a tie-breaking rule.',
        '||w||=sqrt(3^2+4^2)=5. The distance between the two support hyperplanes is 2/5=0.4.',
        'Using the standard convention that minPts includes the point itself, each of the first three points has three points in its epsilon-neighborhood. All are core; (10,10) has no core neighbor and is noise.',
        'Accuracy=950/1000=0.95. Positive recall=TP/(TP+FN)=0/50=0.',
        'B never overestimates, but on S->A it violates consistency: h(S)=6>2+h(A)=5. The other admissible options satisfy the edge inequalities, assuming h(G)=0.',
        'BFS orders by edge count, not accumulated weight. UCS orders by path cost and finds the cheapest path under the usual positive-cost termination assumptions.',
        'After S, A has f=11 and B has f=2. Expanding B generates G with f=3, which is popped before A. The returned cost 3 exceeds the true optimum 2 because h(A) overestimates.',
        'Iterative deepening stores O(bd), no worse than DFS O(bm) since d<=m; it is lower than exponential frontiers in the usual branching regime. It can tie DFS when d=m.',
        'From Q->R and not R, modus tollens yields not Q (and then not P). Only not Q is listed as a consequence.',
        'Not C together with not A or C forces not A; similarly it forces not B. This contradicts A or B, so there are no models.',
        'On the supplied domains, Z has only one remaining value, fewer than X or Y. MRV therefore selects Z before any propagation not specified in the question.',
        'Target=10+0.9*8=17.2. Q_new=4+0.5*(17.2-4)=10.6.',
        'Consistency makes closed-node A* re-expansion unnecessary. A* with h=0 is UCS. IDA* keeps a depth-first path instead of an exponential frontier. Greedy and DFS are not generally optimal.',
        'With finite branching and equal positive costs, BFS and iterative deepening are complete and optimal. UCS pops nondecreasing g. DFS can get trapped on infinite branches and usually uses less memory than BFS.',
        'Classical entailment is monotonic; inconsistency entails false. Resolution is refutation-complete after conversion to clauses. Mere consistency is not entailment, and entailing a disjunction need not entail either disjunct separately.',
        'Arc consistency can propagate through unassigned neighbors and find failures missed by forward checking. Finite-domain chronological backtracking is complete. Forward checking can empty an unassigned neighbor domain. It only checks neighbors, not all unassigned variables; MRV counts remaining values, not constraints.',
        'There are at most d^n full assignments. LCV preserves neighbors choices, and forward checking tests constraints from the latest assignment to unassigned neighbors. Arc consistency has overhead and does not guarantee satisfiability on cyclic graphs.',
        'With no conflicting duplicates, a training point is its own nearest neighbor. L1 promotes sparse coefficients. Standard bagging uses size-n bootstrap samples. More trees do not always reduce bias, and categorical trees need not use one-hot encoding.',
        'B,D,E are true using the chosen linkage distance for dendrogram heights. In a standard DBSCAN run each point receives one label, so A is false if it means simultaneous assignment. A border point may be reachable from two clusters and assigned to either depending on traversal order; accept A,B,D,E if A is read as possible assignment across runs. The elbow need not be unambiguous. This source ambiguity is teacher-marked.',
        'An all-negative predictor can have 99% accuracy and zero positive recall. AUC 0.5 means random-level ranking by this metric, not necessarily identical behavior at every threshold. Macro recall weights classes equally. F1 need not rise with threshold; no positive predictions makes precision undefined (often reported as 0), not 1.',
        'Degree one gives the dot product plus c; smaller gamma broadens RBF influence; valid Gram matrices are PSD. RBF has an infinite expansion, and support-vector counts do not increase monotonically with C.',
        'Content-based methods compare item attributes; user CF uses similar taste profiles; factorization learns both user and item vectors. Pure CF does not require content features and cannot infer personalized preferences for a user with no interactions or other information.',
    ],
}

# Five answers in source order. Mark manually so equivalent code, rounding,
# set order, paths, and the source ambiguities can receive appropriate credit.
WRITTEN = {
    'a': [
        (["to_datetime", "subset=['amount']", "groupby", "sum", "sort_values"], 'Parse dates, retain rows with known amounts, group by region/month, sum amounts, and sort totals descending. The source never specifies the aggregation or exact missing-data subset: sum and amount are a reasonable model answer, not uniquely forced. Accept mean/count or another coherent aggregation with an explained interpretation; dropna() is also defensible. Do not require an unstated business rule.'),
        (['y', 'fit_transform', 'transform', 'fit', 'accuracy_score'], 'Stratify using the labels. Fit the scaler only on training data, reuse it on test data, fit the classifier, and measure test predictions against y_test.'),
        (['0.98', '0.65', '0.92', '0.78', '0.20'], 'Using H(p)=-p log2(p)-(1-p)log2(1-p): parent=0.97987, left=0.65002, right=0.91830. Equal child sizes give conditional entropy 0.78416 and gain 0.19571. Round only at the end.'),
        (['X @ w + b', 'f_wb - y', 'X.T @ err / m', 'np.sum(err) / m', 'w - alpha * compute_gradient(X, y, w, b)[0]'], 'Predictions broadcast b across examples. Multiply residuals by X.T and average for the weight gradient; average residuals for the bias gradient. The source never calls compute_gradient outside the function: the self-contained fifth answer calls it. Accept w-alpha*dj_dw if the gradient is first obtained in the outer scope, but note that the supplied skeleton alone leaves dj_dw local and unavailable. The source asks only for the w update, not a b-update blank.'),
        (['-0.5', '0.38', '0', '-3.5', '0.03'], 'For (1,2), z=2-2-0.5=-0.5 and sigmoid=1/(1+1.649)=0.3775. For (0,3), z=-3.5 and sigmoid=1/(1+33.1)=0.0293. The first probability is below 0.5.'),
        (['1', '1.5', '4.5', '4', 'yes'], 'The first two points join cluster 1 and the last two join cluster 2. Coordinate means give (1,1.5) and (4.5,4). Reassignment with these centers is unchanged, so this is a Lloyd fixed point. Accept no if the student explicitly means a stopping test comparing old and new centers: the centers did move, so that implementation needs a further iteration to confirm convergence.'),
        (['6', '4', 'B', '5', 'S -> B -> G'], 'After S, f(A)=1+5=6 and f(B)=2+2=4. B generates G with g=2+3=5 and h=0, so G is popped before A.'),
        (['25', '-2.5', '0.082', '9', '0.407'], 'Squared distances are 3^2+4^2=25 and 0^2+3^2=9. Exponents are -2.5 and -0.9; exponentiation gives 0.082085 and 0.406570.'),
        (['3', '1,2,3', '1,2', 'failure', '6'], 'A=2 forces B=3; forward checking does not yet propagate from unassigned B to C. Then B=3 excludes 3 from C. B=1 violates A<B. In the original problem there are 3 ordered pairs A<B and two C values for each, so 6 total assignments. Accept 2 for the last blank if explicitly counting extensions after A=2, since the source does not state whether that assignment is reset.'),
        (['2.00', '3.33', '1.50', '0.33', '6.33'], 'Means are x-bar=2 and y-bar=10/3. The slope is 3/2, intercept 1/3, and prediction at 4 is 19/3. The PDF glyph shown as Ƀ is interpreted as y-bar. Keep exact fractions until final rounding.'),
    ],
    'b': [
        ([".str.strip()", "drop_duplicates", "transform", "agg", "sort_values"], 'Strip surrounding title whitespace, deduplicate title/year, use transform to return one imputed rating per row, aggregate mean/count, filter, and sort descending. Other justified title-cleaning chains are acceptable because cleaning is not precisely defined. A genre containing only missing ratings still has a missing median; no fallback is specified.'),
        (['delimiter', 'mean', 'abs', 'ok', 'argsort'], 'Compute column means/stds, select rows whose maximum absolute standardized entry is below 3, and take the final five indices of an ascending argsort. Assume nonconstant finite columns and at least five retained rows, as required by this skeleton. argpartition alone does not guarantee the last selected value is the maximum printed here.'),
        (['3', 'False', '1.0', '5', "'neg_mean_squared_error'"], 'A pipeline refits polynomial/scaling transformations inside each training fold. Degree=3 and cv=5 are specified. False avoids a redundant bias feature when Ridge fits an intercept. Source omissions: no ridge alpha or scoring metric is specified; 1.0 and negative MSE are conventional choices, not uniquely determined. Accept any positive alpha and a coherent negative loss scorer; include_bias=True is also a valid though redundant configuration.'),
        (['0.40', '0.667', '0.333', '0.056', 'spam'], 'Bernoulli NB: spam prior=4/10; P(offer|spam)=(3+1)/(4+2)=2/3; P(meeting|spam)=(1+1)/6=1/3. Ham score=(6/10)*(2/8)*(1-5/8)=0.05625; spam score=(4/10)*(4/6)*(1-2/6)=0.17778, so spam wins. Accept 0.06 when rounding the score to two decimals, as permitted.'),
        (['7', '8', '5.56', '1.44', '0.79'], 'Trace=4+3=7; determinant=12-4=8. Eigenvalues=(7 +/- sqrt(17))/2=5.56155 and 1.43845. The leading variance fraction is 5.56155/7=0.794508; accept 0.795 or 79.45% as equivalent precision.'),
        (['S', 'B', 'A', '6', 'S -> A -> C -> G'], 'UCS pops S(0), B(1), A(3), C(4), D(5), G(6). Both S-A-C-G and S-B-D-G cost 6; no tie policy for equal-cost goal parents is specified. Accept either optimal path.'),
        (['¬P ∨ Q', '¬Q ∨ R', 'P', '¬R', 'empty'], 'CNF of the implications gives the first two clauses. Negating P->R gives P and not R. Resolve P with not P or Q to get Q, then R, then the empty clause with not R.'),
        (['4', '1', '1,2,3', '18', '3,4'], 'X=4 has no greater Y; Y=1 has no smaller X. There are 6 pairs X<Y and 3 choices of Z not equal to Y, giving 18 assignments. Assigning X=2 leaves Y={3,4}.'),
        (['1', '9', '2', '16', '6'], 'Dot products are 3-2=1 and 2+0=2; add 2 and square. The full inhomogeneous degree-two map in two variables has 1 constant, 2 linear, and 3 quadratic coordinates.'),
        (['-3.67', '-1.67', '0.37', '0.17', '0.66'], 'Initial residuals are -1,-2,-2. Gradients are -11/3 and -5/3. Exact updates are w=11/30, b=1/6; predictions are 8/15,9/10,19/15. New MSE=1769/2700=0.655185. This is MSE, not the half-MSE objective. Using rounded parameters 0.37 and 0.17 gives MSE 0.639367, rounding to 0.64; accept that if intermediate rounding is shown.'),
    ],
    'c': [
        (['to_datetime', "subset=['ts', 'sensor']", 'sort_values', 'resample', "groupby(level=0).ffill"], 'Parse timestamps, remove duplicate sensor/timestamp keys, sort time, then resample each sensor to daily means. Group the final MultiIndex series by sensor before forward filling to prevent one sensor leaking into another. Source does not define duplicate identity: accept a justified alternative subset. Plain ffill is the likely intended fifth answer but can fill a leading missing value from a different sensor; accept it only under the explicit assumption that each sensor starts with a valid daily mean.'),
        (['0.47', '0.00', '0.30', '0.17', '3.5'], 'Parent Gini=1-(3/8)^2-(5/8)^2=0.46875. At 3.5 both children are pure. At 5.5 the left has 3 zeros/2 ones (Gini 0.48) and right is pure, so weighted Gini=(5/8)*0.48=0.30; gain=0.16875.'),
        (['0.25', '0.17', '0.08', '0.67', 'spam'], 'Using multinomial NB, each class has 6 tokens and vocabulary size 6, so the smoothed denominator is 12. P(buy|spam)=3/12, P(now|spam)=2/12, P(buy|ham)=1/12. P(now|ham)=3/12 and equal priors give posterior 2/3. Source does not name the NB variant: accept a consistent Bernoulli interpretation too (0.60,0.40,0.20,0.73,spam when all six presence/absence features are used). Do not mix Bernoulli and multinomial denominators.'),
        (['-1.3', '0', '[1.5, 1.0]', '1.2', '4.7'], 'Initial score=0.5-2+0.2=-1.3, so prediction 0 is mistaken. Apply the stated positive-label update: w=[0.5,-1]+[1,2], b=0.2+1. New score=1.5+2+1.2=4.7. The supplied rule is evaluated only on this y=1 example.'),
        (['A', '3', 'B', '5', 'S -> A -> B -> G'], 'A is cheapest at cost 2. Its edge to B improves B to 3, then B improves G to 5. UCS pops that goal before any more expensive path.'),
        (['S, A, B, D, C, G', 'S, A, D, G', '5', '3', 'DFS'], 'BFS visits both depth-one nodes before D and C, then pops G. DFS follows S-A-D-G. Counts in (c,d) exclude G because the wording says before popping G; the order lists include G. Duplicate-state handling does not affect these prefixes.'),
        (['8', '4', 'yes', '3', '0'], 'Valid (A,B,C) assignments are 000,001,011,111. Thus 4 of 2^3 assignments satisfy KB; 3 have not A, none have B and not C. The implication A->C holds in every model.'),
        (['G,B', 'Y', 'R,B', '4', '12'], 'After X=R, Y loses R and is the smallest remaining domain. After Y=G, Z loses G. With X fixed there are 2 choices for Y and 2 for Z, giving 4; across all three X values there are 12.'),
        (['320', '505', '0.95', '0.945', 'A'], 'Costs are 20+10*30=320 and 5+10*50=505. Accuracies are (80+870)/1000=0.95 and (60+885)/1000=0.945. A is better under the supplied cost model despite having more false positives.'),
        (['2', '9', '6', '2.828', '36'], 'x dot z=2; kernel=(2+1)^2=9. The given map has 6 coordinates. Its cross term is sqrt(2)*1*2=2.828. Self-kernel=(1^2+2^2+1)^2=36.'),
    ],
}

# Source items with no uniquely defensible exact select-all key.
AMBIGUOUS = {'a': set(), 'b': {16, 18, 25}, 'c': {22}}
PYTHON_QUESTIONS = {'a': {1, 2, 26, 27, 29}, 'b': {1, 2, 26, 27, 28}, 'c': {1, 2, 26}}


def extract(path, paper):
    questions = []
    current = None
    code_open = False

    def close_code():
        nonlocal code_open
        if code_open:
            current['lines'].append('```')
            code_open = False

    with pdfplumber.open(path) as pdf:
        for page in pdf.pages[1:]:
            for line in page.extract_text_lines():
                text = line['text'].strip()
                if text.startswith(('2026-27 CAIO', 'Page ')):
                    continue
                match = re.fullmatch(r'Question (\d+)\s+(.+)', text)
                if match:
                    close_code()
                    current = {'number': int(match[1]), 'section': match[2], 'lines': [], 'options': []}
                    questions.append(current)
                    continue
                assert current is not None, text
                points = re.fullmatch(r'(\d+) Points', text)
                if points:
                    current['points'] = int(points[1])
                    continue
                # Physical answer lines become one labeled-response instruction.
                if text.startswith('Write your answer for each blank below:') or re.fullmatch(r'\([a-e]\)\s+_+', text):
                    close_code()
                    continue
                is_code = all('Mono' in c['fontname'] for c in line['chars'] if c['text'].strip())
                if is_code and not current['options']:
                    if not code_open:
                        language = 'python' if current['number'] in PYTHON_QUESTIONS[paper] else 'text'
                        current['lines'].extend(['', '```' + language])
                        code_open = True
                    width = next(c['adv'] for c in line['chars'] if c['text'].strip())
                    indent = max(0, round((line['x0'] - 81.95) / width))
                    current['lines'].append(' ' * indent + text)
                    continue
                close_code()
                option = re.match(r'^([A-E])\.\s*(.+)', text)
                if option and current['number'] <= 25:
                    current['options'].append(option[1] + '. ' + option[2])
                elif current['options']:
                    current['options'][-1] += ' ' + text
                else:
                    current['lines'].append(text)
    close_code()
    assert [q['number'] for q in questions] == list(range(1, 36))
    return questions


def build(paper, path):
    exam_id = 'caio_2026_' + paper
    questions = []
    for raw in extract(path, paper):
        number = raw['number']
        kind = 'multiple-choice' if number <= 15 else 'multi-select' if number <= 25 else 'text-input'
        text = '\n'.join(raw['lines']).strip()
        if paper == 'b' and number == 26:
            # A long PDF line is indented by layout, not Python scope.
            text = text.replace("        df['rating'] = df.groupby('genre')['rating'].______(lambda s:\ns.fillna(s.median()))",
                                "df['rating'] = df.groupby('genre')['rating'].______(\n    lambda s: s.fillna(s.median()))")
        manual = number >= 26 or number in AMBIGUOUS[paper]
        if number <= 25:
            assert len(raw['options']) == 5, (paper, number, raw['options'])
            key = KEYS[paper][number-1]
            answer = raw['options'][ord(key)-65] if number <= 15 else json.dumps(list(key))
            explanation = REASONS[paper][number-1]
            if manual:
                text += '\n\n**Platform note:** This item has ambiguous source wording and will be teacher-marked. Select the options supported by your reading.'
                explanation += '\n\nMarking: award 2 points for either defensible complete selection described above, otherwise 0. This preserves the source all-or-nothing scoring rule.'
        else:
            blanks, explanation = WRITTEN[paper][number-26]
            assert len(blanks) == 5
            answer = '\n'.join(f'({chr(97+i)}) `{value}`' for i, value in enumerate(blanks))
            text += '\n\nWrite five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.'
            explanation += '\n\nPlatform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.'
        questions.append(dict(id=f'{exam_id}_q{number}', number=number, points=raw['points'],
                              text=text, type=kind, options=raw['options'], correctAnswer=answer,
                              explanation=explanation, grading='manual' if manual else 'automatic', section=raw['section']))
    assert sum(q['points'] for q in questions) == 100
    return dict(id=exam_id, name=f'2026-27 CAIO National Qualifier - Paper {paper.upper()}',
                year=2026, competition='CAIO', durationMinutes=90, source=path.name,
                description='Part 1 - AI Fundamentals Challenge. 35 questions, 100 marks. Independently prepared solutions.',
                instructions='Answer all 35 questions. Q1-15: choose one answer (2 marks each). Q16-25: select ALL correct options; full marks only for the complete correct set (2 marks each). Q26-35: five blanks per question (5 marks each); submit labeled answers (a)-(e) in the text box for teacher marking. A non-programmable calculator may be used. Ambiguous source questions are identified and teacher-marked. The 90-minute timer is the existing CAIO platform practice setting; these PDFs specify no duration. Solutions and the 1-point-per-blank practice rubric are independently prepared, not an official answer key.',
                questions=questions)


def markdown(exam, solved):
    parts = [f"# {exam['name']}", f"**Year:** {exam['year']}", exam['description'], f"Source: {exam['source']}", exam['instructions']]
    for q in exam['questions']:
        parts.extend([f"## Question {q['number']} ({q['points']} points)", f"**Section:** {q['section']}\n**Type:** {q['type']}\n**Grading:** {q['grading']}", q['text']])
        if q['options']:
            parts.append('\n'.join('- [ ] ' + option for option in q['options']))
        if solved:
            parts.extend(['### Answer & Explanation', '* **Correct Answer:** ' + q['correctAnswer'], '* **Explanation:**\n' + q['explanation']])
        parts.append('---')
    return '\n\n'.join(parts) + '\n'


def main():
    source = Path(sys.argv[1])
    output = ROOT / 'content' / 'caio-2026'
    output.mkdir(parents=True, exist_ok=True)
    exams = []
    manifest = []
    for paper in 'abc':
        path = source / f'2026-27-caio-national-qualifier-practical-competition-{paper}.pdf'
        exam = build(paper, path)
        exams.append(exam)
        manifest.append({'paper': paper.upper(), 'file': path.name, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()})
        for solved, suffix in [(False, 'questions'), (True, 'solutions')]:
            (output / f'paper-{paper}-{suffix}.md').write_text(markdown(exam, solved), encoding='utf-8')
    (output / 'sources.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
    (ROOT / 'src/data/caio-2026-exams.json').write_text(json.dumps(exams, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('Imported 3 papers, 105 questions, 300 marks. Existing exam files are untouched.')


if __name__ == '__main__':
    main()
