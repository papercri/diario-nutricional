# Changelog - Design System Improvements

## 2026-07-22

### Feature: Recipe Cards Unified with Plate Cards

Recipe cards ("Mis recetas") now use the same component and behavior as plate cards ("Mis platos"). Both display identical accent bar logic, allergen tags, vegan/vegetarian badges, and detail modals.

**Database migration (`saved_recipes`):**
- Added `description`, `serving_size`, `image_url`, `allergens`, `is_vegan`, `is_vegetarian`, `nutrition_score` columns

**Files modified:**
- `src/types/supabase.ts` — Extended `saved_recipes` Row/Insert/Update with 7 new columns
- `src/stores/savedRecipesStore.ts` — Extended `SavedRecipe` interface with new fields; updated `loadRecipes`, `saveRecipe`, `migrateToSupabase` mappings
- `src/views/RecipeGeneratorView.vue` — `saveRecipe()` now passes `description`, `servingSize`, `imageUrl`, `allergens`, `isVegan`, `isVegetarian`, `nutritionScore`
- `src/views/DashboardView.vue` — Recipe card uses same accent bar logic, allergen tags, vegan/vegetarian badges as plate card; recipe modal adds image, description, serving, nutrition score, allergen section, dietary badges
- `src/views/ProfileView.vue` — Same card and modal updates as DashboardView

---

## 2026-07-20

### Feature: Allergen & Dietary Info Card (Mis Platos)

Added allergen and dietary information card to the AI meal analyzer ("Mis Platos") page. Each analyzed dish now displays its main allergens with icons and labels, plus a vegan/vegetarian badge when applicable.

**Files created:**
- `src/components/nutrition/AllergenInfoCard.vue` — Card component showing allergen badges (icon + text) and dietary icons (vegan/vegetarian)

**Files modified:**
- `src/types/nutrition.ts` — Added `AllergenType` union type (12 allergens), extended `NutritionAnalysis` with `allergens`, `isVegan`, `isVegetarian` fields
- `api/analyze-meal.ts` — Updated AI prompt to request allergen and dietary data; extended `validateAnalysis` to accept new fields
- `src/views/NutritionAnalyzerView.vue` — Integrated `AllergenInfoCard` between result card and nutrition grid

**Design system:**
- Reuses existing `Card` component with `elevated` variant
- Allergen badges use `--clr-accent-light` / `--clr-accent` tokens
- Vegan badge uses `--clr-success-light` / `--clr-success` tokens
- Vegetarian badge uses `--clr-primary-light` / `--clr-primary` tokens
- Follows established typography patterns for section titles

### Feature: Recent Meals Dropdown (Mis Platos)

Added a dropdown list of recent meal descriptions below the textarea input in the AI meal analyzer. Users can click any previous entry to reuse it instantly.

**Files modified:**
- `src/components/nutrition/MealAnalyzerForm.vue` — Added localStorage-backed history (max 5), dropdown UI with listbox semantics, clear button
- `src/fontawesome.ts` — Added `faArrowRight`, `faClockRotateLeft` icons
- `src/components/nutrition/AllergenInfoCard.vue` — Fixed icon mapping (replaced invalid `faNut` with `faBowlFood`)

---

### Feature: Generador de Recetas con IA

New standalone recipe generation page at `/recetas`. Users can configure dietary preferences, exclude allergens, specify preferred ingredients, and add custom instructions. The AI generates personalised recipes adapted to the user's dietary goal from their profile.

**Files created:**
- `src/types/recipe.ts` — Types: `Allergen`, `DietaryPreference`, `RecipeConfig`, `GeneratedRecipe`, `RecipeAIResponse`
- `api/generate-recipe.ts` — Serverless endpoint reusing Groq/Cerebras providers with recipe-specific system prompt
- `src/services/recipeAI.ts` — Client service calling `/api/generate-recipe`
- `src/views/RecipeGeneratorView.vue` — Full page view with config panel and result display

**Files modified:**
- `src/utils/constants.ts` — Added `DIETARY_PREFERENCE_OPTIONS` (4 options) and `ALLERGEN_OPTIONS` (12 allergens) with icons
- `src/router/index.ts` — Added `/recetas` route (lazy-loaded)
- `src/components/AppHeader.vue` — Added "Recetas" nav link with utensils icon
- `src/fontawesome.ts` — Added 9 new icons: `faBowlFood`, `faBullseye`, `faCarrot`, `faClock`, `faEgg`, `faFish`, `faGlassWater`, `faListOl`, `faSeedling`, `faShrimp`, `faUsers`
- `server-dev.ts` — Extended dev proxy to handle `/api/generate-recipe`

