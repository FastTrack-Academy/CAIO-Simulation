# 2026-27 CAIO National Qualifier - Paper A

**Year:** 2026

Part 1 - AI Fundamentals Challenge. 35 questions, 100 marks. Independently prepared solutions.

Source: 2026-27-caio-national-qualifier-practical-competition-a.pdf

Answer all 35 questions. Q1-15: choose one answer (2 marks each). Q16-25: select ALL correct options; full marks only for the complete correct set (2 marks each). Q26-35: five blanks per question (5 marks each); submit labeled answers (a)-(e) in the text box for teacher marking. A non-programmable calculator may be used. Ambiguous source questions are identified and teacher-marked. The 90-minute timer is the existing CAIO platform practice setting; these PDFs specify no duration. Solutions and the 1-point-per-blank practice rubric are independently prepared, not an official answer key.

## Question 1 (2 points)

**Section:** Data Preparation
**Type:** multiple-choice
**Grading:** automatic

Consider the following Python code:

```python
import numpy as np
A = np.arange(6).reshape(2, 3)
B = A[:, 1:]
B[0, 0] = 100
C = A.flatten()
print(A[0, 1], B[0, 0], C[1], A.sum())
```
What is the printed output?

- [ ] A. 100 100 100 114
- [ ] B. 1 100 1 114
- [ ] C. 100 100 1 15
- [ ] D. 1 100 100 114
- [ ] E. 100 100 100 15

### Answer & Explanation

* **Correct Answer:** A. 100 100 100 114

* **Explanation:**
Basic slicing returns a view, so B changes A[0,1] to 100. flatten copies A after that change. The original sum 15 increases by 99 to 114.

---

## Question 2 (2 points)

**Section:** Data Preparation
**Type:** multiple-choice
**Grading:** automatic

Consider the following Python code:

```python
import pandas as pd
df = pd.DataFrame({'k': ['x','y','x','y'], 'v': [10, 20, 30, 40]})
g = df.groupby('k', as_index=False)['v'].mean()
print(g.loc[g['k']=='x', 'v'].values[0], g['v'].sum())
```
What is the printed output?

- [ ] A. 20.0 50.0
- [ ] B. 20 50
- [ ] C. 10.0 50.0
- [ ] D. 30.0 50.0
- [ ] E. 20.0 100.0

### Answer & Explanation

* **Correct Answer:** A. 20.0 50.0

* **Explanation:**
The x group mean is (10+30)/2=20.0; the y group mean is 30.0. Their sum is 50.0.

---

## Question 3 (2 points)

**Section:** Supervised Learning
**Type:** multiple-choice
**Grading:** automatic

For one-dimensional linear regression the loss is
L(w, b) = 1/(2n) Σᵢ (yᵢ − (wxᵢ + b))²
The gradient of L with respect to w is:

- [ ] A. (2/n)Σᵢ xᵢ(yᵢ−(wxᵢ+b))
- [ ] B. −(1/n)Σᵢ xᵢ(yᵢ−(wxᵢ+b))
- [ ] C. (1/n)Σᵢ (yᵢ−(wxᵢ+b))
- [ ] D. −(2/n)Σᵢ xᵢ(yᵢ−(wxᵢ+b))
- [ ] E. (1/n)Σᵢ xᵢ(yᵢ−(wxᵢ+b))

### Answer & Explanation

* **Correct Answer:** B. −(1/n)Σᵢ xᵢ(yᵢ−(wxᵢ+b))

* **Explanation:**
Differentiating the squared residual cancels the factor 1/2 and introduces -x_i: dL/dw = -(1/n) sum x_i(y_i-wx_i-b).

---

## Question 4 (2 points)

**Section:** Supervised Learning
**Type:** multiple-choice
**Grading:** automatic

Let X be an n×d design matrix with n < d (more features than samples) and rank(X) = n.
Which statement is TRUE?

