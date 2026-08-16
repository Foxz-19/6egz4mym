# Huefold Audit Notes

## Resolved issues

1. **Palette-strip label contrast can fail for user-selected colors**
   - Location: `styles.css`, `.strip-item span`
   - Fixed: the renderer now uses relative luminance to select black or white text, guaranteeing at least 4.5:1 contrast against every valid hex swatch.

2. **No skip link for keyboard users**
   - Location: `index.html`
   - Fixed: a visible-on-focus skip link now targets the primary `main` landmark.

3. **Decorative brand mark is not explicitly hidden from assistive technology**
   - Location: `index.html`, `.brand-mark`
   - Fixed: the decorative span is now marked `aria-hidden="true"`.

4. **Storage access can fail before a read or write method is called**
   - Location: `js/state.js`, `js/app.js`
   - Fixed: access to `localStorage` is guarded; unavailable storage starts an in-memory palette and shows an explanatory notice instead of preventing application startup.

5. **Long unbroken labels can overflow the swatch row on mobile**
   - Location: `js/ui.js`, `fixes.css`
   - Fixed: the swatch information column can shrink and labels now wrap at arbitrary characters when necessary.

## Maintainability opportunities

1. **Compressed source reduces readability**
   - Locations: `styles.css`, `js/app.js`, `js/state.js`, `js/ui.js`
   - The implementation is intentionally compact for the 25 KB source cap, but the one-line formatting makes review and future edits more error-prone.

## Verified behavior

- Add, validation, eight-swatch cap, move controls, delete confirmation, mini summary strip, and refresh persistence work.
- Empty state, corrupt saved data, failed storage writes, Escape cancellation/focus restoration, and mobile overflow behavior were browser-tested.
- `npm test` and `npm run typecheck` pass. Rendering is covered by direct unit tests, in addition to browser smoke testing.
- Current raw source is 22,419 bytes excluding Markdown, text, images, and installed dependencies; this is below the 25 KB limit.
