"""Build the two original Max's CJAIO drills and editable question/solution files.

Run with: python scripts/build-cjaio-drills.py
Only Python's standard library is needed. Difficulty is calibrated to the two
supplied CJAIO practice sets, rather than an official difficulty rating.
"""
import json
from pathlib import Path
from textwrap import dedent

ROOT = Path(__file__).resolve().parents[1]


def code(source):
    return '```python\n' + dedent(source).strip() + '\n```'


def choice(text, options, correct, explanation):
    assert len(options) == 5
    return dict(text=text, options=[f'{letter}. {value}' for letter, value in zip('ABCDE', options)],
                key=correct, explanation=explanation)


def written(text, answer, explanation):
    return dict(text=text, options=[], key=answer, explanation=explanation)


EQUAL_RUN = code('''
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
''')

EARLIEST_RUN = code('''
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
''')

equivalent = [
    choice('What is printed?\n' + code('''
        a = [11, 4, 9, 2, 7, 5]
        print(a[1:6:2])
    '''), ['[11, 9, 7]', '[4, 9, 2]', '[4, 2]', '[4, 2, 5]', '[9, 7]'], 'D',
           'Selected indices are 1, 3, and 5. The stop index 6 is excluded.'),
    choice('Which task is most naturally a classification problem?',
           ['Labeling a photo as cat or dog', 'Predicting a plant\'s height in centimeters',
            'Predicting tomorrow\'s rainfall amount', 'Grouping unlabeled songs by similarity',
            'Predicting the number of books borrowed tomorrow'], 'A',
           'Cat/dog are categories. Height, rainfall amount, and a future count are numerical targets; grouping unlabeled songs is clustering.'),
    choice('What is printed?\n' + code('''
        word = "ROBOT"
        result = ""
        for i in range(0, len(word), 2):
            result += word[i]
        print(result)
    '''), ['ROO', 'OOT', 'RBT', 'RBO', 'BOT'], 'C',
           'Indices 0, 2, and 4 select R, B, and T.'),
    choice('What is printed?\n' + code('''
        weather = ["sun", "rain", "sun", "wind", "rain", "sun"]
        freq = {}
        for item in weather:
            freq[item] = freq.get(item, 0) + 1
        print(freq["sun"] - freq["rain"] + freq["wind"])
    '''), ['1', '2', '3', '4', '6'], 'B',
           'Counts are sun:3, rain:2, wind:1. The expression is 3-2+1=2.'),
    choice('A bag contains 2 blue counters and 4 gold counters. Two counters are drawn without replacement. What is the probability of drawing exactly one of each color?',
           ['2/9', '4/15', '1/3', '2/3', '8/15'], 'E',
           'Add the two possible orders: (2/6)(4/5)+(4/6)(2/5)=8/15.'),
    choice('For the dataset 2, 4, 5, 9, 10, 18, which statement is correct?',
           ['Mean = 7; median = 8', 'Mean = 8; median = 5', 'Mean = 8; median = 7',
            'Mean = 9; median = 7', 'Mean = 7; median = 9'], 'C',
           'The sum is 48, so the mean is 8. With six sorted values, the median is (5+9)/2=7.'),
    choice('What is printed by this search on an ascending list?\n' + code('''
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
    '''), ['4', '3', '2', '5', '17'], 'A',
           'The midpoint indices are 2, 4, 3. Final boundaries are left=4, right=3. Index 4 is the insertion position before 23.'),
    choice('What is the final value printed?\n' + code('''
        total = 0
        for i in range(1, 5):
            for j in range(i):
                if (i + j) % 2 == 0:
                    total += 1
        print(total)
    '''), ['2', '3', '5', '4', '6'], 'D',
           'Qualifying pairs are (2,0), (3,1), (4,0), and (4,2). Each adds one, for a total of 4.'),
    choice('What is printed?\n' + code('''
        a = [[2, 4], [6, 8]]
        b = a.copy()
        b[1][0] = 0
        b.append([9, 9])
        print(len(a), a[1][0], len(b))
    '''), ['2 6 3', '3 0 3', '2 6 2', '3 6 3', '2 0 3'], 'E',
           'a and b have separate outer lists but share their original inner lists. The edit changes a[1][0]; the append changes only b\'s length.'),
    choice('An unweighted KNN classifier uses Euclidean distance and k=3. Predict the class of P=(4,3).\n'
           'Labeled points:\n(3,3): Class A\n(4,5): Class B\n(5,3): Class A\n(4,0): Class B\n(8,3): Class B',
           ['Class B', 'Class A', 'A tie between A and B', 'The point must be assigned to a new cluster', 'KNN cannot use two features'], 'B',
           'Squared distances in the given order are 1,4,1,9,16. The three nearest labels are A,A,B, so the majority class is A.'),
    choice('A decision-tree split has a left child with 2 positive and 0 negative examples and a right child with 2 positive and 2 negative examples. Using Gini=1-p_positive^2-p_negative^2, what is the weighted child Gini?',
           ['1/2', '1/4', '1/3', '2/3', '0'], 'C',
           'The left child is pure (Gini 0); the right child has Gini 1/2. Weighting by sizes gives (2/6)*0+(4/6)*(1/2)=1/3.'),
    choice('What is printed by the sorting program?\n' + code('''
        nums = [3, 1, 4, 2]
        swaps = 0
        for i in range(len(nums) - 1):
            for j in range(len(nums) - 1 - i):
                if nums[j] > nums[j + 1]:
                    nums[j], nums[j + 1] = nums[j + 1], nums[j]
                    swaps += 1
        print(swaps, sum(nums[:2]))
    '''), ['3 3', '2 3', '3 5', '4 3', '4 5'], 'A',
           'The passes make 2,1,0 swaps. The sorted list is [1,2,3,4], so the first two items sum to 3.'),
    choice('Select ALL correct statements about Python.',
           ['list(range(0, 7, 2)) produces [0, 2, 4, 6].',
            '"ha" * 3 evaluates to "hahaha".',
            'A set stores a separate copy of every repeated value.',
            'Assigning a new value to an existing dictionary key updates that entry.',
            'Appending to a copied outer list always appends to the original outer list.'], 'ABD',
           'A, B, D are true. Sets remove duplicate elements; a new outer list can be appended to independently.'),
    choice('Select ALL appropriate actions when preparing a real-world dataset.',
           ['Check whether duplicate rows are accidental repeated records.',
            'Automatically delete every unusual measurement.',
            'Convert different measurement units to one consistent unit.',
            'Investigate why some values are missing.',
            'Check whether an apparent outlier could be a valid observation.'], 'ACDE',
           'A, C, D, E are appropriate. An unusual value needs investigation; automatic deletion can discard valid information.'),
    choice('For the dataset 2, 3, 5, 6, 9, select ALL correct statements.',
           ['The median is 6.', 'The mean is 5.', 'The range is 7.',
            'Adding 10 to every value leaves the range unchanged.',
            'Doubling every value leaves the mean unchanged.'], 'BCD',
           'Sum 25 gives mean 5; the middle value is 5; range is 9-2=7. Translation preserves range, whereas doubling values doubles their mean.'),
    choice('Select ALL correct statements about algorithms and data structures.',
           ['Standard binary search relies on appropriately ordered data.',
            'A queue normally removes the oldest waiting item first.',
            'A stack normally removes the oldest item first.',
            'Standard selection sort always makes exactly n^2 comparisons.',
            'Five distinct items have 10 unordered pairs of different items.'], 'ABE',
           'A, B, E are true. A stack uses LIFO. Standard selection sort compares n(n-1)/2 pairs; 5*4/2=10.'),
    choice('Select ALL correct statements about machine learning.',
           ['K-Means needs a class label for every example.',
            'The sigmoid in logistic regression outputs a value between 0 and 1.',
            'Changing feature scales can change KNN distances and predictions.',
            'Perfect training accuracy guarantees perfect test accuracy.',
            'Linear regression is normally used to predict numerical quantities.'], 'BCE',
           'B, C, E are true. K-Means is unsupervised; performance on training examples does not guarantee generalization.'),
    choice('Select ALL appropriate practices for an AI classification project.',
           ['Fit learned scaling parameters using the training data only.',
            'Repeatedly use the final test set to select the best model settings.',
            'Inspect class-specific errors when one class is rare.',
            'Provide human review for consequential decisions.',
            'Assume removing one sensitive feature always guarantees fairness.'], 'ACD',
           'A, C, D are appropriate. Test-set tuning leaks information; other features may act as proxies for a removed sensitive attribute.'),
    written('What is printed?\n' + code('''
        values = [5, 8, 3, 6, 10]
        score = 0
        for i in range(len(values)):
            if values[i] % 2 == 0:
                score += values[i] // 2
            else:
                score -= 1
        print(score)
    '''), '10', 'The updates are -1,+4,-1,+3,+5, giving 10.'),
    written('Complete both blanks so that the program counts each item and prints how many more pens than books there are. Also give the printed value.\n' + code('''
        items = ["pen", "book", "pen", "ruler", "book", "pen"]
        counts = {}
        for item in items:
            counts[item] = ____________________
        print(____________________)
    '''), 'First blank: counts.get(item, 0) + 1\nSecond blank: counts["pen"] - counts["book"]\nOutput: 1.',
            'Marking (5 points): correct frequency update 2; correct difference expression 2; output 1 point. Counts are pen:3, book:2, ruler:1. Accept equivalent expressions.'),
    written('Trace the exact binary search. Give final left, right, and checks.\n' + code('''
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
    '''), 'left=4, right=3, checks=3.',
            'Midpoint/value pairs: (3,12), (5,20), (4,16). The target is absent. Marking: valid trace 2 points; each final value 1 point.'),
    written('Two linear-regression models are evaluated on (x,y)=(0,1),(1,4),(2,5).\nModel A: y_hat=2x+1.\nModel B: y_hat=3x+1.\nCalculate each model\'s three predictions and MSE, then identify the lower-MSE model. Use MSE=sum((y-y_hat)^2)/n.',
            'A predicts [1,3,5]; squared errors [0,1,0]; MSE=1/3.\nB predicts [1,4,7]; squared errors [0,0,4]; MSE=4/3.\nModel A has lower MSE on these data.',
            'Marking (5 points): predictions and MSE for each model 2 points each; correct comparison 1. Accept exact fractions or appropriate decimals.'),
    written('K-Means starts with C1=(0,0) and C2=(6,4). Points are (0,0),(2,0),(5,3),(7,3).\n(a) Assign all points using the initial centers. [4 points]\n(b) Calculate the new C1. [2 points]\n(c) Calculate the new C2. [2 points]\nCompare squared Euclidean distances; perform one assignment/update round.',
            'Cluster 1: (0,0),(2,0); new C1=(1,0).\nCluster 2: (5,3),(7,3); new C2=(6,3).',
            'Squared distances to C1/C2 respectively: (0,52),(4,32),(34,2),(58,2). Award 1 point per assignment and 2 per coordinate-wise center. Assign all points before updating either center.'),
    written('A logistic-regression model computes z=0.7x1-0.4x2-0.2 and p=1/(1+e^(-z)). For x1=3,x2=1 use e^(-1.5) approximately 0.223.\n(a) Calculate z. [2 points]\n(b) Calculate p to three decimal places. [3 points]\n(c) Predict the class at threshold 0.5. [1 point]\n(d) Predict the class at threshold 0.85. [2 points]\nPredict class 1 if p is at least the threshold; otherwise class 0.',
            'z=1.5; p=1/1.223=0.818 to three decimals.\nAt threshold 0.5: class 1. At threshold 0.85: class 0.',
            'z=2.1-0.4-0.2=1.5. Using the supplied exponential, p is approximately 0.81766. The probability stays fixed when only the threshold changes. Use the point allocation in the question.'),
    written('Write Python code using loops and conditionals that prints the length of the longest contiguous block of equal values. For example, the three consecutive 5s below form one block.\n' + code('data = [2, 2, 5, 5, 5, 1, 1, 4]') + '\nThe program must print the correct answer for these data. Do not sort the list. [8 points]',
            'Output: 3. One solution:\n' + EQUAL_RUN,
            'Accept equivalent correct code. Marking: initialize run state 2; extend on equality and reset on a change 3; maintain the best length 2; correct printed result 1. The example solution also handles an empty list (0) and a single item (1).'),
    written('A 3-NN classifier uses feature bounds 0<=x1<=40 and 0<=x2<=400. Query P=(20,100).\nLabeled points:\nA=(16,180), Class A\nB=(36,104), Class B\nC=(24,20), Class A\nD=(8,96), Class B\n(a) Min-max scale P and all four examples using x_scaled=(x-min)/(max-min). [3 points]\n(b) Give the three nearest examples using scaled squared Euclidean distance, then predict the class. [3 points]\n(c) Predict using raw features and explain any change. [2 points]',
            'Scaled P=(0.5,0.25); A=(0.4,0.45); B=(0.9,0.26); C=(0.6,0.05); D=(0.2,0.24).\nScaled squared distances: A=0.05, B=0.1601, C=0.05, D=0.0901. Neighbors A,C,D predict Class A.\nRaw squared distances: A=6416, B=272, C=6416, D=160. Neighbors D,B,and either A or C predict Class B.',
            'Use the question\'s 3+3+2 allocation. A and C tie but have the same class, so the raw boundary tie cannot alter the vote. Larger raw differences on feature 2 dominate distance here; scaling changes relative contributions and neighbor order.'),
]

