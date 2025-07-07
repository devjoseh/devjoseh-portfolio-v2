"use client";

import { Plus, Edit, Trash2, GripVertical, Save, Building2, Calendar, MapPin, MoreVertical, ImageIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { createExperience, updateExperience, deleteExperience, reorderExperiences } from "@/utils/actions/admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea, Switch, Button, Input, Badge, Label, Card, CardContent } from "@/components/index";
import type { Experiences as Experience } from "@/utils/supabase/types"
import { useState } from "react";
import Image from "next/image";
import type React from "react";

interface ExperienceManagerProps {
    initialExperiences: Experience[];
}

export function ExperienceManager({
    initialExperiences,
}: ExperienceManagerProps) {
    const [experiences, setExperiences] = useState(initialExperiences);
    const [editingExperience, setEditingExperience] =
        useState<Experience | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [draggedItem, setDraggedItem] = useState<string | null>(null);

    const [newExperience, setNewExperience] = useState<Partial<Experience>>({
        company: "",
        position: "",
        description: "",
        start_date: "",
        end_date: null,
        is_current: false,
        location: "",
        technologies: [],
        image_url: "",
    });

    const handleSaveExperience = async (
        experienceData: Partial<Experience>
    ) => {
        setIsSaving(true);
        try {
            if (editingExperience) {
                const success = await updateExperience(
                    editingExperience.id,
                    experienceData
                );
                if (success) {
                    setExperiences(
                        experiences.map((exp) =>
                            exp.id === editingExperience.id
                                ? { ...exp, ...experienceData }
                                : exp
                        )
                    );
                    setEditingExperience(null);
                }
            } else {
                const success = await createExperience(
                    experienceData as Omit<Experience, "id" | "created_at">
                );
                if (success) {
                    window.location.reload();
                }
            }
        } catch (error) {
            console.error("Error saving experience:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteExperience = async (experienceId: string) => {
        if (confirm("Tem certeza que deseja excluir esta experiência?")) {
            const success = await deleteExperience(experienceId);
            if (success) {
                setExperiences(
                    experiences.filter((exp) => exp.id !== experienceId)
                );
            }
        }
    };

    const handleDragStart = (e: React.DragEvent, experienceId: string) => {
        setDraggedItem(experienceId);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = async (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        if (!draggedItem || draggedItem === targetId) return;

        const draggedIndex = experiences.findIndex(
            (exp) => exp.id === draggedItem
        );
        const targetIndex = experiences.findIndex((exp) => exp.id === targetId);

        const newExperiences = [...experiences];
        const [draggedExperience] = newExperiences.splice(draggedIndex, 1);
        newExperiences.splice(targetIndex, 0, draggedExperience);

        setExperiences(newExperiences);
        setDraggedItem(null);

        // Update order in database
        const ids = newExperiences.map((exp) => exp.id);
        await reorderExperiences(ids);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "short",
        });
    };

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">
                        Gerenciar Experiências
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base">
                        Adicione, edite e organize suas experiências
                        profissionais
                    </p>
                </div>
                <Dialog
                    open={isCreateModalOpen}
                    onOpenChange={setIsCreateModalOpen}
                >
                    <DialogTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            Nova Experiência
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
                        <DialogHeader>
                            <DialogTitle>
                                Adicionar Nova Experiência
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Empresa</Label>
                                    <Input
                                        value={newExperience.company}
                                        onChange={(e) =>
                                            setNewExperience({
                                                ...newExperience,
                                                company: e.target.value,
                                            })
                                        }
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>
                                <div>
                                    <Label>Cargo</Label>
                                    <Input
                                        value={newExperience.position}
                                        onChange={(e) =>
                                            setNewExperience({
                                                ...newExperience,
                                                position: e.target.value,
                                            })
                                        }
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>URL da Imagem da Empresa</Label>
                                <Input
                                    value={newExperience.image_url}
                                    onChange={(e) =>
                                        setNewExperience({
                                            ...newExperience,
                                            image_url: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                    placeholder="https://exemplo.com/logo-empresa.png"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    Cole a URL de uma imagem do logo da empresa
                                    (recomendado: 80x80px)
                                </p>
                                {newExperience.image_url && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="w-12 h-12 bg-gray-700 rounded border border-gray-600 flex items-center justify-center overflow-hidden">
                                            <Image
                                                src={
                                                    newExperience.image_url ||
                                                    "/placeholder.svg"
                                                }
                                                alt="Preview"
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    const target =
                                                        e.target as HTMLImageElement;
                                                    target.src =
                                                        "/placeholder.svg?height=48&width=48";
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            Preview da imagem
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <Label>Descrição</Label>
                                <Textarea
                                    value={newExperience.description}
                                    onChange={(e) =>
                                        setNewExperience({
                                            ...newExperience,
                                            description: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                    rows={4}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Data de Início</Label>
                                    <Input
                                        type="date"
                                        value={newExperience.start_date}
                                        onChange={(e) =>
                                            setNewExperience({
                                                ...newExperience,
                                                start_date: e.target.value,
                                            })
                                        }
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>
                                <div>
                                    <Label>Data de Fim</Label>
                                    <Input
                                        type="date"
                                        value={newExperience.end_date || ""}
                                        onChange={(e) =>
                                            setNewExperience({
                                                ...newExperience,
                                                end_date:
                                                    e.target.value || null,
                                            })
                                        }
                                        className="bg-gray-700 border-gray-600"
                                        disabled={newExperience.is_current}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={newExperience.is_current}
                                    onCheckedChange={(checked) =>
                                        setNewExperience({
                                            ...newExperience,
                                            is_current: checked,
                                        })
                                    }
                                />
                                <Label>Trabalho atual</Label>
                            </div>
                            <div>
                                <Label>Localização</Label>
                                <Input
                                    value={newExperience.location as string}
                                    onChange={(e) =>
                                        setNewExperience({
                                            ...newExperience,
                                            location: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                />
                            </div>
                            <div>
                                <Label>
                                    Tecnologias (separadas por vírgula)
                                </Label>
                                <Input
                                    value={
                                        newExperience.technologies?.join(
                                            ", "
                                        ) || ""
                                    }
                                    onChange={(e) =>
                                        setNewExperience({
                                            ...newExperience,
                                            technologies: e.target.value
                                                .split(",")
                                                .map((tech) => tech.trim()),
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                />
                            </div>
                            <Button
                                onClick={() =>
                                    handleSaveExperience(newExperience)
                                }
                                disabled={isSaving}
                                className="w-full bg-green-600 hover:bg-green-700"
                            >
                                {isSaving ? "Salvando..." : "Criar Experiência"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4">
                {experiences.map((experience) => (
                    <Card
                        key={experience.id}
                        className={`bg-gray-800/50 border-gray-700 backdrop-blur-sm transition-all duration-300 ${
                            draggedItem === experience.id
                                ? "opacity-50 scale-95"
                                : "hover:bg-gray-800/70"
                        }`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, experience.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, experience.id)}
                    >
                        <CardContent className="p-4 md:p-6">
                            {/* Mobile Layout */}
                            <div className="block md:hidden space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <GripVertical className="w-4 h-4 text-gray-500 cursor-move mt-1 flex-shrink-0" />
                                        <div className="w-12 h-12 bg-gray-700/50 rounded-lg border border-gray-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {experience.image_url ? (
                                                <Image
                                                    src={
                                                        experience.image_url ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={`${experience.company} logo`}
                                                    width={48}
                                                    height={48}
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => {
                                                        const target =
                                                            e.target as HTMLImageElement;
                                                        target.src =
                                                            "/placeholder.svg?height=48&width=48";
                                                    }}
                                                />
                                            ) : (
                                                <ImageIcon className="w-6 h-6 text-gray-500" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-base font-semibold text-white truncate">
                                                {experience.position}
                                            </h3>
                                            <div className="flex items-center gap-2 text-green-400 font-medium text-sm">
                                                <Building2 className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">
                                                    {experience.company}
                                                </span>
                                            </div>
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
                                                    setEditingExperience(
                                                        experience
                                                    )
                                                }
                                                className="text-white"
                                            >
                                                <Edit className="w-4 h-4 mr-2" />
                                                Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleDeleteExperience(
                                                        experience.id
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

                                <div className="space-y-2 text-xs text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 flex-shrink-0" />
                                        <span className="truncate">
                                            {formatDate(experience.start_date)}{" "}
                                            -{" "}
                                            {experience.is_current
                                                ? "Presente"
                                                : formatDate(
                                                      experience.end_date!
                                                  )}
                                        </span>
                                    </div>
                                    {experience.location && (
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3 flex-shrink-0" />
                                            <span className="truncate">
                                                {experience.location}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                                    {experience.description}
                                </p>

                                <div className="flex flex-wrap gap-1">
                                    {experience.technologies
                                        ?.slice(0, 3)
                                        .map((tech) => (
                                            <Badge
                                                key={tech}
                                                variant="secondary"
                                                className="bg-green-900/30 text-green-300 border-green-500/30 text-xs px-2 py-1"
                                            >
                                                {tech}
                                            </Badge>
                                        ))}
                                    {experience.technologies &&
                                        experience.technologies.length > 3 && (
                                            <Badge
                                                variant="secondary"
                                                className="bg-gray-700 text-gray-300 text-xs px-2 py-1"
                                            >
                                                +
                                                {experience.technologies
                                                    .length - 3}
                                            </Badge>
                                        )}
                                </div>

                                {experience.is_current && (
                                    <Badge className="bg-green-600 text-white text-xs w-fit">
                                        Atual
                                    </Badge>
                                )}
                            </div>

                            {/* Desktop Layout */}
                            <div className="hidden md:block">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <GripVertical className="w-5 h-5 text-gray-500 cursor-move mt-1" />
                                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-700/50 rounded-xl border border-gray-600 flex items-center justify-center overflow-hidden group hover:border-purple-500/50 transition-all duration-300 flex-shrink-0">
                                            {experience.image_url ? (
                                                <Image
                                                    src={
                                                        experience.image_url ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={`${experience.company} logo`}
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                                    onError={(e) => {
                                                        const target =
                                                            e.target as HTMLImageElement;
                                                        target.src =
                                                            "/placeholder.svg?height=80&width=80";
                                                    }}
                                                />
                                            ) : (
                                                <ImageIcon className="w-8 h-8 text-gray-500" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">
                                                        {experience.position}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-green-400 font-medium">
                                                        <Building2 className="w-4 h-4" />
                                                        <span>
                                                            {experience.company}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right text-sm text-gray-400">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>
                                                            {formatDate(
                                                                experience.start_date
                                                            )}{" "}
                                                            -{" "}
                                                            {experience.is_current
                                                                ? "Presente"
                                                                : formatDate(
                                                                      experience.end_date!
                                                                  )}
                                                        </span>
                                                    </div>
                                                    {experience.location && (
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <MapPin className="w-4 h-4" />
                                                            <span>
                                                                {
                                                                    experience.location
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-gray-300 mb-4 leading-relaxed">
                                                {experience.description}
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {experience.technologies?.map(
                                                    (tech) => (
                                                        <Badge
                                                            key={tech}
                                                            variant="secondary"
                                                            className="bg-green-900/30 text-green-300 border-green-500/30 text-xs"
                                                        >
                                                            {tech}
                                                        </Badge>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        {experience.is_current && (
                                            <Badge className="bg-green-600 text-white text-xs">
                                                Atual
                                            </Badge>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                setEditingExperience(experience)
                                            }
                                            className="border-gray-600 hover:bg-gray-700"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                handleDeleteExperience(
                                                    experience.id
                                                )
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

            {/* Edit Experience Modal */}
            {editingExperience && (
                <Dialog
                    open={!!editingExperience}
                    onOpenChange={() => setEditingExperience(null)}
                >
                    <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
                        <DialogHeader>
                            <DialogTitle>Editar Experiência</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Empresa</Label>
                                    <Input
                                        value={editingExperience.company}
                                        onChange={(e) =>
                                            setEditingExperience({
                                                ...editingExperience,
                                                company: e.target.value,
                                            })
                                        }
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>
                                <div>
                                    <Label>Cargo</Label>
                                    <Input
                                        value={editingExperience.position}
                                        onChange={(e) =>
                                            setEditingExperience({
                                                ...editingExperience,
                                                position: e.target.value,
                                            })
                                        }
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>URL da Imagem da Empresa</Label>
                                <Input
                                    value={editingExperience.image_url || ""}
                                    onChange={(e) =>
                                        setEditingExperience({
                                            ...editingExperience,
                                            image_url: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                    placeholder="https://exemplo.com/logo-empresa.png"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    Cole a URL de uma imagem do logo da empresa
                                    (recomendado: 80x80px)
                                </p>
                                {editingExperience.image_url && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="w-12 h-12 bg-gray-700 rounded border border-gray-600 flex items-center justify-center overflow-hidden">
                                            <Image
                                                src={
                                                    editingExperience.image_url ||
                                                    "/placeholder.svg"
                                                }
                                                alt="Preview"
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    const target =
                                                        e.target as HTMLImageElement;
                                                    target.src =
                                                        "/placeholder.svg?height=48&width=48";
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            Preview da imagem
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <Label>Descrição</Label>
                                <Textarea
                                    value={editingExperience.description}
                                    onChange={(e) =>
                                        setEditingExperience({
                                            ...editingExperience,
                                            description: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                    rows={4}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Data de Início</Label>
                                    <Input
                                        type="date"
                                        value={editingExperience.start_date}
                                        onChange={(e) =>
                                            setEditingExperience({
                                                ...editingExperience,
                                                start_date: e.target.value,
                                            })
                                        }
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>
                                <div>
                                    <Label>Data de Fim</Label>
                                    <Input
                                        type="date"
                                        value={editingExperience.end_date || ""}
                                        onChange={(e) =>
                                            setEditingExperience({
                                                ...editingExperience,
                                                end_date:
                                                    e.target.value || null,
                                            })
                                        }
                                        className="bg-gray-700 border-gray-600"
                                        disabled={editingExperience.is_current}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={editingExperience.is_current}
                                    onCheckedChange={(checked) =>
                                        setEditingExperience({
                                            ...editingExperience,
                                            is_current: checked,
                                        })
                                    }
                                />
                                <Label>Trabalho atual</Label>
                            </div>
                            <div>
                                <Label>Localização</Label>
                                <Input
                                    value={editingExperience.location || ""}
                                    onChange={(e) =>
                                        setEditingExperience({
                                            ...editingExperience,
                                            location: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                />
                            </div>
                            <div>
                                <Label>
                                    Tecnologias (separadas por vírgula)
                                </Label>
                                <Input
                                    value={
                                        editingExperience.technologies?.join(
                                            ", "
                                        ) || ""
                                    }
                                    onChange={(e) =>
                                        setEditingExperience({
                                            ...editingExperience,
                                            technologies: e.target.value
                                                .split(",")
                                                .map((tech) => tech.trim()),
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                />
                            </div>
                            <Button
                                onClick={() =>
                                    handleSaveExperience(editingExperience)
                                }
                                disabled={isSaving}
                                className="w-full bg-green-600 hover:bg-green-700"
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
