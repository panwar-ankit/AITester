package com.salesforce.pages;

import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class LoginPage {
    private WebDriver driver;
    private WebDriverWait wait;

    @FindBy(xpath = "//input[@id='username']")
    private WebElement username;

    @FindBy(xpath = "//input[@id='password']")
    private WebElement password;

    @FindBy(xpath = "//input[@id='Login']")
    private WebElement loginButton;

    @FindBy(xpath = "//div[@id='error']")
    private WebElement errorMessage;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        PageFactory.initElements(driver, this);
    }

    public void enterUsername(String user) throws TimeoutException {
        try {
            wait.until(ExpectedConditions.visibilityOf(username)).clear();
            username.sendKeys(user);
        } catch (TimeoutException e) {
            throw new TimeoutException(e.getMessage());
        }
    }

    public void enterPassword(String pass) throws TimeoutException {
        try {
            wait.until(ExpectedConditions.visibilityOf(password)).clear();
            password.sendKeys(pass);
        } catch (TimeoutException e) {
            throw new TimeoutException(e.getMessage());
        }
    }

    public void clickLogin() throws TimeoutException {
        try {
            wait.until(ExpectedConditions.elementToBeClickable(loginButton)).click();
        } catch (TimeoutException e) {
            throw new TimeoutException(e.getMessage());
        }
    }

    public void doLogin(String user, String pass) throws TimeoutException {
        enterUsername(user);
        enterPassword(pass);
        clickLogin();
    }

    public String getErrorMessage() throws TimeoutException {
        try {
            return wait.until(ExpectedConditions.visibilityOf(errorMessage)).getText();
        } catch (TimeoutException e) {
            throw new TimeoutException(e.getMessage());
        }
    }
}
