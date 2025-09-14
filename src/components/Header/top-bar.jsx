"use client";

import { Phone, Mail, Clock, MapPin } from "lucide-react";
import Link from "next/link";

export function TopBar() {
  return (
    <div className="hidden md:block bg-primary uppercase py-1 text-white w-full  text-xs noto-sans-text ">
      <div className="container max-w-7xl mx-auto flex justify-end items-center xl:px-3 sm:px-4 px-[3px] space-x-4">
        {/* Right: Contact info */}
        <Link href="/auth/login">Login</Link>
        <Link href="/auth/register">Sign Up</Link>
      </div>
    </div>
  );
}
