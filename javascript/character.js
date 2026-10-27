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
let feat = "";
let feat2 = "";
let feat3 = "";


// Rules ---------------------------------------------------------------------------------------------------------------------------------------------------------------

// Haki minimo exigido para os ranks mais altos
var rankHakiRequirements = {
  "Yonko": ["Conquerors", "Armament", "Observation"],
  "Fleet Admiral": ["Armament", "Observation"],
  "Admiral": ["Armament", "Observation"],
  "Vice Admiral": ["Armament"],
  "Inspector General": ["Armament"],
  "Leader": ["Armament", "Observation"],
  "Chief of Staff": ["Armament", "Observation"],
  "Army Commander": ["Armament"],
  "Shichibukai": ["Armament"],
  "CP0": ["Armament"]
};

// Haki exigido para alguns feats
var featHakiRequirements = {
  "Defeated a Yonko.": ["Conquerors", "Armament", "Observation"],
  "Defeated an Admiral.": ["Armament", "Observation"]
};

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
  var req = rankHakiRequirements[rankName];
  pool = pool || [currentHaki || "None"];
  if (!req) return pool;
  var ok = pool.filter(function (h) { return hasHaki(h, req); });
  if (ok.length) return ok;
  var types = ["Conquerors", "Armament", "Observation"].filter(function (t) {
    return req.indexOf(t) !== -1 || String(currentHaki).indexOf(t) !== -1;
  });
  return [buildHaki(types)];
}

function allowedFeats(pool, hakiName) {
  return pool.filter(function (f) { return !featHakiRequirements[f] || hasHaki(hakiName, featHakiRequirements[f]); });
}

// Probabilidade de um pirata se tornar Yonko (só a partir de "After 2 Years")
var YONKO_CHANCE = 0.002;

function maybeYonko(allianceName, pool) {
  if (allianceName === "Pirate" && Math.random() < YONKO_CHANCE) return ["Yonko"];
  return pool;
}

var swordStyles = ["Swordsmanship", "Samurai"];

// Doriki e bounty dos feats novos (os antigos continuam nos if/else de cada função)
var extraFeatDoriki = {
  "Defeated an Admiral.": [10000, 20000],
  "Defeated a Yonko Commander.": [3000, 8000],
  "Took part in the Paramount War.": [500, 2000],
  "Entered the New World.": [200, 800],
  "Survived a Buster Call.": [300, 1000],
  "Defeated a Supernova.": [800, 2500],
  "Arrested a Supernova.": [800, 2500],
  "Captured a Supernova.": [800, 2500],
  "Guarded Impel Down's Level 6.": [500, 1500],
  "Joined the SWORD unit.": [1000, 3000],
  "Infiltrated a Yonko crew.": [500, 1500],
  "Fought in the Wano revolution.": [500, 2000],
  "Won a Davy Back Fight.": [50, 300]
};

var extraFeatBounty = {
  "Defeated a Yonko.": [500, 1500],
  "Defeated an Admiral.": [300, 800],
  "Defeated a Yonko Commander.": [100, 400],
  "Punched a Celestial Dragon.": [50, 150],
  "Declared war on the World Government.": [100, 300],
  "Burned the World Government's flag.": [50, 150],
  "Found a Road Poneglyph.": [100, 300],
  "Took part in the Paramount War.": [50, 200],
  "Took part in the Reverie raid.": [50, 200],
  "Infiltrated Mary Geoise.": [50, 200],
  "Freed a kingdom from a tyrant.": [20, 80],
  "Freed the slaves at the Sabaody auction house.": [20, 100],
  "Fought in the Wano revolution.": [50, 200]
};

function featBonus(table, featName) {
  var range = table[featName];
  return range ? getRandomInt(range[0], range[1] + 1) : 0;
}

function isSwordRank(rankName) {
  return rankName === "Swordsman";
}

