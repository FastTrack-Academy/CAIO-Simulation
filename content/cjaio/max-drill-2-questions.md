# Max's CJAIO Drill Test 2

**Difficulty:** Harder than CJAIO practice sets

60 minutes | 26 questions | 100 points

Harder practice: nested-list sharing, recursion, duplicate-aware search, two K-Means rounds, tie rules, and model-evaluation trade-offs within the CJAIO syllabus.

26 questions; 100 points; 60 minutes. Q1-12: select one answer. Q13-18: select all correct answers; all and only the correct options earn the points. Q19-26: show work or code. Q20-26 support teacher marking and partial credit. Original practice questions; difficulty is relative to the supplied CJAIO practice sets.

## Question 1 (2 points)

A - Single choice

What is printed?
```python
a = [0, 3, 6, 9, 12, 15, 18]
print(a[-2:0:-2])
```

- A. [18, 12, 6]
- B. [15, 9, 3]
- C. [15, 9, 3, 0]
- D. [3, 9, 15]
- E. [15, 12, 9]

## Question 2 (2 points)

A - Single choice

What is printed by this recursive function?
```python
def f(n):
    if n <= 1:
        return 1
    return f(n - 2) + n

print(f(5))
```

- A. 5
- B. 6
- C. 8
- D. 9
- E. 15

## Question 3 (2 points)

A - Single choice

What is printed?
```python
rows = [[0, 1]] * 3
rows[1][0] = 7
rows[2] = [4, 5]
print(rows[0][0] + rows[1][0] + rows[2][0])
```

- A. 18
- B. 11
- C. 21
- D. 4
- E. 7

## Question 4 (2 points)

A - Single choice

What is printed?
```python
counts = {}
repeated = 0
for x in [2, 5, 2, 2, 5, 7]:
    counts[x] = counts.get(x, 0) + 1
    if counts[x] == 2:
        repeated += 1
print(repeated)
```

- A. 1
- B. 3
- C. 4
- D. 5
- E. 2

## Question 5 (2 points)

A - Single choice

A bag has 3 red counters and 2 blue counters. Three counters are drawn without replacement. What is the probability of exactly 2 red counters and 1 blue counter?

- A. 1/5
- B. 2/5
- C. 3/5
- D. 4/5
- E. 9/25

## Question 6 (2 points)

A - Single choice

A line graph records these visitor counts:
Week 1: 40
Week 2: 50
Week 3: 45
Week 4: 60
Which statement is correct?

- A. The largest increase is from Week 2 to Week 3.
- B. Week 1 to Week 2 is an increase of 10%.
- C. The count increases every week.
- D. Week 3 to Week 4 is an increase of 33 1/3%.
- E. Week 4 has twice the visitors of Week 1.

## Question 7 (2 points)

A - Single choice

This ascending list contains duplicates. What is printed?
```python
a = [1, 4, 4, 4, 9, 12]
target = 4
left = 0
right = len(a) - 1
while left <= right:
    mid = (left + right) // 2
    if a[mid] < target:
        left = mid + 1
    else:
        right = mid - 1
print(left)
```

- A. 1
- B. 2
- C. 3
- D. 4
- E. An error occurs

## Question 8 (2 points)

A - Single choice

What is printed? Note which variable is added to total.
```python
total = 0
for i in range(1, 6):
    for j in range(i):
        if (i + j) % 3 == 0:
            total += j
print(total)
```

- A. 5
- B. 8
- C. 14
- D. 19
- E. 20

## Question 9 (2 points)

A - Single choice

This bubble sort stops after a pass with no swaps. What is printed?
```python
nums = [1, 3, 2, 4]
comparisons = 0
for i in range(len(nums) - 1):
    swapped = False
    for j in range(len(nums) - 1 - i):
        comparisons += 1
        if nums[j] > nums[j + 1]:
            nums[j], nums[j + 1] = nums[j + 1], nums[j]
            swapped = True
    if not swapped:
        break
print(comparisons)
```

