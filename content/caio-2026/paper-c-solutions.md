# 2026-27 CAIO National Qualifier - Paper C

**Year:** 2026

Part 1 - AI Fundamentals Challenge. 35 questions, 100 marks. Independently prepared solutions.

Source: 2026-27-caio-national-qualifier-practical-competition-c.pdf

Answer all 35 questions. Q1-15: choose one answer (2 marks each). Q16-25: select ALL correct options; full marks only for the complete correct set (2 marks each). Q26-35: five blanks per question (5 marks each); submit labeled answers (a)-(e) in the text box for teacher marking. A non-programmable calculator may be used. Ambiguous source questions are identified and teacher-marked. The 90-minute timer is the existing CAIO platform practice setting; these PDFs specify no duration. Solutions and the 1-point-per-blank practice rubric are independently prepared, not an official answer key.

## Question 1 (2 points)

**Section:** Data Preparation
**Type:** multiple-choice
**Grading:** automatic

Consider the following Python code:

```python
import numpy as np
A = np.array([[1, 2, 3], [4, 5, 6]])
B = A[0, :]
C = A[0, :].copy()
B += 10
C += 100
print(A[0, 0], A[0, 1], A[1, 0], A.sum())
```
What is the printed output?

- [ ] A. 11 12 4 51
- [ ] B. 11 12 104 351
- [ ] C. 1 2 4 21
- [ ] D. 11 112 4 151
- [ ] E. 101 102 4 321

### Answer & Explanation

* **Correct Answer:** A. 11 12 4 51

* **Explanation:**
B is a view and adds 10 to the first row of A; C is an independent copy. A becomes [[11,12,13],[4,5,6]], with sum 51.

---

## Question 2 (2 points)

**Section:** Data Preparation
**Type:** multiple-choice
**Grading:** automatic

Consider the following Python code:

```python
import pandas as pd
left = pd.DataFrame({'id': [1, 2, 3], 'v': [10, 20, 30]})
right = pd.DataFrame({'id': [2, 3, 3], 'w': [5, 6, 7]})
m = left.merge(right, on='id', how='left')
print(len(m), m['w'].sum())
```
What is the printed output?

- [ ] A. 4 18.0
- [ ] B. 3 18.0
- [ ] C. 4 13.0
- [ ] D. 3 12.0
- [ ] E. 4 18

### Answer & Explanation

* **Correct Answer:** A. 4 18.0

* **Explanation:**
The duplicate right-hand id 3 creates two joined rows. Four rows result; w values are NaN,5,6,7. Their skip-NaN sum is the float 18.0.

---

## Question 3 (2 points)

**Section:** Supervised Learning
**Type:** multiple-choice
**Grading:** automatic

For binary logistic regression with σ(z) = 1/(1+e^(−z)), z = w·x + b, the per-example
loss is
L = −[y·log σ(z) + (1−y)·log(1−σ(z))]
The gradient of L with respect to w is:

- [ ] A. (σ(z)−y)·x
- [ ] B. (y−σ(z))·x
- [ ] C. σ(z)(1−σ(z))·x
- [ ] D. (σ(z)−y)
- [ ] E. −y(1−σ(z))·x

### Answer & Explanation

* **Correct Answer:** A. (σ(z)−y)·x

* **Explanation:**
Applying the chain rule to sigmoid cross-entropy gives dL/dz=sigma(z)-y, then dL/dw=(sigma(z)-y)x.

---

## Question 4 (2 points)

**Section:** Supervised Learning
**Type:** multiple-choice
**Grading:** automatic

Training points (features → class): (0,0)→0, (4,0)→0, (0,3)→1, (2,2)→1. Euclidean
distance.
A 3-NN classifier predicts which class for the test point (1,1)?

- [ ] A. Class 1
- [ ] B. Class 0
- [ ] C. Tie — cannot decide
- [ ] D. Class 1, but 1-NN would predict class 0
- [ ] E. It depends on the distance metric used

### Answer & Explanation

* **Correct Answer:** A. Class 1

