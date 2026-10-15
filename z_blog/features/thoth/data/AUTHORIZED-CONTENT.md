# Card meaning source

`authorized-card-meanings.json` contains the English card meaning, keywords,
and elemental dignity text from https://www.crowleythoth.org/tarot/thoth/.
The project owner explicitly confirmed permission to reproduce this content
on 2026-10-15. This statement records the owner's instruction, not independent
verification of a license. Preserve the permission evidence with project records.

This content is separate from the MIT-licensed Thoth Tarot Handbook import.
Do not imply that the reference website's content is licensed under MIT.
Each record retains its source URL. All 78 records were checked for a title,
meaning, well-dignified interpretation, and ill-dignified interpretation.

Images are supplied by the project owner in `public/Thoth_Tarot`, not downloaded
from the reference website. Two supplied files use `King` in their filename
for the Cups and Wands Knights; this correspondence is explicit in
`lib/card-catalog.ts`. Original filenames remain unchanged.

`card-meanings-zh.ts` contains Chinese translations of all 78 card meanings
and both elemental dignity interpretations. Keywords have been translated
and normalized into readable Chinese where the original tags are sentence
fragments. English content remains separately available via the language switch.

The import was corrected to restrict paragraphs to `meaning-block` containers,
so the trailing reading/navigation buttons cannot overwrite the ill-dignified
interpretation. All 78 source and translation records were checked for coverage.
