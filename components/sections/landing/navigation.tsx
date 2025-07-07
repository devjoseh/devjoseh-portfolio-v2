"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { CommandPaletteTrigger } from "../../ui/command-palette-trigger";
import { Menu, X, Download } from "lucide-react";

export function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");

    const sections = [
        { id: "about", label: "Sobre" },
        { id: "skills-tools", label: "Tecnologias" },
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
    }, []);

    const scrollToSection = (sectionId: string) => {
        document
            .getElementById(sectionId)
            ?.scrollIntoView({ behavior: "smooth" });
        setIsMobileMenuOpen(false);
    };

    const downloadResume = () => {
        // Create a temporary link to download the resume
        const link = document.createElement("a");
        link.href = "/curriculo_jose_hernanes.pdf"; // You'll need to add your resume PDF to the public folder
        link.download = "DevJoseH_Curriculo.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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
                        <Button
                            onClick={downloadResume}
                            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-sm lg:text-base"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Baixar Currículo
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </Button>
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
                            <div className="pt-4 border-t border-gray-700">
                                <Button
                                    onClick={downloadResume}
                                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg transition-all duration-300"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Baixar Currículo
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
