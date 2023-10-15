require('chromedriver');
const { By, until } = require('selenium-webdriver');
const {setupChromeDriver, accessGyaaniBuddyWebsite} = require("./utility/setup");

beforeAll(async () => {
    driver = await setupChromeDriver();
})
  
afterAll(async () => await driver.quit())

beforeEach(async () => {
    await accessGyaaniBuddyWebsite(driver);
});

describe("test social media links", () => {
    test('youtube social media link', async () => {
        home_button = await driver.findElement(By.xpath("//a[@class='youtube']"));
        
        await home_button.click();

        await driver.wait(until.titleIs('Gyaani Buddy - YouTube'));
    });
});

describe("test search button in blogs", () => {
    it("should click on blogs", async () => {
        blog_button = await driver.findElement(By.xpath("(//a[@href='/blog/'])[1]"));

        await blog_button.click();
        await driver.wait(until.titleContains('blogs'));
    });

    it("should search with 'essential' in search bar", async () => {
        search_button = await driver.findElement(By.xpath("//input[@class='form-control' and @id='id_q']"));
        submit_button = await driver.findElement(By.xpath("//button[@class='submit-buttons m-1 p-2']"))

        await search_button.sendKeys('Essential');
        await submit_button.click();

        await driver.wait(until.urlContains('Essential'));
    });
});