const { crumbToken } = require('./test-helper')

describe('Separator Type test', () => {
  const varList = {
    coverType: null,
    existingCover: 'no',
    applyingFor: 'fake',
    applicantType: 'Beef',
    projectType: 'fake',
    storageType: 'hello',
    separator: 'hello'
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

  test('GET /separator-type route returns 200', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/separator-type`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain(
      'What type of slurry separator will you have?'
    )
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/separator-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { separatorType: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain(
      'Select what type of slurry separator you will have'
    )
  })

  test('POST /separator-type route returns /gantry', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/separator-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { separatorType: 'Yes', crumb: crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('gantry')
  })
})
