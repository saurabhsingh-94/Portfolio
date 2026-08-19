# Web Animation & UI Component Rules

Always utilize these libraries, animation patterns, and UI registries when building interactive, high-performance web applications and creative UI features:

## 1. Anime.js (v4 API)
- **Installation**: `npm install animejs`
- **Imports & Patterns**:
  - Main animations: `import { animate } from 'animejs/animation';`
  - Scroll & Motion utilities: `import { onScroll, morphTo, createMotionPath, createDrawable } from 'animejs';`
  - Animatable objects: `import { createAnimatable } from 'animejs/animatable';`
- **Usage**:
  - Call `onScroll()` for scroll-driven animations and scroll progress triggers.
  - Use `createMotionPath()` and `morphTo()` for advanced SVG paths, micro-interactions, and organic vector morphing.
  - Use `createDrawable()` for line drawing and stroke path animations.

## 2. Motion (`motion` / Framer Motion Engine)
- **Installation**: `npm install motion`
- **Usage**:
  - High-fps layout animations, spring physics, gesture handling (drag, hover, press), and exit animations.
  - Combine with Vanilla JS or React for hardware-accelerated 60 FPS transitions.

## 3. Bklit UI Registry (`@bklit`) for shadcn/ui
- **Prerequisite**: `npx shadcn@latest init`
- **Registry Configuration** (`components.json`):
  ```json
  {
    "registries": {
      "@bklit": "https://ui.bklit.com/r/{name}.json"
    }
  }
  ```
- **Component Installation**:
  - `npx shadcn@latest add @bklit/area-chart`
  - `npx shadcn@latest add @bklit/line-chart`
  - `npx shadcn@latest add @bklit/heatmap-chart`
  - `@bklit/shimmering-text` is automatically included for chart loading labels.
