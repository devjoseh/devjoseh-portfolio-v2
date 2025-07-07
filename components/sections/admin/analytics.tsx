"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar, BarChart3, MousePointer } from "lucide-react";
import type { Link } from "@/utils/actions/links";
import { useState, useMemo } from "react";
import { Badge } from "@/components/index";

interface AnalyticsDashboardProps {
    links: Link[];
    analytics: any[];
}

export function AnalyticsDashboard({
    links,
    analytics,
}: AnalyticsDashboardProps) {
    const [timeRange, setTimeRange] = useState("30");

    const stats = useMemo(() => {
        const totalClicks = links.reduce((sum, link) => sum + link.click_count, 0);
        const activeLinks = links.filter((link) => link.is_active).length;
        const topLink = links.reduce((top: any, link: any) => link.click_count > (top?.click_count || 0) ? link : top, null);

        // Group analytics by date
        const clicksByDate = analytics.reduce((acc, click) => {
            const date = new Date(click.clicked_at).toLocaleDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalClicks,
            activeLinks,
            topLink,
            clicksByDate,
            recentClicks: analytics.slice(0, 10),
        };
    }, [links, analytics]);

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">
                        Analytics
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base">
                        Acompanhe a performance dos seus links
                    </p>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 w-full sm:w-32">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="7">7 dias</SelectItem>
                        <SelectItem value="30">30 dias</SelectItem>
                        <SelectItem value="90">90 dias</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-xs md:text-sm">
                                    Total de Clicks
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-white">
                                    {stats.totalClicks}
                                </p>
                            </div>
                            <MousePointer className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-xs md:text-sm">
                                    Links Ativos
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-white">
                                    {stats.activeLinks}
                                </p>
                            </div>
                            <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-xs md:text-sm">
                                    Link Mais Clicado
                                </p>
                                <p className="text-sm md:text-lg font-semibold text-white truncate">
                                    {stats.topLink?.title || "N/A"}
                                </p>
                            </div>
                            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-xs md:text-sm">
                                    Clicks Hoje
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-white">
                                    {stats.clicksByDate[
                                        new Date().toLocaleDateString()
                                    ] || 0}
                                </p>
                            </div>
                            <Calendar className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Links Performance */}
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-white text-lg md:text-xl">
                            Performance dos Links
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 md:space-y-4">
                            {links
                                .sort((a, b) => b.click_count - a.click_count)
                                .slice(0, 10)
                                .map((link) => (
                                    <div
                                        key={link.id}
                                        className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <div
                                                className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                                                style={{
                                                    backgroundColor:
                                                        link.background_color,
                                                }}
                                            >
                                                🔗
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-white text-sm md:text-base truncate">
                                                    {link.title}
                                                </p>
                                                <p className="text-xs text-gray-400 truncate">
                                                    {link.url}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <Badge
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                {link.click_count} clicks
                                            </Badge>
                                            {!link.is_active && (
                                                <Badge
                                                    variant="destructive"
                                                    className="text-xs"
                                                >
                                                    Inativo
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-white text-lg md:text-xl">
                            Atividade Recente
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats.recentClicks.map((click, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-white text-sm truncate">
                                            {click.links?.title ||
                                                "Link removido"}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(
                                                click.clicked_at
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="text-xs flex-shrink-0"
                                    >
                                        Click
                                    </Badge>
                                </div>
                            ))}
                            {stats.recentClicks.length === 0 && (
                                <p className="text-gray-400 text-center py-8 text-sm">
                                    Nenhuma atividade recente
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Daily Clicks Chart */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-white text-lg md:text-xl">
                        Clicks por Dia
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {Object.entries(stats.clicksByDate)
                            .sort(
                                ([a], [b]) =>
                                    new Date(b).getTime() -
                                    new Date(a).getTime()
                            )
                            .slice(0, 14)
                            .map(([date, clicks]) => (
                                <div
                                    key={date}
                                    className="flex items-center justify-between p-2"
                                >
                                    <span className="text-xs md:text-sm text-gray-400 truncate flex-1">
                                        {date}
                                    </span>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <div
                                            className="h-2 bg-purple-500 rounded min-w-[10px]"
                                            style={{
                                                width: `${Math.max(
                                                    (clicks as number) * 10,
                                                    10
                                                )}px`,
                                            }}
                                        />
                                        <span className="text-xs md:text-sm font-medium w-6 md:w-8 text-right text-white">
                                            {clicks as number}
                                        </span>
                                    </div>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
