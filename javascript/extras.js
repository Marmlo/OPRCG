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

function generateAll() {
  var steps = [generateIdentity, generateRace, generateAlliance, assignRank, generatefighting, assignhaki, generatedevilfruit, assigndevilfruit,
    assignfeat, doriki, addbounty, generateAlliance2, assignRank2, generatefighting2, assignhaki2, generatedevilfruit2, assigndevilfruit2,
    assignfeat2, doriki2, addbounty2, generateAlliance3, assignRank3, generatefighting3, assignhaki3, generatedevilfruit3, assigndevilfruit3,
    assignfeat3, doriki3, addbounty3];
  dataReady.then(function () {
    steps.forEach(function (step) {
      try { step(); } catch (e) { console.error(e); }
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
