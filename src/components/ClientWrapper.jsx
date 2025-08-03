"use client";

import { useEffect } from "react";
import { initAOS } from "@/lib/aos";

export default function ClientWrapper({ children }) {
  useEffect(() => {
    initAOS();
  }, []);

  return <>{children}</>;
}
