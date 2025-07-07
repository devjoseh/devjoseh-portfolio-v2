"use client";

import { Search, Home, User, Code, Briefcase, FolderOpen, Trophy, Link, Download, Github, Mail, X, Keyboard } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
    const router = useRouter();
    const [search, setSearch] = useState("");

    const handleSelect = useCallback(
        (callback: () => void) => {
            callback();
            onClose();
            setSearch("");
        },
        [onClose]
    );

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const downloadResume = () => {
        const link = document.createElement("a");
        link.href = "/curriculo_jose_hernanes.pdf";
        link.download = "DevJoseH_Curriculo.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const openGitHub = () => {
        window.open("https://github.com/devjoseh", "_blank");
    };

    const openEmail = () => {
        window.open("mailto:contato@devjoseh.com", "_blank");
    };

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isOpen && e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm">
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl mx-4">
                <Command className="bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                    <div className="flex items-center border-b border-gray-700 px-4">
                        <Search className="w-5 h-5 text-gray-400 mr-3" />
                        <Command.Input
                            value={search}
                            onValueChange={setSearch}
                            placeholder="Digite um comando ou pesquise..."
                            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 py-4 text-lg"
                            autoFocus
                        />
                        <button
                            onClick={onClose}
                            className="ml-3 p-1 rounded-md hover:bg-gray-700 transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>

                    <Command.List className="max-h-96 overflow-y-auto p-2">
                        <Command.Empty className="py-8 text-center text-gray-400">
                            Nenhum resultado encontrado.
                        </Command.Empty>

                        <Command.Group
                            heading="Navegação"
                            className="text-gray-400 text-sm font-medium px-2 py-2"
                        >
                            <Command.Item
                                onSelect={() =>
                                    handleSelect(() => scrollToSection("hero"))
                                }
                                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-800 text-white transition-colors"
                            >
                                <Home className="w-4 h-4 text-purple-400" />
                                <span>Início</span>
                            </Command.Item>

                            <Command.Item
                                onSelect={() =>
                                    handleSelect(() => scrollToSection("about"))
                                }
                                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-800 text-white transition-colors"
                            >
                                <User className="w-4 h-4 text-purple-400" />
                                <span>Sobre</span>
                            </Command.Item>

                            <Command.Item
                                onSelect={() =>
                                    handleSelect(() =>
                                        scrollToSection("skills-tools")
                                    )
                                }
                                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-800 text-white transition-colors"
                            >
                                <Code className="w-4 h-4 text-purple-400" />
                                <span>Tecnologias</span>
                            </Command.Item>

                            <Command.Item
                                onSelect={() =>
                                    handleSelect(() =>
                                        scrollToSection("experience")
                                    )
                                }
                                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-800 text-white transition-colors"
                            >
                                <Briefcase className="w-4 h-4 text-purple-400" />
                                <span>Experiência</span>
                            </Command.Item>

                            <Command.Item
                                onSelect={() =>
                                    handleSelect(() =>
                                        scrollToSection("projects")
                                    )
                                }
                                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-800 text-white transition-colors"
                            >
                                <FolderOpen className="w-4 h-4 text-purple-400" />
                                <span>Projetos</span>
                            </Command.Item>

                            <Command.Item
                                onSelect={() =>
                                    handleSelect(() =>
                                        scrollToSection("hackathons")
                                    )
                                }
                                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-800 text-white transition-colors"
                            >
                                <Trophy className="w-4 h-4 text-purple-400" />
                                <span>Hackathons</span>
                            </Command.Item>
                        </Command.Group>

                        <Command.Group
                            heading="Páginas"
                            className="text-gray-400 text-sm font-medium px-2 py-2"
                        >
                            <Command.Item
                                onSelect={() =>
                                    handleSelect(() => router.push("/links"))
                                }
                                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-800 text-white transition-colors"
                            >
                                <Link className="w-4 h-4 text-pink-400" />
                                <span>Links</span>
                                <span className="ml-auto text-xs text-gray-500">
                                    /links
                                </span>
                            </Command.Item>
                        </Command.Group>

                        <Command.Group
                            heading="Ações"
                            className="text-gray-400 text-sm font-medium px-2 py-2"
                        >
                            <Command.Item
                                onSelect={() => handleSelect(downloadResume)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-800 text-white transition-colors"
                            >
                                <Download className="w-4 h-4 text-green-400" />
                                <span>Baixar Currículo</span>
                            </Command.Item>

                            <Command.Item
                                onSelect={() => handleSelect(openGitHub)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-800 text-white transition-colors"
                            >
                                <Github className="w-4 h-4 text-gray-400" />
                                <span>Abrir GitHub</span>
                            </Command.Item>

                            <Command.Item
                                onSelect={() => handleSelect(openEmail)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-800 text-white transition-colors"
                            >
                                <Mail className="w-4 h-4 text-blue-400" />
                                <span>Enviar Email</span>
                            </Command.Item>
                        </Command.Group>
                    </Command.List>

                    <div className="border-t border-gray-700 px-4 py-3 text-xs text-gray-400 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <Keyboard className="w-3 h-3" />
                                <span>↑↓ navegar</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span>↵ selecionar</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span>esc fechar</span>
                            </div>
                        </div>
                    </div>
                </Command>
            </div>
        </div>
    );
}
