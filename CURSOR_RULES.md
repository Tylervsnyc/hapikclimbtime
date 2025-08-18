# 🎯 Cursor Rules - Hapik Climbing App

## 🧠 **Expert Knowledge Areas**
- TypeScript, Node.js, Next.js App Router, React, Shadcn UI, Radix UI, Tailwind CSS

## 📝 **Code Style and Structure**
- Write concise, technical TypeScript code with accurate examples
- Use functional and declarative programming patterns; avoid classes
- Prefer iteration and modularization over code duplication
- Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`)
- Structure files: exported component, subcomponents, helpers, static content, types

## 🏷️ **Naming Conventions**
- Use lowercase with dashes for directories (e.g., `components/auth-wizard`)
- Favor named exports for components
- Use PascalCase for components, camelCase for functions and variables

## 🔧 **TypeScript Usage**
- Use TypeScript for all code; prefer interfaces over types
- Avoid enums; use maps instead
- Use functional components with TypeScript interfaces
- Export types and interfaces from dedicated files

## 📐 **Syntax and Formatting**
- Use the "function" keyword for pure functions
- Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements
- Use declarative JSX
- Prefer arrow functions for component definitions

## 🎨 **UI and Styling**
- Use Shadcn UI, Radix, and Tailwind for components and styling
- Implement responsive design with Tailwind CSS; use a mobile-first approach
- Use inline styles sparingly; prefer Tailwind classes
- Maintain consistent spacing and typography

## ⚡ **Performance Optimization**
- Minimize 'use client', 'useEffect', and 'setState'; favor React Server Components (RSC)
- Wrap client components in Suspense with fallback
- Use dynamic loading for non-critical components
- Optimize images: use WebP format, include size data, implement lazy loading

## 🔑 **Key Conventions**
- Use 'nuqs' for URL search parameter state management
- Optimize Web Vitals (LCP, CLS, FID)
- Limit 'use client':
  - Favor server components and Next.js SSR
  - Use only for Web API access in small components
  - Avoid for data fetching or state management
- Follow Next.js docs for Data Fetching, Rendering, and Routing

## 🏗️ **Project-Specific Rules**
- Use Firebase for authentication and data storage
- Implement proper error boundaries and loading states
- Follow the established file structure in `src/`
- Use the existing color scheme and design patterns
- Maintain accessibility standards

## 📚 **File Organization**
```
src/
├── app/           # Next.js App Router pages
├── components/    # Reusable UI components
├── contexts/      # React Context providers
├── data/          # Data management and types
├── lib/           # Utility functions and services
└── types/         # TypeScript type definitions
```

## 🧪 **Testing and Quality**
- Write self-documenting code with clear variable names
- Include proper error handling and loading states
- Test components in isolation when possible
- Follow React best practices for state management

