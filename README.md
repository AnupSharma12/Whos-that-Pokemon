# Who's That Pokémon?

A retro CRT arcade game where you identify Gen 1 Pokémon silhouettes. Covers all 151 originals, tracks streaks, and looks like something you'd find in a dusty 1999 basement.

![Who's That Pokémon? CRT Gameplay](assets/gameplay.png)

## 🎮 Try It Out

Play it in your browser, no setup needed:

👉 **[Play the Live Demo](https://anupsharma12.github.io/Whos-that-Pokemon/)**

---

## ⚡ Quick Start

Clone the repo and spin up a local server. The server step matters — browsers block local scripts and the Web Audio API without one.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AnupSharma12/Whos-that-Pokemon.git
   cd Whos-that-Pokemon
   ```

2. **Start a local server:**

   With Python:
   ```bash
   python -m http.server 8000
   ```

   With Node:
   ```bash
   npx serve
   ```

3. **Open the game:**
   Go to `http://localhost:8000` (or whatever port your server reports).

---

## ✨ Features

- **Retro CRT look:** Glass bezels, scanline overlays, flickering LED lights, scrolling space background. Pure late-90s arcade energy.
- **8-bit audio via Web Audio API:** Sound effects built from oscillator nodes in the browser — no audio files to download, no latency.
- **PokeAPI integration:** Pulls sprites, names, and type data live from [PokeAPI](https://pokeapi.co/) for all 151 Gen 1 Pokémon.
- **Streak and high score tracking:** Correct answers build your streak (which acts as a score multiplier). High scores persist between sessions via `localStorage`.
- **Hint and skip controls:** Reveal the Pokémon's type if you're stuck, or skip the round entirely.

---

## ⚙️ How It Works

### 8-Bit Audio

Rather than loading MP3 or WAV files, the game uses the browser's **Web Audio API** directly. Oscillator nodes (`sine`, `sawtooth`, `triangle`) feed into gain nodes to produce three effects:

- **Click:** A short triangle wave pulse.
- **Win:** A three-note ascending arpeggio.
- **Lose:** A descending sawtooth sequence.

This keeps the game fully offline-capable once assets are cached, and sound is instant with no loading delay.

### CSS Silhouettes

The silhouette effect is just `filter: brightness(0)` applied to the official Pokémon sprite. On a correct guess, wrong guess, or skip, the CSS class swaps and the filter drops, revealing the full artwork. No canvas, no image processing — the source image is never modified.

---

## 📜 Credits

- **PokeAPI** — Free, open REST API for all the Gen 1 data.
- **Nintendo & Game Freak** — For Pokémon, and for the "Who's That Pokémon?" transition segments that inspired this.
