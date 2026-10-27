// Data files --------------------------------------------------------------------------------------------------------------------------------------------------------
// As Devil Fruits vivem em data/*.csv (abrem no Excel). Para adicionar frutas basta acrescentar linhas lá.

var fruitTypes = {};    // tipo -> { weight, doriki_min, doriki_max, bounty_min, bounty_max, description }
var fruitsByType = {};  // tipo -> [nomes]
var fruitPowers = {};   // nome -> explicação dos poderes (coluna "power", opcional)

// Lê CSV separado por ";" (ou "," se o Excel o gravar assim), com suporte para campos entre aspas
function parseCSV(text) {
  text = text.replace(/^﻿/, "");
  var sep = text.split(/\r?\n/)[0].indexOf(";") >= 0 ? ";" : ",";
  var rows = [], row = [], field = "", quoted = false;
  for (var i = 0; i < text.length; i++) {
    var c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === sep) { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  var header = rows.shift().map(function (h) { return h.trim(); });
  return rows.filter(function (r) { return r.join("").trim(); }).map(function (r) {
    var obj = {};
    header.forEach(function (h, j) { obj[h] = (r[j] || "").trim(); });
    return obj;
  });
}

function loadCSV(url) {
  return fetch(url).then(function (res) {
    if (!res.ok) throw new Error("Could not load " + url);
    return res.text();
  }).then(parseCSV);
}

var dataReady = Promise.all([loadCSV("data/devil-fruit-types.csv"), loadCSV("data/devil-fruits.csv")]).then(function (data) {
  data[0].forEach(function (t) {
    fruitTypes[t.type] = {
      weight: Number(t.weight) || 0,
      doriki_min: Number(t.doriki_min) || 0, doriki_max: Number(t.doriki_max) || 0,
      bounty_min: Number(t.bounty_min) || 0, bounty_max: Number(t.bounty_max) || 0,
      description: t.description
    };
  });
  data[1].forEach(function (f) {
    if (!f.type || !f.name) return;
    (fruitsByType[f.type] = fruitsByType[f.type] || []).push(f.name);
    if (f.power) fruitPowers[f.name] = f.power;
  });
}).catch(function (e) {
  console.error(e);
  alert("Could not load the Devil Fruit data files. If you opened index.html directly, run it through a local server.");
});
