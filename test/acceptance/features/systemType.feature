Feature: System Type
     Scenario Outline: Choosing Slurry based system
              Given I open the url "/tech-evaluation/applicant-type"
              And I pause for 500ms
              When I click on the element "#applicantType-2"  
              When I click on the button "#btnContinue"
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
              When I click on yes land ownership button
              And I click on Continue button
              And I pause for 500ms
              Then I expect that the url contains "/system-type"
              When I click on the element "#systemType"
              And I click on Continue button
              And I pause for 500ms
              Then I expect that the url contains "/existing-storage-capacity"
              Examples:
              |trades  |preparatoryWork|

    #Scenario: Choosing farm and slurry
    #    Given I open the url "/tech-evaluation/applicant-type"
    #          And I pause for 500ms
    #          When I click on the element "#applicantType-2"  
    #          When I click on the button "#btnContinue"
    #          And I pause for 500ms
    #          When I click on the element "#legalStatus-2"
    #          And I click on Continue button
    #          And I pause for 500ms
    #          And I click on CountryYes button
    #          And I click on Continue button
    #          And I pause for 500ms
    #          When I click "<preparatoryWork>" button
    #          And I click on Continue button
    #          And I pause for 500ms
    #          When I click on yes land ownership button
    #          And I click on Continue button
    #          And I pause for 500ms
    #          Then I expect that the url contains "/system-type"
    #          When I click on the element "#systemType-2"
    #          And I click on Continue button
    #          And I pause for 500ms
    #          Then I expect that the url contains "/existing-storage-capacity"
              

    #Scenario: Choosing farm no slurry
    #    Given I open the url "/tech-evaluation/applicant-type"
    #          And I pause for 500ms
    #          When I click on the element "#applicantType-2"  
    #          When I click on the button "#btnContinue"
    #          And I pause for 500ms
    #          When I click on the element "#legalStatus-2"
    #          And I click on Continue button
    #          And I pause for 500ms
    #          And I click on CountryYes button
    #          And I click on Continue button
    #          And I pause for 500ms
    #          When I click "<preparatoryWork>" button
    #          And I click on Continue button
    #          And I pause for 500ms
    #          When I click on yes land ownership button
    #          And I click on Continue button
    #          And I pause for 500ms
    #          Then I expect that the url contains "/system-type"
    #          When I click on the element "#systemType-3"
    #          And I click on Continue button
    #          And I pause for 500ms
    #          Then I expect that element "h1" contains the text "You cannot apply for a grant from this scheme"
              

    #Scenario: Choosing farm no slurry
    #    Given I open the url "/tech-evaluation/applicant-type"
    #          And I pause for 500ms
    #          When I click on the element "#applicantType-2"  
    #          When I click on the button "#btnContinue"
    #          And I pause for 500ms
    #          When I click on the element "#legalStatus-2"
    #          And I click on Continue button
    #          And I pause for 500ms
    #          And I click on CountryYes button
    #          And I click on Continue button
    #          And I pause for 500ms
    #          When I click "<preparatoryWork>" button
    #          And I click on Continue button
    #          And I pause for 500ms
    #          When I click on yes land ownership button
    #          And I click on Continue button
    #          And I pause for 500ms
    #          Then I expect that the url contains "/system-type"
    #          When I click on the element "#systemType-3"
    #          And I click on Continue button
    #          And I pause for 500ms
    #          Then I expect that element "h1" contains the text "You cannot apply for a grant from this scheme"
    #          Examples:
    #          |trades  |preparatoryWork|
