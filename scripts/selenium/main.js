const {By, until, Key} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

(async function example() {
	// https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/chrome.html#setDefaultService
	let service = new chrome.ServiceBuilder(chromedriver.path).build();

	let chrome_options = new chrome.Options();
    chrome_options.addArguments("--auto-open-devtools-for-tabs");

	let driver = chrome.Driver.createSession(chrome_options, service);

    await driver.manage().window().setRect({ width: 1920, height: 1080 });
	
	try {
		await driver.get('https://www.google.com/');
		await driver.findElement(By.xpath("//textarea[@id='APjFqb']")).sendKeys('bradley cooper venice film festival', Key.RETURN);
		await driver.wait(until.titleIs('bradley cooper venice film festival - Google Search'), 5000);
	} finally {
		await driver.quit();
	}
})();