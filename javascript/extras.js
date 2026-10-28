// Name & Nickname -----------------------------------------------------------------------------------------------------------------------------------------------------

// Names: data/names.csv (part = first_name / last_name / nickname_prefix / nickname_suffix)
function pickName(part) {
  return pickValue(DATA.names.filter(function (r) { return r.part === part; }), "name");
}

// Will of D.: extremely rare "D." between the first and last name (can also be typed by hand).
// Chance and Doriki bonus: will_of_d_chance / will_of_d_doriki_bonus in data/settings.csv

function hasWillOfD() {
  var el = document.getElementById("fname");
  return !!el && /\S\s+D\.?\s+\S/.test(el.value);
}

function generateIdentity() {
  var middle = Math.random() < setting("will_of_d_chance") ? " D. " : " ";
  document.getElementById("fname").value = pickName("first_name") + middle + pickName("last_name");
  document.getElementById("nickname").value = '"' + pickName("nickname_prefix") + " " + pickName("nickname_suffix") + '"';
}

// Steps of one period (1 = 1st year, 2 = after 2 years, 3 = after 10 years): [function, ids of the cells it fills]
function periodSteps(n) {
  function step(fn, ids) { return [function () { fn(n); }, ids.map(function (id) { return cellId(id, n); })]; }
  return [
    step(generateAlliance, ["alliance"]),
    step(assignRank, ["rank"]),
    step(generatefighting, ["fighting"]),
    step(assignhaki, ["haki"]),
    step(generatedevilfruit, ["devilfruit"]),
    step(assigndevilfruit, ["df"]),
    step(assignfeat, ["feat"]),
    step(doriki, ["dorikifinal", "adddoriki"]),
    step(addbounty, ["bountyfinal", "addbounty"])
  ];
}

var STEP_DELAY = 160;     // ms between each element
var PERIOD_DELAY = 450;   // extra pause before each new period
var generating = false;

function reveal(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("reveal");
  void el.offsetWidth;   // restart the animation
  el.classList.add("reveal");
}

// Cards: 0 = Character, 1 = 1st Year, 2 = After 2 Years, 3 = After 10 Years.
// Each card starts blurred with its own button; the button fills the whole card one element at a time.
var LOCK_MESSAGES = ["", "Generate the character first", "Generate the 1st Year first", "Generate After 2 Years first"];

// Keeps a name / nickname typed by hand
function generateIdentityKeepTyped() {
  var name = document.getElementById("fname").value, nick = document.getElementById("nickname").value;
  generateIdentity();
  if (name.trim()) document.getElementById("fname").value = name;
  if (nick.trim()) document.getElementById("nickname").value = nick;
}

function stepsFor(p) {
  if (p === 0) return [[generateIdentityKeepTyped, ["fname", "nickname"]], [generateRace, ["race"]], [generateRegion, ["region"]], [generateGender, ["gender"]]];
  return periodSteps(p);
}

function cardDone(p) {
  return p === 0 ? cellDone("race") && cellDone("region") : periodDone(p);
}

// Minimize / expand a period card; minimized cards show a one-line summary in the header
function toggleCard(n, collapsed) {
  var card = document.getElementById("card-" + n);
  if (collapsed === undefined) collapsed = !card.classList.contains("collapsed");
  card.classList.toggle("collapsed", collapsed);
  var btn = card.querySelector(".collapse-btn");
  btn.setAttribute("aria-expanded", String(!collapsed));
  btn.title = collapsed ? "Expand" : "Minimize";
  var summary = card.querySelector(".period-summary");
  if (!summary) {
    summary = document.createElement("span");
    summary.className = "period-summary";
    card.querySelector(".period-head").insertBefore(summary, btn);
  }
  var parts = cardDone(n) ? [
    document.getElementById(cellId("alliance", n)).textContent, document.getElementById(cellId("rank", n)).textContent,
    "Doriki " + document.getElementById(cellId("dorikifinal", n)).textContent, "Bounty " + document.getElementById(cellId("bountyfinal", n)).textContent
  ] : ["Not generated yet"];
  summary.textContent = collapsed ? parts.join(" · ") : "";
}

function setPending(p, pending) {
  document.getElementById("card-" + p).classList.toggle("pending", pending);
}

function clearCard(p) {
  stepsFor(p).forEach(function (step) {
    step[1].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el || el.tagName === "SELECT") return;
      if (el.tagName === "INPUT") el.value = "";
      else el.innerHTML = "";
    });
  });
  if (p) document.getElementById("dfinfo" + p).hidden = true;
  setPending(p, true);
}

// Runs the steps of the given cards one after the other, revealing each element
function runCards(cards) {
  generating = true;
  updatePeriodLocks();
  var queue = [];
  cards.forEach(function (p, k) {
    stepsFor(p).forEach(function (step, i) { queue.push({ card: p, step: step, first: i === 0, pause: k > 0 && i === 0 }); });
  });

  var delay = 0;
  queue.forEach(function (item, i) {
    delay += i === 0 ? 0 : STEP_DELAY + (item.pause ? PERIOD_DELAY : 0);
    setTimeout(function () {
      if (item.first) {
        setPending(item.card, false);
        if (item.card) toggleCard(item.card, false);
      }
      try { item.step[0](); } catch (e) { console.error(e); }
      item.step[1].forEach(reveal);
      syncIdentity();
      if (i === queue.length - 1) {
        generating = false;
        updatePeriodLocks();
      }
    }, delay);
  });
}

