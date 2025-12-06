# Design Guidelines: Links Collection App

## Design Approach
**System**: Linear + Notion Hybrid
- Linear's clean, minimal productivity aesthetic with emphasis on speed and clarity
- Notion's organizational patterns for content-heavy interfaces
- Focus on information density without clutter, rapid scanning, and instant interaction feedback

## Core Layout System

**Spacing Scale**: Tailwind units of 2, 3, 4, 6, 8, 12
- Tight spacing (p-2, gap-2) for compact data displays
- Standard spacing (p-4, gap-4) for cards and components
- Section spacing (p-8, gap-8) for major layout divisions

**Container Strategy**:
- Full-width app layout with fixed sidebar (240px desktop, collapsible mobile)
- Main content: max-w-7xl with px-4 md:px-8
- Modal/dialog content: max-w-2xl centered

## Typography Hierarchy

**Fonts**: Inter (primary), JetBrains Mono (monospace for URLs/tags)

**Scale**:
- App header: text-2xl font-semibold
- Section titles: text-xl font-semibold
- Card titles: text-base font-medium
- Body/metadata: text-sm
- Tags/labels: text-xs font-medium uppercase tracking-wide

## Navigation Structure

**Left Sidebar** (desktop):
- Logo/app name at top (h-16)
- Primary nav items with icons: Feed, Playlists, Shared, Account
- Bottom section: User profile card with logout
- Active state: subtle background fill + border-l-4 accent

**Mobile**: Bottom navigation bar (fixed) with 4 primary items + hamburger for secondary menu

**Top Bar**: Global search (always visible), add link button (prominent, top-right)

## Component Library

### Link Cards (Primary UI Element)
**Horizontal card layout**:
- Thumbnail (80px × 80px, rounded-lg, flex-shrink-0)
- Content area (flex-1): Title (1 line, truncate), Description (2 lines, text-gray-600), Metadata row (category badge + tags + timestamp)
- Actions (hover reveal): Edit, Add to playlist, Share, Delete icons
- Card padding: p-4, gap-3, border rounded-lg, hover:shadow-md transition

### Feed View
- Masonry/stacked card layout (not grid - variable heights)
- Infinite scroll with loading skeleton
- Sticky filter/sort bar below top nav
- Density toggle: Compact (smaller thumbnails) / Comfortable (default) / Spacious

### Search & Filter Bar
**Sticky component** (bg-white/blur, border-b):
- Search input (w-full max-w-md) with icon, instant search feedback
- Filter dropdowns: Category (multi-select), Tags (multi-select), Date range
- Sort dropdown: Recent, Oldest, A-Z, Category
- Active filters shown as dismissible chips below bar

### Playlist View
**Two-column layout** (desktop):
- Left: Playlist sidebar (w-64) showing all playlists as list items
- Right: Selected playlist content with same card layout as feed
- Playlist header: Title (editable inline), description, share button, link count
- Drag-to-reorder links within playlist

### Modals/Dialogs
**Add/Edit Link Modal**:
- Form fields stack vertically (gap-4)
- URL input (large, with validation feedback)
- Optional fields clearly labeled: Title, Description (textarea), Category (dropdown), Tags (token input), Thumbnail URL
- Footer: Cancel (ghost button) + Save (primary button)
- Modal: max-w-2xl, p-6, rounded-xl, shadow-2xl

**Share Dialog**:
- Search users input at top
- Selected users as chips
- Share permissions toggle: View only / Can edit
- Share button (primary)

### User Dashboard
**Stats Cards Row** (grid-cols-3):
- Total links, Playlists created, Shared items
- Cards: p-6, centered content, large number (text-3xl), label below

**Recent Activity Feed**: Chronological list of saves/shares/playlist updates

## Interaction Patterns

**Buttons**:
- Primary: Solid background, rounded-lg, px-4 py-2, font-medium
- Secondary: Border only, same padding
- Ghost: No border/background, hover:bg-gray-100
- Icon buttons: p-2, rounded-md, hover:bg-gray-100

**Form Inputs**:
- Height: h-10 (consistent across all)
- Padding: px-3
- Border: border rounded-md
- Focus: ring-2 ring-offset-1

**Tags/Chips**:
- Pill shape (rounded-full), px-3 py-1, text-xs
- Dismissible tags have × icon on hover
- Tag input: Type + Enter to add

**Loading States**:
- Skeleton screens for initial loads (pulsing gray blocks matching card structure)
- Inline spinners for actions (20px, subtle)

## Responsive Behavior

**Desktop (lg+)**: Full sidebar + main content
**Tablet (md)**: Collapsible sidebar, bottom nav appears
**Mobile**: Bottom nav only, single column cards, simplified filters (sheet/drawer)

## Accessibility
- All interactive elements: min-height 44px touch target
- Focus indicators: Always visible ring-2
- ARIA labels on icon-only buttons
- Keyboard navigation: Tab order follows visual flow, Esc closes modals

## Images
**Thumbnails**: Link preview images extracted from URLs or user-provided. Fallback to generic link icon in centered container. Size: 80×80px in cards, aspect-ratio-video for playlist covers.

**No hero section** - this is a productivity app, not a marketing site. Immediate content on login.