// PDF export: same look as the site (dark cards, Bangers titles, timeline of periods)

function cellText(id) {
  var el = document.getElementById(id);
  var text = el ? el.textContent.trim() : '';
  return text || '-';
}

// Feats are a list on the page: one "- feat" per line in the PDF
function featText(id) {
  var items = document.querySelectorAll('#' + id + ' li');
  if (!items.length) return cellText(id);
  return Array.prototype.map.call(items, function (li) { return '- ' + li.textContent.trim(); }).join('\n');
}

function exportPDF() {
  Promise.all([
    loadImageData('images/Logo.png', 'image/png'),
    loadImageData('images/wallpaper.jpg', 'image/jpeg', 900),
    loadFont('fonts/Bangers-Regular.ttf')
  ]).then(function (assets) { buildPDF({ logo: assets[0], wallpaper: assets[1], bangers: assets[2] }); });
}

// Loads an image as a data URL so it can be embedded in the PDF (maxWidth shrinks big images)
function loadImageData(src, type, maxWidth) {
  return new Promise(function (resolve) {
    var img = new Image();
    img.onload = function () {
      var scale = maxWidth && img.naturalWidth > maxWidth ? maxWidth / img.naturalWidth : 1;
      var canvas = document.createElement('canvas');
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      try { resolve({ data: canvas.toDataURL(type, 0.8), w: canvas.width, h: canvas.height }); } catch (e) { resolve(null); }
    };
    img.onerror = function () { resolve(null); };
    img.src = src;
  });
}