* **Explanation:**
Squared distances are 2,10,5,2. The nearest three labels are 0,1,1, so the vote is class 1. The two nearest points tie, so the added claim about 1-NN in D is not guaranteed without a tie-breaking rule.

---

## Question 5 (2 points)

**Section:** Kernel Methods
**Type:** multiple-choice
**Grading:** automatic

A hard-margin SVM learns the weight vector w = [3, 4] (bias b chosen to maximize the
margin).
margin width = 2/‖w‖
What is the width of the margin (distance between the two supporting
hyperplanes)?

- [ ] A. 0.4
- [ ] B. 0.2
- [ ] C. 2.5
- [ ] D. 5.0
- [ ] E. 0.8

### Answer & Explanation

* **Correct Answer:** A. 0.4

* **Explanation:**
||w||=sqrt(3^2+4^2)=5. The distance between the two support hyperplanes is 2/5=0.4.

---

## Question 6 (2 points)

**Section:** Unsupervised Learning
**Type:** multiple-choice
**Grading:** automatic

DBSCAN with ε = 1.5 and minPts = 3 is run on the points (0,0), (0,1), (1,0), (10,10).
Euclidean distance.
How many core points and how many noise points are there?

- [ ] A. 3 core, 1 noise
- [ ] B. 4 core, 0 noise
- [ ] C. 2 core, 2 noise
- [ ] D. 3 core, 0 noise (the far point is a border point)
- [ ] E. 0 core, 4 noise

### Answer & Explanation

* **Correct Answer:** A. 3 core, 1 noise

* **Explanation:**
Using the standard convention that minPts includes the point itself, each of the first three points has three points in its epsilon-neighborhood. All are core; (10,10) has no core neighbor and is noise.

---

## Question 7 (2 points)

**Section:** Evaluation of ML Models
**Type:** multiple-choice
**Grading:** automatic

A test set has 1000 samples: 950 negative, 50 positive. A classifier predicts "negative"
for every sample.
What are its accuracy and its recall on the positive class?

- [ ] A. Accuracy 0.95, recall 0.0
- [ ] B. Accuracy 0.95, recall 0.95
- [ ] C. Accuracy 0.50, recall 0.0
- [ ] D. Accuracy 0.95, recall undefined
- [ ] E. Accuracy 0.05, recall 0.0

### Answer & Explanation

* **Correct Answer:** A. Accuracy 0.95, recall 0.0

* **Explanation:**
Accuracy=950/1000=0.95. Positive recall=TP/(TP+FN)=0/50=0.

---

## Question 8 (2 points)

**Section:** AI Search
**Type:** multiple-choice
**Grading:** automatic

Edges: S→A cost 2, S→B cost 1, A→G cost 4, B→G cost 6. True cheapest costs to the goal:
h*(S)=6, h*(A)=4, h*(B)=6.
Which heuristic is admissible but NOT consistent?

- [ ] A. h(S)=6, h(A)=4, h(B)=5
- [ ] B. h(S)=6, h(A)=3, h(B)=6
- [ ] C. h(S)=7, h(A)=4, h(B)=6
- [ ] D. h(S)=0, h(A)=0, h(B)=0
- [ ] E. h(S)=6, h(A)=4, h(B)=6

### Answer & Explanation

* **Correct Answer:** B. h(S)=6, h(A)=3, h(B)=6

* **Explanation:**
B never overestimates, but on S->A it violates consistency: h(S)=6>2+h(A)=5. The other admissible options satisfy the edge inequalities, assuming h(G)=0.

---

## Question 9 (2 points)

**Section:** AI Search
**Type:** multiple-choice
**Grading:** automatic

All step costs are positive but NOT all equal. A student claims breadth-first search will
return the cheapest path because "it explores level by level".
Which statement is TRUE?

- [ ] A. The student is right: BFS expands nodes in order of increasing path cost.
- [ ] B. BFS is optimal here, but only if the goal sits at the shallowest depth.
- [ ] C. The student is wrong: BFS levels count steps, not cost — uniform-cost search should be used for cheapest-path optimality.
- [ ] D. The student is wrong: BFS is not even complete when step costs differ.
- [ ] E. Iterative deepening would fix the problem because it re-expands nodes.

