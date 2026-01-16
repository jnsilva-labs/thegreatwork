import { create } from "zustand";

export type ThemeName = "obsidian" | "abyssal" | "crimson";

export type ThemeColors = {
  line: string;
  glow: string;
  accent: string;
  accent2: string;
};

export const themes: Record<ThemeName, ThemeColors> = {
  obsidian: {
    line: "#e8e3d8",
    glow: "#b89b5e",
    accent: "#b89b5e",
    accent2: "#252435",
  },
  abyssal: {
    line: "#e5e9f0",
    glow: "#4b6d8f",
    accent: "#7aa5c9",
    accent2: "#1f2a44",
  },
  crimson: {
    line: "#efe4d6",
    glow: "#b24c3f",
    accent: "#b17755",
    accent2: "#3a1b1b",
  },
};

type ThemeState = {
  theme: ThemeName;
  colors: ThemeColors;
  setTheme: (theme: ThemeName) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "obsidian",
  colors: themes.obsidian,
  setTheme: (theme) => {
    set({ theme, colors: themes[theme] });
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = theme;
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem("ap-theme", theme);
    }
  },
}));

export function getStoredTheme() {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem("ap-theme");
  if (value === "obsidian" || value === "abyssal" || value === "crimson") {
    return value;
  }
  return null;
}
