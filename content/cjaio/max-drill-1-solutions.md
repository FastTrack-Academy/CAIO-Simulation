# Max's CJAIO Drill Test 1 - Solutions and Marking Guide

Independently prepared answer key for this original drill. Accept equivalent valid written solutions and award partial credit using the guidance.

## Question 1 (2 points)

**Answer:**

D. [4, 2, 5]

**Explanation / marking guidance:**

Selected indices are 1, 3, and 5. The stop index 6 is excluded.

## Question 2 (2 points)

**Answer:**

A. Labeling a photo as cat or dog

**Explanation / marking guidance:**

Cat/dog are categories. Height, rainfall amount, and a future count are numerical targets; grouping unlabeled songs is clustering.

## Question 3 (2 points)

**Answer:**

C. RBT

**Explanation / marking guidance:**

Indices 0, 2, and 4 select R, B, and T.

## Question 4 (2 points)

**Answer:**

B. 2

**Explanation / marking guidance:**

Counts are sun:3, rain:2, wind:1. The expression is 3-2+1=2.

## Question 5 (2 points)

**Answer:**

E. 8/15

**Explanation / marking guidance:**

Add the two possible orders: (2/6)(4/5)+(4/6)(2/5)=8/15.

## Question 6 (2 points)

**Answer:**

C. Mean = 8; median = 7

**Explanation / marking guidance:**

The sum is 48, so the mean is 8. With six sorted values, the median is (5+9)/2=7.

## Question 7 (2 points)

**Answer:**

A. 4

**Explanation / marking guidance:**

The midpoint indices are 2, 4, 3. Final boundaries are left=4, right=3. Index 4 is the insertion position before 23.

## Question 8 (2 points)

**Answer:**

D. 4

**Explanation / marking guidance:**

Qualifying pairs are (2,0), (3,1), (4,0), and (4,2). Each adds one, for a total of 4.

## Question 9 (2 points)

**Answer:**

E. 2 0 3

**Explanation / marking guidance:**

a and b have separate outer lists but share their original inner lists. The edit changes a[1][0]; the append changes only b's length.

## Question 10 (2 points)

**Answer:**

B. Class A

**Explanation / marking guidance:**

Squared distances in the given order are 1,4,1,9,16. The three nearest labels are A,A,B, so the majority class is A.

## Question 11 (2 points)

**Answer:**

C. 1/3

**Explanation / marking guidance:**

The left child is pure (Gini 0); the right child has Gini 1/2. Weighting by sizes gives (2/6)*0+(4/6)*(1/2)=1/3.

## Question 12 (2 points)

**Answer:**

A. 3 3

**Explanation / marking guidance:**

The passes make 2,1,0 swaps. The sorted list is [1,2,3,4], so the first two items sum to 3.

## Question 13 (4 points)

**Answer:**

["A","B","D"]

**Explanation / marking guidance:**

A, B, D are true. Sets remove duplicate elements; a new outer list can be appended to independently.

## Question 14 (4 points)

**Answer:**

["A","C","D","E"]

**Explanation / marking guidance:**

A, C, D, E are appropriate. An unusual value needs investigation; automatic deletion can discard valid information.

## Question 15 (4 points)

**Answer:**

["B","C","D"]

**Explanation / marking guidance:**

Sum 25 gives mean 5; the middle value is 5; range is 9-2=7. Translation preserves range, whereas doubling values doubles their mean.

## Question 16 (4 points)

**Answer:**

["A","B","E"]

**Explanation / marking guidance:**

A, B, E are true. A stack uses LIFO. Standard selection sort compares n(n-1)/2 pairs; 5*4/2=10.

## Question 17 (4 points)

**Answer:**

["B","C","E"]

**Explanation / marking guidance:**

B, C, E are true. K-Means is unsupervised; performance on training examples does not guarantee generalization.

## Question 18 (4 points)

**Answer:**

["A","C","D"]

**Explanation / marking guidance:**

A, C, D are appropriate. Test-set tuning leaks information; other features may act as proxies for a removed sensitive attribute.

## Question 19 (5 points)

**Answer:**

10

**Explanation / marking guidance:**

The updates are -1,+4,-1,+3,+5, giving 10.

## Question 20 (5 points)

**Answer:**

First blank: counts.get(item, 0) + 1
Second blank: counts["pen"] - counts["book"]
Output: 1.

**Explanation / marking guidance:**

Marking (5 points): correct frequency update 2; correct difference expression 2; output 1 point. Counts are pen:3, book:2, ruler:1. Accept equivalent expressions.

## Question 21 (5 points)

**Answer:**

left=4, right=3, checks=3.

**Explanation / marking guidance:**

Midpoint/value pairs: (3,12), (5,20), (4,16). The target is absent. Marking: valid trace 2 points; each final value 1 point.

## Question 22 (5 points)

**Answer:**

A predicts [1,3,5]; squared errors [0,1,0]; MSE=1/3.
B predicts [1,4,7]; squared errors [0,0,4]; MSE=4/3.
Model A has lower MSE on these data.

**Explanation / marking guidance:**

Marking (5 points): predictions and MSE for each model 2 points each; correct comparison 1. Accept exact fractions or appropriate decimals.

## Question 23 (8 points)

**Answer:**

Cluster 1: (0,0),(2,0); new C1=(1,0).
Cluster 2: (5,3),(7,3); new C2=(6,3).

**Explanation / marking guidance:**

Squared distances to C1/C2 respectively: (0,52),(4,32),(34,2),(58,2). Award 1 point per assignment and 2 per coordinate-wise center. Assign all points before updating either center.

## Question 24 (8 points)

**Answer:**

z=1.5; p=1/1.223=0.818 to three decimals.
At threshold 0.5: class 1. At threshold 0.85: class 0.

**Explanation / marking guidance:**

z=2.1-0.4-0.2=1.5. Using the supplied exponential, p is approximately 0.81766. The probability stays fixed when only the threshold changes. Use the point allocation in the question.

## Question 25 (8 points)

**Answer:**

Output: 3. One solution:
```python
def longest_equal_run(data):
    if not data:
        return 0
    current = best = 1
    for i in range(1, len(data)):
        if data[i] == data[i - 1]:
            current += 1
        else:
            current = 1
        if current > best:
            best = current
    return best

data = [2, 2, 5, 5, 5, 1, 1, 4]
print(longest_equal_run(data))
```

**Explanation / marking guidance:**

Accept equivalent correct code. Marking: initialize run state 2; extend on equality and reset on a change 3; maintain the best length 2; correct printed result 1. The example solution also handles an empty list (0) and a single item (1).

## Question 26 (8 points)

**Answer:**

Scaled P=(0.5,0.25); A=(0.4,0.45); B=(0.9,0.26); C=(0.6,0.05); D=(0.2,0.24).
Scaled squared distances: A=0.05, B=0.1601, C=0.05, D=0.0901. Neighbors A,C,D predict Class A.
Raw squared distances: A=6416, B=272, C=6416, D=160. Neighbors D,B,and either A or C predict Class B.

**Explanation / marking guidance:**

Use the question's 3+3+2 allocation. A and C tie but have the same class, so the raw boundary tie cannot alter the vote. Larger raw differences on feature 2 dominate distance here; scaling changes relative contributions and neighbor order.
