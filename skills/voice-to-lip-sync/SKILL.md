---
name: voice-to-lip-sync
description: Generate a voice take (ElevenLabs or similar) and lip-sync it to an existing video clip of a character speaking. Use for talking-head shots where the visual is already generated.
---

# Voice → Lip-Sync Pipeline

Generates a voice line and conforms an existing silent character clip to it.

## When to use

- Talking-head or dialogue shots where you have a generated character clip but no audio.
- Voice-cloning a specific speaker for narration with on-screen presence.

## Inputs

- The line to be spoken (from `scripts/final/script.md` or the shot brief).
- A character clip in `clips/raw/` or `generation/image-to-video/`.
- Voice selection from `brief/tools-and-models.md`. If a voice clone is in use, source audio lives at `assets/voice-clones/<name>.wav`.

## Steps

1. **Confirm the line.** Read it back to the user with character + tone.
2. **Generate voice take.** Call the configured voice model (ElevenLabs, etc.). For voice clones, pass the clone source from `assets/voice-clones/`. Save to `generation/voice/NN-shortname-vN.wav`. Save script + model + voice ID to `generation/prompts/NN-shortname-vN-voice.md`. Log it.
3. **Iterate.** Play it back (or describe what was generated). Offer to retry with adjusted prosody/emotion settings.
4. **Lip-sync.** Pass the approved voice + character clip into the configured lip-sync model. Save to `generation/lip-sync/NN-shortname-vN.mp4`. Log it.
5. **Verify sync quality.** Surface the result. Lip-sync models often need iteration on which face region to lock to or whether the source clip's mouth is occluded.
6. **Accept.** Copy to `clips/raw/` and suggest `/promote-take`.

## Common gotchas

- **Source clip face visibility.** Lip-sync needs a clear, mostly-frontal mouth. If the character clip cuts away or shows them in profile, the sync will be poor — prefer regenerating the visual with a more frontal angle.
- **Voice take duration vs clip duration.** Voice takes usually need to be slightly shorter than the clip to leave room for natural pauses. If the line is too long, either shorten the script or regenerate the visual longer.
- **Audio sample rate.** Lip-sync models often expect 16kHz or 24kHz mono. Convert with ffmpeg if the voice model outputs 44.1kHz stereo.
