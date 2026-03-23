# Zoom Controls

The zoom controls are two buttons (zoom in / zoom out) in the bottom bar. They change how many pixels represent one year, effectively compressing or expanding the timeline horizontally.

## HTML Structure

```html
<div class="controls">
  <button id="zoomOut"><!-- minus SVG icon --></button>
  <button id="zoomIn"><!-- plus SVG icon --></button>
</div>
```

Located inside `.timeline-bottom-bar`, next to the minimap.

## Zoom Levels

Zoom is measured as `yearWidth` — **pixels per year**. There are 8 discrete preset levels:

```js
// Defined in zoom.js
const zoomLevels = [3.57, 8, 15, 30, 50, 100, 150, 200];
```

`maxZoomOut` (the minimum allowed `yearWidth`) is calculated by `data-loader.js` after events load, to fit the full date range in the viewport.
On smaller screens this value may go below the initial hardcoded zoom floor so that `max zoom out` does not produce horizontal scrolling.

On `window.resize`, the fit-to-viewport `maxZoomOut` value is recomputed (debounced). If the user is currently at max zoom out, the timeline is re-zoomed to keep it fitting after the resize.

## How Zoom Works

`updateZoom(newYearWidth, options)` in `zoom.js`:

1. Sets `yearWidth` in global state (`config.js`)
2. Calls `renderTimeline()` to re-render events and year labels at the new scale
3. Preserves the scroll anchor so the center of the viewport stays centered
4. Calls `refreshMinimap()` to update the minimap
5. Calls `setZoomButtonStates()` to disable buttons at limits

**Anchor options:**
- `center` (default) — keeps the currently centered year in view
- `left` — keeps the leftmost visible year in view
- `right` — keeps the rightmost visible year in view

## Other Zoom Triggers

Besides button clicks, zoom can be triggered by:

| Trigger | Handler | Setup location |
|---------|---------|----------------|
| Mouse wheel (`Ctrl+scroll`) | `setupWheelZoom()` | `zoom.js` |
| Pinch gesture (touch) | `setupTouchZoom()` | `zoom.js` |
| Minimap handle drag | `setupMinimapInteractions()` | `minimap.js` |

## Button States

`setZoomButtonStates()` disables the zoom-in button at the maximum level and the zoom-out button at the minimum level, giving visual feedback that the limit has been reached.

## Relevant Files

| File | Role |
|------|------|
| `css/controls.css` | Button appearance, disabled state |
| `js/zoom.js` | `updateZoom()`, `zoomIn()`, `zoomOut()`, wheel/pinch setup |
| `js/config.js` | `yearWidth` global state |
| `js/timeline.js` | `renderTimeline()` — called after every zoom change |
| `js/minimap.js` | `refreshMinimap()` — called after every zoom change |
| `js/data-loader.js` | Computes dynamic fit-to-viewport `maxZoomOut` and updates it on resize |
| `js/app.js` | Wires click listeners for `#zoomIn` / `#zoomOut` |
