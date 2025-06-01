import useSWR from "swr";
import { decodeBase64Content } from "@/lib/fileUtils";
import {
  repositorySchema,
  branchSchema,
  fileTreeDataSchema,
  fileContentSchema,
  GitHubRepository,
  GitHubBranch,
  GitHubFileTreeData,
} from "@/lib/apiTypes";
import { z } from "zod";

const repositoriesFetcher = async (
  url: string
): Promise<GitHubRepository[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }
  const data = await response.json();
  return z.array(repositorySchema).parse(data);
};

const branchesFetcher = async (url: string): Promise<GitHubBranch[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }
  const data = await response.json();
  return z.array(branchSchema).parse(data);
};

const fileTreeFetcher = async (url: string): Promise<GitHubFileTreeData> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch file tree: ${response.status}`);
  }
  const data = await response.json();
  return fileTreeDataSchema.parse(data);
};

const fileContentFetcher = async (url: string): Promise<string> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch file content: ${response.status}`);
  }

  const data = await response.json();
  const validatedData = fileContentSchema.parse(data);

  if (validatedData.encoding === "base64" && validatedData.content) {
    return decodeBase64Content(validatedData.content);
  }

  return validatedData.content || "No content available";
};

export function useRepositoriesData(username: string) {
  const { data, error, isLoading } = useSWR<GitHubRepository[]>(
    username
      ? `https://api.github.com/users/${username}/repos?per_page=50`
      : null,
    repositoriesFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  return {
    repositories: data || [],
    isLoading,
    error,
  };
}

export function useBranchesData(username: string, repoName: string) {
  const { data, error, isLoading } = useSWR<GitHubBranch[]>(
    username && repoName
      ? `https://api.github.com/repos/${username}/${repoName}/branches`
      : null,
    branchesFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  return {
    branches: data || [],
    isLoading,
    error,
  };
}

export function useFileTreeData(
  username: string,
  repoName: string,
  branch: string
) {
  const { data, error, isLoading } = useSWR<GitHubFileTreeData>(
    username && repoName && branch
      ? `https://api.github.com/repos/${username}/${repoName}/git/trees/${branch}?recursive=1`
      : null,
    fileTreeFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  return {
    fileTreeData: data,
    isLoading,
    error,
  };
}

export function useFileContent(url: string | null) {
  const { data, error, isLoading } = useSWR<string>(url, fileContentFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes
  });

  return {
    fileContent: data || "",
    isLoading,
    error,
  };
}
