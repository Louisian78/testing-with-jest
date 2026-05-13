const { Builder, By } = require('selenium-webdriver');
require('geckodriver');

const fileUnderTest = 'file://' + __dirname.replaceAll(/ /g, '%20').replaceAll(/\\/g, '/') + '/../dist/index.html';

const defaultTimeout = 10000;
let driver;

jest.setTimeout(1000 * 60 * 5);

beforeAll(async () => {
    driver = await new Builder().forBrowser('firefox').build();
    await driver.get(fileUnderTest);
});

afterAll(async () => {
    await driver.quit();
}, defaultTimeout);

test('The stack should be empty in the beginning', async () => {
    let stack = await driver.findElement(By.id('top_of_stack')).getText();
    expect(stack).toEqual("n/a");
});

describe('Clicking "Pusha till stacken"', () => {
    it('should open a prompt box', async () => {
        let push = await driver.findElement(By.id('push'));
        await push.click();

        let alert = await driver.switchTo().alert();
        await alert.sendKeys("Bananer");
        await alert.accept();
    });
});

test('Popping the last item should reset the display to n/a', async () => {
    await driver.get(fileUnderTest);

    let push = await driver.findElement(By.id('push'));
    await push.click();

    let prompt = await driver.switchTo().alert();
    await prompt.sendKeys("Äpple");
    await prompt.accept();

    let pop = await driver.findElement(By.id('pop'));
    await pop.click();

    let alert = await driver.switchTo().alert();
    await alert.accept();

    let stackText = await driver.findElement(By.id('top_of_stack')).getText();
    expect(stackText).toEqual("n/a");

});

test('The page heading should have an exlcamation mark at the end', async () => {
    await driver.get(fileUnderTest);

    let heading = await driver.findElement(By.tagName('h1')).getText();

    expect(heading).toEqual("Här kan vi leka med en stack!")
});