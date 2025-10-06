// components/info-links.tsx

import { Building2, Headphones, HelpCircle, Newspaper } from "lucide-react";
import Link from "next/link";

export function InfoLinks() {
  const linksD = [
    {
      icon: Building2,
      title: "About Us",
      description: "Learn more about us",
      link: "/about-us",
    },
    {
      icon: Headphones,
      title: "Contact Us",
      description: "We’re here to help",
      link: "/contact",
    },
    {
      icon: HelpCircle,
      title: "FAQ",
      description: "Find your answers",
      link: "/faq",
    },
    {
      icon: Newspaper,
      title: "Blog",
      description: "Read our latest posts",
      link: "/blog",
    },
  ];

  return (
    <div className="py-6 px-3 sm:px-6 md:px-8 bg-gray-50 jost-text">
      <div className="max-w-5xl mx-auto">
        {/* 2 columns on mobile, up to 4 on large */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {linksD.map((link, index) => (
            <Link
              href={link.link}
              key={index}
              className="
                flex flex-col items-center text-center 
                border border-gray-200 bg-transparent shadow-xl  
                p-4 sm:p-6
                hover:bg-white hover:shadow-md hover:-translate-y-1
                transition-all duration-200
                cursor-pointer
              "
            >
              <div
                className="
                  flex items-center justify-center 
                  w-12 h-12 sm:w-14 sm:h-14 
                   bg-transparent mb-3 sm:mb-4
                "
              >
                <link.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-sm sm:text-md  font-semibold text-gray-800 mb-1 ">
                {link.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 ">
                {link.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
