# Event Blocks

Each historical event is rendered as a positioned block inside `#eventsLayer`. Events appear above the timeline line. Clicking an event opens the Event Detail Modal.

## HTML Structure (per event)

```html
<div class="event"
     data-event-index="3"
     data-lane-index="0"
     data-min-width="80"
     style="left: 1200px; top: 80px; width: 240px;">

  <div class="event-title">
    <span class="event-title-text">Event Name</span>
    <span class="event-title-category-circle" style="background: #C36D53;"></span>
    <!-- one circle per category the event belongs to -->
  </div>

  <div class="event-block" style="background: #C36D53;">
    <!-- optional video icon -->
    <img class="video-icon" src="..." />
  </div>

</div>
```

## Positioning

Position is calculated by `renderEvents()` in `timeline.js`:

```js
left  = yearToLeft(event.start_year);         // pixel offset from right
width = (event.end_year - event.start_year) * yearWidth;
top   = laneIndex * (eventHeight + laneGap);  // vertical lane stacking
```

`yearToLeft()` is defined in `config.js` and handles RTL direction.

## Lane Assignment (Overlap Prevention)

Events that start in the same year are stacked vertically into **lanes** (up to 8 by default):

1. Try lane 0 first.
2. If a previously placed event in lane 0 overlaps horizontally, try lane 1.
3. Continue until a free lane is found.
4. The `data-lane-index` attribute records which lane was assigned.

This prevents event blocks from visually overlapping.

## Visual Style

- **Shape**: Parallelogram via CSS `clip-path` (defined in `events.css`)
- **Color**: Derived from the first category's color in `categoryColors`
- **Hover**: `translateY(-3px)` lift effect
- **Video icon**: White SVG arrow shown if the event has a `video_url`

## Category Circles

Small colored circles appear in the `.event-title` area — one per category the event belongs to. Color matches the category button color from the palette.

## Animations

| Animation class | When applied | Effect |
|----------------|-------------|--------|
| `entrance-animation` | Initial page load only | Staggered slide-up, delay based on start_year |
| `fade-in` | Re-render after filter change (event becomes visible) | Opacity 0 → 1 |
| `fade-out` | Re-render after filter change (event becomes hidden) | Opacity 1 → 0, then removed from DOM |

Entrance animation is gated by a `firstLoad` flag in `timeline.js` so it only runs once.

## Interaction

- **Hover**: `showTooltip()` from `visual-effects.js` — shows a floating card with image, categories, title
- **Click**: `showEventModal(event)` from `modal.js` — opens the full event detail modal
- **Category filter**: if any of the event's categories are in `hiddenCategories`, the event is hidden

## Sticky Titles on Scroll

When a user scrolls left and an event block's left edge goes out of view, the `.event-title` sticks to the left viewport edge so the label remains readable. This is handled by `setupStickyTitlesOnScroll()` in `timeline.js`.

## Relevant Files

| File | Role |
|------|------|
| `css/events.css` | Block shape, colors, hover, animations |
| `js/timeline.js` | `renderEvents()`, lane algorithm, sticky titles |
| `js/config.js` | `yearToLeft()`, `categoryColors`, `hiddenCategories` |
| `js/visual-effects.js` | Tooltip on hover |
| `js/modal.js` | `showEventModal()` on click |