// Formata bounties em milhões com vírgulas, ex: 1500 -> 1,500,000,000
function formatBounty(millions) {
  return Math.round(millions).toLocaleString("en-US") + ',000,000';
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
  var genders = ["male","female","other","transsexual"
      ,"male","female","other","transsexual"
      ,"male","female","other"];

  document.getElementById("gender").value = genders[getRandomInt(0, genders.length)];
}

    /*

    Odds:
      Male          - 3/11 - 27%
      Female        - 3/11 - 27%
      Other         - 3/11 - 27%
      Transsexual   - 2/11 - 18%

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

  alliance2 = capFirst(alliances2[getRandomInt(0, alliances2.length)]);
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

  alliance3 = capFirst(alliances3[getRandomInt(0, alliances3.length)]);
  document.getElementById("alliance3").innerHTML = alliance3;
}


// Rank ---------------------------------------------------------------------------------------------------------------------------------------------------------------

function assignRank(){
     
 if (alliance === "Revolucionary Army") {
     ranks = ["Leader","Chief of Staff","Army Commander","Officer","Member","Associate"];
  } else if(alliance === "Marine") {
     ranks = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Commodore","Captain","Commander",
     "Lieutenant","Ensign","Petty Officer","Seaman","Choreboy","Inspector General","Instructor","Shichibukai"];
  } else if(alliance === "Pirate") {
     ranks = ["Pirate Captain","First Mate","Swordsman","Sniper","Martial Artist","Navigator","Cook","Doctor","Shipwright","Musician","Aprentice","Pet"];
  } else if(alliance === "Bounty Hunter") {
     ranks = ["Individual","Guild Leader","Guild Member"];
  } else if(alliance === "Cipher Pol") {
     ranks = ["CP0","CP1","CP2","CP3","CP4","CP5","CP6","CP7","CP8","CP9"];
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
     ranks2 = ["Pirate Captain"];
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
     ranks3 = ["Pirate Captain"];
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

  haki = capFirst(hakis[getRandomInt(0, hakis.length)]);
      document.getElementById("haki").innerHTML = haki;
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

	*/

// Haki 2 -----------------

function assignhaki2(){
     
 if (haki === "Conquerors") {
     hakis2 = ["Conquerors + Armament","Conquerors + Observation","Conquerors + Armament + Observation","Conquerors","Conquerors","Conquerors"];
  } else if (haki === "Armament"){
     hakis2 = ["Conquerors + Armament","Observation + Armament","Conquerors + Armament + Observation","Armament","Armament","Armament"];
  } else if (haki === "Observation"){
     hakis2 = ["Conquerors + Observation","Observation + Armament","Conquerors + Armament + Observation","Observation","Observation","Observation"];
  } else if (haki === "Conquerors + Observation"){
     hakis2 = ["Conquerors + Armament + Observation","Conquerors + Observation","Conquerors + Observation"];               
  } else if (haki === "Conquerors + Armament"){
     hakis2 = ["Conquerors + Armament + Observation","Conquerors + Armament","Conquerors + Armament"];
  } else if (haki === "Observation + Armament"){
     hakis2 = ["Conquerors + Armament + Observation","Observation + Armament","Observation + Armament"];                                                          
  } else if (haki === "Conquerors + Armament + Observation"){
     hakis2 = ["Conquerors + Armament + Observation"];                                                          
  } else if (haki === "None"){
     hakis2 = ["None","Conquerors","Observation","Armament","None","Conquerors + Armament","None","Observation + Armament","None",
      "Conquerors + Observation","None","Armament","None","Observation","None","None","None","None","None","None","None","None",
      "None","None","Conquerors + Armament + Observation"];
  } 

  hakis2 = meetRankHaki(rank2, hakis2, haki);   // Requisito mínimo de haki do rank

  haki2 = capFirst(hakis2[getRandomInt(0, hakis2.length)]);
      document.getElementById("haki2").innerHTML = haki2;
}

// Haki 3 -----------------

