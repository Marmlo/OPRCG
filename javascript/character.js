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


// Probably not going to need these:
function capFirst(alli) {
    return alli.charAt(0).toUpperCase() + alli.slice(1);
}

function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
}
// ----------------------------------

// Race ---------------------------------------------------------------------------------------------------------------------------------------------------------------

let racesWeighted = ['Human', 'Fishman', 'Giant', 'Hybrid', 'Merfolk', 'Ancient Giant', 'Frost Giant',  'Skypiean', 'Lunarian', 'Mink', 'Tontatta', 'Oni', 'Cyborg']
let racesWeights = [10, 4, 3, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1]

function raceGen() {
    document.getElementById("race").innerHTML = weightedRandom(racesWeighted, racesWeights)
}

function weightedRandom(items, weights) {
    var i;

    for (i = 0; i < weights.length; i++) {
        weights[i] += weights[i - 1] || 0;
    }

    var random = Math.random() * weights[weights.length - 1];
    
    for (i = 0; i < weights.length; i++) {
        if (weights[i] > random) {
            break;
        }
    }
    
    return items[i];
}


/* 
Odds:
  Human         - 10/30 ≈ 33%
  Fishman       - 4/30 ≈ 13%
  Giant         - 3/30 ≈ 10%
  Hybrid        - 3/30 ≈ 10%
  Merfolk       - 2/30 ≈ 7%
  Ancient Giant - 1/30 ≈ 3%
  Frost Giant   - 1/30 ≈ 3%
  Skypiean      - 1/30 ≈ 3%
  Lunarian      - 1/30 ≈ 3%
  Mink          - 1/30 ≈ 3%
  Tontatta      - 1/30 ≈ 3%
  Oni           - 1/30 ≈ 3%
  Cyborg        - 1/30 ≈ 3%
*/
    
// Alliance ---------------------------------------------------------------------------------------------------------------------------------------------------------------

let alliancesWeighted = ["Marine", "Pirate", "Revolutionary Army", "Bounty Hunter", "Cipher Pol", "World Nobles"];
let alliancesWeights = [3, 3, 2, 2, 1, 1]

function allianceGen() {
    alliance = weightedRandom(alliancesWeighted, alliancesWeights)
    document.getElementById("alliance").innerHTML = alliance;
}

function generateAlliance(){
      var alliances = ["Revolutionary Army","Marine","Pirate","Bounty Hunter","Cipher Pol","World Nobles"
                      ,"Revolutionary Army","Marine","Pirate","Bounty Hunter","Marine","Pirate"];

      alliance = capFirst(alliances[getRandomInt(0, alliances.length + 1)]);
      document.getElementById("alliance").innerHTML = alliance;
}

/* 
Odds:
  Marine             - 3/12 ≈ 25%
  Pirate             - 3/12 ≈ 25%
  Revolutionary Army - 2/12 ≈ 17%
  Bounty Hunter      - 2/12 ≈ 17%
  Cipher Pol         - 1/12 ≈ 8%
  World Nobles       - 1/12 ≈ 8%
*/

// Alliance2 -----

function generateAlliance2(){
  if (alliance === "Revolutionary Army") {
     alliances2 = ["Revolutionary Army","Revolutionary Army","Pirate","Bounty Hunter"];
  } else if(alliance === "Marine") {
     alliances2 = ["Marine","Marine","Marine","Revolutionary Army","Pirate","Bounty Hunter","Cipher Pol"];
  } else if(alliance === "Pirate") {
     alliances2 = ["Revolutionary Army","Pirate","Pirate","Bounty Hunter","Marine"];
  } else if(alliance === "Bounty Hunter") {
     alliances2 = ["Bounty Hunter","Bounty Hunter","Revolutionary Army","Pirate","Bounty Hunter"];
  } else if(alliance === "Cipher Pol") {
     alliances2 = ["Cipher Pol","Cipher Pol","Marine"];
  } else if(alliance === "World Nobles") {
     alliances2 = ["World Nobles","World Nobles","Revolutionary Army","Marine","Pirate","Bounty Hunter","Cipher Pol"];
  }

  alliance2 = capFirst(alliances2[getRandomInt(0, alliances2.length + 1)]);
  document.getElementById("alliance2").innerHTML = alliance2;
}

// Alliance3 -----

function generateAlliance3(){
  if (alliance2 === "Revolutionary Army") {
     alliances3 = ["Revolutionary Army","Revolutionary Army","Pirate","Bounty Hunter"];
  } else if(alliance2 === "Marine") {
     alliances3 = ["Marine","Marine","Marine","Revolutionary Army","Pirate","Bounty Hunter","Cipher Pol"];
  } else if(alliance2 === "Pirate") {
     alliances3 = ["Revolutionary Army","Pirate","Pirate","Bounty Hunter","Marine"];
  } else if(alliance2 === "Bounty Hunter") {
     alliances3 = ["Bounty Hunter","Bounty Hunter","Revolutionary Army","Pirate","Bounty Hunter"];
  } else if(alliance2 === "Cipher Pol") {
     alliances3 = ["Cipher Pol","Cipher Pol","Marine"];
  } else if(alliance2 === "World Nobles") {
     alliances3 = ["World Nobles","World Nobles","Revolutionary Army","Marine","Pirate","Bounty Hunter","Cipher Pol"];
  }

  alliance3 = capFirst(alliances3[getRandomInt(0, alliances3.length + 1)]);
  document.getElementById("alliance3").innerHTML = alliance3;
}


// Rank ---------------------------------------------------------------------------------------------------------------------------------------------------------------

