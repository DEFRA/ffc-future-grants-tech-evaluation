const { crumbToken } = require('./test-helper')

describe('Cover Type test', () => {
  const varList = {
    projectType: 'randomData',
    storageType: 'randomData',
    serviceCapacityIncrease: 'random'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return 'Error'
    }
  }))

  test('GET /cover-type route returns 200', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/cover-type`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What type of cover will you have on your grant-funded store?')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/cover-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { storageType: '', coverType: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select what type of cover your grant-funded store will have')
  })

  test('POST /cover-type route returns next page when existing cover `/Yes/`', async () => {
    varList.existingCover = 'Yes'
    const options = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/cover-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { coverType: 'fake data', crumb: crumbToken }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('existing-cover-type')
  })

  test('POST /cover-type route returns next page when /cover-size when existing cover is /No/', async () => {
    varList.existingCover = 'No'
    const options = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/cover-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { coverType: 'fake data', crumb: crumbToken }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('cover-size')
  })

  test('POST /cover-type route returns next page when /cover-size when applying for page is An impermeable cover only', async () => {
    varList.existingCover = null
    const options = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/cover-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { coverType: 'fake data', crumb: crumbToken }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('cover-size')
  })
  it('page loads with /capacity-increase-replace/ back link when project type is replace', async () => {
    varList.projectType = 'Replace an existing store that is no longer fit for purpose with a new store'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/cover-type`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"capacity-increase-replace\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with /capacity-increase-additional/ back link when project type is additional', async () => {
    varList.projectType = 'Add a new store to increase existing capacity'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/cover-type`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"capacity-increase-additional\" class=\"govuk-back-link\">Back</a>')
  })
})
