# Node Description Batch 9 of 11

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

- "stores_foodstore_spec_today": "today()" | kind=code-symbol | source=src/stores/foodStore.spec.ts:L36 | neighbors=[foodStore.spec.ts]
- "stores_savedplatesstore_loadlocal": "loadLocal()" | kind=code-symbol | source=src/stores/savedPlatesStore.ts:L26 | neighbors=[savedPlatesStore.ts]
- "stores_savedplatesstore_savedplate": "SavedPlate" | kind=code-symbol | source=src/stores/savedPlatesStore.ts:L8 | neighbors=[savedPlatesStore.ts]
- "stores_savedplatesstore_savelocal": "saveLocal()" | kind=code-symbol | source=src/stores/savedPlatesStore.ts:L36 | neighbors=[savedPlatesStore.ts]
- "stores_savedplatesstore_usesavedplatesstore": "useSavedPlatesStore" | kind=code-symbol | source=src/stores/savedPlatesStore.ts:L40 | neighbors=[savedPlatesStore.ts]
- "stores_savedrecipesstore_loadlocal": "loadLocal()" | kind=code-symbol | source=src/stores/savedRecipesStore.ts:L21 | neighbors=[savedRecipesStore.ts]
- "stores_savedrecipesstore_savedrecipe": "SavedRecipe" | kind=code-symbol | source=src/stores/savedRecipesStore.ts:L8 | neighbors=[savedRecipesStore.ts]
- "stores_savedrecipesstore_savelocal": "saveLocal()" | kind=code-symbol | source=src/stores/savedRecipesStore.ts:L31 | neighbors=[savedRecipesStore.ts]
- "stores_savedrecipesstore_usesavedrecipesstore": "useSavedRecipesStore" | kind=code-symbol | source=src/stores/savedRecipesStore.ts:L35 | neighbors=[savedRecipesStore.ts]
- "stores_userstore_default_profile": "DEFAULT_PROFILE" | kind=code-symbol | source=src/stores/userStore.ts:L10 | neighbors=[userStore.ts]
- "stores_userstore_isdefaultprofile": "isDefaultProfile()" | kind=code-symbol | source=src/stores/userStore.ts:L70 | neighbors=[userStore.ts]
- "stores_userstore_loadlocal": "loadLocal()" | kind=code-symbol | source=src/stores/userStore.ts:L53 | neighbors=[userStore.ts]
- "stores_userstore_profiletorow": "profileToRow()" | kind=code-symbol | source=src/stores/userStore.ts:L38 | neighbors=[userStore.ts]
- "stores_userstore_rowtoprofile": "rowToProfile()" | kind=code-symbol | source=src/stores/userStore.ts:L23 | neighbors=[userStore.ts]
- "stores_userstore_savelocal": "saveLocal()" | kind=code-symbol | source=src/stores/userStore.ts:L66 | neighbors=[userStore.ts]
- "types_calculator_bmiresult": "BmiResult" | kind=code-symbol | source=src/types/calculator.ts:L1 | neighbors=[calculator.ts]
- "types_calculator_idealweightresult": "IdealWeightResult" | kind=code-symbol | source=src/types/calculator.ts:L7 | neighbors=[calculator.ts]
- "types_food_fooditem": "FoodItem" | kind=code-symbol | source=src/types/food.ts:L7 | neighbors=[food.ts]
- "types_food_mealentry": "MealEntry" | kind=code-symbol | source=src/types/food.ts:L21 | neighbors=[food.ts]
- "types_food_nutriscoregrade": "NutriScoreGrade" | kind=code-symbol | source=src/types/food.ts:L5 | neighbors=[food.ts]
- "types_food_nutritionsummary": "NutritionSummary" | kind=code-symbol | source=src/types/food.ts:L30 | neighbors=[food.ts]
- "types_food_openfoodfactsproduct": "OpenFoodFactsProduct" | kind=code-symbol | source=src/types/food.ts:L37 | neighbors=[food.ts]
- "types_food_openfoodfactssearchresult": "OpenFoodFactsSearchResult" | kind=code-symbol | source=src/types/food.ts:L61 | neighbors=[food.ts]
- "types_nutrition_allergentype": "AllergenType" | kind=code-symbol | source=src/types/nutrition.ts:L18 | neighbors=[nutrition.ts]
- "types_nutrition_ingredient": "Ingredient" | kind=code-symbol | source=src/types/nutrition.ts:L7 | neighbors=[nutrition.ts]
- "types_nutrition_macrovalue": "MacroValue" | kind=code-symbol | source=src/types/nutrition.ts:L1 | neighbors=[nutrition.ts]
- "types_nutrition_nutritionairesponse": "NutritionAIResponse" | kind=code-symbol | source=src/types/nutrition.ts:L48 | neighbors=[nutrition.ts]
- "types_nutrition_nutritionanalysis": "NutritionAnalysis" | kind=code-symbol | source=src/types/nutrition.ts:L32 | neighbors=[nutrition.ts]
- "types_nutrition_nutritionscore": "NutritionScore" | kind=code-symbol | source=src/types/nutrition.ts:L13 | neighbors=[nutrition.ts]
- "types_recipe_generatedrecipe": "GeneratedRecipe" | kind=code-symbol | source=src/types/recipe.ts:L35 | neighbors=[recipe.ts]
- "types_recipe_recipeairesponse": "RecipeAIResponse" | kind=code-symbol | source=src/types/recipe.ts:L48 | neighbors=[recipe.ts]
- "types_recipe_recipeconfig": "RecipeConfig" | kind=code-symbol | source=src/types/recipe.ts:L17 | neighbors=[recipe.ts]
- "types_recipe_recipeingredient": "RecipeIngredient" | kind=code-symbol | source=src/types/recipe.ts:L24 | neighbors=[recipe.ts]
- "types_recipe_recipemacros": "RecipeMacros" | kind=code-symbol | source=src/types/recipe.ts:L29 | neighbors=[recipe.ts]
- "types_supabase_database": "Database" | kind=code-symbol | source=src/types/supabase.ts:L1 | neighbors=[supabase.ts]
- "types_user_activitylevel": "ActivityLevel" | kind=code-symbol | source=src/types/user.ts:L3 | neighbors=[user.ts]
- "types_user_caloriegoals": "CalorieGoals" | kind=code-symbol | source=src/types/user.ts:L21 | neighbors=[user.ts]
- "types_user_goaltype": "GoalType" | kind=code-symbol | source=src/types/user.ts:L4 | neighbors=[user.ts]
- "types_user_sex": "Sex" | kind=code-symbol | source=src/types/user.ts:L5 | neighbors=[user.ts]
- "types_user_userprofile": "UserProfile" | kind=code-symbol | source=src/types/user.ts:L8 | neighbors=[user.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cristianasollini/Documents/WORK/GIT/Avocato/.graphify/description-instructions/batch-008.json

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
