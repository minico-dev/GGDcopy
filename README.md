# GGDcopy 2.0.0

GGDcopy is een poging om een subproces van het Bron en Contactonderzoek (BCO) the optimaliseren en gedeeltelijk te automatiseren. 
Deze applicatie bestaat uit twee delen:
1. API
2. Chrome extensie


## API

Het API onderdeel van deze applicatie is opgezet om een betere informatiestroom tussen organisatie en medewerker te verzorgen. De huidige werkwijze schrijft voor dat medewerkers zelf de laatste versie van de brieven downloaden van GGD-GHOR Academy. Deze werkwijze geeft geen garantie dat de medewerker dit ook doet, en het is dus mogelijk dat oude versies van brieven worden gebruikt. Door het gebruikt van de API worden de nieuwste versies van de brieven automatisch opgehaald door de extensie bij het opstarten van Chrome. Hierdoor verschuift het versiebeheer van medewerker naar organisatie.

### Implementatie

De API is opgezet met behulp van FastAPI. Dit is een Python library waarmee snel en effectief API's gebouwd kunnen worden. Om de API lokaal te starten tijdens het ontwikkelen kunnen de volgende stappen doorlopen worden:

1. Gebruik `requirements.txt` om te zorgen dat de juiste versies van de libraries gebruikt worden
2. Vanuit de map `api`, gebruik het volgende commando om de API te starten: `uvicorn main:app --reload`

Enkele handige links:
| Link | Beschrijving |
|------|--------------|
|`127.0.0.1:8000`| Algemene adres van API wanneer deze lokaal loopt|
|`127.0.0.1:8000/get_data`| Verkrijg de data |
|`127.0.0.1:8000/docs`| Ingebouwde FastAPI documentatietool |

### Data

De API gebruikt data uit de map `api\static`. In deze map worden momenteel twee bestanden gebruikt:

1. `regio.json`
Dit bestand bevat een lijst met json data over de regio's en bijbehorende telefoonnummers. Hierbij wordt onderscheid gemaakt tussen de naam van de regio die de medewerker in de extensie te zien krijgt, en de naam die in de email gebruikt wordt. Deze twee waardes zijn meestal gelijk, maar deze functionaliteit is toegevoegd zodat dezelfde regio meerdere telefoonnummers kan gebruiken voor verschillende doelgroepen. Het gebruikte format:

```json
[
    {
        "naam_ext": "Naam voor medewerker in extensie",
        "naam_email": "Naam die gebruikt wordt in de email",
        "tel_nr": "Telefoonnummer"
    }
]
```

Voorbeeld:

```json
{
    "naam_ext": "Hollands Midden (onder 18, docenten, pedagogisch medewerkers)",
    "naam_email": "Hollands Midden",
    "tel_nr": "085 – 078 28 76"
}
```

2. `brieven.json`
Dit bestand bevat alle fases, bijbehorende brieven en daarbij behorende informatie. De brieven zijn op dit moment opgeslagen in een enkele html string. Voor de leesbaarheid van het bestand zou dit bijvoorbeeld ook omgezet kunnen worden naar een lijst van zinnen. In verband met het feit dat brieven constant veranderen, bevat het bestand op dit moment enkel een paar dummy brieven om de functionaliteit te testen. Ten tijde van implementatie dienen deze brieven ge-update te worden met actuele informatie. Het gebruikte format:

```json
{
    "fases": [
        {
            "fase_naam" : "Fase naam",
            "brieven": [
                {
                    "naam"  :"Naam van brief",
                    "titel" :"Titel van brief",
                    "inhoud":"brief in html",
                    "aan_te_passen": [{
                        "van":"Aan te passen velden, veranderen van",
                        "naar":"veranderen naar (naam overeenstemmend met dictionary in extensie)"
                    }]
                }]
        }]
}
```

Voorbeeld:

