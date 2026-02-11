## 2026-02-03 - [Prefix matching with Set vs Array scanning]
**Learning:** For path-heavy operations like `CommitSplit`, performance is improved by using a `Set` for package paths to enable O(depth) prefix matching instead of O(number of packages) array scanning. This is particularly effective in monorepos where the number of packages (N) is much larger than the typical file path depth (D).
**Action:** Use prefix-matching via `Set` (iterating through path segments) when searching for a containing package or directory in a list of many candidate paths.

## 2026-02-03 - [Optimizing Path Filtering with Early Exits]
**Learning:** High-level functional chains like `.filter().every().some()` can be a significant bottleneck when processing thousands of files across hundreds of packages. Replacing these with imperative loops and early exits can yield a 4-5x performance improvement by avoiding unnecessary iterations and intermediate array allocations.
**Action:** Use imperative loops for path filtering logic in performance-critical paths, especially when a decision can be made after inspecting only a few elements.
