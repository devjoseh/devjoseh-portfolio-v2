"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface SkillItem {
    name: string;
    category: string;
    icon: string;
}

export function SkillsToolsSection() {
    const [activeFilter, setActiveFilter] = useState("Todos");

    const skills: SkillItem[] = [
        // Linguagens
        { name: "HTML", category: "Linguagens", icon: "html" },
        { name: "CSS", category: "Linguagens", icon: "css" },
        { name: "JavaScript", category: "Linguagens", icon: "js" },
        { name: "TypeScript", category: "Linguagens", icon: "ts" },
        { name: "Python", category: "Linguagens", icon: "py" },
        { name: "Lua", category: "Linguagens", icon: "lua" },

        // Frameworks
        { name: "React", category: "Frameworks", icon: "react" },
        { name: "Node.js", category: "Frameworks", icon: "nodejs" },
        { name: "Next.js", category: "Frameworks", icon: "nextjs" },
        { name: "Discord.js", category: "Frameworks", icon: "discordjs" },

        // Ferramentas
        { name: "VS Code", category: "Ferramentas", icon: "vscode" },
        { name: "Figma", category: "Ferramentas", icon: "figma" },
        { name: "Replit", category: "Ferramentas", icon: "replit" },
        { name: "Git", category: "Ferramentas", icon: "git" },
        { name: "GitHub", category: "Ferramentas", icon: "github" },
        { name: "Discord", category: "Ferramentas", icon: "discord" },

        // Bancos de Dados
        { name: "Firebase", category: "Bancos de Dados", icon: "firebase" },
        { name: "MongoDB", category: "Bancos de Dados", icon: "mongodb" },
        { name: "Supabase", category: "Bancos de Dados", icon: "supabase" },
    ];

    const filters = [
        "Todos",
        "Linguagens",
        "Frameworks",
        "Ferramentas",
        "Bancos de Dados",
    ];

    const filteredSkills =
        activeFilter === "Todos"
            ? skills
            : skills.filter((skill) => skill.category === activeFilter);

    return (
        <section className="py-16 md:py-20 bg-gray-900/50">
            <div className="container mx-auto px-0">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                        Linguagens e Ferramentas
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
                        Tecnologias e ferramentas que utilizo no desenvolvimento
                        de projetos e soluções.
                    </p>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12">
                    {filters.map((filter) => (
                        <Button
                            key={filter}
                            variant={
                                activeFilter === filter ? "default" : "outline"
                            }
                            className={`
                px-4 py-2 text-sm md:text-base font-medium transition-all duration-300
                ${
                    activeFilter === filter
                        ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg"
                        : "border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 bg-transparent text-gray-300"
                }
              `}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter}
                        </Button>
                    ))}
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
                    {filteredSkills.map((skill, index) => (
                        <div
                            key={`${skill.name}-${index}`}
                            className="flex flex-col items-center p-4 md:p-6 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-4 flex items-center justify-center">
                                <Image
                                    src={`https://skillicons.dev/icons?i=${skill.icon}`}
                                    alt={skill.name}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="text-gray-300 text-sm md:text-base font-medium text-center">
                                {skill.name}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredSkills.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">
                            Nenhuma tecnologia encontrada para esta categoria.
                        </p>
                    </div>
                )}

                {/* Skills Count */}
                <div className="text-center mt-8 md:mt-12">
                    <p className="text-gray-400 text-sm md:text-base">
                        {activeFilter === "Todos"
                            ? `${skills.length} tecnologias no total`
                            : `${
                                  filteredSkills.length
                              } ${activeFilter.toLowerCase()} encontrada${
                                  filteredSkills.length !== 1 ? "s" : ""
                              }`}
                    </p>
                </div>
            </div>
        </section>
    );
}
