let alliance = "";
let alliance2 = "";
let alliance3 = "";
let rank = "";
let rank2 = "";
let rank3 = "";
let fighting = "";
let fighting2 = "";
let fighting3 = "";
let haki = "";
let haki2 = "";
let haki3 = "";
let devilfruit = "";
let devilfruit2 = "";
let devilfruit3 = "";
let df = "";
let df2 = "";
let df3 = "";
let feat = [];
let feat2 = [];
let feat3 = [];


// Rules ---------------------------------------------------------------------------------------------------------------------------------------------------------------

// Nível mínimo de haki exigido para os ranks mais altos (1 = Basic, 2 = Advanced, 3 = Master)
var rankHakiRequirements = {
  "Yonko":             { Conquerors: 2, Armament: 2, Observation: 1 },
  "Fleet Admiral":     { Armament: 2, Observation: 2 },
  "Admiral":           { Armament: 2, Observation: 1 },
  "Vice Admiral":      { Armament: 1 },
  "Inspector General": { Armament: 1 },
  "Leader":            { Armament: 2, Observation: 1 },
  "Chief of Staff":    { Armament: 1, Observation: 1 },
  "Army Commander":    { Armament: 1 },
  "Shichibukai":       { Armament: 1 },
  "CP0":               { Armament: 1 }
};

// Haki exigido pelos feats: colunas conquerors / armament / observation de data/feats.csv

// Probabilidade de cada nível quando um haki é desbloqueado, por período (quanto mais alto o nível, mais raro).
// Master nunca aparece no 1st Year. Os valores de cada período somam 1.
var HAKI_START_ODDS = {
  1: { 1: 0.9,  2: 0.1,  3: 0    },
  2: { 1: 0.8,  2: 0.17, 3: 0.03 },
  3: { 1: 0.7,  2: 0.23, 3: 0.07 }
};
// Probabilidade de um haki que já tinha subir um nível em cada período (1 = Basic -> Advanced, 2 = Advanced -> Master)
var HAKI_UPGRADE_ODDS = {
  2: { 1: 0.3,  2: 0.08 },
  3: { 1: 0.45, 2: 0.2  }
};

// Sorteia o nível inicial de um haki novo pelas probabilidades do período
function rollStartLevel(period) {
  var odds = HAKI_START_ODDS[period] || HAKI_START_ODDS[1];
  var roll = Math.random();
  for (var lv = 3; lv > 1; lv--) {
    if (roll < odds[lv]) return lv;
    roll -= odds[lv];
  }
  return 1;
}

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
  var c = types.indexOf("Conquerors") !== -1, a = types.indexOf("Armament") !== -1, o = types.indexOf("Observation") !== -1;
  if (c && a && o) return "Conquerors + Armament + Observation";
  if (a && o) return "Observation + Armament";
  if (c && a) return "Conquerors + Armament";
  if (c && o) return "Conquerors + Observation";
  if (c) return "Conquerors";
  if (a) return "Armament";
  if (o) return "Observation";
  return "None";
}

// Mantém só os hakis do pool que cumprem o requisito do rank; se nenhum cumpre, junta o haki atual ao mínimo exigido
function meetRankHaki(rankName, pool, currentHaki) {
  var req = hakiTypes(rankHakiRequirements[rankName]);
  pool = pool || [currentHaki || "None"];
  if (!req.length) return pool;
  var ok = pool.filter(function (h) { return hasHaki(h, req); });
  if (ok.length) return ok;
  var types = HAKI_TYPES.filter(function (t) {
    return req.indexOf(t) !== -1 || String(currentHaki).indexOf(t) !== -1;
  });
  return [buildHaki(types)];
}

// Passa o haki sorteado (ex: "Conquerors + Armament") para níveis. Os hakis que já tinha podem subir de Basic para Advanced,
// os novos começam num nível sorteado por HAKI_START_ODDS e no fim aplica-se o nível mínimo do rank
function rollHakiLevels(hakiName, prevLevels, period, rankName) {
  var levels = noHaki();
  var req = rankHakiRequirements[rankName] || {};
  HAKI_TYPES.forEach(function (t) {
    var prev = prevLevels ? prevLevels[t] || 0 : 0;
    if (prev && prev < 3 && Math.random() < ((HAKI_UPGRADE_ODDS[period] || {})[prev] || 0)) prev++;
    if (!prev && String(hakiName).indexOf(t) !== -1) prev = rollStartLevel(period);
    levels[t] = Math.max(prev, req[t] || 0);
  });
  return levels;
}

function meetsHaki(levels, required) {
  return HAKI_TYPES.every(function (t) { return (levels && levels[t] || 0) >= (required[t] || 0); });
}

// Doriki e bounty que o haki dá (valores em data/haki-levels.csv)
function hakiBonus(levels, field) {
  return HAKI_TYPES.reduce(function (sum, t) {
    var lv = hakiLevels[t] && levels && hakiLevels[t][levels[t]];
    return sum + (lv ? getRandomInt(lv[field + "_min"], lv[field + "_max"] + 1) : 0);
  }, 0);
}

// Probabilidade de um pirata se tornar Yonko (só a partir de "After 2 Years")
var YONKO_CHANCE = 0.02;

function maybeYonko(allianceName, pool) {
  if (allianceName === "Pirate" && Math.random() < YONKO_CHANCE) return ["Yonko"];
  return pool;
}

var swordStyles = ["Swordsmanship", "Samurai"];

// Doriki e bounty de cada feat: colunas doriki_min/max e bounty_min/max de data/feats.csv
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

// Soma o Doriki/Bounty de todos os feats do período (1 a 3). detail = texto para o pop-up, ex: "Feat A (+120), Feat B (+40)"
function featParts(field, feats, allianceName, unit) {
  var values = feats.map(function (name) { return featBonus(field, name, allianceName); });
  var total = values.reduce(function (sum, v) { return sum + v; }, 0);
  var detail = feats.map(function (name, i) {
    return name + " (+" + (unit === "bounty" ? formatBounty(values[i]) : values[i]) + ")";
  }).join(", ");
  return { total: total, detail: detail || "None", names: feats.join(", ") || "None" };
}

function isSwordRank(rankName) {
  return rankName === "Swordsman";
}

// Formata bounties em milhões com vírgulas, ex: 1500 -> 1,500,000,000 (0.25 -> 250,000 para os Pets)
function formatBounty(millions) {
  return Math.round(millions * 1000000).toLocaleString("en-US");
}

// Bounty mostrada: arredonda ao milhão, ou ao milhar quando é inferior a um milhão (Pets)
function roundBounty(millions) {
  return millions >= 1 ? Math.floor(millions) : Math.floor(millions * 1000) / 1000;
}

// Pets dos piratas valem milhares e não milhões: cada milhão calculado conta como mil (entre 1,000 e 999,000)
var PET_BOUNTY_MIN = 1, PET_BOUNTY_MAX = 100;   // em milhares
function isPet(rankName, allianceName) {
  return rankName === "Pet" && allianceName === "Pirate";
}
function petBounty(millions) {
  return Math.min(Math.max(Math.floor(millions), PET_BOUNTY_MIN), PET_BOUNTY_MAX) / 1000;
}
function petBreakdown(n) {
  var b = breakdowns["bounty" + n];
  b.rows = b.rows.map(function (r) {
    var detail = String(r[1]).replace(/\(\+([\d,]+)\)/g, function (m, v) { return "(+" + formatBounty(Number(v.replace(/,/g, "")) / 1e9) + ")"; });
    return [r[0], detail, r[2] / 1000];
  });
  b.pet = true;
  b.note = "Pirate pets are worth thousands, not millions: every million above counts as a thousand (between 1,000 and 999,000).";
}



// Race ---------------------------------------------------------------------------------------------------------------------------------------------------------------

function capFirst(alli) {
    return alli.charAt(0).toUpperCase() + alli.slice(1);
    }

   

function generateRace(){
      var races = ["Human","Giant","Ancient Giant","Frost Giant","Fishman","Merfolk","Skipean", "Lunarian", "Mink", "Tonnata", "Oni", "Cyborg", "Hybrid"
      ,"Human","Giant","Human","Human","Fishman","Merfolk","Fishman", "Human", "Hybrid", "Fishman", "Human", "Human", "Hybrid"
      ,"Human","Giant","Human","Human"];

      race = capFirst(races[getRandomInt(0, races.length)]);
      document.getElementById("race").innerHTML = race;
    }

function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
}

    /* 

    Odds:
      Human             - 10/30 - 33%
      Giant         - 3/30 - 09%    
      Ancient Giant   - 1/30 - 03%    
      Frost Giant       - 1/30 - 03%  
      Fishman       - 4/30 - 12%  
      Merfolk           - 2/30 - 06%  
      Skipean       - 1/30 - 03%  
      Lunarian      - 1/30 - 03%  
      Mink        - 1/30 - 03%  
      Tonnata     - 1/30 - 03%  
      Oni       - 1/30 - 04%  
      Cyborg      - 1/30 - 04%  
      Hybrid            - 3/30 - 09%

    */


// Region (where the character was born) - depends on the race --------------------------------------------------------------------------------------------------------

let region = "";

var humanRegions = ["East Blue","West Blue","North Blue","South Blue","Grand Line","New World"
      ,"East Blue","West Blue","North Blue","South Blue","Grand Line","New World"
      ,"East Blue","North Blue","South Blue","Grand Line"];

var regionsByRace = {
  "Human":         humanRegions,
  "Giant":         ["New World (Elbaf)"],
  "Ancient Giant": ["New World (Elbaf)"],
  "Frost Giant":   ["New World (Elbaf)"],
  "Fishman":       ["Fish-Man Island","Fish-Man Island","Fish-Man Island","Grand Line"],
  "Merfolk":       ["Fish-Man Island","Fish-Man Island","Fish-Man Island","Grand Line"],
  "Skipean":       ["Sky Islands (Skypiea)"],
  "Lunarian":      ["Red Line"],
  "Mink":          ["New World (Zou)"],
  "Tonnata":       ["New World (Green Bit)"],
  "Oni":           ["New World (Wano)"],
  "Cyborg":        humanRegions,
  "Hybrid":        humanRegions.concat(["Fish-Man Island","New World (Elbaf)","New World (Wano)","New World (Zou)"])
};

// Celestial Dragons (World Nobles) are always born in Mary Geoise
var nobleRegion = "Red Line (Mary Geoise)";

function generateRegion(){
  if (alliance === "World Nobles") {
     region = nobleRegion;
  } else {
     var regions = regionsByRace[race] || humanRegions;
     region = regions[getRandomInt(0, regions.length)];
  }
  document.getElementById("region").innerHTML = region;
}

