# Aaditya Raj — Developer Portfolio

[![Live Site](https://img.shields.io/badge/Live-cholebhature.me-amber?style=flat-square)](https://cholebhature.me)
[![GitHub](https://img.shields.io/badge/GitHub-Aadir0-blue?style=flat-square&logo=github)](https://github.com/Aadir0)
[![Itch.io](https://img.shields.io/badge/Itch.io-cholebhature--hehe-red?style=flat-square&logo=itchdotio)](https://cholebhature-hehe.itch.io/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-aadityaraj--singh-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/aadityaraj-singh/)

A minimal, editorial developer portfolio for **Aaditya Raj** — Computer Science Student, Indie Game Developer, and Student Ambassador at GDAI (Game Developers Association of India).

Hosted on GitHub Pages with custom domain [cholebhature.me](https://cholebhature.me) and built using the Jekyll Architect theme.

---

## 🥊 Interactive 3D Boxing Arena (Three.js)

The website features an interactive 3D boxing entrance challenge built using **Three.js**:
- **Combat Mechanics**:
  - `A` / `D` — Move Left & Right
  - `Space` — Jump
  - `Left Click` — Throw Punch (with a tactical $0.38\text{s}$ cooldown and real-time stamina meter in the HUD)
  - `Right Click` (Hold) — Raise Guard to block incoming punches (absorbs 84% damage)
- **Challenging AI Opponent**:
  - Opponent **Aaditya Raj (AI)** actively bobs, weaves, slips incoming punches, raises guard, counters, and lands 1-2 punch combinations.
- **Mobile Touch Gamepad**:
  - Dual-thumb ergonomic on-screen controller (`◀`, `▶`, `JUMP`, `BLOCK`, `PUNCH`) with haptic touch feedback.
- **Secret Hardcore Boss Mode**:
  - Unlockable before your first victory against the AI.
  - Can only be triggered once until conquered.
- **Clean Execution**:
  - Entering or skipping to the website cleanly stops the Three.js render loop (`cancelAnimationFrame`) and mutes audio so background resources are never wasted.

---

## 🎨 Website Design & Structure

- **Warm Cream Minimalist Palette**: Built on `#FAF7F0` with subtle ambient lighting and high-contrast typography.
- **Typography**:
  - Headings: `Syne`
  - Body Text: `Plus Jakarta Sans`
  - Code & Badges: `JetBrains Mono`
- **3D Flip Banners**: Project showcases feature interactive 3D flip cards with screenshots, awards, and direct playable links (supports both desktop hover and mobile tap).
- **Consolidated About & Skills**:
  - **Languages**: C#, C, C++, Java, Go, HTML, CSS
  - **Engines & Creative Software**: Unity, Aseprite, Blender
  - **Honors**: Student Ambassador at GDAI, 1st Place at Just a Hackathon, Best Art Direction at Geek-N-Jam.

---

## 🎮 Featured Projects

1. **[Nightmare — A fairy tale](https://surana-rishabh.itch.io/nightmare-a-fairy-tale)** — *★ Best Art Direction Award (Geek-N-Jam)*
   - Dark fantasy platformer with atmospheric art direction, fluid physics, and precision movement.
2. **[Time Traveler](https://cholebhature-hehe.itch.io/time-traveler)** — *★ Won Just a Hackathon*
   - Chronological puzzle game featuring temporal loops, state rewinds, and mechanism sequencing.
3. **[ILLegal Moves](https://cholebhature-hehe.itch.io/illegal-moves)** — *StarCade Game Jam*
   - Precision platformer designed with deceptive traps and subverted movement rules.
4. **[DriftIT](https://cholebhature-hehe.itch.io/driftit)**
   - Top-down 2D multiplayer racing game with custom tire friction and drift physics.
5. **[Strange Rooms](https://cholebhature-hehe.itch.io/strange-rooms)** — *Brackeys Game Jam*
   - Spatial perspective puzzle game exploring room manipulation and shaders.
6. **The Last Train** & **Dragons Quest**
   - Atmospheric exploration and foundational 2D action platforming milestones.

---

## 🚀 Running Locally

Clone the repository and serve locally:

```bash
git clone https://github.com/Aadir0/Aadir0.github.io.git
cd Aadir0.github.io
npx serve .
```

Open `http://localhost:3000` in your browser.

---

## 📄 License

MIT License © 2026 Aaditya Raj.
