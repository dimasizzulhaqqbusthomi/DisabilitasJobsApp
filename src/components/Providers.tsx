"use client";

import React from "react";
import { AccessibilityProvider } from "../context/AccessibilityContext";
import { AppProvider } from "../context/AppContext";
import { AuthProvider } from "../context/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <AppProvider>{children}</AppProvider>
      </AccessibilityProvider>
    </AuthProvider>
  );
}
