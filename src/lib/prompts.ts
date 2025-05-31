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

**CRITICAL: Code Suggestion Format**
For each code suggestion, use this EXACT format:

### [Issue Type]: [Brief Description]
**Issue:** [Explain the problem]

**Current Code:**
\`\`\`${language}
[exact code that needs to be changed]
\`\`\`

**Suggested Fix:**
\`\`\`${language}
[the improved/corrected version of the same code]
\`\`\`

**Explanation:** [Why this change improves the code]

---

**Instructions:**
- Tailor feedback to the file's role (${fileContext}) and project context (${repoContext})
- Provide feedback in markdown format with clear sections
- **ONLY show the specific lines/sections that need changes in the Current Code/Suggested Fix blocks**
- **Do NOT include entire functions unless the entire function needs to be rewritten**
- **Focus on targeted, line-specific improvements**
- Use the exact format above for every code suggestion
- Prioritize issues by severity (Critical, Important, Suggestion)
- Be constructive and educational in your feedback
- If the code is well-written, acknowledge what's done well
- Separate each suggestion with "---"

**Code to Review:**
\`\`\`${language}
${fileContent}
\`\`\`

${embedding ? "**Repository Context**: Enhanced with semantic analysis of the project structure and dependencies." : ""}`;
};

export const agentPrompts = {
  security: (
    language: string,
    fileContent: string,
    fileContext: string,
    repoContext: string
  ) => {
    return `You are an expert security code reviewer specializing in ${language} security vulnerabilities. Analyze the provided code in the context of a ${fileContext} file within a repository where: ${repoContext}

**Focus Areas:**
- Injection attacks (SQL, XSS, Command injection)
- Authentication and authorization flaws
- Hardcoded secrets and sensitive data exposure
- Insecure dependencies and configurations
- Data validation and sanitization issues
- Cryptographic vulnerabilities
- Session management problems

**CRITICAL: Code Suggestion Format**
For each security issue, use this EXACT format:

### Security: [Brief Description]
**Issue:** [Explain the security vulnerability and potential impact]

**Current Code:**
\`\`\`${language}
[exact code that has the security issue]
\`\`\`

**Suggested Fix:**
\`\`\`${language}
[the secure version of the same code]
\`\`\`

**Explanation:** [Why this change improves security and prevents the vulnerability]

---

**Code to Review:**
\`\`\`${language}
${fileContent}
\`\`\``;
  },

  performance: (
    language: string,
    fileContent: string,
    fileContext: string,
    repoContext: string
  ) => {
    return `You are an expert performance code reviewer specializing in ${language} optimization. Analyze the provided code in the context of a ${fileContext} file within a repository where: ${repoContext}

**Focus Areas:**
- Algorithm efficiency and Big O complexity
- Memory usage and potential leaks
- Database query optimization
- Async/await patterns and concurrency
- Resource management and cleanup
- Caching opportunities
- Bundle size and loading performance
- Network request optimization

**CRITICAL: Code Suggestion Format**
For each performance issue, use this EXACT format:

### Performance: [Brief Description]
**Issue:** [Explain the performance problem and its impact]

**Current Code:**
\`\`\`${language}
[exact code that has performance issues]
\`\`\`

**Suggested Fix:**
\`\`\`${language}
[the optimized version of the same code]
\`\`\`

**Explanation:** [Why this change improves performance and the expected impact]

---

**Code to Review:**
\`\`\`${language}
${fileContent}
\`\`\``;
  },

  codeStyle: (
    language: string,
    fileContent: string,
    fileContext: string,
    repoContext: string
  ) => {
    const languageSpecific = getLanguageSpecificGuidelines(language);
    return `You are an expert code style reviewer specializing in ${language} conventions. Analyze the provided code in the context of a ${fileContext} file within a repository where: ${repoContext}

**Focus Areas:**
- ${languageSpecific.conventions}
- Naming conventions and consistency
- Code formatting and structure
- Documentation and comments
- Import organization
- File structure and organization
- Linting rule compliance

**CRITICAL: Code Suggestion Format**
For each style issue, use this EXACT format:

### Code Style: [Brief Description]
**Issue:** [Explain the style problem and why it matters]

**Current Code:**
\`\`\`${language}
[exact code that doesn't follow style guidelines]
\`\`\`

**Suggested Fix:**
\`\`\`${language}
[the properly styled version of the same code]
\`\`\`

**Explanation:** [Why this change improves code style and maintainability]

---

**Code to Review:**
\`\`\`${language}
${fileContent}
\`\`\``;
  },

  logic: (
    language: string,
    fileContent: string,
    fileContext: string,
    repoContext: string
  ) => {
    return `You are an expert logic code reviewer specializing in ${language} correctness. Analyze the provided code in the context of a ${fileContext} file within a repository where: ${repoContext}

**Focus Areas:**
- Logical errors and bugs
- Edge case handling
- Error handling and recovery
- Input validation
- Null/undefined checks
- Race conditions
- State management issues
- Business logic correctness

**CRITICAL: Code Suggestion Format**
For each logic issue, use this EXACT format:

### Logic: [Brief Description]
**Issue:** [Explain the logical problem and potential consequences]

**Current Code:**
\`\`\`${language}
[exact code that has logical issues]
\`\`\`

**Suggested Fix:**
\`\`\`${language}
[the corrected version of the same code]
\`\`\`

**Explanation:** [Why this change fixes the logic issue and prevents bugs]

---

**Code to Review:**
\`\`\`${language}
${fileContent}
\`\`\``;
  },

  maintainability: (
    language: string,
    fileContent: string,
    fileContext: string,
    repoContext: string
  ) => {
    return `You are an expert maintainability code reviewer specializing in ${language} architecture. Analyze the provided code in the context of a ${fileContext} file within a repository where: ${repoContext}

**Focus Areas:**
- Code organization and modularity
- Separation of concerns
- DRY (Don't Repeat Yourself) principle
- Single Responsibility Principle
- Code reusability
- Abstraction levels
- Dependency management
- Refactoring opportunities
- ${getContextSpecificGuidelines(fileContext)}

**CRITICAL: Code Suggestion Format**
For each maintainability issue, use this EXACT format:

### Maintainability: [Brief Description]
**Issue:** [Explain the maintainability problem and long-term impact]

**Current Code:**
\`\`\`${language}
[exact code that affects maintainability]
\`\`\`

**Suggested Fix:**
\`\`\`${language}
[the more maintainable version of the same code]
\`\`\`

**Explanation:** [Why this change improves maintainability and code quality]

---

**Code to Review:**
\`\`\`${language}
${fileContent}
\`\`\``;
  },
};

export const AGENT_TYPES = {
  security: "Security Review Agent",
  performance: "Performance Review Agent",
  codeStyle: "Code Style Review Agent",
  logic: "Logic & Correctness Review Agent",
  maintainability: "Maintainability Review Agent",
} as const;

export type AgentType = keyof typeof AGENT_TYPES;

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
