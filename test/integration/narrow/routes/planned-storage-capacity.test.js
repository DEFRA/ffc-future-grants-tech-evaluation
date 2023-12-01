const { crumbToken } = require('./test-helper')

describe('Page: /planned-storage-capacity', () => {
  const varList = { plannedStorageCapacity: 'randomData' }

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
      url: `${global.__URLPREFIX__}/planned-storage-capacity`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('6 months')
    expect(response.payload).toContain('More than 6 months')
    expect(response.payload).toContain('Less than 6 months')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/planned-storage-capacity`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { plannedStorageCapacity: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select how many months’ slurry storage capacity you will have')
  })

  it('user selects ineligible option: \'Less than 6 months\' -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/planned-storage-capacity`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { plannedStorageCapacity: 'Less than 6 months', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('user selects eligible option -> store user response and redirect to /applying', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/planned-storage-capacity`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { plannedStorageCapacity: 'More than 6 months', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('applying-for')
  })
})
