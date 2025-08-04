// hooks/useScrollDirection.ts
import { useEffect, useState } from "react";

export function useScrollDirection(threshold = 10) {
  const [scrollDirection, setScrollDirection] = useState("up");

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      if (Math.abs(scrollY - lastScrollY) < threshold) return;
      setScrollDirection(scrollY > lastScrollY ? "down" : "up");
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener("scroll", updateScrollDirection);
    return () => window.removeEventListener("scroll", updateScrollDirection);
  }, [threshold]);

  return scrollDirection;
}
