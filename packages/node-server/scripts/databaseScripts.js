const { Survey } = require('../database/survey.model')
const { Expert } = require('../database/expert.model')
const mongoose = require('mongoose');

const setupDemoSurvey = async (tenantId) => {
  const surveyId = Math.random().toString(36).substring(2, 7)
  const suuveyIdMongoose = new mongoose.Types.ObjectId()
  
  const welcomePageId = new mongoose.Types.ObjectId()
  const question1Id = new mongoose.Types.ObjectId()
  const question2Id = new mongoose.Types.ObjectId()
  const validationId = new mongoose.Types.ObjectId()
  const validation2Id = new mongoose.Types.ObjectId()
  const validation3Id = new mongoose.Types.ObjectId()
  const question3Id = new mongoose.Types.ObjectId()
  const question4Id = new mongoose.Types.ObjectId()
  const question5Id = new mongoose.Types.ObjectId()
  const question6Id = new mongoose.Types.ObjectId()
  const question7Id = new mongoose.Types.ObjectId()
  const submitPageId = new mongoose.Types.ObjectId()
  const expert1Id = new mongoose.Types.ObjectId()
  const expert2Id = new mongoose.Types.ObjectId()
  const expert3Id = new mongoose.Types.ObjectId()
  const expert4Id = new mongoose.Types.ObjectId()

  const expert1AnswerId = new mongoose.Types.ObjectId()
  const expert2AnswerId = new mongoose.Types.ObjectId()
  const expert3AnswerId = new mongoose.Types.ObjectId()
  const expert4AnswerId = new mongoose.Types.ObjectId()

  const survey = await Survey.create({
    _id: suuveyIdMongoose,
    studyContact: {
      name: 'Survey Creator',
      email: 'admin@priorb.de',
      organisation: 'PRIORB',
    },
    config: {
      allowPostSubmissionView: true,
      public: false,
    },
    name: 'SEE Survey Demo',
    description: 'This is a demo survey',
    id: surveyId,
    tenantId: `${tenantId}`,
    compositeKey: `${tenantId}${surveyId}`,
    agenda: [
      {
        viewId: 'WelcomePage',
        children: [],
        pageId: 'welcome',
        pageType: 'other',
        content: {
          title: 'Welcome!',
          body:
            "<p>This demo survey contains a series of questions to collect your judgements about a new Renal Cell Cancer (RCC) treatment.</p><p>Your progress is continuously saved, so you can pause the survey at any time and return to it later.</p><p>Once you've answered all the questions, please submit your responses on the final page.</p>",
        },
        _id: welcomePageId,
        isChild: false,
      },
      {
        viewId: 'QuestionRoulette',
        pageId: 'h93n8s',
        pageType: 'question',
        _id: question1Id,
        children: [],
        isChild: false,
        content: {
          questionTitle:
            'What proportion of patients will be both alive and progression free at 3 years for the advanced RCC patient population in England if they received cabozantinib plus nivolumab at 1st line in the int/poor risk group and had not had previous treatment with adjuvant pembrolizumab?',
          description: '',
          questionType: "roulette",
          rationaleRequired: false,
          rationalShown: true,
          picot: {
            btnLabel: 'Show PICOT Information',
            populationLabel: 'Population',
            populationDescription: 'Advanced RCC patient population in England',
            interventionLabel: 'Intervention',
            interventionDescription: 'Cabozantinib plus nivolumab at 1st line in the int/poor risk group',
            comparisonLabel: 'Comparison',
            comparisonDescription: 'None',
            outcomeLabel: 'Outcome',
            outcomeDescription: 'Alive and progression free',
            timeLabel: 'Time',
            timeDescription: '3 years',
          },
          preset: 'percentage',
          units: 'Percentage (%)',
          xMinLimitToggle: true,
          xMaxLimitToggle: true,
          xMaxLimit: 100,
          xMinLimit: 0,
        },
      },
      {
        viewId: 'QuestionRoulette',
        pageId: 'wgzgvsw',
        pageType: 'question',
        content: {
          questionTitle:
            'Of those advanced RCC patients who were both alive and progression free at 3 years, how many will be alive and progression free at 5 years, if they received cabozantinib plus nivolumab at 1st line in the int/poor risk group and had not had previous treatment with adjuvant pembrolizumab?',
          description: '',
          questionType: "roulette",
          preset: 'percentage',
          picot: {
            btnLabel: 'Show PICOT Information',
            populationLabel: 'Population',
            populationDescription: 'Advanced RCC patient population in England that were alive and progression free at 3 years',
            interventionLabel: 'Intervention',
            interventionDescription: 'cabozantinib plus nivolumab at 1st line in the int/poor risk group',
            comparisonLabel: 'Comparison',
            comparisonDescription: 'None',
            outcomeLabel: 'Outcome',
            outcomeDescription: 'Alive and progression free',
            timeLabel: 'Time',
            timeDescription: '5 years',
          },
          units: "Percentage (%)",
          xMinLimitToggle: true,
          xMaxLimitToggle: true,
          rationalShown: true,
          xMaxLimit: 100,
          xMinLimit: 0
        },
        isChild: false,
        children: [],
        _id: question2Id
      },
      {
        viewId: "ValidateRouletteConditional",
        pageId: "rnrlg6",
        pageType: "validation",
        _id: validationId,
        content: {
          title: "We have taken your estimates about patient survival rates and visualised them along with existing trial data",
          questionsToValidate: [
            "h93n8s",
            "wgzgvsw"
          ],
          timePoints: [
            36,
            60
          ],
          timeUnits: "Months",
          seriesNames: [
            "3 Years Estimate",
            "5 Years Estimate"
          ],
          trialData: [
            [
              0,
              100
            ],
            [
              3,
              100
            ],
            [
              6,
              95
            ],
            [
              9,
              92
            ],
            [
              12,
              85
            ],
            [
              15,
              84
            ],
            [
              18,
              82
            ]
          ],
          trialName: "XC7 Trial data"
        },
        isChild: false,
        children: [],
        isValidation: true
      },
      {
        viewId: "QuestionMinMaxBest",
        pageId: "84oiae",
        pageType: "question",
        content: {
          questionTitle: "What proportion of patients with RCC that received cabozantinib plus nivolumab as 1st line treatment will experience hepatotoxicity within the first 6 months of treatment?",
          description: "",
          questionType: "minMaxBest",
          required: true,
          rationalShown: true,
          rationaleRequired: true,
          minLimit: 0,
          maxLimit: 100,
          minLimitToggle: true,
          maxLimitToggle: true,
          units: "Percentage (%)"
        },
        isChild: false,
        children: [],
        _id: question3Id
      },
      {
        viewId: "QuestionMinMaxBest",
        pageId: "84oiaf",
        pageType: "question",
        content: {
          questionTitle: "What proportion of patients with RCC that received cabozantinib plus nivolumab as 1st line treatment will experience hepatotoxicity within the first 6 months of treatment?",
          description: "",
          questionType: "minMaxBest",
          minLimitToggle: true,
          maxLimitToggle: true,
          required: true,
          minLimit: 0,
          maxLimit: 100,
          units: "Percentage (%)"
        },
        isChild: false,
        children: [],
        _id: question4Id
      },
      {
        viewId: "ValidateMinMaxBest",
        pageId: "xxx789",
        pageType: "validation",
        _id: validation2Id,
        content: {
          title: "We have taken your estimates about patient survival rates and visualised them along with existing trial data",
          questionsToValidate: [
            "84oiae", "84oiaf"
          ],
          timePoints: [
            36, 60
          ],
          timeUnits: "Months",
          seriesNames: [
            "3 Years Estimate", "5 Years Estimate"
          ],
          trialData: [
            [
              0,
              100
            ],
            [
              3,
              100
            ],
            [
              6,
              95
            ],
            [
              9,
              92
            ],
            [
              12,
              85
            ],
            [
              15,
              84
            ],
            [
              18,
              82
            ]
          ],
          trialName: "XC7 Trial data"
        },
        isChild: false,
        children: [],
        isValidation: true
      },
      {
        viewId: "WorkshopProbability",
        pageId: "84oiqu",
        pageType: "question",
        content: {
          questionTitle: "What proportion of patients with RCC that received cabozantinib plus nivolumab as 1st line treatment will experience hepatotoxicity within the first 18 months of treatment?",
          description: "",
          questionType: "probability",
          minLimitToggle: true,
          maxLimitToggle: true,
          required: true,
          minLimit: 0,
          maxLimit: 100,
          units: "Percentage (%)"
        },
        isChild: false,
        children: [],
        _id: question5Id
      },
      {
        viewId: "WorkshopProbability",
        pageId: "84oipj",
        pageType: "question",
        content: {
          questionTitle: "What proportion of patients with RCC that received cabozantinib plus nivolumab as 1st line treatment will experience hepatotoxicity within the first 5 years of treatment?",
          description: "",
          questionType: "probability",
          minLimitToggle: true,
          maxLimitToggle: true,
          required: true,
          minLimit: 0,
          maxLimit: 100,
          units: "Percentage (%)"
        },
        isChild: false,
        children: [],
        _id: question6Id
      },
      {
        viewId: "ValidateProbabilityMethod",
        pageId: "xxx754",
        pageType: "validation",
        _id: validation3Id,
        content: {
          title: "We have taken your estimates about patient survival rates and visualised them along with existing trial data",
          questionsToValidate: [
            "84oiqu", "84oipj"
          ],
          timePoints: [
            36, 60
          ],
          timeUnits: "Months",
          seriesNames: [
            "3 Years Estimate", "5 Years Estimate"
          ],
          trialData: [
            [
              0,
              100
            ],
            [
              3,
              100
            ],
            [
              6,
              95
            ],
            [
              9,
              92
            ],
            [
              12,
              85
            ],
            [
              15,
              84
            ],
            [
              18,
              82
            ]
          ],
          trialName: "XC7 Trial data"
        },
        isChild: false,
        children: [],
        isValidation: true
      },
      {
        viewId: 'QuestionTable',
        pageId: 'tableaz',
        pageType: 'question',
        content: {
          questionTitle:
            'Could you please elaborate on what systemic treatment you expect patients would receive upon progression after CRT followed by osimertinib or CRT followed by active monitoring. Please include proportions of patients receiving each treatment.',
          description: 'Please note that the total percentages in each line of subsequent therapy should add up to 100%, but that may include best supportive care in addition to active systemic treatments.',
          questionType: "table",
          "table": {
    "totalRows": 15,
    "columns": [
      { "id": "col1", "name": "Subsequent treatments", "width": "auto" },
      { "id": "col2", "name": "Osimertnib arm", "width": "auto", "type": "percentages" },
      { "id": "col3", "name": "Placebo arm", "width": "auto", "type": "percentages" }
    ],
    "rows": {
      "0": {
        "cells": [
          { "columnId": "col1", "content": "Header 1", "type": "header" },
          { "columnId": "col2", "content": "Header 2", "type": "header" },
          { "columnId": "col3", "content": "Header 3", "type": "header" }
        ]
      },
      "1": {
        "cells": [
          { "columnId": "col1", "content": "First line of subsequent therapy", "type": "data" },
          { "columnId": "col2", "content": "% receiving the treatment", "type": "data" },
          { "columnId": "col3", "content": "", "type": "skip" }
        ]
      },
      "7": {
        "cells": [
          { "columnId": "col1", "content": "Total, first line subsequent treatment", "type": "data" },
          { "columnId": "col2", "function": "calculateTotalPercentage", "type": "calculated", "args": [2, 6], "content": "" },
          { "columnId": "col3", "function": "calculateTotalPercentage", "type": "calculated", "args": [2, 6], "content": "" }
        ]
      },
      "8": {
        "cells": [
          { "columnId": "col1", "content": "Second line of subsequent therapy", "type": "data" },
          { "columnId": "col2", "content": "% receiving the treatment", "type": "data" },
          { "columnId": "col3", "content": "", "type": "skip" }
        ]
      },
      "14": {
        "cells": [
          { "columnId": "col1", "content": "Total, second line subsequent treatment", "type": "data" },
          { "columnId": "col2", "function": "calculateTotalPercentage", "type": "calculated", "args": [9, 13], "content": "" },
          { "columnId": "col3", "function": "calculateTotalPercentage", "type": "calculated", "args": [9, 13], "content": "" }
        ]
      },
    },
    "mergedCells": [
      {
        "start": { "rowIndex": 1, "columnId": "col2" },
        "end": { "rowIndex": 1, "columnId": "col3" }
      },
      {
        "start": { "rowIndex": 8, "columnId": "col2" },
        "end": { "rowIndex": 8, "columnId": "col3" }
      }
    ]
  }
        },
        options: {
          showCommentField: true,
        },
        isChild: false,
        children: [],
        _id: question7Id
      },
      {
        viewId: "SubmitPage",
        pageId: "submit",
        pageType: "other",
        content: {
          title: "Ready to submit your responses?",
          body: "After you have completed all questions, please submit your responses, to let us know you are done.",
          note: "Note: You won't be able to change your responses afterwards.",
          btnSubmitLabel: "Submit"
        },
        isChild: false,
        children: [],
        _id: submitPageId
      },
    ],
    lockedScreen: {
      viewId: "LockedPage",
      pageId: "locked",
      pageType: "other",
      content: {
        title: "Thank you for completing this survey.",
        body: "If we have any follow-up questions we will be in contact.",
        subtitle: null,
        contactNote: "If you have any questions, please contact:",
        contactEmail: "paul@priorb.com",
        contactOrganisation: "Priorb",
        contactPerson: "Paul Schneider"
      },
      isChild: false,
      children: [],
      isValidation: false
    },
    status: "published",
    experts: [
      expert1Id,
      expert2Id,
      expert3Id,
      expert4Id
    ],
  })


  // get survey url from survey object
  const surveyUrl = survey.surveyUrl;
  


  await Expert.create(
    [
      {
        _id: expert1Id,
        survey: suuveyIdMongoose,
        compositeKey: `${tenantId}Alice Jones`,
        name: "Alice Jones",
        email: "alice@priorb.com",
        status: "submitted",
        surveyId: surveyId,
        tenantId: tenantId,
        ignoreQuestions: [],
        questionCount: 3,
        completedCount: 3,
        locked: true,
        responses: [
          {
            questionId: question1Id,
            value: {
              chips: [
                0,
                1,
                1,
                3,
                4,
                4,
                3,
                2,
                1,
                1
              ],
              maxChips: 20,
              xMin: 50,
              xMax: 80,
              xMinLimit: 0,
              xMaxLimit: 100,
              xBins: 10,
              yBins: 10,
              xLabel: "Percentage (%)",
              yLabel: "",
              showRationale: true,
              rationaleRequired: false,
              weight: 1,
              fit: "best",
              rationale: "While the phase III CheckMate 9ER trial demonstrated robust efficacy in this patient population, it's essential to acknowledge potential real-world variations due to factors such as patient selection, adherence to treatment, and the presence of comorbidities.\t",
              completed: true
            },
          },
          {
            questionId: question2Id,
            value: {
              chips: [
                0,
                2,
                6,
                5,
                3,
                3,
                1,
                0,
                0,
                0
              ],
              maxChips: 20,
              xMin: 40,
              xMax: 70,
              xMinLimit: 0,
              xMaxLimit: 100,
              xBins: 10,
              yBins: 10,
              xLabel: "Percentage (%)",
              yLabel: "",
              showRationale: true,
              rationaleRequired: true,
              weight: 1,
              fit: "best",
              rationale: "Estimating the proportion of patients who remain alive and progression-free at 5 years from a population already disease-free at 3 years is challenging but essential for long-term patient management. Given the demonstrated durability of response with cabozantinib plus nivolumab in advanced RCC, I have centered my probability distribution around the 42-50% range, reflecting the potential for sustained clinical benefit beyond the initial 3-year period.\t",
              completed: true
            },
          },
          {
            questionId: question3Id,
            value: {
              minLimit: 0,
              maxLimit: 100,
              showRationale: true,
              rationaleRequired: true,
              min: 45,
              max: 45,
              bestEstimate: 60,
              rationale: "NA",
              completed: true
            },
          },
          {
            questionId: question4Id,
            value: {
              minLimit: 0,
              maxLimit: 100,
              showRationale: true,
              rationaleRequired: true,
              min: 10,
              max: 20,
              bestEstimate: 30,
              rationale: "NA",
              completed: true
            },
          }
        ],
        updatedAt: "2024-09-18T13:57:12.107Z",
        surveyUrl: `${surveyUrl}?id=${expert1Id.toString()}`,
        id: expert1AnswerId
      },
      {
        _id: expert2Id,
        survey: suuveyIdMongoose,
        compositeKey: `${tenantId}Bob Taylor`,
        name: "Bob Taylor",
        email: "bob@priorb.com",
        status: "submitted",
        surveyId: surveyId,
        tenantId: tenantId,
        ignoreQuestions: [],
        questionCount: 3,
        completedCount: 3,
        locked: true,
        responses: [
          {
            questionId: question1Id,
            value: {
              chips: [
                0,
                0,
                1,
                1,
                2,
                3,
                5,
                6,
                2,
                0
              ],
              maxChips: 20,
              xMin: 50,
              xMax: 70,
              xMinLimit: 0,
              xMaxLimit: 100,
              xBins: 10,
              yBins: 10,
              xLabel: "Percentage (%)",
              yLabel: "",
              showRationale: true,
              rationaleRequired: false,
              weight: 1,
              fit: "best",
              rationale: "Given the robust efficacy demonstrated in pivotal trials and the emerging real-world evidence supporting cabozantinib plus nivolumab as a first-line treatment for intermediate/poor-risk advanced RCC, I have centered my probability distribution between 60% and 65% for the proportion of patients alive and progression-free at 3 years. This aligns with the findings of the CheckMate 9ER trial, which showed impressive preliminary results this patient population.\t",
              completed: true
            },
          },
          {
            questionId: question2Id,
            value: {
              chips: [
                1,
                1,
                2,
                3,
                4,
                3,
                2,
                2,
                1,
                1
              ],
              maxChips: 20,
              xMin: 30,
              xMax: 80,
              xMinLimit: 0,
              xMaxLimit: 100,
              xBins: 10,
              yBins: 10,
              xLabel: "Percentage (%)",
              yLabel: "",
              showRationale: true,
              rationaleRequired: true,
              weight: 1,
              fit: "best",
              rationale: "Predicting the proportion of patients who remain disease-free at 5 years from a population already achieving 3-year progression-free survival is highly uncertain because the long-term behavior of RCC is complex, with potential for late relapses even after prolonged periods of disease control.\t",
              completed: true
            },
          },
          {
            questionId: question3Id,
            value: {
              minLimit: 0,
              maxLimit: 100,
              showRationale: true,
              rationaleRequired: true,
              min: 30,
              max: 75,
              bestEstimate: 50,
              rationale: "NA",
              completed: true
            },
          },
          {
            questionId: question4Id,
            value: {
              minLimit: 0,
              maxLimit: 100,
              showRationale: true,
              rationaleRequired: true,
              min: 10,
              max: 20,
              bestEstimate: 14,
              rationale: "NA",
              completed: true
            },
          }
        ],
        updatedAt: "2024-09-18T13:58:28.559Z",
        surveyUrl: `${surveyUrl}?id=${expert2AnswerId.toString()}`,
        id: expert2AnswerId
      },
      {
        _id: expert3Id,
        survey: suuveyIdMongoose,
        compositeKey: `${tenantId}Charlie Lee`,
        name: "Charlie Lee",
        email: "charlie@priorb.com",
        status: "ongoing",
        surveyId: surveyId,
        tenantId: tenantId,
        ignoreQuestions: [],
        questionCount: 3,
        completedCount: 1,
        locked: false,
        responses: [
          {
            questionId: question1Id,
            value: {
              chips: [
                0,
                0,
                3,
                3,
                2,
                2,
                3,
                3,
                0,
                0
              ],
              maxChips: 20,
              xMin: 60,
              xMax: 90,
              xMinLimit: 0,
              xMaxLimit: 100,
              xBins: 10,
              yBins: 10,
              xLabel: "Percentage (%)",
              yLabel: "",
              showRationale: true,
              rationaleRequired: false,
              weight: 1,
              fit: "best",
              rationale: "Given the compelling evidence from the CheckMate 9ER trial demonstrating the superior efficacy of cabozantinib plus nivolumab in the intermediate/poor-risk advanced RCC population, I have positioned my probability distribution with a strong emphasis on the higher end of the scale. The observed progression-free survival rates in this trial were exceptionally high, suggesting a potential for a substantial proportion of patients to remain disease-free at 3 years.\t",
              completed: false
            },
          },
          {
            questionId: question2Id,
            value: {
              chips: [
                0,
                2,
                3,
                4,
                4,
                3,
                2,
                1,
                1,
                0
              ],
              maxChips: 20,
              xMin: 40,
              xMax: 70,
              xMinLimit: 0,
              xMaxLimit: 100,
              xBins: 10,
              yBins: 10,
              xLabel: "Percentage (%)",
              yLabel: "",
              showRationale: true,
              rationaleRequired: true,
              weight: 1,
              fit: "best",
              rationale: "Factors such as the emergence of resistance mechanisms, potential late toxicities, and the natural history of the disease can impact long-term outcomes. My estimates reflect the potential for sustained clinical benefit based on the observed efficacy of the treatment combination.\t",
              completed: true
            },
          },
          {
            questionId: question3Id,
            value: {
              minLimit: 0,
              maxLimit: 100,
              showRationale: true,
              rationaleRequired: true,
              min: 70,
              max: 80,
              bestEstimate: 75,
              rationale: "",
              completed: false
            },
          },
          {
            questionId: question4Id,
            value: {
              minLimit: 0,
              maxLimit: 100,
              showRationale: true,
              rationaleRequired: true,
              min: 25,
              max: 75,
              bestEstimate: 50,
              rationale: "NA",
              completed: true
            },
          }
        ],
        updatedAt: "2024-09-20T12:05:39.728Z",
        surveyUrl: `${surveyUrl}?id=${expert3AnswerId.toString()}`,
        id: expert3AnswerId
      },
      {
        _id: expert4Id,
        survey: suuveyIdMongoose,
        compositeKey: `${tenantId}Paul Schneider`,
        name: "Paul Schneider",
        email: "",
        status: "submitted",
        surveyId: surveyId,
        tenantId: tenantId,
        ignoreQuestions: [],
        questionCount: 3,
        completedCount: 2,
        locked: true,
        responses: [
          {
            questionId: question1Id,
            value: {
              chips: [
                0,
                1,
                3,
                3,
                4,
                4,
                3,
                2,
                0,
                0
              ],
              maxChips: 20,
              xMin: 40,
              xMax: 80,
              xMinLimit: 0,
              xMaxLimit: 100,
              xBins: 10,
              yBins: 10,
              xLabel: "Percentage (%)",
              yLabel: "",
              showRationale: true,
              rationaleRequired: false,
              weight: 1,
              fit: "best",
              rationale: "na",
              completed: true
            },
          },
          {
            questionId: question2Id,
            value: {
              chips: [
                0,
                1,
                2,
                3,
                3,
                4,
                3,
                2,
                1,
                1
              ],
              maxChips: 20,
              xMin: 50,
              xMax: 70,
              xMinLimit: 0,
              xMaxLimit: 100,
              xBins: 10,
              yBins: 10,
              xLabel: "Percentage (%)",
              yLabel: "",
              showRationale: true,
              rationaleRequired: true,
              weight: 1,
              fit: "best",
              rationale: "A",
              completed: true
            },
          },
          {
            questionId: question3Id,
            value: {
              minLimit: 0,
              maxLimit: 100,
              showRationale: true,
              rationaleRequired: true,
              min: 50,
              max: 80,
              bestEstimate: 60,
              rationale: "",
              completed: false
            },
          },
          {
            questionId: question4Id,
            value: {
              minLimit: 0,
              maxLimit: 100,
              showRationale: true,
              rationaleRequired: true,
              min: 10,
              max: 40,
              bestEstimate: 22,
              rationale: "NA",
              completed: true
            },
          },
          {
            questionId: question5Id,
            value: {
              minLimit: 0,
              maxLimit: 100,
              showRationale: true,
              rationaleRequired: true,
              min: 30,
              max: 70,
              val25: 40,
              val50: 50,
              val75: 60,
              prob25: 25,
              prob50: 50,
              prob75: 10,
              rationale: "NA",
              completed: true
            },
          },
          {
            questionId: question6Id,
            value: {
              minLimit: 0,
              maxLimit: 100,
              showRationale: true,
              rationaleRequired: true,
              min: 10,
              max: 50,
              val25: 20,
              val50: 30,
              val75: 40,
              prob25: 15,
              prob50: 40,
              prob75: 5,
              rationale: "NA",
              completed: true
            },
          }
        ],
        updatedAt: "2024-09-18T14:11:55.063Z",
        surveyUrl: `${surveyUrl}?id=${expert4AnswerId.toString()}`,
        id: expert4AnswerId
      }
    ])
}

module.exports = { setupDemoSurvey }
