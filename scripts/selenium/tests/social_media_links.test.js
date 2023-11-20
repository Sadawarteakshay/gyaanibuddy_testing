const { By, until } = require('selenium-webdriver');
const {setupChromeDriver, accessGyaaniBuddyWebsite} = require("./utility/setup");
const { getElementByXPathNoVis } = require('./utility/selenium_getters');

let ten_seconds = 10000;

beforeAll(async () => {
    driver = await setupChromeDriver();
})
  
afterAll(async () => await driver.quit())

describe("test social media links", () => {
    beforeEach(async () => {
        await accessGyaaniBuddyWebsite(driver);
    });

    // Tests are running into an issue when ran sequentially

    // test('facebook social media link', async () => {
    //     media_button = await driver.findElement(By.xpath("//a[@class='facebook']"));
        
    //     await media_button.click();

    //     await driver.wait(until.titleIs('Gyaani Buddy | Facebook'));

    //     expect(await getElementByXPathNoVis(driver, "//span[contains(text(), 'Connect with Gyaani Buddy on Facebook')]", ten_seconds)).toBeTruthy();
    // });

    // test('instagram social media link', async () => {
    //     media_button = await driver.findElement(By.xpath("//a[@class='instagram']"));
        
    //     await media_button.click();

    //     await driver.wait(until.titleContains('Gyaani Buddy (@gyaanibuddy)'));

    //     expect(await getElementByXPathNoVis(driver, "//div[contains(text(), 'Education website')]", ten_seconds)).toBeTruthy();

    //     //expect(driver.findElement(By.xpath("//div[contains(text(), 'Education website')]"))).toBeTruthy();
    // });
    
    // test('linkedin social media link', async () => {
    //     media_button = await driver.findElement(By.xpath("//a[@class='linkedin']"));
        
    //     await media_button.click();

    //     await driver.wait(until.titleContains('LinkedIn'));

    //     expect(await getElementByXPathNoVis(driver, "//*[contains(text(), 'Sign In')]", ten_seconds)).toBeTruthy();
    // });

    test('youtube social media link', async () => {
        media_button = await driver.findElement(By.xpath("//a[@class='youtube']"));
        
        await media_button.click();

        await driver.wait(until.titleIs('Gyaani Buddy - YouTube'));

        expect(await getElementByXPathNoVis(driver, "//div[contains(text(), 'Hey buddies!')]", ten_seconds)).toBeTruthy();
    });
});