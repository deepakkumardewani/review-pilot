interface RepoMetadata {
  framework?: string | null;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  packageJsonContent?: string;
}

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export function inferFileContext(
  filePath: string,
  repoMetadata?: RepoMetadata
) {
  const pathParts = filePath.toLowerCase().split("/");
  const fileName = filePath.split("/").pop()?.toLowerCase() || "";
  let context = "generic";

  // Infer context from file path and name
  if (pathParts.includes("src") && pathParts.includes("components")) {
    context = "frontend-component";
  } else if (pathParts.includes("pages") || pathParts.includes("app")) {
    context = "frontend-page";
  } else if (
    pathParts.includes("api") ||
    pathParts.includes("routes") ||
    pathParts.includes("server")
  ) {
    context = "backend-api";
  } else if (pathParts.includes("hooks") || pathParts.includes("hook")) {
    context = "frontend-hook";
  } else if (pathParts.includes("utils") || pathParts.includes("lib")) {
    context = "utility";
  } else if (pathParts.includes("store") || pathParts.includes("state")) {
    context = "state-management";
  } else if (
    pathParts.includes("test") ||
    pathParts.includes("spec") ||
    fileName.includes("test") ||
    fileName.includes("spec")
  ) {
    context = "test";
  } else if (
    [
      "package.json",
      "requirements.txt",
      "pom.xml",
      "yarn.lock",
      "package-lock.json",
    ].includes(fileName)
  ) {
    context = "configuration";
  } else if (
    fileName.endsWith(".config.js") ||
    fileName.endsWith(".config.ts") ||
    fileName.endsWith(".config.mjs")
  ) {
    context = "configuration";
  }

  // Enhance with repo metadata
  const { framework, dependencies, devDependencies } = repoMetadata || {};
  let repoContext = "";

  if (framework) {
    repoContext += `Project uses ${framework} framework. `;
  }

  if (dependencies && Object.keys(dependencies).length > 0) {
    const keyDeps = Object.keys(dependencies).join(", ");
    repoContext += `Dependencies: ${keyDeps}. `;
  }

  if (devDependencies && Object.keys(devDependencies).length > 0) {
    const keyDevDeps = Object.keys(devDependencies).join(", ");
    repoContext += `Dev dependencies: ${keyDevDeps}. `;
  }

  return {
    fileContext: context,
    repoContext: repoContext.trim(),
  };
}

export async function fetchRepoMetadata(
  username: string,
  repoName: string,
  branch: string = "main"
) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/contents/package.json?ref=${branch}`
    );

    if (!response.ok) {
      console.warn("Failed to fetch package.json:", response.status);
      return {};
    }

    const data = await response.json();

    if (data.type !== "file" || !data.content) {
      console.warn("Invalid package.json response");
      return {};
    }

    // Decode base64 content
    const content = atob(data.content);
    const packageJson: PackageJson = JSON.parse(content);

    const framework = detectFramework(packageJson);

    return {
      framework,
      dependencies: packageJson.dependencies || {},
      devDependencies: packageJson.devDependencies || {},
      packageJsonContent: content,
    };
  } catch (error) {
    console.error("Failed to fetch repo metadata:", error);
    return {};
  }
}

function detectFramework(packageJson: PackageJson) {
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  if (deps.react) return "React";
  if (deps.next) return "Next.js";
  if (deps["@angular/core"]) return "Angular";
  if (deps.vue) return "Vue.js";
  if (deps.express) return "Express";
  if (deps.fastify) return "Fastify";
  if (deps.django) return "Django";
  if (deps.flask) return "Flask";
  if (deps["@nestjs/core"]) return "NestJS";
  if (deps.svelte) return "Svelte";
  if (deps.nuxt) return "Nuxt.js";

  return null;
}
