# Node Description Batch 6 of 11

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

- "services_openfoodfacts_searchfood": "searchFood()" | kind=code-symbol | source=src/services/openFoodFacts.ts:L88 | neighbors=[openFoodFacts.ts, fetchJson(), openFoodFacts.spec.ts]
- "services_recipeai_recipeaierror": "RecipeAIError" | kind=code-symbol | source=src/services/recipeAI.ts:L5 | neighbors=[recipeAI.ts, generateRecipe(), .constructor()]
- "types_supabase": "supabase.ts" | kind=code-symbol | source=src/types/supabase.ts:L1 | neighbors=[124ec25 feat(auth): implement Supabase …, 3a3bb2c feat(ui): saved cards with alle…, Database]
- "ui_badge": "Badge.vue" | kind=code-symbol | source=src/components/ui/Badge.vue:L1 | neighbors=[23e569a Merge pull request #14 from pap…, 4dc83ed style: increase font-size 0.625…, ead34ac feat(design-system): implement …]
- "ui_input": "Input.vue" | kind=code-symbol | source=src/components/ui/Input.vue:L1 | neighbors=[27955a0 Merge pull request #12 from pap…, b47c800 feat(profile): footer sticky, p…, ead34ac feat(design-system): implement …]
- "utils_mifflinstjeor_calculatebmr": "calculateBMR()" | kind=code-symbol | source=src/utils/mifflinStJeor.ts:L17 | neighbors=[mifflinStJeor.ts, calculateCalorieGoals(), mifflinStJeor.spec.ts]
- "utils_mifflinstjeor_calculatetdee": "calculateTDEE()" | kind=code-symbol | source=src/utils/mifflinStJeor.ts:L29 | neighbors=[mifflinStJeor.ts, calculateCalorieGoals(), mifflinStJeor.spec.ts]
- "api_analyze_meal_detectallergens": "detectAllergens()" | kind=code-symbol | source=api/analyze-meal.ts:L151 | neighbors=[analyze-meal.ts, enrichAnalysis()]
- "api_analyze_meal_inferdietaryflags": "inferDietaryFlags()" | kind=code-symbol | source=api/analyze-meal.ts:L170 | neighbors=[analyze-meal.ts, enrichAnalysis()]
- "api_analyze_meal_isnotfooderror": "isNotFoodError()" | kind=code-symbol | source=api/analyze-meal.ts:L203 | neighbors=[analyze-meal.ts, parseProviderResponse()]
- "api_analyze_meal_respondwithoutcome": "respondWithOutcome()" | kind=code-symbol | source=api/analyze-meal.ts:L269 | neighbors=[analyze-meal.ts, handler()]
- "api_analyze_meal_stripmarkdowncodeblocks": "stripMarkdownCodeBlocks()" | kind=code-symbol | source=api/analyze-meal.ts:L67 | neighbors=[analyze-meal.ts, parseProviderResponse()]
- "api_analyze_meal_validateanalysis": "validateAnalysis()" | kind=code-symbol | source=api/analyze-meal.ts:L209 | neighbors=[analyze-meal.ts, parseProviderResponse()]
- "api_generate_recipe_buildsystemprompt": "buildSystemPrompt()" | kind=code-symbol | source=api/generate-recipe.ts:L5 | neighbors=[generate-recipe.ts, handler()]
- "api_generate_recipe_buildusermessage": "buildUserMessage()" | kind=code-symbol | source=api/generate-recipe.ts:L45 | neighbors=[generate-recipe.ts, handler()]
- "api_generate_recipe_respondwithoutcome": "respondWithOutcome()" | kind=code-symbol | source=api/generate-recipe.ts:L159 | neighbors=[generate-recipe.ts, handler()]
- "api_generate_recipe_stripmarkdowncodeblocks": "stripMarkdownCodeBlocks()" | kind=code-symbol | source=api/generate-recipe.ts:L93 | neighbors=[generate-recipe.ts, parseProviderResponse()]
- "api_generate_recipe_validaterecipe": "validateRecipe()" | kind=code-symbol | source=api/generate-recipe.ts:L110 | neighbors=[generate-recipe.ts, parseProviderResponse()]
- "composables_useaddfood_useaddfood": "useAddFood()" | kind=code-symbol | source=src/composables/useAddFood.ts:L5 | neighbors=[useAddFood.ts, useAddFood.spec.ts]
- "composables_useauth_clearalllocalstorage": "clearAllLocalStorage()" | kind=code-symbol | source=src/composables/useAuth.ts:L40 | neighbors=[useAuth.ts, migrateLocalData()]
- "composables_useauth_migratelocaldata": "migrateLocalData()" | kind=code-symbol | source=src/composables/useAuth.ts:L46 | neighbors=[useAuth.ts, clearAllLocalStorage()]
- "composables_usefoodsearch_usefoodsearch": "useFoodSearch()" | kind=code-symbol | source=src/composables/useFoodSearch.ts:L8 | neighbors=[useFoodSearch.ts, useFoodSearch.spec.ts]
- "hooks_usedebounce_usedebounce": "useDebounce()" | kind=code-symbol | source=src/hooks/useDebounce.ts:L3 | neighbors=[index.ts, useDebounce.ts]
- "hooks_usemodal_usemodal": "useModal()" | kind=code-symbol | source=src/hooks/useModal.ts:L3 | neighbors=[index.ts, useModal.ts]
- "services_nutritionai_analyzemeal": "analyzeMeal()" | kind=code-symbol | source=src/services/nutritionAI.ts:L10 | neighbors=[nutritionAI.ts, NutritionAIError]
- "services_openfoodfacts_tofooditem": "toFoodItem()" | kind=code-symbol | source=src/services/openFoodFacts.ts:L66 | neighbors=[openFoodFacts.ts, getProductByBarcode()]
- "services_recipeai_generaterecipe": "generateRecipe()" | kind=code-symbol | source=src/services/recipeAI.ts:L17 | neighbors=[recipeAI.ts, RecipeAIError]
- "services_recipeai_reciperequestconfig": "RecipeRequestConfig" | kind=code-symbol | source=src/services/recipeAI.ts:L12 | neighbors=[recipeAI.ts, RecipeConfig]
- "stores_foodstore_usefoodstore": "useFoodStore" | kind=code-symbol | source=src/stores/foodStore.ts:L49 | neighbors=[foodStore.ts, foodStore.spec.ts]
- "stores_userstore_useuserstore": "useUserStore" | kind=code-symbol | source=src/stores/userStore.ts:L74 | neighbors=[userStore.ts, userStore.spec.ts]
- "types_recipe_allergen": "Allergen" | kind=code-symbol | source=src/types/recipe.ts:L1 | neighbors=[recipe.ts, user.ts]
- "types_recipe_dietarypreference": "DietaryPreference" | kind=code-symbol | source=src/types/recipe.ts:L15 | neighbors=[recipe.ts, user.ts]
- "types_user_mealtype": "MealType" | kind=code-symbol | source=src/types/user.ts:L6 | neighbors=[food.ts, user.ts]
- "utils_bmi_calculatebmi": "calculateBMI()" | kind=code-symbol | source=src/utils/bmi.ts:L1 | neighbors=[bmi.ts, bmi.spec.ts]
- "utils_bmi_calculateidealweight": "calculateIdealWeight()" | kind=code-symbol | source=src/utils/bmi.ts:L6 | neighbors=[bmi.ts, bmi.spec.ts]
- "utils_bmiclassification_classifybmi": "classifyBMI()" | kind=code-symbol | source=src/utils/bmiClassification.ts:L3 | neighbors=[bmiClassification.ts, bmiClassification.spec.ts]
- "utils_bmiclassification_getbmibadgevariant": "getBmiBadgeVariant()" | kind=code-symbol | source=src/utils/bmiClassification.ts:L10 | neighbors=[bmiClassification.ts, bmiClassification.spec.ts]
- "utils_formatting_formatcalorieentry": "formatCalorieEntry()" | kind=code-symbol | source=src/utils/formatting.ts:L16 | neighbors=[formatting.ts, formatting.spec.ts]
- "utils_formatting_formatdatees": "formatDateEs()" | kind=code-symbol | source=src/utils/formatting.ts:L4 | neighbors=[formatting.ts, formatting.spec.ts]
- "utils_nutrition_calcpercentage": "calcPercentage()" | kind=code-symbol | source=src/utils/nutrition.ts:L7 | neighbors=[nutrition.ts, nutrition.spec.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cristianasollini/Documents/WORK/GIT/Avocato/.graphify/description-instructions/batch-005.json

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
