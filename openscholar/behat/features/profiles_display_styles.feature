Feature:
  Testing the os_profiles app settings.

  @api
  Scenario: Test that changing the display type affects the "/people" path,
            with display type "title".
    Given I am logging in as "john"
     When I go to the "os_profiles" app settings in the vsite "john"
      And I select the radio button named "os_profiles_display_type" with value "title"
      And I press "Save configuration"
      And I invalidate cache
      And I visit "john/people"
     Then I should not see "Drupal developer at Gizra.inc"

  @api
  Scenario: Test that changing the display type affects the people term pages,
            for example: "john/people/science/air".
    Given I am logging in as "john"
     When I go to the "os_profiles" app settings in the vsite "john"
      And I select the radio button named "os_profiles_display_type" with value "sidebar_teaser"
      And I press "Save configuration"
      And I invalidate cache
      And I visit "john/people/science/wind"
     Then I should see "Actress"
      And I should not see "AKA Marilyn Monroe"

  @api
  Scenario: Test that changing the display type affects the "/people" path,
            With display type "teaser".
    Given I am logging in as "john"
     When I go to the "os_profiles" app settings in the vsite "john"
      And I select the radio button named "os_profiles_display_type" with value "teaser"
      And I press "Save configuration"
      And I invalidate cache
      And I visit "john/people"
     Then I should see "Actress"
     Then I should see "AKA Marilyn Monroe"
