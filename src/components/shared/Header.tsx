import React from "react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ui/theme-toggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex justify-between items-center px-4 py-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-foreground">Review Pilot</h1>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
