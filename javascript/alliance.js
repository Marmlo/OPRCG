let alliance = "";
let rank = "";
let fighting = "";
let haki = "";

function capFirst(alli) {
    return alli.charAt(0).toUpperCase() + alli.slice(1);
}

function generateAlliance(){
      var alliances = ["Revolucionary Army","Marine","Pirate","Bounty Hunter","Cipher Pol","World Nobles"];

      alliance = capFirst(alliances[getRandomInt(0, alliances.length + 1)]);
      document.getElementById("alliance").innerHTML = alliance;
}

function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
}


/* Rank */

function assignRank(){

 
     
 if (alliance === "Revolucionary Army") {
     ranks = ["Leader","Chief of Staff","Army Commander","Officer","Member","Associate"];
  } else if(alliance === "Marine") {
     ranks = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Commodore","Captain","Commander",
     "Lieutenant","Ensign","Petty Officer","Seaman","Choreboy","Inspector General","Instructor","Cook"
     ,"Doctor","Scientist","Shipwright","Custodian"];
  } else if(alliance === "Pirate") {
     ranks = ["Shichibukai","Captain","First Mate","Swordsman","Sniper","Martial Artist","Navigator","Cook","Doctor","Shipwright","Musician","Aprentice","Pet"];
  } else if(alliance === "Bounty Hunter") {
     ranks = ["Individual","Baroque Works","Franky Family","Accino Family","Cidre Guild"];
  } else if(alliance === "Cipher Pol") {
     ranks = ["CP0","CP1","CP2","CP3","CP4","CP5","CP6","CP7","CP8","CP9"];
  } else if(alliance === "World Nobles") {
     ranks = ["Celestial Dragon","King/Queen","Prince/Princess","Army Commander","Soldier"];
  } 

  rank = capFirst(ranks[getRandomInt(0, ranks.length + 1)]);
  document.getElementById("rank").innerHTML = rank;
}

/* Fighting */ 

function generatefighting(){

 
     
 if (alliance === "Cipher Pol") {
     fightings = ["Six power"];
  } else if(rank === "Swordsman") {
     fightings = ["Swordsmanship","Samurai"];
  } else if(rank === "Sniper") {
     fightings = ["Gunsmanship"];  
  } else if(rank === "Seaman") {
     fightings = ["Gunsmanship","Swordsmanship"];  
  } else {
  	 fightings = ["Swordsmanship","Gunsmanship","Six power","Dragon Claw","Fishman karate","Freestyle","Black leg","Fists","Samurai"]
  }

  fighting = capFirst(fightings[getRandomInt(0, fightings.length + 1)]);
  document.getElementById("fighting").innerHTML = fighting;
}

/* Haki */

function assignhaki(){

 
     
 if (fighting === "Dragon Claw") {
     hakis = ["Observation + Armament","Armament","Armament","Armament","Armament","Conquerors + Armament","Armament",
     "Observation + Armament","Armament","Armament","Armament","Observation + Armament","Conquerors + Armament","Armament",
     "Observation + Armament","Armament","Armament","Armament","Armament","Armament","Armament","Armament",
     "Conquerors + Armament","Armament","Conquerors + Armament + Observation"];
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

	*/