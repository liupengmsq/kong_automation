import { Locator } from 'playwright';
import { BasePage } from "./base.page";
import { GatewayService } from "../entities/gateway-service";

export class GatewayServiceDetailPage extends BasePage {
  static readonly CONTAINER_SELECTOR = '.kong-ui-gateway-service-entity-config-card';
  static readonly NAME_SELECTOR = '[data-testid="name-property-value"] .attrs-data-text';
  static readonly PROTOCOL_SELECTOR = '[data-testid="protocol-property-value"] .attrs-data-text';
  static readonly HOST_SELECTOR = '[data-testid="host-property-value"] .attrs-data-text';
  static readonly PORT_SELECTOR = '[data-testid="port-property-value"] .attrs-data-text';
  static readonly PATH_SELECTOR = '[data-testid="path-property-value"]';
  static readonly ENABLED_SELECTOR = '[data-testid="enabled-property-value"] .badge-content-wrapper';
  static readonly TAGS_SELECTOR = '[data-testid^="tags-badge-tag"] .badge-content-wrapper';

  async waitForPageLoad() {
    await super.waitForPageLoad(GatewayServiceDetailPage.NAME_SELECTOR);
  }

  private get container(): Locator {
    return this.page.locator(GatewayServiceDetailPage.CONTAINER_SELECTOR);
  }

  async getName(): Promise<string> {
    return (await this.container.locator(GatewayServiceDetailPage.NAME_SELECTOR).textContent())?.trim() || '';
  }

  async getProtocol(): Promise<string> {
    return (await this.container.locator(GatewayServiceDetailPage.PROTOCOL_SELECTOR).textContent())?.trim() || '';
  }

  async getHost(): Promise<string> {
    return (await this.container.locator(GatewayServiceDetailPage.HOST_SELECTOR).textContent())?.trim() || '';
  }

  async getPort(): Promise<number> {
    const portText = await this.container.locator(GatewayServiceDetailPage.PORT_SELECTOR).textContent();
    return parseInt(portText?.trim() || '0', 10);
  }

  async getPath(): Promise<string | null> {
    const pathText = await this.container.locator(GatewayServiceDetailPage.PATH_SELECTOR).textContent();
    const trimmedPath = pathText?.trim();
    return trimmedPath === '–' || !trimmedPath ? null : trimmedPath;
  }

  async isEnabled(): Promise<boolean> {
    const enabledText = await this.container.locator(GatewayServiceDetailPage.ENABLED_SELECTOR).textContent();
    return enabledText?.trim() === 'Enabled';
  }

  async getTags(): Promise<string[]> {
    return (await this.container.locator(GatewayServiceDetailPage.TAGS_SELECTOR).allTextContents()).map((tag: string) => tag.trim());
  }

  async extractGatewayServiceDetailInfo(): Promise<GatewayService> {
    const name = await this.getName();
    const protocol = await this.getProtocol();
    const host = await this.getHost();
    const port = await this.getPort();
    const path = await this.getPath();
    const enabled = await this.isEnabled();
    const tags = await this.getTags();

    return new GatewayService(name, protocol, host, port, path, enabled, tags);
  }
}