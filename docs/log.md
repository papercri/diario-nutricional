# Changelog - Design System Improvements

## 2026-07-20

### Design Tokens Added

Added new CSS custom properties to `src/design-system/tokens/index.css`:

**Nutri-Score colors:**
- `--clr-nutri-a` (#038141)
- `--clr-nutri-b` (#85bb2f)
- `--clr-nutri-c` (#fecb02)
- `--clr-nutri-c-text` (#3d3400)
- `--clr-nutri-d` (#ee8100)
- `--clr-nutri-e` (#e63e11)

**Nutrient variant colors:**
- `--clr-nutrient-lime-bg` (#f4f8ec)
- `--clr-nutrient-lime-border` (#d1e0be)
- `--clr-nutrient-amber-border` (#e8d9b0)
- `--clr-nutrient-brown-bg` (#f5ebe0)
- `--clr-nutrient-brown-border` (#d9c4b0)
- `--clr-nutrient-brown-bar` (#a0785c)
- `--clr-nutrient-brown-text` (#8b6548)
- `--clr-nutrient-emerald-border` (#c0d4a8)

**BMI gauge colors:**
- `--clr-bmi-underweight` (#22c55e)
- `--clr-bmi-normal` (#84cc16)
- `--clr-bmi-overweight` (#eab308)
- `--clr-bmi-obese` (#f97316)
- `--clr-bmi-extreme` (#ef4444)

### Hardcoded Colors Replaced with Tokens

**NutrientCard.vue:**
- Replaced 8 hardcoded hex colors with design tokens
- Colors remain identical, now use token references

**FoodDetailModal.vue:**
- Replaced Nutri-Score hex colors with `--clr-nutri-*` tokens
- Fallback color changed from `#ccc` to `var(--clr-border)`

**ProfileView.vue:**
- Replaced BMI gauge gradient colors with `--clr-bmi-*` tokens

**style.css (Nutri-Score badges):**
- Replaced all Nutri-Score background colors with tokens
- Replaced `#fff` with `var(--clr-text-inverse)`
- Replaced `box-shadow` hardcoded value with `var(--shadow-sm)`

### Refactor: @/ Alias Migration

**Phase 1 (views, stores, composables, services, components):**
- Migrated all relative imports (`../../utils/...`, `../stores/...`) to `@/` alias across the entire codebase
- Updated imports in `DashboardView.vue`, `ProfileView.vue`, `FoodDetailModal.vue`, `NutrientCard.vue`, `AiAnalyzerModal.vue`, `FoodSearch.vue`, `AddFoodModal.vue`, `CalorieChart.vue`, `AppHeader.vue`
- Updated store imports in `foodStore.ts`, `userStore.ts`
- Updated composable imports in `useNutrientColors.ts`, `useFoodMacros.ts`
- Updated service imports in `tipsService.ts`
- Updated router imports in `index.ts`

**Phase 2 (utils, services, design-system):**
- Migrated remaining utils: `mifflinStJeor.ts`, `localFoodFallback.ts`, `foodSearch.ts`
- Migrated services: `openFoodFacts.ts`
- Migrated design system: `useToast.ts`

### Docs: Fix Groq Model Mismatch

- Corrected README.md: changed model from `llama-3.3-70b-versatile` to `gpt-oss-120b` in the Groq example

### Tests: 59 New Unit Tests (107 Total)

- Added comprehensive unit tests for:
  - `userStore.ts` (profile management, goals, calorie calculations)
  - `foodStore.ts` (food entries, daily totals, history)
  - `openFoodFacts.ts` (API calls, data mapping)
  - `tipsService.ts` (tip generation, randomization)
  - `useNutrientColors.ts` (color assignment logic)
  - `useFoodMacros.ts` (macro calculations)
- Test coverage improved significantly across stores, services, and composables

### Performance: FontAwesome Tree-Shaking

- Replaced full FontAwesome CSS bundle with tree-shaken SVG components
- Reduced from ~100+ icons to 40 actually used icons
- Created individual icon imports via `@fortawesome/free-solid-svg-icons`
- Configured `@fortawesome/vue-fontawesome` with explicit icon registry
- Removed `@fortawesome/fontawesome-free` CSS import from `style.css`

### Accessibility: FoodDetailModal Focus Management

- Implemented focus trap in `FoodDetailModal.vue`
- Focus now returns to trigger element when modal closes
- Body scroll is locked while modal is open
- Added proper `aria-modal` and role attributes

### Design System: Shared Utility Classes

- Extracted and deduplicated CSS patterns into shared utility classes
- Created common classes for card layouts, typography, spacing, and interactive states
- Reduced CSS duplication across components

### Docs: README Updates

- Added FontAwesome tree-shaking documentation
- Updated test count (107 tests)
- Documented shared design system classes
- Listed new design tokens

### Fixes: FoodCard Action Buttons

**Icon sizing:**
- Reduced action button icons from `2rem` to `0.875rem`
- Improved visual balance in food card layout

**Icon alignment:**
- Centered action button icons properly
- Fixed vertical alignment issues

### Style: Token Adjustments

**Text color:**
- Darkened `--clr-text-faint` from `#66605b` to `#504b47`
- Improved readability on light backgrounds

**Font size:**
- Increased base font size from `0.625rem` to `0.675rem` across 6 occurrences
- Better text legibility on mobile devices

### Dashboard: Meal Section Improvements

**Spacing:**
- Increased gap between meal sections from `0.5` to `1.5` units
- Better visual separation between meal categories

**Default icon for AI foods:**
- Added fallback utensils icon for food entries without images
- Applied to foods added via AI analyzer that lack imageUrl
- Icon displays with light green background when no image available
