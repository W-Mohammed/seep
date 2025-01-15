import { onBeforeMount } from "vue";

const surveyTitleDefaultIntro = `Welcome to the Survey!`;
const workshopTitleDefaultIntro = `Welcome to the Workshop!`;

const surveyBodyDefaultIntro = `<p>Thank you for taking the time to participate in this survey!</p><p>The survey contains a series of questions to collect your expert opinions and judgements.</p><p>Your progress is continuously saved. You can pause the survey at any time and return to it later.</p><p>Once you've answered all the questions, submit your responses on the last page.</p><p>If you have any questions or encounter any issues, please feel free to contact the study coordinator at <a href="mailto:support@priorb.com" >support@priorb.com </a></p><p>To start the survey, click the 'Continue' button below.'</p>`;
const workshopBodyDefaultIntro = ``;

const surveyTitleDefaultSubmit = `Ready to submit your responses?`;
const workshopTitleDefaultSubmit = `Thank you for your participation!`;
const surveyBodyDefaultSubmit = `After you have completed all questions, please submit your responses, to let us know you are done.`;
const surveyNoteDefaultSubmit = `Note: You won't be able to change your responses afterwards.`;

const workshopTitleLocked = `Thank you for participating in this workshop.`;
const surveyTitleLocked = `Thank you for completing this survey.`;
const workshopBodyLocked = `The workshop has been closed.`;
const surveyBodyLocked = null;
export class BaseAgendaItem {
  constructor(item) {
    this.viewId = item?.viewId; // no default value
    this.pageId = item?.pageId || Math.random().toString(36).substring(2);
    this.pageType = item?.pageType; // no default value
    this.content = item?.content; // no default value
    this.options = item?.options || {
      showCommentField: true,
    };

    // related to sections
    this.order = item?.order; // no default value
    this.parent = item?.parent; // no default value
  }
}

export class QuestionAgendaItem extends BaseAgendaItem {
  constructor(item) {
    super(item);
    this.pageType = "question";
    this.content = item?.content || {
      questionTitle: "",
      description: "",
      questionType: "",
      required: true,
    };
  }

  static getResponse(experts, questionId) {
    if (!experts || !questionId || !experts.length) return []
    let out = []
    experts.forEach((expert) => {
      let response = expert.responses.find((res) => res.questionId === questionId)
      if (!response || !response.value) return
      out.push({
        expertId: expert._id,
        name: expert.name,
        value: null,
        comment: response.value.comment,
      })
    })
    return out
  }
}

export class QuestionFormKitAgendaItem extends QuestionAgendaItem {
  constructor(item) {
    super(item);
    this.viewId = "QuestionFormKit";
  }

  static getResponse(experts, questionId) {
    if (!experts || !questionId || !experts.length) return []
    let out = []
    experts.forEach((expert) => {
      if (expert.ignoreQuestions?.includes(questionId)) return
      let response = expert.responses.find((res) => res.questionId === questionId)
      if (!response || !response.value) return
      const value = response.value.other || response.value.response
      if (!value) return
      out.push({
        expertId: expert._id,
        name: expert.name,
        value,
        comment: response.value.comment,
      })
    })
    return out
  }
}

export class ValidationAgendaItem extends BaseAgendaItem {
  constructor(item) {
    super(item);
  }

  static initialiseResponse(currentPageValue, props) {
    onBeforeMount(() => {
      if (!currentPageValue.value) {
        currentPageValue.value = {
          viewId: props.viewId,
          validatedQuestions: props.content.questionsToValidate,
          response: {
            confirmCount: 0,
            refineCount: 0,
          },
        };
      }
    });
  }

  static getResponse(experts, questionId) {
    if (!experts || !questionId || !experts.length) return []
    let out = []
    experts.forEach((expert) => {
      let response = expert.responses.find((res) => res.questionId === questionId)
      if (!response || !response.value) return
      out.push({
        expertId: expert._id,
        name: expert.name,
        value: response.value.response,
        comment: response.value.comment,
      })
    })
    return out
  }
}

