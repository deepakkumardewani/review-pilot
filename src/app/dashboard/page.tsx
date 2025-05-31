"use client";
import { useEffect } from "react";
import CodeEditor from "@/components/CodeEditor";
import FileTree from "@/components/FileTree";
import RepositorySelector from "@/components/RepositorySelector";
import ReviewPanel from "@/components/ReviewPanel";
import Header from "@/components/shared/Header";
import { useStore } from "@/store";
import { useAppwrite } from "@/hooks/useAppwrite";

export default function DashboardPage() {
  const { user } = useAppwrite();
  const username = useStore((state) => state.username);
  const setUsername = useStore((state) => state.setUsername);

  useEffect(() => {
    if (user && !username) {
      const savedUsername = localStorage.getItem(`github_username_${user.$id}`);
      if (savedUsername) {
        setUsername(savedUsername);
      }
    }
  }, [user, username]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <div className="flex flex-1">
        <div className="column w-[20%] bg-background p-4 shadow-sm border-border border-r">
          {/* <div className="space-y-4"> */}
          {/* <RepositorySelector /> */}
          <FileTree />
          {/* </div> */}
        </div>
        <div className="column w-[50%] bg-background p-4 border-border border-r">
          <CodeEditor />
        </div>
        <div className="column w-[30%] bg-background p-4 shadow-sm">
          <ReviewPanel />
        </div>
      </div>
    </div>
  );
}
