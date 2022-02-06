let alliance = "";
let rank = "";
let fighting = "";
let haki = "";
let devilfruit = "";
let df = "";
let feat = "";
let alliance2 = "";
let rank2 = "";
let fighting2 = "";
let haki2 = "";
let devilfruit2 = "";
let df2 = "";
let feat2 = "";

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

// Alliance2 -----

function generateAlliance2(){
  if (alliance === "Revolucionary Army") {
     alliances2 = ["Revolucionary Army","Revolucionary Army","Pirate","Bounty Hunter"];
  } else if(alliance === "Marine") {
     alliances2 = ["Marine","Marine","Marine","Revolucionary Army","Pirate","Bounty Hunter","Cipher Pol"];
  } else if(alliance === "Pirate") {
     alliances2 = ["Revolucionary Army","Pirate","Pirate","Bounty Hunter"];
  } else if(alliance === "Bounty Hunter") {
     alliances2 = ["Bounty Hunter","Bounty Hunter","Revolucionary Army","Pirate","Bounty Hunter"];
  } else if(alliance === "Cipher Pol") {
     alliances2 = ["Cipher Pol","Cipher Pol","Marine"];
  } else if(alliance === "World Nobles") {
     alliances2 = ["World Noble","World Noble","Revolucionary Army","Marine","Pirate","Bounty Hunter","Cipher Pol"];
  }

  alliance2 = capFirst(alliances2[getRandomInt(0, alliances2.length + 1)]);
  document.getElementById("alliance2").innerHTML = alliance2;
}


// Rank ---------------------------------------------------------------------------------------------------------------------------------------------------------------

