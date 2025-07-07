"use client";

import { useEffect, useState, useCallback } from "react";

const KONAMI_CODE = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
];

export function useKonamiCode(callback: () => void) {
    const [_sequence, setSequence] = useState<string[]>([]);
    const [isActivated, setIsActivated] = useState(false);

    const resetSequence = useCallback(() => {
        setSequence([]);
    }, []);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            // Ignore if user is typing in an input field
            if (
                event.target instanceof HTMLInputElement ||
                event.target instanceof HTMLTextAreaElement
            ) {
                return;
            }

            const key = event.code;
            setSequence((prevSequence) => {
                const newSequence = [...prevSequence, key];

                // Check if the current sequence matches the beginning of Konami code
                const isValidSequence = KONAMI_CODE.slice(
                    0,
                    newSequence.length
                ).every((konamiKey, index) => konamiKey === newSequence[index]);

                if (!isValidSequence) {
                    // Reset if sequence doesn't match
                    return key === KONAMI_CODE[0] ? [key] : [];
                }

                // Check if complete sequence is entered
                if (newSequence.length === KONAMI_CODE.length) {
                    if (!isActivated) {
                        setIsActivated(true);
                        callback();
                        // Reset after a delay to allow re-activation
                        setTimeout(() => setIsActivated(false), 5000);
                    }
                    return [];
                }

                return newSequence;
            });
        },
        [callback, isActivated]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);

    return { isActivated, resetSequence };
}
