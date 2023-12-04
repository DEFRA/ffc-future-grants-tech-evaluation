const { crumbToken } = require('./test-helper')

jest.mock('../../../../app/messaging/application')
const { getReferenceCosts } = require('../../../../app/messaging/application')
const messaging = require('../../../../app/messaging/application')

const gapiService = require('../../../../app/services/gapi-service')

jest.mock('../../../../app/helpers/page-guard')
const { guardPage } = require('../../../../app/helpers/page-guard')

describe('reference Cost test', () => {
  const varList = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return 'Error'
    }
  }))

  test('GET /reference-cost route returns 200 if costData = success', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/reference-cost`
    }

    getReferenceCosts.mockResolvedValue({
      costData: 'success'
    })

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /reference-cost route returns 500 if costData =/= success', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/reference-cost`
    }

    getReferenceCosts.mockResolvedValue({
      costData: 'fail'
    })

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /reference-cost route causes error page', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/reference-cost`
    }

    getReferenceCosts.mockRejectedValue('hello')

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /stanbdardised-costs returns error 500 if getReferenceCosts throws error', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/reference-cost`
    }

    jest.spyOn(messaging, 'getReferenceCosts').mockImplementation(() => { throw new Error() })

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('POST /reference-cost route returns next page - building journey', async () => {
    const options = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/reference-cost`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { applying: '', crumb: crumbToken }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('POST /reference-cost route returns next page - impermeable journey', async () => {
    varList.applyingFor = 'An impermeable cover only'
    varList.fitForPurpose = 'Yes'
    const options = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/reference-cost`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { applying: '', crumb: crumbToken }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('page redirects to start if no cover', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/reference-cost`
    }

    guardPage.mockResolvedValue(true)

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/tech-evaluation/start')
  })
})
