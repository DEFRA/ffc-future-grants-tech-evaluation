const { crumbToken } = require('./test-helper')

describe('Page: /legal-status', () => {
  const varList = {
    applicantType: 'Pig'
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
      url: `${global.__URLPREFIX__}/legal-status`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What is the legal status of the business?')
    expect(response.payload).toContain('Sole trader')
    expect(response.payload).toContain('Partnership')
    expect(response.payload).toContain('Limited company')
    expect(response.payload).toContain('Charity')
    expect(response.payload).toContain('Trust')
    expect(response.payload).toContain('Limited liability partnership')
    expect(response.payload).toContain('Community interest company')
    expect(response.payload).toContain('Limited partnership')
    expect(response.payload).toContain('Industrial and provident society')
    expect(response.payload).toContain('Co-operative society')
    expect(response.payload).toContain('Community benefit society')
    expect(response.payload).toContain('None of the above')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/legal-status`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { legalStatus: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select the legal status of the business')
  })

  it('user selects ineligible option: \'None of the above\' -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/legal-status`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { legalStatus: 'None of the above', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('user selects eligible option -> store user response and redirect to /country', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/legal-status`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { legalStatus: 'Limited partnership', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('country')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/legal-status`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"intensive-farming-condition\" class=\"govuk-back-link\">Back</a>')
  })
})
