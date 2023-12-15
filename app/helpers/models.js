const { getUrl } = require('../helpers/urls')
const { getOptions } = require('../helpers/answer-options')
const { getYarValue, setYarValue } = require('../helpers/session')
const { formatUKCurrency } = require('../helpers/data-formats')

const getPrefixSufixString = (prefixSufix, selectedValueOfLinkedQuestion) => {
  if (prefixSufix.linkedPrefix || prefixSufix.linkedSufix) {
    selectedValueOfLinkedQuestion = prefixSufix.linkedPrefix.concat(selectedValueOfLinkedQuestion)
  }
  if (prefixSufix.linkedSufix) {
    selectedValueOfLinkedQuestion = selectedValueOfLinkedQuestion.concat(prefixSufix.linkedSufix)
  }
  return selectedValueOfLinkedQuestion
}

const getDependentSideBar = (sidebar, request) => {
  const { values, dependentQuestionKeys } = sidebar
  dependentQuestionKeys.forEach((dependentQuestionKey, index) => {
    values[index].content[0].items = []

    // const yarKey = getQuestionByKey(dependentQuestionKey).yarKey
    let selectedAnswers = getYarValue(request, dependentQuestionKey)

    if (selectedAnswers === null) {
      // dependentQuestionKeys.slice(dependentQuestionKeys[dependentQuestionKey])
      values[index].heading = null
      values[index].content.slice()
    } else {
      switch (dependentQuestionKey) {
        case 'storageType':
          values[index].heading = 'Grant-funded store'
          break
        case 'coverType':
          values[index].heading = 'Grant-funded store cover'
          break
        case 'existingCoverType':
          values[index].heading = 'Existing store cover'
          break
        case 'separatorOptions':
          values[index].heading = 'Separator'

          if (request.route.path === '/tech-evaluation/separator-type') {
            setYarValue(request, 'separatorOptions', [])
            selectedAnswers = []
          } else if (request.route.path === '/tech-evaluation/gantry') {
            const tempSeparatorVal = [getYarValue(request, 'separatorOptions')].flat()

            tempSeparatorVal.splice(1, tempSeparatorVal.length - 1)

            setYarValue(request, 'separatorOptions', tempSeparatorVal)
            selectedAnswers = tempSeparatorVal
          } else if (request.route.path === '/tech-evaluation/short-term-storage') {
            const tempSeparatorVal = [getYarValue(request, 'separatorOptions')].flat()

            if (tempSeparatorVal.includes('Gantry')) {
              tempSeparatorVal.splice(2, tempSeparatorVal.length - 2)
            } else {
              tempSeparatorVal.splice(1, tempSeparatorVal.length - 1)
            }

            setYarValue(request, 'separatorOptions', tempSeparatorVal)
            selectedAnswers = tempSeparatorVal
          }

          break
        case 'otherItems':
          values[index].heading = 'Other items'
          break
        default:
          break
      }

      values[index].content[0].items = [selectedAnswers].flat()

      if (sidebar.linkedQuestionyarkey && index < sidebar.linkedQuestionyarkey.length) {
        // const yarValueOfLinkedQuestion = getQuestionByKey(sidebar.linkedQuestionkey[index]).yarKey
        let selectedValueOfLinkedQuestion = getYarValue(request, sidebar.linkedQuestionyarkey[index])

        if (selectedValueOfLinkedQuestion && sidebar.prefixSufix) {
          selectedValueOfLinkedQuestion = getPrefixSufixString(sidebar.prefixSufix[index], formatUKCurrency(selectedValueOfLinkedQuestion))
        }

        values[index].content[0].items.push(selectedValueOfLinkedQuestion)
      }
    }
  })
  return {
    ...sidebar
  }
}

const getBackUrl = (hasScore, backUrlObject, backUrl, request) => {
  const url = getUrl(backUrlObject, backUrl, request)
  return url
}

const showBackToDetailsButton = (key, request) => {
  switch (key) {
    case 'farmer-details':
    case 'business-details':
    case 'applicant-details':
    case 'agent-details':
    case 'score': {
      return !!getYarValue(request, 'reachedCheckDetails')
    }
    default:
      return false
  }
}

const showBackToEvidenceSummaryButton = (key, request) => {
  switch (key) {
    case 'planning-permission':
    case 'planning-permission-evidence':
    case 'grid-reference': {
      return !!getYarValue(request, 'reachedEvidenceSummary')
    }
    default:
      return false
  }
}

const getModel = (data, question, request, conditionalHtml = '') => {
  let { type, backUrl, key, backUrlObject, sidebar, title, hint, score, label, warning, warningCondition } = question
  const hasScore = !!getYarValue(request, 'current-score')

  title = title ?? label?.text

  const sideBarText = (sidebar?.dependentQuestionKeys)
    ? getDependentSideBar(sidebar, request)
    : sidebar

  const showSidebar = sidebar?.showSidebar
  const farmerData = getYarValue(request, 'account-information')
  const chosenOrganisation = getYarValue(request, 'chosen-organisation')
  return {
    type,
    key,
    title,
    hint,
    backUrl: getBackUrl(hasScore, backUrlObject, backUrl, request),
    items: getOptions(data, question, conditionalHtml, request),
    headerData: {
      chosenFarm: farmerData.companies.find((company) => company.id === chosenOrganisation).name,
      sbi: farmerData.sbi,
      firstName: farmerData.firstName,
      lastName: farmerData.lastName
    },
    sideBarText,
    showSidebar,
    reachedCheckDetails: showBackToDetailsButton(key, request),
    reachedEvidenceSummary: showBackToEvidenceSummaryButton(key, request),
    diaplaySecondryBtn: hasScore && score?.isDisplay
  }
}

module.exports = {
  getModel
}
