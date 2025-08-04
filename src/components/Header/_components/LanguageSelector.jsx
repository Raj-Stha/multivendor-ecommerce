"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function LanguageSelector() {
  const [language, setLanguage] = useState("en")
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)

  return (
    <div
      className="flex items-center relative z-10"
      onMouseEnter={() => setLanguageMenuOpen(true)}
      onMouseLeave={() => setLanguageMenuOpen(false)}
    >
      <div className="flex items-center border rounded-md p-1.5 hover:border-gray-300 transition-colors cursor-pointer">
        <img
          src={
            language === "en"
              ? "https://www.jeevee.com/_next/static/media/us_flag.937a74e4.png"
              : "https://www.jeevee.com/_next/static/media/np_flag.e79b7bb9.png"
          }
          alt={language === "en" ? "UK Flag" : "Nepal Flag"}
          className="h-5 w-auto"
        />
        <ChevronDown className="h-3 w-3 ml-1 text-gray-500" />
      </div>

      {/* Language Selector Dropdown */}
      <div
        className={`absolute top-full right-0 mt-2 w-40 bg-white shadow-lg rounded-md border border-gray-100 transition-all duration-200 transform origin-top-right ${
          languageMenuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
        }`}
      >
        <div className="py-1">
          <button
            className={`flex items-center w-full cursor-pointer px-4 py-2 text-left transition-colors ${
              language === "en" ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
            onClick={() => setLanguage("en")}
          >
            <img
              src="https://www.jeevee.com/_next/static/media/us_flag.937a74e4.png"
              alt="UK Flag"
              className="h-5 w-auto mr-2"
            />
            <span>English</span>
          </button>
          <button
            className={`flex items-center w-full cursor-pointer px-4 py-2 text-left transition-colors ${
              language === "np" ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
            onClick={() => setLanguage("np")}
          >
            <img
              src="https://www.jeevee.com/_next/static/media/np_flag.e79b7bb9.png"
              alt="Nepal Flag"
              className="h-5 w-auto mr-2"
            />
            <span>नेपाली</span>
          </button>
        </div>
      </div>
    </div>
  )
}

