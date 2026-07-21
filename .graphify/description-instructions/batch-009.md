# Node Description Batch 10 of 11

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
- "views_authview_geterrormessage": "getErrorMessage()" | kind=code-symbol | source=src/views/AuthView.vue:L49 | neighbors=[AuthView.vue]
- "views_authview_handleblur": "handleBlur()" | kind=code-symbol | source=src/views/AuthView.vue:L40 | neighbors=[AuthView.vue]
- "views_authview_handlesubmit": "handleSubmit()" | kind=code-symbol | source=src/views/AuthView.vue:L68 | neighbors=[AuthView.vue]
- "views_authview_togglepassword": "togglePassword()" | kind=code-symbol | source=src/views/AuthView.vue:L45 | neighbors=[AuthView.vue]
- "views_dashboardview_canceldeleteentry": "cancelDeleteEntry()" | kind=code-symbol | source=src/views/DashboardView.vue:L111 | neighbors=[DashboardView.vue]
- "views_dashboardview_confirmaddplatetoday": "confirmAddPlateToDay()" | kind=code-symbol | source=src/views/DashboardView.vue:L176 | neighbors=[DashboardView.vue]
- "views_dashboardview_confirmaddrecipetoday": "confirmAddRecipeToDay()" | kind=code-symbol | source=src/views/DashboardView.vue:L203 | neighbors=[DashboardView.vue]
- "views_dashboardview_confirmdeleteentry": "confirmDeleteEntry()" | kind=code-symbol | source=src/views/DashboardView.vue:L97 | neighbors=[DashboardView.vue]
- "views_dashboardview_deleteplate": "deletePlate()" | kind=code-symbol | source=src/views/DashboardView.vue:L156 | neighbors=[DashboardView.vue]
- "views_dashboardview_deleterecipe": "deleteRecipe()" | kind=code-symbol | source=src/views/DashboardView.vue:L163 | neighbors=[DashboardView.vue]
- "views_dashboardview_entrymacros": "entryMacros()" | kind=code-symbol | source=src/views/DashboardView.vue:L134 | neighbors=[DashboardView.vue]
- "views_dashboardview_executecleartoday": "executeClearToday()" | kind=code-symbol | source=src/views/DashboardView.vue:L116 | neighbors=[DashboardView.vue]
- "views_dashboardview_executedeleteentry": "executeDeleteEntry()" | kind=code-symbol | source=src/views/DashboardView.vue:L102 | neighbors=[DashboardView.vue]
- "views_dashboardview_mealtypetotalcalories": "mealTypeTotalCalories()" | kind=code-symbol | source=src/views/DashboardView.vue:L130 | neighbors=[DashboardView.vue]
- "views_dashboardview_openaddplatetoday": "openAddPlateToDay()" | kind=code-symbol | source=src/views/DashboardView.vue:L170 | neighbors=[DashboardView.vue]
- "views_dashboardview_openaddrecipetoday": "openAddRecipeToDay()" | kind=code-symbol | source=src/views/DashboardView.vue:L183 | neighbors=[DashboardView.vue]
- "views_dashboardview_openplatemodal": "openPlateModal()" | kind=code-symbol | source=src/views/DashboardView.vue:L146 | neighbors=[DashboardView.vue]
- "views_dashboardview_openrecipemodal": "openRecipeModal()" | kind=code-symbol | source=src/views/DashboardView.vue:L151 | neighbors=[DashboardView.vue]
- "views_dashboardview_switchtab": "switchTab()" | kind=code-symbol | source=src/views/DashboardView.vue:L87 | neighbors=[DashboardView.vue]
- "views_dashboardview_togglemealtype": "toggleMealType()" | kind=code-symbol | source=src/views/DashboardView.vue:L122 | neighbors=[DashboardView.vue]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cristianasollini/Documents/WORK/GIT/Avocato/.graphify/description-instructions/batch-009.json

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
