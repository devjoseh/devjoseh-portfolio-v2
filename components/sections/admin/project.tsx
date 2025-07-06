"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Edit, Trash2, GripVertical, Save, Github, ExternalLink, Star, MoreVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createProject, updateProject, deleteProject, reorderProjects } from "@/utils/actions/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import type React from "react";

import Image from "next/image";

import type { Projects as Project } from "@/utils/supabase/types" 

interface ProjectManagerProps {
    initialProjects: Project[];
}

export function ProjectManager({ initialProjects }: ProjectManagerProps) {
    const [projects, setProjects] = useState(initialProjects);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [draggedItem, setDraggedItem] = useState<string | null>(null);

    const [newProject, setNewProject] = useState<Partial<Project>>({
        title: "",
        description: "",
        long_description: "",
        technologies: [],
        github_url: "",
        live_url: "",
        image_url: "",
        featured: false,
        order_index: projects.length + 1,
    });

    const handleSaveProject = async (projectData: Partial<Project>) => {
        setIsSaving(true);
        try {
            if (editingProject) {
                const success = await updateProject(
                    editingProject.id,
                    projectData
                );
                if (success) {
                    setProjects(
                        projects.map((proj) =>
                            proj.id === editingProject.id
                                ? { ...proj, ...projectData }
                                : proj
                        )
                    );
                    setEditingProject(null);
                }
            } else {
                const success = await createProject(
                    projectData as Omit<
                        Project,
                        "id" | "created_at" | "updated_at"
                    >
                );
                if (success) {
                    window.location.reload();
                }
            }
        } catch (error) {
            console.error("Error saving project:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteProject = async (projectId: string) => {
        if (confirm("Tem certeza que deseja excluir este projeto?")) {
            const success = await deleteProject(projectId);
            if (success) {
                setProjects(projects.filter((proj) => proj.id !== projectId));
            }
        }
    };

    const handleDragStart = (e: React.DragEvent, projectId: string) => {
        setDraggedItem(projectId);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = async (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        if (!draggedItem || draggedItem === targetId) return;

        const draggedIndex = projects.findIndex(
            (proj) => proj.id === draggedItem
        );
        const targetIndex = projects.findIndex((proj) => proj.id === targetId);

        const newProjects = [...projects];
        const [draggedProject] = newProjects.splice(draggedIndex, 1);
        newProjects.splice(targetIndex, 0, draggedProject);

        setProjects(newProjects);
        setDraggedItem(null);

        // Update order in database
        const ids = newProjects.map((proj) => proj.id);
        await reorderProjects(ids);
    };

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">
                        Gerenciar Projetos
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base">
                        Adicione, edite e organize seus projetos
                    </p>
                </div>
                <Dialog
                    open={isCreateModalOpen}
                    onOpenChange={setIsCreateModalOpen}
                >
                    <DialogTrigger asChild>
                        <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            Novo Projeto
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
                        <DialogHeader>
                            <DialogTitle>Adicionar Novo Projeto</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Título</Label>
                                <Input
                                    value={newProject.title}
                                    onChange={(e) =>
                                        setNewProject({
                                            ...newProject,
                                            title: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                />
                            </div>
                            <div>
                                <Label>Descrição Curta</Label>
                                <Textarea
                                    value={newProject.description}
                                    onChange={(e) =>
                                        setNewProject({
                                            ...newProject,
                                            description: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                    rows={2}
                                />
                            </div>
                            <div>
                                <Label>Descrição Completa</Label>
                                <Textarea
                                    value={newProject.long_description || ""}
                                    onChange={(e) =>
                                        setNewProject({
                                            ...newProject,
                                            long_description: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                    rows={4}
                                />
                            </div>
                            <div>
                                <Label>
                                    Tecnologias (separadas por vírgula)
                                </Label>
                                <Input
                                    value={
                                        newProject.technologies?.join(", ") ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        setNewProject({
                                            ...newProject,
                                            technologies: e.target.value
                                                .split(",")
                                                .map((tech) => tech.trim()),
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>URL do GitHub</Label>
                                    <Input
                                        value={newProject.github_url || ""}
                                        onChange={(e) =>
                                            setNewProject({
                                                ...newProject,
                                                github_url: e.target.value,
                                            })
                                        }
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>
                                <div>
                                    <Label>URL da Demo</Label>
                                    <Input
                                        value={newProject.live_url || ""}
                                        onChange={(e) =>
                                            setNewProject({
                                                ...newProject,
                                                live_url: e.target.value,
                                            })
                                        }
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>URL da Imagem</Label>
                                <Input
                                    value={newProject.image_url || ""}
                                    onChange={(e) =>
                                        setNewProject({
                                            ...newProject,
                                            image_url: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={newProject.featured}
                                    onCheckedChange={(checked) =>
                                        setNewProject({
                                            ...newProject,
                                            featured: checked,
                                        })
                                    }
                                />
                                <Label>Projeto em destaque</Label>
                            </div>
                            <Button
                                onClick={() => handleSaveProject(newProject)}
                                disabled={isSaving}
                                className="w-full bg-purple-600 hover:bg-purple-700"
                            >
                                {isSaving ? "Salvando..." : "Criar Projeto"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4">
                {projects.map((project) => (
                    <Card
                        key={project.id}
                        className={`bg-gray-800/50 border-gray-700 backdrop-blur-sm transition-all duration-300 ${
                            draggedItem === project.id
                                ? "opacity-50 scale-95"
                                : "hover:bg-gray-800/70"
                        }`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, project.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, project.id)}
                    >
                        <CardContent className="p-4 md:p-6">
                            {/* Mobile Layout */}
                            <div className="block md:hidden space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <GripVertical className="w-4 h-4 text-gray-500 cursor-move mt-1 flex-shrink-0" />
                                        <div className="w-12 h-12 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={
                                                    project.image_url ||
                                                    "/placeholder.svg?height=48&width=48"
                                                }
                                                alt={project.title}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-base font-semibold text-white flex items-center gap-2 truncate">
                                                <span className="truncate">
                                                    {project.title}
                                                </span>
                                                {project.featured && (
                                                    <Star className="w-3 h-3 text-yellow-400 fill-current flex-shrink-0" />
                                                )}
                                            </h3>
                                            <p className="text-gray-300 text-sm line-clamp-2">
                                                {project.description}
                                            </p>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 flex-shrink-0"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="bg-gray-800 border-gray-700"
                                        >
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    setEditingProject(project)
                                                }
                                                className="text-white"
                                            >
                                                <Edit className="w-4 h-4 mr-2" />
                                                Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleDeleteProject(
                                                        project.id
                                                    )
                                                }
                                                className="text-red-400"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Excluir
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                    {project.technologies
                                        .slice(0, 3)
                                        .map((tech) => (
                                            <Badge
                                                key={tech}
                                                variant="secondary"
                                                className="bg-purple-900/30 text-purple-300 border-purple-500/30 text-xs px-2 py-1"
                                            >
                                                {tech}
                                            </Badge>
                                        ))}
                                    {project.technologies.length > 3 && (
                                        <Badge
                                            variant="secondary"
                                            className="bg-gray-700 text-gray-300 text-xs px-2 py-1"
                                        >
                                            +{project.technologies.length - 3}
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {project.github_url && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                window.open(
                                                    project.github_url!,
                                                    "_blank"
                                                )
                                            }
                                            className="border-gray-600 hover:bg-gray-700 text-xs h-8 px-3"
                                        >
                                            <Github className="w-3 h-3 mr-1" />
                                            GitHub
                                        </Button>
                                    )}
                                    {project.live_url && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                window.open(
                                                    project.live_url!,
                                                    "_blank"
                                                )
                                            }
                                            className="border-gray-600 hover:bg-gray-700 text-xs h-8 px-3"
                                        >
                                            <ExternalLink className="w-3 h-3 mr-1" />
                                            Demo
                                        </Button>
                                    )}
                                </div>

                                {project.featured && (
                                    <Badge className="bg-yellow-600 text-white text-xs w-fit">
                                        Destaque
                                    </Badge>
                                )}
                            </div>

                            {/* Desktop Layout */}
                            <div className="hidden md:block">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <GripVertical className="w-5 h-5 text-gray-500 cursor-move mt-1" />
                                        <div className="w-20 h-20 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={
                                                    project.image_url ||
                                                    "/placeholder.svg?height=80&width=80"
                                                }
                                                alt={project.title}
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                                        {project.title}
                                                        {project.featured && (
                                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                        )}
                                                    </h3>
                                                    <p className="text-gray-300 text-sm">
                                                        {project.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {project.technologies.map(
                                                    (tech) => (
                                                        <Badge
                                                            key={tech}
                                                            variant="secondary"
                                                            className="bg-purple-900/30 text-purple-300 border-purple-500/30 text-xs"
                                                        >
                                                            {tech}
                                                        </Badge>
                                                    )
                                                )}
                                            </div>

                                            <div className="flex gap-2">
                                                {project.github_url && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            window.open(
                                                                project.github_url!,
                                                                "_blank"
                                                            )
                                                        }
                                                        className="border-gray-600 hover:bg-gray-700 text-xs"
                                                    >
                                                        <Github className="w-3 h-3 mr-1" />
                                                        GitHub
                                                    </Button>
                                                )}
                                                {project.live_url && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            window.open(
                                                                project.live_url!,
                                                                "_blank"
                                                            )
                                                        }
                                                        className="border-gray-600 hover:bg-gray-700 text-xs"
                                                    >
                                                        <ExternalLink className="w-3 h-3 mr-1" />
                                                        Demo
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        {project.featured && (
                                            <Badge className="bg-yellow-600 text-white text-xs">
                                                Destaque
                                            </Badge>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                setEditingProject(project)
                                            }
                                            className="border-gray-600 hover:bg-gray-700"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                handleDeleteProject(project.id)
                                            }
                                            className="border-red-600 hover:bg-red-600 text-red-400"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Edit Project Modal */}
            {editingProject && (
                <Dialog
                    open={!!editingProject}
                    onOpenChange={() => setEditingProject(null)}
                >
                    <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
                        <DialogHeader>
                            <DialogTitle>Editar Projeto</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Título</Label>
                                <Input
                                    value={editingProject.title}
                                    onChange={(e) =>
                                        setEditingProject({
                                            ...editingProject,
                                            title: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                />
                            </div>
                            <div>
                                <Label>Descrição Curta</Label>
                                <Textarea
                                    value={editingProject.description}
                                    onChange={(e) =>
                                        setEditingProject({
                                            ...editingProject,
                                            description: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                    rows={2}
                                />
                            </div>
                            <div>
                                <Label>Descrição Completa</Label>
                                <Textarea
                                    value={
                                        editingProject.long_description || ""
                                    }
                                    onChange={(e) =>
                                        setEditingProject({
                                            ...editingProject,
                                            long_description: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                    rows={4}
                                />
                            </div>
                            <div>
                                <Label>
                                    Tecnologias (separadas por vírgula)
                                </Label>
                                <Input
                                    value={
                                        editingProject.technologies?.join(
                                            ", "
                                        ) || ""
                                    }
                                    onChange={(e) =>
                                        setEditingProject({
                                            ...editingProject,
                                            technologies: e.target.value
                                                .split(",")
                                                .map((tech) => tech.trim()),
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>URL do GitHub</Label>
                                    <Input
                                        value={editingProject.github_url || ""}
                                        onChange={(e) =>
                                            setEditingProject({
                                                ...editingProject,
                                                github_url: e.target.value,
                                            })
                                        }
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>
                                <div>
                                    <Label>URL da Demo</Label>
                                    <Input
                                        value={editingProject.live_url || ""}
                                        onChange={(e) =>
                                            setEditingProject({
                                                ...editingProject,
                                                live_url: e.target.value,
                                            })
                                        }
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>URL da Imagem</Label>
                                <Input
                                    value={editingProject.image_url || ""}
                                    onChange={(e) =>
                                        setEditingProject({
                                            ...editingProject,
                                            image_url: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={editingProject.featured}
                                    onCheckedChange={(checked) =>
                                        setEditingProject({
                                            ...editingProject,
                                            featured: checked,
                                        })
                                    }
                                />
                                <Label>Projeto em destaque</Label>
                            </div>
                            <Button
                                onClick={() =>
                                    handleSaveProject(editingProject)
                                }
                                disabled={isSaving}
                                className="w-full bg-purple-600 hover:bg-purple-700"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isSaving ? "Salvando..." : "Salvar Alterações"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
