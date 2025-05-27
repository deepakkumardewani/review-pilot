import { StateCreator } from "zustand";
import { StoreState } from "../types";
import { getLanguageFromFilename } from "@/lib/fileUtils";

export interface FileNode {
  path: string;
  name: string;
  type: "file" | "directory";
  children?: FileNode[];
}

export interface SelectedFile {
  path: string;
  name: string;
  url: string;
  language: string;
}

export interface FileSlice {
  selectedFile: SelectedFile | null;
  selectFile: (filePath: string, fileUrl: string, fileName: string) => void;
  clearSelectedFile: () => void;
}

export const createFileSlice: StateCreator<StoreState, [], [], FileSlice> = (
  set
) => ({
  selectedFile: null,
  selectFile: (filePath: string, fileUrl: string, fileName: string) => {
    set({
      selectedFile: {
        path: filePath,
        name: fileName,
        url: fileUrl,
        language: getLanguageFromFilename(fileName),
      },
    });
  },
  clearSelectedFile: () => {
    set({ selectedFile: null });
  },
});