### Answer & Explanation

* **Correct Answer:** C. The student is wrong: BFS levels count steps, not cost — uniform-cost search should be used for cheapest-path optimality.

* **Explanation:**
BFS orders by edge count, not accumulated weight. UCS orders by path cost and finds the cheapest path under the usual positive-cost termination assumptions.

---

## Question 10 (2 points)

**Section:** AI Search
**Type:** multiple-choice
**Grading:** automatic

Tree-search A* (no repeated-state checking). Edges: S→A cost 1, S→B cost 2, A→G cost
1, B→G cost 1. Heuristic: h(S)=0, h(A)=10, h(B)=0, h(G)=0.
Which path does A* return, and is it optimal?

- [ ] A. S → B → G, cost 3 — not optimal (the optimum is S → A → G, cost 2)
- [ ] B. S → A → G, cost 2 — optimal
- [ ] C. S → B → G, cost 3 — optimal
- [ ] D. S → A → G, cost 11 — not optimal
- [ ] E. S → B → G, cost 4 — not optimal

### Answer & Explanation

* **Correct Answer:** A. S → B → G, cost 3 — not optimal (the optimum is S → A → G, cost 2)

* **Explanation:**
After S, A has f=11 and B has f=2. Expanding B generates G with f=3, which is popped before A. The returned cost 3 exceeds the true optimum 2 because h(A) overestimates.

---

## Question 11 (2 points)

**Section:** AI Search
**Type:** multiple-choice
**Grading:** automatic

State space: branching factor b, solution depth d, maximum depth m (m ≥ d).
Which algorithm has the LOWEST worst-case memory complexity?

- [ ] A. Breadth-first search: O(b^d)
- [ ] B. Depth-first search: O(b·m)
- [ ] C. Iterative deepening DFS: O(b·d)
- [ ] D. A*: O(b^d)
- [ ] E. Uniform-cost search: O(b^d)

### Answer & Explanation

* **Correct Answer:** C. Iterative deepening DFS: O(b·d)

* **Explanation:**
Iterative deepening stores O(bd), no worse than DFS O(bm) since d<=m; it is lower than exponential frontiers in the usual branching regime. It can tie DFS when d=m.

---

## Question 12 (2 points)

**Section:** Logical Reasoning
**Type:** multiple-choice
**Grading:** automatic

Knowledge base KB = { P → Q, Q → R, ¬R }.
Which formula is logically entailed by KB?

- [ ] A. P
- [ ] B. Q
- [ ] C. ¬Q
- [ ] D. P ∧ ¬R
- [ ] E. R ∨ P

### Answer & Explanation

* **Correct Answer:** C. ¬Q

* **Explanation:**
From Q->R and not R, modus tollens yields not Q (and then not P). Only not Q is listed as a consequence.

---

## Question 13 (2 points)

**Section:** Logical Reasoning
**Type:** multiple-choice
**Grading:** automatic

KB = { A ∨ B, ¬A ∨ C, ¬B ∨ C, ¬C }.
How many models (satisfying truth assignments) does KB have?

- [ ] A. 0
- [ ] B. 1
- [ ] C. 2
- [ ] D. 3
- [ ] E. 4

### Answer & Explanation

* **Correct Answer:** A. 0

* **Explanation:**
Not C together with not A or C forces not A; similarly it forces not B. This contradicts A or B, so there are no models.

---

## Question 14 (2 points)

**Section:** Constraint Satisfaction Problems
**Type:** multiple-choice
**Grading:** automatic

CSP: variables X (domain {1,2}), Y (domain {1,2,3}), Z (domain {1}). Constraints: X ≠
Z, Y > X.
Using the minimum-remaining-values (MRV) heuristic, which variable is
selected first?

- [ ] A. Z
- [ ] B. X
- [ ] C. Y
- [ ] D. X or Y (tie)
- [ ] E. Any — MRV does not apply before any assignment

### Answer & Explanation

* **Correct Answer:** A. Z

* **Explanation:**
On the supplied domains, Z has only one remaining value, fewer than X or Y. MRV therefore selects Z before any propagation not specified in the question.

---

## Question 15 (2 points)

