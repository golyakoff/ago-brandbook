# AGO Brandbook

AGO Platform's own public brand-identity reference — color, type, and the five real channel icons —
served at its own subdomain (`brandbook.reserve-me.ru`), separate from `ago-landing` (the marketing
page) and `ago-console`/`ago-widget` (the product), the same "each deployable surface gets its own
repo" reasoning `ago-landing`'s own README states for itself
(`ago-root/docs/architecture/repositories.md`).

Static HTML — no build step, no framework, no bundler — the same shape `ago-landing` uses, and for
the same reason: plain pages, a shared stylesheet, one small data script, nothing here needs a
build step. `25-183` split the original single scrolling page into five real `.html` files
(mirroring `ago-landing`'s own `index.html`/`pricing.html` precedent) with the same nav bar
copy-pasted by hand into each page's own `<header>` — the shape a static site with no templating
has to accept.

Nothing on this site is designed here. Every value is copied from a file this repository does not
own:

- **Color** — `ago-console/src/design/tokens.css` (the canonical token set) and
  `ago-landing/styles.css`'s own current palette. Where the two disagree — the landing page has been
  redesigned since the console's tokens were traced from it — the page shows both rather than
  resolving the difference; that is not this repository's decision to make.
- **Type** — the identical disagreement, found for type by `25-183`: `ago-console/index.html`'s own
  font-loading `<link>` still pulls the three families (`Unbounded`/`Manrope`/`JetBrains Mono`)
  `tokens.css`'s own header comment says were traced from `ago-landing` — but `ago-landing/index.html`
  now loads a different three (`Onest`/`IBM Plex Sans`/`IBM Plex Mono`). `typography.html` shows both,
  with real specimens and each family's real license named (five carry the SIL Open Font License 1.1;
  `JetBrains Mono` carries the Apache License 2.0).
- **Components** — the thirteen real components `ago-console/src/components/` ships
  (`Alert`/`Badge`/`Button`/`Dialog`/`Field`/`Input`/`Panel`/`PhoneInput`/`Select`/`Spinner`/`Table`/
  `Textarea`/`Tooltip`), each shown in its real states on `components.html`, styled by hand-authoring
  markup against the real `components.css` and the token values it reads — not by importing React or
  running the actual components. `PhoneInput` (`25-186`) is the one real one-country phone field this
  platform ships anywhere — the non-interactive 🇷🇺 +7 prefix, shown empty/filled/invalid.
- **The five channel icons** — copied verbatim from `ago-chat`'s `25-172` (`telegram.svg`,
  `whatsapp.svg`, `vk.svg`, `max.svg`, `avito.svg`) into `icons/`. Not redrawn, recolored, or
  re-derived.
- **The logo** — there is no separate mark in `ago-landing` or `ago-console` today, only the "AGO"
  wordmark set in the display face. That wordmark is documented as the logo; this repository does not
  invent a symbol that does not already exist.

Filed as `docs/backlog/25-180-*.md` and `25-183-*.md` in `ago-root`.

## What's here

- `index.html` — overview + the color page.
- `typography.html` — both real type systems, side by side, with real specimens and licenses.
- `icons.html` — the five real channel marks.
- `components.html` — the thirteen real `ago-console` components, in their real states.
- `logo.html` — the wordmark.
- `styles.css` — this site's own small design system and shared nav/chrome (deliberately not shared
  with any source file — this site displays their tokens/components as data, it does not build a
  product UI out of them).
- `components.css` — used only by `components.html`: hand-authored to match
  `ago-console/src/components/components.css` and the token values it depends on, scoped under
  `.console-demo` so it can never collide with this site's own chrome.
- `tokens.js` — the actual color/type values, copied out of `tokens.css`/`styles.css` into plain
  data arrays and rendered with a few DOM calls. No framework, no build step.
- `icons/` — the five channel SVGs, byte-identical to `ago-chat`'s `25-172` originals.
- `Dockerfile` — packages it behind a minimal `nginx:1.31-alpine-slim`, matching the same
  no-build-step static-file pattern `ago-landing`'s, `ago-widget`'s and `ago-console`'s own
  demo/console images use.
- `.github/workflows/ci.yml` — builds the image on every pull request and publishes it from `main`.

## Running it locally

```bash
cd ago-brandbook
docker build -t ago-brandbook:local .
docker run --rm -p 8091:80 ago-brandbook:local
# open http://localhost:8091
```

Or just open `index.html` directly in a browser — it has no server-side dependency at all.

## Deployment

CI publishes `ghcr.io/golyakoff/ago-brandbook:<40-char commit SHA>` on every push to `main`, using
the workflow's own `GITHUB_TOKEN` and no other secret. Deploy it with `./deploy.sh brandbook <sha>`
from `ago-deploy/k8s` on the node.

Routed at `brandbook.reserve-me.ru` via `ago-deploy/k8s/overlays/demo/brandbook-static.yaml` and the
matching `Gateway`/`HTTPRoute`/`Certificate` wiring in `ago-deploy/k8s/overlays/demo/gateway.yaml` and
`tls.yaml`.

The image serves `/version.json` — `{"app":"ago-brandbook","commit":"<sha>"}` — so
`curl https://brandbook.reserve-me.ru/version.json` names the deployed commit without cluster access.
This page takes no build-time configuration at all, which is why its SHA tag means one thing with no
effort: there is no environment for the image to have been pointed at.

## License

MIT — see `LICENSE`.
