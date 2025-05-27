# Product Requirements Document (PRD)

## Code Reviewer Web App

### Introduction
This document outlines the requirements for a web-based code review application integrated with GitHub and powered by Appwrite for authentication and database management. The app allows users to log in via GitHub, grant access to a specific repository, and request AI-generated reviews for individual files. The interface features a three-column layout displaying the repository’s file tree, the selected file’s content, and the AI-generated review. The goal is to provide detailed, actionable feedback on code quality, beyond basic linting or formatting checks, with user data and review history stored securely using Appwrite.

### Objectives
- Enable secure user authentication via GitHub OAuth, managed by Appwrite.
- Store user preferences and review history in an Appwrite database.
- Provide a clear, three-column interface for repository navigation, code display, and review feedback.
- Generate detailed code reviews using the Vercel AI SDK with tailored system prompts.
- Display code with syntax highlighting using the Monaco Editor.
- Ensure a secure, intuitive, and responsive user experience.

### Target Audience
- Developers seeking automated, in-depth code feedback.
- Teams enhancing manual code reviews with AI insights.
- GitHub users managing code in repositories.

### Functional Requirements

#### User Authentication
- Users log in using their GitHub account via OAuth, facilitated by Appwrite’s OAuth2 provider integration.
- Appwrite handles session management and secure storage of GitHub access tokens.
- The app requests the `repo` scope from GitHub to access repository contents.

#### User Data Storage
- Appwrite stores user data, including:
  - User ID (from GitHub).
  - Selected repository preferences (e.g., last accessed repository).
  - Review history (file reviewed, review content, timestamp).
- Data is stored in an Appwrite database collection with appropriate access controls.

#### Repository Selection
- Post-login, users select a repository from a list of their GitHub repositories, fetched via the GitHub API.
- The selected repository is saved to the user’s Appwrite profile for quick access in future sessions.

#### File Tree Display
- The left column shows the file tree structure of the selected repository.
- Users can navigate directories and select files for review.
- Only code files (e.g., `.js`, `.py`, `.ts`) are selectable for review.

#### File Content Display
- The middle column displays the selected file’s content.
- The Monaco Editor is used for syntax highlighting and code presentation.
- The display is read-only and supports multiple programming languages.

#### Code Review Generation
- Users request a review for the selected file via a button.
- The app sends the file content to the Vercel AI SDK for processing.
- The AI generates a review focusing on code quality, logic, best practices, and potential issues.
- The review is saved to the Appwrite database, linked to the user and file.

#### Review Feedback
- The right column displays the AI-generated review.
- Feedback is detailed, actionable, and excludes basic linting or formatting comments unless they impact readability or maintainability.
- Reviews are formatted for readability (e.g., using markdown).
- Users can view past reviews for the same file from the Appwrite database.

### Non-Functional Requirements

#### Performance
- Repository data and file contents load with minimal delay.
- AI review generation and database queries are optimized for quick response times.
- Appwrite database operations (e.g., saving reviews) are efficient.

#### Security
- Appwrite secures user sessions and GitHub access tokens using its built-in security features.
- Database collections are configured with role-based access (e.g., read/write for authenticated users only).
- The app adheres to OAuth best practices and requests only necessary GitHub permissions.

#### Usability
- The three-column layout is responsive and adapts to various screen sizes.
- Tooltips or instructions guide first-time users.
- Review history is easily accessible via a toggle or button.

#### Scalability
- The app handles multiple concurrent users and repositories efficiently.
- Appwrite’s database scales to accommodate growing review history.
- API rate limits (GitHub and Vercel AI SDK) are managed appropriately.

### Technical Stack
- **Frontend:** Next.js, Shadcn, Tailwind CSS, Lucide Icons, Monaco Editor
- **Backend:** Next.js API routes or serverless functions
- **Authentication and Database:** Appwrite (OAuth2 for GitHub login, database for user data and reviews)
- **AI:** Vercel AI SDK with custom system prompts and embeddings (if applicable)
- **External API:** GitHub API for repository and file access

### User Interface

