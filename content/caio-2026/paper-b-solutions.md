# 2026-27 CAIO National Qualifier - Paper B

**Year:** 2026

Part 1 - AI Fundamentals Challenge. 35 questions, 100 marks. Independently prepared solutions.

Source: 2026-27-caio-national-qualifier-practical-competition-b.pdf

Answer all 35 questions. Q1-15: choose one answer (2 marks each). Q16-25: select ALL correct options; full marks only for the complete correct set (2 marks each). Q26-35: five blanks per question (5 marks each); submit labeled answers (a)-(e) in the text box for teacher marking. A non-programmable calculator may be used. Ambiguous source questions are identified and teacher-marked. The 90-minute timer is the existing CAIO platform practice setting; these PDFs specify no duration. Solutions and the 1-point-per-blank practice rubric are independently prepared, not an official answer key.

## Question 1 (2 points)

**Section:** Data Preparation
**Type:** multiple-choice
**Grading:** automatic

Consider the following Python code:

```python
import numpy as np
a = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
mask = a > 4
b = a[mask]
b[0] = 99
c = a.flatten(order='F')
print(a[1, 2], b[0], c[1], mask.sum())
```
What is the printed output?

- [ ] A. 99 99 4 5
- [ ] B. 6 99 5 5
- [ ] C. 6 99 4 5
- [ ] D. 6 5 4 5
- [ ] E. 99 99 5 5

### Answer & Explanation

* **Correct Answer:** C. 6 99 4 5

* **Explanation:**
Boolean advanced indexing creates a copy, so changing b does not change a. Column-major flatten gives [1,4,7,2,5,8,3,6,9]. Thus a[1,2]=6, b[0]=99, c[1]=4, and five entries exceed 4.

---

## Question 2 (2 points)

**Section:** Data Preparation
**Type:** multiple-choice
**Grading:** automatic

Consider the following Python code:

```python
import pandas as pd
left = pd.DataFrame({'id': [1, 2, 3], 'score': [80, 90, 70]})
right = pd.DataFrame({'id': [2, 3, 4], 'club': ['A', 'B', 'C']})
m = left.merge(right, on='id', how='left')
print(len(m), m['club'].isna().sum(), int(m['score'].sum()))
```
What is the printed output?

- [ ] A. 3 1 240
- [ ] B. 2 0 170
- [ ] C. 4 1 240
- [ ] D. 3 0 240
- [ ] E. 3 1 170

### Answer & Explanation

* **Correct Answer:** A. 3 1 240

* **Explanation:**
A left join retains ids 1,2,3. Only id 1 has a missing club; scores sum to 80+90+70=240.

---

## Question 3 (2 points)

**Section:** Supervised Learning
**Type:** multiple-choice
**Grading:** automatic

For binary logistic regression the cross-entropy loss is
L(w, b) = −(1/n) Σᵢ [ yᵢ log pᵢ + (1−yᵢ) log(1−pᵢ) ], pᵢ = σ(w·xᵢ + b)
The gradient of L with respect to w is:

- [ ] A. −(1/n)Σᵢ (pᵢ−yᵢ)xᵢ
- [ ] B. (1/n)Σᵢ (pᵢ−yᵢ)xᵢ
- [ ] C. (1/n)Σᵢ (yᵢ−pᵢ)
- [ ] D. (2/n)Σᵢ (pᵢ−yᵢ)xᵢ
- [ ] E. (1/n)Σᵢ pᵢ(1−pᵢ)xᵢ

### Answer & Explanation

* **Correct Answer:** B. (1/n)Σᵢ (pᵢ−yᵢ)xᵢ

* **Explanation:**
The sigmoid derivative and cross-entropy derivative simplify to p_i-y_i. Averaging gives (1/n) sum (p_i-y_i)x_i.

---

## Question 4 (2 points)

**Section:** Supervised Learning
**Type:** multiple-choice
**Grading:** automatic

You train k-nearest-neighbors classifiers on the same dataset with different values of k.
Which statement is TRUE?

- [ ] A. k = 1 gives the smoothest decision boundary.
- [ ] B. A larger k always improves test accuracy.
- [ ] C. kNN with k = n (all training points) has the lowest bias.
- [ ] D. Increasing k typically increases bias and decreases variance.
- [ ] E. kNN needs no feature scaling because Euclidean distance is scale-invariant.

