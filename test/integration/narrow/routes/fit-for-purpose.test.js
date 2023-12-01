const { crumbToken } = require('./test-helper')
describe('Page: /fit-for-purpose', () => {
  const varList = {
    applicantType: 'Pig',
    applyingFor: '',
    projectType: '',
    existingCover: '',
    grantFundedCover: ''
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
      url: `${global.__URLPREFIX__}/fit-for-purpose`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain(
      'Is the existing store you want to cover fit for purpose?'
    )
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })
  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/fit-for-purpose`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain(
      'Select if your existing store you want to cover is fit for purpose'
    )
  })
  it("user selects eligible option: 'Yes'  -> store user response and redirect to /estimated-grant", async () => {
    varList.applyingFor = 'An impermeable cover only'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/fit-for-purpose`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { fitForPurpose: 'Yes', crumb: crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('estimated-grant')
  })
  it("user selects ineligible option: 'No' when applying-for page is impermeable cover only -> display ineligible page", async () => {
    varList.plannedStorageCapacity = '8 months'
    varList.applyingFor = 'An impermeable cover only'
    varList.existingStorageCapacity = 'Less than 8 months'
    varList.fitForPurpose = 'No'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/fit-for-purpose`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { fitForPurpose: 'No', crumb: crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('fit-for-purpose-conditional')
  })
  it("user selects eligible option: 'Yes' when applying-for page is Not impermeable cover only   -> store user response and redirect to /estimated-grant", async () => {
    varList.applyingFor =
      'Building a new store, replacing or expanding an existing store'

    varList.fitForPurpose = 'Yes'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/fit-for-purpose`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { fitForPurpose: 'Yes', crumb: crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('estimated-grant')
  })
  it("user selects eligible option: 'No' when applying-for page is Not impermeable cover only  -> store user response and redirect to /slurry-infrastructure/fit-for-purpose-conditional", async () => {
    varList.applyingFor =
      'Building a new store, replacing or expanding an existing store'
    varList.projectType =
      'Replace an existing store that is no longer fit for purpose with a new store'
    varList.grantFundedCover = 'Yes, I need a cover'
    varList.existingCover = 'Yes'
    varList.fitForPurpose = 'No'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/fit-for-purpose`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { fitForPurpose: 'No', crumb: crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('fit-for-purpose-conditional')
  })
  it('page loads with correct back link', async () => {
    varList.applicantType = 'Pig'
    varList.applyingFor =
      'Building a new store, replacing or expanding an existing store'
    varList.projectType =
      'Replace an existing store that is no longer fit for purpose with a new store'
    varList.grantFundedCover = 'Yes, I need a cover'
    varList.existingCover = 'Yes'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/fit-for-purpose`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain(
      '<a href="existing-cover-pig" class="govuk-back-link">Back</a>'
    )
  })
  it('page loads with correct back link', async () => {
    varList.applicantType = 'Beef'
    varList.applyingFor =
      'Building a new store, replacing or expanding an existing store'
    varList.projectType =
      'Replace an existing store that is no longer fit for purpose with a new store'
    varList.grantFundedCover = 'Yes, I need a cover'
    varList.existingCover = 'Yes'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/fit-for-purpose`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain(
      '<a href="existing-cover" class="govuk-back-link">Back</a>'
    )
  })
  it('page loads with correct back link', async () => {
    varList.applyingFor = 'An impermeable cover only'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/fit-for-purpose`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain(
      '<a href="applying-for" class="govuk-back-link">Back</a>'
    )
  })
})
