## 2025-10-02 - Icon-only Header Control Accessibility
**Learning:** Icon-only toggle buttons (such as Wake Lock and Theme switch) in dark/light mode headers need explicit ARIA labels and `aria-pressed` states so screen readers accurately communicate state toggles and destination actions.
**Action:** Always complement `title` tooltips on icon-only header controls with corresponding `aria-label` and `aria-pressed` attributes.
