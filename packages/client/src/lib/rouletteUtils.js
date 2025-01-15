export const splitChipsIntoEqualParts = (chips, xMin, xMax, splits) => {
  const roundPercent = (frac) => {
    return (frac * 100).toFixed(0)
  }

  const formatEdgeWith2SignificantDigits = (edge) => {
    let diff = xMax - xMin
    let precision = 0
    if (diff < 1) {
      precision = 2
    } else if (diff < 10) {
      precision = 1
    } else {
      precision = 0
    }
    return edge.toFixed(precision)
  }

  const chipsAllocated = chips.reduce((acc, val) => acc + val, 0)
  if (chipsAllocated === 0) return []
  
  const xBins = chips.length

  const lowerEdges = Array.from({ length: xBins }, (_, i) => xMin + ((xMax - xMin) / xBins) * i)
  const upperEdges = Array.from(
    { length: xBins },
    (_, i) => xMin + ((xMax - xMin) / xBins) * (i + 1)
  )
  const parts = []

  let partStart = null
  let partEnd = null
  let partSum = 0
  const partTarget = chipsAllocated / splits
  let currentPart = 1

  for (let i = 0; i < chips.length && currentPart <= splits; i++) {
    if (chips[i] > 0 && partStart === null) {
      partStart = i
    }

    partSum += chips[i]

    if (partSum >= partTarget - 0.01 * partTarget || i === chips.length - 1) {
      partEnd = i
      if (partSum === 0) {
        partEnd = partStart
      } else {
        parts.push({
          lowerEdge: formatEdgeWith2SignificantDigits(lowerEdges[partStart]),
          upperEdge: formatEdgeWith2SignificantDigits(upperEdges[partEnd]),
          proportion: roundPercent(partSum / chipsAllocated)
        })
      }

      partStart = null
      partSum = 0
      currentPart++
    }
  }

  return parts
}


export const splitChipsForBoxPlot = (chips, xMin, xMax) => {

  const xBins = chips.length
  const totalChips = chips.reduce((acc, val) => acc + val, 0)
  if (totalChips === 0) return []

  const lowerEdges = Array.from({ length: xBins }, (_, i) => xMin + ((xMax - xMin) / xBins) * i)

  const upperEdges = Array.from(
    { length: xBins },
    (_, i) => xMin + ((xMax - xMin) / xBins) * (i + 1)
  )

  let q25;
  let q75;
  let min = null
  let max = null
  for (let i = 0; i < chips.length; i++) {
    if (chips[i] > 0) {
      if(min === null) min = lowerEdges[i]
      max = upperEdges[i]
    }
  }

  let chipsSoFar = 0
  let q25Reached = false
  let q75Reached = false

  for (let i = 0; i < chips.length; i++) {
    chipsSoFar += chips[i]

    if (chipsSoFar > totalChips * 0.25 && !q25Reached) {
      q25 = lowerEdges[i]
      q25Reached = true
    }

    if (chipsSoFar >= totalChips * 0.75 && !q75Reached) {
      q75 = upperEdges[i]
      q75Reached = true
    }
  }

  // return array
  return [  q25, q75, min, max]

}







// fast seed-able random number generator
function sfc32(a, b, c, d) {
  return function() {
    a |= 0; b |= 0; c |= 0; d |= 0;
    let t = (a + b | 0) + d | 0;
    d = d + 1 | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  }
}
const seedgen = () => 2024
const getRand = sfc32(1,1,1,1)  


const drawBins = (probs) => {
  const rand = getRand() // Math.random() 
  let sum = 0
  for (let i = 0; i < probs.length; i++) {
    sum += probs[i]
    if (rand < sum) {
      return i
    }
  }
}

const drawFromBin = (lowerEdge, upperEdge) => {
  const rand = getRand() // Math.random()
  return lowerEdge + (upperEdge - lowerEdge) * rand
}

const quantile = (arr, q) => {
  const sorted = arr.sort((a, b) => a - b)
  const pos = (sorted.length - 1) * q
  const base = Math.round(pos)
  const rest = pos - base
  if (rest === 0) {
    return sorted[base]
  }
  return sorted[base] + rest * (sorted[base + 1] - sorted[base])
}

const compBoxPlotInputs = (chips, min, max) => {
  if (chips.length === 0 || min === null || max === null) {
    // throw new Error('Invalid input')
    return { probs: [], lower: [], upper: [] }
  }

  const totChips = chips.reduce((acc, val) => acc + val, 0)
  if (totChips === 0) throw new Error('Invalid input')
  const probs = chips.map((chip) => chip / totChips)

  const xBins = chips.length
  const lower = Array.from({ length: xBins }, (_, i) => min + ((max - min) / xBins) * i)
  const upper = Array.from({ length: xBins }, (_, i) => min + ((max - min) / xBins) * (i + 1))

  return {
    probs,
    lower,
    upper
  }
}

