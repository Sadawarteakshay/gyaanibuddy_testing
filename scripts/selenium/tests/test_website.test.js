const { Builder, By, Key, until } = require('selenium-webdriver');

beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build()
})
  
afterAll(async () => driver.quit())

test('social media links', async () => {
    await driver.get('https://www.gyaanibuddy.com/');
	home_button = await driver.findElement(By.xpath("//a[@class='youtube']"));
    
    await home_button.click();

	await driver.wait(until.titleIs('Gyaani Buddy - YouTube'), 5000);
});

test('social media links 2', async () => {
    await driver.get('https://www.gyaanibuddy.com/');
	home_button = await driver.findElement(By.xpath("//a[@class='youtube']"));
    
    await home_button.click();

	await driver.wait(until.titleIs('Gyaani Buddy - YouTube'), 5000);
});