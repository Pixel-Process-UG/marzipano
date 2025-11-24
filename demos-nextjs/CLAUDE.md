# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 showcase application demonstrating the Marzipano-TS library (a 360° panorama viewer). It serves as both a marketing site and interactive demo gallery for the library maintained by Pixel & Process.

**Key Technologies:**
- Next.js 16.0.3 (App Router)
- React 19.2.0
- TypeScript
- Tailwind CSS v4
- Marzipano library (local package from `../`)

## Development Commands

### Setup & Development
```bash
npm install                    # Install dependencies
npm run dev                    # Start Next.js dev server (http://localhost:3000)
npm run build                  # Build production bundle
npm start                      # Run production server
```

### Code Quality
```bash
npm run lint                   # Check code with ESLint
npm run lint:fix               # Auto-fix ESLint issues (if configured)
```

## Architecture

### Project Structure

```
app/
├── layout.tsx                 # Root layout with Navigation and fonts
├── page.tsx                   # Homepage (marketing, features, installation)
├── globals.css                # Global Tailwind styles
└── demos/
    ├── layout.tsx             # Demo-specific layout (force-dynamic)
    ├── page.tsx               # Demo gallery/index page
    └── [demo-name]/page.tsx   # Individual demo pages (20+ demos)

components/
├── MarzipanoViewer.tsx        # Core React wrapper for Marzipano
├── DemoLayout.tsx             # Demo page layout with header/back button
├── Navigation.tsx             # Main navigation bar
├── CodeBlock.tsx              # Syntax-highlighted code display
└── FeatureCard.tsx            # Feature showcase cards

public/
├── media/                     # Demo assets (cubemaps, equirect images)
└── demos/                     # Demo-specific assets
```

### Critical Architecture Patterns

**1. Marzipano Integration with Next.js SSR**

The Marzipano library requires browser globals (WebGL, DOM) that don't exist during server-side rendering. This project solves this through:

- **Client Components**: All Marzipano usage must be in `'use client'` components
- **Force Dynamic**: `app/demos/layout.tsx` forces dynamic rendering for all demos
- **Webpack Configuration**: `next.config.ts` handles SSR/browser environment split
  - Server-side: External package handling, fallback for `fs`/`path`
  - Client-side: WebGL/WebGPU support via resolve fallbacks
  - Local package aliasing: `marzipano` → `../src/index.js`

**2. MarzipanoViewer Component Pattern**

The `MarzipanoViewer.tsx` component is the core React wrapper:

```tsx
// Usage pattern in demo pages
const handleViewerReady = (viewer: Marzipano.Viewer) => {
  // Create source, geometry, view
  const scene = viewer.createScene({ source, geometry, view });
  scene.switchTo();
};

<MarzipanoViewer
  className="w-full h-full"
  onViewerReady={handleViewerReady}
/>
```

**Key responsibilities:**
- Manages viewer lifecycle (creation, cleanup via `useEffect`)
- Ensures viewer is destroyed on unmount to prevent memory leaks
- Provides callback pattern for scene initialization
- Refs handle viewer instance persistence

**3. Demo Page Pattern**

Every demo follows this structure:

```tsx
'use client';
export const dynamic = 'force-dynamic';

import { useRef } from 'react';
import * as Marzipano from 'marzipano';
import DemoLayout from '@/components/DemoLayout';
import MarzipanoViewer from '@/components/MarzipanoViewer';

export default function DemoPage() {
  const sceneRef = useRef<Marzipano.Scene | null>(null);

  const handleViewerReady = (viewer: Marzipano.Viewer) => {
    // Initialize Marzipano scene
  };

  return (
    <DemoLayout title="Demo Name" description="Description">
      <MarzipanoViewer onViewerReady={handleViewerReady} />
    </DemoLayout>
  );
}
```

**Critical elements:**
- `'use client'` directive (Marzipano needs browser APIs)
- `export const dynamic = 'force-dynamic'` (disable static optimization)
- `useRef` for scene persistence (prevent re-creation on re-renders)
- `DemoLayout` wrapper for consistent UI/navigation

**4. Demo Categories & Organization**

Demos are organized into 5 categories (defined in `app/demos/page.tsx`):
- **Basic Panoramas**: equirect, cube (single/multi-res), flat
- **Hotspots**: v2, embedded, rect, styles
- **Advanced Features**: transitions, video, gestures, device orientation, spatial audio
- **XR/VR**: WebXR immersive
- **Special**: anaglyph, editable, sample tour, side-by-side, performance telemetry

Each category displays as a section with grid layout on the demo gallery page.

### TypeScript Configuration

- `paths`: `@/*` alias maps to project root
- Target: ES2017 (modern features, but IE11-safe if needed)
- JSX: `react-jsx` (automatic runtime, no React imports needed)
- Strict mode enabled

### Styling Approach

- **Tailwind CSS v4**: Primary styling method
- **Design System**:
  - Colors: Black/white/gray scale (minimalist, professional)
  - Fonts: Geist Sans (body), Geist Mono (code blocks)
  - Spacing: Generous padding, clean layouts
  - Effects: Subtle hover states, transitions, scale transforms
- **Responsive**: Mobile-first approach with `sm:`, `md:`, `lg:`, `xl:` breakpoints
- **Component Patterns**: Reusable card layouts, consistent border/shadow styles

### Local Package Integration

This project depends on the parent Marzipano package via `"marzipano": "file:../"`:

- Changes in `../src/` immediately affect this project
- Webpack alias resolves imports directly to `../src/index.js`
- No build step needed for Marzipano changes (hot reload works)
- TypeScript types from Marzipano's `.d.ts` files

**Important**: When modifying Marzipano core library, test changes here before publishing.

## Common Development Patterns

### Adding a New Demo

1. Create `app/demos/[demo-name]/page.tsx` following the demo pattern
2. Add entry to `demos` array in `app/demos/page.tsx`
3. Place assets in `public/media/[demo-name]/` if needed
4. Use `MarzipanoViewer` + `DemoLayout` components
5. Export `dynamic = 'force-dynamic'` and use `'use client'`

### Working with Marzipano APIs

```tsx
// Import the entire namespace for type safety
import * as Marzipano from 'marzipano';

// Common APIs used across demos:
// - ImageUrlSource.fromString() - Load images
// - CubeGeometry, EquirectGeometry, FlatGeometry - 3D shapes
// - RectilinearView - Camera/projection
// - Viewer.createScene() - Scene creation
// - Scene.switchTo() - Display scene
// - Scene.hotspotContainer() - Interactive hotspots
```

### Navigation & Routing

- Homepage: `/` (marketing site)
- Demo gallery: `/demos`
- Individual demos: `/demos/[demo-name]`
- All navigation via Next.js `<Link>` for client-side transitions
- Demo pages include "Back to Demos" breadcrumb

## Important Notes

- **Browser-Only Code**: Always use `'use client'` for Marzipano components
- **Memory Management**: Viewer cleanup in `useEffect` return function is critical
- **Local Network Dev**: `next.config.ts` allows cross-origin from `192.168.3.1`
- **Viewport**: Fixed viewport settings in `app/layout.tsx` (no user scaling for demos)
- **Asset Paths**: Use absolute paths starting with `/` (e.g., `/media/cubemap/{f}.jpg`)
- **Demo Stability**: Force dynamic rendering prevents build-time errors with WebGL
