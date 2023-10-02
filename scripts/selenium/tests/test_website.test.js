require('chromedriver');
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const chrome_options = new chrome.Options();
chrome_options.addArguments("--auto-open-devtools-for-tabs");


beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').setChromeOptions(chrome_options).build()
    await driver.manage().window().setRect({ width: 1920, height: 1080 });
})
  
afterAll(async () => driver.quit())

beforeEach(async () => {
    // For each test suite, we need to be on the Gyaanibuddy website.
    await driver.get('https://www.gyaanibuddy.com/');
    await driver.wait(until.titleContains('GyaaniBuddy'));
});

// describe("test social media links", () => {
//     test('youtube social media link', async () => {
//         home_button = await driver.findElement(By.xpath("//a[@class='youtube']"));
        
//         await home_button.click();

//         await driver.wait(until.titleIs('Gyaani Buddy - YouTube'));
//     });
// });

// describe("test search button in blogs", () => {
//     it("should click on blogs", async () => {
//         blog_button = await driver.findElement(By.xpath("(//a[@href='/blog/'])[1]"));

//         await blog_button.click();
//         await driver.wait(until.titleContains('blogs'));
//     });

//     it("should search with 'essential' in search bar", async () => {
//         search_button = await driver.findElement(By.id("id_q"));
//         submit_button = await driver.findElement(By.xpath("//button[@class='submit-buttons m-1 p-2']"))

//         await search_button.sendKeys('Essential');
//         await submit_button.click();

//         await driver.wait(until.urlContains('Essential'));
//     });
// });

