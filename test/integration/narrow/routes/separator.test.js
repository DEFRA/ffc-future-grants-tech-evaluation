const { crumbToken } = require('./test-helper')

describe('Separator test', () => {
  const varList = {
    coverType: null,
    existingCover: 'no',
    applyingFor: 'fake',
    applicantType: 'Beef',
    projectType: 'fake',
    storageType: 'hello',
    referenceCostObject: 'hello'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return null
    }
  }))

  test('GET /separator route returns 200', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/separator`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain(
      'Do you want to add a slurry separator to your project?'
    )
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/separator`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { separator: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain(
      'Select if you want to add a slurry separator to your project'
    )
  })

  test('POST /separator route returns next page -> /separator-type/ when separator `/Yes/`', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/separator`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { separator: 'Yes', crumb: crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('separator-type')
  })

  test('POST /separator route returns next page -> /other-items/ when separator `/No/`', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/separator`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { separator: 'No', crumb: crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('other-items')
  })

  it('page loads with /pig-capacity-increase-replace/ back link when project type /Replace an existing store .../ and applicant type is Pig', async () => {
    varList.projectType =
      'Replace an existing store that is no longer fit for purpose with a new store'
    varList.applicantType = 'Pig'
    const optionSeparator = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/separator`
    }
    const responseSeparator = await global.__SERVER__.inject(optionSeparator)
    expect(responseSeparator.statusCode).toBe(200)
    expect(responseSeparator.payload).toContain(
      '<a href="/slurry-infrastructure/pig-capacity-increase-replace" class="govuk-back-link">Back</a>'
    )
  })

  it('page loads with /pig-capacity-increase-additional/ back link when project type /add a new store .../ and applicant type is Pig', async () => {
    varList.projectType = 'Add a new store to increase existing capacity'
    varList.applicantType = 'Pig'

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/separator`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain(
      '<a href="/slurry-infrastructure/pig-capacity-increase-additional" class="govuk-back-link">Back</a>'
    )
  })

  it('page loads with /capacity-increase-replace/ back link when project type /Replace an existing store that is .../ and applicant type is Beef', async () => {
    varList.projectType =
      'Replace an existing store that is no longer fit for purpose with a new store'
    varList.applicantType = 'Beef'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/separator`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain(
      '<a href="/slurry-infrastructure/capacity-increase-replace" class="govuk-back-link">Back</a>'
    )
  })

  it('page loads with /capacity-increase-additional/ back link when project type /add a new store .../ and applicant type is Beef', async () => {
    varList.projectType = 'Add a new store to increase existing capacity'
    varList.applicantType = 'Beef'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/separator`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain(
      '<a href="/slurry-infrastructure/capacity-increase-additional" class="govuk-back-link">Back</a>'
    )
  })

  it('page loads with /cover-size/ back link when existingCover is No', async () => {
    varList.existingCover = 'No'
    varList.coverType = 'Fake data'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/separator`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain(
      '<a href="/slurry-infrastructure/cover-size" class="govuk-back-link">Back</a>'
    )
  })

  it('page loads with /existing-grant-funded-cover-size/ back link when existingCover is Yes', async () => {
    varList.existingCover = 'Yes'
    varList.coverType = 'Fake data'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/separator`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain(
      '<a href="/slurry-infrastructure/existing-grant-funded-cover-size" class="govuk-back-link">Back</a>'
    )
  })

  it('page loads with /existing-cover-size/ back link when applyingFor /An impermeable cover only/ ', async () => {
    varList.applyingFor = 'An impermeable cover only'
    varList.coverType = null
    varList.existingCoverSize = '343'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/separator`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain(
      '<a href="/slurry-infrastructure/existing-cover-size" class="govuk-back-link">Back</a>'
    )
  })

  it('page loads with /existing-cover-size/ back link when existingCover is Yes', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/separator`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain(
      '<a href="/slurry-infrastructure/existing-cover-size" class="govuk-back-link">Back</a>'
    )
  })
  it('page loads with /cover-size/ back link when an impermeable cover only and fit for purpose is no', async () => {
    varList.applyingFor = 'An impermeable cover only'
    varList.fitForPurpose = 'No'
    varList.projectType = 'Fake data'
    varList.grantFundedCover = 'Fake data'
    varList.coverType = 'Fake data'
    varList.existingCover = null
    varList.existingCoverSize = null

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/separator`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain(
      '<a href="/slurry-infrastructure/cover-size" class="govuk-back-link">Back</a>'
    )
  })
})
