"use client";

import { useCommandPalette } from "./command-palette-provider";
import { Button } from "@/components/ui/button";
import { Search, Command } from "lucide-react";

export function CommandPaletteTrigger() {
    const { toggle } = useCommandPalette();

    return (
        <Button
            onClick={toggle}
            variant="ghost"
            size="sm"
            className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors px-3 py-2 rounded-lg border border-gray-700"
        >
            <Search className="w-4 h-4" />
            <span className="text-sm">Pesquisar</span>
            <div className="flex items-center gap-1 ml-2">
                <kbd className="px-1.5 py-0.5 text-xs bg-gray-800 border border-gray-600 rounded">
                    <Command className="w-3 h-3" />
                </kbd>
                <kbd className="px-1.5 py-0.5 text-xs bg-gray-800 border border-gray-600 rounded">
                    K
                </kbd>
            </div>
        </Button>
    );
}
