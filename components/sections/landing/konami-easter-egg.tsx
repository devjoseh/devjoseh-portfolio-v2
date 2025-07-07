"use client";

import { useEffect, useState } from "react";
import { useKonamiCode } from "@/hooks/use-konami-code";

export function KonamiEasterEgg() {
    const [isMatrixMode, setIsMatrixMode] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const konamiActivated = useKonamiCode();

    useEffect(() => {
        if (konamiActivated) {
            setIsMatrixMode(true);
            document.body.classList.add("matrix-mode");

            createMatrixRain();

            const successMessage = document.createElement("div");
            successMessage.innerHTML = "🕶️ Modo Matrix Ativado! Bem-vindo ao mundo real, Neo...";
            successMessage.className = "fixed top-4 left-1/2 transform -translate-x-1/2 bg-black text-green-400 px-6 py-3 rounded-lg font-mono text-sm z-50 border border-green-400";
            document.body.appendChild(successMessage);

            setTimeout(() => {
                document.body.removeChild(successMessage);
            }, 5000);
        }
    }, [konamiActivated]);

    useEffect(() => {
        // Show hint after 10 seconds
        const timer = setTimeout(() => {
            setShowHint(true);
        }, 15000);

        return () => clearTimeout(timer);
    }, []);

    const createMatrixRain = () => {
        const matrixContainer = document.createElement("div");
        matrixContainer.className = "matrix-rain";
        document.body.appendChild(matrixContainer);

        const characters = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (let i = 0; i < 50; i++) {
            const column = document.createElement("div");
            column.className = "matrix-column";
            column.style.left = Math.random() * 100 + "%";
            column.style.animationDuration = Math.random() * 3 + 2 + "s";
            column.style.animationDelay = Math.random() * 2 + "s";

            for (let j = 0; j < 20; j++) {
                const char = document.createElement("span");
                char.className = "matrix-char";
                char.textContent =
                    characters[Math.floor(Math.random() * characters.length)];
                char.style.animationDelay = j * 0.1 + "s";
                column.appendChild(char);
            }

            matrixContainer.appendChild(column);
        }

        // Remove matrix effect after 30 seconds
        setTimeout(() => {
            document.body.classList.remove("matrix-mode");
            if (document.body.contains(matrixContainer)) {
                document.body.removeChild(matrixContainer);
            }
            setIsMatrixMode(false);
        }, 30000);
    };

    return (
        <>
            {/* Konami Code Hint - Hidden on mobile */}
            {showHint && !isMatrixMode && (
                <div className="fixed bottom-4 left-4 text-green-400 px-3 py-2 rounded-lg font-mono text-xs easter-hint z-40 hidden md:block">
                    <div className="flex items-center gap-1">
                        <span className="text-gray-500">↑↑↓↓←→←→BA</span>
                    </div>
                </div>
            )}
        </>
    );
}
