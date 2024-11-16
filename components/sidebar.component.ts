import { Locator, Page } from '@playwright/test';

export class SidebarComponent {
  private readonly container: Locator;
  private static readonly CONTAINER_SELECTOR = "//*[@id='subnav-workspace']";
  private static readonly SIDEBAR_ITEM_SELECTOR = 'li.sidebar-item-secondary';
  private static readonly ACTIVE_ITEM_SELECTOR = 'li.sidebar-item-secondary.active';
  private static readonly ITEM_NAME_SELECTOR = '.sidebar-item-name';

  constructor(page: Page) {
    this.container = page.locator(SidebarComponent.CONTAINER_SELECTOR);
  }

  async getMenuItems(): Promise<string[]> {
    const items = await this.container.locator(SidebarComponent.SIDEBAR_ITEM_SELECTOR).locator(SidebarComponent.ITEM_NAME_SELECTOR).allTextContents();
    return items.map((item) => item.trim());
  }

  async getActiveMenuItem(): Promise<string> {
    const activeItem = this.container.locator(SidebarComponent.ACTIVE_ITEM_SELECTOR).locator(SidebarComponent.ITEM_NAME_SELECTOR);
    return (await activeItem.textContent())?.trim() || '';
  }

  async clickMenuItem(menuItemName: string): Promise<void> {
    const item = this.container.locator(SidebarComponent.SIDEBAR_ITEM_SELECTOR).filter({
      hasText: menuItemName,
    });
    await item.click();
  }
}
