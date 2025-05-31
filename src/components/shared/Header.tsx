// "use client";
import React from "react";
import { ThemeToggle } from "../ui/theme-toggle";
import Link from "next/link";
import UserMenu from "./UserMenu";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import RepositorySelector from "../RepositorySelector";

export default function Header() {
  const { user } = useAuth();
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex justify-between items-center px-4 py-4">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold text-foreground">Review Pilot</h1>
        </div>
        <div className="w-64">
          {pathname === "/dashboard" && <RepositorySelector />}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {pathname === "/" && (
            <Link href={`${user ? "/dashboard" : "/signup"}`}>
              <HoverBorderGradient
                containerClassName="rounded-full"
                as="button"
                className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 cursor-pointer"
              >
                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-md">
                  {user ? "Dashboard" : "Get Started"}
                </span>
              </HoverBorderGradient>
            </Link>
          )}

          <UserMenu />
        </div>
      </div>
    </header>
  );
}
