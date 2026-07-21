# Node Description Batch 2 of 11

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
For an entity node (any other kind — e.g. a person, place, event, object),
describe what the entity is and its role, grounded in its type, its
relations (neighbors) and the provided citations/evidence — e.g.
"Lady Carfax, a wealthy heiress who disappears en route to Lausanne.".
Ground entity descriptions in the citations/evidence when present; do not
speculate beyond the context, so a node with no supporting context may be
left out of the reply.
LANGUAGE: each entry has a `lang=` marker giving the language of its source.
Write that entry's description in EXACTLY that language. Do not translate to
a single common language — match each node's source language individually.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "commit:repo:github.com/papercri/diario-nutricional@ca9bbdf63b6fde43ab2af1946c28cf24519cb493": "ca9bbdf Merge pull request #9 from papercri/stage" | kind=Commit | source=git | neighbors=[66a6c2c feat(ui): compact dashboard red…, 7bd04f5 Merge pull request #8 from pape…, backend, dev, master, recetas] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@fb0b7723882796a1423f0bd3b94465f0fbcc73d7": "fb0b772 skills" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, 9666541 added readme] | lang=en
- "components_fooddetailmodal": "FoodDetailModal.vue" | kind=code-symbol | source=src/components/FoodDetailModal.vue:L1 | neighbors=[067eeb3 refactor(imports): migrate rela…, 1a36693 perf(fontawesome): tree-shake t…, 23e569a Merge pull request #14 from pap…, 3f2e940 a11y(food-detail-modal): add fo…, 4fa3438 feat(dashboard): add tabbed int…, 68853a4 style(search): use nutri-*.png …] | lang=en
- "components_nutrientcard": "NutrientCard.vue" | kind=code-symbol | source=src/components/NutrientCard.vue:L1 | neighbors=[067eeb3 refactor(imports): migrate rela…, 0c1f887 Merge pull request #3 from pape…, 0f5f71c fix: layout in index, 142eba8 Merge pull request #1 from pape…, 23e569a Merge pull request #14 from pap…, 3a88429 vitest] | lang=en
- "router_index": "index.ts" | kind=code-symbol | source=src/router/index.ts:L1 | neighbors=[1188f4d feat(recipes): add AI recipe ge…, 124ec25 feat(auth): implement Supabase …, 1475d2d feat: remove tips feature and u…, 77d9ae4 Merge pull request #6 from pape…, 7bd04f5 Merge pull request #8 from pape…, 81209a9 first commit] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@b67ae0ce5736002b0938412bd05061986c3b24d9": "b67ae0c Merge branch 'master' of https://github.com/papercri/diario-nutricional" | kind=Commit | source=git | neighbors=[72c4ab0 readme, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@bdb730eb709ef45cbf4c029ad5b8d168cfd3eae9": "bdb730e style(design-system): add shared utility classes and deduplicate CSS pa…" | kind=Commit | source=git | neighbors=[3f2e940 a11y(food-detail-modal): add fo…, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@d0c2bb7ab982d71dad35926af73dedf602239197": "d0c2bb7 Merge pull request #7 from papercri/bmi-calculator" | kind=Commit | source=git | neighbors=[77d9ae4 Merge pull request #6 from pape…, backend, dev, master, recetas, stage] | lang=en
- "types_user": "user.ts" | kind=code-symbol | source=src/types/user.ts:L1 | neighbors=[124ec25 feat(auth): implement Supabase …, 27955a0 Merge pull request #12 from pap…, 81209a9 first commit, b47c800 feat(profile): footer sticky, p…, food.ts, ActivityLevel] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@27955a0256fabd7e80e946b317440ef2c5786311": "27955a0 Merge pull request #12 from papercri/stage" | kind=Commit | source=git | neighbors=[master, stage, 9704b4a Merge pull request #13 from pap…, MealAnalyzerForm.vue, App.vue, userStore.ts] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@3a3bb2c505f6b13d3cabcdde603c086b234dc933": "3a3bb2c feat(ui): saved cards with allergen/veggie badges, card-elevated btn-sl…" | kind=Commit | source=git | neighbors=[generate-recipe.ts, dev, 29fec84 chore: include generate-recipe.…, App.vue, foodStore.ts, userStore.ts] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@80e419864fef991f3569c710401440bdc71baf74": "80e4198 feat(analyzer): add allergen detection, dietary info card, and meal his…" | kind=Commit | source=git | neighbors=[analyze-meal.ts, backend, dev, master, stage, 124ec25 feat(auth): implement Supabase …] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@9348c2e0ab0e86edccfa686366a3f3e0662968ce": "9348c2e feat: add BMI calculator with linear gauge to profile" | kind=Commit | source=git | neighbors=[77d9ae4 Merge pull request #6 from pape…, backend, dev, master, recetas, stage] | lang=en
- "eslint_config": "eslint.config.js" | kind=code-symbol | source=eslint.config.js:L1 | neighbors=[1348d1f Merge pull request #11 from pap…, 142eba8 Merge pull request #1 from pape…, 3c23ea9 Feat: mel analizer IA assisted, 48c5336 fix: agregar globals MouseEvent…, 77d9ae4 Merge pull request #6 from pape…, 7af59dd feat(dashboard): add confirmati…] | lang=en
- "services_openfoodfacts": "openFoodFacts.ts" | kind=code-symbol | source=src/services/openFoodFacts.ts:L1 | neighbors=[23e569a Merge pull request #14 from pap…, 81209a9 first commit, 86a420f fix: nueva configuracion de la …, b864cea refactor(imports): complete @/ …, c6510ee feat(search): add Nutri-Score b…, fetchJson()] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@89162afa18974bdd33d66f4a8c1664de1525f8d9": "89162af feat(ui): compact nutrition layout + add meal to daily calories" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, fd4d3f4 fix(ui): center analyze button,…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@c6510ee26c85bd51b6abd9d1616319586fd2aaaf": "c6510ee feat(search): add Nutri-Score badges and product detail modal" | kind=Commit | source=git | neighbors=[86a420f fix: nueva configuracion de la …, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@e1726abbaad3ee64f6154ad85093bd722d308d78": "e1726ab test: add unit tests for stores, services and composables (59 new tests…" | kind=Commit | source=git | neighbors=[65fda0d docs(readme): fix Groq model mi…, backend, dev, master, recetas, stage] | lang=en
- "components_caloriering": "CalorieRing.vue" | kind=code-symbol | source=src/components/CalorieRing.vue:L1 | neighbors=[067eeb3 refactor(imports): migrate rela…, 0c1f887 Merge pull request #3 from pape…, 142eba8 Merge pull request #1 from pape…, 23e569a Merge pull request #14 from pap…, 3a88429 vitest, 404580b style(components): enhance Calo…] | lang=en
- "types_nutrition": "nutrition.ts" | kind=code-symbol | source=src/types/nutrition.ts:L1 | neighbors=[04ca00f removed confidence, 1348d1f Merge pull request #11 from pap…, 77d9ae4 Merge pull request #6 from pape…, 80e4198 feat(analyzer): add allergen de…, 8d66207 Merge pull request #15 from pap…, 9f4976a feat: add AI nutrition analyzer…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@04ca00fb6d7ebabdf643b567ea5b9ddbdb08d47a": "04ca00f removed confidence" | kind=Commit | source=git | neighbors=[analyze-meal.ts, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@3a884295e1b7c20044c7ff08e7cf4af5460a9aee": "3a88429 vitest" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, fa033e2 fix(composables): use number ty…] | lang=pt
- "commit:repo:github.com/papercri/diario-nutricional@4dc83ed7acd0048db4ccc7d465044953bf560361": "4dc83ed style: increase font-size 0.625rem to 0.675rem across 6 occurrences" | kind=Commit | source=git | neighbors=[2a14b35 style(tokens): darken --clr-tex…, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@a558225260d10ef542385a1e740b3439576f5c67": "a558225 first commit" | kind=Commit | source=git | neighbors=[81209a9 first commit, backend, dev, master, recetas, stage] | lang=pt
- "commit:repo:github.com/papercri/diario-nutricional@f2604c451a17816f08540e7763aa47cf0d75e7de": "f2604c4 fix(api): resolve local dev 404 - strip markdown JSON, fix Cerebras mod…" | kind=Commit | source=git | neighbors=[9f4976a feat: add AI nutrition analyzer…, analyze-meal.ts, backend, dev, master, recetas] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@f62afa5356560acb125c384a3cef06648525a790": "f62afa5 test: add Vitest config and unit tests for all pure utility functions" | kind=Commit | source=git | neighbors=[ed984be skills, backend, dev, master, recetas, stage] | lang=en
- "nutrition_nutritionresultcard": "NutritionResultCard.vue" | kind=code-symbol | source=src/components/nutrition/NutritionResultCard.vue:L1 | neighbors=[04ca00f removed confidence, 1348d1f Merge pull request #11 from pap…, 1a36693 perf(fontawesome): tree-shake t…, 23e569a Merge pull request #14 from pap…, 4fa3438 feat(dashboard): add tabbed int…, 77d9ae4 Merge pull request #6 from pape…] | lang=en
- "providers_cerebras": "cerebras.ts" | kind=code-symbol | source=api/providers/cerebras.ts:L1 | neighbors=[analyze-meal.ts, generate-recipe.ts, 1348d1f Merge pull request #11 from pap…, 77d9ae4 Merge pull request #6 from pape…, 9f4976a feat: add AI nutrition analyzer…, a92d168 fix: error handling] | lang=en
- "providers_groq": "groq.ts" | kind=code-symbol | source=api/providers/groq.ts:L1 | neighbors=[analyze-meal.ts, generate-recipe.ts, 1348d1f Merge pull request #11 from pap…, 499567c dependences update, 77d9ae4 Merge pull request #6 from pape…, 9f4976a feat: add AI nutrition analyzer…] | lang=en
- "services_nutritionai": "nutritionAI.ts" | kind=code-symbol | source=src/services/nutritionAI.ts:L1 | neighbors=[067eeb3 refactor(imports): migrate rela…, 1348d1f Merge pull request #11 from pap…, 23e569a Merge pull request #14 from pap…, 4fa3438 feat(dashboard): add tabbed int…, 77d9ae4 Merge pull request #6 from pape…, 7af59dd feat(dashboard): add confirmati…] | lang=en
- "types_food": "food.ts" | kind=code-symbol | source=src/types/food.ts:L1 | neighbors=[81209a9 first commit, a558225 first commit, c6510ee feat(search): add Nutri-Score b…, FoodItem, MealEntry, NutriScoreGrade] | lang=en
- "types_recipe": "recipe.ts" | kind=code-symbol | source=src/types/recipe.ts:L1 | neighbors=[1188f4d feat(recipes): add AI recipe ge…, 4fa3438 feat(dashboard): add tabbed int…, 8d66207 Merge pull request #15 from pap…, Allergen, DietaryPreference, GeneratedRecipe] | lang=en
- "utils_mifflinstjeor": "mifflinStJeor.ts" | kind=code-symbol | source=src/utils/mifflinStJeor.ts:L1 | neighbors=[23e569a Merge pull request #14 from pap…, 27955a0 Merge pull request #12 from pap…, 81209a9 first commit, b47c800 feat(profile): footer sticky, p…, b864cea refactor(imports): complete @/ …, activityMultipliers] | lang=en
- "utils_mifflinstjeor_spec": "mifflinStJeor.spec.ts" | kind=code-symbol | source=src/utils/mifflinStJeor.spec.ts:L1 | neighbors=[0c1f887 Merge pull request #3 from pape…, 124ec25 feat(auth): implement Supabase …, 23e569a Merge pull request #14 from pap…, 27955a0 Merge pull request #12 from pap…, b47c800 feat(profile): footer sticky, p…, b864cea refactor(imports): complete @/ …] | lang=en
- "views_recipegeneratorview": "RecipeGeneratorView.vue" | kind=code-symbol | source=src/views/RecipeGeneratorView.vue:L1 | neighbors=[1188f4d feat(recipes): add AI recipe ge…, 3a3bb2c feat(ui): saved cards with alle…, 4fa3438 feat(dashboard): add tabbed int…, 8d66207 Merge pull request #15 from pap…, index.ts, handleGenerate()] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@1475d2d95b4dd032293a5eff3e7ebd1568a35b05": "1475d2d feat: remove tips feature and update README with AI analyzer docs" | kind=Commit | source=git | neighbors=[05af8c0 readme, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@404580bc949bef4eacddf8bbcd5c3b87626a969f": "404580b style(components): enhance CalorieRing, NutrientCard, FoodCard" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, b199d6e style(dashboard): restyle with …] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@410e39e9ee976740b68e9a9905554df2f4643017": "410e39e refactor: extraer funciones puras y constantes compartidas" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, b09eba1 refactor: crear composables par…] | lang=es
- "commit:repo:github.com/papercri/diario-nutricional@48c53368ee1640d98c78d8fc63277a9b662ecd2c": "48c5336 fix: agregar globals MouseEvent/Event a ESLint y eliminar import no usa…" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, 142eba8 Merge pull request #1 from pape…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@7bd04f5205b10f9605c55c002519398f300ca555": "7bd04f5 Merge pull request #8 from papercri/stage" | kind=Commit | source=git | neighbors=[05af8c0 readme, 1475d2d feat: remove tips feature and u…, backend, dev, master, recetas] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cristianasollini/Documents/WORK/GIT/Avocato/.graphify/description-instructions/batch-001.json

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