function assignhaki3(){
     
 if (haki2 === "Conquerors") {
     hakis3 = ["Conquerors + Armament","Conquerors + Observation","Conquerors + Armament + Observation","Conquerors","Conquerors","Conquerors"];
  } else if (haki2 === "Armament"){
     hakis3 = ["Conquerors + Armament","Observation + Armament","Conquerors + Armament + Observation","Armament","Armament","Armament"];
  } else if (haki2 === "Observation"){
     hakis3 = ["Conquerors + Observation","Observation + Armament","Conquerors + Armament + Observation","Observation","Observation","Observation"];
  } else if (haki2 === "Conquerors + Observation"){
     hakis3 = ["Conquerors + Armament + Observation","Conquerors + Observation","Conquerors + Observation"];               
  } else if (haki2 === "Conquerors + Armament"){
     hakis3 = ["Conquerors + Armament + Observation","Conquerors + Armament","Conquerors + Armament"];
  } else if (haki2 === "Observation + Armament"){
     hakis3 = ["Conquerors + Armament + Observation","Observation + Armament","Observation + Armament"];                                                          
  } else if (haki2 === "Conquerors + Armament + Observation"){
     hakis3 = ["Conquerors + Armament + Observation"];                                                          
  } else if (haki2 === "None"){
     hakis3 = ["None","Conquerors","Observation","Armament","None","Conquerors + Armament","None","Observation + Armament","None",
      "Conquerors + Observation","None","Armament","None","Observation","None","None","None","None","None","None","None","None",
      "None","None","Conquerors + Armament + Observation"];
  } 

  hakis3 = meetRankHaki(rank3, hakis3, haki2);   // Requisito mínimo de haki do rank

  haki3 = capFirst(hakis3[getRandomInt(0, hakis3.length)]);
      document.getElementById("haki3").innerHTML = haki3;
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
  var roll = getRandomInt(0, total);
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

var featsByAlliance = {
  "Revolucionary Army": ["None"
     ,"Attacked a Government country."
     ,"Leaked sensitive Government information."
     ,"Stole a rare devil fruit from the Government."
     ,"Participated in a war."
     ,"Released slaves from a Government ally."
     ,"Took part in the Reverie raid."
     ,"Infiltrated Mary Geoise."
     ,"Freed a kingdom from a tyrant."
     ,"Rescued a comrade from Impel Down."
     ,"Survived a Buster Call."
     ,"Declared war on the World Government."
     ,"Defeated an Admiral."],
  "Marine": ["None"
     ,"Captured a 40,000,000 bounty pirate all by himself."
     ,"Defeated a small group of pirates."
     ,"Helped save a country."
     ,"Captured a 20,000,000 bounty pirate all by himself."
     ,"Took part in the Paramount War."
     ,"Arrested a Supernova."
     ,"Guarded Impel Down's Level 6."
     ,"Joined the SWORD unit."
     ,"Escorted a Celestial Dragon to the Reverie."
     ,"Participated in a Buster Call."
     ,"Defeated a Yonko Commander."],
  "Pirate": ["None"
     ,"Stole a town's supplies."
     ,"Defeated a small group of pirates."
     ,"Defeated a Marine's Captain."
     ,"Defeated a Shichibukai."
     ,"Defeated a Yonko."
     ,"Is investigating the poneglifs."
     ,"Escaped Impel Down."
     ,"Stormed a Marine's fortress."
     ,"Defeated a notorious pirate."
     ,"Stole a rare devil fruit from the Government."
     ,"Entered the New World."
     ,"Reached Fish-Man Island."
     ,"Survived a Buster Call."
     ,"Punched a Celestial Dragon."
     ,"Burned the World Government's flag."
     ,"Found a Road Poneglyph."
     ,"Took part in the Paramount War."
     ,"Won a Davy Back Fight."
     ,"Defeated a Supernova."
     ,"Defeated a Yonko Commander."
     ,"Defeated an Admiral."
     ,"Fought in the Wano revolution."
     ,"Freed the slaves at the Sabaody auction house."],
  "Bounty Hunter": ["None"
     ,"Captured a 40,000,000 bounty criminal."
     ,"Defeated a small group of pirates."
     ,"Defeated a Marine's Captain."
     ,"Captured a 20,000,000 bounty criminal."
     ,"Captured a 5,000,000 bounty criminal."
     ,"Captured a Supernova."
     ,"Worked as an agent of Baroque Works."
     ,"Hunted pirates in the New World."
     ,"Survived the Calm Belt."],
  "Cipher Pol": ["None"
     ,"Adquired information about a poneglif."
     ,"Spied on a Yonko."
     ,"Contained a possible leak of sensitive Government information."
     ,"Completed a secret mission from the Government."
     ,"Defeated a notorious pirate."
     ,"Infiltrated a Yonko crew."
     ,"Guarded the Celestial Dragons at the Reverie."
     ,"Defended the Tower of Justice at Enies Lobby."
     ,"Tracked down an Ohara survivor."],
  "World Nobles": ["None"
     ,"Attacked a neighboring country."
     ,"Denied his past and royal family."
     ,"Destroyed an enemy's facility."
     ,"Allied with pirates."
     ,"Attended the Reverie."
     ,"Bought a slave at the Sabaody auction house."
     ,"Summoned an Admiral to their island."
     ,"Fled Mary Geoise."]
};

// Escolhe um feat da alliance, excluindo os que exigem haki que a personagem não tem
function pickFeat(allianceName, hakiName) {
  var pool = allowedFeats(featsByAlliance[allianceName] || ["None"], hakiName);
  return capFirst(pool[getRandomInt(0, pool.length)]);
}

function assignfeat(){
  feat = pickFeat(alliance, haki);
  document.getElementById("feat").innerHTML = feat;
}

// Feat 2 -----

function assignfeat2(){
  feat2 = pickFeat(alliance2, haki2);
  document.getElementById("feat2").innerHTML = feat2;
}

// Feat 3 -----

function assignfeat3(){
  feat3 = pickFeat(alliance3, haki3);
  document.getElementById("feat3").innerHTML = feat3;
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

  if (haki === "Conquerors + Armament + Observation") {   // --- Haki
     var hakidoriki = getRandomInt(1000, 5000 + 1);
  } else if(haki === "Observation + Armament") {
     var hakidoriki = getRandomInt(1000, 3000 + 1);
  } else if(haki === "Conquerors + Armament") {
     var hakidoriki = getRandomInt(750, 2500 + 1);
  } else if(haki === "Conquerors + Observation") {
     var hakidoriki = getRandomInt(500, 2000 + 1);
  } else if(haki === "Conquerors") {
     var hakidoriki = getRandomInt(100, 1000 + 1);
  } else if(haki === "Armament") {
     var hakidoriki = getRandomInt(500, 1000 + 1);
  } else if(haki === "Observation") {
     var hakidoriki = getRandomInt(100, 300 + 1);
  } else {
     var hakidoriki = getRandomInt(0, 0 + 1);
  }

  var devilfruitdoriki = fruitDoriki(devilfruit);            // --- Devilfruit (valores em data/devil-fruit-types.csv)

  if(feat === "Defeated a Marine's Captain.") {    // --- Feat (Feats que valorizam combate/força convertem em doriki) - FEAT
     var featdoriki = getRandomInt(400, 1000 + 1);
  } else if(feat === "Defeated a Shichibukai.") {
     var featdoriki = getRandomInt(1200, 3000 + 1);
  } else if(feat === "Defeated a Yonko.") {
     var featdoriki = getRandomInt(20000, 30000 + 1);
  } else if(feat === "Escaped Impel Down.") {
     var featdoriki = getRandomInt(100, 700 + 1);
  } else if(feat === "Stormed a Marine's fortress.") {
     var featdoriki = getRandomInt(100, 700 + 1);
  } else if(feat === "Defeated a notorious pirate.") {
     var featdoriki = getRandomInt(100, 1000 + 1);         
  } else {
     var featdoriki = featBonus(extraFeatDoriki, feat);
  }

  dorikifinal = racedoriki + rankdoriki + hakidoriki + devilfruitdoriki + featdoriki
  adddoriki = racedoriki + rankdoriki + hakidoriki + devilfruitdoriki + featdoriki
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

  if (haki2 === "Conquerors + Armament + Observation") {   // --- Haki
     var hakidoriki2 = getRandomInt(1000, 5000 + 1);
  } else if(haki2 === "Observation + Armament") {
     var hakidoriki2 = getRandomInt(1000, 3000 + 1);
  } else if(haki2 === "Conquerors + Armament") {
     var hakidoriki2 = getRandomInt(750, 2500 + 1);
  } else if(haki2 === "Conquerors + Observation") {
     var hakidoriki2 = getRandomInt(500, 2000 + 1);
  } else if(haki2 === "Conquerors") {
     var hakidoriki2 = getRandomInt(100, 1000 + 1);
  } else if(haki2 === "Armament") {
     var hakidoriki2 = getRandomInt(500, 1000 + 1);
  } else if(haki2 === "Observation") {
     var hakidoriki2 = getRandomInt(100, 300 + 1);
  } else {
     var hakidoriki2 = getRandomInt(0, 0 + 1);
  }

  if(feat2 === "Defeated a Marine's Captain.") {    // --- Feat (Feats que valorizam combate/força convertem em doriki) - FEAT
     var featdoriki2 = getRandomInt(400, 1000 + 1);
  } else if(feat2 === "Defeated a Shichibukai.") {
     var featdoriki2 = getRandomInt(1200, 3000 + 1);
  } else if(feat2 === "Defeated a Yonko.") {
     var featdoriki2 = getRandomInt(20000, 30000 + 1);
  } else if(feat2 === "Escaped Impel Down.") {
     var featdoriki2 = getRandomInt(100, 700 + 1);
  } else if(feat2 === "Stormed a Marine's fortress.") {
     var featdoriki2 = getRandomInt(100, 700 + 1);
  } else if(feat2 === "Defeated a notorious pirate.") {
     var featdoriki2 = getRandomInt(100, 1000 + 1);         
  } else {
     var featdoriki2 = featBonus(extraFeatDoriki, feat2);
  }

  dorikifinal2 = dorikifinal + rankdoriki2*0.2 + hakidoriki2 + featdoriki2
  adddoriki2 = parseInt(dorikifinal2) - parseInt(dorikifinal) // Calcula a diferença entre os dorikis no anos 1 e 2
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

  if (haki3 === "Conquerors + Armament + Observation") {   // --- Haki
     var hakidoriki3 = getRandomInt(1000, 5000 + 1);
  } else if(haki3 === "Observation + Armament") {
     var hakidoriki3 = getRandomInt(1000, 3000 + 1);
  } else if(haki3 === "Conquerors + Armament") {
     var hakidoriki3 = getRandomInt(750, 2500 + 1);
  } else if(haki3 === "Conquerors + Observation") {
     var hakidoriki3 = getRandomInt(500, 2000 + 1);
  } else if(haki3 === "Conquerors") {
     var hakidoriki3 = getRandomInt(100, 1000 + 1);
  } else if(haki3 === "Armament") {
     var hakidoriki3 = getRandomInt(500, 1000 + 1);
  } else if(haki3 === "Observation") {
     var hakidoriki3 = getRandomInt(100, 300 + 1);
  } else {
     var hakidoriki3 = getRandomInt(0, 0 + 1);
  }

  if(feat3 === "Defeated a Marine's Captain.") {    // --- Feat (Feats que valorizam combate/força convertem em doriki) - FEAT
     var featdoriki3 = getRandomInt(400, 1000 + 1);
  } else if(feat3 === "Defeated a Shichibukai.") {
     var featdoriki3 = getRandomInt(1200, 3000 + 1);
  } else if(feat3 === "Defeated a Yonko.") {
     var featdoriki3 = getRandomInt(20000, 30000 + 1);
  } else if(feat3 === "Escaped Impel Down.") {
     var featdoriki3 = getRandomInt(100, 700 + 1);
  } else if(feat3 === "Stormed a Marine's fortress.") {
     var featdoriki3 = getRandomInt(100, 700 + 1);
  } else if(feat3 === "Defeated a notorious pirate.") {
     var featdoriki3 = getRandomInt(100, 1000 + 1);         
  } else {
     var featdoriki3 = featBonus(extraFeatDoriki, feat3);
  }

  dorikifinal3 = dorikifinal2 + rankdoriki3*0.2 + hakidoriki3 + featdoriki3
  adddoriki3 = parseInt(dorikifinal3) - parseInt(dorikifinal2) // Calcula a diferença entre os dorikis no anos 2 e 3
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

  if (feat === "Leaked sensitive Government information.") {    // --- Feat (Feats que valorizam "perigo" convertem em bounty diretamente) - FEAT
     var featbounty = getRandomInt(5, 25 + 1);
  } else if(feat === "Is investigating the poneglifs.") {
     var featbounty = getRandomInt(10, 50 + 1);
  } else if(feat === "Allied with pirates.") {
     var featbounty = getRandomInt(5, 10 + 1);
  } else if(feat === "Denied his past and royal family.") {
     var featbounty = getRandomInt(0, 5 + 1);
  } else if(feat === "Attacked a neighboring country.") {
     var featbounty = getRandomInt(0, 5 + 1);
  } else if(feat === "Stole a rare devil fruit from the Government.") {
     var featbounty = getRandomInt(25, 100 + 1);              
  } else {
     var featbounty = featBonus(extraFeatBounty, feat);
  }

  dorikibounty = dorikifinal * 0.075

  if (alliance === "Marine") {                      // --- Block Alliances
     var dorikibounty = getRandomInt(0, 0 + 1);
     var alliancebounty = getRandomInt(0, 0 + 1);
     var devilfruitbounty = getRandomInt(0, 0 + 1);
     var featbounty = getRandomInt(0, 0 + 1);
  } else if(alliance === "Cipher Pol") {
     var dorikibounty = getRandomInt(0, 0 + 1);
     var alliancebounty = getRandomInt(0, 0 + 1);
     var devilfruitbounty = getRandomInt(0, 0 + 1);
     var featbounty = getRandomInt(0, 0 + 1);
  }


  bountyfinal = dorikibounty + alliancebounty + devilfruitbounty + featbounty
  var bountyadded = parseInt(bountyfinal);
  document.getElementById("bountyfinal").innerHTML = formatBounty(parseInt(bountyfinal));
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

  if (feat2 === "Leaked sensitive Government information.") {    // --- Feat (Feats que valorizam "perigo" convertem em bounty diretamente) - FEAT
     var featbounty2 = getRandomInt(5, 25 + 1);
  } else if(feat2 === "Is investigating the poneglifs.") {
     var featbounty2 = getRandomInt(10, 50 + 1);
  } else if(feat2 === "Allied with pirates.") {
     var featbounty2 = getRandomInt(5, 10 + 1);
  } else if(feat2 === "Denied his past and royal family.") {
     var featbounty2 = getRandomInt(0, 5 + 1);
  } else if(feat2 === "Attacked a neighboring country.") {
     var featbounty2 = getRandomInt(0, 5 + 1);
  } else if(feat2 === "Stole a rare devil fruit from the Government.") {
     var featbounty2 = getRandomInt(25, 100 + 1);              
  } else {
     var featbounty2 = featBonus(extraFeatBounty, feat2);
  }

  dorikibounty2 = dorikifinal2 * 0.075
  bountyfinal2 = dorikibounty2 + alliancebounty2 + devilfruitbounty2 + featbounty2
  if (rank2 === "Yonko") {   // --- Yonko (bounty na casa dos bilhões)
     bountyfinal2 += getRandomInt(2000, 4000 + 1);
  }

  if (alliance2 === "Marine" || alliance2 === "Cipher Pol") {   // --- Block Alliances (mantém a bounty anterior)
     bountyfinal2 = bountyfinal;
  }
  
  var bountyadded2 = parseInt(bountyfinal2) - parseInt(bountyfinal) // Calcula a diferença entre as bounties no anos 1 e 2
  document.getElementById("bountyfinal2").innerHTML = formatBounty(parseInt(bountyfinal2));
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

  if (feat3 === "Leaked sensitive Government information.") {    // --- Feat (Feats que valorizam "perigo" convertem em bounty diretamente) - FEAT
     var featbounty3 = getRandomInt(5, 25 + 1);
  } else if(feat3 === "Is investigating the poneglifs.") {
     var featbounty3 = getRandomInt(10, 50 + 1);
  } else if(feat3 === "Allied with pirates.") {
     var featbounty3 = getRandomInt(5, 10 + 1);
  } else if(feat3 === "Denied his past and royal family.") {
     var featbounty3 = getRandomInt(0, 5 + 1);
  } else if(feat3 === "Attacked a neighboring country.") {
     var featbounty3 = getRandomInt(0, 5 + 1);
  } else if(feat3 === "Stole a rare devil fruit from the Government.") {
     var featbounty3 = getRandomInt(25, 100 + 1);              
  } else {
     var featbounty3 = featBonus(extraFeatBounty, feat3);
  }

  dorikibounty3 = dorikifinal3 * 0.075
  bountyfinal3 = dorikibounty3 + alliancebounty3 + devilfruitbounty3 + featbounty3
  if (rank3 === "Yonko") {   // --- Yonko (bounty na casa dos bilhões)
     bountyfinal3 = Math.max(bountyfinal3 + getRandomInt(2000, 4000 + 1), bountyfinal2);
  }

  if (alliance3 === "Marine" || alliance3 === "Cipher Pol") {   // --- Block Alliances (mantém a bounty anterior)
     bountyfinal3 = bountyfinal2;
  }
  
  var bountyadded3 = parseInt(bountyfinal3) - parseInt(bountyfinal2) // Calcula a diferença entre as bounties no anos 2 e 3
  document.getElementById("bountyfinal3").innerHTML = formatBounty(parseInt(bountyfinal3));
  document.getElementById("addbounty3").innerHTML = formatBountyChange(bountyadded3);
}