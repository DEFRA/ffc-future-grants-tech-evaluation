const { crumbToken } = require('./test-helper')

describe('Page: /applicant-type', () => {
  const varList = {}

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return undefined
    }
  }))

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/applicant-type`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Which livestock do you farm mainly?')
    expect(response.payload).toContain('Pig')
    expect(response.payload).toContain('Beef')
    expect(response.payload).toContain('Dairy')
    expect(response.payload).toContain('None of the above')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { applicantType: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select what you farm mainly')
  })

  it('user selects ineligible option: \'None of the above\' -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { applicantType: 'None of the above', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('user selects eligible options(Beef or Dairy) -> store user response and redirect to /legal-status', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { applicantType: 'Beef', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('legal-status')
  })

  it('user selects eligible option(Pig) -> store user response and redirect to /intensive-farming', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { applicantType: 'Pig', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('intensive-farming')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/applicant-type`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"start\" class=\"govuk-back-link\">Back</a>')
  })
})