export class NumberAgendaItem extends QuestionFormKitAgendaItem {
  constructor(item) {
    super(item);
    this.content.questionType = "number";
    this.content = {
      ...this.content,
      min: item?.content?.min ?? null,
      max: item?.content?.max ?? null,
    };
  }
}

export class RadioAgendaItem extends QuestionFormKitAgendaItem {
  constructor(item) {
    super(item);
    this.content.questionType = "radio";
    this.content = {
      ...this.content,
      options: item?.content?.options ?? [],
      other: item?.content?.other ?? false,
      otherLabel: item?.content?.otherLabel ?? "Other",
    };
  }
}

export class CheckboxAgendaItem extends QuestionAgendaItem {
  constructor(item) {
    super(item);
    this.viewId = "QuestionCheckbox";
    this.content.questionType = "checkbox";
    this.content = {
      ...this.content,
      options: item?.content?.options ?? [],
      other: item?.content?.other ?? false,
      otherLabel: item?.content?.otherLabel ?? "Other",
    };
  }

  static initialiseResponse(currentPageValue, props) {
    if (!currentPageValue.value) {
      currentPageValue.value = {
        viewId: props.viewId,
        response: {
          selected: [],
          comment: null,
          other: "",
          isOtherSelected: false,
        },
        completed: false,
      };
    }
  }

  static getResponse(experts, questionId) {
    if (!experts || !questionId || !experts.length) return []
    let out = []
    experts.forEach((expert) => {
      if (expert.ignoreQuestions?.includes(questionId)) return
      let response = expert.responses.find((res) => res.questionId === questionId)
      if (!response || !response.value) return
      const value = response.value?.response?.selected || []
      if (response.value?.response?.other) {
        if (!value.find((v) => v === response.value?.response?.other)) {
          value.push(response.value?.response?.other)
        }
      }  
      if (!value) return
      out.push({
        expertId: expert._id,
        name: expert.name,
        value,
        comment: response.value.comment,
      })
    })
    return out
  }
}

export class TextAgendaItem extends QuestionFormKitAgendaItem {
  constructor(item, type, textLength = 10000) {
    super(item);
    this.content.questionType = type || "text";
    this.content = {
      ...this.content,
      validation: textLength ? "length:0," + textLength + "|" : undefined,
    };
  }
}

export class MinMaxBestAgendaItem extends QuestionAgendaItem {
  constructor(item) {
    super(item);
    this.viewId = "QuestionMinMaxBest";
    this.content.questionType = "minMaxBest";
    this.content = {
      ...this.content,
      minLimitToggle: item?.content?.minLimitToggle ?? false,
      minLimit: item?.content?.minLimit ?? null,
      maxLimitToggle: item?.content?.maxLimitToggle ?? false,
      maxLimit: item?.content?.maxLimit ?? null,
      rationaleShown: item?.content?.rationaleShown ?? true,
      rationaleRequired: item?.content?.rationaleRequired ?? true,
      picot: item?.content?.picot ?? {},
      units: item?.content?.units ?? "",
    };
  }

  static initialiseResponse(currentPageValue, props) {
    onBeforeMount(() => {
      if (!currentPageValue.value) {
        currentPageValue.value = {
          viewId: props.viewId,
          minLimit: props.content?.minLimit ?? -Infinity,
          maxLimit: props.content?.maxLimit ?? Infinity,
          showRationale: props.content?.rationaleShown ?? true,
          rationaleRequired: props.content?.rationaleRequired ?? true,
          units: props.content?.units || "",
          min: null,
          max: null,
          bestEstimate: null,
          rationale: "",
          completed: false,
        };
      }
    });
  }

