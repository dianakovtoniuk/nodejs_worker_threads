import cluster from "node:cluster";
import os from "node:os";

if (cluster.isPrimary) {
  const coreCount = os.availableParallelism();
  for (let i = 0; i < coreCount; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died (${signal} | ${code}). Restarting...`
    );
    cluster.fork();
  });
} else {
  require("./index");
}