**Section:** Reinforcement Learning
**Type:** multiple-choice
**Grading:** automatic

Q-learning update: Q(s,a) ← Q(s,a) + α·[r + γ·max_a′ Q(s′,a′) − Q(s,a)]. Current Q(s,a) =
4, α = 0.5, reward r = 10, γ = 0.9, max_a′ Q(s′,a′) = 8.
What is the updated Q(s,a)?

- [ ] A. 10.6
- [ ] B. 17.2
- [ ] C. 11.2
- [ ] D. 13.6
- [ ] E. 8.6

### Answer & Explanation

* **Correct Answer:** A. 10.6

* **Explanation:**
Target=10+0.9*8=17.2. Q_new=4+0.5*(17.2-4)=10.6.

---

## Question 16 (2 points)

**Section:** AI Search
**Type:** multi-select
**Grading:** automatic

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about search algorithms are TRUE?

- [ ] A. A* using graph search with a consistent heuristic never needs to re-expand a node.
- [ ] B. Greedy best-first search guarantees an optimal solution.
- [ ] C. Uniform-cost search is equivalent to A* with h(n) = 0 for all n.
- [ ] D. Iterative deepening A* (IDA*) uses asymptotically less memory than A*.
- [ ] E. Depth-first search is optimal when all step costs are equal.

### Answer & Explanation

* **Correct Answer:** ["A", "C", "D"]

* **Explanation:**
Consistency makes closed-node A* re-expansion unnecessary. A* with h=0 is UCS. IDA* keeps a depth-first path instead of an exponential frontier. Greedy and DFS are not generally optimal.

---

## Question 17 (2 points)

**Section:** AI Search
**Type:** multi-select
**Grading:** automatic

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about uninformed search are TRUE?

- [ ] A. Iterative deepening search is complete and optimal when all step costs are equal.
- [ ] B. Breadth-first search is optimal when all step costs are equal.
- [ ] C. Depth-first search is complete in infinite state spaces.
- [ ] D. Uniform-cost search expands nodes in nondecreasing order of path cost g(n).
- [ ] E. Breadth-first search uses less memory than depth-first search.

### Answer & Explanation

* **Correct Answer:** ["A", "B", "D"]

* **Explanation:**
With finite branching and equal positive costs, BFS and iterative deepening are complete and optimal. UCS pops nondecreasing g. DFS can get trapped on infinite branches and usually uses less memory than BFS.

---

## Question 18 (2 points)

**Section:** Logical Reasoning
**Type:** multi-select
**Grading:** automatic

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about logical entailment are TRUE?

- [ ] A. If KB ⊨ φ then KB ∪ {ψ} ⊨ φ for any sentence ψ.
- [ ] B. If φ is consistent with KB then KB ⊨ φ.
- [ ] C. KB is unsatisfiable if and only if KB ⊨ ⊥ (false).
- [ ] D. If KB ⊨ φ ∨ ψ then KB ⊨ φ or KB ⊨ ψ.
- [ ] E. Propositional resolution is refutation-complete: KB ⊨ φ iff KB ∪ {¬φ} derives a contradiction by resolution.

### Answer & Explanation

* **Correct Answer:** ["A", "C", "E"]

* **Explanation:**
Classical entailment is monotonic; inconsistency entails false. Resolution is refutation-complete after conversion to clauses. Mere consistency is not entailment, and entailing a disjunction need not entail either disjunct separately.

---

## Question 19 (2 points)

**Section:** Constraint Satisfaction Problems
**Type:** multi-select
**Grading:** automatic

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about constraint propagation are TRUE?

- [ ] A. Forward checking prunes values from the domains of ALL unassigned variables after each assignment.
- [ ] B. Maintaining arc consistency (e.g. AC-3) can detect failures that forward checking misses.
- [ ] C. The MRV heuristic selects the variable involved in the greatest number of constraints.
- [ ] D. Chronological backtracking is complete: it finds a solution if one exists.
- [ ] E. With forward checking, an unassigned variable’s domain can become empty before that variable itself is assigned.

### Answer & Explanation

* **Correct Answer:** ["B", "D", "E"]

