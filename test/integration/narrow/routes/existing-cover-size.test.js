const { crumbToken } = require('./test-helper')

describe('Page: /existing-cover-size', () => {
  const varList = { inEngland: 'randomData', serviceCapacityIncrease: 'data', storageType: 'data', coverType: 'data' }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return 'Error'
    }
  }))

  it('page loads successfully, with heading ', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/existing-cover-size`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('How big will the cover be?')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/existing-cover-size`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { existingCoverSize: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter how big the existing store cover will be')
  })

  it('value outside min and max -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/existing-cover-size`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { existingCoverSize: '1234567', crumb: crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Cover size must be between 1-999999')
  })

  it('If commas used', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/existing-cover-size`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { existingCoverSize: '129.232', crumb: crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Cover size must be a whole number')
  })

  it('If decimal used', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/existing-cover-size`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { existingCoverSize: 'abc123', crumb: crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Cover size must only include numbers')
  })

  it('user enter valid value', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/existing-cover-size`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { existingCoverSize: '12345', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)

    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('separator')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/existing-cover-size`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"existing-cover-type\" class=\"govuk-back-link\">Back</a>')
  })
})
