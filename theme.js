/* AGO Brandbook - manual theme toggle. `25-184`: this repository had zero JS behind its theming
 * before this file - only `@media (prefers-color-scheme)` in styles.css, no override, no persistence.
 * This mirrors `ago-landing/i18n.js`'s own theme mechanism exactly rather than inventing a second
 * one: `data-theme` written on `<html>`, persisted to `localStorage`, "no attribute" meaning "follow
 * the operating system". The one deliberate difference is the storage key - `ago-brandbook-theme`,
 * not `ago-landing`'s own `ago-theme` - so the two apps' saved choices never collide even though
 * they already sit on different origins in production.
 *
 * Brandbook has no i18n (unlike ago-landing, where this logic lives inside i18n.js alongside the
 * language switch), so this is its own small file rather than folded into `tokens.js` - which stays
 * a plain data array, not a place to add DOM/localStorage logic to.
 */
function agoBrandbookCurrentTheme(){
  return document.documentElement.getAttribute('data-theme')
    || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
}

function agoBrandbookPaintThemeToggle(){
  var btn = document.getElementById('themeToggle');
  var icon = document.getElementById('themeIcon');
  if (!btn || !icon) return;
  var isDark = agoBrandbookCurrentTheme() === 'dark';
  /* The icon and label name the theme a click switches *to*, not the one in effect - same
     convention as ago-landing's own toggle. Plain characters, not an icon font: this page loads no
     Material Symbols, and a sun/moon glyph is legible in either font it does load. */
  icon.textContent = isDark ? '☀' : '☾';
  var label = isDark ? 'Switch to light theme' : 'Switch to dark theme';
  btn.setAttribute('aria-label', label);
  btn.title = label;
}

function agoBrandbookSetTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem('ago-brandbook-theme', theme); } catch (e) {}
  agoBrandbookPaintThemeToggle();
}

(function(){
  var savedTheme = null;
  try { savedTheme = localStorage.getItem('ago-brandbook-theme'); } catch (e) {}
  if (savedTheme === 'light' || savedTheme === 'dark'){
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  var btn = document.getElementById('themeToggle');
  if (btn){
    btn.addEventListener('click', function(){
      agoBrandbookSetTheme(agoBrandbookCurrentTheme() === 'dark' ? 'light' : 'dark');
    });
  }

  agoBrandbookPaintThemeToggle();

  /* No explicit choice yet: follow the system if it changes while the page is open - same as
     ago-landing's own listener. */
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function(){
    if (!document.documentElement.getAttribute('data-theme')) agoBrandbookPaintThemeToggle();
  });
})();
