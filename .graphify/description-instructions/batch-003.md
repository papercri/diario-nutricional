# Node Description Batch 4 of 11

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

- "commit:repo:github.com/papercri/diario-nutricional@b199d6e313ca35359b26d5c2b9a1a00d98579861": "b199d6e style(dashboard): restyle with utility classes and better hierarchy" | kind=Commit | source=git | neighbors=[404580b style(components): enhance Calo…, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@c89c8b0d65c090681f91ba27ab781e2877d8c210": "c89c8b0 fix(ui): responsive form - stacked on mobile, inline on desktop" | kind=Commit | source=git | neighbors=[1fa2c27 fix(ui): responsive form - full…, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@cedc3d8c691f6d22a431660abf284f4436088d9e": "cedc3d8 Add: footer copy and date" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, 89162af feat(ui): compact nutrition lay…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@dd79ab19312a2226a29abdff053af44c533bf3bb": "dd79ab1 docs" | kind=Commit | source=git | neighbors=[1348d1f Merge pull request #11 from pap…, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@e35eeb9c7628f7801d0d99b2c102bc973315164e": "e35eeb9 fix : vitest" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, 0c1f887 Merge pull request #3 from pape…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@ee43c63602b5ded848a76fb48951e7d28da247f0": "ee43c63 fix(food-card): reduce action button icon size from 2rem to 0.875rem" | kind=Commit | source=git | neighbors=[431636a docs(readme): update with FA tr…, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@f074372dbbfacf781b1334121bda46626d1a4238": "f074372 style(header): restyle header with logo badge and improved nav" | kind=Commit | source=git | neighbors=[c6017d6 style(design-system): enhanced …, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@f683ef1b1e2f5b5c22498c427da7a95cd77acb94": "f683ef1 style(food-card): separate columns for nutri-score badge and buttons" | kind=Commit | source=git | neighbors=[9885d7b style(food-card): nutri-score o…, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@fa033e21cb1d149474fc946d59781ab7474eab6d": "fa033e2 fix(composables): use number type for debounce timer" | kind=Commit | source=git | neighbors=[3a88429 vitest, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@fd4d3f447325cb2c48e7f1e06e7c83d7287d1183": "fd4d3f4 fix(ui): center analyze button, remove full-width" | kind=Commit | source=git | neighbors=[89162af feat(ui): compact nutrition lay…, backend, dev, master, recetas, stage] | lang=en
- "composables_usefoodsearch": "useFoodSearch.ts" | kind=code-symbol | source=src/composables/useFoodSearch.ts:L1 | neighbors=[067eeb3 refactor(imports): migrate rela…, 0c1f887 Merge pull request #3 from pape…, 142eba8 Merge pull request #1 from pape…, 23e569a Merge pull request #14 from pap…, b09eba1 refactor: crear composables par…, fa033e2 fix(composables): use number ty…] | lang=en
- "nutrition_ingredientbreakdown": "IngredientBreakdown.vue" | kind=code-symbol | source=src/components/nutrition/IngredientBreakdown.vue:L1 | neighbors=[1a36693 perf(fontawesome): tree-shake t…, 23e569a Merge pull request #14 from pap…, 4dc83ed style: increase font-size 0.625…, 4fa3438 feat(dashboard): add tabbed int…, 77d9ae4 Merge pull request #6 from pape…, 89162af feat(ui): compact nutrition lay…] | lang=en
- "nutrition_macrodistribution": "MacroDistribution.vue" | kind=code-symbol | source=src/components/nutrition/MacroDistribution.vue:L1 | neighbors=[1a36693 perf(fontawesome): tree-shake t…, 23e569a Merge pull request #14 from pap…, 4dc83ed style: increase font-size 0.625…, 4fa3438 feat(dashboard): add tabbed int…, 77d9ae4 Merge pull request #6 from pape…, 89162af feat(ui): compact nutrition lay…] | lang=en
- "server_dev": "server-dev.ts" | kind=code-symbol | source=server-dev.ts:L1 | neighbors=[1188f4d feat(recipes): add AI recipe ge…, 77d9ae4 Merge pull request #6 from pape…, 8d66207 Merge pull request #15 from pap…, f2604c4 fix(api): resolve local dev 404…, API_ROUTES, __dirname] | lang=en
- "src_main": "main.ts" | kind=code-symbol | source=src/main.ts:L1 | neighbors=[1a36693 perf(fontawesome): tree-shake t…, 23e569a Merge pull request #14 from pap…, 81209a9 first commit, 88b4be1 feat: mejorar UI/UX con respons…, index.ts, App.vue] | lang=en
- "stores_foodstore_spec": "foodStore.spec.ts" | kind=code-symbol | source=src/stores/foodStore.spec.ts:L1 | neighbors=[124ec25 feat(auth): implement Supabase …, 1a36693 perf(fontawesome): tree-shake t…, 23e569a Merge pull request #14 from pap…, e1726ab test: add unit tests for stores…, foodStore.ts, makeFood()] | lang=en
- "stores_savedplatesstore": "savedPlatesStore.ts" | kind=code-symbol | source=src/stores/savedPlatesStore.ts:L1 | neighbors=[3a3bb2c feat(ui): saved cards with alle…, 443eb59 feat(profile): add tabbed inter…, 4fa3438 feat(dashboard): add tabbed int…, 70b8f69 feat(profile): tabbed interface…, loadLocal(), SavedPlate] | lang=en
- "ui_toast": "Toast.vue" | kind=code-symbol | source=src/components/ui/Toast.vue:L1 | neighbors=[067eeb3 refactor(imports): migrate rela…, 1a36693 perf(fontawesome): tree-shake t…, 23e569a Merge pull request #14 from pap…, 3a3bb2c feat(ui): saved cards with alle…, 7af59dd feat(dashboard): add confirmati…, e1e8d64 Merge branch 'stage'] | lang=en
- "utils_bmiclassification": "bmiClassification.ts" | kind=code-symbol | source=src/utils/bmiClassification.ts:L1 | neighbors=[23e569a Merge pull request #14 from pap…, 9348c2e feat: add BMI calculator with l…, b67ae0c Merge branch 'master' of https:…, b864cea refactor(imports): complete @/ …, d0c2bb7 Merge pull request #7 from pape…, classifyBMI()] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@2a14b35f666728dba70e9466b5fa73d4fee3b5a1": "2a14b35 style(tokens): darken --clr-text-faint from #66605b to #504b47" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, 4dc83ed style: increase font-size 0.625…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@361dc46b85f40393a6955c4d234b7bdc873897cc": "361dc46 restart" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, fd58c5d rama] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@431636a7c2fcfc0a8182eea0164e4995f74a5c0e": "431636a docs(readme): update with FA tree-shaking, 107 tests, shared DS classes…" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, ee43c63 fix(food-card): reduce action b…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@49d80701d78c09da84b68f30c5293ed3f39c4909": "49d8070 feat(design-system): add Nutri-Score, nutrient, and BMI gauge tokens" | kind=Commit | source=git | neighbors=[172cbb2 vercel fix, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@5e9f8a0a930171641a33c20690057c0294181011": "5e9f8a0 docs(log): update changelog with all work done on 2026-07-20" | kind=Commit | source=git | neighbors=[1fd6bca fix(dashboard): increase meal s…, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@65fda0d972923718033e869c09ea52a473678c7f": "65fda0d docs(readme): fix Groq model mismatch (gpt-oss-120b, not llama-3.3-70b-…" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, e1726ab test: add unit tests for stores…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@70b8f6986ef0f5f9a01c067dd5ab8d007c3284c7": "70b8f69 feat(profile): tabbed interface with favorites, delete buttons, and aut…" | kind=Commit | source=git | neighbors=[443eb59 feat(profile): add tabbed inter…, backend, dev, 3a3bb2c feat(ui): saved cards with alle…, savedPlatesStore.ts, NutritionAnalyzerView.vue] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@72c4ab0d9d111a4f15e47d158dcb3ff851c96e4f": "72c4ab0 readme" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, b67ae0c Merge branch 'master' of https:…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@90eb456ca3bbda7d4b4a6fb79ba130fbaf42eb0e": "90eb456 docs: add Vercel live deploy link and update test notes" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, 45ea2bd Merge pull request #4 from pape…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@927c3a5ac53abac2be123e0672dc9b996d960c33": "927c3a5 docs: actualizar README con refactor de componentes y design system" | kind=Commit | source=git | neighbors=[48c5336 fix: agregar globals MouseEvent…, backend, dev, master, recetas, stage] | lang=es
- "commit:repo:github.com/papercri/diario-nutricional@9666541d932d61a4e7111ecb2dfb49915ffe861f": "9666541 added readme" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, 88b4be1 feat: mejorar UI/UX con respons…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@9bd333bdb11198cd828cd8d8bf8cf9fc8d0a833f": "9bd333b refactor: crear componentes base del design system" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, 91f6a7d refactor: usar funciones puras …] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@a73938a800030c6edd80be711715576d9d68a0ff": "a73938a refactor: simplificar TipsView con composable useTip" | kind=Commit | source=git | neighbors=[468c293 refactor: simplificar ProfileVi…, backend, dev, master, recetas, stage] | lang=pt
- "commit:repo:github.com/papercri/diario-nutricional@b212b84a2f61f803be73a49bf653d4f2046121d4": "b212b84 design system ready" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, 65b65c9 merge] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@c6017d61af7f2e9f169934c4cfd4d8e79a12a67c": "c6017d6 style(design-system): enhanced tokens, typography utilities, layout hel…" | kind=Commit | source=git | neighbors=[backend, dev, master, recetas, stage, f074372 style(header): restyle header w…] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@d2974962edb3bca9d767657130d0cf40aabd1410": "d297496 Feature: Bmi Calculator" | kind=Commit | source=git | neighbors=[9348c2e feat: add BMI calculator with l…, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@f0b971a67ec07e96f9cdbd1e5e8348b8309eafd8": "f0b971a readme" | kind=Commit | source=git | neighbors=[66a6c2c feat(ui): compact dashboard red…, backend, dev, master, recetas, stage] | lang=pt
- "commit:repo:github.com/papercri/diario-nutricional@f7c68c13f0f3a11bab35f3bb022bbc1810cae548": "f7c68c1 styles" | kind=Commit | source=git | neighbors=[b199d6e style(dashboard): restyle with …, backend, dev, master, recetas, stage] | lang=en
- "commit:repo:github.com/papercri/diario-nutricional@fd58c5dc973fa444097ce6233d13622204859d87": "fd58c5d rama" | kind=Commit | source=git | neighbors=[361dc46 restart, backend, dev, master, recetas, stage] | lang=en
- "composables_usefoodsearch_spec": "useFoodSearch.spec.ts" | kind=code-symbol | source=src/composables/useFoodSearch.spec.ts:L1 | neighbors=[23e569a Merge pull request #14 from pap…, 4fa3438 feat(dashboard): add tabbed int…, e1726ab test: add unit tests for stores…, useFoodSearch.ts, makeFood(), mockSearchFood] | lang=en
- "nutrition_nutritiontips": "NutritionTips.vue" | kind=code-symbol | source=src/components/nutrition/NutritionTips.vue:L1 | neighbors=[1a36693 perf(fontawesome): tree-shake t…, 23e569a Merge pull request #14 from pap…, 4fa3438 feat(dashboard): add tabbed int…, 77d9ae4 Merge pull request #6 from pape…, 89162af feat(ui): compact nutrition lay…, 9f4976a feat: add AI nutrition analyzer…] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cristianasollini/Documents/WORK/GIT/Avocato/.graphify/description-instructions/batch-003.json

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
