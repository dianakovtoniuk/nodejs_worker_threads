import path from "node:path";
import { Worker } from "node:worker_threads";
import { performance } from "node:perf_hooks";
import type Cpeak from "cpeak";
import * as User from "./controllers/user";

// The worker file is calc.ts when running through tsx and calc.js once compiled
const workerFile = path.join(
  __dirname,
  `../lib/calc${path.extname(__filename)}`
);

export default (server: Cpeak): void => {
  /** Test route */
  server.route("get", "/api/get-json-data", (req, res) => {
    // send a big size json data
    res.json({ data: "This is a big size json data".repeat(100) });
  });

  // ------------------------------------------------ //
  // ************ USER ROUTES ************* //
  // ------------------------------------------------ //

  // Log a user in and give them a token
  server.route("post", "/api/login", User.logUserIn);

  // Log a user out
  server.route("delete", "/api/logout", User.logUserOut);

  // Send user info
  server.route("get", "/api/user", User.sendUserInfo);

  // Update a user info
  server.route("put", "/api/user", User.updateUser);

  // ------------------------------------------------ //
  // ************ PRIME NUMBER ROUTES ************* //
  // ------------------------------------------------ //

  server.route("get", "/api/primes", (req, res, handleErr) => {
    const count = Number(req.params.get("count"));
    const startParam = req.params.get("start");

    if (!Number.isInteger(count) || count < 1) {
      return handleErr({
        status: 400,
        message: "count must be a positive integer.",
      });
    }

    if (startParam === null || !/^\d+$/.test(startParam)) {
      return handleErr({
        status: 400,
        message: "start must be a non-negative integer.",
      });
    }

    const startTime = performance.now();

    let startingNumber: number | bigint = BigInt(startParam);

    if (startingNumber < BigInt(Number.MAX_SAFE_INTEGER)) {
      startingNumber = Number(startingNumber);
    }

    const worker = new Worker(workerFile, {
      workerData: { count, start: startingNumber },
    });

    const t = setTimeout(() => {
      worker.terminate();
      res.status(408).json({ message: "Request time out." });
    }, 5000);

    worker.on("message", (primes: string[]) => {
      clearTimeout(t);
      res.json({
        primes,
        time: ((performance.now() - startTime) / 1000).toFixed(2),
      });
    });

    worker.on("error", (error) => {
      clearTimeout(t);
      handleErr(error);
    });
  });
};
