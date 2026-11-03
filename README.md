# Clarity · live prototype

A coded, phone-sized prototype of **Clarity**, an empathetic health companion app, designed by Shaked Edut.
Built from the Clarity Figma design with an AI-assisted workflow (Claude Code + Figma MCP).

## Run it
```
npm install
npm run dev      # local preview
npm run build    # production files in dist/, upload to shakededut.com/clarity/live/
```

## Structure
- `src/styles/tokens.css`: design tokens from DESIGN.md (colors, type, spacing, radii)
- `src/components/*`: one folder per component (companion, nav bar, goal card, stat card…)
- `src/screens/*`: screens built from components
- `src/data/*`: mock data and all copy
- `public/companion/`: Shaked's Procreate companion, exported in layers

## Credits
- Font: Montserrat (SIL Open Font License)
- Icons: Material Symbols (Apache 2.0)
- Animation: GSAP (free "no charge" license)