harder = [
    choice('What is printed?\n' + code('''
        a = [0, 3, 6, 9, 12, 15, 18]
        print(a[-2:0:-2])
    '''), ['[18, 12, 6]', '[15, 9, 3]', '[15, 9, 3, 0]', '[3, 9, 15]', '[15, 12, 9]'], 'B',
           'Start at index -2 (index 5), move backward by 2, and exclude index 0: indices 5,3,1 give [15,9,3].'),
    choice('What is printed by this recursive function?\n' + code('''
        def f(n):
            if n <= 1:
                return 1
            return f(n - 2) + n

        print(f(5))
    '''), ['5', '6', '8', '9', '15'], 'D',
           'f(1)=1, f(3)=1+3=4, and f(5)=4+5=9. The argument decreases by 2, not by 1.'),
    choice('What is printed?\n' + code('''
        rows = [[0, 1]] * 3
        rows[1][0] = 7
        rows[2] = [4, 5]
        print(rows[0][0] + rows[1][0] + rows[2][0])
    '''), ['18', '11', '21', '4', '7'], 'A',
           'List repetition initially shares one inner list three times. Its edit changes all three references. Replacing rows[2] then gives [[7,1],[7,1],[4,5]], whose first entries sum to 18.'),
    choice('What is printed?\n' + code('''
        counts = {}
        repeated = 0
        for x in [2, 5, 2, 2, 5, 7]:
            counts[x] = counts.get(x, 0) + 1
            if counts[x] == 2:
                repeated += 1
        print(repeated)
    '''), ['1', '3', '4', '5', '2'], 'E',
           'The counter increments when 2 appears for the second time and when 5 appears for the second time. The third 2 does not satisfy count==2.'),
    choice('A bag has 3 red counters and 2 blue counters. Three counters are drawn without replacement. What is the probability of exactly 2 red counters and 1 blue counter?',
           ['1/5', '2/5', '3/5', '4/5', '9/25'], 'C',
           'There are C(5,3)=10 equally likely three-counter subsets; C(3,2)*C(2,1)=6 are favorable. Alternatively, each of RRB, RBR, BRR has probability 1/5, giving 3/5.'),
    choice('A line graph records these visitor counts:\nWeek 1: 40\nWeek 2: 50\nWeek 3: 45\nWeek 4: 60\nWhich statement is correct?',
           ['The largest increase is from Week 2 to Week 3.',
            'Week 1 to Week 2 is an increase of 10%.',
            'The count increases every week.',
            'Week 3 to Week 4 is an increase of 33 1/3%.',
            'Week 4 has twice the visitors of Week 1.'], 'D',
           'Week 3 to 4 increases by 15 relative to 45: 15/45=1/3. Week 1 to 2 is +25%; Week 2 to 3 is a decrease.'),
    choice('This ascending list contains duplicates. What is printed?\n' + code('''
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
    '''), ['1', '2', '3', '4', 'An error occurs'], 'A',
           'This finds the first index whose value is at least 4, which is index 1. Finding an equal midpoint does not stop this version of search.'),
    choice('What is printed? Note which variable is added to total.\n' + code('''
        total = 0
        for i in range(1, 6):
            for j in range(i):
                if (i + j) % 3 == 0:
                    total += j
        print(total)
    '''), ['5', '8', '14', '19', '20'], 'B',
           'Qualifying pairs are (2,1),(3,0),(4,2),(5,1),(5,4). Add the j values: 1+0+2+1+4=8.'),
    choice('This bubble sort stops after a pass with no swaps. What is printed?\n' + code('''
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
    '''), ['1', '3', '4', '6', '5'], 'E',
           'The first pass makes 3 comparisons and one swap. The second makes 2 comparisons and no swaps, so it stops at 5 comparisons.'),
    choice('An unweighted KNN classifier uses Euclidean distance. For P=(0,0), the examples are (1,0):A, (0,2):B, (2,1):B, (-3,0):A. What happens when k changes from 1 to 3?',
           ['Both predict A.', 'Both predict B.', 'k=1 predicts A; k=3 predicts B.',
            'k=1 predicts B; k=3 predicts A.', 'Both votes are tied.'], 'C',
           'Squared distances are 1,4,5,9. The closest example is A, but the closest three vote A,B,B.'),
    choice('Eight examples have 4 positive and 4 negative labels. Compare two tree splits.\nSplit X: left 3 positive/1 negative; right 1 positive/3 negative.\nSplit Y: left 2 positive/0 negative; right 2 positive/4 negative.\nUsing Gini=1-p_positive^2-p_negative^2, choose the split with LOWER weighted child Gini.',
           ['X, because its weighted Gini is 3/8 and that is lower.',
            'Y, because its weighted Gini is 1/3, below X\'s 3/8.',
            'They tie at weighted Gini 3/8.', 'X, because its weighted Gini is 1/4.',
            'Y, because its weighted Gini is 4/9 after weighting.'], 'B',
           'X has two equal-sized children with Gini 3/8. Y has Gini (2/8)*0+(6/8)*(4/9)=1/3. The unweighted right-child impurity 4/9 is not Y\'s weighted result.'),
    choice('Four fixed logistic-regression probability estimates are 0.35, 0.55, 0.70, and 0.90. Predict class 1 when p>=threshold. If only the threshold changes from 0.5 to 0.75, how many predictions change from class 1 to class 0?',
           ['0', '1', '3', '2', '4'], 'D',
           'At 0.5 the last three are positive; at 0.75 only 0.90 is positive. The estimates 0.55 and 0.70 switch decisions; their probabilities do not change.'),
    choice('Select ALL correct Python statements.',
           ['After b=a for a list a, both names refer to the same list.',
            'a.copy() always creates independent copies of every nested mutable object.',
            'not (True and False) evaluates to True.',
            'Integer floor division always rounds toward zero.',
            'list(range(5, 0, -2)) produces [5, 3, 1].'], 'ACE',
           'A, C, E are true. copy() is shallow. Floor division rounds downward, so -3//2=-2, rather than -1.'),
    choice('A dataset can contain several records from the same student. Select ALL appropriate evaluation practices.',
           ['Fit a missing-value imputer using the training data only.',
            'Fit a scaler on all data because it does not read class labels.',
            'Keep records from the same student on the same side of a split when evaluating performance on new students.',
            'Assume deleting every row with any missing value is always best.',
            'Use validation data to choose a decision tree\'s depth.'], 'ACE',
           'A, C, E prevent leakage or support model selection. Repeated students across splits can make new-student performance look too good. Full-data scaling can leak information; missingness should be investigated.'),
    choice('Start with 2,4,6,8 and append the value 100. Select ALL correct statements.',
           ['The new mean is 24.', 'The new median is 5.', 'The new range is 98.',
            'The original median was 5.', 'The mean is unchanged.'], 'ACD',
           'New sum is 120 across five values, so mean=24. Sorted middle value is 6; range=100-2=98. Before the append, median=(4+6)/2=5.'),
    choice('Select ALL correct statements about counting and algorithmic reasoning.',
           ['There are 28 pairs of indices satisfying 0<=i<j<8.',
            'Two separate full scans of n items make 2n item visits in total.',
            'Doubling n multiplies an n^2 operation count by four.',
            'A recursive countdown needs a stopping case and progress toward it to terminate for its intended inputs.',
            'Binary search always works correctly on an unsorted list.'], 'ABCD',
           'A: 8*7/2=28. B: n+n=2n. C: (2n)^2=4n^2. D describes the base case and decreasing work. E is false because standard binary search relies on order.'),
    choice('Select ALL correct statements about basic ML models.',
           ['Feature units can affect both KNN and K-Means when they use Euclidean distance.',
            'Logistic regression can estimate a binary-class probability.',
            'A decision-tree split can produce two pure children even if the parent has mixed labels.',
            'The model with lower training MSE must have lower test MSE.',
            'K-Means cluster numbers necessarily have the same meaning as known class labels.'], 'ABC',
           'A, B, C are true. A feature can perfectly separate mixed labels. Training fit does not guarantee test performance; unsupervised cluster IDs have no fixed class meaning.'),
    choice('Select ALL correct statements about evaluation and responsible AI.',
           ['A classifier can have 99% accuracy while missing every example of a rare class.',
            'Removing the sensitive attribute guarantees a model is fair.',
            'Collect only personal information needed for the task.',
            'Evaluate whether data and errors are representative of the intended users.',
            'Removing human oversight always makes AI decisions fairer.'], 'ACD',
           'A, C, D are true. Majority-class predictions can hide minority failure. Proxy variables and biased data can preserve unfairness; human oversight can help detect and correct errors.'),
    written('What is printed?\n' + code('''
        values = [3, 1, 4, 1, 5]
        total = 0
        for i in range(1, len(values)):
            if values[i] > values[i - 1]:
                total += values[i] - values[i - 1]
            else:
                total -= 1
        print(total)
    '''), '5', 'Changes are -1,+3,-1,+4, giving 5. The first comparison uses indices 1 and 0.'),
    written('The function should return the first index where the running sum is at least target, or -1 if this never happens. Complete the two blanks and give the output. All list values in this example are nonnegative.\n' + code('''
        def first_reach(nums, target):
            total = 0
            for i in range(len(nums)):
                total += nums[i]
                if ____________________:
                    return ____________________
            return -1

        print(first_reach([2, 1, 4, 3], 6))
    '''), 'First blank: total >= target\nSecond blank: i\nOutput: 2.',
            'Running sums are 2,3,7,10. The first qualifying sum is 7 at index 2. Marking: condition 2 points; return the index (not the value or sum) 2; output 1.'),
    written('Trace the search and give final left, right, and checks. Explain where left would insert another copy of target relative to the existing copies.\n' + code('''
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
    '''), 'left=4, right=3, checks=3. The insertion position is after all existing 3s, before 8.',
            'Midpoint/value pairs are (2,3),(4,8),(3,3). The <= condition moves past equal values, producing an upper bound. Marking: each final value 1 point; correct insertion interpretation 2.'),
    written('Two linear-regression models have training MSEs A=0.1 and B=0.4. Evaluate them on validation points (1,2),(2,4),(3,6).\nModel A: y_hat=3x-1.\nModel B: y_hat=2x+1.\nCalculate each model\'s validation predictions and MSE. Which model should be preferred using this validation set, and why does A\'s lower training MSE not settle the choice? Use MSE=sum((y-y_hat)^2)/n.',
            'A predicts [2,5,8], squared errors [0,1,4], validation MSE=5/3.\nB predicts [3,5,7], squared errors [1,1,1], validation MSE=1.\nPrefer B on this validation set. Lower training error does not guarantee better generalization.',
            'Marking: predictions and MSE for each model 2 points each; validation-based choice and explanation 1. These data suggest a generalization gap but do not alone prove the mechanism causing it.'),
    written('Perform TWO assignment/update rounds of K-Means on points (0,0),(2,0),(3,0),(9,0),(10,0). Start C1=(0,0), C2=(4,0). If a point is exactly equally distant, assign it to Cluster 1. Use squared Euclidean distances.\n(a) Give the first assignments. [2 points]\n(b) Give the first updated centers. [2 points]\n(c) Reassign using those updated centers. [2 points]\n(d) Give the second updated centers. [2 points]',
            'Round 1: Cluster 1={(0,0),(2,0)}; Cluster 2={(3,0),(9,0),(10,0)}.\nFirst centers: C1=(1,0), C2=(22/3,0).\nRound 2: Cluster 1={(0,0),(2,0),(3,0)}; Cluster 2={(9,0),(10,0)}.\nSecond centers: C1=(5/3,0), C2=(19/2,0).',
            'The point (2,0) initially ties and follows the explicit Cluster 1 rule. After the first update, (3,0) moves to Cluster 1. Assign every point using the old centers before computing new means. Award 2 points per requested step with partial credit for sound work.'),
    written('A logistic-regression model uses z=x1-x2-0.5 and p=1/(1+e^(-z)). Example A has x1=3,x2=1; example B has x1=1,x2=2. Use e^(-1.5) approximately 0.223 and e^(1.5) approximately 4.482. Predict class 1 if p>=threshold.\n(a) Calculate both scores z. [2 points]\n(b) Calculate both probabilities to three decimals. [2 points]\n(c) Give both class predictions at thresholds 0.5 and 0.85. [2 points]\n(d) Explain whether changing the threshold changes z, p, or only the decision when the inputs and model stay fixed. [2 points]',
            'A: z=1.5; p=1/1.223=0.818. B: z=-1.5; p=1/5.482=0.182.\nThreshold 0.5: A is class 1, B is class 0. Threshold 0.85: both are class 0.\nOnly the class decision can change; the fixed scores and probability estimates do not.',
            'Marking follows the 2+2+2+2 allocation. For each of (a) and (b), award 1 per example. For (c), award 1 per complete threshold pair. Example B uses e^(-z)=e^(1.5), not e^(-1.5).'),
    written('Write a Python function that finds the longest contiguous STRICTLY increasing run. Return a pair (start_index, length). If several longest runs tie, choose the earliest start index. For an empty list return (-1,0). Use one pass after initialization, with loops and conditionals; do not sort. Then print the function\'s result on:\n' + code('data = [4, 6, 8, 2, 5, 7, 1, 3]') + '\n[8 points]',
            'Output: (0, 3). One solution:\n' + EARLIEST_RUN,
            'Accept equivalent correct one-pass code. Marking: empty case and valid initialization 2; extend/reset current run and start 2; maintain best start/length and preserve the earliest tie 2; return the pair 1; correct output 1. Update the best only for a strictly longer run; equal neighboring values break a run.'),
    written('A test set has 100 messages: 10 spam and 90 ordinary messages. The two classifiers make these predictions:\nModel A: 0 spam correctly caught; 10 spam missed; 90 ordinary correctly accepted; 0 ordinary wrongly flagged.\nModel B: 8 spam correctly caught; 2 spam missed; 80 ordinary correctly accepted; 10 ordinary wrongly flagged.\n(a) Calculate each model\'s accuracy (all correct predictions / all messages). [2 points]\n(b) Calculate each model\'s spam recall, defined as spam correctly caught / actual spam. [2 points]\n(c) If catching spam is the main priority and flagged messages receive human review, which model is more suitable? Explain the trade-off. [2 points]\n(d) Give one concrete privacy safeguard for the message text. [2 points]',
            'Accuracy: A=90%, B=88%. Spam recall: A=0%, B=80%.\nPrefer B for the stated priority: it catches 8 spam messages rather than 0, while wrongly flagging 10 ordinary messages for human review.\nPrivacy example: restrict message-text access to authorized reviewers and remove unnecessary personal identifiers before analysis.',
            'Award 1 point per accuracy and per recall. For (c), 1 for B with the stated priority and 1 for the false-positive trade-off. For (d), 2 for a concrete appropriate safeguard (e.g. minimizing retained message content, access controls, or de-identifying unnecessary personal details); a vague claim that AI is private is insufficient.'),
]


