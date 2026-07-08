# Southern Edge — Veo Shot Brief (Story Pivot)

Direction: **Garden & Gun meets Ralph Lauren, filtered through Charleston and the Lowcountry.**
The drink is part of the experience, not the center of it.

## Universal grade & casting rules (apply to every shot)

- Golden hour or candlelight. Palette anchored to amber `#D4781A` / cream `#F0E4CC` against near-black shadows — must sit on the site's dark `#080604` background without clashing.
- People: multicultural AND multi-generational — African American, Asian American, Native American, Latino/Caribbean, and white Southerners in the same frame. Candid mid-moment, never looking at camera. **"Not posed diversity. Real connection."**
- Each image should communicate at least three of: culture, connection, sophistication, creativity, hospitality, discovery.
- No logos, no readable text, no recognizable brands in frame.
- Drinks appear in hands/on tables, never as product shots.
- Stills can be Veo frame-grabs: generate an 8s clip, export the best frame at max resolution.

## Shot list

Drop finished files at these exact paths — the site picks them up by filename.

| # | File (under `public/`) | Scene | Format | Crop target |
|---|---|---|---|---|
| 1 | `images/story/story_01_oaks.jpg` | Avenue of live oaks, Spanish moss, golden light raking through the canopy, slight haze. No people needed. | 16:9 still, max res | Displayed 21:9 full-bleed — keep vertical center safe |
| 2 | `images/story/story_02_porch.jpg` | Porch gathering at dusk: multi-generational, multicultural group mid-laugh, drinks in hand, string lights, rocking chairs. | 16:9 still, subject centered | Displayed 4:5 portrait — keep group in center 60% |
| 3 | `images/story/story_03_streets.jpg` | Charleston street at blue hour: gas lamps, pastel facades, two friends walking with to-go cocktails, warm window light. | 16:9 still, subject centered | Displayed 4:5 portrait |
| 4 | `images/story/story_04_table.jpg` | Candlelit long table outdoors, hands raising amber cocktails in a toast, shallow depth of field, faces soft in background. | 16:9 still | Displayed 4:5 portrait |
| 5 | `images/story/story_05_marsh.jpg` | Lowcountry marsh and sweetgrass at sunset, glassy water. Alternate: close-up of hands weaving a sweetgrass basket (respectful Gullah Geechee craft nod). | 16:9 still | Displayed 4:5 portrait |
| 6 | `videos/hero_atmosphere.mp4` | **Variant B hero only.** Slow forward dolly through a southern evening world: under oak canopy toward warm porch/string lights. Dark-graded, moody, no people close-up. | 16:9 video, 8s, seamless loop, ≤3MB target | Used full-screen — keep lower third visually quiet (type sits there) |
| 7 | alternate | Spare porch variation (different angle/group) | 16:9 still | editing latitude |
| 8 | alternate | Spare table/toast variation | 16:9 still | editing latitude |

## Suggested Veo prompt skeleton (shots 2–4)

> Cinematic editorial photograph, golden hour, [SCENE]. A diverse multi-generational group of friends — Black, white, Asian, Latino, young and older — caught candid mid-conversation, genuine laughter, no one looking at camera. Warm amber and cream tones against deep shadow, Ralph Lauren / Garden & Gun magazine aesthetic, shallow depth of field, 35mm film grain, Charleston South Carolina Lowcountry.

## Upgrade path

Every still slot also accepts an ambient video loop later (same scene, subtle motion — flickering candles, swaying moss). Same filename with `.mp4` under `videos/story/`; tell me and I flip one flag per slot, zero layout change.

## Shot 9 — Hero bottle reveal (replaces the 192-frame scroll sequence)

Replaces the current reveal video whose bottle floats and has condensation drips (client: bottle grounded, dry glass, "lighting to illuminate the bottle").

**Tool:** Google Flow (Veo). Workflow: generate the two keyframe images first, then Frames-to-Video.

