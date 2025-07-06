"use client";

import { Github, Linkedin, Mail, Youtube, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-gray-900 border-t border-gray-800">
            <div className="mx-4 md:mx-8 lg:mx-12 xl:mx-16 py-8 md:py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
                    <div className="text-center md:text-left">
                        <div className="mb-2">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                                DevJoseH
                            </h3>
                            <p className="text-lg text-gray-300 font-medium">
                                José Hernanes
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            href="https://instagram.com/dev_joseh"
                            target="_blank"
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-purple-400"
                            >
                                <Instagram className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Link
                            href="https://youtube.com/@devjoseh"
                            target="_blank"
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-purple-400"
                            >
                                <Youtube className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Link
                            href="https://linkedin.com/in/devjoseh"
                            target="_blank"
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-purple-400"
                            >
                                <Linkedin className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Link
                            href="https://github.com/devjoseh"
                            target="_blank"
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-purple-400"
                            >
                                <Github className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Link
                            href="mailto:contato@devjoseh.com.br"
                            target="_blank"
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-purple-400"
                            >
                                <Mail className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8 text-center">
                    <p className="text-gray-400 text-xs md:text-sm">
                        © 2025 DevJoseH. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
