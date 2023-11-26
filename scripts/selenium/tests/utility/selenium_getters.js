const { By, until, WebDriver, WebElementPromise } = require('selenium-webdriver');

/**
 * @param {WebDriver} driver The webdriver element
 * @param {string} id The id the element
 * @param {number} waitUntilTime Seconds to wait until we give up trying to get Element by ID
 * @returns {WebElementPromise}
 */
async function getElementById(driver, id, waitUntilTime) {
    const element = await driver.wait(until.elementLocated(By.id(id)), waitUntilTime);
    return await driver.wait(until.elementIsVisible(element), waitUntilTime, "Timed out");
}

/**
 * @param {WebDriver} driver The webdriver element
 * @param {string} xpath The xpath of the element
 * @param {number} waitUntilTime Seconds to wait until we give up trying to get Element by xpath
 * @returns {WebElementPromise}
 */
async function getElementByXPath(driver, xpath, waitUntilTime) {
    const element = await driver.wait(until.elementLocated(By.xpath(xpath)), waitUntilTime);
    return await driver.wait(until.elementIsVisible(element), waitUntilTime, "Timed out");
}

/**
 * Like getElementByXPath, except no waiting for visibility
 * @param {WebDriver} driver The webdriver element
 * @param {string} xpath The xpath of the element
 * @param {number} waitUntilTime Seconds to wait until we give up trying to get Element by xpath
 * @returns {WebElementPromise}
 */
async function getElementByXPathNoVis(driver, xpath, waitUntilTime) {
    const element = await driver.wait(until.elementLocated(By.xpath(xpath)), waitUntilTime);
    return element;
}

/**
 * @param {WebDriver} driver The webdriver element
 * @param {string} xpath The xpath of the element
 * @param {number} waitUntilTime Seconds to wait until we give up trying to get Element by xpath
 * @returns {WebElementPromise}
 */
async function getElementsByXPath(driver, xpath, waitUntilTime) {
    const elements = await driver.wait(until.elementsLocated(By.xpath(xpath)), waitUntilTime);
    return elements;
}

module.exports = { getElementById, getElementByXPath, getElementsByXPath, getElementByXPathNoVis }