# Week 03 Reflection

## Selected Feature Set

1. Which feature set were you assigned to complete?

Answer:

I developed Feature Set 1 — Trips as my proposed contribution. I had offered to take Trips in the CSE 341 team channel, but I do not have confirmation that the team formally assigned it to me. This implementation is in my personal copy of the official BYU-Idaho Kizuna Rail template, not in the team's shared repository.

## Links

2. Provide your walk-through video link. This video must demonstrate your feature working locally and follow the script in the assignment. (If you created more than one video for your feature set, include them all here.)

Video link:

Not recorded yet. I will add the real link after I record the local demonstration.

3. Provide links to all GitHub Issues you created for your selected feature set.

Issue links:

- [Issue #1 — Trips Mongoose API and list hydration](https://github.com/kennethduron/cse341-kizuna-rail-w03/issues/1) in my personal repository.

4. Provide links to all Pull Requests you created for your selected feature set.

Pull request links:

- [Draft PR #2 — W03 Feature Set 1: Trips Mongoose and API Hydration](https://github.com/kennethduron/cse341-kizuna-rail-w03/pull/2), from `feature/w03-trips` to `main` in my personal repository. It is open and unmerged. It is not yet ready for teammate review because the required walkthrough video is not attached.

## Implementation Reflection

5. Why did you decide to split your Feature Set into multiple GitHub issues or use a single issue?

Answer:

I used one Issue because the schema, Mongoose queries, API responses, Swagger documentation, EJS detail page, and browser hydration form one connected Trips read flow and rely on the same Trip data contract. The Issue includes the requirements and test plan. I kept Schedules, Bookings, Stations, and Ticket Classes outside this contribution.

6. What is one thing you know after completing the assignment that you did not know beforehand?

Answer:

I learned that a Mongoose connection exposes its underlying native MongoDB `Db` object. I used one connection for the new Trips models and preserved the starter's native collection access for existing features, avoiding a second connection or an unnecessary rewrite of those features.

7. What did you do to make your pull requests clear and ready for teammate review?

Answer:

I documented the existing Trip fields, string slug IDs, schedule references, endpoint responses, and acceptance tests in Issue #1. I implemented the changes on `feature/w03-trips`, kept API routes in `src/routes/api-routes.js` and page routes in `src/routes/ejs-routes.js`, added API/model/EJS tests and isolated browser-hydration state tests, ran ESLint, checked the local demo routes, reviewed the diff for secrets, and opened Draft PR #2 with a summary, test notes, decisions, limitations, and the Issue reference. All nine unit tests and ESLint pass. The latest demo run returned the expected results for 12 local HTTP checks using temporary MongoDB data. The full suite passed 20 tests before the route separation and three UI-state tests were added; the current 23-test suite has not produced a fresh result because the restricted test environment blocked its local MongoDB Memory Server connection. The walkthrough video and a teammate review remain outstanding, so the PR is still Draft.

## Team Process

8. What is one thing you can do personally to help your team be more effective next week?

Answer:

I can confirm feature ownership and shared data contracts with the team before integrating work, then announce a focused PR with reproducible test results and a short walkthrough so teammates can review it promptly. I will ask the team how to port this personal-copy implementation into the official shared repository rather than treating my personal PR as team work.
