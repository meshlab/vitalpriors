# Interactive figures

The two published interactive figures whose data this library reads, mirrored here so they remain available.
Each runs entirely in the browser; nothing is sent anywhere.

- `bp-comparison/` — cuff against invasive blood pressure (Goodwin et al., Crit Care Explor 2021;3:e0586)
- `oxygen-dissociation/` — oxygen dissociation distributions (Eytan et al., Intensive Care Med 2019;45:1832-1834)

Please cite those papers when using the figures or the data behind them.

## Serving them

With GitHub Pages turned on for this repository (Settings -> Pages -> Deploy from a branch -> `main`, folder
`/ (root)`), they appear at:

    https://meshlab.github.io/vitalpriors/figures/

## Note on the oxygen figure

Its data files are 0-based arrays holding values 1-100, so a value is one greater than its position, and the
figure draws the distribution one unit to the left of its own reference curve. This library corrects that when
reading the data (see the main README); the figure is mirrored here unchanged, as published.
