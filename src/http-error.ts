export class HTTPError extends Error {
  public statusCode : number;

  constructor(m: string, statusCode?: number) {
    super(m);
    this.statusCode = statusCode || 500;
  }
}