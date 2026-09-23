# vitalpriors

Reference distributions of physiological measurements in critically ill children, decoded from the
published interactive figures of the SickKids critical care data group (media.laussenlabs.ca), as reusable
Python objects.

**Status:** early development. Covers the oxygen dissociation distributions and the cuff versus invasive
blood pressure comparison.

## Oxygen dissociation distributions

Source: Eytan D, Mazwi ML, Goodwin AJ, Goodfellow SD, Assadi A, Greer RW, Jegatheeswaran A, Laussen PC.
*Revisiting oxygen dissociation curves and bedside measured arterial saturation in critically ill children.*
Intensive Care Med 2019;45:1832–1834.

Two-dimensional distributions of blood-gas pO2 and SO2 (1 mmHg by 1% bins) for all patients and for high and
low subsets of age, pCO2 and pH, smoothed and unsmoothed. The unsmoothed grids are recovered as exact counts.

```python
from vitalpriors import OxygenData

od = OxygenData.from_js("path/to/oxygen-dissociation")      # the figure folder, or its data/data.js
od.save_npz("oxygen_dissociation.npz")                        # compact copy for later use
od = OxygenData.from_npz("oxygen_dissociation.npz")

allpts = od["all"]
allpts.po2_quantiles(90)            # [55, 58, 62]: pO2 quartiles at SO2 90%
allpts.so2_quantiles(40)            # SO2 quartiles at pO2 40 mmHg
allpts.sample_po2(90, size=1000)    # draw pO2 values given SO2 90%
od["age_low"].po2_quantiles(90)     # babies under 1 month: [49, 53, 57]
```

Or from the command line: `vitalpriors oxygen path/to/oxygen-dissociation oxygen_dissociation.npz`.

Subsets: `all`, `age_high` (over 6 months), `age_low` (under 1 month), `pco2_high` (over 45 mmHg, normal pH),
`pco2_low` (under 35 mmHg, normal pH), `ph_high` (over 7.45, normal pCO2), `ph_low` (under 7.35, normal pCO2).

### An off-by-one in the figure files, corrected here

The figure's JavaScript arrays are 0-based but hold values 1–100 from 1-based code, so position *i* is the
value *i* + 1. The classic curve stored with the data runs from 1 to 100 mmHg and matches Severinghaus there, and
the letter's published Figure 1B and 1C are reproduced better on 7 of 8 curves (40% less error) with this
reading. The interactive app draws the grid one unit left of the classic curve for the same reason. This package
applies the correction (`VALUE_OFFSET = 1`), so every value it returns is a true value. The exact bin convention
is uncertain to about half a unit, within the grid's 1-unit resolution. The blood pressure figure does not share
the offset.

### Limits

- The grid covers pO2 1–100 mmHg and SO2 1–100%, including saturated samples: 81,359 of the letter's 112,101
  gases. Samples with pO2 above 100 mmHg are not included.
- The letter's comparison of bedside SpO2 with arterial SO2 (Figure 1H) is not part of this figure's data.

## Cuff against invasive blood pressure

Source: Goodwin A, Mazwi ML, Somer J, Schwartz SM, McEwan A, Eytan D. *Blood pressure in critically ill
children: exploratory analyses of concurrent invasive and noninvasive measurements.* Crit Care Explor
2021;3:e0586.

Two-dimensional histograms of cuff reading against the concurrent invasive value (0–200 mmHg, 1 mmHg bins, whole
counts) for systolic, diastolic, mean and pulse pressure, in 13 age groups from 0–3 months to 15–18 years. The
figure stores each row trimmed to its non-zero range; decoding restores it exactly.

```python
from vitalpriors import BPData, AGE_GROUPS

bp = BPData.from_js("path/to/bp-comparison")      # or BPData.from_npz("bp_comparison.npz")
bp.save_npz("bp_comparison.npz")

teen = bp.grid("systolic", [11, 12])              # 12-15 and 15-18 years pooled
teen.invasive_quantiles(110)                      # [101, 114, 125]
bp.grid("systolic").difference_stats(70)          # (-5.3, 10.5, 1983): mean and SD of invasive - cuff, n pairs
bp.for_age("systolic", 0).n_at(80)                # whole-year age 0 pools the first four groups
bp.grid("systolic", 0).sample_invasive(80, size=1000)
```

Command line: `vitalpriors bp path/to/bp-comparison bp_comparison.npz`.

Readings outside 0–200 mmHg are not in the grid (totals are 0.5–0.7% below the paper's). Cells at extreme cuff
readings can hold few pairs: check `n_at` before relying on them.

## Data

The decoded data are not included in this repository. Obtain the figure files from the source and convert
them locally.

## The figures themselves

`figures/` mirrors the two published interactive figures whose data this library reads, so they remain
available. With GitHub Pages enabled they are served at `https://USERNAME.github.io/vitalpriors/figures/`.

## Documentation

- `docs/getting-started.md`: install, convert the figures, and the common calls.
- `docs/api.md`: the reference, generated from the code (`python docs/make_docs.py`).

## Tests

`pytest` runs the tests that need no data. To test against the published values, set `VITALPRIORS_ODC` (oxygen)
and `VITALPRIORS_BP` (blood pressure) to the figure folders or converted `.npz` files.
