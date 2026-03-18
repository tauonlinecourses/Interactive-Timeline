# Info Modal

The info modal opens when the user clicks the "i" button in the header. It provides background information about the timeline project — who made it, what sources were used, and a link to a downloadable PDF. Content is loaded from a JSON file and is specific to each timeline variant.

## HTML Structure

```html
<div id="infoModal" class="modal info-modal">
  <div class="modal-content info-modal-content">

    <div class="info-modal-inner">

      <!-- Left column: PDF preview -->
      <div class="info-modal-left">
        <a href="..." target="_blank">
          <img class="info-pdf-preview" src="..." />
        </a>
      </div>

      <!-- Right column: text sections -->
      <div class="info-modal-right">
        <div class="info-section">
          <h3 class="info-section-title">Section Title</h3>
          <p class="info-section-body">...</p>
        </div>
        ...
      </div>

    </div>

    <button class="modal-close">✕</button>
  </div>
</div>
```

## Content Source

Content is fetched from a JSON file specific to the active timeline:

| Timeline | File |
|----------|------|
| Global | `static/events-files/info.json` |
| Israel | `static/events-files/israel-info.json` |

The file path is defined in the `TIMELINES` config object in `config.js`:
```js
TIMELINES = {
  global: { infoFile: 'static/events-files/info.json', ... },
  israel: { infoFile: 'static/events-files/israel-info.json', ... }
}
```

### JSON Structure

```json
{
  "pdf_url": "static/files/document.pdf",
  "pdf_preview_image": "static/images/pdf-preview.jpg",
  "sections": [
    {
      "title": "About this project",
      "body": "Text content..."
    }
  ]
}
```

## Loading Pipeline

```
app.js init()
  └─> loadInfo()          (data-loader.js)
      └─> populateInfoModal()
          └─> injects .info-section elements into #infoModal
```

`loadInfo()` is called before `loadEvents()` so the modal is ready immediately.

## Opening and Closing

- **Open**: `showInfoModal()` in `modal.js`, triggered by clicking `.info-button`
- **Close**: `closeInfoModal()` in `modal.js`, triggered by clicking `.modal-close` or pressing `Escape`

Both functions simply toggle the `.active` / visibility class on `#infoModal`.

## Language

Info content is written in **Hebrew** (RTL). The modal layout and `direction: rtl` in the CSS accommodate this.

## Relevant Files

| File | Role |
|------|------|
| `css/info-modal.css` | Two-column layout, PDF preview, section styles |
| `css/modal.css` | Shared modal base styles (backdrop, close button) |
| `js/modal.js` | `showInfoModal()`, `closeInfoModal()` |
| `js/data-loader.js` | `loadInfo()`, `populateInfoModal()` |
| `js/config.js` | `TIMELINES[variant].infoFile` path |
| `static/events-files/info.json` | Global timeline info content |
| `static/events-files/israel-info.json` | Israel timeline info content |
