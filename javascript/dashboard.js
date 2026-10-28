// Dashboard, timeline views and statistics ---------------------------------------------------------------------------------------------------------------------------------
// Presentation only: it reads what the generator already wrote (the period cells, periods[] and the export snapshots) and never recalculates it.
// Each block remembers the HTML it last wrote, so the MutationObserver on .sheet settles instead of looping.

var dash = { period: 0, current: 1 };   // period = the tab picked by the user (0 = follow the latest generated period); current = the one shown
var evoMetric = sitePrefs().statistic;       // statistic shown in the evolution chart: doriki | bounty | haki (default in settings)
var timelineView = sitePrefs().timelineView; // all | milestones (default in settings)
var written = new WeakMap();            // element -> last HTML written to it
var posterKey = "", portraitKey = "";   // last drawn state of the Wanted Poster thumbnail and of the portrait frame
var POSTER_THUMB_SCALE = 0.5;
var EVO_COLORS = { doriki: "#f5b82e", bounty: "#e63a14" };
var HAKI_COLORS = { Conquerors: "#c86bff", Armament: "#e63a14", Observation: "#3fb6ff" };
var mobileQuery = window.matchMedia("(max-width: 720px)");

// Writes HTML only when it differs from what was written last time. Returns true when it changed
function setHtml(el, html) {
  if (!el || written.get(el) === html) return false;
  written.set(el, html);
  el.innerHTML = html;
  return true;
}

