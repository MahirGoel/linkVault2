# LinkVault - Links Collection Application

## Overview

LinkVault is a full-stack web application for saving, organizing, and sharing links. Built with a modern tech stack, it provides a productivity-focused interface inspired by Linear and Notion, enabling users to collect URLs, organize them with categories and tags, create shareable playlists, and collaborate with others.

The application follows a monorepo structure with a React frontend, Express backend, and PostgreSQL database, all configured for deployment on Replit's infrastructure.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server
- **Wouter** for lightweight client-side routing
- **TanStack Query (React Query)** for server state management and caching
- **Tailwind CSS** for utility-first styling with custom design tokens

**UI Component System:**
- Built on **Radix UI primitives** for accessible, unstyled components
- **shadcn/ui** component library (New York style variant)
- Custom design system following Linear/Notion aesthetic principles
- Responsive layout with fixed sidebar (desktop) and bottom navigation (mobile)
- Dark/light theme support with context-based theme provider

**State Management Strategy:**
- Authentication state managed via React Context (`AuthContext`)
- Theme preferences managed via React Context (`ThemeContext`)
- Server data cached and synchronized using TanStack Query
- Local component state for UI interactions (modals, selections, filters)

**Key Design Patterns:**
- Atomic component design with clear separation of concerns
- Custom hooks for reusable logic (`use-toast`, `use-mobile`)
- Path aliases for clean imports (`@/`, `@shared/`, `@assets/`)
- Type-safe API interactions with shared schema definitions

### Backend Architecture

**Technology Stack:**
- **Node.js** runtime with **Express.js** framework
- **TypeScript** for type safety across the full stack
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** as the primary database

**Authentication & Session Management:**
- **Replit Auth** (OpenID Connect) for authentication
- Session storage using **connect-pg-simple** with PostgreSQL backend
- Passport.js integration for auth strategy handling
- HTTP-only cookies for session tokens with 7-day TTL

**API Architecture:**
- RESTful API design with resource-based endpoints
- Middleware-based request logging and error handling
- Authentication middleware (`isAuthenticated`) protecting routes
- JSON request/response with Zod schema validation

**Database Design:**
- PostgreSQL with Drizzle ORM for schema definition
- Relational data model with foreign key constraints and cascading deletes
- Normalized schema with junction tables for many-to-many relationships
- Automatic timestamp tracking (`createdAt`, `updatedAt`)

**Core Data Models:**
- **Users**: Replit Auth integration (id, email, profile data)
- **Links**: URL bookmarks with metadata (title, description, thumbnail, category, tags)
- **Categories**: User-defined classification system
- **Tags**: Flexible multi-tag system (array field in links)
- **Playlists**: Collections of links for organization and sharing
- **Shares**: Permission system for collaborative features
- **Activities**: Audit trail for user actions

### Build & Deployment Strategy

**Development Mode:**
- Vite dev server with HMR for rapid frontend development
- Express server with middleware mode integration
- Replit-specific plugins for development experience

**Production Build:**
- Client: Vite builds to `dist/public` with optimized bundle splitting
- Server: esbuild bundles TypeScript to single CJS file with allowlisted dependencies
- Static file serving from built client assets
- SPA fallback routing for client-side navigation

**Configuration Management:**
- Environment variables for sensitive data (DATABASE_URL, SESSION_SECRET)
- TypeScript path mapping for clean imports
- Shared schema types between client and server

### External Dependencies

**Primary Framework Dependencies:**
- **React 18** - UI library
- **Express.js** - Web server framework
- **Drizzle ORM** - Database ORM and query builder
- **TanStack Query** - Async state management
- **Radix UI** - Headless UI component primitives
- **Tailwind CSS** - Utility-first CSS framework

**Authentication & Security:**
- **Replit Auth (OpenID Connect)** - Primary authentication provider
- **Passport.js** - Authentication middleware
- **express-session** - Session management
- **connect-pg-simple** - PostgreSQL session store

**Database:**
- **PostgreSQL** - Primary relational database (via Replit provisioning)
- **node-postgres (pg)** - PostgreSQL client driver

**Build Tools:**
- **Vite** - Frontend build tool and dev server
- **esbuild** - Fast JavaScript bundler for server code
- **TypeScript** - Type system and compiler
- **tsx** - TypeScript execution for Node.js

**Validation & Schema:**
- **Zod** - Runtime type validation
- **drizzle-zod** - Zod schema generation from Drizzle schemas

**UI & Styling:**
- **class-variance-authority** - Variant-based component API
- **clsx** / **tailwind-merge** - Conditional className utilities
- **cmdk** - Command palette component
- **lucide-react** - Icon library
- **date-fns** - Date formatting utilities
- **embla-carousel-react** - Carousel component

**Development Tools:**
- **@replit/vite-plugin-*** - Replit-specific development plugins
- **wouter** - Lightweight routing library