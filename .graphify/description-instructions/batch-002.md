# Node Description Batch 3 of 11

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

- "commit:repo:github.com/papercri/diario-nutricional@48c53368ee1640d98c78d8fc63277a9b662ecd2c": "48c5336 fix: agregar globals MouseEvent/Event a ESLint y eliminar import no usa…" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, 142eba8 Merge pull request #1 from pape…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@7bd04f5205b10f9605c55c002519398f300ca555": "7bd04f5 Merge pull request #8 from papercri/stage" | kind=Commit | source=git | neighbors=[05af8c0 readme, 1475d2d feat: remove tips feature and u…, backend, dev, master, recetas] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@ead75b423d94df767afa37fcb35e369428d457d1": "ead75b4 refactor(design-system): replace hardcoded colors with design tokens" | kind=Commit | source=git | neighbors=[49d8070 feat(design-system): add Nutri-…, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@ed984beff96c9e0402c242f5413201c7d4fcb634": "ed984be skills" | kind=Commit | source=git | neighbors=[142eba8 Merge pull request #1 from pape…, 334e89a text correction, backend, dev, master, recetas] | lang=en
- "services_openfoodfacts_spec": "openFoodFacts.spec.ts" | kind=code-symbol | source=src/services/openFoodFacts.spec.ts:L1 | neighbors=[23e569a Merge pull request #14 from pap…, e1726ab test: add unit tests for stores…, openFoodFacts.ts, getProductByBarcode(), OpenFoodFactsError, searchFood()] | lang=en
- "utils_nutrition_spec": "nutrition.spec.ts" | kind=code-symbol | source=src/utils/nutrition.spec.ts:L1 | neighbors=[0c1f887 Merge pull request #3 from pape…, 23e569a Merge pull request #14 from pap…, b864cea refactor(imports): complete @/ …, f62afa5 test: add Vitest config and uni…, nutrition.ts, calcPercentage()] | lang=en
- "views_authview": "AuthView.vue" | kind=code-symbol | source=src/views/AuthView.vue:L1 | neighbors=[124ec25 feat(auth): implement Supabase …, 1df5892 fix(ui): replace custom add-to-…, 443eb59 feat(profile): add tabbed inter…, 4fa3438 feat(dashboard): add tabbed int…, 9d26981 fix(auth): fix template parsing…, index.ts] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@05af8c0f6bb6d8b966cb4a0a5ee152cf633f5f20": "05af8c0 readme" | kind=Commit | source=git | neighbors=[analyze-meal.ts, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@0f5f71c9448844b01834e978104fb400f56e25f3": "0f5f71c fix: layout in index" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, 7af59dd feat(dashboard): add confirmati…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@1fd6bcaba7c27159da411d8037f427668634a3df": "1fd6bca fix(dashboard): increase meal section spacing and add default utensils …" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, 23e569a Merge pull request #14 from pap…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@68853a4c1e2409b343a05b675e8d206247a8e68e": "68853a4 style(search): use nutri-*.png images, restyle modal layout" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, e758807 style(search): bigger nutri-sco…] | lang=pt
- "commit:repo:github.com/papercri/diario-nutricional@91f6a7d8c21395afa021260315067ec1a416a570": "91f6a7d refactor: usar funciones puras de nutrition.ts en CalorieRing y Nutrien…" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, 4acd6d2 refactor: simplificar Dashboard…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@97e205503879bda19d9bf468c89d40f69039e78e": "97e2055 style(search): sliding hover on card buttons, restore centered modal" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, 9885d7b style(food-card): nutri-score o…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@b09eba18c631dce49bce89596ba41a3b15cd423a": "b09eba1 refactor: crear composables para lógica reactiva" | kind=Commit | source=git | neighbors=[410e39e refactor: extraer funciones pur…, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@dc0f85569d7b7d56871e87e0162f6d4f07e561aa": "dc0f855 style: correcciones menores de formato y spacing" | kind=Commit | source=git | neighbors=[927c3a5 docs: actualizar README con ref…, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@e758807fbcac20d24fdfb8b090228499054cf437": "e758807 style(search): bigger nutri-score badges, eye button with mustard bg, s…" | kind=Commit | source=git | neighbors=[68853a4 style(search): use nutri-*.png …, backend, dev, master, recetas, stage] | lang=en
- "utils_nutrition": "nutrition.ts" | kind=code-symbol | source=src/utils/nutrition.ts:L1 | neighbors=[142eba8 Merge pull request #1 from pape…, 23e569a Merge pull request #14 from pap…, 410e39e refactor: extraer funciones pur…, b864cea refactor(imports): complete @/ …, calcPercentage(), calcRemaining()] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@172cbb25ca469920ecc4fcc626e370177a5bc22e": "172cbb2 vercel fix" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, 49d8070 feat(design-system): add Nutri-…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@1fa2c272522d4b0fa3b080040106c8c8e6a3f172": "1fa2c27 fix(ui): responsive form - full-width button on mobile, inline on deskt…" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, c89c8b0 fix(ui): responsive form - stac…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@261e591b5c73f6d0d7b6489a1a302123f8d5fb85": "261e591 style(food-card): badge top-aligned, button hover expands via pseudo-el…" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, 947510f fix(food-card): button hover ex…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@2a063dacb25642dcb53eb9c648f13afa64a3206e": "2a063da style: reemplazar DM Serif Display por DM Sans (sans-serif con carácter)" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, b09ff10 Styles: restyling completo] | lang=pt
- "commit:repo:github.com/papercri/diario-nutricional@31ad743fd4d795ceefb7f5148d276eb3d8001ead": "31ad743 style(food-card): button expands left via ::before, label inside button…" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, ead34ac feat(design-system): implement …] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@334e89a1ea8d71d408d71db0f716947e39fb9992": "334e89a text correction" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, ed984be skills] | lang=pt
- "commit:repo:github.com/papercri/diario-nutricional@39fde09fb195c85248a9a95801d977a3db21ce5c": "39fde09 fix(food-card): simplify hover text with separate span, remove ::before…" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, 3daddfd style(food-card): hover text la…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@3c23ea95400d7c7873b0ef09af4a8a5a36c3de3b": "3c23ea9 Feat: mel analizer IA assisted" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, 77d9ae4 Merge pull request #6 from pape…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@3daddfd574ba0255eb85f2127f9249fee13a364b": "3daddfd style(food-card): hover text label gets same background as button" | kind=Commit | source=git | neighbors=[39fde09 fix(food-card): simplify hover …, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@3f2e940e9b026f1f5df7baf345129fc6721914cb": "3f2e940 a11y(food-detail-modal): add focus trap, restore focus on close, lock b…" | kind=Commit | source=git | neighbors=[1a36693 perf(fontawesome): tree-shake t…, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@45ea2bd2e85d6a63d30fbdc98c451bb517279960": "45ea2bd Merge pull request #4 from papercri/readme" | kind=Commit | source=git | neighbors=[0c1f887 Merge pull request #3 from pape…, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@468c293f23904511fac749cc5322f371bfa8edd3": "468c293 refactor: simplificar ProfileView con constants" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, a73938a refactor: simplificar TipsView …] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@499567caac3ecf93f46e8c613a082b595bdc4f02": "499567c dependences update" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, 04ca00f removed confidence] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@4acd6d2198a8d0831f6a5f73264aa8946f1011f6": "4acd6d2 refactor: simplificar DashboardView con utils y constants" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, 6b758c9 refactor: simplificar SearchVie…] | lang=es
- "commit:repo:github.com/papercri/diario-nutricional@5d6e2549fb58a209533ee6371649982ed2253041": "5d6e254 style(food-card): nutri-score label above badge, smoother hover transit…" | kind=Commit | source=git | neighbors=[3daddfd style(food-card): hover text la…, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@65b65c95d261c9f5415a0ed19db0ae1effd05acb": "65b65c9 merge" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, 77d9ae4 Merge pull request #6 from pape…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@6b758c9058d81f8cdb5d22a3a749ac5763e1679e": "6b758c9 refactor: simplificar SearchView con composables" | kind=Commit | source=git | neighbors=[4acd6d2 refactor: simplificar Dashboard…, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@86a420fe9b9caeaf9e9269c364106516bb2c51bd": "86a420f fix: nueva configuracion de la llamada a la api openfoodfacts" | kind=Commit | source=git | neighbors=[45ea2bd Merge pull request #4 from pape…, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@947510f5b181e23096b7042466b96e515754f99f": "947510f fix(food-card): button hover expands leftward via ::before left property" | kind=Commit | source=git | neighbors=[261e591 style(food-card): badge top-ali…, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@9885d7b6ba6b2d1852376af54e67147ff2a7a35f": "9885d7b style(food-card): nutri-score on right, button text overlays on hover, …" | kind=Commit | source=git | neighbors=[97e2055 style(search): sliding hover on…, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@9cf6adc8ef846aee62d70d40922a35998fbb8bde": "9cf6adc style(food-card): buttons show text on hover only, bigger nutri-score w…" | kind=Commit | source=git | neighbors=[947510f fix(food-card): button hover ex…, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@a29d5ae1cbff8502f72e41646689a99d27c4e9b4": "a29d5ae fix(food-card): center action button icons" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, 2a14b35 style(tokens): darken --clr-tex…] | lang=pt
- "commit:repo:github.com/papercri/diario-nutricional@b09ff109a066a5e403c42e29c4b8b5357dc4776e": "b09ff10 Styles: restyling completo" | kind=Commit | source=git | neighbors=[2a063da style: reemplazar DM Serif Disp…, backend, dev, master, recetas, stage] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cristianasollini/Documents/WORK/GIT/Avocato/.graphify/description-instructions/batch-002.json

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
