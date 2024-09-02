// ==UserScript==
// @name         ReicheltCart
// @namespace    https://reichelt.de/
// @version      2024-08-26
// @description  download shopping cart!
// @author       Stefan Helmert
// @match        https://www.reichelt.de/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==


(function() {
    'use strict';

    console.log("userscript reicheltCart called");

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


    var data = [["Lfd.", "Menge", "Einheit", "Bezeichnung", "Einzelpreis", "Gesamtpreis"]];
    data.push(["Nr.", "", "", "", "Netto", "Brutto"]);
    // Alle Artikel auf der aktuellen Seite durchgehen
    const items = document.getElementsByClassName('wk_article');
    console.log(items);
    for(var i=0;i<items.length;i++){
        var row = items[i];
        var quantity = row.getElementsByClassName('quantity');
        var tagQ = quantity[0].getElementsByTagName('input');
        var quantityValue = Number(tagQ[1].value);
        var overall = row.getElementsByClassName('overall');
        var tagP = overall[0].getElementsByTagName('span');
        var priceOverallValue = Number(tagP[0].innerHTML.replace(",","."));
        var link = row.getElementsByClassName('notranslate');
        var name = link[0].innerHTML;
        var desc = link[0].title;

        data.push([i+1, quantityValue, "Stück", name + " - " + desc, {'f': 'F'+(i+3)+'*100/119/B'+(i+3), z: '#,##0.00 "€"'},  {v: priceOverallValue, t: 'n', z: '#,##0.00 "€"'}]);
    }
    console.log(data);
    // Erstelle ein neues Workbook
    let wb = XLSX.utils.book_new();

    // Erstelle ein neues Worksheet
    let ws = XLSX.utils.aoa_to_sheet(data);
    ws["!cols"] = [{width: 3.5}, {width: 6}, {width: 6}, {width: 70}, {width: 9}, {width: 10.5}];
    // Füge das Worksheet dem Workbook hinzu
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Exportiere die Excel-Datei
    XLSX.writeFile(wb, "Beschaffungsliste_ReicheltDE.xlsx");


})();
