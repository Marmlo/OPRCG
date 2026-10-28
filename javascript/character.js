// Character ----------------------------------------------------------------------------------------------------------------------------------------------------------
// Os valores e probabilidades estão todos em data/*.csv (ver data/README.md); aqui ficam só as regras que os ligam.
// Cada período tem o seu estado: 1 = 1st Year, 2 = After 2 Years, 3 = After 10 Years.

var race = null;   // { name, type: "Pure" | "Hybrid" | "Artificial Hybrid", origin: "Natural" | "Clone", subtype, components: [linhas de races.csv], description }
var region = "";
var periods = [null, {}, {}, {}];   // { mainAlliance, alliance, rank, fighting, haki, fruitType, fruit, feats, doriki, bounty }

function resetCharacter() {
  race = null; region = "";
  periods = [null, {}, {}, {}];
}

// Ids das células de cada período: "rank" no 1st Year, "rank2" e "rank3" nos timeskips
function cellId(base, n) { return base + (n > 1 ? n : ""); }

function show(base, n, html) { document.getElementById(cellId(base, n)).innerHTML = html; }

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Valor entre as colunas <field>_min e <field>_max de uma linha, ex: rollRange(raceInfo(), "doriki")
function rollRange(row, field) {
  return row ? getRandomInt(num(row[field + "_min"]), num(row[field + "_max"]) + 1) : 0;
}

