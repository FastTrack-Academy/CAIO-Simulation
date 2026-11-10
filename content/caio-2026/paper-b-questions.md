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

---
