"use client";

import type React from "react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { updateLink, createLink, deleteLink, updateProfileSettings, reorderLinks } from "@/utils/actions/links";
import { Plus, Edit, Trash2, GripVertical, Save, User, Palette, Settings, MoreVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Link, ProfileSettings } from "@/utils/actions/links";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface LinksManagerProps {
    initialLinks: Link[];
    profileSettings: ProfileSettings | null;
}

export function LinksManager({
    initialLinks,
    profileSettings,
}: LinksManagerProps) {
    const [links, setLinks] = useState(initialLinks);
    const [editingLink, setEditingLink] = useState<Link | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<
        "links" | "profile" | "appearance"
    >("links");
    const [isSaving, setIsSaving] = useState(false);
    const [draggedItem, setDraggedItem] = useState<string | null>(null);

    const [newLink, setNewLink] = useState<Partial<Link>>({
        title: "",
        url: "",
        description: "",
        icon_name: "globe",
        background_color: "#8b5cf6",
        text_color: "#ffffff",
        is_active: true,
        order_index: links.length + 1,
    });

    const [profileData, setProfileData] = useState({
        profile_name: profileSettings?.profile_name || "",
        profile_bio: profileSettings?.profile_bio || "",
        background_type: profileSettings?.background_type || "gradient",
        background_value:
            profileSettings?.background_value ||
            "from-purple-900 via-gray-900 to-purple-900",
    });

    const iconOptions = [
        { value: "globe", label: "Globe" },
        { value: "github", label: "GitHub" },
        { value: "linkedin", label: "LinkedIn" },
        { value: "youtube", label: "YouTube" },
        { value: "instagram", label: "Instagram" },
        { value: "mail", label: "Email" },
        { value: "graduation-cap", label: "Education" },
        { value: "calendar", label: "Calendar" },
    ];

    const backgroundOptions = [
        {
            value: "from-purple-900 via-gray-900 to-purple-900",
            label: "Purple Gradient",
        },
        {
            value: "from-blue-900 via-gray-900 to-blue-900",
            label: "Blue Gradient",
        },
        {
            value: "from-green-900 via-gray-900 to-green-900",
            label: "Green Gradient",
        },
        {
            value: "from-red-900 via-gray-900 to-red-900",
            label: "Red Gradient",
        },
        { value: "from-gray-900 to-gray-800", label: "Dark Gradient" },
    ];

    const handleSaveLink = async (linkData: Partial<Link>) => {
        setIsSaving(true);
        try {
            if (editingLink) {
                const success = await updateLink(editingLink.id, linkData);
                if (success) {
                    setLinks(
                        links.map((link) =>
                            link.id === editingLink.id
                                ? { ...link, ...linkData }
                                : link
                        )
                    );
                    setEditingLink(null);
                }
            } else {
                const success = await createLink(
                    linkData as Omit<
                        Link,
                        "id" | "created_at" | "updated_at" | "click_count"
                    >
                );
                if (success) {
                    window.location.reload();
                }
            }
        } catch (error) {
            console.error("Error saving link:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteLink = async (linkId: string) => {
        if (confirm("Tem certeza que deseja excluir este link?")) {
            const success = await deleteLink(linkId);
            if (success) {
                setLinks(links.filter((link) => link.id !== linkId));
            }
        }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const success = await updateProfileSettings(profileData);
            if (success) {
                alert("Perfil atualizado com sucesso!");
            }
        } catch (error) {
            console.error("Error saving profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const toggleLinkStatus = async (link: Link) => {
        const success = await updateLink(link.id, {
            is_active: !link.is_active,
        });
        if (success) {
            setLinks(
                links.map((l) =>
                    l.id === link.id ? { ...l, is_active: !l.is_active } : l
                )
            );
        }
    };

    const handleDragStart = (e: React.DragEvent, linkId: string) => {
        setDraggedItem(linkId);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = async (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        if (!draggedItem || draggedItem === targetId) return;

        const draggedIndex = links.findIndex((link) => link.id === draggedItem);
        const targetIndex = links.findIndex((link) => link.id === targetId);

        const newLinks = [...links];
        const [draggedLink] = newLinks.splice(draggedIndex, 1);
        newLinks.splice(targetIndex, 0, draggedLink);

        setLinks(newLinks);
        setDraggedItem(null);

        // Update order in database
        const ids = newLinks.map((link) => link.id);
        await reorderLinks(ids);
    };

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">
                        Gerenciar Links
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base">
                        Configure seus links e perfil
                    </p>
                </div>
                <Button
                    onClick={() => window.open("/links", "_blank")}
                    className="bg-pink-600 hover:bg-pink-700 w-full sm:w-auto"
                >
                    Ver Página de Links
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 md:gap-4">
                <Button
                    variant={activeTab === "links" ? "default" : "outline"}
                    onClick={() => setActiveTab("links")}
                    className={`${
                        activeTab === "links"
                            ? "bg-pink-600"
                            : "border-gray-700"
                    } text-sm`}
                >
                    <Settings className="w-4 h-4 mr-2" />
                    Links
                </Button>
                <Button
                    variant={activeTab === "profile" ? "default" : "outline"}
                    onClick={() => setActiveTab("profile")}
                    className={`${
                        activeTab === "profile"
                            ? "bg-pink-600"
                            : "border-gray-700"
                    } text-sm`}
                >
                    <User className="w-4 h-4 mr-2" />
                    Perfil
                </Button>
                <Button
                    variant={activeTab === "appearance" ? "default" : "outline"}
                    onClick={() => setActiveTab("appearance")}
                    className={`${
                        activeTab === "appearance"
                            ? "bg-pink-600"
                            : "border-gray-700"
                    } text-sm`}
                >
                    <Palette className="w-4 h-4 mr-2" />
                    Aparência
                </Button>
            </div>

            {/* Links Tab */}
            {activeTab === "links" && (
                <div className="space-y-4 md:space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h3 className="text-lg md:text-xl font-semibold text-white">
                            Seus Links
                        </h3>
                        <Dialog
                            open={isCreateModalOpen}
                            onOpenChange={setIsCreateModalOpen}
                        >
                            <DialogTrigger asChild>
                                <Button className="bg-pink-600 hover:bg-pink-700 w-full sm:w-auto">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Adicionar Link
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gray-800 border-gray-700 text-white mx-4">
                                <DialogHeader>
                                    <DialogTitle>
                                        Adicionar Novo Link
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label>Título</Label>
                                        <Input
                                            value={newLink.title}
                                            onChange={(e) =>
                                                setNewLink({
                                                    ...newLink,
                                                    title: e.target.value,
                                                })
                                            }
                                            className="bg-gray-700 border-gray-600"
                                        />
                                    </div>
                                    <div>
                                        <Label>URL</Label>
                                        <Input
                                            value={newLink.url}
                                            onChange={(e) =>
                                                setNewLink({
                                                    ...newLink,
                                                    url: e.target.value,
                                                })
                                            }
                                            className="bg-gray-700 border-gray-600"
                                        />
                                    </div>
                                    <div>
                                        <Label>Descrição</Label>
                                        <Input
                                            value={newLink.description as string}
                                            onChange={(e) =>
                                                setNewLink({
                                                    ...newLink,
                                                    description: e.target.value,
                                                })
                                            }
                                            className="bg-gray-700 border-gray-600"
                                        />
                                    </div>
                                    <div>
                                        <Label>Ícone</Label>
                                        <Select
                                            value={newLink.icon_name as string}
                                            onValueChange={(value) =>
                                                setNewLink({
                                                    ...newLink,
                                                    icon_name: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger className="bg-gray-700 border-gray-600">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-800 border-gray-700">
                                                {iconOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Cor de Fundo</Label>
                                            <Input
                                                type="color"
                                                value={newLink.background_color}
                                                onChange={(e) =>
                                                    setNewLink({
                                                        ...newLink,
                                                        background_color:
                                                            e.target.value,
                                                    })
                                                }
                                                className="bg-gray-700 border-gray-600 h-10"
                                            />
                                        </div>
                                        <div>
                                            <Label>Cor do Texto</Label>
                                            <Input
                                                type="color"
                                                value={newLink.text_color}
                                                onChange={(e) =>
                                                    setNewLink({
                                                        ...newLink,
                                                        text_color:
                                                            e.target.value,
                                                    })
                                                }
                                                className="bg-gray-700 border-gray-600 h-10"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => handleSaveLink(newLink)}
                                        disabled={isSaving}
                                        className="w-full bg-pink-600 hover:bg-pink-700"
                                    >
                                        {isSaving
                                            ? "Salvando..."
                                            : "Criar Link"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="space-y-4">
                        {links.map((link) => (
                            <Card
                                key={link.id}
                                className={`bg-gray-800/50 border-gray-700 backdrop-blur-sm transition-all duration-300 ${
                                    draggedItem === link.id
                                        ? "opacity-50 scale-95"
                                        : "hover:bg-gray-800/70"
                                }`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, link.id)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, link.id)}
                            >
                                <CardContent className="p-4">
                                    {/* Mobile Layout */}
                                    <div className="block md:hidden space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <GripVertical className="w-4 h-4 text-gray-500 cursor-move flex-shrink-0" />
                                                <div
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                                    style={{
                                                        backgroundColor:
                                                            link.background_color,
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            color: link.text_color,
                                                        }}
                                                        className="text-sm"
                                                    >
                                                        �
                                                    </span>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-semibold text-white text-sm truncate">
                                                        {link.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-400 truncate">
                                                        {link.url}
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
                                                            setEditingLink(link)
                                                        }
                                                        className="text-white"
                                                    >
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleDeleteLink(
                                                                link.id
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
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs"
                                                >
                                                    {link.click_count} clicks
                                                </Badge>
                                                <Switch
                                                    checked={link.is_active}
                                                    onCheckedChange={() =>
                                                        toggleLinkStatus(link)
                                                    }
                                                    // size="sm"
                                                />
                                                <span className="text-xs text-gray-400">
                                                    {link.is_active
                                                        ? "Ativo"
                                                        : "Inativo"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop Layout */}
                                    <div className="hidden md:block">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <GripVertical className="w-4 h-4 text-gray-500 cursor-move" />
                                                <div
                                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                    style={{
                                                        backgroundColor:
                                                            link.background_color,
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            color: link.text_color,
                                                        }}
                                                    >
                                                        �
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-white">
                                                        {link.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-400 truncate max-w-xs">
                                                        {link.url}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs"
                                                >
                                                    {link.click_count} clicks
                                                </Badge>
                                                <Switch
                                                    checked={link.is_active}
                                                    onCheckedChange={() =>
                                                        toggleLinkStatus(link)
                                                    }
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        setEditingLink(link)
                                                    }
                                                    className="border-gray-600 hover:bg-gray-700"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleDeleteLink(
                                                            link.id
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
                </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
                <div className="space-y-6">
                    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-white">
                                Informações do Perfil
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Nome</Label>
                                <Input
                                    value={profileData.profile_name}
                                    onChange={(e) =>
                                        setProfileData({
                                            ...profileData,
                                            profile_name: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                />
                            </div>
                            <div>
                                <Label>Bio</Label>
                                <Textarea
                                    value={profileData.profile_bio}
                                    onChange={(e) =>
                                        setProfileData({
                                            ...profileData,
                                            profile_bio: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                    rows={3}
                                />
                            </div>
                            <Button
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                                className="bg-pink-600 hover:bg-pink-700 w-full"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isSaving ? "Salvando..." : "Salvar Perfil"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Appearance Tab */}
            {activeTab === "appearance" && (
                <div className="space-y-6">
                    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-white">
                                Aparência
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Fundo</Label>
                                <Select
                                    value={profileData.background_value}
                                    onValueChange={(value) =>
                                        setProfileData({
                                            ...profileData,
                                            background_value: value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="bg-gray-700 border-gray-600">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-700">
                                        {backgroundOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                                className="bg-pink-600 hover:bg-pink-700 w-full"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isSaving ? "Salvando..." : "Salvar Aparência"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Edit Link Modal */}
            {editingLink && (
                <Dialog
                    open={!!editingLink}
                    onOpenChange={() => setEditingLink(null)}
                >
                    <DialogContent className="bg-gray-800 border-gray-700 text-white mx-4">
                        <DialogHeader>
                            <DialogTitle>Editar Link</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Título</Label>
                                <Input
                                    value={editingLink.title}
                                    onChange={(e) =>
                                        setEditingLink({
                                            ...editingLink,
                                            title: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                />
                            </div>
                            <div>
                                <Label>URL</Label>
                                <Input
                                    value={editingLink.url}
                                    onChange={(e) =>
                                        setEditingLink({
                                            ...editingLink,
                                            url: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                />
                            </div>
                            <div>
                                <Label>Descrição</Label>
                                <Input
                                    value={editingLink.description || ""}
                                    onChange={(e) =>
                                        setEditingLink({
                                            ...editingLink,
                                            description: e.target.value,
                                        })
                                    }
                                    className="bg-gray-700 border-gray-600"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Cor de Fundo</Label>
                                    <Input
                                        type="color"
                                        value={editingLink.background_color}
                                        onChange={(e) =>
                                            setEditingLink({
                                                ...editingLink,
                                                background_color:
                                                    e.target.value,
                                            })
                                        }
                                        className="bg-gray-700 border-gray-600 h-10"
                                    />
                                </div>
                                <div>
                                    <Label>Cor do Texto</Label>
                                    <Input
                                        type="color"
                                        value={editingLink.text_color}
                                        onChange={(e) =>
                                            setEditingLink({
                                                ...editingLink,
                                                text_color: e.target.value,
                                            })
                                        }
                                        className="bg-gray-700 border-gray-600 h-10"
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={() => handleSaveLink(editingLink)}
                                disabled={isSaving}
                                className="w-full bg-pink-600 hover:bg-pink-700"
                            >
                                {isSaving ? "Salvando..." : "Salvar Alterações"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
