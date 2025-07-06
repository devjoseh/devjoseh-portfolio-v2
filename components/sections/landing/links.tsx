"use client";

import { Github, Linkedin, Youtube, Instagram, Mail, Globe, GraduationCap, Calendar, ExternalLink } from "lucide-react";
import type { Link as dbLink, ProfileSettings } from "@/utils/actions/links";
import { trackLinkClick } from "@/utils/actions/links";
// import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import Image from "next/image";

interface LinksPageProps {
    initialLinks: dbLink[];
    profileSettings: ProfileSettings | null;
}

const iconMap = {
    github: Github,
    linkedin: Linkedin,
    youtube: Youtube,
    instagram: Instagram,
    mail: Mail,
    globe: Globe,
    "graduation-cap": GraduationCap,
    calendar: Calendar,
};

export function LinksPage({ initialLinks, profileSettings }: LinksPageProps) {
    const [links, setLinks] = useState(initialLinks);
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [clickedLinks, setClickedLinks] = useState<Set<string>>(new Set());

    const handleLinkClick = async (link: dbLink) => {
        setIsLoading(link.id);
        setClickedLinks((prev) => new Set([...prev, link.id]));

        // Track the click
        await trackLinkClick(link.id, navigator.userAgent, document.referrer);

        // Update local click count
        setLinks((prevLinks) =>
            prevLinks.map((l) =>
                l.id === link.id ? { ...l, click_count: l.click_count + 1 } : l
            )
        );

        // Add a small delay for animation, then navigate
        setTimeout(() => {
            setIsLoading(null);
            window.location.href = link.url;
        }, 300);
    };

    const getBackgroundClass = () => {
        if (!profileSettings)
            return "bg-gradient-to-br from-purple-900 via-gray-900 to-purple-900";

        switch (profileSettings.background_type) {
            case "gradient":
                return `bg-gradient-to-br ${profileSettings.background_value}`;
            case "solid":
                return profileSettings.background_value;
            default:
                return "bg-gradient-to-br from-purple-900 via-gray-900 to-purple-900";
        }
    };

    const getIconComponent = (iconName: string | null) => {
        if (!iconName) return ExternalLink;
        return iconMap[iconName as keyof typeof iconMap] || ExternalLink;
    };

    return (
        <div
            className={`min-h-screen ${getBackgroundClass()} relative overflow-hidden`}
        >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-purple-500/3 to-transparent rounded-full" />

                {/* Floating particles */}
                <div className="absolute top-32 left-32 w-2 h-2 bg-purple-400/30 rounded-full animate-bounce delay-300" />
                <div className="absolute top-48 right-48 w-1 h-1 bg-purple-300/40 rounded-full animate-bounce delay-700" />
                <div className="absolute bottom-48 left-1/3 w-1.5 h-1.5 bg-purple-500/20 rounded-full animate-bounce delay-1000" />
            </div>

            {/* Main content */}
            <div className="relative z-10 container mx-auto px-4 py-8 max-w-md">
                {/* Profile section */}
                <div className="text-center mb-8 animate-fadeInUp">
                    <div className="relative mb-6">
                        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-purple-500/30 shadow-2xl">
                            <Image
                                src={
                                    profileSettings?.profile_image_url ||
                                    "/pfp1.webp?height=96&width=96"
                                }
                                alt={profileSettings?.profile_name || "Profile"}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-2">
                        {profileSettings?.profile_name || "DevJoseH"}
                    </h1>
                    <p className="text-gray-300 text-sm leading-relaxed max-w-xs mx-auto">
                        {profileSettings?.profile_bio ||
                            "Desenvolvedor Back-End, designer e rato de hackatons"}
                    </p>
                </div>

                {/* Links section */}
                <div className="space-y-4">
                    {links.map((link, index) => {
                        const IconComponent = getIconComponent(link.icon_name);
                        const isClicked = clickedLinks.has(link.id);
                        const isCurrentlyLoading = isLoading === link.id;

                        return (
                            <Card
                                key={link.id}
                                className={` relative overflow-hidden cursor-pointer transition-all duration-300 transform 
                                    ${isCurrentlyLoading ? "scale-95 opacity-80" : "hover:scale-105 hover:shadow-2xl"}
                                    ${isClicked ? "animate-pulse" : ""} border-0 shadow-lg backdrop-blur-sm`}
                                style={{
                                    backgroundColor: `${link.background_color}15`,
                                    borderColor: `${link.background_color}30`,
                                    animationDelay: `${index * 100}ms`,
                                }}
                                onClick={() => handleLinkClick(link)}
                            >
                                {/* Gradient overlay */}
                                <div
                                    className="absolute inset-0 opacity-90"
                                    style={{
                                        background: `linear-gradient(135deg, ${link.background_color}E6, ${link.background_color}CC)`,
                                    }}
                                />

                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />

                                {/* Content */}
                                <div className="relative z-10 p-4 flex items-center gap-4">
                                    <div className="flex-shrink-0">
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                                            style={{
                                                backgroundColor: `${link.background_color}20`,
                                            }}
                                        >
                                            <IconComponent
                                                className="w-6 h-6"
                                                style={{
                                                    color: link.text_color,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3
                                            className="font-semibold text-lg truncate"
                                            style={{ color: link.text_color }}
                                        >
                                            {link.title}
                                        </h3>
                                        {link.description && (
                                            <p
                                                className="text-sm opacity-90 truncate"
                                                style={{
                                                    color: link.text_color,
                                                }}
                                            >
                                                {link.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* <div className="flex-shrink-0 flex items-center gap-2">
                                        {link.click_count > 0 && (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs bg-white/20 text-white border-0"
                                            >
                                                {link.click_count}
                                            </Badge>
                                        )}
                                        <ExternalLink
                                            className="w-4 h-4 opacity-60"
                                            style={{ color: link.text_color }}
                                        />
                                    </div> */}
                                </div>

                                {/* Loading overlay */}
                                {isCurrentlyLoading && (
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="text-center mt-12 animate-fadeInUp delay-500">
                    <p className="text-gray-400 text-xs">
                        Criado com ❤️ por DevJoseH
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                        © 2025 Todos os direitos reservados
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease-out forwards;
                }

                .delay-500 {
                    animation-delay: 500ms;
                }
            `}</style>
        </div>
    );
}