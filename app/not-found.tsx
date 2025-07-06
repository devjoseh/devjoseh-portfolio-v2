"use client";

import { Home, Search, ArrowLeft, Code2, Zap, Sparkles, RefreshCw, Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";

export default function NotFound() {
    const [isVisible, setIsVisible] = useState(false);
    const [glitchText, setGlitchText] = useState("404");
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isGlitching, setIsGlitching] = useState(false);

    // Animation trigger
    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Glitch effect for 404 text
    useEffect(() => {
        const glitchChars = [ "4", "0", "4", "█", "▓", "▒", "░", "◆", "◇", "●", "○" ];
        const originalText = "404";

        const glitchInterval = setInterval(() => {
            if (Math.random() > 0.85) {
                setIsGlitching(true);
                let iterations = 0;
                const glitchTimer = setInterval(() => {
                    setGlitchText(
                        originalText
                            .split("")
                            .map((char) => {
                                if (iterations < 3 && Math.random() > 0.7) {
                                    return glitchChars[
                                        Math.floor(
                                            Math.random() * glitchChars.length
                                        )
                                    ];
                                }
                                return char;
                            })
                            .join("")
                    );
                    iterations++;
                    if (iterations > 5) {
                        clearInterval(glitchTimer);
                        setGlitchText(originalText);
                        setIsGlitching(false);
                    }
                }, 100);
            }
        }, 1500);

        return () => clearInterval(glitchInterval);
    }, []);

    // Mouse tracking for interactive elements
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const quickLinks = [
        { label: "Projetos", href: "/#projects", icon: Code2, color: "purple" },
        { label: "Experiência", href: "/#experience", icon: Zap, color: "green" },
        { label: "Sobre", href: "/#about", icon: Sparkles, color: "blue" },
        { label: "Links", href: "/links", icon: ExternalLink, color: "pink" },
    ];

    const socialLinks = [
        { label: "GitHub", href: "https://github.com/devjoseh", icon: Github },
        { label: "LinkedIn", href: "https://linkedin.com/in/devjoseh", icon: Linkedin },
        { label: "Email", href: "mailto:contato@devjoseh.com.br", icon: Mail },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating particles */}
                <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400/30 rounded-full animate-bounce delay-300" />
                <div className="absolute top-40 right-32 w-1 h-1 bg-purple-300/40 rounded-full animate-bounce delay-700" />
                <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-purple-500/20 rounded-full animate-bounce delay-1000" />
                <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-400/25 rounded-full animate-bounce delay-500" />

                {/* Large gradient orbs */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse delay-1000" />

                {/* Interactive cursor follower */}
                <div
                    className="absolute w-32 h-32 bg-purple-500/5 rounded-full blur-2xl transition-all duration-300 ease-out pointer-events-none"
                    style={{
                        left: mousePosition.x - 64,
                        top: mousePosition.y - 64,
                        transform: `scale(${isGlitching ? 1.5 : 1})`,
                    }}
                />
            </div>

            {/* Navigation Header */}
            <nav className="relative z-10 p-4 md:p-6">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <Link
                        href="/"
                        className="transition-transform hover:scale-105"
                    >
                        <Logo showText={true} />
                    </Link>
                    <Button
                        asChild
                        variant="outline"
                        className="border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 bg-transparent"
                    >
                        <Link href="/">
                            <Home className="w-4 h-4 mr-2" />
                            Voltar ao Início
                        </Link>
                    </Button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
                <div className="max-w-4xl mx-auto text-center">
                    {/* 404 Glitch Text */}
                    <div
                        className={`transition-all duration-1000 ${
                            isVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10"
                        }`}
                    >
                        <div className="relative mb-8">
                            <h1
                                className={`text-8xl md:text-9xl lg:text-[12rem] font-black bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent select-none transition-all duration-200 ${
                                    isGlitching ? "animate-pulse scale-110" : ""
                                }`}
                                style={{
                                    textShadow: isGlitching
                                        ? "0 0 20px rgba(168, 85, 247, 0.5)"
                                        : "none",
                                    filter: isGlitching ? "blur(1px)" : "none",
                                }}
                            >
                                {glitchText}
                            </h1>

                            {/* Glitch overlay effects */}
                            {isGlitching && (
                                <>
                                    <div className="absolute inset-0 text-8xl md:text-9xl lg:text-[12rem] font-black text-red-500/30 animate-ping">
                                        404
                                    </div>
                                    <div className="absolute inset-0 text-8xl md:text-9xl lg:text-[12rem] font-black text-blue-500/20 animate-pulse">
                                        404
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Error Message */}
                    <div
                        className={`transition-all duration-1000 delay-300 ${
                            isVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10"
                        }`}
                    >
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                            Oops! Página Não Encontrada
                        </h2>
                        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Parece que você se aventurou em um território
                            inexplorado do meu portfólio. Não se preocupe, até
                            os melhores desenvolvedores se perdem às vezes! ☺️
                        </p>
                    </div>

                    {/* Interactive Cards */}
                    <div
                        className={`transition-all duration-1000 delay-500 ${
                            isVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10"
                        }`}
                    >
                        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-8 hover:bg-gray-800/70 transition-all duration-300">
                            <CardContent className="p-6 md:p-8">
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                                            <Search className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            Que tal explorar outras áreas?
                                        </h3>
                                        <p className="text-gray-300 mb-4">
                                            Enquanto você está aqui, por que não
                                            dar uma olhada nos meus projetos ou
                                            experiências?
                                        </p>

                                        {/* Quick Navigation */}
                                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                            {quickLinks.map((link) => (
                                                <Button
                                                    key={link.label}
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                    className={`border-${link.color}-500/30 hover:border-${link.color}-500 hover:bg-${link.color}-500/10 bg-transparent transition-all duration-300 hover:scale-105`}
                                                >
                                                    <Link href={link.href}>
                                                        <link.icon className="w-3 h-3 mr-2" />
                                                        {link.label}
                                                    </Link>
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Action Buttons */}
                    <div
                        className={`transition-all duration-1000 delay-700 ${
                            isVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10"
                        }`}
                    >
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                            <Button
                                asChild
                                size="lg"
                                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                            >
                                <Link href="/">
                                    <Home className="w-5 h-5 mr-2" />
                                    Voltar ao Início
                                </Link>
                            </Button>

                            <Button
                                onClick={() => window.history.back()}
                                variant="outline"
                                size="lg"
                                className="border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 bg-transparent px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Página Anterior
                            </Button>

                            <Button
                                onClick={() => window.location.reload()}
                                variant="outline"
                                size="lg"
                                className="border-gray-500/30 hover:border-gray-500 hover:bg-gray-500/10 bg-transparent px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                            >
                                <RefreshCw className="w-5 h-5 mr-2" />
                                Recarregar
                            </Button>
                        </div>
                    </div>

                    {/* Fun Facts */}
                    <div
                        className={`transition-all duration-1000 delay-900 ${
                            isVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10"
                        }`}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300 group">
                                <CardContent className="p-4 text-center">
                                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                                        <Code2 className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="bg-purple-900/30 text-purple-300 text-xs"
                                    >
                                        Erro 404 = Oportunidade de melhoria
                                    </Badge>
                                </CardContent>
                            </Card>

                            <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300 group">
                                <CardContent className="p-4 text-center">
                                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                                        <Zap className="w-4 h-4 text-green-400" />
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="bg-green-900/30 text-green-300 text-xs"
                                    >
                                        Desenvolvedor sempre aprendendo
                                    </Badge>
                                </CardContent>
                            </Card>

                            <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300 group">
                                <CardContent className="p-4 text-center">
                                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                                        <Sparkles className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="bg-blue-900/30 text-blue-300 text-xs"
                                    >
                                        Transformando bugs em features
                                    </Badge>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div
                        className={`transition-all duration-1000 delay-1100 ${
                            isVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10"
                        }`}
                    >
                        <div className="flex justify-center gap-4">
                            {socialLinks.map((social) => (
                                <Button
                                    key={social.label}
                                    asChild
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 bg-transparent transition-all duration-300 hover:scale-110"
                                >
                                    <Link 
                                        href={social.href} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        aria-label={social.label}
                                    >
                                        <social.icon className="w-4 h-4" />
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 text-center p-6 text-gray-400 text-sm">
                <p>
                    © 2025 DevJoseH. Até os 404s podem ser uma experiência
                    incrível! ✨
                </p>
            </footer>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes float {
                    0%,
                    100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                @keyframes glitch {
                    0% {
                        transform: translate(0);
                    }
                    20% {
                        transform: translate(-2px, 2px);
                    }
                    40% {
                        transform: translate(-2px, -2px);
                    }
                    60% {
                        transform: translate(2px, 2px);
                    }
                    80% {
                        transform: translate(2px, -2px);
                    }
                    100% {
                        transform: translate(0);
                    }
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                .animate-glitch {
                    animation: glitch 0.3s ease-in-out;
                }
            `}</style>
        </div>
    );
}
