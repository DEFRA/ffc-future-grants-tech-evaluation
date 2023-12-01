const { crumbToken } = require('./test-helper')

describe('Page: /fit-for-purpose-conditional', () => {
  const varList = {
    applyingFor: null
  }
  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return 'Error'
    }
  }))

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return 'Error'
    }
  }))
  it('should load the condition page with correct heading', async () => {
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/fit-for-purpose-conditional`
    }
    const getResponse = await global.__SERVER__.inject(getOptions)
    expect(getResponse.statusCode).toBe(200)
    expect(getResponse.payload).toContain('You may be able to apply for a grant from this scheme')
  })

  it('should load the condition page with correct heading', async () => {
    varList.applyingFor = 'An impermeable cover only'
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/fit-for-purpose-conditional`
    }
    const getResponse = await global.__SERVER__.inject(getOptions)
    expect(getResponse.statusCode).toBe(200)
    expect(getResponse.payload).toContain('Continue to apply for a store')
  })
  it('user select continue on conditional page redirect to /estimated-grant', async () => {
    varList.applyingFor = 'Building a new store, replacing or expanding an existing store'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/fit-for-purpose-conditional`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('estimated-grant')
  })

  it('user select continue on conditional page redirect to /project-type', async () => {
    varList.applyingFor = 'An impermeable cover only'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/fit-for-purpose-conditional`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-type')
  })
  it('page loads with correct back link', async () => {
    varList.applyingFor = 'Building a new store, replacing or expanding an existing store'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/fit-for-purpose-conditional`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"fit-for-purpose\" class=\"govuk-back-link\" id=\"linkBack\">Back</a>')
  })
})
