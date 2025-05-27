import { StateCreator } from "zustand";
import { StoreState } from "../types";

export interface Review {
  id: string;
  filePath: string;
  content: string;
  timestamp: string;
}

export interface ReviewSlice {
  currentReview: Review | null;
  reviewHistory: Review[];
  reviewLoading: boolean;
  completion: string;
  reviewError: Error | null;
  isStreaming: boolean;
  requestReview: (filePath: string, fileContent: string) => Promise<void>;
  fetchReviewHistory: (filePath: string) => Promise<void>;
  selectReview: (reviewId: string) => void;
  setCompletion: (completion: string) => void;
  setReviewLoading: (loading: boolean) => void;
  setReviewError: (error: Error | null) => void;
  setIsStreaming: (streaming: boolean) => void;
  clearReview: () => void;
}

export const createReviewSlice: StateCreator<
  StoreState,
  [],
  [],
  ReviewSlice
> = (set, get) => ({
  currentReview: null,
  reviewHistory: [],
  reviewLoading: false,
  completion: "",
  reviewError: null,
  isStreaming: false,

  setCompletion: (completion: string) => {
    set({ completion });
  },

  setReviewLoading: (loading: boolean) => {
    set({ reviewLoading: loading });
  },

  setReviewError: (error: Error | null) => {
    set({ reviewError: error });
  },

  setIsStreaming: (streaming: boolean) => {
    set({ isStreaming: streaming });
  },

  clearReview: () => {
    set({
      completion: "",
      reviewError: null,
      reviewLoading: false,
      isStreaming: false,
    });
  },

  requestReview: async (filePath: string, fileContent: string) => {
    if (!fileContent) return;

    set({ reviewLoading: true });
    try {
      // Logic to request review from AI via Vercel AI SDK
      // This is a placeholder for actual implementation
      const review: Review = {
        id: `review-${Date.now()}`,
        filePath,
        content: "Sample review content",
        timestamp: new Date().toISOString(),
      };
      set({
        currentReview: review,
        reviewHistory: [review, ...get().reviewHistory],
        reviewLoading: false,
      });
    } catch (error) {
      console.error("Review request error:", error);
      set({ reviewLoading: false });
    }
  },

  fetchReviewHistory: async (filePath: string) => {
    set({ reviewLoading: true });
    try {
      // Logic to fetch review history from Appwrite
      // This is a placeholder for actual implementation
      const reviews: Review[] = []; // Placeholder for fetched reviews
      set({ reviewHistory: reviews, reviewLoading: false });
    } catch (error) {
      console.error("Review history fetch error:", error);
      set({ reviewLoading: false });
    }
  },

  selectReview: (reviewId: string) => {
    const selectedReview = get().reviewHistory.find(
      (review: Review) => review.id === reviewId
    );
    if (selectedReview) {
      set({ currentReview: selectedReview });
    }
  },
});
