const { Builder, By, Key, until } = require('selenium-webdriver');

beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build()
})
  
afterAll(async () => driver.quit())

test('go to gyaanibuddy domain', async () => {
    await driver.get('https://www.google.com/');
	await driver.findElement(By.xpath("//textarea[@id='APjFqb']")).sendKeys('bradley cooper venice film festival', Key.RETURN);
	await driver.wait(until.titleIs('bradley cooper venice film festival - Google Search'), 5000);
});