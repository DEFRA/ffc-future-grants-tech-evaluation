const { crumbToken } = require('./test-helper')

jest.mock('../../../../app/helpers/page-guard')
const { guardPage } = require('../../../../app/helpers/page-guard')

describe('Project Summary test', () => {
  const varList = {
    storageType: 'random',
    coverType: 'random',
    existingCoverType: 'random',
    otherItems: ['random'],
    itemSizesQuantities: ['random']
  }

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

  test('GET /project-summary route returns 200', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-summary`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Your project items')
  })

  test('POST /project-summary route returns next page on continue', async () => {
    const options = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-summary`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/tech-evaluation/potential-amount')
  })

  test('POST /project-summary route returns next page \'on change your items\'', async () => {
    const options = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-summary`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { secBtn: 'fake data', crumb: crumbToken }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/tech-evaluation/estimated-grant')
  })

  test('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-summary`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"/tech-evaluation/item-sizes-quantities\" class=\"govuk-back-link\">Back</a>')
  })

  it('page redirects to start if no otherItems', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-summary`
    }

    guardPage.mockResolvedValue(true)

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/tech-evaluation/start')
  })
})
