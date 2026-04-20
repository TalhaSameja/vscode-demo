Feature: VS Code Developer Workflow

  Scenario: Create, write, run, and delete a file in VS Code
    Given VS Code is launched with a clean workspace
    When I create a new file "demo.js" via the terminal
    And I open "demo.js" in the editor
    And I write 'console.log("test case automated");' in the editor and save
    And I run "node demo.js" in the terminal
    Then I delete "demo.js" via the terminal
    And "demo.js" should not exist on disk
