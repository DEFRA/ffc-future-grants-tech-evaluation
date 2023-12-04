const Joi = require('joi')

const sharedConfigSchema = {
  appInsights: Joi.object(),
  host: Joi.string().default('localhost'),
  password: Joi.string(),
  username: Joi.string(),
  useCredentialChain: Joi.bool().default(false)
}

const messageConfigSchema = Joi.object({
  projectDetailsQueue: {
    address: Joi.string().default('projectDetailsQueue'),
    type: Joi.string(),
    ...sharedConfigSchema
  },
  contactDetailsQueue: {
    address: Joi.string().default('contactDetails'),
    type: Joi.string(),
    ...sharedConfigSchema
  },
  costRequestQueue: {
    address: Joi.string().default('costRequestQueue'),
    type: Joi.string(),
    ...sharedConfigSchema
  },
  costResponseQueue: {
    address: Joi.string().default('costResponseQueue'),
    type: Joi.string(),
    ...sharedConfigSchema
  },
  desirabilitySubmittedTopic: {
    address: Joi.string().default('desirabilitySubmittedTopic'),
    type: Joi.string(),
    ...sharedConfigSchema
  },
  desirabilitySubmittedMsgType: Joi.string(),
  fetchCostRequestMsgType: Joi.string(),
  eligibilityAnswersMsgType: Joi.string(),
  contactDetailsMsgType: Joi.string(),
  msgSrc: Joi.string()
})

const sharedConfig = {
  appInsights: require('applicationinsights'),
  host: process.env.SERVICE_BUS_HOST,
  password: process.env.SERVICE_BUS_PASSWORD,
  username: process.env.SERVICE_BUS_USER,
  useCredentialChain: process.env.NODE_ENV === 'production'
}

const msgTypePrefix = 'uk.gov.ffc.grants' // ' '

const config = {
  projectDetailsQueue: {
    address: process.env.PROJECT_DETAILS_QUEUE_ADDRESS,
    type: 'queue',
    ...sharedConfig
  },
  contactDetailsQueue: {
    address: process.env.CONTACT_DETAILS_QUEUE_ADDRESS,
    type: 'queue',
    ...sharedConfig
  },
  costRequestQueue: {
    address: process.env.COST_REQUEST_QUEUE_ADDRESS,
    type: 'queue',
    ...sharedConfig
  },
  costResponseQueue: {
    address: process.env.COST_RESPONSE_QUEUE_ADDRESS,
    type: 'queue',
    ...sharedConfig
  },
  desirabilitySubmittedTopic: {
    address: process.env.DESIRABILITY_SUBMITTED_TOPIC_ADDRESS,
    type: 'topic',
    ...sharedConfig
  },
  desirabilitySubmittedMsgType: `${msgTypePrefix}.slurry.desirability.notification`,
  fetchCostRequestMsgType: `${msgTypePrefix}.fetch.cost.request`,
  eligibilityAnswersMsgType: `${msgTypePrefix}.slurry.eligibility.details`,
  contactDetailsMsgType: `${msgTypePrefix}.slurry.contact.details`,
  msgSrc: 'ffc-future-grants-tech-evaluation'
}

// Validate config
const result = messageConfigSchema.validate(config, {
  abortEarly: false
})

// // Throw if config is invalid
if (result.error) {
  throw new Error(`The message config is invalid. ${result.error.message}`)
}

module.exports = result.value