  static getResponse(experts, questionId) {
    if (!experts || !questionId || !experts.length) return []
    let out = []
    experts.forEach((expert) => {
      if (expert.ignoreQuestions?.includes(questionId)) return
      let response = expert.responses.find((res) => res.questionId === questionId)
      if (!response || !response.value) return
      const value = !response.value.bestEstimate ? null : {
        min: response.value.min,
        max: response.value.max,
        bestEstimate: response.value.bestEstimate,
        rationale: response.value.rationale,
        comment: response.value.comment
      }
      out.push({
        expertId: expert._id,
        name: expert.name,
        value,
        comment: null,
      })
    })
    return out
  }
}

export class MatrixAgendaItem extends QuestionAgendaItem {
  constructor(item) {
    super(item);
    this.viewId = "QuestionMatrix";
    this.content.questionType = "matrix";
    this.content = {
      ...this.content,
      rows: item?.content?.rows ?? [""],
      columns: item?.content?.columns ?? ["Confirm", "Challenge/Comment"],
    };
  }

  static initialiseResponse(currentPageValue, props) {
    onBeforeMount(() => {
      if (!currentPageValue.value) {
        if (!currentPageValue.value) {
          currentPageValue.value = {
            response: [],
            completed: false,
            comment: null,
            viewId: props.viewId,
          };
          props.content?.rows?.forEach((row, index) => {
            currentPageValue.value.response[index] = {
              row: row,
              value: null,
              comment: null,
              completed: false,
            };
          });
        }
      }
    });
  }

  static getResponse(experts, questionId) { 
    if (!experts || !questionId || !experts.length) return []
    let out = []
    experts.forEach((expert) => {
      if (expert.ignoreQuestions?.includes(questionId)) return
      let response = expert.responses.find((res) => res.questionId === questionId)
      if (!response || !response.value) return
      if (Array.isArray(response.value.response) && response.value.response.length === 0) return
      const value = response.value.response
      if (!value) return
      out.push({
        expertId: expert._id,
        name: expert.name,
        value,
        comment: response.value.comment,
      })
    })
    return out
  }   
}

export class RouletteAgendaItem extends QuestionAgendaItem {
  constructor(item) {
    super(item);
    this.viewId = "QuestionRoulette";
    this.content.questionType = "roulette";
    this.content = {
      ...this.content,
      preset: item?.content?.preset ?? null,
      units: item?.content?.units ?? null,
      xMinLimitToggle: item?.content?.xMinLimitToggle ?? false,
      xMinLimit: item?.content?.xMinLimit ?? -Infinity,
      xMaxLimitToggle: item?.content?.xMaxLimitToggle ?? false,
      xMaxLimit: item?.content?.xMaxLimit ?? Infinity,
      rationaleShown: item?.content?.rationaleShown ?? true,
      rationaleRequired: item?.content?.rationaleRequired ?? true,
      picot: item?.content?.picot ?? {},
    };
  }

  static initialiseResponse(currentPageValue, props) {
    onBeforeMount(() => {
      if (!currentPageValue.value) {
        currentPageValue.value = {
          viewId: props.viewId,
          chips: props.content?.chips || [],
          maxChips: props.content?.maxChips || 20,
          xMin: props.content?.xMin ?? undefined,
          xMax: props.content?.xMax ?? undefined,
          xMinLimit: props.content?.xMinLimit ?? -Infinity,
          xMaxLimit: props.content?.xMaxLimit ?? Infinity,
          xBins: props.content?.xBins || 10,
          yBins: props.content?.yBins || 10,
          xLabel: props.content?.xLabel || props.content?.units || "",
          yLabel: props.content?.yLabel || "",
          showRationale: props.content?.rationaleShown ?? true,
          rationaleRequired: props.content?.rationaleRequired ?? true,
          weight: 1,
          fit: "best",
          rationale: "",
          completed: false,
        };
      }
    });
  }
}

export class RadioLikertAgendaItem extends QuestionAgendaItem {
  constructor(item) {
    super(item);
    this.viewId = "QuestionRadioLikert";
    this.content.questionType = "radiolikert";
    this.content = {
      ...this.content,
      options: item?.content?.options ?? [],
      showNoResponse: false,
    };
  }

