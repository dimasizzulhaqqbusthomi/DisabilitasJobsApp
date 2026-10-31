"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

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

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(
  undefined
);

/**
 * Flash-prevention script injected BEFORE React hydration.
 * Embed as an inline <script> in layout.tsx so the correct
 * class is applied to <html> synchronously before first paint.
 */
export const HIGH_CONTRAST_INIT_SCRIPT = `
(function() {
  try {
    var saved = localStorage.getItem("acc-highcontrast");
    var osPref = window.matchMedia("(prefers-contrast: more)").matches;
    var active = saved !== null ? saved === "true" : osPref;
    if (active) document.documentElement.classList.add("high-contrast");
    var textSize = localStorage.getItem("acc-textsize");
    if (textSize === "large")  document.documentElement.classList.add("text-large");
    if (textSize === "xlarge") document.documentElement.classList.add("text-xlarge");
    if (localStorage.getItem("acc-reducedmotion") === "true")
      document.documentElement.classList.add("reduced-motion");
  } catch (e) {}
})();
`.trim();

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [largeText, setLargeText] = useState<TextSize>("normal");
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [simpleLanguage, setSimpleLanguage] = useState<boolean>(false);
  const [screenReaderLabels, setScreenReaderLabels] = useState<boolean>(false);

  // Live-region ref for screen reader announcements
  const announceRef = useRef<HTMLDivElement | null>(null);

  // Load from localStorage on mount + listen for OS preference changes
  useEffect(() => {
    const savedContrast = localStorage.getItem("acc-highcontrast");
    const osPref = window.matchMedia("(prefers-contrast: more)").matches;
    const initialContrast = savedContrast !== null ? savedContrast === "true" : osPref;

    setHighContrast(initialContrast);
    setLargeText((localStorage.getItem("acc-textsize") || "normal") as TextSize);
    setReducedMotion(localStorage.getItem("acc-reducedmotion") === "true");
    setSimpleLanguage(localStorage.getItem("acc-simplelanguage") === "true");
    setScreenReaderLabels(localStorage.getItem("acc-screenreaderlabels") === "true");

    // Listen for OS-level contrast change while app is open
    const mq = window.matchMedia("(prefers-contrast: more)");
    const handleOsChange = (e: MediaQueryListEvent) => {
      const userHasOverridden = localStorage.getItem("acc-highcontrast") !== null;
      if (!userHasOverridden) {
        setHighContrast(e.matches);
        applyHighContrast(e.matches);
      }
    };
    mq.addEventListener("change", handleOsChange);
    return () => mq.removeEventListener("change", handleOsChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyHighContrast(active: boolean) {
    const html = document.documentElement;
    if (active) html.classList.add("high-contrast");
    else html.classList.remove("high-contrast");
  }

  useEffect(() => { applyHighContrast(highContrast); }, [highContrast]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("text-large", "text-xlarge");
    if (largeText === "large") html.classList.add("text-large");
    else if (largeText === "xlarge") html.classList.add("text-xlarge");
  }, [largeText]);

  useEffect(() => {
    const html = document.documentElement;
    if (reducedMotion) html.classList.add("reduced-motion");
    else html.classList.remove("reduced-motion");
  }, [reducedMotion]);

  function announce(message: string) {
    if (!announceRef.current) return;
    announceRef.current.textContent = "";
    setTimeout(() => {
      if (announceRef.current) announceRef.current.textContent = message;
    }, 100);
  }

  const toggleHighContrast = () => {
    setHighContrast((prev) => {
      const next = !prev;
      localStorage.setItem("acc-highcontrast", String(next));
      announce(next ? "Mode Kontras Tinggi diaktifkan" : "Mode Kontras Tinggi dinonaktifkan");
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
      announce(next ? "Kurangi Gerakan diaktifkan" : "Kurangi Gerakan dinonaktifkan");
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
    const keys = ["acc-highcontrast", "acc-reducedmotion", "acc-simplelanguage", "acc-screenreaderlabels"];
    keys.forEach((k) => localStorage.setItem(k, "false"));
    localStorage.setItem("acc-textsize", "normal");
    announce("Semua pengaturan aksesibilitas telah direset.");
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

      {/* Live region for screen reader announcements */}
      <div
        ref={announceRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      />
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
