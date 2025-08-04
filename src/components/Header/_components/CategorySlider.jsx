"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories } from "@/components/data/categories";

export default function CategorySlider({ className }) {
  const scrollContainerRef = useRef(null);
  const subcategoryScrollRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [showSubLeftButton, setShowSubLeftButton] = useState(false);
  const [showSubRightButton, setShowSubRightButton] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef(null);

  const scroll = (direction, containerRef) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollAmount = direction === "left" ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;

    const checkScrollPosition = () => {
      if (container) {
        setShowLeftButton(container.scrollLeft > 0);
        setShowRightButton(
          container.scrollLeft + container.clientWidth < container.scrollWidth
        );
      }
    };

    if (container) {
      container.addEventListener("scroll", checkScrollPosition);
      checkScrollPosition();
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScrollPosition);
      }
    };
  }, []);

  useEffect(() => {
    const container = subcategoryScrollRef.current;

    const checkScrollPosition = () => {
      if (container) {
        setShowSubLeftButton(container.scrollLeft > 0);
        setShowSubRightButton(
          container.scrollLeft + container.clientWidth < container.scrollWidth
        );
      }
    };

    if (container && activeCategory) {
      container.addEventListener("scroll", checkScrollPosition);
      checkScrollPosition();
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScrollPosition);
      }
    };
  }, [activeCategory]);

  const handleCategoryHover = (categoryId) => {
    clearTimeout(dropdownTimeoutRef.current);
    setActiveCategory(categoryId);
    setIsDropdownOpen(true);
  };

  const handleCategoryClick = (categoryId, e) => {
    if (activeCategory === categoryId && isDropdownOpen) {
      // If clicking the active category, just close the dropdown
      setIsDropdownOpen(false);
      setActiveCategory(null);
    } else {
      // Otherwise, open the dropdown for this category
      setActiveCategory(categoryId);
      setIsDropdownOpen(true);
      e.preventDefault(); // Prevent navigation
    }
  };

  const handleCategoryLeave = () => {
    if (!isHoveringMenu) {
      dropdownTimeoutRef.current = setTimeout(() => {
        setIsDropdownOpen(false);
        setActiveCategory(null);
      }, 300); // Small delay to allow moving to dropdown
    }
  };

  const handleMenuEnter = () => {
    clearTimeout(dropdownTimeoutRef.current);
    setIsHoveringMenu(true);
  };

  const handleMenuLeave = () => {
    setIsHoveringMenu(false);
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
      setActiveCategory(null);
    }, 300); // Small delay for better UX
  };

  const activeCategoryData = categories.find(
    (cat) => cat.id === activeCategory
  );

  return (
    <div
      className={cn(
        "relative  border-t-2 w-full bg-white source-serif-text",
        className
      )}
    >
      <div className={cn("container max-w-7xl mx-auto relative w-full")}>
        {/* Left Scroll Button (Hidden Initially) */}
        {showLeftButton && (
          <div className="absolute left-0 top-1/2 z-20 -translate-y-1/2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border bg-background shadow-sm cursor-pointer"
              onClick={() => scroll("left", scrollContainerRef)}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Category Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center overflow-x-auto   scrollbar-hide"
        >
          {categories.map((category) => (
            <a
              key={category.id}
              href={category.href}
              className={cn(
                "whitespace-nowrap border-l-2 px-4 py-2 text-sm font-medium transition-colors relative",
                activeCategory === category.id && isDropdownOpen
                  ? "text-primary after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:bg-primary"
                  : "text-gary-800 hover:text-foreground"
              )}
              onMouseEnter={() => handleCategoryHover(category.id)}
              onMouseLeave={handleCategoryLeave}
              onClick={(e) => handleCategoryClick(category.id, e)}
            >
              {category.name}
            </a>
          ))}
        </div>

        {/* Right Scroll Button (Hidden at the End) */}
        {showRightButton && (
          <div className="absolute right-0 top-1/2 z-20 -translate-y-1/2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border bg-background shadow-sm cursor-pointer"
              onClick={() => scroll("right", scrollContainerRef)}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Mega Menu Dropdown */}
      {activeCategory && isDropdownOpen && (
        <div
          className="container max-w-7xl mx-auto absolute left-0 right-0 bg-background border-t border-b z-10 shadow-md transition-all duration-300 ease-in-out"
          onMouseEnter={handleMenuEnter}
          onMouseLeave={handleMenuLeave}
          style={{
            opacity: isDropdownOpen ? 1 : 0,
            transform: isDropdownOpen ? "translateY(0)" : "translateY(-10px)",
          }}
        >
          <div className=" px-4 relative">
            {/* Subcategory Scroll Buttons */}
            {showSubLeftButton && (
              <div className="absolute left-0 top-1/2 z-20 -translate-y-1/2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full border bg-background shadow-sm cursor-pointer"
                  onClick={() => scroll("left", subcategoryScrollRef)}
                  aria-label="Scroll subcategories left"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Scrollable Subcategories Container */}
            <div
              ref={subcategoryScrollRef}
              className="overflow-x-auto px-10  scrollbar-hide"
            >
              <div className="flex gap-8 min-w-max">
                {activeCategoryData?.subcategories.map((subcategory, index) => (
                  <div
                    key={index}
                    className={cn(
                      "space-y-3  min-w-[200px] p-4  ",
                      index % 2 === 0 ? "bg-white py-6" : "bg-gray-300 py-6"
                    )}
                  >
                    <h3 className="font-medium text-foreground">
                      <a
                        href={subcategory.href}
                        className="hover:text-primary transition-colors"
                      >
                        {subcategory.title}
                      </a>
                    </h3>
                    <ul className="space-y-2">
                      {subcategory.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <a
                            href={item.href}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Scroll Button for Subcategories */}
            {showSubRightButton && (
              <div className="absolute right-0 top-1/2 z-20 -translate-y-1/2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full border bg-background shadow-sm cursor-pointer"
                  onClick={() => scroll("right", subcategoryScrollRef)}
                  aria-label="Scroll subcategories right"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
