# App Flow for Code Reviewer Web App

This document outlines the user journey and interactions within the Code Reviewer Web App. It describes the main flows, including authentication, repository selection, file viewing, review requests, and review history. The app leverages **Appwrite** for authentication and database management, **Next.js** for the frontend and API routes, and the **Vercel AI SDK** for generating code reviews.

---

## Overview

The Code Reviewer Web App enables users to:
- Log in via GitHub OAuth (managed by Appwrite).
- Select a GitHub repository to review.
- View the repository's file tree and select files for review.
- Request AI-generated code reviews for selected files.
- View past reviews stored in the Appwrite database.

The app uses a three-column layout:
- **Left:** File tree of the selected repository.
- **Middle:** Monaco Editor displaying the selected file's content.
- **Right:** AI-generated review or review history.

---

## Main Flows

### 1. Authentication Flow
- **Trigger:** User clicks "Login with GitHub."
- **Steps:**
  1. App redirects to Appwrite's OAuth endpoint for GitHub.
  2. Appwrite handles the OAuth flow, redirecting the user to GitHub.
  3. User authenticates on GitHub and authorizes the app.
  4. GitHub redirects back to Appwrite with an authorization code.
  5. Appwrite exchanges the code for an access token and creates a user session.
  6. Appwrite securely stores the GitHub access token.
  7. User is redirected back to the app, now authenticated.
  8. App checks if the user has a selected repository:
     - If yes, navigates to the main interface.
     - If not, navigates to repository selection.
- **Technologies:** Appwrite (OAuth2), GitHub OAuth.

### 2. Repository Selection Flow
- **Trigger:** User is authenticated and needs to select a repository.
- **Steps:**
  1. App fetches the user's repositories from the GitHub API via a Next.js API route.
  2. API route uses the GitHub access token stored in Appwrite to make the request.
  3. Frontend displays the list of repositories.
  4. User selects a repository.
  5. App saves the selected repository to the user's profile in the Appwrite database via an API route.
  6. App navigates to the main interface, loading the file tree of the selected repository.
- **Technologies:** GitHub API, Next.js API routes, Appwrite database.

### 3. File Selection and Display Flow
- **Trigger:** User selects a repository or navigates the file tree.
- **Steps:**
  1. App fetches the file tree of the selected repository from the GitHub API via an API route.
  2. API route uses the access token to retrieve the file tree.
  3. Frontend renders the file tree in the left column using a tree view component.
  4. User navigates the tree and selects a file.
  5. App fetches the file content from the GitHub API via an API route.
  6. API route retrieves the file content using the access token.
  7. Frontend displays the file content in the Monaco Editor in the middle column.
- **Technologies:** GitHub API, Next.js API routes, Monaco Editor.

### 4. Review Request Flow
- **Trigger:** User clicks "Request Review" for a selected file.
- **Steps:**
  1. Frontend sends a request to an API route with the file path.
  2. API route fetches the file content from GitHub using the access token.
  3. API route sends the file content to the Vercel AI SDK with a predefined system prompt.
  4. AI generates a detailed code review.
  5. API route returns the review to the frontend.
  6. Frontend displays the review in the right column.
  7. API route saves the review to the Appwrite database, linked to the user, repository, and file.
- **Technologies:** Vercel AI SDK, Next.js API routes, Appwrite database.

### 5. Review History Flow
- **Trigger:** User clicks "View Review History" for a selected file.
- **Steps:**
  1. Frontend sends a request to an API route with the file path.
  2. API route queries the Appwrite database for past reviews of the file for the user.
  3. API route returns a list of past reviews with timestamps.
  4. Frontend displays the list in the right column (e.g., dropdown or list).
  5. User can select a past review to view its content.
- **Technologies:** Appwrite database, Next.js API routes.

---

## Data Flow and State Management

- **Global State Management:** [Zustand](https://zustand.surge.sh/)  
  - Manages authentication status, selected repository, selected file, current review, and review history.
- **Data Fetching and Caching:** [SWR](https://swr.vercel.app/)  
  - Fetches and caches repository lists, file trees, and file content to optimize performance.
- **Flow Details:**
  - When the selected repository changes, the file tree is fetched and cached.
  - When the selected file changes, the file content is fetched and displayed in the editor.
  - Reviews are generated on demand and saved to the Appwrite database for future access.

---

## Error Handling and Edge Cases

- **No Repositories:** If the user has no repositories, display a message prompting them to create one on GitHub.
- **Large Files:** If a file exceeds the AI model's token limit, show a warning and either truncate the file or disable the review button.
- **API Rate Limits:** Handle GitHub API rate limits by displaying a message and suggesting the user try again later.
- **Appwrite Errors:** Handle database or authentication errors gracefully with user-friendly messages.
- **AI Review Failures:** If the AI review fails (e.g., due to timeout), display an error and offer a retry option.

---

## Initial App Load Flow

- **Check Authentication:** Verify if the user is authenticated via Appwrite session.
- **Load Last Selected Repository:** If authenticated, fetch the last selected repository from the user's profile in Appwrite.
  - If a repository is selected, load the main interface with the file tree.
  - If not, navigate to repository selection.
- **New Users:** After first login, users are directed to repository selection.

---

## Security Considerations

- **Access Tokens:** GitHub access tokens are stored securely in Appwrite and never exposed to the client.
- **API Routes:** Next.js API routes handle sensitive operations (e.g., GitHub API calls, AI requests) server-side.
- **Rate Limiting:** API routes are rate-limited to prevent abuse.
- **Database Access:** Appwrite database collections use role-based access controls to ensure data security.

---

This `app-flow.md` provides a detailed breakdown of the user journey and system interactions, ensuring the Code Reviewer Web App is intuitive, secure, and efficient.