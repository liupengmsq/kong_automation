import { BasePage } from "./base.page";

export class NewRoutePage extends BasePage {
  private static readonly NAME_TEXTBOX = "//input[@data-testid='route-form-name']";
  private static readonly TAGS_TEXTBOX = "//input[@data-testid='route-form-tags']";
  private static readonly SERVICE_TEXTBOX = "//input[@data-testid='route-form-service-id']";
  private static readonly PROTOCOLS_DROPDOWN_TOGGLE = "//input[@data-testid='route-form-protocols']";
  private static readonly ROUTING_RULE_PATH = "//input[@data-testid='route-form-paths-input-1']";
  private static readonly SAVE_BUTTON = 'Save';

  async fillName(name: string) {
    await this.fillInput(NewRoutePage.NAME_TEXTBOX, name);
  }

  async fillTags(tags: string) {
    await this.fillInput(NewRoutePage.TAGS_TEXTBOX, tags);
  }

  async fillRoutingRulePath(path: string) {
    await this.fillInput(NewRoutePage.ROUTING_RULE_PATH, path);
  }

  async clickSaveButton() {
    await this.clickButtonByName(NewRoutePage.SAVE_BUTTON);
  }

  async selectServiceMenuItem(item: string) {
    await this.clickButtonByLocator(NewRoutePage.SERVICE_TEXTBOX);
    await this.page.locator('.route-form-service-dropdown-item').filter({ 
      hasText: item
    }).click();
  }

  async selectProtocolsMenuItem(item: string) {
    await this.clickButtonByLocator(NewRoutePage.PROTOCOLS_DROPDOWN_TOGGLE);
    await this.page.locator('.select-item').filter({ 
      hasText: new RegExp(`^${item}$`)
    }).click();
  }
}