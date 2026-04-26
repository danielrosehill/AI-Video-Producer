---
description: Add a recurring character or subject with appearance and voice notes. Saves to characters/.
---

Capture a character/subject sheet that downstream generation steps can reference for visual and vocal consistency.

Ask the user (in batches, conversationally):

1. **Name / handle** — short identifier, used as filename: `characters/<name>.md`.
2. **Role in the video** — protagonist, narrator, background, product, etc.
3. **Visual description** — age, build, clothing, distinguishing features, lighting style. Detailed enough to seed a text-to-image prompt.
4. **Reference images** — paths under `assets/reference-images/` if any exist; offer to copy files in.
5. **Voice** — gender, age, accent, tone. If a voice clone will be used, note the source audio path under `assets/voice-clones/`.
6. **Per-shot variations** — outfit changes, age progression, expressions to anticipate.
7. **A reusable seed prompt** — a paragraph that can be pasted into image/video generation to recreate the character consistently.

Write `characters/<name>.md` with sections: Role, Appearance, Reference Images, Voice, Variations, **Seed Prompt** (in a code block for easy copy-paste).

If multiple characters are needed, offer to loop and define the next.