- [ ] A. XᵀX is invertible, so ŵ = (XᵀX)⁻¹Xᵀy is the unique solution.
- [ ] B. XᵀX is singular; infinitely many w fit the training data exactly, so ridge regularization or the pseudoinverse is needed.
- [ ] C. The normal equation has no solution in this case.
- [ ] D. The least-squares solution is unique because n equations determine d unknowns.
- [ ] E. y must be centered to zero mean before the normal equation can be applied.

### Answer & Explanation

* **Correct Answer:** B. XᵀX is singular; infinitely many w fit the training data exactly, so ridge regularization or the pseudoinverse is needed.

* **Explanation:**
Rank(X^T X)=n<d, so it is singular. Full row rank makes every y attainable; the nullspace has dimension d-n. The pseudoinverse selects the minimum-norm fit, while ridge selects a regularized fit. These are ways to select a solution, not the only ways to find one.

---

## Question 5 (2 points)

**Section:** Supervised Learning
**Type:** multiple-choice
**Grading:** automatic

With ridge-regularized loss J(w) = (1/n)‖Xw−y‖² + (λ/2)‖w‖²,
the vectorized gradient-descent update is:

- [ ] A. w := w − α·(2/n)Xᵀ(Xw−y) + λw
- [ ] B. w := w − α[(2/n)Xᵀ(Xw−y) + λw]
- [ ] C. w := w − α[(1/n)Xᵀ(Xw−y) + (λ/2)w]
- [ ] D. w := w + α[(2/n)Xᵀ(Xw−y) + λw]
- [ ] E. w := w − α[(2/n)(Xw−y)Xᵀ + λw]

### Answer & Explanation

* **Correct Answer:** B. w := w − α[(2/n)Xᵀ(Xw−y) + λw]

* **Explanation:**
The data gradient is (2/n)X^T(Xw-y); the penalty gradient is lambda*w. Gradient descent subtracts alpha times their sum.

---

## Question 6 (2 points)

**Section:** Supervised Learning
**Type:** multiple-choice
**Grading:** automatic

For ridge regression ŵ_ridge = (XᵀX + λI)⁻¹Xᵀy with λ > 0,
as λ → ∞:

- [ ] A. ŵ_ridge approaches the zero vector.
- [ ] B. ŵ_ridge approaches the ordinary least-squares solution.
- [ ] C. the training error approaches zero.
- [ ] D. the model becomes equivalent to k-nearest neighbors.
- [ ] E. ‖ŵ_ridge‖ grows without bound.

### Answer & Explanation

* **Correct Answer:** A. ŵ_ridge approaches the zero vector.

* **Explanation:**
With every component of w penalized, (X^T X+lambda I)^-1 tends to zero as lambda tends to infinity, so the fitted weights tend to zero.

---

## Question 7 (2 points)

**Section:** Evaluation of ML Models
**Type:** multiple-choice
**Grading:** automatic

A model has 2% training error and 18% cross-validation error, and the validation curve
stays flat as the training size grows.
What is the most appropriate next step?

- [ ] A. Add higher-degree polynomial features.
- [ ] B. Decrease the regularization parameter λ.
- [ ] C. Increase λ (or remove features) to reduce model complexity.
- [ ] D. Collect twice as much training data.
- [ ] E. Run gradient descent for more iterations.

### Answer & Explanation

* **Correct Answer:** C. Increase λ (or remove features) to reduce model complexity.

* **Explanation:**
Low training error and much larger validation error indicate high variance. Since the validation curve has plateaued, reducing complexity is the best listed intervention.

---

## Question 8 (2 points)

**Section:** Supervised Learning
**Type:** multiple-choice
**Grading:** automatic

A decision tree grown to full depth reaches 100% training accuracy but only 70% test
accuracy.
Which change is LEAST likely to improve test accuracy?

- [ ] A. Pruning the tree with cost-complexity pruning.
- [ ] B. Setting max_depth to a smaller value.
- [ ] C. Requiring min_samples_leaf ≥ 10.
- [ ] D. Growing the tree even deeper.
- [ ] E. Collecting more training data.

### Answer & Explanation

* **Correct Answer:** D. Growing the tree even deeper.

