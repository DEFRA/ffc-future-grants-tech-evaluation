const { crumbToken } = require('./test-helper')

describe('Page: /applicant-details', () => {
  const varList = { applying: 'Applicant' }

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
      url: `${global.__URLPREFIX__}/applicant-details`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Applicant’s details')
    expect(response.payload).toContain('Name')
    expect(response.payload).toContain('First name')
    expect(response.payload).toContain('Last name')
    expect(response.payload).toContain('Contact details')
    expect(response.payload).toContain('Email address')
    expect(response.payload).toContain('Mobile number')
    expect(response.payload).toContain('Landline number')
    expect(response.payload).toContain('Business address')
    expect(response.payload).toContain('Address line 1')
    expect(response.payload).toContain('Address line 2')
    expect(response.payload).toContain('Town')
    expect(response.payload).toContain('County')
    expect(response.payload).toContain('Business postcode')
    expect(response.payload).toContain('Project postcode')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { farmerDetails: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter your first name')
    expect(postResponse.payload).toContain('Enter your last name')
    expect(postResponse.payload).toContain('Enter your email address')
    expect(postResponse.payload).toContain('Enter a landline number (if you do not have a landline, enter your mobile number)')
    expect(postResponse.payload).toContain('Enter your building and street details')
    expect(postResponse.payload).toContain('Enter your town')
    expect(postResponse.payload).toContain('Select your county')
    expect(postResponse.payload).toContain('Enter your business postcode, like AA1 1AA')
    expect(postResponse.payload).toContain('Enter your project postcode, like AA1 1AA')
  })

  it('user came from \'CHECK DETAILS\' page -> display <Back to details> button', async () => {
    varList.reachedCheckDetails = true

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/applicant-details`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Back to details')
  })

  it('validate first name - no digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        firstName: '123',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Name must only include letters, hyphens and apostrophes')
  })

  it('validate last name - no digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        lastName: '123',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Name must only include letters, hyphens and apostrophes')
  })

  it('validate email', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        emailAddress: 'my@@name.com',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter an email address in the correct format, like name@example.com')
  })

  it('validate mobile (optional) - at least 10 characters', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        mobileNumber: '12345679',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Your mobile number must have at least 10 characters')
  })

  it('validate mobile (optional) - correct format', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        mobileNumber: '12345679a0${',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192')
  })

  it('validate landline (optional) - at least 10 characters', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        landlineNumber: '12345679',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Your landline number must have at least 10 characters')
  })

  it('validate town: fail when user adds non text characters (digits or other characters)', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        town: 'Highbury23',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Town must only include letters')
  })

  it('validate landline (optional) - correct format', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        landlineNumber: '12345679a0${',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192')
  })

  it('if both mobile and landline are missing -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
        businessName: 'Business Name',
        emailAddress: 'my@name.com',
        address1: 'Address line 1',
        address2: 'Address 2',
        town: 'MyTown',
        county: 'Devon',
        postcode: 'AA1 1AA',
        projectPostcode: 'AA1 1AA',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a landline number (if you do not have a landline, enter your mobile number)')
  })

  it('validate business postcode - valid format', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        postcode: 'aa1aa',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a business postcode, like AA1 1AA')
  })

  it('validate project postcode - valid format', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        projectPostcode: 'aa1aa',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a project postcode, like AA1 1AA')
  })

  it('store user response and redirect to /check-details', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
        businessName: 'Business Name',
        emailAddress: 'my1.email1@my2-domain2.com',
        mobileNumber: '07700 900 982',
        address1: 'Address line 1',
        address2: 'Address 2',
        town: 'MyTown',
        county: 'Devon',
        postcode: 'AA1 1AA',
        projectPostcode: 'AA1 1AA',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('check-details')
  })
})
