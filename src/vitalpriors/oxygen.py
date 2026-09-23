"""
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
"""
from dataclasses import dataclass
from pathlib import Path
import numpy as np
from .jsdata import read_js_assignments, vector

VALUE_OFFSET = 1                          # position i in the figure's arrays holds value i + 1 (see above)
AXIS = np.arange(100) + VALUE_OFFSET      # pO2 (mmHg) or SO2 (%) value of each position: 1-100
SUBSETS = {"all": (3, 0), "age_high": (0, 0), "age_low": (0, 1), "pco2_high": (1, 0),
           "pco2_low": (1, 1), "ph_high": (2, 0), "ph_low": (2, 1)}
DESCRIPTION = {"all": "all blood gases", "age_high": "age over 6 months", "age_low": "age under 1 month",
               "pco2_high": "pCO2 over 45 mmHg (normal pH)", "pco2_low": "pCO2 under 35 mmHg (normal pH)",
               "ph_high": "pH over 7.45 (normal pCO2)", "ph_low": "pH under 7.35 (normal pCO2)"}


def severinghaus_so2(po2):
    """Classic oxygen saturation (%) for pO2 (mmHg): Severinghaus (1979)."""
    p = np.asarray(po2, float)
    return 100.0 / (23400.0 / (p ** 3 + 150.0 * p) + 1.0)


@dataclass
class OxygenDissociation:
    """One subset. Arrays are indexed [pO2, SO2]."""
    name: str
    counts: np.ndarray          # recovered integer counts (from the unsmoothed grid)
    smoothed: np.ndarray        # smoothed probabilities as published

    @property
    def n(self):
        return int(self.counts.sum())

    def joint(self, smoothed=False):
        g = self.smoothed if smoothed else self.counts.astype(float)
        return g / g.sum()

    # -------- conditionals
    @staticmethod
    def _pos(value):
        i = int(round(value)) - VALUE_OFFSET
        if not 0 <= i < 100:
            raise ValueError(f"value {value} outside the grid (1-100)")
        return i

    def so2_given_po2(self, po2, smoothed=False):
        """Probability over SO2 values (AXIS, 1-100%) for a pO2 (whole mmHg, 1-100)."""
        row = self.joint(smoothed)[self._pos(po2)]
        return row / row.sum() if row.sum() > 0 else row

    def po2_given_so2(self, so2, smoothed=False):
        """Probability over pO2 values (AXIS, 1-100 mmHg) for an SO2 (whole %, 1-100)."""
        col = self.joint(smoothed)[:, self._pos(so2)]
        return col / col.sum() if col.sum() > 0 else col

    @staticmethod
    def quantile(pmf, q):
        """Quantile of a distribution over AXIS (lowest value whose cumulative probability reaches q)."""
        c = np.cumsum(pmf)
        return float(AXIS[min(np.searchsorted(c, q), len(AXIS) - 1)]) if c[-1] > 0 else np.nan

    def po2_quantiles(self, so2, qs=(0.25, 0.5, 0.75), smoothed=False):
        p = self.po2_given_so2(so2, smoothed)
        return [self.quantile(p, q) for q in qs]

    def so2_quantiles(self, po2, qs=(0.25, 0.5, 0.75), smoothed=False):
        p = self.so2_given_po2(po2, smoothed)
        return [self.quantile(p, q) for q in qs]

    def median_po2_curve(self, so2_values=range(30, 100), smoothed=False, min_count=20):
        """(SO2, median pO2) for SO2 values with at least min_count samples."""
        rows = [(s, self.po2_quantiles(s, (0.5,), smoothed)[0]) for s in so2_values
                if self.counts[:, self._pos(s)].sum() >= min_count]
        return np.array(rows)

    def sample_po2(self, so2, size, rng=None, smoothed=False):
        """Draw pO2 values given SO2 (whole %), uniformly within each 1 mmHg bin."""
        rng = np.random.default_rng() if rng is None else rng
        p = self.po2_given_so2(so2, smoothed)
        return rng.choice(AXIS, size=size, p=p) + rng.random(size) - 0.5


class OxygenData:
    """All subsets, loaded from the original data.js or from a converted .npz file."""

    def __init__(self, subsets, classic_x=None, classic_y=None, source=""):
        self.subsets = subsets
        self.classic_x, self.classic_y, self.source = classic_x, classic_y, source

    def __getitem__(self, name):
        return self.subsets[name]

    def names(self):
        return list(self.subsets)

    @classmethod
    def from_js(cls, path):
        """Read the interactive figure's data/data.js file (or its folder)."""
        path = Path(path)
        if path.is_dir():
            path = path / "data" / "data.js" if (path / "data" / "data.js").exists() else path / "data.js"
        v = read_js_assignments(path)
        d = v["d"]
        subsets = {}
        for name, (t, hl) in SUBSETS.items():
            unsm = np.array([d[(t, hl, 1, i)] for i in range(100)], float)
            sm = np.array([d[(t, hl, 0, i)] for i in range(100)], float)
            nz = unsm[unsm > 0]
            total = np.round(1.0 / nz.min()) if nz.size else 0      # a single sample = smallest non-zero cell
            counts = np.round(unsm * total).astype(int)
            subsets[name] = OxygenDissociation(name, counts, sm)
        return cls(subsets, np.array(vector(v["classic_curve_x"]), float), np.array(vector(v["classic_curve_y"]), float),
                   source=str(path))

    def save_npz(self, path):
        arrays = {f"{k}_counts": s.counts for k, s in self.subsets.items()}
        arrays.update({f"{k}_smoothed": s.smoothed for k, s in self.subsets.items()})
        np.savez_compressed(path, classic_x=self.classic_x, classic_y=self.classic_y, **arrays)

    @classmethod
    def from_npz(cls, path):
        z = np.load(path)
        subsets = {k: OxygenDissociation(k, z[f"{k}_counts"], z[f"{k}_smoothed"]) for k in SUBSETS}
        return cls(subsets, z["classic_x"], z["classic_y"], source=str(path))

    def summary(self):
        return {k: (DESCRIPTION[k], s.n) for k, s in self.subsets.items()}
