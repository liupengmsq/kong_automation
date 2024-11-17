import { Locator } from 'playwright';
import { BasePage } from './base.page';
import { Route } from '../entities/route';

export class RouteDetailPage extends BasePage {
  private routeRowLocator: Locator = this.page.locator('.config-card-details-basic-props .config-card-details-row');

  async waitForPageLoad() {
    await super.waitForPageLoad('//*[@data-testid="id-label"]');
  }

  async extractRouteDetailInfo(): Promise<Route> {
    const rowsCount = await this.routeRowLocator.count();

    let name = '';
    let service = '';
    let protocols: string[] = [];
    let hosts: string[] = [];
    let methods: string[] = [];
    let paths: string[] = [];
    let tags: string[] = [];

    for (let i = 0; i < rowsCount; i++) {
      const row = this.routeRowLocator.nth(i);
      const label = await this.getLabel(row);
      const values = await this.getValues(row);

      switch (label) {
        case 'Name':
          name = values[0] || '';
          break;
        case 'Gateway Service':
          service = values[0] || '';
          break;
        case 'Protocols':
          protocols = values;
          break;
        case 'Hosts':
          hosts = values;
          break;
        case 'Methods':
          methods = values;
          break;
        case 'Paths':
          paths = values;
          break;
        case 'Tags':
          tags = values;
          break;
      }
    }

    return new Route(name, service, protocols, hosts, methods, paths, tags);
  }

  private async getLabel(row: Locator): Promise<string> {
    return row.locator('[data-testid$="-label"]').innerText();
  }

  private async getValues(row: Locator): Promise<string[]> {
    const noValueElement = row.locator('[data-testid$="-no-value"]');
    if (await noValueElement.count() > 0) {
      return ['-'];
    }

    return row.locator(
      '[data-testid="id-copy-uuid"], [data-testid="service-property-value"], [data-testid^="tags-badge-tag-"], [data-testid^="protocols-badge-tag-"], .k-copy[data-testid^="paths-copy-uuid-"], [data-testid^="hosts-copy-uuid-"], [data-testid^="methods-badge-method-"], [data-testid$="-plain-text"]'
    ).allInnerTexts();
  }
}
