const { crumbToken } = require('./test-helper')

describe('Page: /grant-funded-cover', () => {
  const varList = {
    applicantType: 'Pig',
    applyingFor: '',
    projectType: '',
    existingCover: '',
    grantFundedCover: '',
    fitForPurpose: ''
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
      url: `${global.__URLPREFIX__}/grant-funded-cover`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the grant-funded store have an impermeable cover?')
    expect(response.payload).toContain('Yes, I need a cover')
    expect(response.payload).toContain('Yes, I already have a cover')
    expect(response.payload).toContain('Not needed, the slurry is treated with acidification')
    expect(response.payload).toContain('None of the above')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/grant-funded-cover`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select impermeable cover option')
  })

  it('user selects ineligible option: \'None of the above\' -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/grant-funded-cover`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { grantFundedCover: 'None of the above', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('user selects eligible option -> store user response and redirect to /existing-cover-pig when the user select pig journey', async () => {
    varList.applyingFor = 'Building a new store, replacing or expanding an existing store'
    varList.projectType = 'Replace an existing store that is no longer fit for purpose with a new store'

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/grant-funded-cover`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { grantFundedCover: 'Yes, I need a cover', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/tech-evaluation/existing-cover-pig')
  })

  it('user selects eligible option -> store user response and redirect to /existing-cover', async () => {
    varList.applicantType = 'Beef',
      varList.applyingFor = 'Building a new store, replacing or expanding an existing store'
    varList.projectType = 'Replace an existing store that is no longer fit for purpose with a new store'

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/grant-funded-cover`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { grantFundedCover: 'Yes, I need a cover', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/tech-evaluation/existing-cover')
  })

  it('page loads with correct back link', async () => {
    varList.applyingFor = 'An impermeable cover only'
    varList.fitForPurpose = 'No'
    varList.projectType = 'Replace an existing store that is no longer fit for purpose with a new store'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/grant-funded-cover`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"project-type\" class=\"govuk-back-link\">Back</a>')
  })

  it('user selects eligible option -> store user response and redirect to /exstimated-grant if applying for is "An impermeable cover only" and fit for purpose is "No"', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/grant-funded-cover`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { grantFundedCover: 'Yes, I need a cover', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/tech-evaluation/estimated-grant')
  })
})
