function capFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

function race(){
      var race = ["Human","Giant","Ancient Giant","Frost Giant","Fishman","Merfolk","Skipean", "Lunarian", "Mink", "Tonnata", "Oni", "Cyborg", "Hybrid"
      ,"Human","Giant","Human","Human","Fishman","Merfolk","Fishman", "Human", "Hybrid", "Fishman", "Human", "Human", "Hybrid"
      ,"Human","Giant","Human","Human"];

      var race = capFirst(race[getRandomInt(0, race.length + 1)]);
        document.getElementById("race").innerHTML = race;
    }



    /* 

    Odds:
      Human             - 10/30 - 33%
      Giant     		- 3/30 - 09%   	
      Ancient Giant 	- 1/30 - 03%   	
      Frost Giant       - 1/30 - 03%	
      Fishman 			- 4/30 - 12%	
      Merfolk           - 2/30 - 06%	
      Skipean 			- 1/30 - 03%	
      Lunarian			- 1/30 - 03%	
      Mink				- 1/30 - 03%	
      Tonnata			- 1/30 - 03%	
      Oni				- 1/30 - 04%	
      Cyborg			- 1/30 - 04%	
      Hybrid            - 3/30 - 09%	

    */

    