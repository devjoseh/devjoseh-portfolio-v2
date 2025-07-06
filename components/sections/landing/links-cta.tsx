"use client";

import { LinkIcon, ExternalLink, Sparkles, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LinksCTASection() {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

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

    const handleNavigateToLinks = () => {
        router.push("/links");
    };

    return (
        <section
            className="py-12 md:py-16 bg-gray-900/30"
            ref={sectionRef}
        >
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-600/3 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-radial from-pink-500/3 to-transparent rounded-full" />
            </div>

            <div className="container mx-auto px-0 relative z-10">
                <div
                    className={`transition-all duration-1000 ease-out ${
                        isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-8"
                    }`}
                >
                    <Card
                        className={`bg-gradient-to-r from-gray-800/80 to-gray-900/80 border-pink-500/30 backdrop-blur-sm relative overflow-hidden transition-all duration-500 ${
                            isHovered
                                ? "border-pink-500/60 shadow-2xl shadow-pink-500/20 scale-[1.02]"
                                : "hover:border-pink-500/50"
                        }`}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* Background decoration */}
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-900/10 to-purple-800/5" />
                        <div
                            className={`absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-xl transition-all duration-500 ${
                                isHovered
                                    ? "scale-150 opacity-80"
                                    : "scale-100 opacity-40"
                            }`}
                        />
                        <div
                            className={`absolute bottom-0 left-0 w-24 h-24 bg-purple-600/10 rounded-full blur-lg transition-all duration-500 ${
                                isHovered
                                    ? "scale-125 opacity-60"
                                    : "scale-100 opacity-30"
                            }`}
                        />

                        {/* Animated shine effect */}
                        <div
                            className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-all duration-1000 ${
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
                                                ? "scale-110 rotate-12"
                                                : "scale-100 rotate-0"
                                        }`}
                                    >
                                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                            <LinkIcon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                                        </div>
                                        {/* Floating sparkles */}
                                        <div
                                            className={`absolute -top-2 -right-2 transition-all duration-300 ${
                                                isHovered
                                                    ? "opacity-100 scale-100"
                                                    : "opacity-0 scale-50"
                                            }`}
                                        >
                                            <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
                                        </div>
                                        <div
                                            className={`absolute -bottom-1 -left-1 transition-all duration-300 delay-100 ${
                                                isHovered
                                                    ? "opacity-100 scale-100"
                                                    : "opacity-0 scale-50"
                                            }`}
                                        >
                                            <Zap className="w-3 h-3 text-purple-400 animate-bounce" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section - Center */}
                                <div className="flex-1 text-center lg:text-left">
                                    <div className="mb-4">
                                        <h3
                                            className={`text-2xl md:text-3xl font-bold text-white mb-3 transition-all duration-300 ${
                                                isHovered ? "text-pink-300" : ""
                                            }`}
                                        >
                                            Todos os Meus Links em Um Só Lugar
                                        </h3>
                                        <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl">
                                            Coleção de todos os meus perfis sociais,
                                            projetos especiais e formas de
                                            contato para se conectar comigo.
                                        </p>
                                    </div>
                                </div>

                                {/* Action Button - Right */}
                                <div className="flex-shrink-0">
                                    <Button
                                        onClick={handleNavigateToLinks}
                                        className={`bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl transition-all duration-300 transform shadow-lg group ${
                                            isHovered
                                                ? "scale-105 shadow-pink-500/25"
                                                : "hover:scale-105 hover:shadow-pink-500/25"
                                        }`}
                                    >
                                        <span className="flex items-center gap-2 font-semibold">
                                            Explorar Links
                                            <div className="relative">
                                                <ExternalLink className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                            </div>
                                        </span>
                                    </Button>
                                </div>
                            </div>

                            {/* Bottom accent line */}
                            <div
                                className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500 ${
                                    isHovered
                                        ? "w-full opacity-100"
                                        : "w-0 opacity-0"
                                }`}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