function assignRank(){
     
 if (alliance === "Revolutionary Army") {
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

  rank = capFirst(ranks[getRandomInt(0, ranks.length + 1)]);
  document.getElementById("rank").innerHTML = rank;
}


// Rank 2 -----

function assignRank2(){
 
  if(rank === "Leader" && alliance2 === "Revolutionary Army") { // --------------------------- Revolutionary Army
     ranks2 = ["Leader"];
  } else if(rank === "Chief of Staff" && alliance2 === "Revolutionary Army") {
     ranks2 = ["Leader","Chief of Staff"];
  } else if(rank === "Army Commander" && alliance2 === "Revolutionary Army") {
     ranks2 = ["Leader","Chief of Staff","Army Commander"];
  } else if(rank === "Officer" && alliance2 === "Revolutionary Army") {
     ranks2 = ["Leader","Chief of Staff","Army Commander","Officer"];
  } else if(rank === "Member" && alliance2 === "Revolutionary Army") {
     ranks2 = ["Leader","Chief of Staff","Army Commander","Officer","Member","Associate"];
  } else if(rank === "Associate" && alliance2 === "Revolutionary Army") {
     ranks2 = ["Leader","Chief of Staff","Army Commander","Officer","Member","Associate"];

  } else if(alliance2 === "Revolutionary Army") {
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

  rank2 = capFirst(ranks2[getRandomInt(0, ranks2.length + 1)]);
  document.getElementById("rank2").innerHTML = rank2;
}

// Rank 3 -----

function assignRank3(){
 
  if(rank2 === "Leader" && alliance3 === "Revolutionary Army") { // --------------------------- Revolutionary Army
     ranks3 = ["Leader"];
  } else if(rank2 === "Chief of Staff" && alliance3 === "Revolutionary Army") {
     ranks3 = ["Leader","Chief of Staff"];
  } else if(rank2 === "Army Commander" && alliance3 === "Revolutionary Army") {
     ranks3 = ["Leader","Chief of Staff","Army Commander"];
  } else if(rank2 === "Officer" && alliance3 === "Revolutionary Army") {
     ranks3 = ["Leader","Chief of Staff","Army Commander","Officer"];
  } else if(rank2 === "Member" && alliance3 === "Revolutionary Army") {
     ranks3 = ["Leader","Chief of Staff","Army Commander","Officer","Member","Associate"];
  } else if(rank2 === "Associate" && alliance3 === "Revolutionary Army") {
     ranks3 = ["Leader","Chief of Staff","Army Commander","Officer","Member","Associate"];

  } else if(alliance3 === "Revolutionary Army") {
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

  rank3 = capFirst(ranks3[getRandomInt(0, ranks3.length + 1)]);
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

  fighting = capFirst(fightings[getRandomInt(0, fightings.length + 1)]);
  document.getElementById("fighting").innerHTML = fighting;
}

// Fighting 2 -----

function generatefighting2(){

  fightings2 = [fighting]

  fighting2 = capFirst(fightings2[getRandomInt(0, fightings2.length + 1)]);
  document.getElementById("fighting2").innerHTML = fighting2;
}

// Fighting 3 -----

function generatefighting3(){

  fightings3 = [fighting2]

  fighting3 = capFirst(fightings3[getRandomInt(0, fightings3.length + 1)]);
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
  } else if (rank === "Leader"){ // -------------------------------------------------------------------------------------------------- Revolutionary Army
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

  haki = capFirst(hakis[getRandomInt(0, hakis.length + 1)]);
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

  haki2 = capFirst(hakis2[getRandomInt(0, hakis2.length + 1)]);
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

  haki3 = capFirst(hakis3[getRandomInt(0, hakis3.length + 1)]);
      document.getElementById("haki3").innerHTML = haki3;
}



// Devil Fruit ---------------------------------------------------------------------------------------------------------------------------------------------------------------

function generatedevilfruit() {
      var devilfruits = ["Special Paramecia","Paramecia","Zoan","No","Paramecia","Ancient Zoan","No","Paramecia","Logia","Zoan",
      "No","Zoan","No","Special Paramecia","Mythical Zoan","No","Paramecia","No","Zoan","Mythical Zoan",
      "Ancient Zoan","No","Paramecia","Logia","No"];

      devilfruit = capFirst(devilfruits[getRandomInt(0, devilfruits.length + 1)]);
      document.getElementById("devilfruit").innerHTML = devilfruit;
}

function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
}

    /* 

    Odds:
      Zoan              - 4/25 - 16%
      Mythical Zoan     - 2/25 - 08%
      Ancient Zoan      - 2/25 - 08%
      Paramecia         - 5/25 - 20%
      Special Paramecia - 2/25 - 08%
      Logia             - 2/25 - 08%
      No                - 8/25 - 32%

    */

/* Specific Devil Fruit */

function assigndevilfruit(){
     
 if (devilfruit === "Zoan") {
     dfs = ["Uma-Uma no Mi - Model: Pony","Uma-Uma no Mi - Model: Antelope"
     ,"Kani-Kani no Mi - Model: Hermit Crab"
     ,"Hebi-Hebi no Mi - Model: Viper","Hebi-Hebi no Mi - Model: Python","Hebi-Hebi no Mi - Model: Black Mamba"
     ,"Kame-Kame no Mi - Model: Tortoise"
     ,"Croco-Croco no Mi - Model: Alligator"
     ,"Prima-Prima no Mi - Model: Gorilla"
     ,"Kuma-Kuma no Mi - Model: Polar Bear","Kuma-Kuma no Mi - Model: Black Bear"
     ,"Mushi-Mushi no Mi - Model: Bee","Mushi-Mushi no Mi - Model: Scorpion"
     ,"Webbo-Webbo no Mi - Model: Black Widow"
     ,"Tori-Tori no Mi - Model: Duck","Tori-Tori no Mi - Model: Flamingo","Tori-Tori no Mi - Model: Raven"
     ,"Ushi-Ushi no Mi - Model: Reindeer"
     ,"Neko-Neko no Mi - Model: Puma","Neko-Neko no Mi - Model: Panther","Neko-Neko no Mi - Model: Tiger"
     ,"Inu-Inu no Mi - Model: Golden Retriever","Inu-Inu no Mi - Model: Husky","Inu-Inu no Mi - Model: Blood Hound"
     ,"Hito-Hito no Mi - Model: Human"];
  } else if(devilfruit === "Mythical Zoan") {
     dfs = ["Tori-Tori no Mi - Model: Thunderbird","Tori-Tori no Mi - Model: Tripodero"
     ,"Uma-Uma no Mi - Model: Pegasus","Neko-Neko no Mi - Model: Unicorn"
     ,"Neko-Neko no Mi - Model: Sphinx","Neko-Neko no Mi - Model: Griffin"
     ,"Kame-Kame no Mi - Model: Colossal Turtle"
     ,"Inu-Inu no Mi - Model: Cerberus","Inu-Inu no Mi - Model: Fenrir Wolf","Inu-Inu no Mi - Model: Moon Wolf"
     ,"Prima-Prima no Mi - Model: Yeti"
     ,"Ryu-Ryu no Mi - Model: Western Dragon"
     ,"Hito-Hito no Mi - Model: Angel","Hito-Hito no Mi - Model: Nika","Hito-Hito no Mi - Model: Zombie"
     ,"Aku-Aku no Mi - Model: Asura","Aku-Aku no Mi - Model: Suuccubus","Aku-Aku no Mi - Model: Imp"];
  } else if(devilfruit === "Ancient Zoan") {
     dfs = ["Mushi-Mushi no Mi - Model: Meganeura","Mushi-Mushi no Mi - Model: Gastropod"
     ,"Webbo-Webbo no Mi - Model: Megarachne"
     ,"Tori-Tori no Mi - Model: Dodo Bird"
     ,"Uma-Uma no Mi - Model: Giant Deer"
     ,"Neko-Neko no Mi - Model: Xenosmilus"
     ,"Inu-Inu no Mi - Model: Dire Wolf"
     ,"Ryu-Ryu no Mi - Model: Pterodactyl","Ryu-Ryu no Mi - Model: Veolociraptor","Ryu-Ryu no Mi - Model: Megaraptor","Ryu-Ryu no Mi - Model: Tyrannosaurus Rex","Ryu-Ryu no Mi - Model: Braichiosaurus"
     ,"Hito-Hito no Mi - Model: Neanderthal"];
  } else if(devilfruit === "Paramecia") {
     dfs = ["Choco-Choco no Mi (Chocolate Fruit)","Yume-Yume no Mi (Dream Fruit)","Soda-Soda no Mi (Soda Fruit)","Toki-Toki no Mi (Time Fruit)","Ana-Ana no Mi (Hole Fruit)","Kyara-Kyara no Mi (Character Fruit)"
     ,"Wara-Wara no Mi (Laugh Fruit)","Rubi-Rubi no Mi (Ruby Fruit)","Ope-Ope no Mi (Op Fruit)","Hoshi-Hoshi no Mi (Star Fuit)","Naiha-Naiha no Mi (Implosian Man Fruit)","Pero-Pero No Mi (Lick Fruit)","Kaya-Kaya No Mi (Gunpowder Fruit)"
     ,"Nichi-Nichi No Mi (2D Fruit)","Hamma-Hamma No Mi (Hammer Fruit)","Oru-Oru No Mi (Origami Fruit)","Glasa-Glasa No Mi (Glass Fruit)","Gane-Gane No Mi (Steel Body Fruit)","Kawai-Kawai No Mi (Cute-Cute Fruit)","Dragu-Dragu No Mi (Drugs Fruit)"
     ,"Alco-Alco No Mi (Alcohol Fruit)","Gera-Gera No Mi (Gear Fruit)","Caro-Caro No Mi (Vehicle Fruit)","Foldu-Foldu No Mi (Fold-Fold Fruit)","Obbi-Obbi No Mi (Obsidian Fruit)","Vibro-Vibro No Mi (Vibration Fruit)","Susu-Susu No Mi (SuperSpeed Fruit)","Yari-Yari No Mi (Spikes Fruit)"
     ,"Kini-Kini No Mi (Muscle Fruit)","Jiki-Jiki No Mi (Magnet Fruit)","Wara-Wara No Mi (Straw Fruit)","Horu-Horu No Mi (Hormones Fruit)","Hana-Hana No Mi (Flower Fruit)","Mane-Mane No Mi (Clone Fruit)","Bane-Bane No Mi (Springs Fruit)","Ito-Ito No Mi (Strings Fruit)"
     ,"Sabi-Sabi No Mi (Rust Fruit)","Yomi-Yomi No Mi (Revive Fruit)","Suke-Suke No Mi (Invisible Fruit)","Goru-Goru No Mi (Gold Fruit)","Peto-Peto No Mi (Pet Fruit)","Bisu-Bisu No Mi (Biscuit Fruit)","Soru-Soru No Mi (Soul Fruit)","Chiyu-Chiyu No Mi (Heal Fruit)"
     ,"Ato-Ato No Mi (Art Fruit)","Bari-Bari No Mi (Barrier Fruit)","Horo-Horo No Mi (Ghost/Hollow Fruit)"];
  } else if(devilfruit === "Special Paramecia") {
     dfs = ["Huni-Huni no Mi (Honey Fruit)","Ki-Ki no Mi (Tree Fruit)","Toryo-Toryo no Mi (Paint Fruit)","Mochi-Mochi No Mi (Mochi Fruit)","Nori-Nori No Mi (Glue Fruit)","Jero-Jero no Mi (Gelatin Fruit)","Doku-Doku No Mi (Venom Fruit)"];
  } else if(devilfruit === "Logia") {
     dfs = ["Salti-Salti no Mi (Salt Fruit)","Sora-Sora no Mi (Coulds Fruit)","Sido-Sido no Mi (Acid Fruit)","Nendo-Nendo no Mi (Clay Fruit)","Doro-Doro no Mi (Dirt Fruit)","Plazu-Plazu no Mi (Plasma Fruit)","Suigi-Suigi no Mi (Mercury Fruit)","Taru-Taru no Mi (Tar Fruit)",
     "Genyu-Genyu no Mi (Crude Oil Fruit)","Shibo-Shibo no Mi (Fatty Oil Fruit)","Tanso-Tanso no Mi (Coal/Carbon Fruit)","Unchi-Unchi no Mi (Waste Fruit)","Hone-Hone no Mi (Calcium/Bone Fruit)","Moku-Moku no Mi (Wood Fruit)","Nama-Nama no Mi (Lead Fruit)","Sulfu-Sulfu no Mi (Sulfur Fruit)",
     "Tassi-Tassi no Mi (Patassium Fruit)","Gino-Gino no Mi (Silver Fruit)","Noni-Noni no Mi (Neon Fruit)","Kaze-Kaze no Mi (Wind Fruit)","Ketsu-Ketsu no Mi (Blood Fruit)","Inku-Inku no Mi (Ink Fruit)","Kusa-Kusa no Mi (Grass Fruit)","Iwa-Iwa no Mi (Stone Fruit)","Kessho-Kessho no Mi (Crystal Fruit)"
     ,"Foru-Foru no Mi (Phosphorus Fruit)","Enso-Enso no Mi (Chlorine Fruit)","Choku-Choku no Mi (Chalk Fruit)","Hoko-Hoko no Mi (Dust Fruit)","Jushi-Jushi no Mi (Resin Fruit)","Nuclee-Nuclee no Mi (Nuclear Energy Fruit)","Suraimu-Suraimu no Mi (Slime Fruit)","Moku-Moku no Mi (Smoke Fruit)"
     ,"Suna-Suna no Mi (Sand Fruit)","Mera-Mera no Mi (Fire Fruit)","Goro-Goro no Mi (Lightning Fruit)","Hie-Hie no Mi (Ice Fruit)","Yami-Yami no Mi (Darkness Fruit)","Pika-Pika no Mi (Light Fruit)","Magu-Magu no Mi (Magma Fruit)","Numa-Numa no Mi (Mud Fruit)","Gasu-Gasu no Mi (Gas Fruit)"
     ,"Yuki-Yuki no Mi (Snow Fruit)","Toro-Toro no Mi (Unknown Liquid Fruit)","Pasa-Pasa no Mi (Paper Fruit)","Ame-Ame no Mi (Candy Syrup Fruit)"];
  } else if(devilfruit === "No") {
     dfs = ["None"];
  } 

  df = capFirst(dfs[getRandomInt(0, dfs.length + 1)]);
  document.getElementById("df").innerHTML = df;
}

// Devil Fruit 2 -----

function generatedevilfruit2() {

  if (devilfruit === "Zoan") {
      devilfruits2 = [devilfruit];
  } else if (devilfruit === "Ancient Zoan") {
      devilfruits2 = [devilfruit];
  } else if (devilfruit === "Mythical Zoan") {
      devilfruits2 = [devilfruit];               
  } else if (devilfruit === "Paramecia") {
      devilfruits2 = [devilfruit];
  } else if (devilfruit === "Special Paramecia") {
      devilfruits2 = [devilfruit];                                                         
  } else if (devilfruit === "Logia") {
      devilfruits2 = [devilfruit];                                                          
  } else if (devilfruit === "No"){
     devilfruits2 = ["Special Paramecia","Paramecia","Zoan","No","Paramecia","Ancient Zoan","No","Paramecia","Logia","Zoan",
      "No","Zoan","No","Special Paramecia","Mythical Zoan","No","Paramecia","No","Zoan","Mythical Zoan",
      "Ancient Zoan","No","Paramecia","Logia","No"];
  }
      
  devilfruit2 = capFirst(devilfruits2[getRandomInt(0, devilfruits2.length + 1)]);
      document.getElementById("devilfruit2").innerHTML = devilfruit2;

}

function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
}

  /* 

    Odds:
      Zoan              - 4/25 - 16%
      Mythical Zoan     - 2/25 - 08%
      Ancient Zoan      - 2/25 - 08%
      Paramecia         - 5/25 - 20%
      Special Paramecia - 2/25 - 08%
      Logia             - 2/25 - 08%
      No                - 8/25 - 32%

    */

/* Specific Devil Fruit 2 */

function assigndevilfruit2(){


  

  if(devilfruit2 === "Zoan" && devilfruit === "No") {
     dfs2 = ["Uma-Uma no Mi - Model: Pony","Uma-Uma no Mi - Model: Antelope"
     ,"Kani-Kani no Mi - Model: Hermit Crab"
     ,"Hebi-Hebi no Mi - Model: Viper","Hebi-Hebi no Mi - Model: Python","Hebi-Hebi no Mi - Model: Black Mamba"
     ,"Kame-Kame no Mi - Model: Tortoise"
     ,"Croco-Croco no Mi - Model: Alligator"
     ,"Prima-Prima no Mi - Model: Gorilla"
     ,"Kuma-Kuma no Mi - Model: Polar Bear","Kuma-Kuma no Mi - Model: Black Bear"
     ,"Mushi-Mushi no Mi - Model: Bee","Mushi-Mushi no Mi - Model: Scorpion"
     ,"Webbo-Webbo no Mi - Model: Black Widow"
     ,"Tori-Tori no Mi - Model: Duck","Tori-Tori no Mi - Model: Flamingo","Tori-Tori no Mi - Model: Raven"
     ,"Ushi-Ushi no Mi - Model: Reindeer"
     ,"Neko-Neko no Mi - Model: Puma","Neko-Neko no Mi - Model: Panther","Neko-Neko no Mi - Model: Tiger"
     ,"Inu-Inu no Mi - Model: Golden Retriever","Inu-Inu no Mi - Model: Husky","Inu-Inu no Mi - Model: Blood Hound"
     ,"Hito-Hito no Mi - Model: Human"];
  } else if(devilfruit2 === "Mythical Zoan" && devilfruit === "No") {
     dfs2 = ["Tori-Tori no Mi - Model: Thunderbird","Tori-Tori no Mi - Model: Tripodero"
     ,"Uma-Uma no Mi - Model: Pegasus","Neko-Neko no Mi - Model: Unicorn"
     ,"Neko-Neko no Mi - Model: Sphinx","Neko-Neko no Mi - Model: Griffin"
     ,"Kame-Kame no Mi - Model: Colossal Turtle"
     ,"Inu-Inu no Mi - Model: Cerberus","Inu-Inu no Mi - Model: Fenrir Wolf","Inu-Inu no Mi - Model: Moon Wolf"
     ,"Prima-Prima no Mi - Model: Yeti"
     ,"Ryu-Ryu no Mi - Model: Western Dragon"
     ,"Hito-Hito no Mi - Model: Angel","Hito-Hito no Mi - Model: Nika","Hito-Hito no Mi - Model: Zombie"
     ,"Aku-Aku no Mi - Model: Asura","Aku-Aku no Mi - Model: Suuccubus","Aku-Aku no Mi - Model: Imp"];
  } else if(devilfruit2 === "Ancient Zoan" && devilfruit === "No") {
     dfs2 = ["Mushi-Mushi no Mi - Model: Meganeura","Mushi-Mushi no Mi - Model: Gastropod"
     ,"Webbo-Webbo no Mi - Model: Megarachne"
     ,"Tori-Tori no Mi - Model: Dodo Bird"
     ,"Uma-Uma no Mi - Model: Giant Deer"
     ,"Neko-Neko no Mi - Model: Xenosmilus"
     ,"Inu-Inu no Mi - Model: Dire Wolf"
     ,"Ryu-Ryu no Mi - Model: Pterodactyl","Ryu-Ryu no Mi - Model: Veolociraptor","Ryu-Ryu no Mi - Model: Megaraptor","Ryu-Ryu no Mi - Model: Tyrannosaurus Rex","Ryu-Ryu no Mi - Model: Braichiosaurus"
     ,"Hito-Hito no Mi - Model: Neanderthal"];
  } else if(devilfruit2 === "Paramecia" && devilfruit === "No") {
     dfs2 = ["Choco-Choco no Mi (Chocolate Fruit)","Yume-Yume no Mi (Dream Fruit)","Soda-Soda no Mi (Soda Fruit)","Toki-Toki no Mi (Time Fruit)","Ana-Ana no Mi (Hole Fruit)","Kyara-Kyara no Mi (Character Fruit)"
     ,"Wara-Wara no Mi (Laugh Fruit)","Rubi-Rubi no Mi (Ruby Fruit)","Ope-Ope no Mi (Op Fruit)","Hoshi-Hoshi no Mi (Star Fuit)","Naiha-Naiha no Mi (Implosian Man Fruit)","Pero-Pero No Mi (Lick Fruit)","Kaya-Kaya No Mi (Gunpowder Fruit)"
     ,"Nichi-Nichi No Mi (2D Fruit)","Hamma-Hamma No Mi (Hammer Fruit)","Oru-Oru No Mi (Origami Fruit)","Glasa-Glasa No Mi (Glass Fruit)","Gane-Gane No Mi (Steel Body Fruit)","Kawai-Kawai No Mi (Cute-Cute Fruit)","Dragu-Dragu No Mi (Drugs Fruit)"
     ,"Alco-Alco No Mi (Alcohol Fruit)","Gera-Gera No Mi (Gear Fruit)","Caro-Caro No Mi (Vehicle Fruit)","Foldu-Foldu No Mi (Fold-Fold Fruit)","Obbi-Obbi No Mi (Obsidian Fruit)","Vibro-Vibro No Mi (Vibration Fruit)","Susu-Susu No Mi (SuperSpeed Fruit)","Yari-Yari No Mi (Spikes Fruit)"
     ,"Kini-Kini No Mi (Muscle Fruit)","Jiki-Jiki No Mi (Magnet Fruit)","Wara-Wara No Mi (Straw Fruit)","Horu-Horu No Mi (Hormones Fruit)","Hana-Hana No Mi (Flower Fruit)","Mane-Mane No Mi (Clone Fruit)","Bane-Bane No Mi (Springs Fruit)","Ito-Ito No Mi (Strings Fruit)"
     ,"Sabi-Sabi No Mi (Rust Fruit)","Yomi-Yomi No Mi (Revive Fruit)","Suke-Suke No Mi (Invisible Fruit)","Goru-Goru No Mi (Gold Fruit)","Peto-Peto No Mi (Pet Fruit)","Bisu-Bisu No Mi (Biscuit Fruit)","Soru-Soru No Mi (Soul Fruit)","Chiyu-Chiyu No Mi (Heal Fruit)"
     ,"Ato-Ato No Mi (Art Fruit)","Bari-Bari No Mi (Barrier Fruit)","Horo-Horo No Mi (Ghost/Hollow Fruit)"];
  } else if(devilfruit2 === "Special Paramecia" && devilfruit === "No") {
     dfs2 = ["Huni-Huni no Mi (Honey Fruit)","Ki-Ki no Mi (Tree Fruit)","Toryo-Toryo no Mi (Paint Fruit)","Mochi-Mochi No Mi (Mochi Fruit)","Nori-Nori No Mi (Glue Fruit)","Jero-Jero no Mi (Gelatin Fruit)","Doku-Doku No Mi (Venom Fruit)"];
  } else if(devilfruit2 === "Logia" && devilfruit === "No") {
     dfs2 = ["Salti-Salti no Mi (Salt Fruit)","Sora-Sora no Mi (Coulds Fruit)","Sido-Sido no Mi (Acid Fruit)","Nendo-Nendo no Mi (Clay Fruit)","Doro-Doro no Mi (Dirt Fruit)","Plazu-Plazu no Mi (Plasma Fruit)","Suigi-Suigi no Mi (Mercury Fruit)","Taru-Taru no Mi (Tar Fruit)",
     "Genyu-Genyu no Mi (Crude Oil Fruit)","Shibo-Shibo no Mi (Fatty Oil Fruit)","Tanso-Tanso no Mi (Coal/Carbon Fruit)","Unchi-Unchi no Mi (Waste Fruit)","Hone-Hone no Mi (Calcium/Bone Fruit)","Moku-Moku no Mi (Wood Fruit)","Nama-Nama no Mi (Lead Fruit)","Sulfu-Sulfu no Mi (Sulfur Fruit)",
     "Tassi-Tassi no Mi (Patassium Fruit)","Gino-Gino no Mi (Silver Fruit)","Noni-Noni no Mi (Neon Fruit)","Kaze-Kaze no Mi (Wind Fruit)","Ketsu-Ketsu no Mi (Blood Fruit)","Inku-Inku no Mi (Ink Fruit)","Kusa-Kusa no Mi (Grass Fruit)","Iwa-Iwa no Mi (Stone Fruit)","Kessho-Kessho no Mi (Crystal Fruit)"
     ,"Foru-Foru no Mi (Phosphorus Fruit)","Enso-Enso no Mi (Chlorine Fruit)","Choku-Choku no Mi (Chalk Fruit)","Hoko-Hoko no Mi (Dust Fruit)","Jushi-Jushi no Mi (Resin Fruit)","Nuclee-Nuclee no Mi (Nuclear Energy Fruit)","Suraimu-Suraimu no Mi (Slime Fruit)","Moku-Moku no Mi (Smoke Fruit)"
     ,"Suna-Suna no Mi (Sand Fruit)","Mera-Mera no Mi (Fire Fruit)","Goro-Goro no Mi (Lightning Fruit)","Hie-Hie no Mi (Ice Fruit)","Yami-Yami no Mi (Darkness Fruit)","Pika-Pika no Mi (Light Fruit)","Magu-Magu no Mi (Magma Fruit)","Numa-Numa no Mi (Mud Fruit)","Gasu-Gasu no Mi (Gas Fruit)"
     ,"Yuki-Yuki no Mi (Snow Fruit)","Toro-Toro no Mi (Unknown Liquid Fruit)","Pasa-Pasa no Mi (Paper Fruit)","Ame-Ame no Mi (Candy Syrup Fruit)"];
  } else if(devilfruit2 === "No") {
     dfs2 = ["None"];
  } else if (devilfruit === devilfruit2) {
     dfs2 = [df];
  }   

  df2 = capFirst(dfs2[getRandomInt(0, dfs2.length + 1)]);
  document.getElementById("df2").innerHTML = df2;
}
    
// Devil Fruit 3 -----

function generatedevilfruit3() {

  if (devilfruit2 === "Zoan") {
      devilfruits3 = [devilfruit2];
  } else if (devilfruit2 === "Ancient Zoan") {
      devilfruits3 = [devilfruit2];
  } else if (devilfruit2 === "Mythical Zoan") {
      devilfruits3 = [devilfruit2];               
  } else if (devilfruit2 === "Paramecia") {
      devilfruits3 = [devilfruit2];
  } else if (devilfruit2 === "Special Paramecia") {
      devilfruits3 = [devilfruit2];                                                         
  } else if (devilfruit2 === "Logia") {
      devilfruits3 = [devilfruit2];                                                          
  } else if (devilfruit2 === "No"){
     devilfruits3 = ["Special Paramecia","Paramecia","Zoan","No","Paramecia","Ancient Zoan","No","Paramecia","Logia","Zoan",
      "No","Zoan","No","Special Paramecia","Mythical Zoan","No","Paramecia","No","Zoan","Mythical Zoan",
      "Ancient Zoan","No","Paramecia","Logia","No"];
  }
      
  devilfruit3 = capFirst(devilfruits3[getRandomInt(0, devilfruits3.length + 1)]);
      document.getElementById("devilfruit3").innerHTML = devilfruit3;

}

function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
}

  /* 

    Odds:
      Zoan              - 4/25 - 16%
      Mythical Zoan     - 2/25 - 08%
      Ancient Zoan      - 2/25 - 08%
      Paramecia         - 5/25 - 20%
      Special Paramecia - 2/25 - 08%
      Logia             - 2/25 - 08%
      No                - 8/25 - 32%

    */

