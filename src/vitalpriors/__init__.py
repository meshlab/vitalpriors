"""vitalpriors: reference distributions of physiological measurements in critically ill children, decoded
from published interactive figures (media.laussenlabs.ca)."""
from .jsdata import parse_js_assignments, read_js_assignments
from .oxygen import OxygenData, OxygenDissociation, severinghaus_so2
from .bp import BPData, BPComparisonGrid, AGE_GROUPS, age_groups_for

__version__ = "0.3.0"
