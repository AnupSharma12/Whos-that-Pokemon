# Who's That Pokémon?

A retro-styled CRT arcade web game where players test their knowledge of the original 151 Pokémon by identifying silhouettes under a streak-based score system.

![Who's That Pokémon? CRT Gameplay](assets/gameplay.png)

## 🎮 Try It Out

You can play the live game directly in your browser here:
👉 **[Play the Live Demo](https://anupsharma12.github.io/Whos-that-Pokemon/)**

---

## ⚡ Quick Start

No installations, compile steps, or database setups are required. You can launch the game in seconds:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AnupSharma12/Whos-that-Pokemon.git
   cd Whos-that-Pokemon
   ```
2. **Start a local server:**
   Running a local server prevents browser security/CORS restrictions when loading local scripts or utilizing the Web Audio API.
   * If you have Python:
     ```bash
     python -m http.server 8000
     ```
   * If you have Node:
     ```bash
     npx serve
     ```
3. **Open the game:**
   Navigate to `http://localhost:8000` (or the port specified by your server) to start playing.

---

## ✨ Features

- **Retro CRT Aesthetic:** Immerse yourself in a nostalgic late-90s vibe with glass bezels, flickering LED status lights, scrolling space backgrounds, and retro CRT scanline overlays.
- **8-Bit Audio Synth Engine:** Built-in retro audio feedback using native browser sound synthesis—no external audio files required!
- **Dynamic PokeAPI Integration:** Randomly pulls authentic graphics, names, and typing hints directly from the PokeAPI for the first 151 generation-1 Pokémon.
- **Streak & High Score tracking:** Correct answers increment your streak, acting as a score multiplier. High scores are persisted locally across visits using `localStorage`.
- **Utility Game Controls:** Reveal Pokémon elemental types as hints or skip tricky rounds if you are stuck.

---

## ⚙️ How It Works

### Synthesized 8-Bit Audio
Instead of fetching bulky MP3/WAV audio clips over the network, this project leverages the browser's native **Web Audio API (`AudioContext`)**. We programmatically construct oscillator nodes (`sine`, `sawtooth`, `triangle`) and connect them to gain nodes to design classic, latency-free gaming sound effects:
- **Click:** A brief, high-pitch triangle wave note.
- **Win:** An ascending, three-note major arpeggio.
- **Lose:** A descending sawtooth sequence mimicking retro fail chimes.

This architecture ensures instant auditory response and allows the game to function entirely offline once assets are cached.

### Responsive CSS Silhouettes
The mystery silhouette effect is achieved purely in CSS without modifying the source images. We apply a CSS filter rule `brightness(0)` to black out the official Pokémon artwork. Upon a correct guess, incorrect guess, or skip, the CSS class switches to drop the filter, dynamically revealing the full-color artwork instantly.

---

## 📜 Credits & Acknowledgments

- **PokeAPI:** For the amazing free and open [REST API](https://pokeapi.co/) providing Gen 1 Pokémon data.
- **Nintendo & Game Freak:** For creating the legendary Pokémon franchise and the iconic "Who's That Pokémon?" transition screens that inspired this project.