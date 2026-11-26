import generatePrimes from "./prime-generator";
import { performance } from "node:perf_hooks";

const start = performance.now();

console.log(generatePrimes(10, 100_000_000_000_000_000n));

console.log(`Time Taken: ${performance.now() - start}ms`);
