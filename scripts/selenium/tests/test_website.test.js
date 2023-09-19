const { Builder, By, Key, until } = require('selenium-webdriver');

beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build()
    await driver.manage().window().setRect({ width: 1280, height: 1024 });
})
  
afterAll(async () => driver.quit())

let long_timeout = 20000;

test('social media links', async () => {
    await driver.get('https://www.gyaanibuddy.com/');
	home_button = await driver.findElement(By.xpath("//a[@class='youtube']"));
    
    await home_button.click();

	await driver.wait(until.titleIs('Gyaani Buddy - YouTube'), long_timeout);
});

describe("test search button in blogs", () => {
    
    test("go to website", async () => {
        await driver.get('https://www.gyaanibuddy.com/');
        await driver.wait(until.titleContains('GyaaniBuddy'), long_timeout);
    });

    test("click on blogs", async () => {
        blog_button = await driver.findElement(By.xpath("(//a[@href='/blog/'])[1]"));

        await blog_button.click();
        await driver.wait(until.titleContains('blogs'), long_timeout);
    });

    test("search with 'essential' in search bar", async () => {
        search_button = await driver.findElement(By.id("id_q"));
        submit_button = await driver.findElement(By.xpath("//button[@class='submit-buttons m-1 p-2']"))

        await search_button.sendKeys('Essential');
        await submit_button.click();

        await driver.wait(until.urlContains('Essential'), long_timeout);
    }, long_timeout);
});