- A. 1
- B. 3
- C. 4
- D. 6
- E. 5

## Question 10 (2 points)

A - Single choice

An unweighted KNN classifier uses Euclidean distance. For P=(0,0), the examples are (1,0):A, (0,2):B, (2,1):B, (-3,0):A. What happens when k changes from 1 to 3?

- A. Both predict A.
- B. Both predict B.
- C. k=1 predicts A; k=3 predicts B.
- D. k=1 predicts B; k=3 predicts A.
- E. Both votes are tied.

## Question 11 (2 points)

A - Single choice

Eight examples have 4 positive and 4 negative labels. Compare two tree splits.
Split X: left 3 positive/1 negative; right 1 positive/3 negative.
Split Y: left 2 positive/0 negative; right 2 positive/4 negative.
Using Gini=1-p_positive^2-p_negative^2, choose the split with LOWER weighted child Gini.

- A. X, because its weighted Gini is 3/8 and that is lower.
- B. Y, because its weighted Gini is 1/3, below X's 3/8.
- C. They tie at weighted Gini 3/8.
- D. X, because its weighted Gini is 1/4.
- E. Y, because its weighted Gini is 4/9 after weighting.

## Question 12 (2 points)

A - Single choice

Four fixed logistic-regression probability estimates are 0.35, 0.55, 0.70, and 0.90. Predict class 1 when p>=threshold. If only the threshold changes from 0.5 to 0.75, how many predictions change from class 1 to class 0?

- A. 0
- B. 1
- C. 3
- D. 2
- E. 4

## Question 13 (4 points)

B - Select all that apply

Select ALL correct Python statements.

- A. After b=a for a list a, both names refer to the same list.
- B. a.copy() always creates independent copies of every nested mutable object.
- C. not (True and False) evaluates to True.
- D. Integer floor division always rounds toward zero.
- E. list(range(5, 0, -2)) produces [5, 3, 1].

## Question 14 (4 points)

B - Select all that apply

A dataset can contain several records from the same student. Select ALL appropriate evaluation practices.

- A. Fit a missing-value imputer using the training data only.
- B. Fit a scaler on all data because it does not read class labels.
- C. Keep records from the same student on the same side of a split when evaluating performance on new students.
- D. Assume deleting every row with any missing value is always best.
- E. Use validation data to choose a decision tree's depth.

## Question 15 (4 points)

B - Select all that apply

Start with 2,4,6,8 and append the value 100. Select ALL correct statements.

- A. The new mean is 24.
- B. The new median is 5.
- C. The new range is 98.
- D. The original median was 5.
- E. The mean is unchanged.

## Question 16 (4 points)

B - Select all that apply

Select ALL correct statements about counting and algorithmic reasoning.

- A. There are 28 pairs of indices satisfying 0<=i<j<8.
- B. Two separate full scans of n items make 2n item visits in total.
- C. Doubling n multiplies an n^2 operation count by four.
- D. A recursive countdown needs a stopping case and progress toward it to terminate for its intended inputs.
- E. Binary search always works correctly on an unsorted list.

## Question 17 (4 points)

B - Select all that apply

Select ALL correct statements about basic ML models.

- A. Feature units can affect both KNN and K-Means when they use Euclidean distance.
- B. Logistic regression can estimate a binary-class probability.
- C. A decision-tree split can produce two pure children even if the parent has mixed labels.
- D. The model with lower training MSE must have lower test MSE.
- E. K-Means cluster numbers necessarily have the same meaning as known class labels.

## Question 18 (4 points)

B - Select all that apply

Select ALL correct statements about evaluation and responsible AI.

- A. A classifier can have 99% accuracy while missing every example of a rare class.
- B. Removing the sensitive attribute guarantees a model is fair.
- C. Collect only personal information needed for the task.
- D. Evaluate whether data and errors are representative of the intended users.
- E. Removing human oversight always makes AI decisions fairer.

