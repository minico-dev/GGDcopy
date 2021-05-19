// Init
var regio_combo;
var fase_combo;
var brief_combo;
var hpz_input;
var knop_kopieer;
var knop_plak;

var global_data;

function init(){
    regio_combo = document.getElementById("regiocombo");
    fase_combo = document.getElementById("fasecombo");
    brief_combo = document.getElementById("briefcombo");
    hpz_input = document.getElementById("hpzinput");
    knop_kopieer = document.getElementById("knop_kopieer")
    knop_plak = document.getElementById("knop_plak")

    //Listeners
    regio_combo.addEventListener('change', function() {
        let gekozen = regio_combo.options[regio_combo.selectedIndex].value;
        port.postMessage(["set_regio", gekozen]);
    })
    fase_combo.addEventListener('change', function() {
    let gekozen = fase_combo.options[fase_combo.selectedIndex].value;
    fillBrieven(global_data, gekozen);
    port.postMessage(["set_fase", gekozen]);    
    })
    brief_combo.addEventListener('change', function() {
        let gekozen = brief_combo.options[brief_combo.selectedIndex].value;
        port.postMessage(["set_brief", gekozen]);
    })
    hpz_input.addEventListener('change', function() {
        let gekozen = hpz_input.value;
        port.postMessage(["set_hpz", gekozen]);
    })
    knop_kopieer.addEventListener('click', function() {
        port.postMessage(["kopieer", []]);
    })
}
window.onload = init;

// Communication
var port = chrome.extension.connect({
    name: "Popup-Background-Communication"
});
port.onMessage.addListener(function(msg) {
    if (msg[0] == "box_data"){
        let data = msg[1];
        let geheugen = msg[2]
        global_data = data;
        fillRegioFase(data, geheugen);
    } 
    
});



// Functions
function fillRegioFase(data, geheugen){
    for (i=0; i<data.regios.length; i++){
        let option = document.createElement('option');
        option.text = data.regios[i].naam_ext;
        option.value = data.regios[i].naam_email;
        regio_combo.add(option);
    }
    if (geheugen[0] != "") {
        regio_combo.value = geheugen[0];
    }


    for (i=0; i<data.brieven.fases.length; i++){
        let option = document.createElement('option');
        option.text = data.brieven.fases[i].fase_naam;
        option.value = data.brieven.fases[i].fase_naam;
        fase_combo.add(option);
    }
    if (geheugen[1] != "") {
        fase_combo.value = geheugen[1];
        fillBrieven(data, geheugen[1]);
        if (geheugen[2] != "") {
            brief_combo.value = geheugen[2];
        }
    }
    if (geheugen[3] != "") {
        hpz_input.value = geheugen[3];
    }

}
function fillBrieven(data, gekozen_fase){
    brief_combo.options.length = 1;
    for (i=0; i<data.brieven.fases.length; i++){
        if (data.brieven.fases[i].fase_naam == gekozen_fase){
            for (j=0; j< data.brieven.fases[i].brieven.length; j++){
                let option = document.createElement('option');
                option.text = data.brieven.fases[i].brieven[j].naam;
                option.value = data.brieven.fases[i].brieven[j].naam;
                brief_combo.add(option);
            }
        }
    }
}
function fillGeheugen(geheugen) {
    temp_list = [regio_combo, fase_combo, brief_combo, hpz_input];
    for (i=0; i<geheugen.length; i++) {
        if (geheugen[i] != "") {
            temp_list[i].value = geheugen[i];
        }
    }
}
function copyData() {

}

// Rest
port.postMessage(["get_box_data", ""]);