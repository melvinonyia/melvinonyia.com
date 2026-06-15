# Motion library trim — retire MagneticLink + CursorSpotlight

## Parent

PRD: `prd/prd-site-redesign.md`

## What to build

Delete `MagneticLink` and `CursorSpotlight` along with their test files. Every callsite has already been migrated by the preceding slices (#22 removed home callsites; CmdK in #29 doesn't render them). Grep the repo for any stragglers (imports, references in `__root.tsx`, exports) and remove them.

After this slice the alive library is reduced to one motion idiom — `HoverLift` (rule reveal) — plus the signature serif morph view transition, exactly as the redesign PRD defined.

This slice also handles the PRD-coherence task: amend `prd-site-v2.md` to strike `MagneticLink` and `CursorSpotlight` from the interaction primitives list, add the display serif to the type stack, and document the per-route palette decision, so future contributors don't reinstate retired primitives from the old spec.

## Acceptance criteria

- [ ] `MagneticLink.tsx`, `MagneticLink.test.tsx`, `CursorSpotlight.tsx`, `CursorSpotlight.test.tsx` deleted
- [ ] Repo grep for `MagneticLink` and `CursorSpotlight` returns zero matches outside the PRD changelog reference
- [ ] `typecheck` clean — no orphaned imports
- [ ] `build` clean
- [ ] `prd-site-v2.md` amended: retired primitives struck, display serif added, per-route palette documented
- [ ] Existing tests stay green

## Blocked by

- #22
- #29
