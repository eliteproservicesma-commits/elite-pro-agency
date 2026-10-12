---
name: Elite Pro assistant and OTP constraints
description: Durable provider and delivery rules for Elite Pro Services chat and email verification.
---

**Rule:** The Elite Pro Services assistant must remain rule-based and client-side; do not use OpenAI or another paid AI API/key. Real OTP emails must use the connected Google Mail OAuth integration. Never display a verification code in the website or report success unless Gmail accepted the send.

**Why:** The user explicitly requested these constraints.

**How to apply:** Keep assistant answers deterministic in the frontend. If Gmail OAuth is unavailable, report that delivery is unavailable instead of simulating it or requesting a paid provider key.
