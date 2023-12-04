Feature: Country Page
     Scenario Outline: Choosing the Yes project plan
              Given I open the url "/tech-evaluation/applicant-type"
              And I pause for 500ms
              When I click on the element "#applicantType-2"  
              When I click on the button "#Continue"
              And I pause for 500ms
              Then I expect that the url contains "/legal-status"
              And I pause for 500ms
              When I clicks on the "<trades>" button 
              And I click on Continue button
              And I pause for 500ms
              Then I expect that the url contains "/country"
              When I click on CountryYes button
              And I pause for 500ms
              Then I expect that the url contains "/project-started"
              Examples:
              |trades  |
         #     |sole    |

     #Scenario Outline: Choosing the No project plan
     #         Given I open the url "/tech-evaluation/applicant-type"
     #         And I pause for 500ms
     #         When I click on the element "#applicantType-2"  
     #         When I click on the button "#Continue"
     #         And I pause for 500ms
     #         When I clicks on the "<trades>" button 
     #         And I click on Continue button
     #         And I pause for 500ms
     #         Then I expect that the url contains "/country"
     #         And I click on CountryNo button
     #         And I click on Continue button
     #         And I pause for 500ms
     #         #Then I expect that the url contains "/tech-evaluation/country" 
     #         Then I expect that element "#p.govuk-body" contains the text "You cannot apply for a grant from this scheme" 
     #         #Then I expect that element "#div.govuk-grid-column-two-thirds>h1.govuk-heading-l" contains the text "You cannot apply for a grant from this scheme"           
     #         Examples:
     #         |trades  |
     #         |sole    |

    