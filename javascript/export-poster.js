// Bounty Poster (PNG) -------------------------------------------------------------------------------------------------------------------------------------------------
// 1080 x 1350 (4:5) WANTED poster for ONE period. It only reads the snapshot of that period (exportPeriod),
// so nothing the character gets later can show up on it.
// Everything is laid out in logical pixels; the preview and the PNG use the same layout at different pixel densities.

var POSTER_W = 1080, POSTER_H = 1350;
var POSTER_PREVIEW_SCALE = 1.5, POSTER_EXPORT_SCALE = 2;   // canvas pixels per logical pixel
var POSTER_INK = "#3a2410", POSTER_RED = "#8e1b0b", POSTER_FADE = "rgba(58, 36, 16, 0.72)";
var POSTER_HAKI = { Conquerors: "#6e2a9c", Armament: "#a32408", Observation: "#1d68a0" };
var POSTER_MARGIN_X = 110, POSTER_CONTENT_W = POSTER_W - 2 * POSTER_MARGIN_X;

// Section tops (15% header, 30% info, 25% identity, 25% abilities, 5% footer of the printable area)
var POSTER_Y = { header: 118, info: 352, identity: 724, abilities: 1036, footer: 1268 };

// Square portrait area (the skull, or the user's picture when one was uploaded)
var POSTER_PORTRAIT = { x: POSTER_MARGIN_X, y: POSTER_Y.info + 10, size: 270 };

function renderPoster(canvas, character, snap, scale) {
  scale = scale || 1;
  canvas.width = POSTER_W * scale;
  canvas.height = POSTER_H * scale;
  var ctx = canvas.getContext("2d");
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  var rand = seededRandom(character.name + snap.label);

  drawParchment(ctx, rand);
  ctx.save();
  ctx.fillStyle = POSTER_INK;
  ctx.textBaseline = "alphabetic";
  drawPosterHeader(ctx, snap);
  drawPosterInfo(ctx, character, snap, rand);
  drawPosterIdentity(ctx, character, snap);
  drawPosterAbilities(ctx, snap);
  drawPosterFooter(ctx);
  ctx.restore();
}

// Sizing helpers ------------------------------------------------------------------------------------------------------------------------------------------------------------

// Biggest size (step 2) at which text fits maxW on one line; sets ctx.font and returns the size
function posterFit(ctx, text, maxW, maxSize, minSize, weight, family) {
  var s = maxSize;
  for (; s > minSize; s -= 2) {
    ctx.font = weight + " " + s + "px " + family;
    if (ctx.measureText(text).width <= maxW) break;
  }
  if (s < minSize) s = minSize;
  ctx.font = weight + " " + s + "px " + family;
  return s;
}

// Wraps text into at most maxLines by lowering the size; below minSize the text is shortened with "…"
function posterWrap(ctx, text, maxW, maxLines, maxSize, minSize, weight, family) {
  for (var s = maxSize; s >= minSize; s -= 1) {
    ctx.font = weight + " " + s + "px " + family;
    var lines = wrapLines(ctx, text, maxW);
    if (lines.length <= maxLines) return { size: s, lines: lines };
  }
  ctx.font = weight + " " + minSize + "px " + family;
  return { size: minSize, lines: clampLines(ctx, text, maxW, maxLines) };
}

// Character name: one or two lines, the biggest size whose block fits the height budget
function posterName(ctx, text, maxW, budget) {
  for (var s = 124; s >= 48; s -= 4) {
    ctx.font = "400 " + s + "px " + EXPORT_TITLE_FONT;
    var lines = wrapLines(ctx, text, maxW);
    var fits = lines.length <= 2 && lines.every(function (l) { return ctx.measureText(l).width <= maxW; });
    if (fits && lines.length * s * 0.92 <= budget) return { size: s, lines: lines };
  }
  ctx.font = "400 48px " + EXPORT_TITLE_FONT;
  return { size: 48, lines: clampLines(ctx, text, maxW, 2) };
}

