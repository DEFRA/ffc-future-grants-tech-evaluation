const { crumbToken } = require('./test-helper')

describe('Other Items test', () => {
  const varList = { storageType: 'random', coverType: 'random', separator: 'data' }

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
      url: `${global.__URLPREFIX__}/other-items`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What other items do you need?')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/other-items`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { storageType: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select what other items you need')
  })

  test('POST /other-items route returns next page', async () => {
    const options = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/other-items`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { otherItems: 'fake data', crumb: crumbToken }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('item-sizes-quantities')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/other-items`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"separator\" class=\"govuk-back-link\">Back</a>')
  })
  it('page loads with correct back link - no separator', async () => {
    varList.separator = 'Yes'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/other-items`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"short-term-storage\" class=\"govuk-back-link\">Back</a>')
  })
})
