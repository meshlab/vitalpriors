"""Command-line tools: python -m vitalpriors.cli oxygen <data.js or folder> <out.npz>"""
import argparse
from .oxygen import OxygenData
from .bp import BPData


def main(argv=None):
    ap = argparse.ArgumentParser(prog="vitalpriors", description="Convert interactive-figure data to compact .npz files")
    sub = ap.add_subparsers(dest="figure", required=True)
    ox = sub.add_parser("oxygen", help="oxygen dissociation distributions (data.js or the figure folder)")
    ox.add_argument("source"); ox.add_argument("out")
    bp = sub.add_parser("bp", help="cuff against invasive blood pressure (the figure folder)")
    bp.add_argument("source"); bp.add_argument("out")
    a = ap.parse_args(argv)
    if a.figure == "oxygen":
        od = OxygenData.from_js(a.source); od.save_npz(a.out)
        for k, (desc, n) in od.summary().items():
            print(f"{k:10s} {n:7d}  {desc}")
    elif a.figure == "bp":
        b = BPData.from_js(a.source); b.save_npz(a.out)
        for k, n in b.summary().items():
            print(f"{k:15s} {n:7d} pairs")


if __name__ == "__main__":
    main()
