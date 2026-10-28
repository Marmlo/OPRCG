// Full Character Sheet (PNG / PDF) ------------------------------------------------------------------------------------------------------------------------------------------
// Every generated period, in order, on a dark sheet that matches the site. Each block is measured first (dry run),
// so a period is never cut in half: when it does not fit on the current A4 page it moves to the next one.

var SHEET_W = 1240, SHEET_PAGE_H = 1754;   // A4 proportion, so every PDF page is a full A4 page
var SHEET_MARGIN = 60, SHEET_GAP = 28, SHEET_FOOT = 70;
var SHEET_BG = "#12161f", SHEET_PANEL = "#171c28", SHEET_TEXT = "#eef1f6", SHEET_MUTED = "#9aa3b2", SHEET_GOLD = "#f5b82e";

// Label above a value. dry = only measure. Returns the height used
function sheetField(ctx, label, value, x, y, w, dry) {
  ctx.font = "700 15px " + EXPORT_TEXT_FONT;
  if (!dry) { ctx.fillStyle = SHEET_MUTED; ctx.fillText(label.toUpperCase(), x, y + 16); }
  ctx.font = "500 22px " + EXPORT_TEXT_FONT;
  var lines = wrapLines(ctx, value || "-", w);
  if (!dry) {
    ctx.fillStyle = SHEET_TEXT;
    lines.forEach(function (l, i) { ctx.fillText(l, x, y + 44 + i * 30); });
  }
  return 44 + lines.length * 30 + 12;
}

// Two columns of label/value pairs, row height = the taller of the two
function sheetGrid(ctx, fields, x, y, w, dry) {
  var colW = (w - 30) / 2, total = 0;
  for (var i = 0; i < fields.length; i += 2) {
    var a = sheetField(ctx, fields[i][0], fields[i][1], x, y + total, colW, dry);
    var b = fields[i + 1] ? sheetField(ctx, fields[i + 1][0], fields[i + 1][1], x + colW + 30, y + total, colW, dry) : 0;
    total += Math.max(a, b);
  }
  return total;
}

function sheetHeading(ctx, text, x, y, w, dry) {
  if (!dry) {
    ctx.fillStyle = SHEET_GOLD;
    ctx.font = "400 30px " + EXPORT_TITLE_FONT;
    ctx.fillText(text.toUpperCase(), x, y + 28);
    ctx.fillStyle = "rgba(245, 184, 46, 0.35)";
    ctx.fillRect(x, y + 38, w, 2);
  }
  return 52;
}

// Header: logo, name, nickname and the identity fields
function sheetHeader(assets, character) {
  return function (ctx, y, dry) {
    var cw = SHEET_W - 2 * SHEET_MARGIN, logo = assets && assets.logo;
    var lw = 340, lh = logo ? lw * logo.naturalHeight / logo.naturalWidth : 0;
    var t = lh + (logo ? 24 : 0);
    if (!dry) {
      if (logo) ctx.drawImage(logo, (SHEET_W - lw) / 2, y, lw, lh);
      ctx.textAlign = "center";
      ctx.fillStyle = SHEET_GOLD;
      ctx.font = "400 96px " + EXPORT_TITLE_FONT;
      ctx.fillText(fitText(ctx, character.name.toUpperCase(), cw, 96, 56, "400", EXPORT_TITLE_FONT), SHEET_W / 2, y + t + 84);
      if (character.nickname) {
        ctx.fillStyle = SHEET_MUTED;
        ctx.font = "italic 400 36px " + EXPORT_TEXT_FONT;
        ctx.fillText(fitText(ctx, character.nickname, cw, 36, 22, "italic 400", EXPORT_TEXT_FONT), SHEET_W / 2, y + t + 136);
      }
      ctx.textAlign = "left";
    }
    t += 150;
    t += sheetGrid(ctx, [["Race", character.race], ["Region (birthplace)", character.region], ["Gender", character.gender]], SHEET_MARGIN, y + t, cw, dry);
    return t;
  };
}

