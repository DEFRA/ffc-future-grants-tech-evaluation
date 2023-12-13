const { getHtml } = require('../helpers/conditionalHTML')
const { setOptionsLabel } = require('../helpers/answer-options')
const { getYarValue, setYarValue } = require('../helpers/session')
const urlPrefix = require('../config/server').urlPrefix
const { formatUKCurrency } = require('../helpers/data-formats')

const getConfirmationId = (guid) => {
  const prefix = 'SI'
  return `${prefix}-${guid.substr(0, 3)}-${guid.substr(3, 3)}`.toUpperCase()
}

const handleConditinalHtmlData = (type, labelData, yarKey, request) => {
  const isMultiInput = type === 'multi-input'
  const label = isMultiInput ? 'sbi' : yarKey
  const fieldValue = isMultiInput ? getYarValue(request, yarKey)?.sbi : getYarValue(request, yarKey)
  return getHtml(label, labelData, fieldValue)
}

const saveValuesToArray = (yarKey, fields) => {
  const result = []

  if (yarKey) {
    fields.forEach(field => {
      if (yarKey[field]) {
        result.push(yarKey[field])
      }
    })
  }

  return result
}

const getCheckDetailsModel = (request, question) => {
  setYarValue(request, 'reachedCheckDetails', true)
  
  if (question.summarySections) {
    question.summarySections.forEach((summary) => {
      if (summary.type === 'simple') {
        summary.rows.forEach((row) => {
          let value = getYarValue(request, row.yarKey);
          // Checks if the value to be displayed needs formatting
          if (row.format) {
            switch (row.format) {
              case "currency": 
                value = '£' + formatUKCurrency(value);
              default:
                break;
            }
          }
          // Adds the specific fields for it to render in the gov summayr list
          row.value = {
            text: value
          }
          let rowTitle = row.title;
          // Checks to see if the summary title needs a yar key replacing with a value
          if (rowTitle.includes('{{_')) {
            const cleanUpYarKey = RegExp(/{{_(.+?)_}}/ig).exec(rowTitle)[1];
            rowTitle = rowTitle.replace(/{{_(.+?)_}}/, getYarValue(request, cleanUpYarKey));
          }
          row.key = {
            text: rowTitle
          }
          if (row.changeUrl) {
            row.actions = {
              items: [
                {
                  href: `${urlPrefix}/${row.changeUrl}`,
                  text: "Change",
                }
              ]
            }
          }
        });
      }
    });
  }
 
  return {
    ...question,
  }
}

const getEvidenceSummaryModel = (request, question, backUrl, nextUrl) => {
  setYarValue(request, 'reachedEvidenceSummary', true)

  const planningPermission = getYarValue(request, 'planningPermission')
  const gridReference = getYarValue(request, 'gridReference').toUpperCase()
  const hasEvidence = planningPermission && !planningPermission.startsWith('Not yet applied')
  const PlanningPermissionEvidence = getYarValue(request, 'PlanningPermissionEvidence')

  if (hasEvidence && !PlanningPermissionEvidence) {
    return { redirect: true }
  }
  if (!hasEvidence) {
    setYarValue(request, 'PlanningPermissionEvidence', null)
  }

  return ({
    ...question.pageData,
    backUrl,
    nextUrl,
    planningPermission,
    gridReference,
    ...(hasEvidence
      ? {
          evidence: {
            planningAuthority: PlanningPermissionEvidence?.planningAuthority,
            planningReferenceNumber: PlanningPermissionEvidence?.planningReferenceNumber.toUpperCase()
          }
        }
      : {}
    )
  })
}

const getDataFromYarValue = (request, yarKey, type) => {
  let data = getYarValue(request, yarKey) || null
  if (type === 'multi-answer' && !!data) {
    data = [data].flat()
  }

  return data
}

const getConsentOptionalData = (consentOptional) => {
  return {
    hiddenInput: {
      id: 'consentMain',
      name: 'consentMain',
      value: 'true',
      type: 'hidden'
    },
    idPrefix: 'consentOptional',
    name: 'consentOptional',
    items: setOptionsLabel(consentOptional,
      [{
        value: 'CONSENT_OPTIONAL',
        text: '(Optional) I consent to being contacted about improvement services'
      }]
    )
  }
}

module.exports = {
  getConfirmationId,
  handleConditinalHtmlData,
  getCheckDetailsModel,
  getEvidenceSummaryModel,
  getDataFromYarValue,
  getConsentOptionalData
}
