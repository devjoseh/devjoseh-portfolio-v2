"use client";

import { CommandPaletteTrigger } from "@/components/index";
import { Menu, X, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Logo } from "@/components/ui/logo";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Resumes } from "@/utils/supabase/types";

const LANGUAGE_FLAGS: Record<string, string> = {
    "pt-BR": "🇧🇷",
    "en": "🇺🇸",
};

interface NavigationContentProps {
    resumes?: Resumes[];
}

export function NavigationContent({ resumes = [] }: NavigationContentProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");

    const sections = [
        { id: "about", label: "Sobre" },
        { id: "skills", label: "Tecnologias" },
        { id: "experience", label: "Experiência" },
        { id: "projects", label: "Projetos" },
        { id: "hackathons", label: "Hackathons" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            // Check which section is currently in view
            const sectionElements = sections.map((section) => ({
                id: section.id,
                element: document.getElementById(section.id),
            }));

            const currentSection = sectionElements.find(({ element }) => {
                if (!element) return false;
                const rect = element.getBoundingClientRect();
                return rect.top <= 100 && rect.bottom >= 100;
            });

            if (currentSection) {
                setActiveSection(currentSection.id);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [sections]);

    const scrollToSection = (sectionId: string) => {
        document
            .getElementById(sectionId)
            ?.scrollIntoView({ behavior: "smooth" });
        setIsMobileMenuOpen(false);
    };

    const activeResumes = resumes.filter((r) => r.is_active);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-gray-900/95 backdrop-blur-sm border-b border-gray-800"
                    : "bg-transparent"
            }`}
        >
            {/* Navigation content with proper margins */}
            <div className="mx-4 md:mx-8 lg:mx-12 xl:mx-16">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Logo showText={true} className="scale-110" />

                    {/* Centered Desktop Navigation */}
                    <div className="hidden md:flex items-center justify-center flex-1">
                        <div className="flex items-center space-x-8 lg:space-x-10">
                            {sections.map((section) => (
                                <div key={section.id} className="relative">
                                    <button
                                        onClick={() =>
                                            scrollToSection(section.id)
                                        }
                                        className={`text-gray-300 hover:text-purple-400 transition-all duration-300 font-medium text-sm lg:text-base py-2 ${
                                            activeSection === section.id
                                                ? "text-purple-400"
                                                : ""
                                        }`}
                                    >
                                        {section.label}
                                    </button>
                                    {/* Active indicator line */}
                                    <div
                                        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300 transform origin-center ${
                                            activeSection === section.id
                                                ? "scale-x-100 opacity-100"
                                                : "scale-x-0 opacity-0"
                                        }`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right side actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Command Palette Trigger */}
                        <CommandPaletteTrigger />

                        {/* Download Resume Button */}
                        {activeResumes.length > 0 && (
                            activeResumes.length === 1 ? (
                                <a
                                    href={activeResumes[0].file_url}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button
                                        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-sm lg:text-base gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Baixar Currículo
                                        <span className="text-sm border-l border-white/20 pl-2 ml-1 hidden lg:inline-block">
                                            {LANGUAGE_FLAGS[activeResumes[0].language] ?? ""}
                                        </span>
                                    </Button>
                                </a>
                            ) : (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-sm lg:text-base gap-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            Baixar Currículo
                                            <ChevronDown className="w-4 h-4 opacity-70" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="bg-gray-900 border-gray-700 min-w-[180px] shadow-xl shadow-black/40 z-[100]"
                                    >
                                        {activeResumes.map((resume) => (
                                            <DropdownMenuItem key={resume.id} asChild>
                                                <a
                                                    href={resume.file_url}
                                                    download
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 cursor-pointer text-gray-200 hover:text-white hover:bg-purple-600/20 px-3 py-2.5 rounded-sm transition-colors"
                                                >
                                                    <span className="text-lg">
                                                        {LANGUAGE_FLAGS[resume.language] ?? "📄"}
                                                    </span>
                                                    <span className="font-medium">{resume.label}</span>
                                                </a>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center gap-2">
                        <CommandPaletteTrigger />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-gray-800"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 rounded-b-lg animate-in slide-in-from-top-2 duration-300">
                        <div className="px-4 py-4 space-y-4">
                            {sections.map((section) => (
                                <div key={section.id} className="relative">
                                    <button
                                        onClick={() =>
                                            scrollToSection(section.id)
                                        }
                                        className={`block w-full text-left transition-all duration-300 py-2 font-medium ${
                                            activeSection === section.id
                                                ? "text-purple-400 pl-4"
                                                : "text-gray-300 hover:text-purple-400 hover:pl-2"
                                        }`}
                                    >
                                        {section.label}
                                    </button>
                                    {/* Mobile active indicator */}
                                    <div
                                        className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-purple-600 transition-all duration-300 ${
                                            activeSection === section.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                        }`}
                                    />
                                </div>
                            ))}

                            {/* Mobile Download Button */}
                            {activeResumes.length > 0 && (
                                <div className="pt-4 border-t border-gray-700 flex flex-col gap-2">
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                        Currículo
                                    </span>
                                    {activeResumes.map((resume) => (
                                        <a
                                            key={resume.id}
                                            href={resume.file_url}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-between bg-gray-800/50 hover:bg-gray-800 text-gray-200 border border-gray-700/50 hover:border-gray-600 px-4 py-3 rounded-lg transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">
                                                    {LANGUAGE_FLAGS[resume.language] ?? "📄"}
                                                </span>
                                                <span className="font-medium text-sm">Download • {resume.label}</span>
                                            </div>
                                            <Download className="w-4 h-4 text-purple-400" />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