  static initialiseResponse(currentPageValue, props) {
    if (!currentPageValue.value) {
      currentPageValue.value = {
        viewId: props.viewId,
        response: {
          selected: null,
          comment: null,
        },
        completed: false,
      };
    }
  }

  static getResponse(experts, questionId) {
    if (!experts || !questionId || !experts.length) return []
    let out = []
    experts.forEach((expert) => {
      if (expert.ignoreQuestions?.includes(questionId)) return
      let response = expert.responses.find((res) => res.questionId === questionId)
      if (!response || !response.value) return
      const value = response.value?.response?.selected
      if (!value) return
      out.push({
        expertId: expert._id,
        name: expert.name,
        value,
        comment: response.value.comment,
      })
    })
    return out
  }
}

export class RadioRichAgendaItem extends QuestionAgendaItem {
  constructor(item) {
    super(item);
    this.viewId = "QuestionRadioRich";
    this.content.questionType = "radiorich";
    this.content = {
      ...this.content,
      options: item?.content?.options ?? [],
    };
  }

  static initialiseResponse(currentPageValue, props) {
    if (!currentPageValue.value) {
      currentPageValue.value = {
        viewId: props.viewId,
        response: {
          selected: null,
          comment: null,
        },
        completed: false,
      };
    }
  }

  static getResponse(experts, questionId) {
    if (!experts || !questionId || !experts.length) return []
    let out = []
    experts.forEach((expert) => {
      if (expert.ignoreQuestions?.includes(questionId)) return
      let response = expert.responses.find((res) => res.questionId === questionId)
      if (!response || !response.value) return
      const value = response.value?.response?.selected
      if (!value) return
      out.push({
        expertId: expert._id,
        name: expert.name,
        value,
        comment: response.value.comment,
      })
    })
    return out
  }
}

export class WorkshopProbabilityAgendaItem extends QuestionAgendaItem {
  constructor(item) {
    super(item);
    this.viewId = "WorkshopProbability";
    this.pageType = "question";
    this.content = {
      ...this.content,
      questionType: "workshopprobability",
      options: item?.content?.options ?? [],
      minLimitToggle: item?.content?.minLimitToggle ?? false,
      minLimit: item?.content?.minLimit ?? null,
      maxLimitToggle: item?.content?.maxLimitToggle ?? false,
      maxLimit: item?.content?.maxLimit ?? null,
      rationaleShown: item?.content?.rationaleShown ?? true,
      rationaleRequired: item?.content?.rationaleRequired ?? true,
      picot: item?.content?.picot ?? {},
      units: item?.content?.units ?? "",
    };
  }

  static initialiseResponse(currentPageValue, props) {
    onBeforeMount(() => {
      if (!currentPageValue.value) {
        currentPageValue.value = {
          viewId: props.viewId,
          minLimit: props.content?.minLimit ?? -Infinity,
          maxLimit: props.content?.maxLimit ?? Infinity,
          showRationale: props.content?.rationaleShown ?? true,
          rationaleRequired: props.content?.rationaleShown
            ? props.content?.rationaleRequired ?? true
            : false,
          units: props.content?.units || "",
          values: [],
          probabilities: [],
          fitSelected: null,
          modelParams: {},
          xSelected: [],
          ySelected: [],
          rationale: "",
          completed: false,
        };
      }
    });
  }

  static getResponse(experts, questionId) {
    if (!experts || !questionId || !experts.length) return []
    let out = []
    experts.forEach((expert) => {
      if (expert.ignoreQuestions?.includes(questionId)) return
      let response = expert.responses.find((res) => res.questionId === questionId)
      if (!response || !response.value) return
      const value = response.value
      if (!value) return
      out.push({
        expertId: expert._id,
        name: expert.name,
        value,
        comment: response.value.comment,
      })
    })
    return out
  }
}

export class TableAgendaItem extends QuestionAgendaItem {
  constructor(item) {
    super(item);
    this.viewId = "QuestionTable";
    this.content.questionType = "table";
    this.content = {
      ...this.content,
      table: {
        totalRows: 0,
        columns: [],
        rows: {},
        mergedCells: [],
      },
    };
  }