/* Specific Devil Fruit 3 */

function assigndevilfruit3(){


  

  if(devilfruit3 === "Zoan" && devilfruit2 === "No") {
     dfs3 = ["Uma-Uma no Mi - Model: Pony","Uma-Uma no Mi - Model: Antelope"
     ,"Kani-Kani no Mi - Model: Hermit Crab"
     ,"Hebi-Hebi no Mi - Model: Viper","Hebi-Hebi no Mi - Model: Python","Hebi-Hebi no Mi - Model: Black Mamba"
     ,"Kame-Kame no Mi - Model: Tortoise"
     ,"Croco-Croco no Mi - Model: Alligator"
     ,"Prima-Prima no Mi - Model: Gorilla"
     ,"Kuma-Kuma no Mi - Model: Polar Bear","Kuma-Kuma no Mi - Model: Black Bear"
     ,"Mushi-Mushi no Mi - Model: Bee","Mushi-Mushi no Mi - Model: Scorpion"
     ,"Webbo-Webbo no Mi - Model: Black Widow"
     ,"Tori-Tori no Mi - Model: Duck","Tori-Tori no Mi - Model: Flamingo","Tori-Tori no Mi - Model: Raven"
     ,"Ushi-Ushi no Mi - Model: Reindeer"
     ,"Neko-Neko no Mi - Model: Puma","Neko-Neko no Mi - Model: Panther","Neko-Neko no Mi - Model: Tiger"
     ,"Inu-Inu no Mi - Model: Golden Retriever","Inu-Inu no Mi - Model: Husky","Inu-Inu no Mi - Model: Blood Hound"
     ,"Hito-Hito no Mi - Model: Human"];
  } else if(devilfruit3 === "Mythical Zoan" && devilfruit2 === "No") {
     dfs3 = ["Tori-Tori no Mi - Model: Thunderbird","Tori-Tori no Mi - Model: Tripodero"
     ,"Uma-Uma no Mi - Model: Pegasus","Neko-Neko no Mi - Model: Unicorn"
     ,"Neko-Neko no Mi - Model: Sphinx","Neko-Neko no Mi - Model: Griffin"
     ,"Kame-Kame no Mi - Model: Colossal Turtle"
     ,"Inu-Inu no Mi - Model: Cerberus","Inu-Inu no Mi - Model: Fenrir Wolf","Inu-Inu no Mi - Model: Moon Wolf"
     ,"Prima-Prima no Mi - Model: Yeti"
     ,"Ryu-Ryu no Mi - Model: Western Dragon"
     ,"Hito-Hito no Mi - Model: Angel","Hito-Hito no Mi - Model: Nika","Hito-Hito no Mi - Model: Zombie"
     ,"Aku-Aku no Mi - Model: Asura","Aku-Aku no Mi - Model: Suuccubus","Aku-Aku no Mi - Model: Imp"];
  } else if(devilfruit3 === "Ancient Zoan" && devilfruit2 === "No") {
     dfs3 = ["Mushi-Mushi no Mi - Model: Meganeura","Mushi-Mushi no Mi - Model: Gastropod"
     ,"Webbo-Webbo no Mi - Model: Megarachne"
     ,"Tori-Tori no Mi - Model: Dodo Bird"
     ,"Uma-Uma no Mi - Model: Giant Deer"
     ,"Neko-Neko no Mi - Model: Xenosmilus"
     ,"Inu-Inu no Mi - Model: Dire Wolf"
     ,"Ryu-Ryu no Mi - Model: Pterodactyl","Ryu-Ryu no Mi - Model: Veolociraptor","Ryu-Ryu no Mi - Model: Megaraptor","Ryu-Ryu no Mi - Model: Tyrannosaurus Rex","Ryu-Ryu no Mi - Model: Braichiosaurus"
     ,"Hito-Hito no Mi - Model: Neanderthal"];
  } else if(devilfruit3 === "Paramecia" && devilfruit2 === "No") {
     dfs3 = ["Choco-Choco no Mi (Chocolate Fruit)","Yume-Yume no Mi (Dream Fruit)","Soda-Soda no Mi (Soda Fruit)","Toki-Toki no Mi (Time Fruit)","Ana-Ana no Mi (Hole Fruit)","Kyara-Kyara no Mi (Character Fruit)"
     ,"Wara-Wara no Mi (Laugh Fruit)","Rubi-Rubi no Mi (Ruby Fruit)","Ope-Ope no Mi (Op Fruit)","Hoshi-Hoshi no Mi (Star Fuit)","Naiha-Naiha no Mi (Implosian Man Fruit)","Pero-Pero No Mi (Lick Fruit)","Kaya-Kaya No Mi (Gunpowder Fruit)"
     ,"Nichi-Nichi No Mi (2D Fruit)","Hamma-Hamma No Mi (Hammer Fruit)","Oru-Oru No Mi (Origami Fruit)","Glasa-Glasa No Mi (Glass Fruit)","Gane-Gane No Mi (Steel Body Fruit)","Kawai-Kawai No Mi (Cute-Cute Fruit)","Dragu-Dragu No Mi (Drugs Fruit)"
     ,"Alco-Alco No Mi (Alcohol Fruit)","Gera-Gera No Mi (Gear Fruit)","Caro-Caro No Mi (Vehicle Fruit)","Foldu-Foldu No Mi (Fold-Fold Fruit)","Obbi-Obbi No Mi (Obsidian Fruit)","Vibro-Vibro No Mi (Vibration Fruit)","Susu-Susu No Mi (SuperSpeed Fruit)","Yari-Yari No Mi (Spikes Fruit)"
     ,"Kini-Kini No Mi (Muscle Fruit)","Jiki-Jiki No Mi (Magnet Fruit)","Wara-Wara No Mi (Straw Fruit)","Horu-Horu No Mi (Hormones Fruit)","Hana-Hana No Mi (Flower Fruit)","Mane-Mane No Mi (Clone Fruit)","Bane-Bane No Mi (Springs Fruit)","Ito-Ito No Mi (Strings Fruit)"
     ,"Sabi-Sabi No Mi (Rust Fruit)","Yomi-Yomi No Mi (Revive Fruit)","Suke-Suke No Mi (Invisible Fruit)","Goru-Goru No Mi (Gold Fruit)","Peto-Peto No Mi (Pet Fruit)","Bisu-Bisu No Mi (Biscuit Fruit)","Soru-Soru No Mi (Soul Fruit)","Chiyu-Chiyu No Mi (Heal Fruit)"
     ,"Ato-Ato No Mi (Art Fruit)","Bari-Bari No Mi (Barrier Fruit)","Horo-Horo No Mi (Ghost/Hollow Fruit)"];
  } else if(devilfruit3 === "Special Paramecia" && devilfruit2 === "No") {
     dfs3 = ["Huni-Huni no Mi (Honey Fruit)","Ki-Ki no Mi (Tree Fruit)","Toryo-Toryo no Mi (Paint Fruit)","Mochi-Mochi No Mi (Mochi Fruit)","Nori-Nori No Mi (Glue Fruit)","Jero-Jero no Mi (Gelatin Fruit)","Doku-Doku No Mi (Venom Fruit)"];
  } else if(devilfruit3 === "Logia" && devilfruit2 === "No") {
     dfs3 = ["Salti-Salti no Mi (Salt Fruit)","Sora-Sora no Mi (Coulds Fruit)","Sido-Sido no Mi (Acid Fruit)","Nendo-Nendo no Mi (Clay Fruit)","Doro-Doro no Mi (Dirt Fruit)","Plazu-Plazu no Mi (Plasma Fruit)","Suigi-Suigi no Mi (Mercury Fruit)","Taru-Taru no Mi (Tar Fruit)",
     "Genyu-Genyu no Mi (Crude Oil Fruit)","Shibo-Shibo no Mi (Fatty Oil Fruit)","Tanso-Tanso no Mi (Coal/Carbon Fruit)","Unchi-Unchi no Mi (Waste Fruit)","Hone-Hone no Mi (Calcium/Bone Fruit)","Moku-Moku no Mi (Wood Fruit)","Nama-Nama no Mi (Lead Fruit)","Sulfu-Sulfu no Mi (Sulfur Fruit)",
     "Tassi-Tassi no Mi (Patassium Fruit)","Gino-Gino no Mi (Silver Fruit)","Noni-Noni no Mi (Neon Fruit)","Kaze-Kaze no Mi (Wind Fruit)","Ketsu-Ketsu no Mi (Blood Fruit)","Inku-Inku no Mi (Ink Fruit)","Kusa-Kusa no Mi (Grass Fruit)","Iwa-Iwa no Mi (Stone Fruit)","Kessho-Kessho no Mi (Crystal Fruit)"
     ,"Foru-Foru no Mi (Phosphorus Fruit)","Enso-Enso no Mi (Chlorine Fruit)","Choku-Choku no Mi (Chalk Fruit)","Hoko-Hoko no Mi (Dust Fruit)","Jushi-Jushi no Mi (Resin Fruit)","Nuclee-Nuclee no Mi (Nuclear Energy Fruit)","Suraimu-Suraimu no Mi (Slime Fruit)","Moku-Moku no Mi (Smoke Fruit)"
     ,"Suna-Suna no Mi (Sand Fruit)","Mera-Mera no Mi (Fire Fruit)","Goro-Goro no Mi (Lightning Fruit)","Hie-Hie no Mi (Ice Fruit)","Yami-Yami no Mi (Darkness Fruit)","Pika-Pika no Mi (Light Fruit)","Magu-Magu no Mi (Magma Fruit)","Numa-Numa no Mi (Mud Fruit)","Gasu-Gasu no Mi (Gas Fruit)"
     ,"Yuki-Yuki no Mi (Snow Fruit)","Toro-Toro no Mi (Unknown Liquid Fruit)","Pasa-Pasa no Mi (Paper Fruit)","Ame-Ame no Mi (Candy Syrup Fruit)"];
  } else if(devilfruit3 === "No") {
     dfs3 = ["None"];
  } else if (devilfruit2 === devilfruit3) {
     dfs3 = [df2];
  }   

  df3 = capFirst(dfs3[getRandomInt(0, dfs3.length + 1)]);
  document.getElementById("df3").innerHTML = df3;
}