* **Explanation:**
Arc consistency can propagate through unassigned neighbors and find failures missed by forward checking. Finite-domain chronological backtracking is complete. Forward checking can empty an unassigned neighbor domain. It only checks neighbors, not all unassigned variables; MRV counts remaining values, not constraints.

---

## Question 20 (2 points)

**Section:** Constraint Satisfaction Problems
**Type:** multi-select
**Grading:** automatic

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about CSPs are TRUE?

- [ ] A. A binary CSP with n variables of domain size d has at most d^n complete assignments.
- [ ] B. Enforcing arc consistency at every node of the search tree is always faster than plain backtracking.
- [ ] C. If every arc in the constraint graph is consistent, the CSP is guaranteed to have a solution.
- [ ] D. The least-constraining-value heuristic orders values by how few options they remove for neighboring variables.
- [ ] E. Forward checking enforces constraints only between the most recently assigned variable and the unassigned variables.

### Answer & Explanation

* **Correct Answer:** ["A", "D", "E"]

* **Explanation:**
There are at most d^n full assignments. LCV preserves neighbors choices, and forward checking tests constraints from the latest assignment to unassigned neighbors. Arc consistency has overhead and does not guarantee satisfiability on cyclic graphs.

---

## Question 21 (2 points)

**Section:** Supervised Learning
**Type:** multi-select
**Grading:** automatic

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about supervised learning are TRUE?

- [ ] A. 1-NN has zero training error when no two training points share identical features but different labels.
- [ ] B. Lasso (L1 regularization) can drive some coefficients to exactly zero, performing feature selection.
- [ ] C. In bagging, each base learner is trained on a bootstrap sample (drawn with replacement) the same size as the training set.
- [ ] D. Adding more trees to a random forest always reduces its bias.
- [ ] E. One-hot encoding is required before a decision tree can use categorical features.

### Answer & Explanation

* **Correct Answer:** ["A", "B", "C"]

* **Explanation:**
With no conflicting duplicates, a training point is its own nearest neighbor. L1 promotes sparse coefficients. Standard bagging uses size-n bootstrap samples. More trees do not always reduce bias, and categorical trees need not use one-hot encoding.

---

## Question 22 (2 points)

**Section:** Unsupervised Learning
**Type:** multi-select
**Grading:** manual

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about clustering are TRUE?

**Platform note:** This item has ambiguous source wording and will be teacher-marked. Select the options supported by your reading.

- [ ] A. In DBSCAN, a border point may be assigned to more than one cluster.
- [ ] B. Single-linkage agglomerative clustering can discover elongated, chain-like clusters.
- [ ] C. The elbow method always pinpoints a single unambiguous optimal k for k-means.
- [ ] D. A Gaussian mixture model with diagonal covariances assumes features are uncorrelated within each component.
- [ ] E. In agglomerative clustering, the height at which two clusters merge in the dendrogram equals the distance between them.

### Answer & Explanation

* **Correct Answer:** ["B", "D", "E"]

* **Explanation:**
B,D,E are true using the chosen linkage distance for dendrogram heights. In a standard DBSCAN run each point receives one label, so A is false if it means simultaneous assignment. A border point may be reachable from two clusters and assigned to either depending on traversal order; accept A,B,D,E if A is read as possible assignment across runs. The elbow need not be unambiguous. This source ambiguity is teacher-marked.

Marking: award 2 points for either defensible complete selection described above, otherwise 0. This preserves the source all-or-nothing scoring rule.

---

## Question 23 (2 points)

**Section:** Evaluation of ML Models
**Type:** multi-select
**Grading:** automatic

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about evaluation are TRUE?

- [ ] A. A classifier with 99% accuracy on a dataset that is 99% negative can still have zero recall on the positive class.
- [ ] B. Raising the decision threshold always increases the F1 score.
- [ ] C. An AUC-ROC of 0.5 indicates performance no better than random guessing.
- [ ] D. A classifier that never predicts the positive class has precision 1.0 on that class.
- [ ] E. Macro-averaged recall gives equal weight to each class, regardless of class size.

### Answer & Explanation

* **Correct Answer:** ["A", "C", "E"]