1. **END frame (image)** — attach `se_reveal_ref_lit.png` as reference, use Prompt A. Verify the label reads correctly; regenerate if garbled.
2. **START frame (image)** — attach the *generated end frame from step 1* (NOT the original reference) and use Prompt B. Reusing the generated frame keeps both keyframes pixel-consistent, which Frames-to-Video needs — inconsistent frames make the bottle morph/drift.
3. **VIDEO** — Frames-to-Video: first frame = step 2 output, last frame = step 1 output, Prompt C.

**Prompt A — end frame (fully lit):**

> Same scene, same bottle, same camera and framing as the attached reference image: a bottle of Southern Edge Fine Spirits Salted Caramel Flavored Whiskey standing upright on a dark subtly-reflective surface, soft natural reflection under its base, pitch-black background. Fully illuminated by a single warm amber overhead spotlight — a visible cone of golden light from above, the amber whiskey glowing from within, warm rim light tracing the glass edges, a gentle pool of light on the surface around the base. The glass is clean and completely dry: no condensation, no droplets, no frost. The label reads exactly "Se — SOUTHERN EDGE — FINE SPIRITS — SALTED CARAMEL FLAVORED WHISKEY". Photorealistic, premium bourbon-bar mood, 16:9.

**Prompt B — start frame (near dark, from the generated end frame):**

> Exactly the same image as the attached reference — same bottle, same position, same camera, same reflection — but before the spotlight turns on: the scene is in near-total darkness. Only a very faint rim of light traces the bottle's silhouette against the pitch-black background; the label is barely visible in shadow; no light cone, no glow, no pool of light on the surface. The glass remains clean and completely dry: no condensation, no droplets, no frost. Photorealistic, 16:9.

**Prompt C — video (Frames-to-Video between the two):**

> Locked-off static camera, absolutely no camera movement. The bottle stands perfectly still on the dark reflective surface for the entire shot — it never moves, rotates, tilts, or floats. The only change is light: a single warm amber overhead spotlight slowly blooms to life above the bottle, its cone of golden light gradually widening and brightening, smoothly carrying the scene from the near-darkness of the first frame to the fully illuminated last frame — the amber liquid beginning to glow from within, warm rim light creeping along the glass edges. The glass stays clean and completely dry throughout: no condensation forming, no droplets, no drips, no frost. One slow, even, continuous light bloom across the full 8 seconds — no flicker, no pulsing, no cuts. Premium bourbon-bar mood, photorealistic.

**Specs (hard requirements):**
- 8 seconds, highest resolution available, 16:9. Delivered as mp4 — I convert to the 192-frame webp sequence.
- Locked-off camera: zero camera movement, zero zoom.
- Bottle framing must match the reference stills: bottle ≈ 78% of frame height, vertically centered at ~47.5% of frame height, horizontally centered. (The site center-crops 16:9 → 4:3, so keep everything important in the middle 4:3 region — nothing meaningful in the outer 160px on each side.)
- Label must read exactly: "Se / SOUTHERN EDGE / FINE SPIRITS / SALTED CARAMEL FLAVORED WHISKEY". Regenerate if Veo garbles it.

**Prompt:**

> Studio product cinematography, locked-off static camera, absolutely no camera movement. A bottle of Southern Edge Fine Spirits Salted Caramel Flavored Whiskey — exactly as in the reference image: black label, metallic "Se" citrus emblem, amber whiskey — standing upright, perfectly still, firmly planted on a dark subtly-reflective surface with a soft natural reflection under its base. Pitch-black background. The scene opens in near-total darkness, only a faint silhouette of the bottle visible. A single warm amber overhead spotlight slowly blooms to life, its cone of golden light widening and intensifying until the bottle is fully, dramatically illuminated — amber liquid glowing from within, warm rim light tracing the glass edges. The glass is clean and completely dry: no condensation, no droplets, no drips, no frost, no moisture. The bottle never moves, rotates, tilts, or floats. Premium bourbon-bar mood, photorealistic, 8 seconds.

**Avoid (paste into negative/notes):** condensation, water droplets, drips, frost, floating, levitation, hovering, camera motion, rotation, zoom, label text morphing, extra props.

**Delivery:** drop the mp4 anywhere in the repo (or send it) and tell me — I run the frame-extraction pipeline and swap `public/images/frames/`.
