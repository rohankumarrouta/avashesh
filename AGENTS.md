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
- Waste records persist only in browser localStorage via `src/lib/waste.ts` and `src/hooks/use-records.ts`; why: no backend yet — README must state this until one is added.
- Reuse suggestions come only from the fixed rules in `src/lib/reuse-rules.ts` and must return their reasons; why: the app must never imply AI.
- Sample data lives in `src/data/sample-records.json`, is flagged `isDemo` and shown as SAMPLE; why: no fake farmer data.
- Marketplace validation and mutations live in `src/lib/marketplace.ts`, with storage in `src/hooks/use-marketplace.ts` under a separate localStorage key; why: test mutations and keep waste records isolated.
- Marketplace ownership is a browser-local identifier, not authorization; samples live in `src/data/sample-listings.json` without contact numbers; why: the prototype must not imply accounts or real sellers.
