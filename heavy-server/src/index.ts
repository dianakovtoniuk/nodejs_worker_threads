import Cpeak from "cpeak";
import { serveIndex, authenticate } from "./middleware";
import apiRouter from "./router";
import type { HttpError } from "./types";

const PORT = 8090;

const server = new Cpeak();

// ------ Middlewares ------ //

// For serving static files
server.beforeEach(Cpeak.serveStatic("./public"));

// For parsing JSON body
server.beforeEach(Cpeak.parseJSON);

// For different routes that need the index.html file
server.beforeEach(serveIndex);

server.beforeEach(authenticate);

// ------ API Routes ------ //
apiRouter(server);

const isHttpError = (error: unknown): error is HttpError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error
  );
};

// Handle all the errors that could happen in the routes
server.handleErr((error, req, res) => {
  if (isHttpError(error)) {
    res.status(error.status).json({ error: error.message });
  } else {
    console.error(error);
    res.status(500).json({
      error: "Sorry, something unexpected happened from our side.",
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
