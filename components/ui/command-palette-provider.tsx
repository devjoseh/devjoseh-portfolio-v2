"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { CommandPalette } from "./command-palette";

interface CommandPaletteContextType {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
}

const CommandPaletteContext = createContext<
    CommandPaletteContextType | undefined
>(undefined);

export function useCommandPalette() {
    const context = useContext(CommandPaletteContext);
    if (context === undefined) {
        throw new Error(
            "useCommandPalette must be used within a CommandPaletteProvider"
        );
    }
    return context;
}

interface CommandPaletteProviderProps {
    children: ReactNode;
}

export function CommandPaletteProvider({
    children,
}: CommandPaletteProviderProps) {
    const [isOpen, setIsOpen] = useState(false);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => setIsOpen((prev) => !prev);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                toggle();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []); // Removed toggle from the dependency array

    return (
        <CommandPaletteContext.Provider value={{ isOpen, open, close, toggle }}>
            {children}
            <CommandPalette isOpen={isOpen} onClose={close} />
        </CommandPaletteContext.Provider>
    );
}
