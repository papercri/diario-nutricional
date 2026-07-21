# Node Description Batch 11 of 11

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

- "views_nutritionanalyzerview_closemodal": "closeModal()" | kind=code-symbol | source=src/views/NutritionAnalyzerView.vue:L72 | neighbors=[NutritionAnalyzerView.vue]
- "views_nutritionanalyzerview_confirmadd": "confirmAdd()" | kind=code-symbol | source=src/views/NutritionAnalyzerView.vue:L55 | neighbors=[NutritionAnalyzerView.vue]
- "views_nutritionanalyzerview_handleanalyze": "handleAnalyze()" | kind=code-symbol | source=src/views/NutritionAnalyzerView.vue:L31 | neighbors=[NutritionAnalyzerView.vue]
- "views_nutritionanalyzerview_openaddmodal": "openAddModal()" | kind=code-symbol | source=src/views/NutritionAnalyzerView.vue:L50 | neighbors=[NutritionAnalyzerView.vue]
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
- "views_profileview_onnumberinput": "onNumberInput()" | kind=code-symbol | source=src/views/ProfileView.vue:L115 | neighbors=[ProfileView.vue]
- "views_profileview_openaddplatetoday": "openAddPlateToDay()" | kind=code-symbol | source=src/views/ProfileView.vue:L202 | neighbors=[ProfileView.vue]
- "views_profileview_openaddrecipetoday": "openAddRecipeToDay()" | kind=code-symbol | source=src/views/ProfileView.vue:L215 | neighbors=[ProfileView.vue]
- "views_profileview_openplatemodal": "openPlateModal()" | kind=code-symbol | source=src/views/ProfileView.vue:L178 | neighbors=[ProfileView.vue]
- "views_profileview_openrecipemodal": "openRecipeModal()" | kind=code-symbol | source=src/views/ProfileView.vue:L183 | neighbors=[ProfileView.vue]
- "views_profileview_togglemealtype": "toggleMealType()" | kind=code-symbol | source=src/views/ProfileView.vue:L154 | neighbors=[ProfileView.vue]
- "views_recipegeneratorview_handlegenerate": "handleGenerate()" | kind=code-symbol | source=src/views/RecipeGeneratorView.vue:L58 | neighbors=[RecipeGeneratorView.vue]
- "views_recipegeneratorview_isallergenselected": "isAllergenSelected()" | kind=code-symbol | source=src/views/RecipeGeneratorView.vue:L54 | neighbors=[RecipeGeneratorView.vue]
- "views_recipegeneratorview_ispreferenceselected": "isPreferenceSelected()" | kind=code-symbol | source=src/views/RecipeGeneratorView.vue:L41 | neighbors=[RecipeGeneratorView.vue]
- "views_recipegeneratorview_saverecipe": "saveRecipe()" | kind=code-symbol | source=src/views/RecipeGeneratorView.vue:L84 | neighbors=[RecipeGeneratorView.vue]
- "views_recipegeneratorview_toggleallergen": "toggleAllergen()" | kind=code-symbol | source=src/views/RecipeGeneratorView.vue:L45 | neighbors=[RecipeGeneratorView.vue]
- "views_recipegeneratorview_togglepreference": "togglePreference()" | kind=code-symbol | source=src/views/RecipeGeneratorView.vue:L27 | neighbors=[RecipeGeneratorView.vue]
- "views_searchview_addfromdetail": "addFromDetail()" | kind=code-symbol | source=src/views/SearchView.vue:L25 | neighbors=[SearchView.vue]
- "views_searchview_closedetail": "closeDetail()" | kind=code-symbol | source=src/views/SearchView.vue:L21 | neighbors=[SearchView.vue]
- "views_searchview_opendetail": "openDetail()" | kind=code-symbol | source=src/views/SearchView.vue:L17 | neighbors=[SearchView.vue]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cristianasollini/Documents/WORK/GIT/Avocato/.graphify/description-instructions/batch-010.json

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
