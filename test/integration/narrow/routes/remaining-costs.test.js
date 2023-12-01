const { crumbToken } = require('./test-helper')

describe('Page: /remaining-costs', () => {
  const varList = { projectCost: '12345678' }

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
      url: `${global.__URLPREFIX__}/remaining-costs`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Can you pay the remaining costs?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/remaining-costs`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { remainingCosts: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if you can pay the remaining costs')
  })

  it('user selects ineligible option: \'No\' -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/remaining-costs`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { remainingCosts: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('user selects eligible option: \'Yes\' -> store user response and redirect to /planning-permission', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/remaining-costs`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { remainingCosts: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('planning-permission')
  })

  it('page loads with correct back link', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectType: 'Add a new store to increase existing capacity', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/remaining-costs`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"potential-amount\" class=\"govuk-back-link\">Back</a>')
  })
})
