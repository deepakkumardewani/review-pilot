"use server";
import { embed } from "ai";
import { openai } from "@ai-sdk/openai";

export async function createEmbedding(content: string) {
  try {
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: content,
    });
    return embedding;
  } catch (error) {
    console.error("Error creating embedding:", error);
    return null;
  }
}

export async function createPackageJsonEmbedding(packageJsonContent: string) {
  return createEmbedding(packageJsonContent);
}