* **Explanation:**
The tree already overfits. More depth cannot simplify it and, at full depth, may change nothing. Pruning, larger leaves, shallower depth, or more data may help.

---

## Question 9 (2 points)

**Section:** Unsupervised Learning
**Type:** multiple-choice
**Grading:** automatic

Which statement about the k-means algorithm is TRUE?

- [ ] A. It always finds the globally optimal clustering.
- [ ] B. The number of clusters k must be chosen in advance, and different random initializations can converge to different local optima.
- [ ] C. It works well when clusters are elongated or non-spherical.
- [ ] D. Its result is insensitive to feature scaling.
- [ ] E. It automatically determines the best number of clusters.

### Answer & Explanation

* **Correct Answer:** B. The number of clusters k must be chosen in advance, and different random initializations can converge to different local optima.

* **Explanation:**
k-means needs k in advance and is sensitive to initialization. Lloyd iterations can reach different local optima; scaling and cluster geometry matter.

---

## Question 10 (2 points)

**Section:** Unsupervised Learning
**Type:** multiple-choice
**Grading:** automatic

You fit a Gaussian to each feature for anomaly detection and pick the threshold ε by
maximizing F1 on a cross-validation set (flag x as anomaly if p(x) < ε).
If ε is set far too large, what happens?

- [ ] A. Only the most extreme anomalies are flagged; recall collapses.
- [ ] B. Many normal points are flagged as anomalies, so precision drops.
- [ ] C. The fitted Gaussian parameters μ and σ² change.
- [ ] D. Recall decreases while precision increases.
- [ ] E. Nothing changes; ε only affects training time.

### Answer & Explanation

* **Correct Answer:** B. Many normal points are flagged as anomalies, so precision drops.

* **Explanation:**
Increasing epsilon expands the region p(x)<epsilon. Many normal points become false positives, typically reducing precision while increasing recall.

---

## Question 11 (2 points)

**Section:** Evaluation of ML Models
**Type:** multiple-choice
**Grading:** automatic

A binary classifier's confusion matrix: TP = 80, FP = 20, FN = 30, TN = 870.
What are precision, recall, and F1 (rounded to two decimals)?

- [ ] A. Precision 0.80, Recall 0.73, F1 ≈ 0.76
- [ ] B. Precision 0.73, Recall 0.80, F1 ≈ 0.76
- [ ] C. Precision 0.80, Recall 0.73, F1 ≈ 0.66
- [ ] D. Precision 0.89, Recall 0.80, F1 ≈ 0.84
- [ ] E. Precision 0.80, Recall 0.97, F1 ≈ 0.88

### Answer & Explanation

* **Correct Answer:** A. Precision 0.80, Recall 0.73, F1 ≈ 0.76

* **Explanation:**
Precision=80/100=0.80; recall=80/110=0.7273; F1=2TP/(2TP+FP+FN)=160/210=0.7619.

---

## Question 12 (2 points)

**Section:** Kernel Methods
**Type:** multiple-choice
**Grading:** automatic

Consider a trained hard-margin support vector machine.
Removing which training points can change the learned decision boundary?

- [ ] A. Only the support vectors.
- [ ] B. All training points influence it equally.
- [ ] C. Only the misclassified points.
- [ ] D. No single training point can change it.
- [ ] E. Only the points farthest from the boundary.

### Answer & Explanation

* **Correct Answer:** A. Only the support vectors.

* **Explanation:**
Support vectors are the active margin constraints. Removing one can change the optimum; removing a non-support point leaves the optimum feasible. Not every support-vector removal must change it.

---

## Question 13 (2 points)

**Section:** Kernel Methods
**Type:** multiple-choice
**Grading:** automatic

For the RBF kernel k(x, z) = exp(−γ‖x−z‖²),
increasing γ typically:

- [ ] A. makes the boundary smoother and reduces overfitting.
- [ ] B. makes the boundary more complex and localized; the risk of overfitting grows.
- [ ] C. turns the kernel into a linear kernel.
- [ ] D. makes training faster.
- [ ] E. always reduces the number of support vectors.

