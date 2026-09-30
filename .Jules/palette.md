## 2025-05-20 - Stepper Control Accessibility in Tabletop Drawers

**Learning:** Stepper buttons with simple "+" / "-" text labels in complex multi-faction tabletop calculator drawers lack accessible names for screen readers, leading to ambiguous user experience when navigate with assistive technologies.
**Action:** Always provide explicit `aria-label`s on stepper increment/decrement controls that specify both the faction/side and the exact unit or resource being modified (e.g. `aria-label="침공자 초계함 수량 증가"`).
