export class Route {
  public name: string;
  public protocols: string[];
  public hosts: string[];
  public methods: string[];
  public paths: string[];
  public tags: string[];

  constructor(name: string, protocols: string[], hosts: string[], methods: string[], paths: string[], tags: string[]) {
    this.name = name;
    this.protocols = protocols;
    this.hosts = hosts;
    this.methods = methods;
    this.paths = paths;
    this.tags = tags;
  }

  /**
 * Compares this Route object with another Route object.
 * @param other - Another Route object.
 * @returns boolean - Returns true if all fields match, otherwise false.
 */
  public equal(other: Route): boolean {
    return (
      this.name === other.name &&
      this.arraysEqual(this.protocols, other.protocols) &&
      this.arraysEqual(this.hosts, other.hosts) &&
      this.arraysEqual(this.methods, other.methods) &&
      this.arraysEqual(this.paths, other.paths) &&
      this.arraysEqual(this.tags, other.tags)
    );
  }

  /**
   * Returns the details of the Route object as a formatted string.
   * @returns string - Details of the Route.
   */
  public getRouteDetails(): string {
    return `
      Name: ${this.name}
      Protocols: ${this.protocols.join(', ') || 'None'}
      Hosts: ${this.hosts.join(', ') || 'None'}
      Methods: ${this.methods.join(', ') || 'None'}
      Paths: ${this.paths.join(', ') || 'None'}
      Tags: ${this.tags.join(', ') || 'None'}
      `;
  }

  /**
   * Compares two arrays for equality.
   * @param arr1 - First array.
   * @param arr2 - Second array.
   * @returns boolean - True if arrays are equal, otherwise false.
   */
  private arraysEqual(arr1: string[], arr2: string[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }
    return arr1.every((value, index) => value === arr2[index]);
  }
}
