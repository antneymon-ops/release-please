## 2026-01-31 - Parallelizing API calls in loops
**Learning:** Sequential async operations in loops (e.g., fetching files for each commit) are a major bottleneck. Parallelizing them with `Promise.all` significantly reduces latency.
**Action:** Always check for sequential API calls in loops and parallelize them if they are independent and limited in number. Use `nock.delay()` to verify parallelism in tests.
