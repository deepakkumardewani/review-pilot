import CodeEditor from "@/components/CodeEditor";
import FileTree from "@/components/FileTree";
import RepositorySelector from "@/components/RepositorySelector";
import ReviewPanel from "@/components/ReviewPanel";
import Header from "@/components/shared/Header";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <div className="flex flex-1">
        <div className="column w-1/5 bg-background p-4 shadow-sm border-border border-r">
          <div className="space-y-4">
            <RepositorySelector />
            <FileTree />
          </div>
        </div>
        <div className="column w-2/5 bg-background p-4 border-border border-r">
          <CodeEditor />
        </div>
        <div className="column w-2/5 bg-background p-4 shadow-sm">
          <ReviewPanel />
        </div>
      </div>
    </div>
  );
}