function assignRank(){
     
 if (alliance === "Revolucionary Army") {
     ranks = ["Leader","Chief of Staff","Army Commander","Officer","Member","Associate"];
  } else if(alliance === "Marine") {
     ranks = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Commodore","Captain","Commander",
     "Lieutenant","Ensign","Petty Officer","Seaman","Choreboy","Inspector General","Instructor","Cook"
     ,"Doctor","Scientist","Shipwright"];
  } else if(alliance === "Pirate") {
     ranks = ["Shichibukai","Pirate Captain","First Mate","Swordsman","Sniper","Martial Artist","Navigator","Cook","Doctor","Shipwright","Musician","Aprentice","Pet"];
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


// Rank -----

function assignRank2(){
     
 if (alliance2 === "Revolucionary Army") {
     ranks2 = ["Leader","Chief of Staff","Army Commander","Officer","Member","Associate"];
  } else if(alliance2 === "Marine") {
     ranks2 = ["Fleet Admiral","Admiral","Vice Admiral","Rear Admiral","Commodore","Captain","Commander",
     "Lieutenant","Ensign","Petty Officer","Seaman","Choreboy","Inspector General","Instructor","Cook"
     ,"Doctor","Scientist","Shipwright"];
  } else if(alliance2 === "Pirate") {
     ranks2 = ["Shichibukai","Pirate Captain","First Mate","Swordsman","Sniper","Martial Artist","Navigator","Cook","Doctor","Shipwright","Musician","Aprentice","Pet"];
  } else if(alliance2 === "Bounty Hunter") {
     ranks2 = ["Individual","Guild Leader","Guild Member"];
  } else if(alliance2 === "Cipher Pol") {
     ranks2 = ["CP0","CP1","CP2","CP3","CP4","CP5","CP6","CP7","CP8","CP9"];
  } else if(alliance2 === "World Nobles") {
     ranks2 = ["Celestial Dragon","King/Queen","Prince/Princess","Noble Commander","Soldier"];
  } 

  rank2 = capFirst(ranks2[getRandomInt(0, ranks2.length + 1)]);
  document.getElementById("rank2").innerHTML = rank2;
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

// Fighting -----

function generatefighting2(){

  fightings2 = [fighting]

  fighting2 = capFirst(fightings2[getRandomInt(0, fightings2.length + 1)]);
  document.getElementById("fighting2").innerHTML = fighting2;
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

// Haki ---------------------------------------------------------------------------------------------------------------------------------------------------------------

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


// Devil Fruit ---------------------------------------------------------------------------------------------------------------------------------------------------------------

function capFirst(alli) {
    return alli.charAt(0).toUpperCase() + alli.slice(1);
}

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
     dfs = ["Tori-Tori no Mi - Model: Raven","Uma-Uma no Mi - Model: Pony","Neko-Neko no Mi - Model: Tiger"
     ,"Kani-Kani no Mi - Model: Hermit Crab","Hebi-Hebi no Mi - Model: Viper","Kame-Kame no Mi - Model: Tortoise"
     ,"Croco-Croco no Mi - Model: Alligator","Prima-Prima no Mi - Model: Gorilla","Kuma-Kuma no Mi - Model: Polar Bear"];
  } else if(devilfruit === "Mythical Zoan") {
     dfs = ["Tori-Tori no Mi - Model: Thunderbird","Uma-Uma no Mi - Model: Pegasus","Neko-Neko no Mi - Model: Sphinx"
     ,"Kame-Kame no Mi - Model: Colossal Turtle"];
  } else if(devilfruit === "Ancient Zoan") {
     dfs = ["Mushi-Mushi no Mi - Model: Meganeura","Mushi-Mushi no Mi - Model: Gastropod","Webbo-Webbo no Mi - Model: Megarachne"];
  } else if(devilfruit === "Paramecia") {
     dfs = ["Obbi-Obbi no Mi","Depra-Depra no Mi","Soda-Soda no Mi","Kako-Kako no Mi","Ana-Ana no Mi","Kyara-Kyara no Mi"
     ,"Emro-Emro no Mi","Enye-Enye no Mi","Rubi-Rubi no Mi","Gamma-Gamma no Mi","Hoshi-Hoshi no Mi","Implo-Implo no Mi"];
  } else if(devilfruit === "Special Paramecia") {
     dfs = ["Jero-Jero no Mi","Nori-Nori no Mi","Huni-Huni no Mi","Pinu-Pinu no Mi","Toryo-Toryo no Mi"];
  } else if(devilfruit === "Logia") {
     dfs = ["Salti-Salti no Mi","Sora-Sora no Mi","Sido-Sido no Mi","Nendo-Nendo no Mi","Doro-Doro no Mi","Plazu-Plazu no Mi","Suigi-Suigi no Mi","Taru-Taru no Mi",
     "Genyu-Genyu no Mi","Shibo-Shibo no Mi","Tanso-Tanso no Mi","Unchi-Unchi no Mi","Hone-Hone no Mi","Moku-Moku no Mi","Nama-Nama no Mi","Sulfu-Sulfu no Mi",
     "Tassi-Tassi no Mi","Gino-Gino no Mi","Noni-Noni no Mi","Kaze-Kaze no Mi","Ketsu-Ketsu no Mi","Inku-Inku no Mi","Kusa-Kusa no Mi","Iwa-Iwa no Mi","Kessho-Kessho no Mi"
     ,"Foru-Foru no Mi","Enso-Enso no Mi","Choku-Choku no Mi","Hoko-Hoko no Mi","Jushi-Jushi no Mi","Nuclee-Nuclee no Mi","Suraimu-Suraimu no Mi","Mera-Mera no Mi"];
  } else if(devilfruit === "No") {
     dfs = ["None"];
  } 

  df = capFirst(dfs[getRandomInt(0, dfs.length + 1)]);
  document.getElementById("df").innerHTML = df;
}

// Devil Fruit2 -----

function capFirst(alli) {
    return alli.charAt(0).toUpperCase() + alli.slice(1);
}

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

/* Specific Devil Fruit */

function assigndevilfruit2(){


  

  if(devilfruit2 === "Zoan" && devilfruit === "No") {
     dfs2 = ["Tori-Tori no Mi - Model: Raven","Uma-Uma no Mi - Model: Pony","Neko-Neko no Mi - Model: Tiger"
     ,"Kani-Kani no Mi - Model: Hermit Crab","Hebi-Hebi no Mi - Model: Viper","Kame-Kame no Mi - Model: Tortoise"
     ,"Croco-Croco no Mi - Model: Alligator","Prima-Prima no Mi - Model: Gorilla","Kuma-Kuma no Mi - Model: Polar Bear"];
  } else if(devilfruit2 === "Mythical Zoan" && devilfruit === "No") {
     dfs2 = ["Tori-Tori no Mi - Model: Thunderbird","Uma-Uma no Mi - Model: Pegasus","Neko-Neko no Mi - Model: Sphinx"
     ,"Kame-Kame no Mi - Model: Colossal Turtle"];
  } else if(devilfruit2 === "Ancient Zoan" && devilfruit === "No") {
     dfs2 = ["Mushi-Mushi no Mi - Model: Meganeura","Mushi-Mushi no Mi - Model: Gastropod","Webbo-Webbo no Mi - Model: Megarachne"];
  } else if(devilfruit2 === "Paramecia" && devilfruit === "No") {
     dfs2 = ["Obbi-Obbi no Mi","Depra-Depra no Mi","Soda-Soda no Mi","Kako-Kako no Mi","Ana-Ana no Mi","Kyara-Kyara no Mi"
     ,"Emro-Emro no Mi","Enye-Enye no Mi","Rubi-Rubi no Mi","Gamma-Gamma no Mi","Hoshi-Hoshi no Mi","Implo-Implo no Mi"];
  } else if(devilfruit2 === "Special Paramecia" && devilfruit === "No") {
     dfs2 = ["Jero-Jero no Mi","Nori-Nori no Mi","Huni-Huni no Mi","Pinu-Pinu no Mi","Toryo-Toryo no Mi"];
  } else if(devilfruit2 === "Logia" && devilfruit === "No") {
     dfs2 = ["Salti-Salti no Mi","Sora-Sora no Mi","Sido-Sido no Mi","Nendo-Nendo no Mi","Doro-Doro no Mi","Plazu-Plazu no Mi","Suigi-Suigi no Mi","Taru-Taru no Mi",
     "Genyu-Genyu no Mi","Shibo-Shibo no Mi","Tanso-Tanso no Mi","Unchi-Unchi no Mi","Hone-Hone no Mi","Moku-Moku no Mi","Nama-Nama no Mi","Sulfu-Sulfu no Mi",
     "Tassi-Tassi no Mi","Gino-Gino no Mi","Noni-Noni no Mi","Kaze-Kaze no Mi","Ketsu-Ketsu no Mi","Inku-Inku no Mi","Kusa-Kusa no Mi","Iwa-Iwa no Mi","Kessho-Kessho no Mi"
     ,"Foru-Foru no Mi","Enso-Enso no Mi","Choku-Choku no Mi","Hoko-Hoko no Mi","Jushi-Jushi no Mi","Nuclee-Nuclee no Mi","Suraimu-Suraimu no Mi","Mera-Mera no Mi"];
  } else if(devilfruit2 === "No") {
     dfs2 = ["None"];
  } else if (devilfruit === devilfruit2) {
     dfs2 = [df];
  }   

  df2 = capFirst(dfs2[getRandomInt(0, dfs2.length + 1)]);
  document.getElementById("df2").innerHTML = df2;
}
    

// Feat ---------------------------------------------------------------------------------------------------------------------------------------------------------------

function assignfeat(){
     
 if (alliance === "Revolucionary Army") { // ---------------------------------------------- Revolucionary Army
     feats = ["None"
     ,"Attacked a Government country."
     ,"Leaked sensitive Government information."
     ,"Stole a rare devil fruit from the Government."
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
     ,"Stormed a Marine's fortress."
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
     ,"Defeated a notorious pirate."];
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

// Feat -----

function assignfeat2(){
     
 if (alliance2 === "Revolucionary Army") { // ---------------------------------------------- Revolucionary Army
     feats2 = ["None"
     ,"Attacked a Government country."
     ,"Leaked sensitive Government information."
     ,"Stole a rare devil fruit from the Government."
     ,"Participated in a war."
     ,"Released slaves from a Government ally."];
  } else if(alliance2 === "Marine") { // ---------------------------------------------- Marine
     feats2 = ["None"
     ,"Captured a 40,000,000 bounty pirate all by himself."
     ,"Defeated a small group of pirates."
     ,"Helped save a country."
     ,"Captured a 20,000,000 bounty pirate all by himself."];
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
  } else if(alliance2 === "Cipher Pol") { // ---------------------------------------------- Cipher Pol
     feats2 = ["None"
     ,"Adquired information about a poneglif."
     ,"Spied on a Yonko."
     ,"Contained a possible leak of sensitive Government information."
     ,"Completed a secret mission from the Government."
     ,"Defeated a notorious pirate."];
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



// Bounty New System ----------------------------------------------------------------------------------------------------------------------------------------------------

let alliancebounty = "";
let rankbounty = "";
let hakibounty = "";
let devilfruitbounty = "";
let featbounty = "";
let bountyfinal = "";
let alliancebounty2 = "";
let rankbounty2 = "";
let hakibounty2 = "";
let devilfruitbounty2 = "";
let featbounty2 = "";
let bountyfinal2 = "";

function addbounty() {

  if (alliance === "Revolucionary Army") {            // --- Alliance
     var alliancebounty = getRandomInt(1, 10 + 1);
  } else if(alliance === "Pirate") {
     var alliancebounty = getRandomInt(1, 5 + 1);
  } else {
     var alliancebounty = getRandomInt(0, 0 + 1);
  }

  if (rank === "Leader") {                            // --- Rank Revolucionary Army
     var rankbounty = getRandomInt(100, 500 + 1);
  } else if(rank === "Chief of Staff") {
     var rankbounty = getRandomInt(100, 400 + 1);
  } else if(rank === "Army Commander") {
     var rankbounty = getRandomInt(50, 200 + 1);
  } else if(rank === "Member") {
     var rankbounty = getRandomInt(0, 30 + 1);
  } else if(rank === "Associate") {
     var rankbounty = getRandomInt(0, 80 + 1);
  } else if(rank === "Shichibukai") {                  // --- Rank Pirate
     var rankbounty = getRandomInt(100, 250 + 1);
  } else if(rank === "Pirate Captain") {
     var rankbounty = getRandomInt(100, 250 + 1);
  } else if(rank === "First Mate") {
     var rankbounty = getRandomInt(50, 200 + 1);
  } else {
     var rankbounty = getRandomInt(0, 0 + 1);
  }

  if (haki === "Conquerors + Armament + Observation") {   // --- Haki
     var hakibounty = getRandomInt(200, 500 + 1);
  } else if(haki === "Observation + Armament") {
     var hakibounty = getRandomInt(50, 100 + 1);
  } else if(haki === "Conquerors + Armament") {
     var hakibounty = getRandomInt(120, 320 + 1);
  } else if(haki === "Conquerors + Observation") {
     var hakibounty = getRandomInt(120, 320 + 1);
  } else if(haki === "Conquerors") {
     var hakibounty = getRandomInt(100, 300 + 1);
  } else if(haki === "Armament") {
     var hakibounty = getRandomInt(50, 150 + 1);
  } else if(haki === "Observation") {
     var hakibounty = getRandomInt(50, 150 + 1);
  } else {
     var hakibounty = getRandomInt(0, 0 + 1);
  }

  if (devilfruit === "Zoan") { 						// --- Devilfruit
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

  if (feat === "Leaked sensitive Government information.") { 		// --- Feat
     var featbounty = getRandomInt(5, 25 + 1);
  } else if(feat === "Defeated a Marine's Captain.") {
     var featbounty = getRandomInt(10, 20 + 1);
  } else if(feat === "Defeated a Shichibukai.") {
     var featbounty = getRandomInt(70, 100 + 1);
  } else if(feat === "Defeated a Yonko.") {
     var featbounty = getRandomInt(500, 1000 + 1);
  } else if(feat === "Is investigating the poneglifs.") {
     var featbounty = getRandomInt(10, 50 + 1);
  } else if(feat === "Escaped Impel Down.") {
     var featbounty = getRandomInt(35, 70 + 1);
  } else if(feat === "Stormed a Marine's fortress.") {
     var featbounty = getRandomInt(10, 50 + 1);
  } else if(feat === "Allied with pirates.") {
     var featbounty = getRandomInt(5, 10 + 1);
  } else if(feat === "Denied his past and royal family.") {
     var featbounty = getRandomInt(0, 5 + 1);
  } else if(feat === "Defeated a notorious pirate.") {
     var featbounty = getRandomInt(50, 200 + 1);
  } else if(feat === "Attacked a neighboring country.") {
     var featbounty = getRandomInt(0, 5 + 1);
  } else if(feat === "Stole a rare devil fruit from the Government.") {
     var featbounty = getRandomInt(25, 100 + 1);              
  } else {
     var featbounty = getRandomInt(0, 0 + 1);
  }

  if (alliance === "Marine") { 		                  // --- Block Alliances
     var alliancebounty = getRandomInt(0, 0 + 1);
     var rankbounty = getRandomInt(0, 0 + 1);
     var hakibounty = getRandomInt(0, 0 + 1);
     var devilfruitbounty = getRandomInt(0, 0 + 1);
     var featbounty = getRandomInt(0, 0 + 1);
  } else if(alliance === "Cipher Pol") {
     var alliancebounty = getRandomInt(0, 0 + 1);
     var rankbounty = getRandomInt(0, 0 + 1);
     var hakibounty = getRandomInt(0, 0 + 1);
     var devilfruitbounty = getRandomInt(0, 0 + 1);
     var featbounty = getRandomInt(0, 0 + 1);
  }
  
  bountyfinal = alliancebounty + rankbounty + hakibounty + devilfruitbounty + featbounty
  addbounty = alliancebounty + rankbounty + hakibounty + devilfruitbounty + featbounty
  document.getElementById("bountyfinal").innerHTML = bountyfinal + ',000,000';
  document.getElementById("addbounty").innerHTML = '(+' + addbounty + ',000,000)';

                        // Variables bounty adds info
  document.getElementById("alliancebounty").innerHTML = '(+' + alliancebounty + ',000,000)';
  document.getElementById("rankbounty").innerHTML = '(+' + rankbounty + ',000,000)';
  document.getElementById("hakibounty").innerHTML = '(+' + hakibounty + ',000,000)';
  document.getElementById("devilfruitbounty").innerHTML = '(+' + devilfruitbounty + ',000,000)';
  document.getElementById("featbounty").innerHTML = '(+' + featbounty + ',000,000)';

}

// Bounty New System -----

function addbounty2() {

  if (alliance2 === "Revolucionary Army") {            // --- Alliance
     var alliancebounty2 = getRandomInt(1, 10 + 1);
  } else if(alliance2 === "Pirate") {
     var alliancebounty2 = getRandomInt(1, 5 + 1);
  } else {
     var alliancebounty2 = getRandomInt(0, 0 + 1);
  }

  if (rank2 === "Leader") {                            // --- Rank Revolucionary Army
     var rankbounty2 = getRandomInt(100, 500 + 1);
  } else if(rank2 === "Chief of Staff") {
     var rankbounty2 = getRandomInt(100, 400 + 1);
  } else if(rank2 === "Army Commander") {
     var rankbounty2 = getRandomInt(50, 200 + 1);
  } else if(rank2 === "Member") {
     var rankbounty2 = getRandomInt(0, 30 + 1);
  } else if(rank2 === "Associate") {
     var rankbounty2 = getRandomInt(0, 80 + 1);
  } else if(rank2 === "Shichibukai") {                  // --- Rank Pirate
     var rankbounty2 = getRandomInt(100, 250 + 1);
  } else if(rank2 === "Pirate Captain") {
     var rankbounty2 = getRandomInt(100, 250 + 1);
  } else if(rank2 === "First Mate") {
     var rankbounty2 = getRandomInt(50, 200 + 1);
  } else {
     var rankbounty2 = getRandomInt(0, 0 + 1);
  }

  if (haki2 === "Conquerors + Armament + Observation") {   // --- Haki
     var hakibounty2 = getRandomInt(200, 500 + 1);
  } else if(haki2 === "Observation + Armament") {
     var hakibounty2 = getRandomInt(50, 100 + 1);
  } else if(haki2 === "Conquerors + Armament") {
     var hakibounty2 = getRandomInt(120, 320 + 1);
  } else if(haki2 === "Conquerors + Observation") {
     var hakibounty2 = getRandomInt(120, 320 + 1);
  } else if(haki2 === "Conquerors") {
     var hakibounty2 = getRandomInt(100, 300 + 1);
  } else if(haki2 === "Armament") {
     var hakibounty2 = getRandomInt(50, 150 + 1);
  } else if(haki2 === "Observation") {
     var hakibounty2 = getRandomInt(50, 150 + 1);
  } else {
     var hakibounty2 = getRandomInt(0, 0 + 1);
  }

  if (devilfruit2 === "Zoan") {             // --- Devilfruit
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

  if (feat2 === "Leaked sensitive Government information.") {     // --- Feat
     var featbounty2 = getRandomInt(5, 25 + 1);
  } else if(feat2 === "Defeated a Marine's Captain.") {
     var featbounty2 = getRandomInt(10, 20 + 1);
  } else if(feat2 === "Defeated a Shichibukai.") {
     var featbounty2 = getRandomInt(70, 100 + 1);
  } else if(feat2 === "Defeated a Yonko.") {
     var featbounty2 = getRandomInt(500, 1000 + 1);
  } else if(feat2 === "Is investigating the poneglifs.") {
     var featbounty2 = getRandomInt(10, 50 + 1);
  } else if(feat2 === "Escaped Impel Down.") {
     var featbounty2 = getRandomInt(35, 70 + 1);
  } else if(feat2 === "Stormed a Marine's fortress.") {
     var featbounty2 = getRandomInt(10, 50 + 1);
  } else if(feat2 === "Allied with pirates.") {
     var featbounty2 = getRandomInt(5, 10 + 1);
  } else if(feat2 === "Denied his past and royal family.") {
     var featbounty2 = getRandomInt(0, 5 + 1);
  } else if(feat2 === "Defeated a notorious pirate.") {
     var featbounty2 = getRandomInt(50, 200 + 1);
  } else if(feat2 === "Attacked a neighboring country.") {
     var featbounty2 = getRandomInt(0, 5 + 1);
  } else if(feat2 === "Stole a rare devil fruit from the Government.") {
     var featbounty2 = getRandomInt(25, 100 + 1);              
  } else {
     var featbounty2 = getRandomInt(0, 0 + 1);
  }

  if (alliance2 === "Marine") {                       // --- Block Alliances
     var alliancebounty2 = getRandomInt(0, 0 + 1);
     var rankbounty2 = getRandomInt(0, 0 + 1);
     var hakibounty2 = getRandomInt(0, 0 + 1);
     var devilfruitbounty2 = getRandomInt(0, 0 + 1);
     var featbounty2 = getRandomInt(0, 0 + 1);
  } else if(alliance2 === "Cipher Pol") {
     var alliancebounty2 = getRandomInt(0, 0 + 1);
     var rankbounty2 = getRandomInt(0, 0 + 1);
     var hakibounty2 = getRandomInt(0, 0 + 1);
     var devilfruitbounty2 = getRandomInt(0, 0 + 1);
     var featbounty2 = getRandomInt(0, 0 + 1);
  }

  addbounty2 = alliancebounty2 + rankbounty2 + hakibounty2 + devilfruitbounty2 + featbounty2
  bountyfinal2 = addbounty2 + bountyfinal
  document.getElementById("bountyfinal2").innerHTML = bountyfinal2 + ',000,000';
  document.getElementById("addbounty2").innerHTML = '(+' + addbounty2 + ',000,000)';

                        // Variables bounty adds info
  document.getElementById("alliancebounty2").innerHTML = '(+' + alliancebounty2 + ',000,000)';
  document.getElementById("rankbounty2").innerHTML = '(+' + rankbounty2 + ',000,000)';
  document.getElementById("hakibounty2").innerHTML = '(+' + hakibounty2 + ',000,000)';
  document.getElementById("devilfruitbounty2").innerHTML = '(+' + devilfruitbounty2 + ',000,000)';
  document.getElementById("featbounty2").innerHTML = '(+' + featbounty2 + ',000,000)';

}