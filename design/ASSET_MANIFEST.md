# VODS MEME Asset Manifest

Source board: [`asset-board.png`](./asset-board.png). It is a design reference only and is not served by the application.

The board's lettering and illustration are preserved as tightly cropped PNGs. PNG is intentional for the source crops because it keeps small poster type and paper edges sharp. Components use `next/image`, so the runtime can optimize delivery for supported browsers. No extra image-conversion dependency was added for this prototype.

| File or component | Source | Used in | Status |
| --- | --- | --- | --- |
| `public/assets/brand/logo-stacked.png` | Board: logo set | Reference asset only; code wordmark remains sharper at small sizes | Temporary |
| `public/assets/portal/shrine-background.png` | User-supplied dark shrine scene | Portal background | Production-ready for prototype |
| `public/audio/portal-theme.mp3` | User-supplied audio | Portal-only background music | Production-ready for prototype |
| `public/assets/units/cook-cooked.png` | Board: unit poster covers | Learn Path and COOK completion | Production-ready for prototype |
| `public/assets/units/lock-in.png` | Board: unit poster covers | Learn Path and LOCK IN completion | Production-ready for prototype |
| `public/assets/units/crash-out.png` | Board: unit poster covers | Learn Path and CRASH OUT completion | Production-ready for prototype |
| `public/assets/units/ate.png` | Board: unit poster covers | Learn Path and ATE completion | Production-ready for prototype |
| `public/assets/units/aint-no-way.png` | Board: unit poster covers | Learn Path and AIN'T NO WAY completion | Production-ready for prototype |
| `public/assets/units/six-seven.png` | Board: unit poster covers | 67 Spotlight and completion | Production-ready for prototype |
| `public/assets/mascot/back.png` | Board: mascot poses | Reserved for portal only | Temporary |
| `public/assets/mascot/correct.png` | Board: mascot poses | Correct lesson feedback | Production-ready for prototype |
| `public/assets/mascot/wrong.png` | Board: mascot poses | Wrong lesson feedback | Production-ready for prototype |
| `public/assets/mascot/celebrate.png` | Board: mascot poses | Completion screen | Production-ready for prototype |
| `public/assets/decor/tape-*.png` | Board: tape set | Pink tape appears on 67 Spotlight; remaining tapes are ready for future cards | Production-ready for prototype |
| `public/assets/decor/doodle-*.png` | Board: doodle set | Available for low-density decoration | Temporary |
| `public/assets/decor/sticker-*.png` | Board: sticker set | Available for portal or search only | Temporary |
| `public/assets/decor/confetti.png` | Board: confetti set | Static fallback asset, currently unused | Temporary |
| `public/assets/rank/normie.png` | Board: rank badges | Completion when the derived rank is NORMIE | Production-ready for prototype |
| `stamp-mastered` | HTML/CSS from board stamp language | Completed Learn cards | Production-ready for prototype |
| AVAILABLE / LOCKED / CURATED / TRENDING | Existing HTML/CSS labels | Learn and Search state labels | Production-ready for prototype |
| Generic interface icons | Existing `lucide-react` icons | Navigation, stats, controls and dialogs | Production-ready for prototype |

`public/assets/icons/` intentionally has no raster icon exports. Generic controls use the existing Lucide icon library rather than low-resolution board crops.
