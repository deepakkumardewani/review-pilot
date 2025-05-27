"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "icon" | "button";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ThemeToggle({
  variant = "icon",
  size = "md",
  className,
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const sizeClasses = {
    sm: { icon: 16, button: "h-8 w-8" },
    md: { icon: 18, button: "h-10 w-10" },
    lg: { icon: 20, button: "h-12 w-12" },
  };

  const iconSize = sizeClasses[size].icon;
  const buttonSize = sizeClasses[size].button;

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (variant === "icon") {
    return (
      <Button
        id="theme-toggle"
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className={cn(
          buttonSize,
          "rounded-full transition-colors",
          isDark ? "text-yellow-300" : "text-gray-600",
          className
        )}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? (
          <Sun size={iconSize} className="text-yellow-300" />
        ) : (
          <Moon size={iconSize} />
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      className={cn(
        "flex items-center gap-2 transition-colors",
        isDark
          ? "text-gray-300 hover:text-white hover:bg-gray-800"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span>
        {isDark ? (
          <Sun size={iconSize} className="text-yellow-300" />
        ) : (
          <Moon size={iconSize} />
        )}
      </span>
      {isDark ? "Light Mode" : "Dark Mode"}
    </Button>
  );
}
