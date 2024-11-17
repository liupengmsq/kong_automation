import { BasePage } from "./base.page";
import { Route } from "../entities/route";
import { Locator } from "playwright";

export class RouteTablePage extends BasePage {
  private static readonly NEW_ROUTE_BUTTON = "//a[@data-testid='new-route']";
  private static readonly TABLE_TR = "table tbody tr";

  async waitForPageLoad() {
    await super.waitForPageLoad(RouteTablePage.TABLE_TR);
  }

  private getRouteItemXPath(name: string): string {
    return `//tr[@data-testid="${name}"]`;
  }

  async clickNewRouteButton() {
    await this.clickButtonByLocator(RouteTablePage.NEW_ROUTE_BUTTON);
  }

  async selectRouteByName(name: string) {
    await this.clickButtonByLocator(this.getRouteItemXPath(name));
  }

  async parseRoutesFromTable(serviceName: string): Promise<Route[]> {
    const rows = await this.page.locator(RouteTablePage.TABLE_TR);

    const routes: Route[] = [];
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);

      const name = await row.locator('[data-testid="name"]').innerText();
      const protocols = await this.getMultipleItems(row, '[data-testid="protocols"]');
      const hosts = await this.getMultipleItems(row, '[data-testid="hosts"]');
      const methods = await this.getMultipleItems(row, '[data-testid="methods"]');
      const paths = await this.getMultipleItems(row, '[data-testid="paths"]');
      const tags = await this.getMultipleItems(row, '[data-testid="tags"]');

      routes.push(new Route(name, serviceName, protocols, hosts, methods, paths, tags));
    }

    return routes;
  }

  private async getMultipleItems(row: Locator, locator: string): Promise<string[]> {
    const items = await row.locator(`${locator} .badge-content-wrapper`).allInnerTexts();
    return items.length ? items : ['-'];
  }
}