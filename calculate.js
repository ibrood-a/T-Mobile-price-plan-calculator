var cost = 0;
const senior = 1;
const military = 2;
const insider = 3;
const taxRate = 1.0825;
const maxLineCost = [[90, 60, 35], [70, 30, 50], [75, 35, 25]];
const magentaLineCost = [[75, 55, 25], [55, 25, 40], [60, 30, 15]];
const essentialsLineCost = [[65, 35, 20], [45, 20], [0, 0, 0]];
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function displayPrice() {
    var lineCount = document.getElementById('lineCount').value;
    var freeLine = document.getElementById('freeLine').checked;
    var discountIndex = document.getElementById('discountIndex').selectedIndex;
    var ratePlanIndex = document.getElementById('ratePlanIndex').selectedIndex;

    document.getElementById('monthlyPrice').innerHTML = "Monthly Cost: " + parseFloat(cost).toFixed(2);

    if (lineCount > 6 && ratePlanIndex == 4)
        document.getElementById('monthlyPrice').innerHTML = "Essentials is limited to six lines";

    switch (discountIndex) {
        case senior:
            if (freeLine) 
                document.getElementById('monthlyPrice').innerHTML = "55+ is not Eligible for Free Line"
            if (lineCount > 2 && ratePlanIndex === 4)
                document.getElementById('monthlyPrice').innerHTML = "Essentials 55+ is limited to 2 lines";
            if (lineCount > 4)
                document.getElementById('monthlyPrice').innerHTML = "55+ Plans are limited to 4 lines";
            break;
        case military:
            if (freeLine) 
                document.getElementById('monthlyPrice').innerHTML = "Military is not Eligible for Free Line"
            if (ratePlanIndex === 4)
                document.getElementById('monthlyPrice').innerHTML = "Military plan cannot be used with Essentials";
            break;
        case insider:
            if (ratePlanIndex != 0)
                document.getElementById('monthlyPrice').innerHTML = "Insider code can only be used with Go5G Plus";
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
        switch (ratePlanIndex) {    
            case 4: // Essentials
                cost += (essentialsLineCost[+discountTypeIndex][clamp(line, 0, 2)]);
                break;

            case 3: // Magenta
                cost += (magentaLineCost[+discountTypeIndex][clamp(line, 0, 2)]);
                break;

            case 2: // Magenta Max
                cost += (maxLineCost[+discountTypeIndex][clamp(line, 0, 2)]);
                break;
                
           case 1: // Go5G
                cost += (magentaLineCost[+discountTypeIndex][clamp(line, 0, 2)] + 5);
                break;

            case 0: // Go5G Plus
                cost += (maxLineCost[+discountTypeIndex][clamp(line, 0, 2)] + 5);
                break;
        }

        // up to 8 lines with $5 autopay discount
        if (line <= 7 && autoPay)
            cost -= 5; 
    }
 
    // insider code is 20% off and can only be used on max
    if (discountIndex === insider && ratePlanIndex === 0)
        cost *= 0.80;

    // add the cost before that way taxes get calculated if needed. 
     cost += Number(document.getElementById('additionalCostInput').value);
    
    // essentials is the only plan not tax inclusive 
    if (ratePlanIndex == 4)
        cost *= 1.13;

    // do this after because taxes paid up front. 
    cost += Number(document.getElementById('deviceCostInput').value);

    displayPrice();
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
    
    var cost = 0;
    var downPayment = 0;
    var activationCost = 0;
    var accessoryDownPayment = 0;

    var DCCNumber = document.getElementById('DCCNumber').value;
    var deviceCostInput = document.getElementById('deviceCostInput2').value;
    var downPaymentInput = document.getElementById('downPaymentInput').value;
    var accessoryCostInput = document.getElementById('accessoryCostInput').value;
    var financingLimitInput = document.getElementById('financingLimitInput').value;
    var currentEIPBalanceInput = document.getElementById('currentEIPBalanceInput').value;
    
    var accessoryDownCheck = document.getElementById('halfDownCheck').checked;
    var accessoryFinanceCheck = document.getElementById('accessoryFinanceCheck').checked;
    
    // if they wanna finance more than limit then the downpayment is greater of available or standard downpayment.
    if ((deviceCostInput - downPaymentInput) >= (financingLimitInput - currentEIPBalanceInput)) {
        downPayment = deviceCostInput - (financingLimitInput - currentEIPBalanceInput);
    }
    else {
        downPayment = downPaymentInput;
    }

    // number of activations charged * $35
    activationCost = DCCNumber * 35;
    
    // financing accessories?
    if (accessoryFinanceCheck) {
        // 50% downpayment on the accessories. 
        if (accessoryDownCheck)
            accessoryDownPayment = accessoryCostInput * 0.5;
    }
    else // not financing so full cost. 
        accessoryDownPayment = accessoryCostInput;

    var taxes = (parseFloat(deviceCostInput) + parseFloat(accessoryCostInput) + parseFloat(activationCost)) * (taxRate - 1);
    cost = parseFloat(downPayment) + parseFloat(taxes) + parseFloat(accessoryDownPayment) + parseFloat(activationCost);

    // update the price on user end. 
    document.getElementById('todayPrice').innerHTML = "Today's Cost: $" + parseFloat(cost).toFixed(2);
}
