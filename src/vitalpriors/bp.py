"""
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
"""
from dataclasses import dataclass
from pathlib import Path
import numpy as np
from .jsdata import read_js_assignments

AXIS = np.arange(201)
BP_TYPES = {"systolic": "Systolic", "diastolic": "Diastolic", "mean": "Mean", "pulse_pressure": "PP"}
AGE_GROUPS = ["0-3 months", "3-6 months", "6-9 months", "9-12 months", "12-18 months", "18-24 months",
              "2-3 years", "3-4 years", "4-6 years", "6-8 years", "8-12 years", "12-15 years", "15-18 years"]
AGE_UPPER_YEARS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8, 12, 15, 18.01]      # upper bound of each group


def age_groups_for(age_years):
    """Indices (0-12) of the age groups covering an age in years. A whole-year age of 0, as recorded in
    many registries, covers the first four groups (0-12 months) and returns all four."""
    a = float(age_years)
    if a < 1 and float(a).is_integer():
        return [0, 1, 2, 3]
    lower = [0] + AGE_UPPER_YEARS[:-1]
    return [i for i, (lo, hi) in enumerate(zip(lower, AGE_UPPER_YEARS)) if lo <= a < hi] or [12]


@dataclass
class BPComparisonGrid:
    """One pressure type and age group (or several pooled). Arrays are indexed [cuff, invasive]."""
    bp_type: str
    age_label: str
    counts: np.ndarray
    smoothed: np.ndarray

    @property
    def n(self):
        return int(self.counts.sum())

    def n_at(self, cuff):
        return int(self.counts[int(cuff)].sum())

    def invasive_given_cuff(self, cuff, smoothed=False):
        """Probability over invasive values (0-200 mmHg) for a cuff reading (whole mmHg)."""
        row = (self.smoothed if smoothed else self.counts)[int(cuff)].astype(float)
        return row / row.sum() if row.sum() > 0 else row

    def cuff_given_invasive(self, invasive, smoothed=False):
        col = (self.smoothed if smoothed else self.counts)[:, int(invasive)].astype(float)
        return col / col.sum() if col.sum() > 0 else col

    @staticmethod
    def quantile(pmf, q):
        c = np.cumsum(pmf)
        return float(AXIS[min(np.searchsorted(c, q), len(AXIS) - 1)]) if c[-1] > 0 else np.nan

    def invasive_quantiles(self, cuff, qs=(0.25, 0.5, 0.75), smoothed=False):
        p = self.invasive_given_cuff(cuff, smoothed)
        return [self.quantile(p, q) for q in qs]

    def difference_stats(self, cuff):
        """Mean and SD of (invasive - cuff) at a cuff reading, and the number of pairs."""
        p = self.invasive_given_cuff(cuff)
        if p.sum() == 0:
            return np.nan, np.nan, 0
        m = (p * AXIS).sum()
        return m - cuff, float(np.sqrt((p * (AXIS - m) ** 2).sum())), self.n_at(cuff)

    def sample_invasive(self, cuff, size, rng=None, smoothed=False):
        """Draw invasive values given a cuff reading, uniformly within each 1 mmHg bin."""
        rng = np.random.default_rng() if rng is None else rng
        return rng.choice(AXIS, size=size, p=self.invasive_given_cuff(cuff, smoothed)) + rng.random(size) - 0.5


class BPData:
    """All pressure types and age groups, loaded from the figure's data files or a converted .npz file."""

    def __init__(self, counts, smoothed, source=""):
        self.counts, self.smoothed, self.source = counts, smoothed, source      # dicts: bp_type -> [13, 201, 201]

    def grid(self, bp_type="systolic", age_groups=None):
        """A single age group (int), a list of groups pooled, or all groups pooled (None)."""
        idx = list(range(13)) if age_groups is None else ([age_groups] if isinstance(age_groups, int) else list(age_groups))
        label = "all ages" if age_groups is None else ", ".join(AGE_GROUPS[i] for i in idx)
        return BPComparisonGrid(bp_type, label, self.counts[bp_type][idx].sum(axis=0), self.smoothed[bp_type][idx].sum(axis=0))

    def for_age(self, bp_type, age_years):
        return self.grid(bp_type, age_groups_for(age_years))

    @classmethod
    def from_js(cls, path):
        """Read the interactive figure's folder (containing data/load_data.js and data/load_histograms.js)."""
        path = Path(path)
        folder = path / "data" if (path / "data" / "load_data.js").exists() else path
        L = read_js_assignments(folder / "load_data.js")
        v = read_js_assignments(folder / "load_histograms.js")["v"]
        names = [L["image_files"][(i,)] for i in range(len(L["image_files"]))]
        counts = {k: np.zeros((13, 201, 201), np.int64) for k in BP_TYPES}
        smoothed = {k: np.zeros((13, 201, 201)) for k in BP_TYPES}
        for key, tag in BP_TYPES.items():
            for a in range(13):
                for sm, store in ((False, counts), (True, smoothed)):
                    img = names.index(f"{tag}_{'smoothed' if sm else 'non_smoothed'}_age_group_{a + 1}.png")
                    first = L["first_vals"][(img,)]
                    for j in range(201):
                        arr = v.get((img, j), [])
                        if arr:
                            store[key][a, j, first[j]:first[j] + len(arr)] = arr
        return cls(counts, smoothed, source=str(folder))

    def save_npz(self, path):
        arrays = {f"{k}_counts": self.counts[k] for k in BP_TYPES}
        arrays.update({f"{k}_smoothed": self.smoothed[k] for k in BP_TYPES})
        np.savez_compressed(path, **arrays)

    @classmethod
    def from_npz(cls, path):
        z = np.load(path)
        return cls({k: z[f"{k}_counts"] for k in BP_TYPES}, {k: z[f"{k}_smoothed"] for k in BP_TYPES}, source=str(path))

    def summary(self):
        return {k: int(self.counts[k].sum()) for k in BP_TYPES}
