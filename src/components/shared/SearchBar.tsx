"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Search } from "lucide-react";
import { useFile, useRepository } from "@/store/store";
import { useFileTreeData } from "@/hooks/useRepositoryData";
import { getFileIcon } from "@/lib/fileIcons";
import { GitHubFileTreeItem } from "@/lib/apiTypes";

interface FileItem {
  id: string;
  name: string;
  path: string;
  url?: string;
}

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { selectFile } = useFile();
  const { selectedRepository, selectedBranch, username } = useRepository();

  const { fileTreeData } = useFileTreeData(
    username,
    selectedRepository?.name || "",
    selectedBranch?.name || ""
  );

  // Flatten tree data for search
  const flattenedFiles = useMemo(() => {
    if (!fileTreeData?.tree) return [];

    const files: FileItem[] = [];

    fileTreeData.tree.forEach((item: GitHubFileTreeItem) => {
      if (item.type === "blob") {
        const pathParts = item.path.split("/");
        const fileName = pathParts[pathParts.length - 1];

        files.push({
          id: item.sha || item.path,
          name: fileName,
          path: item.path,
          url: item.url,
        });
      }
    });

    return files;
  }, [fileTreeData]);

  // Filter files based on search query
  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return flattenedFiles
      .filter(
        (file) =>
          file.name.toLowerCase().includes(query) ||
          file.path.toLowerCase().includes(query)
      )
      .slice(0, 10); // Limit to 10 results
  }, [flattenedFiles, searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleInputClick = () => {
    setIsOpen(true);
  };

  const handleFileSelect = (file: FileItem) => {
    if (file.url) {
      selectFile(file.path, file.url, file.name);
    }
    setIsOpen(false);
    setSearchQuery("");
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative w-full max-w-sm" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={handleInputChange}
          onClick={handleInputClick}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 cursor-pointer"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          {searchQuery.trim() === "" ? (
            <div className="p-3 text-sm text-muted-foreground">
              Type to search files...
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="p-3 text-sm text-muted-foreground">
              No files found
            </div>
          ) : (
            <div className="py-2">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => handleFileSelect(file)}
                  className="flex items-center px-3 py-2 cursor-pointer hover:bg-accent text-sm"
                >
                  {getFileIcon(file.name, false)}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-medium truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {file.path}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
