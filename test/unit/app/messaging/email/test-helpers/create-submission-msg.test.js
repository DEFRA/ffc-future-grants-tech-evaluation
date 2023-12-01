const agentSubmission = require('./submission-agent.json')
const farmerSubmission = require('./submission-farmer.json')
const desirabilityScore = require('./desirability-score.json')
const spreadsheetConfig = require('../../../../../../app/messaging/config/spreadsheet')
describe('Create submission message', () => {
  const mockPassword = 'mock-pwd'

  jest.mock('./../../../../../../app/messaging/config/email', () => ({
    notifyTemplate: 'mock-template'
  }))
  jest.mock('./../../../../../../app/messaging/config/spreadsheet', () => {
    return {
      hideEmptyRows: true,
      protectEnabled: true,
      sendEmailToRpa: true,
      rpaEmail: 'FTF@rpa.gov.uk',
      protectPassword: mockPassword
    }
  })

  const createMsg = require('../../../../../../app/messaging/email/create-submission-msg')

  beforeEach(() => {
    jest.resetModules()
  })

  test('Farmer submission generates correct message payload', () => {
    const msg = createMsg(farmerSubmission, desirabilityScore)
    console.info('---------MSG DETAILS---------')
    console.table(msg.applicantEmail.details)
    expect(msg).toHaveProperty('agentEmail')
    expect(msg).toHaveProperty('applicantEmail')
    expect(msg).toHaveProperty('rpaEmail')
    expect(msg).toHaveProperty('spreadsheet')
    expect(msg.applicantEmail.emailAddress).toBe(farmerSubmission.farmerDetails.emailAddress)
    expect(msg.applicantEmail.details.gridReference).toBe(farmerSubmission.gridReference.replace(/\s/g, '').toUpperCase())
    expect(msg.rpaEmail.emailAddress).toBe('FTF@rpa.gov.uk')
    expect(msg.agentEmail).toBe(null)
  })

  test('Farmer submission generates message payload without RPA email when config is Flase', () => {
    jest.mock('../../../../../../app/messaging/config/spreadsheet', () => ({
      hideEmptyRows: true,
      protectEnabled: false,
      sendEmailToRpa: false,
      protectPassword: mockPassword
    }))

    farmerSubmission.applicantType = ['Beef (including calf rearing)', 'Dairy (including calf rearing)']

    const msg = createMsg(farmerSubmission, desirabilityScore)
    expect(msg).toHaveProperty('agentEmail')
    expect(msg).toHaveProperty('applicantEmail')
    expect(msg).toHaveProperty('rpaEmail')
    expect(msg).toHaveProperty('spreadsheet')
    // expect(msg).toHaveProperty('gridReference')
    expect(msg.applicantEmail.emailAddress).toBe(farmerSubmission.farmerDetails.emailAddress)
    expect(msg.rpaEmail.emailAddress).toBeFalsy
    expect(msg.agentEmail).toBe(null)
  })
  test('Email part of message should have correct properties', () => {
    farmerSubmission.applicantType = 'Dairy (including calf rearing)'

    const msg = createMsg(farmerSubmission, desirabilityScore)

    expect(msg.applicantEmail).toHaveProperty('notifyTemplate')
    expect(msg.applicantEmail).toHaveProperty('emailAddress')
    expect(msg.applicantEmail).toHaveProperty('details')
    expect(msg.applicantEmail.details).toHaveProperty(
      'firstName', 'lastName', 'referenceNumber', 'overallRating', 'legalStatus',
      'location', 'landOwnership', 'tenancyAgreement', 'project',
      'technology', 'itemsCost', 'potentialFunding', 'remainingCost',
      'projectStarted', 'planningPermission', 'projectName', 'businessName',
      'farmerName', 'farmerSurname', 'agentName', 'agentSurname', 'farmerEmail', 'agentEmail',
      'contactConsent', 'scoreDate', 'introducingInnovation', 'sustainableMaterials', 'environmentalImpact',
      'permanentSickPen', 'moistureControl', 'calfGroupSize', 'housing', 'calvingSystem', 'calvesNumber',
      'housingScore', 'calfGroupSizeScore', 'moistureControlScore', 'permanentSickPenScore', 'structureEligibility',
      'environmentalImpactScore', 'sustainableMaterialsScore', 'introducingInnovationScore',
      'projectCost', 'roofSolarPV', 'additionalItems', 'drainageSlope', 'structure', 'enrichment',
      'concreteFlooring', 'strawBedding', 'isolateCalves', 'housedIndividually', 'minimumFloorArea', 'intensiveFarming',
      'projectResponsibility', 'applyingFor', 'projectType', 'impermeableCover', 'storageType', 'estimatedVolumeToSixMonths',
      'estimatedVolumeToEightMonths', 'grantFundedStoreCoverType', 'existingStoreCoverType', 'grantFundedCoverSize', 'existingStoreCoverSize',
      'slurrySeparator', 'separatorType', 'gantry', 'solidFractionStorage', 'concreteBunkerSize'
    )
  })
  test('Under 10 employees results in micro business definition', () => {
    farmerSubmission.businessDetails.numberEmployees = 1
    farmerSubmission.businessDetails.businessTurnover = 1
    const msg = createMsg(farmerSubmission, desirabilityScore)

    expect(msg.spreadsheet.worksheets[0].rows.find(r => r.row === 20).values[2]).toBe('Micro')
  })

  test('Under 50 employees results in small business definition', () => {
    farmerSubmission.businessDetails.numberEmployees = 10
    farmerSubmission.businessDetails.businessTurnover = 1
    const msg = createMsg(farmerSubmission, desirabilityScore)

    expect(msg.spreadsheet.worksheets[0].rows.find(r => r.row === 20).values[2]).toBe('Small')
  })

  test('Under 250 employees results in medium business definition', () => {
    farmerSubmission.businessDetails.numberEmployees = 50
    farmerSubmission.businessDetails.businessTurnover = 1
    const msg = createMsg(farmerSubmission, desirabilityScore)

    expect(msg.spreadsheet.worksheets[0].rows.find(r => r.row === 20).values[2]).toBe('Medium')
  })

  test('Over 250 employees results in large business definition', () => {
    farmerSubmission.businessDetails.numberEmployees = 250
    farmerSubmission.businessDetails.businessTurnover = 1
    const msg = createMsg(farmerSubmission, desirabilityScore)

    expect(msg.spreadsheet.worksheets[0].rows.find(r => r.row === 20).values[2]).toBe('Large')
  })

  test('Agent submission generates correct message payload', () => {
    jest.mock('../../../../../../app/messaging/config/spreadsheet', () => ({
      hideEmptyRows: true,
      protectEnabled: true,
      sendEmailToRpa: true,
      protectPassword: mockPassword
    }))
    const msg = createMsg(agentSubmission, desirabilityScore)

    expect(msg).toHaveProperty('agentEmail')
    expect(msg).toHaveProperty('applicantEmail')
    expect(msg).toHaveProperty('rpaEmail')
    expect(msg).toHaveProperty('spreadsheet')
    expect(msg.agentEmail.emailAddress).toBe(agentSubmission.agentsDetails.emailAddress)
    expect(msg.applicantEmail.emailAddress).toBe(agentSubmission.farmerDetails.emailAddress)
    expect(msg.rpaEmail.emailAddress).toBe('FTF@rpa.gov.uk')
  })

  test('Spreadsheet part of message should have correct properties', () => {
    agentSubmission.environmentalImpact = 'None of the above'
    const msg = createMsg(agentSubmission, desirabilityScore)

    expect(msg.spreadsheet).toHaveProperty('filename')
    expect(msg.spreadsheet).toHaveProperty('uploadLocation')
    expect(msg.spreadsheet).toHaveProperty('worksheets')
    expect(msg.spreadsheet.worksheets.length).toBe(1)
    expect(msg.spreadsheet.worksheets[0]).toHaveProperty('title')
    expect(msg.spreadsheet.worksheets[0]).toHaveProperty('hideEmptyRows')
    expect(msg.spreadsheet.worksheets[0]).toHaveProperty('defaultColumnWidth')
    expect(msg.spreadsheet.worksheets[0]).toHaveProperty('protectPassword')
    expect(msg.spreadsheet.worksheets[0]).toHaveProperty('rows')
    expect(msg.spreadsheet.worksheets[0].rows.length).toBe(75)
  })

  test('Protect password property should not be set if config is false', () => {
    jest.mock('../../../../../../app/messaging/config/spreadsheet', () => ({
      hideEmptyRows: true,
      protectEnabled: false,
      sendEmailToRpa: false,
      protectPassword: mockPassword
    }))
    const createSubmissionMsg = require('../../../../../../app/messaging/email/create-submission-msg')
    const msg = createSubmissionMsg(agentSubmission, desirabilityScore)
    expect(msg.spreadsheet.worksheets[0]).not.toHaveProperty('protectPassword')
  })
})
