# Community Labeling

Graphify is running in assistant/skill mode (no API key). You are the host
assistant (Claude Code / Codex / Gemini CLI). Read the community listing below
and write 2-5 word plain-language names for each.

## Language

LANGUAGE: each community line ends with a `[lang=…]` marker giving the
language of its source nodes. Write that community's name in EXACTLY that
language. Do not normalize every name to one common language.

## Communities

Community 0: backend, dev, master, recetas, stage, 0f5f71c fix: layout in index, 172cbb2 vercel fix, 1fa2c27 fix(ui): responsive form - full-width button on mobi, 1fd6bca fix(dashboard): increase meal section spacing and ad, 261e591 style(food-card): badge top-aligned, button hover ex, 2a063da style: reemplazar DM Serif Display por DM Sans (sans, 2a14b35 style(tokens): darken --clr-text-faint from #66605b  [lang=pt]
Community 1: enrichAnalysis(, parseProviderResponse(, callCerebras(, callGroq(, analyze-meal.ts, ALLERGEN_KEYWORDS, AllergenType, AnalysisOutcome, ANIMAL_PRODUCTS, detectAllergens(, FISH_KEYWORDS, handler( [lang=en]
Community 2: 05af8c0 readme, 067eeb3 refactor(imports): migrate relative imports to @/ al, 0c1f887 Merge pull request #3 from papercri/tests, 142eba8 Merge pull request #1 from papercri/refactorizar, 1475d2d feat: remove tips feature and update README with AI , 66a6c2c feat(ui): compact dashboard redesign with foldable m, 7bd04f5 Merge pull request #8 from papercri/stage, 81209a9 first commit, 88b4be1 feat: mejorar UI/UX con responsive, hamburger menu, , c213fec style: restyling completo con paleta food-inspired y, ca9bbdf Merge pull request #9 from papercri/stage, AppHeader.vue [lang=en]
Community 3: 1a36693 perf(fontawesome): tree-shake to 40 used icons via S, 23e569a Merge pull request #14 from papercri/stage, 89162af feat(ui): compact nutrition layout + add meal to dai, bdb730e style(design-system): add shared utility classes and, FoodDetailModal.vue, getFocusableElements(, getGradeColor(, getGradeLabel(, handleKeydown(, useAddFood.ts, useAddFood.spec.ts, mockFood [lang=en]
Community 4: 1df5892 fix(ui): replace custom add-to-daily modal with Moda, 443eb59 feat(profile): add tabbed interface with Mi día, Mis, 70b8f69 feat(profile): tabbed interface with favorites, dele, 9348c2e feat: add BMI calculator with linear gauge to profil, 9d26981 fix(auth): fix template parsing error in AuthView cl, b67ae0c Merge branch 'master' of https://github.com/papercri, d0c2bb7 Merge pull request #7 from papercri/bmi-calculator, calculator.ts, BmiResult, IdealWeightResult, bmi.ts, calculateBMI( [lang=en]
Community 5: calculateCalorieGoals(, 27955a0 Merge pull request #12 from papercri/stage, b47c800 feat(profile): footer sticky, peso deseado, tiempo e, b864cea refactor(imports): complete @/ alias migration acros, dd79ab1 docs, userStore.ts, DEFAULT_PROFILE, isDefaultProfile(, loadLocal(, loadProfile(, persistProfile(, profileToRow( [lang=en]
Community 6: ead34ac feat(design-system): implement complete design syste, index.ts, Field.vue, useDebounce.ts, useDebounce(, useModal.ts, useModal(, Container.vue, Grid.vue, Stack.vue, EmptyState.vue, ErrorState.vue [lang=en]
Community 7: fetchJson(, getProductByBarcode(, OpenFoodFactsError, openFoodFacts.ts, .constructor(, PRODUCT_FIELDS, searchFood(, openFoodFacts.spec.ts, emptySearchResult, makeSearchProduct(, mockFetch, mockJsonResponse( [lang=en]
Community 8: recipe.ts, Allergen, DietaryPreference, GeneratedRecipe, RecipeAIResponse, RecipeConfig, RecipeIngredient, RecipeMacros, user.ts, ActivityLevel, CalorieGoals, GoalType [lang=en]
Community 9: handler(, parseProviderResponse(, generate-recipe.ts, buildSystemPrompt(, buildUserMessage(, ProviderResult, RecipeOutcome, RecipeRequestBody, respondWithOutcome(, stripMarkdownCodeBlocks(, validateRecipe(, 29fec84 chore: include generate-recipe.ts changes [lang=en]
Community 10: 80e4198 feat(analyzer): add allergen detection, dietary info, 8d66207 Merge pull request #15 from papercri/stage, AllergenInfoCard.vue, nutrition.ts, AllergenType, Ingredient, MacroValue, NutritionAIResponse, NutritionAnalysis, NutritionScore [lang=en]
Community 11: 1188f4d feat(recipes): add AI recipe generator page at /rece, 124ec25 feat(auth): implement Supabase auth with dual localS, 4fa3438 feat(dashboard): add tabbed interface with saved pla, cf11e04 docs(readme): add recipe generator section and updat, index.ts, router, fontawesome.ts, main.ts, app [lang=en]
Community 12: food.ts, FoodItem, MealEntry, NutriScoreGrade, NutritionSummary, OpenFoodFactsProduct, OpenFoodFactsSearchResult, MealType [lang=en]
Community 13: RecipeGeneratorView.vue, handleGenerate(, isAllergenSelected(, isPreferenceSelected(, saveRecipe(, toggleAllergen(, togglePreference( [lang=en]
Community 14: recipeAI.ts, generateRecipe(, RecipeAIError, .constructor(, RecipeConfig, RecipeRequestConfig [lang=en]
Community 15: server-dev.ts, API_ROUTES, __dirname, loadEnv(, server [lang=en]

## Instructions

Write a single JSON object mapping each community id (as a string) to its
2-5 word name to: /Users/cristianasollini/Documents/WORK/GIT/Avocato/.graphify/label-instructions/communities.json

Example:
```json
{
  "0": "Authentication Flow",
  "1": "Authentication Flow",
  "2": "Authentication Flow"
}
```

Then re-run `graphify update` (or `graphify label`) to ingest the names.
