function cellText(id) {
  var el = document.getElementById(id);
  var text = el ? el.textContent.trim() : '';
  return text || '-';
}

function exportPDF() {
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

  doc.setFontSize(18);
  doc.text('One Piece Character' + (name !== '-' ? ' - ' + name : ''), 14, 16);

  doc.autoTable({
    startY: 22,
    head: [['Info', '1st Year', 'After 2 Years', 'After 10 years']],
    body: body,
    theme: 'grid',
    headStyles: { fillColor: [240, 51, 10], halign: 'center' },
    bodyStyles: { halign: 'center', valign: 'middle' },
    columnStyles: { 0: { fontStyle: 'bold', halign: 'left', cellWidth: 50 } }
  });

  var fileName = (name !== '-' ? name.replace(/[^a-z0-9]+/gi, '_') : 'character') + '.pdf';
  doc.save(fileName);
}
