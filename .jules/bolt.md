## 2024-05-20 - GraphQL Pagination Optimization

**Learning:** Successfully replaced an inefficient REST API fallback in `src/github.ts` with a paginated GraphQL query. This avoids a potential N+1 issue when fetching files for pull requests with over 100 files. Also, learned to watch out for unrelated changes in `package-lock.json` after running `npm install` and to revert them to keep commits focused.

**Action:** In the future, I will double-check `package-lock.json` before submitting and use GraphQL pagination as a go-to solution for similar N+1 problems.
