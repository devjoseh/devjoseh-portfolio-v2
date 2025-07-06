"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const scrollToProjects = () => {
        document
            .getElementById("projects")
            ?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
            {/* Enhanced Animated background elements - Full width */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-purple-500/5 to-transparent rounded-full" />

                {/* Floating particles */}
                <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400/30 rounded-full animate-bounce delay-300" />
                <div className="absolute top-40 right-32 w-1 h-1 bg-purple-300/40 rounded-full animate-bounce delay-700" />
                <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-purple-500/20 rounded-full animate-bounce delay-1000" />
                <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-400/25 rounded-full animate-bounce delay-500" />

                {/* Subtle moving gradients */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/2 to-transparent animate-pulse duration-4000" />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-purple-600/1 to-transparent animate-pulse duration-6000 delay-2000" />
            </div>

            {/* Content with proper margins */}
            <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16 z-10">
                <div
                    className={`text-center transition-all duration-1000 ${
                        isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                    }`}
                >
                    <div className="mb-8">
                        <div className="text-center space-y-2">
                            {/* Large prominent DevJoseH */}
                            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                                DevJoseH
                            </h1>

                            {/* Medium-sized José Hernanes */}
                            <h2 className="text-2xl md:text-4xl font-semibold text-gray-200">
                                José Hernanes
                            </h2>

                            {/* Smaller Desenvolvedor Back-end */}
                            <p className="text-lg md:text-xl text-purple-400 font-medium">
                                Desenvolvedor Back-end
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <Button
                            onClick={scrollToProjects}
                            size="lg"
                            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Ver Meus Projetos
                        </Button>
                        <div className="flex gap-4">
                            <Link
                                href="https://github.com/DevJoseH"
                                target="_blank"
                            >
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 bg-transparent transition-all duration-300 hover:scale-110"
                                >
                                    <Github className="w-5 h-5" />
                                </Button>
                            </Link>
                            <Link
                                href="https://www.linkedin.com/in/devjoseh/"
                                target="_blank"
                            >
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 bg-transparent transition-all duration-300 hover:scale-110"
                                >
                                    <Linkedin className="w-5 h-5" />
                                </Button>
                            </Link>
                            <Link
                                href="mailto:contato@devjoseh.com.br"
                                target="_blank"
                            >
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 bg-transparent transition-all duration-300 hover:scale-110"
                                >
                                    <Mail className="w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="animate-bounce">
                        <ArrowDown className="w-6 h-6 text-purple-400 mx-auto" />
                    </div>
                </div>
            </div>

            {/* Seamless transition element */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900 pointer-events-none" />

            {/* Extended background elements for smooth transition */}
            <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden pointer-events-none">
                <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-purple-500/3 rounded-full blur-3xl animate-pulse delay-2000" />
                <div className="absolute bottom-0 right-1/3 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl animate-pulse delay-3000" />
            </div>
        </section>
    );
}