// Keeps the region consistent with the 1st year alliance (called after generateAlliance)
function syncRegion(){
  if (!region) return;
  if ((alliance === "World Nobles") !== (region === nobleRegion)) generateRegion();
}

    /*

    Odds (Human / Cyborg):
      East Blue    - 3/16 - 19%
      West Blue    - 2/16 - 12,5%
      North Blue   - 3/16 - 19%
      South Blue   - 3/16 - 19%
      Grand Line   - 3/16 - 19%
      New World    - 2/16 - 12,5%

    Giant / Ancient Giant / Frost Giant - New World (Elbaf)
    Fishman / Merfolk                   - Fish-Man Island 75% / Grand Line 25%
    Skipean                             - Sky Islands (Skypiea)
    Lunarian                            - Red Line
    Mink                                - New World (Zou)
    Tonnata                             - New World (Green Bit)
    Oni                                 - New World (Wano)
    Hybrid                              - Human odds + Fish-Man Island, Elbaf, Wano, Zou
    World Nobles (Celestial Dragons)    - Red Line (Mary Geoise)

    */


// Gender ---------------------------------------------------------------------------------------------------------------------------------------------------------------

function generateGender(){
  var genders = ["male","female","other"];

  document.getElementById("gender").value = genders[getRandomInt(0, genders.length)];
}

    /*

    Odds:
      Male          - 1/3 - 33,3%
      Female        - 1/3 - 33,3%
      Other         - 1/3 - 33,3%

    */

    
// Alliance ---------------------------------------------------------------------------------------------------------------------------------------------------------------

function capFirst(alli) {
    return alli.charAt(0).toUpperCase() + alli.slice(1);
}

function generateAlliance(){
      var alliances = ["Revolucionary Army","Marine","Pirate","Bounty Hunter","Cipher Pol","World Nobles"
      				,"Revolucionary Army","Marine","Pirate","Bounty Hunter","Marine","Pirate"];

      alliance = capFirst(alliances[getRandomInt(0, alliances.length)]);
      document.getElementById("alliance").innerHTML = alliance;
      syncRegion();
}

function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
}

	/* 

    Odds:
      Revolucionary Army - 2/12 - 16,6%
      Marine    		 - 3/12 - 25,0%
      Pirate 		 	 - 3/12 - 25,0%
      Bounty Hunter      - 2/12 - 16,6%
      Cipher Pol    	 - 1/12 - 08,3%
      World Nobles  	 - 1/12 - 08,3%

	*/

// Probabilidade de manter a alliance do período anterior; se mudar, sorteia uma das outras da lista
var ALLIANCE_STAY_CHANCE = 0.8;

function rollNextAlliance(prev, pool) {
  var others = pool.filter(function (a) { return a !== prev; });
  if (!others.length || Math.random() < ALLIANCE_STAY_CHANCE) return prev;
  return others[getRandomInt(0, others.length)];
}

// Alliance2 -----

function generateAlliance2(){
  if (alliance === "Revolucionary Army") {
     alliances2 = ["Revolucionary Army","Revolucionary Army","Pirate","Bounty Hunter"];
  } else if(alliance === "Marine") {
     alliances2 = ["Marine","Marine","Marine","Revolucionary Army","Pirate","Bounty Hunter","Cipher Pol"];
  } else if(alliance === "Pirate") {
     alliances2 = ["Revolucionary Army","Pirate","Pirate","Bounty Hunter","Marine"];
  } else if(alliance === "Bounty Hunter") {
     alliances2 = ["Bounty Hunter","Bounty Hunter","Revolucionary Army","Pirate","Bounty Hunter"];
  } else if(alliance === "Cipher Pol") {
     alliances2 = ["Cipher Pol","Cipher Pol","Marine"];
  } else if(alliance === "World Nobles") {
     alliances2 = ["World Nobles","World Nobles","Revolucionary Army","Marine","Pirate","Bounty Hunter","Cipher Pol"];
  }

  alliance2 = capFirst(rollNextAlliance(alliance, alliances2));   // 80% mantém a alliance
  document.getElementById("alliance2").innerHTML = alliance2;
}

// Alliance3 -----

function generateAlliance3(){
  if (alliance2 === "Revolucionary Army") {
     alliances3 = ["Revolucionary Army","Revolucionary Army","Pirate","Bounty Hunter"];
  } else if(alliance2 === "Marine") {
     alliances3 = ["Marine","Marine","Marine","Revolucionary Army","Pirate","Bounty Hunter","Cipher Pol"];
  } else if(alliance2 === "Pirate") {
     alliances3 = ["Revolucionary Army","Pirate","Pirate","Bounty Hunter","Marine"];
  } else if(alliance2 === "Bounty Hunter") {
     alliances3 = ["Bounty Hunter","Bounty Hunter","Revolucionary Army","Pirate","Bounty Hunter"];
  } else if(alliance2 === "Cipher Pol") {
     alliances3 = ["Cipher Pol","Cipher Pol","Marine"];
  } else if(alliance2 === "World Nobles") {
     alliances3 = ["World Nobles","World Nobles","Revolucionary Army","Marine","Pirate","Bounty Hunter","Cipher Pol"];
  }

  alliance3 = capFirst(rollNextAlliance(alliance2, alliances3));   // 80% mantém a alliance
  document.getElementById("alliance3").innerHTML = alliance3;
}


// Rank ---------------------------------------------------------------------------------------------------------------------------------------------------------------

function assignRank(){
     
 if (alliance === "Revolucionary Army") {
     ranks = ["Chief of Staff","Army Commander","Officer","Member","Associate"];
  } else if(alliance === "Marine") {
     ranks = ["Vice Admiral","Rear Admiral","Commodore","Captain","Commander",
     "Lieutenant","Ensign","Petty Officer","Seaman","Choreboy","Inspector General","Instructor","Shichibukai"];
  } else if(alliance === "Pirate") {
     ranks = ["Pirate Captain","First Mate","Swordsman","Sniper","Martial Artist","Navigator","Cook","Doctor","Shipwright","Musician","Aprentice","Pet"];
  } else if(alliance === "Bounty Hunter") {
     ranks = ["Individual","Guild Leader","Guild Member"];
  } else if(alliance === "Cipher Pol") {
     ranks = ["CP5","CP6","CP7","CP8","CP9"];
  } else if(alliance === "World Nobles") {
     ranks = ["Celestial Dragon","King/Queen","Prince/Princess","Noble Commander","Soldier"];
  } 

  rank = capFirst(ranks[getRandomInt(0, ranks.length)]);
  document.getElementById("rank").innerHTML = rank;
}


// Rank 2 -----