### Answer & Explanation

* **Correct Answer:** D. Increasing k typically increases bias and decreases variance.

* **Explanation:**
Increasing k smooths the decision boundary, generally increasing bias and decreasing variance. Distance-based neighbors remain sensitive to scaling.

---

## Question 5 (2 points)

**Section:** Supervised Learning
**Type:** multiple-choice
**Grading:** automatic

Batch gradient descent minimizes J(w) = w² from w₀ = 4 with the update w := w −
α·J′(w).
For which learning rate α does the sequence diverge (|w| → ∞)?

- [ ] A. 0.1
- [ ] B. 0.5
- [ ] C. 1.5
- [ ] D. 0.9
- [ ] E. 1.0

### Answer & Explanation

* **Correct Answer:** C. 1.5

* **Explanation:**
w_next=(1-2alpha)w. Divergence requires |1-2alpha|>1. At alpha=1.5 the multiplier is -2. At alpha=1 it is -1, so the sequence oscillates without growing.

---

## Question 6 (2 points)

**Section:** Supervised Learning
**Type:** multiple-choice
**Grading:** automatic

A decision-tree node holds 10 samples (6 of class A, 4 of class B). A candidate split
sends 5 samples left (4 A, 1 B) and 5 right (2 A, 3 B).
The weighted Gini impurity after the split is:

- [ ] A. 0.48
- [ ] B. 0.40
- [ ] C. 0.32
- [ ] D. 0.50
- [ ] E. 0.44

### Answer & Explanation

* **Correct Answer:** B. 0.40

* **Explanation:**
Left Gini=1-(4/5)^2-(1/5)^2=0.32; right Gini=1-(2/5)^2-(3/5)^2=0.48. Equal weights give 0.40.

---

## Question 7 (2 points)

**Section:** Evaluation of ML Models
**Type:** multiple-choice
**Grading:** automatic

A 3-class classifier has per-class precision and recall: class 1: P=1.00, R=0.50; class 2:
P=0.50, R=1.00; class 3: P=0.80, R=0.80.
The macro-averaged F1 score is:

- [ ] A. 0.67
- [ ] B. 0.80
- [ ] C. 0.73
- [ ] D. 0.71
- [ ] E. 0.77

### Answer & Explanation

* **Correct Answer:** D. 0.71

* **Explanation:**
Per-class F1 values are 2/3, 2/3, and 0.8. Their arithmetic mean is 0.7111, rounding to 0.71. Averaging precision and recall first is not macro-F1.

---

## Question 8 (2 points)

**Section:** Evaluation of ML Models
**Type:** multiple-choice
**Grading:** automatic

You are building a fraud-detection model on a dataset with 1% fraudulent transactions.
Which evaluation choice is most appropriate?

- [ ] A. Accuracy, because it is the simplest and most intuitive metric.
- [ ] B. Precision–recall analysis (e.g., F1 or PR-AUC), because accuracy can be misleading on imbalanced data.
- [ ] C. Training accuracy, because it reflects the model’s full capacity.
- [ ] D. ROC-AUC must never be used on imbalanced data.
- [ ] E. Mean squared error computed on the predicted class labels.

### Answer & Explanation

* **Correct Answer:** B. Precision–recall analysis (e.g., F1 or PR-AUC), because accuracy can be misleading on imbalanced data.

* **Explanation:**
A trivial all-negative model gets 99% accuracy. Precision-recall analysis exposes positive-class performance. ROC-AUC is not forbidden, but can hide practical rare-class tradeoffs.

---

## Question 9 (2 points)

**Section:** Unsupervised Learning
**Type:** multiple-choice
**Grading:** automatic

PCA is applied to centered data whose covariance matrix has eigenvalues 6, 3, 1.
What fraction of the total variance is retained by projecting onto the first two
principal components?

- [ ] A. 0.60
- [ ] B. 0.30
- [ ] C. 0.90
- [ ] D. 1.00
- [ ] E. 0.67

### Answer & Explanation

* **Correct Answer:** C. 0.90

* **Explanation:**
Retained variance=(6+3)/(6+3+1)=9/10=0.90.

