# Node Description Batch 8 of 11

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

- "server_dev_loadenv": "loadEnv()" | kind=code-symbol | source=server-dev.ts:L8 | neighbors=[server-dev.ts]
- "server_dev_server": "server" | kind=code-symbol | source=server-dev.ts:L33 | neighbors=[server-dev.ts]
- "services_nutritionai_nutritionaierror_constructor": ".constructor()" | kind=code-symbol | source=src/services/nutritionAI.ts:L4 | neighbors=[NutritionAIError]
- "services_openfoodfacts_openfoodfactserror_constructor": ".constructor()" | kind=code-symbol | source=src/services/openFoodFacts.ts:L27 | neighbors=[OpenFoodFactsError]
- "services_openfoodfacts_product_fields": "PRODUCT_FIELDS" | kind=code-symbol | source=src/services/openFoodFacts.ts:L15 | neighbors=[openFoodFacts.ts]
- "services_openfoodfacts_spec_emptysearchresult": "emptySearchResult" | kind=code-symbol | source=src/services/openFoodFacts.spec.ts:L25 | neighbors=[openFoodFacts.spec.ts]
- "services_openfoodfacts_spec_makesearchproduct": "makeSearchProduct()" | kind=code-symbol | source=src/services/openFoodFacts.spec.ts:L7 | neighbors=[openFoodFacts.spec.ts]
- "services_openfoodfacts_spec_mockfetch": "mockFetch" | kind=code-symbol | source=src/services/openFoodFacts.spec.ts:L4 | neighbors=[openFoodFacts.spec.ts]
- "services_openfoodfacts_spec_mockjsonresponse": "mockJsonResponse()" | kind=code-symbol | source=src/services/openFoodFacts.spec.ts:L32 | neighbors=[openFoodFacts.spec.ts]
- "services_openfoodfacts_valid_nutri_scores": "VALID_NUTRI_SCORES" | kind=code-symbol | source=src/services/openFoodFacts.ts:L64 | neighbors=[openFoodFacts.ts]
- "services_recipeai_recipeaierror_constructor": ".constructor()" | kind=code-symbol | source=src/services/recipeAI.ts:L6 | neighbors=[RecipeAIError]
- "services_recipeai_recipeconfig": "RecipeConfig" | kind=code-symbol | neighbors=[RecipeRequestConfig]
- "src_main_app": "app" | kind=code-symbol | source=src/main.ts:L9 | neighbors=[main.ts]
- "src_vite_env_d": "vite-env.d.ts" | kind=code-symbol | source=src/vite-env.d.ts:L1 | neighbors=[81209a9 first commit]
- "state_emptystate": "EmptyState.vue" | kind=code-symbol | source=src/components/state/EmptyState.vue:L1 | neighbors=[ead34ac feat(design-system): implement …]
- "state_errorstate": "ErrorState.vue" | kind=code-symbol | source=src/components/state/ErrorState.vue:L1 | neighbors=[ead34ac feat(design-system): implement …]
- "state_loading": "Loading.vue" | kind=code-symbol | source=src/components/state/Loading.vue:L1 | neighbors=[ead34ac feat(design-system): implement …]
- "stores_foodstore_gettoday": "getToday()" | kind=code-symbol | source=src/stores/foodStore.ts:L5 | neighbors=[foodStore.ts]
- "stores_foodstore_loadlocal": "loadLocal()" | kind=code-symbol | source=src/stores/foodStore.ts:L35 | neighbors=[foodStore.ts]
- "stores_foodstore_loadlogs": "loadLogs()" | kind=code-symbol | source=src/stores/foodStore.ts:L9 | neighbors=[foodStore.ts]
- "stores_foodstore_persistlogs": "persistLogs()" | kind=code-symbol | source=src/stores/foodStore.ts:L19 | neighbors=[foodStore.ts]
- "stores_foodstore_rowtomealentry": "rowToMealEntry()" | kind=code-symbol | source=src/stores/foodStore.ts:L12 | neighbors=[foodStore.ts]
- "stores_foodstore_savelocal": "saveLocal()" | kind=code-symbol | source=src/stores/foodStore.ts:L45 | neighbors=[foodStore.ts]
- "stores_foodstore_spec_makefood": "makeFood()" | kind=code-symbol | source=src/stores/foodStore.spec.ts:L15 | neighbors=[foodStore.spec.ts]
- "stores_foodstore_spec_mockstorage": "mockStorage" | kind=code-symbol | source=src/stores/foodStore.spec.ts:L6 | neighbors=[foodStore.spec.ts]
- "stores_foodstore_spec_today": "today()" | kind=code-symbol | source=src/stores/foodStore.spec.ts:L27 | neighbors=[foodStore.spec.ts]
- "stores_userstore_default_profile": "DEFAULT_PROFILE" | kind=code-symbol | source=src/stores/userStore.ts:L6 | neighbors=[userStore.ts]
- "stores_userstore_isdefaultprofile": "isDefaultProfile()" | kind=code-symbol | source=src/stores/userStore.ts:L70 | neighbors=[userStore.ts]
- "stores_userstore_loadlocal": "loadLocal()" | kind=code-symbol | source=src/stores/userStore.ts:L53 | neighbors=[userStore.ts]
- "stores_userstore_loadprofile": "loadProfile()" | kind=code-symbol | source=src/stores/userStore.ts:L17 | neighbors=[userStore.ts]
- "stores_userstore_persistprofile": "persistProfile()" | kind=code-symbol | source=src/stores/userStore.ts:L30 | neighbors=[userStore.ts]
- "stores_userstore_profiletorow": "profileToRow()" | kind=code-symbol | source=src/stores/userStore.ts:L38 | neighbors=[userStore.ts]
- "stores_userstore_rowtoprofile": "rowToProfile()" | kind=code-symbol | source=src/stores/userStore.ts:L23 | neighbors=[userStore.ts]
- "stores_userstore_savelocal": "saveLocal()" | kind=code-symbol | source=src/stores/userStore.ts:L66 | neighbors=[userStore.ts]
- "stores_userstore_spec_mockstorage": "mockStorage" | kind=code-symbol | source=src/stores/userStore.spec.ts:L5 | neighbors=[userStore.spec.ts]
- "types_calculator_bmiresult": "BmiResult" | kind=code-symbol | source=src/types/calculator.ts:L1 | neighbors=[calculator.ts]
- "types_calculator_idealweightresult": "IdealWeightResult" | kind=code-symbol | source=src/types/calculator.ts:L7 | neighbors=[calculator.ts]
- "types_food_fooditem": "FoodItem" | kind=code-symbol | source=src/types/food.ts:L7 | neighbors=[food.ts]
- "types_food_mealentry": "MealEntry" | kind=code-symbol | source=src/types/food.ts:L21 | neighbors=[food.ts]
- "types_food_nutriscoregrade": "NutriScoreGrade" | kind=code-symbol | source=src/types/food.ts:L5 | neighbors=[food.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cristianasollini/Documents/WORK/GIT/Avocato/.graphify/description-instructions/batch-007.json

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
