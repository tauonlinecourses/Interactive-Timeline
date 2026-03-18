# Category Filter Menu

The category filter menu is a row of buttons at the top of the page. Each button represents one category (e.g. "Racism", "Colonialism"). Clicking a button toggles that category's events on/off in the timeline.

## HTML Structure

```html
<div class="categories-menu">
  <!-- Buttons are injected dynamically by categories.js -->
  <button class="category-btn" data-category="CategoryName" style="--btn-color: #C36D53;">
    <span class="category-btn-dot"></span>
    CategoryName
  </button>
  ...
</div>
```

## How Categories Are Created

Categories are **not predefined** — they are extracted at runtime from the event data:

```
loadEvents()
  └─> deriveCategoriesFromDescriptions(event)  // keys of event.descriptions object
      └─> extractCategories()                  // deduplicate + sort
          └─> mapCategoriesToColors()           // assign palette colors
              └─> renderCategoryButtons()       // inject <button> elements into DOM
```

All logic lives in `js/categories.js`.

## Toggling Visibility

```js
toggleCategoryVisibility(category)
```
- Flips the boolean in `hiddenCategories[category]` (global state in `config.js`)
- Calls `renderTimeline()` to fade out/in affected events
- Calls `updateURL()` to persist state as `?hide=cat1,cat2`

When a category is hidden:
- Its button gets the `.hidden` class → visually muted
- Events belonging only to that category fade out and are removed from DOM

## URL Persistence

Hidden categories survive page refresh via URL parameter:

```
?hide=Colonialism,Religion
```

Parsed on load by `readURLParams()` in `categories.js`, which pre-populates `hiddenCategories`.

## Color System

Colors come from CSS custom properties defined in `base.css`:

```css
:root {
  --category-1-color: #C36D53;
  --category-2-color: #66B973;
  /* ... up to --category-16-color */
}
```

`readColorPaletteFromCSS()` in `config.js` reads these at runtime into `colorPalette[]`. Categories are assigned colors in the order they are discovered, cycling through the 16-color palette.

Theme overrides (e.g. `.theme-israel`) redefine these same variables to give each timeline its own palette.

## Relevant Files

| File | Role |
|------|------|
| `css/categories.css` | Button layout, colors, `.hidden` state |
| `css/base.css` | `--category-N-color` custom properties |
| `js/categories.js` | All category logic |
| `js/config.js` | `hiddenCategories`, `categoryColors`, `colorPalette` |
| `js/data-loader.js` | Calls `renderCategoryButtons()` after fetching events |
