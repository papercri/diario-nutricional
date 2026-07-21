# Node Description Batch 5 of 11

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
Write every description in English (en). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "commit:repo:github.com/papercri/diario-nutricional@cf11e04e1f649ddf0863cf7a5a61295fe49f9ce0": "cf11e04 docs(readme): add recipe generator section and update project structure" | kind=Commit | source=git | neighbors=[1188f4d feat(recipes): add AI recipe ge…, backend, dev, master, stage, 80e4198 feat(analyzer): add allergen de…]
- "composables_useaddfood": "useAddFood.ts" | kind=code-symbol | source=src/composables/useAddFood.ts:L1 | neighbors=[067eeb3 refactor(imports): migrate rela…, 142eba8 Merge pull request #1 from pape…, 23e569a Merge pull request #14 from pap…, b09eba1 refactor: crear composables par…, useAddFood(), useAddFood.spec.ts]
- "stores_userstore_spec": "userStore.spec.ts" | kind=code-symbol | source=src/stores/userStore.spec.ts:L1 | neighbors=[124ec25 feat(auth): implement Supabase …, 23e569a Merge pull request #14 from pap…, e1726ab test: add unit tests for stores…, userStore.ts, mockStorage, useUserStore]
- "utils_bmi": "bmi.ts" | kind=code-symbol | source=src/utils/bmi.ts:L1 | neighbors=[9348c2e feat: add BMI calculator with l…, b67ae0c Merge branch 'master' of https:…, d0c2bb7 Merge pull request #7 from pape…, calculateBMI(), calculateIdealWeight(), bmi.spec.ts]
- "utils_bmi_spec": "bmi.spec.ts" | kind=code-symbol | source=src/utils/bmi.spec.ts:L1 | neighbors=[9348c2e feat: add BMI calculator with l…, b67ae0c Merge branch 'master' of https:…, d0c2bb7 Merge pull request #7 from pape…, bmi.ts, calculateBMI(), calculateIdealWeight()]
- "utils_bmiclassification_spec": "bmiClassification.spec.ts" | kind=code-symbol | source=src/utils/bmiClassification.spec.ts:L1 | neighbors=[9348c2e feat: add BMI calculator with l…, b67ae0c Merge branch 'master' of https:…, d0c2bb7 Merge pull request #7 from pape…, bmiClassification.ts, classifyBMI(), getBmiBadgeVariant()]
- "vite_config": "vite.config.ts" | kind=code-symbol | source=vite.config.ts:L1 | neighbors=[0c1f887 Merge pull request #3 from pape…, 77d9ae4 Merge pull request #6 from pape…, 81209a9 first commit, e35eeb9 fix : vitest, f2604c4 fix(api): resolve local dev 404…, f62afa5 test: add Vitest config and uni…]
- "api_generate_recipe_handler": "handler()" | kind=code-symbol | source=api/generate-recipe.ts:L185 | neighbors=[generate-recipe.ts, buildSystemPrompt(), buildUserMessage(), parseProviderResponse(), respondWithOutcome()]
- "commit:repo:github.com/papercri/diario-nutricional@1df58920b50ebdf22cc7baa1da3bba90e1a3bb28": "1df5892 fix(ui): replace custom add-to-daily modal with Modal component for con…" | kind=Commit | source=git | neighbors=[backend, dev, 443eb59 feat(profile): add tabbed inter…, NutritionAnalyzerView.vue, 9d26981 fix(auth): fix template parsing…]
- "commit:repo:github.com/papercri/diario-nutricional@9704b4a8f0c7e0e36b2dd09254996ed482edc642": "9704b4a Merge pull request #13 from papercri/stage" | kind=Commit | source=git | neighbors=[172cbb2 vercel fix, 27955a0 Merge pull request #12 from pap…, master, stage, 23e569a Merge pull request #14 from pap…]
- "composables_usetoast": "useToast.ts" | kind=code-symbol | source=src/composables/useToast.ts:L1 | neighbors=[7af59dd feat(dashboard): add confirmati…, e1e8d64 Merge branch 'stage', ToastMessage, toasts, useToast()]
- "hooks_index": "index.ts" | kind=code-symbol | source=src/hooks/index.ts:L1 | neighbors=[ead34ac feat(design-system): implement …, useDebounce.ts, useDebounce(), useModal.ts, useModal()]
- "services_recipeai": "recipeAI.ts" | kind=code-symbol | source=src/services/recipeAI.ts:L1 | neighbors=[1188f4d feat(recipes): add AI recipe ge…, 8d66207 Merge pull request #15 from pap…, generateRecipe(), RecipeAIError, RecipeRequestConfig]
- "types_calculator": "calculator.ts" | kind=code-symbol | source=src/types/calculator.ts:L1 | neighbors=[9348c2e feat: add BMI calculator with l…, b67ae0c Merge branch 'master' of https:…, d0c2bb7 Merge pull request #7 from pape…, BmiResult, IdealWeightResult]
- "utils_formatting": "formatting.ts" | kind=code-symbol | source=src/utils/formatting.ts:L1 | neighbors=[142eba8 Merge pull request #1 from pape…, 410e39e refactor: extraer funciones pur…, formatCalorieEntry(), formatDateEs(), formatting.spec.ts]
- "utils_formatting_spec": "formatting.spec.ts" | kind=code-symbol | source=src/utils/formatting.spec.ts:L1 | neighbors=[0c1f887 Merge pull request #3 from pape…, f62afa5 test: add Vitest config and uni…, formatting.ts, formatCalorieEntry(), formatDateEs()]
- "api_analyze_meal_enrichanalysis": "enrichAnalysis()" | kind=code-symbol | source=api/analyze-meal.ts:L184 | neighbors=[analyze-meal.ts, detectAllergens(), inferDietaryFlags(), parseProviderResponse()]
- "api_generate_recipe_parseproviderresponse": "parseProviderResponse()" | kind=code-symbol | source=api/generate-recipe.ts:L139 | neighbors=[generate-recipe.ts, handler(), stripMarkdownCodeBlocks(), validateRecipe()]
- "commit:repo:github.com/papercri/diario-nutricional@9d269819a3b705fa280bc632be2d3641c60d1a85": "9d26981 fix(auth): fix template parsing error in AuthView click handler" | kind=Commit | source=git | neighbors=[4fa3438 feat(dashboard): add tabbed int…, backend, dev, 1df5892 fix(ui): replace custom add-to-…]
- "providers_cerebras_callcerebras": "callCerebras()" | kind=code-symbol | source=api/providers/cerebras.ts:L23 | neighbors=[analyze-meal.ts, generate-recipe.ts, cerebras.ts, CerebrasError]
- "providers_groq_callgroq": "callGroq()" | kind=code-symbol | source=api/providers/groq.ts:L23 | neighbors=[analyze-meal.ts, generate-recipe.ts, groq.ts, GroqError]
- "services_openfoodfacts_fetchjson": "fetchJson()" | kind=code-symbol | source=src/services/openFoodFacts.ts:L34 | neighbors=[openFoodFacts.ts, OpenFoodFactsError, getProductByBarcode(), searchFood()]
- "services_openfoodfacts_getproductbybarcode": "getProductByBarcode()" | kind=code-symbol | source=src/services/openFoodFacts.ts:L117 | neighbors=[openFoodFacts.ts, fetchJson(), toFoodItem(), openFoodFacts.spec.ts]
- "services_openfoodfacts_openfoodfactserror": "OpenFoodFactsError" | kind=code-symbol | source=src/services/openFoodFacts.ts:L25 | neighbors=[openFoodFacts.ts, fetchJson(), .constructor(), openFoodFacts.spec.ts]
- "ui_button": "Button.vue" | kind=code-symbol | source=src/components/ui/Button.vue:L1 | neighbors=[1a36693 perf(fontawesome): tree-shake t…, 23e569a Merge pull request #14 from pap…, 4fa3438 feat(dashboard): add tabbed int…, ead34ac feat(design-system): implement …]
- "ui_modal": "Modal.vue" | kind=code-symbol | source=src/components/ui/Modal.vue:L1 | neighbors=[3a3bb2c feat(ui): saved cards with alle…, ead34ac feat(design-system): implement …, onBackdropClick(), onKeydown()]
- "utils_mifflinstjeor_calculatecaloriegoals": "calculateCalorieGoals()" | kind=code-symbol | source=src/utils/mifflinStJeor.ts:L33 | neighbors=[mifflinStJeor.ts, calculateBMR(), calculateTDEE(), mifflinStJeor.spec.ts]
- "api_analyze_meal_handler": "handler()" | kind=code-symbol | source=api/analyze-meal.ts:L284 | neighbors=[analyze-meal.ts, parseProviderResponse(), respondWithOutcome()]
- "commit:repo:github.com/papercri/diario-nutricional@29fec84bfa6236dbecc7aae90819870622423624": "29fec84 chore: include generate-recipe.ts changes" | kind=Commit | source=git | neighbors=[generate-recipe.ts, dev, 3a3bb2c feat(ui): saved cards with alle…]
- "design_system_index": "index.ts" | kind=code-symbol | source=src/design-system/index.ts:L1 | neighbors=[23e569a Merge pull request #14 from pap…, b864cea refactor(imports): complete @/ …, ead34ac feat(design-system): implement …]
- "hooks_usedebounce": "useDebounce.ts" | kind=code-symbol | source=src/hooks/useDebounce.ts:L1 | neighbors=[ead34ac feat(design-system): implement …, index.ts, useDebounce()]
- "hooks_usemodal": "useModal.ts" | kind=code-symbol | source=src/hooks/useModal.ts:L1 | neighbors=[ead34ac feat(design-system): implement …, index.ts, useModal()]
- "nutrition_allergeninfocard": "AllergenInfoCard.vue" | kind=code-symbol | source=src/components/nutrition/AllergenInfoCard.vue:L1 | neighbors=[4fa3438 feat(dashboard): add tabbed int…, 80e4198 feat(analyzer): add allergen de…, 8d66207 Merge pull request #15 from pap…]
- "providers_cerebras_cerebraserror": "CerebrasError" | kind=code-symbol | source=api/providers/cerebras.ts:L16 | neighbors=[cerebras.ts, callCerebras(), .constructor()]
- "providers_groq_groqerror": "GroqError" | kind=code-symbol | source=api/providers/groq.ts:L16 | neighbors=[groq.ts, callGroq(), .constructor()]
- "services_nutritionai_nutritionaierror": "NutritionAIError" | kind=code-symbol | source=src/services/nutritionAI.ts:L3 | neighbors=[nutritionAI.ts, analyzeMeal(), .constructor()]
- "services_openfoodfacts_searchfood": "searchFood()" | kind=code-symbol | source=src/services/openFoodFacts.ts:L88 | neighbors=[openFoodFacts.ts, fetchJson(), openFoodFacts.spec.ts]
- "services_recipeai_recipeaierror": "RecipeAIError" | kind=code-symbol | source=src/services/recipeAI.ts:L5 | neighbors=[recipeAI.ts, generateRecipe(), .constructor()]
- "ui_badge": "Badge.vue" | kind=code-symbol | source=src/components/ui/Badge.vue:L1 | neighbors=[23e569a Merge pull request #14 from pap…, 4dc83ed style: increase font-size 0.625…, ead34ac feat(design-system): implement …]
- "ui_input": "Input.vue" | kind=code-symbol | source=src/components/ui/Input.vue:L1 | neighbors=[27955a0 Merge pull request #12 from pap…, b47c800 feat(profile): footer sticky, p…, ead34ac feat(design-system): implement …]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cristianasollini/Documents/WORK/GIT/Avocato/.graphify/description-instructions/batch-004.json

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
