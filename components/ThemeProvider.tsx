"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ColorScheme = "default" | "ocean";
export type ThemeMode = "dark" | "light" | "system";

interface ThemeContextType {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  resolvedTheme: "dark" | "light";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>("default");
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    // Load theme from localStorage
    if (typeof window !== "undefined") {
      const storedScheme = localStorage.getItem("task-app-color-scheme") as ColorScheme | null;
      const storedMode = localStorage.getItem("task-app-theme-mode") as ThemeMode | null;
      if (storedScheme) {
        setColorSchemeState(storedScheme);
      }
      if (storedMode) {
        setThemeModeState(storedMode);
      }
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove("light", "dark", "theme-default", "theme-ocean");
    
    // Add color scheme
    root.classList.add(`theme-${colorScheme}`);
    
    // Determine resolved theme
    let resolved: "dark" | "light";
    if (themeMode === "system") {
      resolved = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } else {
      resolved = themeMode;
    }
    
    setResolvedTheme(resolved);
    root.classList.add(resolved);
  }, [colorScheme, themeMode]);

  const setColorScheme = (scheme: ColorScheme) => {
    setColorSchemeState(scheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("task-app-color-scheme", scheme);
    }
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("task-app-theme-mode", mode);
    }
  };

  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme, themeMode, setThemeMode, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

