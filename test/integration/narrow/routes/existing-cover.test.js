const { crumbToken } = require('./test-helper')

describe('Page: /existing-cover', () => {
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
      url: `${global.__URLPREFIX__}/existing-cover`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Do you want to apply for a cover for existing stores?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/existing-cover`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select if you need a cover for existing stores')
  })

  it("user selects eligible option: \'Yes\'  -> store user response and redirect to /fit-for-purpose", async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/existing-cover`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { existingCover: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('fit-for-purpose')
  })

  it("user selects eligible option: \'No\'  -> store user response and redirect to /estimated-grant", async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/existing-cover`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { existingCover: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('estimated-grant')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/existing-cover`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href="grant-funded-cover" class="govuk-back-link">Back</a>')
  })
})
