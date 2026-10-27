# Max's CJAIO Drill Test 1

**Difficulty:** Equivalent to CJAIO practice sets

60 minutes | 26 questions | 100 points

Equivalent practice: Python tracing, search and sorting, probability, data preparation, and hand calculations with the five basic ML models.

26 questions; 100 points; 60 minutes. Q1-12: select one answer. Q13-18: select all correct answers; all and only the correct options earn the points. Q19-26: show work or code. Q20-26 support teacher marking and partial credit. Original practice questions; difficulty is relative to the supplied CJAIO practice sets.

## Question 1 (2 points)

A - Single choice

What is printed?
```python
a = [11, 4, 9, 2, 7, 5]
print(a[1:6:2])
```

- A. [11, 9, 7]
- B. [4, 9, 2]
- C. [4, 2]
- D. [4, 2, 5]
- E. [9, 7]

## Question 2 (2 points)

A - Single choice

Which task is most naturally a classification problem?

- A. Labeling a photo as cat or dog
- B. Predicting a plant's height in centimeters
- C. Predicting tomorrow's rainfall amount
- D. Grouping unlabeled songs by similarity
- E. Predicting the number of books borrowed tomorrow

## Question 3 (2 points)

A - Single choice

What is printed?
```python
word = "ROBOT"
result = ""
for i in range(0, len(word), 2):
    result += word[i]
print(result)
```

- A. ROO
- B. OOT
- C. RBT
- D. RBO
- E. BOT

## Question 4 (2 points)

A - Single choice

What is printed?
```python
weather = ["sun", "rain", "sun", "wind", "rain", "sun"]
freq = {}
for item in weather:
    freq[item] = freq.get(item, 0) + 1
print(freq["sun"] - freq["rain"] + freq["wind"])
```

- A. 1
- B. 2
- C. 3
- D. 4
- E. 6

## Question 5 (2 points)

A - Single choice

A bag contains 2 blue counters and 4 gold counters. Two counters are drawn without replacement. What is the probability of drawing exactly one of each color?

- A. 2/9
- B. 4/15
- C. 1/3
- D. 2/3
- E. 8/15

## Question 6 (2 points)

A - Single choice

For the dataset 2, 4, 5, 9, 10, 18, which statement is correct?

- A. Mean = 7; median = 8
- B. Mean = 8; median = 5
- C. Mean = 8; median = 7
- D. Mean = 9; median = 7
- E. Mean = 7; median = 9

## Question 7 (2 points)

A - Single choice

What is printed by this search on an ascending list?
```python
a = [2, 7, 11, 16, 23, 29]
target = 17
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

- A. 4
- B. 3
- C. 2
- D. 5
- E. 17

## Question 8 (2 points)

A - Single choice

What is the final value printed?
```python
total = 0
for i in range(1, 5):
    for j in range(i):
        if (i + j) % 2 == 0:
            total += 1
print(total)
```

- A. 2
- B. 3
- C. 5
- D. 4
- E. 6

## Question 9 (2 points)

A - Single choice

What is printed?
```python
a = [[2, 4], [6, 8]]
b = a.copy()
b[1][0] = 0
b.append([9, 9])
print(len(a), a[1][0], len(b))
```

- A. 2 6 3
- B. 3 0 3
- C. 2 6 2
- D. 3 6 3
- E. 2 0 3

## Question 10 (2 points)

A - Single choice

An unweighted KNN classifier uses Euclidean distance and k=3. Predict the class of P=(4,3).
Labeled points:
(3,3): Class A
(4,5): Class B
(5,3): Class A
(4,0): Class B
(8,3): Class B

- A. Class B
- B. Class A
- C. A tie between A and B
- D. The point must be assigned to a new cluster
- E. KNN cannot use two features

## Question 11 (2 points)

A - Single choice

A decision-tree split has a left child with 2 positive and 0 negative examples and a right child with 2 positive and 2 negative examples. Using Gini=1-p_positive^2-p_negative^2, what is the weighted child Gini?

- A. 1/2
- B. 1/4
- C. 1/3
- D. 2/3
- E. 0

## Question 12 (2 points)

A - Single choice

What is printed by the sorting program?
```python
nums = [3, 1, 4, 2]
swaps = 0
for i in range(len(nums) - 1):
    for j in range(len(nums) - 1 - i):
        if nums[j] > nums[j + 1]:
            nums[j], nums[j + 1] = nums[j + 1], nums[j]
            swaps += 1
