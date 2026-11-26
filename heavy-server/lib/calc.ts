import { workerData, parentPort } from "node:worker_threads";
import generatePrimes from "./prime-generator";

interface PrimeWorkerData {
  count: number;
  start: number | bigint;
}

const { count, start }: PrimeWorkerData = workerData;

const primes = generatePrimes(count, start, {
  format: true,
});

parentPort?.postMessage(primes);
