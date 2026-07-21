# Node Description Batch 7 of 11

Graphify is running in assistant/skill mode (no API key). You are the host
assistant (Claude Code / Codex / Gemini CLI). Read the prompt below and write
your JSON answer to the answer file.

## Prompt

You are documenting nodes in a knowledge graph.
For each entry below, write ONE concise factual plain-language sentence
describing what it is or does. Use only the provided context.
For a code symbol (kind=code-symbol — a function, class, or constant),
describe what the function/symbol does based on its name, source location
and neighbors — e.g. "Resolves the configured ontology profile from graphify.yaml.".
Write every description in English (en). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "utils_nutrition_calcremaining": "calcRemaining()" | kind=code-symbol | source=src/utils/nutrition.ts:L15 | neighbors=[nutrition.ts, nutrition.spec.ts]
- "utils_nutrition_groupentriesbymealtype": "groupEntriesByMealType()" | kind=code-symbol | source=src/utils/nutrition.ts:L22 | neighbors=[nutrition.ts, nutrition.spec.ts]
- "utils_nutrition_sumservings": "sumServings()" | kind=code-symbol | source=src/utils/nutrition.ts:L36 | neighbors=[nutrition.ts, nutrition.spec.ts]
- "api_analyze_meal_allergen_keywords": "ALLERGEN_KEYWORDS" | kind=code-symbol | source=api/analyze-meal.ts:L95 | neighbors=[analyze-meal.ts]
- "api_analyze_meal_allergentype": "AllergenType" | kind=code-symbol | source=api/analyze-meal.ts:L90 | neighbors=[analyze-meal.ts]
- "api_analyze_meal_analysisoutcome": "AnalysisOutcome" | kind=code-symbol | source=api/analyze-meal.ts:L240 | neighbors=[analyze-meal.ts]
- "api_analyze_meal_animal_products": "ANIMAL_PRODUCTS" | kind=code-symbol | source=api/analyze-meal.ts:L146 | neighbors=[analyze-meal.ts]
- "api_analyze_meal_fish_keywords": "FISH_KEYWORDS" | kind=code-symbol | source=api/analyze-meal.ts:L140 | neighbors=[analyze-meal.ts]
- "api_analyze_meal_meat_keywords": "MEAT_KEYWORDS" | kind=code-symbol | source=api/analyze-meal.ts:L133 | neighbors=[analyze-meal.ts]
- "api_analyze_meal_providerresult": "ProviderResult" | kind=code-symbol | source=api/analyze-meal.ts:L238 | neighbors=[analyze-meal.ts]
- "api_generate_recipe_providerresult": "ProviderResult" | kind=code-symbol | source=api/generate-recipe.ts:L134 | neighbors=[generate-recipe.ts]
- "api_generate_recipe_recipeoutcome": "RecipeOutcome" | kind=code-symbol | source=api/generate-recipe.ts:L136 | neighbors=[generate-recipe.ts]
- "api_generate_recipe_reciperequestbody": "RecipeRequestBody" | kind=code-symbol | source=api/generate-recipe.ts:L174 | neighbors=[generate-recipe.ts]
- "components_appfooter": "AppFooter.vue" | kind=code-symbol | source=src/components/AppFooter.vue:L1 | neighbors=[124ec25 feat(auth): implement Supabase …]
- "components_appheader_closemenu": "closeMenu()" | kind=code-symbol | source=src/components/AppHeader.vue:L45 | neighbors=[AppHeader.vue]
- "components_appheader_handlesignout": "handleSignOut()" | kind=code-symbol | source=src/components/AppHeader.vue:L49 | neighbors=[AppHeader.vue]
- "components_appheader_togglemenu": "toggleMenu()" | kind=code-symbol | source=src/components/AppHeader.vue:L41 | neighbors=[AppHeader.vue]
- "components_fooddetailmodal_getfocusableelements": "getFocusableElements()" | kind=code-symbol | source=src/components/FoodDetailModal.vue:L39 | neighbors=[FoodDetailModal.vue]
- "components_fooddetailmodal_getgradecolor": "getGradeColor()" | kind=code-symbol | source=src/components/FoodDetailModal.vue:L17 | neighbors=[FoodDetailModal.vue]
- "components_fooddetailmodal_getgradelabel": "getGradeLabel()" | kind=code-symbol | source=src/components/FoodDetailModal.vue:L28 | neighbors=[FoodDetailModal.vue]
- "components_fooddetailmodal_handlekeydown": "handleKeydown()" | kind=code-symbol | source=src/components/FoodDetailModal.vue:L48 | neighbors=[FoodDetailModal.vue]
- "composables_useaddfood_spec_mockfood": "mockFood" | kind=code-symbol | source=src/composables/useAddFood.spec.ts:L29 | neighbors=[useAddFood.spec.ts]
- "composables_useauth_authresolved": "authResolved" | kind=code-symbol | source=src/composables/useAuth.ts:L12 | neighbors=[useAuth.ts]
- "composables_useauth_initauth": "initAuth()" | kind=code-symbol | source=src/composables/useAuth.ts:L65 | neighbors=[useAuth.ts]
- "composables_useauth_loading": "loading" | kind=code-symbol | source=src/composables/useAuth.ts:L11 | neighbors=[useAuth.ts]
- "composables_useauth_local_storage_keys": "LOCAL_STORAGE_KEYS" | kind=code-symbol | source=src/composables/useAuth.ts:L16 | neighbors=[useAuth.ts]
- "composables_useauth_session": "session" | kind=code-symbol | source=src/composables/useAuth.ts:L10 | neighbors=[useAuth.ts]
- "composables_useauth_syncstoreswithuser": "syncStoresWithUser()" | kind=code-symbol | source=src/composables/useAuth.ts:L25 | neighbors=[useAuth.ts]
- "composables_useauth_useauth": "useAuth()" | kind=code-symbol | source=src/composables/useAuth.ts:L100 | neighbors=[useAuth.ts]
- "composables_useauth_user": "user" | kind=code-symbol | source=src/composables/useAuth.ts:L9 | neighbors=[useAuth.ts]
- "composables_usefoodsearch_spec_makefood": "makeFood()" | kind=code-symbol | source=src/composables/useFoodSearch.spec.ts:L13 | neighbors=[useFoodSearch.spec.ts]
- "composables_usefoodsearch_spec_mocksearchfood": "mockSearchFood" | kind=code-symbol | source=src/composables/useFoodSearch.spec.ts:L11 | neighbors=[useFoodSearch.spec.ts]
- "composables_usetoast_toastmessage": "ToastMessage" | kind=code-symbol | source=src/composables/useToast.ts:L3 | neighbors=[useToast.ts]
- "composables_usetoast_toasts": "toasts" | kind=code-symbol | source=src/composables/useToast.ts:L9 | neighbors=[useToast.ts]
- "composables_usetoast_usetoast": "useToast()" | kind=code-symbol | source=src/composables/useToast.ts:L12 | neighbors=[useToast.ts]
- "env_d": "env.d.ts" | kind=code-symbol | source=env.d.ts:L1 | neighbors=[81209a9 first commit]
- "forms_field": "Field.vue" | kind=code-symbol | source=src/components/forms/Field.vue:L1 | neighbors=[ead34ac feat(design-system): implement …]
- "layout_container": "Container.vue" | kind=code-symbol | source=src/components/layout/Container.vue:L1 | neighbors=[ead34ac feat(design-system): implement …]
- "layout_grid": "Grid.vue" | kind=code-symbol | source=src/components/layout/Grid.vue:L1 | neighbors=[ead34ac feat(design-system): implement …]
- "layout_stack": "Stack.vue" | kind=code-symbol | source=src/components/layout/Stack.vue:L1 | neighbors=[ead34ac feat(design-system): implement …]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cristianasollini/Documents/WORK/GIT/Avocato/.graphify/description-instructions/batch-006.json

Keep each description factual and concise (one sentence). No markdown, no prose
outside the JSON object. It is acceptable to omit a node if context is
insufficient — but include every node you can ground confidently.

Example answer format:
```json
{
  "node_id_1": "Resolves the configured ontology profile from graphify.yaml.",
  "node_id_2": "Colonel James Barclay, an antagonist in The Crooked Man."
}
```
