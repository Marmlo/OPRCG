// Data files --------------------------------------------------------------------------------------------------------------------------------------------------------
// As Devil Fruits, Feats e níveis de Haki vivem em data/*.csv (abrem no Excel). Para adicionar basta acrescentar linhas lá.

var fruitTypes = {};    // tipo -> { weight, doriki_min, doriki_max, bounty_min, bounty_max, description }
var fruitsByType = {};  // tipo -> [nomes]
var fruitPowers = {};   // nome -> explicação dos poderes (coluna "power", opcional)
var featsByAlliance = {}; // alliance -> [{ name, weight, doriki_min, doriki_max, bounty_min, bounty_max, haki: { Conquerors, Armament, Observation } }]
var hakiLevels = {};      // "Conquerors" -> { 1: { doriki_min, ... , description }, 2: {...} }   (1 = Basic, 2 = Advanced, 3 = Master)

var HAKI_TYPES = ["Conquerors", "Armament", "Observation"];
var HAKI_LEVEL_NAMES = ["None", "Basic", "Advanced", "Master"];
var FEAT_ALLIANCES = ["Revolucionary Army", "Marine", "Pirate", "Bounty Hunter", "Cipher Pol", "World Nobles"];

// Aceita "0,02" (Excel PT)
function num(v) { return Number(String(v).replace(",", ".")) || 0; }

// Nível de haki escrito no CSV: vazio / None / 0, Basic / 1, Advanced / 2, Master / 3
function hakiLevel(v) {
  v = String(v || "").trim().toLowerCase();
  if (v === "master" || v === "3") return 3;
  if (v === "advanced" || v === "2") return 2;
  if (v === "basic" || v === "1") return 1;
  return 0;
}

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

var dataReady = Promise.all([
  loadCSV("data/devil-fruit-types.csv"), loadCSV("data/devil-fruits.csv"),
  loadCSV("data/feats.csv"), loadCSV("data/haki-levels.csv")
]).then(function (data) {
  data[0].forEach(function (t) {
    fruitTypes[t.type] = {
      weight: num(t.weight),
      doriki_min: num(t.doriki_min), doriki_max: num(t.doriki_max),
      bounty_min: num(t.bounty_min), bounty_max: num(t.bounty_max),
      description: t.description
    };
  });
  data[1].forEach(function (f) {
    if (!f.type || !f.name) return;
    (fruitsByType[f.type] = fruitsByType[f.type] || []).push(f.name);
    if (f.power) fruitPowers[f.name] = f.power;
  });
  // Feats: uma linha por feat. alliance "Any" = disponível para todas as alliances
  data[2].forEach(function (f) {
    if (!f.alliance || !f.feat) return;
    var feat = {
      name: f.feat,
      weight: f.weight === "" ? 1 : num(f.weight),
      doriki_min: num(f.doriki_min), doriki_max: num(f.doriki_max),
      bounty_min: num(f.bounty_min), bounty_max: num(f.bounty_max),
      haki: { Conquerors: hakiLevel(f.conquerors), Armament: hakiLevel(f.armament), Observation: hakiLevel(f.observation) }
    };
    var alliances = f.alliance.toLowerCase() === "any" ? FEAT_ALLIANCES : [f.alliance];
    alliances.forEach(function (a) { (featsByAlliance[a] = featsByAlliance[a] || []).push(feat); });
  });
  data[3].forEach(function (h) {
    var level = hakiLevel(h.level);
    if (!h.haki || !level) return;
    (hakiLevels[h.haki] = hakiLevels[h.haki] || {})[level] = {
      doriki_min: num(h.doriki_min), doriki_max: num(h.doriki_max),
      bounty_min: num(h.bounty_min), bounty_max: num(h.bounty_max),
      description: h.description
    };
  });
}).catch(function (e) {
  console.error(e);
  alert("Could not load the data files. If you opened index.html directly, run it through a local server.");
});
