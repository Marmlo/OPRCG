
 // Data files --------------------------------------------------------------------------------------------------------------------------------------------------------
 // Todos os valores e probabilidades do gerador vivem em data/*.csv (abrem no Excel). Ver data/README.md.
 // Para adicionar, alterar ou remover basta mexer nas linhas dos ficheiros, o código só aplica as regras.
 //
 // Os CSV aceitam comentários em linhas começadas por # e linhas em branco.
 // Os comentários não são interpretados como dados.
 // Exemplo:
 // # === PARAMECIA ===
 // Paramecia;Bara Bara no Mi;Body separation;1

var DATA_FILES = [
  "settings", "names", "genders", "races", "hybrids", "clones", "regions", "alliances", "alliance-changes", "ranks", "rank-changes",
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
var MAIN_ALLIANCES = ["Free", "Revolutionaries", "World Government"];   // main_alliance de data/alliances.csv

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

// Lê CSV separado por ";" (ou "," se o Excel o gravar assim), com suporte para campos entre aspas.
//
// ADICIONADO:
// - Ignora linhas começadas por # (mesmo com espaços antes).
// - Ignora linhas vazias.
// - Permite comentários antes do cabeçalho e entre os dados.
// - Preserva # e quebras de linha dentro de campos entre aspas.
// - Identifica o separador através da primeira linha válida.
//
// IMPORTANTE: os comentários devem ocupar uma linha própria.
// Não adicionar comentários no fim de linhas de dados.
function parseCSV(text) {
  text = String(text || "").replace(/^\uFEFF/, "");

  // Remove comentários e linhas vazias, sem alterar o conteúdo
  // de campos entre aspas (que podem ocupar várias linhas).
  var lines = [];
  var currentLine = "";
  var quoted = false;

  for (var i = 0; i < text.length; i++) {
    var c = text[i];

    if (c === '"') {
      if (quoted && text[i + 1] === '"') {
        currentLine += '""';
        i++;
        continue;
      }
      quoted = !quoted;
      currentLine += c;
    } else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && text[i + 1] === "\n") i++;

      var trimmed = currentLine.trim();

      if (trimmed && trimmed.charAt(0) !== "#") {
        lines.push(currentLine);
      }

      currentLine = "";
    } else {
      currentLine += c;
    }
  }

  // Última linha (mesmo sem quebra de linha no final).
  var trimmed = currentLine.trim();

  if (trimmed && trimmed.charAt(0) !== "#") {
    lines.push(currentLine);
  }

  if (!lines.length) return [];

  // Mantém a identificação automática do separador.
  var sep = lines[0].indexOf(";") >= 0 ? ";" : ",";

  // Parser CSV original, agora sobre o texto sem comentários.
  var cleaned = lines.join("\n");
  var rows = [], row = [], field = "", inQuotes = false;

  for (var j = 0; j < cleaned.length; j++) {
    var ch = cleaned[j];

    if (inQuotes) {
      if (ch === '"' && cleaned[j + 1] === '"') {
        field += '"';
        j++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === sep) {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && cleaned[j + 1] === "\n") j++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }

  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  if (!rows.length) return [];

  var header = rows.shift().map(function (h) {
    return h.trim().toLowerCase();
  });

  return rows.filter(function (r) {
    return r.join("").trim();
  }).map(function (r) {
    var obj = {};

    header.forEach(function (h, k) {
      obj[h] = (r[k] || "").trim();
    });

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

// Hierarquia ----------------------------------------------------------------------------------------------------------------------------------------------------------
// Cada alliance (organização) tem uma main_alliance (afiliação principal) em data/alliances.csv, ex.: Government -> World Government.
// Uma alliance com ranks_from (ex.: Revolutionary Country) usa os ranks e os rank-changes de outra alliance, sem os ranks_exclude
// (ex.: Celestial Dragon), desde que não tenha linhas próprias nesses ficheiros.

// Raças -----------------------------------------------------------------------------------------------------------------------------------------------------------------
// data/races.csv: kind = Biological / Artificial / Category (a linha Hybrid, que sorteia um híbrido de data/hybrids.csv)
// data/hybrids.csv: cada linha junta dois componentes. Linhas inválidas são retiradas e avisadas na consola,
// para nunca poderem ser sorteadas.

function raceKind(row) { return String(row.kind || "").trim().toLowerCase(); }

// Chave de um par de componentes, sem ordem: Human + Giant = Giant + Human (race_b vazio = raça pura)
function pairKey(a, b) {
  return [a, b].map(function (v) { return String(v || "").trim().toLowerCase(); }).sort().join("|");
}

function findHybridRow(a, b) {
  for (var i = 0; i < DATA.hybrids.length; i++) {
    if (pairKey(DATA.hybrids[i].race_a, DATA.hybrids[i].race_b) === pairKey(a, b)) return DATA.hybrids[i];
  }
  return null;
}

function checkHybrids() {
  var races = {}, pairs = {}, names = {};
  DATA.races.forEach(function (r) { races[r.race.toLowerCase()] = r; names[r.race.toLowerCase()] = true; });

  DATA.hybrids = DATA.hybrids.filter(function (h) {
    var a = races[String(h.race_a).toLowerCase()], b = races[String(h.race_b).toLowerCase()];
    var key = pairKey(h.race_a, h.race_b);
    var problem = "";
    if (!a || !b) problem = "unknown race";
    else if (a === b) problem = "a race combined with itself";
    else if (raceKind(a) === "category" || raceKind(b) === "category") problem = "the Hybrid category is not a race";
    else if (raceKind(a) === "artificial" && raceKind(b) === "artificial") problem = "two artificial components";
    else if (pairs[key]) problem = "the pair is already defined (order does not matter)";
    else if (!h.hybrid_name || names[h.hybrid_name.toLowerCase()]) problem = "the name is empty or already used";
    else if (!h.description) problem = "no description";
    if (problem) {
      console.warn("Hybrid ignored (" + problem + "): " + h.race_a + " + " + h.race_b + " " + h.hybrid_name);
      return false;
    }
    pairs[key] = true;
    names[h.hybrid_name.toLowerCase()] = true;
    return true;
  });
}

// data/clones.csv: um clone é uma origem. Tem uma raça pura biológica (race_a) ou um híbrido válido (race_a + race_b).
// O subtipo artificial (Seraphim-type) só existe em híbridos. Linhas inválidas são retiradas e avisadas na consola
function checkClones() {
  var pairs = {};
  DATA.clones = DATA.clones.filter(function (c) {
    var a = findRow(DATA.races, "race", c.race_a);
    var key = pairKey(c.race_a, c.race_b);
    var problem = "";
    if (!a) problem = "unknown race";
    else if (!c.race_b && raceKind(a) !== "biological") problem = "only biological races can be cloned";
    else if (!c.race_b && c.subtype) problem = "a subtype needs a hybrid";
    else if (c.race_b && !findHybridRow(c.race_a, c.race_b)) problem = "the pair is not a valid hybrid";
    else if (pairs[key]) problem = "the clone is already defined";
    if (problem) {
      console.warn("Clone ignored (" + problem + "): " + c.race_a + " " + c.race_b);
      return false;
    }
    pairs[key] = true;
    return true;
  });
}

// Copia as linhas de ranks_from para a alliance, sem as que usam um rank excluído
function inheritRows(rows, alliances) {
  alliances.forEach(function (a) {
    if (!a.ranks_from || rows.some(function (r) { return sameValue(r.alliance, a.alliance); })) return;
    var excluded = String(a.ranks_exclude || "").split(",").map(function (v) { return v.trim().toLowerCase(); }).filter(Boolean);
    rows.filter(function (r) { return sameValue(r.alliance, a.ranks_from); }).forEach(function (r) {
      var skip = ["rank", "previous_rank"].some(function (c) { return excluded.indexOf(String(r[c] || "").trim().toLowerCase()) !== -1; });
      if (!skip) rows.push(Object.assign({}, r, { alliance: a.alliance }));
    });
  });
}

// Avisa na consola se um nome não existe em data/alliances.csv, e garante que as organizações de World Government não têm bounty
function checkAlliances() {
  var names = DATA.alliances.map(function (a) { return a.alliance; });
  function known(name) { return names.some(function (n) { return sameValue(n, name); }); }

  DATA.alliances.forEach(function (a) {
    if (MAIN_ALLIANCES.indexOf(a.main_alliance) === -1) console.warn("Unknown main_alliance for " + a.alliance + ": " + a.main_alliance);
    if (a.ranks_from && !known(a.ranks_from)) console.warn("Unknown ranks_from for " + a.alliance + ": " + a.ranks_from);
    if (a.main_alliance === "World Government" && (yes(a.has_bounty) || num(a.bounty_min) || num(a.bounty_max))) {
      console.warn(a.alliance + " belongs to World Government, so its bounty is forced to 0.");
      a.has_bounty = "No";
      a.bounty_min = "0";
      a.bounty_max = "0";
    }
  });

  [["ranks", ["alliance"]], ["rank-changes", ["alliance"]], ["feats", ["alliance"]], ["alliance-changes", ["previous_alliance", "alliance"]]].forEach(function (t) {
    DATA[t[0]].forEach(function (r) {
      t[1].forEach(function (c) {
        if (r[c] && r[c].toLowerCase() !== "any" && !known(r[c])) console.warn("Unknown alliance \"" + r[c] + "\" in " + t[0] + ".csv");
      });
    });
  });
}

// Carregamento ----------------------------------------------------------------------------------------------------------------------------------------------------

var dataReady = Promise.all(DATA_FILES.map(function (name) { return loadCSV("data/" + name + ".csv"); })).then(function (files) {
  DATA_FILES.forEach(function (name, i) { DATA[name] = files[i]; });

  DATA.settings.forEach(function (s) { settings[s.setting] = num(s.value); });

  checkAlliances();
  checkHybrids();
  checkClones();
  inheritRows(DATA.ranks, DATA.alliances);
  inheritRows(DATA["rank-changes"], DATA.alliances);

  RULES.regions = buildRules(DATA.regions, ["alliance", "race"]);
  RULES.allianceChanges = buildRules(DATA["alliance-changes"], ["previous_alliance", "previous_rank"]);
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

    alliances.forEach(function (a) {
      (featsByAlliance[a] = featsByAlliance[a] || []).push(feat);
    });
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

// POR CONFIRMAR

/**
 * Matches transition rules by specificity.
 * Used only for alliance and rank transitions.
 *
 * More conditions = higher priority.
 * CSV order breaks ties.
 * Weighted probabilities remain unchanged.
 */

function matchTransitionRule(groups, ctx) {
  var best = null;
  var bestScore = -1;

  for (var i = 0; i < groups.length; i++) {
    var group = groups[i];

    if (
      ctx.period &&
      group.periods.indexOf(ctx.period) === -1
    ) continue;

    var conditions = Object.keys(group.when);

    var matches = conditions.every(function (key) {
      return sameValue(group.when[key], ctx[key]);
    });

    if (!matches) continue;

    var score = conditions.length;

    // An explicitly defined period counts as one condition.
    if (
      ctx.period &&
      group.rows.length &&
      String(group.rows[0].period || "").trim()
    ) {
      score++;
    }

    if (score > bestScore) {
      best = group;
      bestScore = score;
    }
  }

  return best ? best.rows : [];
}