function esc(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function cellOf(base, n) { return document.getElementById(cellId(base, n)); }

// The tab picked by the user if it has been generated, otherwise the latest generated period
function dashPeriod(available) {
  if (available.indexOf(dash.period) !== -1) return dash.period;
  return available.length ? available[available.length - 1] : 1;
}

// Restarts the small transition of a stat that just changed
function bump(el) {
  el.classList.remove("bump");
  void el.offsetWidth;
  el.classList.add("bump");
}

// Icon of each Haki (inline SVG, drawn with currentColor); a Haki not unlocked shows a padlock
var HAKI_ICONS = {
  Observation: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" /><circle cx="12" cy="12" r="3" />',
  Armament: '<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />',
  Conquerors: '<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" />'
};
var HAKI_LOCK = '<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />';

// Haki of a period as circles: the icon, the name and the level ("Not unlocked" when it is 0)
function hakiDashHtml(levels) {
  return HAKI_TYPES.map(function (t) {
    var lv = levels[t] || 0;
    var icon = lv ? HAKI_ICONS[t] : HAKI_LOCK;
    return '<div class="haki-item haki-' + t.toLowerCase() + (lv ? " unlocked lv-" + lv : " locked") + '">' +
      '<span class="haki-orb" aria-hidden="true"><svg viewBox="0 0 24 24">' + icon + '</svg></span>' +
      '<span class="haki-name">' + HAKI_LABELS[t] + '</span>' +
      '<span class="haki-state">' + (lv ? HAKI_LEVEL_NAMES[lv] : "Not unlocked") + '</span></div>';
  }).join("");
}

// Dashboard ----------------------------------------------------------------------------------------------------------------------------------------------------------------

function syncDashboard(force) {
  if (force) { written = new WeakMap(); posterKey = ""; portraitKey = ""; }
  var available = exportAvailablePeriods(), n = dashPeriod(available);
  dash.current = n;

  document.querySelectorAll(".dash-tabs .seg-tab").forEach(function (t) {
    var k = Number(t.getAttribute("data-period")), on = k === n;
    t.classList.toggle("active", on);
    t.setAttribute("aria-checked", String(on));
    t.disabled = available.indexOf(k) === -1;
  });

  // Mirrors of the period cells: the same text (or markup, e.g. the icon and the feat list) as the selected period
  document.querySelectorAll("[data-src]").forEach(function (el) {
    var cell = cellOf(el.getAttribute("data-src"), n);
    var changed = setHtml(el, cell ? cell.innerHTML : "");
    if (changed && el.matches(".stat-value, .stat-change")) bump(el);
  });

  var haki = document.getElementById("dash-haki");
  setHtml(haki, hakiDashHtml(periods[n].haki || noHaki()));
  haki.setAttribute("aria-label", hakiText(periods[n].haki || noHaki(), ", "));

  document.getElementById("dash-fruit-info").hidden = !fruitData(n);

  var has = available.length > 0;
  document.getElementById("dash-export").disabled = !has;
  renderDashPoster(n, has);
  renderDashPortrait();
  renderEvolution(available);
  renderMilestones(available);
}

// Wanted Poster thumbnail of the shown period, drawn with the same renderer as the export
function renderDashPoster(n, has) {
  var canvas = document.getElementById("dash-poster");
  canvas.hidden = !has;
  document.getElementById("dash-poster-empty").hidden = has;
  if (!has) return;
  var key = JSON.stringify([n, exportCharacter(), exportPeriod(n),
    posterPortrait && [posterPortrait.zoom, posterPortrait.x, posterPortrait.y, posterPortrait.w, posterPortrait.h]]);
  if (key === posterKey) return;
  posterKey = key;
  loadExportAssets().then(function () {
    renderPoster(canvas, exportCharacter(), exportPeriod(n), POSTER_THUMB_SCALE);
  });
}

// The uploaded portrait, cover-fitted into a square with the same zoom and position chosen in the export tools
function renderDashPortrait() {
  var canvas = document.getElementById("dash-portrait"), p = posterPortrait;
  canvas.hidden = !p;
  document.getElementById("dash-placeholder").hidden = !!p;
  var key = p ? [p.zoom, p.x, p.y, p.w, p.h].join(",") : "";
  if (!p || key === portraitKey) return;
  portraitKey = key;
  var S = 320, k = S / POSTER_PORTRAIT.size;
  var s = Math.max(S / p.w, S / p.h) * p.zoom, dw = p.w * s, dh = p.h * s;
  canvas.width = S;
  canvas.height = S;
  var ctx = canvas.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(p.canvas, S / 2 + p.x * k - dw / 2, S / 2 + p.y * k - dh / 2, dw, dh);
}

function openDashExport() {
  exportSelected = dash.current;
  openExport();
}

function openDashPortrait() {
  openDashExport();
  document.getElementById("portrait-file").click();   // same user gesture, so the file dialog opens
}

function openDashFruit() {
  openFruitInfo(dash.current);
}

// "View All Years": the full timeline, scrolled into view
function showAllYears() {
  setView("all");
  document.querySelector(".timeline-head").scrollIntoView({ behavior: "smooth", block: "start" });
}

// Statistics evolution --------------------------------------------------------------------------------------------------------------------------------------------------

// SVG line chart of the generated periods only. Values are the ones the period cards show (same rounding)
function evolutionSvg(ns) {
  if (!ns.length) return '<p class="evo-empty">Generate a period to see how the character changes over time.</p>';
  // On phones the drawing is narrower, so it scales down less and the axis labels stay readable
  var small = mobileQuery.matches;
  var W = small ? 420 : 600, H = small ? 260 : 280, L = small ? 92 : 104, R = small ? 20 : 28, T = 26, B = 40, PH = H - T - B, PW = W - L - R;
  var x = { 1: L + PW / 6, 2: L + PW / 2, 3: L + PW * 5 / 6 };
  var series, max, tick, fmt, label;

  if (evoMetric === "haki") {
    max = 3;
    tick = [0, 1, 2, 3];
    fmt = function (v) { return HAKI_LEVEL_NAMES[v]; };
    label = "Haki";
    series = HAKI_TYPES.map(function (t) {
      return { label: HAKI_LABELS[t], color: HAKI_COLORS[t], values: ns.map(function (n) { return (periods[n].haki || noHaki())[t] || 0; }) };
    });
  } else {
    var values = ns.map(function (n) { return evoMetric === "doriki" ? parseInt(periods[n].doriki) : roundBounty(periods[n].bounty); });
    max = Math.max.apply(null, values.concat([1])) * 1.12;
    tick = [0, max / 2, max];
    fmt = evoMetric === "doriki" ? function (v) { return Math.round(v).toLocaleString("en-US"); } : formatBounty;
    label = evoMetric === "doriki" ? "Doriki" : "Bounty";
    series = [{ label: label, color: EVO_COLORS[evoMetric], values: values }];
  }

  var y = function (v) { return (T + PH - (v / max) * PH).toFixed(1); };
  var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + label + ' evolution">';
  tick.forEach(function (t) {
    var ty = y(t);
    svg += '<line class="evo-grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + ty + '" y2="' + ty + '"/>';
    svg += '<text class="evo-axis" x="' + (L - 10) + '" y="' + (Number(ty) + 4) + '" text-anchor="end">' + fmt(t) + '</text>';
  });
  series.forEach(function (s) {
    var pts = ns.map(function (n, i) { return x[n] + "," + y(s.values[i]); });
    if (pts.length > 1) svg += '<polyline class="evo-line" fill="none" stroke="' + s.color + '" stroke-width="3" stroke-linejoin="round" points="' + pts.join(" ") + '"/>';
    ns.forEach(function (n, i) {
      var v = s.values[i];
      svg += '<circle cx="' + x[n] + '" cy="' + y(v) + '" r="6" fill="' + s.color + '"><title>' + esc(s.label + " · " + PERIOD_NAMES[n] + ": " + fmt(v)) + '</title></circle>';
      if (evoMetric !== "haki") svg += '<text class="evo-value" x="' + x[n] + '" y="' + (Number(y(v)) - 14) + '" text-anchor="middle">' + fmt(v) + '</text>';
    });
  });
  [1, 2, 3].forEach(function (n) {
    svg += '<text class="evo-axis" x="' + x[n] + '" y="' + (H - 12) + '" text-anchor="middle">' + PERIOD_NAMES[n] + '</text>';
  });
  svg += "</svg>";

  if (evoMetric === "haki") {
    svg += '<ul class="evo-legend">' + series.map(function (s) {
      return '<li><i style="background: ' + s.color + '"></i>' + esc(s.label) + '</li>';
    }).join("") + '</ul>';
  }
  return svg;
}

function renderEvolution(available) {
  document.querySelectorAll(".evo-tab").forEach(function (t) {
    var on = t.getAttribute("data-metric") === evoMetric;
    t.classList.toggle("active", on);
    t.setAttribute("aria-checked", String(on));
  });
  setHtml(document.getElementById("evo-chart"), evolutionSvg(available));
}

// Milestones ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// Key moments found by comparing each generated period with the one before it (the same data the period cards show)
var MILESTONE_KINDS = { affiliation: "Affiliation", rank: "Rank", haki: "Haki", fruit: "Devil Fruit", feat: "Feat" };

function milestoneEvents(n) {
  var p = periods[n], before = n > 1 ? periods[n - 1] : {}, out = [];
  if (n === 1) out.push({ kind: "affiliation", title: "Joins " + p.alliance, detail: p.mainAlliance });
  else if (p.alliance !== before.alliance) out.push({ kind: "affiliation", title: "Moves to " + p.alliance, detail: "Previously " + before.alliance });
  if (n > 1 && p.rank !== before.rank) out.push({ kind: "rank", title: "Rank: " + p.rank, detail: "Previously " + before.rank });
  HAKI_TYPES.forEach(function (t) {
    var now = (p.haki || {})[t] || 0, prev = (before.haki || {})[t] || 0;
    if (now > prev) {
      out.push({
        kind: "haki",
        title: prev ? HAKI_LABELS[t] + " grows" : "Awakens " + HAKI_LABELS[t],
        detail: prev ? HAKI_LEVEL_NAMES[prev] + " → " + HAKI_LEVEL_NAMES[now] : HAKI_LEVEL_NAMES[now]
      });
    }
  });
  if (p.fruit && p.fruit !== "None" && p.fruit !== before.fruit) out.push({ kind: "fruit", title: "Devil Fruit: " + p.fruit, detail: p.fruitType });
  (p.feats || []).forEach(function (f) {
    if ((before.feats || []).indexOf(f) === -1) out.push({ kind: "feat", title: f, detail: "Feat · " + p.alliance });
  });
  return out;
}

function renderMilestones(available) {
  var events = {};
  [1, 2, 3].forEach(function (n) {
    events[n] = available.indexOf(n) !== -1 ? milestoneEvents(n) : [];
    document.getElementById("card-" + n).classList.toggle("has-milestone", events[n].length > 0);
  });

  var html = "";
  [1, 2, 3].forEach(function (n) {
    if (!events[n].length) return;
    html += '<article class="ms-period"><header class="ms-head"><span class="period-badge">' + (n === 1 ? "Start" : "Timeskip") + '</span>' +
      '<h3 class="ms-title">' + PERIOD_NAMES[n] + '</h3></header><ul class="ms-events">' +
      events[n].map(function (e) {
        return '<li class="ms-event kind-' + e.kind + '"><span class="ms-icon" aria-hidden="true"></span><div><em class="ms-kind">' +
          MILESTONE_KINDS[e.kind] + '</em><strong>' + esc(e.title) + '</strong><span>' + esc(e.detail) + '</span></div></li>';
      }).join("") + '</ul></article>';
  });
  setHtml(document.getElementById("milestones"), html || '<p class="ms-empty">Generate a period to see its milestones.</p>');
}

function setView(view) {
  timelineView = view;
  document.querySelectorAll(".view-btn").forEach(function (b) {
    var on = b.getAttribute("data-view") === view;
    b.classList.toggle("active", on);
    b.setAttribute("aria-pressed", String(on));
  });
  document.querySelector(".timeline").hidden = view !== "all";
  document.getElementById("milestones").hidden = view === "all";
}

// Clicks ---------------------------------------------------------------------------------------------------------------------------------------------------------------------

document.addEventListener("click", function (e) {
  var t = e.target;
  if (!t.closest) return;
  var tab = t.closest(".dash-tabs .seg-tab");
  if (tab && !tab.disabled) { dash.period = Number(tab.getAttribute("data-period")); syncDashboard(); return; }
  var evo = t.closest(".evo-tab");
  if (evo) { evoMetric = evo.getAttribute("data-metric"); syncDashboard(); return; }
  var view = t.closest(".view-btn");
  if (view) { setView(view.getAttribute("data-view")); return; }
  // Phones: "Show details" reveals the repeated identity and the secondary attributes of a period card
  var more = t.closest(".more-toggle");
  if (more) {
    var open = more.getAttribute("aria-expanded") !== "true";
    more.setAttribute("aria-expanded", String(open));
    more.closest(".period").classList.toggle("show-more", open);
    return;
  }
  // On phones a period card is tapped to show or hide its details (its summary stays in the header)
  var head = t.closest(".period .period-head");
  if (head && !t.closest("button") && mobileQuery.matches) toggleCard(Number(head.parentElement.id.split("-")[1]));
});

document.addEventListener("DOMContentLoaded", function () {
  var sheet = document.querySelector(".sheet");
  if (!sheet) return;
  setView(timelineView);
  syncDashboard(true);
  mobileQuery.addEventListener("change", function () { syncDashboard(true); });   // the chart is drawn for the current width
  new MutationObserver(function () { syncDashboard(); }).observe(sheet, { childList: true, subtree: true, characterData: true });
});
