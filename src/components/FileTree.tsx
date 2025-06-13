"use client";

import { Tree, NodeApi, TreeApi } from "react-arborist";
import { type CSSProperties } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useFile, useRepository } from "@/store/store";
import { useFileTreeData } from "@/hooks/useRepositoryData";
import { getFileIcon } from "@/lib/fileIcons";

interface TreeNode {
  id: string;
  name: string;
  path: string;
  type: "file" | "folder";
  children?: TreeNode[];
  extension?: string;
  url?: string;
}

interface NodeRendererProps {
  style: CSSProperties;
  node: NodeApi<TreeNode>;
  tree: TreeApi<TreeNode>;
  dragHandle?: (el: HTMLDivElement | null) => void;
  preview?: boolean;
}

// Transform flat GitHub tree data into nested tree structure
const transformGitHubTreeData = (
  githubTree: Array<{
    path: string;
    type: string;
    sha: string;
    size?: number;
    url: string;
  }>
): TreeNode[] => {
  const nodeMap = new Map<string, TreeNode>();
  const rootNodes: TreeNode[] = [];

  // First, create all nodes
  githubTree.forEach((item, index) => {
    const path = item.path;
    const pathParts = path.split("/");
    const fileName = pathParts[pathParts.length - 1];

    const node: TreeNode = {
      id: item.sha || `${index}`,
      name: fileName,
      path: path,
      type: item.type === "tree" ? "folder" : "file",
      children: item.type === "tree" ? [] : undefined,
      extension: item.type === "blob" ? fileName.split(".").pop() : undefined,
      url: item.type === "blob" ? item.url : undefined,
    };

    nodeMap.set(path, node);
  });

  // Create folder nodes for intermediate paths
  githubTree.forEach((item) => {
    const pathParts = item.path.split("/");

    // Create intermediate folders if they don't exist
    for (let i = 1; i < pathParts.length; i++) {
      const intermediatePath = pathParts.slice(0, i).join("/");

      if (!nodeMap.has(intermediatePath)) {
        const folderName = pathParts[i - 1];
        const folderNode: TreeNode = {
          id: `folder-${intermediatePath}`,
          name: folderName,
          path: intermediatePath,
          type: "folder",
          children: [],
        };
        nodeMap.set(intermediatePath, folderNode);
      }
    }
  });

  // Build the tree structure
  nodeMap.forEach((node) => {
    const pathParts = node.path.split("/");

    if (pathParts.length === 1) {
      // Root level node
      rootNodes.push(node);
    } else {
      // Find parent
      const parentPath = pathParts.slice(0, -1).join("/");
      const parent = nodeMap.get(parentPath);

      if (parent && parent.children) {
        parent.children.push(node);
      }
    }
  });

  // Sort nodes: folders first, then files, both alphabetically
  const sortNodes = (nodes: TreeNode[]): TreeNode[] => {
    return nodes
      .sort((a, b) => {
        if (a.type === "folder" && b.type === "file") return -1;
        if (a.type === "file" && b.type === "folder") return 1;
        return a.name.localeCompare(b.name);
      })
      .map((node) => ({
        ...node,
        children: node.children ? sortNodes(node.children) : undefined,
      }));
  };

  return sortNodes(rootNodes);
};

const NodeComponent = ({ node, style }: NodeRendererProps) => {
  const { selectFile, selectedFile } = useFile();

  const isSelected = selectedFile?.path === node.data.path;

  const handleClick = () => {
    if (node.data.type === "folder") {
      node.toggle();
    } else if (node.data.url) {
      selectFile(node.data.path, node.data.url, node.data.name);
    }
  };

  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    node.toggle();
  };

  return (
    <div
      style={style}
      className={`flex items-center cursor-pointer rounded px-2 py-1 ${
        isSelected
          ? "bg-primary/20 text-primary border-l-2 border-primary"
          : "hover:bg-accent"
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center w-full">
        {/* Expand/Collapse Arrow for folders */}
        {node.data.type === "folder" && (
          <button
            onClick={handleArrowClick}
            className="flex items-center justify-center w-4 h-4 mr-1 hover:bg-accent-foreground/10 rounded"
          >
            {node.isOpen ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        )}

        {/* Spacer for files to align with folders */}
        {node.data.type === "file" && <div className="w-5 mr-1" />}

        {/* File/Folder Icon */}
        {getFileIcon(node.data.name, node.data.type === "folder", node.isOpen)}

        {/* Name */}
        <span className="truncate text-sm">{node.data.name}</span>
      </div>
    </div>
  );
};

export default function FileTree() {
  const { selectedRepository, selectedBranch, username } = useRepository();

  const { fileTreeData, isLoading: fileLoading } = useFileTreeData(
    username,
    selectedRepository?.name || "",
    selectedBranch?.name || ""
  );

  // Transform GitHub tree data to react-arborist format
  const treeData = fileTreeData?.tree
    ? transformGitHubTreeData(fileTreeData.tree)
    : [];

  if (fileLoading) {
    return (
      <div className="text-card-foreground">
        <h2 className="text-lg font-semibold mb-2">Files</h2>
        <div className="text-muted-foreground">Loading files...</div>
      </div>
    );
  }

  if (!selectedRepository || !selectedBranch) {
    return (
      <div className="text-card-foreground">
        <h2 className="text-lg font-semibold mb-2">Files</h2>
        <div className="text-muted-foreground">
          Select a repository and branch
        </div>
      </div>
    );
  }

  if (treeData.length === 0) {
    return (
      <div className="text-card-foreground">
        <h2 className="text-lg font-semibold mb-2">Files</h2>
        <div className="text-muted-foreground">No files available</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col text-card-foreground">
      <h2 className="text-lg font-semibold mb-2">Files</h2>
      <Tree<TreeNode>
        data={treeData}
        width="100%"
        height={600}
        indent={16}
        rowHeight={32}
        openByDefault={false}
        childrenAccessor="children"
        idAccessor="id"
      >
        {NodeComponent}
      </Tree>
    </div>
  );
}