function generatePeriod(p) {
  if (generating || document.getElementById("generate-" + p).disabled) return;
  dataReady.then(function () { runCards([p]); });
}

function generateAll() {
  if (generating) return;
  dataReady.then(function () {
    resetCharacter();
    // Clear the sheet so the new character appears element by element
    document.getElementById("fname").value = "";
    document.getElementById("nickname").value = "";
    [0, 1, 2, 3].forEach(clearCard);
    runCards([0, 1, 2, 3]);
  });
}

// Period locks -------------------------------------------------------------------------------------------------------------------------------------------------------
// The 1st Year stays locked until the character is generated, "After 2 Years" until the 1st Year is
// and "After 10 Years" until "After 2 Years" is.

function cellDone(id) {
  var el = document.getElementById(id);
  return !!el && !el.querySelector("input") && el.textContent.trim() !== "";
}

function periodDone(n) {
  return periodSteps(n).every(function (step) { return cellDone(step[1][0]); });
}

function setText(el, text) {
  if (el && el.textContent !== text) el.textContent = text;   // avoids re-triggering the observer
}

function updatePeriodLocks() {
  var all = document.getElementById("generate-all");
  if (all) all.disabled = generating;
  [0, 1, 2, 3].forEach(function (p) {
    var btn = document.getElementById("generate-" + p);
    var locked = p > 0 && !cardDone(p - 1);
    btn.disabled = generating || locked;
    btn.title = locked ? LOCK_MESSAGES[p] : "";
    setText(document.getElementById("lock-" + p), locked ? LOCK_MESSAGES[p] : "");
  });
}

// Character info repeated at the top of every period card
function syncIdentity() {
  var gender = document.getElementById("gender");
  var values = {
    fname: document.getElementById("fname").value.trim(),
    nickname: document.getElementById("nickname").value.trim(),
    race: cellDone("race") ? document.getElementById("race").textContent.trim() : "",
    region: cellDone("region") ? document.getElementById("region").textContent.trim() : "",
    gender: gender.options[gender.selectedIndex].text
  };
  document.querySelectorAll("[data-mirror]").forEach(function (el) {
    setText(el, values[el.getAttribute("data-mirror")] || "—");
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var sheet = document.querySelector(".sheet");
  if (!sheet) return;
  updatePeriodLocks();
  syncIdentity();
  new MutationObserver(function () { updatePeriodLocks(); syncIdentity(); }).observe(sheet, { childList: true, subtree: true, characterData: true });
  ["fname", "nickname"].forEach(function (id) { document.getElementById(id).addEventListener("input", syncIdentity); });
  document.getElementById("gender").addEventListener("change", syncIdentity);
});

function resetPage() {
  window.location.reload();
}

// Haki chart ---------------------------------------------------------------------------------------------------------------------------------------------------------
// Each haki the character has gets a row with one star per level (Basic, Advanced, Master); hakis without stars are hidden, no haki = "None"

var HAKI_LABELS = { Conquerors: "Conqueror's", Armament: "Armament", Observation: "Observation" };

function hakiLevelInfo(type, level) {
  return hakiLevels[type] && hakiLevels[type][level] ? hakiLevels[type][level].description : "";
}

function renderHaki(id, levels) {
  var el = document.getElementById(id);
  if (!el) return;
  if (!hakiTypes(levels).length) { el.textContent = "None"; return; }
  var chart = document.createElement("div");
  chart.className = "haki-chart";
  chart.setAttribute("role", "img");
  chart.setAttribute("aria-label", hakiText(levels, ", "));
  hakiTypes(levels).forEach(function (t) {
    var level = levels[t];
    var row = document.createElement("div");
    row.className = "haki-row haki-" + t.toLowerCase();
    row.title = hakiLevelInfo(t, level);
    var name = document.createElement("span");
    name.className = "haki-name";
    name.textContent = HAKI_LABELS[t];
    var bar = document.createElement("span");
    bar.className = "haki-stars";
    for (var i = 1; i < HAKI_LEVEL_NAMES.length; i++) {
      var star = document.createElement("i");
      star.textContent = "★";
      if (i <= level) star.className = "on";
      bar.appendChild(star);
    }
    var text = document.createElement("span");
    text.className = "haki-level";
    text.textContent = HAKI_LEVEL_NAMES[level];
    row.append(name, bar, text);
    chart.appendChild(row);
  });
  el.innerHTML = "";
  el.appendChild(chart);
}

// Text version (PDF / screen readers), ex: "Basic Conqueror's, Advanced Armament"
function hakiText(levels, sep) {
  var parts = HAKI_TYPES.filter(function (t) { return levels && levels[t]; }).map(function (t) {
    return HAKI_LEVEL_NAMES[levels[t]] + " " + HAKI_LABELS[t];
  });
  return parts.length ? parts.join(sep) : "None";
}

// Devil Fruit info ----------------------------------------------------------------------------------------------------------------------------------------------------

// Explicação de cada tipo: coluna "description" de data/devil-fruit-types.csv
function fruitTypeInfo(type) {
  return fruitTypes[type] ? fruitTypes[type].description : "";
}

function fruitPower(type, fruit) {
  if (fruitPowers[fruit]) return fruitPowers[fruit];   // coluna "power" de data/devil-fruits.csv
  var model = fruit.match(/Model:\s*(.+)$/);
  var element = fruit.match(/\(([^)]+?)\s*Fu?it\)/i);
  var subject = model ? model[1].trim() : (element ? element[1].trim() : fruit);
  if (type === "Zoan") return "The user can turn into a " + subject + " or a human-" + subject + " hybrid, gaining its natural strength, instincts and senses.";
  if (type === "Ancient Zoan") return "The user can turn into a prehistoric " + subject + ", becoming a towering powerhouse with brutal strength and incredible resilience.";
  if (type === "Mythical Zoan") return "The user can turn into the legendary " + subject + ", gaining its mythical abilities on top of huge physical power.";
  if (type === "Logia") return "The user becomes " + subject.toLowerCase() + " itself: they can generate it, shape it at will and turn their body into it to avoid harm.";
  if (type === "Special Paramecia") return "The user's body can produce and turn into " + subject.toLowerCase() + ", which they can shape into weapons, traps and defences.";
  return "The user gains powers based on " + subject.toLowerCase() + ", which they can apply to their own body, their surroundings or their opponents.";
}