function assignRank2(){
 
  if(rank === "Leader" && alliance2 === "Revolucionary Army") { // --------------------------- Revolucionary Army
     ranks2 = ["Leader"];
  } else if(rank === "Chief of Staff" && alliance2 === "Revolucionary Army") {
     ranks2 = ["Leader","Chief of Staff"];
  } else if(rank === "Army Commander" && alliance2 === "Revolucionary Army") {
     ranks2 = ["Leader","Chief of Staff","Army Commander"];
  } else if(rank === "Officer" && alliance2 === "Revolucionary Army") {
     ranks2 = ["Leader","Chief of Staff","Army Commander","Officer"];
  } else if(rank === "Member" && alliance2 === "Revolucionary Army") {
     ranks2 = ["Leader","Chief of Staff","Army Commander","Officer","Member","Associate"];
  } else if(rank === "Associate" && alliance2 === "Revolucionary Army") {
     ranks2 = ["Leader","Chief of Staff","Army Commander","Officer","Member","Associate"];

  } else if(alliance2 === "Revolucionary Army") {
     ranks2 = ["Leader","Chief of Staff","Army Commander","Officer","Member","Associate"];   
//----------------------------------------------------------------------------
  } else if(rank === "Fleet Admiral" && alliance2 === "Marine") {  // ------------------------- Marine
     ranks2 = ["Fleet Admiral","Admiral","Vice Admiral","Inspector General","Instructor"];
  } else if(rank === "Admiral" && alliance2 === "Marine") {
     ranks2 = ["Fleet Admiral","Admiral","Vice Admiral","Inspector General","Instructor"];
  } else if(rank === "Vice Admiral" && alliance2 === "Marine") {
     ranks2 = ["Fleet Admiral","Admiral","Vice Admiral","Inspector General","Instructor"];
  } else if(rank === "Rear Admiral" && alliance2 === "Marine") {
     ranks2 = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Inspector General","Instructor"];
  } else if(rank === "Commodore" && alliance2 === "Marine") {
     ranks2 = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Commodore","Inspector General","Instructor"];
  } else if(rank === "Captain" && alliance2 === "Marine") {
     ranks2 = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Commodore","Captain","Inspector General","Instructor"];
  } else if(rank === "Commander" && alliance2 === "Marine") {
     ranks2 = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Commodore","Captain","Commander","Inspector General","Instructor"];
  } else if(rank === "Lieutenant" && alliance2 === "Marine") {
     ranks2 = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Commodore","Captain","Commander","Lieutenant","Inspector General","Instructor"];
  } else if(rank === "Ensign" && alliance2 === "Marine") {
     ranks2 = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Commodore","Captain","Commander","Lieutenant","Ensign","Inspector General","Instructor"];
  } else if(rank === "Petty Officer" && alliance2 === "Marine") {
     ranks2 = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Commodore","Captain","Commander","Lieutenant","Ensign","Petty Officer","Inspector General","Instructor"];
  } else if(rank === "Seaman" && alliance2 === "Marine") {
     ranks2 = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Commodore","Captain","Commander","Lieutenant","Ensign","Petty Officer","Seaman","Inspector General","Instructor"];
  } else if(rank === "Choreboy" && alliance2 === "Marine") {
     ranks2 = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Commodore","Captain","Commander","Lieutenant","Ensign","Petty Officer","Seaman","Choreboy","Inspector General","Instructor"];
  } else if(rank === "Inspector General" && alliance2 === "Marine") {
     ranks2 = ["Fleet Admiral","Admiral","Vice Admiral","Inspector General","Instructor"];
  } else if(rank === "Instructor" && alliance2 === "Marine") {
     ranks2 = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Inspector General","Instructor"];      

  } else if(rank === "Pirate Captain" && alliance2 === "Marine") {  // ------------------------- Marine (Shichibukai)
     ranks2 = ["Shichibukai"];
  
  } else if(alliance2 === "Marine") {
     ranks2 = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Commodore","Captain","Commander","Lieutenant","Ensign","Petty Officer","Seaman","Choreboy","Inspector General","Instructor"];   
//----------------------------------------------------------------------------
  } else if(rank === "Pirate Captain" && alliance2 === "Pirate") {  // ------------------------- Pirate
     ranks2 = ["Yonko","Pirate Captain","Pirate Captain","Pirate Captain"];
  } else if(rank === "First Mate" && alliance2 === "Pirate") {
     ranks2 = ["Pirate Captain","First Mate"];
  } else if(rank === "Swordsman" && alliance2 === "Pirate") {
     ranks2 = ["Pirate Captain","First Mate","Swordsman"];
  } else if(rank === "Sniper" && alliance2 === "Pirate") {
     ranks2 = ["Pirate Captain","First Mate","Sniper"];
  } else if(rank === "Martial Artist" && alliance2 === "Pirate") {
     ranks2 = ["Pirate Captain","First Mate","Martial Artist"];
  } else if(rank === "Navigator" && alliance2 === "Pirate") {
     ranks2 = ["Pirate Captain","First Mate","Navigator"];
  } else if(rank === "Cook" && alliance2 === "Pirate") {
     ranks2 = ["Pirate Captain","First Mate","Cook"];
  } else if(rank === "Doctor" && alliance2 === "Pirate") {
     ranks2 = ["Pirate Captain","First Mate","Doctor"];
  } else if(rank === "Shipwright" && alliance2 === "Pirate") {
     ranks2 = ["Pirate Captain","First Mate","Shipwright"];
  } else if(rank === "Musician" && alliance2 === "Pirate") {
     ranks2 = ["Pirate Captain","First Mate","Musician"];
  } else if(rank === "Aprentice" && alliance2 === "Pirate") {
     ranks2 = ["Pirate Captain","First Mate","Swordsman","Sniper","Martial Artist","Navigator","Cook","Doctor","Shipwright","Musician","Aprentice"];
  } else if(rank === "Pet" && alliance2 === "Pirate") {
     ranks2 = ["Pirate Captain","First Mate","Pet"];

  } else if(alliance2 === "Pirate") {
     ranks2 = ["Pirate Captain","First Mate","Swordsman","Sniper","Martial Artist","Navigator","Cook","Doctor","Shipwright","Musician","Aprentice","Pet"];   
//----------------------------------------------------------------------------
  } else if(rank === "Individual" && alliance2 === "Bounty Hunter") {  // ------------------------- Bounty Hunter
     ranks2 = ["Individual","Guild Leader","Guild Member"];
  } else if(rank === "Guild Leader" && alliance2 === "Bounty Hunter") {
     ranks2 = ["Individual","Guild Leader"];
  } else if(rank === "Guild Member" && alliance2 === "Bounty Hunter") {
     ranks2 = ["Individual","Guild Leader","Guild Member"];

  } else if(alliance2 === "Bounty Hunter") {
     ranks2 = ["Individual","Guild Leader","Guild Member"];   
//----------------------------------------------------------------------------
  } else if(rank === "CP0" && alliance2 === "Cipher Pol") {             // ------------------------- Cipher Pol
     ranks2 = ["CP0"];
  } else if(rank === "CP1" && alliance2 === "Cipher Pol") {            
     ranks2 = ["CP0","CP1"];
  } else if(rank === "CP2" && alliance2 === "Cipher Pol") {            
     ranks2 = ["CP0","CP1","CP2"];
  } else if(rank === "CP3" && alliance2 === "Cipher Pol") {            
     ranks2 = ["CP0","CP1","CP2","CP3"];
  } else if(rank === "CP4" && alliance2 === "Cipher Pol") {            
     ranks2 = ["CP0","CP1","CP2","CP3","CP4"];
  } else if(rank === "CP5" && alliance2 === "Cipher Pol") {            
     ranks2 = ["CP0","CP1","CP2","CP3","CP4","CP5"];
  } else if(rank === "CP6" && alliance2 === "Cipher Pol") {            
     ranks2 = ["CP0","CP1","CP2","CP3","CP4","CP5","CP6"];
  } else if(rank === "CP7" && alliance2 === "Cipher Pol") {            
     ranks2 = ["CP0","CP1","CP2","CP3","CP4","CP5","CP6","CP7"];
  } else if(rank === "CP8" && alliance2 === "Cipher Pol") {            
     ranks2 = ["CP0","CP1","CP2","CP3","CP4","CP5","CP6","CP7","CP8"];
  } else if(rank === "CP9" && alliance2 === "Cipher Pol") {            
     ranks2 = ["CP0","CP1","CP2","CP3","CP4","CP5","CP6","CP7","CP8","CP9"];

  } else if(alliance2 === "Cipher Pol") {            
     ranks2 = ["CP0","CP1","CP2","CP3","CP4","CP5","CP6","CP7","CP8","CP9"];
//----------------------------------------------------------------------------
  } else if(rank === "Celestial Dragon" && alliance2 === "World Nobles") { // ------------------------- World Nobles
     ranks2 = ["Celestial Dragon","King/Queen","Prince/Princess","Noble Commander","Soldier"];
  } else if(rank === "King/Queen" && alliance2 === "World Nobles") {                            
     ranks2 = ["Celestial Dragon","King/Queen"];
  } else if(rank === "Prince/Princess" && alliance2 === "World Nobles") {                            
     ranks2 = ["King/Queen","Prince/Princess"];
  } else if(rank === "Noble Commander" && alliance2 === "World Nobles") {                            
     ranks2 = ["King/Queen","Prince/Princess","Noble Commander"];
  } else if(rank === "Soldier" && alliance2 === "World Nobles") {                            
     ranks2 = ["King/Queen","Prince/Princess","Noble Commander","Soldier"];

  } else if(alliance2 === "World Nobles") {                            
     ranks2 = ["King/Queen","Prince/Princess","Noble Commander","Soldier"];
  }

  ranks2 = maybeYonko(alliance2, ranks2);

  rank2 = capFirst(ranks2[getRandomInt(0, ranks2.length)]);
  document.getElementById("rank2").innerHTML = rank2;
}

// Rank 3 -----

