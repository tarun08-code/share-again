# Share Again - Frontend App

## Overview

Share Again is a document sharing platform built with React and TypeScript. The backend has been removed and the app now uses localStorage for data persistence, making it a fully client-side application.

## Technology Stack

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Zustand (state management)
- React Router (navigation)
- React Hook Form (forms)

## Key Changes

**✅ Removed Supabase Backend:**

- Removed `@supabase/supabase-js` dependency
- Deleted `src/lib/supabase.ts` file
- Updated all authentication and data operations to use localStorage
- Removed Supabase environment variables

**✅ Updated Features:**

- User authentication via localStorage
- File upload simulation (generates mock URLs)
- Data persistence through browser localStorage
- All CRUD operations now work locally
- Starring/favoriting functionality maintained
- Search functionality preserved

## File Structure

- `src/contexts/AuthContext.tsx` - Authentication context (localStorage-based)
- `src/lib/fileUpload.ts` - File operations and data management
- `src/lib/storage.ts` - LocalStorage utilities
- `src/components/` - UI components
- `src/pages/` - Application pages

## Data Storage

The app now stores all data in browser localStorage:

- `users` - User accounts and profiles
- `papers` - Uploaded academic papers
- `notes` - Uploaded study notes
- `currentUser` - Currently logged-in user

## Development

**Install Dependencies:**

```bash
npm install
```

**Start Development Server:**

```bash
npm run dev
```

**Build for Production:**

```bash
npm run build
```

**Preview Production Build:**

```bash
npm run preview
```

## Features

- User registration and login (mock authentication)
- File upload simulation with progress tracking
- Browse and search papers/notes by department and subject
- Star/favorite papers and notes
- User profiles with statistics
- Responsive design with dark/light theme support
- Department-wise categorization

## Notes

- All file uploads are simulated and generate mock URLs
- Data persists only in browser localStorage
- No actual file storage - this is a frontend-only demo
- Google OAuth login creates a demo user account
- Perfect for prototyping and development without backend setup

## Deployment

Since this is now a pure frontend app, you can deploy it to any static hosting service:

- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting
- Any CDN or web server

Just run `npm run build` and deploy the `dist` folder.
