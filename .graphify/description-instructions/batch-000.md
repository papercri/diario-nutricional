# Node Description Batch 1 of 11

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

- "branch:repo:github.com/papercri/diario-nutricional#dev": "dev" | kind=Branch | source=git | neighbors=[04ca00f removed confidence, 05af8c0 readme, 067eeb3 refactor(imports): migrate rela…, 0c1f887 Merge pull request #3 from pape…, 0f5f71c fix: layout in index, 1188f4d feat(recipes): add AI recipe ge…] | lang=en
- "branch:repo:github.com/papercri/diario-nutricional#backend": "backend" | kind=Branch | source=git | neighbors=[04ca00f removed confidence, 05af8c0 readme, 067eeb3 refactor(imports): migrate rela…, 0c1f887 Merge pull request #3 from pape…, 0f5f71c fix: layout in index, 1188f4d feat(recipes): add AI recipe ge…] | lang=en
- "branch:repo:github.com/papercri/diario-nutricional#master": "master" | kind=Branch | source=git | neighbors=[04ca00f removed confidence, 05af8c0 readme, 067eeb3 refactor(imports): migrate rela…, 0c1f887 Merge pull request #3 from pape…, 0f5f71c fix: layout in index, 1188f4d feat(recipes): add AI recipe ge…] | lang=en
- "branch:repo:github.com/papercri/diario-nutricional#stage": "stage" | kind=Branch | source=git | neighbors=[04ca00f removed confidence, 05af8c0 readme, 067eeb3 refactor(imports): migrate rela…, 0c1f887 Merge pull request #3 from pape…, 0f5f71c fix: layout in index, 1188f4d feat(recipes): add AI recipe ge…] | lang=en
- "branch:repo:github.com/papercri/diario-nutricional#recetas": "recetas" | kind=Branch | source=git | neighbors=[04ca00f removed confidence, 05af8c0 readme, 067eeb3 refactor(imports): migrate rela…, 0c1f887 Merge pull request #3 from pape…, 0f5f71c fix: layout in index, 1188f4d feat(recipes): add AI recipe ge…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@23e569aff7fcf2ef4e44ecf9a20ad1ccca663ab3": "23e569a Merge pull request #14 from papercri/stage" | kind=Commit | source=git | neighbors=[1fd6bca fix(dashboard): increase meal s…, master, stage, 8d66207 Merge pull request #15 from pap…, AppHeader.vue, CalorieRing.vue] | lang=en
- "views_profileview": "ProfileView.vue" | kind=code-symbol | source=src/views/ProfileView.vue:L1 | neighbors=[067eeb3 refactor(imports): migrate rela…, 142eba8 Merge pull request #1 from pape…, 1a36693 perf(fontawesome): tree-shake t…, 23e569a Merge pull request #14 from pap…, 27955a0 Merge pull request #12 from pap…, 3a3bb2c feat(ui): saved cards with alle…] | lang=en
- "views_dashboardview": "DashboardView.vue" | kind=code-symbol | source=src/views/DashboardView.vue:L1 | neighbors=[067eeb3 refactor(imports): migrate rela…, 0c1f887 Merge pull request #3 from pape…, 0f5f71c fix: layout in index, 142eba8 Merge pull request #1 from pape…, 1a36693 perf(fontawesome): tree-shake t…, 1fd6bca fix(dashboard): increase meal s…] | lang=en
- "api_analyze_meal": "analyze-meal.ts" | kind=code-symbol | source=api/analyze-meal.ts:L1 | neighbors=[ALLERGEN_KEYWORDS, AllergenType, AnalysisOutcome, ANIMAL_PRODUCTS, detectAllergens(), enrichAnalysis()] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@4fa3438e64dd111d1a8e1a487c20fe9f201abedd": "4fa3438 feat(dashboard): add tabbed interface with saved plates, recipes, and p…" | kind=Commit | source=git | neighbors=[124ec25 feat(auth): implement Supabase …, backend, dev, 9d26981 fix(auth): fix template parsing…, AppHeader.vue, FoodDetailModal.vue] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@77d9ae449c586bf0d5b2bb22899fc34a0cd638af": "77d9ae4 Merge pull request #6 from papercri/ia-integration" | kind=Commit | source=git | neighbors=[3c23ea9 Feat: mel analizer IA assisted, 65b65c9 merge, analyze-meal.ts, backend, dev, master] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@81209a9eadaa50bd048291fb1204969ea36d0972": "81209a9 first commit" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, a558225 first commit] | lang=pt
- "commit:repo:github.com/papercri/diario-nutricional@1a36693333855981b694de71c441fc47b071f330": "1a36693 perf(fontawesome): tree-shake to 40 used icons via SVG components, remo…" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, 3f2e940 a11y(food-detail-modal): add fo…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@ead34acb8340cb67e6e28a047010c304f5627c68": "ead34ac feat(design-system): implement complete design system architecture" | kind=Commit | source=git | neighbors=[31ad743 style(food-card): button expand…, backend, dev, master, recetas, stage] | lang=en
- "components_appheader": "AppHeader.vue" | kind=code-symbol | source=src/components/AppHeader.vue:L1 | neighbors=[0c1f887 Merge pull request #3 from pape…, 1188f4d feat(recipes): add AI recipe ge…, 124ec25 feat(auth): implement Supabase …, 1475d2d feat: remove tips feature and u…, 1a36693 perf(fontawesome): tree-shake t…, 23e569a Merge pull request #14 from pap…] | lang=en
- "components_foodcard": "FoodCard.vue" | kind=code-symbol | source=src/components/FoodCard.vue:L1 | neighbors=[067eeb3 refactor(imports): migrate rela…, 1a36693 perf(fontawesome): tree-shake t…, 23e569a Merge pull request #14 from pap…, 261e591 style(food-card): badge top-ali…, 31ad743 style(food-card): button expand…, 39fde09 fix(food-card): simplify hover …] | lang=en
- "views_nutritionanalyzerview": "NutritionAnalyzerView.vue" | kind=code-symbol | source=src/views/NutritionAnalyzerView.vue:L1 | neighbors=[04ca00f removed confidence, 1348d1f Merge pull request #11 from pap…, 1a36693 perf(fontawesome): tree-shake t…, 1df5892 fix(ui): replace custom add-to-…, 23e569a Merge pull request #14 from pap…, 3a3bb2c feat(ui): saved cards with alle…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@067eeb324a5f03822acc8a87ed602fb5af69b0cd": "067eeb3 refactor(imports): migrate relative imports to @/ alias across views, s…" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, b864cea refactor(imports): complete @/ …] | lang=en
- "views_searchview": "SearchView.vue" | kind=code-symbol | source=src/views/SearchView.vue:L1 | neighbors=[067eeb3 refactor(imports): migrate rela…, 142eba8 Merge pull request #1 from pape…, 1a36693 perf(fontawesome): tree-shake t…, 23e569a Merge pull request #14 from pap…, 48c5336 fix: agregar globals MouseEvent…, 4fa3438 feat(dashboard): add tabbed int…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@124ec253cf594f7663308a92a344f55040a3f79d": "124ec25 feat(auth): implement Supabase auth with dual localStorage/Supabase sup…" | kind=Commit | source=git | neighbors=[backend, dev, 4fa3438 feat(dashboard): add tabbed int…, AppFooter.vue, AppHeader.vue, useAddFood.spec.ts] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@9f4976a0fa7b78d94d19f8ce707879c2b6e14588": "9f4976a feat: add AI nutrition analyzer with Groq/Cerebras integration" | kind=Commit | source=git | neighbors=[65b65c9 merge, analyze-meal.ts, backend, dev, master, recetas] | lang=en
- "nutrition_mealanalyzerform": "MealAnalyzerForm.vue" | kind=code-symbol | source=src/components/nutrition/MealAnalyzerForm.vue:L1 | neighbors=[1348d1f Merge pull request #11 from pap…, 1a36693 perf(fontawesome): tree-shake t…, 1fa2c27 fix(ui): responsive form - full…, 23e569a Merge pull request #14 from pap…, 27955a0 Merge pull request #12 from pap…, 4fa3438 feat(dashboard): add tabbed int…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@142eba8eb883642a93dc05c3e37a9f916a87b15e": "142eba8 Merge pull request #1 from papercri/refactorizar" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, ed984be skills] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@8d66207cb86f8bb656cd0d20bf8e6fcb01222c2c": "8d66207 Merge pull request #15 from papercri/stage" | kind=Commit | source=git | neighbors=[23e569a Merge pull request #14 from pap…, 80e4198 feat(analyzer): add allergen de…, analyze-meal.ts, generate-recipe.ts, master, stage] | lang=en
- "utils_constants": "constants.ts" | kind=code-symbol | source=src/utils/constants.ts:L1 | neighbors=[1188f4d feat(recipes): add AI recipe ge…, 142eba8 Merge pull request #1 from pape…, 1a36693 perf(fontawesome): tree-shake t…, 23e569a Merge pull request #14 from pap…, 410e39e refactor: extraer funciones pur…, 8d66207 Merge pull request #15 from pap…] | lang=en
- "api_generate_recipe": "generate-recipe.ts" | kind=code-symbol | source=api/generate-recipe.ts:L1 | neighbors=[buildSystemPrompt(), buildUserMessage(), handler(), parseProviderResponse(), ProviderResult, RecipeOutcome] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@0c1f8872dd122513d1c69eba3fc47d0f59244e86": "0c1f887 Merge pull request #3 from papercri/tests" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, 45ea2bd Merge pull request #4 from pape…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@1348d1fe52cbe87f066e5a153930f80cae81be81": "1348d1f Merge pull request #11 from papercri/stage" | kind=Commit | source=git | neighbors=[analyze-meal.ts, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@e1e8d64173450f4a577d5ba309459764d21c7a0f": "e1e8d64 Merge branch 'stage'" | kind=Commit | source=git | neighbors=[7af59dd feat(dashboard): add confirmati…, ca9bbdf Merge pull request #9 from pape…, analyze-meal.ts, backend, dev, master] | lang=en
- "stores_userstore": "userStore.ts" | kind=code-symbol | source=src/stores/userStore.ts:L1 | neighbors=[067eeb3 refactor(imports): migrate rela…, 124ec25 feat(auth): implement Supabase …, 23e569a Merge pull request #14 from pap…, 27955a0 Merge pull request #12 from pap…, 3a3bb2c feat(ui): saved cards with alle…, 443eb59 feat(profile): add tabbed inter…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@1188f4ddb30b36dbde5f08c09f3d644c8a7b9959": "1188f4d feat(recipes): add AI recipe generator page at /recetas" | kind=Commit | source=git | neighbors=[generate-recipe.ts, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@3a3bb2c505f6b13d3cabcdde603c086b234dc933": "3a3bb2c feat(ui): saved cards with allergen/veggie badges, card-elevated btn-sl…" | kind=Commit | source=git | neighbors=[generate-recipe.ts, dev, useAuth.ts, App.vue, foodStore.ts, savedPlatesStore.ts] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@7af59ddc56ccc58e84f0c9db6d9459acb5e9984c": "7af59dd feat(dashboard): add confirmation modals, toast, responsive buttons lay…" | kind=Commit | source=git | neighbors=[0f5f71c fix: layout in index, analyze-meal.ts, backend, dev, master, recetas] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@b47c8009201b14407d1864ff76502d58cd19fd87": "b47c800 feat(profile): footer sticky, peso deseado, tiempo estimado, mejoras UI" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, 172cbb2 vercel fix] | lang=en
- "router_index": "index.ts" | kind=code-symbol | source=src/router/index.ts:L1 | neighbors=[1188f4d feat(recipes): add AI recipe ge…, 124ec25 feat(auth): implement Supabase …, 1475d2d feat: remove tips feature and u…, 77d9ae4 Merge pull request #6 from pape…, 7bd04f5 Merge pull request #8 from pape…, 81209a9 first commit] | lang=en
- "src_app": "App.vue" | kind=code-symbol | source=src/App.vue:L1 | neighbors=[067eeb3 refactor(imports): migrate rela…, 124ec25 feat(auth): implement Supabase …, 23e569a Merge pull request #14 from pap…, 27955a0 Merge pull request #12 from pap…, 2a063da style: reemplazar DM Serif Disp…, 3a3bb2c feat(ui): saved cards with alle…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@66a6c2cb67a56f8fd73b7f35555710fc0b805395": "66a6c2c feat(ui): compact dashboard redesign with foldable meals and profile fi…" | kind=Commit | source=git | neighbors=[1475d2d feat: remove tips feature and u…, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@88b4be11369afb0b333868189fb4de3f70ca9bee": "88b4be1 feat: mejorar UI/UX con responsive, hamburger menu, FA icons y CSS opti…" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, c213fec style: restyling completo con p…] | lang=es
- "commit:repo:github.com/papercri/diario-nutricional@a92d168da01bb3a058afcbe113f7bb85943c96a3": "a92d168 fix: error handling" | kind=Commit | source=git | neighbors=[04ca00f removed confidence, analyze-meal.ts, backend, dev, master, recetas] | lang=pt
- "commit:repo:github.com/papercri/diario-nutricional@b864cea5a25d23a30f5b2bfc47f3a89f59345aad": "b864cea refactor(imports): complete @/ alias migration across utils, services a…" | kind=Commit | source=git | neighbors=[067eeb3 refactor(imports): migrate rela…, backend, dev, master, recetas, stage] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cristianasollini/Documents/WORK/GIT/Avocato/.graphify/description-instructions/batch-000.json

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
