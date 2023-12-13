const {
  CHARS_MIN_10,
  POSTCODE_REGEX,
  WHOLE_NUMBER_REGEX,
  SBI_REGEX,
  NAME_ONLY_REGEX,
  PHONE_REGEX,
  EMAIL_REGEX,
  ONLY_TEXT_REGEX,
  PLANNING_REFERENCE_NUMBER_REGEX,
  LETTERS_AND_NUMBERS_REGEX,
  TWO_LETTERS_TEN_DIGITS,
  CHARS_MAX_50,
  INTERGERS_AND_DECIMALS
} = require('../helpers/regex')
/**
 * ----------------------------------------------------------------
 * list of yarKeys not bound to an answer, calculated separately
 * -  calculatedGrant
 * -  remainingCost
 *
 * Mainly to replace the value of a previously stored input
 * Format: {{_VALUE_}}
 * eg: question.title: 'Can you pay £{{_storedYarKey_}}'
 * ----------------------------------------------------------------
 */
/**
 * ----------------------------------------------------------------
 * question type = single-answer, boolean ,input, multiinput, mullti-answer
 *
 *
 * ----------------------------------------------------------------
 */
/**
 * multi-input validation schema
 *
 *  type: 'multi-input',
    allFields: [
      {
        ...
        validate: [
          {
            type: 'NOT_EMPTY',
            error: 'Error message'
          },
          {
            type: 'REGEX',
            error: 'Error message',
            regex: SAVED_REGEX
          },
          {
            type: 'MIN_MAX',
            error: 'Error message',
            min: MINIMUM,
            max: MAXIMUM
          }
        ]
      }
    ]
 */
const questionBank = {
  grantScheme: {
    grantID: 'AHG001',
    schemeName: 'AHG',
    subScheme: {
      subSchemeId: 'AHG74',
      subSchemeDisplayName: 'Animal Housing Grant'
    },
  },
  themes: [
    {
      name: 'productivity',
      title: 'Productivity',
      questions: [
        {
          key: 'project-location',
          journeyStart: true,
          title: 'Is your project in England?',
          backUrl: 'portal',
          nextUrl: 'livestock',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          url: 'project-location',
          ineligibleContent: {
            messageContent: 'This grant is only for projects registered in England.',
          },
          type: 'boolean',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the project is in England'
            }
          ],
          answers: [
            {
              key: 'project-location-true',
              value: 'Yes'
            },
            {
              key: 'project-location-false',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'projectLocation'
        },
        {
          key: 'livestock-type',
          title: 'What livestock do you have?',
          backUrl: 'project-location',
          nextUrl: 'livestock-quantity',
          url: 'livestock',
          type: 'single-answer',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select the type of livestock you have'
            }
          ],
          answers: [
            {
              key: 'livestock-type-beef',
              value: 'Beef cattle'
            },
            {
              key: 'livestock-type-dairy',
              value: 'Dairy cattle'
            },
            {
              key: 'livestock-type-sheep',
              value: 'Sheep'
            },
            {
              key: 'livestock-type-pigs',
              value: 'Pigs'
            }
          ],
          yarKey: 'livestockType'
        },
        {
          key: 'livestock-quantity',
          classes: 'govuk-input--width-10',
          url: 'livestock-quantity',
          backUrl: 'livestock',
          nextUrl: 'project-amount',
          type: 'input',
          label: {
            text: 'How many {{_livestockType_}} do you have?',
            classes: 'govuk-label--l',
            isPageHeading: true
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter the total number of livestock'
            },
            {
              type: 'REGEX',
              regex: /^[1-9]\d*$/,
              error: 'Enter a whole number'
            }
          ],
          answers: [],
          yarKey: 'livestockQuantity'
        },
        {
          key: 'project-amount',
          classes: 'govuk-input--width-10',
          url: 'project-amount',
          backUrl: 'livestock-quantity',
          nextUrl: 'check-details',
          type: 'input',
          hint: {
            html: `<p>Please enter the amount for your project.<p/>`
          },
          label: {
            text: 'What is the total grant ammount you are applying for?',
            classes: 'govuk-label--l',
            isPageHeading: true
          },
          prefix: {
            text: '£'
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter the project amount'
            },
            {
              type: 'REGEX',
              regex: /^\d+$/,
              error: 'Enter a number'
            }
          ],
          answers: [],
          yarKey: 'projectAmount'
        },       
        {
          key: 'check-details',
          title: 'Check application details and submit',
          url: 'check-details',
          backUrl: 'project-amount',
          nextUrl: 'confirmation',
          answers: [],
          summarySections: [
            {
              title: 'Answers',
              type: 'simple',
              rows: [
                {
                  title: 'What livestock do you have?',
                  yarKey: 'livestockType',
                  changeUrl: 'livestock'
                },
                {
                  title: 'How many {{_livestockType_}} do you have?',
                  yarKey: 'livestockQuantity',
                  changeUrl: 'livestock-quantity'
                },
                {
                  title: 'What is the total grant ammount you are applying for?',
                  yarKey: 'projectAmount',
                  changeUrl: 'project-amount',
                  format: 'currency'
                }
              ]
            }
          ],
          sidebar: [
            'Note that the minimum grant value is £2,000 and the maximum grant value is £25,000.',
            'You can apply for a total of £50,000 over multiple rounds'
          ]
        },
        {
          key: 'reference-number',
          title: 'Details submitted',
          url: 'confirmation',
          answers: []
        }
      ]
    }
  ]
}
const ALL_QUESTIONS = []
questionBank.themes.forEach(({ questions }) => {
  ALL_QUESTIONS.push(...questions)
})
const ALL_URLS = []
ALL_QUESTIONS.forEach(item => ALL_URLS.push(item.url))
const YAR_KEYS = ['itemsTotalValue', 'remainingCost', 'calculatedGrant', 'separatorOptions', 'concreteBunkerSize', 'cappedAmount']
ALL_QUESTIONS.forEach(item => YAR_KEYS.push(item.yarKey))
module.exports = {
  questionBank,
  ALL_QUESTIONS,
  YAR_KEYS,
  ALL_URLS
}