function posterHeading(ctx, text, x, y, w) {
  ctx.textAlign = "left";
  ctx.fillStyle = POSTER_RED;
  ctx.font = "700 18px " + EXPORT_SERIF_FONT;
  ctx.fillText(text.toUpperCase(), x, y);
  ctx.fillStyle = "rgba(58, 36, 16, 0.35)";
  ctx.fillRect(x, y + 8, w, 2);
  ctx.fillStyle = POSTER_INK;
}

function drawPosterRule(ctx, x, y) {
  ctx.save();
  ctx.strokeStyle = "rgba(58, 36, 16, 0.55)";
  ctx.lineWidth = 3;
  ctx.setLineDash([2, 9]);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(POSTER_W - x, y);
  ctx.stroke();
  ctx.restore();
}

// Header ---------------------------------------------------------------------------------------------------------------------------------------------------------------------

function drawPosterHeader(ctx, snap) {
  var size = posterFit(ctx, "WANTED", POSTER_CONTENT_W, 200, 120, "400", EXPORT_TITLE_FONT);
  var base = POSTER_Y.header + size * 0.72;
  ctx.textAlign = "center";
  ctx.font = "400 " + size + "px " + EXPORT_TITLE_FONT;
  ctx.fillStyle = "rgba(255, 245, 215, 0.35)";
  ctx.fillText("WANTED", POSTER_W / 2 + 3, base + 3);
  ctx.fillStyle = POSTER_INK;
  ctx.fillText("WANTED", POSTER_W / 2, base);

  ctx.fillStyle = POSTER_RED;
  ctx.font = "700 24px " + EXPORT_SERIF_FONT;
  drawSpaced(ctx, snap.label.toUpperCase(), POSTER_W / 2, base + 44, 8);
  drawPosterRule(ctx, POSTER_MARGIN_X, base + 66);
  ctx.textAlign = "left";
}

// Info: emblem on the left (square, never stretched), attribute rows and Haki on the right -----------------------------------------------------------------------------

function drawPosterInfo(ctx, character, snap, rand) {
  var top = POSTER_Y.info, emblem = POSTER_PORTRAIT.size, labelW = 150;
  drawPosterEmblem(ctx, POSTER_PORTRAIT.x, POSTER_PORTRAIT.y, emblem, emblem, rand);

  var x = POSTER_MARGIN_X + 301 + 28, w = POSTER_W - POSTER_MARGIN_X - x;
  var rows = [
    ["Race", character.race], ["Affiliation", snap.affiliation], ["Rank", snap.rank],
    ["Fighting style", snap.fighting], ["Doriki", snap.doriki.toLocaleString("en-US")]
  ];
  ctx.textAlign = "left";
  rows.forEach(function (r, i) {
    var y = top + 14 + i * 44 + 26;
    ctx.font = "700 14px " + EXPORT_SERIF_FONT;
    ctx.fillStyle = POSTER_FADE;
    ctx.fillText(r[0].toUpperCase(), x, y);
    ctx.fillStyle = POSTER_INK;
    ctx.fillText(fitText(ctx, r[1] || "-", w - labelW, 24, 16, "700", EXPORT_SERIF_FONT), x + labelW, y);
    ctx.fillStyle = "rgba(58, 36, 16, 0.15)";
    ctx.fillRect(x, y + 12, w, 1);
  });

  // Haki: type | stars | classification, one aligned row per haki the character has in this period
  var hy = top + 14 + rows.length * 44 + 12, types = hakiTypes(snap.haki);
  ctx.font = "700 14px " + EXPORT_SERIF_FONT;
  ctx.fillStyle = POSTER_FADE;
  ctx.fillText("HAKI", x, hy);
  if (!types.length) {
    ctx.font = "700 24px " + EXPORT_SERIF_FONT;
    ctx.fillStyle = POSTER_INK;
    ctx.fillText("None", x + labelW, hy);
    return;
  }
  types.forEach(function (t, i) {
    var by = hy + 34 + i * 32;
    ctx.font = "700 19px " + EXPORT_SERIF_FONT;
    ctx.fillStyle = POSTER_INK;
    ctx.fillText(HAKI_LABELS[t], x, by);
    for (var s = 1; s < HAKI_LEVEL_NAMES.length; s++) {
      starPath(ctx, x + labelW + 10 + (s - 1) * 24, by - 6, 9);
      ctx.fillStyle = s <= snap.haki[t] ? POSTER_HAKI[t] : "rgba(58, 36, 16, 0.18)";
      ctx.fill();
    }
    ctx.font = "700 17px " + EXPORT_SERIF_FONT;
    ctx.fillStyle = POSTER_HAKI[t];
    ctx.textAlign = "right";
    ctx.fillText(HAKI_LEVEL_NAMES[snap.haki[t]], x + w, by);
    ctx.textAlign = "left";
  });
}

