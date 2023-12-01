const { crumbToken } = require('./test-helper')

describe('Page: /existing-storage-capacity', () => {
  const varList = { existingStorageCapacity: 'randomData' }

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
      url: `${global.__URLPREFIX__}/existing-storage-capacity`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Less than 6 months')
    expect(response.payload).toContain('6 months or more, but it is no longer fit for purpose')
    expect(response.payload).toContain('6 months or more, and it is fit for purpose')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/existing-storage-capacity`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { existingStorageCapacity: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select how many months&#39; slurry storage capacity you have')
  })

  it('user selects ineligible option: \'8 months or more\' -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/existing-storage-capacity`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { existingStorageCapacity: '6 months or more, and it is fit for purpose', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('This grant is to get your storage levels to 6 months.')
  })

  it('user selects eligible option -> store user response and redirect to /planned-storage-capacity', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/existing-storage-capacity`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { existingStorageCapacity: 'Less than 8 months', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('planned-storage-capacity')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/existing-storage-capacity`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"system-type\" class=\"govuk-back-link\">Back</a>')
  })
})
