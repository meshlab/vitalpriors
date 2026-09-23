# API reference

Generated from the code by `python docs/make_docs.py`; do not edit by hand.

## `vitalpriors.oxygen`

Oxygen dissociation distributions in critically ill children.

Source: Eytan D, Mazwi ML, Goodwin AJ, et al. Revisiting oxygen dissociation curves and bedside measured
arterial saturation in critically ill children. Intensive Care Med 2019;45:1832-1834. Data from the
accompanying interactive figure (media.laussenlabs.ca/figures/oxygen-dissociation/), SickKids critical
care unit, Toronto.

What the data are
-----------------
Two-dimensional distributions of blood-gas pO2 (mmHg) and SO2 (%), in 1 mmHg by 1% bins, for all
patients and for high and low subsets of age, pCO2 and pH:

    all        all blood gases
    age_high   age over 6 months           age_low   age under 1 month
    pco2_high  pCO2 over 45 mmHg           pco2_low  pCO2 under 35 mmHg     (normal pH only)
    ph_high    pH over 7.45                ph_low    pH under 7.35          (normal pCO2 only)

Each subset is stored smoothed (2-D Gaussian, SD 1 bin) and unsmoothed. The unsmoothed grid is a
histogram divided by its total, so the original counts are recovered exactly (to the stored rounding).

Position and value (an off-by-one in the figure files)
------------------------------------------------------
The figure's JavaScript arrays are 0-based, but they hold values 1-100 from 1-based code: position i is the
value i + 1 (VALUE_OFFSET = 1). Evidence: (1) the classic curve stored with the data has x-values 1-100 and
matches Severinghaus at those values, not at 0-99; (2) the letter's published Figure 1B and 1C are reproduced
better on 7 of 8 curves, with 40% less error, when positions are read as value - 1. The interactive app draws
the grid one unit to the left of the classic curve for the same reason. This module applies the correction, so
every pO2 and SO2 it returns is a true value. The fit to the published curves was best at an offset of about
+1.35, so the original bins may represent intervals (for example 36-37 mmHg) plotted at their centres: the
correction is certainly about one unit, but the exact bin convention is uncertain to about half a unit, within
the grid's 1-unit resolution. The blood pressure figure does not share this offset (see bp.py).

