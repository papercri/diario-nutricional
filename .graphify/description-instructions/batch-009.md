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

- "views_dashboardview_confirmaddplatetoday": "confirmAddPlateToDay()" | kind=code-symbol | source=src/views/DashboardView.vue:L176 | neighbors=[DashboardView.vue]
- "views_dashboardview_confirmaddrecipetoday": "confirmAddRecipeToDay()" | kind=code-symbol | source=src/views/DashboardView.vue:L203 | neighbors=[DashboardView.vue]
- "views_dashboardview_confirmdeleteentry": "confirmDeleteEntry()" | kind=code-symbol | source=src/views/DashboardView.vue:L28 | neighbors=[DashboardView.vue]
- "views_dashboardview_deleteplate": "deletePlate()" | kind=code-symbol | source=src/views/DashboardView.vue:L156 | neighbors=[DashboardView.vue]
- "views_dashboardview_deleterecipe": "deleteRecipe()" | kind=code-symbol | source=src/views/DashboardView.vue:L163 | neighbors=[DashboardView.vue]
- "views_dashboardview_entrymacros": "entryMacros()" | kind=code-symbol | source=src/views/DashboardView.vue:L65 | neighbors=[DashboardView.vue]
- "views_dashboardview_executecleartoday": "executeClearToday()" | kind=code-symbol | source=src/views/DashboardView.vue:L47 | neighbors=[DashboardView.vue]
- "views_dashboardview_executedeleteentry": "executeDeleteEntry()" | kind=code-symbol | source=src/views/DashboardView.vue:L33 | neighbors=[DashboardView.vue]
- "views_dashboardview_mealtypetotalcalories": "mealTypeTotalCalories()" | kind=code-symbol | source=src/views/DashboardView.vue:L61 | neighbors=[DashboardView.vue]
- "views_dashboardview_openaddplatetoday": "openAddPlateToDay()" | kind=code-symbol | source=src/views/DashboardView.vue:L170 | neighbors=[DashboardView.vue]
- "views_dashboardview_openaddrecipetoday": "openAddRecipeToDay()" | kind=code-symbol | source=src/views/DashboardView.vue:L183 | neighbors=[DashboardView.vue]
- "views_dashboardview_openplatemodal": "openPlateModal()" | kind=code-symbol | source=src/views/DashboardView.vue:L146 | neighbors=[DashboardView.vue]
- "views_dashboardview_openrecipemodal": "openRecipeModal()" | kind=code-symbol | source=src/views/DashboardView.vue:L151 | neighbors=[DashboardView.vue]
- "views_dashboardview_switchtab": "switchTab()" | kind=code-symbol | source=src/views/DashboardView.vue:L87 | neighbors=[DashboardView.vue]
- "views_dashboardview_togglemealtype": "toggleMealType()" | kind=code-symbol | source=src/views/DashboardView.vue:L53 | neighbors=[DashboardView.vue]
- "views_nutritionanalyzerview_closemodal": "closeModal()" | kind=code-symbol | source=src/views/NutritionAnalyzerView.vue:L66 | neighbors=[NutritionAnalyzerView.vue]
- "views_nutritionanalyzerview_confirmadd": "confirmAdd()" | kind=code-symbol | source=src/views/NutritionAnalyzerView.vue:L49 | neighbors=[NutritionAnalyzerView.vue]
- "views_nutritionanalyzerview_handleanalyze": "handleAnalyze()" | kind=code-symbol | source=src/views/NutritionAnalyzerView.vue:L25 | neighbors=[NutritionAnalyzerView.vue]
- "views_nutritionanalyzerview_openaddmodal": "openAddModal()" | kind=code-symbol | source=src/views/NutritionAnalyzerView.vue:L44 | neighbors=[NutritionAnalyzerView.vue]
- "views_nutritionanalyzerview_saveplate": "savePlate()" | kind=code-symbol | source=src/views/NutritionAnalyzerView.vue:L76 | neighbors=[NutritionAnalyzerView.vue]
- "views_profileview_canceldeleteentry": "cancelDeleteEntry()" | kind=code-symbol | source=src/views/ProfileView.vue:L143 | neighbors=[ProfileView.vue]
- "views_profileview_confirmaddplatetoday": "confirmAddPlateToDay()" | kind=code-symbol | source=src/views/ProfileView.vue:L214 | neighbors=[ProfileView.vue]
- "views_profileview_confirmaddrecipetoday": "confirmAddRecipeToDay()" | kind=code-symbol | source=src/views/ProfileView.vue:L234 | neighbors=[ProfileView.vue]
- "views_profileview_confirmdelete": "confirmDelete()" | kind=code-symbol | source=src/views/ProfileView.vue:L227 | neighbors=[ProfileView.vue]
- "views_profileview_confirmdeleteentry": "confirmDeleteEntry()" | kind=code-symbol | source=src/views/ProfileView.vue:L129 | neighbors=[ProfileView.vue]
- "views_profileview_deleteplate": "deletePlate()" | kind=code-symbol | source=src/views/ProfileView.vue:L188 | neighbors=[ProfileView.vue]
- "views_profileview_deleterecipe": "deleteRecipe()" | kind=code-symbol | source=src/views/ProfileView.vue:L195 | neighbors=[ProfileView.vue]
- "views_profileview_entrymacros": "entryMacros()" | kind=code-symbol | source=src/views/ProfileView.vue:L166 | neighbors=[ProfileView.vue]
- "views_profileview_executecleartoday": "executeClearToday()" | kind=code-symbol | source=src/views/ProfileView.vue:L148 | neighbors=[ProfileView.vue]
- "views_profileview_executedelete": "executeDelete()" | kind=code-symbol | source=src/views/ProfileView.vue:L234 | neighbors=[ProfileView.vue]
- "views_profileview_executedeleteentry": "executeDeleteEntry()" | kind=code-symbol | source=src/views/ProfileView.vue:L134 | neighbors=[ProfileView.vue]
- "views_profileview_mealtypetotalcalories": "mealTypeTotalCalories()" | kind=code-symbol | source=src/views/ProfileView.vue:L162 | neighbors=[ProfileView.vue]
- "views_profileview_onnumberinput": "onNumberInput()" | kind=code-symbol | source=src/views/ProfileView.vue:L35 | neighbors=[ProfileView.vue]
- "views_profileview_openaddplatetoday": "openAddPlateToDay()" | kind=code-symbol | source=src/views/ProfileView.vue:L202 | neighbors=[ProfileView.vue]
- "views_profileview_openaddrecipetoday": "openAddRecipeToDay()" | kind=code-symbol | source=src/views/ProfileView.vue:L215 | neighbors=[ProfileView.vue]
- "views_profileview_openplatemodal": "openPlateModal()" | kind=code-symbol | source=src/views/ProfileView.vue:L178 | neighbors=[ProfileView.vue]
- "views_profileview_openrecipemodal": "openRecipeModal()" | kind=code-symbol | source=src/views/ProfileView.vue:L183 | neighbors=[ProfileView.vue]
- "views_profileview_togglemealtype": "toggleMealType()" | kind=code-symbol | source=src/views/ProfileView.vue:L154 | neighbors=[ProfileView.vue]
- "views_recipegeneratorview_handlegenerate": "handleGenerate()" | kind=code-symbol | source=src/views/RecipeGeneratorView.vue:L53 | neighbors=[RecipeGeneratorView.vue]
- "views_recipegeneratorview_isallergenselected": "isAllergenSelected()" | kind=code-symbol | source=src/views/RecipeGeneratorView.vue:L49 | neighbors=[RecipeGeneratorView.vue]

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