---

## Question 10 (2 points)

**Section:** Kernel Methods
**Type:** multiple-choice
**Grading:** automatic

A kernel is valid (Mercer) if it equals an inner product ⟨φ(x), φ(z)⟩ for some feature map
φ.
Which of the following is NOT a valid Mercer kernel?

- [ ] A. k(x,z) = (x·z + 2)²
- [ ] B. k(x,z) = exp(−2‖x − z‖²)
- [ ] C. k(x,z) = (x·z)³
- [ ] D. k(x,z) = −(x·z)²
- [ ] E. k(x,z) = x·z

### Answer & Explanation

* **Correct Answer:** D. k(x,z) = −(x·z)²

* **Explanation:**
For a nonzero x, k(x,x)=-||x||^4<0, impossible for an inner-product kernel. The other options are standard positive-semidefinite kernels.

---

## Question 11 (2 points)

**Section:** Kernel Methods
**Type:** multiple-choice
**Grading:** automatic

A hard-margin SVM has support vectors x₁=(1,1) with y₁=+1, α₁=1 and x₂=(−1,−1) with
y₂=−1, α₂=1.
The weight vector w of the SVM equals:

- [ ] A. (2, 2)
- [ ] B. (0, 0)
- [ ] C. (1, 1)
- [ ] D. (2, −2)
- [ ] E. (1, −1)

### Answer & Explanation

* **Correct Answer:** A. (2, 2)

* **Explanation:**
Using the supplied dual coefficients, w=sum alpha_i*y_i*x_i=(1,1)+(1,1)=(2,2). Source caveat: these coefficients are not the optimum of the two-point canonical hard-margin problem (the listed support equalities cannot both hold); the requested algebraic calculation is still A.

---

## Question 12 (2 points)

**Section:** AI Search
**Type:** multiple-choice
**Grading:** automatic

Greedy best-first search expands nodes in order of increasing heuristic value h(n),
ignoring the path cost so far.
Which statement is TRUE?

- [ ] A. Greedy best-first search always finds the optimal path.
- [ ] B. Greedy best-first search is optimal whenever the heuristic is admissible.
- [ ] C. A* with an admissible but inconsistent heuristic never re-expands a node.
- [ ] D. Greedy best-first search always expands fewer nodes than A* with the same heuristic.
- [ ] E. On a finite graph, greedy best-first search with a closed (visited) set is complete, though not optimal.

### Answer & Explanation

* **Correct Answer:** E. On a finite graph, greedy best-first search with a closed (visited) set is complete, though not optimal.

* **Explanation:**
With a finite graph and visited-state checking, greedy search eventually exhausts reachable states if necessary. Its heuristic-only priority does not guarantee the cheapest path or fewer expansions than A*.

---

## Question 13 (2 points)

**Section:** Logical Reasoning
**Type:** multiple-choice
**Grading:** automatic

Knowledge base KB = { ¬P ∨ Q, ¬Q ∨ R, P }.
Which formula is logically entailed by KB?

- [ ] A. ¬R
- [ ] B. R
- [ ] C. ¬P
- [ ] D. Q ∧ ¬R
- [ ] E. ¬Q

### Answer & Explanation

* **Correct Answer:** B. R

* **Explanation:**
The first implication and P yield Q; the second implication then yields R.

---

## Question 14 (2 points)

**Section:** Constraint Satisfaction Problems
**Type:** multiple-choice
**Grading:** automatic

Variables X, Y with domains D(X) = {1, 2, 3}, D(Y) = {1, 2, 3} and a single constraint X
< Y.
After enforcing arc consistency, the domains are:

- [ ] A. D(X) = {1, 2, 3}, D(Y) = {1, 2, 3}
- [ ] B. D(X) = {1, 2}, D(Y) = {1, 2, 3}
- [ ] C. D(X) = {1, 2}, D(Y) = {2, 3}
- [ ] D. D(X) = {1}, D(Y) = {3}
- [ ] E. D(X) = {2, 3}, D(Y) = {1, 2}

### Answer & Explanation

* **Correct Answer:** C. D(X) = {1, 2}, D(Y) = {2, 3}

* **Explanation:**
X=3 has no larger Y, and Y=1 has no smaller X. Every remaining value has support, giving X={1,2}, Y={2,3}.

