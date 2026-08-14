# lukres.dev — v2

Ground-up rebuild of my personal site. Motion-first, no framework — hand-built HTML/CSS/JS
with a WebGL layer.

## How this branch works

The site is built in **beats**: one system at a time (shell → loader → hero → transitions →
work → cursor → content → production pass). Each beat is built, tuned against real hardware,
and locked with a tag before the next one starts.

- `explorations/` — design comps and studies. Never merges to `main`; deleted before cutover.
- Everything else — the shipping site.

`main` continues to serve the current live site until v2 passes the production gate.
