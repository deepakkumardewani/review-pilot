import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { codeReviewPrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    // Extract the data from the request body
    const { language, fileContent, fileContext, repoContext, embedding } =
      await req.json();

    console.log(language, fileContext, repoContext, typeof embedding);
    // Check if required fields are provided
    if (!language || !fileContent || !fileContext || !repoContext) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Generate the system prompt
    const systemPrompt = codeReviewPrompt(
      language,
      fileContent,
      fileContext,
      repoContext,
      embedding
    );

    // Use the streamText function to generate text with streaming
    const result = streamText({
      model: openai("gpt-4o"),
      system: `You are an expert code reviewer. Provide comprehensive, actionable feedback in markdown format. Focus on security, performance, maintainability, and best practices.`,
      prompt: systemPrompt,
      temperature: 0.3,
      maxTokens: 2000,
      onError({ error }) {
        console.error("[Server] Error generating review:", error);
      },
    });

    // Return the streaming response
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("[Server] Unhandled error in review API:", error);
    return NextResponse.json(
      { error: "Failed to generate review" },
      { status: 500 }
    );
  }
}