function loadFont(src) {
  return fetch(src).then(function (res) {
    if (!res.ok) throw new Error('Could not load ' + src);
    return res.arrayBuffer();
  }).then(function (buf) {
    var bytes = new Uint8Array(buf), bin = '';
    for (var i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }).catch(function () { return null; });
}

function buildPDF(assets) {
  var jsPDF = window.jspdf.jsPDF;
  var doc = new jsPDF({ unit: 'mm', format: 'a4' });
  var pageW = doc.internal.pageSize.getWidth();
  var pageH = doc.internal.pageSize.getHeight();
  var M = 11;

  var C = {
    ink: [12, 15, 24], panel: [22, 27, 39], head: [10, 13, 21], line: [44, 50, 64],
    text: [238, 241, 246], muted: [154, 163, 178], gold: [245, 184, 46], red: [230, 58, 20], green: [0, 150, 0],
    haki: { Conquerors: [200, 107, 255], Armament: [230, 58, 20], Observation: [63, 182, 255] }, off: [62, 66, 78]
  };

  var titleFont = 'helvetica';
  if (assets.bangers) {
    doc.addFileToVFS('Bangers-Regular.ttf', assets.bangers);
    doc.addFont('Bangers-Regular.ttf', 'Bangers', 'normal');
    titleFont = 'Bangers';
  }

  function fill(c) { doc.setFillColor(c[0], c[1], c[2]); }
  function stroke(c) { doc.setDrawColor(c[0], c[1], c[2]); }
  function color(c) { doc.setTextColor(c[0], c[1], c[2]); }
  function font(style, size) { doc.setFont('helvetica', style); doc.setFontSize(size); }
  function clean(t) { return String(t).replace(/[—–]/g, '-').replace(/★/g, '*'); }
  function lines(t, w) { return doc.splitTextToSize(clean(t), w); }

  // Background: wallpaper with the same dark gradient as the site
  function background() {
    fill(C.ink);
    doc.rect(0, 0, pageW, pageH, 'F');
    if (assets.wallpaper && doc.GState) {
      var h = pageW * assets.wallpaper.h / assets.wallpaper.w;
      doc.addImage(assets.wallpaper.data, 'JPEG', 0, 0, pageW, h);
      doc.setGState(new doc.GState({ opacity: 0.55 }));
      doc.rect(0, 0, pageW, pageH, 'F');
      doc.setGState(new doc.GState({ opacity: 0.35 }));
      doc.rect(0, pageH * 0.35, pageW, pageH * 0.65, 'F');
      doc.setGState(new doc.GState({ opacity: 1 }));
    }
  }

  var y = M;
  function ensure(h) {
    if (y + h <= pageH - 10) return;
    doc.addPage();
    background();
    y = M;
  }

  // Card frame with header (badge + title), returns the y where the body starts
  var HEAD = 11;
  function cardFrame(x, top, w, h, badge, title, timeskip) {
    fill(C.panel);
    doc.roundedRect(x, top, w, h, 4, 4, 'F');
    fill(C.head);
    doc.roundedRect(x, top, w, HEAD + 4, 4, 4, 'F');
    fill(C.panel);
    doc.rect(x, top + HEAD, w, 4, 'F');
    fill(C.red);
    doc.rect(x, top + HEAD - 0.3, w, 0.6, 'F');
    stroke(C.line);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, top, w, h, 4, 4, 'S');

    font('bold', 6);
    var bw = doc.getTextWidth(badge.toUpperCase()) + 5;
    stroke(timeskip ? C.gold : [90, 96, 110]);
    doc.setLineWidth(0.25);
    if (timeskip) { fill([52, 44, 22]); doc.roundedRect(x + 5, top + 3.3, bw, 4.4, 2.2, 2.2, 'FD'); }
    else doc.roundedRect(x + 5, top + 3.3, bw, 4.4, 2.2, 2.2, 'S');
    color(timeskip ? C.gold : C.muted);
    doc.text(badge.toUpperCase(), x + 5 + bw / 2, top + 6.4, { align: 'center' });

    color(C.gold);
    doc.setFont(titleFont, titleFont === 'Bangers' ? 'normal' : 'bold');
    doc.setFontSize(15);
    doc.text(title, x + 5 + bw + 3, top + 7.6);
    return top + HEAD;
  }

  // Field: small uppercase label above its value
  function fieldHeight(value, w) { font('normal', 9.5); return 3.2 + lines(value, w).length * 3.9; }
  function drawField(label, value, x, top, w, valueColor) {
    font('bold', 6.2);
    color(C.muted);
    doc.text(label.toUpperCase(), x, top + 2.2);
    font('normal', 9.5);
    color(valueColor || C.text);
    doc.text(lines(value, w), x, top + 6.2);
    return fieldHeight(value, w);
  }

  function star(cx, cy, r, c) {
    var pts = [];
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
      pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
    }
    var d = pts.slice(1).map(function (p, i) { return [p[0] - pts[i][0], p[1] - pts[i][1]]; });
    fill(c);
    doc.lines(d, pts[0][0], pts[0][1], [1, 1], 'F', true);
  }

  function hakiHeight(levels) { var n = hakiTypes(levels).length; return 3.2 + (n ? n * 4.2 + 0.6 : 3.9); }
  function drawHaki(levels, x, top, w) {
    font('bold', 6.2);
    color(C.muted);
    doc.text('HAKI', x, top + 2.2);
    var types = hakiTypes(levels);
    if (!types.length) {
      font('normal', 9.5); color(C.text);
      doc.text(levels ? 'None' : '-', x, top + 6.4);
      return hakiHeight(levels);
    }
    types.forEach(function (t, i) {
      var ry = top + 6.4 + i * 4.2;
      font('bold', 7.8); color(C.text);
      doc.text(HAKI_LABELS[t], x, ry);
      for (var s = 1; s < HAKI_LEVEL_NAMES.length; s++) star(x + 22 + (s - 1) * 3.6, ry - 1.1, 1.45, s <= levels[t] ? C.haki[t] : C.off);
      color(C.haki[t]);
      doc.text(HAKI_LEVEL_NAMES[levels[t]], x + w, ry, { align: 'right' });
    });
    return hakiHeight(levels);
  }

  var name = document.getElementById('fname').value.trim() || '-';
  var nickname = document.getElementById('nickname').value.trim() || '-';
  var gender = document.getElementById('gender');
  var identity = [
    ['Name', name], ['Nickname', nickname], ['Race', cellText('race')],
    ['Region (birthplace)', cellText('region')], ['Gender', gender.options[gender.selectedIndex].text]
  ];

  background();

  // Header: logo + tagline
  if (assets.logo) {
    var lw = 74, lh = lw * assets.logo.h / assets.logo.w;
    doc.addImage(assets.logo.data, 'PNG', (pageW - lw) / 2, y, lw, lh);
    y += lh + 2;
  }
  font('normal', 9);
  color(C.muted);
  doc.text('Roll a new adventurer and follow their journey across the Grand Line.', pageW / 2, y + 2, { align: 'center' });
  y += 6;

  // Character card
  (function () {
    var x = M, w = pageW - 2 * M, pad = 5, gap = 4;
    var ratios = [1.6, 1.6, 1, 1.2, 0.8], total = ratios.reduce(function (a, b) { return a + b; }, 0);
    var inner = w - 2 * pad - gap * (ratios.length - 1);
    var widths = ratios.map(function (r) { return inner * r / total; });
    var bodyH = Math.max.apply(null, identity.map(function (f, i) { return fieldHeight(f[1], widths[i]); })) + 2 * pad - 1;
    ensure(HEAD + bodyH);
    var top = cardFrame(x, y, w, HEAD + bodyH, 'Info', 'Character', false);
    var cx = x + pad;
    identity.forEach(function (f, i) { drawField(f[0], f[1], cx, top + pad - 0.5, widths[i]); cx += widths[i] + gap; });
    y += HEAD + bodyH + 5;
  })();

  // Period cards on a timeline
  var periods = [
    { s: '', n: 1, badge: 'Start', title: '1st Year', h: haki },
    { s: '2', n: 2, badge: 'Timeskip', title: 'After 2 Years', h: haki2 },
    { s: '3', n: 3, badge: 'Timeskip', title: 'After 10 Years', h: haki3 }
  ];
  var TL = 8, x0 = M + TL, w0 = pageW - 2 * M - TL, pad = 5, IDH = 7;
  var colRatios = [0.85, 1.3, 1], colTotal = 3.15;
  var colW = colRatios.map(function (r) { return (w0 - 2 * pad * 3) * r / colTotal; });

  var prevDot = null;
  periods.forEach(function (p) {
    var s = p.s;
    var groups = [
      { title: 'Affiliation', fields: [['Alliance', cellText('alliance' + s)], ['Rank (within the alliance)', cellText('rank' + s)]] },
      { title: 'Powers', fields: [['Fighting Style', cellText('fighting' + s)], ['haki'], ['Devil-fruit (Type)', cellText('devilfruit' + s)], ['Devil-fruit (specified)', cellText('df' + s)]] },
      { title: 'Record', fields: [['Feats', featText('feat' + s)], ['stats']] }
    ];
    var half = (colW[2] - 4) / 2;
    var stats = [
      ['Doriki', cellText('dorikifinal' + s), cellText('adddoriki' + s)],
      ['Bounty', cellText('bountyfinal' + s), cellText('addbounty' + s)]
    ];
    function statsHeight() {
      return Math.max.apply(null, stats.map(function (st) { return fieldHeight(st[1], half) + (st[2] !== '-' ? 3.6 : 0); }));
    }
    function heightOf(g, i) {
      return 6 + g.fields.reduce(function (sum, f) {
        if (f[0] === 'haki') return sum + hakiHeight(p.h) + 1.8;
        if (f[0] === 'stats') return sum + statsHeight() + 1.8;
        return sum + fieldHeight(f[1], colW[i]) + 1.8;
      }, 0);
    }
    var bodyH = Math.max.apply(null, groups.map(heightOf)) + 2 * pad - 4;
    var cardH = HEAD + IDH + bodyH;
    ensure(cardH);

    var top = cardFrame(x0, y, w0, cardH, p.badge, p.title, p.n > 1);

    // Timeline: line from the previous dot (same page only) and this card's dot
    var page = doc.internal.getNumberOfPages();
    if (prevDot && prevDot.page === page) {
      fill(p.n > 2 ? C.gold : C.red);
      doc.rect(M + 2.7, prevDot.y + 2.3, 0.6, y + 5.5 - prevDot.y - 4.6, 'F');
    }
    fill(C.ink); stroke(p.n > 1 ? C.gold : C.red); doc.setLineWidth(0.9);
    doc.circle(M + 3, y + 5.5, 1.8, 'FD');
    prevDot = { page: page, y: y + 5.5 };

    // Character info strip
    fill([28, 33, 46]);
    doc.rect(x0 + 0.1, top + 0.3, w0 - 0.2, IDH - 0.3, 'F');
    fill(C.line);
    doc.rect(x0, top + IDH, w0, 0.2, 'F');
    var ix = x0 + pad;
    identity.forEach(function (f) {
      var label = (f[0] === 'Region (birthplace)' ? 'Region' : f[0]).toUpperCase();
      font('bold', 5.6); color(C.muted);
      doc.text(label, ix, top + 4.6);
      ix += doc.getTextWidth(label) + 1.5;
      font('normal', 7.6); color(C.text);
      var v = clean(f[1]);
      doc.text(v, ix, top + 4.6);
      ix += doc.getTextWidth(v) + 5;
    });

    // Groups side by side
    var gx = x0, gy = top + IDH + pad - 1;
    groups.forEach(function (g, i) {
      var cx = gx + pad, cy = gy;
      if (i) { fill(C.line); doc.rect(gx, top + IDH, 0.2, bodyH, 'F'); }
      font('bold', 6.6); color(C.gold);
      doc.text(g.title.toUpperCase(), cx, cy + 2.4);
      cy += 6;
      g.fields.forEach(function (f) {
        if (f[0] === 'haki') { cy += drawHaki(p.h, cx, cy, colW[i]) + 1.8; return; }
        if (f[0] === 'stats') {
          stats.forEach(function (st, k) {
            var sx = cx + k * (half + 4);
            var h = drawField(st[0], st[1], sx, cy, half);
            if (st[2] !== '-') { font('normal', 7.6); color(C.green); doc.text(clean(st[2]), sx, cy + h + 1.6); }
          });
          cy += statsHeight() + 1.8;
          return;
        }
        cy += drawField(f[0], f[1], cx, cy, colW[i]) + 1.8;
      });
      gx += colW[i] + 2 * pad;
    });

    y += cardH + 5;
  });

  // Devil fruit descriptions, like the "Know more" pop-up
  var fruits = [1, 2, 3].map(fruitData).filter(Boolean).filter(function (f, i, all) {
    return all.findIndex(function (o) { return o.fruit === f.fruit; }) === i;
  });
  fruits.forEach(function (f, i) {
    var x = M, w = pageW - 2 * M, inner = w - 10;
    font('normal', 9);
    var typeLines = lines(f.typeText, inner), powerLines = lines(f.powerText, inner);
    font('bold', 11);
    var titleLines = doc.splitTextToSize(clean(f.fruit), inner);
    var bodyH = 10 + titleLines.length * 5 + 6 + typeLines.length * 4 + 6 + powerLines.length * 4 + 3;
    ensure(HEAD + bodyH);
    var top = cardFrame(x, y, w, HEAD + bodyH, 'Devil Fruit', i ? 'Devil Fruit ' + (i + 1) : 'Devil Fruit', false);
    var cy = top + 5;
    font('bold', 6.5);
    var tw = doc.getTextWidth(f.type) + 5;
    fill(C.red);
    doc.roundedRect(x + 5, cy, tw, 4.4, 2.2, 2.2, 'F');
    color([255, 255, 255]);
    doc.text(f.type, x + 5 + tw / 2, cy + 3.1, { align: 'center' });
    cy += 9.5;
    font('bold', 11); color(C.text);
    doc.text(titleLines, x + 5, cy);
    cy += titleLines.length * 5 + 1.5;
    font('bold', 6.5); color(C.gold);
    doc.text('TYPE', x + 5, cy);
    font('normal', 9); color([207, 213, 223]);
    doc.text(typeLines, x + 5, cy + 4.3);
    cy += 4.3 + typeLines.length * 4 + 1.5;
    font('bold', 6.5); color(C.gold);
    doc.text('POWERS', x + 5, cy);
    font('normal', 9); color([207, 213, 223]);
    doc.text(powerLines, x + 5, cy + 4.3);
    y += HEAD + bodyH + 6;
  });

  // Footer on every page
  var pages = doc.internal.getNumberOfPages();
  for (var pg = 1; pg <= pages; pg++) {
    doc.setPage(pg);
    font('normal', 7.5); color(C.muted);
    doc.text('One Piece Character Generator  -  onepiecegenerator.netlify.app', M, pageH - 4.5);
    doc.text('Page ' + pg + ' of ' + pages, pageW - M, pageH - 4.5, { align: 'right' });
  }

  var fileName = (name !== '-' ? name.replace(/[^a-z0-9]+/gi, '_') : 'character') + '.pdf';
  doc.save(fileName);
}