// Feat ---------------------------------------------------------------------------------------------------------------------------------------------------------------

function assignfeat(){
     
 if (alliance === "Revolutionary Army") { // ---------------------------------------------- Revolutionary Army
     feats = ["None"
     ,"Attacked a Government country."
     ,"Leaked sensitive Government information."
     ,"Stole a rare devil fruit from the Government."
     ,"Participated in a war."
     ,"Released slaves from a Government ally."];
  } else if(rank === "Admiral" || rank === "Fleet Admiral") { // ---------------------------------------------- Marine Admiral and Fleet Admiral
     feats = ["None"
     ,"Held up on a fight against a Yonko. And came out alive."
     ,"With the help of another Admiral defeated a Yonko."
     ,"Helped save a country."
     ,"Captured a 500,000,000 bounty pirate all alone."
     ,"Captured a 800,000,000 bounty pirate all alone."
     ,"Team'd up with a pirate do defeat a notorious pirate."
     ,"Protected the Celestial Dragons on an attemped attack on Mariejois."];   
  } else if(alliance === "Marine") { // ---------------------------------------------- Marine
     feats = ["None"
     ,"Captured a 40,000,000 bounty pirate all alone."
     ,"Defeated a small group of pirates."
     ,"Helped save a country."
     ,"Captured a 20,000,000 bounty pirate all alone."];
  } else if(alliance === "Pirate") { // ---------------------------------------------- Pirate
     feats = ["None"
     ,"Stole a town's supplies."
     ,"Defeated a small group of pirates."
     ,"Defeated a Marine's Captain."
     ,"Defeated a Shichibukai."
     ,"Defeated a Yonko."
     ,"Is investigating the poneglifs."
     ,"Escaped Impel Down."
     ,"Stormed a Marine fortress."
     ,"Defeated a notorious pirate."
     ,"Stole a rare devil fruit from the Government."];
  } else if(alliance === "Bounty Hunter") { // ---------------------------------------------- Bounty Hunter
     feats = ["None"
     ,"Captured a 40,000,000 bounty criminal."
     ,"Defeated a small group of pirates."
     ,"Defeated a Marine's Captain."
     ,"Captured a 20,000,000 bounty criminal."
     ,"Captured a 5,000,000 bounty criminal."];
  } else if(alliance === "Cipher Pol") { // ---------------------------------------------- Cipher Pol
     feats = ["None"
     ,"Adquired information about a poneglif."
     ,"Spied on a Yonko."
     ,"Contained a possible leak of sensitive Government information."
     ,"Completed a secret mission from the Government."
     ,"Defeated a notorious pirate."
     ,"Adquired information about one of the Ancient weapons."];
  } else if(alliance === "World Nobles") { // ---------------------------------------------- World Nobles
     feats = ["None"
     ,"Attacked a neighboring country."
     ,"Denied his past and royal family."
     ,"Destroyed an enemy's facility."
     ,"Allied with pirates."];
  } 

  feat = capFirst(feats[getRandomInt(0, feats.length + 1)]);
      document.getElementById("feat").innerHTML = feat;
}

