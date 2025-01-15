export const probsToRawProbs = (probs) => {
  if (!probs || !probs.length) return [];
  return probs.map((p, i) => {
    if (p == null) return null;
    if (i > probs.length / 2) return (100 * Math.round((1 - p) * 100)) / 100;
    return Math.round(p * 100);
  });
};

export const orderSign = (index, length) => {
  return index < length / 2 ? '&lt;' : '&gt;';
};


export const checkInputsValidity = (
  values,
  probabilities,
  probabilitiesRaw
) => {
  if (!values) return 'No values';
  if (!values.length) return 'No values';
  if (!probabilities) return 'No probabilities';
  if (!probabilities.length) return 'No probabilities';
  if (
    probabilitiesRaw.some(
      (p) => p == null || isNaN(p) || p < 0 || p > 100 || p === ''
    )
  )
    return 'Enter a valid probability between 0% and 100% for each value';
  if (probabilities.some((p, i) => i > 0 && p <= probabilities[i - 1]))
    return 'Probabilities must be in ascending order';

  return false;
};

export const orderOfElicitation = (length, toggleValOrder) => {
  if (toggleValOrder) return Array.from({ length }, (_, i) => i);
  if (length === 4) return [0, 3, 1, 2];
  if (length === 5) return [0, 4, 1, 3, 2];
  if (length === 6) return [0, 5, 1, 4, 2, 3];
  if (length === 7) return [0, 6, 1, 5, 2, 4, 3];
  return [];
};





export const createChartOpts = (values, probs, fittedValues, xValues, showPdf, units) => {

  if (!values || !probs || !fittedValues || !xValues) return {};

  const elicitedRaw = showPdf ? [] : values.map((v, i) => [v,probs[i] * 100,]);
  
  let fitted;
  if (showPdf) {
    const fittedPDF = fittedValues?.map((v, i) => {
      if (i === 0) return null;
      return v - fittedValues[i - 1];
    });
    fitted = fittedPDF.map((v, i) => [xValues[i], v]);
  } else {
    fitted = fittedValues?.map((v, i) => [xValues[i], v * 100]);
  }

  return {
    grid: {
      top: '10%',
      left: '2%',
      right: '2%',
      bottom: '6%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      
      formatter: (params) => {
        const param = params[0];
        const x = param.value[0];
        const range = Math.max(...values) - Math.min(...values);
        const xNice = range < 5 ? x.toFixed(2) : x.toFixed(0);
        if(showPdf) return `${xNice}: ${param.value[1].toFixed(4)}`;
        return `${'P(&lt;'} ${xNice}) = ${param.value[1].toFixed(1)}%`;
        
      },
    },
    xAxis: {
      name: units ?? 'Value',
      nameLocation: 'center',
      // min: currentPageValue.value.values[0],
      nameGap: 24,
    },
    animation: false,
    yAxis: {
      name: showPdf ? 'Density' : 'Probability (%)',
      nameGap: 12,
      min: 0,
    },
    series: [
      {
        type: 'line',
        symbolSize: 10,
        symbol: 'circle',
        color: '#333',
        smooth: true,
        lineStyle: {
          width: 1,
          type: 'dashed',
          opacity: 0.5,
        },
        data: elicitedRaw,
      },
      {
        type: 'line',
        symbolSize: 0,
        symbol: 'circle',
        color: '#7455fd',
        lineStyle: {
          width: 4,
          type: 'solid',
        },
        areaStyle:  {
          color: '#7455fd',
          opacity: 0.1,
        },
        z: 100,
        smooth: false,
        data: fitted,
      },
    ],
  };

};




export const downloadWorkshopProbabilityResults = (results, question, filename) => {
  if (!results) return;
  if (!filename) filename = 'results';

 try {
  const header = ['question', 'units',
    ...results.values.map((v, i) => `value-${i+1}`),
    ...results.probabilities.map((p, i) => `cumulative-p-${i+1}`),
    'rationale', 'fitSelected',
    ...Object.keys(results.modelParams).map((key) => `fitparams-${key}`),
    ...results.xSelected.map((x, i) => `xFitted-${i + 1}`),
    ...results.ySelected.map((y, i) => `yFitted-${i + 1}`),
  ];
  const data = [
    question,
    results.units,
    ...results.values,
    ...results.probabilities,
    results.rationale,
    results.fitSelected,
  ];

  Object.keys(results.modelParams).forEach((key) => {
    data.push(results.modelParams[key]);
  });

  results.xSelected.forEach((x, i) => {
    data.push(x);
  });

  results.ySelected.forEach((y, i) => {
    data.push(y);
  });
   
   // escape commas in data
   data.forEach((d, i) => {
     if (typeof d === 'string' && d.includes(',')) {
       data[i] = `"${d}"`;
     }
    });


  const csv = [header, data].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
   window.URL.revokeObjectURL(url);
 } catch (error) {
   alert('An error occurred while creating the file');
   console.error(error);
 }
};



export const findClosestIndexForPercentile = (percentile, y) => {
  let closestIndex = null
  let closestValue = Infinity
  y.forEach((value, index) => {
    if (Math.abs(value - percentile) < closestValue) {
      closestValue = Math.abs(value - percentile)
      closestIndex = index
    }
  })
  return closestIndex
}


export const conditionalBoxplotData = (values1, probs1, values2, probs2, draws, valuesPercent = true) => {

  if (!values1 || !probs1 || !values2 || !probs2) return [];
  if(values1.length === 0 || probs1.length === 0 || values2.length === 0 || probs2.length === 0) return [];
  if (values1.length !== probs1.length || values2.length !== probs2.length) {
    console.error('Invalid input: values and probabilities must have the same length');
    return [];
  } 
  if(valuesPercent) {
    values1 = values1.map((p) => p / 100);
    values2 = values2.map((p) => p / 100);
  }
  const drawValues = (probs, vals) => {
    const r = Math.random();
    let i = 0;
    while (r > probs[i]) {
      i++;
    }
    if (i >= probs.length) 
      return vals[vals.length - 1];
    else 
      return vals[i];
  };
  let sims = Array.from({ length: draws }, () => drawValues(probs1, values1) * drawValues(probs2, values2));
  sims = sims.sort((a, b) => a - b);
  if (valuesPercent) {
    return sims.map((s) => s * 100);
  } else {
    return sims;
  }
}

