## 2025-02-14 - Interactive Counter Stepper Accessibility & Visual States
**Learning:** Icon-only stepper controls (`+` and `-`) without explicit `aria-label`s are unannounced on screen readers, and allowing decrement clicks on zero values without `disabled` attributes/styles leads to poor visual and interactive feedback in drawer modals.
**Action:** Always provide contextual ARIA labels (e.g. `aria-label="침략자 초계함 수 감소"`), `disabled` props when at minimum bound, and matching CSS `:disabled` styles for unit counter buttons.
