# Header Section

The header section sits at the top of the page and contains two elements: the info button and the timeline title image.

## HTML Structure

```html
<div class="info-header">
  <button class="info-button" id="infoButton">i</button>
  <img class="timeline-title-image" src="..." alt="..." />
</div>
```

**Location in index.html**: directly inside `<body>`, above `.categories-menu`.

## Elements

### Info Button (`.info-button`)
- Styled CSS: `info-button.css`
- A circular button labeled **"i"** (for information)
- On click → opens the **Info Modal** (`showInfoModal()` in `modal.js`)
- Event listener wired in `app.js` → `init()`

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
| `css/info-button.css` | Info button size, shape, color |
| `css/brand.css` | Title image sizing and positioning |
| `js/config.js` | `TIMELINES[variant].titleImage` path |
| `js/app.js` | Sets `src`, wires click listener |
| `js/modal.js` | `showInfoModal()` — opens info modal on click |
