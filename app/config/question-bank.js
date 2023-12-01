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
const { LIST_COUNTIES } = require('../helpers/all-counties')
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
    key: 'FFC002',
    name: 'Slurry Infrastructure'
  },
  sections: [
    {
      name: 'eligibility',
      title: 'Eligibility',
      questions: [
        {
          key: 'applicant-type',
          order: 10,
          title: 'Which livestock do you farm mainly?',
          pageTitle: '',
          ga: { journeyStart: true },
          url: 'applicant-type',
          baseUrl: 'applicant-type',
          backUrl: 'start',
          nextUrl: 'legal-status',
          ineligibleContent: {
            messageContent: 'This grant is for pig, beef or dairy farmers.',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [
                  {
                    para: `If your main livestock enterprise is pig, the grant is to get your slurry storage levels to 8 months.
                    <br>
                    If beef or dairy is your main livestock enterprise, the grant is to get your slurry storage levels to 6 months.`
                  }
                ]
              }
            ]
          },
          fundingPriorities: 'Improve the environment',
          type: 'single-answer',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select what you farm mainly'
            }
          ],
          answers: [
            {
              key: 'applicant-type-A1',
              value: 'Pig',
              redirectUrl: 'intensive-farming'
            },
            {
              key: 'applicant-type-A2',
              value: 'Beef',
              redirectUrl: 'legal-status'
            },
            {
              key: 'applicant-type-A3',
              value: 'Dairy',
              redirectUrl: 'legal-status'
            },
            {
              value: 'divider'
            },
            {
              key: 'applicant-type-A4',
              value: 'None of the above',
              notEligible: true
            }
          ],
          yarKey: 'applicantType'
        },
        {
          key: 'intensive-farming',
          order: 15,
          title: 'Do you have an environmental permit for intensive farming?',
          pageTitle: '',
          backUrl: 'applicant-type',
          nextUrl: 'legal-status',
          url: 'intensive-farming',
          baseUrl: 'intensive-farming',
          preValidationKeys: ['applicantType'],
          ineligibleContent: {
            messageContent: 'This grant is only for projects in England.',
            insertText: {
              text: 'Scotland, Wales and Northern Ireland have other grants available.'
            },
            messageLink: {
              url: '',
              title: ''
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [
              {
                heading: 'Environmental permit',
                content: [
                  {
                    para: 'You must have a permit from the Environment Agency (EA) to rear pigs intensively if you have more than:',
                    items: [
                      '2,000 places for production pigs (over 30kg)',
                      '750 places for sows'
                    ],
                    additionalPara:
                      'You may need to apply for a variation to your environment permit if you change your slurry storage.'
                  }
                ]
              }
            ]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error:
                'Select if you have an environmental permit for intensive farming'
            }
          ],
          answers: [
            {
              key: 'intensive-farming-A1',
              value: 'Yes',
              redirectUrl: 'intensive-farming-condition'
            },
            {
              key: 'intensive-farming-A2',
              value:
                'No, my farm does not need an environmental permit for intensive farming'
            }
          ],
          yarKey: 'intensiveFarming'
        },
        {
          key: 'intensive-farming-condition',
          title:
            'You may need to apply for a change to your intensive farming permit',
          order: 17,
          url: 'intensive-farming-condition',
          backUrl: 'intensive-farming',
          nextUrl: 'legal-status',
          preValidationKeys: ['intensiveFarming'],
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader:
              'You may need to apply for a change to your intensive farming permit',
            messageContent: `<p>If you have an intensive farming permit, or plan to get one, you may need to apply for a change to your permit.</p>
            <p>This may be required if you are:</p>
            <ul class="govuk-list govuk-list--bullet"><li>applying to build a new store </li><li>expanding or replacing an existing store</li><li>covering an existing store</li></ul>
            <p class='govuk-body'>You can use the Environment Agency’s (EA) pre-application advice service to find out more or discuss this with your EA site officer.</p>`,
            warning: {
              text: 'You must get your permit variation before you receive the final grant payment.',
              iconFallbackText: 'Warning'
            }
          }
        },
        {
          key: 'legal-status',
          order: 20,
          title: 'What is the legal status of the business?',
          pageTitle: '',
          backUrlObject: {
            dependentQuestionYarKey: 'intensiveFarming',
            dependentAnswerKeysArray: ['intensive-farming-A2'],
            urlOptions: {
              thenUrl: 'intensive-farming',
              elseUrl: 'intensive-farming-condition',
              nonDependentUrl: 'applicant-type'
            }
          },
          nextUrl: 'country',
          url: 'legal-status',
          baseUrl: 'legal-status',
          preValidationKeys: ['applicantType'],
          ineligibleContent: {
            messageContent:
              'Your business does not have an eligible legal status.',
            details: {
              summaryText: 'Who is eligible',
              html: '<ul class="govuk-list govuk-list--bullet"><li>Sole trader</li><li>Partnership</li><li>Limited company</li><li>Charity</li><li>Trust</li><li>Limited liability partnership</li><li>Community interest company</li><li>Limited partnership</li><li>Industrial and provident society</li><li>Co-operative society (Co-Op)</li><li>Community benefit society (BenCom)</li></ul>'
            },
            messageLink: {
              url: 'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments',
              title: 'See other grants you may be eligible for.'
            },
            warning: {
              text: 'Other types of business may be supported in future schemes',
              iconFallbackText: 'Warning'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [
                  {
                    para: 'Public organisations and local authorities cannot apply for this grant.',
                    items: []
                  }
                ]
              }
            ]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select the legal status of the business'
            }
          ],
          answers: [
            {
              key: 'legal-status-A1',
              value: 'Sole trader'
            },
            {
              key: 'legal-status-A2',
              value: 'Partnership'
            },
            {
              key: 'legal-status-A3',
              value: 'Limited company'
            },
            {
              key: 'legal-status-A4',
              value: 'Charity'
            },
            {
              key: 'legal-status-A5',
              value: 'Trust'
            },
            {
              key: 'legal-status-A6',
              value: 'Limited liability partnership'
            },
            {
              key: 'legal-status-A7',
              value: 'Community interest company'
            },
            {
              key: 'legal-status-A8',
              value: 'Limited partnership'
            },
            {
              key: 'legal-status-A9',
              value: 'Industrial and provident society'
            },
            {
              key: 'legal-status-A10',
              value: 'Co-operative society (Co-Op)'
            },
            {
              key: 'legal-status-A11',
              value: 'Community benefit society (BenCom)'
            },
            {
              value: 'divider'
            },
            {
              key: 'legal-status-A12',
              value: 'None of the above',
              notEligible: true
            }
          ],
          yarKey: 'legalStatus'
        },
        {
          key: 'country',
          order: 30,
          title: 'Is the planned project in England?',
          hint: {
            text: 'The location of the slurry store'
          },
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          pageTitle: '',
          backUrl: 'legal-status',
          nextUrl: 'project-started',
          url: 'country',
          baseUrl: 'country',
          preValidationKeys: ['legalStatus'],
          ineligibleContent: {
            messageContent: 'This grant is only for projects in England.',
            insertText: {
              text: 'Scotland, Wales and Northern Ireland have other grants available.'
            },
            messageLink: {
              url: '',
              title: ''
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [
                  {
                    para: `This grant is only for projects in England.

                          Scotland, Wales and Northern Ireland have other grants available.`
                  }
                ]
              }
            ]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the project is in England'
            }
          ],
          answers: [
            {
              key: 'country-A1',
              value: 'Yes'
            },
            {
              key: 'country-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'inEngland'
        },
        {
          key: 'project-started',
          order: 40,
          title: 'Have you already started work on the project?',
          pageTitle: '',
          url: 'project-started',
          baseUrl: 'project-started',
          backUrl: 'country',
          nextUrl: 'tenancy',
          preValidationKeys: ['inEngland'],
          ineligibleContent: {
            messageContent:
              'You cannot apply for a grant if you have already started work on the project.',
            insertText: {
              text: 'Starting the project or committing to any costs (such as placing orders) before you receive a funding agreement invalidates your application.'
            },
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [
                  {
                    para: 'You can start preparatory work such as applying for planning permissions before you start the project (this can take a long time).'
                  }
                ]
              }
            ]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select the option that applies to your project'
            }
          ],
          answers: [
            {
              key: 'project-started-A1',
              value: 'Yes, preparatory work',
              hint: {
                text: 'For example, applying for planning permission'
              }
            },
            {
              key: 'project-started-A2',
              value: 'Yes, we have begun project work',
              hint: {
                text: 'For example, started construction work, signing contracts'
              },
              notEligible: true
            },
            {
              key: 'project-started-A3',
              value: 'No, we have not done any work on this project yet'
            }
          ],
          warning: {
            html: 'You must not start the project work or commit to project costs before receiving your funding agreement.',
            iconFallbackText: 'Warning'
          },
          yarKey: 'projectStart'
        },
        {
          key: 'tenancy',
          order: 50,
          title: 'Is the planned project on land the business owns?',
          hint: {
            text: 'The location of the slurry store'
          },
          pageTitle: '',
          url: 'tenancy',
          baseUrl: 'tenancy',
          backUrl: 'project-started',
          nextUrl: 'system-type',
          preValidationKeys: ['projectStart'],
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [
                  {
                    para: 'If you are a tenant farmer, you have the option to ask your landlord to underwrite your agreement.'
                  }
                ]
              }
            ]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error:
                'Select yes if the planned project is on land the business owns'
            }
          ],
          answers: [
            {
              key: 'tenancy-A1',
              value: 'Yes'
            },
            {
              key: 'tenancy-A2',
              value: 'No',
              redirectUrl: 'project-responsibility'
            }
          ],
          yarKey: 'tenancy'
        },
        {
          key: 'project-responsibility',
          order: 60,
          title: 'Will you take full responsibility for your project?',
          hint: {
            html: `If you are on a short tenancy, you can ask your landlord to underwrite your agreement. This means they will take over your agreement if your tenancy ends. For example, your landlord could pass the agreed project to the new tenant. 
                  <br/><br/>This approach is optional and we will only ask for details of your agreement at full application.`
          },
          pageTitle: '',
          url: 'project-responsibility',
          baseUrl: 'project-responsibility',
          backUrl: 'tenancy',
          nextUrl: 'system-type',
          preValidationKeys: ['tenancy'],
          fundingPriorities: '',
          type: 'single-answer',
          minAnswercount: 1,
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [
                  {
                    para: 'You must complete your project and keep the grant-funded items fit for purpose for 5 years after the date you receive your final grant payment.',
                    items: []
                  }
                ]
              }
            ]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select if you are planning to ask your landlord to underwrite your Grant Funding Agreement'
            }
          ],
          answers: [
            {
              key: 'project-responsibility-A1',
              value:
                'Yes, I plan to take full responsibility for my project'
            },
            {
              key: 'project-responsibility-A2',
              value:
                'No, I plan to ask my landlord to underwrite the agreement'
            }
          ],
          yarKey: 'projectResponsibility'
        },
        {
          key: 'system-type',
          order: 80,
          title: 'What is your current manure management system?',
          pageTitle: '',
          url: 'system-type',
          baseUrl: 'system-type',
          backUrlObject: {
            dependentQuestionYarKey: 'tenancy',
            dependentAnswerKeysArray: ['tenancy-A1'],
            urlOptions: {
              thenUrl: 'tenancy',
              elseUrl: 'project-responsibility',
              nonDependentUrl: 'tenancy'
            }
          },
          nextUrlObject: {
            dependentQuestionYarKey: 'applicantType',
            dependentAnswerKeysArray: ['applicant-type-A1'],
            urlOptions: {
              thenUrl: 'pig-existing-storage-capacity',
              elseUrl: 'existing-storage-capacity'
            }
          },
          preValidationKeys: ['tenancy'],
          ineligibleContent: {
            messageContent:
              'This grant is for farmers currently using a system that produces slurry.',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [
                  {
                    para: `
                This grant is for farmers currently using a system that produces slurry.
                `,
                    items: []
                  }
                ]
              }
            ],
            details: {
              summaryText: 'What is slurry?',
              html: 'Slurry is a liquid organic manure produced by livestock (other than poultry) while in a yard or building. It includes animal bedding and water that drains from areas where animals are kept.'
            }
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select your current manure management system'
            }
          ],
          answers: [
            {
              key: 'system-type-A1',
              value: 'Slurry-based system'
            },
            {
              key: 'system-type-A2',
              value: 'Farmyard manure and slurry system'
            },
            {
              key: 'system-type-A3',
              value: 'Farmyard manure system that does not produce slurry',
              notEligible: true
            },
            {
              key: 'system-type-A4',
              value: 'I do not have a slurry system',
              notEligible: true
            }
          ],
          errorMessage: {
            text: ''
          },
          yarKey: 'systemType'
        },
        {
          key: 'existing-storage-capacity',
          order: 90,
          title: 'How many months’ slurry storage capacity do you have?',
          hint: {
            text: 'Based on your current animal numbers'
          },
          baseUrl: 'existing-storage-capacity',
          backUrl: 'system-type',
          nextUrl: 'planned-storage-capacity',
          url: 'existing-storage-capacity',
          preValidationKeys: ['systemType'],
          ineligibleContent: {
            messageContent: `
            This grant is to get your storage levels to 6 months.`,
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [
                  {
                    para: `
                This grant is to get your storage levels to 6 months.
                For example, if you have 4 months’ storage, we will fund another 2 months. If you have 2 months’ storage and increase to 12 months, we will fund 4 months.
                You cannot apply for the grant if you already have 6 months’ storage that is fit for purpose.`,
                    items: []
                  }
                ]
              }
            ],
            details: {
              summaryText: 'When is a store no longer fit for purpose?',
              text: 'A store is no longer fit for purpose if it has reached the end of its design life and may be at risk of leaks or failure.'
            }
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select how many months\' slurry storage capacity you have'
            }
          ],
          answers: [
            {
              key: 'existing-storage-capacity-A1',
              value: 'Less than 6 months'
            },
            {
              key: 'existing-storage-capacity-A2',
              value: '6 months or more, but it is no longer fit for purpose'
            },
            {
              key: 'existing-storage-capacity-A3',
              value: '6 months or more, and it is fit for purpose',
              notEligible: true
            }
          ],
          yarKey: 'existingStorageCapacity'
        },
        {
          key: 'pig-existing-storage-capacity',
          order: 90,
          title: 'How many months’ slurry storage capacity do you have?',
          hint: {
            text: 'Based on your current animal numbers'
          },
          baseUrl: 'pig-existing-storage-capacity',
          url: 'pig-existing-storage-capacity',
          backUrl: 'system-type',
          nextUrl: 'pig-planned-storage-capacity',
          preValidationKeys: ['systemType'],
          ineligibleContent: {
            messageContent: `
            This grant is to get your storage levels to 8 months.`,
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [
                  {
                    para: `
                This grant is to get your storage levels to 8 months.
                For example, if you have 4 months’ storage, we will fund another 4 months. If you have 2 months’ storage and increase to 12 months, we will fund 6 months.
                
                You cannot apply for the grant if you already have 8 months’ storage that is fit for purpose.`,
                    items: []
                  }
                ]
              }
            ],
            details: {
              summaryText: 'When is a store no longer fit for purpose?',
              text: 'A store is no longer fit for purpose if it has reached the end of its design life and may be at risk of leaks or failure.'
            }
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select how many months\' slurry storage capacity you have'
            }
          ],
          answers: [
            {
              key: 'pig-existing-storage-capacity-A1',
              value: 'Less than 8 months'
            },
            {
              key: 'pig-existing-storage-capacity-A2',
              value: '8 months or more, but it is no longer fit for purpose'
            },
            {
              key: 'pig-existing-storage-capacity-A3',
              value: '8 months or more, and it is fit for purpose',
              notEligible: true
            }
          ],
          yarKey: 'existingStorageCapacity'
        },
        {
          key: 'planned-storage-capacity',
          order: 100,
          title:
            'How many months’ slurry storage capacity will you have after the project?',
          hint: {
            text: 'Based on your current animal numbers'
          },
          baseUrl: 'planned-storage-capacity',
          backUrl: 'existing-storage-capacity',
          nextUrl: 'applying-for',
          url: 'planned-storage-capacity',
          preValidationKeys: ['existingStorageCapacity'],
          type: 'single-answer',
          minAnswerCount: 1,
          ineligibleContent: {
            messageContent:
              'This grant is to get your storage levels to 6 months.',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you might be eligible for.'
            }
          },
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [
                  {
                    para: `
                This grant is to get your storage levels to 6 months. Any capacity above that is not covered by the grant.

                For example, if you have 4 months’ storage, we will fund another 2 months. If you have 2 months’ storage and increase to 12 months, we will fund 4 months.

                You must maintain at least 6 months’ capacity for the duration of the 5-year grant funding agreement.
                `
                  }
                ]
              }
            ],
            details: {
              summaryText: 'What if i am using a slurry separator?',
              text: 'If you are using a slurry separator, select the capacity your slurry store will hold after the stackable material has been removed.'
            }
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select how many months’ slurry storage capacity you will have'
            }
          ],
          answers: [
            {
              key: 'planned-storage-capacity-A1',
              value: '6 months'
            },
            {
              key: 'planned-storage-capacity-A2',
              value: 'More than 6 months '
            },
            {
              key: 'planned-storage-capacity-A3',
              value: 'Less than 6 months',
              notEligible: true
            }
          ],
          yarKey: 'plannedStorageCapacity'
        },
        {
          key: 'pig-planned-storage-capacity',
          order: 100,
          title:
            'How many months’ slurry storage capacity will you have after the project?',
          hint: {
            text: 'Based on your current animal numbers'
          },
          baseUrl: 'pig-planned-storage-capacity',
          backUrl: 'pig-existing-storage-capacity',
          nextUrl: 'applying-for',
          url: 'pig-planned-storage-capacity',
          preValidationKeys: ['existingStorageCapacity'],
          type: 'single-answer',
          minAnswerCount: 1,
          ineligibleContent: {
            messageContent:
              'This grant is to get your storage levels to 8 months.',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you might be eligible for.'
            }
          },
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [
                  {
                    para: `
                This grant is to get your storage levels to 8 months. Any capacity above that is not covered by the grant.

                For example, if you have 4 months’ storage, we will fund another 4 months. If you have 2 months’ storage and increase to 12 months, we will fund 6 months.

                You must maintain at least 8 months’ capacity for the duration of the 5-year grant funding agreement.
                `
                  }
                ]
              }
            ],
            details: {
              summaryText: 'What if i am using a slurry separator?',
              text: 'If you are using a slurry separator, select the capacity your slurry store will hold after the stackable material has been removed.'
            }
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select how many months’ slurry storage capacity you will have'
            }
          ],
          answers: [
            {
              key: 'planned-storage-capacity-A1',
              value: '8 months'
            },
            {
              key: 'planned-storage-capacity-A2',
              value: 'More than 8 months '
            },
            {
              key: 'planned-storage-capacity-A3',
              value: 'Less than 8 months',
              notEligible: true
            }
          ],
          yarKey: 'plannedStorageCapacity'
        },
        {
          key: 'applying-for',
          order: 110,
          title: 'What are you applying for?',
          pageTitle: '',
          url: 'applying-for',
          baseUrl: 'applying-for',
          nextUrl: 'project-type',
          backUrlObject: {
            dependentQuestionYarKey: 'applicantType',
            dependentAnswerKeysArray: ['applicant-type-A1'],
            urlOptions: {
              thenUrl: 'pig-planned-storage-capacity',
              elseUrl: 'planned-storage-capacity'
            }
          },
          preValidationKeys: ['plannedStorageCapacity'],
          fundingPriorities: '',
          type: 'single-answer',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          minAnswerCount: 1,
          ineligibleContent: {
            messageContent: `
            This grant is for: <br> 
            <ul class="govuk-list govuk-list--bullet">
            <li>replacing an existing store that is no longer fit for purpose with a new store</li>
            <li>adding a new store to increase existing capacity</li>
            <li>expanding an existing store (for example, by adding an extra ring to a steel tank)</li>
            <li>adding an impermeable cover to an existing store to increase storage capacity</li>
            </ul>
            `,
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [
                  {
                    para: 'A grant-funded store must have an impermeable cover unless the slurry is treated with acidification.'
                  }
                ]
              }
            ],
            details: {
              summaryText: 'When is a store no longer fit for purpose?',
              html: 'A store is no longer fit for purpose if it has reached the end of its design life and may be at risk of leaks or failure.'
            }
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select what you are applying for'
            }
          ],
          answers: [
            {
              key: 'applying-for-A1',
              value:
                'Building a new store, replacing or expanding an existing store',
              hint: {
                text: 'This includes adding a cover to the new or existing store'
              }
            },
            {
              key: 'applying-for-A2',
              value: 'An impermeable cover only',
              hint: {
                text: 'To apply for a cover, you must have an existing store or stores that are fit for purpose'
              },
              redirectUrl: 'fit-for-purpose'
            },
            {
              value: 'divider'
            },
            {
              key: 'applying-for-A3',
              value: 'None of the above',
              notEligible: true
            }
          ],
          yarKey: 'applyingFor'
        },
        {
          key: 'fit-for-purpose',
          order: 120,
          title: 'Is the existing store you want to cover fit for purpose?',
          hint: {
            text: 'Your existing store must be signed off by a structural engineer at full application.'
          },
          pageTitle: '',
          url: 'fit-for-purpose',
          baseUrl: 'fit-for-purpose',
          backUrlObject: {
            dependentQuestionYarKey: 'applyingFor',
            dependentAnswerKeysArray: ['applying-for-A2'],
            urlOptions: {
              thenUrl: 'applying-for',
              elseUrl: 'existing-cover'
            }
          },
          nextUrl: 'estimated-grant',
          preValidationKeys: ['applyingFor'],
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [
                  {
                    para: 'To cover an existing store, you must confirm at full application that the store is structurally suitable to cover and meet regulations and build standards.',
                    items: [
                    ],
                    additionalPara: ''
                  }
                ]
              }
            ],
            details: {
              summaryText: 'When is a store no longer fit for purpose?',
              html: 'A store is no longer fit for purpose if it has reached the end of its design life and may be at risk of leaks or failure.'
            }
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error:
                'Select if your existing store you want to cover is fit for purpose'
            }
          ],
          answers: [
            {
              key: 'fit-for-purpose-A1',
              value: 'Yes'
            },
            {
              key: 'fit-for-purpose-A2',
              value: 'No',
              redirectUrl: 'fit-for-purpose-conditional'
            }
          ],
          yarKey: 'fitForPurpose'
        },
        {
          key: 'fit-for-purpose-conditional',
          order: 145,
          url: 'fit-for-purpose-conditional',
          backUrl: 'fit-for-purpose',
          nextUrlObject: {
            dependentQuestionYarKey: 'applyingFor',
            dependentAnswerKeysArray: ['applying-for-A1'],
            urlOptions: {
              thenUrl: 'estimated-grant',
              elseUrl: 'project-type'
            }
          },
          maybeEligible: true,
          preValidationKeys: ['fitForPurpose'],
          maybeEligibleContent: {
            isImpermeableCoverOnly: false,
            messageHeader:
              'You may be able to apply for a grant from this scheme',
            messageContent: '',
            warning: {
              text: 'To apply for a cover, your existing store must be signed off as fit for purpose by a structural engineer at full application.',
              iconFallbackText: 'Warning'
            },
            extraMessageContent: '<p>You can continue to check your eligibility for grant funding to build a new store, or expand or replace an existing store.</p>',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you might be eligible for.'
            }
          },
          yarKey: 'FitForPurposeCondition'
        },
        {
          key: 'project-type',
          order: 140,
          title: 'How will you increase your storage capacity?',
          baseUrl: 'project-type',
          backUrlObject: {
            dependentQuestionYarKey: 'applyingFor',
            dependentAnswerKeysArray: ['applying-for-A1'],
            urlOptions: {
              thenUrl: 'applying-for',
              elseUrl: 'fit-for-purpose-conditional'
            }
          },
          nextUrl: 'grant-funded-cover',
          url: 'project-type',
          preValidationKeys: ['applyingFor'],
          ineligibleContent: {
            messageContent: `
            This grant is only for: <br> 
            <ul class="govuk-list govuk-list--bullet">
              <li>replacing an existing store that is no longer fit for purpose</li>
              <li>adding a new store to increase existing capacity</li>
              <li>expanding an existing store (for example, by adding an extra ring to a steel tank)</li>
              <li>adding an impermeable cover to an existing store to increase storage capacity</li>
            </ul>
            `,
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [
                  {
                    para: 'This grant is only for:',
                    items: [
                      'replacing an existing store that is no longer fit for purpose with a new store',
                      'adding a new store to increase existing capacity',
                      'expanding an existing store (for example, by adding an extra ring to a steel tank)',
                      'adding an impermeable cover to an existing store to increase storage capacity'
                    ],
                    additionalPara: ''
                  }
                ]
              }
            ],
            details: {
              summaryText: 'When is a store no longer fit for purpose?',
              html: 'A store is no longer fit for purpose if it has reached the end of its design life and may be at risk of leaks or failure.'
            }
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select how you will increase your storage capacity'
            }
          ],
          answers: [
            {
              key: 'project-type-A1',
              value: 'Replace an existing store that is no longer fit for purpose with a new store'
            },
            {
              key: 'project-type-A2',
              value: 'Add a new store to increase existing capacity'
            },
            {
              key: 'project-type-A3',
              value: 'Expand an existing store'
            },
            {
              value: 'divider'
            },
            {
              key: 'project-type-A4',
              value: 'None of the above',
              notEligible: true
            }
          ],
          yarKey: 'projectType'
        },
        {
          key: 'grant-funded-cover',
          order: 160,
          title: 'Will the grant-funded store have an impermeable cover?',
          baseUrl: 'grant-funded-cover',
          backUrl: 'project-type',
          nextUrl: 'estimated-grant',
          url: 'grant-funded-cover',
          preValidationKeys: ['projectType'],
          ineligibleContent: {
            messageContent:
              'Grant-funded stores must have an impermeable cover unless the slurry is treated with acidification.',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you might be eligible for.'
            }
          },
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [
                  {
                    para: `
                Grant-funded stores must have an impermeable cover unless the slurry is treated with acidification.
                Slurry acidification systems are not eligible for funding through this grant.`,
                    items: []
                  }
                ]
              }
            ],
            details: {
              summaryText: 'What is acidification?',
              html: 'Acidification is the use of acid treatment to lower the pH value of slurry to stabilise ammonia emissions.'
            }
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select impermeable cover option'
            }
          ],
          answers: [
            {
              key: 'grant-funded-cover-A1',
              value: 'Yes, I need a cover'
            },
            {
              key: 'grant-funded-cover-A2',
              value: 'Yes, I already have a cover'
            },
            {
              key: 'grant-funded-cover-A3',
              value: 'Not needed, the slurry is treated with acidification'
            },
            {
              value: 'divider'
            },
            {
              key: 'grant-funded-cover-A4',
              value: 'None of the above',
              notEligible: true
            }
          ],
          yarKey: 'grantFundedCover'
        },
        {
          key: 'existing-cover',
          order: 170,
          title: 'Do you want to apply for a cover for existing stores?',
          baseUrl: 'existing-cover',
          backUrl: 'grant-funded-cover',
          nextUrl: 'fit-for-purpose',
          url: 'existing-cover',
          preValidationKeys: ['grantFundedCover'],
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [
                  {
                    para: 'You can use the grant to cover an existing store to help increase your total storage capacity to 6 months.',
                    items: []
                  }
                ]
              }
            ],
            details: {
              summaryText: 'When is a store no longer fit for purpose?',
              html: 'A store is no longer fit for purpose if it has reached the end of its design life and may be at risk of leaks or failure.'
            }
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select if you need a cover for existing stores'
            }
          ],
          answers: [
            {
              key: 'existing-cover-A1',
              value: 'Yes'
            },
            {
              key: 'existing-cover-A2',
              value: 'No',
              redirectUrl: 'estimated-grant'
            }
          ],
          yarKey: 'existingCover'
        },
        {
          key: 'existing-cover-pig',
          order: 175,
          title: 'Do you want to apply for a cover for existing stores?',
          baseUrl: 'existing-cover-pig',
          backUrl: 'grant-funded-cover',
          nextUrl: 'fit-for-purpose',
          url: 'existing-cover-pig',
          preValidationKeys: ['grantFundedCover'],
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [
                  {
                    para: `
                You can use the grant to cover an existing store to help increase your total storage capacity to 8 months.`,
                    items: []
                  }
                ]
              }
            ],
            details: {
              summaryText: 'When is a store no longer fit for purpose?',
              html: 'A store is no longer fit for purpose if it has reached the end of its design life and may be at risk of leaks or failure.'
            }
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select if you need a cover for existing stores'
            }
          ],
          answers: [
            {
              key: 'existing-cover-pig-A1',
              value: 'Yes'
            },
            {
              key: 'existing-cover-pig-A2',
              value: 'No',
              redirectUrl: 'estimated-grant'
            }
          ],
          yarKey: 'existingCover'
        },
        {
          key: 'estimated-grant',
          order: 180,
          url: 'estimated-grant',
          backUrlObject: {
            dependentQuestionYarKey: 'fitForPurpose',
            dependentAnswerKeysArray: ['fit-for-purpose-A1'],
            urlOptions: {
              thenUrl: 'fit-for-purpose',
              elseUrl: 'fit-for-purpose-conditional',
              nonDependentUrl: 'existing-cover'
            }
          },
          nextUrl: 'reference-cost',
          ga: { name: 'eligibility_passed', params: {} },
          preValidationKeys: ['applyingFor'],
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Estimate how much grant you could get',
            messageContent:
              'Add some information about the project (for example, type of store and capacity, type of cover and size, approximate size and quantity of other items you need) so we can estimate how much grant you could get.'
          },
          yarKey: 'estimatedGrant'
        },
        // Calls reference cost page
        {
          key: 'storage-type',
          order: 130,
          costDataType: 'cat-storage',
          title: 'What type of store do you want?',
          baseUrl: 'storage-type',
          backUrl: 'reference-cost',
          id: 'storageType',
          nextUrlObject: {
            dependentQuestionYarKey: 'projectType',
            dependentAnswerKeysArray: ['project-type-A1'],
            urlOptions: {
              thenUrl: 'capacity-increase-replace',
              elseUrl: 'capacity-increase-additional',
              nonDependentUrl: 'existing-cover-type'
            }
          },
          url: 'storage-type',
          hint: {
            text: 'Select one option'
          },
          preValidationKeys: ['referenceCostObject'],
          type: 'single-answer',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Please select an option'
            }
          ],
          answers: [],
          yarKey: 'storageType'
        },
        {
          key: 'capacity-increase-replace',
          order: 131,
          title: '',
          pageTitle: '',
          url: 'capacity-increase-replace',
          baseUrl: 'capacity-increase-replace',
          backUrl: 'storage-type',
          nextUrl: 'cover-type',
          fundingPriorities: '',
          preValidationKeys: ['storageType'],
          classes: 'govuk-input--width-10',
          id: 'storageCapacityIncrease',
          name: 'storageCapacityIncrease',
          suffix: { text: 'm³' },
          type: 'input',
          inputmode: 'numeric',
          pattern: '[0-9]*',
          id: 'serviceCapacityIncrease',
          label: {
            text: 'What estimated volume do you need to have 6 months’ storage?',
            classes: 'govuk-label--l',
            isPageHeading: true,
            for: 'serviceCapacityIncrease'
          },
          hint: {
            html: `
            Use <a class="govuk-link" target="_blank" href="https://ahdb.org.uk/knowledge-library/slurry-wizard" rel="noopener noreferrer">Slurry Wizard (opens in a new tab)</a> to help you calculate the difference between your current storage and 6 months’ storage, based on current animal numbers </br></br>
            Enter estimated volume in cubic metres
          `
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error:
                'Enter the volume you need to have 6 months’ storage'
            },
            {
              type: 'REGEX',
              regex: INTERGERS_AND_DECIMALS,
              error: 'Volume must be a whole number'
            },
            {
              type: 'INCLUDES',
              checkArray: ['.'],
              error: 'Volume must be a whole number'
            },
            {
              type: 'MIN_MAX',
              min: 1,
              max: 9999999999,
              error: 'Volume must be between 1-9999999999'
            }
          ],
          sidebar: {
            mainHeading: 'Your project items',
            values: [
              {
                heading: 'Grant-funded store',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              }
            ],
            dependentQuestionKeys: ['storageType']
          },
          warning: {
            html: 'This grant is to get your storage levels to 6 months. You cannot apply for the grant if you already have 6 months\' storage that is fit for purpose.',
            iconFallbackText: 'Warning'
          },
          yarKey: 'serviceCapacityIncrease'
        },
        {
          key: 'capacity-increase-additional',
          order: 132,
          title: '',
          pageTitle: '',
          classes: 'govuk-input--width-10',
          url: 'capacity-increase-additional',
          baseUrl: 'capacity-increase-additional',
          backUrl: 'storage-type',
          nextUrl: 'cover-type',
          preValidationKeys: ['storageType'],
          suffix: { text: 'm³' },
          type: 'input',
          inputmode: 'numeric',
          pattern: '[0-9]*',
          id: 'serviceCapacityIncrease',
          label: {
            text: 'What estimated additional volume do you need to have 6 months’ storage?',
            classes: 'govuk-label--l',
            isPageHeading: true,
            for: 'serviceCapacityIncrease'
          },
          hint: {
            html: `
            Use <a class="govuk-link" target="_blank" href="https://ahdb.org.uk/knowledge-library/slurry-wizard" rel="noopener noreferrer">Slurry Wizard (opens in a new tab)</a> to help you calculate the difference between your current storage and 6 months’ storage, based on current animal numbers </br></br>
            Enter estimated volume in cubic metres
          `
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error:
                'Enter the volume you need to have 6 months’ storage'
            },
            {
              type: 'REGEX',
              regex: INTERGERS_AND_DECIMALS,
              error: 'Volume must be a whole number'
            },
            {
              type: 'INCLUDES',
              checkArray: ['.'],
              error: 'Volume must be a whole number'
            },
            {
              type: 'MIN_MAX',
              min: 1,
              max: 9999999999,
              error: 'Volume must be between 1-9999999999'
            }
          ],
          sidebar: {
            mainHeading: 'Your project items',
            values: [
              {
                heading: 'Grant-funded store',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              }
            ],
            dependentQuestionKeys: ['storageType']
          },
          warning: {
            html: `This grant is to get your storage levels to 6 months. For example, if you have 4 months’  storage, we will fund another 2 months. </br></br>
            You cannot apply for the grant if you already have 6 months' storage that is fit for purpose`,
            iconFallbackText: 'Warning'
          },
          yarKey: 'serviceCapacityIncrease'
        },
        {
          key: 'pig-capacity-increase-replace',
          order: 133,
          title: '',
          pageTitle: '',
          url: 'pig-capacity-increase-replace',
          baseUrl: 'pig-capacity-increase-replace',
          backUrl: 'storage-type',
          nextUrl: 'cover-type',
          fundingPriorities: '',
          preValidationKeys: ['storageType'],
          classes: 'govuk-input--width-10',
          id: 'storageCapacityIncrease',
          name: 'storageCapacityIncrease',
          suffix: { text: 'm³' },
          type: 'input',
          inputmode: 'numeric',
          pattern: '[0-9]*',
          id: 'serviceCapacityIncrease',
          label: {
            text: 'What estimated volume do you need to have 8 months’ storage?',
            classes: 'govuk-label--l',
            isPageHeading: true,
            for: 'serviceCapacityIncrease'
          },
          hint: {
            html: `
            Use <a class="govuk-link" target="_blank" href="https://ahdb.org.uk/knowledge-library/slurry-wizard" rel="noopener noreferrer">Slurry Wizard (opens in a new tab)</a> to help you calculate the difference between your current storage and 8 months’ storage, based on current animal numbers </br></br>
            Enter estimated volume in cubic metres
          `
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error:
                'Enter the volume you need to have 8 months’ storage'
            },
            {
              type: 'REGEX',
              regex: INTERGERS_AND_DECIMALS,
              error: 'Volume must be a whole number'
            },
            {
              type: 'INCLUDES',
              checkArray: ['.'],
              error: 'Volume must be a whole number'
            },
            {
              type: 'MIN_MAX',
              min: 1,
              max: 9999999999,
              error: 'Volume must be between 1-9999999999'
            }
          ],
          sidebar: {
            mainHeading: 'Your project items',
            values: [
              {
                heading: 'Grant-funded store',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              }
            ],
            dependentQuestionKeys: ['storageType']
          },
          warning: {
            html: 'This grant is to get your storage levels to 8 months. You cannot apply for the grant if you already have 8 months\' storage that is fit for purpose',
            iconFallbackText: 'Warning'
          },
          yarKey: 'serviceCapacityIncrease'
        },
        {
          key: 'pig-capacity-increase-additional',
          order: 134,
          title: '',
          pageTitle: '',
          classes: 'govuk-input--width-10',
          url: 'pig-capacity-increase-additional',
          baseUrl: 'pig-capacity-increase-additional',
          backUrl: 'storage-type',
          nextUrl: 'cover-type',
          preValidationKeys: ['storageType'],
          suffix: { text: 'm³' },
          type: 'input',
          inputmode: 'numeric',
          pattern: '[0-9]*',
          id: 'serviceCapacityIncrease',
          label: {
            text: 'What estimated additional volume do you need to have 8 months’ storage?',
            classes: 'govuk-label--l',
            isPageHeading: true,
            for: 'serviceCapacityIncrease'
          },
          hint: {
            html: `
            Use <a class="govuk-link" target="_blank" href="https://ahdb.org.uk/knowledge-library/slurry-wizard" rel="noopener noreferrer">Slurry Wizard (opens in new tab)</a> to help you calculate the difference between your current storage and 8 months’ storage, based on current animal numbers </br></br>
            Enter estimated volume in cubic metres
          `
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error:
                'Enter the volume you need to have 8 months’ storage'
            },
            {
              type: 'REGEX',
              regex: INTERGERS_AND_DECIMALS,
              error: 'Volume must be a whole number'
            },
            {
              type: 'INCLUDES',
              checkArray: ['.'],
              error: 'Volume must be a whole number'
            },
            {
              type: 'MIN_MAX',
              min: 1,
              max: 9999999999,
              error: 'Volume must be between 1-9999999999'
            }
          ],
          sidebar: {
            mainHeading: 'Your project items',
            values: [
              {
                heading: 'Grant-funded store',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              }
            ],
            dependentQuestionKeys: ['storageType']
          },
          warning: {
            html: `This grant is to get your storage levels to 8 months. For example, if you have 6 months’  storage, we will fund another 2 months.</br></br>
            You cannot apply for the grant if you already have 8 months' storage that is fit for purpose`,
            iconFallbackText: 'Warning'
          },
          yarKey: 'serviceCapacityIncrease'
        },
        {
          key: 'cover-type',
          order: 135,
          costDataType: 'cat-cover-type',
          title: 'What type of cover will you have on your grant-funded store?',
          baseUrl: 'cover-type',
          nextUrlObject: {
            dependentQuestionYarKey: 'existingCover',
            dependentAnswerKeysArray: ['existing-cover-A1'],
            urlOptions: {
              thenUrl: 'existing-cover-type',
              elseUrl: 'cover-size',
              nonDependentUrl: 'cover-size'
            }
          },
          backUrlObject: {
            dependentQuestionYarKey: 'projectType',
            dependentAnswerKeysArray: ['project-type-A1'],
            urlOptions: {
              thenUrl: 'capacity-increase-replace',
              elseUrl: 'capacity-increase-additional'
            }
          },
          url: 'cover-type',
          preValidationKeys: ['referenceCostObject'],
          hint: {
            text: 'Select one option'
          },
          type: 'single-answer',
          sidebar: {
            mainHeading: 'Your project items',
            values: [
              {
                heading: 'Grant-funded store',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              }
            ],
            prefixSufix: [
              {
                linkedPrefix: 'Increase: ',
                linkedSufix: 'm³'
              }
            ],
            linkedQuestionyarkey: ['serviceCapacityIncrease'],
            dependentQuestionKeys: ['storageType']
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select what type of cover your grant-funded store will have'
            }
          ],
          hintArray: [
            'Taut skin made from flexible or pliant sheet material such as reinforced plastic sheeting or strong canvas',
            'Flexible plastic sheet covers with some form of flotation or fixing to store sides to prevent movement'
          ],
          answers: [],
          yarKey: 'coverType'
        },
        {
          key: 'existing-cover-type',
          order: 136,
          costDataType: 'cat-cover-type',
          title: 'What type of cover will you have on your existing store?',
          hint: {
            text: 'Select one option'
          },
          url: 'existing-cover-type',
          baseUrl: 'existing-cover-type',
          nextUrlObject: {
            dependentQuestionYarKey: 'coverType',
            dependentAnswerKeysArray: ['cover-type-A1'],
            urlOptions: {
              thenUrl: 'existing-grant-funded-cover-size',
              elseUrl: 'existing-grant-funded-cover-size',
              nonDependentUrl: 'existing-cover-size'
            }
          },
          backUrl: 'cover-type',
          preValidationKeys: ['referenceCostObject'],
          sidebar: {
            showSidebar: true,
            mainHeading: 'Your project items',
            values: [
              {
                heading: 'Grant-funded store',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              },
              {
                heading: 'Grant-funded store cover',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              }
            ],
            prefixSufix: [
              {
                linkedPrefix: 'Increase: ',
                linkedSufix: 'm³'
              }
            ],
            linkedQuestionyarkey: ['serviceCapacityIncrease'],
            dependentQuestionKeys: ['storageType', 'coverType']
          },
          type: 'single-answer',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select what type of cover your existing store will have'
            }
          ],
          hintArray: [
            'Taut skin made from flexible or pliant sheet material such as reinforced plastic sheeting or strong canvas',
            'Flexible plastic sheet covers with some form of flotation or fixing to store sides to prevent movement'
          ],
          answers: [],
          yarKey: 'existingCoverType'
        },
        {
          key: 'cover-size',
          order: 137,
          title: '',
          pageTitle: '',
          classes: 'govuk-input--width-5',
          url: 'cover-size',
          baseUrl: 'cover-size',
          backUrl: 'cover-type',
          nextUrl: 'separator',
          preValidationKeys: ['coverType'],
          suffix: { text: 'm²' },
          type: 'input',
          inputmode: 'numeric',
          pattern: '[0-9]*',
          label: {
            text: 'How big will the cover be?',
            classes: 'govuk-label--l',
            isPageHeading: true
          },
          hint: {
            html: `
            Enter the estimated surface area of the replacement, new or expanded store
            <br/><br/>
            Enter size in metres squared
            <br/><br/>
            <p class="govuk-body"><b>Grant-funded store</b></p>

          `
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter how big the grant-funded store cover will be'
            },
            {
              type: 'REGEX',
              regex: INTERGERS_AND_DECIMALS,
              error: 'Cover size must only include numbers'
            },
            {
              type: 'INCLUDES',
              checkArray: ['.'],
              error: 'Cover size must be a whole number'
            },
            {
              type: 'MIN_MAX',
              min: 1,
              max: 999999,
              error: 'Cover size must be between 1-999999'
            }
          ],
          sidebar: {
            mainHeading: 'Your project items',
            values: [
              {
                heading: 'Grant-funded store',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              },
              {
                heading: 'Grant-funded store cover',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              }
            ],
            prefixSufix: [
              {
                linkedPrefix: 'Increase: ',
                linkedSufix: 'm³'
              }
            ],
            linkedQuestionyarkey: ['serviceCapacityIncrease'],
            dependentQuestionKeys: ['storageType', 'coverType']
          },
          yarKey: 'coverSize'
        },
        {
          key: 'existing-cover-size',
          order: 138,
          title: 'existing-cover-size',
          pageTitle: 'existing-cover-size',
          classes: 'govuk-input--width-5',
          url: 'existing-cover-size',
          baseUrl: 'existing-cover-size',
          backUrl: 'existing-cover-type',
          nextUrl: 'separator',
          preValidationKeys: ['existingCoverType'],
          suffix: { text: 'm²' },
          type: 'input',
          inputmode: 'numeric',
          pattern: '[0-9]*',
          label: {
            text: 'How big will the cover be?',
            classes: 'govuk-label--l',
            isPageHeading: true
          },
          hint: {
            html: `
            Enter the estimated cover surface area of the existing store
            <br/><br/>
            Enter size in metres squared
            <br/><br/>
            <p class='govuk-body'><b>Existing store</b></p>
          `
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter how big the existing store cover will be'
            },
            {
              type: 'REGEX',
              regex: INTERGERS_AND_DECIMALS,
              error: 'Cover size must only include numbers'
            },
            {
              type: 'INCLUDES',
              checkArray: ['.'],
              error: 'Cover size must be a whole number'
            },
            {
              type: 'MIN_MAX',
              min: 1,
              max: 999999,
              error: 'Cover size must be between 1-999999'
            }
          ],
          sidebar: {
            mainHeading: 'Your project items',
            values: [
              {
                heading: 'Grant-funded store',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              },
              {
                heading: 'Existing store cover',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              }
            ],
            prefixSufix: [
              {
                linkedPrefix: 'Increase: ',
                linkedSufix: 'm³'
              }
            ],
            linkedQuestionyarkey: ['serviceCapacityIncrease'],
            dependentQuestionKeys: ['storageType', 'existingCoverType']
          },
          yarKey: 'existingCoverSize'
        },
        {
          key: 'existing-grant-funded-cover-size',
          order: 139,
          title: 'How big will the covers be?',
          pageTitle: 'How big will the covers be?',
          classes: 'govuk-input--width-5',
          url: 'existing-grant-funded-cover-size',
          baseUrl: 'existing-grant-funded-cover-size',
          backUrl: 'existing-cover-type',
          nextUrl: 'separator',
          preValidationKeys: ['existingCoverType'],
          type: 'multi-input',
          hint: {
            html: `
            Enter the estimated cover surface area of the grant-funded store and the existing store
            <br/><br/>
            Enter size in metres squared
          `
          },
          allFields: [
            {
              yarKey: 'coverSize',
              type: 'number',
              classes: 'govuk-input--width-5',
              label: {
                html: '<p class="govuk-body"><b>Grant-funded store</b></p>',
                classes: 'govuk-label'
              },
              suffix: {
                text: 'm²'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter how big the grant-funded store cover will be'
                },
                {
                  type: 'REGEX',
                  regex: INTERGERS_AND_DECIMALS,
                  error: 'Cover size must only include numbers'
                },
                {
                  type: 'INCLUDES',
                  checkArray: ['.'],
                  error: 'Cover size must be a whole number'
                },
                {
                  type: 'MIN_MAX',
                  min: 1,
                  max: 999999,
                  error: 'Volume must be between 1-999999'
                }
              ]
            },
            {
              yarKey: 'existingCoverSize',
              type: 'number',
              classes: 'govuk-input--width-5',
              label: {
                html: '<p class="govuk-body"><b>Existing store</b><p>',
                classes: 'govuk-label'
              },
              suffix: {
                text: 'm²'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter how big the existing store cover will be'
                },
                {
                  type: 'REGEX',
                  regex: INTERGERS_AND_DECIMALS,
                  error: 'Cover size must only include numbers'
                },
                {
                  type: 'INCLUDES',
                  checkArray: ['.'],
                  error: 'Cover size must be a whole number'
                },
                {
                  type: 'MIN_MAX',
                  min: 1,
                  max: 999999,
                  error: 'Volume must be between 1-999999'
                }
              ]
            }
          ],
          sidebar: {
            mainHeading: 'Your project items',
            values: [
              {
                heading: 'Grant-funded Store',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              },
              {
                heading: 'Grant-funded store cover',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              },
              {
                heading: 'Existing store cover',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              }
            ],
            prefixSufix: [
              {
                linkedPrefix: 'Increase: ',
                linkedSufix: 'm³'
              }
            ],
            linkedQuestionyarkey: ['serviceCapacityIncrease'],
            dependentQuestionKeys: ['storageType', 'coverType', 'existingCoverType']
          },
          yarKey: 'existingGrantFundedCoverSize'
        },
        {
          key: 'separator',
          order: 140,
          title: 'Do you want to add a slurry separator to your project?',
          pageTitle: '',
          backUrl: 'pig-existing-storage-capacity',
          nextUrl: 'separator-type',
          url: 'separator',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          hint: {
            text: 'Slurry separators use a mechanical process to divide slurry into a liquid and stackable material. These fractions can be kept in separate stores and applied at different times to your land'
          },
          baseUrl: 'separator',
          preValidationKeys: ['referenceCostObject'],
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            mainHeading: 'Your project items',
            values: [
              {
                heading: 'Grant-funded store',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              },
              {
                heading: 'Grant-funded store cover',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              },
              {
                heading: 'Existing store cover',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              }
            ],
            prefixSufix: [
              {
                linkedPrefix: 'Increase: ',
                linkedSufix: 'm³'
              },
              {
                linkedPrefix: 'Size: ',
                linkedSufix: 'm²'
              },
              {
                linkedPrefix: 'Size: ',
                linkedSufix: 'm²'
              }
            ],
            linkedQuestionyarkey: ['serviceCapacityIncrease', 'coverSize', 'existingCoverSize'],
            dependentQuestionKeys: ['storageType', 'coverType', 'existingCoverType']
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error:
                'Select if you want to add a slurry separator to your project'
            }
          ],
          answers: [
            {
              key: 'separator-A1',
              value: 'Yes'
            },
            {
              key: 'separator-A2',
              value: 'No',
              redirectUrl: 'other-items'
            }
          ],
          yarKey: 'separator'
        },
        {
          key: 'separator-type',
          costDataType: 'cat-separator',
          order: 141,
          pageTitle: '',
          title: 'What type of slurry separator will you have?',
          hint: {
            text: 'Capable to processing at least 3m³ of slurry per hour and producing at least 25% dry matter. '
          },
          url: 'separator-type',
          baseUrl: 'separator-type',
          backUrl: 'separator',
          nextUrl: 'gantry',
          preValidationKeys: ['separator'],
          type: 'single-answer',
          minAnswerCount: 1,
          fundingPriorities: '',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select what type of slurry separator you will have'
            }
          ],
          answers: [],
          sidebar: {
            mainHeading: 'Your project items',
            values: [
              {
                heading: 'Grant-funded store',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              },
              {
                heading: 'Grant-funded store cover',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              },
              {
                heading: 'Existing store cover',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              }
            ],
            prefixSufix: [
              {
                linkedPrefix: 'Increase: ',
                linkedSufix: 'm³'
              },
              {
                linkedPrefix: 'Size: ',
                linkedSufix: 'm²'
              },
              {
                linkedPrefix: 'Size: ',
                linkedSufix: 'm²'
              }
            ],
            linkedQuestionyarkey: ['serviceCapacityIncrease', 'coverSize', 'existingCoverSize'],
            dependentQuestionKeys: ['storageType', 'coverType', 'existingCoverType']
          },
          yarKey: 'separatorType'
        },
        {
          key: 'gantry',
          costDataType: 'cat-separator',
          order: 142,
          title: 'Do you want to add a gantry?',
          hint: null,
          pageTitle: '',
          baseUrl: 'gantry',
          url: 'gantry',
          backUrl: 'separator-type',
          nextUrl: 'short-term-storage',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          preValidationKeys: ['separatorType'],
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            mainHeading: 'Your project items',
            values: [
              {
                heading: 'Grant-funded store',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              },
              {
                heading: 'Grant-funded store cover',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              },
              {
                heading: 'Existing store cover',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              },
              {
                heading: 'Separator',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              }
            ],
            prefixSufix: [
              {
                linkedPrefix: 'Increase: ',
                linkedSufix: 'm³'
              },
              {
                linkedPrefix: 'Size: ',
                linkedSufix: 'm²'
              },
              {
                linkedPrefix: 'Size: ',
                linkedSufix: 'm²'
              }
            ],
            linkedQuestionyarkey: ['serviceCapacityIncrease', 'coverSize', 'existingCoverSize'],
            dependentQuestionKeys: ['storageType', 'coverType', 'existingCoverType', 'separatorOptions']
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error:
                'Select if you want to add a gantry'
            }
          ],
          answers: [
            {
              key: 'gantry-A1',
              value: 'Yes'
            },
            {
              key: 'gantry-A2',
              value: 'No'
            }
          ],
          yarKey: 'gantry'
        },
        {
          key: 'short-term-storage',
          order: 143,
          costDataType: 'cat-separator',
          title: 'What type of short-term storage do you want for the stackable material from the separator?',
          hint: {
            text: 'You must stack your stackable materials on an impermeable surface to prevent leaking into the soil.'
          },
          pageTitle: '',
          baseUrl: 'short-term-storage',
          url: 'short-term-storage',
          backUrl: 'gantry',
          nextUrl: 'other-items',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select what type of short-term storage you will have for the stackable material from the separator'
            },
            {
              dependentKey: 'concreteBunkerSize',
              type: 'NOT_EMPTY',
              error: 'Enter concrete bunker size'
            },
            {
              dependentKey: 'concreteBunkerSize',
              type: 'REGEX',
              regex: WHOLE_NUMBER_REGEX,
              error: 'Size must be a whole number'
            },
            {
              type: 'MIN_MAX',
              min: 1,
              max: 99999,
              error: 'Size must be between 1-99999',
              dependentKey: 'concreteBunkerSize'
            }

          ],
          preValidationKeys: ['gantry'],
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          answers: [
            {
              value: 'divider'
            },
            {
              key: 'short-term-storage-A3',
              value: 'I already have short-term storage'
            }
          ],
          sidebar: {
            mainHeading: 'Your project items',
            values: [
              {
                heading: 'Grant-funded store',
                content: [
                  {
                    para: '',
                    items: []
                  }
                ]
              },
              {
                heading: 'Grant-funded store cover',
                content: [
                  {
                    para: '',
                    items: []
                  }
                ]
              },
              {
                heading: 'Existing store cover',
                content: [
                  {
                    para: '',
                    items: []
                  }
                ]
              },
              {
                heading: 'Separator',
                content: [
                  {
                    para: '',
                    items: []
                  }
                ]
              }
            ],
            prefixSufix: [
              {
                linkedPrefix: 'Increase: ',
                linkedSufix: 'm³'
              },
              {
                linkedPrefix: 'Size: ',
                linkedSufix: 'm²'
              },
              {
                linkedPrefix: 'Size: ',
                linkedSufix: 'm²'
              },
              {
                linkedPrefix: 'Size: ',
                linkedSufix: 'm²'
              }
            ],
            linkedQuestionyarkey: ['serviceCapacityIncrease', 'coverSize', 'existingCoverSize'],
            dependentQuestionKeys: ['storageType', 'coverType', 'existingCoverType', 'separatorOptions']
          },
          yarKey: 'solidFractionStorage',
          conditionalKey: 'concreteBunkerSize',
          conditionalLabelData: 'Enter size'
        },
        {
          key: 'other-items',
          order: 146,
          costDataType: 'other',
          title: 'What other items do you need?',
          baseUrl: 'other-items',
          backUrlObject: {
            dependentQuestionYarKey: 'separator',
            dependentAnswerKeysArray: ['separator-A1'],
            urlOptions: {
              thenUrl: 'short-term-storage',
              elseUrl: 'separator'
            }
          },
          nextUrl: 'item-sizes-quantities',
          hint: {
            text: 'Select all the items your project needs'
          },
          url: 'other-items',
          preValidationKeys: ['separator'],
          type: 'multi-answer',
          minAnswerCount: 1,
          sidebar: {
            mainHeading: 'Your project items',
            values: [
              {
                heading: 'Grant-funded store',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              },
              {
                heading: 'Grant-funded store cover',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              },
              {
                heading: 'Existing store cover',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              },
              {
                heading: 'Separator',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              }
            ],
            prefixSufix: [
              {
                linkedPrefix: 'Increase: ',
                linkedSufix: 'm³'
              },
              {
                linkedPrefix: 'Size: ',
                linkedSufix: 'm²'
              },
              {
                linkedPrefix: 'Size: ',
                linkedSufix: 'm²'
              },
              {
                linkedPrefix: 'Size: ',
                linkedSufix: 'm²'
              }
            ],
            linkedQuestionyarkey: [
              'serviceCapacityIncrease',
              'coverSize',
              'existingCoverSize'
            ],
            dependentQuestionKeys: ['storageType', 'coverType', 'existingCoverType', 'separatorOptions']
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select what other items you need'
            },
            {
              type: 'STANDALONE_ANSWER',
              error: 'You cannot select that combination of options',
              standaloneObject: {
                questionKey: 'other-items',
                answerKey: 'other-items-A15'
              }
            }
          ],
          answers: [
            {
              value: 'divider'
            },
            {
              key: 'other-items-A15',
              value: 'None of the above',
              redirectUrl: 'project-summary'
            }
          ],
          yarKey: 'otherItems'
        },
        {
          key: 'item-sizes-quantities',
          order: 147,
          costDataKey: 'other',
          title: 'Item sizes and quantities',
          hint: {
            html: 'Enter the approximate size and quantities your project needs'
          },
          baseUrl: 'item-sizes-quantities',
          backUrl: 'other-items',
          nextUrl: 'project-summary',
          url: 'item-sizes-quantities',
          preValidationKeys: ['otherItems'],
          type: 'multi-input',
          sidebar: {
            mainHeading: 'Your project items',
            values: [
              {
                heading: 'Grant-funded store',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              },
              {
                heading: 'Grant-funded store cover',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              },
              {
                heading: 'Existing store cover',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              },
              {
                heading: 'Separator',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              },
              {
                heading: 'Other items',
                content: [
                  {
                    para: '',
                    items: [],
                    dependentAnswerExceptThese: []
                  }
                ]
              }
            ],
            prefixSufix: [
              {
                linkedPrefix: 'Increase: ',
                linkedSufix: 'm³'
              },
              {
                linkedPrefix: 'Size: ',
                linkedSufix: 'm²'
              },
              {
                linkedPrefix: 'Size: ',
                linkedSufix: 'm²'
              },
              {
                linkedPrefix: 'Size: ',
                linkedSufix: 'm²'
              }
            ],
            linkedQuestionyarkey: [
              'serviceCapacityIncrease',
              'coverSize',
              'existingCoverSize'
            ],
            dependentQuestionKeys: [
              'storageType',
              'coverType',
              'existingCoverType',
              'separatorOptions',
              'otherItems'
            ]
          },
          allFields: [],
          yarKey: 'itemSizeQuantities'
        },
        // CALLS PROJECT SUMMARY
        {
          key: 'potential-amount',
          order: 150,
          url: 'potential-amount',
          baseUrl: 'potential-amount',
          backUrl: 'project-summary',
          nextUrl: 'remaining-costs',
          preValidationKeys: ['referenceCostCalculated'],
          grantInfo: {
            minGrant: 25000,
            maxGrant: 250000,
            grantPercentage: '',
            cappedGrant: true
          },
          ineligibleContent: {
            messageContent: 'The minimum grant you can claim is £25,000.',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Potential grant funding',
            messageContent:
              'Based on the reference cost for each item and the approximate size and quantities you entered, we estimate you could be eligible for a grant of £{{_calculatedGrant_}}',
            warning: {
              text: 'There’s no guarantee the project will receive a grant.',
              iconFallbackText: 'Warning'
            },
            conditionalText: {
              condition: false,
              dependantYarKey: 'concreteBunkerSize',
              validationType: 'MIN_MAX',
              details: {
                min: 1,
                max: 100
              },
              conditionalPara: 'The grant contribution for the concrete bunker is capped at £{{_cappedAmount_}}'
            }
          }
        },
        {
          key: 'remaining-costs',
          order: 190,
          title: 'Can you pay the remaining costs?',
          pageTitle: '',
          url: 'remaining-costs',
          baseUrl: 'remaining-costs',
          backUrl: 'potential-amount',
          nextUrlObject: {
            dependentQuestionYarKey: 'applyingFor',
            dependentAnswerKeysArray: ['applying-for-A2'],
            urlOptions: {
              thenUrl: 'grid-reference',
              elseUrl: 'planning-permission'
            }
          },
          preValidationKeys: ['referenceCostCalculated'],
          ineligibleContent: {
            messageContent: `<p class="govuk-body">You cannot use public money (for example, grant funding from government or local authorities) towards the project costs.</p>
            <div class="govuk-list govuk-list--bullet">
                  You can use:
                  <ul>
                    <li>loans</li>
                    <li>overdrafts</li>
                    <li>the Basic Payment Scheme</li>
                  </ul>
            </div>`,
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          minAnswerCount: 1,
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [
                  {
                    para: `You cannot use public money (for example, grant funding from government or local authorities) towards the project costs.
                  You can use:`,
                    items: ['loans', 'overdrafts', 'the Basic Payment Scheme']
                  }
                ]
              }
            ]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if you can pay the remaining costs'
            }
          ],
          answers: [
            {
              key: 'remaining-costs-A1',
              value: 'Yes'
            },
            {
              key: 'remaining-costs-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'remainingCosts'
        },
        {
          key: 'planning-permission',
          order: 142,
          title: 'Does the project have planning permission?',
          pageTitle: '',
          url: 'planning-permission',
          baseUrl: 'planning-permission',
          backUrl: 'remaining-costs',
          nextUrl: 'planning-permission-evidence',
          preValidationKeys: ['remainingCosts'],
          fundingPriorities: 'Improving Adding Value',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [
                  {
                    para: `You must have secured planning permission before you submit a full application.
                    The application deadline is 27 June 2025.`
                  }
                ]
              }
            ]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select your project planning permission'
            }
          ],
          answers: [
            {
              key: 'planning-permission-A1',
              value: 'Approved'
            },
            {
              key: 'planning-permission-A2',
              value: 'Applied for but not yet approved'
            },
            {
              key: 'planning-permission-A3',
              value:
                'Not yet applied for but expected to be secured before I submit my full application',
              redirectUrl: 'planning-permission-condition'
            }
          ],
          yarKey: 'planningPermission'
        },
        {
          key: 'planning-permission-condition',
          order: 145,
          url: 'planning-permission-condition',
          backUrl: 'planning-permission',
          nextUrl: 'grid-reference',
          maybeEligible: true,
          preValidationKeys: ['planningPermission'],
          maybeEligibleContent: {
            messageHeader:
              'You may be able to apply for a grant from this scheme',
            messageContent:
              'You must have secured planning permission before you submit a full application. The application deadline is 27 June 2025.'
          },
          yarKey: 'PlanningPermissionCondition'
        },
        {
          key: 'planning-permission-evidence',
          order: 150,
          title: 'Your planning permission',
          hint: {
            html: 'Enter the name of your planning authority and your planning reference number'
          },
          url: 'planning-permission-evidence',
          baseUrl: 'planning-permission-evidence',
          backUrl: 'planning-permission',
          nextUrl: 'grid-reference',
          preValidationKeys: ['planningPermission'],
          type: 'multi-input',
          allFields: [
            {
              yarKey: 'planningAuthority',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Planning authority',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter planning authority'
                },
                {
                  type: 'REGEX',
                  regex: NAME_ONLY_REGEX,
                  error:
                    'Planning authority must only contain letters, hyphens and spaces'
                },
                {
                  type: 'REGEX',
                  regex: CHARS_MAX_50,
                  error: 'Planning authority must be 50 characters or fewer'
                }
              ]
            },
            {
              yarKey: 'planningReferenceNumber',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Planning reference number',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter planning reference number'
                },
                {
                  type: 'REGEX',
                  regex: CHARS_MAX_50,
                  error:
                    'Planning reference number must be 50 characters of fewer'
                },
                {
                  type: 'REGEX',
                  regex: PLANNING_REFERENCE_NUMBER_REGEX,
                  error:
                    'Planning reference number must only include letters, numbers and /'
                }
              ]
            }
          ],
          yarKey: 'PlanningPermissionEvidence'
        },
        {
          key: 'grid-reference',
          order: 152,
          url: 'grid-reference',
          backUrl: 'planning-permission-evidence',
          nextUrl: 'planning-permission-summary',
          backUrlObject: {
            dependentQuestionYarKey: 'planningPermission',
            dependentAnswerKeysArray: [
              'planning-permission-A1',
              'planning-permission-A2'
            ],
            urlOptions: {
              thenUrl: 'planning-permission-evidence',
              elseUrl: 'planning-permission-condition',
              nonDependentUrl: 'remaining-costs'
            }
          },
          preValidationKeys: ['remainingCosts'],
          type: 'input',
          classes: 'govuk-input--width-10',
          id: 'gridReference',
          label: {
            text: 'What is the OS grid reference for your slurry store?',
            classes: 'govuk-label--l',
            isPageHeading: true,
            for: 'gridReference'
          },
          hint: {
            html: `
            <div id="gridReference-hint" class="govuk-hint">
              <ol>
                <li>On the <a class="govuk-link" target="_blank" href="https://gridreferencefinder.com/" rel="noopener noreferrer">UK Grid reference finder (opens in a new tab)</a> page, enter the postcode of your location into the postcode box.</li>
                <li>Select 'Go'.</li>
                <li>Find the location of your slurry store on the map. You can select and drag the map to move the location.</li>
                <li>Right-click on the location of your slurry store. This will add your grid reference and location details to a table below the map.</li>
                <li>Scroll down to view your grid reference in the table below the map.</li>
                <li>Select the grid reference (2 letters and 10 numbers) to highlight it, right-click on the grid reference and select 'Copy'.</li>
                <li>Return to the Slurry Infrastructure Grant checker screen.</li>
                <li>Right-click on the OS grid reference number box. Select 'Paste'.</li>
              <ol>
            </div>
            <div>
            Enter in the format of 2 letters and 10 numbers, for example SP 9620733594</br></br>
            <label class='govuk-label' for='gridReference'>OS grid reference number</label>
            </div>
          `
          },
          warning: {
            html: 'You must provide the correct location of your slurry store to avoid delays at full application.',
            iconFallbackText: 'Warning'
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter OS Grid reference'
            },
            {
              type: 'REGEX',
              regex: LETTERS_AND_NUMBERS_REGEX,
              error:
                'First 2 characters should be letter following 10 characters must be numbers'
            },
            {
              type: 'REGEX',
              regex: TWO_LETTERS_TEN_DIGITS,
              error: 'OS Grid Reference must be 2 letters followed by 10 digits'
            },
            {
              type: 'EXCLUDES',
              checkArray: [
                'NT',
                'NU',
                'NX',
                'NY',
                'NZ',
                'OV',
                'SC',
                'SD',
                'SE',
                'SJ',
                'SK',
                'SO',
                'SP',
                'SR',
                'SS',
                'ST',
                'SU',
                'SV',
                'SW',
                'SX',
                'SY',
                'SZ',
                'TA',
                'TF',
                'TG',
                'TL',
                'TM',
                'TQ',
                'TR',
                'TV'
              ],
              error:
                'The OS grid reference number must be a letter combination for England'
            }
          ],
          yarKey: 'gridReference'
        },
        {
          key: 'planning-permission-summary',
          order: 153,
          title: 'Check your answers before getting your results',
          pageTitle: 'planning-permission-summary',
          url: 'planning-permission-summary',
          baseUrl: 'planning-permission-summary',
          backUrl: 'grid-reference',
          nextUrl: 'result-page',
          preValidationKeys: ['gridReference'],
          ineligibleContent: {},
          pageData: {
            planningPermissionLink: 'planning-permission',
            planningPermissionEvidenceLink: 'planning-permission-evidence',
            gridReferenceLink: 'grid-reference'
          },
          fundingPriorities: '',
          type: '',
          minAnswerCount: 1,
          answers: []
        },
        {
          key: 'result-page',
          order: 156,
          title: 'Your results',
          url: 'result-page',
          baseUrl: 'result-page',
          backUrl: 'planning-permission-summary',
          nextUrl: 'business-details',
          preValidationKeys: ['gridReference'],
          ga: { name: 'eligibilities', params: {} },
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Your results',
            messageContent: `Based on your answers, your project is:
            <div class="govuk-inset-text">
              <span class="govuk-heading-m">Eligible to apply</span>
              </div>
              <p class='govuk-body'>
              The RPA wants to fund projects that have a higher environmental benefit. <br/><br/>
              We will do this by prioritising projects in areas that need urgent action 
              to reduce nutrient pollution from agriculture and restore natural habitats.<br/><br/>
              Depending on the number of applications received, we may invite projects 
              outside these areas to submit a full application.</p>`,
            extraMessageContent: `
            <h2 class="govuk-heading-m">Next steps</h2>
            <p class="govuk-body">Next, add your business and contact details and submit them to the RPA (you should only do this once).
            <br/><br/>
            You’ll get an email with your answers and a reference number.</p>`
          },
          answers: []
        },
        /// ////// ***************** After Score  ************************************/////////////////////
        {
          key: 'business-details',
          order: 220,
          title: 'Business details',
          pageTitle: '',
          url: 'business-details',
          baseUrl: 'business-details',
          backUrl: 'result-page',
          nextUrl: 'applying',
          preValidationKeys: ['gridReference'],
          fundingPriorities: '',
          type: 'multi-input',
          minAnswerCount: '',
          maxAnswerCount: '',
          allFields: [
            {
              yarKey: 'projectName',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Project name',
                classes: 'govuk-label'
              },
              hint: {
                text: 'For example, Browns Hill Farm lagoon project'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter a project name'
                },
                {
                  type: 'MIN_MAX_CHARS',
                  min: 0,
                  max: 100,
                  error: 'Name must be 100 characters or fewer'
                }
              ]
            },
            {
              yarKey: 'businessName',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Business name',
                classes: 'govuk-label'
              },
              hint: {
                text: "If you're registered on the Rural Payments system, enter business name as registered"
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter a business name'
                },
                {
                  type: 'MIN_MAX_CHARS',
                  min: 0,
                  max: 100,
                  error: 'Name must be 100 characters or fewer'
                }
              ]
            },
            {
              yarKey: 'numberEmployees',
              type: 'number',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Number of employees',
                classes: 'govuk-label'
              },
              hint: {
                text: 'Full-time employees, including the owner'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter the number of employees'
                },
                {
                  type: 'REGEX',
                  regex: WHOLE_NUMBER_REGEX,
                  error: 'Number of employees must be a whole number, like 305'
                },
                {
                  type: 'MIN_MAX',
                  min: 1,
                  max: 9999999,
                  error: 'Number must be between 1-9999999'
                }
              ]
            },
            {
              yarKey: 'businessTurnover',
              type: 'number',
              classes: 'govuk-input--width-10',
              prefix: {
                text: '£'
              },
              label: {
                text: 'Business turnover',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter the business turnover'
                },
                {
                  type: 'REGEX',
                  regex: WHOLE_NUMBER_REGEX,
                  error:
                    'Business turnover must be a whole number, like 100000'
                },
                {
                  type: 'MIN_MAX',
                  min: 1,
                  max: 999999999,
                  error: 'Number must be between 1-999999999'
                }
              ]
            },
            {
              yarKey: 'sbi',
              type: 'text',
              title: 'Single Business Identifier (SBI)',
              classes: 'govuk-input govuk-input--width-10',
              label: {
                text: 'Single Business Identifier (SBI) - Optional',
                classes: 'govuk-label'
              },
              hint: {
                html: 'If you do not have an SBI, you will need to get one for full application'
              },
              validate: [
                {
                  type: 'REGEX',
                  regex: SBI_REGEX,
                  error: 'SBI number must have 9 characters, like 011115678'
                }
              ]
            }
          ],
          yarKey: 'businessDetails'
        },
        {
          key: 'applying',
          order: 230,
          title: 'Who is applying for this grant?',
          pageTitle: '',
          url: 'applying',
          baseUrl: 'applying',
          backUrl: 'business-details',
          preValidationKeys: ['businessDetails'],
          fundingPriorities: '',
          type: 'single-answer',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select who is applying for this grant'
            }
          ],
          answers: [
            {
              key: 'applying-A1',
              value: 'Applicant',
              redirectUrl: 'applicant-details'
            },
            {
              key: 'applying-A2',
              value: 'Agent',
              redirectUrl: 'agent-details'
            }
          ],
          yarKey: 'applying'
        },
        {
          key: 'farmer-details',
          order: 240,
          title: 'Applicant’s details',
          hint: {
            html: 'Enter the farmer and farm business details'
          },
          pageTitle: '',
          url: 'applicant-details',
          baseUrl: 'applicant-details',
          nextUrl: 'check-details',
          preValidationKeys: ['applying'],
          backUrlObject: {
            dependentQuestionYarKey: 'applying',
            dependentAnswerKeysArray: ['applying-A2'],
            urlOptions: {
              thenUrl: 'agent-details',
              elseUrl: 'applying'
            }
          },
          fundingPriorities: '',
          type: 'multi-input',
          minAnswerCount: '',
          maxAnswerCount: '',
          allFields: [
            {
              type: 'sub-heading',
              text: 'Name'
            },
            {
              yarKey: 'firstName',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                text: 'First name',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your first name'
                },
                {
                  type: 'REGEX',
                  regex: NAME_ONLY_REGEX,
                  error:
                    'Name must only include letters, hyphens and apostrophes'
                }
              ]
            },
            {
              yarKey: 'lastName',
              type: 'text',
              endFieldset: 'true',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Last name',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your last name'
                },
                {
                  type: 'REGEX',
                  regex: NAME_ONLY_REGEX,
                  error:
                    'Name must only include letters, hyphens and apostrophes'
                }
              ]
            },
            {
              type: 'sub-heading',
              text: 'Contact details'
            },
            {
              yarKey: 'emailAddress',
              type: 'email',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Email address',
                classes: 'govuk-label'
              },
              hint: {
                text: 'We will only use this to send you confirmation'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your email address'
                },
                {
                  type: 'REGEX',
                  regex: EMAIL_REGEX,
                  error:
                    'Enter an email address in the correct format, like name@example.com'
                }
              ]
            },
            {
              yarKey: 'mobileNumber',
              type: 'tel',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Mobile number',
                classes: 'govuk-label'
              },
              hint: {
                text: 'We will only use this to contact you about your application'
              },
              validate: [
                {
                  type: 'NOT_EMPTY_EXTRA',
                  error:
                    'Enter a mobile number (if you do not have a mobile, enter your landline number)',
                  extraFieldsToCheck: ['landlineNumber']
                },
                {
                  type: 'REGEX',
                  regex: CHARS_MIN_10,
                  error: 'Your mobile number must have at least 10 characters'
                },
                {
                  type: 'REGEX',
                  regex: PHONE_REGEX,
                  error:
                    'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
                }
              ]
            },
            {
              yarKey: 'landlineNumber',
              endFieldset: 'true',
              type: 'tel',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Landline number',
                classes: 'govuk-label'
              },
              hint: {
                text: 'We will only use this to contact you about your application'
              },
              validate: [
                {
                  type: 'NOT_EMPTY_EXTRA',
                  error:
                    'Enter a landline number (if you do not have a landline, enter your mobile number)',
                  extraFieldsToCheck: ['mobileNumber']
                },
                {
                  type: 'REGEX',
                  regex: CHARS_MIN_10,
                  error:
                    'Your landline number must have at least 10 characters'
                },
                {
                  type: 'REGEX',
                  regex: PHONE_REGEX,
                  error:
                    'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
                }
              ]
            },
            {
              type: 'sub-heading',
              text: 'Business address'
            },
            {
              yarKey: 'address1',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                html: 'Address line 1',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your building and street details'
                }
              ]
            },
            {
              yarKey: 'address2',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                html: 'Address line 2 (optional)',
                classes: 'govuk-label'
              }
            },
            {
              yarKey: 'town',
              type: 'text',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Town',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your town'
                },
                {
                  type: 'REGEX',
                  regex: ONLY_TEXT_REGEX,
                  error: 'Town must only include letters'
                }
              ]
            },
            {
              yarKey: 'county',
              type: 'select',
              classes: 'govuk-input--width-10',
              label: {
                text: 'County',
                classes: 'govuk-label'
              },
              answers: [...LIST_COUNTIES],
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Select your county'
                }
              ]
            },
            {
              yarKey: 'postcode',
              type: 'text',
              classes: 'govuk-input--width-5',
              label: {
                text: 'Business postcode',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your business postcode, like AA1 1AA'
                },
                {
                  type: 'REGEX',
                  regex: POSTCODE_REGEX,
                  error: 'Enter a business postcode, like AA1 1AA'
                }
              ]
            },
            {
              yarKey: 'projectPostcode',
              type: 'text',
              endFieldset: 'true',
              classes: 'govuk-input--width-5',
              label: {
                text: 'Project postcode',
                classes: 'govuk-label'
              },
              hint: {
                text: 'The site postcode where the work will happen'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your project postcode, like AA1 1AA'
                },
                {
                  type: 'REGEX',
                  regex: POSTCODE_REGEX,
                  error: 'Enter a project postcode, like AA1 1AA'
                }
              ]
            }
          ],
          yarKey: 'farmerDetails'
        },
        {
          key: 'agent-details',
          order: 250,
          title: 'Agent’s details',
          hint: {
            html: 'Enter the agent and agent business details'
          },
          pageTitle: '',
          url: 'agent-details',
          baseUrl: 'agent-details',
          backUrl: 'applying',
          nextUrl: 'applicant-details',
          summaryPageUrl: 'check-details',
          preValidationKeys: ['applying'],
          ineligibleContent: {},
          fundingPriorities: '',
          type: 'multi-input',
          minAnswerCount: '',
          maxAnswerCount: '',
          allFields: [
            {
              type: 'sub-heading',
              text: 'Name'
            },
            {
              yarKey: 'firstName',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                text: 'First name',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your first name'
                },
                {
                  type: 'REGEX',
                  regex: NAME_ONLY_REGEX,
                  error:
                    'Name must only include letters, hyphens and apostrophes'
                }
              ]
            },
            {
              yarKey: 'lastName',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Last name',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your last name'
                },
                {
                  type: 'REGEX',
                  regex: NAME_ONLY_REGEX,
                  error:
                    'Name must only include letters, hyphens and apostrophes'
                }
              ]
            },
            {
              yarKey: 'businessName',
              type: 'text',
              endFieldset: 'true',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Business name',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your business name'
                },
                {
                  type: 'MIN_MAX_CHARS',
                  min: 0,
                  max: 100,
                  error: 'Name must be 100 characters or fewer'
                }
              ]
            },
            {
              type: 'sub-heading',
              text: 'Contact details'
            },
            {
              yarKey: 'emailAddress',
              type: 'email',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Email address',
                classes: 'govuk-label'
              },
              hint: {
                text: 'We will only use this to send you confirmation'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your email address'
                },
                {
                  type: 'REGEX',
                  regex: EMAIL_REGEX,
                  error:
                    'Enter an email address in the correct format, like name@example.com'
                }
              ]
            },
            {
              yarKey: 'mobileNumber',
              type: 'tel',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Mobile number',
                classes: 'govuk-label'
              },
              hint: {
                text: 'We will only use this to contact you about your application'
              },
              validate: [
                {
                  type: 'NOT_EMPTY_EXTRA',
                  error:
                    'Enter a mobile number (if you do not have a mobile, enter your landline number)',
                  extraFieldsToCheck: ['landlineNumber']
                },
                {
                  type: 'REGEX',
                  regex: CHARS_MIN_10,
                  error: 'Your mobile number must have at least 10 characters'
                },
                {
                  type: 'REGEX',
                  regex: PHONE_REGEX,
                  error:
                    'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
                }
              ]
            },
            {
              yarKey: 'landlineNumber',
              type: 'tel',
              endFieldset: 'true',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Landline number',
                classes: 'govuk-label'
              },
              hint: {
                text: 'We will only use this to contact you about your application'
              },
              validate: [
                {
                  type: 'NOT_EMPTY_EXTRA',
                  error:
                    'Enter a landline number (if you do not have a landline, enter your mobile number)',
                  extraFieldsToCheck: ['mobileNumber']
                },
                {
                  type: 'REGEX',
                  regex: CHARS_MIN_10,
                  error:
                    'Your landline number must have at least 10 characters'
                },
                {
                  type: 'REGEX',
                  regex: PHONE_REGEX,
                  error:
                    'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
                }
              ]
            },
            {
              type: 'sub-heading',
              text: 'Business address'
            },
            {
              yarKey: 'address1',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                html: 'Address line 1',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your building and street details'
                }
              ]
            },
            {
              yarKey: 'address2',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                html: 'Address line 2 (optional)',
                classes: 'govuk-label'
              }
            },
            {
              yarKey: 'town',
              type: 'text',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Town',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your town'
                },
                {
                  type: 'REGEX',
                  regex: ONLY_TEXT_REGEX,
                  error: 'Town must only include letters'
                }
              ]
            },
            {
              yarKey: 'county',
              type: 'select',
              classes: 'govuk-input--width-10',
              label: {
                text: 'County',
                classes: 'govuk-label'
              },
              answers: [...LIST_COUNTIES],
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Select your county'
                }
              ]
            },
            {
              yarKey: 'postcode',
              type: 'text',
              endFieldset: 'true',
              classes: 'govuk-input--width-5',
              label: {
                text: 'Postcode',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your postcode, like AA1 1AA'
                },
                {
                  type: 'REGEX',
                  regex: POSTCODE_REGEX,
                  error: 'Enter a postcode, like AA1 1AA'
                }
              ]
            }
          ],
          yarKey: 'agentsDetails'
        },
        {
          key: 'check-details',
          order: 260,
          title: 'Check your details',
          pageTitle: 'Check details',
          url: 'check-details',
          backUrl: 'applicant-details',
          nextUrl: 'confirm',
          preValidationKeys: ['applying'],
          ineligibleContent: {},
          pageData: {
            businessDetailsLink: 'business-details',
            agentDetailsLink: 'agent-details',
            farmerDetailsLink: 'applicant-details'
          },
          fundingPriorities: '',
          type: '',
          minAnswerCount: 1,
          answers: []
        },
        // CONFIRM  NOTE //
        // <li>passed to the Environment Agency so that they are aware of my planned project</li> --> third bulled point was asked to remove by Ruth Wyre, RPA PO //
        {
          key: 'confirm',
          title: 'Confirm and send',
          order: 270,
          url: 'confirm',
          backUrl: 'check-details',
          nextUrl: 'confirmation',
          preValidationKeys: ['farmerDetails'],
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Confirm and send',
            messageContent: `I confirm that, to the best of my knowledge, the details I have provided are correct.</br></br>
            I understand the project’s eligibility and estimated grant amount is based on the answers I provided.</br></br>
            I am aware that the information I submit will be:</br>
            <ul>
              <li>checked by the RPA</li>
              <li>passed to Natural England so they can contact me to provide advice on my project</li>
            </ul></br>
            I am aware that if my online application is successful, the information I submit and details of my full application will be shared with the Environment Agency so they can provide assurance on the project location and store design.</br></br>
            I am happy to be contacted by Defra and RPA (or third-party on their behalf) about my application.</br></br>
            So that we can continue to improve our services and schemes, we may wish to contact you in the future. Please confirm if you are happy for us, or a third-party working for us, to contact you.`
          },
          answers: [
            {
              key: 'consentOptional',
              value: 'CONSENT_OPTIONAL'
            }
          ],
          yarKey: 'consentOptional'
        },
        {
          key: 'reference-number',
          order: 280,
          title: 'Details submitted',
          pageTitle: '',
          url: 'confirmation',
          baseUrl: 'confirmation',
          preValidationKeys: ['farmerDetails'],
          ga: { name: 'confirmation', params: {} },
          maybeEligible: true,
          maybeEligibleContent: {
            reference: {
              titleText: 'Details submitted',
              html: 'Your reference number<br><strong>{{_confirmationId_}}</strong>',
              surveyLink: process.env.SURVEY_LINK
            },
            messageContent: `We have sent you a confirmation email with a record of your answers.<br/><br/>
            If you do not get an email within 72 hours, please call the RPA helpline and follow the options for the Farming Transformation Fund scheme:<br/>
            <h2 class="govuk-heading-m">RPA helpline</h2>
            <h3 class="govuk-heading-s">Telephone</h3>
            Telephone: 03000 200 301<br/>
            Monday to Friday, 9am to 5pm (except public holidays)<br/>
            <p><a class="govuk-link" target="_blank" href="https://www.gov.uk/call-charges" rel="noopener noreferrer">Find out about call charges (opens in a new tab)</a></p>
            <h3 class="govuk-heading-s">Email</h3>
            <a class="govuk-link" title="Send email to RPA" target="_blank" rel="noopener noreferrer" href="mailto:ftf@rpa.gov.uk">FTF@rpa.gov.uk</a><br/><br/>
            <h2 class="govuk-heading-m">What happens next</h2>
            <p>1. RPA will be in touch when the full application period opens to tell you if your project is invited to submit a full application form.</p>
            <p>2. If you submit an application, RPA will assess whether it is eligible and meets the rules of the grant.</p>
            <p>3. If your application is successful, you’ll be sent a funding agreement and can begin work on the project.</p>
            `,
            warning: {
              text: 'You must not start the project',
              iconFallbackText: 'Warning'
            },
            extraMessageContent: `<p>Starting the project or committing to any costs (such as placing orders) before you receive a funding agreement will invalidate your application.</p> 
            <p>Before you start the project, you can:</p>
            <ul>
              <li>get quotes from suppliers</li>
              <li>apply for planning permission</li>
            </ul>
            <p class="govuk-body">
              If you farm pigs intensively and need to apply for a variation to your environmental permit, you can get advice from the <a class="govuk-link" href="https://www.gov.uk/guidance/get-advice-before-you-apply-for-an-environmental-permit" target="_blank" rel="noopener noreferrer">Environment Agency’s (EA) pre-application advice service</a> or discuss it with your EA site officer.
            </p>
            <div class="govuk-inset-text">
              <p class="govuk-body">
              If you want your landlord to underwrite your project, you will need them to sign a letter of assurance. This letter will say your landlord agrees to take over your project, including conditions in the Grant Funding Agreement, if your tenancy ends. You should discuss and agree this with your landlord before you begin your full application.
              </p>
            </div>
            <p class="govuk-body"><a class="govuk-link" href="${process.env.SURVEY_LINK}" target="_blank" rel="noopener noreferrer">What do you think of this service? (opens in a new tab)</a></p>
            `
          },
          fundingPriorities: '',
          type: '',
          minAnswerCount: 1,
          answers: []
        }
      ]
    }
  ]
}
const ALL_QUESTIONS = []
questionBank.sections.forEach(({ questions }) => {
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