function fruitData(n) {
  var type = periods[n].fruitType;
  var fruit = periods[n].fruit;
  if (!fruit || fruit === "None" || !fruitTypeInfo(type)) return null;
  return { type: type, fruit: fruit, typeText: fruitTypeInfo(type), powerText: fruitPower(type, fruit) };
}

function updateFruitInfo(n) {
  var btn = document.getElementById("dfinfo" + n);
  if (btn) btn.hidden = !fruitData(n);
}

function openFruitInfo(n) {
  var data = fruitData(n);
  if (!data) return;
  document.getElementById("modal-type").textContent = data.type;
  document.getElementById("modal-title").textContent = data.fruit;
  document.getElementById("modal-type-text").textContent = data.typeText;
  document.getElementById("modal-power-text").textContent = data.powerText;
  document.getElementById("fruit-modal").hidden = false;
}

function closeFruitInfo() {
  document.getElementById("fruit-modal").hidden = true;
}

// Doriki / Bounty breakdown -----------------------------------------------------------------------------------------------------------------------------------------
// character.js saves the parts of each sum here when it calculates them: rows = [label, detail, value]

var PERIOD_NAMES = ["", "1st Year", "After 2 Years", "After 10 Years"];
var breakdowns = {};

function setBreakdown(kind, n, rows, total, change, note) {
  breakdowns[kind + n] = { rows: rows, total: total, change: change, note: note || "" };
}

function formatPart(kind, value) {
  if (kind === "bounty") return Math.round(value * 1000000).toLocaleString("en-US");
  return (Math.round(value * 10) / 10).toLocaleString("en-US");
}

function openBreakdown(kind, n) {
  var data = breakdowns[kind + n];
  var title = kind === "bounty" ? "Bounty" : "Doriki";
  document.getElementById("breakdown-period").textContent = PERIOD_NAMES[n];
  document.getElementById("breakdown-title").textContent = "How the " + title + " is calculated";
  var body = document.getElementById("breakdown-rows");
  body.innerHTML = "";
  function addRow(label, detail, value, cls) {
    var tr = document.createElement("tr");
    if (cls) tr.className = cls;
    var th = document.createElement("th");
    th.textContent = label;
    if (detail) {
      var small = document.createElement("small");
      small.textContent = detail;
      th.appendChild(small);
    }
    var td = document.createElement("td");
    td.textContent = value;
    tr.append(th, td);
    body.appendChild(tr);
  }
  if (!data) {
    addRow("Not generated yet", "", "");
    document.getElementById("breakdown-note").textContent = "";
  } else {
    data.rows.forEach(function (r, i) {
      addRow(r[0], r[1], (i ? "+ " : "") + formatPart(kind, r[2]));
    });
    addRow("Total", kind === "bounty" ? (data.pet ? "rounded down to the thousand" : "rounded down to the million") : "rounded down",
      kind === "bounty" ? formatBounty(data.total) : data.total.toLocaleString("en-US"), "total");
    addRow("Change from the previous period", "", kind === "bounty" ? formatBountyChange(data.change) : "(+" + data.change.toLocaleString("en-US") + ")", "change");
    document.getElementById("breakdown-note").textContent = data.note;
  }
  document.getElementById("breakdown-modal").hidden = false;
}

function closeBreakdown() {
  document.getElementById("breakdown-modal").hidden = true;
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") { closeFruitInfo(); closeBreakdown(); }
});
