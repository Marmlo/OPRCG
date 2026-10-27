// Name & Nickname -----------------------------------------------------------------------------------------------------------------------------------------------------

var firstNames = ["Kaito", "Rin", "Jiro", "Mira", "Sora", "Taro", "Yuki", "Haru", "Nami", "Kenji", "Aya", "Ryo", "Lola", "Marco",
  "Silas", "Vera", "Dante", "Iris", "Bram", "Kira", "Otto", "Luna", "Gus", "Hana", "Zeke", "Tess", "Rex", "Mei", "Basil", "Coral"];
var lastNames = ["D. Storm", "Kurogane", "Blackwater", "Hayabusa", "Redfield", "Tsunami", "Ironhook", "Saltbeard", "Akagami", "Moriyama",
  "Goldtide", "Shirohige", "Ravencrest", "Kazama", "Seaborne", "Thornwood", "Umino", "Grimwave", "Hoshino", "Brassjaw"];
var nickPrefixes = ["Red", "Iron", "Black", "Storm", "Ghost", "Golden", "Silent", "Crimson", "Mad", "Thunder", "Sea", "Bloody", "Lucky", "White", "Wild"];
var nickSuffixes = ["Fist", "Fang", "Blade", "Hurricane", "Devil", "Wolf", "Shark", "Dragon", "Reaper", "Tide", "Hawk", "Cannon", "Serpent", "Kraken", "Phantom"];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function generateIdentity() {
  document.getElementById("fname").value = pick(firstNames) + " " + pick(lastNames);
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
