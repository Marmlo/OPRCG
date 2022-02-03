let devilfruit = "";

function capFirst(alli) {
    return alli.charAt(0).toUpperCase() + alli.slice(1);
}

function generatedevilfruit() {
      var devilfruits = ["No","Paramecia","Zoan","No","Paramecia","Ancient Zoan","No","Paramecia","No","Zoan",
      "No","Zoan","No","Special Paramecia","Mythical Zoan","No","Paramecia","No","Zoan","Mythical Zoan",
      "Ancient Zoan","No","Paramecia","Logia","No"];

      devilfruit = capFirst(devilfruits[getRandomInt(0, devilfruits.length + 1)]);
      document.getElementById("devilfruit").innerHTML = devilfruit;
}

function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
}

/* Rank */

function assigndevilfruit(){

 var df = [];
     
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

  var df = capFirst(dfs[getRandomInt(0, dfs.length + 1)]);
  document.getElementById("df").innerHTML = df;
}
    /* 

    Odds:
      Zoan              - 4/25 - 16%
      Mythical Zoan     - 2/25 - 08%
      Ancient Zoan      - 2/25 - 08%
      Paramecia         - 5/25 - 20%
      Special Paramecia - 1/25 - 04%
      Logia             - 1/25 - 04%
      No                - 10/25 - 40%

    */

