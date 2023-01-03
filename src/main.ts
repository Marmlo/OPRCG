import 'flowbite';
import './style.css';
import * as character from './character';

// Page building ---------------------------------------------------------------

function makeButtons() {
    // For now, only making the Gen All button
    // Later make buttons in a for loop maybe
    var button = document.createElement('button');
    var genAllDiv = document.getElementById('gen-all-button');
    button.className = 'text-white w-full bg-orange-700 hover:bg-orange-300 hover:text-black hover:border-3 hover:border-orange-700 focus:border-3 focus:border-orange-400 focus:outline-0';
    button.innerHTML = 'Generate All';
    button.addEventListener('click', () => {
        character.genAll();
        button.blur(); //removes focus from the button (focus is opposite of blur) 
    });
    genAllDiv.appendChild(button);
}

makeButtons();
