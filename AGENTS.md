<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Business logic (validation, emissions math) lives in pure modules in `src/lib/` with tests in `src/test/`; why: keeps rules testable without rendering.
- Emission factors must cite their source in `src/lib/impact.ts` and README; why: impact claims must be verifiable.
- Waste records persist only in browser localStorage via `src/lib/waste.ts` and `src/hooks/use-records.ts`; why: preserve existing waste features independently of the Cloud marketplace.
- Reuse suggestions come only from the fixed rules in `src/lib/reuse-rules.ts` and must return their reasons; why: the app must never imply AI.
- Sample data lives in `src/data/sample-records.json`, is flagged `isDemo` and shown as SAMPLE; why: no fake farmer data.
- Shared marketplace validation and filters live in `src/lib/cloud-marketplace.ts`, writes in `src/lib/marketplace.functions.ts`; why: enforce the same rules client/server and keep waste records isolated.
- Marketplace uses Cloud authenticated ownership/RLS with roles separate from private profiles; legacy sample JSON is test-only, never seeded publicly; why: protect real cross-user data and avoid fabricated stock.
- Public marketplace routes use inline sign-in actions; private dashboards use the authenticated layout and account context; why: anonymous browsing must remain available while writes require real auth.
- Store full locations separately with owner/inquiry-participant SELECT policies and save atomically through an ownership-checked RPC; why: public listing rows must never carry private addresses.
- Storage reads are owner-only; public media signing accepts a listing ID and verifies a published row before privileged signing; why: preserve published photos without broad cross-user storage access.
- Shared mission, goals, material opportunities and pending impact presentation live in MissionSections; why: homepage and About must use consistent claims without changing marketplace or local impact calculations.
- BrandLogo renders the canonical uploaded asset for all site branding, with a padded favicon derived from it; why: keep the original artwork unchanged and prevent divergent replacements.
