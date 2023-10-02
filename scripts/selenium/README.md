## Selenium end to end tests for this website
This is basically a basic framework for testing via Selenium and NPM. Once you've setup the dependencies, you can run the scripts and look at it go (as long as the website is still up and the tests are still working). It'll basically open a Chrome window and do everything in the window.

## How to run this? Do the following steps:

# Prerequisites:
1. Install node (Please see: https://nodejs.org/en)
2. Have some version of Chrome installed on computer

2. Run the command "npm install" (while in this directory to install any dependencies, which includes
the chrome webdriver)
3. Run the command "npm test" to run the selenium tests, it's recommended that you don't click on anything (you may interrupt the flow of the end to end tests)

# OK, I don't understand the commands for selenium. Some context?

This is made with javascript and the NPM library, but the test runner is pretty much jest.
https://jestjs.io/

The interaction with the web browser and website is pretty much done with selenium.
https://www.selenium.dev/

Since selenium can work with multiple languages, for the purpose of this project, we're using the javascript "flavor" of selenium, so documentation is here:
https://www.selenium.dev/selenium/docs/api/javascript/index.html

However, I think the documentation is "slightly" behind the source code (for example, as of 10/1/2023, the WebElement documentation page doesn't have the getProperty method even though it is present in the source code) so you may also want to refer to the Selenium github as well: https://github.com/SeleniumHQ/selenium/tree/trunk/javascript/node/selenium-webdriver.

And feel free to take a look at the package.json files to see any other dependencies and look them up the NPM library repository.
https://www.npmjs.com/

# What website is this testing?
https://www.gyaanibuddy.com/