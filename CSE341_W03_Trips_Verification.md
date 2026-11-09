# CSE 341 W03 Trips — Verification Record

**Repository:** `kennethduron/cse341-kizuna-rail-w03` (personal copy generated from the official `byui-cse/cse341-ww-student-kizuna-rail` template)  
**Branch:** `feature/w03-trips`  
**Issue:** [#1](https://github.com/kennethduron/cse341-kizuna-rail-w03/issues/1)  
**Scope:** Trips implementation and the minimum shared database connection adaptation required for Mongoose. No other repository or Atlas database was used.

## Source contract confirmed before implementation

- The seed file `src/db/seeds/trips.json` contains six Trips with lowercase slug string IDs, including `alpine-panorama`.
- Trip fields are `id`, `name`, `description`, `region`, `startStation`, `endStation`, `duration`, numeric `distance`, `highlights`, `bestSeason`, `operatingMonths`, and optional `imageUrl`.
- `src/db/seeds/schedules.json` relates schedules by string `tripId`; the existing detail URL is `/trips/:tripId`.
- Trains has a Mongoose schema/model example, while the application services and seed initializer use the native driver's `getDb()` interface.
- The tests start a MongoDB Memory Server and restore starter data before each test. No `.env` database and no `npm run db:import` were used.

## Implementation delivered on the feature branch

- Replaced the separate native `MongoClient` connection with a single Mongoose connection in `src/db/connect.js`. `getDb()` returns that connection's underlying native `Db`, keeping existing native collection consumers compatible; `getMongooseConnection()` supplies the active connection to models.
- Added `src/models/schemas/trips.js` with the verified seed fields, required/type/range checks, custom slug ID validation, and unique `id` index.
- Added `src/models/trips.js` with Mongoose `getAllTrips()` and `getTripById(id)` using the existing string ID and `trips` collection.
- Added `src/controllers/trips.js` with JSON handlers returning `{ trips }` for lists, one document for details, 400 for invalid slugs, 404 for valid missing slugs, and generic 500 responses. EJS list/detail handlers are separate; detail schedules still use the existing native collection interface.
- Added `/api/trips`, `/api/trips/:id`, `/api-docs`, and `/api-docs.json` in the existing router. The OpenAPI document describes the actual data schema and response behavior.
- Refactored `src/views/trips/list.ejs` to render a page shell and template, then hydrate from `/api/trips`. Browser code checks `response.ok`, shows loading/empty/error states, filters region/season client-side, creates text with `textContent`, and retains `/trips/:id` links.
- Added `npm run demo`, which starts an isolated temporary MongoDB Memory Server and seeds only that ephemeral database. It does not read `.env` or touch Atlas.
- Increased the MongoDB Memory Server launch timeout used by tests to 60 seconds. The local `mongod` binary was present but took over 10 seconds to initialize WiredTiger on this machine.

## Checks actually executed

| Check | Result |
|---|---|
| `npm install mongoose swagger-ui-express` | Passed; installed Mongoose 9.12.0 and Swagger UI Express 5.0.1 and updated `package-lock.json`. npm reported 14 audit findings: 7 moderate, 6 high, 1 critical. No force-upgrade was applied. |
| `npm run lint` | Passed after implementation. |
| `npm run test:unit` | Passed: 6 controller unit tests. |
| `npm test` | Passed: 20 tests across Trips and existing Trains suites. A first run failed because the temporary mongod startup exceeded its default 10-second timeout; after setting 60 seconds, the complete suite passed. |
| Local demo HTTP checks (temporary database) | `/` 200; `/trips` 200; `/api/trips` returned 6 records; `/api/trips/alpine-panorama` 200; `/trips/alpine-panorama` 200 and included schedule data; `/api-docs/` 200; `/api-docs.json` included `/api/trips`; invalid ID 400; valid but missing ID 404. |
| Chrome browser check against local demo | Confirmed six dynamically hydrated Trip cards, region filter options, filtering `central` to two trips, and navigation from a card to the Trip detail page with schedules. |
| Git hygiene | `.env` remains ignored by `.gitignore`; no `.env` file was created for this demo. Full final diff/secret scan and GitHub publication remain to be completed. |

## Limitations and outstanding work

- No production database, shared team database, Atlas, or Render service was accessed.
- No empty-list or network-error state was forced in the browser; those states are implemented, and the list/controller logic has tests, but these two visual states are not claimed as manually browser-tested.
- The user has not recorded a walkthrough video, so no video URL exists yet.
- Branch publication and a PR are still pending. They must target `main` of the personal repository and remain unmerged.
- The team has not formally confirmed that Trips was assigned to the user; this remains a proposed contribution.
