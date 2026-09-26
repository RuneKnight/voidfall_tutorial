# Palette's Journal - Critical UX & Accessibility Learnings

## 2025-05-18 - Tablist ARIA Patterns & Keyboard Focus in Navigation Drawers
**Learning:** Custom tab headers and interactive search result cards inside drawer overlays (like `QuickRefDrawer`) require proper ARIA attributes (`role="tablist"`, `role="tab"`, `aria-selected`, `role="tabpanel"`, `aria-controls`) and explicit `:focus-visible` styling with keyboard activation (`Enter`/`Space`). Without these, screen reader users cannot associate tab headers with drawer contents, and keyboard-only users lose focus indicators.
**Action:** When creating or modifying tabbed drawers or modal overlays in this project, always pair `role="tab"` buttons with `role="tabpanel"` containers and ensure interactive card elements have `tabIndex={0}` and keyboard event handlers.
