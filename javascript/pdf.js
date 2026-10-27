function cellText(id) {
  var el = document.getElementById(id);
  var text = el ? el.textContent.trim() : '';
  return text || '-';
}

function exportPDF() {
  loadLogo(function (logo) { buildPDF(logo); });
}

// Loads the site logo as a data URL so it can be embedded in the PDF
function loadLogo(done) {
  var img = new Image();
  img.onload = function () {
    var canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext('2d').drawImage(img, 0, 0);
    try { done(canvas.toDataURL('image/png')); } catch (e) { done(null); }
  };
  img.onerror = function () { done(null); };
  img.src = 'images/Logo.png';
}

function buildPDF(logo) {
  var jsPDF = window.jspdf.jsPDF;
  var doc = new jsPDF({ orientation: 'landscape' });

  var name = document.getElementById('fname').value.trim() || '-';
  var nickname = document.getElementById('nickname').value.trim() || '-';
  var gender = document.getElementById('gender');
  var genderText = gender.options[gender.selectedIndex].text;

  // Rows with one value per period: [label, id for 1st year, after 2 years, after 10 years]
  var perPeriod = [
    ['Alliance', 'alliance', 'alliance2', 'alliance3'],
    ['Rank (within the alliance)', 'rank', 'rank2', 'rank3'],
    ['Fighting Style', 'fighting', 'fighting2', 'fighting3'],
    ['Advanced Haki', 'haki', 'haki2', 'haki3'],
    ['Devil-fruit (Type)', 'devilfruit', 'devilfruit2', 'devilfruit3'],
    ['Devil-fruit (specified)', 'df', 'df2', 'df3'],
    ['Feat', 'feat', 'feat2', 'feat3']
  ];

  var body = [
    ['Name', { content: name, colSpan: 3 }],
    ['Nickname', { content: nickname, colSpan: 3 }],
    ['Race', { content: cellText('race'), colSpan: 3 }],
    ['Region (birthplace)', { content: cellText('region'), colSpan: 3 }],
    ['Gender', { content: genderText, colSpan: 3 }]
  ];

  perPeriod.forEach(function (row) {
    body.push([row[0], cellText(row[1]), cellText(row[2]), cellText(row[3])]);
  });

  body.push(['Doriki'].concat(['', '2', '3'].map(function (n) {
    var total = cellText('dorikifinal' + n);
    var added = cellText('adddoriki' + n);
    return total === '-' ? '-' : total + ' ' + added;
  })));
  body.push(['Bounty'].concat(['', '2', '3'].map(function (n) {
    var total = cellText('bountyfinal' + n);
    var added = cellText('addbounty' + n);
    return total === '-' ? '-' : total + ' ' + added;
  })));

  var pageW = doc.internal.pageSize.getWidth();
  var pageH = doc.internal.pageSize.getHeight();
  var red = [230, 58, 20], ink = [18, 22, 31], gold = [245, 184, 46];

  function frame() {
    doc.setFillColor(ink[0], ink[1], ink[2]);
    doc.rect(0, 0, pageW, 26, 'F');
    doc.setFillColor(red[0], red[1], red[2]);
    doc.rect(0, 26, pageW, 1.5, 'F');
    if (logo) doc.addImage(logo, 'PNG', 10, 4, 65, 18);
    doc.setTextColor(gold[0], gold[1], gold[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text(name !== '-' ? name : 'Unnamed Adventurer', pageW - 12, 13, { align: 'right' });
    doc.setTextColor(220, 224, 232);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(nickname !== '-' ? nickname : 'Character sheet', pageW - 12, 20, { align: 'right' });
    doc.setFillColor(ink[0], ink[1], ink[2]);
    doc.rect(0, pageH - 9, pageW, 9, 'F');
    doc.setTextColor(154, 163, 178);
    doc.setFontSize(8);
    doc.text('One Piece Character Generator  -  onepiecegenerator.netlify.app', 12, pageH - 3.5);
    doc.text('Page ' + doc.internal.getNumberOfPages(), pageW - 12, pageH - 3.5, { align: 'right' });
  }

  doc.autoTable({
    startY: 33,
    margin: { top: 33, bottom: 14, left: 12, right: 12 },
    head: [['Info', '1st Year', 'After 2 Years', 'After 10 years']],
    body: body,
    theme: 'plain',
    styles: { fontSize: 9.5, cellPadding: 3, textColor: [40, 44, 52], lineColor: [225, 228, 234], lineWidth: { bottom: 0.2 } },
    headStyles: { fillColor: red, textColor: 255, fontStyle: 'bold', halign: 'center', fontSize: 11 },
    bodyStyles: { halign: 'center', valign: 'middle' },
    alternateRowStyles: { fillColor: [248, 244, 240] },
    columnStyles: { 0: { fontStyle: 'bold', halign: 'left', cellWidth: 48, textColor: red, fillColor: [252, 236, 230] } },
    didDrawPage: frame
  });

  // Devil fruit descriptions
  var fruits = [1, 2, 3].map(fruitData).filter(Boolean).filter(function (f, i, all) {
    return all.findIndex(function (o) { return o.fruit === f.fruit; }) === i;
  });
  if (fruits.length) {
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 8,
      margin: { top: 33, bottom: 14, left: 12, right: 12 },
      head: [['Devil Fruit', 'Powers']],
      body: fruits.map(function (f) { return [f.fruit + '\n(' + f.type + ')', f.typeText + '\n\n' + f.powerText]; }),
      theme: 'plain',
      styles: { fontSize: 9, cellPadding: 3, textColor: [40, 44, 52], lineColor: [225, 228, 234], lineWidth: { bottom: 0.2 } },
      headStyles: { fillColor: ink, textColor: gold, fontStyle: 'bold' },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 70, textColor: red } },
      didDrawPage: frame
    });
  }

  var fileName = (name !== '-' ? name.replace(/[^a-z0-9]+/gi, '_') : 'character') + '.pdf';
  doc.save(fileName);
}