```json
{
    "fases": [
        {
            "fase_naam" : "Fase 1",
            "brieven": [
                {
                    "naam"  :"Geen gehoor BCO",
                    "titel" :"Belpoging van uw GGD betreft COVID-19",
                    "inhoud":"<p>\r\n    Beste [VUL IN: VOORLETTER, ACHTERNAAM],\r\n<\/p>\r\n<p>\r\n    GGD [VUL IN: GGD REGIO] heeft vandaag geprobeerd u telefonisch te bereiken. Dit is helaas niet gelukt. We bellen vandaag en\/of morgen nog een keer. Wilt u de telefoon bij de hand houden zodat u op tijd kunt opnemen? Heeft u geen gemiste oproepen? Bel dan naar het telefoonnummer onderaan deze e-mail.\r\n<\/p>\r\n<p>\r\n    Alvast bedankt voor uw medewerking.\r\n    <br\/>\r\n    <br\/>\r\n<\/p>\r\n<p>\r\n    <br\/>\r\n    Met vriendelijke groet,\r\n<\/p>\r\n<p>\r\n    Afdeling Infectieziektebestrijding\r\n    <br\/>\r\n    GGD [VUL IN: GGD REGIO]\r\n    <br\/>",
                    "aan_te_passen": [{
                        "van":"[VUL IN: VOORLETTER, ACHTERNAAM]",
                        "naar":"naam"
                    },
                    {
                        "van": "[VUL IN: GGD REGIO]",
                        "naar": "regio_naam"
                    },
                    {
                        "van": "[VUL IN: TELEFOONNUMMER GGD]",
                        "naar": "regio_tel_nr"
                    }]
                }]
        }]
}
```

### API To Do

De taken die nog gedaan moeten worden tussen nu en landelijke implementatie:

1. Brieven aanvullen
2. (Optioneel) Telefoonnummers updaten
3. (Optioneel) Authenticatie toevoegen aan API. Indien gewenst kan authenticatie toegevoegd worden voordat de API de brieven terugstuurt. Voor de Proof of Concept, en omdat deze brieven publiek beschikbaar zijn, is dit tijdens de ontwikkeling overgeslagen.
4. (Optioneel) Laatste versie van de onderzoeksbijlage meesturen

## Chrome Extensie

Het tweede en belangrijkste onderdeel van deze applicatie is de Chrome extensie. Dit is het zichtbare deel waar de medewerkers mee werken. Aan het begin van de dag kan de medewerker hier de regio en fase kiezen waarmee gewerkt dient te worden. Eenmaal per case vult de medewerker het HPZ nummer in. Wanneer de medewerker op de knop `Maak email` klikt, worden de naam en het emailadres van de persoon uit de html broncode van HPZ uitgelezen en verwerkt in de gekozen brief. 

## Implementatie

### Installeren 

Om de extensie te gebruiken zonder dat deze (al) in de Chrome Web Store staat kunnen de volgende stappen doorlopen worden.
1. In Chrome, open `chrome://extensions` (Bij elke verandereing in de code kan deze pagina gebruikt worden om de extensie te refreshen)
2. Zet rechtsboven in de hoek de ontwikkelaarsmodus aan
3. Klik linksboven op `Uitgepakte extensie laden`, en navigeer naar de map waarin het `manifest.json` bestand staat (in dit geval `ext`)

### Opzet

De extensie bestaat uit volgende onderdelen:
| Onderdeel | Bestanden | Beschrijving |
|----------|-----------|------------|
| Manifest| `manifest.json` | Dit bestand wordt gebruikt om de algemene eigenschappen van de extensie vast te leggen, en de extensie de juiste permissions te geven.|
| Background| `background.js` | Dit bestand word aangeroepen op het moment dat Chrome opstart. In grote lijnen heeft dit script 4 hoofdtaken: <ul><li>API aanroepen om de data te verkrijgen</li> <li>Communicatie met `content.js` en `popup.js`</li> <li>Verwerken van alle data tot een email</li> <li>(Concept) email verzenden naar Graph API</li></ul>
| Popup| `popup.html` `popup.js`| Deze bestanden bevatten de html code en bijbehorende JavaScript van de popup die zichtbaar wordt wanneer de medewerker op het icoontje van de extensie klikt. Interactie van de medewerker met het popup scherm wordt vervolgens als bericht verzonden naar `background.js` om verder verwerkt te worden.|
|Content| `content.js` | Dit bestand heeft de mogelijkheid tot interactie met de content van de pagina. Wanneer aangeroepen haalt dit script de juiste waardes uit de HPZ broncode, en stuurt deze vervolgens als bericht terug naar `background.js` |

### Extensie To Do

1. Koppeling met Graph API maken. Alle data wordt momenteel correct verwerkt en klaargezet. Het enige wat nog mist is de API call waarin alle data naar de Outlook van de medewerker gepost word. Hiervoor moet in de Azure van de organisatie een App aangemaakt worden die toestemming heeft om deze actie te verrichten.
2. Na afronden van het vorige punt de extensie beschikbaar maken voor medewerkers in de Chrome Web Store