# CSE 341 W03 Trips — Walk-through Script

**Target length:** about 3 minutes.  
**State:** Script prepared; no recording or video URL exists yet.

## Before recording

1. Open the project folder `cse341-kizuna-rail-w03` on branch `feature/w03-trips`.
2. Run `npm run demo`. This starts the application with the official starter Trips and Schedules in a temporary in-memory MongoDB database; it does not require Atlas credentials or alter a persistent database.
3. Open `http://localhost:3000/trips`, `http://localhost:3000/api/trips`, `http://localhost:3000/api/trips/alpine-panorama`, and `http://localhost:3000/api-docs/` in browser tabs.
4. Keep the video within the instructor's stated time limit. Hide terminal environment values and any unrelated tabs.

## English script and sequence

### 0:00–0:25 — Introduce the feature

“Hello, my name is Kenneth Duron. This is my personal working copy of the official Kizuna Rail brownfield project. For CSE 341 Week 03, I implemented the Trips read feature. The team has not formally confirmed feature ownership, so this is my proposed personal contribution.”

### 0:25–0:55 — Show the hydrated list

Open `/trips` and show the six cards and region/season controls.

“The server renders the page shell. The browser requests `/api/trips`, checks the HTTP response, parses JSON, and creates each card with DOM elements and `textContent`. That avoids inserting database text as HTML. The filters work on the fetched records, and each card links to the existing trip detail URL.”

Select **Central** and show the two matching Trips. Open **Alpine Panorama Express** and point out its route details and schedules.

### 0:55–1:25 — Show the API and documentation

Open `/api/trips` and `/api/trips/alpine-panorama`, then `/api-docs/`.

“The list endpoint returns the Trips in a `{ trips: [...] }` JSON envelope, matching the existing Trains API convention. The detail endpoint looks up the custom string ID. Swagger documents the slug parameter, response schema, and 200, 400, 404, and 500 outcomes.”

### 1:25–2:10 — Explain model and schema

Show `src/models/schemas/trips.js` and `src/models/trips.js`.

“The schema follows the six starter records: slug `id`, route names and stations, numeric distance, highlights, season, operating months, and an optional image URL. Mongoose validates the ID and required data. The model queries the `trips` collection by the existing string `id`; it does not replace the historical IDs with MongoDB ObjectIds.”

### 2:10–2:40 — Explain controllers and status codes

Show `src/controllers/trips.js`.

“The API handlers are separate from the EJS handlers. A malformed ID receives 400 because it does not follow the existing lowercase slug format. A valid slug with no matching document receives 404. Unexpected database failures receive a generic 500 body without internal database details.”

### 2:40–3:00 — Explain the connection decision and checks

Show `src/db/connect.js` and the test output.

“The project already has features using the native MongoDB driver. I use one Mongoose connection and expose its native database object to those existing features, so Trips can use Mongoose without opening a duplicate connection or rewriting unrelated code. ESLint passed and all 20 automated tests passed against an isolated temporary MongoDB database.”

## Phone recording alternative

If screen sharing is unreliable, place a phone in landscape orientation on a stable support, point it at the monitor, and record the same browser and editor sequence at readable zoom. Keep the camera steady, avoid glare, and confirm the code and endpoint responses are legible before uploading. This is a recording suggestion only; it does not replace any instructor-specific video requirement.