---

## Question 15 (2 points)

**Section:** Reinforcement Learning
**Type:** multiple-choice
**Grading:** automatic

An agent in state s takes action a, receives reward r = 4, and moves to s′. Currently
Q(s,a) = 2. In s′, Q(s′,a₁)=1, Q(s′,a₂)=5, Q(s′,a₃)=3. Learning rate α = 0.5, discount γ =
0.8.
After one Q-learning update, Q(s,a) becomes:

- [ ] A. 5.0
- [ ] B. 5.5
- [ ] C. 4.2
- [ ] D. 8.0
- [ ] E. 3.0

### Answer & Explanation

* **Correct Answer:** A. 5.0

* **Explanation:**
Target=4+0.8*5=8. Update=2+0.5*(8-2)=5.

---

## Question 16 (2 points)

**Section:** Data Preparation
**Type:** multi-select
**Grading:** manual

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about handling missing data are TRUE?

**Platform note:** This item has ambiguous source wording and will be teacher-marked. Select the options supported by your reading.

- [ ] A. Filling missing values with the column mean reduces that column’s variance compared with the complete data.
- [ ] B. Dropping every row that contains a missing value can bias results if the missingness depends on unobserved values.
- [ ] C. Forward-fill is always the best imputation strategy for time-series data.
- [ ] D. Imputation statistics (e.g., the mean) should be computed on the training set only, then applied to the test set.
- [ ] E. A missing-value indicator column can never help a model.

### Answer & Explanation

* **Correct Answer:** ["A", "B", "D"]

* **Explanation:**
Usual intended selection: A,B,D. Mean imputation shrinks variance relative to the observed nonmissing sample; dropping missing-not-at-random rows can bias results; fit imputation on training data. Source ambiguity: A compares against the unknown complete data, for which variance reduction is not guaranteed. Accept B,D under that literal reading, or A,B,D under the conventional observed-data reading. C and E are false.

Marking: award 2 points for either defensible complete selection described above, otherwise 0. This preserves the source all-or-nothing scoring rule.

---

## Question 17 (2 points)

**Section:** Data Preparation
**Type:** multi-select
**Grading:** automatic

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about feature encoding and scaling are TRUE?

- [ ] A. One-hot encoding a categorical feature with k levels creates k binary columns.
- [ ] B. Label-encoding (0, 1, 2, …) a nominal feature like “color” can mislead a linear model into assuming an ordering.
- [ ] C. Standardization (zero mean, unit variance) is required before training a decision tree.
- [ ] D. Min–max scaling to [0, 1] keeps kNN and RBF-kernel SVM from being dominated by large-range features.
- [ ] E. Target encoding never causes leakage because it only uses the target column.

### Answer & Explanation

* **Correct Answer:** ["A", "B", "D"]

* **Explanation:**
Full one-hot encoding (without dropping a reference category) gives k columns. Nominal integer codes imply an artificial order to a linear model. Scaling helps distance-based methods. Trees do not require standardization; target encoding can leak labels.

---

## Question 18 (2 points)

**Section:** Supervised Learning
**Type:** multi-select
**Grading:** manual

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about logistic regression are TRUE?

**Platform note:** This item has ambiguous source wording and will be teacher-marked. Select the options supported by your reading.

- [ ] A. The decision boundary of binary logistic regression is linear in the feature space.
- [ ] B. The cross-entropy loss for logistic regression is convex, so gradient descent converges to the global optimum.
- [ ] C. Logistic regression outputs can be interpreted as estimated class probabilities.
- [ ] D. Logistic regression cannot handle more than two classes.
- [ ] E. Adding L2 regularization always increases training accuracy.

### Answer & Explanation

* **Correct Answer:** ["A", "B", "C"]

* **Explanation:**
Intended selection: A,B,C. Logistic regression has a linear feature-space boundary and estimates probabilities. Source caveat: convexity alone does not guarantee gradient-descent convergence; step size matters, and separable unregularized data may have no finite optimum. Accept A,C for the literal unconditional reading of B, or A,B,C with the standard convergence assumptions. Multiclass variants exist; L2 does not always increase training accuracy.

