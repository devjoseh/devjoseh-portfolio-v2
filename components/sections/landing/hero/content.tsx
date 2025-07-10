"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { Terminal } from "@/components/index";
import Link from "next/link";

export function HeroContent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const scrollToProjects = () => {
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center justify-center min-h-[calc(100vh-8rem)]">
            <div
                className={`w-full text-center lg:text-left order-1 lg:order-1 transition-all duration-1000 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
            >
                <div className="mb-8 space-y-2">
                    <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent leading-tight">
                        DevJoseH
                    </h1>

                    <h2 className="text-2xl md:text-4xl font-semibold text-gray-200 leading-tight">
                        José Hernanes
                    </h2>

                    <p className="text-lg md:text-xl text-purple-400 font-medium">
                        Desenvolvedor Back-end
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12">
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

                <div className="animate-bounce text-center lg:text-left">
                    <ArrowDown className="w-6 h-6 text-purple-400 mx-auto lg:mx-0" />
                </div>
            </div>

            <div
                className={`w-full order-2 lg:order-2 transition-all duration-1000 delay-300 ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                }`}
            >
                <div className="flex justify-center lg:justify-end">
                    <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mobile-terminal-wrapper">
                        <Terminal className="w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}
