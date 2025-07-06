"use client";

import { Calendar, MapPin, Github, ExternalLink, Building2 } from "lucide-react";
import { getExperiences } from "@/utils/actions/data";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface Experience {
    id: string;
    company: string;
    position: string;
    description: string;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    location: string | null;
    technologies: string[];
    image_url: string | null;
    created_at: string;
}

export function ExperienceSection() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const fetchExperiences = async () => {
            const data = await getExperiences();
            setExperiences(data as any);
        };
        fetchExperiences();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = Number.parseInt(
                        entry.target.getAttribute("data-index") || "0"
                    );
                    if (entry.isIntersecting) {
                        setVisibleCards((prev) => new Set([...prev, index]));
                    }
                });
            },
            { threshold: 0.2, rootMargin: "50px" }
        );

        cardRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [experiences]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "short",
        });
    };

    const handleGitHubClick = () => {
        window.open("https://github.com/devjoseh?tab=repositories", "_blank");
    };

    return (
        <section className="py-16 md:py-20 bg-gray-900/50 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-48 h-48 bg-purple-600/3 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-0 relative z-10">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent animate-fadeInUp">
                        Experiência
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4 animate-fadeInUp delay-200">
                        Minha jornada no desenvolvimento backend, construindo
                        sistemas escaláveis e liderando iniciativas técnicas.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="relative">
                        {/* Static Timeline line */}
                        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-purple-600 to-purple-700 rounded-full shadow-lg shadow-purple-500/20" />

                        {experiences.map((experience, index) => (
                            <div
                                key={experience.id}
                                ref={(el: any) => (cardRefs.current[index] = el)}
                                data-index={index}
                                className={`relative flex items-start mb-8 md:mb-12 transition-all duration-700 ease-out ${
                                    visibleCards.has(index)
                                        ? "opacity-100 translate-x-0"
                                        : "opacity-0 translate-x-8"
                                }`}
                                style={{ transitionDelay: `${index * 200}ms` }}
                            >
                                {/* Timeline dot */}
                                <div className="absolute left-4 md:left-6 w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full border-4 border-gray-900 z-10 shadow-lg shadow-purple-500/30" />

                                <div className="ml-12 md:ml-16 w-full">
                                    <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 backdrop-blur-sm">
                                        <CardContent className="p-4 md:p-6">
                                            <div className="flex flex-col lg:flex-row gap-6">
                                                {/* Company Image Section */}
                                                <div className="flex-shrink-0">
                                                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-700/50 rounded-xl border border-gray-600 flex items-center justify-center overflow-hidden group hover:border-purple-500/50 transition-all duration-300">
                                                        <Image
                                                            src={
                                                                experience.image_url ||
                                                                "/placeholder.svg?height=80&width=80"
                                                            }
                                                            alt={`${experience.company} logo`}
                                                            width={80}
                                                            height={80}
                                                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Content Section */}
                                                <div className="flex-1">
                                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                                                        <div className="mb-3 lg:mb-0">
                                                            <h3 className="text-lg md:text-xl font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors duration-300">
                                                                {
                                                                    experience.position
                                                                }
                                                            </h3>
                                                            <div className="flex items-center gap-2 text-purple-400 font-medium">
                                                                <Building2 className="w-4 h-4" />
                                                                <span className="text-base md:text-lg">
                                                                    {
                                                                        experience.company
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col lg:items-end text-sm text-gray-400">
                                                            <div className="flex items-center gap-1 mb-1">
                                                                <Calendar className="w-4 h-4" />
                                                                <span>
                                                                    {formatDate(
                                                                        experience.start_date
                                                                    )}{" "}
                                                                    -{" "}
                                                                    {experience.is_current
                                                                        ? "Presente"
                                                                        : formatDate(
                                                                              experience.end_date!
                                                                          )}
                                                                </span>
                                                            </div>
                                                            {experience.location && (
                                                                <div className="flex items-center gap-1">
                                                                    <MapPin className="w-4 h-4" />
                                                                    <span>
                                                                        {
                                                                            experience.location
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <p className="text-gray-300 mb-4 leading-relaxed text-sm md:text-base">
                                                        {experience.description}
                                                    </p>

                                                    <div className="flex flex-wrap gap-2">
                                                        {experience.technologies.map(
                                                            (
                                                                tech,
                                                                techIndex
                                                            ) => (
                                                                <Badge
                                                                    key={tech}
                                                                    variant="secondary"
                                                                    className="bg-purple-900/30 text-purple-300 border-purple-500/30 text-xs hover:bg-purple-900/50 transition-all duration-300 transform hover:scale-105"
                                                                    style={{
                                                                        animationDelay: `${
                                                                            techIndex *
                                                                            50
                                                                        }ms`,
                                                                    }}
                                                                >
                                                                    {tech}
                                                                </Badge>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Compact GitHub Call-to-Action Section */}
                <div className="mt-12 md:mt-16">
                    <Card className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 border-purple-500/30 backdrop-blur-sm relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-purple-800/5" />
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl" />
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-600/10 rounded-full blur-lg" />

                        <CardContent className="p-6 md:p-8 relative z-10">
                            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                                {/* GitHub Logo - Left */}
                                <div className="flex-shrink-0">
                                    <Github className="w-12 h-12 md:w-14 md:h-14 text-purple-400" />
                                </div>

                                {/* Text Content - Center */}
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                                        Explore Meus Repositórios
                                    </h3>
                                    <p className="text-gray-300 text-sm md:text-base">
                                        Conheça meus projetos e veja de perto a
                                        minha evolução na área.
                                    </p>
                                </div>

                                {/* Button - Right */}
                                <div className="flex-shrink-0">
                                    <Button
                                        onClick={handleGitHubClick}
                                        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 group"
                                    >
                                        Ver Repositórios
                                        <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease-out forwards;
                }

                .delay-200 {
                    animation-delay: 200ms;
                }
            `}</style>
        </section>
    );
}