### Answer & Explanation

* **Correct Answer:** B. makes the boundary more complex and localized; the risk of overfitting grows.

* **Explanation:**
A larger gamma makes similarity decay over shorter distances, allowing a more localized and complex decision boundary.

---

## Question 14 (2 points)

**Section:** AI Search
**Type:** multiple-choice
**Grading:** automatic

True cheapest costs to the goal: h*(S) = 8, h*(A) = 5, h*(B) = 6.
Which heuristic is admissible (never overestimates)?

- [ ] A. h(S)=9, h(A)=4, h(B)=6
- [ ] B. h(S)=8, h(A)=5, h(B)=7
- [ ] C. h(S)=7, h(A)=5, h(B)=5
- [ ] D. h(S)=8, h(A)=6, h(B)=6
- [ ] E. h(S)=10, h(A)=5, h(B)=6

### Answer & Explanation

* **Correct Answer:** C. h(S)=7, h(A)=5, h(B)=5

* **Explanation:**
Only C is no larger than the true cost at every supplied node: 7<=8, 5<=5, 5<=6. As usual h(goal)=0.

---

## Question 15 (2 points)

**Section:** Logical Reasoning
**Type:** multiple-choice
**Grading:** automatic

Knowledge base KB = { P → Q, ¬Q }.
Which formula is logically entailed by KB?

- [ ] A. P
- [ ] B. Q
- [ ] C. ¬P
- [ ] D. P ∧ Q
- [ ] E. P ∨ Q

### Answer & Explanation

* **Correct Answer:** C. ¬P

* **Explanation:**
Modus tollens: P implies Q, and Q is false, so P is false.

---

## Question 16 (2 points)

**Section:** Data Preparation
**Type:** multi-select
**Grading:** automatic

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which of the following snippets execute WITHOUT raising an error?

- [ ] A. np.array([1, 2, 3]) + np.array([[1], [2]])
- [ ] B. pd.DataFrame({'a': [1, 2]})['b']
- [ ] C. np.zeros((2, 3)).reshape(3, 2)
- [ ] D. np.arange(5)[[0, 2, 4]]
- [ ] E. pd.DataFrame({'a': [1, 2, 3]})['a'][5]

### Answer & Explanation

* **Correct Answer:** ["A", "C", "D"]

* **Explanation:**
A broadcasts shapes (3,) and (2,1) to (2,3). C preserves six elements; D uses valid indices. B requests a missing column and E a missing index label, both raising KeyError.

---

## Question 17 (2 points)

**Section:** Supervised Learning
**Type:** multi-select
**Grading:** automatic

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about gradient descent and diagnostics are TRUE?

- [ ] A. Batch gradient descent computes the gradient over the entire training set at each step.
- [ ] B. The noisy updates of SGD can help it escape shallow local minima more easily than batch GD.
- [ ] C. Vectorizing across examples mainly reduces the number of iterations needed to converge.
- [ ] D. A large, persistent gap between training and cross-validation error indicates high variance.
- [ ] E. Decreasing the learning rate α always speeds up convergence.

### Answer & Explanation

* **Correct Answer:** ["A", "B", "D"]

* **Explanation:**
Batch GD uses all examples. SGD noise can help escape shallow minima. A persistent generalization gap suggests high variance. Vectorization speeds each iteration, not necessarily the number of iterations; smaller steps need not converge faster.

---

## Question 18 (2 points)

**Section:** Supervised Learning
**Type:** multi-select
**Grading:** automatic

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about L1 vs L2 regularization are TRUE?

- [ ] A. L1 regularization tends to produce sparse weight vectors (many exact zeros).
- [ ] B. L2 regularization shrinks weights toward zero but rarely sets them exactly to zero.
- [ ] C. The L1 penalty is differentiable at w = 0.
- [ ] D. Ridge regression has a closed-form solution, while lasso generally does not.
- [ ] E. Increasing λ always reduces the training error.

### Answer & Explanation

* **Correct Answer:** ["A", "B", "D"]

