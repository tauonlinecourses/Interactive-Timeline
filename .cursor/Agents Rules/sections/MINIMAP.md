# Minimap

The minimap is a small canvas at the bottom of the page that shows a scaled-down overview of the entire timeline. Users can click on it to jump to any position, drag to pan, or drag the viewport handles to resize the visible area.

## HTML Structure

```html
<div class="timeline-bottom-bar">
  <div class="timeline-minimap">
    <canvas id="minimapCanvas"></canvas>
    <div class="minimap-viewport">
      <div class="minimap-handle left"></div>
      <div class="minimap-handle right"></div>
    </div>
  </div>
  <!-- zoom controls live here too -->
</div>
```

## How It Works

### Drawing (Canvas)

`drawMinimap()` in `minimap.js` renders the minimap onto the `<canvas>`:

1. Reads all `.event-block` elements from the DOM (their `left`, `width`, and `background-color`)
2. Scales their positions proportionally to the canvas dimensions
3. Draws colored rectangles for each visible event
4. Hidden events (filtered-out categories) are skipped

The canvas is redrawn every time the timeline changes (zoom, filter, resize).

### Viewport Indicator (`.minimap-viewport`)

A translucent overlay on the minimap shows which portion of the full timeline is currently visible in the main scrollable area.

- Width and position update on every scroll event via `updateMinimapViewport()`
- Position formula:
  ```js
  viewportLeft = (scrollLeft / totalWidth) * minimapWidth;
  viewportWidth = (containerWidth / totalWidth) * minimapWidth;
  ```

### Interactions

Set up by `setupMinimapInteractions()` in `minimap.js`:

| Interaction | Behavior |
|-------------|----------|
| Click on minimap | Jump main timeline to that position |
| Drag minimap viewport | Pan main timeline scroll position |
| Drag `.minimap-handle.left` | Resize viewport (zoom out left) |
| Drag `.minimap-handle.right` | Resize viewport (zoom out right) |

Dragging a resize handle effectively changes the zoom level so the visible portion fits the new viewport width.

### Refresh

`refreshMinimap()` wraps `drawMinimap()` in a `requestAnimationFrame` call, preventing redundant redraws within the same frame. It is called from:
- `renderTimeline()` (after events render)
- Scroll events on `.timeline-scrollable`
- `updateZoom()`

## Relevant Files

| File | Role |
|------|------|
| `css/timeline.css` | Minimap container, canvas, viewport indicator, handles |
| `js/minimap.js` | All minimap logic: draw, update viewport, interactions |
| `js/zoom.js` | Calls `refreshMinimap()` after zoom changes |
| `js/timeline.js` | Calls `refreshMinimap()` after rendering events |