Marking: award 2 points for either defensible complete selection described above, otherwise 0. This preserves the source all-or-nothing scoring rule.

---

## Question 19 (2 points)

**Section:** Supervised Learning
**Type:** multi-select
**Grading:** automatic

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about Naive Bayes are TRUE?

- [ ] A. Naive Bayes assumes the features are conditionally independent given the class.
- [ ] B. Laplace (add-α) smoothing prevents zero probabilities for unseen feature–class combinations.
- [ ] C. Gaussian Naive Bayes models each continuous feature with a Gaussian per class.
- [ ] D. Naive Bayes can only be used with binary features.
- [ ] E. Violating the independence assumption always makes Naive Bayes worse than logistic regression.

### Answer & Explanation

* **Correct Answer:** ["A", "B", "C"]

* **Explanation:**
Naive Bayes assumes conditional independence. Additive smoothing avoids zero categorical probabilities, and Gaussian NB uses per-class Gaussian feature models. It supports nonbinary data and may work well despite imperfect independence.

---

## Question 20 (2 points)

**Section:** Unsupervised Learning
**Type:** multi-select
**Grading:** automatic

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about PCA are TRUE?

- [ ] A. Principal components are eigenvectors of the covariance matrix, ordered by decreasing eigenvalue.
- [ ] B. The first principal component is the direction of maximum variance in the data.
- [ ] C. PCA is unaffected by the scale of the features.
- [ ] D. Projecting onto all principal components loses information.
- [ ] E. PCA can denoise data by dropping low-variance components.

### Answer & Explanation

* **Correct Answer:** ["A", "B", "E"]

* **Explanation:**
PCA directions are covariance eigenvectors; the first maximizes projected variance. Dropping low-variance directions can remove noise. Scaling affects PCA; using the full orthonormal basis preserves information.

---

## Question 21 (2 points)

**Section:** Evaluation of ML Models
**Type:** multi-select
**Grading:** automatic

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about model evaluation methodology are TRUE?

- [ ] A. The test set should be used only once, for the final performance estimate.
- [ ] B. Hyperparameters should be tuned on the validation set, not the test set.
- [ ] C. k-fold cross-validation reduces the variance of the performance estimate compared with a single train/validation split.
- [ ] D. Stratified k-fold is only useful for regression problems.
- [ ] E. Computing preprocessing statistics (e.g., the scaler mean) on the full dataset before splitting is harmless.

### Answer & Explanation

* **Correct Answer:** ["A", "B", "C"]

* **Explanation:**
Reserve test data for final evaluation, tune on validation data, and fit preprocessing within training folds. Cross-validation generally stabilizes estimates over a single split, though not a universal variance guarantee. Stratification is particularly useful for classification.

---

## Question 22 (2 points)

**Section:** Kernel Methods
**Type:** multi-select
**Grading:** automatic

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about SVMs and kernels are TRUE?

- [ ] A. The kernel (Gram) matrix of a valid kernel is always positive semidefinite.
- [ ] B. In the soft-margin SVM, a larger C penalizes margin violations more heavily.
- [ ] C. The polynomial kernel (x·z + c)^d corresponds to a finite-dimensional feature space.
- [ ] D. Support vectors are exactly the training points lying strictly inside the margin.
- [ ] E. The RBF kernel can be written as a finite polynomial in the input features.

### Answer & Explanation

* **Correct Answer:** ["A", "B", "C"]

* **Explanation:**
Valid kernels have PSD Gram matrices. Larger C penalizes margin violations more. Integer-degree polynomial kernels on finite-dimensional inputs have finite feature maps. Support vectors may be on the margin or inside it; RBF is not a finite polynomial.

---

## Question 23 (2 points)

**Section:** AI Search
**Type:** multi-select
**Grading:** automatic

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about search are TRUE?

- [ ] A. Iterative deepening DFS combines the memory efficiency of DFS with the optimality (for unit step costs) of BFS.
- [ ] B. If h₁(n) ≤ h₂(n) ≤ h*(n) for all n, A* with h₂ expands no more nodes than A* with h₁ (up to tie-breaking).
- [ ] C. Tree search can revisit the same state many times, while graph search avoids this with a closed set.
- [ ] D. A consistent heuristic can overestimate the true cost to the goal.
- [ ] E. Depth-limited search is complete in infinite state spaces.

