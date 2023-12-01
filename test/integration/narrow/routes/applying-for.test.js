const { crumbToken } = require('./test-helper')

describe('Page: /applying-for', () => {
  const varList = { plannedStorageCapacity: '6 months' }

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
      url: `${global.__URLPREFIX__}/applying-for`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What are you applying for?')
    expect(response.payload).toContain('Building a new store, replacing or expanding an existing store')
    expect(response.payload).toContain('An impermeable cover only')
    expect(response.payload).toContain('None of the above')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applying-for`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { applyingFor: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select what you are applying for')
  })

  it('user selects \'Building a new store, replacing or expanding an existing store\' -> store user response and redirect to /project-type', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applying-for`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { applyingFor: 'Building a new store, replacing or expanding an existing store', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-type')
  })

  it('user selects \'An impermeable cover only\' -> store user response and redirect to /fit-for-purpose', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applying-for`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { applyingFor: 'An impermeable cover only', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('fit-for-purpose')
  })

  it('user selects ineligible option: \'None of the above\' -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applying-for`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { applyingFor: 'None of the above', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })
  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/applying-for`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"planned-storage-capacity\" class=\"govuk-back-link\">Back</a>')
  })
})
