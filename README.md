# gyaanibuddy_testing

This project contains two part:

The first part is the server and client folder containing project information from https://github.com/apollographql/fullstack-tutorial.
Prerequisites for runnning:
You'll need Node (https://nodejs.org).

To run the shoppping cart website:
1. Navigate to the scripts/server folder
2. Run the `npm i && npm start` command
3. Return to root, and then navigate to the scripts/client folder
4. Run the `npm i && npm start` command

To run the unit tests ...
1. Navigate to either server/client folder
2. Run the 'npm run test` command
3. Press `a` when prompted, or just follow the prompt to run the tests.

The second part is the selenium folder, where there are some selenium tests for (https://gyaanibuddy.com/).
Prerequisites for runnning:
You'll also need Node (https://nodejs.org).
You'll need the Chrome browser (https://www.google.com/chrome/).

To run the selenium tests:
1. Navigate to the scripts/selenium folder
2. Run the 'npm run test' command

# Q/A
Getting an error when running Selenium tests, the test browser won't open
1. The selenium framework was setup to automatically install the latest Chromedriver to be compatible with the latest version of Chrome. There may be a period of time where the latest Chromedriver may not be up to date with the latest version of Chrome, so you may run into some issues running the tests if this is the case. This may be resolved by manually installing the latest version of Chromedriver, but one can also intentionally downgrade their version of Chrome. See (https://googlechromelabs.github.io/chrome-for-testing/ and https://chromedriver.chromium.org/downloads for the various Chromedriver versions).
