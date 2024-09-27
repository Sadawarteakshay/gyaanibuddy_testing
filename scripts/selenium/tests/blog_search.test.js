const { By, until, WebDriver, Key } = require('selenium-webdriver');
const {setupChromeDriver, accessGyaaniBuddyWebsite} = require("./utility/setup");
const { getElementByXPath, getElementsByXPath } = require('./utility/selenium_getters');

beforeAll(async () => {
    driver = await setupChromeDriver();
})
  
afterAll(async () => {
    await driver.close();
    await driver.quit();
})

// This whole describe block should be run sequentially, or at least
// we should ensure that we're currently on the blog page in order to run searches and whatever

describe("test search button in blogs", () => {
    it("should click on blogs", async () => {
        await accessGyaaniBuddyWebsite(driver);

        blog_button = await driver.findElement(By.xpath("(//a[@href='/blog/'])[1]"));

        await blog_button.click();
        await driver.wait(until.titleContains('blogs'));
    });

    describe("actually performing the search", () => {
        afterEach(async () => {
            // clear search values after each test
            let two_seconds = 2000;

            let title_search_btn = await getElementByXPath(driver, "//input[@class='form-control' and @id='id_q']", two_seconds);
            let author_search_btn = await getElementByXPath(driver, "//input[@class='form-control' and @id='id_writer__username']", two_seconds);

            await title_search_btn.sendKeys(Key.CONTROL, "a", Key.DELETE);
            await author_search_btn.sendKeys(Key.CONTROL, "a", Key.DELETE);
        });

        it("searching with empty title and author returns at least a full page", async () => {
            let two_seconds = 2000;
    
            let submit_button = await getElementByXPath(driver, "//button[@class='submit-buttons m-1 p-2']", two_seconds);
    
            await submit_button.click();
    
            await driver.wait(until.urlContains('q=&writer__username='));
    
            let generic_element_XPath = "//div[contains(@class, 'card-body')][a[text()]]"
    
            let returned_elems = await getElementsByXPath(driver, generic_element_XPath, two_seconds);
            expect(returned_elems.length).toEqual(8);
        });
    
        it("should search with 'essential' in title search bar", async () => {
            let two_seconds = 2000;
    
            let title_search_btn = await getElementByXPath(driver, "//input[@class='form-control' and @id='id_q']", two_seconds);
            let submit_button = await getElementByXPath(driver, "//button[@class='submit-buttons m-1 p-2']", two_seconds);
    
            await title_search_btn.sendKeys('Essential');
            await submit_button.click();
    
            await driver.wait(until.urlContains('Essential'));
    
            // Assert it returns two elements
            
            const valid_title1 = "Essential Purchases for International Students in the USA: Your Complete Guide";
            const valid_title2 = "Must-Have Essentials for International Students in USA: Your Ultimate Guide to Prepare for a Successful Journey";
            const element_xpath_template = (name) => `//div[contains(a[text()], '${name}')]`;
    
            expect(driver.findElement(By.xpath(element_xpath_template(valid_title1)))).toBeTruthy();
            expect(driver.findElement(By.xpath(element_xpath_template(valid_title2)))).toBeTruthy();
        });
    
        it("should search with 'essential' in title search bar and 'gbadmin' in Author search bar", async () => {
            let two_seconds = 2000;
    
            let title_search_btn = await getElementByXPath(driver, "//input[@class='form-control' and @id='id_q']", two_seconds);
            let author_search_btn = await getElementByXPath(driver, "//input[@class='form-control' and @id='id_writer__username']", two_seconds);
    
            let submit_button = await getElementByXPath(driver, "//button[@class='submit-buttons m-1 p-2']", two_seconds);
    
            await title_search_btn.sendKeys('Essential');
            await author_search_btn.sendKeys('gbadmin');
    
            await submit_button.click();
    
            await driver.wait(until.urlContains('q=Essential&writer__username=gbadmin'));
    
            // Assert it returns one element
            
            const valid_title1 = "Essential Purchases for International Students in the USA: Your Complete Guide";
            const element_xpath_template = (name) => `//div[contains(a[text()], '${name}')]`;
    
            expect(driver.findElement(By.xpath(element_xpath_template(valid_title1)))).toBeTruthy();
        });
    
        it("searching with 'funny' in title search bar and 'funny' in Author search bar returns nothing", async () => {
            let two_seconds = 2000;
    
            let title_search_btn = await getElementByXPath(driver, "//input[@class='form-control' and @id='id_q']", two_seconds);
            let author_search_btn = await getElementByXPath(driver, "//input[@class='form-control' and @id='id_writer__username']", two_seconds);
    
            let submit_button = await getElementByXPath(driver, "//button[@class='submit-buttons m-1 p-2']", two_seconds);
    
            await title_search_btn.sendKeys('funny');
            await author_search_btn.sendKeys('funny');
    
            await submit_button.click();
    
            await driver.wait(until.urlContains('q=funny&writer__username=funny'));
    
            // Assert it returns no element
            let generic_element_XPath = "//div[contains(@class, 'card-body')][a[text()]]"
    
            let returned_elems = driver.findElements(By.xpath(generic_element_XPath));
            expect(returned_elems.length).toBeFalsy();
        });
    })
});