* **Explanation:**
An all-negative predictor can have 99% accuracy and zero positive recall. AUC 0.5 means random-level ranking by this metric, not necessarily identical behavior at every threshold. Macro recall weights classes equally. F1 need not rise with threshold; no positive predictions makes precision undefined (often reported as 0), not 1.

---

## Question 24 (2 points)

**Section:** Kernel Methods
**Type:** multi-select
**Grading:** automatic

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about kernels and SVMs are TRUE?

- [ ] A. The polynomial kernel (x·z + c)^1 is equivalent to a linear kernel (up to the constant c).
- [ ] B. A smaller γ in the RBF kernel gives each training point a wider sphere of influence.
- [ ] C. The Gram (kernel) matrix of a valid kernel is always positive semidefinite.
- [ ] D. The RBF kernel can be expanded as a finite-degree polynomial in the input features.
- [ ] E. Increasing the SVM regularization parameter C always increases the number of support vectors.

### Answer & Explanation

* **Correct Answer:** ["A", "B", "C"]

* **Explanation:**
Degree one gives the dot product plus c; smaller gamma broadens RBF influence; valid Gram matrices are PSD. RBF has an infinite expansion, and support-vector counts do not increase monotonically with C.

---

## Question 25 (2 points)

**Section:** Recommender Systems
**Type:** multi-select
**Grading:** automatic

Select ALL correct options. You receive full marks only if every correct option — and no incorrect option
— is selected.
Which statements about recommender systems are TRUE?

- [ ] A. Content-based filtering recommends items similar to ones the user has liked before.
- [ ] B. User-based collaborative filtering predicts ratings from users with similar taste profiles.
- [ ] C. Matrix factorization learns latent vector representations for both users and items.
- [ ] D. Collaborative filtering needs item content features (genre, text) to compute recommendations.
- [ ] E. A brand-new user with no ratings can receive personalized collaborative-filtering recommendations.

### Answer & Explanation

* **Correct Answer:** ["A", "B", "C"]

* **Explanation:**
Content-based methods compare item attributes; user CF uses similar taste profiles; factorization learns both user and item vectors. Pure CF does not require content features and cannot infer personalized preferences for a user with no interactions or other information.

---

## Question 26 (5 points)

**Section:** Data Preparation
**Type:** text-input
**Grading:** manual

Sensor Log Aggregation (fill in the 5 blanks)
readings.csv columns: ts (string 'YYYY-MM-DD HH:MM'), sensor, value.
Goal: daily mean value per sensor, forward-filling days with no readings.
Complete the script:

```python
import pandas as pd
df = pd.read_csv('readings.csv')
df['ts'] = pd.______(df['ts'])
df = df.drop_duplicates(______)
df = df.______('ts')
daily = df.set_index('ts').groupby('sensor')['value'].______('D').mean()
daily = daily.______() # forward-fill days with no readings
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `to_datetime`
(b) `subset=['ts', 'sensor']`
(c) `sort_values`
(d) `resample`
(e) `groupby(level=0).ffill`

* **Explanation:**
Parse timestamps, remove duplicate sensor/timestamp keys, sort time, then resample each sensor to daily means. Group the final MultiIndex series by sensor before forward filling to prevent one sensor leaking into another. Source does not define duplicate identity: accept a justified alternative subset. Plain ffill is the likely intended fifth answer but can fill a leading missing value from a different sensor; accept it only under the explicit assumption that each sensor starts with a valid daily mean.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 27 (5 points)

**Section:** Supervised Learning
**Type:** text-input
**Grading:** manual

Gini Split Selection (fill in the 5 blanks; 2 decimals)
8 samples. Feature X and class y:
X: 1 2 3 | 4 5 | 6 7 8
y: 0 0 0 | 1 1 | 1 1 1
Consider the candidate splits at 3.5 and 5.5. Round to 2 decimals.

```text
Gini(parent) = ______
Split at 3.5 → Gini(left) = ______ (right side is pure)
Split at 5.5 → weighted Gini = ______
Gini gain at 5.5 = ______
Better split threshold = ______
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `0.47`
(b) `0.00`
(c) `0.30`
(d) `0.17`
(e) `3.5`

