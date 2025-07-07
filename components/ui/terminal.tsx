"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { TypeAnimation } from "react-type-animation";
import { TerminalIcon, Minimize2, Square, X } from "lucide-react";

interface TerminalProps {
    className?: string;
}

interface TerminalLine {
    type: "input" | "output" | "system";
    content: string;
    timestamp?: string;
}

export function Terminal({ className = "" }: TerminalProps) {
    const [isMinimized, setIsMinimized] = useState(false);
    const [currentInput, setCurrentInput] = useState("");
    const [history, setHistory] = useState<TerminalLine[]>([
        {
            type: "system",
            content: "DevJoseH Terminal v2.1.0",
            timestamp: new Date().toLocaleTimeString(),
        },
        {
            type: "system",
            content: "Digite 'help' para ver os comandos disponíveis.",
        },
    ]);
    const [isTyping, setIsTyping] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);

    const commands = {
        help: () => [
            "Comandos disponíveis:",
            "  whoami     - Informações sobre o desenvolvedor",
            "  skills     - Lista de tecnologias e habilidades",
            "  projects   - Projetos em destaque",
            "  experience - Experiência profissional",
            "  contact    - Informações de contato",
            "  clear      - Limpar terminal",
            "  matrix     - Ativar modo Matrix",
            "  easter     - Dica sobre Easter eggs",
        ],
        whoami: () => [
            "José Hernanes (DevJoseH)",
            "Desenvolvedor Backend especializado em:",
            "• Node.js & TypeScript",
            "• Python & FastAPI",
            "• PostgreSQL & MongoDB",
            "• AWS & Docker",
            "• Arquiteturas escaláveis",
        ],
        skills: () => [
            "🚀 Tecnologias Backend:",
            "  Node.js, Python, TypeScript",
            "  Express, FastAPI, NestJS",
            "",
            "💻 Bancos de Dados:",
            "  PostgreSQL, MongoDB, Redis",
            "",
            "☁️ Cloud & DevOps:",
            "  AWS, Docker, Kubernetes",
            "  CI/CD, Terraform",
        ],
        projects: () => [
            "📂 Projetos em Destaque:",
            "  • Sistema de E-commerce Escalável",
            "  • API de Microserviços",
            "  • Dashboard Analytics",
            "  • Sistema de Autenticação JWT",
            "",
            "Use o comando 'scroll projects' para ver mais detalhes!",
        ],
        experience: () => [
            "💼 Experiência Profissional:",
            "  • 3+ anos em desenvolvimento backend",
            "  • Especialista em APIs RESTful",
            "  • Arquitetura de microserviços",
            "  • Otimização de performance",
            "",
            "Use 'scroll experience' para detalhes completos!",
        ],
        contact: () => [
            "✉️ Contato:",
            "  Email: contato@devjoseh.com",
            "  GitHub: github.com/devjoseh",
            "  LinkedIn: linkedin.com/in/devjoseh",
            "",
            "Sempre aberto para novas oportunidades!",
        ],
        clear: () => {
            setHistory([]);
            return [];
        },
        matrix: () => [
            "🕶️ Modo Matrix ativado...",
            "Wake up, Neo... 💊",
            "The Matrix has you... 🔴",
            "Follow the white rabbit... 🐰",
            "",
            "Dica: Tente o código Konami! ↑↑↓↓←→←→BA",
        ],
        easter: () => [
            "🥚 Easter Eggs encontrados:",
            "  • Terminal interativo ✅",
            "  • Comando Matrix 🕶️",
            "  • Código Konami (↑↑↓↓←→←→BA)",
            "  • Animações secretas",
            "",
            "Continue explorando para mais surpresas! 🎮",
        ],
    };

    const executeCommand = (cmd: string) => {
        const command = cmd.toLowerCase().trim();
        const timestamp = new Date().toLocaleTimeString();

        // Add input to history
        setHistory((prev) => [
            ...prev,
            {
                type: "input",
                content: `$ ${cmd}`,
                timestamp,
            },
        ]);

        // Handle scroll commands
        if (command.startsWith("scroll ")) {
            const section = command.replace("scroll ", "");
            const element = document.getElementById(section);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
                setHistory((prev) => [
                    ...prev,
                    {
                        type: "output",
                        content: `Navegando para seção: ${section}`,
                    },
                ]);
            } else {
                setHistory((prev) => [
                    ...prev,
                    {
                        type: "output",
                        content: `Seção '${section}' não encontrada.`,
                    },
                ]);
            }
            return;
        }

        // Execute command
        if (command in commands) {
            const output = commands[command as keyof typeof commands]();
            if (Array.isArray(output)) {
                setHistory((prev) => [
                    ...prev,
                    ...output.map((line) => ({
                        type: "output" as const,
                        content: line,
                    })),
                ]);
            }
        } else if (command === "") {
            // Empty command, just add prompt
        } else {
            setHistory((prev) => [
                ...prev,
                {
                    type: "output",
                    content: `Comando não encontrado: ${command}. Digite 'help' para ver comandos disponíveis.`,
                },
            ]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentInput.trim()) {
            executeCommand(currentInput);
            setCurrentInput("");
        }
    };

    const scrollToBottom = () => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [history]);

    useEffect(() => {
        if (!isMinimized && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isMinimized]);

    return (
        <div
            className={`bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl ${className}`}
        >
            {/* Terminal Header */}
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg border-b border-gray-700">
                <div className="flex items-center gap-2">
                    <TerminalIcon className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300 font-mono">
                        DevJoseH@portfolio:~$
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors"
                    >
                        <Minimize2 className="w-2 h-2 text-gray-900 mx-auto" />
                    </button>
                    <button className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors">
                        <Square className="w-2 h-2 text-gray-900 mx-auto" />
                    </button>
                    <button className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors">
                        <X className="w-2 h-2 text-gray-900 mx-auto" />
                    </button>
                </div>
            </div>

            {/* Terminal Content */}
            {!isMinimized && (
                <div className="p-4 h-80 flex flex-col">
                    <div
                        ref={terminalRef}
                        className="flex-1 overflow-y-auto font-mono text-sm space-y-1 mb-4"
                    >
                        {/* Initial typing animation */}
                        {isTyping && history.length <= 2 && (
                            <div className="text-green-400">
                                <TypeAnimation
                                    sequence={[
                                        "Inicializando sistema...",
                                        500,
                                        "Carregando perfil do desenvolvedor...",
                                        500,
                                        "Sistema pronto! 🚀",
                                        500,
                                        () => setIsTyping(false),
                                    ]}
                                    wrapper="span"
                                    speed={50}
                                    style={{
                                        fontSize: "1em",
                                        display: "inline-block",
                                    }}
                                />
                            </div>
                        )}

                        {/* Command history */}
                        {!isTyping &&
                            history.map((line, index) => (
                                <div
                                    key={index}
                                    className={`${
                                        line.type === "input"
                                            ? "text-white"
                                            : line.type === "system"
                                            ? "text-cyan-400"
                                            : "text-gray-300"
                                    }`}
                                >
                                    {line.content}
                                    {line.timestamp && (
                                        <span className="text-gray-500 ml-2 text-xs">
                                            [{line.timestamp}]
                                        </span>
                                    )}
                                </div>
                            ))}
                    </div>

                    {/* Input */}
                    {!isTyping && (
                        <form
                            onSubmit={handleSubmit}
                            className="flex items-center gap-2 font-mono text-sm"
                        >
                            <span className="text-green-400">$</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={currentInput}
                                onChange={(e) =>
                                    setCurrentInput(e.target.value)
                                }
                                className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
                                placeholder="Digite um comando..."
                                autoComplete="off"
                            />
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}
