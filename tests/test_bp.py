"""Blood pressure tests. Set VITALPRIORS_BP to the bp-comparison figure folder or a converted .npz file; without
it, the data tests are skipped."""
import os
import numpy as np
import pytest
from vitalpriors import BPData, age_groups_for

SRC = os.environ.get("VITALPRIORS_BP")
needs_data = pytest.mark.skipif(not SRC, reason="set VITALPRIORS_BP to the blood pressure figure data")


def load():
    return BPData.from_npz(SRC) if SRC.endswith(".npz") else BPData.from_js(SRC)


def test_age_groups_for():
    assert age_groups_for(0) == [0, 1, 2, 3]          # whole-year age 0 covers the first year
    assert age_groups_for(0.1) == [0] and age_groups_for(1.2) == [4] and age_groups_for(16) == [12]


@needs_data
def test_totals_close_to_paper():
    """Goodwin et al. 2021: 133,927 systolic, 154,349 mean and 162,426 diastolic pairs (grid holds 0-200 mmHg)."""
    s = load().summary()
    for k, paper in [("systolic", 133927), ("mean", 154349), ("diastolic", 162426)]:
        assert 0.99 * paper <= s[k] <= paper


@needs_data
def test_adolescents_at_cuff_110():
    """Paper: at cuff systolic 110, median invasive 113 mmHg (IQR 99.5-123.5) at 12-18 years."""
    q = load().grid("systolic", [11, 12]).invasive_quantiles(110)
    assert abs(q[1] - 113) <= 2 and abs(q[0] - 99.5) <= 3 and abs(q[2] - 123.5) <= 3


@needs_data
def test_overall_difference_matches_figure_2a():
    """Figure 2A: invasive minus cuff systolic about -5 mmHg at 60-70, SD about 10-12."""
    m, sd, n = load().grid("systolic").difference_stats(70)
    assert -7 <= m <= -3 and 9 <= sd <= 13 and n > 1000


@needs_data
def test_counts_whole_and_round_trip(tmp_path):
    b = load(); p = tmp_path / "bp.npz"; b.save_npz(p); b2 = BPData.from_npz(p)
    assert np.issubdtype(b.counts["systolic"].dtype, np.integer)
    assert all(np.array_equal(b.counts[k], b2.counts[k]) for k in b.counts)
