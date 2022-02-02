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
     dfs = ["Leader","Logia"];
  } else if(devilfruit === "Mythical Zoan") {
     dfs = ["Fleet Admiral","Logia"];
  } else if(devilfruit === "Ancient Zoan") {
     dfs = ["Shichibukai","Logia"];
  } else if(devilfruit === "Paramecia") {
     dfs = ["Individual","Logia"];
  } else if(devilfruit === "Special Paramecia") {
     dfs = ["CP0","Logia"];
  } else if(devilfruit === "Logia") {
     dfs = ["Salti-Salti","Sora-Sora","Sido-Sido","Nendo-Nendo","Doro-Doro","Plazu-Plazu","Suigi-Suigi","Taru-Taru",
     "Genyu-Genyu","Shibo-Shibo","Tanso-Tanso","Unchi-Unchi","Hone-Hone","Moku-Moku","Nama-Nama","Sulfu-Sulfu",
     "Tassi-Tassi","Gino-Gino","Noni-Noni","Kaze-Kaze","Ketsu-Ketsu","Inku-Inku","Kusa-Kusa","Iwa-Iwa","Kessho-Kessho"
     ,"Foru-Foru","Enso-Enso","Choku-Choku","Hoko-Hoko","Jushi-Jushi","Nuclee-Nuclee","Suraimu-Suraimu"];
  } else if(devilfruit === "No") {
     dfs = ["None"];
  } 

  var df = capFirst(dfs[getRandomInt(0, dfs.length + 1)]);
  document.getElementById("df").innerHTML = df + " no Mi";
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

