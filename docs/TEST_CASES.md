# Avashesh — Test cases and evidence

Project credit: Team Avashesh. Verification date: **27 October 2026**. No passwords, tokens, private backend values or real personal data are included here.

## Recorded results

- `bunx vitest run`: **65 tests passed across 7 files**.
- Latest managed preview check: **build OK**.
- Database security advisor after grant tightening: **no warnings** (not a full security audit).
- Two independent browser contexts exercised real shared data with administratively created/confirmed test Farmer and Buyer accounts; fixtures were removed afterward.
- Public signup with a reserved test domain was correctly rejected. Real mailbox confirmation and password-reset completion are **not verified**.

## End-to-end checklist

| ID | Test / expected result | Evidence status |
|---|---|---|
| A1 | Homepage Sell signed-out → auth, Farmer preselected | Passed in browser |
| A2 | Signup invalid/unsupported email → error, no false success | Passed for reserved test domain |
| A3 | Real mailbox Farmer signup → confirmation → login | Pending: real receiving mailbox needed |
| A4 | Real mailbox Buyer signup → confirmation → login | Pending: real receiving mailbox needed |
| A5 | Both roles login/logout; header reflects session; refresh retains session | Passed with confirmed test accounts |
| A6 | Forgot password sends email; recovery page updates password | Implemented; emailed end-to-end completion pending |
| F1 | Blank listing → errors; positive quantity/valid supplied contact required | Browser and unit checks passed |
| F2 | Farmer saves 5 quintal at ₹250/quintal as draft | Passed; private draft hidden from Buyer |
| F3 | Publish draft → another browser sees listing | Passed |
| F4 | Upload permitted photo → Buyer sees signed image | Passed |
| F5 | Edit asking price → Buyer reads new value after refresh | Passed |
| F6 | Mark sold → public/Buyer listing unavailable; owner still accesses it | Passed |
| F7 | Soft-delete → no public stock; history retained | Passed |
| F8 | Update private profile → refreshed form reads updated name | Passed |
| B1 | Anonymous Buy → listing interface without login | Passed |
| B2 | Combined description/location/type/price/kg quantity filtering | Passed |
| B3 | Buyer sends valid inquiry for published listing | Passed |
| B4 | Farmer sees Buyer inquiry from separate browser; marks read | Passed |
| B5 | Buyer history reflects read status on refetch | Passed |
| P1 | Buyer cannot create/edit Farmer listing in UI | Passed |
| P2 | Direct Buyer request cannot change Farmer listing price | Passed; no authorized row changed |
| P3 | Buyer cannot read Farmer private profile | Passed; no rows returned |
| P4 | Buyer cannot update their own role to Farmer | Passed; prohibited by grants/policies |
| P5 | Unrelated third user cannot read inquiry or alter seller status | Policy inspected; separate third-account dynamic test pending |
| P6 | Invalid direct quantity/price/contact bypassing form fails | Database rules present; unit cases passed; exhaustive direct payload suite pending |
| D1 | Listing/inquiry remain after refresh and read across two accounts | Passed |
| D2 | Local waste record: 5 quintal → 500 kg, reuse plan → dashboard survives refresh | Passed |
| U1 | Homepage Buy/Sell stack on mobile, side by side on desktop; no horizontal overflow | Passed at 390×710 and 1280×1800 |
| U2 | Published-origin auth redirects and central flow | Pending: not deployed/tested during this work |

## Automated files

| File | Coverage |
|---|---|
| `src/test/waste.test.ts` | Local quantities, units, dates, district and corrupt storage |
| `src/test/reuse-rules.test.ts` | Deterministic scores, thresholds and reasons |
| `src/test/impact.test.ts` | Cited factor calculations and invalid input |
| `src/test/dashboard.test.ts` | Waste summaries and impact eligibility |
| `src/test/marketplace.test.ts` | Legacy pure demo fixtures and shared contact/schema rules; not proof of Cloud RLS |
| `src/test/cloud-marketplace.test.ts` | Positive bounded quantities, valid contact/nonnegative price, INR/kg conversion, published-only filtering, safe return paths, Farmer/Buyer roles |
| `src/test/app-routing.test.tsx` | Route matching for public pages and account destinations; not rendering/auth proof |

## Safe manual reproduction

Use two accounts/mailboxes you control and two separate browsers. Keep email confirmation enabled. Choose test material clearly described as an evaluation listing, use only contact details you own, and remove the listing after checking. Do not seed fictional stock as actual availability.

1. Register Farmer and Buyer, confirm both mailboxes, login and logout each.
2. Farmer saves draft; Buyer cannot see it. Publish, then refresh Buyer browse.
3. Filter by location, material, normalized price and quantity; open details and send inquiry.
4. Farmer refreshes dashboard, reads inquiry, changes status; Buyer checks their history.
5. Attempt another user's listing edit, private-profile access and role update; expect denied access or zero authorized rows changed. Do not use privileged admin credentials for these checks.
6. Edit, mark unavailable and soft-delete; confirm public visibility changes, owner/history access and refresh behavior.
7. Verify actual reset email and published-origin redirects. Record results before marking these pending cases passed.

Browser checks performed during development are described above; their temporary sandbox scripts are not a committed reusable end-to-end test runner. The repository's reproducible test suite is Vitest. Tests are not evidence of measured environmental benefit, verified user identity, transactions or nationwide adoption.