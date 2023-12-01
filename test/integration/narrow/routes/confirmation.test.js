const { crumbToken } = require('./test-helper')

const senders = require('../../../../app/messaging/senders')

describe('confirm page', () => {
  const varList = { farmerDetails: 'someValue', contractorsDetails: 'someValue' }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      console.log(key, 'key')
      if (varList[key]) return varList[key]
      else return 'Error'
    }
  }))

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/confirmation`,
      headers: {
        cookie: 'crumb=' + crumbToken,
        referer: 'localhost/check-details'
      }
    }

    jest.spyOn(senders, 'sendDesirabilitySubmitted').mockImplementationOnce(() => Promise.resolve(true))

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Details submitted')
    expect(response.payload).toContain('We have sent you a confirmation email with a record of your answers.')
    expect(response.payload).toContain('What happens next')
    expect(response.payload).toContain('You must not start the project')
    expect(response.payload).toContain('Starting the project or committing to any costs (such as placing orders) before you receive a funding agreement will invalidate your application.')
    expect(response.payload).toContain('get quotes from suppliers')
    expect(response.payload).toContain('apply for planning permission')
    expect(response.payload).toContain('RPA will be in touch when the full application period opens to tell you if your project is invited to submit a full application form.')
  })
})
