const { crumbToken } = require('./test-helper')

describe('Existing cover Type test', () => {
  const varList = {
    coverType: null,
    applyingFor: null,
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

  test('GET /existing-cover-type route returns 200', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/existing-cover-type`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What type of cover will you have on your existing store?')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/existing-cover-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { storageType: '', existingCoverType: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select what type of cover your existing store will have')
  })

  test('POST /cover-size route returns next page when existing cover `/Yes/`', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/existing-cover-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { existingCoverType: 'fake data', crumb: crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('existing-cover-size')
  })

  test('POST /existing-grant-funded-cover-size route returns next page when coverType `/Fixed flexible cover/`', async () => {
    varList.coverType = 'Fixed flexible cover'

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/existing-cover-type`
    }

    const response = await global.__SERVER__.inject(options)

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/existing-cover-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { existingCoverType: 'fake data', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('existing-grant-funded-cover-size')
  })

  test('POST /existing-grant-funded-cover-size route returns next page when coverType `/Floating flexible cover/`', async () => {
    varList.coverType = 'Floating flexible cover'

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/existing-cover-type`
    }

    const response = await global.__SERVER__.inject(options)

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/existing-cover-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { existingCoverType: 'fake data', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('existing-grant-funded-cover-size')
  })

  it('page loads with /reference-grant-amounts/ back link when applying for is an impermeable cover only', async () => {
    varList.applyingFor = 'An impermeable cover only'

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/existing-cover-type`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"/tech-evaluation/reference-cost\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with /cover-type/ back link when cover type is entered', async () => {
    varList.coverType = 'Fake data'
    varList.applyingFor = 'Fake data'

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/existing-cover-type`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"/tech-evaluation/cover-type\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with /pig-capacity-increase-replace/ back link when project type /Replace an existing store .../ and applicant type is Pig', async () => {
    varList.projectType = 'Replace an existing store that is no longer fit for purpose with a new store'
    varList.applicantType = 'Pig'
    varList.coverType = null
    const optionCoverType = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/existing-cover-type`
    }
    const responseCoverType = await global.__SERVER__.inject(optionCoverType)
    expect(responseCoverType.statusCode).toBe(200)
    expect(responseCoverType.payload).toContain('<a href=\"/tech-evaluation/pig-capacity-increase-replace\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with /capacity-increase-replace/ back link when project type /Replace an existing store that is .../ and applicant type is Beef', async () => {
    varList.projectType = 'Replace an existing store that is no longer fit for purpose with a new store'
    varList.applicantType = 'Beef'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/existing-cover-type`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"/tech-evaluation/capacity-increase-replace\" class=\"govuk-back-link\">Back</a>')
  })
  it('page loads with /pig-capacity-increase-additional/ back link when project type /add a new store .../ and applicant type is Pig', async () => {
    varList.projectType = 'Add a new store to increase existing capacity'
    varList.applicantType = 'Pig'

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/existing-cover-type`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"/tech-evaluation/pig-capacity-increase-additional\" class=\"govuk-back-link\">Back</a>')
  })
  it('page loads with /capacity-increase-additional/ back link when project type /add a new store .../ and applicant type is Beef', async () => {
    varList.projectType = 'Add a new store to increase existing capacity'
    varList.applicantType = 'Beef'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/existing-cover-type`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"/tech-evaluation/capacity-increase-additional\" class=\"govuk-back-link\">Back</a>')
  })
})