* **Explanation:**
Parent Gini=1-(3/8)^2-(5/8)^2=0.46875. At 3.5 both children are pure. At 5.5 the left has 3 zeros/2 ones (Gini 0.48) and right is pure, so weighted Gini=(5/8)*0.48=0.30; gain=0.16875.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 28 (5 points)

**Section:** Supervised Learning
**Type:** text-input
**Grading:** manual

Naive Bayes by Hand (fill in the 5 blanks; 2 decimals)
6 training emails, Laplace smoothing α = 1.
Spam: "buy cheap", "buy now", "cheap deal"
Ham: "see now", "see deal", "lunch now"
Vocabulary: {buy, cheap, now, deal, see, lunch}. Test email: "buy now".
Round to 2 decimals.

```text
P(buy | spam) = ______
P(now | spam) ≈ ______
P(buy | ham) ≈ ______
P(spam | "buy now") ≈ ______ (normalized posterior)
Predicted class = ______
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `0.25`
(b) `0.17`
(c) `0.08`
(d) `0.67`
(e) `spam`

* **Explanation:**
Using multinomial NB, each class has 6 tokens and vocabulary size 6, so the smoothed denominator is 12. P(buy|spam)=3/12, P(now|spam)=2/12, P(buy|ham)=1/12. P(now|ham)=3/12 and equal priors give posterior 2/3. Source does not name the NB variant: accept a consistent Bernoulli interpretation too (0.60,0.40,0.20,0.73,spam when all six presence/absence features are used). Do not mix Bernoulli and multinomial denominators.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 29 (5 points)

**Section:** Supervised Learning
**Type:** text-input
**Grading:** manual

One Perceptron Update (fill in the 5 blanks)
Perceptron: predict 1 if w·x + b > 0, else 0.
Start: w = [0.5, −1.0], b = 0.2. Training example: x = (1, 2), y = 1.
Update rule on a mistake: w ← w + y·x, b ← b + y.

```text
z = w·x + b = ______
predicted class = ______
updated w = ______ (e.g. [1.5, 1.0])
updated b = ______
new z on the same example = ______
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `-1.3`
(b) `0`
(c) `[1.5, 1.0]`
(d) `1.2`
(e) `4.7`

* **Explanation:**
Initial score=0.5-2+0.2=-1.3, so prediction 0 is mistaken. Apply the stated positive-label update: w=[0.5,-1]+[1,2], b=0.2+1. New score=1.5+2+1.2=4.7. The supplied rule is evaluated only on this y=1 example.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 30 (5 points)

**Section:** AI Search
**Type:** text-input
**Grading:** manual

Uniform-Cost Search Trace (fill in the 5 blanks)
Edges: S→A cost 2, S→B cost 5, A→B cost 1, A→G cost 6, B→G cost 2.
Uniform-cost search (graph search), ties broken deterministically.

```text
After expanding S, the frontier holds A(2) and B(5). Expanded next: ______
B's path cost is then improved from 5 to ______
The node expanded after that is ______
Returned optimal path cost = ______
Returned optimal path = ______
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `A`
(b) `3`
(c) `B`
(d) `5`
(e) `S -> A -> B -> G`

* **Explanation:**
A is cheapest at cost 2. Its edge to B improves B to 3, then B improves G to 5. UCS pops that goal before any more expensive path.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 31 (5 points)

**Section:** AI Search
**Type:** text-input
**Grading:** manual

BFS vs DFS Expansion Order (fill in the 5 blanks)
Edges: S→A, S→B, A→D, B→C, C→G, D→G. Goal: G.
BFS: queue; neighbors enqueued alphabetically.
DFS: stack; neighbors pushed in reverse-alphabetical order (so the alphabetically-first
neighbor is popped first).

```text
BFS node expansion order (until G is popped): ______
DFS node expansion order (until G is popped): ______
Nodes expanded by BFS before popping G: ______
Nodes expanded by DFS before popping G: ______
Which algorithm popped the goal first: ______
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `S, A, B, D, C, G`
(b) `S, A, D, G`
(c) `5`
(d) `3`
(e) `DFS`