### Answer & Explanation

* **Correct Answer:** ["A", "B", "C"]

* **Explanation:**
With finite branching and unit costs, iterative deepening combines DFS-like memory and BFS optimality. A more informative admissible heuristic weakly reduces necessary A* expansions under the standard dominance assumptions (consistent heuristics, excluding ties/re-expansion complications). Graph search tracks repeated states. With h(goal)=0, consistency implies admissibility. A fixed depth limit may miss a deeper solution.

---

## Question 24 (2 points)

**Section:** Recommender Systems
**Type:** multi-select
**Grading:** automatic

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about recommender systems are TRUE?

- [ ] A. Matrix factorization learns latent user and item vectors whose dot product predicts ratings.
- [ ] B. Implicit feedback (clicks, views) can train a recommender, but it does not directly reveal negative preference.
- [ ] C. Popularity bias can cause a recommender to over-recommend already-popular items.
- [ ] D. Matrix factorization requires explicit star ratings and cannot use implicit feedback.
- [ ] E. Precision@k counts how many relevant items appear anywhere in the full catalog.

### Answer & Explanation

* **Correct Answer:** ["A", "B", "C"]

* **Explanation:**
Factorization learns user/item vectors. Clicks are implicit positive evidence, while missing clicks need not indicate dislike. Popularity bias is real. Implicit factorization is possible; precision@k is the relevant fraction among the top k recommendations.

---

## Question 25 (2 points)

**Section:** Logical Reasoning
**Type:** multi-select
**Grading:** manual

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about propositional logic are TRUE?

**Platform note:** This item has ambiguous source wording and will be teacher-marked. Select the options supported by your reading.

- [ ] A. Modus ponens: from P → Q and P, infer Q.
- [ ] B. Affirming the consequent — from P → Q and Q, infer P — is a valid inference rule.
- [ ] C. The contrapositive ¬Q → ¬P is logically equivalent to P → Q.
- [ ] D. De Morgan’s law: ¬(P ∧ Q) is equivalent to ¬P ∨ ¬Q.
- [ ] E. A formula that is true under every assignment is called satisfiable.

### Answer & Explanation

* **Correct Answer:** ["A", "C", "D", "E"]

* **Explanation:**
A,C,D are unambiguously true; affirming the consequent is invalid. Literally E is also true: a formula true under every assignment is satisfiable, although the precise term is tautology (valid). Accept A,C,D,E for the literal reading or A,C,D if E is interpreted as asking for the defining term. This source ambiguity is teacher-marked.

Marking: award 2 points for either defensible complete selection described above, otherwise 0. This preserves the source all-or-nothing scoring rule.

---

## Question 26 (5 points)

**Section:** Data Preparation
**Type:** text-input
**Grading:** manual

Movie Ratings Pipeline (fill in the 5 blanks)
movies.csv columns: title, year, genre, rating (float, may be NaN).
Clean the titles, drop duplicate (title, year) rows, fill missing ratings with the genre
median, then rank genres with at least 10 movies by mean rating.

```python
import pandas as pd
df = pd.read_csv('movies.csv')
df['title'] = df['title']______
df = df.______(subset=['title', 'year'], keep='first')
df['rating'] = df.groupby('genre')['rating'].______(
    lambda s: s.fillna(s.median()))
g = df.groupby('genre')['rating'].______(['mean', 'count'])
g = g[g['count'] >= 10].______('mean', ascending=False)
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `.str.strip()`
(b) `drop_duplicates`
(c) `transform`
(d) `agg`
(e) `sort_values`

* **Explanation:**
Strip surrounding title whitespace, deduplicate title/year, use transform to return one imputed rating per row, aggregate mean/count, filter, and sort descending. Other justified title-cleaning chains are acceptable because cleaning is not precisely defined. A genre containing only missing ratings still has a missing median; no fallback is specified.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 27 (5 points)

**Section:** Data Preparation
**Type:** text-input
**Grading:** manual

Outlier Removal with NumPy (fill in the 5 blanks)
Standardize the columns of a numeric CSV, drop rows containing any |z| ≥ 3 outlier,
then find the 5 largest values in column 0.

```python
import numpy as np
X = np.loadtxt('data.csv', ______=',')
mu = X.______(axis=0)
sd = X.std(axis=0)
Z = (X - mu) / sd
ok = np.______(Z).max(axis=1) < 3
clean = X[______]
k = 5
idx = np.______(clean[:, 0])[-k:]
print(round(float(clean[idx][-1, 0]), 3), len(clean))
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `delimiter`
(b) `mean`
(c) `abs`
(d) `ok`
(e) `argsort`

