import { CommandPaletteProvider } from "@/components/ui/command-palette-provider"
import { KonamiEasterEgg } from "@/components/sections/landing/konami-easter-egg"
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { appConfig } from "@/config";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "José Hernanes - Backend Developer",
    description: "Portfolio pessoal de José Hernanes, desenvolvedor back-end e entusiasta de tecnologia.",
    keywords: [
        "devjoseh",
        "josé hernanes",
        "José Hernanes",
        "DevJoseH",
        "desenvolvedor back-end",
        "back-end",
        "backend",
        "desenvolvedor",
        "programador",
        "programação",
        "hackathon",
        "front-end",
        "discord",
        "discordjs",
    ],
    authors: [{ name: "DevJoseH" }, { name: "José Hernanes" }],
    creator: "DevJoseH José Hernanes",
    publisher: "DevJoseH",
    formatDetection: {
        email: false,
        address: false,
        telephone: false
    },
    metadataBase: new URL(appConfig.baseUrl),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "DevJoseH - Portfólio Desenvolvedor Backend",
        description: "Portfolio pessoal de José Hernanes, desenvolvedor back-end e entusiasta de tecnologia.",
        url: appConfig.baseUrl,
        siteName: "DevJoseH",
        images: [
            {
                url: "/banner.png",
                width: 1200,
                height: 630,
            },
        ],
        locale: "pt_BR",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "DevJoseH - Portfólio Desenvolvedor Backend",
        description: "Portfolio pessoal de José Hernanes, desenvolvedor back-end e entusiasta de tecnologia.",
        images: [`${appConfig.baseUrl}/banner.png`],
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-br" className="scroll-smooth">
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@graph": [
                                {
                                    "@type": "Person",
                                    "name": "José Hernanes",
                                    "url": appConfig.baseUrl,
                                    "sameAs": [
                                        "https://github.com/devjoseh",
                                        "https://www.linkedin.com/in/devjoseh/"
                                    ]
                                },
                                {
                                    "@type": "WebSite",
                                    "name": "DevJoseH - Portfólio Desenvolvedor Backend",
                                    "url": appConfig.baseUrl,
                                    "publisher": {
                                        "@id": `${appConfig.baseUrl}/#person`
                                    },
                                    "inLanguage": "pt-BR",
                                    "description": "Portfolio pessoal de José Hernanes, desenvolvedor back-end e entusiasta de tecnologia."
                                }
                            ]
                        })
                    }}
                />
            </head>
            <body className={inter.className}>
                <CommandPaletteProvider>
                    {children}
                    <KonamiEasterEgg />
                </CommandPaletteProvider>
            </body>
        </html>
    );
}
