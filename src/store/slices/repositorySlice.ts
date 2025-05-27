import { StateCreator } from "zustand";
import { StoreState } from "../types";

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  default_branch: string;
  // Other repository properties from GitHub API
}

export interface Branch {
  name: string;
  commit: {
    sha: string;
  };
}

export interface RepositorySlice {
  selectedRepository: Repository | null;
  selectedBranch: Branch | null;
  username: string;
  selectRepository: (repository: Repository) => void;
  selectBranch: (branch: Branch) => void;
  setUsername: (username: string) => void;
}

export const createRepositorySlice: StateCreator<
  StoreState,
  [],
  [],
  RepositorySlice
> = (set, get) => ({
  selectedRepository: null,
  selectedBranch: null,
  username: "deepakkumardewani",

  setUsername: (username: string) => {
    set({ username });
  },

  selectRepository: (repository: Repository) => {
    set({ selectedRepository: repository, selectedBranch: null });
  },

  selectBranch: (branch: Branch) => {
    set({ selectedBranch: branch });
  },
});
