# Max's CJAIO Drill Test 2 - Solutions and Marking Guide

Independently prepared answer key for this original drill. Accept equivalent valid written solutions and award partial credit using the guidance.

## Question 1 (2 points)

**Answer:**

B. [15, 9, 3]

**Explanation / marking guidance:**

Start at index -2 (index 5), move backward by 2, and exclude index 0: indices 5,3,1 give [15,9,3].

## Question 2 (2 points)

**Answer:**

D. 9

**Explanation / marking guidance:**

f(1)=1, f(3)=1+3=4, and f(5)=4+5=9. The argument decreases by 2, not by 1.

## Question 3 (2 points)

**Answer:**

A. 18

**Explanation / marking guidance:**

List repetition initially shares one inner list three times. Its edit changes all three references. Replacing rows[2] then gives [[7,1],[7,1],[4,5]], whose first entries sum to 18.

## Question 4 (2 points)

**Answer:**

E. 2

**Explanation / marking guidance:**

The counter increments when 2 appears for the second time and when 5 appears for the second time. The third 2 does not satisfy count==2.

## Question 5 (2 points)

**Answer:**

C. 3/5

**Explanation / marking guidance:**

There are C(5,3)=10 equally likely three-counter subsets; C(3,2)*C(2,1)=6 are favorable. Alternatively, each of RRB, RBR, BRR has probability 1/5, giving 3/5.

## Question 6 (2 points)

**Answer:**

D. Week 3 to Week 4 is an increase of 33 1/3%.

**Explanation / marking guidance:**

Week 3 to 4 increases by 15 relative to 45: 15/45=1/3. Week 1 to 2 is +25%; Week 2 to 3 is a decrease.

## Question 7 (2 points)

**Answer:**

A. 1

**Explanation / marking guidance:**

This finds the first index whose value is at least 4, which is index 1. Finding an equal midpoint does not stop this version of search.

## Question 8 (2 points)

**Answer:**

B. 8

**Explanation / marking guidance:**

Qualifying pairs are (2,1),(3,0),(4,2),(5,1),(5,4). Add the j values: 1+0+2+1+4=8.

## Question 9 (2 points)

**Answer:**

E. 5

**Explanation / marking guidance:**

The first pass makes 3 comparisons and one swap. The second makes 2 comparisons and no swaps, so it stops at 5 comparisons.

## Question 10 (2 points)

**Answer:**

C. k=1 predicts A; k=3 predicts B.

**Explanation / marking guidance:**

Squared distances are 1,4,5,9. The closest example is A, but the closest three vote A,B,B.

## Question 11 (2 points)

**Answer:**

B. Y, because its weighted Gini is 1/3, below X's 3/8.

**Explanation / marking guidance:**

X has two equal-sized children with Gini 3/8. Y has Gini (2/8)*0+(6/8)*(4/9)=1/3. The unweighted right-child impurity 4/9 is not Y's weighted result.

## Question 12 (2 points)

**Answer:**

D. 2

**Explanation / marking guidance:**

At 0.5 the last three are positive; at 0.75 only 0.90 is positive. The estimates 0.55 and 0.70 switch decisions; their probabilities do not change.

## Question 13 (4 points)

**Answer:**

["A","C","E"]

**Explanation / marking guidance:**

A, C, E are true. copy() is shallow. Floor division rounds downward, so -3//2=-2, rather than -1.

## Question 14 (4 points)

**Answer:**

["A","C","E"]

**Explanation / marking guidance:**

A, C, E prevent leakage or support model selection. Repeated students across splits can make new-student performance look too good. Full-data scaling can leak information; missingness should be investigated.

## Question 15 (4 points)

**Answer:**

["A","C","D"]

**Explanation / marking guidance:**

New sum is 120 across five values, so mean=24. Sorted middle value is 6; range=100-2=98. Before the append, median=(4+6)/2=5.

## Question 16 (4 points)

**Answer:**

["A","B","C","D"]

**Explanation / marking guidance:**

A: 8*7/2=28. B: n+n=2n. C: (2n)^2=4n^2. D describes the base case and decreasing work. E is false because standard binary search relies on order.

## Question 17 (4 points)

**Answer:**

["A","B","C"]

**Explanation / marking guidance:**

A, B, C are true. A feature can perfectly separate mixed labels. Training fit does not guarantee test performance; unsupervised cluster IDs have no fixed class meaning.

