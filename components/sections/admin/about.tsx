"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, GripVertical, Image as ImageIcon, Save, Loader2 } from "lucide-react";
import Image from "next/image";
import { updateAboutSettings } from "@/utils/actions/about";
import type { AboutSettings } from "@/utils/supabase/types";

interface LinkItem {
    name: string;
    icon: string;
    url: string;
}

export function AboutManager({ initialSettings }: { initialSettings: AboutSettings | null }) {
    const [bio, setBio] = useState(initialSettings?.bio || "");
    const [links, setLinks] = useState<LinkItem[]>(initialSettings?.social_links || []);
    const [previewImage, setPreviewImage] = useState<string | null>(initialSettings?.profile_image_url || null);
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreviewImage(objectUrl);
        }
    };

    const addLink = () => {
        setLinks([...links, { name: "", icon: "LinkIcon", url: "" }]);
    };

    const updateLink = (index: number, field: keyof LinkItem, value: string) => {
        const newLinks = [...links];
        newLinks[index][field] = value;
        setLinks(newLinks);
    };

    const removeLink = (index: number) => {
        setLinks(links.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setFeedback(null);

        const formData = new FormData();
        formData.append("id", initialSettings?.id || "new");
        formData.append("bio", bio);
        formData.append("social_links", JSON.stringify(links));
        
        if (initialSettings?.profile_image_url) {
            formData.append("old_image_url", initialSettings.profile_image_url);
        }
        
        if (file) {
            formData.append("file", file);
        }

        try {
            const result = await updateAboutSettings(formData);
            if (result.success) {
                setFeedback({ type: "success", message: "Configurações atualizadas com sucesso!" });
            } else {
                setFeedback({ type: "error", message: result.error });
            }
        } catch (error) {
            setFeedback({ type: "error", message: "Ocorreu um erro inesperado." });
        } finally {
            setIsLoading(false);
            setTimeout(() => setFeedback(null), 5000);
        }
    };

    return (
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-white text-xl">Quem Sou Eu</CardTitle>
                    <CardDescription className="text-gray-400">
                        Gerencie as informações da seção sobre você
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                    {feedback && (
                        <div className={`p-4 rounded-lg flex items-center gap-3 ${feedback.type === "success" ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-red-500/20 text-red-300 border border-red-500/30"}`}>
                            {feedback.message}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Bio e Imagem */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <Label className="text-white text-base">Foto de Perfil</Label>
                                <div className="flex items-center gap-6">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700 bg-gray-800 flex items-center justify-center shrink-0">
                                        {previewImage ? (
                                            <Image src={previewImage} alt="Preview" width={128} height={128} className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="w-8 h-8 text-gray-500" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <Label htmlFor="image-upload" className="cursor-pointer">
                                            <div className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-gray-600 inline-block">
                                                Escolher nova foto
                                            </div>
                                        </Label>
                                        <Input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                        <p className="text-xs text-gray-400">Formatos aceitos: JPG, PNG, WEBP. Tamanho máx: 5MB.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-white text-base">Biografia / Sobre Mim</Label>
                                <Textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Escreva sobre você..."
                                    className="h-48 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 resize-none font-sans"
                                    required
                                />
                                <p className="text-xs text-gray-400">Até 1000 caracteres recomendados. Quebras de linha são suportadas.</p>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-white text-base">Links Sociais (Max 4)</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addLink}
                                    disabled={links.length >= 4}
                                    className="border-gray-600 bg-transparent hover:bg-gray-700 text-gray-300"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Adicionar Link
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {links.length === 0 && (
                                    <div className="text-center p-8 border border-dashed border-gray-700 rounded-lg text-gray-500">
                                        Nenhum link social configurado.
                                    </div>
                                )}
                                {links.map((link, index) => (
                                    <div key={index} className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg border border-gray-700 group">
                                        <GripVertical className="w-5 h-5 text-gray-600 cursor-grab" />
                                        
                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <Input
                                                placeholder="Nome (Ex: LinkedIn)"
                                                value={link.name}
                                                onChange={(e) => updateLink(index, "name", e.target.value)}
                                                className="bg-gray-800 border-gray-700 text-white h-9"
                                            />
                                            <Input
                                                placeholder="Ícone Lúdice (Ex: Linkedin)"
                                                value={link.icon}
                                                onChange={(e) => updateLink(index, "icon", e.target.value)}
                                                className="bg-gray-800 border-gray-700 text-white h-9"
                                            />
                                            <Input
                                                placeholder="URL (https://...)"
                                                value={link.url}
                                                onChange={(e) => updateLink(index, "url", e.target.value)}
                                                className="bg-gray-800 border-gray-700 text-white h-9 sm:col-span-2"
                                            />
                                        </div>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeLink(index)}
                                            className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-700/50">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Salvar Alterações
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
