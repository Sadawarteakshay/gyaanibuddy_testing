require('chromedriver');
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

/**
 * Setup the chrome driver, do some options and stuff
 * @returns {WebDriver}
 */
async function setupChromeDriver() {
    let chrome_options = new chrome.Options();
    chrome_options.addArguments("--auto-open-devtools-for-tabs");

    driver = await new Builder().forBrowser('chrome').setChromeOptions(chrome_options).build()
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