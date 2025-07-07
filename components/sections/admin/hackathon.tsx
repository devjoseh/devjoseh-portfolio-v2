"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Edit, Trash2, GripVertical, Save, Trophy, Calendar, MoreVertical, X, ImageIcon } from "lucide-react";
import { createHackathon, updateHackathon, deleteHackathon, reorderHackathons } from "@/utils/actions/admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea, Switch, Button, Badge, Label, Input, Card, CardContent } from "@/components/index";
import type { Hackathon } from "@/utils/actions/admin";
import { useState } from "react";
import Image from "next/image";
import type React from "react";

interface HackathonManagerProps {
    initialHackathons: Hackathon[];
}

export function HackathonManager({ initialHackathons }: HackathonManagerProps) {
    const [hackathons, setHackathons] = useState(initialHackathons);
    const [editingHackathon, setEditingHackathon] = useState<any | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [draggedItem, setDraggedItem] = useState<string | null>(null);

    const [newHackathon, setNewHackathon] = useState<Partial<Hackathon>>({
        title: "",
        date: "",
        cover_image_url: "",
        placement: "",
        placement_type: "participant",
        description: "",
        photos: [],
        order_index: hackathons.length + 1,
        is_active: true,
    });

    const handleSaveHackathon = async (hackathonData: Partial<Hackathon>) => {
        setIsSaving(true);
        try {
            if (editingHackathon) {
                const success = await updateHackathon(
                    editingHackathon.id,
                    hackathonData
                );
                if (success) {
                    setHackathons(
                        hackathons.map((hack) =>
                            hack.id === editingHackathon.id
                                ? { ...hack, ...hackathonData }
                                : hack
                        )
                    );
                    setEditingHackathon(null);
                }
            } else {
                const success = await createHackathon(
                    hackathonData as Omit<
                        Hackathon,
                        "id" | "created_at" | "updated_at"
                    >
                );
                if (success) {
                    window.location.reload();
                }
            }
        } catch (error) {
            console.error("Error saving hackathon:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteHackathon = async (hackathonId: string) => {
        if (confirm("Tem certeza que deseja excluir este hackathon?")) {
            const success = await deleteHackathon(hackathonId);
            if (success) {
                setHackathons(
                    hackathons.filter((hack) => hack.id !== hackathonId)
                );
            }
        }
    };

    const handleDragStart = (e: React.DragEvent, hackathonId: string) => {
        setDraggedItem(hackathonId);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = async (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        if (!draggedItem || draggedItem === targetId) return;

        const draggedIndex = hackathons.findIndex(
            (hack) => hack.id === draggedItem
        );
        const targetIndex = hackathons.findIndex(
            (hack) => hack.id === targetId
        );

        const newHackathons = [...hackathons];
        const [draggedHackathon] = newHackathons.splice(draggedIndex, 1);
        newHackathons.splice(targetIndex, 0, draggedHackathon);

        setHackathons(newHackathons);
        setDraggedItem(null);

        // Update order in database
        const ids = newHackathons.map((hack) => hack.id);
        await reorderHackathons(ids);
    };

    const getPlacementColor = (type: string) => {
        switch (type) {
            case "winner":
                return "bg-yellow-600 text-white";
            case "finalist":
                return "bg-blue-600 text-white";
            default:
                return "bg-purple-600 text-white";
        }
    };

    const toggleHackathonStatus = async (hackathon: Hackathon) => {
        const success = await updateHackathon(hackathon.id, {
            is_active: !hackathon.is_active,
        });
        if (success) {
            setHackathons(
                hackathons.map((h) =>
                    h.id === hackathon.id
                        ? { ...h, is_active: !h.is_active }
                        : h
                )
            );
        }
    };

    // Photo management functions
    const addPhotoUrl = (
        hackathonData: Partial<Hackathon>,
        url: string,
        alt: string
    ) => {
        const newPhoto = {
            id: Date.now().toString(),
            url,
            alt,
        };
        const updatedPhotos = [...(hackathonData.photos || []), newPhoto];
        return { ...hackathonData, photos: updatedPhotos };
    };

    const removePhoto = (
        hackathonData: Partial<Hackathon>,
        photoId: string
    ) => {
        const updatedPhotos = (hackathonData.photos || []).filter(
            (photo) => photo.id !== photoId
        );
        return { ...hackathonData, photos: updatedPhotos };
    };

    const PhotoManager = ({
        hackathonData,
        setHackathonData,
    }: {
        hackathonData: Partial<Hackathon>;
        setHackathonData: (data: Partial<Hackathon>) => void;
    }) => {
        const [newPhotoUrl, setNewPhotoUrl] = useState("");
        const [newPhotoAlt, setNewPhotoAlt] = useState("");

        const handleAddPhoto = () => {
            if (newPhotoUrl.trim()) {
                const updatedData = addPhotoUrl(
                    hackathonData,
                    newPhotoUrl.trim(),
                    newPhotoAlt.trim() || "Foto do hackathon"
                );
                setHackathonData(updatedData);
                setNewPhotoUrl("");
                setNewPhotoAlt("");
            }
        };

        const handleRemovePhoto = (photoId: string) => {
            const updatedData = removePhoto(hackathonData, photoId);
            setHackathonData(updatedData);
        };

        return (
            <div className="space-y-4">
                <Label>Galeria de Fotos do Hackathon</Label>

                {/* Current Photos */}
                {hackathonData.photos && hackathonData.photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {hackathonData.photos.map((photo) => (
                            <div key={photo.id} className="relative group">
                                <div className="w-full h-24 bg-gray-700 rounded-lg overflow-hidden">
                                    <Image
                                        src={
                                            photo.url ||
                                            "/placeholder.svg?height=96&width=128"
                                        }
                                        alt={photo.alt}
                                        width={128}
                                        height={96}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleRemovePhoto(photo.id)}
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                                <p className="text-xs text-gray-400 mt-1 truncate">
                                    {photo.alt}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add New Photo */}
                <div className="border border-gray-600 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        <ImageIcon className="w-4 h-4" />
                        <span>Adicionar Nova Foto</span>
                    </div>
                    <div className="space-y-2">
                        <Input
                            placeholder="URL da imagem"
                            value={newPhotoUrl}
                            onChange={(e) => setNewPhotoUrl(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-sm"
                        />
                        <Input
                            placeholder="Descrição da imagem (opcional)"
                            value={newPhotoAlt}
                            onChange={(e) => setNewPhotoAlt(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-sm"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddPhoto}
                            disabled={!newPhotoUrl.trim()}
                            className="w-full border-gray-600 hover:bg-gray-700 bg-transparent"
                        >
                            <Plus className="w-3 h-3 mr-2" />
                            Adicionar Foto
                        </Button>
                    </div>
                </div>

                <div className="text-xs text-gray-400 bg-gray-800/50 p-3 rounded-lg">
                    <p className="font-medium mb-1">
                        💡 Dicas para adicionar fotos:
                    </p>
                    <ul className="space-y-1 text-xs">
                        <li>
                            • Use URLs diretas de imagens (terminando em .jpg,
                            .png, .webp)
                        </li>
                        <li>
                            • Recomendado: 600x400px ou maior para melhor
                            qualidade
                        </li>
                        <li>
                            • Você pode usar serviços como Imgur, Cloudinary ou
                            GitHub
                        </li>
                        <li>• As fotos aparecerão no carrossel do hackathon</li>
                    </ul>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">
                        Gerenciar Hackathons
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base">
                        Adicione, edite e organize seus hackathons
                    </p>
                </div>
                <Dialog
                    open={isCreateModalOpen}
                    onOpenChange={setIsCreateModalOpen}
                >
                    <DialogTrigger asChild>
                        <Button className="bg-yellow-600 hover:bg-yellow-700 w-full sm:w-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            Novo Hackathon
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
                        <DialogHeader>
                            <DialogTitle>Adicionar Novo Hackathon</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Título</Label>
                                <Input
                                    value={newHackathon.title}
                                    onChange={(e) =>
                                        setNewHackathon({
                                            ...newHackathon,
                                            title: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                />
                            </div>
                            <div>
                                <Label>Data</Label>
                                <Input
                                    value={newHackathon.date}
                                    onChange={(e) =>
                                        setNewHackathon({
                                            ...newHackathon,
                                            date: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                    placeholder="Ex: Outubro 2024"
                                />
                            </div>
                            <div>
                                <Label>URL da Imagem de Capa</Label>
                                <Input
                                    value={newHackathon.cover_image_url as string}
                                    onChange={(e) =>
                                        setNewHackathon({
                                            ...newHackathon,
                                            cover_image_url: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Colocação</Label>
                                    <Input
                                        value={newHackathon.placement}
                                        onChange={(e) =>
                                            setNewHackathon({
                                                ...newHackathon,
                                                placement: e.target.value,
                                            })
                                        }
                                        className="bg-gray-700 border-gray-600"
                                        placeholder="Ex: 1º Lugar"
                                    />
                                </div>
                                <div>
                                    <Label>Tipo de Colocação</Label>
                                    <Select
                                        value={newHackathon.placement_type}
                                        onValueChange={(value) =>
                                            setNewHackathon({
                                                ...newHackathon,
                                                placement_type: value as any,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="bg-gray-700 border-gray-600">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-800 border-gray-700">
                                            <SelectItem value="winner">
                                                Vencedor
                                            </SelectItem>
                                            <SelectItem value="finalist">
                                                Finalista
                                            </SelectItem>
                                            <SelectItem value="participant">
                                                Participante
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <Label>Descrição</Label>
                                <Textarea
                                    value={newHackathon.description}
                                    onChange={(e) =>
                                        setNewHackathon({
                                            ...newHackathon,
                                            description: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                    rows={4}
                                />
                            </div>

                            {/* Photo Manager for new hackathon */}
                            <PhotoManager
                                hackathonData={newHackathon}
                                setHackathonData={setNewHackathon}
                            />

                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={newHackathon.is_active}
                                    onCheckedChange={(checked) =>
                                        setNewHackathon({
                                            ...newHackathon,
                                            is_active: checked,
                                        })
                                    }
                                />
                                <Label>Ativo</Label>
                            </div>
                            <Button
                                onClick={() =>
                                    handleSaveHackathon(newHackathon)
                                }
                                disabled={isSaving}
                                className="w-full bg-yellow-600 hover:bg-yellow-700"
                            >
                                {isSaving ? "Salvando..." : "Criar Hackathon"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4">
                {hackathons.map((hackathon) => (
                    <Card
                        key={hackathon.id}
                        className={`bg-gray-800/50 border-gray-700 backdrop-blur-sm transition-all duration-300 ${
                            draggedItem === hackathon.id
                                ? "opacity-50 scale-95"
                                : "hover:bg-gray-800/70"
                        }`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, hackathon.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, hackathon.id)}
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
                                                    hackathon.cover_image_url ||
                                                    "/placeholder.svg?height=48&width=48"
                                                }
                                                alt={hackathon.title}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-base font-semibold text-white flex items-center gap-2 truncate">
                                                <span className="truncate">
                                                    {hackathon.title}
                                                </span>
                                                <Trophy className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                                            </h3>
                                            <div className="flex items-center gap-2 text-gray-400 text-xs">
                                                <Calendar className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">
                                                    {hackathon.date}
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
                                                    setEditingHackathon(
                                                        hackathon
                                                    )
                                                }
                                                className="text-white"
                                            >
                                                <Edit className="w-4 h-4 mr-2" />
                                                Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleDeleteHackathon(
                                                        hackathon.id
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

                                <Badge
                                    className={`${getPlacementColor(
                                        hackathon.placement_type
                                    )} text-xs w-fit`}
                                >
                                    {hackathon.placement}
                                </Badge>

                                <p className="text-gray-300 text-sm line-clamp-2">
                                    {hackathon.description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {hackathon.photos.length} fotos
                                        </Badge>
                                        <Switch
                                            checked={hackathon.is_active}
                                            onCheckedChange={() =>
                                                toggleHackathonStatus(hackathon)
                                            }
                                            // size="sm"
                                        />
                                        <span className="text-xs text-gray-400">
                                            {hackathon.is_active
                                                ? "Ativo"
                                                : "Inativo"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop Layout */}
                            <div className="hidden md:block">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <GripVertical className="w-5 h-5 text-gray-500 cursor-move mt-1" />
                                        <div className="w-20 h-20 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={
                                                    hackathon.cover_image_url ||
                                                    "/placeholder.svg?height=80&width=80"
                                                }
                                                alt={hackathon.title}
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                                        {hackathon.title}
                                                        <Trophy className="w-4 h-4 text-yellow-400" />
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>
                                                            {hackathon.date}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Badge
                                                    className={`${getPlacementColor(
                                                        hackathon.placement_type
                                                    )} text-xs`}
                                                >
                                                    {hackathon.placement}
                                                </Badge>
                                            </div>

                                            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                                                {hackathon.description}
                                            </p>

                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {hackathon.photos.length}{" "}
                                                    fotos
                                                </Badge>
                                                <Switch
                                                    checked={
                                                        hackathon.is_active
                                                    }
                                                    onCheckedChange={() =>
                                                        toggleHackathonStatus(
                                                            hackathon
                                                        )
                                                    }
                                                    // size="sm"
                                                />
                                                <span className="text-xs text-gray-400">
                                                    {hackathon.is_active
                                                        ? "Ativo"
                                                        : "Inativo"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                setEditingHackathon(hackathon)
                                            }
                                            className="border-gray-600 hover:bg-gray-700"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                handleDeleteHackathon(
                                                    hackathon.id
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

            {/* Edit Hackathon Modal */}
            {editingHackathon && (
                <Dialog
                    open={!!editingHackathon}
                    onOpenChange={() => setEditingHackathon(null)}
                >
                    <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
                        <DialogHeader>
                            <DialogTitle>Editar Hackathon</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Título</Label>
                                <Input
                                    value={editingHackathon.title}
                                    onChange={(e) =>
                                        setEditingHackathon({
                                            ...editingHackathon,
                                            title: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                />
                            </div>
                            <div>
                                <Label>Data</Label>
                                <Input
                                    value={editingHackathon.date}
                                    onChange={(e) =>
                                        setEditingHackathon({
                                            ...editingHackathon,
                                            date: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                />
                            </div>
                            <div>
                                <Label>URL da Imagem de Capa</Label>
                                <Input
                                    value={
                                        editingHackathon.cover_image_url || ""
                                    }
                                    onChange={(e) =>
                                        setEditingHackathon({
                                            ...editingHackathon,
                                            cover_image_url: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Colocação</Label>
                                    <Input
                                        value={editingHackathon.placement}
                                        onChange={(e) =>
                                            setEditingHackathon({
                                                ...editingHackathon,
                                                placement: e.target.value,
                                            })
                                        }
                                        className="bg-gray-700 border-gray-600"
                                    />
                                </div>
                                <div>
                                    <Label>Tipo de Colocação</Label>
                                    <Select
                                        value={editingHackathon.placement_type}
                                        onValueChange={(value) =>
                                            setEditingHackathon({
                                                ...editingHackathon,
                                                placement_type: value as any,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="bg-gray-700 border-gray-600">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-800 border-gray-700">
                                            <SelectItem value="winner">
                                                Vencedor
                                            </SelectItem>
                                            <SelectItem value="finalist">
                                                Finalista
                                            </SelectItem>
                                            <SelectItem value="participant">
                                                Participante
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <Label>Descrição</Label>
                                <Textarea
                                    value={editingHackathon.description}
                                    onChange={(e) =>
                                        setEditingHackathon({
                                            ...editingHackathon,
                                            description: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                    rows={4}
                                />
                            </div>

                            {/* Photo Manager for editing hackathon */}
                            <PhotoManager
                                hackathonData={editingHackathon}
                                setHackathonData={setEditingHackathon}
                            />

                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={editingHackathon.is_active}
                                    onCheckedChange={(checked) =>
                                        setEditingHackathon({
                                            ...editingHackathon,
                                            is_active: checked,
                                        })
                                    }
                                />
                                <Label>Ativo</Label>
                            </div>
                            <Button
                                onClick={() =>
                                    handleSaveHackathon(editingHackathon)
                                }
                                disabled={isSaving}
                                className="w-full bg-yellow-600 hover:bg-yellow-700"
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