const minEdge = (xLower, chips) => {
  return xLower.find((edge, i) => chips[i] > 0)
}

const maxEdge = (xUpper, chips) => {
  const chipsLastIndex =
    chips.length -
    1 -
    chips
      .slice()
      .reverse()
      .findIndex((chip) => chip > 0)
  return xUpper[chipsLastIndex]
}

export const splitChipsForConditionalBoxplots = (rouletteData = [], draws = 1000, factor = 100) => {
  if (!rouletteData || rouletteData.length === 0) throw new Error('Invalid input: no data')
  if (rouletteData.length > 3) throw new Error('Invalid input: too many data – function only supports up to 3')

  let { chips: chips1, xMin: xMin1, xMax: xMax1 } = rouletteData[0]
  xMin1 = xMin1 * factor
  xMax1 = xMax1 * factor

  // BOXPLOT 1
  let r1 = splitChipsForBoxPlot(chips1, xMin1, xMax1).map((val) => val / factor)

  if (rouletteData.length === 1) return [r1]

  let { chips: chips2, xMin: xMin2, xMax: xMax2 } = rouletteData[1]
  xMin2 = xMin2 * factor
  xMax2 = xMax2 * factor

  // BOXPLOT 2
  const { probs: probs1, lower: xLower1, upper: xUpper1 } = compBoxPlotInputs(chips1, xMin1, xMax1)

  const bins1 = Array.from({ length: draws }, () => drawBins(probs1))

  const { probs: probs2, lower: xLower2, upper: xUpper2 } = compBoxPlotInputs(chips2, xMin2, xMax2)

  const bins2 = Array.from({ length: draws }, () => drawBins(probs2))

  // BOXPLOT 3
  let xLower3, xUpper3, probs3, bins3, chips3, xMin3, xMax3
  if (rouletteData.length === 3) {
    let temp_ = rouletteData[2]
    chips3 = temp_.chips
    xMin3 = temp_.xMin
    xMax3 = temp_.xMax
    xMin3 = xMin3 * factor
    xMax3 = xMax3 * factor
    temp_ = compBoxPlotInputs(chips3, xMin3, xMax3)
    xLower3 = temp_.lower
    xUpper3 = temp_.upper
    probs3 = temp_.probs
    bins3 = Array.from({ length: draws }, () => drawBins(probs3))
    } 
  
  const y2 = []
  const y3 = []
  for (let i = 0; i < draws; i++) {
    const draws1 = drawFromBin(xLower1[bins1[i]], xUpper1[bins1[i]])

    const draws2 = drawFromBin(xLower2[bins2[i]], xUpper2[bins2[i]])

    const y2_ = draws1 * draws2
    y2.push(y2_)

    if (rouletteData.length === 2) continue
    const draws3 = drawFromBin(xLower3[bins3[i]], xUpper3[bins3[i]])
    const y3_ = y2_ * draws3
    y3.push(y3_)
    }
    
    const r2_min = minEdge(xLower1, chips1) * minEdge(xLower2, chips2)
    const r2_q25 = quantile(y2, 0.25)
  const r2_q75 = quantile(y2, 0.75)
  const r2_max = maxEdge(xUpper1, chips1) * maxEdge(xUpper2, chips2)
  const r2 = [r2_q25, r2_q75, r2_min, r2_max].map((val) => val / factor)

  
  if (rouletteData.length === 2) return [r1, r2]
  
  const r3_min = minEdge(xLower1, chips1) * minEdge(xLower2, chips2) * minEdge(xLower3, chips3)
  const r3_q25 = quantile(y3, 0.25)
  const r3_q75 = quantile(y3, 0.75)
  const r3_max = maxEdge(xUpper1, chips1) * maxEdge(xUpper2, chips2) * maxEdge(xUpper3, chips3)
  const r3 = [r3_q25, r3_q75, r3_min, r3_max].map((val) => val / factor)

  

  return [r1, r2, r3]
}





// // EXAMPLE: splitChipsForConditionalBoxplots
// const chips1 = [0, 0, 0, 0, 0, 1, 0, 0, 0, 0]
// const xMin1 = 0
// const xMax1 = 1

// const chips2 = [0, 0, 0, 0, 0, 1, 0, 0, 0, 0]
// const xMin2 = 0
// const xMax2 = 1

// const chips3 = [0, 0, 0, 0, 0, 1, 0, 0, 0, 0]
// const xMin3 = 0
// const xMax3 = 1

// const draws = 5_000

// // benchmar
// const start = new Date().getTime()
// const res = splitChipsForConditionalBoxplots(
//   [
//     { chips: chips1, xMin: xMin1, xMax: xMax1 },
//     { chips: chips2, xMin: xMin2, xMax: xMax2 },
//     { chips: chips3, xMin: xMin3, xMax: xMax3 },
//   ],
//   draws
// )
// const end = new Date().getTime()

// console.log(res)
// // console.log('Execution time: ' + (end - start) + 'ms')
