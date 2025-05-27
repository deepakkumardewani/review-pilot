# Implementation Plan for Code Reviewer Web App

This document outlines the implementation plan for the Code Reviewer Web App, divided into multiple phases based on the `app-flow.md` and `tech-stack.md`. The plan is split into five separate implementations, with the first one detailed below, updated to include a minimalist style with pastel colors, clean fonts, and Shadcn’s neutral color palette.

## Implementation Plan 1: Project Setup and Initial Layout

**Objective:**  
Set up a new Next.js project, install all required dependencies, create the project structure with all necessary empty files, and implement a basic three-column layout with placeholder components for the file tree, code editor, and review panel. The layout will feature a minimalist style with pastel colors, clean fonts, and Shadcn’s neutral color palette for a modern, creative look.

**Steps:** 2. **Install All Required Dependencies**  
 Install all dependencies specified in `tech-stack.md` to support the app’s functionality, styling, and UI requirements. This includes frontend, UI, state management, data fetching, animations, error handling, testing, and utilities.

```bash
npm install lucide-react react-arborist @monaco-editor/react@next appwrite ai @ai-sdk/react @ai-sdk/openai zod zustand swr gsap @sentry/nextjs date-fns lodash next-themes prettier husky dotenv
```

- **Notes on Dependencies:**
  - `next@15.x`: Latest stable Next.js for frontend and serverless API routes.
  - `tailwindcss@3`, `postcss`, `autoprefixer`: For utility-first styling with Tailwind CSS.
  - `lucide-react`: Modern icon set for UI elements.
  - `react-arborist`: Virtualized tree view for repository file tree.
  - `react-monaco-editor`, `monaco-editor`: Syntax-highlighted code display.
  - `appwrite`: Authentication and database management.
  - `ai, @ai-sdk/react, @ai-sdk/openai`: Vercel AI SDK for AI-driven code reviews.
  - `zustand`: Lightweight state management.
  - `swr`: Data fetching and caching for GitHub API.
  - `gsap`: Smooth animations for UI transitions.
  - `@sentry/nextjs`: Error handling and performance monitoring.
  - `date-fns`, `lodash`: Utility libraries for date manipulation and functions.
  - `next-themes`: Dark/light theme switching.
  - `eslint`, `prettier`, `husky`, `dotenv`: Code quality and environment management.

