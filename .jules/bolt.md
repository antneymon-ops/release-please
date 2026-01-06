## 2024-08-05 - GraphQL to REST API Fallback for Large PRs
**Learning:** The `mergeCommitsGraphQL` function in `src/github.ts` currently fetches up to 100 files for a pull request using GraphQL. If a PR has more files, it reverts to the `getCommitFiles` function, which makes slower, paginated REST API calls. This fallback creates a significant performance bottleneck for large pull requests.
**Action:** I will replace the REST API fallback with a paginated GraphQL query to efficiently fetch all files for any size pull request. This will improve performance and reduce the number of API calls.
