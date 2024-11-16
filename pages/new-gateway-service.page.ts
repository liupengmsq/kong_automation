import { BasePage } from "./base.page";

export class NewGatewayServicePage extends BasePage {
  private static readonly NAME_TEXTBOX = "//input[@name='name']";
  private static readonly TAGS_TEXTBOX = "//input[@name='tags']";
  private static readonly UPSTREAM_URL_TEXTBOX = "//input[@name='url']";
  private static readonly SAVE_BUTTON = 'Save';

  async fillName(name: string) {
    await this.fillInput(NewGatewayServicePage.NAME_TEXTBOX, name);
  }

  async fillTags(tags: string) {
    await this.fillInput(NewGatewayServicePage.TAGS_TEXTBOX, tags);
  }

  async fillUpstreamURL(url: string) {
    await this.fillInput(NewGatewayServicePage.UPSTREAM_URL_TEXTBOX, url);
  }

  async clickSaveButton() {
    await this.clickButtonByName(NewGatewayServicePage.SAVE_BUTTON);
  }
}