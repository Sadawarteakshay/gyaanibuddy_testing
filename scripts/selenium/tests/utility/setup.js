const { WebDriver, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

/**
 * Setup the chrome driver, do some options and stuff
 * @returns {WebDriver}
 */
async function setupChromeDriver() {
    // https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/chrome.html#setDefaultService
	let service = new chrome.ServiceBuilder(chromedriver.path).build();

	let chrome_options = new chrome.Options();
    chrome_options.addArguments("--auto-open-devtools-for-tabs");

    // Using createSession instead of webdriver.Builder() because I cannot add the service to run the executable from chromedriver.path
    // https://stackoverflow.com/questions/27733731/passing-requirechromedriver-path-directly-to-selenium-webdriver
	let driver = chrome.Driver.createSession(chrome_options, service);

    await driver.manage().window().setRect({ width: 1920, height: 1080 });
	
    return driver;
}

/**
 * Navigate to the GyaaniBuddy website and wait until the title is visible
 * @param {WebDriver} driver The webdriver element
 * @returns {WebDriver}
 */
async function accessGyaaniBuddyWebsite(driver) {
    // For each test suite, we need to be on the Gyaanibuddy website.
    await driver.get('https://www.gyaanibuddy.com/');
    await driver.wait(until.titleContains('GyaaniBuddy'));
    return driver;
}

module.exports = {setupChromeDriver, accessGyaaniBuddyWebsite}