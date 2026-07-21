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

- "types_food_nutritionsummary": "NutritionSummary" | kind=code-symbol | source=src/types/food.ts:L30 | neighbors=[food.ts]
- "types_food_openfoodfactsproduct": "OpenFoodFactsProduct" | kind=code-symbol | source=src/types/food.ts:L37 | neighbors=[food.ts]
- "types_food_openfoodfactssearchresult": "OpenFoodFactsSearchResult" | kind=code-symbol | source=src/types/food.ts:L61 | neighbors=[food.ts]
- "types_nutrition_allergentype": "AllergenType" | kind=code-symbol | source=src/types/nutrition.ts:L18 | neighbors=[nutrition.ts]
- "types_nutrition_ingredient": "Ingredient" | kind=code-symbol | source=src/types/nutrition.ts:L7 | neighbors=[nutrition.ts]
- "types_nutrition_macrovalue": "MacroValue" | kind=code-symbol | source=src/types/nutrition.ts:L1 | neighbors=[nutrition.ts]
- "types_nutrition_nutritionairesponse": "NutritionAIResponse" | kind=code-symbol | source=src/types/nutrition.ts:L48 | neighbors=[nutrition.ts]
- "types_nutrition_nutritionanalysis": "NutritionAnalysis" | kind=code-symbol | source=src/types/nutrition.ts:L32 | neighbors=[nutrition.ts]
- "types_nutrition_nutritionscore": "NutritionScore" | kind=code-symbol | source=src/types/nutrition.ts:L13 | neighbors=[nutrition.ts]
- "types_recipe_generatedrecipe": "GeneratedRecipe" | kind=code-symbol | source=src/types/recipe.ts:L39 | neighbors=[recipe.ts]
- "types_recipe_recipeairesponse": "RecipeAIResponse" | kind=code-symbol | source=src/types/recipe.ts:L52 | neighbors=[recipe.ts]
- "types_recipe_recipeconfig": "RecipeConfig" | kind=code-symbol | source=src/types/recipe.ts:L21 | neighbors=[recipe.ts]
- "types_recipe_recipeingredient": "RecipeIngredient" | kind=code-symbol | source=src/types/recipe.ts:L28 | neighbors=[recipe.ts]
- "types_recipe_recipemacros": "RecipeMacros" | kind=code-symbol | source=src/types/recipe.ts:L33 | neighbors=[recipe.ts]
- "types_user_activitylevel": "ActivityLevel" | kind=code-symbol | source=src/types/user.ts:L1 | neighbors=[user.ts]
- "types_user_caloriegoals": "CalorieGoals" | kind=code-symbol | source=src/types/user.ts:L17 | neighbors=[user.ts]
- "types_user_goaltype": "GoalType" | kind=code-symbol | source=src/types/user.ts:L2 | neighbors=[user.ts]
- "types_user_sex": "Sex" | kind=code-symbol | source=src/types/user.ts:L3 | neighbors=[user.ts]
- "types_user_userprofile": "UserProfile" | kind=code-symbol | source=src/types/user.ts:L6 | neighbors=[user.ts]
- "ui_card": "Card.vue" | kind=code-symbol | source=src/components/ui/Card.vue:L1 | neighbors=[ead34ac feat(design-system): implement …]
- "ui_modal_onbackdropclick": "onBackdropClick()" | kind=code-symbol | source=src/components/ui/Modal.vue:L19 | neighbors=[Modal.vue]
- "ui_modal_onkeydown": "onKeydown()" | kind=code-symbol | source=src/components/ui/Modal.vue:L25 | neighbors=[Modal.vue]
- "ui_toast_bgcolor": "bgColor()" | kind=code-symbol | source=src/components/ui/Toast.vue:L12 | neighbors=[Toast.vue]
- "ui_toast_iconclass": "iconClass()" | kind=code-symbol | source=src/components/ui/Toast.vue:L6 | neighbors=[Toast.vue]
- "ui_typography": "Typography.vue" | kind=code-symbol | source=src/components/ui/Typography.vue:L1 | neighbors=[ead34ac feat(design-system): implement …]
- "utils_constants_activity_options": "ACTIVITY_OPTIONS" | kind=code-symbol | source=src/utils/constants.ts:L38 | neighbors=[constants.ts]
- "utils_constants_allergen_options": "ALLERGEN_OPTIONS" | kind=code-symbol | source=src/utils/constants.ts:L71 | neighbors=[constants.ts]
- "utils_constants_allergenoption": "AllergenOption" | kind=code-symbol | source=src/utils/constants.ts:L65 | neighbors=[constants.ts]
- "utils_constants_dietary_preference_options": "DIETARY_PREFERENCE_OPTIONS" | kind=code-symbol | source=src/utils/constants.ts:L58 | neighbors=[constants.ts]
- "utils_constants_dietarypreferenceoption": "DietaryPreferenceOption" | kind=code-symbol | source=src/utils/constants.ts:L52 | neighbors=[constants.ts]
- "utils_constants_goal_options": "GOAL_OPTIONS" | kind=code-symbol | source=src/utils/constants.ts:L46 | neighbors=[constants.ts]
- "utils_constants_goaloption": "GoalOption" | kind=code-symbol | source=src/utils/constants.ts:L10 | neighbors=[constants.ts]
- "utils_constants_meal_type_icons": "MEAL_TYPE_ICONS" | kind=code-symbol | source=src/utils/constants.ts:L24 | neighbors=[constants.ts]
- "utils_constants_meal_type_labels": "MEAL_TYPE_LABELS" | kind=code-symbol | source=src/utils/constants.ts:L17 | neighbors=[constants.ts]
- "utils_constants_meal_type_options": "MEAL_TYPE_OPTIONS" | kind=code-symbol | source=src/utils/constants.ts:L31 | neighbors=[constants.ts]
- "utils_constants_selectoption": "SelectOption" | kind=code-symbol | source=src/utils/constants.ts:L4 | neighbors=[constants.ts]
- "utils_mifflinstjeor_activitymultipliers": "activityMultipliers" | kind=code-symbol | source=src/utils/mifflinStJeor.ts:L3 | neighbors=[mifflinStJeor.ts]
- "utils_mifflinstjeor_goaladjustments": "goalAdjustments" | kind=code-symbol | source=src/utils/mifflinStJeor.ts:L11 | neighbors=[mifflinStJeor.ts]
- "utils_nutrition_spec_makeentry": "makeEntry()" | kind=code-symbol | source=src/utils/nutrition.spec.ts:L47 | neighbors=[nutrition.spec.ts]
- "views_dashboardview_canceldeleteentry": "cancelDeleteEntry()" | kind=code-symbol | source=src/views/DashboardView.vue:L42 | neighbors=[DashboardView.vue]

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
