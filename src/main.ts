import './style.css';
/*import * as character from './character';*/

import racesJson from '/src/data/races.json';
var races = racesJson.list;
var raceWeights = racesJson.weights;
import affiliationsJson from '/src/data/affiliations.json';
console.log(affiliationsJson);
var affiliations = affiliationsJson.main.list;
var affiliationWeights = affiliationsJson.main.weights;

// Page building ---------------------------------------------------------------

function makeButtons() {
    // For now, only making the Gen All button
    // Later make buttons in a for loop maybe
    var button = document.createElement('button');
    var genAllDiv = document.getElementById('gen-all-button');
    button.className = 'text-white bg-orange-700 hover:bg-orange-300 hover:text-black hover:border-3 hover:border-orange-700 focus:border-3 focus:border-orange-400 focus:outline-0';
    button.innerHTML = 'Generate All';
    button.onclick = function() {
        genAll();
        this.blur(); //removes focus from the button (focus is opposite of blur)
    }
    genAllDiv.appendChild(button);
}

// Functions for the generation ------------------------------------------------

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

// Generator functions ---------------------------------------------------------

function genAll() {
    // Probably can be done with a for loop?
    // Will try later when all old code is transferred and fixed
    raceGen();
    allianceGen();
    assignRank();
    generatefighting();
    assignhaki();
    generatedevilfruit();
    assigndevilfruit();
    assignfeat();
    doriki();
    addbounty();
    generateAlliance2();
    assignRank2();
    generatefighting2();
    assignhaki2();
    generatedevilfruit2();
    assigndevilfruit2();
    assignfeat2();
    doriki2();
    addbounty2();
    generateAlliance3();
    assignRank3();
    generatefighting3();
    assignhaki3();
    generatedevilfruit3();
    assigndevilfruit3();
    assignfeat3();
    doriki3();
    addbounty3();
}

function raceGen() {
    document.getElementById("race").innerHTML = weightedRandom(races, raceWeights);
}

makeButtons();
