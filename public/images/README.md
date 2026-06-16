# Error page illustrations

- `error-500.svg` — illustration for the 500 view. Not yet committed;
  drop the artwork here and it renders automatically.

The 404 view is currently text-only — no illustration slot in
`NotFoundView`. If a file is missing for 500, the `<img>` falls back to
an empty image (the `alt=""` keeps it silent for screen readers).
