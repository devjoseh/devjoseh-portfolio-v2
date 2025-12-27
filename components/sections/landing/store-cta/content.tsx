"use client";

import { ShoppingBag, ExternalLink, Sparkles, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function StoreCTAContent() {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.2, rootMargin: "50px" }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={sectionRef}
            className={`transition-all duration-1000 ease-out ${
                isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
            }`}
        >
            <Card
                className={`bg-gradient-to-r from-purple-900/60 via-purple-800/50 to-purple-900/60 border-purple-500/40 backdrop-blur-sm relative overflow-hidden transition-all duration-500 ${
                    isHovered
                        ? "border-purple-400/70 shadow-2xl shadow-purple-500/30 scale-[1.02]"
                        : "hover:border-purple-500/50"
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-purple-800/10" />
                <div
                    className={`absolute top-0 left-0 w-40 h-40 bg-purple-500/15 rounded-full blur-xl transition-all duration-500 ${
                        isHovered
                            ? "scale-150 opacity-80"
                            : "scale-100 opacity-50"
                    }`}
                />
                <div
                    className={`absolute bottom-0 right-0 w-32 h-32 bg-purple-400/10 rounded-full blur-lg transition-all duration-500 ${
                        isHovered
                            ? "scale-125 opacity-70"
                            : "scale-100 opacity-40"
                    }`}
                />

                {/* Animated shine effect */}
                <div
                    className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent transition-all duration-1000 ${
                        isHovered
                            ? "translate-x-full"
                            : "-translate-x-full"
                    }`}
                />

                <CardContent className="p-6 md:p-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-8">
                        {/* Icon Section - Left */}
                        <div className="flex-shrink-0">
                            <div
                                className={`relative transition-all duration-500 ${
                                    isHovered
                                        ? "scale-110 -rotate-6"
                                        : "scale-100 rotate-0"
                                }`}
                            >
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                                    <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 text-white" />
                                </div>
                                {/* Floating sparkles */}
                                <div
                                    className={`absolute -top-2 -right-2 transition-all duration-300 ${
                                        isHovered
                                            ? "opacity-100 scale-100"
                                            : "opacity-0 scale-50"
                                    }`}
                                >
                                    <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
                                </div>
                                <div
                                    className={`absolute -bottom-1 -left-1 transition-all duration-300 delay-100 ${
                                        isHovered
                                            ? "opacity-100 scale-100"
                                            : "opacity-0 scale-50"
                                    }`}
                                >
                                    <Star className="w-3 h-3 text-purple-400 animate-bounce" />
                                </div>
                            </div>
                        </div>

                        {/* Content Section - Center */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="mb-4">
                                <h3
                                    className={`text-2xl md:text-3xl font-bold text-white mb-3 transition-all duration-300 ${
                                        isHovered ? "text-purple-200" : ""
                                    }`}
                                >
                                    DevJoseH Store
                                </h3>
                                <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl">
                                    Bots para Discord personalizados e outros
                                    serviços digitais exclusivos. Confira as
                                    opções disponíveis na minha loja!
                                </p>
                            </div>
                        </div>

                        {/* Action Button - Right */}
                        <div className="flex-shrink-0">
                            <Button
                                asChild
                                className={`bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl transition-all duration-300 transform shadow-lg group ${
                                    isHovered
                                        ? "scale-105 shadow-purple-500/40"
                                        : "hover:scale-105 hover:shadow-purple-500/30"
                                }`}
                            >
                                <Link
                                    href="https://store.devjoseh.com.br"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span className="flex items-center gap-2 font-semibold">
                                        Visitar Loja
                                        <div className="relative">
                                            <ExternalLink className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                        </div>
                                    </span>
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Bottom accent line */}
                    <div
                        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 via-purple-400 to-purple-600 transition-all duration-500 ${
                            isHovered
                                ? "w-full opacity-100"
                                : "w-0 opacity-0"
                        }`}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
