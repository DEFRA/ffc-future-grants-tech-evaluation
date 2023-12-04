Feature: Tenancy Length
    Scenario Outline: Choosing No land farm business owns with tenancy agreement
              Given I open the url "/tech-evaluation/applicant-type"
              And I pause for 500ms
              When I click on the element "#applicantType-2"  
              When I click on Continue button
              And I pause for 500ms
              When I click on the element "#legalStatus-2"
              And I click on Continue button
              And I pause for 500ms
              And I click on CountryYes button
              And I click on Continue button
              And I pause for 500ms
              When I click "<preparatoryWork>" button
              And I click on Continue button
              And I pause for 500ms
              When I click on the element "#landOwnership-2"
              And I click on Continue button
              And I pause for 500ms
              Then I expect that the url contains "/tenancy-length"
              When I click on the element "#tenancyLength"
              And I click on Continue button
              And I pause for 500ms
              Then I expect that the url contains "/project-items"
              Examples:
              |trades  |preparatoryWork|