// Feat 2 -----

function assignfeat2(){
     
 if (alliance2 === "Revolutionary Army") { // ---------------------------------------------- Revolutionary Army
     feats2 = ["None"
     ,"Attacked a Government country."
     ,"Leaked sensitive Government information."
     ,"Stole a rare devil fruit from the Government."
     ,"Participated in a war."
     ,"Released slaves from a Government ally."];
  } else if(rank2 === "Admiral" || rank2 === "Fleet Admiral") { // ---------------------------------------------- Marine Admiral and Fleet Admiral
     feats2 = ["None"
     ,"Held up on a fight against a Yonko. And came out alive."
     ,"With the help of another Admiral defeated a Yonko."
     ,"Helped save a country."
     ,"Captured a 500,000,000 bounty pirate all alone."
     ,"Captured a 800,000,000 bounty pirate all alone."
     ,"Team'd up with a pirate do defeat a notorious pirate."
     ,"Protected the Celestial Dragons on an attemped attack on Mariejois."];      
  } else if(alliance2 === "Marine") { // ---------------------------------------------- Marine
     feats2 = ["None"
     ,"Captured a 40,000,000 bounty pirate all alone."
     ,"Defeated a small group of pirates."
     ,"Helped save a country."
     ,"Captured a 20,000,000 bounty pirate all alone."];
  } else if(alliance2 === "Pirate") { // ---------------------------------------------- Pirate
     feats2 = ["None"
     ,"Stole a town's supplies."
     ,"Defeated a small group of pirates."
     ,"Defeated a Marine's Captain."
     ,"Defeated a Shichibukai."
     ,"Defeated a Yonko."
     ,"Is investigating the poneglifs."
     ,"Escaped Impel Down."
     ,"Stormed a Marine's fortress."
     ,"Defeated a notorious pirate."
     ,"Stole a rare devil fruit from the Government."];
  } else if(alliance2 === "Bounty Hunter") { // ---------------------------------------------- Bounty Hunter
     feats2 = ["None"
     ,"Captured a 40,000,000 bounty criminal."
     ,"Defeated a small group of pirates."
     ,"Defeated a Marine's Captain."
     ,"Captured a 20,000,000 bounty criminal."
     ,"Captured a 5,000,000 bounty criminal."];
  } else if(alliance === "Cipher Pol") { // ---------------------------------------------- Cipher Pol
     feats = ["None"
     ,"Adquired information about a poneglif."
     ,"Spied on a Yonko."
     ,"Contained a possible leak of sensitive Government information."
     ,"Completed a secret mission from the Government."
     ,"Defeated a notorious pirate."
     ,"Adquired information about one of the Ancient weapons."];
  } else if(alliance2 === "World Nobles") { // ---------------------------------------------- World Nobles
     feats2 = ["None"
     ,"Attacked a neighboring country."
     ,"Denied his past and royal family."
     ,"Destroyed an enemy's facility."
     ,"Allied with pirates."];
  } 

  feat2 = capFirst(feats2[getRandomInt(0, feats2.length + 1)]);
      document.getElementById("feat2").innerHTML = feat2;
}

