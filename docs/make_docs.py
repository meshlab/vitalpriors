"""Build docs/api.md from the package's own docstrings, so the reference cannot drift from the code.

    python docs/make_docs.py
"""
import inspect
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
import vitalpriors
from vitalpriors import bp, jsdata, oxygen

MODULES = [("vitalpriors.oxygen", oxygen), ("vitalpriors.bp", bp), ("vitalpriors.jsdata", jsdata)]


def signature(obj):
    try:
        return str(inspect.signature(obj))
    except (TypeError, ValueError):
        return "()"


def document(name, module):
    out = [f"## `{name}`", "", (inspect.getdoc(module) or "").strip(), ""]
    members = [(n, m) for n, m in vars(module).items()
               if not n.startswith("_") and getattr(m, "__module__", None) == module.__name__]
    for n, m in sorted(members, key=lambda kv: kv[0]):
        if inspect.isclass(m):
            out += [f"### class `{n}{signature(m)}`", "", (inspect.getdoc(m) or "").strip(), ""]
            for mn, mm in sorted(vars(m).items()):
                if mn.startswith("_") or not (inspect.isfunction(mm) or isinstance(mm, (property, staticmethod, classmethod))):
                    continue
                f = mm.__func__ if isinstance(mm, (staticmethod, classmethod)) else (mm.fget if isinstance(mm, property) else mm)
                out += [f"- **`{mn}{signature(f)}`** — {(inspect.getdoc(f) or '').strip().splitlines()[0] if inspect.getdoc(f) else ''}"]
            out += [""]
        elif inspect.isfunction(m):
            out += [f"### `{n}{signature(m)}`", "", (inspect.getdoc(m) or "").strip(), ""]
    return out


def main():
    lines = ["# API reference", "",
             "Generated from the code by `python docs/make_docs.py`; do not edit by hand.", ""]
    for name, module in MODULES:
        lines += document(name, module)
    path = Path(__file__).with_name("api.md")
    path.write_text("\n".join(lines))
    print("wrote", path, f"({len(lines)} lines)")


if __name__ == "__main__":
    main()
