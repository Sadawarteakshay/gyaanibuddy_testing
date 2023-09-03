const {
	Builder,
	By,
	Key,
	until
} = require('selenium-webdriver');

(async function example() {
	let driver = await new Builder().forBrowser("chrome").build();
	try {
		await driver.get('https://www.google.com/');
		await driver.findElement(By.xpath("//textarea[@id='APjFqb']")).sendKeys('bradley cooper venice film festival', Key.RETURN);
		await driver.wait(until.titleIs('bradley cooper venice film festival - Google Search'), 5000);
	} finally {
		await driver.quit();
	}
})();