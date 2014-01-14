Feature:
  Testing the publication tab and application.

  @api @wip
  Scenario: Test the Publication tab
    Given I visit "john"
     When I click "Publications"
      And I click "The Little Prince"
     Then I should see "The Little Prince (Book)"

  @api @wip
  Scenario: Test the Publication tab allows caching of anonymous user
    Given cache is enabled for anonymous users
     When I visit "john/publications"
     Then I should get a "200" HTTP response
      And I visit "john/publications"
     Then response header "X-Drupal-Cache" should be "HIT"

  @api @foo
  Scenario: Test the Authors field in Publication form
    Given I am logging in as "john"
     When I edit the publication "The Little Prince" in the vsite "john"
     Then I should see "You have added 1 out of 1 allowed entities."
      And I should see "Contributor role"

  @api
  Scenario: Verify publications are sorted by the creation date of the node.
    Given I am logging in as "john"
     When I visit "john/publications"
     Then I should see the publication "Goblet of Fire" comes before "Prisoner of Azkaban"
      And I should see the publication "Prisoner of Azkaban" comes before "Chamber of Secrets"
      And I should see the publication "Chamber of Secrets" comes before "Philosophers Stone"

  @api
  Scenario: Verify sticky publications appear first on each section.
    Given I am logging in as "john"
      And I make the node "Philosophers Stone" sticky
     When I visit "john/publications"
      And I should see the publication "Philosophers Stone" comes before "Goblet of Fire"

