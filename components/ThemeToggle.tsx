"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { ThemeSelector } from "./ThemeSelector";

export function ThemeToggle() {
  const { resolvedTheme, setThemeMode } = useTheme();

  const toggleTheme = () => {
    setThemeMode(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleTheme}
        className="h-8 w-8 sm:h-10 sm:w-10"
        aria-label="Toggle theme"
      >
        {resolvedTheme === "dark" ? (
          <Sun className="h-4 w-4 sm:h-5 sm:w-5 icon-3d" />
        ) : (
          <Moon className="h-4 w-4 sm:h-5 sm:w-5 icon-3d" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
      <ThemeSelector />
    </div>
  );
}

