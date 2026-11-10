# 2026-27 CAIO National Qualifier practice papers

All three supplied PDFs are imported: **105 questions, 300 marks**. Each paper has 15 single-choice questions, 10 exact-match select-all questions, and 10 five-blank questions. Questions, options, code, and blank order are preserved; headers, footers, and physical answer lines are adapted for the platform. No instructions in the PDFs are executed.

| Paper | Questions | Worked solutions | Runtime ID |
| --- | --- | --- | --- |
| A | [Questions](paper-a-questions.md) | [Solutions](paper-a-solutions.md) | `caio_2026_a` |
| B | [Questions](paper-b-questions.md) | [Solutions](paper-b-solutions.md) | `caio_2026_b` |
| C | [Questions](paper-c-questions.md) | [Solutions](paper-c-solutions.md) | `caio_2026_c` |

Runtime data: `src/data/caio-2026-exams.json`, registered in `src/data/all-exams.ts`. The bank is separate from legacy `exams.json`, so rerunning the old parser cannot erase these papers. Existing IDs, attempts, and question books remain unchanged. Source filenames and SHA-256 hashes are recorded in [sources.json](sources.json).

These papers carry numeric `year: 2026` metadata and appear under **2026 papers** in the catalog. The three older CAIO papers carry `year: 2025` and appear under **2025 papers**. Both source importers retain this metadata; drill tests remain undated. Year-prefixed names identify papers throughout practice and review without changing attempt IDs.

## Marking and timing

- The solutions were independently worked and verified; the supplied PDFs contain no official answer keys.
- Single-choice questions use the exact option string; select-all keys use JSON letter arrays, matching the existing grading functions.
- Select-all questions earn 2 or 0 marks, as specified by the PDFs.
- Five-blank answers use the existing written-response field. Students label parts (a)-(e). Teachers use the existing Admin Console to award credit for equivalent code, math, set order, and justified alternatives. The practice rubric is 1 point per blank; the PDFs do not specify a per-blank allocation.
- Four ambiguous select-all items use teacher marking: **B16, B18, B25, C22**. The student prompt identifies them; explanations describe both defensible readings. Use 2 or 0 points for these items, not partial credit.
- With all model answers entered, A initially has 50 automatic points and 50 pending; B has 44 automatic and 56 pending; C has 48 automatic and 52 pending. Full teacher marks give 100 per paper. Skipped questions receive zero.
- The existing CAIO practice timer remains **90 minutes**. These source PDFs specify no duration, so this is a platform setting, not an asserted official time limit.

## Source issues and accepted alternatives

| Item | Treatment in solution |
| --- | --- |
| A26 | The source does not specify an aggregation or missing-data subset. `sum` and `subset=['amount']` are model choices; coherent alternatives are allowed. |
| A29 | The skeleton never calls the gradient function at outer scope. The model final blank calls it, avoiding an undefined `dj_dw`; a properly initialized outer gradient is equivalent. |
| A31 | New centroids form a fixed point. Accept a justified "no" if referring to an implementation's still-unmet old/new-centroid stopping check. |
| A34 | There are 6 original solutions, or 2 extensions of A=2. The source does not explicitly reset that assignment before asking for the count. |
| A35 | The unusual PDF glyph `Ƀ` is interpreted as the mean of y; the source glyph is preserved. |
| B11 | The supplied coefficients algebraically give w=(2,2), but cannot both satisfy canonical support-vector equalities for the listed points. The requested algebra remains unambiguous. |
| B16 | Mean imputation reduces variance relative to observed values; comparison against unknown complete data is not guaranteed. Accept ABD or BD according to interpretation. |
| B18 | Convexity does not by itself ensure GD convergence or a finite optimum. Accept ABC under conventional convergence assumptions or AC for literal wording. |
| B25 | Every tautology is also satisfiable. ACDE is literally true; ACD reflects the likely terminology distinction. Both are accepted by teacher review. |
| B26 | A wrapped, displaced PDF line is restored to valid Python continuation indentation. Title cleaning itself is not fully specified. |
| B28 | Ridge alpha and the scoring loss are unspecified. 1.0 and negative MSE are examples, not exclusive answers. |
| B31 | Two optimal paths cost 6. Accept either; the goal-parent tie policy is unspecified. |
| B35 | With exact intermediate values, new MSE is 0.66. Rounded w=0.37,b=0.17 give 0.64; accept with shown intermediate rounding. |
| C4 | 3-NN predicts class 1. The closest 1-NN points tie across classes, so option D's extra claim is not guaranteed. |
| C22 | A DBSCAN border point gets one label in a standard run, but could belong to either neighboring cluster across orderings. Accept BDE or ABDE according to the reading of "may be assigned." |
| C26 | Fill within each sensor to avoid cross-sensor leakage. Plain `ffill` is valid only with an additional assumption about nonmissing initial values. Duplicate identity is unspecified. |
| C28 | The primary solution uses multinomial NB (posterior 0.67). The source omits the variant, so consistent Bernoulli NB answers are also accepted (posterior 0.73 using all six presence/absence features). |

Search questions use the conventional finite-branching, goal-heuristic-zero assumptions; convergence and heuristic-dominance caveats are explained where relevant.

Technical references used to check ambiguous model conventions: [scikit-learn Naive Bayes guide](https://scikit-learn.org/stable/modules/naive_bayes.html), [scikit-learn DBSCAN reference](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.DBSCAN.html), and [clustering documentation](https://github.com/scikit-learn/scikit-learn/blob/main/doc/modules/clustering.rst).

## Rebuild and verify

From `platform/`:

```powershell
python scripts/import-caio-2026.py C:/Users/61913/Downloads
python scripts/verify-caio-2026.py C:/Users/61913/Downloads
npm test
npx tsc --noEmit
npm run build
```

The importer requires `pdfplumber`. The verifier also uses NumPy, pandas, and scikit-learn, executes reviewed completed snippets with in-memory sample data, independently checks numerical answers, and compares all question/option text against the source PDFs after whitespace normalization. The app requires none of these Python dependencies.

Edit the importer to change answer keys or explanations, then regenerate. The generated Markdown uses the familiar question/answer layout plus explicit `Type` and `Grading` metadata. **Do not feed these files to `scripts/parse-exams.js`**: that legacy importer only understands single-choice and single text answers and would lose multi-select/manual semantics.
