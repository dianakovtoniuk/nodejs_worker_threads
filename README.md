
# Nodejs Worker Threads

Experiments with `worker_threads` in Node.js, from basic messaging between threads to a small HTTP server that generates prime numbers in a worker. Written in TypeScript.

## Structure

```
.
├── app.ts                    # worker_threads examples: workerData, MessageChannel, parent <-> worker messaging
├── calc.ts                   # the worker file used by app.ts
├── structured-clone.ts       # deep copy with v8.serialize / v8.deserialize
├── prime-generator/
│   ├── prime-generator.ts    # prime number generator with number and BigInt support
│   └── app.ts                # runs the generator and prints the time taken
└── heavy-server/             # HTTP server with login and a prime numbers route
    ├── src/                  # server, router, controllers, middleware, DB
    ├── lib/                  # worker (calc.ts) and prime generator
    ├── public/               # prebuilt React frontend
    └── data/                 # JSON files used as the database
```

The root and `heavy-server` are two separate npm projects, so each one needs its own install.

## Requirements

Node.js 18.14 or newer.

## Getting started

Experiments in the repo root:

```bash
npm install

npm run worker-basics       # app.ts
npm run structured-clone    # structured-clone.ts
npm run primes              # prime-generator/app.ts
npm run typecheck
npm run build               # compiles to dist/
```

Most of `app.ts` is commented out on purpose. Uncomment one example at a time, and keep the matching code in `calc.ts` in sync.

The prime generator demo uses a very large starting number, so it can take a while. Lower the value in `prime-generator/app.ts` for a quicker run.

## Heavy server

```bash
cd heavy-server
npm install

npm run dev              # development, restarts on changes
npm run dev:cluster      # development, one process per CPU core

npm run build            # compile to dist/
npm start                # node dist/src/index.js
npm run start:cluster    # node dist/src/cluster.js
```

The server listens on `http://localhost:8090`. Run it from inside `heavy-server`, since `data/` and `public/` are resolved from the working directory.

### Routes

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/`, `/login`, `/profile`, `/primes` | no | serve the frontend |
| `POST` | `/api/login` | no | log in, sets a `token` cookie |
| `DELETE` | `/api/logout` | yes | remove the session and clear the cookie |
| `GET` | `/api/user` | yes | username and name of the current user |
| `PUT` | `/api/user` | yes | update username, name and, optionally, password |
| `GET` | `/api/primes?count=&start=` | no | generate prime numbers in a worker thread |
| `GET` | `/api/get-json-data` | no | test route returning a larger JSON body |

### Prime numbers

```bash
curl "http://localhost:8090/api/primes?count=5&start=100"
```

```json
{ "primes": ["101", "103", "107", "109", "113"], "time": "0.03" }
```

- `count` must be a positive integer and `start` a non-negative integer. Invalid values return `400`.
- `start` can be larger than `Number.MAX_SAFE_INTEGER`, in which case the generator switches to `BigInt`.
- Every request runs in its own worker thread, so heavy requests do not block the server.
- A request that takes longer than 5 seconds is terminated and returns `408`.
- Numbers are returned as strings formatted with commas.

### Frontend

`public/` contains a prebuilt React bundle. Its source code is not part of this repo.

### Data

Users and sessions are stored in `data/users` and `data/sessions` as JSON. Sessions are written to `data/sessions` on every login, so that file changes while you use the app.

## Known limitations

- The token is read as the first value of the `Cookie` header, so it only works when `token` is the only cookie.
- Passwords are stored in plain text. This is demo data only.
- `heavy-server/lib/prime-generator.ts` is a copy of `prime-generator/prime-generator.ts`, kept so that `heavy-server` stays a self-contained project.
- Static file paths are relative to the working directory.