// One period: affiliation, powers, fruit, record. Only the data of that period is used
function sheetPeriod(snap) {
  return function (ctx, y, dry) {
    var x = SHEET_MARGIN + 36, cw = SHEET_W - 2 * SHEET_MARGIN - 72, padY = 28;
    function body(top, d) {
      var t = top + sheetHeading(ctx, snap.label + (snap.n > 1 ? " · Timeskip" : " · Start"), x, top, cw, d) + 8;
      t += sheetGrid(ctx, [
        ["Alliance", snap.alliance], ["Rank (within the alliance)", snap.rank],
        ["Fighting style", snap.fighting], ["Haki", hakiText(snap.haki, ", ")],
        ["Devil fruit (type)", snap.fruitType], ["Devil fruit", snap.fruit ? snap.fruit.fruit : "None"]
      ], x, t, cw, d) + 14;
      if (snap.fruit) t += sheetField(ctx, "Devil fruit power", snap.fruit.powerText, x, t, cw, d) + 14;
      t += sheetGrid(ctx, [
        ["Doriki", snap.doriki.toLocaleString("en-US") + (snap.dorikiChange ? " " + snap.dorikiChange : "")],
        ["Bounty", snap.hasBounty ? snap.bountyText + " " + snap.bountyChange : "No bounty"]
      ], x, t, cw, d) + 14;
      t += sheetField(ctx, "Feats", snap.feats.length ? snap.feats.map(function (f) { return "- " + f; }).join("\n") : "None", x, t, cw, d);
      return t - top;
    }
    var h = body(0, true) + 2 * padY;
    if (!dry) {
      ctx.fillStyle = SHEET_PANEL;
      roundRectPath(ctx, SHEET_MARGIN, y, SHEET_W - 2 * SHEET_MARGIN, h, 18);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 2;
      ctx.stroke();
      body(y + padY, false);
    }
    return h;
  };
}

function sheetFooter(ctx, page, pages, h) {
  ctx.textAlign = "center";
  ctx.fillStyle = SHEET_MUTED;
  ctx.font = "500 18px " + EXPORT_TEXT_FONT;
  ctx.fillText(EXPORT_URL + "   ·   " + page + " / " + pages, SHEET_W / 2, h - 30);
  ctx.textAlign = "left";
}

// pageH = null gives one tall canvas (PNG); a number gives A4-sized canvases (PDF pages)
function renderSheetPages(assets, character, snaps, pageH) {
  var blocks = [sheetHeader(assets, character)].concat(snaps.map(sheetPeriod));
  var measure = newCanvas(SHEET_W, 10).getContext("2d");
  var heights = blocks.map(function (b) { return b(measure, 0, true); });
  var avail = pageH ? pageH - SHEET_MARGIN - SHEET_FOOT : Infinity;

  var groups = [[]], used = 0;
  heights.forEach(function (h, i) {
    if (groups[groups.length - 1].length && used + SHEET_GAP + h > avail) { groups.push([]); used = 0; }
    used += groups[groups.length - 1].length ? SHEET_GAP + h : h;
    groups[groups.length - 1].push(i);
  });

  var total = heights.reduce(function (a, b) { return a + b; }, 0) + SHEET_GAP * (heights.length - 1) + SHEET_MARGIN + SHEET_FOOT;
  return groups.map(function (group, p) {
    var h = pageH || total;
    var canvas = newCanvas(SHEET_W, h), ctx = canvas.getContext("2d");
    var bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#1b2130");
    bg.addColorStop(1, SHEET_BG);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, SHEET_W, h);
    ctx.textBaseline = "alphabetic";
    var y = SHEET_MARGIN;
    group.forEach(function (i) {
      blocks[i](ctx, y, false);
      y += heights[i] + SHEET_GAP;
    });
    sheetFooter(ctx, p + 1, groups.length, h);
    return canvas;
  });
}