* **Explanation:**
BFS visits both depth-one nodes before D and C, then pops G. DFS follows S-A-D-G. Counts in (c,d) exclude G because the wording says before popping G; the order lists include G. Duplicate-state handling does not affect these prefixes.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 32 (5 points)

**Section:** Logical Reasoning
**Type:** text-input
**Grading:** manual

Model Counting (fill in the 5 blanks)
KB = { A → B, B → C } over variables {A, B, C}.

```text
Total truth assignments: ______
Models of KB: ______
Is (A → C) entailed by KB? (yes/no): ______
Models in which ¬A holds: ______
Models in which (B ∧ ¬C) holds: ______
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `8`
(b) `4`
(c) `yes`
(d) `3`
(e) `0`

* **Explanation:**
Valid (A,B,C) assignments are 000,001,011,111. Thus 4 of 2^3 assignments satisfy KB; 3 have not A, none have B and not C. The implication A->C holds in every model.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 33 (5 points)

**Section:** Constraint Satisfaction Problems
**Type:** text-input
**Grading:** manual

Backtracking with Forward Checking (fill in the 5 blanks)
Variables X, Y, Z, each domain {R, G, B}. Constraints: X ≠ Y, Y ≠ Z.
Backtracking with MRV (ties → alphabetical) and forward checking.

```text
Assign X = R. Forward checking reduces Y’s domain to ______ (e.g. G,B)
MRV now selects variable ______
Assign Y = G. Forward checking reduces Z’s domain to ______
Complete solutions with X = R: ______
Total complete solutions: ______
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `G,B`
(b) `Y`
(c) `R,B`
(d) `4`
(e) `12`

* **Explanation:**
After X=R, Y loses R and is the smallest remaining domain. After Y=G, Z loses G. With X fixed there are 2 choices for Y and 2 for Z, giving 4; across all three X values there are 12.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 34 (5 points)

**Section:** Evaluation of ML Models
**Type:** text-input
**Grading:** manual

Cost-Sensitive Comparison (fill in the 5 blanks)
Test set: 1000 samples. Costs: false positive = 1, false negative = 10.
Classifier A: TP=80, FP=20, FN=30, TN=870.
Classifier B: TP=60, FP=5, FN=50, TN=885.

```text
Total cost of A = ______
Total cost of B = ______
Accuracy of A = ______
Accuracy of B = ______
Better classifier under this cost model: ______
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `320`
(b) `505`
(c) `0.95`
(d) `0.945`
(e) `A`

* **Explanation:**
Costs are 20+10*30=320 and 5+10*50=505. Accuracies are (80+870)/1000=0.95 and (60+885)/1000=0.945. A is better under the supplied cost model despite having more false positives.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---

## Question 35 (5 points)

**Section:** Kernel Methods
**Type:** text-input
**Grading:** manual

Polynomial Kernel by Hand (fill in the 5 blanks)
k(x, z) = (x·z + 1)². Explicit map for 2-D inputs:
φ(x) = [1, √2·x₁, √2·x₂, x₁², √2·x₁x₂, x₂²].
Take x = (1, 2), z = (2, 0). Hint: √2 ≈ 1.414.

```text
x·z = ______
k(x, z) = ______
Dimension of the explicit feature space = ______
The √2·x₁x₂ component of φ(x) ≈ ______
‖φ(x)‖² = k(x, x) = ______
```

Write five answers labeled (a), (b), (c), (d), and (e), in order. Include any assumptions or calculations.

### Answer & Explanation

* **Correct Answer:** (a) `2`
(b) `9`
(c) `6`
(d) `2.828`
(e) `36`

* **Explanation:**
x dot z=2; kernel=(2+1)^2=9. The given map has 6 coordinates. Its cross term is sqrt(2)*1*2=2.828. Self-kernel=(1^2+2^2+1)^2=36.

Platform practice rubric: 1 point per correct blank, up to 5; accept equivalent code, set order, mathematical forms, and rounding consistent with the prompt. Apply the source-specific alternatives above. This per-blank rubric is independently prepared, not an official marking scheme.

---
