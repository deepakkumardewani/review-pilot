"use client";

import { useFile, useReview } from "@/store/store";
import { Loader2 } from "@/components/ui/icons";
import ReactMarkdown from "react-markdown";

export default function ReviewPanel() {
  const { selectedFile } = useFile();
  const { completion, reviewLoading, reviewError } = useReview();

  if (!selectedFile) {
    return (
      <div className="text-card-foreground">
        <h2 className="text-xl font-semibold mb-4">Review</h2>
        <div className="bg-muted/50 rounded-lg p-6 text-center">
          <p className="text-muted-foreground text-lg">
            No review available. Select a file to review.
          </p>
        </div>
      </div>
    );
  }

  if (!completion && !reviewLoading) {
    return (
      <div className="text-card-foreground">
        <h2 className="text-xl font-semibold mb-4">Review</h2>
        <div className="bg-muted/50 rounded-lg p-6 text-center">
          <p className="text-muted-foreground text-lg mb-2">
            Ready to analyze {selectedFile.name}
          </p>
          <p className="text-sm text-muted-foreground">
            Click the Review button to start code analysis
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-card-foreground h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
        <h2 className="text-xl font-semibold">Review</h2>
        {/* {reviewLoading && (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Analyzing...</span>
          </div>
        )} */}
      </div>

      <div className="flex-1 overflow-y-auto">
        {reviewError && (
          <div className="text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg mb-6 border border-red-200 dark:border-red-800">
            <h3 className="font-semibold mb-2">Error generating review</h3>
            <p className="text-sm">{reviewError.message}</p>
          </div>
        )}

        {completion && (
          <div className="prose prose-gray dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:border prose-pre:border-border">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold mb-4 text-foreground border-b border-border pb-2">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-medium mt-4 mb-2 text-foreground">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 leading-relaxed text-foreground/90">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-4 ml-4 space-y-1">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="text-foreground/90 leading-relaxed">
                    {children}
                  </li>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground border">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="block bg-muted p-3 rounded-lg text-sm font-mono text-foreground border border-border overflow-x-auto">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-muted p-4 rounded-lg border border-border overflow-x-auto mb-4">
                    {children}
                  </pre>
                ),
              }}
            >
              {completion}
            </ReactMarkdown>
          </div>
        )}

        {reviewLoading && !completion && (
          <div className="bg-muted/50 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-lg font-medium text-foreground">
                Analyzing {selectedFile.name}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              This may take a few moments...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
