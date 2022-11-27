var cost = 0;
const na = 0;
const senior = 1;
const military = 2;
const insider = 3;
const taxRate = 1.0825;
const maxLineCost = [90, 60, 35];
const magentaLineCost = [75, 55, 25];
const essentialsLineCost = [65, 35, 20]
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function discountSwitch() {
    var lineCount = document.getElementById('lineCount').value;
    var discountIndex = document.getElementById('discountIndex').selectedIndex;
    var ratePlanIndex = document.getElementById('ratePlanIndex').selectedIndex;

    switch (discountIndex) {
        case senior:
			if (lineCount > 2 && ratePlanIndex == 2)
				document.getElementById('finalPrice').innerHTML = "Essentials 55+ is limited to 2 lines";
			if (lineCount > 4)
				document.getElementById('finalPrice').innerHTML = "55+ Plans are limited to 4 lines";
			else
				cost -= clamp(lineCount, 0, 2) * 20;
        case military:
            if (ratePlanIndex != 2)
                cost -= lineCount * 15;
			else
				document.getElementById('finalPrice').innerHTML = "Military plan cannot be used with Essentials";
            break;
        case insider:
            if (ratePlanIndex == 0)
                cost *= 0.80;
			else		
				document.getElementById('finalPrice').innerHTML = "Insider code can only be used with Magenta Max";
	
            break;
    }
}

function calculatePrice() {
    cost = 0;

    updateP360();
    var autoPay = document.getElementById('autopay').checked;
    var lineCount = document.getElementById('lineCount').value;
    var discountIndex = document.getElementById('discountIndex').selectedIndex;
    var ratePlanIndex = document.getElementById('ratePlanIndex').selectedIndex;
    var deviceCost = document.getElementById('deviceCostInput').value;
    var additionalCost = document.getElementById('additionalCostInput').value;


    console.log("yay");

    console.log(lineCount);
    for (var lineIndex = 0; lineIndex < lineCount; lineIndex++) {

        // up to 8 lines with autopay
        if (lineIndex <= 7 && autoPay)
            cost -= 5; // take $5 minus discount from each line

		console.log("yay");
		switch (ratePlanIndex) {
			case 2:
				cost += (essentialsLineCost[clamp(lineIndex, 0, 2)]);
				break;

			case 1:
				cost += (magentaLineCost[clamp(lineIndex, 0, 2)]);
				break;

			case 0:
				cost += (maxLineCost[clamp(lineIndex, 0, 2)]);
				break;
		}

	}

	discountSwitch();
	
	if (ratePlanIndex == 2)
		cost *= 1.12;
		
	cost += Number(deviceCost);
	cost += Number(additionalCost);

	document.getElementById('finalPrice').innerHTML = "Total Monthly Cost: " + parseFloat(cost).toFixed(2);
	
	if (lineCount > 6 && ratePlanIndex == 2)
		document.getElementById('finalPrice').innerHTML = "Essentials is limited to six lines";
	
	switch (discountIndex) {
        case senior:
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

function updateP360() {
    var lineCount = document.getElementById('lineCount').value;

    var line1Label = document.getElementById('1p360l');
    var line1Input = document.getElementById('1p360');
    line1Label.style.display = "none";
    line1Input.style.display = "none";

    var line2Label = document.getElementById('2p360l');
    var line2Input = document.getElementById('2p360');
    line2Label.style.display = "none";
    line2Input.style.display = "none";

    var line3Label = document.getElementById('3p360l');
    var line3Input = document.getElementById('3p360');
    line3Label.style.display = "none";
    line3Input.style.display = "none";

    var line4Label = document.getElementById('4p360l');
    var line4Input = document.getElementById('4p360');
    line4Label.style.display = "none";
    line4Input.style.display = "none";

    var line5Label = document.getElementById('5p360l');
    var line5Input = document.getElementById('5p360');
    line5Label.style.display = "none";
    line5Input.style.display = "none";

    var line6Label = document.getElementById('6p360l');
    var line6Input = document.getElementById('6p360');
    line6Label.style.display = "none";
    line6Input.style.display = "none";

    var line7Label = document.getElementById('7p360l');
    var line7Input = document.getElementById('7p360');
    line7Label.style.display = "none";
    line7Input.style.display = "none";

    var line8Label = document.getElementById('8p360l');
    var line8Input = document.getElementById('8p360');
    line8Label.style.display = "none";
    line8Input.style.display = "none";

    var line9Label = document.getElementById('9p360l');
    var line9Input = document.getElementById('9p360');
    line9Label.style.display = "none";
    line9Input.style.display = "none";

    var line10Label = document.getElementById('10p360l');
    var line10Input = document.getElementById('10p360');
    line10Label.style.display = "none";
    line10Input.style.display = "none";

    var line11Label = document.getElementById('11p360l');
    var line11Input = document.getElementById('11p360');
    line11Label.style.display = "none";
    line11Input.style.display = "none";

    var line12Label = document.getElementById('12p360l');
    var line12Input = document.getElementById('12p360');
    line12Label.style.display = "none";
    line12Input.style.display = "none";

    if (lineCount >= 1) {
        cost += Number(line1Input.value) * 1.065;
        line1Label.style.display = "initial";
        line1Input.style.display = "initial";
    }

    if (lineCount >= 2) {
        cost += Number(line2Input.value) * 1.065;
        line2Label.style.display = "initial";
        line2Input.style.display = "initial";
    }

    if (lineCount >= 3) {
        cost += Number(line3Input.value) * 1.065;
        line3Label.style.display = "initial";
        line3Input.style.display = "initial";
    }

    if (lineCount >= 4) {
        cost += Number(line4Input.value) * 1.065;
        line4Label.style.display = "initial";
        line4Input.style.display = "initial";
    }

    if (lineCount >= 5) {
        cost += Number(line5Input.value) * 1.065;
        line5Label.style.display = "initial";
        line5Input.style.display = "initial";
    }

    if (lineCount >= 6) {
        cost += Number(line6Input.value) * 1.065;
        line6Label.style.display = "initial";
        line6Input.style.display = "initial";
    }

    if (lineCount >= 7) {
        cost += Number(line7Input.value) * 1.065;
        line7Label.style.display = "initial";
        line7Input.style.display = "initial";
    }

    if (lineCount >= 8) {
        cost += Number(line8Input.value) * 1.065;
        line8Label.style.display = "initial";
        line8Input.style.display = "initial";
    }

    if (lineCount >= 9) {
        cost += Number(line9Input.value) * 1.065;
        line9Label.style.display = "initial";
        line9Input.style.display = "initial";
    }

    if (lineCount >= 10) {
        cost += Number(line10Input.value) * 1.065;
        line10Label.style.display = "initial";
        line10Input.style.display = "initial";
    }

    if (lineCount >= 11) {
        cost += Number(line11Input.value) * 1.065;
        line11Label.style.display = "initial";
        line11Input.style.display = "initial";
    }

    if (lineCount >= 12) {
        cost += Number(line12Input.value) * 1.065;
        line12Label.style.display = "initial";
        line12Input.style.display = "initial";
    }

}