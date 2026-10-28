// Character Export System ---------------------------------------------------------------------------------------------------------------------------------------------
// Replaces the old PDF export. Reads the generated character (periods[], race, region, DOM) and offers:
//   - Bounty Poster (PNG) for one chosen period  -> export-poster.js
//   - Full Character Sheet (PNG / PDF)           -> export-sheet.js
// Everything is drawn on <canvas>, so no extra libraries are needed (jsPDF is only used to wrap the sheet pages into a PDF).

var EXPORT_URL = "onepiecegenerator.netlify.app";
var EXPORT_TITLE_FONT = '"BangersExport", "Bangers", Impact, sans-serif';
var EXPORT_TEXT_FONT = '"Inter", "Segoe UI", Helvetica, Arial, sans-serif';
var EXPORT_SERIF_FONT = 'Georgia, "Times New Roman", Times, serif';

// Data ---------------------------------------------------------------------------------------------------------------------------------------------------------------------

function exportText(id) {
  var el = document.getElementById(id);
  return el ? el.textContent.trim() : "";
}

// Who the character is (the same for every period)
function exportCharacter() {
  var gender = document.getElementById("gender");
  return {
    name: document.getElementById("fname").value.trim() || "Unnamed Pirate",
    nickname: document.getElementById("nickname").value.trim(),
    race: raceLabel(),
    raceName: race ? raceTitle() : "",
    raceType: race ? race.type : "",
    raceOrigin: race ? race.origin : "",
    raceSubtype: race ? race.subtype : "",
    raceComponents: race && race.type !== "Pure" ? componentsText() : "",
    raceDescription: race ? race.description : "",
    region: exportText("region"),
    gender: gender.options[gender.selectedIndex].text
  };
}

// A period is exportable once its last step (the bounty) has been generated
function exportPeriodReady(n) {
  var p = periods[n];
  return !!p && p.bounty !== undefined && p.doriki !== undefined && !!p.alliance;
}

function exportAvailablePeriods() {
  return [1, 2, 3].filter(exportPeriodReady);
}

// What the character had in period n, only from that period's own data (never the final one)
function exportPeriod(n) {
  var p = periods[n];
  var fruit = fruitData(n);
  var bounty = roundBounty(p.bounty);
  return {
    n: n,
    label: PERIOD_NAMES[n],
    badge: n === 1 ? "Start" : "Timeskip",
    alliance: p.alliance || "-",
    affiliation: [p.mainAlliance, p.alliance].filter(Boolean).join(" → ") || "-",   // ex: World Government → Government
    rank: p.rank || "-",
    fighting: p.fighting || "None",
    haki: p.haki || noHaki(),
    fruitType: p.fruitType || "No",
    fruit: fruit,   // { type, fruit, typeText, powerText } or null
    feats: p.feats || [],
    doriki: parseInt(p.doriki),
    dorikiChange: exportText(cellId("adddoriki", n)),
    bounty: bounty,
    hasBounty: bounty > 0,
    bountyText: formatBounty(bounty),
    bountyChange: exportText(cellId("addbounty", n))
  };
}

// Canvas helpers -----------------------------------------------------------------------------------------------------------------------------------------------------------

var exportAssets = null;

// Loads the title font and the logo once; failures fall back to system fonts / no logo
function loadExportAssets() {
  if (exportAssets) return exportAssets;
  var font = new FontFace("BangersExport", "url(fonts/Bangers-Regular.ttf)");
  var logo = new Promise(function (resolve) {
    var img = new Image();
    img.onload = function () { resolve(img); };
    img.onerror = function () { resolve(null); };
    img.src = "images/Logo.png";
  });
  exportAssets = Promise.all([
    font.load().then(function (f) { document.fonts.add(f); }).catch(function () {}),
    document.fonts.load('700 20px "Inter"').catch(function () {}),
    logo
  ]).then(function (r) { return { logo: r[2] }; });
  return exportAssets;
}