**Design system usage:**
- Reuses existing `DsCard`, `DsButton`, `DsTypography` components
- Toggle buttons follow the established `btn-toggle` CSS pattern from ProfileView
- Recipe result uses card layout with nutrition grid, ingredients list, ordered steps, and tips
- Mobile-first responsive layout with 2-column grid (config + result)

**AI integration:**
- Reuses existing Groq/Cerebras provider infrastructure
- New system prompt generates structured JSON: recipe name, description, ingredients, steps, macros, tips
- User's dietary goal, calorie target, and macro targets are passed to the AI prompt
- All allergens are strictly excluded from generated recipes

---

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
- Replaced BMI gauge gradient codlors with `--clr-bmi-*` tokens

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

## 2026-07-20

### Feature: Dashboard with Tabs (Mi día, Mis platos, Mis recetas, Perfil)

Redesigned the DashboardView to include a tabbed interface for navigating between different sections of the app.

**Files modified:**
- `src/views/DashboardView.vue` — Complete rewrite with 4 tabs: Mi día (daily tracking), Mis platos (saved plates), Mis recetas (saved recipes), Perfil (profile summary + edit link)
- `src/fontawesome.ts` — Added `faStar`, `faStarHalfStroke`, `faTag` icons for favorites and tags
- `src/composables/useAuth.ts` — Added savedPlatesStore and savedRecipesStore to migration and auth state handling
- `src/views/NutritionAnalyzerView.vue` — Added "Guardar plato" button with star icon to save analyzed plates to favorites
- `src/views/RecipeGeneratorView.vue` — Added "Guardar receta" button with star icon to save generated recipes to favorites

**Files created:**
- `src/stores/savedPlatesStore.ts` — Pinia store for saved plates with dual localStorage/Supabase persistence
- `src/stores/savedRecipesStore.ts` — Pinia store for saved recipes with dual localStorage/Supabase persistence

**Design details:**
- Tab bar uses `--clr-primary` active state with `--clr-text-inverse` text
- Saved plates grid: responsive auto-fill with 160px min columns
- Saved recipes grid: same responsive pattern
- Plate modal: shows image, name, description, macros, serving size
- Recipe modal: shows name, stats, ingredients list, preparation steps
- Profile tab: avatar, name, stats grid, allergen tags, dietary preference tags, edit button
- Favorite button: secondary style with star icon, changes to "Guardado en favoritos" text after saving
- All modals use existing Modal component with `size="md"` for detail views

## 2026-07-20

### Feature: ProfileView with Tabs + Login Fix + Auto-loading Stores

Rewrote ProfileView to be the main page after login with 4 tabs matching Dashboard layout. Fixed login hanging by making stores auto-load data when userId changes.

**Files modified:**
- `src/views/ProfileView.vue` — Complete rewrite with 4 tabs (Mi día, Mis platos, Mis recetas, Datos). Horizontal cards with accent bar, delete button with confirmation modal, centered "add" buttons
- `src/views/AuthView.vue` — Redirect to `/profile` after login, fixed multi-line click handler
- `src/composables/useAuth.ts` — Non-blocking migration, simplified auth state handler
- `src/stores/userStore.ts` — Auto-load profile when userId changes via `watch()`
- `src/stores/foodStore.ts` — Auto-load entries when userId changes via `watch()`
- `src/stores/savedPlatesStore.ts` — Extended SavedPlate with ingredients, allergens, isVegan, isVegetarian, nutritionScore. Auto-load when userId changes
- `src/stores/savedRecipesStore.ts` — Auto-load recipes when userId changes
- `src/views/NutritionAnalyzerView.vue` — Save all plate details (ingredients, allergens, dietary info)
- `src/fontawesome.ts` — Added faStar, faStarHalfStroke, faTag icons

**Design details:**
- Saved cards: horizontal layout with colored accent bar (primary for plates, accent for recipes)
- Delete button: subtle X on right side, hover turns danger color
- Confirmation modal for delete actions
- Centered "add" buttons below card lists with margin-top
- Cards have soft hover shadow instead of border change
- Each user sees only their own data from Supabase (filtered by user_id)