* **Explanation:**
L1 promotes sparsity and is not differentiable at zero. L2 usually shrinks rather than zeros weights. Ridge has a general closed form; lasso generally requires optimization. Stronger penalties need not reduce unpenalized training error.

---

## Question 19 (2 points)

**Section:** Supervised Learning
**Type:** multi-select
**Grading:** automatic

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about tree-based models are TRUE?

- [ ] A. Random forests reduce variance by averaging trees trained on bootstrap samples with random feature subsets.
- [ ] B. Gradient boosting primarily reduces bias by sequentially fitting the residual errors.
- [ ] C. Increasing max_depth of a single decision tree tends to increase variance.
- [ ] D. In XGBoost, a larger learning rate η always improves generalization.
- [ ] E. Pruning a decision tree increases its complexity.

### Answer & Explanation

* **Correct Answer:** ["A", "B", "C"]

* **Explanation:**
Random forests average randomized trees to reduce variance. Boosting fits successive residuals (or negative loss gradients), often reducing bias. Deep trees have higher variance. Larger learning rates do not always generalize better; pruning reduces complexity.

---

## Question 20 (2 points)

**Section:** Unsupervised Learning
**Type:** multi-select
**Grading:** automatic

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about clustering are TRUE?

- [ ] A. k-means implicitly assumes roughly spherical clusters and is sensitive to feature scaling.
- [ ] B. DBSCAN can discover arbitrarily shaped clusters and label sparse points as noise.
- [ ] C. Agglomerative hierarchical clustering requires the number of clusters k up front, like k-means.
- [ ] D. A Gaussian mixture model assigns every point to exactly one cluster.
- [ ] E. k-means++ initialization reduces the risk of poor local optima compared with uniform random init.

### Answer & Explanation

* **Correct Answer:** ["A", "B", "E"]

* **Explanation:**
Euclidean k-means favors compact clusters and depends on scale; DBSCAN finds density-connected shapes and noise; k-means++ improves seeding. A hierarchy can be built without choosing a final cut. GMM responsibilities are soft probabilities.

---

## Question 21 (2 points)

**Section:** Evaluation of ML Models
**Type:** multi-select
**Grading:** automatic

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about evaluation metrics are TRUE?

- [ ] A. On a dataset with 99% negatives, always predicting 'negative' scores 99% accuracy.
- [ ] B. Precision–recall curves are more informative than ROC curves for highly imbalanced data.
- [ ] C. ROC-AUC is independent of the chosen classification threshold.
- [ ] D. A higher R² on the training set always means better predictions on new data.
- [ ] E. Micro-averaged F1 gives equal weight to each class regardless of its size.

### Answer & Explanation

* **Correct Answer:** ["A", "B", "C"]

* **Explanation:**
The all-negative classifier scores 99% accuracy. PR analysis focuses on the rare positive class. ROC-AUC summarizes a range of thresholds. Training R-squared does not ensure generalization; macro, not micro, averaging gives classes equal weight.

---

## Question 22 (2 points)

**Section:** Kernel Methods
**Type:** multi-select
**Grading:** automatic

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about SVMs and kernels are TRUE?

- [ ] A. The kernel trick computes inner products in the feature space without explicitly mapping the data.
- [ ] B. The RBF kernel corresponds to an infinite-dimensional feature space.
- [ ] C. Only the support vectors determine the SVM decision boundary.
- [ ] D. SVMs are insensitive to feature scaling.
- [ ] E. A linear kernel can separate every dataset that an RBF kernel can separate.

### Answer & Explanation

* **Correct Answer:** ["A", "B", "C"]

* **Explanation:**
Kernels supply implicit feature-space inner products; the RBF map is infinite dimensional. The SVM decision function uses nonzero dual coefficients at support vectors. Feature scales matter, and nonlinear separability need not imply linear separability.

---

## Question 23 (2 points)

**Section:** AI Search
**Type:** multi-select
**Grading:** automatic

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about search algorithms are TRUE?

