# Contributing

Bug reports and corrections are welcome, particularly about how the published figures are decoded:
if a value looks wrong against the papers, please open an issue with the value you expected.

## Working on the code

    git clone https://github.com/USERNAME/vitalpriors
    cd vitalpriors
    pip install -e ".[test]"
    pytest

Tests that need the figure data are skipped unless you point the environment at it:

    VITALPRIORS_ODC=path/to/oxygen-dissociation VITALPRIORS_BP=path/to/bp-comparison pytest

## What goes in this repository

Code and documentation only. The decoded data stays out: it belongs to the studies it came from, and
users convert it themselves from the published figures.