print(swaps, sum(nums[:2]))
```

- A. 3 3
- B. 2 3
- C. 3 5
- D. 4 3
- E. 4 5

## Question 13 (4 points)

B - Select all that apply

Select ALL correct statements about Python.

- A. list(range(0, 7, 2)) produces [0, 2, 4, 6].
- B. "ha" * 3 evaluates to "hahaha".
- C. A set stores a separate copy of every repeated value.
- D. Assigning a new value to an existing dictionary key updates that entry.
- E. Appending to a copied outer list always appends to the original outer list.

## Question 14 (4 points)

B - Select all that apply

Select ALL appropriate actions when preparing a real-world dataset.

- A. Check whether duplicate rows are accidental repeated records.
- B. Automatically delete every unusual measurement.
- C. Convert different measurement units to one consistent unit.
- D. Investigate why some values are missing.
- E. Check whether an apparent outlier could be a valid observation.

## Question 15 (4 points)

B - Select all that apply

For the dataset 2, 3, 5, 6, 9, select ALL correct statements.

- A. The median is 6.
- B. The mean is 5.
- C. The range is 7.
- D. Adding 10 to every value leaves the range unchanged.
- E. Doubling every value leaves the mean unchanged.

## Question 16 (4 points)

B - Select all that apply

Select ALL correct statements about algorithms and data structures.

- A. Standard binary search relies on appropriately ordered data.
- B. A queue normally removes the oldest waiting item first.
- C. A stack normally removes the oldest item first.
- D. Standard selection sort always makes exactly n^2 comparisons.
- E. Five distinct items have 10 unordered pairs of different items.

## Question 17 (4 points)

B - Select all that apply

Select ALL correct statements about machine learning.

- A. K-Means needs a class label for every example.
- B. The sigmoid in logistic regression outputs a value between 0 and 1.
- C. Changing feature scales can change KNN distances and predictions.
- D. Perfect training accuracy guarantees perfect test accuracy.
- E. Linear regression is normally used to predict numerical quantities.

## Question 18 (4 points)

B - Select all that apply

Select ALL appropriate practices for an AI classification project.

- A. Fit learned scaling parameters using the training data only.
- B. Repeatedly use the final test set to select the best model settings.
- C. Inspect class-specific errors when one class is rare.
- D. Provide human review for consequential decisions.
- E. Assume removing one sensitive feature always guarantees fairness.

## Question 19 (5 points)

C - Short Answer I

What is printed?
```python
values = [5, 8, 3, 6, 10]
score = 0
for i in range(len(values)):
    if values[i] % 2 == 0:
        score += values[i] // 2
    else:
        score -= 1
print(score)
```


## Question 20 (5 points)

C - Short Answer I

Complete both blanks so that the program counts each item and prints how many more pens than books there are. Also give the printed value.
```python
items = ["pen", "book", "pen", "ruler", "book", "pen"]
counts = {}
for item in items:
    counts[item] = ____________________
print(____________________)
```


## Question 21 (5 points)

C - Short Answer I

Trace the exact binary search. Give final left, right, and checks.
```python
a = [1, 4, 8, 12, 16, 20, 24]
target = 14
left = 0
right = len(a) - 1
checks = 0
while left <= right:
    mid = (left + right) // 2
    checks += 1
    if a[mid] == target:
        break
    elif a[mid] < target:
        left = mid + 1
    else:
        right = mid - 1
```


## Question 22 (5 points)

C - Short Answer I

Two linear-regression models are evaluated on (x,y)=(0,1),(1,4),(2,5).
Model A: y_hat=2x+1.
Model B: y_hat=3x+1.
Calculate each model's three predictions and MSE, then identify the lower-MSE model. Use MSE=sum((y-y_hat)^2)/n.


## Question 23 (8 points)

D - Short Answer II

K-Means starts with C1=(0,0) and C2=(6,4). Points are (0,0),(2,0),(5,3),(7,3).
(a) Assign all points using the initial centers. [4 points]
(b) Calculate the new C1. [2 points]
(c) Calculate the new C2. [2 points]
Compare squared Euclidean distances; perform one assignment/update round.


## Question 24 (8 points)

D - Short Answer II

A logistic-regression model computes z=0.7x1-0.4x2-0.2 and p=1/(1+e^(-z)). For x1=3,x2=1 use e^(-1.5) approximately 0.223.
(a) Calculate z. [2 points]
(b) Calculate p to three decimal places. [3 points]
(c) Predict the class at threshold 0.5. [1 point]
(d) Predict the class at threshold 0.85. [2 points]
Predict class 1 if p is at least the threshold; otherwise class 0.


## Question 25 (8 points)

D - Short Answer II

Write Python code using loops and conditionals that prints the length of the longest contiguous block of equal values. For example, the three consecutive 5s below form one block.
```python
data = [2, 2, 5, 5, 5, 1, 1, 4]
```
The program must print the correct answer for these data. Do not sort the list. [8 points]


## Question 26 (8 points)

D - Short Answer II

A 3-NN classifier uses feature bounds 0<=x1<=40 and 0<=x2<=400. Query P=(20,100).
Labeled points:
A=(16,180), Class A
B=(36,104), Class B
C=(24,20), Class A
D=(8,96), Class B
(a) Min-max scale P and all four examples using x_scaled=(x-min)/(max-min). [3 points]
(b) Give the three nearest examples using scaled squared Euclidean distance, then predict the class. [3 points]
(c) Predict using raw features and explain any change. [2 points]