- [ ] A. BFS is complete and optimal when all step costs are equal.
- [ ] B. DFS uses O(bm) memory but is neither optimal nor complete in infinite spaces.
- [ ] C. Uniform-cost search is optimal when all step costs are positive.
- [ ] D. A* guarantees an optimal solution regardless of the heuristic used.
- [ ] E. Greedy best-first search is optimal.

### Answer & Explanation

* **Correct Answer:** ["A", "B", "C"]

* **Explanation:**
Under the usual finite-branching assumptions BFS is complete and optimal for equal positive costs; DFS stores O(bm) frontier nodes and may follow an infinite branch. UCS is optimal when it returns a goal with positive costs; termination in infinite spaces additionally needs a positive lower bound on costs. A* needs appropriate heuristic conditions; greedy search is not generally optimal.

---

## Question 24 (2 points)

**Section:** Recommender Systems
**Type:** multi-select
**Grading:** automatic

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about recommender systems are TRUE?

- [ ] A. User-based collaborative filtering recommends items liked by users with similar tastes.
- [ ] B. Item-based filtering is usually more scalable when users far outnumber items.
- [ ] C. Collaborative filtering has no cold-start problem.
- [ ] D. TF-IDF features of item descriptions can be used in content-based recommendation.
- [ ] E. Pearson correlation always yields the same neighbor ranking as cosine similarity.

### Answer & Explanation

* **Correct Answer:** ["A", "B", "D"]

* **Explanation:**
User-based CF uses similar users. Item-based similarities can be cheaper when there are far fewer items than users. TF-IDF supports content matching. CF has cold-start issues; centering in Pearson correlation can change neighbor rankings relative to cosine.

---

## Question 25 (2 points)

**Section:** Reinforcement Learning
**Type:** multi-select
**Grading:** automatic

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about reinforcement learning are TRUE?

- [ ] A. In ε-greedy action selection, the agent exploits the best-known action with probability 1−ε.
- [ ] B. Q-learning is an off-policy temporal-difference method updating toward max_a Q(s′, a).
- [ ] C. A discount factor γ close to 0 makes the agent far-sighted.
- [ ] D. The Bellman optimality equation expresses V*(s) as the maximum expected return over actions.
- [ ] E. Increasing the exploration rate ε always improves the agent's final return.

### Answer & Explanation

* **Correct Answer:** ["A", "B", "D"]

* **Explanation:**
The exploitation branch is taken with probability 1-epsilon (random exploration can also choose the best action). Q-learning uses an off-policy max target. Bellman optimality maximizes expected return. Small gamma is short-sighted; more exploration is not always better.

---

## Question 26 (5 points)

**Section:** Data Preparation
**Type:** text-input
**Grading:** manual

Data Cleaning and Aggregation (fill in the 5 blanks)
orders.csv columns: order_id, customer, date (string 'YYYY-MM-DD'),
amount (float, may be NaN), region. Complete the script:

