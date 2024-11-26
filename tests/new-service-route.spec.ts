import { chromium, Browser, Page } from 'playwright';
import { assert } from 'chai';
import { config } from '../config';
import { WorkspacesPage } from '../pages/workspaces.page';
import { WorkspaceOverviewPage } from '../pages/workspace-overview.page';
import { NewGatewayServicePage } from '../pages/new-gateway-service.page';
import { deleteAllServicesConcurrently } from '../utils/service.api';
import { deleteAllRoutesConcurrently } from '../utils/route.api';
import { GatewayServiceTablePage } from '../pages/gateway-service-table.page';
import { GatewayService } from "../entities/gateway-service";
import { GatewayServiceDetailPage } from '../pages/gateway-service-detail.page';
import { SideBar } from '../entities/sidebar-item';
import { Route } from '../entities/route';
import { RouteTablePage } from '../pages/route-table.page';
import { NewRoutePage } from '../pages/new-route.page';
import { RouteDetailPage } from '../pages/route-detail.page';
import * as fs from 'fs';
import * as path from 'path';
import { convertToObject, buildUrl } from '../utils/data-converter';

const testDataPath = path.resolve(__dirname, '../testdata/service-route.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));

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
  let routeDetailePage: RouteDetailPage;

  before(async () => {
    console.log("Deleting all routes");
    await deleteAllRoutesConcurrently();

    console.log("Deleting all services");
    await deleteAllServicesConcurrently();
    browser = await chromium.launch(config.browserOptions);
    const context = await browser.newContext(config.browserContextOptions);
    context.setDefaultTimeout(config.timeout);

    page = await context.newPage();
    workspacesPage = new WorkspacesPage(page);
    workspacesOverviewPage = new WorkspaceOverviewPage(page);
    createGatewayServicePage = new NewGatewayServicePage(page);
    gatewayServiceTablePage = new GatewayServiceTablePage(page);
    gatewayServiceDetailPage = new GatewayServiceDetailPage(page);
    routeTablePage = new RouteTablePage(page);
    createRoutePage = new NewRoutePage(page);
    routeDetailePage = new RouteDetailPage(page);
  });

  after(async () => {
    await browser.close();
  });

  afterEach(async function () {
    if (this.currentTest?.state === 'failed') {
      const screenshotDir = path.resolve(__dirname, 'screenshots');
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir);
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

      const screenshotPath = path.join(
        screenshotDir,
        `${this.currentTest.title?.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.png`
      );
      await page.screenshot({ path: screenshotPath });
      console.log(`Screenshot saved at: ${screenshotPath}`);
    }
  });

  testData.forEach(({ service }: { service: any}) => {
    let serviceData: GatewayService = convertToObject(service);
    it(`Create one gateway service ${serviceData.name} and one related route`, async () => {
      console.log("Navigating to workspace page.");
      await workspacesPage.navigateTo(config.baseURL);

      console.log("Selecting default workspace.");
      await workspacesPage.selectWorkspace('default');

      console.log("Adding new gateway service.");
      await workspacesOverviewPage.clickAddGateWayServiceButton();
      await createGatewayServicePage.fillName(serviceData.name);
      await createGatewayServicePage.fillTags(serviceData.tags.join(','));
      await createGatewayServicePage.fillUpstreamURL(buildUrl(serviceData.protocol, serviceData.host, serviceData.port, serviceData.path));

      console.log("Saving new gateway service.");
      await createGatewayServicePage.clickSaveButton();
      await gatewayServiceDetailPage.waitForPageLoad();

      console.log("Fetching detail info of created service from detail page.");
      let gatewayServiceDetail = await gatewayServiceDetailPage.extractGatewayServiceDetailInfo();

      console.log("Verifying gateway service shown in detail page.");
      assert.isTrue(gatewayServiceDetail.equal(serviceData), "Gateway service created via UI in detail page should be same as testdata.");

      console.log("Navigating service list page.");
      await gatewayServiceDetailPage.sideBar.clickMenuItem(SideBar.GatewayService);
      await gatewayServiceTablePage.waitForPageLoad();

      console.log("Fetching detail info of created service from table.");
      let gatewayServices: GatewayService[] = await gatewayServiceTablePage.getGatewayServices();

      console.log("Verifying gateway service shown in table page.");
      assert.equal(gatewayServices.length, 1, "One service should be shown in table page.");
      assert.isTrue(gatewayServices[0].equal(serviceData), "Gateway service created via UI in table page should be same as testdata.");

      console.log("Navigating route list page.");
      await gatewayServiceDetailPage.sideBar.clickMenuItem(SideBar.Routes);
      await routeTablePage.clickNewRouteButton();

      console.log("Creating new route for servcie.");
      await createRoutePage.fillName(serviceData.routes[0].name);
      await createRoutePage.fillTags(serviceData.routes[0].tags.join(','));
      await createRoutePage.selectServiceMenuItem(serviceData.routes[0].serviceName);
      await createRoutePage.selectProtocolsMenuItem(serviceData.routes[0].protocols[0].toUpperCase());
      await createRoutePage.fillRoutingRulePath(serviceData.routes[0].paths[0]);
      await createRoutePage.clickSaveButton();

      console.log("Fetching detail info of created route from table.");
      await routeTablePage.waitForPageLoad();
      let routes: Route[] = await routeTablePage.parseRoutesFromTable(serviceData.routes[0].serviceName);
      assert.equal(routes.length, 1, "One route should be shown in table page.");
      assert.isTrue(routes[0].equal(serviceData.routes[0]), "Route created via UI in table page should be same as testdata.");

      console.log("Selecting created route from table.");
      await routeTablePage.selectRouteByName(serviceData.routes[0].name);

      console.log("Fetching detail info of route from detail page.");
      await routeDetailePage.waitForPageLoad();
      let routeDetailedInfo: Route = await routeDetailePage.extractRouteDetailInfo();

      console.log("Verifying route shown in detail page.");
      assert.isTrue(routeDetailedInfo.equal(serviceData.routes[0]), "Route created via UI in detail page should be same as testdata.");
    });
  });
});
