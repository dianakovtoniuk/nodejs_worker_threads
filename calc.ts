import { workerData, parentPort } from "node:worker_threads";

/*
const port = workerData.port;

port.postMessage("some text for testing");

port.on("message", (msg) => {
  console.log("Worker received: ", msg);
});
*/

const port = parentPort;

if (!port) {
  throw new Error("This file must run inside a worker thread.");
}

port.postMessage("some text for testing");

port.on("message", (msg) => {
  console.log("Worker received: ", msg);
});
