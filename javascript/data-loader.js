// Data files --------------------------------------------------------------------------------------------------------------------------------------------------------
// Todos os valores e probabilidades do gerador vivem em data/*.csv (abrem no Excel). Ver data/README.md.
// Para adicionar, alterar ou remover basta mexer nas linhas dos ficheiros, o código só aplica as regras.

var DATA_FILES = [
  "settings", "names", "genders", "races", "regions", "alliances", "alliance-changes", "ranks", "rank-changes",
  "fighting-styles", "haki-chances", "haki-level-chances", "haki-levels", "devil-fruit-types", "devil-fruits", "feats", "feat-counts"
];

var DATA = {};          // nome do ficheiro -> linhas, ex: DATA.races = [{ race: "Human", weight: "10", ... }]
var RULES = {};         // tabelas com condições (ver matchRule)
var settings = {};      // data/settings.csv: setting -> número

var fruitTypes = {};    // tipo -> { weight, doriki_min, doriki_max, bounty_min, bounty_max, description }
var fruitsByType = {};  // tipo -> [nomes]
var fruitPowers = {};   // nome -> explicação dos poderes (coluna "power", opcional)
var featsByAlliance = {}; // alliance -> [{ name, weight, doriki_min, doriki_max, bounty_min, bounty_max, haki: { Conquerors, Armament, Observation } }]
var hakiLevels = {};      // "Conquerors" -> { 1: { doriki_min, ... , description }, 2: {...} }   (1 = Basic, 2 = Advanced, 3 = Master)

var HAKI_TYPES = ["Conquerors", "Armament", "Observation"];
var HAKI_LEVEL_NAMES = ["None", "Basic", "Advanced", "Master"];

// Aceita "0,02" (Excel PT)
function num(v) { return Number(String(v).replace(",", ".")) || 0; }

// Colunas sim/não: "Yes", "Sim", "1", "x"
function yes(v) { return /^(yes|y|sim|s|true|1|x)$/i.test(String(v || "").trim()); }

function setting(key) { return settings[key] || 0; }

// Nível de haki escrito no CSV: vazio / None / 0, Basic / 1, Advanced / 2, Master / 3
function hakiLevel(v) {
  v = String(v || "").trim().toLowerCase();
  if (v === "master" || v === "3") return 3;
  if (v === "advanced" || v === "2") return 2;
  if (v === "basic" || v === "1") return 1;
  return 0;
}

