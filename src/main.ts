import 'flowbite';
import './style.css';
import * as character from './character';

// Page building ---------------------------------------------------------------

function makeButtons() {
    const buttons = {
        "gen-all-button":"All",
        "race":"Race",
        "hybrid1":"Race", "hybrid2":"Race",
        "affiliation1":"Affiliation", "affiliation2":"Affiliation", "affiliation3":"Affiliation",
        "position1":"Position", "position2":"Position", "position3":"Position",
        "fighting1":"Fighting Style", "fighting2":"Fighting Style", "fighting3":"Fighting Style",
        "haki1":"Haki", "haki2":"Haki", "haki3":"Haki",
        "dftype1":"DF Type", "dftype2":"DF Type", "dftype3":"DF Type",
        "df1":"DF Name", "df2":"DF Name", "df3":"DF Name",
        "doriki1":"Dōriki", "doriki2":"Dōriki", "doriki3":"Dōriki",
        "bounty1":"Bounty", "bounty2":"Bounty", "bounty3":"Bounty", // Later: hide bounty if cannot have bounty!!
        "export-button":"file"
    };
    for (const [id, name] of Object.entries(buttons)) {
        var button = document.createElement('button');
        var div = document.getElementById(id);
        button.className = 'font-bold text-orange-50 w-full bg-orange-600 hover:bg-orange-300 hover:text-black hover:border-3 hover:border-orange-600 focus:border-3 focus:border-orange-400 focus:outline-0';
        if (name === "All") {
            button.className = button.className + ' rounded-t-3xl';
        } else if (id === "export-button") {
            button.className = button.className + ' rounded-b-3xl';
        } else if (id === "race") {
            button.className = button.className + ' rounded-br-3xl';
        } else if (id === "hybrid2") {
            button.className = button.className + ' rounded-br-3xl';
        } else if (id === "affiliation3") {
            button.className = button.className + ' rounded-tr-3xl';
        }
        button.innerHTML = 'Generate ' + name;
        button.addEventListener('click', () => {
            character.gen(id);
            button.blur(); 
        });
        div.appendChild(button);
    }

    genders = document.getElementById('genders');
    genders.addEventListener('change', () => {
        if (genders.value === "CU"){
            document.getElementById("custom-gender").style.display = "";
        } else {
            document.getElementById("custom-gender").style.display = "none";
        };
        genders.blur(); 
    });
}

makeButtons();
