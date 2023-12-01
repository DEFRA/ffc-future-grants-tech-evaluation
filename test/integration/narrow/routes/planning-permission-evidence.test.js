const { crumbToken } = require('./test-helper')

describe('Page: /business-details', () => {
  const varList = { 'current-score': 'randomData' }

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
      url: `${global.__URLPREFIX__}/planning-permission-evidence`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Planning authority')
    expect(response.payload).toContain('Planning reference number')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/planning-permission-evidence`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { PlanningPermissionEvidence: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter planning authority')
    expect(postResponse.payload).toContain('Enter planning reference number')
  })

  it('user came from \'PLANNING PERMISSION SUMMARY\' page -> display <Back to evidence summary> button', async () => {
    varList.reachedEvidenceSummary = true

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/planning-permission-evidence`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Back to evidence summary')
  })

  it('should validate planning authority - maximum characters is 50', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/planning-permission-evidence`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        planningAuthority: 'abcdefghijklmonopqrstuvwxyzabcdefghijklmonopqrstuvwxyz',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Planning authority must be 50 characters or fewer')
  })

  it('should validate planning authority - maximum characters is 50', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/planning-permission-evidence`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        planningReferenceNumber: 'as123456789as123456789as123456789as123456789as123456789',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Planning reference number must be 50 characters of fewer')
  })

  it('should validate planning authority - Planning authority must only contain letters, hyphens and spaces', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/planning-permission-evidence`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        planningAuthority: 'abcdefghijklmonopqrstuvwxyz123',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Planning authority must only contain letters, hyphens and spaces')
  })

  it('should validate planning authority - Planning reference number must only include letters, numbers and /', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/planning-permission-evidence`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        planningReferenceNumber: 'sds sds',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Planning reference number must only include letters, numbers and /')
  })

  it('store user response and redirect to OS grid-reference: /grid-reference', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/planning-permission-evidence`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        planningAuthority: 'testtesttest',
        planningReferenceNumber: '123123/123123',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('grid-reference')
  })
})