Limits
------
The grid covers pO2 1-100 mmHg and SO2 1-100%, including saturated samples. Samples with pO2 above 100 mmHg are
not in it (81,359 of the letter's 112,101 gases fall inside), so SO2 given pO2 near 100 mmHg is incomplete
at the top. pO2 given SO2 is complete except for any samples above 100 mmHg.

### class `OxygenData(subsets, classic_x=None, classic_y=None, source='')`

All subsets, loaded from the original data.js or from a converted .npz file.

- **`from_js(cls, path)`** — Read the interactive figure's data/data.js file (or its folder).
- **`from_npz(cls, path)`** — 
- **`names(self)`** — 
- **`save_npz(self, path)`** — 
- **`summary(self)`** — 

### class `OxygenDissociation(name: str, counts: numpy.ndarray, smoothed: numpy.ndarray) -> None`

One subset. Arrays are indexed [pO2, SO2].

- **`joint(self, smoothed=False)`** — 
- **`median_po2_curve(self, so2_values=range(30, 100), smoothed=False, min_count=20)`** — (SO2, median pO2) for SO2 values with at least min_count samples.
- **`n(self)`** — 
- **`po2_given_so2(self, so2, smoothed=False)`** — Probability over pO2 values (AXIS, 1-100 mmHg) for an SO2 (whole %, 1-100).
- **`po2_quantiles(self, so2, qs=(0.25, 0.5, 0.75), smoothed=False)`** — 
- **`quantile(pmf, q)`** — Quantile of a distribution over AXIS (lowest value whose cumulative probability reaches q).
- **`sample_po2(self, so2, size, rng=None, smoothed=False)`** — Draw pO2 values given SO2 (whole %), uniformly within each 1 mmHg bin.
- **`so2_given_po2(self, po2, smoothed=False)`** — Probability over SO2 values (AXIS, 1-100%) for a pO2 (whole mmHg, 1-100).
- **`so2_quantiles(self, po2, qs=(0.25, 0.5, 0.75), smoothed=False)`** — 

### `severinghaus_so2(po2)`

Classic oxygen saturation (%) for pO2 (mmHg): Severinghaus (1979).

## `vitalpriors.bp`

Invasive (arterial line) against non-invasive (oscillometric cuff) blood pressure in critically ill children.

Source: Goodwin A, Mazwi ML, Somer J, Schwartz SM, McEwan A, Eytan D. Blood pressure in critically ill children:
exploratory analyses of concurrent invasive and noninvasive measurements. Crit Care Explor 2021;3:e0586. Data
from the accompanying interactive figure (media.laussenlabs.ca/figures/bp-comparison/), SickKids critical care
unit, Toronto, 2013-2020.

What the data are
-----------------
For each blood pressure type (systolic, diastolic, mean, pulse pressure) and each of 13 age groups: a
two-dimensional histogram of cuff reading (0-200 mmHg) against the concurrent invasive value (mean over the
minute before the cuff reading; 0-200 mmHg), in 1 mmHg bins, as whole-number counts, plus a smoothed version.
The figure stores each row trimmed to its non-zero range with its start and end values; decoding restores it
exactly.

Limits
------
Position i is the value i (unlike the oxygen figure). Evidence: the paper excluded invasive pulse pressures
below 10 mmHg, and the invasive pulse pressure data begin with a sharp edge at exactly position 10 (587 pairs
there, none below).
Readings outside 0-200 mmHg are not in the grid (totals are 0.5-0.7% below those in the paper). Many cells
at extreme cuff readings hold few pairs, so check `n_at` before relying on a conditional distribution there.
Neither measurement is treated as the truth in the paper.

### class `BPComparisonGrid(bp_type: str, age_label: str, counts: numpy.ndarray, smoothed: numpy.ndarray) -> None`

One pressure type and age group (or several pooled). Arrays are indexed [cuff, invasive].

- **`cuff_given_invasive(self, invasive, smoothed=False)`** — 
- **`difference_stats(self, cuff)`** — Mean and SD of (invasive - cuff) at a cuff reading, and the number of pairs.
- **`invasive_given_cuff(self, cuff, smoothed=False)`** — Probability over invasive values (0-200 mmHg) for a cuff reading (whole mmHg).
- **`invasive_quantiles(self, cuff, qs=(0.25, 0.5, 0.75), smoothed=False)`** — 
- **`n(self)`** — 
- **`n_at(self, cuff)`** — 
- **`quantile(pmf, q)`** — 
- **`sample_invasive(self, cuff, size, rng=None, smoothed=False)`** — Draw invasive values given a cuff reading, uniformly within each 1 mmHg bin.

### class `BPData(counts, smoothed, source='')`

All pressure types and age groups, loaded from the figure's data files or a converted .npz file.

- **`for_age(self, bp_type, age_years)`** — 
- **`from_js(cls, path)`** — Read the interactive figure's folder (containing data/load_data.js and data/load_histograms.js).
- **`from_npz(cls, path)`** — 
- **`grid(self, bp_type='systolic', age_groups=None)`** — A single age group (int), a list of groups pooled, or all groups pooled (None).
- **`save_npz(self, path)`** — 
- **`summary(self)`** — 

### `age_groups_for(age_years)`

Indices (0-12) of the age groups covering an age in years. A whole-year age of 0, as recorded in
many registries, covers the first four groups (0-12 months) and returns all four.

## `vitalpriors.jsdata`

Read data stored as JavaScript assignment statements, as used by the interactive figures at
media.laussenlabs.ca (for example ``d[3][0][1][42]=[0,0,1.2e-05,...]``).

Only literal values are read: numbers, strings and arrays of them, which are valid JSON. No
JavaScript is executed, so nothing in the file can run. Statements that are not simple indexed
assignments of literals are ignored.

### `parse_js_assignments(text)`

Return {variable name: {index tuple: value}} for every indexed literal assignment.

Assignments whose right-hand side is not valid JSON (for example ``x[0]=[]`` placeholders are
kept, but expressions such as ``x[0]=foo()`` are skipped) are ignored.

### `read_js_assignments(path, encoding='utf-8')`



### `vector(values, length=None)`

Assemble a one-index variable {(i,): x} into a list ordered by index.
