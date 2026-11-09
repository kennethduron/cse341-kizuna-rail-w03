# CSE 341 W03 Trips — Verification Record

**Repository:** `kennethduron/cse341-kizuna-rail-w03` (personal copy generated from the official `byui-cse/cse341-ww-student-kizuna-rail` template)
**Branch:** `feature/w03-trips`
**Issue:** [#1](https://github.com/kennethduron/cse341-kizuna-rail-w03/issues/1)
**Pull Request:** [#2](https://github.com/kennethduron/cse341-kizuna-rail-w03/pull/2) — open Draft, not merged.
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
- Added `src/routes/api-routes.js` for the Trips API, retained Trains API, and Swagger endpoints; added `src/routes/ejs-routes.js` for page routes. `src/routes/router.js` composes those route modules. The OpenAPI document describes the actual data schema and response behavior.
- Refactored `src/views/trips/list.ejs` to render a page shell and template, then hydrate from `/api/trips`. Browser code checks `response.ok`, shows loading/empty/error states, filters region/season client-side, creates text with `textContent`, and retains `/trips/:id` links.
- Added `npm run demo`, which starts an isolated temporary MongoDB Memory Server and seeds only that ephemeral database. It does not read `.env` or touch Atlas.
- Increased the MongoDB Memory Server launch timeout used by tests to 60 seconds. The local `mongod` binary was present but took over 10 seconds to initialize WiredTiger on this machine.

## Checks actually executed

| Check | Result |
|---|---|
| `npm install mongoose swagger-ui-express` | Passed; installed Mongoose 9.12.0 and Swagger UI Express 5.0.1 and updated `package-lock.json`. npm reported 14 audit findings: 7 moderate, 6 high, 1 critical. No force-upgrade was applied. |
| `npm run lint` | Passed after implementation. |
| `npm run test:unit` | Passed after adding UI state tests: 9 tests total (6 controller tests and 3 DOM-harness tests for empty, network-error, and unsuccessful HTTP states). |
| `npm test` | The full suite passed 20 tests before the route split and three UI tests were added. A fresh unprivileged run previously reported `EACCES` while connecting to MongoDB Memory Server at `127.0.0.1`. The latest elevated run produced no test summary after 120 seconds and was stopped. Therefore, the current 23-test full suite is not claimed as passing. |
| `npm run demo` and local HTTP checks (temporary database) | Latest run started the isolated MongoDB Memory Server. Twelve requests passed: `/`, `/trains`, `/api/trains`, `/trips`, `/api/trips` (6 records), `/api/trips/alpine-panorama`, `/trips/alpine-panorama`, `/api-docs/`, `/api-docs.json` (includes `/api/trips`), invalid Trip ID 400, nonexistent API Trip 404, and nonexistent EJS detail 404. |
| Chrome browser check against local demo | Previously confirmed six dynamically hydrated Trip cards, region filtering `central` to two trips, and navigation from a card to Trip details with schedules. Empty/error UI states are now covered by unit tests using a simulated DOM; they were not forced in a live browser. |
| Git hygiene | `.env` is ignored by `.gitignore` and is not tracked. The final diff and secret-pattern scan passed; branch `feature/w03-trips` is pushed and Draft PR #2 is open. |

## Limitations and outstanding work

- No production database, shared team database, Atlas, or Render service was accessed.
- Empty-list, network-error, and unsuccessful HTTP response states passed simulated-DOM unit tests; they were not forced in a live browser.
- The user has not recorded a walkthrough video, so no video URL exists yet.
- Draft PR #2 targets `main` of the personal repository and remains unmerged. The PR was created by `kennethduron`. Its implementation commit remains attributed to `kennethmarjorie8` because GitHub associates the global Git email with that account. This mismatch is explained below; no history rewrite was performed.
- The team has not formally confirmed that Trips was assigned to the user; this remains a proposed contribution.

## Final code and PR review

- Reviewed the feature diff against the official Week 03 Feature Set 1 requirements: Mongoose schema/model, API JSON handlers and the dedicated `api-routes.js`, Swagger documentation, EJS list/detail controller refactor and dedicated `ejs-routes.js`, client-side list hydration, and preserved existing Trip detail URLs and schedule data are present.
- GitHub reports PR #2 open, Draft, based on `main`, head `feature/w03-trips`, and mergeable. The public API reports zero check runs and no completed combined status. GitHub branch-protection settings could not be verified anonymously (API returned HTTP 401). No review or merge has occurred.
- The existing PR description includes the Issue reference, implementation summary, test notes verified when it was opened, decisions, and known limitations. The video is not attached because it has not been recorded.

## Git commit attribution

- The repository initially had no local `user.name` or `user.email`. The global name was `kennethduron`, but the global email matched the author and committer email on implementation commit `24cfd9c`; GitHub resolves that email to `kennethmarjorie8`. This is Git metadata/account association, not the account that created PR #2.
- The follow-up documentation commit `3ae7374` used `Kenneth Duron` and `kennethduron@users.noreply.github.com`; GitHub's public API resolves its author to `kennethduron`.
- Repository-local Git config is now set to that verified name and noreply email for future commits only. No published history was amended or force-pushed. The original implementation commit will still display its prior attribution.

## Dependency security audit

Current `npm audit` result: 14 findings (1 critical, 6 high, 7 moderate). The production-only audit reports 3 findings, all transitive dependencies of Express:

| Package | Installed version | Severity | Dependency scope | Audit fix available |
|---|---:|---|---|---|
| `proxy-addr` | 2.0.7 | Critical | Production, transitive through Express | Yes |
| `body-parser` | 2.3.0 | High | Production, transitive through Express | Yes |
| `qs` | 6.15.3 | Moderate | Production, transitive through Express (also used by test tooling) | Yes |

The remaining 11 findings are in development tooling: `@eslint/config-array` (moderate, transitive), `@vitest/mocker` (moderate, transitive), `brace-expansion` (high, transitive), `eslint` (moderate, direct dev dependency), `follow-redirects` (high, transitive), `minimatch` (moderate, transitive), `nanoid` (high, transitive), `nodemon` (moderate, direct dev dependency), `source-map-js` (high, transitive), `vite` (high, transitive), and `vitest` (moderate, direct dev dependency). npm's audit metadata reports fixes available for these packages as well.

No dependency changes were applied. `npm audit fix --dry-run` failed with npm's internal `Cannot read properties of null (reading 'edgesOut')` error, so the proposed lockfile changes could not be reviewed. `npm audit fix --force` was not run. The three production findings, especially `proxy-addr`, should be addressed in a separately verified dependency update before production use.

## Prepared Microsoft Teams messages (not sent)

**Coordination and integration request:**

> Hi CSE341 Group 1, I completed a proposed Trips read-feature implementation in my personal copy of the official Kizuna Rail template. The work is tracked in [personal Issue #1](https://github.com/kennethduron/cse341-kizuna-rail-w03/issues/1) and [personal Draft PR #2](https://github.com/kennethduron/cse341-kizuna-rail-w03/pull/2). This is not a PR to the shared team repository and has not been integrated there. Could the team confirm whether Trips is assigned to me and advise how you would like me to port the work into the shared repository without conflicting with anyone else's changes? The PR remains a draft while I prepare the required walkthrough.

**Review request after the video is recorded and added to PR #2:**

> Hi CSE341 Group 1, I added my local walkthrough to personal Draft PR #2 for the proposed Trips contribution. The PR is in my personal template copy, not the shared team repository. Could a teammate review the implementation and advise on the appropriate integration path into the shared Kizuna Rail repository? The PR links Issue #1 and includes the verified test notes.

Neither message has been sent. Team ownership, acceptance, and review are not confirmed.
