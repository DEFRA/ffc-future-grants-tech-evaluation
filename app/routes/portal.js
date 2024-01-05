const { urlPrefix } = require('../config/server')
const viewTemplate = 'portal'
const currentPath = `${urlPrefix}/${viewTemplate}`
const { setYarValue, getYarValue } = require('../helpers/session')
const { getGrants } = require('../messaging/application')
//const {availableGrants:availableGrantsMock} = require('../config/available-grants-mock')
const { questionBank } = require('../config/question-bank')
const {drawSectionGetRequests, drawSectionPostRequests} = require('../routes')
const grantStatus = {
  'available': {
    text: 'Available',
    classes: 'govuk-tag--blue'
  },
  'inProgress': {
    text: 'In Progress',
    classes: 'govuk-tag--light-blue'
  },
  'rejected': {
    text: 'Rejected',
    classes: 'govuk-tag--red'
  },
  'complete': {
    text: 'Complete',
    classes: 'govuk-tag--green'
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    options: {
      auth: false
    },
    handler: async(request, h) => {
      //GET the available grants information and save it in a yarKey
      try {
        console.log('Sending session message .....')
        const result = await getGrants(request.yar.id, getYarValue(request, 'msgQueueSuffix'))
        console.log(result, '[THIS IS RESULT WE GOT BACK]')
        request.yar.set('available-grants', result)
        // return h.view(viewTemplate, createModel({ catagories: result.data.desirability.catagories }, request))
      } catch (error) {
        console.log(error)
        return h.view('500').takeover()
      }
      const availableGrants = getYarValue(request, 'available-grants').grants
      //setYarValue(request, 'available-grants', availableGrants);
      const farmerData = getYarValue(request, 'account-information');
      const chosenFarm = getYarValue(request, 'chosen-organisation');
      // Format the grant status to be displayed properly
      availableGrants.forEach((grant) => {
        grant.tagDisplay = grantStatus[grant.status]
      });
      return h.view(viewTemplate, {
        formActionPage: currentPath,
        backUrl: `${urlPrefix}/choose-organisation`,
        farmerData,
        chosenFarm: farmerData.companies.find((company) => company.id === chosenFarm),
        availableGrants
      });
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      auth: false
    },
    handler: (request, h) => {
      const grantID = request.payload.grantId;
      //GET the specific grants information / question bank
      const questionBankData = questionBank;
      // Save the whole grant information in cache
      setYarValue(request, 'grant-information', questionBankData);
      const allQuestions = []
      questionBankData.themes.forEach(({ questions }) => {
        allQuestions.push(...questions)
      })
      // Saves all of the questions in a yar key as too many integral functions require the ALL_QUESTIONS property
      setYarValue(request, 'grant-questions', allQuestions);
      // Generate the new routes
      const pages = questionBankData.themes.map(section => drawSectionGetRequests(section))[0]
      .concat(questionBankData.themes.map(section => drawSectionPostRequests(section))[0])
      // Access server and register the new routes
      request.server.route(pages)
      const startUrl = questionBankData.themes[0].questions.find((theme) => theme.journeyStart).url
      return h.redirect(`${urlPrefix}/${startUrl}`);
    }
  }
]