```python
import pandas as pd
df = pd.read_csv('orders.csv')
df['date'] = pd.______(df['date'])
df = df.dropna(______)
df['month'] = df['date'].dt.month
g = df.______(['region', 'month'])['amount'].______()
g = g.______(ascending=False)
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `to_datetime`
(b) `subset=['amount']`
(c) `groupby`
(d) `sum`
(e) `sort_values`

* **Explanation:**
Parse dates, retain rows with known amounts, group by region/month, sum amounts, and sort totals descending. The source never specifies the aggregation or exact missing-data subset: sum and amount are a reasonable model answer, not uniquely forced. Accept mean/count or another coherent aggregation with an explained interpretation; dropna() is also defensible. Do not require an unstated business rule.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 27 (5 points)

**Section:** Supervised Learning
**Type:** text-input
**Grading:** manual

Logistic Regression Without Data Leakage (fill in the 5 blanks)
students.csv columns: hours, score, passed (1/0). Complete the script. Watch out:
the scaler must not see the test set.

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
df = pd.read_csv('students.csv')
X = df[['hours', 'score']]; y = df['passed']
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=______)
scaler = StandardScaler()
X_train_s = scaler.______(X_train)
X_test_s = scaler.______(X_test)
model = LogisticRegression()
model.______(X_train_s, y_train)
print(______(y_test, model.predict(X_test_s)))
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `y`
(b) `fit_transform`
(c) `transform`
(d) `fit`
(e) `accuracy_score`

* **Explanation:**
Stratify using the labels. Fit the scaler only on training data, reuse it on test data, fit the classifier, and measure test predictions against y_test.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 28 (5 points)

**Section:** Supervised Learning
**Type:** text-input
**Grading:** manual

Information Gain, Step by Step (fill in the 5 blanks; 2 decimals)
12 samples: Positive 7, Negative 5. Split on X:
Left: P 5, N 1. Right: P 2, N 4. (log base 2)
Hints: log₂(7/12)=−0.778, log₂(5/12)=−1.263, log₂(5/6)=−0.263,
log₂(1/6)=−2.585, log₂(2/6)=−1.585, log₂(4/6)=−0.585.

```text
H(parent) ≈ ______
H(left) ≈ ______
H(right) ≈ ______
weighted conditional entropy ≈ ______
information gain ≈ ______
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `0.98`
(b) `0.65`
(c) `0.92`
(d) `0.78`
(e) `0.20`

* **Explanation:**
Using H(p)=-p log2(p)-(1-p)log2(1-p): parent=0.97987, left=0.65002, right=0.91830. Equal child sizes give conditional entropy 0.78416 and gain 0.19571. Round only at the end.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 29 (5 points)

**Section:** Supervised Learning
**Type:** text-input
**Grading:** manual

Vectorized Gradient and Update (fill in the 5 blanks)
Complete the vectorized gradient of J(w,b) = (1/2m)‖Xw+b·1−y‖²
(X: m×n, y: m-vector) and one gradient-descent step with learning rate alpha.

```python
import numpy as np
def compute_gradient(X, y, w, b):
    m, n = X.shape
    f_wb = ______
    err = ______
    dj_dw = ______
    dj_db = ______
    return dj_dw, dj_db
# one GD step:
w = ______
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `X @ w + b`
(b) `f_wb - y`
(c) `X.T @ err / m`
(d) `np.sum(err) / m`
(e) `w - alpha * compute_gradient(X, y, w, b)[0]`

* **Explanation:**
Predictions broadcast b across examples. Multiply residuals by X.T and average for the weight gradient; average residuals for the bias gradient. The source never calls compute_gradient outside the function: the self-contained fifth answer calls it. Accept w-alpha*dj_dw if the gradient is first obtained in the outer scope, but note that the supplied skeleton alone leaves dj_dw local and unavailable. The source asks only for the w update, not a b-update blank.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 30 (5 points)

**Section:** Supervised Learning
**Type:** text-input
**Grading:** manual

Logistic Regression by Hand (fill in the 5 blanks)
Trained model: w = [2, −1], b = −0.5. Hint: e^0.5 ≈ 1.649, e^3.5 ≈ 33.1.
Round probabilities to two decimals.

```text
For x = (1, 2): z = w·x + b = ______
σ(z) ≈ ______
predicted class (threshold 0.5) = ______
For x = (0, 3): z = ______ ; σ(z) ≈ ______
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `-0.5`
(b) `0.38`
(c) `0`
(d) `-3.5`
(e) `0.03`

* **Explanation:**
For (1,2), z=2-2-0.5=-0.5 and sigmoid=1/(1+1.649)=0.3775. For (0,3), z=-3.5 and sigmoid=1/(1+33.1)=0.0293. The first probability is below 0.5.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 31 (5 points)

**Section:** Unsupervised Learning
**Type:** text-input
**Grading:** manual

One k-means Iteration (fill in the 5 blanks)
Points: (1,1), (1,2), (4,4), (5,4). Initial centroids μ₁=(1,1), μ₂=(5,5).
Do ONE Lloyd iteration (assign, then recompute).

