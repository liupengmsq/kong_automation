import { BasePage } from "./base.page";

export class WorkspaceOverviewPage extends BasePage {
  private static readonly ADD_GATEWAY_SERVICE_BUTTON = 'Add a Gateway Service';

  async clickAddGateWayServiceButton() {
    await this.clickButtonByName(WorkspaceOverviewPage.ADD_GATEWAY_SERVICE_BUTTON);
  }
}