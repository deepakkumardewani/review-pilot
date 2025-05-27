export const codeReviewPrompt = (
  language: string,
  fileContent: string,
  fileContext: string,
  repoContext: string,
  embedding?: number[] | null
) => {
  const languageSpecific = getLanguageSpecificGuidelines(language);

  return `You are an expert code reviewer with deep knowledge of ${language}. Analyze the provided code in the context of a ${fileContext} file within a repository where: ${repoContext}

Provide detailed, actionable feedback focusing on:

## 1. **Security Vulnerabilities**
Identify issues like injection attacks, hardcoded secrets, insecure dependencies, or authentication flaws. Suggest specific fixes with code examples.

## 2. **Code Style & Standards**
Ensure consistency, readability, and adherence to ${language}-specific conventions (e.g., ${languageSpecific.conventions}). Focus on critical style issues that affect maintainability.

## 3. **Performance Optimizations**
Highlight inefficient algorithms, resource usage, memory leaks, or opportunities for async operations. Suggest specific improvements.

## 4. **Code Logic and Correctness**
Identify bugs, edge cases, improper error handling, or logical inconsistencies. Provide solutions.

## 5. **Maintainability and Modularity**
Evaluate code organization, separation of concerns, and suggest refactoring opportunities. Focus on long-term maintainability.

## 6. **${fileContext} Specific Best Practices**
${getContextSpecificGuidelines(fileContext)}

**Instructions:**
- Tailor feedback to the file's role (${fileContext}) and project context (${repoContext})
- Provide feedback in markdown format with clear sections
- Include code snippets where relevant
- Prioritize issues by severity (Critical, Important, Suggestion)
- Be constructive and educational in your feedback
- If the code is well-written, acknowledge what's done well

**Code to Review:**
\`\`\`${language}
${fileContent}
\`\`\`

${embedding ? "**Repository Context**: Enhanced with semantic analysis of the project structure and dependencies." : ""}`;
};

function getLanguageSpecificGuidelines(language: string): {
  conventions: string;
} {
  const guidelines: Record<string, { conventions: string }> = {
    javascript: { conventions: "ESLint, Prettier, camelCase naming" },
    typescript: {
      conventions: "TSLint/ESLint, strict typing, interfaces over types",
    },
    python: { conventions: "PEP 8, snake_case naming, type hints" },
    java: {
      conventions: "Google Java Style, camelCase, proper exception handling",
    },
    "c#": { conventions: "Microsoft coding conventions, PascalCase" },
    go: { conventions: "gofmt, effective Go guidelines" },
    rust: { conventions: "rustfmt, Rust style guide, ownership patterns" },
    jsx: {
      conventions:
        "React best practices, hooks patterns, component composition",
    },
    tsx: {
      conventions: "React + TypeScript best practices, proper prop typing",
    },
    css: { conventions: "BEM methodology, consistent naming, mobile-first" },
    scss: {
      conventions: "Sass best practices, nesting limits, variable usage",
    },
    html: {
      conventions: "semantic HTML, accessibility standards, W3C validation",
    },
    json: { conventions: "proper formatting, schema validation" },
    yaml: { conventions: "consistent indentation, proper syntax" },
    sql: { conventions: "standard SQL formatting, security best practices" },
  };

  return (
    guidelines[language.toLowerCase()] || {
      conventions: "industry standard practices",
    }
  );
}

function getContextSpecificGuidelines(fileContext: string): string {
  const contextGuidelines: Record<string, string> = {
    "frontend-component":
      "Focus on component reusability, prop validation, accessibility, and performance optimizations like memoization.",
    "frontend-page":
      "Evaluate routing, data fetching patterns, SEO considerations, and user experience.",
    "frontend-hook":
      "Review hook dependencies, cleanup functions, and proper use of React hook patterns.",
    "backend-api":
      "Check authentication, authorization, input validation, error handling, and API design patterns.",
    utility:
      "Ensure pure functions, proper error handling, comprehensive testing, and clear documentation.",
    "state-management":
      "Review state structure, immutability, action patterns, and performance implications.",
    test: "Evaluate test coverage, test quality, mock usage, and testing best practices.",
    configuration:
      "Check security of exposed values, proper environment handling, and documentation.",
    generic:
      "Apply general code quality principles and language-specific best practices.",
  };

  return contextGuidelines[fileContext] || contextGuidelines["generic"];
}
