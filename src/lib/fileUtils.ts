// Utility functions for file handling

// Map file extensions to Monaco Editor language identifiers
export const getLanguageFromFilename = (filename: string): string => {
  const extension = filename.split(".").pop()?.toLowerCase();

  const languageMap: Record<string, string> = {
    // JavaScript/TypeScript
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    mjs: "javascript",

    // Web languages
    html: "html",
    htm: "html",
    css: "css",
    scss: "scss",
    sass: "scss",
    less: "less",

    // Data formats
    json: "json",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",

    // Programming languages
    py: "python",
    java: "java",
    c: "c",
    cpp: "cpp",
    cc: "cpp",
    cxx: "cpp",
    cs: "csharp",
    php: "php",
    rb: "ruby",
    go: "go",
    rs: "rust",
    swift: "swift",
    kt: "kotlin",
    kts: "kotlin",
    vue: "vue",
    svelte: "svelte",

    // Shell/Config
    sh: "shell",
    bash: "shell",
    zsh: "shell",
    fish: "shell",
    ps1: "powershell",
    bat: "bat",
    cmd: "bat",

    // Markup/Documentation
    md: "markdown",
    markdown: "markdown",
    tex: "latex",
    txt: "plaintext",

    // Configuration
    dockerfile: "dockerfile",
    env: "shell",
    ini: "ini",
    toml: "toml",
    cfg: "ini",
    conf: "ini",

    // SQL
    sql: "sql",
    mysql: "sql",
    postgres: "sql",
    sqlite: "sql",
  };

  // Special cases for files without extensions
  if (!extension) {
    const lowerFilename = filename.toLowerCase();
    if (lowerFilename === "dockerfile") return "dockerfile";
    if (lowerFilename === "makefile") return "makefile";
    if (lowerFilename === "readme") return "markdown";
    if (lowerFilename === "license") return "plaintext";
    if (lowerFilename === "changelog") return "markdown";
  }

  return languageMap[extension || ""] || "plaintext";
};

// Decode base64 content from GitHub API
export const decodeBase64Content = (base64Content: string): string => {
  try {
    // Clean the base64 string (remove newlines and whitespace)
    const cleanBase64 = base64Content.replace(/\s/g, "");
    // Decode base64 to string
    return atob(cleanBase64);
  } catch (error) {
    console.error("Failed to decode base64 content:", error);
    return "Error: Failed to decode file content";
  }
};
