import { Locator, Page } from 'playwright';
import { SidebarComponent } from '../components/sidebar.component';

export class BasePage {
  protected page: Page;
  readonly sideBar: SidebarComponent;

  constructor(page: Page) {
    this.page = page;
    this.sideBar = new SidebarComponent(page)
  }

  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async clickButtonByName(buttonName: string) {
    const button = this.page.locator(`button:has-text("${buttonName}")`);
    await button.click();
  }

  async clickButtonByLocator(buttonLocator: string) {
    const button = this.page.locator(buttonLocator);
    await button.click();
  }

  async waitForElement(selector: string) {
    await this.page.waitForSelector(selector);
  }

  async fillInput(selector: string, text: string) {
    await this.page.locator(selector).fill(text);
  }

  async waitForPageLoad(selector: string, timeout: number = 5000) {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible', timeout: timeout });
  }

  async waitForPageLoadByLocator(locator: Locator, timeout: number = 5000) {
      await locator.waitFor({ state: 'visible', timeout: timeout });
  }

  async waitForDataLoad(apiUrlPart: string, selector: string = '', timeout: number = 5000): Promise<any> {
    const response = await this.page.waitForResponse(
      (res) =>
        res.url().includes(apiUrlPart) && res.status() === 200,
      { timeout }
    );

    const responseData = await response.json();
    console.log('API Response Data:', responseData);

    if(selector !== '') {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible' });
    }

    return responseData;
  }
}
