const { crumbToken } = require('./test-helper')

describe('Page: /estimated-grant', () => {
  const varList = {
    applicantType: 'Pig',
    applyingFor: '',
    projectType: '',
    existingCover: '',
    grantFundedCover: '',
    fitForPurpose: ''
  }
  const grantText = 'Add some information about the project (for example, type of store and capacity, type of cover and size, approximate size and quantity of other items you need) so we can estimate how much grant you could get.'

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
      url: `${global.__URLPREFIX__}/estimated-grant`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Estimate how much grant you could get')
    expect(response.payload).toContain(grantText)
  })

  it('should redirect to /planning-permission when user press continue', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/estimated-grant`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { remainingCosts: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('reference-cost')
  })

  it('page loads with correct back link when user select fit for purpose option`s as  `\ Yes \` ', async () => {
    varList.applyingFor = 'Building a new store, replacing or expanding an existing store'
    varList.projectType = 'Replace an existing store that is no longer fit for purpose with a new store'
    varList.grantFundedCover = 'Yes, I need a cover'
    varList.existingCover = 'Yes'
    varList.fitForPurpose = 'Yes'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/estimated-grant`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"fit-for-purpose\" class=\"govuk-back-link\" id=\"linkBack\">Back</a>')
  })

  it('page loads with correct back link when user select fit for purpose option`s as  `\ No \`', async () => {
    varList.applyingFor = 'Building a new store, replacing or expanding an existing store'
    varList.projectType = 'Replace an existing store that is no longer fit for purpose with a new store'
    varList.grantFundedCover = 'Yes, I need a cover'
    varList.existingCover = 'Yes'
    varList.fitForPurpose = 'No'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/estimated-grant`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"fit-for-purpose-conditional\" class=\"govuk-back-link\" id=\"linkBack\">Back</a>')
  })

  it('page loads with correct back link when user select fit for purpose option`s as  `\ Yes \` and applying for page is impermeable cover', async () => {
    varList.applyingFor = 'An impermeable cover only'
    varList.fitForPurpose = 'Yes'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/estimated-grant`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"fit-for-purpose\" class=\"govuk-back-link\" id=\"linkBack\">Back</a>')
  })

  it('page loads with correct back link when user select fit for purpose option`s as  `\ No \`', async () => {
    varList.applyingFor = 'An impermeable cover only'
    varList.fitForPurpose = 'No'
    varList.projectType = 'Replace an existing store that is no longer fit for purpose with a new store'
    varList.grantFundedCover = 'Yes, I need a cover'
    varList.existingCover = null
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/estimated-grant`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"/tech-evaluation/grant-funded-cover\" class=\"govuk-back-link\" id=\"linkBack\">Back</a>')
  })
})
