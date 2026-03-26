package com.salesforce.tests;

import com.salesforce.pages.LoginPage;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;
import org.openqa.selenium.TimeoutException;

import java.time.Duration;

public class ValidLoginTest {
    private WebDriver driver;
    private LoginPage loginPage;

    @BeforeTest
    public void setup() {
        try {
            WebDriverManager.chromedriver().setup();
            ChromeOptions options = new ChromeOptions();
            options.addArguments("--remote-allow-origins=*");
            driver = new ChromeDriver(options);
            driver.manage().window().maximize();
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
            driver.get("https://login.salesforce.com/?locale=in");
            loginPage = new LoginPage(driver);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Test
    public void testValidLogin() {
        try {
            loginPage.doLogin("valid.user@salesforce.com", "ValidPassword123!");
            Assert.assertTrue(driver.getCurrentUrl().contains("lightning") || driver.getCurrentUrl().contains("home"), "URL does not contain expected text post-login");
        } catch (TimeoutException e) {
            Assert.fail("Element not found: " + e.getMessage());
        } catch (Exception e) {
            Assert.fail(e.getMessage());
        }
    }

    @AfterTest
    public void teardown() {
        try {
            if (driver != null) {
                driver.quit();
            }
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }
}
