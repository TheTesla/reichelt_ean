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
            console.log(ean);
            console.log(artnr);
            link.textContent = link.textContent + (ean == null ? "" : " - EAN: " + ean[1]) + (artnr == null ? "" : " - ArtNr.: " + artnr[1]);
        }

        
    });
})();
