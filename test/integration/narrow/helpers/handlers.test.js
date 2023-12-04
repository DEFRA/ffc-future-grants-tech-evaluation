describe('Get & Post Handlers', () => {
  const varList = {
    planningPermission: 'some fake value',
    gridReference: 'grid-ref-num',
    businessDetails: 'fake business',
    applying: true
  }

  jest.mock('../../../../app/helpers/page-guard', () => ({
    guardPage: (a, b, c) => false
  }))

  jest.mock('../../../../app/helpers/urls', () => ({
    getUrl: (a, b, c, d) => 'mock-url'
  }))

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return null
    }
  }))

  const mockgetGrantValues = jest.fn().mockReturnValue({
    calculatedGrant: 'test',
    remainingCost: 'test'
  })

  jest.mock('../../../../app/helpers/grants-info', () => ({
    getGrantValues: mockgetGrantValues
  }))

  jest.mock('../../../../app/services/gapi-service', () => ({
    sendGAEvent: jest.fn().mockReturnValue(true)
  }))

  // Mock senders
  jest.mock('../../../../app/messaging/senders', () => ({
    sendContactDetails: jest.fn().mockReturnValue(true)
  }))

  let question
  let mockH

  const { getHandler, getPostHandler } = require('../../../../app/helpers/handlers')

  test('will redirect to start page if planning permission evidence is missing', async () => {
    question = {
      url: 'planning-permission-summary',
      title: 'mock-title'
    }
    mockH = { redirect: jest.fn() }

    await getHandler(question)({}, mockH)
    expect(mockH.redirect).toHaveBeenCalledWith('/tech-evaluation/start')
    expect(mockgetGrantValues).not.toHaveBeenCalled()
  })

  test('is eligible if calculated grant = min grant - whether grant is capped or not', async () => {
    question = {
      url: 'mock-url',
      title: 'mock-title',
      maybeEligible: true,
      maybeEligibleContent: { reference: 'mock-reference' }
    }
    mockH = { redirect: jest.fn() }

    await getHandler(question)({}, mockH)
    expect(mockH.redirect).toHaveBeenCalledWith('/tech-evaluation/start')
  })

  test('getHandler called with grants info', async () => {
    question = {
      url: 'planning-permission-summary',
      title: 'mock-title',
      grantInfo: {
        minGrant: 1000,
        maxGrant: 10000,
        grantCap: 10000
      }
    }
    mockH = { redirect: jest.fn() }

    await getHandler(question)({}, mockH)
    expect(mockgetGrantValues).toHaveBeenCalledTimes(1)
    expect(mockgetGrantValues).toHaveBeenCalledWith(null, { grantCap: 10000, maxGrant: 10000, minGrant: 1000 })
    expect(mockH.redirect).toHaveBeenCalledWith('/tech-evaluation/start')
  })

  test('getPostHandler', async () => {
    question = {
      baseUrl: 'mock-url',
      yarKey: 'grantFundedCover',
      title: 'mock-title',
      ineligibleContent: true,
      answers: [{ value: 'mock-value', key: 'grantFundedCover-A3' }],
      nextUrl: 'mock-next-url',
      type: 'mock-type'
    }
    mockH = { redirect: jest.fn() }
    const mockSet = jest.fn()
    await getPostHandler(question)({ payload: { a: 'mock-value' }, yar: { set: mockSet } }, mockH)
    expect(mockH.redirect).toHaveBeenCalledWith('/tech-evaluation/existing-cover')
  })
})
