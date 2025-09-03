# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Principles
**IMPORTANT**: Whenever you write code, it MUST follow SOLID design principles. Never write code that violates these principles. If you do, you will be asked to refactor it.

## Development Commands

### Core Development
```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Key Development Notes
- No test framework is configured in this project
- Uses Next.js 15 with App Router
- All data persists in browser localStorage (no database)
- TypeScript strict mode enabled

## Architecture Overview

### Data Flow Architecture
This is a client-side expense tracking application using a **unidirectional data flow** pattern:

1. **React Context + useReducer**: Central state management via `ExpenseProvider`
   - All expense CRUD operations go through the context
   - State mutations handled by `expenseReducer` with actions
   - Automatic localStorage persistence on every state change

2. **Storage Layer**: Browser localStorage as the single source of truth
   - `src/lib/storage.ts` - Storage utilities with SSR-safe checks
   - Data persists between sessions
   - No server-side data source

3. **Component Architecture**: Container/Presentation pattern
   - Pages are route containers (`src/app/*/page.tsx`)
   - Reusable components in `src/components/` organized by feature
   - Context consumed via `useExpenses()` hook

### State Management Pattern
```typescript
// Central state in ExpenseContext
interface ExpenseState {
  expenses: Expense[];
  filters: ExpenseFilters;
  loading: boolean;
  error: string | null;
}

// All mutations through reducer actions
dispatch({ type: 'ADD_EXPENSE', payload: expenseData });
```

## Code Standards
- Use TypeScript for all new code with strict type checking
- Follow the existing component structure in `/src/components`
- Follow the existing page structure in `/src/app/[route]/page.tsx`
- CSS classes should use Tailwind utilities; custom CSS only when necessary

## File Organization
- Components: `/src/components/[feature]/[ComponentName].tsx`
- Pages: `/src/[route]/page.tsx`
- Utilities: `/src/lib/[category]/[utility].ts`
- Types: `/src/types/[domain].ts`

### Key Libraries
- **Recharts**: Data visualization (pie charts, bar charts)
- **Lucide React**: Icon system
- **date-fns**: Date manipulation and formatting
- **Tailwind CSS**: Utility-first styling with custom design system

### Styling Approach
- Tailwind CSS with consistent spacing/color system
- Component-scoped styles (no global CSS)
- Responsive design with mobile-first approach
- Custom design tokens for consistent theming

### Error Handling Strategy
- Context-level error state management
- localStorage operations wrapped in try-catch
- Form validation at component level
- User-friendly error messages via context

### Performance Considerations
- Client-side filtering with `useMemo` for expensive calculations
- No pagination (assumes reasonable dataset sizes)
- localStorage has ~5-10MB limit
- Charts re-render optimized via Recharts