function hakiOf(row) {
  return { Conquerors: hakiLevel(row.conquerors), Armament: hakiLevel(row.armament), Observation: hakiLevel(row.observation) };
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
  var header = rows.shift().map(function (h) { return h.trim().toLowerCase(); });
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

// Sorteios ------------------------------------------------------------------------------------------------------------------------------------------------------------
// Coluna "weight": a probabilidade de cada linha é o seu peso a dividir pela soma dos pesos das linhas possíveis.
// Aceita decimais (ex.: 0.02). Vazio = 1, 0 = nunca sai.

function weightOf(row, column) {
  var w = row[column || "weight"];
  return w === undefined || w === "" ? 1 : num(w);
}

function weightedPick(rows, column) {
  var pool = (rows || []).filter(function (r) { return weightOf(r, column) > 0; });
  var total = pool.reduce(function (sum, r) { return sum + weightOf(r, column); }, 0);
  var roll = Math.random() * total;
  for (var i = 0; i < pool.length; i++) {
    roll -= weightOf(pool[i], column);
    if (roll < 0) return pool[i];
  }
  return null;
}

// Valor de uma coluna da linha sorteada, ex: pickValue(DATA.races, "race") -> "Human"
function pickValue(rows, column) {
  var row = weightedPick(rows);
  return row ? row[column] : "";
}

// Compara valores do CSV sem ligar a maiúsculas; os hakis combinados ignoram a ordem ("Armament + Observation" = "Observation + Armament")
function sameValue(a, b) {
  function key(v) { return String(v || "").trim().toLowerCase().split(/\s*\+\s*/).sort().join("+"); }
  return key(a) === key(b);
}

// Coluna "period": 1 = 1st Year, 2 = After 2 Years, 3 = After 10 Years. Vazio = todos; "2 & 3" = os dois timeskips
function periodsOf(v) {
  var list = String(v || "").match(/[1-3]/g);
  return list ? list.map(Number) : [1, 2, 3];
}

// Tabelas com condições: as colunas de condição (ex: alliance, race) escolhem o grupo de linhas a sortear.
// Uma condição vazia aceita qualquer valor. Ganha o primeiro grupo do ficheiro que encaixa na personagem.
function buildRules(rows, conditions) {
  var groups = [], byKey = {};
  rows.forEach(function (r) {
    var key = [r.period || ""].concat(conditions.map(function (c) { return (r[c] || "").toLowerCase(); })).join("|");
    if (!byKey[key]) {
      byKey[key] = { periods: periodsOf(r.period), when: {}, rows: [] };
      conditions.forEach(function (c) { if (r[c]) byKey[key].when[c] = r[c]; });
      groups.push(byKey[key]);
    }
    byKey[key].rows.push(r);
  });
  return groups;
}

// ctx = valores da personagem, ex: { period: 2, alliance: "Pirate", race: "Human" }. Devolve as linhas do grupo ([] se nenhum encaixa)
function matchRule(groups, ctx) {
  for (var i = 0; i < groups.length; i++) {
    var g = groups[i];
    if (ctx.period && g.periods.indexOf(ctx.period) === -1) continue;
    var ok = Object.keys(g.when).every(function (c) { return sameValue(g.when[c], ctx[c]); });
    if (ok) return g.rows;
  }
  return [];
}

// Carregamento ----------------------------------------------------------------------------------------------------------------------------------------------------

var dataReady = Promise.all(DATA_FILES.map(function (name) { return loadCSV("data/" + name + ".csv"); })).then(function (files) {
  DATA_FILES.forEach(function (name, i) { DATA[name] = files[i]; });

  DATA.settings.forEach(function (s) { settings[s.setting] = num(s.value); });

  RULES.regions = buildRules(DATA.regions, ["alliance", "race"]);
  RULES.allianceChanges = buildRules(DATA["alliance-changes"], ["previous_alliance"]);
  RULES.rankChanges = buildRules(DATA["rank-changes"], ["alliance", "previous_rank"]);
  RULES.fighting = buildRules(DATA["fighting-styles"], ["alliance", "rank", "race"]);
  RULES.haki = buildRules(DATA["haki-chances"], ["fighting", "rank", "previous_haki"]);

  DATA["devil-fruit-types"].forEach(function (t) {
    fruitTypes[t.type] = {
      weight: num(t.weight),
      doriki_min: num(t.doriki_min), doriki_max: num(t.doriki_max),
      bounty_min: num(t.bounty_min), bounty_max: num(t.bounty_max),
      description: t.description
    };
  });
  DATA["devil-fruits"].forEach(function (f) {
    if (!f.type || !f.name) return;
    (fruitsByType[f.type] = fruitsByType[f.type] || []).push(f.name);
    if (f.power) fruitPowers[f.name] = f.power;
  });
  // Feats: uma linha por feat. alliance "Any" = disponível para todas as alliances de data/alliances.csv
  var allianceNames = DATA.alliances.map(function (a) { return a.alliance; });
  DATA.feats.forEach(function (f) {
    if (!f.alliance || !f.feat) return;
    var feat = {
      name: f.feat,
      weight: weightOf(f),
      doriki_min: num(f.doriki_min), doriki_max: num(f.doriki_max),
      bounty_min: num(f.bounty_min), bounty_max: num(f.bounty_max),
      haki: hakiOf(f)
    };
    var alliances = f.alliance.toLowerCase() === "any" ? allianceNames : [f.alliance];
    alliances.forEach(function (a) { (featsByAlliance[a] = featsByAlliance[a] || []).push(feat); });
  });
  DATA["haki-levels"].forEach(function (h) {
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
