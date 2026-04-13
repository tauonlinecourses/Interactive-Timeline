# Header Section

The header section sits at the top of the page and contains two elements: the info button and the timeline title image.

## HTML Structure

```html
<div class="info-header">
  <button class="info-button" id="infoBtn" type="button" aria-label="..." aria-describedby="infoBtnTooltip">
    <span class="info-button__tooltip" id="infoBtnTooltip" role="tooltip">…</span>
    <span aria-hidden="true">i</span>
  </button>
  <img class="timeline-title-image" id="timelineTitleImage" src="" alt="" />
</div>
```

**Location in index.html**: inside `<body>`, after the brand sticker link and above the timeline container.

## Elements

### Info Button (`.info-button`)
- Styled CSS: `info-button.css`
- A circular button labeled **"i"** (for information), element id **`infoBtn`**
- **Tooltip** (`.info-button__tooltip`, id **`infoBtnTooltip`**): Hebrew helper text sits **below** the button in a **rectangular** panel (`border-radius: 0`) with the **same background color as the info button** (`#464646`), max width about **350px** on desktop (narrower on small viewports), with its **right edge aligned to the button** (`right: 0` on the tooltip) and `width` clamped with `calc(100vw - 28px)` (desktop header inset) so it does not overflow the **right** edge of the screen. **Show / hide** use a short **fade** (`opacity` ~0.35s `ease-out`), a light **`translateY(6px)` → `0`**, and **`visibility` delayed on hide** so the fade-out finishes before the box is marked hidden. **`prefers-reduced-motion: reduce`**: no transition or motion on the tooltip. It is shown on **hover** and **keyboard focus** (`:focus-visible`), and after **3 seconds** from page load for **10 seconds** via the class **`info-button--tooltip-visible`** (scheduled in `initInfoModal()` with **`INFO_TOOLTIP_DELAY_MS`** then **`INFO_TOOLTIP_INTRO_MS`**; cleared if the info button is clicked before or during the intro). The **`i`** label uses `aria-hidden="true"` so only the accessible name / description are exposed.
- **Israel timeline exception**: when `?t=israel`, the tooltip element is removed and the intro timer is not scheduled (so the info button has no tooltip on the Israel page only).
- On click → opens the **Info Modal** (`showInfoModal()` in `modal.js`)
- Event listener wired in `modal.js` → `initInfoModal()`

### Timeline Title Image (`.timeline-title-image`)
- Source is set dynamically from the active timeline config in `app.js`:
  ```js
  titleImg.src = activeTimeline.titleImage;
  ```
- Each timeline variant defines its own `titleImage` path inside the `TIMELINES` object in `config.js`
- Styled via `brand.css`

## Relevant Files

| File | Role |
|------|------|
| `css/info-button.css` | Info button size, shape, color, hover/active styles, tooltip |
| `css/brand.css` | Title image sizing and positioning |
| `js/config.js` | `TIMELINES[variant].titleImage` path |
| `js/app.js` | Sets title image `src` |
| `js/modal.js` | `initInfoModal()` — tooltip intro + `#infoBtn` click; `showInfoModal()` — opens info modal |
