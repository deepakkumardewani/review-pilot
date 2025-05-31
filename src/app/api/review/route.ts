import { openai } from "@ai-sdk/openai";
import { streamText, generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { codeReviewPrompt, agentPrompts, AgentType } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    // Extract the data from the request body
    const {
      language,
      fileContent,
      fileContext,
      repoContext,
      embedding,
      selectedAgents,
    } = await req.json();

    // console.log(language, fileContext, repoContext, typeof embedding);
    // Check if required fields are provided
    if (!language || !fileContent || !fileContext || !repoContext) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // If no agents selected, use the original single agent approach
    if (!selectedAgents || selectedAgents.length === 0) {
      const systemPrompt = codeReviewPrompt(
        language,
        fileContent,
        fileContext,
        repoContext,
        embedding
      );

      const result = streamText({
        model: openai("gpt-4.1-nano"),
        system: `You are an expert code reviewer. Provide comprehensive, actionable feedback in markdown format. Focus on security, performance, maintainability, and best practices.`,
        prompt: systemPrompt,
        temperature: 0.3,
        maxTokens: 2000,
        onError({ error }) {
          console.error("[Server] Error generating review:", error);
        },
      });

      return result.toDataStreamResponse();
    }

    // Run multiple agents in parallel
    const agentReviews = await Promise.all(
      selectedAgents.map(async (agentType: AgentType) => {
        const agentPrompt = agentPrompts[agentType](
          language,
          fileContent,
          fileContext,
          repoContext
        );

        const { text } = await generateText({
          model: openai("gpt-4.1-nano"),
          system: `You are a specialized code review agent. Focus only on your domain of expertise and provide targeted feedback.`,
          prompt: agentPrompt,
          temperature: 0.3,
          maxTokens: 1500,
        });

        return {
          type: agentType,
          review: text,
        };
      })
    );

    // Create summary prompt with all agent reviews
    const summaryPrompt = `You are a technical lead synthesizing multiple specialized code review reports. 

The following agents have reviewed the code:
${agentReviews.map((review) => `\n## ${review.type.toUpperCase()} AGENT REVIEW:\n${review.review}`).join("\n")}

Create a comprehensive, well-organized summary that:
1. Highlights the most critical issues across all domains
2. Maintains the exact code suggestion format from individual agents
3. Prioritizes issues by severity (Critical, Important, Suggestion)
4. Removes any duplicate suggestions
5. Provides an executive summary at the top

Format: Use markdown with clear sections. Keep all "Current Code" and "Suggested Fix" blocks exactly as provided by agents.`;

    // Stream the aggregated summary
    const result = streamText({
      model: openai("gpt-4.1-nano"),
      system: `You are an expert technical lead summarizing code reviews. Maintain the exact formatting from individual agents while creating a cohesive, prioritized summary.`,
      prompt: summaryPrompt,
      temperature: 0.2,
      maxTokens: 3000,
      onError({ error }) {
        console.error("[Server] Error generating summary:", error);
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("[Server] Unhandled error in review API:", error);
    return NextResponse.json(
      { error: "Failed to generate review" },
      { status: 500 }
    );
  }
}
