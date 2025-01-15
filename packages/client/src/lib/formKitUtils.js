
import { makeStep } from '@/lib/utils'
  
  const makeNumberQuestion = (rawQuestion, pageId) => {
    
    const questionFormKit = {
      $cmp: 'FormKit',
      props: {
        ...rawQuestion,
        name: 'response',
        type: rawQuestion?.questionType ?? rawQuestion.type,
        label: rawQuestion?.label,
        id: pageId,
        min: rawQuestion?.min ?? undefined,
        max: rawQuestion?.max ?? undefined,
        step: rawQuestion?.step ?? undefined,
        'validation-visibility': rawQuestion?.validationVisibility ?? 'dirty',
        'validation-label': rawQuestion?.validationLabel ?? 'This field',
        validation: rawQuestion?.validation
      }
    }
    if (!questionFormKit.props.validation) {
      if (rawQuestion.required) questionFormKit.props.validation = 'required|'
      if (questionFormKit.props.min !== undefined) questionFormKit.props.validation += `min:${questionFormKit.props.min}|`
      if (questionFormKit.props.max !== undefined) questionFormKit.props.validation += `max:${questionFormKit.props.max}|`
      if (!questionFormKit.props.step) questionFormKit.props.step = makeStep(questionFormKit.props.min, questionFormKit.props.max)
    }
    return questionFormKit
  }
  
  
  const makeRadioQuestion = (rawQuestion, pageId) => {
    
    let questionsArray = []
    const questionFormKit = {
      $cmp: 'FormKit',
      props: {
        ...rawQuestion,
        name: 'response',
        type: rawQuestion?.questionType ?? rawQuestion.type,
        label: rawQuestion?.label,
        id: pageId,
        options: rawQuestion?.options ?? [],
        'validation-visibility': rawQuestion?.validationVisibility ?? 'dirty',
        'validation-label': rawQuestion?.validationLabel ?? 'This field',
        validation: rawQuestion?.validation
      }
    }
    if(!questionFormKit.props.validation) {
      if (rawQuestion.required) questionFormKit.props.validation = 'required|'
    }
    questionsArray.push(questionFormKit)
    if (rawQuestion.other) {
      let otherLabel = rawQuestion?.otherLabel ?? 'Other'
      questionFormKit.props.options = [...rawQuestion.options, { label: otherLabel, value: 'other' }]
      // add text field for other
      let otherField = {
        $cmp: 'FormKit',
        if: "$get(" + pageId+").value == 'other'",
        props: {
          name: `other`,
          type: 'text',
          label: null,
          placeholder: 'Please specify',
          id: `${pageId}-other`,
        }
      }
      if (rawQuestion.required) otherField.props.validation = 'required|'
      questionsArray.push(otherField)
    }
  
    return questionsArray
  }
  
  const makeTextQuestion = (rawQuestion, pageId) => {
    
    const questionFormKit = {
      $cmp: 'FormKit',
      props: {
        ...rawQuestion,
        name: 'response',
        type: rawQuestion?.questionType ?? rawQuestion.type,
        label: rawQuestion?.label,
        id: pageId,
        'validation-visibility': rawQuestion?.validationVisibility ?? 'dirty',
        'validation-label': rawQuestion?.validationLabel ?? 'This field',
        validation: rawQuestion?.validation
      }
    }
    if (rawQuestion.required) {
      if (!questionFormKit.props.validation) questionFormKit.props.validation = 'required|'
      else questionFormKit.props.validation += 'required|'
    }
    return questionFormKit
  }
  
  const makeTextareaQuestion = (rawQuestion, pageId) => {
    
    const questionFormKit = {
      $cmp: 'FormKit',
      props: {
        ...rawQuestion,
        name: 'response',
        type: rawQuestion?.questionType ?? rawQuestion.type,
        label: rawQuestion?.label,
        id: pageId,
        'validation-visibility': rawQuestion?.validationVisibility ?? 'dirty',
        'validation-label': rawQuestion?.validationLabel ?? 'This field',
        validation: rawQuestion?.validation
      }
    }
    if (rawQuestion.required) {
      if (!questionFormKit.props.validation) questionFormKit.props.validation = 'required|'
      else questionFormKit.props.validation += 'required|'
    }
    return questionFormKit
  }

  const makeCheckboxQuestion = (rawQuestion, pageId) => {

    let questionsArray = []
    const questionFormKit = {
      $cmp: 'FormKit',
      props: {
        ...rawQuestion,
        name: 'response',
        type: rawQuestion?.questionType ?? rawQuestion.type,
        label: rawQuestion?.label,
        id: pageId,
        options: rawQuestion?.options ?? [],
        'validation-visibility': rawQuestion?.validationVisibility ?? 'dirty',
        'validation-label': rawQuestion?.validationLabel ?? 'This field',
        validation: rawQuestion?.validation
      }
    }
    if(!questionFormKit.props.validation) {
      if (rawQuestion.required) questionFormKit.props.validation = 'required|'
    }
    questionsArray.push(questionFormKit)


    if (rawQuestion.other) {
      let otherLabel = rawQuestion?.otherLabel ?? 'Other'

      let otherCheckbox = {
        $cmp: 'FormKit',
        props: {
          name: `other-checkbox`,
          id: `other-checkbox`,
          type: 'checkbox',
          label: otherLabel,
          value: 'other'
        }
      }
      if (rawQuestion.required) otherCheckbox.props.validation = 'required|'
      questionsArray.push(otherCheckbox)

      let otherField = {
        $cmp: 'FormKit',
        if: "$get('other-checkbox').value == true", //"$get(" + pageId + "-other-checkbox).value == 'other'",
        props: {
          name: `other`,
          type: 'text',
          placeholder: 'Please specify',
          id: `${pageId}-other`,
        }
      }
      if (rawQuestion.required) otherField.props.validation = 'required|'
      questionsArray.push(otherField)
    }

    return questionsArray
  }
  

  export const makeFormKitQuestion = (rawQuestion, pageId) => {
    if (rawQuestion.questionType === 'radio')
      return makeRadioQuestion(rawQuestion, pageId)
    if (rawQuestion.questionType === 'number') 
      return makeNumberQuestion(rawQuestion, pageId)
    if (rawQuestion.questionType === 'checkbox')
      return makeCheckboxQuestion(rawQuestion, pageId)
    if (rawQuestion.questionType === 'text')
      return makeTextQuestion(rawQuestion, pageId)
    if (rawQuestion.questionType === 'textarea')
      return makeTextareaQuestion(rawQuestion, pageId)
  }

// count number of responses by category for radio and checkbox questions
export const countByCategory = (responseByExpert) => {
  const responses = responseByExpert?.map((res) => res.value)
  const counts = responses?.reduce((acc, val) => {
    if (val) {
      if (Array.isArray(val)) {
        for (const key of val) {
          acc[key] = (acc[key] || 0) + 1
        }
      } else {
        acc[val] = (acc[val] || 0) + 1
      }
    }
    return acc
  }, {})
  return counts
}