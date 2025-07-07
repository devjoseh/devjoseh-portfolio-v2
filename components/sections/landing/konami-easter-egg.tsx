"use client";

import { useKonamiCode } from "@/hooks/use-konami-code";
import { useState } from "react";

export function KonamiEasterEgg() {
    const [isActive, setIsActive] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    const handleKonamiActivation = () => {
        setIsActive(true);
        setShowNotification(true);

        // Add matrix effect to body
        document.body.classList.add("matrix-mode");

        // Show notification for 3 seconds
        setTimeout(() => {
            setShowNotification(false);
        }, 3000);

        // Remove matrix effect after 10 seconds
        setTimeout(() => {
            setIsActive(false);
            document.body.classList.remove("matrix-mode");
        }, 15000);
    };

    useKonamiCode(handleKonamiActivation);

    return (
        <>
            {/* Matrix Rain Effect */}
            {isActive && (
                <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
                    <div className="matrix-rain">
                        {Array.from({ length: 50 }).map((_, i) => (
                            <div
                                key={i}
                                className="matrix-column"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 2}s`,
                                    animationDuration: `${
                                        2 + Math.random() * 3
                                    }s`,
                                }}
                            >
                                {Array.from({ length: 20 }).map((_, j) => (
                                    <span
                                        key={j}
                                        className="matrix-char"
                                        style={{
                                            animationDelay: `${j * 0.1}s`,
                                        }}
                                    >
                                        {String.fromCharCode(
                                            0x30a0 + Math.random() * 96
                                        )}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Notification */}
            {showNotification && (
                <div className="fixed top-4 right-4 z-[10000] bg-green-500/90 backdrop-blur-sm text-black px-6 py-3 rounded-lg shadow-lg animate-in slide-in-from-right-5 duration-500">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🕶️</span>
                        <div>
                            <div className="font-bold">
                                Código Konami Ativado!
                            </div>
                            <div className="text-sm opacity-90">
                                Bem-vindo à Matrix...
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Easter Egg Hint */}
            <div className="fixed bottom-4 left-4 z-50 opacity-20 hover:opacity-100 transition-opacity duration-300">
                <div className="bg-gray-900/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs font-mono">
                    <div>↑↑↓↓←→←→BA</div>
                </div>
            </div>
        </>
    );
}
