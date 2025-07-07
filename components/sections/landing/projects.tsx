import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getFeaturedProjects } from "@/utils/actions/data";
import { Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

export async function ProjectsSection() {
    const projects = await getFeaturedProjects();

    return (
        <section id="projects" className="py-16 md:py-20 bg-gray-900/50">
            <div className="container mx-auto px-0">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 py-2 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                        Projetos em Destaque
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                    {projects.map((project, index) => (
                        <Card
                            key={project.id}
                            className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                             <CardHeader className="pb-4">
                                <div className="w-full aspect-video bg-gradient-to-br from-purple-900/20 to-gray-800 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative group">
                                    <Image
                                        src={project.image_url || "/placeholder.svg?height=225&width=400"}
                                        alt={project.title}
                                        width={400}
                                        height={225}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        priority={index < 3}
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                <CardTitle className="text-white text-lg md:text-xl line-clamp-2">
                                    {project.title}
                                </CardTitle>
                                <CardDescription className="text-gray-300 text-sm md:text-base">
                                    {project.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-between">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.technologies.map((tech) => (
                                        <Badge
                                            key={tech}
                                            variant="secondary"
                                            className="bg-purple-900/30 text-purple-300 border-purple-500/30 text-xs"
                                        >
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex gap-2 mt-auto">
                                    {project.github_url && (
                                        <Link 
                                            href={project.github_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex-1"
                                        >
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 bg-transparent w-full text-xs md:text-sm text-white"
                                            >
                                                <Github className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                                                Código
                                            </Button>
                                        </Link>
                                    )}
                                    {project.live_url && (
                                        <Link 
                                            href={project.live_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex-1"
                                        >
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 bg-transparent w-full text-xs md:text-sm text-white"
                                            >
                                                <ExternalLink className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                                                Demo
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}