def build_exam(number, items, difficulty, description):
    assert len(items) == 26
    exam_id = f'cjaio_drill_{number}'
    questions = []
    for index, item in enumerate(items, 1):
        q_type = 'multiple-choice' if index <= 12 else 'multi-select' if index <= 18 else 'text-input'
        points = 2 if index <= 12 else 4 if index <= 18 else 5 if index <= 22 else 8
        answer = item['key']
        if q_type == 'multiple-choice':
            assert answer in 'ABCDE' and len(answer) == 1
            answer = item['options'][ord(answer) - 65]
        elif q_type == 'multi-select':
            assert len(set(answer)) == len(answer) and set(answer) <= set('ABCDE')
            answer = json.dumps(sorted(answer), separators=(',', ':'))
        section = ('A - Single choice' if index <= 12 else 'B - Select all that apply' if index <= 18
                   else 'C - Short Answer I' if index <= 22 else 'D - Short Answer II')
        questions.append(dict(id=f'{exam_id}_q{index}', number=index, points=points, text=item['text'],
                              type=q_type, options=item['options'], correctAnswer=answer,
                              explanation=item['explanation'], grading='manual' if index >= 20 else 'automatic', section=section))
    assert sum(q['points'] for q in questions) == 100
    return dict(id=exam_id, name=f"Max's CJAIO Drill Test {number}", competition='CJAIO', durationMinutes=60,
                difficulty=difficulty, description=description, source="Max's original CJAIO drill series",
                instructions='26 questions; 100 points; 60 minutes. Q1-12: select one answer. Q13-18: select all correct answers; all and only the correct options earn the points. Q19-26: show work or code. Q20-26 support teacher marking and partial credit. Original practice questions; difficulty is relative to the supplied CJAIO practice sets.',
                questions=questions)


