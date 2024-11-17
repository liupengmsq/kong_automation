import { Route } from "./route";
export class GatewayService {
  name: string;
  protocol: string;
  host: string;
  port: number;
  path: string | null;
  enabled: boolean;
  tags: string[];
  routes: Route[];

  constructor(name: string, protocol: string, host: string, port: number, path: string | null, enabled: boolean, tags: string[], routes: Route[] = []) {
    this.name = name;
    this.protocol = protocol;
    this.host = host;
    this.port = port;
    this.path = path;
    this.enabled = enabled;
    this.tags = tags;
    this.routes = routes;
  }

  equal(other: GatewayService): boolean {
    return (
      this.name === other.name &&
      this.protocol === other.protocol &&
      this.host === other.host &&
      this.port === other.port &&
      this.path === other.path &&
      this.enabled === other.enabled &&
      this.compareTags(other.tags)
    );
  }

  private compareTags(otherTags: string[]): boolean {
    if (this.tags.length !== otherTags.length) {
      return false;
    }

    return this.tags.sort().join(',') === otherTags.sort().join(',');
  }

  getServiceDetails(): string {
    return `
        Name: ${this.name}
        Protocol: ${this.protocol}
        Host: ${this.host}
        Port: ${this.port}
        Path: ${this.path ?? 'No Path'}
        Enabled: ${this.enabled ? 'Yes' : 'No'}
        Tags: ${this.tags.join(', ')}
      `;
  }
}
