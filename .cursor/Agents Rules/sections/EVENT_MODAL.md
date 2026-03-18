# Event Detail Modal

The event detail modal opens when a user clicks an event block. It shows the full content for that event: image, title, date range, categories, text descriptions, embedded videos, and external links.

## HTML Structure

```html
<div id="eventModal" class="modal">
  <div class="modal-content">

    <div class="modal-hero">
      <!-- hero image -->
      <img class="modal-hero-image" src="..." />
      <button class="modal-hero-expand">↗</button>
    </div>

    <div class="modal-inner">

      <div class="modal-header">
        <div class="modal-categories">
          <span class="modal-category-chip">Category</span>
          ...
        </div>
        <h2 class="modal-title">Event Title</h2>
        <p class="modal-years">1492 – 1551</p>
      </div>

      <div class="modal-body">
        <!-- One section per category description -->
        <div class="modal-description-section">
          <h3 class="modal-description-category">Category Name</h3>
          <p class="modal-description-text">...</p>
          <!-- YouTube embed if video_url present -->
          <iframe class="modal-video" src="https://www.youtube.com/embed/..."></iframe>
        </div>
      </div>

      <div class="modal-footer">
        <div class="modal-links">...</div>
        <div class="modal-nav">
          <button id="prevEvent">←</button>
          <button id="nextEvent">→</button>
        </div>
      </div>

    </div>

    <button class="modal-close">✕</button>
  </div>
</div>
```

## Opening and Closing

**Open**: `showEventModal(event, options)` in `modal.js`
- Populates all fields from the event object
- Embeds YouTube player if `event.video_url` is set (`extractYouTubeId()`)
- Converts plain-text URLs in descriptions to `<a>` links (`linkifyText()`)
- Pushes state to browser history so back-button closes the modal
- Sets `?event=N` in the URL so the modal survives page refresh

**Close**: `closeEventModal()` in `modal.js`
- Removes modal content, hides overlay
- Optionally updates URL (skipped during navigation)

**Keyboard**: pressing `Escape` closes the modal (wired in `app.js`).

## Navigation Between Events

Prev/Next buttons (`#prevEvent`, `#nextEvent`) call `showPreviousEvent()` / `showNextEvent()` in `modal.js`. These step through the global `events[]` array, skipping events whose categories are all hidden.

## URL State

- Opening an event → `?event=3` added to URL
- On page load with `?event=3` → modal opens automatically (handled in `data-loader.js` after events load)
- Browser back button → `handlePopState()` in `navigation.js` closes the modal

## Links Section

The `.modal-links` area shows external links from `event.links[]`. If there are no links, this section is hidden. Long link lists are collapsed by default with an "expand" toggle.

## Relevant Files

| File | Role |
|------|------|
| `css/modal.css` | Modal layout, hero, header, body, footer |
| `js/modal.js` | `showEventModal()`, `closeEventModal()`, nav, links |
| `js/navigation.js` | `handlePopState()` — browser back button behavior |
| `js/config.js` | `events[]` array used for prev/next navigation |
| `js/app.js` | Wires `Escape` key listener |
