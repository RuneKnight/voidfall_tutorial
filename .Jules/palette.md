# Palette's Journal - Critical UX & Accessibility Learnings

## 2025-05-18 - Modal Keyboard Dismissal & Navigation ARIA Attributes
**Learning:** Modal dialog components (`GlossaryModal`, `OverviewModal`) without explicit `Escape` key event listeners break keyboard navigation flow for screen reader and keyboard-only users. Furthermore, interactive controls need explicit ARIA labels and `:focus-visible` outline indicators to satisfy WCAG navigation criteria.
**Action:** Always register an `Escape` key handler inside `useEffect` when modals are open and provide explicit `aria-label`s and `:focus-visible` styling for interactive buttons.
