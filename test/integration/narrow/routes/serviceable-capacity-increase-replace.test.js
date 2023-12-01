const { crumbToken } = require('./test-helper')

describe('Page: /capacity-increase-replace', () => {
  const varList = {
    applicantType: 'Beef',
    projectType: 'Replace an existing store that is no longer fit for purpose with a new store'
  }

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
      url: `${global.__URLPREFIX__}/capacity-increase-replace`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What estimated volume do you need to have 6 months’ storage?')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/capacity-increase-replace`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { serviceCapacityIncrease: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter the volume you need to have 6 months’ storage')
  })

  it('value outside min and max -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/capacity-increase-replace`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { serviceCapacityIncrease: '10123456789', crumb: crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Volume must be between 1-999999')
  })

  it('If comma used', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/capacity-increase-replace`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { serviceCapacityIncrease: '12,32', crumb: crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Volume must be a whole number')
  })

  it('If decimals used', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/capacity-increase-replace`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { serviceCapacityIncrease: '12.32', crumb: crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Volume must be a whole number')
  })

  it('enter valid value - redirect user cover type when existing cover `/Yes/` and grant funded `/Yes I need a cover/`', async () => {
    varList.grantFundedCover = 'Yes, I need a cover'
    varList.existingCover = 'Yes'

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/capacity-increase-replace`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { serviceCapacityIncrease: '12345', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/slurry-infrastructure/cover-type')
  })
  it('enter valid value - redirect user cover type when existing cover `/No/` and grant funded `/Yes I need a cover/`', async () => {
    varList.grantFundedCover = 'Yes, I need a cover'
    varList.existingCover = 'No'

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/capacity-increase-replace`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { serviceCapacityIncrease: '12345', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/slurry-infrastructure/cover-type')
  })

  it('enter valid value - redirect user cover type when existing cover `/Yes/` and grant funded `/Yes, I already have a cover/`', async () => {
    varList.grantFundedCover = 'Yes, I already have a cover'
    varList.existingCover = 'Yes'

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/capacity-increase-replace`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { serviceCapacityIncrease: '12345', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/slurry-infrastructure/existing-cover-type')
  })

  it('enter valid value - redirect user cover type when existing cover `/No/` and grant funded `/Yes, I already have a cover/`', async () => {
    varList.grantFundedCover = 'Yes, I already have a cover'
    varList.existingCover = 'No'
    varList.serviceCapacityIncrease = '12345'

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/capacity-increase-replace`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { serviceCapacityIncrease: '12345', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/slurry-infrastructure/separator')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/capacity-increase-replace`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"storage-type\" class=\"govuk-back-link\">Back</a>')
  })
})
