import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createAuthSlice } from "./slices/authSlice";
import { createRepositorySlice } from "./slices/repositorySlice";
import { createFileSlice } from "./slices/fileSlice";
import { createReviewSlice } from "./slices/reviewSlice";
import { StoreState } from "./types";

// Create the store with persist middleware to maintain state across page refreshes
export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createRepositorySlice(...a),
      ...createFileSlice(...a),
      ...createReviewSlice(...a),
    }),
    {
      name: "code-reviewer-storage",
      // Only persist certain parts of the state
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        selectedRepository: state.selectedRepository,
      }),
    }
  )
);

// Export individual selectors for better performance
// These help components only re-render when the specific state they use changes
export const useAuth = () => {
  const user = useStore((state) => state.user);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const authLoading = useStore((state) => state.authLoading);
  const login = useStore((state) => state.login);
  const logout = useStore((state) => state.logout);

  return {
    user,
    isAuthenticated,
    authLoading,
    login,
    logout,
  };
};

export const useRepository = () => {
  const selectedRepository = useStore((state) => state.selectedRepository);
  const selectedBranch = useStore((state) => state.selectedBranch);
  const username = useStore((state) => state.username);
  const selectRepository = useStore((state) => state.selectRepository);
  const selectBranch = useStore((state) => state.selectBranch);
  const setUsername = useStore((state) => state.setUsername);

  return {
    selectedRepository,
    selectedBranch,
    username,
    selectRepository,
    selectBranch,
    setUsername,
  };
};

export const useFile = () => {
  const selectedFile = useStore((state) => state.selectedFile);
  const selectFile = useStore((state) => state.selectFile);
  const clearSelectedFile = useStore((state) => state.clearSelectedFile);

  return {
    selectedFile,
    selectFile,
    clearSelectedFile,
  };
};

export const useReview = () => {
  const currentReview = useStore((state) => state.currentReview);
  const reviewHistory = useStore((state) => state.reviewHistory);
  const reviewLoading = useStore((state) => state.reviewLoading);
  const completion = useStore((state) => state.completion);
  const reviewError = useStore((state) => state.reviewError);
  const isStreaming = useStore((state) => state.isStreaming);
  const requestReview = useStore((state) => state.requestReview);
  const fetchReviewHistory = useStore((state) => state.fetchReviewHistory);
  const selectReview = useStore((state) => state.selectReview);
  const setCompletion = useStore((state) => state.setCompletion);
  const setReviewLoading = useStore((state) => state.setReviewLoading);
  const setReviewError = useStore((state) => state.setReviewError);
  const setIsStreaming = useStore((state) => state.setIsStreaming);
  const clearReview = useStore((state) => state.clearReview);

  return {
    currentReview,
    reviewHistory,
    reviewLoading,
    completion,
    reviewError,
    isStreaming,
    requestReview,
    fetchReviewHistory,
    selectReview,
    setCompletion,
    setReviewLoading,
    setReviewError,
    setIsStreaming,
    clearReview,
  };
};
