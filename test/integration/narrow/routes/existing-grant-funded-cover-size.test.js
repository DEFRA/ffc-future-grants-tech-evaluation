const { crumbToken } = require('./test-helper')

describe('Page: /existing-grant-funded-cover-size', () => {
  const varList = {
    applicantType: 'Beef',
    projectType: 'fakeData'
  }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return 'Error'
    }
  }))

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/existing-grant-funded-cover-size`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('How big will the covers be?')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/existing-grant-funded-cover-size`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter how big the grant-funded store cover will be')
    expect(postResponse.payload).toContain('Enter how big the existing store cover will be')
  })

  it('user enter valid values store user response and redirect to /separator', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/existing-grant-funded-cover-size`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { coverSize: '22', existingCoverSize: '22', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('separator')
  })

  it('should return an error message if the number of digits typed exceed 7', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/existing-grant-funded-cover-size`,
      payload: { coverSize: '9999999', existingCoverSize: '9999999', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Volume must be between 1-999999')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/existing-grant-funded-cover-size`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href="existing-cover-type" class="govuk-back-link">Back</a>')
  })
})
