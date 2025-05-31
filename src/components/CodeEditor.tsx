"use client";

import { Editor, DiffEditor } from "@monaco-editor/react";
import { fetchRepoMetadata, inferFileContext } from "@/lib/context";
import { createPackageJsonEmbedding } from "@/lib/embeddings";
import { useFile, useRepository, useReview } from "@/store/store";
import { useFileContent } from "@/hooks/useRepositoryData";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useCompletion } from "@ai-sdk/react";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Check, ChevronDown } from "@/components/ui/icons";
import { AGENT_TYPES, AgentType } from "@/lib/prompts";

export default function CodeEditor() {
  const { selectedFile } = useFile();
  const { selectedRepository, username } = useRepository();
  const { theme } = useTheme();
  const { fileContent, isLoading, error } = useFileContent(
    selectedFile?.url || null
  );

  const { setCompletion, setReviewLoading, setReviewError, clearReview } =
    useReview();

  const [viewMode, setViewMode] = useState<"editor" | "diff">("editor");
  const [modifiedCode, setModifiedCode] = useState<string>("");
  const [selectedAgents, setSelectedAgents] = useState<AgentType[]>([]);
  const [isAgentSelectorOpen, setIsAgentSelectorOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getSelectedAgentsDisplay = useMemo(() => {
    if (selectedAgents.length === 0) return "Select Agents";
    if (selectedAgents.length === 1)
      return `${selectedAgents.length} agent selected`;
    return `${selectedAgents.length} agents selected`;
  }, [selectedAgents]);

  const {
    completion,
    complete,
    isLoading: isReviewLoading,
  } = useCompletion({
    api: "/api/review",
    onResponse: (response) => {
      console.log("response", response);
      if (!response.ok) {
        console.error("Review API error:", response.statusText);
        setReviewError(new Error(`API Error: ${response.statusText}`));
      }
    },
    onFinish: () => {
      setReviewLoading(false);
    },
    onError: (err) => {
      setReviewError(err);
      setReviewLoading(false);
    },
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsAgentSelectorOpen(false);
      }
    };

    if (isAgentSelectorOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isAgentSelectorOpen]);

  // Close dropdown during streaming to prevent conflicts
  useEffect(() => {
    if (isReviewLoading) {
      setIsAgentSelectorOpen(false);
    }
  }, [isReviewLoading]);

  // Update store loading state when useCompletion loading changes
  useEffect(() => {
    setReviewLoading(isReviewLoading);
  }, [isReviewLoading, setReviewLoading]);

  // Update store with streaming completion
  useEffect(() => {
    if (completion) {
      setCompletion(completion);
    }
  }, [completion, setCompletion]);

  // Parse code suggestions from markdown review
  useEffect(() => {
    if (completion && fileContent) {
      const parsedCode = parseCodeSuggestions(completion, fileContent);
      if (parsedCode && parsedCode !== fileContent) {
        setModifiedCode(parsedCode);
      }
    }
  }, [completion, fileContent]);

  // Clear diff view when file changes
  useEffect(() => {
    setViewMode("editor");
    setModifiedCode("");
  }, [selectedFile?.url]);

  const parseCodeSuggestions = (
    markdown: string,
    originalCode: string
  ): string => {
    // Parse the structured format: Current Code -> Suggested Fix pairs
    const suggestionPattern =
      /\*\*Current Code:\*\*\s*```[\w]*\n([\s\S]*?)```\s*\*\*Suggested Fix:\*\*\s*```[\w]*\n([\s\S]*?)```/g;

    let modifiedCode = originalCode;
    const suggestions: Array<{ current: string; suggested: string }> = [];

    let match;
    while ((match = suggestionPattern.exec(markdown)) !== null) {
      const currentCode = match[1].trim();
      const suggestedCode = match[2].trim();

      if (currentCode && suggestedCode && currentCode !== suggestedCode) {
        suggestions.push({ current: currentCode, suggested: suggestedCode });
      }
    }

    // Apply each suggestion by finding and replacing the current code with suggested code
    suggestions.forEach(({ current, suggested }) => {
      // Normalize whitespace for matching
      const normalizeCode = (code: string) => code.replace(/\s+/g, " ").trim();

      const normalizedCurrent = normalizeCode(current);
      const normalizedOriginal = normalizeCode(modifiedCode);

      // Find the current code in the original
      const index = normalizedOriginal.indexOf(normalizedCurrent);

      if (index !== -1) {
        // Find the actual position in the original code (accounting for whitespace)
        const lines = modifiedCode.split("\n");
        let foundLine = -1;
        let foundStartChar = -1;
        let foundEndChar = -1;

        // Try to find the exact match by lines
        for (let i = 0; i < lines.length; i++) {
          const remainingLines = lines.slice(i);
          const candidateText = remainingLines.join("\n");

          if (normalizeCode(candidateText).startsWith(normalizedCurrent)) {
            // Count how many lines the current code spans
            const currentLines = current.split("\n");
            const endLineIndex = i + currentLines.length - 1;

            if (endLineIndex < lines.length) {
              foundLine = i;
              foundStartChar =
                lines.slice(0, i).join("\n").length + (i > 0 ? 1 : 0);
              foundEndChar = lines.slice(0, endLineIndex + 1).join("\n").length;
              break;
            }
          }
        }

        if (foundLine !== -1) {
          // Replace the found section with suggested code
          const before = modifiedCode.substring(0, foundStartChar);
          const after = modifiedCode.substring(foundEndChar);
          modifiedCode = before + suggested + after;
        } else {
          // Fallback: simple string replacement
          modifiedCode = modifiedCode.replace(current, suggested);
        }
      }
    });

    return suggestions.length > 0 ? modifiedCode : originalCode;
  };

  const handleAgentToggle = useCallback((agentType: AgentType) => {
    setSelectedAgents((prev) =>
      prev.includes(agentType)
        ? prev.filter((agent) => agent !== agentType)
        : [...prev, agentType]
    );
  }, []);

  const toggleDropdown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isReviewLoading) {
        setIsAgentSelectorOpen((prev) => !prev);
      }
    },
    [isReviewLoading]
  );

  const handleReview = async () => {
    if (!selectedFile || !selectedRepository || !fileContent) {
      console.warn("Missing required data for review");
      return;
    }

    startReview();
  };

  const startReview = async () => {
    if (!selectedFile || !selectedRepository || !fileContent) {
      console.warn("Missing required data for review");
      return;
    }

    clearReview();
    setReviewLoading(true);

    try {
      // Fetch repository metadata
      const repoMetadata = await fetchRepoMetadata(
        username,
        selectedRepository.name,
        selectedRepository.default_branch
      );

      // Infer file context
      const { fileContext, repoContext } = inferFileContext(
        selectedFile.path,
        repoMetadata
      );

      // Create embeddings if package.json content is available
      let embedding = null;
      if (repoMetadata.packageJsonContent) {
        embedding = await createPackageJsonEmbedding(
          repoMetadata.packageJsonContent
        );
      }

      // Start the review
      await complete("", {
        body: {
          language: selectedFile.language || "javascript",
          fileContent,
          fileContext,
          repoContext,
          embedding,
          selectedAgents:
            selectedAgents.length > 0 ? selectedAgents : undefined,
        },
      });
    } catch (error) {
      console.error("Error starting review:", error);
      setReviewError(
        error instanceof Error ? error : new Error("Unknown error")
      );
      setReviewLoading(false);
    }
  };

  const getEditorValue = () => {
    if (!selectedFile) {
      return "// Select a file to view its code";
    }
    if (error) {
      return "// Error loading file content";
    }
    if (isLoading) {
      return "// Loading file content...";
    }
    return fileContent || "// No content available";
  };

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === "editor" ? "diff" : "editor"));
  }, []);

  const getLanguage = () => {
    if (!selectedFile) return "javascript";
    if (
      selectedFile.path.endsWith(".tsx") ||
      selectedFile.path.endsWith(".jsx")
    )
      return "javascript";
    if (selectedFile.path.endsWith(".ts")) return "typescript";
    return selectedFile.language || "javascript";
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Code</h2>
          {completion && modifiedCode && modifiedCode !== fileContent && (
            <Button
              onClick={toggleViewMode}
              disabled={isReviewLoading}
              variant="outline"
              size="sm"
              className="cursor-pointer"
            >
              {viewMode === "editor" ? "Show Diff" : "Show Code"}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative" ref={dropdownRef}>
            <Button
              onClick={toggleDropdown}
              disabled={isReviewLoading}
              variant="outline"
              size="sm"
              className="cursor-pointer min-w-[180px] justify-between"
            >
              {getSelectedAgentsDisplay}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>

            {isAgentSelectorOpen && (
              <div className="absolute top-full left-0 mt-1 w-80 bg-popover border border-border rounded-md shadow-lg z-50">
                <div className="p-3 space-y-2">
                  <h4 className="font-medium text-sm">Select Review Agents</h4>
                  <div className="space-y-2">
                    {Object.entries(AGENT_TYPES).map(([key, label]) => {
                      const agentType = key as AgentType;
                      const isSelected = selectedAgents.includes(agentType);
                      return (
                        <div
                          key={key}
                          className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded-sm"
                          onClick={() => handleAgentToggle(agentType)}
                        >
                          <div
                            className={`flex items-center justify-center w-4 h-4 border rounded-sm ${
                              isSelected
                                ? "bg-primary border-primary"
                                : "border-input"
                            }`}
                          >
                            {isSelected && (
                              <Check className="h-3 w-3 text-primary-foreground" />
                            )}
                          </div>
                          <span className="text-sm">{label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={handleReview}
            disabled={
              !selectedFile || !fileContent || isLoading || isReviewLoading
            }
            variant="default"
            size="sm"
            className="cursor-pointer"
          >
            Review File
          </Button>
        </div>
      </div>
      <div className="flex-grow border border-border rounded">
        {viewMode === "diff" && completion && modifiedCode ? (
          <DiffEditor
            height="100%"
            language={getLanguage()}
            original={getEditorValue()}
            modified={modifiedCode}
            theme={theme === "dark" ? "vs-dark" : "light"}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              wordWrap: "on",
              automaticLayout: true,
              renderSideBySide: true,
              ignoreTrimWhitespace: false,
            }}
            loading={isLoading ? "Loading file content..." : undefined}
          />
        ) : (
          <Editor
            height="100%"
            language={getLanguage()}
            value={getEditorValue()}
            theme={theme === "dark" ? "vs-dark" : "light"}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              wordWrap: "on",
              automaticLayout: true,
            }}
            loading={isLoading ? "Loading file content..." : undefined}
          />
        )}
      </div>
    </div>
  );
}
