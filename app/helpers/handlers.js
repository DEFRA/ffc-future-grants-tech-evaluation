const { getYarValue, setYarValue } = require('../helpers/session')
const { getModel } = require('../helpers/models')
const { checkErrors } = require('../helpers/errorSummaryHandlers')
const { getGrantValues } = require('../helpers/grants-info')
const { formatUKCurrency } = require('../helpers/data-formats')
const {
  SELECT_VARIABLE_TO_REPLACE,
  DELETE_POSTCODE_CHARS_REGEX
} = require('../helpers/regex')
const { getUrl } = require('../helpers/urls')
const { guardPage } = require('../helpers/page-guard')
const senders = require('../messaging/senders')
const createMsg = require('../messaging/create-msg')
const gapiService = require('../services/gapi-service')
const { formatOtherItems } = require('./../helpers/other-items-sizes')
const emailFormatting = require('./../messaging/email/process-submission')
const {
  getConfirmationId,
  getCheckDetailsModel,
  getDataFromYarValue
} = require('./pageHelpers')

const setGrantsData = (question, request) => {
  if (question.grantInfo) {
    const { calculatedGrant, remainingCost } = getGrantValues(
      getYarValue(request, 'itemsTotalValue'),
      question.grantInfo
    )
    setYarValue(request, 'calculatedGrant', calculatedGrant)
    setYarValue(request, 'remainingCost', remainingCost)
  }
}

const sendContactDetailsToSenders = async (request, confirmationId) => {
  try {
    const emailData = await emailFormatting({
      body: createMsg.getAllDetails(request, confirmationId),
      correlationId: request.yar.id
    })
    await senders.sendDesirabilitySubmitted(emailData, request.yar.id)

    console.log('[CONFIRMATION EVENT SENT]')
  } catch (err) {
    console.log('ERROR: ', err)
  }
}


const processGA = async (question, request) => {
  if (question.ga) {
    if (question.ga.journeyStart) {
      setYarValue(request, 'journey-start-time', Date.now())
      console.log('[JOURNEY STARTED] ')
    } else {
      await gapiService.sendGAEvent(request, question.ga)
    }
  }
}

const interpolateString = (stringToCheck, request) => {
  const itemsToReplace = stringToCheck.match(/{{_(.+?)_}}/ig);
  if (!itemsToReplace || itemsToReplace.length === 0) {
    return stringToCheck;
  }
  itemsToReplace.forEach((item) => {
    const cleanUpYarKey = RegExp(/{{_(.+?)_}}/ig).exec(item)[1];
    const yarValue = getYarValue(request, cleanUpYarKey);
    stringToCheck = stringToCheck.replace(item, yarValue);
  });
  return stringToCheck;
}
const titleInterpolation = (title, question, request) => {
  const changedTitle = interpolateString(title, request);
  return {
    ...question,
    title: changedTitle
  }
}

const labelInterpolation = (label, question, request) => {
  const labelText = interpolateString(label.text, request);
  return {
    ...question,
    label: {
      ...question.label,
      text: labelText
    }
  }
}

const getPage = async (question, request, h) => {
  const {
    url,
    type,
    title,
    yarKey,
    backUrl,
    nextUrl,
    label
  } = question

  if (title) {
    question = titleInterpolation(title, question ,request);
  }
  if (label) {
    question = labelInterpolation(label, question ,request);
  }

  const data = getDataFromYarValue(request, yarKey, type)

  switch (url) {
    case 'check-details': {
      return h.view(
        'check-details',
        getCheckDetailsModel(request, question)
      )
    }
    case 'confirmation': {
      const confirmationId = getConfirmationId(request.yar.id);
      return h.view(
        'confirmation',
        {
          url,
          backUrl,
          reference: {
            titleText: "Application complete",
            html: `Your reference number<br><strong>${confirmationId}</strong>`
          },
          confirmationId
        }
      )
    }
    default:
      break
  }

  return h.view('page', getModel(data, question, request))
}

const createAnswerObj = (payload, yarKey, type, request, answers) => {
  let thisAnswer
  for (let [key, value] of Object.entries(payload)) {
    thisAnswer = answers?.find((answer) => answer.value === value)
    setYarValue(request, yarKey, value)
  }
  return thisAnswer
}

const handleMultiInput = (
  type,
  request,
  dataObject,
  yarKey,
  currentQuestion,
  payload
) => {
  if (type === 'multi-input') {
    let allFields = currentQuestion.allFields
    if (currentQuestion.costDataKey) {
      allFields = formatOtherItems(request)
    }
    allFields.forEach((field) => {
      if (field.yarKey === 'existingCoverSize') {
        setYarValue(request, 'existingCoverSize', payload[field.yarKey])
      } else if (field.yarKey === 'coverSize') {
        setYarValue(request, 'coverSize', payload[field.yarKey])
      }
      const payloadYarVal = payload[field.yarKey]
        ? payload[field.yarKey]
            .replace(DELETE_POSTCODE_CHARS_REGEX, '')
            .split(/(?=.{3}$)/)
            .join(' ')
            .toUpperCase()
        : ''
      dataObject = {
        ...dataObject,
        [field.yarKey]:
          field.yarKey === 'postcode' || field.yarKey === 'projectPostcode'
            ? payloadYarVal
            : payload[field.yarKey] || '',
        ...(field.conditionalKey
          ? { [field.conditionalKey]: payload[field.conditionalKey] }
          : {})
      }
    })
    setYarValue(request, yarKey, dataObject)
  }
}

const showPostPage = async (currentQuestion, request, h) => {
  const {
    yarKey,
    answers,
    url,
    ineligibleContent,
    nextUrl,
    nextUrlObject,
    title,
    type,
    label
  } = currentQuestion
  const NOT_ELIGIBLE = { ...ineligibleContent, backUrl: url }
  const payload = request.payload

  const thisAnswer = createAnswerObj(payload, yarKey, type, request, answers)

  if (title) {
    currentQuestion = titleInterpolation(title, currentQuestion ,request);
  }
  if (label) {
    currentQuestion = labelInterpolation(label, currentQuestion ,request);
  }

  const errors = checkErrors(payload, currentQuestion, h, request)
  if (errors) {
    return errors
  }

  if (thisAnswer?.notEligible) {
    return h.view('not-eligible', NOT_ELIGIBLE)
  }

  return h.redirect(
    getUrl(nextUrlObject, nextUrl, request, payload.secBtn, currentQuestion.url)
  )
}

const getHandler = (question) => {
  return (request, h) => {
    return getPage(question, request, h)
  }
}

const getPostHandler = (currentQuestion) => {
  return (request, h) => {
    return showPostPage(currentQuestion, request, h)
  }
}

module.exports = {
  getHandler,
  getPostHandler
}