#### Login Page
- A clean page with a “Login with GitHub” button, powered by Appwrite’s OAuth integration.

#### Repository Selection
- A dropdown or list of user repositories, fetched post-authentication via the GitHub API.
- Users select one repository, which is saved to their Appwrite profile.

#### Main Interface
- **Three-Column Layout:**
  - **Left:** File tree with clickable files and folders (using Lucide Icons for visuals).
  - **Middle:** Monaco Editor showing the selected file’s content.
  - **Right:** Review panel, initially empty, populated after a review request or when viewing past reviews.
- A “Request Review” button triggers AI analysis.
- A “View Review History” button fetches past reviews from Appwrite for the selected file.

#### Review Display
- The review appears in the right column, formatted for clarity (e.g., bullet points, markdown).
- Past reviews are accessible via a dropdown or list in the review panel.
- Loading states (e.g., spinners) are shown during review generation or database queries.

### AI Model Integration
- The Vercel AI SDK interfaces with an AI model suited for code analysis.
- A system prompt is defined, e.g., “You are an expert code reviewer. Analyze the provided code for quality, potential bugs, performance, and best practices. Provide detailed, actionable feedback.”
- Embeddings may be used to enhance context (optional, based on SDK capabilities).
- Large files are truncated or flagged if they exceed model token limits.

### Data Handling
- **GitHub API:** Fetches repository file trees and file contents.
- **Appwrite Database:**
  - **Users Collection:**
    - Fields: `userId` (GitHub ID), `email`, `lastSelectedRepo`, `createdAt`.
    - Access: Read/write for authenticated user.
  - **Reviews Collection:**
    - Fields: `userId`, `repoId`, `filePath`, `reviewContent`, `createdAt`.
    - Access: Read/write for authenticated user, read-only for admins (if applicable).
- Only the selected file’s content is sent to the AI model.
- Large files trigger a warning or are processed in chunks if feasible.

### Error Handling
- Errors from GitHub API (e.g., rate limits, permissions) display user-friendly messages.
- Appwrite errors (e.g., authentication failures, database issues) are handled gracefully.
- AI model failures (e.g., timeouts) prompt retry options or explanations.
- Invalid file types disable the review button with a tooltip.

### Future Enhancements
- Review entire repositories or pull requests.
- Support for additional version control platforms (e.g., GitLab).
- User-configurable AI review focus (e.g., security, performance).
- Logout functionality and repository reselection.
- Advanced review history filtering (e.g., by date, file, or repository).

### Testing
- Unit tests for UI components, Appwrite integrations, and API routes.
- Integration tests for OAuth flow, database operations, and AI review pipeline.
- User testing to validate interface usability and review quality.

### Deployment
- Hosted on Vercel, leveraging Next.js and the AI SDK.
- Appwrite instance hosted on Appwrite Cloud or self-hosted, configured with environment variables for security.
- Environment variables secure sensitive data (e.g., Appwrite API keys, OAuth secrets).

### Documentation
- **User Guide:** Steps to log in, select a repo, request reviews, and view review history.
- **Developer Docs:** Details on Appwrite setup, AI integration, and GitHub API usage.

### Assumptions
- Users have GitHub accounts with at least one repository.
- The Vercel AI SDK provides a model capable of detailed code analysis.
- Appwrite’s OAuth2 provider supports GitHub login seamlessly.
- Desktop usage is prioritized, with mobile as a secondary concern.

### Constraints
- GitHub API rate limits may restrict frequent requests.
- Vercel AI SDK costs and token limits may impact large file reviews.
- Appwrite database quotas may require monitoring for high usage.
- Initial version focuses on single-file reviews.

### Compliance and Legal
- Complies with GitHub API and Appwrite terms of service.
- Adheres to data privacy laws (e.g., GDPR) for user data handling in Appwrite.
- Includes a privacy policy detailing data usage, storage, and Appwrite’s role.

---

This updated PRD incorporates Appwrite for secure authentication and database management, aligning with your specified flow and technology choices. It ensures a robust, user-friendly experience while leveraging AI for valuable code insights and Appwrite for data persistence.