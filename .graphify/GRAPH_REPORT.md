# Graph Report - .  (2026-07-21)

## Corpus Check
- Corpus is ~36,694 words - fits in a single context window. You may not need a graph.

## Summary
- 432 nodes · 1442 edges · 23 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: ON_BRANCH: 529 · MODIFIES: 474 · contains: 225 · PARENT_OF: 127 · imports: 27 · imports_from: 27 · calls: 25 · method: 5 · re_exports: 2 · inherits: 1


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 91 · Candidates: 101
- Excluded: 0 untracked · 25518 ignored · 0 sensitive · 0 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `3a3bb2c`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `parseProviderResponse()` - 6 edges
2. `handler()` - 5 edges
3. `enrichAnalysis()` - 4 edges
4. `parseProviderResponse()` - 4 edges
5. `callCerebras()` - 4 edges
6. `callGroq()` - 4 edges
7. `OpenFoodFactsError` - 4 edges
8. `fetchJson()` - 4 edges
9. `getProductByBarcode()` - 4 edges
10. `calculateCalorieGoals()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `04ca00f removed confidence` --ON_BRANCH--> `backend`  [EXTRACTED]
  git → git  _Bridges community 16 → community 0_
- `04ca00f removed confidence` --PARENT_OF--> `a92d168 fix: error handling`  [EXTRACTED]
  git → git  _Bridges community 16 → community 12_
- `05af8c0 readme` --ON_BRANCH--> `backend`  [EXTRACTED]
  git → git  _Bridges community 7 → community 0_
- `067eeb3 refactor(imports): migrate relative imports to @/ alias across views, stores, composables, services and components` --ON_BRANCH--> `backend`  [EXTRACTED]
  git → git  _Bridges community 5 → community 0_
- `067eeb3 refactor(imports): migrate relative imports to @/ alias across views, stores, composables, services and components` --PARENT_OF--> `b864cea refactor(imports): complete @/ alias migration across utils, services and design-system`  [EXTRACTED]
  git → git  _Bridges community 5 → community 1_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.14
Nodes (77): backend, dev, master, recetas, stage, 0f5f71c fix: layout in index, 172cbb2 vercel fix, 1fa2c27 fix(ui): responsive form - full-width button on mobile, inline on desktop (+69 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (24): 23e569a Merge pull request #14 from papercri/stage, b864cea refactor(imports): complete @/ alias migration across utils, services and design-system, ead34ac feat(design-system): implement complete design system architecture, mockFood, useAddFood(), mockSearchFood, useFoodSearch(), useDebounce() (+16 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (9): 0c1f887 Merge pull request #3 from papercri/tests, 142eba8 Merge pull request #1 from papercri/refactorizar, 66a6c2c feat(ui): compact dashboard redesign with foldable meals and profile fixes, 81209a9 first commit, 88b4be1 feat: mejorar UI/UX con responsive, hamburger menu, FA icons y CSS optimizado, c213fec style: restyling completo con paleta food-inspired y tipografía con carácter, ca9bbdf Merge pull request #9 from papercri/stage, formatCalorieEntry() (+1 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (9): 9348c2e feat: add BMI calculator with linear gauge to profile, b67ae0c Merge branch 'master' of https://github.com/papercri/diario-nutricional, d0c2bb7 Merge pull request #7 from papercri/bmi-calculator, BmiResult, IdealWeightResult, calculateBMI(), calculateIdealWeight(), classifyBMI() (+1 more)

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (26): 27955a0 Merge pull request #12 from papercri/stage, b47c800 feat(profile): footer sticky, peso deseado, tiempo estimado, mejoras UI, FoodItem, MealEntry, NutriScoreGrade, NutritionSummary, OpenFoodFactsProduct, OpenFoodFactsSearchResult (+18 more)

### Community 5 - "Community 5"
Cohesion: 0.16
Nodes (7): 067eeb3 refactor(imports): migrate relative imports to @/ alias across views, stores, composables, services and components, 7af59dd feat(dashboard): add confirmation modals, toast, responsive buttons layout and search icon, e1e8d64 Merge branch 'stage', ToastMessage, toasts, analyzeMeal(), NutritionAIError

### Community 6 - "Community 6"
Cohesion: 0.18
Nodes (16): ALLERGEN_KEYWORDS, AllergenType, AnalysisOutcome, ANIMAL_PRODUCTS, detectAllergens(), enrichAnalysis(), FISH_KEYWORDS, handler() (+8 more)

### Community 7 - "Community 7"
Cohesion: 0.18
Nodes (9): 05af8c0 readme, 1188f4d feat(recipes): add AI recipe generator page at /recetas, 1475d2d feat: remove tips feature and update README with AI analyzer docs, 7bd04f5 Merge pull request #8 from papercri/stage, 80e4198 feat(analyzer): add allergen detection, dietary info card, and meal history, 8d66207 Merge pull request #15 from papercri/stage, cf11e04 docs(readme): add recipe generator section and update project structure, router (+1 more)

### Community 8 - "Community 8"
Cohesion: 0.15
Nodes (7): 3a3bb2c feat(ui): saved cards with allergen/veggie badges, card-elevated btn-slide, add-to-day modal, modal close button fix, 443eb59 feat(profile): add tabbed interface with Mi día, Mis platos, Mis recetas, Datos, 70b8f69 feat(profile): tabbed interface with favorites, delete buttons, and auto-loading stores, SavedPlate, useSavedPlatesStore, SavedRecipe, useSavedRecipesStore

### Community 9 - "Community 9"
Cohesion: 0.22
Nodes (9): fetchJson(), getProductByBarcode(), OpenFoodFactsError, PRODUCT_FIELDS, searchFood(), emptySearchResult, mockFetch, toFoodItem() (+1 more)

### Community 10 - "Community 10"
Cohesion: 0.29
Nodes (10): buildSystemPrompt(), buildUserMessage(), handler(), parseProviderResponse(), ProviderResult, RecipeOutcome, RecipeRequestBody, respondWithOutcome() (+2 more)

### Community 11 - "Community 11"
Cohesion: 0.20
Nodes (7): authResolved, clearAllLocalStorage(), loading, LOCAL_STORAGE_KEYS, migrateLocalData(), session, user

### Community 12 - "Community 12"
Cohesion: 0.24
Nodes (2): 1348d1f Merge pull request #11 from papercri/stage, a92d168 fix: error handling

### Community 13 - "Community 13"
Cohesion: 0.53
Nodes (5): 1a36693 perf(fontawesome): tree-shake to 40 used icons via SVG components, remove full CSS bundle, 77d9ae4 Merge pull request #6 from papercri/ia-integration, 89162af feat(ui): compact nutrition layout + add meal to daily calories, 9f4976a feat: add AI nutrition analyzer with Groq/Cerebras integration, bdb730e style(design-system): add shared utility classes and deduplicate CSS patterns across components

### Community 14 - "Community 14"
Cohesion: 0.25
Nodes (1): useFoodStore

### Community 15 - "Community 15"
Cohesion: 0.25
Nodes (2): DEFAULT_PROFILE, useUserStore

### Community 16 - "Community 16"
Cohesion: 0.29
Nodes (6): 04ca00f removed confidence, 499567c dependences update, AIProviderResult, callGroq(), GroqChatResponse, GroqError

### Community 17 - "Community 17"
Cohesion: 0.25
Nodes (5): 124ec25 feat(auth): implement Supabase auth with dual localStorage/Supabase support, supabase, supabaseAnonKey, supabaseUrl, Database

### Community 18 - "Community 18"
Cohesion: 0.32
Nodes (3): 1df5892 fix(ui): replace custom add-to-daily modal with Modal component for consistent animation, 4fa3438 feat(dashboard): add tabbed interface with saved plates, recipes, and profile, 9d26981 fix(auth): fix template parsing error in AuthView click handler

### Community 19 - "Community 19"
Cohesion: 0.29
Nodes (6): AllergenType, Ingredient, MacroValue, NutritionAIResponse, NutritionAnalysis, NutritionScore

### Community 21 - "Community 21"
Cohesion: 0.40
Nodes (4): AIProviderResult, callCerebras(), CerebrasChatResponse, CerebrasError

### Community 22 - "Community 22"
Cohesion: 0.40
Nodes (4): generateRecipe(), RecipeAIError, RecipeConfig, RecipeRequestConfig

### Community 24 - "Community 24"
Cohesion: 0.40
Nodes (3): API_ROUTES, __dirname, server

## Knowledge Gaps
- **78 isolated node(s):** `AllergenType`, `ALLERGEN_KEYWORDS`, `MEAT_KEYWORDS`, `FISH_KEYWORDS`, `ANIMAL_PRODUCTS` (+73 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 12`** (2 nodes): `1348d1f Merge pull request #11 from papercri/stage`, `a92d168 fix: error handling`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (1 nodes): `useFoodStore`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (2 nodes): `DEFAULT_PROFILE`, `useUserStore`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `AllergenType`, `ALLERGEN_KEYWORDS`, `MEAT_KEYWORDS` to the rest of the system?**
  _78 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1441891441891442 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.057624113475177305 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07557354925775979 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.0928030303030303 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.08870967741935484 - nodes in this community are weakly interconnected._