* **Explanation:**
Compute column means/stds, select rows whose maximum absolute standardized entry is below 3, and take the final five indices of an ascending argsort. Assume nonconstant finite columns and at least five retained rows, as required by this skeleton. argpartition alone does not guarantee the last selected value is the maximum printed here.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 28 (5 points)

**Section:** Supervised Learning
**Type:** text-input
**Grading:** manual

Polynomial Ridge with Cross-Validation (fill in the 5 blanks)
Fit a degree-3 polynomial ridge regression with 5-fold cross-validation. X, y are already
loaded.

```python
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.linear_model import Ridge
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import cross_val_score
model = make_pipeline(
    PolynomialFeatures(degree=______, include_bias=______),
    StandardScaler(),
    Ridge(alpha=______))
scores = cross_val_score(model, X, y, cv=______, scoring=______)
print(round(-scores.mean(), 3), round(scores.std(), 3))
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `3`
(b) `False`
(c) `1.0`
(d) `5`
(e) `'neg_mean_squared_error'`

* **Explanation:**
A pipeline refits polynomial/scaling transformations inside each training fold. Degree=3 and cv=5 are specified. False avoids a redundant bias feature when Ridge fits an intercept. Source omissions: no ridge alpha or scoring metric is specified; 1.0 and negative MSE are conventional choices, not uniquely determined. Accept any positive alpha and a coherent negative loss scorer; include_bias=True is also a valid though redundant configuration.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 29 (5 points)

**Section:** Supervised Learning
**Type:** text-input
**Grading:** manual

Naive Bayes by Hand (fill in the 5 blanks)
Spam filter, binary word features, Laplace smoothing α=1.
Training: 10 emails — 4 spam, 6 ham.
“offer” appears in 3 spam, 1 ham; “meeting” in 1 spam, 4 ham.
Classify a new email containing “offer” but NOT “meeting”. Round to 2–3 decimals.

```text
P(spam) = ______ # prior
P(offer | spam) ≈ ______ # Laplace α=1
P(meeting | spam) ≈ ______
unnormalized score(ham) ≈ ______
predicted class: ______
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `0.40`
(b) `0.667`
(c) `0.333`
(d) `0.056`
(e) `spam`

* **Explanation:**
Bernoulli NB: spam prior=4/10; P(offer|spam)=(3+1)/(4+2)=2/3; P(meeting|spam)=(1+1)/6=1/3. Ham score=(6/10)*(2/8)*(1-5/8)=0.05625; spam score=(4/10)*(4/6)*(1-2/6)=0.17778, so spam wins. Accept 0.06 when rounding the score to two decimals, as permitted.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 30 (5 points)

**Section:** Unsupervised Learning
**Type:** text-input
**Grading:** manual

PCA Eigenvalues by Hand (fill in the 5 blanks)
2-D centered data has covariance matrix [[4, 2], [2, 3]].
Hint: √17 ≈ 4.123. Round eigenvalues to 2 decimals.

```text
covariance = [[4, 2], [2, 3]]
trace = ______
det = ______
λ₁ (larger eigenvalue) ≈ ______
λ₂ (smaller eigenvalue) ≈ ______
variance fraction explained by PC1 ≈ ______
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `7`
(b) `8`
(c) `5.56`
(d) `1.44`
(e) `0.79`

* **Explanation:**
Trace=4+3=7; determinant=12-4=8. Eigenvalues=(7 +/- sqrt(17))/2=5.56155 and 1.43845. The leading variance fraction is 5.56155/7=0.794508; accept 0.795 or 79.45% as equivalent precision.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 31 (5 points)

**Section:** AI Search
**Type:** text-input
**Grading:** manual

Uniform-Cost Search Trace (fill in the 5 blanks)
Uniform-cost search from S to G.
Edges: S→A (3), S→B (1), A→C (1), B→D (4), B→C (5), C→G (2), D→G (1).

```text
1st node expanded: ______
2nd node expanded: ______
3rd node expanded: ______
cost of the path found to G: ______
the optimal path is: ______ (e.g. S -> B -> D -> G)
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `S`
(b) `B`
(c) `A`
(d) `6`
(e) `S -> A -> C -> G`

