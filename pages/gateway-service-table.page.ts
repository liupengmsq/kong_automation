import { BasePage } from "./base.page";
import { GatewayService } from "../entities/gateway-service";

export class GatewayServiceTablePage extends BasePage {
  private static readonly TABLE_TR = "table tbody tr";

  async waitForPageLoad() {
    await super.waitForPageLoad(GatewayServiceTablePage.TABLE_TR);
  }

  async getGatewayServices(): Promise<GatewayService[]> {
    const services: GatewayService[] = [];
    const rows = this.page.locator(GatewayServiceTablePage.TABLE_TR);

    for (let i = 0; i < await rows.count(); i++) {
      const row = rows.nth(i);

      const name = await row.locator('[data-testid="name"]').textContent() ?? '';
      const protocol = await row.locator('[data-testid="protocol"]').textContent() ?? '';
      const host = await row.locator('[data-testid="host"]').textContent() ?? '';
      const port = parseInt(await row.locator('[data-testid="port"]').textContent() ?? '0', 10);
      const path = (await row.locator('[data-testid="path"]').textContent())?.trim() || null;
      const enabled = await row.locator('[data-testid="enabled"] input').isChecked();
      const tags = await row.locator('[data-testid="tags"] .badge-content-wrapper').allTextContents();

      const service = new GatewayService(
        name.trim(),
        protocol.trim(),
        host.trim(),
        port,
        path,
        enabled,
        tags.map(tag => tag.trim())
      );

      services.push(service);
    }

    return services;
  }
}