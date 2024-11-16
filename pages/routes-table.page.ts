import { BasePage } from "./base.page";
import { Route } from "../entities/route";
import { Locator } from "playwright";

export class RouteTablePage extends BasePage {
  private static readonly NEW_ROUTE_BUTTON = "//a[@data-testid='new-route']";
  private static readonly TABLE_TR = "table tbody tr";

  async clickNewRouteButton() {
    await this.clickButtonByLocator(RouteTablePage.NEW_ROUTE_BUTTON);
  }
  async parseRoutesFromTable(): Promise<Route[]> {
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

      routes.push(new Route(name, protocols, hosts, methods, paths, tags));
    }

    return routes;
  }

  /**
   * Helper function to parse multiple items from badge-like elements in table cells.
   * @param row - The row element.
   * @param locator - Locator string for the column containing multiple items.
   */
  private async getMultipleItems(row: Locator, locator: string): Promise<string[]> {
    const items = await row.locator(`${locator} .badge-content-wrapper`).allInnerTexts();
    return items.length ? items : ['-'];
  }
}