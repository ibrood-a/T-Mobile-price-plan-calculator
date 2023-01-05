var cost = 0;
const senior = 0;
const military = 1;
const insider = 2;
const taxRate = 1.0825;
const maxLineCost = [[70, 30, 50], [90, 60, 35]];
const magentaLineCost = [[55, 25, 40], [75, 55, 25]];
const essentialsLineCost = [[45, 20], [65, 35, 20]];
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function correctMistakes() {
    var lineCount = document.getElementById('lineCount').value;
    var freeLine = document.getElementById('freeLine').checked;
    var discountIndex = document.getElementById('discountIndex').selectedIndex;
    var ratePlanIndex = document.getElementById('ratePlanIndex').selectedIndex;

    document.getElementById('finalPrice').innerHTML = "Total Monthly Cost: " + parseFloat(cost).toFixed(2);

    if (lineCount > 6 && ratePlanIndex == 2)
        document.getElementById('finalPrice').innerHTML = "Essentials is limited to six lines";

    switch (discountIndex) {
        case senior:
            if (freeLine) 
                document.getElementById('finalPrice').innerHTML = "55+ is not Eligible for Free Line"
            if (lineCount > 2 && ratePlanIndex == 2)
                document.getElementById('finalPrice').innerHTML = "Essentials 55+ is limited to 2 lines";
            if (lineCount > 4)
                document.getElementById('finalPrice').innerHTML = "55+ Plans are limited to 4 lines";
            break;
        case military:
            if (ratePlanIndex == 2)
                document.getElementById('finalPrice').innerHTML = "Military plan cannot be used with Essentials";
            break;
        case insider:
            if (ratePlanIndex != 0)
                document.getElementById('finalPrice').innerHTML = "Insider code can only be used with Magenta Max";
            break;
    }
}

function calculatePrice() {
    updateP360();
    var autoPay = document.getElementById('autopay').checked;
    var freeLine = document.getElementById('freeLine').checked;
    var lineCount = document.getElementById('lineCount').value;
    var ratePlanIndex = document.getElementById('ratePlanIndex').selectedIndex;
    var discountIndex = document.getElementById('discountIndex').selectedIndex;

    for (var line = 0; line < lineCount; line++) {
        // up to 8 lines with autopay
        if (line <= 7 && autoPay)
            cost -= 5; // take $5 minus discount from each line

        console.log(freeLine);
        if (freeLine && line >= 2)
            line--;

        switch (ratePlanIndex) {    
            case 2:
                cost += (essentialsLineCost[clamp(discountIndex, 0, 1)][clamp(line, 0, 1)]);
                break;

            case 1:
                cost += (magentaLineCost[(discountIndex === senior)[clamp(line, 0, 1)]]);
                break;

            case 0:
                cost += (magentaLineCost[(discountIndex === senior)[clamp(line, 0, 1)]]);
                break;
        }
    }
 
    switch (discountIndex) {
        case military:
            if (ratePlanIndex != 2)
                cost -= lineCount * 15;
            break;
        case insider:
            if (ratePlanIndex == 0)
                cost *= 0.80;
            break;
    }

    if (ratePlanIndex == 2)
        cost *= 1.12;

    cost += Number(document.getElementById('deviceCostInput').value);
    cost += Number(document.getElementById('additionalCostInput').value);

    correctMistakes();
}

function hideElement(label) {
    var element = document.getElementById(label);
    element.style.display = "none";
}

function showElement(label) {
    var element = document.getElementById(label);
    element.style.display = "initial";
}

function updateP360() {

    cost = 0;
    for (var i = 1; i <= 12; i++) {
        cost += Number(document.getElementById(i.toString() + 'p360').value) * 1.0825;
        hideElement(i.toString() + 'p360l');
        hideElement(i.toString() + 'p360');
    }

    var lineCount = document.getElementById('lineCount').value;
    if (lineCount === 0) {
        return;
    }

    for (var i = 1; i <= lineCount; i++) {
        cost += Number(document.getElementById(i.toString() + 'p360').value) * 1.0825;
        showElement(i.toString() + 'p360l');
        showElement(i.toString() + 'p360');
    }
}