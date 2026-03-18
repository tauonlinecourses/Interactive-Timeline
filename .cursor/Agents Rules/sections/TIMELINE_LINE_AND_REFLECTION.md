# Timeline Line and Reflection

The timeline line is a horizontal rule that visually divides the timeline. Above it are event blocks; below it is a mirror reflection effect. Together they create the core "timeline" visual.

## HTML Structure

```html
<div class="timeline-scrollable">
  <div id="eventsLayer">...</div>

  <div class="timeline-line"></div>      <!-- horizontal divider -->

  <div id="reflectionLayer">...</div>    <!-- mirror effect below -->
  <div id="yearsLayer">...</div>
</div>
```

## Timeline Line (`.timeline-line`)

- A full-width horizontal bar
- Positioned by CSS at a fixed vertical offset from the bottom of `.timeline-scrollable`, controlled by `--tl-line-bottom-gap` in `base.css`
- Has no JavaScript behavior — purely decorative/structural CSS

**Key CSS variable:**
```css
--tl-line-bottom-gap: 70px; /* distance from bottom of container to the line */
```

## Reflection Layer (`#reflectionLayer`)

The reflection layer renders a downward mirror image of the event blocks beneath the timeline line. This is a visual effect that gives the timeline a polished, glossy appearance.

- Elements are cloned/rendered into `#reflectionLayer` by JavaScript in `timeline.js` during `renderEvents()`
- The reflection is flipped vertically with CSS `transform: scaleY(-1)` and has reduced opacity to look like a surface reflection
- The reflection updates whenever events are re-rendered (zoom change, filter change)

## CSS Variables Controlling Vertical Layout

All vertical positions of events, line, and reflection are derived from a set of CSS custom properties in `base.css`:

```css
:root {
  --tl-height: 850px;
  --tl-line-bottom-gap: 70px;     /* line position from bottom */
  --tl-events-line-gap: 55px;     /* gap between event blocks bottom edge and line */
  --tl-events-top: 25px;          /* top padding for event block area */
}
```

Changing `--tl-height` (e.g. in `mobile.css`) automatically adjusts all derived vertical positions.

## Relevant Files

| File | Role |
|------|------|
| `css/years.css` | `.timeline-line` styles |
| `css/base.css` | `--tl-line-bottom-gap`, `--tl-height` CSS variables |
| `css/mobile.css` | Overrides for smaller screens |
| `js/timeline.js` | Populates `#reflectionLayer` during `renderEvents()` |