* **Explanation:**
UCS pops S(0), B(1), A(3), C(4), D(5), G(6). Both S-A-C-G and S-B-D-G cost 6; no tie policy for equal-cost goal parents is specified. Accept either optimal path.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 32 (5 points)

**Section:** Logical Reasoning
**Type:** text-input
**Grading:** manual

Resolution Proof (fill in the 5 blanks)
Convert each formula to CNF clauses, then refute the negated goal.

```text
Prove P → R from KB = { P → Q, Q → R } by resolution.
clause (1): ______
clause (2): ______
clause (3): ______
clause (4): ______
resolve (3)+(1) → Q; resolve with (2) → R; resolve with (4)
yields the ______ clause
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `¬P ∨ Q`
(b) `¬Q ∨ R`
(c) `P`
(d) `¬R`
(e) `empty`

* **Explanation:**
CNF of the implications gives the first two clauses. Negating P->R gives P and not R. Resolve P with not P or Q to get Q, then R, then the empty clause with not R.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 33 (5 points)

**Section:** Constraint Satisfaction Problems
**Type:** text-input
**Grading:** manual

Arc Consistency and Counting (fill in the 5 blanks)
Variables X, Y, Z, each with domain {1, 2, 3, 4}.
Constraints: X < Y, Y ≠ Z.

```text
value removed from D(X) by arc consistency: ______
value removed from D(Y) by arc consistency: ______
D(X) after arc consistency: ______ (e.g. 1,2,3)
number of complete assignments satisfying all constraints: ______
assign X=2; after forward checking, D(Y) = ______
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `4`
(b) `1`
(c) `1,2,3`
(d) `18`
(e) `3,4`

* **Explanation:**
X=4 has no greater Y; Y=1 has no smaller X. There are 6 pairs X<Y and 3 choices of Z not equal to Y, giving 18 assignments. Assigning X=2 leaves Y={3,4}.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 34 (5 points)

**Section:** Kernel Methods
**Type:** text-input
**Grading:** manual

Polynomial Kernel by Hand (fill in the 5 blanks)
Polynomial kernel k(x,z) = (x·z + 2)². Compute by hand.

```text
k(x, z) = (x·z + 2)²
x=(1,2), z=(3,−1): x·z = ______ ; k(x,z) = ______
x=(2,0), z=(1,1): x·z = ______ ; k(x,z) = ______
dimension of the explicit feature map φ for degree 2 in 2-D inputs: ______
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `1`
(b) `9`
(c) `2`
(d) `16`
(e) `6`

* **Explanation:**
Dot products are 3-2=1 and 2+0=2; add 2 and square. The full inhomogeneous degree-two map in two variables has 1 constant, 2 linear, and 3 quadratic coordinates.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 35 (5 points)

**Section:** Supervised Learning
**Type:** text-input
**Grading:** manual

One Gradient-Descent Step by Hand (fill in the 5 blanks; 2 decimals)
Do one batch gradient-descent step by hand.

```text
points (1,1), (2,2), (3,2); w = 0, b = 0, α = 0.1
J(w,b) = (1/2m) Σᵢ (wxᵢ + b − yᵢ)²
∂J/∂w = ______ (2 decimals)
∂J/∂b = ______
after one GD step: w = ______ ; b = ______
new mean squared error = ______
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `-3.67`
(b) `-1.67`
(c) `0.37`
(d) `0.17`
(e) `0.66`

* **Explanation:**
Initial residuals are -1,-2,-2. Gradients are -11/3 and -5/3. Exact updates are w=11/30, b=1/6; predictions are 8/15,9/10,19/15. New MSE=1769/2700=0.655185. This is MSE, not the half-MSE objective. Using rounded parameters 0.37 and 0.17 gives MSE 0.639367, rounding to 0.64; accept that if intermediate rounding is shown.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---
