const { crumbToken } = require('./test-helper')

describe('Page: /project-started', () => {
  const varList = { planningPermission: 'randomData' }

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
      url: `${global.__URLPREFIX__}/project-started`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Have you already started work on the project?')
    expect(response.payload).toContain('Yes, preparatory work') // option 1
    expect(response.payload).toContain('For example, applying for planning permission') // hint
    expect(response.payload).toContain('Yes, we have begun project work') // option 2
    expect(response.payload).toContain('For example, started construction work, signing contracts') // hint
    expect(response.payload).toContain('No, we have not done any work on this project yet') // option 3
    expect(response.payload).toContain('<span class="govuk-warning-text__assistive">Warning</span>') // warning symbol
    expect(response.payload).toContain('You must not start the project work or commit to project costs before receiving your funding agreement.') // warning text
    expect(response.payload).toContain('You can start preparatory work such as applying for planning permissions before you start the project (this can take a long time).') // side bar text
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-started`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectStart: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select the option that applies to your project')
  })

  it('user selects ineligible option: \'Yes, we have begun project work\' -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-started`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectStart: 'Yes, we have begun project work', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('user selects eligible option -> store user response and redirect to /tenancy', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-started`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectStart: 'Yes, preparatory work', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('tenancy')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-started`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"country\" class=\"govuk-back-link\">Back</a>')
  })
})
