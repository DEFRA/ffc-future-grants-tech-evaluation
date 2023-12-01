const { crumbToken } = require('./test-helper')

describe('Page: /project-type', () => {
  const varList = { applyingFor: 'Fake data' }

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
      url: `${global.__URLPREFIX__}/project-type`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Replace an existing store that is no longer fit for purpose with a new store')
    expect(response.payload).toContain('Add a new store to increase existing capacity')
    expect(response.payload).toContain('Expand an existing store')
    expect(response.payload).toContain('None of the above')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectType: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select how you will increase your storage capacity')
  })

  it('user selects ineligible option: \'None of the above\' -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectType: 'None of the above', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('user selects eligible option -> store user response and redirect to /grant-funded-cover', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectType: 'Replace an existing store that is no longer ', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('grant-funded-cover')
  })

  it('page loads with correct back link', async () => {
    varList.applyingFor = 'Building a new store, replacing or expanding an existing store'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-type`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"applying-for\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back link', async () => {
    varList.applyingFor = 'An impermeable cover only'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-type`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"fit-for-purpose-conditional\" class=\"govuk-back-link\">Back</a>')
  })
})
