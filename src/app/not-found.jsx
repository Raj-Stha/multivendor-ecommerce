"use client";

import Header from "@/components/Header/Header";
import MobileBottomNav from "@/components/Header/mobile-bottom-nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
    return (
        <>
            <div className="fixed top-0 left-0 w-full z-50">
                <Header />
            </div>

            <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-gradient-to-b from-primary/5 via-secondary/10 to-background relative overflow-hidden jost-text">
                {/* Animated Background Circles */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0.1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute w-96 h-96 bg-primary/30 rounded-full blur-3xl top-10 left-10"
                />
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0.1 }}
                    transition={{ delay: 0.3, duration: 2, ease: "easeOut" }}
                    className="absolute w-96 h-96 bg-secondary/30 rounded-full blur-3xl bottom-10 right-10"
                />

                {/* 404 Text */}
                <motion.h1
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-[8rem] font-extrabold text-primary drop-shadow-lg tracking-tight"
                >
                    404
                </motion.h1>

                {/* Subheading */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-3xl font-semibold text-secondary mb-3"
                >
                    Oops! Page Not Found
                </motion.h2>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-gray-600 max-w-md mb-8 leading-relaxed"
                >
                    The page you’re looking for doesn’t exist or might have been moved.
                    Let’s bring you back to where the magic happens.
                </motion.p>

                {/* Button */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    <Link href="/">
                        <Button
                            size="lg"
                            className="px-8 py-4 text-lg rounded-full bg-primary text-white hover:bg-primary/90 flex items-center gap-2 shadow-xl hover:shadow-primary/30 transition-all duration-300"
                        >
                            <Home size={20} />
                            Go Back Home
                        </Button>
                    </Link>
                </motion.div>
            </main>

            <MobileBottomNav />
            <Footer />
        </>
    );
}
