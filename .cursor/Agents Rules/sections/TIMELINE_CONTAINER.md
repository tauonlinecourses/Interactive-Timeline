# Timeline Container

The timeline container is the main visual area of the page. It holds the scrollable timeline with all event blocks, year labels, the dividing line, the reflection effect, and the bottom bar (minimap + zoom controls).

## HTML Structure

```html
<div class="timeline-container">
  <div class="timeline-arrow-right"></div>

  <div class="timeline-scrollable" id="timelineScrollable">
    <div id="eventsLayer"></div>
    <div class="timeline-line"></div>
    <div id="reflectionLayer"></div>
    <div id="yearsLayer"></div>
  </div>

  <div class="timeline-bottom-bar">
    <!-- Minimap + Zoom controls -->
  </div>
</div>
```

## Key Elements

| Element | ID / Class | Description |
|---------|-----------|-------------|
| Outer wrapper | `.timeline-container` | Fixed height, clips overflow, positions bottom bar |
| Scrollable area | `.timeline-scrollable` | Horizontally scrollable; width set dynamically by JS |
| Events layer | `#eventsLayer` | Absolute-positioned event block elements |
| Timeline line | `.timeline-line` | Horizontal divider between above/below events |
| Reflection layer | `#reflectionLayer` | Mirror effect below the line |
| Years layer | `#yearsLayer` | Year label elements |
| Bottom bar | `.timeline-bottom-bar` | Sticky bottom row with minimap and zoom controls |

## Sizing and Layout Variables

All height-related measurements are driven by CSS custom properties in `base.css`:

```css
:root {
  --tl-margin-top: 40px;         /* space above timeline */
  --tl-height: 850px;            /* total scrollable height */
  --tl-events-top: 25px;         /* top of event blocks */
  --tl-line-bottom-gap: 70px;    /* gap from bottom to timeline line */
  --tl-events-line-gap: 55px;    /* gap between bottom of events and the line */
  --tl-bottom-reserved: 110px;   /* height reserved for minimap/zoom bar */
}
```

These are overridden in `mobile.css` for smaller screens.

## Width Calculation (JavaScript)

The scrollable width is calculated in `renderTimeline()` (`timeline.js`):

```js
const totalYears = maxYear - minYear + 1;
const width = totalYears * yearWidth; // yearWidth = current zoom level (px/year)
timelineScrollable.style.width = width + 'px';
```

## Drag-to-Pan

Users can click and drag horizontally inside `.timeline-scrollable`. This is set up by `setupTimelineDrag()` in `timeline.js`:
- Mouse down → capture cursor position
- Mouse move → update `scrollLeft`
- Mouse up → release
- Adds `.dragging` class during drag (cursor changes to `grabbing`)

## RTL Direction

The timeline renders **right-to-left** (newer events on the left, older on the right). The `yearToLeft(year)` function in `config.js` translates a year to a pixel offset:

```js
yearToLeft(year) {
  return (maxYear - year) * yearWidth;
}
```

## Relevant Files

| File | Role |
|------|------|
| `css/timeline.css` | Container, scrollable area, bottom bar layout |
| `css/base.css` | CSS variables for all height/spacing values |
| `css/years.css` | Timeline line and year label layer styles |
| `css/mobile.css` | Responsive overrides |
| `js/timeline.js` | `renderTimeline()`, width calc, drag setup |
| `js/config.js` | `yearToLeft()`, `yearWidth`, `minYear`/`maxYear` |
