const extractExpertDataForTable = (question, response) => {

  if (!question || !question.viewId || !response) {
    return {}
  }

  if (question.viewId === 'QuestionFormKit' || question.viewId === 'QuestionCheckbox') {
    let val = response.other ? response.other : response.response
    return {
      response: JSON.stringify(val),
    }
  }
  

  
  if (question.viewId === 'QuestionRoulette') {
    const binEdgesArr = []
    const { xMin, xMax, xBins } = response || {}
    const binWidth = (xMax - xMin) / xBins
    
    let binEdges, chips, chipsTotal, probs
    if (!isNaN(binWidth)) {
      chips = response?.chips || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      chipsTotal = chips.reduce((a, b) => a + b, 0)
      probs = chipsTotal > 0 ? chips.map((chip) => chip / chipsTotal) : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

      binEdges = []
      for (let i = 0; i <= xBins; i++) {
        let edge = xMin + i * binWidth
        edge = Math.round(edge * 1000) / 1000
        binEdgesArr.push(edge)
      }
      binEdges = binEdgesArr.slice(0, -1)?.map((x, i) => [x, binEdgesArr[i + 1]])
      binEdges = binEdges?.map((edge) => '[' + edge.join('; ') + ']')
    } else {
      binEdges = ['', '', '', '', '', '', '', '', '', '']
      chips = ['', '', '', '', '', '', '', '', '', '']
      probs = ['', '', '', '', '', '', '', '', '', '']
    }


    return {
      units: question.content?.xLabel ?? '',
      estimateLowest: xMin ?? '',
      estimateHighest: xMax ?? '',
      binEdges,
      chips,
      probs,
      rationale: response?.rationale ?? '',
    }
  } 

  if (question.viewId === 'QuestionMinMaxBest') {
    return {
      estimateLowest: response.min ?? '',
      estimateHighest: response.max ?? '',
      estimateBest: (response.bestEstimate  ?? response.bestGuess) ?? '',
      rationale: response.rationale ?? '',
    }
  }

  if (question.viewId === 'WorkshopProbability') {
    delete response.completed
    return {
      response: JSON.stringify(response),
    }
  }

  if (question.viewId === 'QuestionRadioRich' || question.viewId === 'QuestionRadioLikert') {
    return {
      response: response.response.selected,
      comment: response.response.comment
    }
  }

  if (question.viewId === 'QuestionTable') {
    const data = response.tableData
    const result = {}
    data.forEach((row, rowIndex) => {
      Object.keys(row).forEach((colKey) => {
        const cell = row[colKey]
        if (cell.type === "calculated" || cell.type === "input") {
          const key = `row${rowIndex + 1}_${colKey}` 
          result[key] = cell.content
        }
      })
    })

    return {
      response: JSON.stringify(result),
    }
  }

  throw new Error('This question type is not supported: ' + question.viewId)

}

module.exports = {extractExpertDataForTable}
