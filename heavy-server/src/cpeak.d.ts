// cpeak does not ship type declarations, so this describes the parts we use.
declare module "cpeak" {
  import type { IncomingMessage, ServerResponse } from "node:http";

  class Cpeak {
    constructor();
    route(method: Cpeak.Method, path: string, cb: Cpeak.RouteHandler): void;
    beforeEach(cb: Cpeak.Middleware): void;
    handleErr(cb: Cpeak.ErrorHandler): void;
    listen(port: number, cb: () => void): void;

    static parseJSON: Cpeak.Middleware;
    static serveStatic(
      folderPath: string,
      newMimeTypes?: Record<string, string>
    ): Cpeak.Middleware;
  }

  namespace Cpeak {
    type Method = "get" | "post" | "put" | "patch" | "delete";

    interface Request extends IncomingMessage {
      // Query string parameters
      params: URLSearchParams;
      // Set by Cpeak.parseJSON
      body?: unknown;
      // Set by the authentication middleware
      userId?: number;
    }

    interface Response extends ServerResponse {
      sendFile(path: string, mime: string): Promise<void>;
      status(code: number): Response;
      json(data: unknown): void;
    }

    type Middleware = (req: Request, res: Response, next: () => void) => void;

    type RouteHandler = (
      req: Request,
      res: Response,
      handleErr: (error: unknown) => void
    ) => void;

    type ErrorHandler = (error: unknown, req: Request, res: Response) => void;
  }

  export = Cpeak;
}
