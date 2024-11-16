import { chromium, Browser, Page } from 'playwright';
import { expect } from 'chai';
import { WorkspacesPage } from '../pages/workspaces.page';
import { WorkspaceOverviewPage } from '../pages/workspace-overview.page';
import { NewGatewayServicePage } from '../pages/new-gateway-service.page';
import { deleteAllServicesConcurrently } from '../utils/service.api';
import { deleteAllRoutesConcurrently } from '../utils/route.api';
import { GatewayServiceTablePage } from '../pages/gateway-service-table.page';
import { GatewayService } from "../entities/gateway-service";
import { GatewayServiceDetailPage } from '../pages/gateway-service-detail.page';
import { SideBar } from '../entities/sidebar-item';
import { RouteTablePage } from '../pages/routes-table.page';
import { NewRoutePage } from '../pages/new-route.page';
import { Route } from '../entities/route';

describe('Playwright with Mocha and Chai', function () {
  let browser: Browser;
  let page: Page;
  let workspacesPage: WorkspacesPage;
  let workspacesOverviewPage: WorkspaceOverviewPage;
  let createGatewayServicePage: NewGatewayServicePage;
  let gatewayServiceTablePage: GatewayServiceTablePage;
  let gatewayServiceDetailPage: GatewayServiceDetailPage;
  let routeTablePage: RouteTablePage;
  let createRoutePage: NewRoutePage;

  before(async () => {
    console.log("Deleting all routes");
    await deleteAllRoutesConcurrently();

    console.log("Deleting all services");
    await deleteAllServicesConcurrently();

    // Launching browser with maximized window size
    browser = await chromium.launch({ 
      // headless: false, 
      headless: true, 
      args: ['--start-maximized']});
    const context = await browser.newContext({
      // viewport: null,
      viewport: { width: 1920, height: 1080 }, 
    });
    page = await context.newPage();

    workspacesPage = new WorkspacesPage(page);
    workspacesOverviewPage = new WorkspaceOverviewPage(page);
    createGatewayServicePage = new NewGatewayServicePage(page);
    gatewayServiceTablePage = new GatewayServiceTablePage(page);
    gatewayServiceDetailPage = new GatewayServiceDetailPage(page);
    routeTablePage = new RouteTablePage(page);
    createRoutePage = new NewRoutePage(page);
  });

  after(async () => {
    await browser.close();
  });

  it('Create one gateway service and one related route', async () => {
    console.log("Navigating to workspace page.");
    await workspacesPage.navigateTo('http://localhost:8002/');

    console.log("Selecting default workspace.");
    await workspacesPage.selectWorkspace('default');

    console.log("Adding new gateway service.");
    await workspacesOverviewPage.clickAddGateWayServiceButton();
    await createGatewayServicePage.fillName("service2");
    await createGatewayServicePage.fillTags("tag1,tag2,tag3");
    await createGatewayServicePage.fillUpstreamURL("https://www.test.com");

    console.log("Saving new gateway service.");
    await createGatewayServicePage.clickSaveButton();

    console.log("Fetching detail info of created service from detail page.");
    let gatewayServiceDetail = await gatewayServiceDetailPage.extractGatewayServiceDefailInfo();

    console.log("Navigating service list page.");
    await gatewayServiceDetailPage.sideBar.clickMenuItem(SideBar.GatewayService);

    console.log("Fetching detail info of created service from table.");
    let gatewayServices: GatewayService[] = await gatewayServiceTablePage.getGatewayServices();
    for (let g of gatewayServices) {
      console.log(g.getServiceDetails());
    }

    console.log("Navigating route list page.");
    await gatewayServiceDetailPage.sideBar.clickMenuItem(SideBar.Routes);
    await routeTablePage.clickNewRouteButton();

    console.log("Creating new route for servcie.");
    await createRoutePage.fillName("route2");
    await createRoutePage.fillTags("tag1,tag2,tag3");
    await createRoutePage.selectServiceMenuItem("service2");
    await createRoutePage.selectProtocolsMenuItem("HTTPS");
    await createRoutePage.fillRoutingRulePath("/test");
    await createRoutePage.clickSaveButton();

    console.log("Fetching detail info of created route from table.");
    let routes: Route[] = await routeTablePage.parseRoutesFromTable();
    for (let r of routes) {
      console.log(r.getRouteDetails());
    }
  });
});
