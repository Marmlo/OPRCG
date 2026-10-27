// Name & Nickname -----------------------------------------------------------------------------------------------------------------------------------------------------

var firstNames = ["Kaito", "Rin", "Jiro", "Mira", "Sora", "Taro", "Yuki", "Haru", "Nami", "Kenji", "Aya", "Ryo", "Lola", "Marco",
  "Silas", "Vera", "Dante", "Iris", "Bram", "Kira", "Otto", "Luna", "Gus", "Hana", "Zeke", "Tess", "Rex", "Mei", "Basil", "Coral"];
var lastNames = ["Storm", "Kurogane", "Blackwater", "Hayabusa", "Redfield", "Tsunami", "Ironhook", "Saltbeard", "Akagami", "Moriyama",
  "Goldtide", "Shirohige", "Ravencrest", "Kazama", "Seaborne", "Thornwood", "Umino", "Grimwave", "Hoshino", "Brassjaw"];
var nickPrefixes = ["Red", "Iron", "Black", "Storm", "Ghost", "Golden", "Silent", "Crimson", "Mad", "Thunder", "Sea", "Bloody", "Lucky", "White", "Wild"];
var nickSuffixes = ["Fist", "Fang", "Blade", "Hurricane", "Devil", "Wolf", "Shark", "Dragon", "Reaper", "Tide", "Hawk", "Cannon", "Serpent", "Kraken", "Phantom"];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Will of D.: extremely rare "D." between the first and last name (can also be typed by hand)
var WILL_OF_D_CHANCE = 0.01;
var WILL_OF_D_BONUS = 0.1;   // +10% Doriki on the 1st year

function hasWillOfD() {
  var el = document.getElementById("fname");
  return !!el && /\S\s+D\.?\s+\S/.test(el.value);
}

function generateIdentity() {
  var middle = Math.random() < WILL_OF_D_CHANCE ? " D. " : " ";
  document.getElementById("fname").value = pick(firstNames) + middle + pick(lastNames);
  document.getElementById("nickname").value = '"' + pick(nickPrefixes) + " " + pick(nickSuffixes) + '"';
}

// Steps of one period (1st year = "", after 2 years = "2", after 10 years = "3"): [function, ids of the cells it fills]
function periodSteps(s) {
  return [
    [window["generateAlliance" + s], ["alliance" + s]],
    [window["assignRank" + s], ["rank" + s]],
    [window["generatefighting" + s], ["fighting" + s]],
    [window["assignhaki" + s], ["haki" + s]],
    [window["generatedevilfruit" + s], ["devilfruit" + s]],
    [window["assigndevilfruit" + s], ["df" + s]],
    [window["assignfeat" + s], ["feat" + s]],
    [window["doriki" + s], ["dorikifinal" + s, "adddoriki" + s]],
    [window["addbounty" + s], ["bountyfinal" + s, "addbounty" + s]]
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

function generateAll() {
  if (generating) return;
  var periods = [
    [[generateIdentity, ["fname", "nickname"]], [generateRace, ["race"]], [generateRegion, ["region"]], [generateGender, ["gender"]]].concat(periodSteps("")),
    periodSteps("2"),
    periodSteps("3")
  ];
  var button = document.getElementById("generate-all");

  dataReady.then(function () {
    generating = true;
    if (button) button.disabled = true;
    alliance = "";

    // Clear the sheet so the new character appears element by element
    periods.forEach(function (steps) {
      steps.forEach(function (step) {
        step[1].forEach(function (id) {
          var el = document.getElementById(id);
          if (!el || el.tagName === "SELECT") return;
          if (el.tagName === "INPUT") el.value = "";
          else el.innerHTML = "";
        });
      });
    });
    [1, 2, 3].forEach(function (n) { document.getElementById("dfinfo" + n).hidden = true; });

    var queue = [];
    periods.forEach(function (steps, p) {
      steps.forEach(function (step, i) { queue.push({ step: step, pause: p > 0 && i === 0 }); });
    });

    var delay = 0;
    queue.forEach(function (item, i) {
      delay += i === 0 ? 0 : STEP_DELAY + (item.pause ? PERIOD_DELAY : 0);
      setTimeout(function () {
        try { item.step[0](); } catch (e) { console.error(e); }
        item.step[1].forEach(reveal);
        if (i === queue.length - 1) {
          generating = false;
          if (button) button.disabled = false;
        }
      }, delay);
    });
  });
}

// Period locks -------------------------------------------------------------------------------------------------------------------------------------------------------
// Region stays locked until the race is generated, the 1st Year until race and region are,
// "After 2 Years" until the 1st Year is fully generated, and "After 10 Years" until "After 2 Years" is.

function cellDone(id) {
  var el = document.getElementById(id);
  return !!el && !el.querySelector("input") && el.textContent.trim() !== "";
}

function periodDone(s) {
  return periodSteps(s).every(function (step) { return cellDone(step[1][0]); });
}

function setCellsLocked(ids, locked, message) {
  ids.forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.querySelectorAll('input[type="button"]').forEach(function (btn) {
      if (btn.disabled === locked) return;
      btn.disabled = locked;
      btn.title = locked ? message : "";
    });
  });
}

function setPeriodLocked(s, locked, message) {
  periodSteps(s).forEach(function (step) { setCellsLocked(step[1], locked, message); });
}

function updatePeriodLocks() {
  setCellsLocked(["region"], !cellDone("race"), "Generate the race first");
  setPeriodLocked("", !(cellDone("race") && cellDone("region")), "Generate the race and region first");
  setPeriodLocked("2", !periodDone(""), "Generate the whole 1st Year first");
  setPeriodLocked("3", !periodDone("2"), "Generate the whole After 2 Years period first");
}

document.addEventListener("DOMContentLoaded", function () {
  var sheet = document.querySelector(".sheet");
  if (!sheet) return;
  updatePeriodLocks();
  new MutationObserver(updatePeriodLocks).observe(sheet, { childList: true, subtree: true, characterData: true });
});

function resetPage() {
  window.location.reload();
}

// Haki chart ---------------------------------------------------------------------------------------------------------------------------------------------------------
// Each haki the character has gets a row with one star per level (Basic, Advanced, Master); no haki = "None"

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
  HAKI_TYPES.forEach(function (t) {
    var level = levels[t] || 0;
    var row = document.createElement("div");
    row.className = "haki-row haki-" + t.toLowerCase() + (level ? "" : " haki-none");
    row.title = hakiLevelInfo(t, level) || "Not unlocked";
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
    text.textContent = level ? HAKI_LEVEL_NAMES[level] : "—";
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
  var type = [devilfruit, devilfruit2, devilfruit3][n - 1];
  var fruit = [df, df2, df3][n - 1];
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

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeFruitInfo();
});
