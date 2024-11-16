import { BasePage } from './base.page';

export class WorkspacesPage extends BasePage {
  private getWorkspaceItemXPath(name: string): string {
    return `//*[@class='workspace-name' and text() = '${name}']`;
  }

  async selectWorkspace(name: string) {
    const workspaceXPath = this.getWorkspaceItemXPath(name);
    await this.page.click(workspaceXPath);
  }
}
