"use client";

import { LayoutDashboard, Briefcase, FolderOpen, Trophy, LinkIcon, BarChart3, ArrowLeft, Settings, LogOut } from "lucide-react";
import { ExperienceManager, HackathonManager, LinksManager, AnalyticsDashboard, ProjectManager } from "../../index"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Link as dbLink, ProfileSettings } from "@/utils/actions/links";
import type { Hackathon } from "@/utils/actions/admin";
import { signOut } from "@/utils/actions/sign-out";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Link from "next/link";

interface AdminDashboardProps {
    initialProjects: any[];
    initialExperiences: any[];
    initialLinks: dbLink[];
    profileSettings: ProfileSettings | null;
    analytics: any[];
    initialHackathons: Hackathon[];
}

export function AdminDashboard({
    initialProjects,
    initialExperiences,
    initialLinks,
    profileSettings,
    analytics,
    initialHackathons,
}: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState("overview");

    const handleLogout = async () => {
        await signOut();
    };

    const stats = {
        totalProjects: initialProjects.length,
        featuredProjects: initialProjects.filter((p) => p.featured).length,
        totalExperiences: initialExperiences.length,
        currentExperiences: initialExperiences.filter((e) => e.is_current)
            .length,
        totalLinks: initialLinks.length,
        activeLinks: initialLinks.filter((l) => l.is_active).length,
        totalHackathons: initialHackathons.length,
        activeHackathons: initialHackathons.filter((h) => h.is_active).length,
        totalClicks: initialLinks.reduce(
            (sum, link) => sum + link.click_count,
            0
        ),
    };

    const tabConfig = [
        {
            id: "overview",
            label: "Visão Geral",
            icon: LayoutDashboard,
            color: "text-blue-400",
        },
        {
            id: "experiences",
            label: "Experiências",
            icon: Briefcase,
            color: "text-green-400",
        },
        {
            id: "projects",
            label: "Projetos",
            icon: FolderOpen,
            color: "text-purple-400",
        },
        {
            id: "hackathons",
            label: "Hackathons",
            icon: Trophy,
            color: "text-yellow-400",
        },
        {
            id: "links",
            label: "Links",
            icon: LinkIcon,
            color: "text-pink-400",
        },
        {
            id: "analytics",
            label: "Analytics",
            icon: BarChart3,
            color: "text-orange-400",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/3 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link
                                    href={"/"}
                                >
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="border-gray-700 hover:bg-gray-800"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                                        Dashboard
                                    </h1>
                                    <p className="text-gray-400 text-sm md:text-base">
                                        Gerenciar todo o conteúdo
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="destructive"
                                    className="border-gray-700 hover:bg-gray-800"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Desconectar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-6">
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="space-y-6"
                    >
                        {/* Enhanced Tab Navigation - Fixed Alignment */}
                        <div className="w-full">
                            <TabsList className="w-full h-auto p-1 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg">
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-1 w-full">
                                    {tabConfig.map((tab) => (
                                        <TabsTrigger
                                            key={tab.id}
                                            value={tab.id}
                                            className={`
                        relative flex items-center justify-center gap-2 px-3 py-3 md:py-4
                        rounded-lg transition-all duration-300 font-medium text-xs md:text-sm
                        min-h-[48px] md:min-h-[56px]
                        data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg
                        data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200
                        data-[state=inactive]:hover:bg-gray-700/50
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500
                        transform data-[state=active]:scale-[1.02]
                      `}
                                        >
                                            <tab.icon
                                                className={`w-4 h-4 flex-shrink-0 transition-colors duration-300 ${
                                                    activeTab === tab.id
                                                        ? "text-white"
                                                        : tab.color
                                                }`}
                                            />
                                            <span className="hidden sm:inline truncate">
                                                {tab.label}
                                            </span>

                                            {/* Active indicator */}
                                            {activeTab === tab.id && (
                                                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 to-purple-500/20 pointer-events-none" />
                                            )}
                                        </TabsTrigger>
                                    ))}
                                </div>
                            </TabsList>
                        </div>

                        {/* Overview Tab */}
                        <TabsContent
                            value="overview"
                            className="space-y-6 animate-fadeInUp"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
                                    <CardContent className="p-4 md:p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-400 text-sm">
                                                    Projetos
                                                </p>
                                                <p className="text-2xl font-bold text-white">
                                                    {stats.totalProjects}
                                                </p>
                                                <p className="text-xs text-purple-400">
                                                    {stats.featuredProjects} em
                                                    destaque
                                                </p>
                                            </div>
                                            <FolderOpen className="w-8 h-8 text-purple-400" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
                                    <CardContent className="p-4 md:p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-400 text-sm">
                                                    Experiências
                                                </p>
                                                <p className="text-2xl font-bold text-white">
                                                    {stats.totalExperiences}
                                                </p>
                                                <p className="text-xs text-green-400">
                                                    {stats.currentExperiences}{" "}
                                                    atual
                                                </p>
                                            </div>
                                            <Briefcase className="w-8 h-8 text-green-400" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
                                    <CardContent className="p-4 md:p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-400 text-sm">
                                                    Hackathons
                                                </p>
                                                <p className="text-2xl font-bold text-white">
                                                    {stats.totalHackathons}
                                                </p>
                                                <p className="text-xs text-yellow-400">
                                                    {stats.activeHackathons}{" "}
                                                    ativos
                                                </p>
                                            </div>
                                            <Trophy className="w-8 h-8 text-yellow-400" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
                                    <CardContent className="p-4 md:p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-400 text-sm">
                                                    Links
                                                </p>
                                                <p className="text-2xl font-bold text-white">
                                                    {stats.totalLinks}
                                                </p>
                                                <p className="text-xs text-pink-400">
                                                    {stats.totalClicks} clicks
                                                </p>
                                            </div>
                                            <LinkIcon className="w-8 h-8 text-pink-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Quick Actions */}
                            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Settings className="w-5 h-5" />
                                        Ações Rápidas
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <Button
                                            onClick={() =>
                                                setActiveTab("projects")
                                            }
                                            className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 h-auto py-4 flex-col gap-2"
                                        >
                                            <FolderOpen className="w-6 h-6" />
                                            <span className="text-sm">
                                                Novo Projeto
                                            </span>
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                setActiveTab("experiences")
                                            }
                                            className="bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300 h-auto py-4 flex-col gap-2"
                                        >
                                            <Briefcase className="w-6 h-6" />
                                            <span className="text-sm">
                                                Nova Experiência
                                            </span>
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                setActiveTab("hackathons")
                                            }
                                            className="bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 text-yellow-300 h-auto py-4 flex-col gap-2"
                                        >
                                            <Trophy className="w-6 h-6" />
                                            <span className="text-sm">
                                                Novo Hackathon
                                            </span>
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                setActiveTab("links")
                                            }
                                            className="bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 text-pink-300 h-auto py-4 flex-col gap-2"
                                        >
                                            <LinkIcon className="w-6 h-6" />
                                            <span className="text-sm">
                                                Novo Link
                                            </span>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Activity */}
                            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-white">
                                        Atividade Recente
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {analytics
                                            .slice(0, 5)
                                            .map((activity, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 bg-purple-400 rounded-full" />
                                                        <div>
                                                            <p className="text-sm text-white">
                                                                Link clicado:{" "}
                                                                {activity.links
                                                                    ?.title ||
                                                                    "Link removido"}
                                                            </p>
                                                            <p className="text-xs text-gray-400">
                                                                {new Date(
                                                                    activity.clicked_at
                                                                ).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        Click
                                                    </Badge>
                                                </div>
                                            ))}
                                        {analytics.length === 0 && (
                                            <p className="text-gray-400 text-center py-8">
                                                Nenhuma atividade recente
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Content Tabs */}
                        <TabsContent
                            value="experiences"
                            className="animate-fadeInUp"
                        >
                            <ExperienceManager
                                initialExperiences={initialExperiences}
                            />
                        </TabsContent>

                        <TabsContent
                            value="projects"
                            className="animate-fadeInUp"
                        >
                            <ProjectManager initialProjects={initialProjects} />
                        </TabsContent>

                        <TabsContent
                            value="hackathons"
                            className="animate-fadeInUp"
                        >
                            <HackathonManager
                                initialHackathons={initialHackathons}
                            />
                        </TabsContent>

                        <TabsContent value="links" className="animate-fadeInUp">
                            <LinksManager
                                initialLinks={initialLinks}
                                profileSettings={profileSettings}
                            />
                        </TabsContent>

                        <TabsContent
                            value="analytics"
                            className="animate-fadeInUp"
                        >
                            <AnalyticsDashboard
                                links={initialLinks}
                                analytics={analytics}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeInUp {
                    animation: fadeInUp 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