describe("test sign up form validation", () => {
    // I did some equivalence class partitioning, but these are not all of the cases so feel free to add more.
    // also we're not testing the confirm password field for now because I don't want to create throwaway
    // accounts just for the sake of testing the sign up field for now

    beforeEach(async () => {
        //navigate to sign up section before each test
        blog_button = await driver.findElement(By.xpath("(//a[@href='/accounts/signup'])[1]"));
        await blog_button.click();

        // all test cases are using the register button
        register_button = await driver.findElement(By.xpath("//button[@type='submit' and @class='btn btn-secondary w-100 p-2']"))
    });

    describe("validate username", () => {
        beforeEach(async () => {
            username_input_button = await driver.findElement(By.id("inputText")); // username input field xpath
        })

        it("should not accept an empty username", async () => {
            await register_button.click(); // click so message is validated
           
            let validationMessage = await username_input_button.getProperty("validationMessage");
            let validationStatus = await username_input_button.getProperty("validity");
            let isValueMissing = validationStatus["valueMissing"]; // validationStatus is an object

            expect(isValueMissing).toBe(true);
            expect(validationMessage).toBe("Please fill out this field.");
        });
        
        it("should accept a username with an alphabetical character", async () => {
            await username_input_button.sendKeys("a");
            await register_button.click(); // click so message is validated
            
            let validationStatus = await username_input_button.getProperty("validity");
            let isValueMissing = validationStatus["valueMissing"]; // validationStatus is an object
            let isValueValid = validationStatus["valid"];

            expect(isValueMissing).toBe(false);
            expect(isValueValid).toBe(true);
        });

        it("should accept a username with a numeric character", async () => {
            await username_input_button.sendKeys("1");
            await register_button.click(); // click so message is validated

            let validationStatus = await username_input_button.getProperty("validity");
            let isValueMissing = validationStatus["valueMissing"]; // validationStatus is an object
            let isValueValid = validationStatus["valid"];

            expect(isValueMissing).toBe(false);
            expect(isValueValid).toBe(true);
        });

        it("should accept a username with a special character", async () => {
            await username_input_button.sendKeys("%");
            await register_button.click(); // click so message is validated

            let validationStatus = await username_input_button.getProperty("validity");
            let isValueMissing = validationStatus["valueMissing"]; // validationStatus is an object
            let isValueValid = validationStatus["valid"];

            expect(isValueMissing).toBe(false);
            expect(isValueValid).toBe(true);
        });

        it("should accept a username with 10 alphabetical character", async () => {
            await username_input_button.sendKeys("abcdefghij");
            await register_button.click(); // click so message is validated

            let validationStatus = await username_input_button.getProperty("validity");
            let isValueMissing = validationStatus["valueMissing"]; // validationStatus is an object
            let isValueValid = validationStatus["valid"];

            expect(isValueMissing).toBe(false);
            expect(isValueValid).toBe(true);
        });
    });

    describe("validate email", () => {
        beforeEach(async () => {
            // Need to put in valid username input so validation will be focused on email field
            username_input_button = await driver.findElement(By.id("inputText"));
            await username_input_button.sendKeys("validName");

            email_input_button = await driver.findElement(By.id("inputEmail")); // username input field xpath
        });

        it("should not accept an empty email", async () => {
            await register_button.click(); // click so message is validated

            let validationMessage = await email_input_button.getProperty("validationMessage");
            let validationStatus = await email_input_button.getProperty("validity");
            let isValueMissing = validationStatus["valueMissing"]; // validationStatus is an object

            expect(isValueMissing).toBe(true);
            expect(validationMessage).toBe("Please fill out this field.");
        });

        it("should not accept an email without the @ symbol", async () => {
            await email_input_button.sendKeys("badEmail")
            
            await register_button.click(); // click so message is validated

            let validationMessage = await email_input_button.getProperty("validationMessage");
            let validationStatus = await email_input_button.getProperty("validity");
            let isBadInput = validationStatus["typeMismatch"]; // validationStatus is an object
            
            const no_at_symbol_substring = "Please include an '@' in the email address.";

            expect(isBadInput).toBe(true);
            expect(validationMessage).toContain(no_at_symbol_substring);
        });

        it("should not accept an email with only the @ symbol", async () => {
            await email_input_button.sendKeys("@")
            
            await register_button.click(); // click so message is validated

            let validationMessage = await email_input_button.getProperty("validationMessage");
            let validationStatus = await email_input_button.getProperty("validity");
            let isBadInput = validationStatus["typeMismatch"]; // validationStatus is an object
            
            const no_string_follow_at_symbol = "Please enter a part followed by '@'. '@' is incomplete.";

            expect(isBadInput).toBe(true);
            expect(validationMessage).toEqual(no_string_follow_at_symbol);
        });

        it("should not accept an email with in this format: x@, where x is any alphanumeric character", async () => {
            await email_input_button.sendKeys("abc123@");
            
            await register_button.click(); // click so message is validated

            let validationMessage = await email_input_button.getProperty("validationMessage");
            let validationStatus = await email_input_button.getProperty("validity");
            let isBadInput = validationStatus["typeMismatch"]; // validationStatus is an object
            
            const no_string_follow_at_symbol = "Please enter a part following '@'. 'abc123@' is incomplete.";

            expect(isBadInput).toBe(true);
            expect(validationMessage).toEqual(no_string_follow_at_symbol);
        });

        it("should not accept an email with in this format: x@x, where x is any alphanumeric character", async () => {
            // yeah input validation fails here, email needs the ".com"
            
            await email_input_button.sendKeys("abc123@abc123")
            
            await register_button.click(); // click so message is validated

            let validationMessage = await email_input_button.getProperty("validationMessage");
            let validationStatus = await email_input_button.getProperty("validity");
            let isBadInput = validationStatus["typeMismatch"]; // validationStatus is an object
            
            const no_string_follow_at_symbol = "Please enter a part followed by '@'. 'abc123@abc123' is incomplete.";

            expect(isBadInput).toBe(true);
            expect(validationMessage).toEqual(no_string_follow_at_symbol);
        });

        it("should not accept an email in this format: .x, where x is the domain", async () => {
            await email_input_button.sendKeys(".com")
            
            await register_button.click(); // click so message is validated

            let validationMessage = await email_input_button.getProperty("validationMessage");
            let validationStatus = await email_input_button.getProperty("validity");
            let isBadInput = validationStatus["typeMismatch"]; // validationStatus is an object
            
            const no_at_symbol_substring = "Please include an '@' in the email address.";

            expect(isBadInput).toBe(true);
            expect(validationMessage).toContain(no_at_symbol_substring);
        });

        it("it should accept an email in this format: x@x.y, where x is any alphanumeric character and y is any domain", async () => {
            await email_input_button.sendKeys("abc@abc.com")

            await register_button.click(); // click so message is validated

            let validationStatus = await email_input_button.getProperty("validity");
            let isValid = validationStatus["valid"]; // validationStatus is an object

            expect(isValid).toBe(true);
        });
    });
});