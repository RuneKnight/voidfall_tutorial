# Palette's Journal - UX & Accessibility Learnings

## 2025-05-18 - Modal & Drawer Keyboard Accessibility (Escape key & Focus ring)
**Learning:** Drawers and overlay modals should always listen for the `Escape` key event when open to allow seamless keyboard dismissal, and interactive sub-elements require distinct `:focus-visible` styles so keyboard navigation remains visually clear.
**Action:** When adding modals or drawers, implement a `keydown` listener for `Escape` and explicitly define focus rings (`:focus-visible`) for buttons, inputs, and interactive tags.
