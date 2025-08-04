"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button"; // Import Button for the close icon
import { categories } from "@/components/data/categories";

export default function MobileNavSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="flex items-center justify-center cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="var(--color-rand-500)"
            className="text-gray-800"
            viewBox="0 0 120 60"
            width="26"
            height="26"
          >
            {" "}
            <rect width="60" height="7"></rect>{" "}
            <rect y="25" width="90" height="7"></rect>{" "}
            <rect y="50" width="120" height="7"></rect>{" "}
          </svg>
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="p-0 w-full max-w-[70%] sm:max-w-md flex flex-col h-full overflow-hidden source-serif-text"
      >
        <SheetHeader className="border-b p-4 flex flex-row items-center justify-between shrink-0">
          <div className="flex justify-between">
            <Link href="/" className="transition-opacity hover:opacity-80">
              <img
                src="/logo/logo.png?height=24&width=auto"
                alt="KinMel Mandu Logo"
                className="h-9 w-auto"
              />
            </Link>
          </div>
        </SheetHeader>
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto pb-16 flex-1">
            <Accordion type="multiple" className="w-full">
              {categories.map((category) => (
                <AccordionItem
                  key={category.id}
                  value={category.id}
                  className="border-b"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline cursor-pointer text-md  font-medium">
                    {category.name}
                  </AccordionTrigger>
                  <AccordionContent className="pb-0">
                    {/* Nested Accordion for subcategories */}
                    <Accordion type="multiple" className="w-full pl-4">
                      {category.subcategories.map((subcategory) => (
                        <AccordionItem
                          key={subcategory.title}
                          value={subcategory.title}
                          className="border-t"
                        >
                          <AccordionTrigger className="px-2 py-2 hover:no-underline cursor-pointer text-sm text-primary font-medium">
                            {subcategory.title}
                          </AccordionTrigger>
                          <AccordionContent className="pb-0">
                            <ul className="space-y-2 pl-4 py-2">
                              {subcategory.items.map((item) => (
                                <li key={item.name} className="py-1">
                                  <Link
                                    href={item.href}
                                    className="text-gray-600 hover:text-purple-600 text-xs transition-colors"
                                    onClick={() => setOpen(false)}
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
