"use client";

import { useEffect, useState } from "react";

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

export function useKonamiCode() {
    const [_keys, setKeys] = useState<string[]>([]);
    const [activated, setActivated] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            setKeys((prevKeys) => {
                const newKeys = [...prevKeys, event.code];

                // Keep only the last 10 keys
                if (newKeys.length > KONAMI_CODE.length) {
                    newKeys.shift();
                }

                // Check if the sequence matches
                if (newKeys.length === KONAMI_CODE.length) {
                    const matches = newKeys.every(
                        (key, index) => key === KONAMI_CODE[index]
                    );
                    if (matches && !activated) {
                        setActivated(true);
                        // Reset after activation
                        setTimeout(() => {
                            setActivated(false);
                            setKeys([]);
                        }, 1000);
                    }
                }

                return newKeys;
            });
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [activated]);

    return activated;
}
