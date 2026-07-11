"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type TextSize = "normal" | "large" | "xlarge";

interface AccessibilityContextType {
  highContrast: boolean;
  largeText: TextSize;
  reducedMotion: boolean;
  simpleLanguage: boolean;
  screenReaderLabels: boolean;
  toggleHighContrast: () => void;
  setTextSize: (size: TextSize) => void;
  toggleReducedMotion: () => void;
  toggleSimpleLanguage: () => void;
  toggleScreenReaderLabels: () => void;
  resetSettings: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [largeText, setLargeText] = useState<TextSize>("normal");
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [simpleLanguage, setSimpleLanguage] = useState<boolean>(false);
  const [screenReaderLabels, setScreenReaderLabels] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedContrast = localStorage.getItem("acc-highcontrast") === "true";
    const savedTextSize = (localStorage.getItem("acc-textsize") || "normal") as TextSize;
    const savedMotion = localStorage.getItem("acc-reducedmotion") === "true";
    const savedLanguage = localStorage.getItem("acc-simplelanguage") === "true";
    const savedLabels = localStorage.getItem("acc-screenreaderlabels") === "true";

    setHighContrast(savedContrast);
    setLargeText(savedTextSize);
    setReducedMotion(savedMotion);
    setSimpleLanguage(savedLanguage);
    setScreenReaderLabels(savedLabels);
  }, []);

  // Sync class names on html element
  useEffect(() => {
    const html = document.documentElement;

    // High Contrast
    if (highContrast) {
      html.classList.add("high-contrast");
    } else {
      html.classList.remove("high-contrast");
    }

    // Text Size
    html.classList.remove("text-large", "text-xlarge");
    if (largeText === "large") {
      html.classList.add("text-large");
    } else if (largeText === "xlarge") {
      html.classList.add("text-xlarge");
    }

    // Reduced Motion
    if (reducedMotion) {
      html.classList.add("reduced-motion");
    } else {
      html.classList.remove("reduced-motion");
    }
  }, [highContrast, largeText, reducedMotion]);

  const toggleHighContrast = () => {
    setHighContrast((prev) => {
      const next = !prev;
      localStorage.setItem("acc-highcontrast", String(next));
      return next;
    });
  };

  const setTextSize = (size: TextSize) => {
    setLargeText(size);
    localStorage.setItem("acc-textsize", size);
  };

  const toggleReducedMotion = () => {
    setReducedMotion((prev) => {
      const next = !prev;
      localStorage.setItem("acc-reducedmotion", String(next));
      return next;
    });
  };

  const toggleSimpleLanguage = () => {
    setSimpleLanguage((prev) => {
      const next = !prev;
      localStorage.setItem("acc-simplelanguage", String(next));
      return next;
    });
  };

  const toggleScreenReaderLabels = () => {
    setScreenReaderLabels((prev) => {
      const next = !prev;
      localStorage.setItem("acc-screenreaderlabels", String(next));
      return next;
    });
  };

  const resetSettings = () => {
    setHighContrast(false);
    setLargeText("normal");
    setReducedMotion(false);
    setSimpleLanguage(false);
    setScreenReaderLabels(false);
    localStorage.setItem("acc-highcontrast", "false");
    localStorage.setItem("acc-textsize", "normal");
    localStorage.setItem("acc-reducedmotion", "false");
    localStorage.setItem("acc-simplelanguage", "false");
    localStorage.setItem("acc-screenreaderlabels", "false");
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        largeText,
        reducedMotion,
        simpleLanguage,
        screenReaderLabels,
        toggleHighContrast,
        setTextSize,
        toggleReducedMotion,
        toggleSimpleLanguage,
        toggleScreenReaderLabels,
        resetSettings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
};
