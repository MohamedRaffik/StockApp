Checklist
- [x] Remove axios
- [x] Set up google firestore models
- [x] Set up register Login page
- [x] Create login / register routes and controllers
- [x] Dont show purchase from when not logged in
- [x] User model will need to pass to certain controllers
- [x] Set up transaction endpoint
- [x] Set up portfolio endpoint
- [x] Create transaction page
- [x] Create portfolio page
- [ ] Add timestamps to transactions
- [ ] Rewrite user class methods as promises without async await
- [ ] Rewrite passport functions as ^^^^
- [ ] Set up logout endpoint
- [ ] Deploy to GCP
- [ ] Test endpoints
- [ ] Define prop types for components

Notes
- Due to using server side events to have realtime updates to stock prices, it uses only references of the user object when displaying portfolio information. To avoid dealing with stale data there are two options 1) Cause the webpage to refresh, restarting the event source 2) Retrieve the user instance from the database using the id in the req object. The latter choice is much more expensive as it causes a slow down on waiting to retrieve information from the database and it does so every few seconds, while refreshing the page is done only when a transactions is completed.

User Stories completed

- [x] 1
- [x] 2
- [x] 3
- [x] 4
- [x] 5
- [ ] 6