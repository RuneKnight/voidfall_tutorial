# Palette's UX & Accessibility Journal

## 2025-05-20 - Icon-only Header Navigation Accessibility & Focus States
**Learning:** Icon-only navigation links (such as home links or drawer toggle buttons) require explicit `aria-label`s to be accessible to screen readers, and header action controls need distinct `:focus-visible` styles so keyboard navigators have a clear indicator of the focused element.
**Action:** Whenever creating or updating icon-only interactive controls (e.g. Next.js `<Link>` or `<button>`), always include `aria-label` and ensure `:focus-visible` outline styles are applied.
