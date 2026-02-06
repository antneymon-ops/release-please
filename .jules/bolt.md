## 2026-02-03 - [Prefix matching with Set vs Array scanning]
**Learning:** For path-heavy operations like `CommitSplit`, performance is improved by using a `Set` for package paths to enable O(depth) prefix matching instead of O(number of packages) array scanning. This is particularly effective in monorepos where the number of packages (N) is much larger than the typical file path depth (D).
**Action:** Use prefix-matching via `Set` (iterating through path segments) when searching for a containing package or directory in a list of many candidate paths.

## 2025-01-24 - [Avoid redundant string allocations in path processing]
**Learning:** Even when using a `Set` for prefix matching, `file.split('/').slice().join('/')` creates many intermediate strings. Using `lastIndexOf('/')` and `substring()` reduces allocations to O(depth) and is significantly faster (3x speedup in `CommitSplit`).
**Action:** Use iterative `lastIndexOf` and `substring` when traversing up a directory tree from a file path.

## 2025-01-24 - [Imperative loops for early exit in filtering]
**Learning:** Functional chains like `.filter().every().some()` are elegant but inefficient for high-frequency operations on large arrays. Replacing them with imperative loops and early exits can provide measurable performance gains (~35% in `CommitExclude`).
**Action:** Prefer imperative loops with early returns over complex functional chains in performance-critical paths.
