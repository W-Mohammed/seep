export const CATEGORICAL_COLORS = [
    'rgb(255, 90, 70)',
    'rgb(0, 95, 137)',
    'rgb(255, 120, 173)',
    'rgb(130, 138, 209)',
    'rgb(254, 174, 254)',
    'rgb(255, 100, 123)',
    'rgb(72, 117, 175)',
    'rgb(255, 147, 218)',
    'rgb(191, 156, 236)',
];




const viridisPalette = (n, palette) => {
    const VIRIDIS1 = ['#440154']
    const ROCKET1 = ['#03051A']
    const VIRIDIS2 = ['#440154','#FDE725']
    const ROCKET2 = ['#03051A','#FAEBDD']
    const VIRIDIS3 = ['#440154','#21908C','#FDE725']
    const ROCKET3 = ['#03051A','#CB1B4F','#FAEBDD']
    const VIRIDIS4 = ['#440154','#31688E','#35B779','#FDE725']
    const ROCKET4 = ['#03051A','#841E5A','#F06043','#FAEBDD']
    const VIRIDIS5 = ['#440154','#3B528B','#21908C','#5DC863','#FDE725']
    const ROCKET5 = ['#03051A','#611F53','#CB1B4F','#F4875E','#FAEBDD']
    const VIRIDIS6 = ['#440154','#414487','#2A788E','#22A884','#7AD151','#FDE725']
    const ROCKET6 = ['#03051A','#4C1D4B','#A11A5B','#E83F3F','#F69C73','#FAEBDD']
    const VIRIDIS7 = ['#440154','#443A83','#31688E','#21908C','#35B779','#8FD744','#FDE725']
    const ROCKET7 = ['#03051A','#3F1B44','#841E5A','#CB1B4F','#F06043','#F6AA82','#FAEBDD']
    const VIRIDIS8 = ['#440154','#46337E','#365C8D','#277F8E','#1FA187','#4AC16D','#9FDA3A','#FDE725']
    const ROCKET8 = ['#03051A','#36193E','#701F57','#AE1759','#E13342','#F37651','#F6B48E','#FAEBDD']
    const VIRIDIS9 = ['#440154','#472D7B','#3B528B','#2C728E','#21908C','#27AD81','#5DC863','#AADC32','#FDE725']
    const ROCKET9 = ['#03051A','#30173A','#611F53','#961C5B','#CB1B4F','#EC4B3E','#F4875E','#F6BB97','#FAEBDD']
    const VIRIDIS10 = ['#440154','#482878','#3E4A89','#31688E','#26828E','#1F9E89','#35B779','#6DCD59','#B4DE2C','#FDE725']
    const ROCKET10 = ['#03051A','#2A1636','#551E4F','#841E5A','#B41658','#DD2C45','#F06043','#F5936A','#F6C09E','#FAEBDD']
    const VIRIDIS11 = ['#440154','#482576','#414487','#35608D','#2A788E','#21908C','#22A884','#43BF71','#7AD151','#BBDF27','#FDE725']
    const ROCKET11 = ['#03051A','#261433','#4C1D4B','#751F58','#A11A5B','#CB1B4F','#E83F3F','#F2704D','#F69C73','#F7C5A5','#FAEBDD']
    const VIRIDIS12 = ['#440154','#482173','#433E85','#38598C','#2D708E','#25858E','#1E9B8A','#2BB07F','#51C56A','#85D54A','#C2DF23','#FDE725']
    const ROCKET12 = ['#03051A','#221331','#451C47','#6A1F56','#921C5B','#B91657','#D92847','#ED513E','#F47C56','#F6A47B','#F7C9AA','#FAEBDD']
    const VIRIDIS13 = ['#440154','#481F70','#443A83','#3B528B','#31688E','#287C8E','#21908C','#20A486','#35B779','#5DC863','#8FD744','#C7E020','#FDE725']
    const ROCKET13 = ['#03051A','#20122E','#3F1B44','#611F53','#841E5A','#A9185A','#CB1B4F','#E43841','#F06043','#F4875E','#F6AA82','#F7CCAE','#FAEBDD']
    const VIRIDIS14 = ['#440154','#481D6F','#453581','#3D4D8A','#34618D','#2B748E','#24878E','#1F998A','#25AC82','#40BC72','#67CC5C','#97D83F','#CBE11E','#FDE725']
    const ROCKET14 = ['#03051A','#1E122D','#3B1A41','#591E50','#791F59','#9A1B5B','#BB1656','#D72649','#EB463E','#F26C4A','#F58F66','#F6B089','#F7CEB2','#FAEBDD']
    const VIRIDIS15 = ['#440154','#481B6D','#46337E','#3F4889','#365C8D','#2E6E8E','#277F8E','#21908C','#1FA187','#2DB27D','#4AC16D','#71CF57','#9FDA3A','#CFE11C','#FDE725']
    const ROCKET15 = ['#03051A','#1B112B','#36193E','#521E4D','#701F57','#8E1D5B','#AE1759','#CB1B4F','#E13342','#EE543F','#F37651','#F5966D','#F6B48E','#F7D0B4','#FAEBDD']
    const VIRIDIS16 = ['#440154','#481A6C','#472F7D','#414487','#39568C','#31688E','#2A788E','#23888E','#1F988B','#22A884','#35B779','#54C568','#7AD151','#A5DB36','#D2E21B','#FDE725']
    const ROCKET16 = ['#03051A','#1A102A','#33183C','#4C1D4B','#681F55','#841E5A','#A11A5B','#BD1655','#D62449','#E83F3F','#F06043','#F47F58','#F69C73','#F6B893','#F8D1B8','#FAEBDD']
    const VIRIDIS17 = ['#440154','#48186A','#472D7B','#424086','#3B528B','#33638D','#2C728E','#26828E','#21908C','#1F9F88','#27AD81','#3EBC74','#5DC863','#82D34D','#AADC32','#D5E21A','#FDE725']
    const ROCKET17 = ['#03051A','#180F29','#30173A','#481C48','#611F53','#7B1F59','#961C5B','#B11758','#CB1B4F','#DE2E44','#EC4B3E','#F26A48','#F4875E','#F6A178','#F6BB97','#F8D3BA','#FAEBDD']
    const VIRIDIS18 = ['#440154','#481769','#472A7A','#433D84','#3D4E8A','#355E8D','#2E6D8E','#297B8E','#23898E','#1F978B','#21A585','#2EB37C','#46C06F','#65CB5E','#89D548','#B0DD2F','#D8E219','#FDE725']
    const ROCKET18 = ['#03051A','#170F28','#2D1738','#431C46','#5B1E51','#731F58','#8C1D5B','#A6195A','#BF1654','#D5224A','#E53940','#EF5640','#F3734E','#F58D64','#F6A67E','#F6BE9B','#F8D4BC','#FAEBDD']
    const VIRIDIS19 = ['#440154','#481668','#482878','#443A83','#3E4A89','#375A8C','#31688E','#2B758E','#26828E','#21908C','#1F9E89','#25AB82','#35B779','#4EC36B','#6DCD59','#8FD744','#B4DE2C','#DAE319','#FDE725']
    const ROCKET19 = ['#03051A','#160E27','#2A1636','#3F1B44','#551E4F','#6D1F56','#841E5A','#9C1B5B','#B41658','#CB1B4F','#DD2C45','#EA443E','#F06043','#F47A54','#F5936A','#F6AA82','#F6C09E','#F8D6BE','#FAEBDD']
    const VIRIDIS20 = ['#440154','#481568','#482677','#453781','#3F4788','#39558C','#32648E','#2D718E','#287D8E','#238A8D','#1F968B','#20A386','#29AF7F','#3CBC75','#56C667','#74D055','#94D840','#B8DE29','#DCE318','#FDE725']
    const ROCKET20 = ['#03051A', '#150E26', '#281535', '#3C1A42', '#511E4D', '#661F54', '#7C1F5A', '#931C5B', '#AA185A', '#C11754', '#D3214B', '#E33541', '#ED4E3E', '#F26847', '#F4815A', '#F5986F', '#F6AE86', '#F7C2A2', '#F8D7BF', '#FAEBDD']

    const VIRIDIS = [VIRIDIS1, VIRIDIS2, VIRIDIS3, VIRIDIS4, VIRIDIS5, VIRIDIS6, VIRIDIS7, VIRIDIS8, VIRIDIS9, VIRIDIS10, VIRIDIS11, VIRIDIS12, VIRIDIS13, VIRIDIS14, VIRIDIS15, VIRIDIS16, VIRIDIS17, VIRIDIS18, VIRIDIS19, VIRIDIS20]

    const ROCKET = [ROCKET1, ROCKET2, ROCKET3, ROCKET4, ROCKET5, ROCKET6, ROCKET7, ROCKET8, ROCKET9, ROCKET10, ROCKET11, ROCKET12, ROCKET13, ROCKET14, ROCKET15, ROCKET16, ROCKET17, ROCKET18, ROCKET19, ROCKET20]


    if(n < 1 || n > 20){
        throw new Error('Invalid number of colors, must be between 1 and 20')
    }

    if (palette === 'viridis') {
        return VIRIDIS[n - 1]
    } else if(palette === 'rocket'){
        return ROCKET[n - 1]
    } else {
        throw new Error('Invalid palette name')
    }
}


function hexToRgb(hex, alpha) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})` : null;
  }

export const viridis = (n,alpha = 1) => {
    let colors = viridisPalette(n, 'viridis')
    return colors.map(hex => hexToRgb(hex, alpha))
}

export const rocket = (n,alpha = 1) => {
    let colors = viridisPalette(n, 'rocket')
    return colors.map(hex => hexToRgb(hex, alpha))
}