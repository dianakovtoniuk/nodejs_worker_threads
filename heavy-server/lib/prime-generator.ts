// Function to check if a number is prime
function isPrime(n: number): boolean {
  if (n <= 1) return false;
  if (n <= 3) return true;

  if (n % 2 === 0 || n % 3 === 0) return false;

  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

// Same isPrime function but with BigInts
function isPrimeBigInt(n: bigint): boolean {
  if (n <= 1n) return false;
  if (n <= 3n) return true;

  if (n % 2n === 0n || n % 3n === 0n) return false;

  for (let i = 5n; i * i <= n; i += 6n) {
    if (n % i === 0n || n % (i + 2n) === 0n) return false;
  }
  return true;
}

// Function to find the next prime number after a given number
function nextPrime(n: number): number {
  if (n <= 1) return 2;
  let prime = n;
  let found = false;

  // Loop continuously until isPrime returns true for a number larger than n
  while (!found) {
    prime++;
    if (isPrime(prime)) {
      found = true;
    }
  }
  return prime;
}

// Same nextPrime function but with BigInts
function nextPrimeBigInt(n: bigint): bigint {
  if (n <= 1n) return 2n;
  let prime = n;
  let found = false;

  // Loop continuously until isPrimeBigInt returns true for a number larger than n
  while (!found) {
    prime++;
    if (isPrimeBigInt(prime)) {
      found = true;
    }
  }
  return prime;
}

// Function to format a number with commas every three digits
function formatNumberWithCommas(number: number | bigint): string {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

interface GenerateOptions {
  format?: boolean;
  log?: boolean;
}

// Infinite loop to generate and print 20-digit prime numbers
function generatePrimes(
  count: number,
  startingNumber: number | bigint | undefined,
  options: { format: true; log?: boolean }
): string[];
function generatePrimes(
  count: number,
  startingNumber?: number,
  options?: { format?: false; log?: boolean }
): number[];
function generatePrimes(
  count: number,
  startingNumber: bigint,
  options?: { format?: false; log?: boolean }
): bigint[];
function generatePrimes(
  count: number,
  startingNumber: number | bigint = 0,
  options: GenerateOptions = { format: false, log: false }
): Array<number | bigint | string> {
  const { format, log } = options;

  // This function will either be nextPrime or nextPrimeBigInt depending on the type of startingNumber
  const nextP = (
    typeof startingNumber === "bigint" ? nextPrimeBigInt : nextPrime
  ) as unknown as (n: number | bigint) => number | bigint;

  const primes: Array<number | bigint> = [];

  // Our first prime number
  let prime = nextP(startingNumber);
  primes.push(prime);

  for (let i = 1; i < count; i++) {
    prime = nextP(prime);
    if (log) console.log(format ? formatNumberWithCommas(prime) : prime);
    primes.push(prime);
  }

  if (!format) return primes;

  const formattedPrimes = primes.map((prime) => formatNumberWithCommas(prime));
  return formattedPrimes;
}

export default generatePrimes;
