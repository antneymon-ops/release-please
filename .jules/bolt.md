## 2025-05-14 - [Inconsistent test data when optimizing]
**Learning:** When optimizing logic by switching from one property to another (e.g., from `notes` array to `breaking` boolean), existing tests might have inconsistent mock data that doesn't matter for the old logic but breaks the new logic.
**Action:** Always verify that mock data in tests is realistic and consistent with how the application's parsers populate those objects.