def main():
    exams = [
        build_exam(1, equivalent, 'Equivalent to CJAIO practice sets',
                   'Equivalent practice: Python tracing, search and sorting, probability, data preparation, and hand calculations with the five basic ML models.'),
        build_exam(2, harder, 'Harder than CJAIO practice sets',
                   'Harder practice: nested-list sharing, recursion, duplicate-aware search, two K-Means rounds, tie rules, and model-evaluation trade-offs within the CJAIO syllabus.'),
    ]
    (ROOT / 'src/data/cjaio-drills.json').write_text(json.dumps(exams, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    folder = ROOT / 'content/cjaio'
    folder.mkdir(exist_ok=True, parents=True)
    for number, exam in enumerate(exams, 1):
        title = f"# {exam['name']}"
        intro = [title, '', f"**Difficulty:** {exam['difficulty']}", '', '60 minutes | 26 questions | 100 points', '',
                 exam['description'], '', exam['instructions'], '']
        question_lines = intro[:]
        answer_lines = [title + ' - Solutions and Marking Guide', '',
                        'Independently prepared answer key for this original drill. Accept equivalent valid written solutions and award partial credit using the guidance.', '']
        for q in exam['questions']:
            question_lines.extend([f"## Question {q['number']} ({q['points']} points)", '', q['section'], '', q['text'], ''])
            question_lines.extend(f'- {option}' for option in q['options'])
            question_lines.append('')
            answer_lines.extend([f"## Question {q['number']} ({q['points']} points)", '', '**Answer:**', '',
                                 q['correctAnswer'], '', '**Explanation / marking guidance:**', '', q['explanation'], ''])
        (folder / f'max-drill-{number}-questions.md').write_text('\n'.join(question_lines), encoding='utf-8')
        (folder / f'max-drill-{number}-solutions.md').write_text('\n'.join(answer_lines), encoding='utf-8')
    print('Built 2 original CJAIO drills: 52 questions, 100 points / 60 minutes each.')


if __name__ == '__main__':
    main()