## Question 19 (5 points)

C - Short Answer I

What is printed?
```python
values = [3, 1, 4, 1, 5]
total = 0
for i in range(1, len(values)):
    if values[i] > values[i - 1]:
        total += values[i] - values[i - 1]
    else:
        total -= 1
print(total)
```


## Question 20 (5 points)

C - Short Answer I

The function should return the first index where the running sum is at least target, or -1 if this never happens. Complete the two blanks and give the output. All list values in this example are nonnegative.
```python
def first_reach(nums, target):
    total = 0
    for i in range(len(nums)):
        total += nums[i]
        if ____________________:
            return ____________________
    return -1

print(first_reach([2, 1, 4, 3], 6))
```


## Question 21 (5 points)

C - Short Answer I

Trace the search and give final left, right, and checks. Explain where left would insert another copy of target relative to the existing copies.
```python
a = [1, 3, 3, 3, 8, 10]
target = 3
left = 0
right = len(a) - 1
checks = 0
while left <= right:
    mid = (left + right) // 2
    checks += 1
    if a[mid] <= target:
        left = mid + 1
    else:
        right = mid - 1
```


## Question 22 (5 points)

C - Short Answer I

Two linear-regression models have training MSEs A=0.1 and B=0.4. Evaluate them on validation points (1,2),(2,4),(3,6).
Model A: y_hat=3x-1.
Model B: y_hat=2x+1.
Calculate each model's validation predictions and MSE. Which model should be preferred using this validation set, and why does A's lower training MSE not settle the choice? Use MSE=sum((y-y_hat)^2)/n.


## Question 23 (8 points)

D - Short Answer II

Perform TWO assignment/update rounds of K-Means on points (0,0),(2,0),(3,0),(9,0),(10,0). Start C1=(0,0), C2=(4,0). If a point is exactly equally distant, assign it to Cluster 1. Use squared Euclidean distances.
(a) Give the first assignments. [2 points]
(b) Give the first updated centers. [2 points]
(c) Reassign using those updated centers. [2 points]
(d) Give the second updated centers. [2 points]


## Question 24 (8 points)

D - Short Answer II

A logistic-regression model uses z=x1-x2-0.5 and p=1/(1+e^(-z)). Example A has x1=3,x2=1; example B has x1=1,x2=2. Use e^(-1.5) approximately 0.223 and e^(1.5) approximately 4.482. Predict class 1 if p>=threshold.
(a) Calculate both scores z. [2 points]
(b) Calculate both probabilities to three decimals. [2 points]
(c) Give both class predictions at thresholds 0.5 and 0.85. [2 points]
(d) Explain whether changing the threshold changes z, p, or only the decision when the inputs and model stay fixed. [2 points]


## Question 25 (8 points)

D - Short Answer II

Write a Python function that finds the longest contiguous STRICTLY increasing run. Return a pair (start_index, length). If several longest runs tie, choose the earliest start index. For an empty list return (-1,0). Use one pass after initialization, with loops and conditionals; do not sort. Then print the function's result on:
```python
data = [4, 6, 8, 2, 5, 7, 1, 3]
```
[8 points]


## Question 26 (8 points)

D - Short Answer II

A test set has 100 messages: 10 spam and 90 ordinary messages. The two classifiers make these predictions:
Model A: 0 spam correctly caught; 10 spam missed; 90 ordinary correctly accepted; 0 ordinary wrongly flagged.
Model B: 8 spam correctly caught; 2 spam missed; 80 ordinary correctly accepted; 10 ordinary wrongly flagged.
(a) Calculate each model's accuracy (all correct predictions / all messages). [2 points]
(b) Calculate each model's spam recall, defined as spam correctly caught / actual spam. [2 points]
(c) If catching spam is the main priority and flagged messages receive human review, which model is more suitable? Explain the trade-off. [2 points]
(d) Give one concrete privacy safeguard for the message text. [2 points]

