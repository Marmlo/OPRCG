let alliance = "";
let rank = "";
let fighting = "";
let haki = "";
let feat = "";


// Alliance ---------------------------------------------------------------------------------------------------------------------------------------------------------------

function capFirst(alli) {
    return alli.charAt(0).toUpperCase() + alli.slice(1);
}

function generateAlliance(){
      var alliances = ["Revolucionary Army","Marine","Pirate","Bounty Hunter","Cipher Pol","World Nobles"
      				,"Revolucionary Army","Marine","Pirate","Bounty Hunter","Marine","Pirate"];

      alliance = capFirst(alliances[getRandomInt(0, alliances.length + 1)]);
      document.getElementById("alliance").innerHTML = alliance;
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


// Rank ---------------------------------------------------------------------------------------------------------------------------------------------------------------

function assignRank(){

 
     
 if (alliance === "Revolucionary Army") {
     ranks = ["Leader","Chief of Staff","Army Commander","Officer","Member","Associate"];
  } else if(alliance === "Marine") {
     ranks = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Commodore","Captain","Commander",
     "Lieutenant","Ensign","Petty Officer","Seaman","Choreboy","Inspector General","Instructor","Cook"
     ,"Doctor","Scientist","Shipwright"];
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
  } else {                         // --------------------------------------------- Rest
  	 fightings = ["Swordsmanship","Gunsmanship","Six power","Dragon Claw","Fishman karate","Freestyle","Black leg","Fists","Samurai"]
  }

  fighting = capFirst(fightings[getRandomInt(0, fightings.length + 1)]);
  document.getElementById("fighting").innerHTML = fighting;
}

// Haki ---------------------------------------------------------------------------------------------------------------------------------------------------------------

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

// Feat ---------------------------------------------------------------------------------------------------------------------------------------------------------------

function assignfeat(){

 
     
 if (alliance === "Revolucionary Army") { // ---------------------------------------------- Revolucionary Army
     feats = ["None"
     ,"Attacked a Government country."
     ,"Leaked sensitive Government information."
     ,"Stole a rare evil fruit from the Government."
     ,"Participated in a war."
     ,"Released slaves from a Government ally."];
  } else if(alliance === "Marine") { // ---------------------------------------------- Marine
     feats = ["None"
     ,"Captured a 40,000,000 bounty pirate all by himself."
     ,"Defeated a small group of pirates."
     ,"Helped save a country."
     ,"Captured a 20,000,000 bounty pirate all by himself."];
  } else if(alliance === "Pirate") { // ---------------------------------------------- Pirate
     feats = ["None"
     ,"Stole a town's supplies."
     ,"Defeated a small group of pirates."
     ,"Defeated a Marine's Captain."
     ,"Defeated a Shichibukai."
     ,"Defeated a Yonko."
     ,"Is investigating the poneglifs."
     ,"Escaped Impel Down."
     ,"Stormed a Marine's fortress."];
  } else if(alliance === "Bounty Hunter") { // ---------------------------------------------- Bounty Hunter
     feats = ["None"
     ,"Captured a 40,000,000 bounty criminal."
     ,"Defeated a small group of pirates."
     ,"Defeated a Marine's Captain."
     ,"Captured a 20,000,000 bounty criminal."
     ,"Captured a 5,000,000 bounty criminal."];
  } else if(alliance === "Cipher Pol") { // ---------------------------------------------- Cipher Pol
     feats = ["None"
     ,"Adquired information about one poneglif."
     ,"Spied on a Yonko."
     ,"Contained a possible leak of sensitive Government information."
     ,"Completed a secret mission from the Government."
     ,"Defeated a notorious pirate."];
  } else if(alliance === "World Nobles") { // ---------------------------------------------- World Nobles
     feats = ["None"
     ,"Attacked a neighboring country."
     ,"Denied his past and royal family."
     ,"Destroyed an enemy's facility."
     ,"Completed a secret mission from the Government."
     ,"Allied with pirates."];
  } 

  feat = capFirst(feats[getRandomInt(0, feats.length + 1)]);
      document.getElementById("feat").innerHTML = feat;
}


// Bounty ---------------------------------------------------------------------------------------------------------------------------------------------------------------

function calcSum() {

  var bounty1 = getRandomInt(0, 300 + 1);
  var bounty2 = getRandomInt(0, 300 + 1);
  var bounty3 = getRandomInt(0, 600 + 1);
  var bounty = bounty1
  var bounty22 = bounty + bounty2
  var bounty33 = bounty22 + bounty3
  document.getElementById("bounty").innerHTML = bounty + ',000,000';
  document.getElementById("bounty22").innerHTML = bounty22 + ',000,000';
  document.getElementById("bounty33").innerHTML = bounty33 + ',000,000';
  document.getElementById("bounty1").innerHTML = '+' + bounty1 + ',000,000';
  document.getElementById("bounty2").innerHTML = '+' + bounty2 + ',000,000';
  document.getElementById("bounty3").innerHTML = '+' + bounty3 + ',000,000';
}




function image()
{
    //dynamically add an image and set its attribute
    var img=document.createElement("img");
    img.src="images/Beli.webp"
    img.id="picture"
    var foo = document.getElementById("fooBar");
    foo.appendChild(img);
}