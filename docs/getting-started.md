# Getting started

## Install

    pip install -e .

Only numpy is required. `pip install -e ".[test]"` adds pytest.

## Get the data

The decoded distributions are not in this repository: they belong to the studies they come from. To
use them, obtain the published interactive figures and convert them once:

    vitalpriors oxygen path/to/oxygen-dissociation oxygen_dissociation.npz
    vitalpriors bp     path/to/bp-comparison       bp_comparison.npz

Each path is the figure's folder (the one holding `data/`). The conversion reads the data files as
literal values; no JavaScript is executed.

## Oxygen dissociation

```python
from vitalpriors import OxygenData

od = OxygenData.from_npz("oxygen_dissociation.npz")
allpts = od["all"]

allpts.po2_quantiles(90)          # [55, 58, 62]: PaO2 quartiles at an arterial saturation of 90%
allpts.so2_quantiles(40)          # saturation quartiles at a PaO2 of 40 mmHg
allpts.sample_po2(90, size=1000)  # draw PaO2 values for a saturation of 90%
od["age_low"].po2_quantiles(90)   # babies under 1 month: [49, 53, 57]
od.summary()                      # each subset, its description and how many blood gases it holds
```

Subsets: `all`, `age_high` (over 6 months), `age_low` (under 1 month), `pco2_high`, `pco2_low`,
`ph_high`, `ph_low`.

## Cuff against invasive blood pressure

```python
from vitalpriors import BPData, AGE_GROUPS

bp = BPData.from_npz("bp_comparison.npz")

teen = bp.grid("systolic", [11, 12])       # 12-15 and 15-18 years pooled
teen.invasive_quantiles(110)               # [101, 114, 125] mmHg
bp.grid("systolic").difference_stats(70)   # (-5.3, 10.5, 1983): mean and SD of invasive - cuff, n pairs
bp.for_age("systolic", 0).n_at(80)         # a whole-year age of 0 pools the first four groups
bp.grid("systolic", 0).sample_invasive(80, size=1000)
```

Pressure types: `systolic`, `diastolic`, `mean`, `pulse_pressure`. Age groups: `AGE_GROUPS`, from
0–3 months to 15–18 years.

## What to watch for

- **Counts, not just probabilities.** Every grid keeps its original counts, so you can see where the
  data is thin: `n_at` for blood pressure, `counts` for oxygen. At extreme cuff readings, or at
  saturations below about 60%, a conditional distribution may rest on very few observations.
- **The direction of conditioning matters.** `po2_given_so2` is not the inverse of `so2_given_po2`:
  with a wide spread around the curve the two differ, by about 6 mmHg at a saturation of 90%.
- **An off-by-one in the oxygen figure's files** is corrected here; see the README.
- **Neither measurement is a gold standard** in the blood pressure study, and the distributions
  describe one large paediatric intensive care unit.

## Reference

`docs/api.md`, generated from the code by `python docs/make_docs.py`.
