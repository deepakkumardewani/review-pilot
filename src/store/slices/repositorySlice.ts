import { StateCreator } from "zustand";
import { StoreState } from "../types";
import { GitHubRepository, GitHubBranch } from "@/lib/apiTypes";

export interface RepositorySlice {
  selectedRepository: GitHubRepository | null;
  selectedBranch: GitHubBranch | null;
  username: string;
  selectRepository: (repository: GitHubRepository) => void;
  selectBranch: (branch: GitHubBranch) => void;
  setUsername: (username: string) => void;
}

export const createRepositorySlice: StateCreator<
  StoreState,
  [],
  [],
  RepositorySlice
> = (set) => ({
  selectedRepository: null,
  selectedBranch: null,
  username: "",

  setUsername: (username: string) => {
    set({ username });
  },

  selectRepository: (repository: GitHubRepository) => {
    set({ selectedRepository: repository, selectedBranch: null });
  },

  selectBranch: (branch: GitHubBranch) => {
    set({ selectedBranch: branch });
  },
});
