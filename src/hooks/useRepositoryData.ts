import useSWR from "swr";
import { Repository, Branch } from "@/store/slices/repositorySlice";
import { decodeBase64Content } from "@/lib/fileUtils";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }
  return response.json();
};

const fileContentFetcher = async (url: string): Promise<string> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch file content: ${response.status}`);
  }

  const data = await response.json();

  if (data.encoding === "base64" && data.content) {
    return decodeBase64Content(data.content);
  }

  return data.content || "No content available";
};

export function useRepositoriesData(username: string) {
  const { data, error, isLoading } = useSWR<Repository[]>(
    username
      ? `https://api.github.com/users/${username}/repos?per_page=50`
      : null,
    fetcher,
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
  const { data, error, isLoading } = useSWR<Branch[]>(
    username && repoName
      ? `https://api.github.com/repos/${username}/${repoName}/branches`
      : null,
    fetcher,
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
  const { data, error, isLoading } = useSWR(
    username && repoName && branch
      ? `https://api.github.com/repos/${username}/${repoName}/git/trees/${branch}?recursive=1`
      : null,
    fetcher,
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
