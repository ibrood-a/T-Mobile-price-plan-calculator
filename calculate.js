var cost = 0
const taxRate = 1.0825
const senior = 1,
  military = 2,
  insider = 3
const next = 0,
  plus = 1,
  go5g = 2,
  max = 3,
  magenta = 4,
  essentials = 5,
  hint = 6
const clamp = (num, min, max) => Math.min(Math.max(num, min), max)
var hasHint,
  autoPay,
  freeLine,
  lineCount,
  ratePlanIndex,
  discountIndex,
  discountTypeIndex

const protectionTiers = [25, 18, 16, 13, 9, 7, 0]
const planCostArr = [
  [
    // go5gnext
    [105, 75, 50], // regular cost
    [85, 45, 65], // senior cost
    [90, 50, 40], // military cost
    [105, 75, 50] // insider cost
  ],
  [
    //go5gplus
    [95, 65, 40], // regular cost
    [75, 35, 55], // senior cost
    [80, 40, 30], // military cost
    [95, 65, 40] // insider cost
  ],
  [
    //go5g
    [80, 60, 30], // regular cost
    [60, 30, 45], // senior cost
    [65, 35, 15], // military cost
    [80, 60, 30] // insider cost
  ],
  [
    //max
    [90, 60, 35], // regular cost
    [70, 30, 50], // senior cost
    [75, 35, 25], // military cost
    [90, 60, 35] // insider cost
  ],
  [
    //magenta
    [75, 55, 25], // regular cost
    [55, 25, 40], // senior cost
    [60, 30, 15], // military cost
    [75, 55, 25] // insider cost
  ],
  [
    //essentials
    [65, 35, 20], // regular cost
    [45, 20], // senior cost
    [0, 0, 0], // military cost
    [65, 35, 20] // insider cost
  ],
  [35, 35, 45, 35, 45, 45] //hint
]

function updateVariables () {
  // reset cost for new calculation
  cost = 0

  // update all html variables
  hasHint = document.getElementById('hint').checked
  autoPay = document.getElementById('autopay').checked
  freeLine = document.getElementById('freeLine').checked
  lineCount = document.getElementById('lineCount').value
  ratePlanIndex = document.getElementById('ratePlanIndex').selectedIndex
  discountIndex = document.getElementById('discountIndex').selectedIndex

  for (var i = 1; i <= 8; i++) {
    hideElement('1p360l')
    hideElement(i.toString() + 'p360')
  }

  for (var i = 1; i <= lineCount; i++) {
    var insuranceTier = document.getElementById(i.toString() + 'p360').selectedIndex
    cost += protectionTiers[Number(insuranceTier)] * 1.0825
    showElement('1p360l')
    showElement(i.toString() + 'p360')
  }
}

function calculatePrice () {
  // ensure everything is up to date
  updateVariables()

  // iterate through each line to calculate the cost
  for (let line = 0; line < lineCount; line++) {
    // we dont charge for 3rd line at tmobile!!
    if (line == 2 && freeLine) continue

    // Calculate line cost
    cost += planCostArr[ratePlanIndex][discountIndex][clamp(line, 0, 2)]

    // autopay discount limited to 8 lines, future proofing this 
    if (line + hasHint < 8 && autoPay) {
      cost -= 5
    }
  }

  // insider code is 20% off and can only be used on max
  if (discountIndex === insider && ratePlanIndex <= plus) cost *= 0.8

  // add the cost before that way taxes get calculated if needed.
  cost += Number(document.getElementById('additionalCostInput').value)

  if (lineCount == 0 && hasHint) cost += autoPay ? 55 : 50
  else if (hasHint) {
    cost += planCostArr[hint][ratePlanIndex]
    cost -= autoPay ? 5 : 0
  }

  // All plans except Essentials are tax inclusive
  if (ratePlanIndex == essentials) {
    cost *= 1.0825
  }

  // do this after because taxes paid up front.
  cost += Number(document.getElementById('deviceCostInput').value)

  displayPrice()
}

function displayPrice () {
  // update the price this will be overridden later if there is any errors
  updateCostElement('Monthly Cost: $' + parseFloat(cost).toFixed(2))

  if (lineCount > 6 && ratePlanIndex === essentials)
    updateCostElement('Essentials is limited to six lines')

  switch (discountIndex) {
    case senior:
      if (freeLine) updateCostElement('55+ is not Eligible for Free Line')
      else if (lineCount > 2 && ratePlanIndex === essentials)
        updateCostElement('Essentials 55+ is limited to 2 lines')
      else if (lineCount > 4)
        updateCostElement('55+ Plans are limited to 4 lines')
      break
    case military:
      if (freeLine) updateCostElement('Military is not Eligible for Free Line')
      if (ratePlanIndex === essentials)
        updateCostElement('Military plan cannot be used with Essentials')
      break
    case insider:
      if (ratePlanIndex > plus)
        updateCostElement('Insider code can only be used with Go5G Plus/Next')
      break
  }

  // update in the future to work for 12 lines (what can be completed in retail)
  if (lineCount > 8)
    updateCostElement('This tool is limited to calculating only up to 8 lines')
}

function hideElement (label) {
  var element = document.getElementById(label)
  if (element) {
    element.style.display = 'none'
  }
}

function showElement (label) {
  var element = document.getElementById(label)
  if (element) {
    element.style.display = 'initial'
  }
}

function updateCostElement (value) {
  document.getElementById('monthlyPrice').innerHTML = value
}
