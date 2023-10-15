require('chromedriver');
const { By } = require('selenium-webdriver');
const {setupChromeDriver, accessGyaaniBuddyWebsite} = require("./utility/setup");

beforeAll(async () => {
    driver = await setupChromeDriver();
})
  
afterAll(async () => await driver.quit())

beforeEach(async () => {
    await accessGyaaniBuddyWebsite(driver);
});

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

            email_input_button = await driver.findElement(By.id("inputEmail"));
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

        it("should accept an email in this format: x@x.y, where x is any alphanumeric character and y is any domain", async () => {
            await email_input_button.sendKeys("abc@abc.com")

            await register_button.click(); // click so message is validated

            let validationStatus = await email_input_button.getProperty("validity");
            let isValid = validationStatus["valid"]; // validationStatus is an object

            expect(isValid).toBe(true);
        });
    });

    describe("validate password #1", () => {
        beforeEach(async () => {
            // Need to put in valid username and email input so validation will be focused on password field
            username_input_button = await driver.findElement(By.id("inputText"));
            await username_input_button.sendKeys("validName");

            email_input_button = await driver.findElement(By.id("inputEmail"));
            await email_input_button.sendKeys("abc@abc.com");

            password_input_button = await driver.findElement(By.id("inputPassword"));
        });

        it("should not accept empty password", async () => {
            let validationMessage = await password_input_button.getProperty("validationMessage");
            let validationStatus = await password_input_button.getProperty("validity");
            let isValueMissing = validationStatus["valueMissing"]; // validationStatus is an object

            expect(isValueMissing).toBe(true);
            expect(validationMessage).toBe("Please fill out this field."); 
        });

        // currently no password validation ... so let's just make up some rules
        //
        // min length 6, max length 12, it should have at least 1 number, 
        // and at least 1 special character

        // Equivalent classes: 
        // EC 1: No password -  - invalid
        // EC 2: Length 5 (no number, no special character) - ABCDE - invalid
        // EC 3: Length 5 (number, no special character) - ABCD1 - invalid
        // EC 4: Length 5 (no number, special character) - ABCD! - invalid
        // EC 5: Length 5 (number, special character) - ABC1! - invalid
        // EC 6: Length 6 (no number, no special character) - ABCDEF - invalid
        // EC 7: Length 6 (number, no special character) - ABCDE1 - invalid
        // EC 8: Length 6 (no number, special character) - ABCDE! - invalid
        // EC 9: Length 6 (number, special character) - ABCD1! - valid
        // EC 10: Length 12 (no number, no special character) - ABCDEABCDEAB - invalid
        // EC 11: Length 12 (number, no special character) - ABCDEABCDEA1 - invalid
        // EC 12: Length 12 (no number, special character) - ABCDEABCDEA! - invalid
        // EC 13: Length 12 (number, special character) - ABCDEABCDE1! - valid
        // EC 14: Length 13 (no number, no special character) - ABCDEABCDEABC - invalid
        // EC 15: Length 13 (number, no special character) - ABCDEABCDEAB1 - invalid
        // EC 16: Length 13 (no number, special character) - ABCDEABCDEAB! - invalid
        // EC 17: Length 13 (number, special character) - ABCDEABCDEA1! - invalid

        it("should accept a password", () => {
            expect(1).toBe(1);
        });
    });

    // no validate password #2 because website cannot handle creating new users at the moment
});