function newCanvas(w, h) {
  var c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

// Small deterministic random generator, so a poster looks the same every time it is drawn
function seededRandom(text) {
  var h = 1779033703;
  for (var i = 0; i < text.length; i++) { h = Math.imul(h ^ text.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  var a = h >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Breaks text into lines that fit maxW (long words are split). Uses the font currently set on ctx
function wrapLines(ctx, text, maxW) {
  var lines = [];
  String(text).split("\n").forEach(function (paragraph) {
    var line = "";
    paragraph.split(/\s+/).filter(Boolean).forEach(function (word) {
      while (ctx.measureText(word).width > maxW) {   // a single word wider than the line
        var cut = word.length - 1;
        while (cut > 1 && ctx.measureText(word.slice(0, cut)).width > maxW) cut--;
        if (line) { lines.push(line); line = ""; }
        lines.push(word.slice(0, cut));
        word = word.slice(cut);
      }
      var test = line ? line + " " + word : word;
      if (line && ctx.measureText(test).width > maxW) { lines.push(line); line = word; } else line = test;
    });
    lines.push(line);
  });
  return lines.length ? lines : [""];
}

// Same as wrapLines but never more than maxLines: the last line ends with "…" when text was cut
function clampLines(ctx, text, maxW, maxLines) {
  var lines = wrapLines(ctx, text, maxW);
  if (lines.length <= maxLines) return lines;
  lines = lines.slice(0, maxLines);
  var last = lines[maxLines - 1];
  while (last.length > 1 && ctx.measureText(last + "…").width > maxW) last = last.slice(0, -1);
  lines[maxLines - 1] = last.replace(/[\s,.;:]+$/, "") + "…";
  return lines;
}

// Sets the biggest font size (<= maxSize) at which text fits on one line; below minSize the text is shortened instead
function fitText(ctx, text, maxW, maxSize, minSize, weight, family) {
  var size = maxSize;
  function set() { ctx.font = weight + " " + size + "px " + family; }
  set();
  while (size > minSize && ctx.measureText(text).width > maxW) { size -= 2; set(); }
  if (ctx.measureText(text).width <= maxW) return text;
  while (text.length > 1 && ctx.measureText(text + "…").width > maxW) text = text.slice(0, -1);
  return text + "…";
}

// Spaced-out capitals (canvas letterSpacing is not available everywhere)
function drawSpaced(ctx, text, cx, y, spacing) {
  var chars = text.split(""), widths = chars.map(function (c) { return ctx.measureText(c).width; });
  var total = widths.reduce(function (a, b) { return a + b; }, 0) + spacing * (chars.length - 1);
  var x = cx - total / 2, align = ctx.textAlign;
  ctx.textAlign = "left";
  chars.forEach(function (c, i) { ctx.fillText(c, x, y); x += widths[i] + spacing; });
  ctx.textAlign = align;
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function starPath(ctx, cx, cy, r) {
  ctx.beginPath();
  for (var i = 0; i < 10; i++) {
    var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
    ctx[i ? "lineTo" : "moveTo"](cx + rr * Math.cos(a), cy + rr * Math.sin(a));
  }
  ctx.closePath();
}

function exportFileName(character, suffix, ext) {
  var base = character.name.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "") || "character";
  return base + "_" + suffix + "." + ext;
}

function downloadBlob(blob, fileName) {
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
}

function downloadCanvas(canvas, fileName) {
  return new Promise(function (resolve, reject) {
    canvas.toBlob(function (blob) {
      if (!blob) { reject(new Error("The image could not be created")); return; }
      downloadBlob(blob, fileName);
      resolve();
    }, "image/png");
  });
}

// Export modal --------------------------------------------------------------------------------------------------------------------------------------------------------------

var exportSelected = 0;
var exportBusy = false;

function exportStatus(text, isError) {
  var el = document.getElementById("export-status");
  el.textContent = text || "";
  el.classList.toggle("error", !!isError);
}

function exportSetBusy(busy, text) {
  exportBusy = busy;
  document.querySelectorAll("#export-modal .export-action").forEach(function (b) {
    b.disabled = busy || b.hasAttribute("data-needs-data") && !exportAvailablePeriods().length;
  });
  exportStatus(busy ? text : "");
}

function openExport() {
  var available = exportAvailablePeriods();
  var ready = available.length && race;
  document.getElementById("export-empty").hidden = !!ready;
  document.getElementById("export-content").hidden = !ready;
  if (ready) {
    // Start on the latest generated period, since that is usually the one people want to share
    if (available.indexOf(exportSelected) === -1) exportSelected = available[available.length - 1];
    buildPeriodPicker(available);
    exportSetBusy(false);
    renderExportPreview();
    updatePortraitControls();
  }
  document.getElementById("export-modal").hidden = false;
  document.getElementById("export-close").focus();
}

function closeExport() {
  document.getElementById("export-modal").hidden = true;
}

function buildPeriodPicker(available) {
  var box = document.getElementById("export-periods");
  box.innerHTML = "";
  [1, 2, 3].forEach(function (n) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "export-period" + (n === exportSelected ? " active" : "");
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", String(n === exportSelected));
    var ok = available.indexOf(n) !== -1;
    btn.disabled = !ok;
    btn.title = ok ? "" : "Not generated yet";
    btn.innerHTML = "<small></small><span></span>";
    btn.firstChild.textContent = n === 1 ? "Start" : "Timeskip";
    btn.lastChild.textContent = PERIOD_NAMES[n];
    btn.onclick = function () { exportSelected = n; buildPeriodPicker(available); renderExportPreview(); };
    box.appendChild(btn);
  });
}

function renderExportPreview() {
  var canvas = document.getElementById("export-preview");
  loadExportAssets().then(function () {
    renderPoster(canvas, exportCharacter(), exportPeriod(exportSelected), POSTER_PREVIEW_SCALE);
  });
}

// Runs an export action with a busy state and error message
function runExport(label, task) {
  if (exportBusy) return;
  exportSetBusy(true, label);
  loadExportAssets().then(task).then(function () {
    exportSetBusy(false);
    exportStatus("Done! Your file was downloaded.");
  }).catch(function (e) {
    console.error(e);
    exportSetBusy(false);
    exportStatus("Something went wrong while creating the file. Please try again.", true);
  });
}

function exportPosterPNG() {
  runExport("Creating the poster…", function () {
    var character = exportCharacter(), snap = exportPeriod(exportSelected);
    var canvas = newCanvas(1, 1);
    renderPoster(canvas, character, snap, POSTER_EXPORT_SCALE);
    return downloadCanvas(canvas, exportFileName(character, "bounty_poster_" + PERIOD_NAMES[exportSelected].replace(/\s+/g, "-").toLowerCase(), "png"));
  });
}

function exportSheetPNG() {
  runExport("Creating the character sheet…", function (assets) {
    var character = exportCharacter();
    var pages = renderSheetPages(assets, character, exportAvailablePeriods().map(exportPeriod), null);
    return downloadCanvas(pages[0], exportFileName(character, "character_sheet", "png"));
  });
}

function exportSheetPDF() {
  runExport("Creating the PDF…", function (assets) {
    var character = exportCharacter();
    var pages = renderSheetPages(assets, character, exportAvailablePeriods().map(exportPeriod), SHEET_PAGE_H);
    var doc = new window.jspdf.jsPDF({ unit: "mm", format: "a4", compress: true });
    pages.forEach(function (page, i) {
      if (i) doc.addPage();
      doc.addImage(page.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 210, 297);
    });
    doc.save(exportFileName(character, "character_sheet", "pdf"));
  });
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeExport();
});