function assignRank3(){
 
  if(rank2 === "Leader" && alliance3 === "Revolucionary Army") { // --------------------------- Revolucionary Army
     ranks3 = ["Leader"];
  } else if(rank2 === "Chief of Staff" && alliance3 === "Revolucionary Army") {
     ranks3 = ["Leader","Chief of Staff"];
  } else if(rank2 === "Army Commander" && alliance3 === "Revolucionary Army") {
     ranks3 = ["Leader","Chief of Staff","Army Commander"];
  } else if(rank2 === "Officer" && alliance3 === "Revolucionary Army") {
     ranks3 = ["Leader","Chief of Staff","Army Commander","Officer"];
  } else if(rank2 === "Member" && alliance3 === "Revolucionary Army") {
     ranks3 = ["Leader","Chief of Staff","Army Commander","Officer","Member","Associate"];
  } else if(rank2 === "Associate" && alliance3 === "Revolucionary Army") {
     ranks3 = ["Leader","Chief of Staff","Army Commander","Officer","Member","Associate"];

  } else if(alliance3 === "Revolucionary Army") {
     ranks3 = ["Leader","Chief of Staff","Army Commander","Officer","Member","Associate"];   
//----------------------------------------------------------------------------
  } else if(rank2 === "Fleet Admiral" && alliance3 === "Marine") {  // ------------------------- Marine
     ranks3 = ["Fleet Admiral","Admiral","Vice Admiral","Inspector General","Instructor"];
  } else if(rank2 === "Admiral" && alliance3 === "Marine") {
     ranks3 = ["Fleet Admiral","Admiral","Vice Admiral","Inspector General","Instructor"];
  } else if(rank2 === "Vice Admiral" && alliance3 === "Marine") {
     ranks3 = ["Fleet Admiral","Admiral","Vice Admiral","Inspector General","Instructor"];
  } else if(rank2 === "Rear Admiral" && alliance3 === "Marine") {
     ranks3 = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Inspector General","Instructor"];
  } else if(rank2 === "Commodore" && alliance3 === "Marine") {
     ranks3 = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Commodore","Inspector General","Instructor"];
  } else if(rank2 === "Captain" && alliance3 === "Marine") {
     ranks3 = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Commodore","Captain","Inspector General","Instructor"];
  } else if(rank2 === "Commander" && alliance3 === "Marine") {
     ranks3 = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Commodore","Captain","Commander","Inspector General","Instructor"];
  } else if(rank2 === "Lieutenant" && alliance3 === "Marine") {
     ranks3 = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Commodore","Captain","Commander","Lieutenant","Inspector General","Instructor"];
  } else if(rank2 === "Ensign" && alliance3 === "Marine") {
     ranks3 = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Commodore","Captain","Commander","Lieutenant","Ensign","Inspector General","Instructor"];
  } else if(rank2 === "Petty Officer" && alliance3 === "Marine") {
     ranks3 = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Commodore","Captain","Commander","Lieutenant","Ensign","Petty Officer","Inspector General","Instructor"];
  } else if(rank2 === "Seaman" && alliance3 === "Marine") {
     ranks3 = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Commodore","Captain","Commander","Lieutenant","Ensign","Petty Officer","Seaman","Inspector General","Instructor"];
  } else if(rank2 === "Choreboy" && alliance3 === "Marine") {
     ranks3 = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Commodore","Captain","Commander","Lieutenant","Ensign","Petty Officer","Seaman","Choreboy","Inspector General","Instructor"];
  } else if(rank2 === "Inspector General" && alliance3 === "Marine") {
     ranks3 = ["Fleet Admiral","Admiral","Vice Admiral","Inspector General","Instructor"];
  } else if(rank2 === "Instructor" && alliance3 === "Marine") {
     ranks3 = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Inspector General","Instructor"];      

  } else if(rank2 === "Pirate Captain" && alliance3 === "Marine") {  // ------------------------- Marine (Shichibukai)
     ranks3 = ["Shichibukai"];
  
  } else if(alliance3 === "Marine") {
     ranks3 = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Commodore","Captain","Commander","Lieutenant","Ensign","Petty Officer","Seaman","Choreboy","Inspector General","Instructor"];   
//----------------------------------------------------------------------------
  } else if(rank2 === "Pirate Captain" && alliance3 === "Pirate") {  // ------------------------- Pirate
     ranks3 = ["Yonko","Pirate Captain","Pirate Captain","Pirate Captain"];
  } else if(rank2 === "First Mate" && alliance3 === "Pirate") {
     ranks3 = ["Pirate Captain","First Mate"];
  } else if(rank2 === "Swordsman" && alliance3 === "Pirate") {
     ranks3 = ["Pirate Captain","First Mate","Swordsman"];
  } else if(rank2 === "Sniper" && alliance3 === "Pirate") {
     ranks3 = ["Pirate Captain","First Mate","Sniper"];
  } else if(rank2 === "Martial Artist" && alliance3 === "Pirate") {
     ranks3 = ["Pirate Captain","First Mate","Martial Artist"];
  } else if(rank2 === "Navigator" && alliance3 === "Pirate") {
     ranks3 = ["Pirate Captain","First Mate","Navigator"];
  } else if(rank2 === "Cook" && alliance3 === "Pirate") {
     ranks3 = ["Pirate Captain","First Mate","Cook"];
  } else if(rank2 === "Doctor" && alliance3 === "Pirate") {
     ranks3 = ["Pirate Captain","First Mate","Doctor"];
  } else if(rank2 === "Shipwright" && alliance3 === "Pirate") {
     ranks3 = ["Pirate Captain","First Mate","Shipwright"];
  } else if(rank2 === "Musician" && alliance3 === "Pirate") {
     ranks3 = ["Pirate Captain","First Mate","Musician"];
  } else if(rank2 === "Aprentice" && alliance3 === "Pirate") {
     ranks3 = ["Pirate Captain","First Mate","Swordsman","Sniper","Martial Artist","Navigator","Cook","Doctor","Shipwright","Musician","Aprentice"];
  } else if(rank2 === "Pet" && alliance3 === "Pirate") {
     ranks3 = ["Pirate Captain","First Mate","Pet"];

  } else if(alliance3 === "Pirate") {
     ranks3 = ["Pirate Captain","First Mate","Swordsman","Sniper","Martial Artist","Navigator","Cook","Doctor","Shipwright","Musician","Aprentice","Pet"];   
//----------------------------------------------------------------------------
  } else if(rank2 === "Individual" && alliance3 === "Bounty Hunter") {  // ------------------------- Bounty Hunter
     ranks3 = ["Individual","Guild Leader","Guild Member"];
  } else if(rank2 === "Guild Leader" && alliance3 === "Bounty Hunter") {
     ranks3 = ["Individual","Guild Leader"];
  } else if(rank2 === "Guild Member" && alliance3 === "Bounty Hunter") {
     ranks3 = ["Individual","Guild Leader","Guild Member"];

  } else if(alliance3 === "Bounty Hunter") {
     ranks3 = ["Individual","Guild Leader","Guild Member"];   
//----------------------------------------------------------------------------
  } else if(rank2 === "CP0" && alliance3 === "Cipher Pol") {             // ------------------------- Cipher Pol
     ranks3 = ["CP0"];
  } else if(rank2 === "CP1" && alliance3 === "Cipher Pol") {            
     ranks3 = ["CP0","CP1"];
  } else if(rank2 === "CP2" && alliance3 === "Cipher Pol") {            
     ranks3 = ["CP0","CP1","CP2"];
  } else if(rank2 === "CP3" && alliance3 === "Cipher Pol") {            
     ranks3 = ["CP0","CP1","CP2","CP3"];
  } else if(rank2 === "CP4" && alliance3 === "Cipher Pol") {            
     ranks3 = ["CP0","CP1","CP2","CP3","CP4"];
  } else if(rank2 === "CP5" && alliance3 === "Cipher Pol") {            
     ranks3 = ["CP0","CP1","CP2","CP3","CP4","CP5"];
  } else if(rank2 === "CP6" && alliance3 === "Cipher Pol") {            
     ranks3 = ["CP0","CP1","CP2","CP3","CP4","CP5","CP6"];
  } else if(rank2 === "CP7" && alliance3 === "Cipher Pol") {            
     ranks3 = ["CP0","CP1","CP2","CP3","CP4","CP5","CP6","CP7"];
  } else if(rank2 === "CP8" && alliance3 === "Cipher Pol") {            
     ranks3 = ["CP0","CP1","CP2","CP3","CP4","CP5","CP6","CP7","CP8"];
  } else if(rank2 === "CP9" && alliance3 === "Cipher Pol") {            
     ranks3 = ["CP0","CP1","CP2","CP3","CP4","CP5","CP6","CP7","CP8","CP9"];

  } else if(alliance3 === "Cipher Pol") {            
     ranks3 = ["CP0","CP1","CP2","CP3","CP4","CP5","CP6","CP7","CP8","CP9"];
//----------------------------------------------------------------------------
  } else if(rank2 === "Celestial Dragon" && alliance3 === "World Nobles") { // ------------------------- World Nobles
     ranks3 = ["Celestial Dragon","King/Queen","Prince/Princess","Noble Commander","Soldier"];
  } else if(rank2 === "King/Queen" && alliance3 === "World Nobles") {                            
     ranks3 = ["Celestial Dragon","King/Queen"];
  } else if(rank2 === "Prince/Princess" && alliance3 === "World Nobles") {                            
     ranks3 = ["King/Queen","Prince/Princess"];
  } else if(rank2 === "Noble Commander" && alliance3 === "World Nobles") {                            
     ranks3 = ["King/Queen","Prince/Princess","Noble Commander"];
  } else if(rank2 === "Soldier" && alliance3 === "World Nobles") {                            
     ranks3 = ["King/Queen","Prince/Princess","Noble Commander","Soldier"];

  } else if(alliance3 === "World Nobles") {                            
     ranks3 = ["King/Queen","Prince/Princess","Noble Commander","Soldier"];
  }

  if (rank2 === "Yonko" && alliance3 === "Pirate") {   // Um Yonko continua Yonko
     ranks3 = ["Yonko"];
  } else {
     ranks3 = maybeYonko(alliance3, ranks3);
  }

  rank3 = capFirst(ranks3[getRandomInt(0, ranks3.length)]);
  document.getElementById("rank3").innerHTML = rank3;
}


// Fighting ---------------------------------------------------------------------------------------------------------------------------------------------------------------

function generatefighting(){
     
 if (alliance === "Cipher Pol") { // ---------------------------------------------- Cipher Pol
     fightings = ["Six power"];
  } else if(rank === "Seaman") {  // ---------------------------------------------- Marine
     fightings = ["Gunsmanship","Swordsmanship"];
  } else if(rank === "Choreboy") { 						
     fightings = ["Gunsmanship","Swordsmanship","Fists"];
  } else if(rank === "Swordsman") {   // ------------------------------------------ Pirate			
     fightings = ["Swordsmanship","Samurai"];    
  } else if(rank === "Sniper") {
     fightings = ["Gunsmanship"];
  } else if(rank === "Martial Artist") {
     fightings = ["Six power","Dragon Claw","Fishman karate"];
  } else if(rank === "Soldier") {  // --------------------------------------------- World Nobles
     fightings = ["Gunsmanship","Swordsmanship"];
  } else if(race === "Fishman") {  // --------------------------------------------- Fishman Race
     fightings = ["Fishman karate","Swordsmanship","Gunsmanship","Six power","Dragon Claw","Freestyle","Black leg","Fists","Samurai"];
  } else if(race === "Merfolk") {  // --------------------------------------------- Merfolk Race
     fightings = ["Fishman karate","Swordsmanship","Gunsmanship","Six power","Dragon Claw","Freestyle","Black leg","Fists","Samurai"];      
  } else {                         // --------------------------------------------- Rest
  	 fightings = ["Swordsmanship","Gunsmanship","Six power","Dragon Claw","Freestyle","Black leg","Fists","Samurai"]
  }

  fighting = capFirst(fightings[getRandomInt(0, fightings.length)]);
  document.getElementById("fighting").innerHTML = fighting;
}

// Fighting 2 -----

function generatefighting2(){

  fightings2 = [fighting]
  if (isSwordRank(rank2) && swordStyles.indexOf(fighting) === -1) {   // Swordsman luta sempre com espadas
     fightings2 = swordStyles;
  }

  fighting2 = capFirst(fightings2[getRandomInt(0, fightings2.length)]);
  document.getElementById("fighting2").innerHTML = fighting2;
}

// Fighting 3 -----

function generatefighting3(){

  fightings3 = [fighting2]
  if (isSwordRank(rank3) && swordStyles.indexOf(fighting2) === -1) {   // Swordsman luta sempre com espadas
     fightings3 = swordStyles;
  }

  fighting3 = capFirst(fightings3[getRandomInt(0, fightings3.length)]);
  document.getElementById("fighting3").innerHTML = fighting3;
}

// Haki ---------------------------------------------------------------------------------------------------------------------------------------------------------------

function assignhaki(){

 
     
 if (fighting === "Dragon Claw") {
     hakis = ["Observation + Armament","Armament","Armament","Armament","Armament","Conquerors + Armament","Armament",
     "Observation + Armament","Armament","Armament","Armament","Observation + Armament","Conquerors + Armament","Armament",
     "Observation + Armament","Armament","Armament","Armament","Armament","Armament","Armament","Armament",
     "Conquerors + Armament","Armament","Conquerors + Armament + Observation"];
  } else if (rank === "Fleet Admiral"){ // -------------------------------------------------------------------------------------------------- Marine
     hakis = ["Armament","Conquerors","Observation","Armament","Observation","Conquerors + Armament","Observation","Observation + Armament","Observation",
      "Conquerors + Observation","Observation","Observation","Armament","Observation","Observation","Armament",
      "Observation","Observation","Armament","Conquerors + Armament + Observation"];
  } else if (rank === "Admiral"){
     hakis = ["Armament","Conquerors","Observation","Armament","Observation","Conquerors + Armament","Observation","Observation + Armament","Observation",
      "Conquerors + Observation","Armament","Armament","Observation","Observation","Armament","Observation","Armament","Armament","Observation","Armament",
      "Observation","Armament","Observation","Armament","Conquerors + Armament + Observation"];
  } else if (rank === "Rear Admiral"){
     hakis = ["Armament","Conquerors","Observation","Armament","Observation","Conquerors + Armament","Observation","Observation + Armament","Observation",
      "Conquerors + Observation","Armament","Armament","Observation","Observation","Armament","Observation","Armament","Armament","Observation","Armament",
      "Observation","Armament","Observation","Armament","Conquerors + Armament + Observation"];
  } else if (rank === "Leader"){ // -------------------------------------------------------------------------------------------------- Revolucionary Army
     hakis = ["Armament","Conquerors","Observation","Armament","Observation","Conquerors + Armament","Observation","Observation + Armament","Observation",
      "Conquerors + Observation","Observation","Observation","Armament","Observation","Observation","Armament",
      "Observation","Armament","Observation","Conquerors + Armament + Observation"];
  } else if (rank === "Chief of Staff"){
     hakis = ["Armament","Conquerors","Observation","Armament","Observation","Conquerors + Armament","Observation","Observation + Armament","Observation",
      "Conquerors + Observation","Armament","Armament","Observation","Observation","Armament","Observation","Armament","Armament","Observation","Armament",
      "Observation","Armament","Observation","Armament","Conquerors + Armament + Observation"];
  } else if (rank === "Army Commander"){
     hakis = ["Armament","Conquerors","Observation","Armament","Observation","Conquerors + Armament","Observation","Observation + Armament","Observation",
      "Conquerors + Observation","Armament","Armament","Observation","Observation","Armament","Observation","Armament","Armament","Observation","Armament",
      "Observation","Armament","Observation","Armament","Conquerors + Armament + Observation"];
  } else if (rank === "Shichibukai"){ // -------------------------------------------------------------------------------------------------- Pirate (Shichibukai)
     hakis = ["Armament","Conquerors","Observation","Armament","Observation","Conquerors + Armament","Observation","Observation + Armament","Observation",
      "Conquerors + Observation","Armament","Armament","Observation","Observation","Armament","Observation","Armament","Armament","Observation","Armament",
      "Observation","Armament","Observation","Armament","Conquerors + Armament + Observation"];                
  } else {
     hakis = ["None","Conquerors","Observation","Armament","None","Conquerors + Armament","None","Observation + Armament","None",
      "Conquerors + Observation","None","Armament","None","Observation","None","None","None","None","None","None","None","None",
      "None","None","Conquerors + Armament + Observation"];
  } 

  hakis = meetRankHaki(rank, hakis, "None");   // Requisito mínimo de haki do rank

  haki = rollHakiLevels(hakis[getRandomInt(0, hakis.length)], null, 1, rank);   // Basic / Advanced de cada haki
  renderHaki("haki", haki);
}

	/* 

    Odds:
      Conquerors  - 4/25 - 16%
      Armament    - 5/25 - 20%
      Observation - 5/25 - 20%
      None        - 16/25 - 64%
      Two Haki    - 3/25 - 12%
      Three Haki  - 1/25 - 04%

    Odds (if Dragon Claw):
      Conquerors  - 4/25 - 16%
      Armament    - 25/25 - 100%
      Observation - 5/25 - 20%
      None        - 0/25 - 0%
      Two Haki    - 7/25 - 28%
      Three Haki  - 1/25 - 04%

    Odds (if Fleet Admiral/Admiral/Rear Admiral/Shichibukai/Leader/Chief of Staff/Army Commander):
      Conquerors  - 4/25 - 16%
      Armament    - 13/25 - 52%
      Observation - 13/25 - 52%
      None        - 0/25 - 00%
      Two Haki    - 3/25 - 12%
      Three Haki  - 1/25 - 04%  

    Levels:
      A newly unlocked haki starts at (HAKI_START_ODDS):
        1st Year:       Basic 90% / Advanced 10% / Master 0%
        After 2 Years:  Basic 80% / Advanced 17% / Master 3%
        After 10 Years: Basic 70% / Advanced 23% / Master 7%
      A haki the character already had can go up one level per period (HAKI_UPGRADE_ODDS):
        After 2 Years:  Basic -> Advanced 30%, Advanced -> Master 8%
        After 10 Years: Basic -> Advanced 45%, Advanced -> Master 20%
      High ranks force a minimum level (rankHakiRequirements). Doriki/bounty per level: data/haki-levels.csv

	*/

