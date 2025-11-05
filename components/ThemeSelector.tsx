"use client";

import { Palette, Moon, Sun, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme, type ColorScheme, type ThemeMode } from "@/components/ThemeProvider";
import { useState } from "react";

export function ThemeSelector() {
  const { colorScheme, setColorScheme, themeMode, setThemeMode, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const colorSchemes: { value: ColorScheme; label: string; icon: React.ReactNode }[] = [
    { value: "default", label: "Default", icon: <Palette className="h-4 w-4" /> },
    { value: "ocean", label: "Ocean Break", icon: <Waves className="h-4 w-4" /> },
  ];

  const themeModes: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
    { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
    { value: "system", label: "System", icon: <Palette className="h-4 w-4" /> },
  ];

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
        aria-label="Theme settings"
      >
        <Palette className="h-5 w-5 icon-3d" />
        <span className="sr-only">Theme settings</span>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <Card className="fixed sm:absolute right-0 sm:right-0 top-16 sm:top-12 left-4 sm:left-auto z-50 w-auto sm:w-64 max-w-[calc(100vw-2rem)] sm:max-w-none shadow-2xl border-2 animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Theme Settings</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Customize your appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs sm:text-sm font-medium mb-2 block">Color Scheme</label>
                <div className="grid grid-cols-2 gap-2">
                  {colorSchemes.map((scheme) => (
                    <Button
                      key={scheme.value}
                      variant={colorScheme === scheme.value ? "default" : "outline"}
                      className="flex flex-col items-center gap-1.5 sm:gap-2 h-auto py-2 sm:py-3 text-xs sm:text-sm"
                      onClick={() => setColorScheme(scheme.value)}
                    >
                      <span className="icon-3d">{scheme.icon}</span>
                      <span className="text-xs whitespace-nowrap">{scheme.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium mb-2 block">Theme Mode</label>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  {themeModes.map((mode) => (
                    <Button
                      key={mode.value}
                      variant={themeMode === mode.value ? "default" : "outline"}
                      size="sm"
                      className="flex items-center justify-center gap-1 sm:gap-2 text-xs px-2 sm:px-3"
                      onClick={() => setThemeMode(mode.value)}
                    >
                      <span className="icon-3d">{mode.icon}</span>
                      <span className="text-xs whitespace-nowrap hidden sm:inline">{mode.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