3. **Set Up Tailwind CSS and Shadcn Neutral Palette**  
   Configure Tailwind CSS for styling and integrate Shadcn’s neutral color palette (https://ui.shadcn.com/colors) to achieve a minimalist, pastel-colored look with clean fonts.

   - Initialize Tailwind:
     ```bash
     npx tailwindcss init -p
     ```
   - Update `tailwind.config.ts` to include Shadcn’s neutral palette and clean fonts:
     ```javascript
     module.exports = {
       content: [
         "./app/**/*.{js,ts,jsx,tsx}",
         "./components/**/*.{js,ts,jsx,tsx}",
       ],
       theme: {
         extend: {
           colors: {
             neutral: {
               50: "#fafafa",
               100: "#f5f5f5",
               200: "#e5e5e5",
               300: "#d4d4d4",
               400: "#a3a3a3",
               500: "#737373",
               600: "#525252",
               700: "#404040",
               800: "#262626",
               900: "#171717",
               950: "#0a0a0a",
             },
           },
           fontFamily: {
             sans: [
               "Inter",
               "ui-sans-serif",
               "system-ui",
               "-apple-system",
               "BlinkMacSystemFont",
               "Segoe UI",
               "Roboto",
               "Helvetica Neue",
               "Arial",
               "sans-serif",
             ],
           },
         },
       },
       plugins: [],
     };
     ```
   - **Notes:**
     - The neutral palette provides pastel-like, soft tones (e.g., `neutral-50` to `neutral-200`) for backgrounds and accents, ensuring a minimalist and modern aesthetic.
     - `Inter` is used as the primary font for its clean, modern look, with fallbacks for compatibility.

4. **Set Up Theme Switching with next-themes**  
   Configure `next-themes` for dark/light theme support, ensuring the neutral palette adapts to both modes.

   - Create a theme provider in `/src/components/ThemeProvider.ts`:

     ```jsx
     "use client";
     import { ThemeProvider } from "next-themes";

     export default function CustomThemeProvider({ children }) {
       return <ThemeProvider attribute="class">{children}</ThemeProvider>;
     }
     ```

   - Wrap the app with the provider in `/app/layout.ts` (Next.js app router):

     ```jsx
     import CustomThemeProvider from "../components/ThemeProvider";
     import "./styles/globals.css";

     export default function RootLayout({ children }) {
       return (
         <html lang="en">
           <body>
             <CustomThemeProvider>{children}</CustomThemeProvider>
           </body>
         </html>
       );
     }
     ```

5. **Create Project Structure**  
   Set up the folder structure based on Next.js conventions (https://nextjs.org/docs/app/getting-started/project-structure) and the app’s needs. Create empty files for future use, ensuring scalability.

   - **Folders:**
     - `/src/components`: Reusable UI components (e.g., layout, file tree).
     - `/src/styles`: Global and component-specific CSS.
     - `/src/lib`: Utility functions (e.g., GitHub API helpers).
     - `/src/hooks`: Custom React hooks (e.g., for state management).
     - `/src/types`: TypeScript type definitions (for future TypeScript adoption).
     - `/app/api`: API routes for server-side logic.
   - **Files:**
     - `/src/components/Layout.ts`: Main three-column layout.
     - `/src/components/FileTree.ts`: Placeholder for file tree.
     - `/src/components/CodeEditor.ts`: Placeholder for code editor.
     - `/src/components/ReviewPanel.ts`: Placeholder for review panel.
     - `/src/providers/ThemeProvider.ts`: Theme switching provider.
     - `/src/hooks/useAuth.ts`: Empty file for authentication hooks.
     - `/src/hooks/useRepo.ts`: Empty file for repository-related hooks.
     - `/app/api/auth/route.ts`: Empty file for Appwrite OAuth routes.
     - `/app/api/github/route.ts`: Empty file for GitHub API routes.
     - `/app/api/route.ts`: Empty file for review generation routes.

6. **Implement the Layout Component**  
   Create a `Layout.ts` component with a three-column layout using Tailwind CSS, the neutral palette, and minimalist styling. Apply GSAP for subtle animations (e.g., fade-in on load).

   - In `/src/components/Layout.ts`:

     ```jsx
     "use client";
     import { useEffect } from "react";
     import { gsap } from "gsap";
     import FileTree from "./FileTree";
     import CodeEditor from "./CodeEditor";
     import ReviewPanel from "./ReviewPanel";

     export default function Layout() {
       useEffect(() => {
         gsap.fromTo(
           ".column",
           { opacity: 0, y: 20 },
           { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }
         );
       }, []);

       return (
         <div className="flex h-screen bg-[var(--background)]">
           <div className="column w-1/4 bg-[var(--card)] p-4 shadow-sm">
             <FileTree />
           </div>
           <div className="column w-1/2 bg-white p-4">
             <CodeEditor />
           </div>
           <div className="column w-1/4 bg-[var(--card)] p-4 shadow-sm">
             <ReviewPanel />
           </div>
         </div>
       );
     }
     ```

   - **Notes:**
     - Columns use `neutral-100` (light pastel) for light mode and `neutral-900` for dark mode, creating a clean, card-like appearance.
     - GSAP adds a subtle fade-in animation for columns, enhancing the modern feel.
     - Shadows (`shadow-sm`) add depth without cluttering the minimalist design.

7. **Set Up the Home Page**  
   Update the default `page.ts` page to render the `Layout` component within the app router structure.

   - In `/app/page.ts` (app router):

     ```jsx
     import Layout from "../components/Layout";

     export default function Home() {
       return <Layout />;
     }
     ```

8. **Implement Placeholder Components**  
   Create placeholder components for each column with basic functionality, styled with the neutral palette and minimalist aesthetic.

   - **FileTree.ts**: Use `react-arborist` with dummy data, styled for clarity.

     - In `/src/components/FileTree.ts`:

       ```jsx
       "use client";
       import { Tree } from "react-arborist";
       import { File } from "lucide-react";

       const dummyData = [
         { id: "1", name: "src", children: [{ id: "2", name: "index.ts" }] },
         { id: "3", name: "README.md" },
       ];

       export default function FileTree() {
         return (
           <div className="text-[var(--card-foreground)]">
             <h2 className="text-lg font-semibold mb-2">Files</h2>
             <Tree
               data={dummyData}
               width="100%"
               height={600}
               indent={24}
               rowHeight={36}
             >
               {({ node, style }) => (
                 <div style={style} className="flex items-center">
                   <File className="w-4 h-4 mr-2" />
                   <span>{node.data.name}</span>
                 </div>
               )}
             </Tree>
           </div>
         );
       }
       ```

     - **Notes:** Uses `lucide-react` icons and neutral palette for a clean look.

   - **ReviewPanel.ts**: A styled placeholder for the review panel.
     - In `/src/components/ReviewPanel.ts`:
       ```jsx
       export default function ReviewPanel() {
         return (
           <div className="text-[var(--card-foreground)]">
             <h2 className="text-lg font-semibold mb-2">Review</h2>
             <p className="text-neutral-500">No review available.</p>
           </div>
         );
       }
       ```
     - **Notes:** Uses `neutral-500` for placeholder text, maintaining the pastel aesthetic.
