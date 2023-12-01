const appInsights = jest.mock('../../../../app/services/app-insights')
appInsights.logException = jest.fn((req, event) => {
  return null
})

jest.mock('../../../../app/helpers/session', () => {
  const original = jest.requireActual('../../../../app/helpers/session')
  const varList = {
    'journey-start-time': (new Date()).getTime(),
    'current-score': 'some mock score'
  }
  return {
    ...original,
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (Object.keys(varList).includes(key)) return varList[key]
      else return 'Error'
    }
  }
})

jest.mock('../../../../app/services/protective-monitoring-service', () => {
  const original = jest.requireActual('../../../../app/services/protective-monitoring-service')
  return {
    ...original,
    sendMonitoringEvent: jest.fn().mockResolvedValue(undefined)
  }
})

const gapiService = require('../../../../app/services/gapi-service')

const eventSuccess = jest.fn(async (obj) => {
  return 'ok'
})

const eventError = jest.fn(async (obj) => {
  throw new Error('Some error')
})

const request = {
  ga: {
    view: eventSuccess
  },
  route: {
    path: 'somePath'
  },
  yar: {
    id: 'Some ID',
    get: jest.fn()
  },
  info: {
    host: 'someHost'
  }
}

const requestError = {
  ga: {
    event: eventError
  },
  yar: {
    id: 'Some ID',
    get: jest.fn()
  },
  info: {
    host: 'someHost'
  }
}

afterEach(() => {
  jest.resetAllMocks()
})

describe('get gapiService setup', () => {
  test('Should be defined', () => {
    expect(gapiService).toBeDefined()
  })

  test('custom event CONFIRMATION sent successfully', async () => {
    const result = await gapiService.sendGAEvent(request, { name: 'confirmation', pram: {} })
    expect(result).toBe(undefined)
  })

  test('custom event ELIGIBILITY PASSED sent successfully', async () => {
    const result = await gapiService.sendGAEvent(request, { name: 'eligibility_passed', pram: {} })
    expect(result).toBe(undefined)
  })

  test('custom event ELIGIBILITIES sent successfully', async () => {
    const result = await gapiService.sendGAEvent(request, { name: 'eligibilities', pram: { reference_cost: 'Eligible' } })
    expect(result).toBe(undefined)
  })

  test('custom event ELIMINATION sent successfully', async () => {
    const result = await gapiService.sendGAEvent(request, { name: 'elimination', pram: {} })
    expect(result).toBe(undefined)
  })
  test('test isBlockDefaultPageView() -> false', () => {
    const result = gapiService.isBlockDefaultPageView('/water/country')
    expect(result).toBe(false)
  })

  test('test isBlockDefaultPageView()-> true', () => {
    const result = gapiService.isBlockDefaultPageView('/water/applying')
    expect(result).toBe(true)
  })
})
