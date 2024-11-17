import { GatewayService } from "../entities/gateway-service";
import { Route } from "../entities/route";

export function convertToObject(data: any): GatewayService {
  const serviceData = data;

  // Create Route objects
  const routes = serviceData.routes.map((route: any) => {
    return new Route(
      route.name,
      route.serviceName,
      route.protocols,
      route.hosts,
      route.methods,
      route.paths,
      route.tags
    );
  });

  // Create and return GatewayService object
  return new GatewayService(
    serviceData.name,
    serviceData.protocol,
    serviceData.host,
    serviceData.port,
    serviceData.path,
    serviceData.enabled,
    serviceData.tags,
    routes
  );
}

export function buildUrl(protocol: string, host: string, port?: number, path?: string | null): string {
  // Ensure the protocol ends with '://'
  const formattedProtocol = protocol.endsWith("://") ? protocol : `${protocol}://`;

  // Add port to the host if specified and valid
  const formattedHost = port ? `${host}:${port}` : host;

  // Ensure path starts with a slash if it exists and is not null
  const formattedPath = path ? (path.startsWith("/") ? path : `/${path}`) : '';

  // Combine protocol, host, and path
  return `${formattedProtocol}${formattedHost}${formattedPath}`;
}