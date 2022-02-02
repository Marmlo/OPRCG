function capFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

function race(){
      var race = ["Human","Giant","Ancient Giant","Frost Giant","Fishman","Merfolk","Skipean", "Lunarian", "Mink", "Tonnata", "Oni", "Cyborg", "Hybrid"];

      var race = capFirst(race[getRandomInt(0, race.length + 1)]);
        document.getElementById("race").innerHTML = race;
    }