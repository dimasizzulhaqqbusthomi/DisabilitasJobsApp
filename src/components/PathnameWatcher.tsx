"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function PathnameWatcher() {
  const pathname = usePathname();
  
  useEffect(() => {
    if (pathname === "/dashboard") {
      document.body.classList.add("is-dashboard");
    } else {
      document.body.classList.remove("is-dashboard");
    }
  }, [pathname]);

  return null;
}