## Question 18 (4 points)

**Answer:**

["A","C","D"]

**Explanation / marking guidance:**

A, C, D are true. Majority-class predictions can hide minority failure. Proxy variables and biased data can preserve unfairness; human oversight can help detect and correct errors.

## Question 19 (5 points)

**Answer:**

5

**Explanation / marking guidance:**

Changes are -1,+3,-1,+4, giving 5. The first comparison uses indices 1 and 0.

## Question 20 (5 points)

**Answer:**

First blank: total >= target
Second blank: i
Output: 2.

**Explanation / marking guidance:**

Running sums are 2,3,7,10. The first qualifying sum is 7 at index 2. Marking: condition 2 points; return the index (not the value or sum) 2; output 1.

## Question 21 (5 points)

**Answer:**

left=4, right=3, checks=3. The insertion position is after all existing 3s, before 8.

**Explanation / marking guidance:**

Midpoint/value pairs are (2,3),(4,8),(3,3). The <= condition moves past equal values, producing an upper bound. Marking: each final value 1 point; correct insertion interpretation 2.

## Question 22 (5 points)

**Answer:**

A predicts [2,5,8], squared errors [0,1,4], validation MSE=5/3.
B predicts [3,5,7], squared errors [1,1,1], validation MSE=1.
Prefer B on this validation set. Lower training error does not guarantee better generalization.

**Explanation / marking guidance:**

Marking: predictions and MSE for each model 2 points each; validation-based choice and explanation 1. These data suggest a generalization gap but do not alone prove the mechanism causing it.

## Question 23 (8 points)

**Answer:**

Round 1: Cluster 1={(0,0),(2,0)}; Cluster 2={(3,0),(9,0),(10,0)}.
First centers: C1=(1,0), C2=(22/3,0).
Round 2: Cluster 1={(0,0),(2,0),(3,0)}; Cluster 2={(9,0),(10,0)}.
Second centers: C1=(5/3,0), C2=(19/2,0).

**Explanation / marking guidance:**

The point (2,0) initially ties and follows the explicit Cluster 1 rule. After the first update, (3,0) moves to Cluster 1. Assign every point using the old centers before computing new means. Award 2 points per requested step with partial credit for sound work.

## Question 24 (8 points)

**Answer:**

A: z=1.5; p=1/1.223=0.818. B: z=-1.5; p=1/5.482=0.182.
Threshold 0.5: A is class 1, B is class 0. Threshold 0.85: both are class 0.
Only the class decision can change; the fixed scores and probability estimates do not.

**Explanation / marking guidance:**

Marking follows the 2+2+2+2 allocation. For each of (a) and (b), award 1 per example. For (c), award 1 per complete threshold pair. Example B uses e^(-z)=e^(1.5), not e^(-1.5).

## Question 25 (8 points)

**Answer:**

Output: (0, 3). One solution:
```python
def longest_run(data):
    if not data:
        return (-1, 0)
    start = best_start = 0
    current = best = 1
    for i in range(1, len(data)):
        if data[i] > data[i - 1]:
            current += 1
        else:
            start = i
            current = 1
        if current > best:
            best = current
            best_start = start
    return (best_start, best)

data = [4, 6, 8, 2, 5, 7, 1, 3]
print(longest_run(data))
```

**Explanation / marking guidance:**

Accept equivalent correct one-pass code. Marking: empty case and valid initialization 2; extend/reset current run and start 2; maintain best start/length and preserve the earliest tie 2; return the pair 1; correct output 1. Update the best only for a strictly longer run; equal neighboring values break a run.

## Question 26 (8 points)

**Answer:**

Accuracy: A=90%, B=88%. Spam recall: A=0%, B=80%.
Prefer B for the stated priority: it catches 8 spam messages rather than 0, while wrongly flagging 10 ordinary messages for human review.
Privacy example: restrict message-text access to authorized reviewers and remove unnecessary personal identifiers before analysis.

**Explanation / marking guidance:**

Award 1 point per accuracy and per recall. For (c), 1 for B with the stated priority and 1 for the false-positive trade-off. For (d), 2 for a concrete appropriate safeguard (e.g. minimizing retained message content, access controls, or de-identifying unnecessary personal details); a vague claim that AI is private is insufficient.
