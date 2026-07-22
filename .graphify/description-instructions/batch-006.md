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

- "api_analyze_meal_fish_keywords": "FISH_KEYWORDS" | kind=code-symbol | source=api/analyze-meal.ts:L140 | neighbors=[analyze-meal.ts]
- "api_analyze_meal_meat_keywords": "MEAT_KEYWORDS" | kind=code-symbol | source=api/analyze-meal.ts:L133 | neighbors=[analyze-meal.ts]
- "api_analyze_meal_providerresult": "ProviderResult" | kind=code-symbol | source=api/analyze-meal.ts:L238 | neighbors=[analyze-meal.ts]
- "api_generate_recipe_providerresult": "ProviderResult" | kind=code-symbol | source=api/generate-recipe.ts:L133 | neighbors=[generate-recipe.ts]
- "api_generate_recipe_recipeoutcome": "RecipeOutcome" | kind=code-symbol | source=api/generate-recipe.ts:L135 | neighbors=[generate-recipe.ts]
- "api_generate_recipe_reciperequestbody": "RecipeRequestBody" | kind=code-symbol | source=api/generate-recipe.ts:L173 | neighbors=[generate-recipe.ts]
- "components_appheader_closemenu": "closeMenu()" | kind=code-symbol | source=src/components/AppHeader.vue:L30 | neighbors=[AppHeader.vue]
- "components_appheader_handlesignout": "handleSignOut()" | kind=code-symbol | source=src/components/AppHeader.vue:L49 | neighbors=[AppHeader.vue]
- "components_appheader_togglemenu": "toggleMenu()" | kind=code-symbol | source=src/components/AppHeader.vue:L26 | neighbors=[AppHeader.vue]
- "components_fooddetailmodal_getfocusableelements": "getFocusableElements()" | kind=code-symbol | source=src/components/FoodDetailModal.vue:L39 | neighbors=[FoodDetailModal.vue]
- "components_fooddetailmodal_getgradecolor": "getGradeColor()" | kind=code-symbol | source=src/components/FoodDetailModal.vue:L17 | neighbors=[FoodDetailModal.vue]
- "components_fooddetailmodal_getgradelabel": "getGradeLabel()" | kind=code-symbol | source=src/components/FoodDetailModal.vue:L28 | neighbors=[FoodDetailModal.vue]
- "components_fooddetailmodal_handlekeydown": "handleKeydown()" | kind=code-symbol | source=src/components/FoodDetailModal.vue:L48 | neighbors=[FoodDetailModal.vue]
- "composables_useaddfood_spec_mockfood": "mockFood" | kind=code-symbol | source=src/composables/useAddFood.spec.ts:L20 | neighbors=[useAddFood.spec.ts]
- "composables_useaddfood_spec_mockstorage": "mockStorage" | kind=code-symbol | source=src/composables/useAddFood.spec.ts:L11 | neighbors=[useAddFood.spec.ts]
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
