"use client";

import { Editor } from "@monaco-editor/react";
import { fetchRepoMetadata, inferFileContext } from "@/lib/context";
import { createPackageJsonEmbedding } from "@/lib/embeddings";
import { useFile, useRepository, useReview } from "@/store/store";
import { useFileContent } from "@/hooks/useRepositoryData";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useCompletion } from "@ai-sdk/react";
import { useEffect } from "react";

export default function CodeEditor() {
  const { selectedFile } = useFile();
  const { selectedRepository, username } = useRepository();
  const { theme } = useTheme();
  const { fileContent, isLoading, error } = useFileContent(
    selectedFile?.url || null
  );

  const { setCompletion, setReviewLoading, setReviewError, clearReview } =
    useReview();

  const {
    complete,
    completion,
    isLoading: isReviewLoading,
  } = useCompletion({
    api: "/api/review",
    onResponse: (response) => {
      if (!response.ok) {
        console.error("Review API error:", response.statusText);
        setReviewError(new Error(`API Error: ${response.statusText}`));
      }
    },
    onFinish: (completion) => {
      setReviewLoading(false);
    },
    onError: (err) => {
      setReviewError(err);
      setReviewLoading(false);
    },
  });

  // Update store loading state when useCompletion loading changes
  useEffect(() => {
    setReviewLoading(isReviewLoading);
  }, [isReviewLoading]);

  // Update store with streaming completion
  useEffect(() => {
    if (completion) {
      setCompletion(completion);
    }
  }, [completion]);

  // Clear review when file changes
  // useEffect(() => {
  //   clearReview();
  // }, [selectedFile]);

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

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Code</h2>
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
      <div className="flex-grow border border-border rounded">
        <Editor
          height="100%"
          language={selectedFile?.language || "javascript"}
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
      </div>
    </div>
  );
}
