"""Tests for vitalpriors. The oxygen tests need the figure data; set VITALPRIORS_ODC to data.js (or the figure
folder, or a converted .npz). Without it, those tests are skipped."""
import os
import numpy as np
import pytest
from vitalpriors import parse_js_assignments, OxygenData, severinghaus_so2

SRC = os.environ.get("VITALPRIORS_ODC")
needs_data = pytest.mark.skipif(not SRC, reason="set VITALPRIORS_ODC to the oxygen figure data")


def load():
    return OxygenData.from_npz(SRC) if SRC.endswith(".npz") else OxygenData.from_js(SRC)


def test_parser_reads_literals_only():
    v = parse_js_assignments('a[0]="Age";\nd[1][2]=[0,1.5e-05,3];\nx[0]=foo();\nb[3]=2.5\n')
    assert v["a"][(0,)] == "Age" and v["d"][(1, 2)] == [0, 1.5e-05, 3] and v["b"][(3,)] == 2.5
    assert "x" not in v                        # expressions are never evaluated


def test_severinghaus_reference_values():
    assert abs(severinghaus_so2(26.8) - 50) < 1.0 and abs(severinghaus_so2(100) - 97.5) < 0.6


@needs_data
def test_counts_are_whole_and_totals_as_expected():
    od = load()
    assert od["all"].n == 81359
    for k in od.names():
        assert np.issubdtype(od[k].counts.dtype, np.integer) and od[k].n > 1000


@needs_data
def test_reproduces_published_panel_c():
    """Eytan et al. 2019, Figure 1C: pO2 peaks at about 35, 40, 46 and 60 mmHg for SO2 of 60-90%."""
    od = load()["all"]
    for so2, peak in [(60, 35.5), (70, 40.5), (80, 46.5), (90, 59.5)]:
        mode = float(od.po2_given_so2(so2).argmax() + 1)          # AXIS value of the peak
        assert abs(mode - peak) <= 1.5


@needs_data
def test_children_curve_right_of_severinghaus():
    """Figure 1A: median SO2 at pO2 40 about 70%, below the classic 75%."""
    od = load()["all"]
    med = od.so2_quantiles(40, (0.5,))[0]
    assert 68 <= med <= 72 and med < severinghaus_so2(40) - 2


@needs_data
def test_conversion_round_trip(tmp_path):
    od = load(); p = tmp_path / "odc.npz"; od.save_npz(p)
    od2 = OxygenData.from_npz(p)
    assert all(np.array_equal(od[k].counts, od2[k].counts) for k in od.names())


@needs_data
def test_value_offset_evidence_from_classic_curve():
    """The classic curve stored with the data has x = 1-100 and matches Severinghaus there: the figure's
    arrays hold values 1-100 in positions 0-99."""
    od = load()
    if od.classic_x is not None:
        assert od.classic_x[0] == 1 and od.classic_x[-1] == 100
        assert np.allclose(od.classic_y, severinghaus_so2(od.classic_x), atol=0.01)


@needs_data
def test_grid_includes_saturated_samples():
    """With the offset corrected, the top SO2 bin is 100%."""
    from vitalpriors.oxygen import AXIS
    od = load()["all"]
    assert AXIS[-1] == 100 and od.counts[:, -1].sum() > 0
