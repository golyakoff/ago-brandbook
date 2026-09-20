// 25-180: renders the swatches and the type scale from data copied verbatim out of the two real
// source files - ago-console/src/design/tokens.css (light values; the file also defines a measured
// dark override for each, not reproduced here) and ago-landing/styles.css's own dark-first :root.
// A plain data array + DOM calls, the same no-build shape ago-landing's own home.js already uses -
// there is nothing here that needs a bundler.

const consoleBrand = [
  { name: "--ago-brand", hex: "#4b3aff", usage: "6.27:1 against white, both directions — safe as a fill and as text. One primary action per screen." },
  { name: "--ago-brand-deep", hex: "#3324c9", usage: "9.39:1 on --ago-surface — hover state, and link text." },
  { name: "--ago-brand-tint", hex: "#ecebff", usage: "8.00:1 with --ago-brand-deep on top." },
  { name: "--ago-lavender", hex: "#d9d6ff", usage: "Decoration only — halos, dividers inside tinted areas." },
  { name: "--ago-lavender-dim", hex: "#8f8ac9", usage: "Borders/dots, non-text." },
  { name: "--ago-lavender-ink", hex: "#565096", usage: "7.04:1 on --ago-surface — anything with a glyph." },
];

const consoleStatus = [
  { name: "--ago-live", hex: "#33d17a", usage: "Decorative dot only, always beside a real text label." },
  { name: "--ago-success", hex: "#12684a", usage: "6.76:1 on --ago-surface, 6.50:1 on --ago-mint." },
  { name: "--ago-danger", hex: "#9f1d17", usage: "7.89:1 on --ago-surface, 7.56:1 on --ago-paper." },
  { name: "--ago-danger-tint", hex: "#fdecea", usage: "6.90:1 with --ago-danger on top." },
  { name: "--ago-warning", hex: "#7a4d00", usage: "7.27:1 on --ago-surface. Deliberately not danger-toned." },
  { name: "--ago-warning-tint", hex: "#fff4e0", usage: "6.67:1 with --ago-warning on top." },
];

const consoleNeutral = [
  { name: "--ago-ink", hex: "#14141f", usage: "17.50:1 on --ago-paper — primary text." },
  { name: "--ago-ink-soft", hex: "#57546f", usage: "6.93:1 on --ago-paper — secondary text." },
  { name: "--ago-ink-faint", hex: "#6b6780", usage: "5.42:1 on --ago-surface — placeholder text." },
  { name: "--ago-paper", hex: "#fbfaf7", usage: "The application background." },
  { name: "--ago-surface", hex: "#ffffff", usage: "Panels, table bodies, form controls." },
  { name: "--ago-surface-sunken", hex: "#f1efe9", usage: "Table headers, inset areas, disabled controls." },
  { name: "--ago-line", hex: "#e5e2da", usage: "Decorative separators — 1.24:1, not a control edge." },
  { name: "--ago-line-strong", hex: "#8d8675", usage: "3.62:1 on --ago-surface — the edge of a control (WCAG 1.4.11)." },
];

// ago-landing/styles.css's own current :root (dark-first) - its identity colors, not every neutral.
const landing = [
  { name: "--blue", hex: "#4c8dff", usage: "Primary accent — buttons, links, the hero gradient." },
  { name: "--blue-deep", hex: "#2f6ce0", usage: "Hover state for --blue." },
  { name: "--violet", hex: "#9d6bff", usage: "Paired with --blue in gradients (hero heading, CTA buttons)." },
  { name: "--amber", hex: "#f2b23e", usage: "Used sparingly — not a primary or status color on this page." },
  { name: "--green", hex: "#3ddc97", usage: "The free-tier note (\"такой набор помещается в бесплатный аккаунт\")." },
];

const typeScale = [
  { tok: "--ago-text-xs", size: "12px", role: "badges, meta, mono ids" },
  { tok: "--ago-text-sm", size: "13px", role: "field labels, table headers, secondary lines" },
  { tok: "--ago-text-base", size: "15px", role: "body text and every form control" },
  { tok: "--ago-text-lg", size: "17px", role: "panel and section headings" },
  { tok: "--ago-text-xl", size: "20px", role: "the page title, one per screen" },
  { tok: "--ago-text-display", size: "22px", role: "the shell wordmark, the only Unbounded on the screen" },
];

// 25-183: `ago-landing/styles.css`'s own current type scale (no `--token` names there - it sets
// bare `h1`/`h2`/`h3`/`body` rules directly), read from the selector next to each row. `clamp()`
// values are quoted verbatim rather than reduced to one number, and rendered with the same
// `font-size:clamp(...)` string below, so the sample is genuinely responsive the way the real
// heading is - not a snapshot of one viewport width standing in for the real rule.
const landingTypeScale = [
  { tok: "h1", size: "clamp(34px,5.2vw,60px)", font: "'Onest',sans-serif", weight: 800, role: "the hero headline - one per page" },
  { tok: "h2", size: "clamp(25px,3.2vw,38px)", font: "'Onest',sans-serif", weight: 800, role: "section headings" },
  { tok: "h3", size: "17px", font: "'Onest',sans-serif", weight: 700, role: "card and step titles" },
  { tok: "body", size: "15.5px", font: "'IBM Plex Sans',sans-serif", weight: 400, role: "the page's own base size - paragraph copy" },
  { tok: ".lede", size: "16.5px", font: "'IBM Plex Sans',sans-serif", weight: 400, role: "the lede under a heading" },
  { tok: ".kicker", size: "11.5px", font: "'IBM Plex Mono',monospace", weight: 500, role: "eyebrow labels - uppercase, .14em tracking" },
];

function renderSwatches(containerId, tokens) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = tokens.map(t => `
    <div class="swatch">
      <div class="fill" style="background:${t.hex};"></div>
      <div class="meta">
        <div class="name">${t.name}</div>
        <div class="hex">${t.hex}</div>
        <div class="usage">${t.usage}</div>
      </div>
    </div>
  `).join("");
}

function renderTypeScale(containerId, scale) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = scale.map(t => `
    <div class="type-row">
      <span class="tok">${t.tok} · ${t.size}</span>
      <span class="sample" style="font-family:${t.font || "'Manrope',sans-serif"};font-weight:${t.weight || 400};font-size:${t.size};">${t.role}</span>
    </div>
  `).join("");
}

renderSwatches("swatches-console-brand", consoleBrand);
renderSwatches("swatches-console-status", consoleStatus);
renderSwatches("swatches-console-neutral", consoleNeutral);
renderSwatches("swatches-landing", landing);
renderTypeScale("type-scale", typeScale);
renderTypeScale("type-scale-landing", landingTypeScale);
