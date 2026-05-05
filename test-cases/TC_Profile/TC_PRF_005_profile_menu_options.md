---
id: TC_PRF_005
module: Profile
title: Profile Menu — About, Support, and Logout Options Are All Clickable
type: Positive
severity: Medium
preconditions: [PC_001, PC_002]
---

## Scenario
A logged-in user opens the profile screen and verifies that all expected menu items — About, Support, and Logout — are present, rendered, and respond to click/tap interactions without errors or dead states.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open, JavaScript is enabled, and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) - User `reeva.kandroo+8@tricog.com` is logged in and on the ECG dashboard

## Test Data
| Field          | Value                          |
|----------------|-------------------------------|
| Email          | reeva.kandroo+8@tricog.com    |
| Route          | /profile                       |
| Expected items | About, Support, Logout         |

## Steps

### Phase 1 — Open Profile Screen
1. From the ECG dashboard, navigate to `/profile` (via profile icon, hamburger menu, or bottom navigation)
2. Click `flt-semantics-placeholder` to re-activate the Flutter accessibility tree
3. Observe the full list of menu items rendered on the profile screen

### Phase 2 — About
4. Locate the **About** menu item
5. Click the **About** item
6. Click `flt-semantics-placeholder` if the route changes
7. Verify: a screen, dialog, or bottom sheet opens showing app version info, legal/copyright text, or similar "About" content
8. Navigate back to the profile screen
9. Click `flt-semantics-placeholder` to re-enable accessibility

### Phase 3 — Support
10. Locate the **Support** menu item
11. Click the **Support** item
12. Verify: a screen opens, or an external link opens (e.g., support email, help center URL), or a contact/support form is shown
13. If an external link is triggered, verify it opens without error (link is not broken)
14. Navigate back to the profile screen
15. Click `flt-semantics-placeholder` to re-enable accessibility

### Phase 4 — Logout
16. Locate the **Logout** menu item
17. Confirm it is visible and tappable (not grayed out or disabled)
18. Do NOT click Logout in this test step — this interaction is fully validated in TC_PRF_002
19. Verify the element has a button role and responds to hover/focus states correctly

## Expected Result
- The profile screen displays at minimum: **About**, **Support**, and **Logout** menu items
- Each item is visible, has an appropriate touch/click target size, and responds to interaction
- **About**: opens a screen or dialog with app version information or legal text; no crash or blank screen
- **Support**: opens a support screen, contact form, or external support URL; no crash, dead link, or blank screen
- **Logout**: visible and tappable; correct label; deep-links to the logout action (full behavior covered in TC_PRF_002)
- No menu items are hidden, clipped off-screen, or rendered outside the visible viewport

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Flutter CanvasKit renders all UI on `<canvas>`. After route changes (e.g., navigating from About back to the profile list), the semantic tree must be re-activated with another `flt-semantics-placeholder` click.
- If the Support option opens an external URL (e.g., `mailto:` or `https://support.tricog.com`), test that the link is valid and not a placeholder/404.
- If any menu item exists in the design but is missing from the rendered UI, log it as a **Medium** defect.
- The About screen should display the current app version. Note the version number in the Actual Result for traceability.
- Check that none of the About or Support screens expose sensitive configuration data, internal API endpoints, or tokens.
