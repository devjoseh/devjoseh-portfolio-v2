"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { CommandPalette } from "./command-palette";
import type React from "react";

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
    if (!context) {
        throw new Error(
            "useCommandPalette must be used within CommandPaletteProvider"
        );
    }
    return context;
}

export function CommandPaletteProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(false);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => setIsOpen((prev) => !prev);

    // Handle global keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                toggle();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []); // Removed toggle from dependency array

    return (
        <CommandPaletteContext.Provider value={{ isOpen, open, close, toggle }}>
            {children}
            <CommandPalette isOpen={isOpen} onClose={close} />
        </CommandPaletteContext.Provider>
    );
}