```text
new μ₁ = (______, ______) # x, y
new μ₂ = (______, ______) # x, y
After this iteration the algorithm has converged (yes/no): ______
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `1`
(b) `1.5`
(c) `4.5`
(d) `4`
(e) `yes`

* **Explanation:**
The first two points join cluster 1 and the last two join cluster 2. Coordinate means give (1,1.5) and (4.5,4). Reassignment with these centers is unchanged, so this is a Lloyd fixed point. Accept no if the student explicitly means a stopping test comparing old and new centers: the centers did move, so that implementation needs a further iteration to confirm convergence.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 32 (5 points)

**Section:** AI Search
**Type:** text-input
**Grading:** manual

A* Trace (fill in the 5 blanks)
Edges: S→A cost 1, S→B cost 2, A→G cost 6, B→G cost 3.
Heuristic: h(S)=5, h(A)=5, h(B)=2, h(G)=0.

```text
After expanding S: f(A) = ______ , f(B) = ______
The node expanded next (after S) is ______
f(G) via the next expansion = ______
The optimal path found is ______ (e.g. S -> B -> G)
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `6`
(b) `4`
(c) `B`
(d) `5`
(e) `S -> B -> G`

* **Explanation:**
After S, f(A)=1+5=6 and f(B)=2+2=4. B generates G with g=2+3=5 and h=0, so G is popped before A.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 33 (5 points)

**Section:** Kernel Methods
**Type:** text-input
**Grading:** manual

RBF Kernel by Hand (fill in the 5 blanks; 3 decimals)
k(x,z) = exp(−γ‖x−z‖²). Hint: e^(−2.5)≈0.082, e^(−0.9)≈0.407.

```text
x=(1,2), z=(4,6), γ=0.1: ‖x−z‖² = ______
−γ‖x−z‖² = ______ ; k(x,z) ≈ ______
x=(1,2), z=(1,5), γ=0.1: ‖x−z‖² = ______ ; k(x,z) ≈ ______
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `25`
(b) `-2.5`
(c) `0.082`
(d) `9`
(e) `0.407`

* **Explanation:**
Squared distances are 3^2+4^2=25 and 0^2+3^2=9. Exponents are -2.5 and -0.9; exponentiation gives 0.082085 and 0.406570.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 34 (5 points)

**Section:** Constraint Satisfaction Problems
**Type:** text-input
**Grading:** manual

Forward Checking Trace (fill in the 5 blanks)
Variables A, B, C, each domain {1,2,3}. Constraints: A < B, B ≠ C.

```text
Assign A=2. After forward checking: B ∈ {______} ; C ∈ {______}
  (list values comma-separated, e.g. 1,2,3)
Then assign B=3: C ∈ {______}
If instead (after A=2) we tried B=1, forward checking would report ______
  (write: failure or success)
Number of complete assignments satisfying all constraints: ______
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `3`
(b) `1,2,3`
(c) `1,2`
(d) `failure`
(e) `6`

* **Explanation:**
A=2 forces B=3; forward checking does not yet propagate from unassigned B to C. Then B=3 excludes 3 from C. B=1 violates A<B. In the original problem there are 3 ordered pairs A<B and two C values for each, so 6 total assignments. Accept 2 for the last blank if explicitly counting extensions after A=2, since the source does not state whether that assignment is reset.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 35 (5 points)

**Section:** Supervised Learning
**Type:** text-input
**Grading:** manual

Least-Squares Fit by Hand (fill in the 5 blanks; 2 decimals)
Fit y = wx + b to points (1,2), (2,3), (3,5) via least squares:
w = Cov(x,y)/Var(x), b = Ƀ − w·x̄.

```text
x̄ = ______ ; Ƀ = ______
w = ______ ; b = ______
prediction at x=4: ŷ = ______
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `2.00`
(b) `3.33`
(c) `1.50`
(d) `0.33`
(e) `6.33`

* **Explanation:**
Means are x-bar=2 and y-bar=10/3. The slope is 3/2, intercept 1/3, and prediction at 4 is 19/3. The PDF glyph shown as Ƀ is interpreted as y-bar. Keep exact fractions until final rounding.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---
