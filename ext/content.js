// Connection with background
chrome.runtime.onMessage.addListener(
    function(msg) {
        console.log(msg);
        if (msg[0] == "extract_data") {
            let hpz_data = extractData();
            chrome.runtime.sendMessage(["return_data", hpz_data[0], hpz_data[1]]);
        }

  });


// Extraction of data
function extractData() {
    let hpz_titel = document.getElementById('main-container')
        .contentDocument.getElementsByName('disp')[0]
        .contentDocument.getElementsByClassName('PaneTitleHeading')[0].innerHTML;
    hpz_titel = extractNaam(hpz_titel);

    let hpz_email = document.getElementById('main-container')
        .contentDocument.getElementsByName('disp')[0]
        .contentDocument.getElementsByClassName('PaneData');
    hpz_email = extractEmail(hpz_email);
    
    return [hpz_titel, hpz_email]
   
}
function extractNaam(titel) {
    titel = titel.split('.').slice(1).join('.');
    naam = titel.split(':')[0].trim();
    return naam
}
function extractEmail(collection) {
    for (i=0; i<collection.length; i++) {
        if (collection[i].innerHTML.includes('@')) {
            return collection[i].innerHTML;
        }
    }
    return "EMAIL NIET GEVONDEN. KOPIEER HANDMATIG."
}