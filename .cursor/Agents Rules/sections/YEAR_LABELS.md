# Year Labels

Year labels are text elements placed along the timeline to show the time scale. They sit in the `#yearsLayer` div, just below the timeline line.

## HTML Structure

```html
<div id="yearsLayer">
  <span class="year-label" style="left: 0px;">2024</span>
  <span class="year-label" style="left: 357px;">2020</span>
  <!-- ... -->
</div>
```

When condensed (low zoom), labels also get the `.condensed-labels` class on the container.

## Rendering Logic

Labels are created by `renderYearLabels()` in `timeline.js`, called as part of `renderTimeline()`.

### Label Interval by Zoom Level

The interval between labeled years adapts to avoid crowding:

| Zoom level (yearWidth px/year) | Interval |
|-------------------------------|----------|
| Very low (zoomed out) | Every 100 years |
| Low | Every 10 years |
| Medium | Every 5 years |
| High | Every 2 years |
| Maximum | Every 1 year |

Exact thresholds are defined inside `renderYearLabels()` in `timeline.js`.

### Positioning

Each label's `left` offset is calculated using `yearToLeft(year)` from `config.js`, which handles RTL layout:

```js
label.style.left = yearToLeft(year) + 'px';
```

## Condensed Mode

When the label interval is greater than 1 year, the `#yearsLayer` gets the `.condensed-labels` class. This class applies reduced font size and spacing so that labels don't visually overlap at low zoom.

## Relevant Files

| File | Role |
|------|------|
| `css/years.css` | Year label typography and positioning |
| `js/timeline.js` | `renderYearLabels()` — creates and positions labels |
| `js/config.js` | `yearToLeft()`, `minYear`, `maxYear`, `yearWidth` |
| `js/zoom.js` | `updateZoom()` → triggers `renderTimeline()` → new labels |
