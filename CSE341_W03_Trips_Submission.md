# CSE 341 W03 — Mongoose and Consuming APIs
## Feature Set 1: Trips — Reflection Draft

**Working repository:** [kennethduron/cse341-kizuna-rail-w03](https://github.com/kennethduron/cse341-kizuna-rail-w03) — a personal copy generated from the official BYU-Idaho template, not the team's shared repository.  
**Feature status:** Implemented and locally verified in branch `feature/w03-trips`.  
**GitHub Issue:** [#1 — Trips Mongoose API and list hydration](https://github.com/kennethduron/cse341-kizuna-rail-w03/issues/1).  
**Pull Request:** Not yet created.  
**Walk-through video:** Not recorded; no video URL exists.

### 1. Feature Set Assignment

I developed Feature Set 1 — Trips as my proposed personal contribution. I had offered to take Trips in the team channel, but I have not verified a formal team assignment. This implementation is in my personal copy of the official Kizuna Rail template and is not presented as a change in the shared team repository.

### 2. Walk-through Video

I have not recorded the required walk-through yet. The script and demonstration sequence are in [`CSE341_W03_Trips_Video_Script.md`](CSE341_W03_Trips_Video_Script.md); I will add the real video link after recording.

### 3. GitHub Issues

I used one detailed Issue: [Issue #1](https://github.com/kennethduron/cse341-kizuna-rail-w03/issues/1). It tracks the dependent Trip schema, model, API, Swagger, EJS detail-handler refactor, browser hydration, acceptance criteria, and test plan in my personal repository.

### 4. Pull Requests

No Pull Request has been created yet. The code is on `feature/w03-trips`, and local checks have passed. I will create a PR to `main` in the personal repository after publishing the branch. It will reference Issue #1, list the verified tests and limitations, and include the video link when one exists. I will not merge it.

### 5. Feature Split Decision

I kept Trips in one Issue because its schema, Mongoose queries, API responses, EJS detail page, and client-side list hydration share one data contract and one read flow. Schedules, Bookings, Stations, and Ticket Classes remain outside this contribution.

### 6. New Knowledge

I learned that one Mongoose connection can provide its underlying native MongoDB `Db` object. I used that connection for the new Trips models while preserving the starter's native collection access for existing schedules, bookings, and Trains behavior, avoiding a second database connection.

### 7. Review Preparation

I added the existing Trip data contract and API behavior to Issue #1, kept implementation on a feature branch, ran ESLint and the complete Vitest suite (20 tests passed), ran six isolated controller unit tests, checked real HTTP responses against an isolated in-memory MongoDB demo, and verified browser hydration, filtering, and navigation to a Trip detail page. The verification details are in [`CSE341_W03_Trips_Verification.md`](CSE341_W03_Trips_Verification.md). A PR is still required for teammate review.

### 8. Process Improvement

I can help the team by confirming feature ownership and shared data contracts before implementation, then announcing a focused PR with reproducible test results and a short walkthrough so teammates can review it promptly.
