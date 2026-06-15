# /contact: form rebuild — dark, mono-labelled, hairline inputs

## Parent

PRD: `prd/prd-site-redesign.md`

## What to build

Rebuild `/contact` and `ContactForm` on the dark palette in the new typographic language. Page title `CONTACT` in display serif; intro line in Söhne; form fields use mono uppercase labels above bare inputs with a hairline underline (no boxed inputs, no rounded corners); submit button is a mono uppercase control with a brick hover rule. Acknowledgement and error states inherit the same typographic language — mono labels, serif headlines if any, no system-default UI.

The form's submission semantics, validation behavior, and accessibility (labelled-by associations, form role, error announcement) are preserved from v1 — only the visual and structural layer changes.

## Acceptance criteria

- [ ] `/contact` rebuilt with serif page title, Söhne intro, mono-labelled form
- [ ] Inputs use hairline underline; no boxed inputs; no rounded corners
- [ ] Submit button is a mono uppercase control with brick hover rule
- [ ] Acknowledgement and error states use the new typographic language
- [ ] `<form>` semantics, labelled-by associations, and error announcement preserved
- [ ] `ContactForm.test.tsx` updated for new structure and a11y assertions
- [ ] Existing tests stay green

## Blocked by

- #18
- #20
