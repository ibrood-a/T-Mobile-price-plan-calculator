var cost = 0;
const senior = 1;
const military = 2;
const insider = 3;
const taxRate = 1.0825;
const maxLineCost = [[90, 60, 35], [70, 30, 50], [75, 35, 25]];
const magentaLineCost = [[75, 55, 25], [55, 25, 40], [60, 30, 15]];
const essentialsLineCost = [[65, 35, 20], [45, 20], [0, 0, 0]];
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function correctMistakes() {
    var lineCount = document.getElementById('lineCount').value;
    var freeLine = document.getElementById('freeLine').checked;
    var discountIndex = document.getElementById('discountIndex').selectedIndex;
    var ratePlanIndex = document.getElementById('ratePlanIndex').selectedIndex;

    document.getElementById('monthlyPrice').innerHTML = "Monthly Cost: " + parseFloat(cost).toFixed(2);

    if (lineCount > 6 && ratePlanIndex == 2)
        document.getElementById('monthlyPrice').innerHTML = "Essentials is limited to six lines";

    switch (discountIndex) {
        case senior:
            if (freeLine) 
                document.getElementById('monthlyPrice').innerHTML = "55+ is not Eligible for Free Line"
            if (lineCount > 2 && ratePlanIndex === 2)
                document.getElementById('monthlyPrice').innerHTML = "Essentials 55+ is limited to 2 lines";
            if (lineCount > 4)
                document.getElementById('monthlyPrice').innerHTML = "55+ Plans are limited to 4 lines";
            break;
        case military:
            if (freeLine) 
                document.getElementById('monthlyPrice').innerHTML = "Military is not Eligible for Free Line"
            if (ratePlanIndex === 2)
                document.getElementById('monthlyPrice').innerHTML = "Military plan cannot be used with Essentials";
            break;
        case insider:
            if (ratePlanIndex != 0)
                document.getElementById('monthlyPrice').innerHTML = "Insider code can only be used with Magenta Max";
            break;
    }
}

function calculatePrice() {
    updateP360();
    calculateDownPayment();
    var autoPay = document.getElementById('autopay').checked;
    var freeLine = document.getElementById('freeLine').checked;
    var lineCount = document.getElementById('lineCount').value;
    var ratePlanIndex = document.getElementById('ratePlanIndex').selectedIndex;
    var discountIndex = document.getElementById('discountIndex').selectedIndex;
    var discountTypeIndex = (discountIndex === senior) ? 1 : (discountIndex == military) ? 2 : 0;
    for (var line = 0; line < lineCount; line++) {
        console.log(line);
        console.log(freeLine);
        console.log(discountTypeIndex);
        if (freeLine && line === 2) {
            console.log("broken");
            continue;
        }

        switch (ratePlanIndex) {    
            case 4:
                cost += (essentialsLineCost[+discountTypeIndex][clamp(line, 0, 2)]);
                break;

            case 3:
                cost += (magentaLineCost[+discountTypeIndex][clamp(line, 0, 2)]);
                break;

            case 2:
                cost += (maxLineCost[+discountTypeIndex][clamp(line, 0, 2)]);
                break;
                
           case 1:
                cost += (magentaLineCost[+discountTypeIndex][clamp(line, 0, 2)] + 5);
                break;

            case 0:
                cost += (maxLineCost[+discountTypeIndex][clamp(line, 0, 2)] + 5);
                break;
        }

        // up to 8 lines with autopay
        if (line <= 7 && autoPay)
            cost -= 5; // take $5 minus discount from each line
    }
 
    if (discountIndex === insider && ratePlanIndex === 0)
        cost *= 0.80;


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


function calculateDownPayment() {
    var DCCNumber = document.getElementById('DCCNumber').value;
    var deviceCostInput = document.getElementById('deviceCostInput2').value;
    var downPaymentInput = document.getElementById('downPaymentInput').value;
    var financingLimitInput = document.getElementById('financingLimitInput').value;
    var currentEIPBalanceInput = document.getElementById('currentEIPBalanceInput').value;
    var accessoryDownCheck = document.getElementById('halfDownCheck').checked;
    var accessoryFinanceCheck = document.getElementById('accessoryFinanceCheck').checked;
    var accessoryCostInput = document.getElementById('accessoryCostInput').value;
    console.log(deviceCostInput);
    console.log(downPaymentInput);
    console.log(deviceCostInput - downPaymentInput);
    console.log(financingLimitInput - currentEIPBalanceInput);

    var cost = 0;
    var downPayment = 0;
    var activationCost = 0;
    var accessoryDownPayment = 0;

    if ((deviceCostInput - downPaymentInput) >= (financingLimitInput - currentEIPBalanceInput)) {
        downPayment = deviceCostInput - (financingLimitInput - currentEIPBalanceInput);
    }
    else {
        downPayment = downPaymentInput;
    }

    activationCost = DCCNumber * 35;
    if (accessoryDownCheck && accessoryFinanceCheck)
        accessoryDownPayment = accessoryCostInput * 0.5;
    else if (!accessoryFinanceCheck)
        accessoryDownPayment = accessoryCostInput;

    var taxes = (parseFloat(deviceCostInput) + parseFloat(accessoryCostInput) + parseFloat(activationCost)) * (taxRate - 1);
    cost = parseFloat(downPayment) + parseFloat(taxes) + parseFloat(accessoryDownPayment) + parseFloat(activationCost);


    console.log(deviceCostInput);
    console.log(accessoryCostInput);
    console.log(activationCost);
    console.log(downPayment);
    console.log(taxes);
    console.log(accessoryDownPayment);
    console.log(activationCost);
    console.log(cost);

    document.getElementById('todayPrice').innerHTML = "Today's Cost: $" + parseFloat(cost).toFixed(2);
}
