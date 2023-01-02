import './style.css'
import typescriptLogo from './typescript.svg'
import * as character from './character'

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

function makeButtons() {
    // For now, only making the Gen All button
    // Later make buttons in a for loop maybe
    var button = document.createElement('button');
    var genAllDiv = document.getElementById('gen-all-button');
    button.className = 'text-white bg-orange-700 hover:bg-orange-300 hover:text-black hover:border-3 hover:border-orange-700 focus:border-3 focus:border-orange-400 focus:outline-0';
    button.innerHTML = 'Generate All';
    button.onclick = function() {
        doLetter(this.innerHTML);
        this.blur();
    }
    genAllDiv.appendChild(button);
}

makeButtons()  


