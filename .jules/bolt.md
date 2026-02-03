# Bolt's Journal - Critical Learnings

## 2025-05-14 - [Initial Entry]
**Learning:** Initializing the journal to track performance optimizations and learnings in this codebase.
**Action:** Follow the daily process: Profile, Select, Optimize, Verify, and Present.

## 2025-05-14 - [O(P) vs O(D) path prefix matching]
**Learning:** In monorepos with many packages, searching through an array of package paths (O(P)) for every file in every commit is a significant bottleneck. Using a `Set` for prefix lookups reduces this to O(depth of file) (O(D)), which is typically much smaller than the number of packages.
**Action:** Replace `Array.find()` with a `Set` lookup by checking each prefix of the file path.
