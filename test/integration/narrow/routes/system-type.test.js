const { crumbToken } = require('./test-helper')

describe('Page: /system-type', () => {
  const varList = {}

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
      url: `${global.__URLPREFIX__}/system-type`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What is your current manure management system?')
    expect(response.payload).toContain('Slurry-based system')
    expect(response.payload).toContain('Farmyard manure system that does not produce slurry')
    expect(response.payload).toContain('I do not have a slurry system')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/system-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { systemType: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select your current manure management system')
  })

  it('user selects ineligible option: \'I do not have a slurry system\' -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/system-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { systemType: 'I do not have a slurry system', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('user selects eligible option -> store user response and redirect to /existing-storage-capacity', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/system-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { systemType: 'Slurry-based system', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('existing-storage-capacity')
  })

  it('page loads with correct back link when user select YES on project responsibility page', async () => {
    varList.projectResponsibility = 'Yes'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/system-type`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"project-responsibility\" class=\"govuk-back-link\">Back</a>')
  })
  it('page loads with correct back link when the user select NO on project responsibility page', async () => {
    varList.projectResponsibility = 'No'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/system-type`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"project-responsibility" class=\"govuk-back-link\">Back</a>')
  })
})
