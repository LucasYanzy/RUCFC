"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const currentTheme = useRef<Theme>("dark");
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let stored: Theme | null = null;
    try {
      stored = localStorage.getItem("rucfc-theme") as Theme | null;
    } catch {}
    if (stored === "light" || stored === "dark") {
      currentTheme.current = stored;
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }

    return () => {
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
      document.documentElement.classList.remove("theme-transitioning");
    };
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = currentTheme.current === "dark" ? "light" : "dark";
    const reduceMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      root.dataset.motion === "off";

    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    if (!reduceMotion) {
      root.classList.add("theme-transitioning");
      // Register the transition before changing the palette. On repeated clicks,
      // CSS continues from the currently rendered colors without resetting them.
      getComputedStyle(root).backgroundColor;
      transitionTimer.current = setTimeout(() => {
        root.classList.remove("theme-transitioning");
        transitionTimer.current = null;
      }, 700);
    } else {
      root.classList.remove("theme-transitioning");
    }

    currentTheme.current = next;
    setTheme(next);
    try {
      localStorage.setItem("rucfc-theme", next);
    } catch {}
    root.setAttribute("data-theme", next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
