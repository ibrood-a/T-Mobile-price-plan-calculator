
const taxRate = .0825;
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function calculateDownPayment() {
    var DCCNumber = document.getElementById('DCCNumber').value;
    var deviceCostInput = document.getElementById('deviceCostInput').value;
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

    var taxes = (parseFloat(deviceCostInput) + parseFloat(accessoryCostInput) + parseFloat(activationCost)) * taxRate;
    cost = parseFloat(downPayment) + parseFloat(taxes) + parseFloat(accessoryDownPayment) + parseFloat(activationCost);

    document.getElementById('finalPrice').innerHTML = "Today's Cost: $" + parseFloat(cost).toFixed(2);
    document.getElementById('taxesPaid').innerHTML = "Taxes: $" + parseFloat(taxes).toFixed(2);
    document.getElementById('adjustedDownPayment').innerHTML = "Down Payment: $" + parseFloat(downPayment).toFixed(2);
    document.getElementById('activationCost').innerHTML = "Activation Fees: $" + parseFloat(activationCost).toFixed(2);
}
