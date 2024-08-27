// ==UserScript==
// @name         ReicheltEAN
// @namespace    https://reichelt.de/
// @version      2024-08-26
// @description  download EAN and article numbers!
// @author       Stefan Helmert
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==


(function() {
    'use strict';

    console.log("userscript reaicheltEAN called");
    // Muster für die Links, die aufgerufen werden sollen (z.B. alle Links, die "example.com" enthalten)
    const linkPattern = "^https\:\/\/www\.reichelt\.de";
    const filterPattern1 = /EAN[ <>=_"a-zA-Z\/\n\r]*(\d+)/;
    const filterPattern2 = /Artikelnummer des Herstellers[ <>=_"a-zA-Z\/\n\r]*propvalue">([- _a-zA-Z0-9]*)/;
    const filterPattern3 = /Artikel-Nr.:<\/b>[ \n\r]*([-\/,; _a-zA-Z0-9]*)/;
    const filterPattern4 = /anzahlInputArticle[- <>(),;\[\]=_"a-zA-Z0-9\/\n\r]*value="(\d+)/;
    const filterPattern5 = /av_articleheader.*itemprop="name">(.*)<\/span/;

    // Funktion zum Extrahieren der gewünschten Information aus einer Zielseite
    function extractInformation(html) {
        // Beispiel: Extrahieren von Inhalten innerhalb eines bestimmten HTML-Tags
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const extractedInfo = doc.querySelector('div.target-info').innerText;
        return extractedInfo;
    }

    function httpGet(theUrl)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
        xmlHttp.send( null );
        return xmlHttp.responseText;
    }

    function decodeHTMLEntities(text) {
        // Erstelle ein temporäres Element
        let temp = document.createElement('textarea');
        // Weise den Text dem temporären Element zu (dabei wird der Text automatisch dekodiert)
        temp.innerHTML = text;
        // Gib den dekodierten Text zurück
        return temp.value;
    }
    var csv = "\"Artikelbezeichnung\"\t\"Artikelbeschreibung\"\t\"EAN\"\t\"Hersteller-Nr.\"\t\"Anzahl\"\n";

    // Alle Links auf der aktuellen Seite durchgehen
    const links = document.querySelectorAll('a.notranslate[href]');
    links.forEach(link => {
        const url = link.href;
        const linkRegEx = new RegExp(linkPattern);
        if (linkRegEx.test(url)) {

            console.log(`Calling URL: ${url}`);

            // synchrone Anfrage an die Zielseite
            var trgthtml = httpGet(url);
            var ean = trgthtml.match(filterPattern1);
            var artnr = trgthtml.match(filterPattern2);
            var rartnr = trgthtml.match(filterPattern3);
            var anz = trgthtml.match(filterPattern4);
            var bez = trgthtml.match(filterPattern5);
            console.log(ean);
            console.log(artnr);
            console.log(rartnr);
            console.log(anz);
            console.log(bez);
            link.textContent = link.textContent + (ean == null ? "" : " - EAN: " + ean[1]) + (artnr == null ? "" : " - ArtNr.: " + artnr[1]);
            csv = csv + "\"" + (rartnr == null ? "" : rartnr[1]) + "\"\t\"" + (bez == null ? "" : decodeHTMLEntities(bez[1])) + "\"\t\"" + (ean == null ? "" : ean[1]) + "\"\t\"" + (artnr == null ? "" : artnr[1]) + "\"\t" + (anz == null ? "" : anz[1]) + "\n";
        }
        console.log(csv);
        
    });
})();
