const { crumbToken } = require('./test-helper')

describe('Items Sizes Quantities test', () => {
  const varList = { storageType: 'random', coverType: 'random', otherItems: 'random' }

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

  test('GET /other-items route returns 200', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/item-sizes-quantities`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Item sizes and quantities')
  })

  test('POST /other-items route returns next page', async () => {
    const options = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/item-sizes-quantities`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { otherItems: 'fake data', crumb: crumbToken }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('project-summary')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/item-sizes-quantities`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"other-items\" class=\"govuk-back-link\">Back</a>')
  })
})
