var cost = 0;
const senior = 1;
const military = 2;
const insider = 3;
const taxRate = 1.0825;

const go5GLineCost = [[80, 60, 30], [60, 30, 45], [65, 35, 15]];
const go5GPlusLineCost = [[95, 65, 40], [75, 35, 55], [80, 40, 30]];
const go5GNextLineCost = [[105, 75, 50], [85, 45, 65], [90, 50, 40]];

const maxLineCost = [[90, 60, 35], [70, 30, 50], [75, 35, 25]];
const magentaLineCost = [[75, 55, 25], [55, 25, 40], [60, 30, 15]];
const essentialsLineCost = [[65, 35, 20], [45, 20], [0, 0, 0]];
const protectionTiers = [25, 18, 16, 13, 9, 7, 0];
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function displayPrice() {
    var lineCount = document.getElementById('lineCount').value;
    var freeLine = document.getElementById('freeLine').checked;
    var discountIndex = document.getElementById('discountIndex').selectedIndex;
    var ratePlanIndex = document.getElementById('ratePlanIndex').selectedIndex;

    document.getElementById('monthlyPrice').innerHTML = "Monthly Cost: $" + parseFloat(cost).toFixed(2);

    if (lineCount > 6 && ratePlanIndex == 5)
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
            if (ratePlanIndex > 1)
                document.getElementById('monthlyPrice').innerHTML = "Insider code can only be used with Go5G Plus";
            break;
    }

    if (lineCount > 12)
        document.getElementById('monthlyPrice').innerHTML = "We can only do 12 lines in the store.";
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

        if (line == 2 && freeLine) {
            if (ratePlanIndex === 0) // go5G Next
                cost += (go5GNextLineCost[+discountTypeIndex][clamp(line, 0, 2)] - 35);
            else
                continue;
        } else {
            switch (ratePlanIndex) {
                case 7: // go5G Plus
                    cost += (go5GPlusLineCost[+discountTypeIndex][clamp(line, 0, 2)]);
                    break;
                case 6: // go5G
                    cost += (go5GLineCost[+discountTypeIndex][clamp(line, 0, 2)]);
                    break;
                case 5: // Essentials
                    cost += (essentialsLineCost[+discountTypeIndex][clamp(line, 0, 2)]);
                    break;
                case 4: // Magenta
                    cost += (magentaLineCost[+discountTypeIndex][clamp(line, 0, 2)]);
                    break;
                case 3: // Magenta Max
                    cost += (maxLineCost[+discountTypeIndex][clamp(line, 0, 2)]);
                    break;
                case 2: // Go5G
                cost += (go5GLineCost[+discountTypeIndex][clamp(line, 0, 2)]);
                    break;
                case 1: // Go5G Plus
                cost += (go5GPlusLineCost[+discountTypeIndex][clamp(line, 0, 2)]);
                    break;
                case 0: // go5G Next
                    cost += (go5GNextLineCost[+discountTypeIndex][clamp(line, 0, 2)]);
                    break;
            }
        }
        
        // up to 8 lines with $5 autopay discount
        if (line <= 7 && autoPay) {
            cost -= 5;
        }

        if (line > 7)
            cost += 5;
    }

    // insider code is 20% off and can only be used on max
    if (discountIndex === insider && ratePlanIndex <= 1) {
        cost *= 0.80;
    }

    // add the cost before that way taxes get calculated if needed. 
    cost += Number(document.getElementById('additionalCostInput').value);

    // All plans except Essentials are tax inclusive
    if (ratePlanIndex == 5) {
        cost *= 1.0825;
    }

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
        cost += protectionTiers[Number(document.getElementById(i.toString() + 'p360').selectedIndex)] * 1.0825;
        showElement(i.toString() + 'p360l');
        showElement(i.toString() + 'p360');
    }
}


function calculateDownPayment() {
    var todayCost = 0;
    var monthlyDeviceCost = 0;
    var monthlyAccessoryCost = 0;
    var downPayment = 0;
    var activationCost = 0;
    var accessoryDownPayment = 0;

    var DCCNumber = document.getElementById('DCCNumber').value;
    var deviceCostInput = document.getElementById('deviceCostInput2').value;
    var downPaymentInput = document.getElementById('downPaymentInput').value;
    var promoCreditInput = document.getElementById('promoCreditInput').value;
    var accessoryCostInput = document.getElementById('accessoryCostInput').value;
    var financingLimitInput = document.getElementById('financingLimitInput').value;
    var currentEIPBalanceInput = document.getElementById('currentEIPBalanceInput').value;
    
    var accessoryDownCheck = document.getElementById('halfDownCheck').checked;
    var accessoryFinanceCheck = document.getElementById('accessoryFinanceCheck').checked;
    
    var financedCost = (deviceCostInput - downPaymentInput);
    var availableFinancing = (financingLimitInput - currentEIPBalanceInput);
    
    // if they wanna finance more than limit then the downpayment is greater of available or standard downpayment.
    if (financedCost >= availableFinancing) {
     	downPayment = deviceCostInput - availableFinancing;
    	financedCost -= downPayment;
    }
    else 
        downPayment = downPaymentInput;

    // number of activations charged * $35
    activationCost = DCCNumber * 35;
    
    // financing accessories?
    if (accessoryFinanceCheck) {
        // 50% downpayment on the accessories. 
        if (accessoryDownCheck) {
        	monthlyAccessoryCost = accessoryDownPayment = accessoryCostInput * 0.5;
        }
        else {
        	monthlyAccessoryCost = accessoryCostInput;
        } 
    }
    else // not financing so full cost. 
        accessoryDownPayment = accessoryCostInput;

    var taxes = (parseFloat(deviceCostInput) + parseFloat(accessoryCostInput) + parseFloat(activationCost)) * (taxRate - 1);
    todayCost = parseFloat(downPayment) + parseFloat(taxes) + parseFloat(accessoryDownPayment) + parseFloat(activationCost);
	monthlyDeviceCost = (parseFloat(financedCost) - parseFloat(promoCreditInput)) / 24;
	monthlyAccessoryCost = parseFloat(monthlyAccessoryCost) / 12;
	
	var monthlyCost = parseFloat(monthlyDeviceCost) + parseFloat(monthlyAccessoryCost);
	
	console.log(monthlyDeviceCost);
	console.log(monthlyAccessoryCost);
	
    // update the price on user end. 
    document.getElementById('todayPrice').innerHTML = "Today's Cost: $" + parseFloat(todayCost).toFixed(2);
    document.getElementById('monthlyDevicePrice').innerHTML = "Monthly Device Cost: $" + parseFloat(monthlyCost).toFixed(2);
}