// Identity & bounty: status, name, epithet, bounty ---------------------------------------------------------------------------------------------------------------------

function drawPosterIdentity(ctx, character, snap) {
  var top = POSTER_Y.identity, bountyBase = POSTER_Y.abilities - 30, nameTop = top + 28;
  ctx.textAlign = "center";
  ctx.fillStyle = POSTER_FADE;
  ctx.font = "700 20px " + EXPORT_SERIF_FONT;
  drawSpaced(ctx, "DEAD OR ALIVE", POSTER_W / 2, top + 20, 10);

  // The name gets whatever height the bounty and epithet leave free
  var budget = (bountyBase - 96) - nameTop - (character.nickname ? 40 : 0);
  var name = posterName(ctx, character.name.toUpperCase(), POSTER_CONTENT_W, budget);
  var lh = name.size * 0.92;
  ctx.fillStyle = POSTER_INK;
  ctx.font = "400 " + name.size + "px " + EXPORT_TITLE_FONT;
  name.lines.forEach(function (l, i) { ctx.fillText(l, POSTER_W / 2, nameTop + name.size * 0.85 + i * lh); });

  if (character.nickname) {
    var y = nameTop + name.lines.length * lh + 26;
    ctx.fillStyle = POSTER_FADE;
    ctx.fillText(fitText(ctx, character.nickname, POSTER_CONTENT_W, 30, 18, "italic 400", EXPORT_SERIF_FONT), POSTER_W / 2, y);
  }
  drawPosterBounty(ctx, snap, bountyBase);
  ctx.textAlign = "left";
}

// Bounty in red with BERRIES beside it, or a fallback when the period has no bounty
function drawPosterBounty(ctx, snap, base) {
  var cx = POSTER_W / 2;
  if (!snap.hasBounty) {
    ctx.fillStyle = POSTER_FADE;
    posterFit(ctx, "NO BOUNTY", POSTER_CONTENT_W, 96, 56, "400", EXPORT_TITLE_FONT);
    ctx.fillText("NO BOUNTY", cx, base);
    ctx.font = "italic 400 24px " + EXPORT_SERIF_FONT;
    ctx.fillText("Not wanted in this period", cx, base + 34);
    return;
  }
  ctx.font = "700 26px " + EXPORT_SERIF_FONT;
  var berries = "BERRIES", gap = 20, bw = ctx.measureText(berries).width;
  posterFit(ctx, snap.bountyText, POSTER_CONTENT_W - bw - gap, 120, 48, "400", EXPORT_TITLE_FONT);
  var nw = ctx.measureText(snap.bountyText).width, x0 = cx - (nw + gap + bw) / 2;
  ctx.textAlign = "left";
  ctx.fillStyle = POSTER_RED;
  ctx.fillText(snap.bountyText, x0, base);
  ctx.font = "700 26px " + EXPORT_SERIF_FONT;
  ctx.fillStyle = POSTER_INK;
  ctx.fillText(berries, x0 + nw + gap, base);
}

// Abilities: Devil Fruit on the left, feats on the right ---------------------------------------------------------------------------------------------------------------