// Feat 3 -----

function assignfeat3(){
     
 if (alliance3 === "Revolutionary Army") { // ---------------------------------------------- Revolutionary Army
     feats3 = ["None"
     ,"Attacked a Government country."
     ,"Leaked sensitive Government information."
     ,"Stole a rare devil fruit from the Government."
     ,"Participated in a war."
     ,"Released slaves from a Government ally."];
  } else if(rank3 === "Admiral" || rank3 === "Fleet Admiral") { // ---------------------------------------------- Marine Admiral and Fleet Admiral
     feats3 = ["None"
     ,"Held up on a fight against a Yonko. And came out alive."
     ,"With the help of another Admiral defeated a Yonko."
     ,"Helped save a country."
     ,"Captured a 500,000,000 bounty pirate all alone."
     ,"Captured a 800,000,000 bounty pirate all alone."
     ,"Team'd up with a pirate do defeat a notorious pirate."
     ,"Protected the Celestial Dragons on an attemped attack on Mariejois."]; 
  } else if(alliance3 === "Marine") { // ---------------------------------------------- Marine
     feats3 = ["None"
     ,"Captured a 40,000,000 bounty pirate all alone."
     ,"Defeated a small group of pirates."
     ,"Helped save a country."
     ,"Captured a 20,000,000 bounty pirate all alone."];
  } else if(alliance3 === "Pirate") { // ---------------------------------------------- Pirate
     feats3 = ["None"
     ,"Stole a town's supplies."
     ,"Defeated a small group of pirates."
     ,"Defeated a Marine's Captain."
     ,"Defeated a Shichibukai."
     ,"Defeated a Yonko."
     ,"Is investigating the poneglifs."
     ,"Escaped Impel Down."
     ,"Stormed a Marine's fortress."
     ,"Defeated a notorious pirate."
     ,"Stole a rare devil fruit from the Government."];
  } else if(alliance3 === "Bounty Hunter") { // ---------------------------------------------- Bounty Hunter
     feats3 = ["None"
     ,"Captured a 40,000,000 bounty criminal."
     ,"Defeated a small group of pirates."
     ,"Defeated a Marine's Captain."
     ,"Captured a 20,000,000 bounty criminal."
     ,"Captured a 5,000,000 bounty criminal."];
  } else if(alliance === "Cipher Pol") { // ---------------------------------------------- Cipher Pol
     feats = ["None"
     ,"Adquired information about a poneglif."
     ,"Spied on a Yonko."
     ,"Contained a possible leak of sensitive Government information."
     ,"Completed a secret mission from the Government."
     ,"Defeated a notorious pirate."
     ,"Adquired information about one of the Ancient weapons."];
  } else if(alliance3 === "World Nobles") { // ---------------------------------------------- World Nobles
     feats3 = ["None"
     ,"Attacked a neighboring country."
     ,"Denied his past and royal family."
     ,"Destroyed an enemy's facility."
     ,"Allied with pirates."];
  } 

  feat3 = capFirst(feats3[getRandomInt(0, feats3.length + 1)]);
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
  } else if(race === "Skypiean") {
     var racedoriki = getRandomInt(1, 50 + 1);
  } else if(race === "Lunarian") {
     var racedoriki = getRandomInt(1, 50 + 1);
  } else if(race === "Mink") {
     var racedoriki = getRandomInt(100, 300 + 1);
  } else if(race === "Tontatta") {
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

  if (rank === "Leader") {                            // --- Rank Revolutionary Army
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

  if (devilfruit === "Zoan") {            // --- Devilfruit
     var devilfruitdoriki = getRandomInt(10, 100 + 1);
  } else if(devilfruit === "Ancient Zoan") {
     var devilfruitdoriki = getRandomInt(100, 1000 + 1);
  } else if(devilfruit === "Mythical Zoan") {
     var devilfruitdoriki = getRandomInt(100, 1000 + 1);
  } else if(devilfruit === "Paramecia") {
     var devilfruitdoriki = getRandomInt(10, 1000 + 1);
  } else if(devilfruit === "Special Paramecia") {
     var devilfruitdoriki = getRandomInt(50, 1000 + 1);
  } else if(devilfruit === "Logia") {
     var devilfruitdoriki = getRandomInt(50, 1000 + 1);
  } else {
     var devilfruitdoriki = getRandomInt(0, 0 + 1);
  }

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
     var featdoriki = getRandomInt(0, 0 + 1);
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

  if (rank2 === "Leader") {                            // --- Rank Revolutionary Army
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
     var featdoriki2 = getRandomInt(0, 0 + 1);
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

  if (rank3 === "Leader") {                            // --- Rank Revolutionary Army
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
     var featdoriki3 = getRandomInt(0, 0 + 1);
  }

  dorikifinal3 = dorikifinal2 + rankdoriki3*0.2 + hakidoriki3 + featdoriki3
  adddoriki3 = parseInt(dorikifinal3) - parseInt(dorikifinal2) // Calcula a diferença entre os dorikis no anos 2 e 3
  document.getElementById("dorikifinal3").innerHTML = parseInt(dorikifinal3);
  document.getElementById("adddoriki3").innerHTML = '(+' + parseInt(adddoriki3) + ')';
}


// Bounty New System ----------------------------------------------------------------------------------------------------------------------------------------------------

let dorikibounty = "";
let alliancebounty = "";
let devilfruitbounty = "";
let featbounty = "";
let bountyfinal = "";

function addbounty() {

  if (alliance === "Revolutionary Army") {            // --- Alliance
     var alliancebounty = getRandomInt(1, 10 + 1);
  } else if(alliance === "Pirate") {
     var alliancebounty = getRandomInt(1, 5 + 1);
  } else {
     var alliancebounty = getRandomInt(0, 0 + 1);
  }

  if (devilfruit === "Zoan") {            // --- Devilfruit
     var devilfruitbounty = getRandomInt(5, 10 + 1);
  } else if(devilfruit === "Ancient Zoan") {
     var devilfruitbounty = getRandomInt(5, 30 + 1);
  } else if(devilfruit === "Mythical Zoan") {
     var devilfruitbounty = getRandomInt(5, 40 + 1);
  } else if(devilfruit === "Paramecia") {
     var devilfruitbounty = getRandomInt(5, 15 + 1);
  } else if(devilfruit === "Special Paramecia") {
     var devilfruitbounty = getRandomInt(5, 35 + 1);
  } else if(devilfruit === "Logia") {
     var devilfruitbounty = getRandomInt(5, 50 + 1);
  } else {
     var devilfruitbounty = getRandomInt(0, 0 + 1);
  }

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
     var featbounty = getRandomInt(0, 0 + 1);
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
  addbounty = dorikibounty + alliancebounty + devilfruitbounty + featbounty
  document.getElementById("bountyfinal").innerHTML = parseInt(bountyfinal) + ',000,000)';
  document.getElementById("addbounty").innerHTML = '(+' + parseInt(addbounty) + ',000,000)';
}

// Bounty New System 2 -----------------------------------------------------------------------

let dorikibounty2 = "";
let alliancebounty2 = "";
let devilfruitbounty2 = "";
let featbounty2 = "";
let bountyfinal2 = "";

function addbounty2() {

  if (alliance2 === "Revolutionary Army") {            // --- Alliance
     var alliancebounty2 = getRandomInt(1, 10 + 1);
  } else if(alliance2 === "Pirate") {
     var alliancebounty2 = getRandomInt(1, 5 + 1);
  } else {
     var alliancebounty2 = getRandomInt(0, 0 + 1);
  }

  if (devilfruit2 === "Zoan") {            // --- Devilfruit
     var devilfruitbounty2 = getRandomInt(5, 10 + 1);
  } else if(devilfruit2 === "Ancient Zoan") {
     var devilfruitbounty2 = getRandomInt(5, 30 + 1);
  } else if(devilfruit2 === "Mythical Zoan") {
     var devilfruitbounty2 = getRandomInt(5, 40 + 1);
  } else if(devilfruit2 === "Paramecia") {
     var devilfruitbounty2 = getRandomInt(5, 15 + 1);
  } else if(devilfruit2 === "Special Paramecia") {
     var devilfruitbounty2 = getRandomInt(5, 35 + 1);
  } else if(devilfruit2 === "Logia") {
     var devilfruitbounty2 = getRandomInt(5, 50 + 1);
  } else {
     var devilfruitbounty2 = getRandomInt(0, 0 + 1);
  }

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
     var featbounty2 = getRandomInt(0, 0 + 1);
  }

  dorikibounty2 = dorikifinal2 * 0.075
  bountyfinal2 = dorikibounty2 + alliancebounty2 + devilfruitbounty2 + featbounty2

  if (alliance2 === "Marine") {                      // --- Block Alliances
     var bountyfinal2 = bountyfinal;
  } else if(alliance2 === "Cipher Pol") {
     var bountyfinal2 = bountyfinal;
  }
  
  addbounty2 = parseInt(bountyfinal2) - parseInt(bountyfinal) // Calcula a diferença entre as bounties no anos 1 e 2
  document.getElementById("bountyfinal2").innerHTML = parseInt(bountyfinal2) + ',000,000)';
  document.getElementById("addbounty2").innerHTML = '(+' + parseInt(addbounty2) + ',000,000)';
}

// Bounty New System 3 -----------------------------------------------------------------------

let dorikibounty3 = "";
let alliancebounty3 = "";
let devilfruitbounty3 = "";
let featbounty3 = "";
let bountyfinal3 = "";

function addbounty3() {

  if (alliance3 === "Revolutionary Army") {            // --- Alliance
     var alliancebounty3 = getRandomInt(1, 10 + 1);
  } else if(alliance3 === "Pirate") {
     var alliancebounty3 = getRandomInt(1, 5 + 1);
  } else {
     var alliancebounty3 = getRandomInt(0, 0 + 1);
  }

  if (devilfruit3 === "Zoan") {            // --- Devilfruit
     var devilfruitbounty3 = getRandomInt(5, 10 + 1);
  } else if(devilfruit3 === "Ancient Zoan") {
     var devilfruitbounty3 = getRandomInt(5, 30 + 1);
  } else if(devilfruit3 === "Mythical Zoan") {
     var devilfruitbounty3 = getRandomInt(5, 40 + 1);
  } else if(devilfruit3 === "Paramecia") {
     var devilfruitbounty3 = getRandomInt(5, 15 + 1);
  } else if(devilfruit3 === "Special Paramecia") {
     var devilfruitbounty3 = getRandomInt(5, 35 + 1);
  } else if(devilfruit3 === "Logia") {
     var devilfruitbounty3 = getRandomInt(5, 50 + 1);
  } else {
     var devilfruitbounty3 = getRandomInt(0, 0 + 1);
  }

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
     var featbounty3 = getRandomInt(0, 0 + 1);
  }

  dorikibounty3 = dorikifinal3 * 0.075
  bountyfinal3 = dorikibounty3 + alliancebounty3 + devilfruitbounty3 + featbounty3

  if (alliance3 === "Marine") {                      // --- Block Alliances
     var bountyfinal3 = bountyfinal2;
  } else if(alliance3 === "Cipher Pol") {
     var bountyfinal3 = bountyfinal2;
  }
  
  addbounty3 = parseInt(bountyfinal3) - parseInt(bountyfinal2) // Calcula a diferença entre as bounties no anos 2 e 3
  document.getElementById("bountyfinal3").innerHTML = parseInt(bountyfinal3) + ',000,000)';
  document.getElementById("addbounty3").innerHTML = '(+' + parseInt(addbounty3) + ',000,000)';
}

