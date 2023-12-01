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
      url: `${global.__URLPREFIX__}/business-details`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Business details')
    expect(response.payload).toContain('Project name')
    expect(response.payload).toContain('Business name')
    expect(response.payload).toContain('Number of employees')
    expect(response.payload).toContain('Business turnover')
    expect(response.payload).toContain('Single Business Identifier')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { businessDetails: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a project name')
    expect(postResponse.payload).toContain('Enter a business name')
    expect(postResponse.payload).toContain('Enter the number of employees')
    expect(postResponse.payload).toContain('Enter the business turnover')
  })

  it('user came from \'CHECK DETAILS\' page -> display <Back to details> button', async () => {
    varList.reachedCheckDetails = true

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/business-details`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Back to details')
  })

  it('should validate project name - maximum characters is 100', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        projectName: 'abcdefghijklmonopqrstuvwxyzabcdefghijklmonopqrstuvwxyzabcdefghijklmonopqrstuvwxyzabcdefghijklmonopqrs',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Name must be 100 characters or fewer')
  })

  it('should validate business name - maximum characters is 100', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        businessName: 'abcdefghijklmonopqrstuvwxyzabcdefghijklmonopqrstuvwxyzabcdefghijklmonopqrstuvwxyzabcdefghijklmonopqrs',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Name must be 100 characters or fewer')
  })
  it('should validate number of employees - no spaces', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        numberEmployees: '123 45',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Number of employees must be a whole number, like 305')
  })

  it('should validate number of employees - maximum number of employees is 9999999', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        numberEmployees: '12345678',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Number must be between 1-9999999')
  })

  it('should validate number of employees - minimum number of employees is 1', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        numberEmployees: '0',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Number must be between 1-9999999')
  })

  it('should validate business turnover - only digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        businessTurnover: '124e',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Business turnover must be a whole number, like 100000')
  })

  it('should validate business turnover - no spaces', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        businessTurnover: '123 45',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Business turnover must be a whole number, like 100000')
  })

  it('should validate business turnover - maximum value is 999999999', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        businessTurnover: '1234567890',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Number must be between 1-999999999')
  })

  it('should validate business turnover - minimum value is 1', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        businessTurnover: '0',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Number must be between 1-999999999')
  })

  it('should validate SBI, if entered - only digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        sbi: '123e',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('SBI number must have 9 characters, like 011115678')
  })

  it('should validate SBI, if entered - no spaces', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        sbi: '123 45',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('SBI number must have 9 characters, like 011115678')
  })

  it('should validate SBI - characters must not be less than 9', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        sbi: '12345678',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('SBI number must have 9 characters, like 011115678')
  })

  it('should validate SBI - characters must not be more than 9', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        sbi: '1234567890',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('SBI number must have 9 characters, like 011115678')
  })

  it('store user response and redirect to applicant page: /applying, sbi is optional', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('applying')
  })

  it('store user response and redirect to applicant page: /applying', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        sbi: '012345678',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('applying')
  })
})
