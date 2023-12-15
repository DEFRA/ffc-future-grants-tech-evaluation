const { urlPrefix } = require('../config/server')
const viewTemplate = 'choose-organisation'
const currentPath = `${urlPrefix}/${viewTemplate}`
const nextPath = `${urlPrefix}/portal`
const { getYarValue, setYarValue } = require('../helpers/session')

function createModel (farmerData) {
  const model = {
    formActionPage: currentPath,
    radioInput: {
      name: "chooseOrganisation",
      fieldset: {
        legend: {
          text: "Choose organisation",
          isPageHeading: true,
          classes: "govuk-fieldset__legend--l"
        }
      },
      items: []
    }
  }
  farmerData.companies.forEach((company) => {
    model.radioInput.items.push({
      text: company.name,
      value: company.id
    })
  })
  return model
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    options: {
      auth: false
    },
    handler: (request, h) => {
      const farmerData = getYarValue(request, 'account-information')
      return h.view(viewTemplate, createModel(farmerData))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      auth: false,
    },
    handler: (request, h) => {
      setYarValue(request, 'chosen-organisation', request.payload.chooseOrganisation)
      return h.redirect(nextPath)
    }
  }
]
