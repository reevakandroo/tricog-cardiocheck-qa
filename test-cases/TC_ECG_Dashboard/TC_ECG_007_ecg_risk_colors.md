---
id: TC_ECG_007
module: ECG Dashboard
title: ECG risk category badges render correct colours (Low=green, Moderate=amber, High=red)
type: Positive
severity: High
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
Each ECG card in the list must display a risk category badge that is colour-coded according to clinical convention: Low risk = green, Moderate risk = amber/orange, High risk = red. Colour is a critical safety signal in a cardiac monitoring context — miscoded colours could cause operators to underreact to high-risk patients.

## Preconditions

| ID | Description | File |
|----|-------------|------|
| PC_001 | Browser is open and app URL is loaded | [PC_001_browser_ready.md](../preconditions/PC_001_browser_ready.md) |
| PC_002 | User is authenticated with valid credentials | [PC_002_authenticated_user.md](../preconditions/PC_002_authenticated_user.md) |
| PC_003 | At least one ECG of each risk category exists in the list | [PC_003_ecg_available.md](../preconditions/PC_003_ecg_available.md) |

## Test Data

| Risk Category | Expected Badge Colour | Seed `risk` value |
|---------------|----------------------|-------------------|
| Low | Green | `"low"` |
| Moderate | Amber / Orange | `"moderate"` |
| High | Red | `"high"` |

Seed command template (change `"risk"` value as needed):
```bash
curl -X POST "https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample" \
  -H "x-mock-token: mock-ingest-s3cr3t" \
  -H "content-type: application/json" \
  -d '{"omronConnectId":"86f66e18-494a-4232-8f76-530276b38d3c","risk":"<low|moderate|high>"}'
```

## Steps

### Sub-scenario A — Low Risk (green)
1. Seed a mock ECG with `"risk":"low"`.
2. Wait for it to appear in the dashboard list.
3. Locate the card and inspect the risk badge.
4. Verify the badge label reads **"Low"** (or equivalent).
5. Verify the badge background or text colour is a shade of **green**.
6. Using browser DevTools (computed styles or canvas pixel inspection), record the exact rendered colour value.

### Sub-scenario B — Moderate Risk (amber)
1. Seed a mock ECG with `"risk":"moderate"`.
2. Locate the card and inspect the risk badge.
3. Verify the badge label reads **"Moderate"** (or equivalent).
4. Verify the badge colour is **amber / orange** (not green, not red).
5. Record the exact rendered colour value.

### Sub-scenario C — High Risk (red)
1. Seed a mock ECG with `"risk":"high"`.
2. Locate the card and inspect the risk badge.
3. Verify the badge label reads **"High"** (or equivalent).
4. Verify the badge colour is **red** — visually distinct from Moderate.
5. Record the exact rendered colour value.

### Sub-scenario D — Accessibility (colour-blind safe)
1. Using the browser accessibility inspector or a colour-contrast checker tool, verify that badge text meets WCAG 2.1 AA contrast ratio (minimum 4.5:1 for normal text, 3:1 for large text).
2. Verify each badge also has a text label (not colour alone) to communicate risk — supporting users with colour-vision deficiency.

### Sub-scenario E — Unknown / missing risk value
1. If the `riskCategory` field is `null` or an unexpected value, check how the badge renders.
2. Confirm it does not show a green badge (which could falsely imply low risk).
3. Expect a neutral/grey badge or a graceful fallback label like "Unknown".

## Expected Result

- Low risk badge: green background, "Low" label, WCAG AA contrast compliant.
- Moderate risk badge: amber/orange background, "Moderate" label, WCAG AA contrast compliant.
- High risk badge: red background, "High" label, WCAG AA contrast compliant.
- All three colours are visually distinct from each other.
- No risk badge renders green when the risk is High.
- Missing/null risk value renders a neutral fallback — never green.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- This is a **safety-critical** check in a cardiac diagnostics application. A High risk ECG rendered with a green badge is a Patient Safety / Critical severity defect.
- Flutter Web renders to canvas; use DevTools colour picker (Shift+click on canvas) or accessibility tree inspection to verify colours programmatically.
- Document the exact hex values observed for all three risk levels for design reference.
- HIPAA relevance: incorrect risk display could lead to delayed care, which is a patient harm scenario.
