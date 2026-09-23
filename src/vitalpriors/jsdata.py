"""
Read data stored as JavaScript assignment statements, as used by the interactive figures at
media.laussenlabs.ca (for example ``d[3][0][1][42]=[0,0,1.2e-05,...]``).

Only literal values are read: numbers, strings and arrays of them, which are valid JSON. No
JavaScript is executed, so nothing in the file can run. Statements that are not simple indexed
assignments of literals are ignored.
"""
import json
import re
from collections import defaultdict

_STATEMENT = re.compile(r"^\s*([A-Za-z_]\w*)((?:\[\s*\d+\s*\])+)\s*=\s*(.+?)\s*;?\s*$", re.M)


def parse_js_assignments(text):
    """Return {variable name: {index tuple: value}} for every indexed literal assignment.

    Assignments whose right-hand side is not valid JSON (for example ``x[0]=[]`` placeholders are
    kept, but expressions such as ``x[0]=foo()`` are skipped) are ignored."""
    out = defaultdict(dict)
    for name, idx, value in _STATEMENT.findall(text):
        try:
            v = json.loads(value)
        except json.JSONDecodeError:
            continue
        out[name][tuple(int(i) for i in re.findall(r"\d+", idx))] = v
    return dict(out)


def read_js_assignments(path, encoding="utf-8"):
    with open(path, encoding=encoding) as f:
        return parse_js_assignments(f.read())


def vector(values, length=None):
    """Assemble a one-index variable {(i,): x} into a list ordered by index."""
    n = length if length is not None else (max(k[0] for k in values) + 1 if values else 0)
    return [values[(i,)] for i in range(n)]
