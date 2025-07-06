import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
    metadataBase: new URL("https://devjoseh.com.br"),
    creator: "DevJoseH",
    authors: [{ name: "DevJoseH" }],
    openGraph: {
        title: "DevJoseH - Portfólio Desenvolvedor Backend",
        description: "Portfolio pessoal de José Hernanes, desenvolvedor back-end e entusiasta de tecnologia.",
        url: "https://devjoseh.com.br",
        siteName: "DevJoseH",
        images: [
            {
                url: "/banner.png",
                width: 1200,
                height: 630,
            },
        ],
        type: "website",
        locale: "pt_BR",
    },
    twitter: {
        card: "summary_large_image",
        title: "DevJoseH - Portfólio Desenvolvedor Backend",
        description: "Portfolio pessoal de José Hernanes, desenvolvedor back-end e entusiasta de tecnologia.",
        images: ["https://devjoseh.com.br/banner.png"],
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
            <body className={inter.className}>{children}</body>
        </html>
    );
}
