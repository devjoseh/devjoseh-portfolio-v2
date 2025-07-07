"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    LinkIcon,
    ExternalLink,
    ArrowRight,
    Sparkles,
    Zap,
    Users,
    Globe,
    Star,
} from "lucide-react";

export function LinksCTASection() {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
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
        <section ref={sectionRef} className="py-16 relative">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl" />
            </div>

            <Card
                className={`relative bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-pink-500/5 border-pink-500/20 hover:border-pink-400/30 transition-all duration-500 overflow-hidden group ${
                    isVisible
                        ? "animate-in slide-in-from-bottom-4 duration-700"
                        : "opacity-0"
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Animated background shine effect */}
                <div
                    className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full transition-transform duration-1000 ${
                        isHovered ? "translate-x-full" : ""
                    }`}
                />

                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className={`absolute w-1 h-1 bg-pink-400 rounded-full transition-all duration-1000 ${
                                isHovered
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-0"
                            }`}
                            style={{
                                left: `${20 + i * 15}%`,
                                top: `${30 + (i % 2) * 40}%`,
                                transitionDelay: `${i * 100}ms`,
                            }}
                        />
                    ))}
                </div>

                <CardContent className="p-8 md:p-12">
                    <div className="grid lg:grid-cols-3 gap-8 items-center">
                        {/* Left - Icon */}
                        <div className="flex justify-center lg:justify-start">
                            <div
                                className={`relative p-6 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl border border-pink-500/30 transition-all duration-300 ${
                                    isHovered ? "scale-110 rotate-3" : ""
                                }`}
                            >
                                <LinkIcon className="w-12 h-12 text-pink-400" />

                                {/* Floating icons */}
                                <Sparkles
                                    className={`absolute -top-2 -right-2 w-4 h-4 text-pink-300 transition-all duration-500 ${
                                        isHovered
                                            ? "opacity-100 scale-100 rotate-12"
                                            : "opacity-0 scale-0"
                                    }`}
                                />
                                <Zap
                                    className={`absolute -bottom-1 -left-1 w-3 h-3 text-purple-300 transition-all duration-500 delay-100 ${
                                        isHovered
                                            ? "opacity-100 scale-100 -rotate-12"
                                            : "opacity-0 scale-0"
                                    }`}
                                />
                            </div>
                        </div>

                        {/* Center - Content */}
                        <div className="lg:col-span-1 text-center lg:text-left space-y-4">
                            <div className="space-y-3">
                                <h3 className="text-2xl md:text-3xl font-bold text-white">
                                    Explore Meus{" "}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                                        Links
                                    </span>
                                </h3>
                                <p className="text-gray-300 leading-relaxed">
                                    Descubra uma coleção organizada dos meus
                                    perfis sociais, projetos e recursos úteis em
                                    um só lugar.
                                </p>
                            </div>

                            {/* Feature badges */}
                            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                                {[
                                    {
                                        icon: Globe,
                                        label: "Interativo",
                                        delay: "0ms",
                                    },
                                    {
                                        icon: Users,
                                        label: "Organizado",
                                        delay: "100ms",
                                    },
                                    {
                                        icon: Star,
                                        label: "Rápido",
                                        delay: "200ms",
                                    },
                                ].map((feature) => (
                                    <Badge
                                        key={feature.label}
                                        className={`bg-pink-500/10 text-pink-300 border-pink-500/30 hover:bg-pink-500/20 transition-all duration-300 ${
                                            isHovered ? "scale-105" : ""
                                        }`}
                                        style={{
                                            transitionDelay: feature.delay,
                                        }}
                                    >
                                        <feature.icon className="w-3 h-3 mr-1" />
                                        {feature.label}
                                    </Badge>
                                ))}
                            </div>

                            {/* Status indicators */}
                            <div className="flex items-center gap-4 justify-center lg:justify-start text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-2 h-2 bg-green-400 rounded-full transition-all duration-300 ${
                                            isHovered ? "animate-pulse" : ""
                                        }`}
                                    />
                                    <span>Links Sociais</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-2 h-2 bg-blue-400 rounded-full transition-all duration-300 ${
                                            isHovered ? "animate-pulse" : ""
                                        }`}
                                    />
                                    <span>Projetos</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-2 h-2 bg-purple-400 rounded-full transition-all duration-300 ${
                                            isHovered ? "animate-pulse" : ""
                                        }`}
                                    />
                                    <span>Recursos</span>
                                </div>
                            </div>
                        </div>

                        {/* Right - CTA Button */}
                        <div className="flex justify-center lg:justify-end">
                            <Button
                                onClick={handleNavigateToLinks}
                                size="lg"
                                className={`bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-pink-500/25 group ${
                                    isHovered
                                        ? "shadow-2xl shadow-pink-500/30"
                                        : ""
                                }`}
                            >
                                <span className="mr-3">Explorar Links</span>
                                <div className="relative overflow-hidden">
                                    <ExternalLink
                                        className={`w-5 h-5 transition-all duration-300 ${
                                            isHovered
                                                ? "translate-x-1 opacity-0"
                                                : "translate-x-0 opacity-100"
                                        }`}
                                    />
                                    <ArrowRight
                                        className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${
                                            isHovered
                                                ? "translate-x-0 opacity-100"
                                                : "-translate-x-1 opacity-0"
                                        }`}
                                    />
                                </div>
                            </Button>
                        </div>
                    </div>

                    {/* Bottom accent line */}
                    <div
                        className={`mt-8 h-0.5 bg-gradient-to-r from-pink-500/50 via-purple-500/50 to-pink-500/50 transition-all duration-500 ${
                            isHovered
                                ? "scale-x-100 opacity-100"
                                : "scale-x-0 opacity-50"
                        } origin-center`}
                    />
                </CardContent>
            </Card>
        </section>
    );
}
