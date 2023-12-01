const { crumbToken } = require('./test-helper')

describe('Page: /intensive-farming', () => {
  const varList = { applicantType: 'Pig' }

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
      url: `${global.__URLPREFIX__}/intensive-farming`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Do you have an environmental permit for intensive farming?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No, my farm does not need an environmental permit for intensive farming')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/intensive-farming`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { intensiveFarming: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select if you have an environmental permit for intensive farming')
  })

  // it('user selects ineligible option: \'None of the above\' -> display ineligible page', async () => {
  //     const postOptions = {
  //         method: 'POST',
  //         url: `${global.__URLPREFIX__}/intensive-farming`,
  //         headers: { cookie: 'crumb=' + crumbToken },
  //         payload: { intensiveFarming: 'None of the above', crumb: crumbToken }
  //     }

  //     const postResponse = await global.__SERVER__.inject(postOptions)
  //     expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  // })

  it('user selects eligible option -> store user response and redirect to /legal-status', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/intensive-farming`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { intensiveFarming: 'No, my farm does not need an environmental permit for intensive farming', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('legal-status')
  })

  it('user selects conditional option -> store user response and redirect to /intensive-farming-condition', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/intensive-farming`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { intensiveFarming: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('intensive-farming-condition')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/intensive-farming`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"applicant-type\" class=\"govuk-back-link\">Back</a>')
  })
})
