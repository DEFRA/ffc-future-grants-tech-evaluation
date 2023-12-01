const { crumbToken } = require('./test-helper')

describe('Page: /planning-permission-summary', () => {
  const varList = {
    planningPermission: 'Not yet applied',
    PlanningPermissionEvidence: {
      planningAuthority: 'some planning',
      planningReferenceNumber: '123456-ref'
    }
  }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return 'Error'
    }
  }))

  it('should load page successfully with correct data', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/planning-permission-summary`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Check your answers before getting your results')
    expect(response.payload).toContain('Your evidence details')
    expect(response.payload).toContain('Planning permission')
    expect(response.payload).toContain('OS grid reference')
  })

  it('should load page successfully witch correct planning permission data', async () => {
    varList.planningPermission = 'some valid planning permmison'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/planning-permission-summary`
    }

    const getResponse = await global.__SERVER__.inject(options)
    expect(getResponse.statusCode).toBe(200)
    expect(getResponse.payload).toContain('Check your answers before getting your results')
    expect(getResponse.payload).toContain('Your evidence details')
    expect(getResponse.payload).toContain('Planning permission')
    expect(getResponse.payload).toContain('Planning authority')
    expect(getResponse.payload).toContain('Planning reference number')
    expect(getResponse.payload).toContain('OS grid reference')
  })

  it('should redirect to result-page when continue button is pressed', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/planning-permission-summary`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }

    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('result-page')
  })
})
