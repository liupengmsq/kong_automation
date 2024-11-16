import { Page } from 'playwright';
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

  async isPageLoaded(): Promise<boolean> {
    try {
      await this.page.waitForFunction(() => document.readyState === 'complete');
      return true;
    } catch (error) {
      console.error('Page load check failed:', error);
      return false;
    }
  }
}
