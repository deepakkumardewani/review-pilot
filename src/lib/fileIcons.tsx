import {
  File,
  Folder,
  FolderOpen,
  FileText,
  Image,
  Settings,
  Package,
  Database,
} from "lucide-react";

export const getFileIcon = (
  fileName: string,
  isFolder: boolean,
  isOpen?: boolean
) => {
  if (isFolder) {
    return isOpen ? (
      <FolderOpen className="w-4 h-4 mr-2 text-blue-500" />
    ) : (
      <Folder className="w-4 h-4 mr-2 text-blue-500" />
    );
  }

  const extension = fileName.split(".").pop()?.toLowerCase();

  // Map file extensions to skillicons
  const getSkillIcon = (iconName: string) => (
    <img
      src={`https://skillicons.dev/icons?i=${iconName}`}
      alt={iconName}
      className="w-4 h-4 mr-2"
    />
  );

  switch (extension) {
    case "js":
      return getSkillIcon("js");
    case "jsx":
      return getSkillIcon("react");
    case "ts":
      return getSkillIcon("ts");
    case "tsx":
      return getSkillIcon("react");
    case "vue":
      return getSkillIcon("vue");
    case "py":
      return getSkillIcon("python");
    case "java":
      return getSkillIcon("java");
    case "cs":
      return getSkillIcon("cs");
    case "php":
      return getSkillIcon("php");
    case "rb":
      return getSkillIcon("ruby");
    case "go":
      return getSkillIcon("go");
    case "rs":
      return getSkillIcon("rust");
    case "cpp":
    case "cc":
    case "cxx":
      return getSkillIcon("cpp");
    case "c":
      return getSkillIcon("c");
    case "swift":
      return getSkillIcon("swift");
    case "kt":
    case "kts":
      return getSkillIcon("kotlin");
    case "html":
      return getSkillIcon("html");
    case "css":
      return getSkillIcon("css");
    case "scss":
    case "sass":
      return getSkillIcon("sass");
    case "json":
      return <Database className="w-4 h-4 mr-2 text-orange-500" />;
    case "xml":
    case "yaml":
    case "yml":
      return <Database className="w-4 h-4 mr-2 text-orange-500" />;
    case "md":
    case "txt":
    case "doc":
    case "docx":
      return <FileText className="w-4 h-4 mr-2 text-gray-500" />;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
    case "webp":
      return <Image className="w-4 h-4 mr-2 text-purple-500" />;
    case "package":
    case "lock":
      return <Package className="w-4 h-4 mr-2 text-brown-500" />;
    case "config":
    case "conf":
    case "ini":
    case "env":
      return <Settings className="w-4 h-4 mr-2 text-gray-600" />;
    default:
      return <File className="w-4 h-4 mr-2 text-gray-400" />;
  }
};