  static initialiseResponse(currentPageValue, props) {
    onBeforeMount(() => {
      if (!currentPageValue.value) {
        currentPageValue.value = {
          viewId: "QuestionTable",
          tableData: props.content?.tableData || [],
          completed: false,
        };
      }
    });
  }

  static getResponse(experts, questionId) {
    if (!experts || !questionId || !experts.length) return []
    let out = []
    experts.forEach((expert) => {
      if (expert.ignoreQuestions?.includes(questionId)) return
      let response = expert.responses.find((res) => res.questionId === questionId)
      if (!response || !response.value) return
      const result = {}
      const data = response.value.tableData
      data.forEach((row, rowIndex) => {
        Object.keys(row).forEach((colKey) => {
          const cell = row[colKey]
          if (cell.type === "calculated" || cell.type === "input") {
            const key = `row${rowIndex + 1}_${colKey}` 
            result[key] = cell.content
          }
        })
      })
      if (result == null) return
      out.push({
        expertId: expert._id,
        name: expert.name,
        value: result,
        comment: null,
      })
    })
    return out
  }  
}

export class WelcomeAgendaItem extends BaseAgendaItem {
  constructor(item, type) {
    super(item);
    this.viewId = type === "workshop" ? "WorkshopWelcome" : "WelcomePage";
    this.pageId = "IntroPage";
    this.pageType = "other";
    this.content = {
      title:
        type === "workshop"
          ? workshopTitleDefaultIntro
          : surveyTitleDefaultIntro,
      body:
        type === "workshop" ? workshopBodyDefaultIntro : surveyBodyDefaultIntro,
    };
  }
}

export class SubmitAgendaItem extends BaseAgendaItem {
  constructor(item, type) {
    super(item);
    this.viewId = "SubmitPage";
    this.pageId = "SubmitPage";
    this.pageType = "other";
    this.content = {
      title:
        type === "workshop"
          ? workshopTitleDefaultSubmit
          : surveyTitleDefaultSubmit,
      body: type === "workshop" ? "" : surveyBodyDefaultSubmit,
      note: type === "workshop" ? "" : surveyNoteDefaultSubmit,
      btnSubmitLabel: type === "workshop" ? "Close Workshop" : "Submit",
    };
  }
}

export class LockedAgendaItem extends BaseAgendaItem {
  constructor(item, type) {
    super();
    this.viewId = "LockedPage";
    this.pageId = "LockedPage";
    this.pageType = "other";
    this.content = {
      title: type === "workshop" ? workshopTitleLocked : surveyTitleLocked,
      body: type === "workshop" ? workshopBodyLocked : surveyBodyLocked,
      subtitle: null, //'You may now close this window.',
      contactNote: "If you have any questions, please contact:",
      contactPerson: item.name,
      contactOrganisation: item.organisation,
      contactEmail: item.email,
    };
  }
}

export class BackgroundAgendaItem extends BaseAgendaItem {
  constructor(item) {
    super(item);
    this.viewId = "BackgroundPage";
    this.pageType = "static";
    this.content = {
      questionType: "backgroundPage",
      abovePdf: {
        title: item?.content?.abovePdf?.title ?? "",
        body: item?.content?.abovePdf?.body ?? "",
      },
      belowPdf: {
        title: item?.content?.belowPdf?.title ?? null,
        body: item?.content?.belowPdf?.body ?? null,
      },
      pdf: item?.content?.pdf ?? null,
    };
  }
}

export class SectionAgendaItem extends BaseAgendaItem {
  constructor(item) {
    super(item);
    this.viewId = "Section";
    this.pageType = "section";
    this.content = item?.content || {
      sectionTitle: item?.content?.sectionTitle ?? "",
      sectionDescription: item?.content?.sectionDescription ?? "",
      required: true,
    };
    this.children = item?.children ?? [new RouletteAgendaItem()];
  }
}
