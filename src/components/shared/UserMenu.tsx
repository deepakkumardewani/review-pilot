"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";
export default function UserMenu() {
  const { user, logout } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInitials, setUserInitials] = useState("");

  useEffect(() => {
    setIsAuthenticated(
      localStorage.getItem(`is_authenticated_${user?.$id}`) === "true"
    );
    setUserInitials(() => {
      if (!user || !user.name) return "";
      const names = user.name.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    });
  }, [user]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isAuthenticated && (
          <Avatar className="cursor-pointer">
            <AvatarFallback className={`bg-purple-600 text-white`}>
              {userInitials}
            </AvatarFallback>
          </Avatar>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* <DropdownMenuItem
          className="cursor-pointer"
          onClick={handleProfileClick}
        >
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem> */}
        {/* <DropdownMenuItem
          disabled
          className="cursor-pointer text-muted-foreground"
          onClick={() => {}}
        >
          <ChartBar className="mr-2 h-4 w-4" />
          Analytics
          <Badge variant="secondary" className="ml-1">
            Soon
          </Badge>
        </DropdownMenuItem> */}
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuItem
          className="cursor-pointer"
          variant="destructive"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
