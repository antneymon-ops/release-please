## 2026-02-03 - [Prefix matching with Set vs Array scanning]
**Learning:** For path-heavy operations like `CommitSplit`, performance is improved by using a `Set` for package paths to enable O(depth) prefix matching instead of O(number of packages) array scanning. This is particularly effective in monorepos where the number of packages (N) is much larger than the typical file path depth (D).
**Action:** Use prefix-matching via `Set` (iterating through path segments) when searching for a containing package or directory in a list of many candidate paths.
