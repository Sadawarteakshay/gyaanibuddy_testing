const { By, until } = require('selenium-webdriver');
const {setupChromeDriver, accessGyaaniBuddyWebsite} = require("./utility/setup");
const { getElementByXPathNoVis } = require('./utility/selenium_getters');

let ten_seconds = 10000;

beforeAll(async () => {
    driver = await setupChromeDriver();
})
  
afterAll(async () => {
    await driver.close();
    await driver.quit();
})

describe("test social media links", () => {
    beforeEach(async () => {
        await accessGyaaniBuddyWebsite(driver);
    });
    
    test('facebook social media link', async () => {
        media_button = await driver.findElement(By.xpath("//a[@class='facebook']"));
        
        await media_button.click();

        await driver.wait(until.titleIs('Gyaani Buddy | Facebook'));

        elem = await getElementByXPathNoVis(driver, "//span[contains(text(), 'Facebook')]", ten_seconds);

        expect(elem).toBeTruthy(); // we can find the element
    });
});