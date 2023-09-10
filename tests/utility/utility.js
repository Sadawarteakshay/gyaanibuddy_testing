/**
 * @param {number} driver
 * @param {number} id
 * @param {number} waitUntilTime
 * @returns {number}
 */
async function getElementById(driver, id, waitUntilTime) {
    
    const el = await driver.wait(until.elementLocated(By.id(id)), waitUntilTime);
    return await driver.wait(until.elementIsVisible(el), waitUntilTime);
}
async function getElementByXPath(driver, xpath, waitUntilTime) {
    const el = await driver.wait(until.elementLocated(By.xpath(xpath)), waitUntilTime);
    return await driver.wait(until.elementIsVisible(el), waitUntilTime);
}