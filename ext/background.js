const api_url = "http://127.0.0.1:8000/get_data";
var global_data = "error";
//              regio   fase    brief   hpz nummer
var geheugen = ["",     "",     "",     ""];
//           adres  titel   inhoud
var email = ["",    "",     "Geen waardes ingelezen. Klik eerst op de knop Kopieer terwijl je het HPZone tabblad open hebt."];

// get emails from API
function refreshData(){
    let request = new XMLHttpRequest();
    request.open("GET", api_url);
    request.send();
    request.onload = () => {
    if (request.status == 200) {
        //console.log(JSON.parse(request.response));
        global_data = JSON.parse(request.response);
    } else {
        console.log(`Error ${request.status} ${request.statusText}`);
    }
    }
}
refreshData();


// Communication to popup
chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) { 
        if (msg[0] == "get_box_data"){
            port.postMessage(["box_data",global_data, geheugen]);
         }
         else if (msg[0] == "set_regio") {
            geheugen[0] = msg[1];
         }
         else if (msg[0] == "set_fase") {
            geheugen[1] = msg[1];
            geheugen[2] = ""
         }
         else if (msg[0] == "set_brief") {
            geheugen[2] = msg[1];
         }
         else if (msg[0] == "set_hpz") {
            geheugen[3] = msg[1];
         }
         else if (msg[0] == "kopieer") {
            sendMessageToTab(["extract_data"]);
         }
         
    });
})

//Communication to content
chrome.runtime.onMessage.addListener(
    function(msg) {
        if (msg[0] == "return_data") {
            let hpz_naam = msg[1];
            let hpz_email = msg[2];
            prepareEmail(hpz_naam, hpz_email)
            
        }

  });
function sendMessageToTab(message) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, message);  
    });
}

function prepareEmail(naam, email) {
    email = "test@test.nl" //////////////////////////////////////// REMOVE
    //get brief
    let geheugen_regio = geheugen[0];
    let geheugen_fase = geheugen[1];
    let geheugen_brief_naam = geheugen[2];
    let hpz_nummer = geheugen[3];
    let velden = getReplaceDataVelden(naam, hpz_nummer, geheugen_regio);
    let brief = getBriefFromGeheugen(geheugen_fase, geheugen_brief_naam);
    brief = replaceVeldenInBrief(brief, velden);

    // TODO: verzend brief als concept naar Graph API
    //json_body = getJSONFormat(brief.titel, brief.inhoud, email) 
    //sendEmailToConcepts(json_body);
}

function sendEmailToConcepts(body) {
    let conn_url = "https://outlook.office.com/api/v2.0/me/sendmail";
    let connection = new XMLHttpRequest;        
    connection.open("POST", conn_url);
    connection.setRequestHeader("Content-Type", "application/json");
    connection.send(body);
}

function getJSONFormat(titel, body, email){
    format = {
        "subject": "",
        "body": {
            "ContentType": "HTML",
            "Content" : ""
        },
        "ToRecipients": [{
            "EmailAddress": {
                "Address": ""
            }
        }]
    }
    format.subject = titel;
    format.body.Content = body;
    format.ToRecipients[0].EmailAddress.Address = email;
    return format
}

function getBriefFromGeheugen(fase, brief_naam){    
    let brief;
    for (i=0; i<global_data.brieven.fases.length; i++) {
        if (global_data.brieven.fases[i].fase_naam == fase) {
            for (j=0; j<global_data.brieven.fases[i].brieven.length; j++ ) {
                if (global_data.brieven.fases[i].brieven[j].naam == brief_naam) {
                    brief = global_data.brieven.fases[i].brieven[j];

                }
            }
        }
    }
    return brief
}

function replaceVeldenInBrief(brief, velden) {
    let inhoud = brief.inhoud;
    for (i=0;i<brief.aan_te_passen.length; i++) {
        console.log(brief.aan_te_passen[i].van, velden[brief.aan_te_passen[i].naar]);
        inhoud = inhoud.replaceAll(brief.aan_te_passen[i].van, velden[brief.aan_te_passen[i].naar]);
    }
    brief.inhoud = inhoud;
    return brief
}

function getReplaceDataVelden(naam, hpz_nr, regio_naam) {
    velden = {
        "naam" : "",
        "hpz_nr": "",
        "regio_naam": "",
        "regio_tel_nr": "",
    }
    velden.naam = naam;
    velden.hpz_nr = hpz_nr;
    velden.regio_naam = regio_naam;
    velden.regio_tel_nr = getRegioTelNr(regio_naam);
    return velden
}

function getRegioTelNr(regio) {
    for (i=0; i<global_data.regios.length; i++) {
        if (global_data.regios[i].naam_email == regio) {
            return global_data.regios[i].tel_nr;
        }
    }
}