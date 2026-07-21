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

- "lib_supabase_supabase": "supabase" | kind=code-symbol | source=src/lib/supabase.ts:L10 | neighbors=[supabase.ts]
- "lib_supabase_supabaseanonkey": "supabaseAnonKey" | kind=code-symbol | source=src/lib/supabase.ts:L4 | neighbors=[supabase.ts]
- "lib_supabase_supabaseurl": "supabaseUrl" | kind=code-symbol | source=src/lib/supabase.ts:L3 | neighbors=[supabase.ts]
- "nutrition_mealanalyzerform_autoresize": "autoResize()" | kind=code-symbol | source=src/components/nutrition/MealAnalyzerForm.vue:L45 | neighbors=[MealAnalyzerForm.vue]
- "nutrition_mealanalyzerform_clearhistory": "clearHistory()" | kind=code-symbol | source=src/components/nutrition/MealAnalyzerForm.vue:L35 | neighbors=[MealAnalyzerForm.vue]
- "nutrition_mealanalyzerform_handlesubmit": "handleSubmit()" | kind=code-symbol | source=src/components/nutrition/MealAnalyzerForm.vue:L52 | neighbors=[MealAnalyzerForm.vue]
- "nutrition_mealanalyzerform_oninput": "onInput()" | kind=code-symbol | source=src/components/nutrition/MealAnalyzerForm.vue:L70 | neighbors=[MealAnalyzerForm.vue]
- "nutrition_mealanalyzerform_savetohistory": "saveToHistory()" | kind=code-symbol | source=src/components/nutrition/MealAnalyzerForm.vue:L27 | neighbors=[MealAnalyzerForm.vue]
- "nutrition_mealanalyzerform_selectrecent": "selectRecent()" | kind=code-symbol | source=src/components/nutrition/MealAnalyzerForm.vue:L40 | neighbors=[MealAnalyzerForm.vue]
- "providers_cerebras_aiproviderresult": "AIProviderResult" | kind=code-symbol | source=api/providers/cerebras.ts:L11 | neighbors=[cerebras.ts]
- "providers_cerebras_cerebraschatresponse": "CerebrasChatResponse" | kind=code-symbol | source=api/providers/cerebras.ts:L3 | neighbors=[cerebras.ts]
- "providers_cerebras_cerebraserror_constructor": ".constructor()" | kind=code-symbol | source=api/providers/cerebras.ts:L17 | neighbors=[CerebrasError]
- "providers_groq_aiproviderresult": "AIProviderResult" | kind=code-symbol | source=api/providers/groq.ts:L11 | neighbors=[groq.ts]
- "providers_groq_groqchatresponse": "GroqChatResponse" | kind=code-symbol | source=api/providers/groq.ts:L3 | neighbors=[groq.ts]
- "providers_groq_groqerror_constructor": ".constructor()" | kind=code-symbol | source=api/providers/groq.ts:L17 | neighbors=[GroqError]
- "router_index_router": "router" | kind=code-symbol | source=src/router/index.ts:L3 | neighbors=[index.ts]
- "server_dev_api_routes": "API_ROUTES" | kind=code-symbol | source=server-dev.ts:L31 | neighbors=[server-dev.ts]
- "server_dev_dirname": "__dirname" | kind=code-symbol | source=server-dev.ts:L6 | neighbors=[server-dev.ts]
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
- "stores_foodstore_gettoday": "getToday()" | kind=code-symbol | source=src/stores/foodStore.ts:L8 | neighbors=[foodStore.ts]
- "stores_foodstore_loadlocal": "loadLocal()" | kind=code-symbol | source=src/stores/foodStore.ts:L35 | neighbors=[foodStore.ts]
- "stores_foodstore_rowtomealentry": "rowToMealEntry()" | kind=code-symbol | source=src/stores/foodStore.ts:L12 | neighbors=[foodStore.ts]
- "stores_foodstore_savelocal": "saveLocal()" | kind=code-symbol | source=src/stores/foodStore.ts:L45 | neighbors=[foodStore.ts]
- "stores_foodstore_spec_makefood": "makeFood()" | kind=code-symbol | source=src/stores/foodStore.spec.ts:L24 | neighbors=[foodStore.spec.ts]

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