// Haki 2 -----------------

function assignhaki2(){
  var prevHaki = buildHaki(hakiTypes(haki));   // ex: "Conquerors + Armament"
     
 if (prevHaki === "Conquerors") {
     hakis2 = ["Conquerors + Armament","Conquerors + Observation","Conquerors + Armament + Observation","Conquerors","Conquerors","Conquerors"];
  } else if (prevHaki === "Armament"){
     hakis2 = ["Conquerors + Armament","Observation + Armament","Conquerors + Armament + Observation","Armament","Armament","Armament"];
  } else if (prevHaki === "Observation"){
     hakis2 = ["Conquerors + Observation","Observation + Armament","Conquerors + Armament + Observation","Observation","Observation","Observation"];
  } else if (prevHaki === "Conquerors + Observation"){
     hakis2 = ["Conquerors + Armament + Observation","Conquerors + Observation","Conquerors + Observation"];               
  } else if (prevHaki === "Conquerors + Armament"){
     hakis2 = ["Conquerors + Armament + Observation","Conquerors + Armament","Conquerors + Armament"];
  } else if (prevHaki === "Observation + Armament"){
     hakis2 = ["Conquerors + Armament + Observation","Observation + Armament","Observation + Armament"];                                                          
  } else if (prevHaki === "Conquerors + Armament + Observation"){
     hakis2 = ["Conquerors + Armament + Observation"];                                                          
  } else if (prevHaki === "None"){
     hakis2 = ["None","Conquerors","Observation","Armament","None","Conquerors + Armament","None","Observation + Armament","None",
      "Conquerors + Observation","None","Armament","None","Observation","None","None","None","None","None","None","None","None",
      "None","None","Conquerors + Armament + Observation"];
  } 

  hakis2 = meetRankHaki(rank2, hakis2, prevHaki);   // Requisito mínimo de haki do rank

  haki2 = rollHakiLevels(hakis2[getRandomInt(0, hakis2.length)], haki, 2, rank2);
  renderHaki("haki2", haki2);
}

// Haki 3 -----------------

function assignhaki3(){
  var prevHaki = buildHaki(hakiTypes(haki2));
     
 if (prevHaki === "Conquerors") {
     hakis3 = ["Conquerors + Armament","Conquerors + Observation","Conquerors + Armament + Observation","Conquerors","Conquerors","Conquerors"];
  } else if (prevHaki === "Armament"){
     hakis3 = ["Conquerors + Armament","Observation + Armament","Conquerors + Armament + Observation","Armament","Armament","Armament"];
  } else if (prevHaki === "Observation"){
     hakis3 = ["Conquerors + Observation","Observation + Armament","Conquerors + Armament + Observation","Observation","Observation","Observation"];
  } else if (prevHaki === "Conquerors + Observation"){
     hakis3 = ["Conquerors + Armament + Observation","Conquerors + Observation","Conquerors + Observation"];               
  } else if (prevHaki === "Conquerors + Armament"){
     hakis3 = ["Conquerors + Armament + Observation","Conquerors + Armament","Conquerors + Armament"];
  } else if (prevHaki === "Observation + Armament"){
     hakis3 = ["Conquerors + Armament + Observation","Observation + Armament","Observation + Armament"];                                                          
  } else if (prevHaki === "Conquerors + Armament + Observation"){
     hakis3 = ["Conquerors + Armament + Observation"];                                                          
  } else if (prevHaki === "None"){
     hakis3 = ["None","Conquerors","Observation","Armament","None","Conquerors + Armament","None","Observation + Armament","None",
      "Conquerors + Observation","None","Armament","None","Observation","None","None","None","None","None","None","None","None",
      "None","None","Conquerors + Armament + Observation"];
  } 

  hakis3 = meetRankHaki(rank3, hakis3, prevHaki);   // Requisito mínimo de haki do rank

  haki3 = rollHakiLevels(hakis3[getRandomInt(0, hakis3.length)], haki2, 3, rank3);
  renderHaki("haki3", haki3);
}



// Devil Fruit ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// Tipos, probabilidades (weight), Doriki/Bounty e frutas estão em data/devil-fruit-types.csv e data/devil-fruits.csv

function capFirst(alli) {
    return alli.charAt(0).toUpperCase() + alli.slice(1);
}

function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
}

