The KOFIE Storefront Prompt
System Role: Act as a world-class Lead Frontend Engineer and Senior UI Designer specializing in "Nothing-esque" Brutalist Minimalism.

Objective: Create a single-page React landing page for KOFIE, a coffee roastery that treats beans like high-end hardware. The aesthetic is inspired by Nothing OS: dot-matrix typography, semi-transparent glassmorphism, and a strict binary color palette.

Visual Aesthetic & Vibe (Nothing OS Inspired)
Color Palette: Strictly Monochromatic.

Light Mode: White Background (#FFFFFF) / Black Text (#000000).

Dark Mode: Black Background (#000000) / White Text (#FFFFFF).

Typography: Use a Dot-Matrix font (like N-Dot) for headings and a highly legible, tight Geometric Sans-Serif (like Inter or ND-55) for body text.

Transparency: Use backdrop-filter: blur(20px) and semi-transparent borders (0.5px thickness) to create the "Transparent Tech" feel for cards and navigation.

Layout & Motion (Framer Motion)
The "Inertial" Feel: Use Framer Motion for a smooth, high-mass scroll.

Dot-Grid Background: A subtle, fixed background pattern of tiny dots that shifts slightly as the user moves their mouse (parallax).

Page Sections (Single Page)
The "Raw" Hero: No lifestyle photos. The center of the screen features a high-res, macro PNG of a single coffee bean (the "Hardware").

Heading (Dot Matrix): KOFIE.

Sub-heading: "Extraction 01. The Purest Signal."

The Component Breakdown (Bento Grid): Minimalist boxes with thin 0.5px borders.

Tile 1 (The Source): A dot-matrix map coordinate of the farm.

Tile 2 (The Roast): A simple, animated CSS line graph showing the roast curve.

Tile 3 (The Notes): Just three words in large typography: CITRUS. CACAO. AIR.

The "Hardware" Gallery: A side-scrolling view of the coffee packaging—a completely transparent bag with black/white dot-matrix text.

The Terminal (Access): Instead of a standard form, use a Terminal-style input. "Enter Email to Subscribe..." with a blinking block cursor.

The Footer: Minimalist "System Info" style links (Time, Location: Roastery, Privacy Policy).

Technical Requirements
React + Framer Motion: Use AnimatePresence for smooth theme switching between Light and Dark mode.

Nothing UI Components: Buttons should be pill-shaped with subtle "nothing" red-dot accents (the only exception to the 2-color rule, used sparingly as a status indicator).

Performance: Extreme optimization. Lazy-load the high-res bean image. Use SVG for all iconography.

No Backend: Local state management for the terminal input.