function drawPosterAbilities(ctx, snap) {
  var top = POSTER_Y.abilities, leftX = POSTER_MARGIN_X, leftW = 370, rightX = 520, rightW = 450;
  posterHeading(ctx, "Devil Fruit", leftX, top + 22, leftW);
  posterHeading(ctx, "Feats & Achievements", rightX, top + 22, rightW);
  ctx.textAlign = "left";

  var f = snap.fruit;
  if (!f) {
    ctx.font = "italic 400 22px " + EXPORT_SERIF_FONT;
    ctx.fillStyle = POSTER_INK;
    ctx.fillText("No Devil Fruit eaten", leftX, top + 64);
  } else {
    var fruit = posterWrap(ctx, f.fruit, leftW, 2, 30, 20, "700", EXPORT_SERIF_FONT);
    ctx.font = "700 " + fruit.size + "px " + EXPORT_SERIF_FONT;
    ctx.fillStyle = POSTER_INK;
    fruit.lines.forEach(function (l, i) { ctx.fillText(l, leftX, top + 64 + i * fruit.size * 1.1); });
    var typeY = top + 64 + (fruit.lines.length - 1) * fruit.size * 1.1 + 28;
    ctx.font = "700 15px " + EXPORT_SERIF_FONT;
    ctx.fillStyle = POSTER_RED;
    ctx.fillText(f.type.toUpperCase(), leftX, typeY);
    var power = posterWrap(ctx, f.powerText, leftW, 3, 19, 15, "italic 400", EXPORT_SERIF_FONT);
    ctx.font = "italic 400 " + power.size + "px " + EXPORT_SERIF_FONT;
    ctx.fillStyle = POSTER_INK;
    power.lines.forEach(function (l, i) { ctx.fillText(l, leftX, typeY + 26 + i * power.size * 1.25); });
  }

  // Feats in the order the character got them; the same font size is used for all of them
  var shown = snap.feats.slice(0, 3), featW = rightW - 24, budget = 136, size = 22, wrapped = [];
  for (; size >= 15; size -= 1) {
    ctx.font = "700 " + size + "px " + EXPORT_SERIF_FONT;
    wrapped = shown.map(function (t) { return wrapLines(ctx, t, featW); });
    var total = wrapped.reduce(function (s, l) { return s + l.length * size * 1.25; }, 0) + (wrapped.length - 1) * 10;
    if (total <= budget && wrapped.every(function (l) { return l.length <= 2; })) break;
  }
  if (size < 15) {
    size = 15;
    ctx.font = "700 15px " + EXPORT_SERIF_FONT;
    wrapped = shown.map(function (t) { return clampLines(ctx, t, featW, 2); });
  }
  ctx.font = "700 " + size + "px " + EXPORT_SERIF_FONT;
  ctx.fillStyle = POSTER_INK;
  if (!shown.length) {
    ctx.font = "italic 400 22px " + EXPORT_SERIF_FONT;
    ctx.fillText("None yet", rightX, top + 64);
  }
  var fy = top + 64;
  wrapped.forEach(function (lines) {
    ctx.font = "700 " + size + "px " + EXPORT_SERIF_FONT;
    starPath(ctx, rightX + 7, fy - 6, 6);
    ctx.fillStyle = POSTER_RED;
    ctx.fill();
    ctx.fillStyle = POSTER_INK;
    lines.forEach(function (l, k) { ctx.fillText(l, rightX + 24, fy + k * size * 1.25); });
    fy += lines.length * size * 1.25 + 10;
  });
  if (snap.feats.length > 3) {
    ctx.textAlign = "right";
    ctx.font = "italic 400 16px " + EXPORT_SERIF_FONT;
    ctx.fillStyle = POSTER_FADE;
    ctx.fillText("+" + (snap.feats.length - 3) + " more", rightX + rightW, top + 22);
    ctx.textAlign = "left";
  }
}