function capFirst(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function findRow(rows, column, value) {
  for (var i = 0; i < rows.length; i++) if (sameValue(rows[i][column], value)) return rows[i];
  return null;
}

function allianceInfo(n) { return findRow(DATA.alliances, "alliance", periods[n].alliance) || {}; }
function ranksOf(allianceName) { return DATA.ranks.filter(function (r) { return sameValue(r.alliance, allianceName); }); }

// Linha do rank em data/ranks.csv; um rank que não esteja no ficheiro usa o Doriki de data/settings.csv
function rankInfo(n) {
  var p = periods[n];
  return findRow(ranksOf(p.alliance), "rank", p.rank) || findRow(DATA.ranks, "rank", p.rank) ||
    { rank: p.rank, doriki_min: setting("default_rank_doriki_min"), doriki_max: setting("default_rank_doriki_max") };
}


// Race (data/races.csv, data/hybrids.csv) -----------------------------------------------------------------------------------------------------------------------------
// Uma raça pura usa 100% dos seus valores. Um híbrido tem exatamente dois componentes e recebe 50% de cada um:
// hybrid = (componente A + componente B) / 2, calculado sempre a partir de data/races.csv (nunca copiado para o híbrido).

var RACIAL_FIELDS = ["doriki_min", "doriki_max", "bounty_min", "bounty_max"];
var HYBRID_KEY = "Hybrid";   // chave em regions.csv e fighting-styles.csv de todos os híbridos biológicos (como a antiga raça Hybrid)

// Valores raciais de uma lista de componentes (1 = raça pura, 2 = híbrido). Arredonda para baixo, como os restantes valores
function racialModifiers(components) {
  if (!components.length || !components[0]) return null;
  if (components.length === 1) return components[0];
  var out = {};
  RACIAL_FIELDS.forEach(function (f) { out[f] = Math.floor((num(components[0][f]) + num(components[1][f])) / 2); });
  return out;
}

function raceInfo() { return race ? racialModifiers(race.components) : null; }

function isArtificial(row) { return String(row.kind || "").trim().toLowerCase() === "artificial"; }

// Raças naturais: uma raça pura, ou um híbrido de data/hybrids.csv
function pureRace(name) {
  return { name: name, type: "Pure", origin: "Natural", subtype: "", components: [findRow(DATA.races, "race", name)], description: "" };
}

function hybridRace(h) {
  var parts = [h.race_a, h.race_b].map(function (name) { return findRow(DATA.races, "race", name); });
  return {
    name: h.hybrid_name,
    type: parts.some(isArtificial) ? "Artificial Hybrid" : "Hybrid",
    origin: "Natural",
    subtype: "",
    components: parts,
    description: h.description
  };
}

// Clone (origem, separada dos componentes): a raça de uma linha de data/clones.csv. Não dá Doriki, bounty nem poderes.
// Um subtipo artificial (Seraphim-type) torna-o Artificial Hybrid, mesmo com componentes biológicos
function cloneRace(c) {
  var clone = c.race_b ? hybridRace(findHybridRow(c.race_a, c.race_b)) : pureRace(c.race_a);
  clone.origin = "Clone";
  clone.subtype = c.subtype || "";
  if (clone.subtype) clone.type = "Artificial Hybrid";
  clone.description = c.description || clone.description;
  return clone;
}

// Nomes dos componentes, ex: "Human + Giant" (uma raça pura tem só o seu nome)
function componentsText() {
  return race ? race.components.map(function (r) { return r.race; }).join(" + ") : "";
}

// Nome principal mostrado na raça, ex: "Human", "Human — Clone", "Human-Lunarian Hybrid — Seraphim-type"
function raceTitle() {
  if (!race) return "";
  return race.origin === "Clone" ? race.name + " — " + (race.subtype || "Clone") : race.name;
}

// Nome mostrado nas tabelas e exportações, ex: "Half-Giant (Human + Giant)"; "Human — Clone" nas raças puras clonadas
function raceLabel() {
  if (!race) return "";
  return race.type === "Pure" ? raceTitle() : raceTitle() + " (" + componentsText() + ")";
}

// Chave das tabelas por raça (regions.csv, fighting-styles.csv): a raça pura; "Hybrid" para os híbridos biológicos;
// vazio para os artificiais (como o antigo Cyborg, que não tinha linhas próprias). Um clone usa a mesma chave da sua raça
function raceKey() {
  if (!race) return "";
  if (race.type === "Pure") return race.components[0].race;
  return race.type === "Hybrid" ? HYBRID_KEY : "";
}

// Mostra a raça: o nome principal. Nos híbridos e nos clones, um "i" abre o popover (race-popover.js)
function showRace() {
  closeRacePopover();
  var el = document.getElementById("race");
  var name = document.createElement("span");
  name.className = "race-name";
  name.textContent = raceTitle();
  el.textContent = "";
  el.appendChild(name);
  if (race.type === "Pure" && race.origin === "Natural") return;
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "info-btn race-info";
  btn.textContent = "i";
  btn.title = "About this race";
  btn.setAttribute("aria-label", "About " + raceTitle());
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", "race-popover");
  el.appendChild(btn);
}

// Origem: com a chance de settings.csv (clone_chance) a personagem é um clone e a raça vem de data/clones.csv.
// Caso contrário sorteia da tabela de raças: uma raça pura pelo "weight", ou a categoria Hybrid, que sorteia um híbrido de data/hybrids.csv.
// Sem híbridos válidos (ou com todos a 0), a categoria Hybrid não entra no sorteio
function generateRace() {
  var clone = Math.random() < setting("clone_chance") ? weightedPick(DATA.clones) : null;
  race = clone ? cloneRace(clone) : naturalRace();
  showRace();
}

function naturalRace() {
  var hybrids = DATA.hybrids.filter(function (h) { return weightOf(h) > 0; });
  var pool = DATA.races.filter(function (r) { return raceKind(r) !== "category" || hybrids.length; });
  var pick = weightedPick(pool);
  return raceKind(pick) === "category" ? hybridRace(weightedPick(hybrids)) : pureRace(pick.race);
}

// A região depende da raça e da alliance do 1st Year (ex.: World Nobles nascem em Mary Geoise)
function regionChoices() {
  return matchRule(RULES.regions, { alliance: periods[1].alliance || "", race: raceKey() });
}

function generateRegion() {
  region = pickValue(regionChoices(), "region");
  document.getElementById("region").innerHTML = region;
}

// Mantém a região coerente com a alliance do 1st Year (chamada depois de gerar a alliance)
function syncRegion() {
  if (!region) return;
  if (!regionChoices().some(function (r) { return r.region === region; })) generateRegion();
}

function generateGender() {
  document.getElementById("gender").value = pickValue(DATA.genders, "gender");
}


// Alliance (data/alliances.csv no 1st Year, data/alliance-changes.csv nos timeskips) -------------------------------------------------------------------------------------
// A alliance é a organização. A afiliação principal (main_alliance) vem da linha dessa organização, sem sorteio próprio

function generateAlliance(n) {
  var p = periods[n];
  if (n === 1) {
    p.alliance = pickValue(DATA.alliances, "alliance");
  } else {
    var before = periods[n - 1].alliance;
    p.alliance = pickValue(matchRule(RULES.allianceChanges, { previous_alliance: before }), "alliance") || before;
  }
  p.mainAlliance = allianceInfo(n).main_alliance || "";
  show("main-alliance", n, p.mainAlliance);
  show("alliance", n, organizationHtml(p.alliance));
  if (n === 1) syncRegion();
}


// Rank (coluna weight de data/ranks.csv no 1st Year, data/rank-changes.csv nos timeskips) ----------------------------------------------------------------------------------

function assignRank(n) {
  var p = periods[n];
  var choices = ranksOf(p.alliance);
  if (n > 1) {
    var changes = matchRule(RULES.rankChanges, { alliance: p.alliance, previous_rank: periods[n - 1].rank });
    if (changes.length) choices = changes;
    // timeskip_jump_chance: chance de saltar diretamente para esse rank (ex.: Yonko), seja qual for o rank anterior
    var jump = choices.length && ranksOf(p.alliance).filter(function (r) { return Math.random() < num(r.timeskip_jump_chance); })[0];
    if (jump) choices = [{ rank: jump.rank }];
  }
  p.rank = pickValue(choices, "rank");
  show("rank", n, p.rank);
}


// Fighting style (data/fighting-styles.csv) ----------------------------------------------------------------------------------------------------------------------------
// No 1st Year sorteia do primeiro grupo que encaixa. Nos timeskips mantém o estilo, a não ser que um grupo do período
// (ex.: rank Swordsman) não o permita; nesse caso sorteia desse grupo.

function generatefighting(n) {
  var p = periods[n], before = n > 1 ? periods[n - 1].fighting : "";
  var choices = matchRule(RULES.fighting, { period: n, alliance: p.alliance, rank: p.rank, race: raceKey() });
  var keep = n > 1 && (!choices.length || choices.some(function (r) { return sameValue(r.style, before); }));
  p.fighting = keep ? before : pickValue(choices, "style") || before || "None";
  show("fighting", n, p.fighting);
}


// Haki ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// Combinação de hakis: data/haki-chances.csv (no 1st Year pode depender do fighting style e do rank, depois do haki anterior)
// Nível de cada haki: data/haki-level-chances.csv. Doriki / bounty por nível: data/haki-levels.csv
// Nível mínimo exigido pelos ranks: colunas conquerors / armament / observation de data/ranks.csv (e de data/feats.csv para os feats)

function noHaki() {
  return { Conquerors: 0, Armament: 0, Observation: 0 };
}

// Tipos de haki que o personagem tem, ex: ["Conquerors", "Armament"]
function hakiTypes(levels) {
  return HAKI_TYPES.filter(function (t) { return levels && levels[t] > 0; });
}

function hasHaki(haki, types) {
  return types.every(function (t) { return String(haki).indexOf(t) !== -1; });
}

function buildHaki(types) {
  var names = HAKI_TYPES.filter(function (t) { return types.indexOf(t) !== -1; });
  return names.length ? names.join(" + ") : "None";
}

function meetsHaki(levels, required) {
  return HAKI_TYPES.every(function (t) { return (levels && levels[t] || 0) >= (required[t] || 0); });
}

// Mantém só as combinações que cumprem o requisito do rank; se nenhuma cumpre, junta o haki atual ao mínimo exigido
function meetRankHaki(required, choices, currentHaki) {
  var req = hakiTypes(required);
  if (!choices.length) choices = [{ haki: currentHaki }];
  if (!req.length) return choices;
  var ok = choices.filter(function (r) { return hasHaki(r.haki, req); });
  if (ok.length) return ok;
  return [{ haki: buildHaki(HAKI_TYPES.filter(function (t) { return req.indexOf(t) !== -1 || String(currentHaki).indexOf(t) !== -1; })) }];
}

function levelChances(period) {
  return DATA["haki-level-chances"].filter(function (r) { return num(r.period) === period; });
}

// Nível inicial de um haki novo, pela coluna start_weight do período
function rollStartLevel(period) {
  return hakiLevel((weightedPick(levelChances(period), "start_weight") || {}).level) || 1;
}

// Chance de um haki que já tinha subir um nível no período (coluna upgrade_chance)
function upgradeChance(period, level) {
  var row = findRow(levelChances(period), "level", HAKI_LEVEL_NAMES[level]);
  return row ? num(row.upgrade_chance) : 0;
}

// Passa a combinação sorteada (ex: "Conquerors + Armament") para níveis. Os hakis que já tinha podem subir um nível,
// os novos começam num nível sorteado e no fim aplica-se o nível mínimo do rank
function rollHakiLevels(hakiName, prevLevels, period, required) {
  var levels = noHaki();
  HAKI_TYPES.forEach(function (t) {
    var prev = prevLevels ? prevLevels[t] || 0 : 0;
    if (prev && prev < 3 && Math.random() < upgradeChance(period, prev)) prev++;
    if (!prev && String(hakiName).indexOf(t) !== -1) prev = rollStartLevel(period);
    levels[t] = Math.max(prev, required[t] || 0);
  });
  return levels;
}

// Doriki e bounty que o haki dá (valores em data/haki-levels.csv)
function hakiBonus(levels, field) {
  return HAKI_TYPES.reduce(function (sum, t) {
    var lv = hakiLevels[t] && levels && hakiLevels[t][levels[t]];
    return sum + (lv ? getRandomInt(lv[field + "_min"], lv[field + "_max"] + 1) : 0);
  }, 0);
}

function assignhaki(n) {
  var p = periods[n], before = n > 1 ? periods[n - 1].haki : null;
  var current = buildHaki(hakiTypes(before));   // ex: "Conquerors + Armament"
  var required = hakiOf(rankInfo(n));
  var choices = matchRule(RULES.haki, { period: n, fighting: p.fighting, rank: p.rank, previous_haki: current });
  p.haki = rollHakiLevels(pickValue(meetRankHaki(required, choices, current), "haki"), before, n, required);
  renderHaki(cellId("haki", n), p.haki);
}


// Devil Fruit ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// Tipos, probabilidades (weight), Doriki/Bounty e frutas estão em data/devil-fruit-types.csv e data/devil-fruits.csv

// Se já tinha fruta no período anterior mantém o tipo, senão sorteia pelo "weight"
function rollFruitType(prevType) {
  if (prevType && prevType !== "No") return prevType;
  return pickValue(DATA["devil-fruit-types"], "type") || "No";
}

// Mantém a fruta do período anterior se o tipo não mudou, senão sorteia uma do tipo
function rollFruit(type, prevType, prevFruit) {
  if (prevType && prevType !== "No" && prevType === type) return prevFruit;
  var list = fruitsByType[type];
  return list && list.length ? list[getRandomInt(0, list.length)] : "None";
}

function fruitDoriki(type) {
  var t = fruitTypes[type];
  return t ? getRandomInt(t.doriki_min, t.doriki_max + 1) : 0;
}

function fruitBounty(type) {
  var t = fruitTypes[type];
  return t ? getRandomInt(t.bounty_min, t.bounty_max + 1) : 0;
}

function generatedevilfruit(n) {
  var p = periods[n];
  p.fruitType = rollFruitType(n > 1 ? periods[n - 1].fruitType : "");
  show("devilfruit", n, p.fruitType);
}

function assigndevilfruit(n) {
  var p = periods[n], before = periods[n - 1] || {};
  p.fruit = rollFruit(p.fruitType, before.fruitType, before.fruit);
  show("df", n, p.fruit);
  updateFruitInfo(n);
}


// Feat ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// Os feats de cada alliance, a probabilidade (weight), o Doriki/Bounty que dão e o haki que exigem estão em data/feats.csv
// Número de feats por período: data/feat-counts.csv. As linhas "None" de data/feats.csv não são sorteadas

// Sorteia um feat da alliance pelo "weight", excluindo os que exigem haki que a personagem não tem
function pickFeat(allianceName, levels, exclude) {
  var pool = (featsByAlliance[allianceName] || []).filter(function (f) {
    return meetsHaki(levels, f.haki) && f.name.toLowerCase() !== "none" && exclude.indexOf(capFirst(f.name)) === -1;
  });
  var f = weightedPick(pool);
  return f ? capFirst(f.name) : "None";
}

// Sorteia 1 a 3 feats diferentes (lista vazia se a alliance não tiver feats possíveis)
function pickFeats(allianceName, levels) {
  var feats = [];
  for (var i = num(pickValue(DATA["feat-counts"], "feats")); i > 0; i--) {
    var f = pickFeat(allianceName, levels, feats);
    if (f === "None") break;
    feats.push(f);
  }
  return feats;
}

function showFeats(id, feats) {
  var el = document.getElementById(id);
  if (!feats.length) { el.textContent = "None"; return; }
  var list = document.createElement("ul");
  list.className = "feat-list";
  feats.forEach(function (f) {
    var li = document.createElement("li");
    li.textContent = f;
    list.appendChild(li);
  });
  el.innerHTML = "";
  el.appendChild(list);
}

function assignfeat(n) {
  var p = periods[n];
  p.feats = pickFeats(p.alliance, p.haki);
  showFeats(cellId("feat", n), p.feats);
}

function findFeatIn(list, featName) {
  for (var i = 0; i < (list || []).length; i++) if (list[i].name === featName) return list[i];
  return null;
}

function findFeat(allianceName, featName) {
  var f = findFeatIn(featsByAlliance[allianceName], featName);
  for (var a in featsByAlliance) f = f || findFeatIn(featsByAlliance[a], featName);   // feat de outra alliance
  return f;
}

function featBonus(field, featName, allianceName) {
  var f = findFeat(allianceName, featName);
  return f ? getRandomInt(f[field + "_min"], f[field + "_max"] + 1) : 0;
}

// Soma o Doriki/Bounty de todos os feats do período. detail = texto para o pop-up, ex: "Feat A (+120), Feat B (+40)"
function featParts(field, feats, allianceName, unit) {
  var values = feats.map(function (name) { return featBonus(field, name, allianceName); });
  var total = values.reduce(function (sum, v) { return sum + v; }, 0);
  var detail = feats.map(function (name, i) {
    return name + " (+" + (unit === "bounty" ? formatBounty(values[i]) : values[i]) + ")";
  }).join(", ");
  return { total: total, detail: detail || "None", names: feats.join(", ") || "None" };
}


// Doriki ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// 1st Year: race + rank + haki + devil fruit + feats (+ Will of D.)
// Timeskips: Doriki anterior + parte do Doriki do rank (timeskip_rank_doriki_share) + haki + feats

function percent(share) { return Math.round(share * 1000) / 10 + "%"; }

function doriki(n) {
  var p = periods[n], before = periods[n - 1];
  var rankdoriki = rollRange(rankInfo(n), "doriki");
  var hakidoriki = hakiBonus(p.haki, "doriki");
  var feats = featParts("doriki", p.feats, p.alliance);
  var rows, change;

  if (n === 1) {
    var racedoriki = rollRange(raceInfo(), "doriki");
    var fruitdoriki = fruitDoriki(p.fruitType);
    var base = racedoriki + rankdoriki + hakidoriki + fruitdoriki + feats.total;
    var bonus = setting("will_of_d_doriki_bonus");
    p.doriki = hasWillOfD() ? base * (1 + bonus) : base;   // --- Will of D. (nome com "D.")
    change = parseInt(p.doriki);
    rows = [
      ["Race", raceLabel(), racedoriki], ["Rank", p.rank, rankdoriki], ["Haki", hakiText(p.haki, ", "), hakidoriki],
      ["Devil fruit", p.fruitType, fruitdoriki], ["Feats", feats.detail, feats.total]
    ].concat(hasWillOfD() ? [["Will of D.", "+" + percent(bonus) + " of " + base, p.doriki - base]] : []);
  } else {
    var share = setting("timeskip_rank_doriki_share");
    p.doriki = before.doriki + rankdoriki * share + hakidoriki + feats.total;
    change = parseInt(p.doriki) - parseInt(before.doriki);   // diferença para o período anterior
    rows = [
      ["Doriki from " + PERIOD_NAMES[n - 1], "", before.doriki], ["Rank", p.rank + " (" + percent(share) + " of " + rankdoriki + ")", rankdoriki * share],
      ["Haki", hakiText(p.haki, ", "), hakidoriki], ["Feats", feats.detail, feats.total]
    ];
  }

  setBreakdown("doriki", n, rows, parseInt(p.doriki), change);
  show("dorikifinal", n, parseInt(p.doriki));
  show("adddoriki", n, '(+' + change + ')');
}


// Bounty ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// Parte do Doriki (doriki_bounty_share) + alliance + devil fruit + feats + haki + rank (ex.: Yonko), em milhões.
// Alliances com has_bounty = No (World Government: World Nobles, Marine, Cipher Pol, Government): bounty 0 em todos os períodos,
// incluindo feats, timeskips e mudanças de organização. Os valores anteriores ficam no período em que foram ganhos.
// Ranks com bounty_in_thousands (Pets): a bounty conta em milhares. keeps_higher_bounty (Yonko): no After 10 Years
// mantém a bounty do After 2 Years se a nova for mais baixa.

// Formata bounties em milhões com vírgulas, ex: 1500 -> 1,500,000,000 (0.25 -> 250,000 para os Pets)
function formatBounty(millions) {
  return Math.round(millions * 1000000).toLocaleString("en-US");
}

// Bounty mostrada: arredonda ao milhão, ou ao milhar quando é inferior a um milhão (Pets)
function roundBounty(millions) {
  return millions >= 1 ? Math.floor(millions) : Math.floor(millions * 1000) / 1000;
}

// Mostra a variação da bounty com o sinal correto, ex: (+5,000,000) ou (-3,000,000)
function formatBountyChange(value) {
  var sign = value < 0 ? '-' : '+';
  return '(' + sign + formatBounty(Math.abs(value)) + ')';
}

// Cada milhão calculado conta como mil, entre pet_bounty_min e pet_bounty_max (em milhares)
function petBounty(millions) {
  return Math.min(Math.max(Math.floor(millions), setting("pet_bounty_min")), setting("pet_bounty_max")) / 1000;
}

function petBreakdown(n) {
  var b = breakdowns["bounty" + n];
  b.rows = b.rows.map(function (r) {
    var detail = String(r[1]).replace(/\(\+([\d,]+)\)/g, function (m, v) { return "(+" + formatBounty(Number(v.replace(/,/g, "")) / 1e9) + ")"; });
    return [r[0], detail, r[2] / 1000];
  });
  b.pet = true;
  b.note = "Pirate pets are worth thousands, not millions: every million above counts as a thousand (between " +
    formatBounty(setting("pet_bounty_min") / 1000) + " and " + formatBounty(setting("pet_bounty_max") / 1000) + ").";
}

function addbounty(n) {
  var p = periods[n], before = periods[n - 1], rk = rankInfo(n);
  var blocked = !yes(allianceInfo(n).has_bounty);   // --- World Government: sem bounty
  var share = setting("doriki_bounty_share");
  var feats = featParts("bounty", p.feats, p.alliance, "bounty");
  var parts = {
    doriki: p.doriki * share, alliance: rollRange(allianceInfo(n), "bounty"), fruit: fruitBounty(p.fruitType),
    feats: feats.total, haki: hakiBonus(p.haki, "bounty"), rank: rollRange(rk, "bounty"), race: rollRange(raceInfo(), "bounty")
  };

  var total = parts.doriki + parts.alliance + parts.fruit + parts.feats + parts.haki + parts.rank + parts.race;
  var keptHigher = n === 3 && yes(rk.keeps_higher_bounty) && total < before.bounty;
  if (blocked) total = 0;
  else if (keptHigher) total = before.bounty;   // --- mantém a bounty anterior
  var pet = !blocked && yes(rk.bounty_in_thousands);
  if (pet) total = petBounty(total);   // --- Pets dos piratas (bounty nos milhares)
  p.bounty = total;

  var change = roundBounty(total) - (n > 1 ? roundBounty(before.bounty) : 0);
  var rows = blocked ? [[p.mainAlliance, "No bounty for this affiliation", 0]]
    : keptHigher ? [["Bounty from " + PERIOD_NAMES[n - 1], "", before.bounty]] : [
      ["Doriki", percent(share) + " of " + parseInt(p.doriki), parts.doriki], ["Organization", p.alliance, parts.alliance],
      ["Devil fruit", p.fruitType, parts.fruit], ["Feats", parts.feats ? feats.detail : feats.names, parts.feats], ["Haki", hakiText(p.haki, ", "), parts.haki]
    ].concat(parts.rank ? [[p.rank, "", parts.rank]] : []).concat(parts.race ? [["Race", raceLabel(), parts.race]] : []);
  var note = blocked ? p.mainAlliance + " members have no bounty."
    : keptHigher ? "The new bounty would be lower, so the " + p.rank + " keeps the bounty from " + PERIOD_NAMES[n - 1] + "."
    : n === 1 ? ""
    : "The bounty is recalculated each period from the current Doriki, organization, fruit, feat and haki.";

  setBreakdown("bounty", n, rows, roundBounty(total), change, note);
  if (pet) petBreakdown(n);
  show("bountyfinal", n, formatBounty(roundBounty(total)));
  show("addbounty", n, formatBountyChange(change));
}