// Se já tinha fruta no período anterior mantém o tipo, senão sorteia pelo "weight"
function rollFruitType(prevType) {
  if (prevType && prevType !== "No") return prevType;
  var types = Object.keys(fruitTypes);
  var total = types.reduce(function (sum, t) { return sum + fruitTypes[t].weight; }, 0);
  var roll = Math.random() * total;   // aceita pesos decimais (ex.: Unknown = 0.02)
  for (var i = 0; i < types.length; i++) {
    roll -= fruitTypes[types[i]].weight;
    if (roll < 0) return types[i];
  }
  return "No";
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

function generatedevilfruit() {
  devilfruit = capFirst(rollFruitType(""));
  document.getElementById("devilfruit").innerHTML = devilfruit;
}

function generatedevilfruit2() {
  devilfruit2 = capFirst(rollFruitType(devilfruit));
  document.getElementById("devilfruit2").innerHTML = devilfruit2;
}

function generatedevilfruit3() {
  devilfruit3 = capFirst(rollFruitType(devilfruit2));
  document.getElementById("devilfruit3").innerHTML = devilfruit3;
}

function assigndevilfruit() {
  df = capFirst(rollFruit(devilfruit, "", ""));
  document.getElementById("df").innerHTML = df;
  updateFruitInfo(1);
}

function assigndevilfruit2() {
  df2 = capFirst(rollFruit(devilfruit2, devilfruit, df));
  document.getElementById("df2").innerHTML = df2;
  updateFruitInfo(2);
}

function assigndevilfruit3() {
  df3 = capFirst(rollFruit(devilfruit3, devilfruit2, df2));
  document.getElementById("df3").innerHTML = df3;
  updateFruitInfo(3);
}

// Feat ---------------------------------------------------------------------------------------------------------------------------------------------------------------

// Os feats de cada alliance, a probabilidade (weight), o Doriki/Bounty que dão e o haki que exigem estão em data/feats.csv

// Número de feats por período: 1 (60%), 2 (30%) ou 3 (10%). As linhas "None" de data/feats.csv já não são sorteadas
var FEAT_COUNT_ODDS = { 1: 0.6, 2: 0.3, 3: 0.1 };

function rollFeatCount() {
  var roll = Math.random();
  for (var n = 3; n > 1; n--) {
    if (roll < FEAT_COUNT_ODDS[n]) return n;
    roll -= FEAT_COUNT_ODDS[n];
  }
  return 1;
}

// Sorteia um feat da alliance pelo "weight", excluindo os que exigem haki que a personagem não tem
function pickFeat(allianceName, levels, exclude) {
  var pool = (featsByAlliance[allianceName] || []).filter(function (f) {
    return f.weight > 0 && meetsHaki(levels, f.haki) && f.name.toLowerCase() !== "none" && (exclude || []).indexOf(capFirst(f.name)) === -1;
  });
  var total = pool.reduce(function (sum, f) { return sum + f.weight; }, 0);
  var roll = Math.random() * total;
  for (var i = 0; i < pool.length; i++) {
    roll -= pool[i].weight;
    if (roll < 0) return capFirst(pool[i].name);
  }
  return "None";
}

// Sorteia 1 a 3 feats diferentes (lista vazia se a alliance não tiver feats possíveis)
function pickFeats(allianceName, levels) {
  var feats = [];
  for (var i = rollFeatCount(); i > 0; i--) {
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

function assignfeat(){
  feat = pickFeats(alliance, haki);
  showFeats("feat", feat);
}

// Feat 2 -----

function assignfeat2(){
  feat2 = pickFeats(alliance2, haki2);
  showFeats("feat2", feat2);
}

// Feat 3 -----

function assignfeat3(){
  feat3 = pickFeats(alliance3, haki3);
  showFeats("feat3", feat3);
}


// Doriki ---------------------------------------------------------------------------------------------------------------------------------------------------------------

let racedoriki = "";
let rankdoriki = "";
let hakidoriki = "";
let devilfruitdoriki = "";
let featdoriki = "";
let dorikifinal = "";
let adddoriki = "";

function doriki() {

  if (race === "Human") {   // --- Race
     var racedoriki = getRandomInt(1, 10 + 1);
  } else if(race === "Giant") {
     var racedoriki = getRandomInt(10, 100 + 1);
  } else if(race === "Ancient Giant") {
     var racedoriki = getRandomInt(100, 500 + 1);
  } else if(race === "Frost Giant") {
     var racedoriki = getRandomInt(10, 50 + 1);
  } else if(race === "Fishman") {
     var racedoriki = getRandomInt(10, 50 + 1);
  } else if(race === "Merfolk") {
     var racedoriki = getRandomInt(10, 100 + 1);
  } else if(race === "Skipean") {
     var racedoriki = getRandomInt(1, 50 + 1);
  } else if(race === "Lunarian") {
     var racedoriki = getRandomInt(1, 50 + 1);
  } else if(race === "Mink") {
     var racedoriki = getRandomInt(100, 300 + 1);
  } else if(race === "Tonnata") {
     var racedoriki = getRandomInt(5, 30 + 1);
  } else if(race === "Oni") {
     var racedoriki = getRandomInt(50, 500 + 1);
  } else if(race === "Cyborg") {
     var racedoriki = getRandomInt(10, 300 + 1);
  } else if(race === "Hybrid") {
     var racedoriki = getRandomInt(10, 100 + 1);
  } else {                                           
     var rankdoriki = getRandomInt(0, 0 + 1);
  }

  if (rank === "Leader") {                            // --- Rank Revolucionary Army
     var rankdoriki = getRandomInt(20000, 50000 + 1);
  } else if(rank === "Chief of Staff") {
     var rankdoriki = getRandomInt(10000, 15000 + 1);
  } else if(rank === "Army Commander") {
     var rankdoriki = getRandomInt(2500, 10000 + 1);
  } else if(rank === "Officer") {
     var rankdoriki = getRandomInt(400, 2000 + 1);
  } else if(rank === "Member") {
     var rankdoriki = getRandomInt(10, 100 + 1);
  } else if(rank === "Associate") {
     var rankdoriki = getRandomInt(10, 3500 + 1);
  } else if(rank === "Pirate Captain") {             // --- Rank Pirate
     var rankdoriki = getRandomInt(500, 15000 + 1);
  } else if(rank === "First Mate") {
     var rankdoriki = getRandomInt(200, 10000 + 1);
  } else if(rank === "Apprentice") {
     var rankdoriki = getRandomInt(10, 1000 + 1);
  } else if(rank === "Fleet Admiral") {               // --- Rank Marine
     var rankdoriki = getRandomInt(30000, 60000 + 1);
  } else if(rank === "Admiral") {
     var rankdoriki = getRandomInt(15000, 30000 + 1);
  } else if(rank === "Vice Admiral") {
     var rankdoriki = getRandomInt(8000, 15000 + 1);
  } else if(rank === "Rear Admiral") {
     var rankdoriki = getRandomInt(3000, 8000 + 1);
  } else if(rank === "Commodore") {
     var rankdoriki = getRandomInt(1000, 3000 + 1);
  } else if(rank === "Captain") {
     var rankdoriki = getRandomInt(400, 1000 + 1);
  } else if(rank === "Commander") {
     var rankdoriki = getRandomInt(200, 400 + 1);
  } else if(rank === "Lieutenant") {
     var rankdoriki = getRandomInt(100, 200 + 1);
  } else if(rank === "Commodore") {
     var rankdoriki = getRandomInt(50, 100 + 1);
  } else if(rank === "Ensign") {
     var rankdoriki = getRandomInt(30, 50 + 1);
  } else if(rank === "Petty Officer") {
     var rankdoriki = getRandomInt(10, 30 + 1);
  } else if(rank === "Seaman") {
     var rankdoriki = getRandomInt(5, 10 + 1);
  } else if(rank === "Choreboy") {
     var rankdoriki = getRandomInt(1, 5 + 1);
  } else if(rank === "Inspector General") {
     var rankdoriki = getRandomInt(3000, 15000 + 1);
  } else if(rank === "Instructor") {
     var rankdoriki = getRandomInt(1500, 10000 + 1);
  } else if(rank === "Shichibukai") {                  // --- Rank Marine (Shichibukai)
     var rankdoriki = getRandomInt(1000, 4000 + 1);
  } else if(rank === "CP0") { // ----------------------------------- Rank Cipher Pol
     var rankdoriki = getRandomInt(20000, 25000 + 1);
  } else if(rank === "CP1") {
     var rankdoriki = getRandomInt(18000, 20000 + 1);
  } else if(rank === "CP2") {
     var rankdoriki = getRandomInt(16000, 18000 + 1);
  } else if(rank === "CP3") {
     var rankdoriki = getRandomInt(14000, 16000 + 1);
  } else if(rank === "CP4") {
     var rankdoriki = getRandomInt(12000, 14000 + 1);
  } else if(rank === "CP5") {
     var rankdoriki = getRandomInt(10000, 12000 + 1);
  } else if(rank === "CP6") {
     var rankdoriki = getRandomInt(8000, 10000 + 1);
  } else if(rank === "CP7") {
     var rankdoriki = getRandomInt(6000, 8000 + 1);
  } else if(rank === "CP8") {
     var rankdoriki = getRandomInt(4000, 6000 + 1);
  } else if(rank === "CP9") {
     var rankdoriki = getRandomInt(500, 4000 + 1);
  } else if(rank === "Guild Leader") {   // ----------------------------------- Rank Bounty Hunter
     var rankdoriki = getRandomInt(100, 1500 + 1);
  } else if(rank === "Guild Member") {
     var rankdoriki = getRandomInt(10, 1000 + 1);
  } else if(rank === "Individual") {
     var rankdoriki = getRandomInt(10, 1500 + 1);
  } else if(rank === "Celestial Dragon") {         // ----------------------------------- Rank World Nobles
     var rankdoriki = getRandomInt(1, 10 + 1);
  } else if(rank === "King/Queen") {         // ----------------------------------- Rank World Nobles
     var rankdoriki = getRandomInt(10, 200 + 1);
  } else if(rank === "Price/Princess") {         // ----------------------------------- Rank World Nobles
     var rankdoriki = getRandomInt(1, 50 + 1);
  } else if(rank === "Noble Commander") {         // ----------------------------------- Rank World Nobles
     var rankdoriki = getRandomInt(10, 500 + 1);
  } else if(rank === "Soldier") {         // ----------------------------------- Rank World Nobles
     var rankdoriki = getRandomInt(10, 20 + 1);
  } else {                                           
     var rankdoriki = getRandomInt(1, 400 + 1);
  }

  var hakidoriki = hakiBonus(haki, "doriki");   // --- Haki (Basic / Advanced, valores em data/haki-levels.csv)

  var devilfruitdoriki = fruitDoriki(devilfruit);            // --- Devilfruit (valores em data/devil-fruit-types.csv)

  var featpartsdoriki = featParts("doriki", feat, alliance);
  var featdoriki = featpartsdoriki.total;   // --- Feat (valores em data/feats.csv)

  dorikifinal = racedoriki + rankdoriki + hakidoriki + devilfruitdoriki + featdoriki
  var dorikibase = dorikifinal
  if (hasWillOfD()) dorikifinal = dorikifinal * (1 + WILL_OF_D_BONUS);   // --- Will of D. (nome com "D.")
  adddoriki = dorikifinal
  setBreakdown("doriki", 1, [
    ["Race", race, racedoriki], ["Rank", rank, rankdoriki], ["Haki", hakiText(haki, ", "), hakidoriki],
    ["Devil fruit", devilfruit, devilfruitdoriki], ["Feats", featpartsdoriki.detail, featdoriki]
  ].concat(hasWillOfD() ? [["Will of D.", "+10% of " + dorikibase, dorikifinal - dorikibase]] : []), parseInt(dorikifinal), parseInt(adddoriki));
  document.getElementById("dorikifinal").innerHTML = parseInt(dorikifinal);
  document.getElementById("adddoriki").innerHTML = '(+' + parseInt(adddoriki) + ')';
}  

// Doriki 2 --------------------------------

// (After 2 Years)

let rankdoriki2 = "";
let hakidoriki2 = "";
let featdoriki2 = "";
let dorikifinal2 = "";
let adddoriki2 = "";

function doriki2() {

  if (rank2 === "Yonko") {                             // --- Rank Pirate (Yonko)
     var rankdoriki2 = getRandomInt(60000, 100000 + 1);
  } else if (rank2 === "Leader") {                            // --- Rank Revolucionary Army
     var rankdoriki2 = getRandomInt(20000, 50000 + 1);
  } else if(rank2 === "Chief of Staff") {
     var rankdoriki2 = getRandomInt(10000, 15000 + 1);
  } else if(rank2 === "Army Commander") {
     var rankdoriki2 = getRandomInt(2500, 10000 + 1);
  } else if(rank2 === "Officer") {
     var rankdoriki2 = getRandomInt(400, 2000 + 1);
  } else if(rank2 === "Member") {
     var rankdoriki2 = getRandomInt(10, 100 + 1);
  } else if(rank2 === "Associate") {
     var rankdoriki2 = getRandomInt(10, 3500 + 1);
  } else if(rank2 === "Pirate Captain") {             // --- Rank Pirate
     var rankdoriki2 = getRandomInt(500, 15000 + 1);
  } else if(rank2 === "First Mate") {
     var rankdoriki2 = getRandomInt(200, 10000 + 1);
  } else if(rank2 === "Apprentice") {
     var rankdoriki2 = getRandomInt(10, 1000 + 1);
  } else if(rank2 === "Fleet Admiral") {               // --- Rank Marine
     var rankdoriki2 = getRandomInt(30000, 60000 + 1);
  } else if(rank2 === "Admiral") {
     var rankdoriki2 = getRandomInt(15000, 30000 + 1);
  } else if(rank2 === "Vice Admiral") {
     var rankdoriki2 = getRandomInt(8000, 15000 + 1);
  } else if(rank2 === "Rear Admiral") {
     var rankdoriki2 = getRandomInt(3000, 8000 + 1);
  } else if(rank2 === "Commodore") {
     var rankdoriki2 = getRandomInt(1000, 3000 + 1);
  } else if(rank2 === "Captain") {
     var rankdoriki2 = getRandomInt(400, 1000 + 1);
  } else if(rank2 === "Commander") {
     var rankdoriki2 = getRandomInt(200, 400 + 1);
  } else if(rank2 === "Lieutenant") {
     var rankdoriki2 = getRandomInt(100, 200 + 1);
  } else if(rank2 === "Commodore") {
     var rankdoriki2 = getRandomInt(50, 100 + 1);
  } else if(rank2 === "Ensign") {
     var rankdoriki2 = getRandomInt(30, 50 + 1);
  } else if(rank2 === "Petty Officer") {
     var rankdoriki2 = getRandomInt(10, 30 + 1);
  } else if(rank2 === "Seaman") {
     var rankdoriki2 = getRandomInt(5, 10 + 1);
  } else if(rank2 === "Choreboy") {
     var rankdoriki2 = getRandomInt(1, 5 + 1);
  } else if(rank2 === "Inspector General") {
     var rankdoriki2 = getRandomInt(3000, 15000 + 1);
  } else if(rank2 === "Instructor") {
     var rankdoriki2 = getRandomInt(1500, 10000 + 1);
  } else if(rank2 === "Shichibukai") {                  // --- Rank Marine (Shichibukai)
     var rankdoriki2 = getRandomInt(1000, 4000 + 1);
  } else if(rank2 === "CP0") { // ----------------------------------- Rank Cipher Pol
     var rankdoriki2 = getRandomInt(20000, 25000 + 1);
  } else if(rank2 === "CP1") {
     var rankdoriki2 = getRandomInt(18000, 20000 + 1);
  } else if(rank2 === "CP2") {
     var rankdoriki2 = getRandomInt(16000, 18000 + 1);
  } else if(rank2 === "CP3") {
     var rankdoriki2 = getRandomInt(14000, 16000 + 1);
  } else if(rank2 === "CP4") {
     var rankdoriki2 = getRandomInt(12000, 14000 + 1);
  } else if(rank2 === "CP5") {
     var rankdoriki2 = getRandomInt(10000, 12000 + 1);
  } else if(rank2 === "CP6") {
     var rankdoriki2 = getRandomInt(8000, 10000 + 1);
  } else if(rank2 === "CP7") {
     var rankdoriki2 = getRandomInt(6000, 8000 + 1);
  } else if(rank2 === "CP8") {
     var rankdoriki2 = getRandomInt(4000, 6000 + 1);
  } else if(rank2 === "CP9") {
     var rankdoriki2 = getRandomInt(500, 4000 + 1);
  } else if(rank2 === "Guild Leader") {   // ----------------------------------- Rank Bounty Hunter
     var rankdoriki2 = getRandomInt(100, 1500 + 1);
  } else if(rank2 === "Guild Member") {
     var rankdoriki2 = getRandomInt(10, 1000 + 1);
  } else if(rank2 === "Individual") {
     var rankdoriki2 = getRandomInt(10, 1500 + 1);
  } else if(rank2 === "Celestial Dragon") {         // ----------------------------------- Rank World Nobles
     var rankdoriki2 = getRandomInt(1, 10 + 1);
  } else if(rank2 === "King/Queen") {         // ----------------------------------- Rank World Nobles
     var rankdoriki2 = getRandomInt(10, 200 + 1);
  } else if(rank2 === "Price/Princess") {         // ----------------------------------- Rank World Nobles
     var rankdoriki2 = getRandomInt(1, 50 + 1);
  } else if(rank2 === "Noble Commander") {         // ----------------------------------- Rank World Nobles
     var rankdoriki2 = getRandomInt(10, 500 + 1);
  } else if(rank2 === "Soldier") {         // ----------------------------------- Rank World Nobles
     var rankdoriki2 = getRandomInt(10, 20 + 1);
  } else {                                           
     var rankdoriki2 = getRandomInt(1, 400 + 1);
  }

  var hakidoriki2 = hakiBonus(haki2, "doriki");   // --- Haki (Basic / Advanced, valores em data/haki-levels.csv)

  var featpartsdoriki2 = featParts("doriki", feat2, alliance2);
  var featdoriki2 = featpartsdoriki2.total;   // --- Feat (valores em data/feats.csv)

  dorikifinal2 = dorikifinal + rankdoriki2*0.2 + hakidoriki2 + featdoriki2
  adddoriki2 = parseInt(dorikifinal2) - parseInt(dorikifinal)
  setBreakdown("doriki", 2, [
    ["Doriki from 1st Year", "", dorikifinal], ["Rank", rank2 + " (20% of " + rankdoriki2 + ")", rankdoriki2*0.2],
    ["Haki", hakiText(haki2, ", "), hakidoriki2], ["Feats", featpartsdoriki2.detail, featdoriki2]
  ], parseInt(dorikifinal2), adddoriki2); // Calcula a diferença entre os dorikis no anos 1 e 2
  document.getElementById("dorikifinal2").innerHTML = parseInt(dorikifinal2);
  document.getElementById("adddoriki2").innerHTML = '(+' + parseInt(adddoriki2) + ')';
}

// Doriki 3 --------------------------------

// (After 10 Years)

let rankdoriki3 = "";
let hakidoriki3 = "";
let featdoriki3 = "";
let dorikifinal3 = "";
let adddoriki3 = "";

function doriki3() {

  if (rank3 === "Yonko") {                             // --- Rank Pirate (Yonko)
     var rankdoriki3 = getRandomInt(60000, 100000 + 1);
  } else if (rank3 === "Leader") {                            // --- Rank Revolucionary Army
     var rankdoriki3 = getRandomInt(20000, 50000 + 1);
  } else if(rank3 === "Chief of Staff") {
     var rankdoriki3 = getRandomInt(10000, 15000 + 1);
  } else if(rank3 === "Army Commander") {
     var rankdoriki3 = getRandomInt(2500, 10000 + 1);
  } else if(rank3 === "Officer") {
     var rankdoriki3 = getRandomInt(400, 2000 + 1);
  } else if(rank3 === "Member") {
     var rankdoriki3 = getRandomInt(10, 100 + 1);
  } else if(rank3 === "Associate") {
     var rankdoriki3 = getRandomInt(10, 3500 + 1);
  } else if(rank3 === "Pirate Captain") {             // --- Rank Pirate
     var rankdoriki3 = getRandomInt(500, 15000 + 1);
  } else if(rank3 === "First Mate") {
     var rankdoriki3 = getRandomInt(200, 10000 + 1);
  } else if(rank3 === "Apprentice") {
     var rankdoriki3 = getRandomInt(10, 1000 + 1);
  } else if(rank3 === "Fleet Admiral") {               // --- Rank Marine
     var rankdoriki3 = getRandomInt(30000, 60000 + 1);
  } else if(rank3 === "Admiral") {
     var rankdoriki3 = getRandomInt(15000, 30000 + 1);
  } else if(rank3 === "Vice Admiral") {
     var rankdoriki3 = getRandomInt(8000, 15000 + 1);
  } else if(rank3 === "Rear Admiral") {
     var rankdoriki3 = getRandomInt(3000, 8000 + 1);
  } else if(rank3 === "Commodore") {
     var rankdoriki3 = getRandomInt(1000, 3000 + 1);
  } else if(rank3 === "Captain") {
     var rankdoriki3 = getRandomInt(400, 1000 + 1);
  } else if(rank3 === "Commander") {
     var rankdoriki3 = getRandomInt(200, 400 + 1);
  } else if(rank3 === "Lieutenant") {
     var rankdoriki3 = getRandomInt(100, 200 + 1);
  } else if(rank3 === "Commodore") {
     var rankdoriki3 = getRandomInt(50, 100 + 1);
  } else if(rank3 === "Ensign") {
     var rankdoriki3 = getRandomInt(30, 50 + 1);
  } else if(rank3 === "Petty Officer") {
     var rankdoriki3 = getRandomInt(10, 30 + 1);
  } else if(rank3 === "Seaman") {
     var rankdoriki3 = getRandomInt(5, 10 + 1);
  } else if(rank3 === "Choreboy") {
     var rankdoriki3 = getRandomInt(1, 5 + 1);
  } else if(rank3 === "Inspector General") {
     var rankdoriki3 = getRandomInt(3000, 15000 + 1);
  } else if(rank3 === "Instructor") {
     var rankdoriki3 = getRandomInt(1500, 10000 + 1);
  } else if(rank3 === "Shichibukai") {                  // --- Rank Marine (Shichibukai)
     var rankdoriki3 = getRandomInt(1000, 4000 + 1);
  } else if(rank3 === "CP0") { // ----------------------------------- Rank Cipher Pol
     var rankdoriki3 = getRandomInt(20000, 25000 + 1);
  } else if(rank3 === "CP1") {
     var rankdoriki3 = getRandomInt(18000, 20000 + 1);
  } else if(rank3 === "CP2") {
     var rankdoriki3 = getRandomInt(16000, 18000 + 1);
  } else if(rank3 === "CP3") {
     var rankdoriki3 = getRandomInt(14000, 16000 + 1);
  } else if(rank3 === "CP4") {
     var rankdoriki3 = getRandomInt(12000, 14000 + 1);
  } else if(rank3 === "CP5") {
     var rankdoriki3 = getRandomInt(10000, 12000 + 1);
  } else if(rank3 === "CP6") {
     var rankdoriki3 = getRandomInt(8000, 10000 + 1);
  } else if(rank3 === "CP7") {
     var rankdoriki3 = getRandomInt(6000, 8000 + 1);
  } else if(rank3 === "CP8") {
     var rankdoriki3 = getRandomInt(4000, 6000 + 1);
  } else if(rank3 === "CP9") {
     var rankdoriki3 = getRandomInt(500, 4000 + 1);
  } else if(rank3 === "Guild Leader") {   // ----------------------------------- Rank Bounty Hunter
     var rankdoriki3 = getRandomInt(100, 1500 + 1);
  } else if(rank3 === "Guild Member") {
     var rankdoriki3 = getRandomInt(10, 1000 + 1);
  } else if(rank3 === "Individual") {
     var rankdoriki3 = getRandomInt(10, 1500 + 1);
  } else if(rank3 === "Celestial Dragon") {         // ----------------------------------- Rank World Nobles
     var rankdoriki3 = getRandomInt(1, 10 + 1);
  } else if(rank3 === "King/Queen") {         // ----------------------------------- Rank World Nobles
     var rankdoriki3 = getRandomInt(10, 200 + 1);
  } else if(rank3 === "Price/Princess") {         // ----------------------------------- Rank World Nobles
     var rankdoriki3 = getRandomInt(1, 50 + 1);
  } else if(rank3 === "Noble Commander") {         // ----------------------------------- Rank World Nobles
     var rankdoriki3 = getRandomInt(10, 500 + 1);
  } else if(rank3 === "Soldier") {         // ----------------------------------- Rank World Nobles
     var rankdoriki3 = getRandomInt(10, 20 + 1);
  } else {                                           
     var rankdoriki3 = getRandomInt(1, 400 + 1);
  }

  var hakidoriki3 = hakiBonus(haki3, "doriki");   // --- Haki (Basic / Advanced, valores em data/haki-levels.csv)

  var featpartsdoriki3 = featParts("doriki", feat3, alliance3);
  var featdoriki3 = featpartsdoriki3.total;   // --- Feat (valores em data/feats.csv)

  dorikifinal3 = dorikifinal2 + rankdoriki3*0.2 + hakidoriki3 + featdoriki3
  adddoriki3 = parseInt(dorikifinal3) - parseInt(dorikifinal2)
  setBreakdown("doriki", 3, [
    ["Doriki from After 2 Years", "", dorikifinal2], ["Rank", rank3 + " (20% of " + rankdoriki3 + ")", rankdoriki3*0.2],
    ["Haki", hakiText(haki3, ", "), hakidoriki3], ["Feats", featpartsdoriki3.detail, featdoriki3]
  ], parseInt(dorikifinal3), adddoriki3); // Calcula a diferença entre os dorikis no anos 2 e 3
  document.getElementById("dorikifinal3").innerHTML = parseInt(dorikifinal3);
  document.getElementById("adddoriki3").innerHTML = '(+' + parseInt(adddoriki3) + ')';
}


// Mostra a variação da bounty com o sinal correto, ex: (+5,000,000) ou (-3,000,000)
function formatBountyChange(value) {
  var sign = value < 0 ? '-' : '+';
  return '(' + sign + formatBounty(Math.abs(value)) + ')';
}

// Bounty New System ----------------------------------------------------------------------------------------------------------------------------------------------------

let dorikibounty = "";
let alliancebounty = "";
let devilfruitbounty = "";
let featbounty = "";
let bountyfinal = "";

function addbounty() {

  if (alliance === "Revolucionary Army") {            // --- Alliance
     var alliancebounty = getRandomInt(1, 10 + 1);
  } else if(alliance === "Pirate") {
     var alliancebounty = getRandomInt(1, 5 + 1);
  } else {
     var alliancebounty = getRandomInt(0, 0 + 1);
  }

  var devilfruitbounty = fruitBounty(devilfruit);            // --- Devilfruit (valores em data/devil-fruit-types.csv)

  var featpartsbounty = featParts("bounty", feat, alliance, "bounty");
  var featbounty = featpartsbounty.total;   // --- Feat (valores em data/feats.csv)

  var hakibounty = hakiBonus(haki, "bounty");   // --- Haki (valores em data/haki-levels.csv)

  dorikibounty = dorikifinal * 0.075

  if (alliance === "Marine") {                      // --- Block Alliances
     var dorikibounty = getRandomInt(0, 0 + 1);
     var alliancebounty = getRandomInt(0, 0 + 1);
     var devilfruitbounty = getRandomInt(0, 0 + 1);
     var featbounty = getRandomInt(0, 0 + 1);
     var hakibounty = 0;
  } else if(alliance === "Cipher Pol") {
     var dorikibounty = getRandomInt(0, 0 + 1);
     var alliancebounty = getRandomInt(0, 0 + 1);
     var devilfruitbounty = getRandomInt(0, 0 + 1);
     var featbounty = getRandomInt(0, 0 + 1);
     var hakibounty = 0;
  }


  bountyfinal = dorikibounty + alliancebounty + devilfruitbounty + featbounty + hakibounty
  var pet1 = isPet(rank, alliance)
  if (pet1) bountyfinal = petBounty(bountyfinal);   // --- Pet dos piratas (bounty nos milhares)
  var bountyadded = roundBounty(bountyfinal);
  setBreakdown("bounty", 1, [
    ["Doriki", "7.5% of " + parseInt(dorikifinal), dorikibounty], ["Alliance", alliance, alliancebounty],
    ["Devil fruit", devilfruit, devilfruitbounty], ["Feats", featbounty ? featpartsbounty.detail : featpartsbounty.names, featbounty], ["Haki", hakiText(haki, ", "), hakibounty]
  ], roundBounty(bountyfinal), bountyadded,
    alliance === "Marine" || alliance === "Cipher Pol" ? alliance + " members have no bounty." : "");
  if (pet1) petBreakdown(1);
  document.getElementById("bountyfinal").innerHTML = formatBounty(roundBounty(bountyfinal));
  document.getElementById("addbounty").innerHTML = formatBountyChange(bountyadded);
}

// Bounty New System 2 -----------------------------------------------------------------------

let dorikibounty2 = "";
let alliancebounty2 = "";
let devilfruitbounty2 = "";
let featbounty2 = "";
let bountyfinal2 = "";

function addbounty2() {

  if (alliance2 === "Revolucionary Army") {            // --- Alliance
     var alliancebounty2 = getRandomInt(1, 10 + 1);
  } else if(alliance2 === "Pirate") {
     var alliancebounty2 = getRandomInt(1, 5 + 1);
  } else {
     var alliancebounty2 = getRandomInt(0, 0 + 1);
  }

  var devilfruitbounty2 = fruitBounty(devilfruit2);            // --- Devilfruit (valores em data/devil-fruit-types.csv)

  var featpartsbounty2 = featParts("bounty", feat2, alliance2, "bounty");
  var featbounty2 = featpartsbounty2.total;   // --- Feat (valores em data/feats.csv)

  var hakibounty2 = hakiBonus(haki2, "bounty");   // --- Haki (valores em data/haki-levels.csv)

  dorikibounty2 = dorikifinal2 * 0.075
  bountyfinal2 = dorikibounty2 + alliancebounty2 + devilfruitbounty2 + featbounty2 + hakibounty2
  var yonkobounty2 = 0
  var yonkokept2 = false
  if (rank2 === "Yonko") {   // --- Yonko (bounty na casa dos bilhões)
     yonkobounty2 = getRandomInt(2000, 4000 + 1);
     bountyfinal2 += yonkobounty2;
  }

  if (alliance2 === "Marine" || alliance2 === "Cipher Pol") {   // --- Block Alliances (mantém a bounty anterior)
     bountyfinal2 = bountyfinal;
  }
  
  var pet2 = isPet(rank2, alliance2)
  if (pet2) bountyfinal2 = petBounty(bountyfinal2);   // --- Pet dos piratas (bounty nos milhares)
  var bountyadded2 = roundBounty(bountyfinal2) - roundBounty(bountyfinal)
  var blocked2 = alliance2 === "Marine" || alliance2 === "Cipher Pol"
  setBreakdown("bounty", 2, blocked2 || yonkokept2 ? [["Bounty from 1st Year", "", bountyfinal]] : [
    ["Doriki", "7.5% of " + parseInt(dorikifinal2), dorikibounty2], ["Alliance", alliance2, alliancebounty2],
    ["Devil fruit", devilfruit2, devilfruitbounty2], ["Feats", featbounty2 ? featpartsbounty2.detail : featpartsbounty2.names, featbounty2], ["Haki", hakiText(haki2, ", "), hakibounty2]
  ].concat(yonkobounty2 ? [["Yonko", "", yonkobounty2]] : []), roundBounty(bountyfinal2), bountyadded2,
    blocked2 ? alliance2 + " members keep the bounty they already had." : "The bounty is recalculated each period from the current Doriki, alliance, fruit, feat and haki."); // Calcula a diferença entre as bounties no anos 1 e 2
  if (pet2) petBreakdown(2);
  document.getElementById("bountyfinal2").innerHTML = formatBounty(roundBounty(bountyfinal2));
  document.getElementById("addbounty2").innerHTML = formatBountyChange(bountyadded2);
}

// Bounty New System 3 -----------------------------------------------------------------------

let dorikibounty3 = "";
let alliancebounty3 = "";
let devilfruitbounty3 = "";
let featbounty3 = "";
let bountyfinal3 = "";

function addbounty3() {

  if (alliance3 === "Revolucionary Army") {            // --- Alliance
     var alliancebounty3 = getRandomInt(1, 10 + 1);
  } else if(alliance3 === "Pirate") {
     var alliancebounty3 = getRandomInt(1, 5 + 1);
  } else {
     var alliancebounty3 = getRandomInt(0, 0 + 1);
  }

  var devilfruitbounty3 = fruitBounty(devilfruit3);            // --- Devilfruit (valores em data/devil-fruit-types.csv)

  var featpartsbounty3 = featParts("bounty", feat3, alliance3, "bounty");
  var featbounty3 = featpartsbounty3.total;   // --- Feat (valores em data/feats.csv)

  var hakibounty3 = hakiBonus(haki3, "bounty");   // --- Haki (valores em data/haki-levels.csv)

  dorikibounty3 = dorikifinal3 * 0.075
  bountyfinal3 = dorikibounty3 + alliancebounty3 + devilfruitbounty3 + featbounty3 + hakibounty3
  var yonkobounty3 = 0
  var yonkokept3 = false
  if (rank3 === "Yonko") {   // --- Yonko (bounty na casa dos bilhões)
     yonkobounty3 = getRandomInt(2000, 4000 + 1);
     yonkokept3 = bountyfinal3 + yonkobounty3 < bountyfinal2;
     bountyfinal3 = Math.max(bountyfinal3 + yonkobounty3, bountyfinal2);
  }

  if (alliance3 === "Marine" || alliance3 === "Cipher Pol") {   // --- Block Alliances (mantém a bounty anterior)
     bountyfinal3 = bountyfinal2;
  }
  
  var pet3 = isPet(rank3, alliance3)
  if (pet3) bountyfinal3 = petBounty(bountyfinal3);   // --- Pet dos piratas (bounty nos milhares)
  var bountyadded3 = roundBounty(bountyfinal3) - roundBounty(bountyfinal2)
  var blocked3 = alliance3 === "Marine" || alliance3 === "Cipher Pol"
  setBreakdown("bounty", 3, blocked3 || yonkokept3 ? [["Bounty from After 2 Years", "", bountyfinal2]] : [
    ["Doriki", "7.5% of " + parseInt(dorikifinal3), dorikibounty3], ["Alliance", alliance3, alliancebounty3],
    ["Devil fruit", devilfruit3, devilfruitbounty3], ["Feats", featbounty3 ? featpartsbounty3.detail : featpartsbounty3.names, featbounty3], ["Haki", hakiText(haki3, ", "), hakibounty3]
  ].concat(yonkobounty3 ? [["Yonko", "", yonkobounty3]] : []), roundBounty(bountyfinal3), bountyadded3,
    blocked3 ? alliance3 + " members keep the bounty they already had." : yonkokept3 ? "The new bounty would be lower, so the Yonko keeps the bounty from After 2 Years." : "The bounty is recalculated each period from the current Doriki, alliance, fruit, feat and haki."); // Calcula a diferença entre as bounties no anos 2 e 3
  if (pet3) petBreakdown(3);
  document.getElementById("bountyfinal3").innerHTML = formatBounty(roundBounty(bountyfinal3));
  document.getElementById("addbounty3").innerHTML = formatBountyChange(bountyadded3);
}