function drawPosterFooter(ctx) {
  drawPosterRule(ctx, POSTER_MARGIN_X, POSTER_Y.footer - 22);
  ctx.textAlign = "center";
  ctx.fillStyle = POSTER_FADE;
  ctx.font = "700 20px " + EXPORT_SERIF_FONT;
  ctx.fillText(EXPORT_URL, POSTER_W / 2, POSTER_Y.footer);
  ctx.textAlign = "left";
}

// Parchment ----------------------------------------------------------------------------------------------------------------------------------------------------------------

function drawParchment(ctx, rand) {
  // Dark table behind the poster
  var table = ctx.createLinearGradient(0, 0, 0, POSTER_H);
  table.addColorStop(0, "#241408");
  table.addColorStop(1, "#120a04");
  ctx.fillStyle = table;
  ctx.fillRect(0, 0, POSTER_W, POSTER_H);

  // Torn outline
  var x0 = 34, y0 = 26, x1 = POSTER_W - 34, y1 = POSTER_H - 26, pts = [], step = 16, i;
  function jag() { return (rand() - 0.5) * 12; }
  for (i = x0; i < x1; i += step) pts.push([i, y0 + jag()]);
  for (i = y0; i < y1; i += step) pts.push([x1 + jag(), i]);
  for (i = x1; i > x0; i -= step) pts.push([i, y1 + jag()]);
  for (i = y1; i > y0; i -= step) pts.push([x0 + jag(), i]);
  function outline() {
    ctx.beginPath();
    pts.forEach(function (p, k) { ctx[k ? "lineTo" : "moveTo"](p[0], p[1]); });
    ctx.closePath();
  }

  ctx.save();
  outline();
  ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = "#dcc088";
  ctx.fill();
  ctx.restore();

  ctx.save();
  outline();
  ctx.clip();
  var base = ctx.createLinearGradient(0, 0, POSTER_W, POSTER_H);
  base.addColorStop(0, "#efdcae");
  base.addColorStop(0.5, "#e2c892");
  base.addColorStop(1, "#d3b479");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, POSTER_W, POSTER_H);

  // Stains and uneven ageing
  for (i = 0; i < 70; i++) {
    var sx = rand() * POSTER_W, sy = rand() * POSTER_H, sr = 40 + rand() * 170;
    var g = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
    var dark = rand() > 0.35;
    g.addColorStop(0, dark ? "rgba(120, 76, 28, " + (0.04 + rand() * 0.07) + ")" : "rgba(255, 244, 214, " + (0.05 + rand() * 0.08) + ")");
    g.addColorStop(1, "rgba(120, 76, 28, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(sx - sr, sy - sr, sr * 2, sr * 2);
  }
  // Paper fibres
  for (i = 0; i < 3500; i++) {
    ctx.fillStyle = "rgba(90, 55, 20, " + (rand() * 0.09) + ")";
    ctx.fillRect(rand() * POSTER_W, rand() * POSTER_H, 1 + rand() * 3, 1 + rand() * 1.5);
  }
  // Folds
  [[POSTER_W / 2, true], [POSTER_H / 2, false]].forEach(function (f) {
    var dark = ctx.createLinearGradient(0, 0, f[1] ? 14 : 0, f[1] ? 0 : 14);
    ctx.save();
    ctx.translate(f[1] ? f[0] - 7 : 0, f[1] ? 0 : f[0] - 7);
    dark.addColorStop(0, "rgba(90, 55, 20, 0)");
    dark.addColorStop(0.5, "rgba(90, 55, 20, 0.16)");
    dark.addColorStop(1, "rgba(255, 245, 220, 0.12)");
    ctx.fillStyle = dark;
    ctx.fillRect(0, 0, f[1] ? 14 : POSTER_W, f[1] ? POSTER_H : 14);
    ctx.restore();
  });
  // Burnt edges
  var vig = ctx.createRadialGradient(POSTER_W / 2, POSTER_H / 2, POSTER_H * 0.35, POSTER_W / 2, POSTER_H / 2, POSTER_H * 0.78);
  vig.addColorStop(0, "rgba(90, 45, 10, 0)");
  vig.addColorStop(1, "rgba(80, 38, 8, 0.6)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, POSTER_W, POSTER_H);
  ctx.restore();

  ctx.save();
  outline();
  ctx.strokeStyle = "rgba(60, 30, 8, 0.65)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  // Inner printed border
  ctx.strokeStyle = "rgba(58, 36, 16, 0.85)";
  ctx.lineWidth = 7;
  ctx.strokeRect(62, 54, POSTER_W - 124, POSTER_H - 108);
  ctx.lineWidth = 2;
  ctx.strokeRect(74, 66, POSTER_W - 148, POSTER_H - 132);
}

// Pirate emblem on a sepia plate (the generator has no character art). Always square
function drawPosterEmblem(ctx, x, y, w, h, rand) {
  if (posterPortrait) {
    drawPosterPortrait(ctx, x, y, w);
    drawPosterFrame(ctx, x, y, w, h);
    return;
  }
  ctx.save();
  var plate = ctx.createRadialGradient(x + w / 2, y + h / 2, 20, x + w / 2, y + h / 2, w * 0.75);
  plate.addColorStop(0, "#d8bb84");
  plate.addColorStop(1, "#a98650");
  ctx.fillStyle = plate;
  ctx.fillRect(x, y, w, h);
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  for (var i = 0; i < 900; i++) {
    ctx.fillStyle = "rgba(58, 36, 16, " + (rand() * 0.08) + ")";
    ctx.fillRect(x + rand() * w, y + rand() * h, 1 + rand() * 3, 1 + rand() * 2);
  }
  var cx = x + w / 2, cy = y + h / 2 + 6;
  ctx.strokeStyle = POSTER_INK;
  ctx.fillStyle = POSTER_INK;
  ctx.lineCap = "round";

  // Crossed bones
  ctx.lineWidth = 22;
  [[-1, 1], [1, 1]].forEach(function (d) {
    var ax = cx - d[0] * 110, ay = cy - 64, bx = cx + d[0] * 110, by = cy + 110;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
    var len = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / len, uy = (by - ay) / len;
    [[ax, ay, -1], [bx, by, 1]].forEach(function (p) {
      [-1, 1].forEach(function (s) {
        ctx.beginPath();
        ctx.arc(p[0] - uy * s * 12 + ux * p[2] * 6, p[1] + ux * s * 12 + uy * p[2] * 6, 14, 0, Math.PI * 2);
        ctx.fill();
      });
    });
  });

  // Skull
  ctx.fillStyle = "#f1e3bd";
  ctx.strokeStyle = POSTER_INK;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 26, 84, 78, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  roundRectPath(ctx, cx - 50, cy + 28, 100, 58, 16);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx, cy - 26, 80, 72, 0, 0, Math.PI * 2);
  ctx.fill();   // hides the line between skull and jaw
  ctx.fillStyle = POSTER_INK;
  [-1, 1].forEach(function (s) {
    ctx.beginPath();
    ctx.ellipse(cx + s * 35, cy - 20, 22, 26, s * 0.15, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.beginPath();
  ctx.moveTo(cx, cy + 4);
  ctx.lineTo(cx - 11, cy + 30);
  ctx.lineTo(cx + 11, cy + 30);
  ctx.closePath();
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.lineCap = "butt";
  for (var t = -2; t <= 2; t++) {
    ctx.beginPath();
    ctx.moveTo(cx + t * 18, cy + 50);
    ctx.lineTo(cx + t * 18, cy + 80);
    ctx.stroke();
  }
  ctx.restore();

  drawPosterFrame(ctx, x, y, w, h);
}

// Double frame around the portrait area, drawn over the skull or the picture
function drawPosterFrame(ctx, x, y, w, h) {
  ctx.save();
  ctx.strokeStyle = POSTER_INK;
  ctx.lineWidth = 8;
  ctx.strokeRect(x, y, w, h);
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 12, y + 12, w - 24, h - 24);
  ctx.restore();
}
