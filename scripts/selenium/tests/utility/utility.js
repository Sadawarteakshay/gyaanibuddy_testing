/**
 * @param {number} driver The webdriver element
 * @param {number} id The id the element
 * @param {number} waitUntilTime Seconds to wait until we give up trying to get Element by ID
 * @returns {number}
 */
async function getElementById(driver, id, waitUntilTime) {
    const element = await driver.wait(until.elementLocated(By.id(id)), waitUntilTime);
    return await driver.wait(until.elementIsVisible(element), waitUntilTime);
}

/**
 * @param {number} driver The webdriver element
 * @param {number} xpath The xpath of the element
 * @param {number} waitUntilTime Seconds to wait until we give up trying to get Element by xpath
 * @returns {number}
 */
async function getElementByXPath(driver, xpath, waitUntilTime) {
    const element = await driver.wait(until.elementLocated(By.xpath(xpath)), waitUntilTime);
    return await driver.wait(until.elementIsVisible(element), waitUntilTime);
}