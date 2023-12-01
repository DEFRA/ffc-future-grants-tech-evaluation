describe('getUrl()', () => {
  jest.mock('../../../../app/helpers/session')
  const { getYarValue } = require('../../../../app/helpers/session')

  const { getUrl } = require('../../../../app/helpers/urls')
  let urlObject = null
  let secBtn = 'Back to score'
  let dict = {}
  beforeEach(() => {
    getYarValue.mockImplementation((req, key) => (dict[key]))
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('should return url if urlObject is empty', () => {
    expect(getUrl(urlObject, 'mock-url', {}, secBtn, '')).toEqual('/slurry-infrastructure/score')

    secBtn = ''
    expect(getUrl(urlObject, 'mock-url', {}, secBtn, '')).toEqual('mock-url')
  })

  it('should return nonDependentUrl if urlObject is present, but yar values are empty', () => {
    urlObject = {
      dependentQuestionYarKey: 'dependentQuestionYarKey',
      dependentAnswerKeysArray: 'dependentAnswerKeysArray',
      urlOptions: {
        thenUrl: 'thenUrl',
        elseUrl: 'elseUrl',
        nonDependentUrl: 'nonDependentUrl'
      }
    }
    expect(getUrl(urlObject, 'mock-url', {}, secBtn, '')).toEqual('nonDependentUrl')
  })
  it('should return elseUrl if urlObject and dependent Yar values are present', () => {
    urlObject = {
      dependentQuestionYarKey: 'dependentQuestionYarKey',
      dependentAnswerKeysArray: 'dependentAnswerKeysArray',
      urlOptions: {
        thenUrl: 'thenUrl',
        elseUrl: 'elseUrl',
        nonDependentUrl: 'nonDependentUrl'
      }
    }
    dict = {
      dependentQuestionYarKey: 'dependentAnswerKeysArray'
    }
    expect(getUrl(urlObject, 'mock-url', {}, secBtn, '')).toEqual('elseUrl')
  })
  it('should return secBtnPath if secBtn is "Back to score"', () => {
    urlObject = null
    dict = {
      dependentQuestionYarKey: 'dependentAnswerKeysArray'
    }
    expect(getUrl(urlObject, 'mock-url', {}, 'Back to score', '')).toEqual('/slurry-infrastructure/score')
  })
  it('should navigate to /planning-permission-summary if secBtn is not "Back to score" and current url is /grid-reference', () => {
    urlObject = null
    dict = {
      dependentQuestionYarKey: 'dependentAnswerKeysArray'
    }
    expect(getUrl(urlObject, 'mock-url', {}, 'i_hate_js', 'grid-reference')).toEqual('/slurry-infrastructure/planning-permission-summary')
  })
  it('should default to /check-details if secBtn is not "Back to score" and current url is not a building or planning page', () => {
    urlObject = null
    dict = {
      dependentQuestionYarKey: 'dependentAnswerKeysArray'
    }
    expect(getUrl(urlObject, 'mock-url', {}, 'i-wish-i-was-writing-python', 'or-even-java')).toEqual('/slurry-infrastructure/check-details')
  })
})
