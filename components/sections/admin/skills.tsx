"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, ArrowUp, ArrowDown, LayoutDashboard, Code, Save, Loader2, Edit2, X } from "lucide-react";
import type { SkillCategories, Skills } from "@/utils/supabase/types";
import type { SkillWithCategory } from "@/utils/actions/skills";
import { 
    createSkillCategory, updateSkillCategory, deleteSkillCategory, reorderSkillCategories,
    createSkillAdmin, updateSkillAdmin, deleteSkillAdmin, reorderSkillsAdmin
} from "@/utils/actions/skills";
import Image from "next/image";

interface SkillsManagerProps {
    initialCategories: SkillCategories[];
    initialSkills: SkillWithCategory[];
}

export function SkillsManager({ initialCategories, initialSkills }: SkillsManagerProps) {
    const [categories, setCategories] = useState<SkillCategories[]>(initialCategories);
    const [skills, setSkills] = useState<SkillWithCategory[]>(initialSkills);
    const [activeTab, setActiveTab] = useState<"skills" | "categories">("skills");
    
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Form states
    const [editingCategory, setEditingCategory] = useState<SkillCategories | null>(null);
    const [editingSkill, setEditingSkill] = useState<SkillWithCategory | null>(null);
    
    // Feedback helper
    const showFeedback = (type: "success" | "error", message: string) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback(null), 4000);
    };

    // --- CATEGORY ACTIONS ---
    const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        
        if (editingCategory?.id) {
            // Update
            const success = await updateSkillCategory(editingCategory.id, { name });
            if (success) {
                setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, name, updated_at: new Date().toISOString() } : c));
                showFeedback("success", "Categoria atualizada.");
                setEditingCategory(null);
            } else {
                showFeedback("error", "Erro ao atualizar.");
            }
        } else {
            // Create
            const order_index = categories.length;
            const success = await createSkillCategory({ name, order_index });
            if (success) {
                // Refresh categories via API ou otimista simples (aqui vou dar refresh visual básico, ideal é re-fetch)
                showFeedback("success", "Categoria criada! Recarregue a página se ela não aparecer para as Skills.");
                // Para manter simples o admin: recarregando a página pra atualizar relacionamentos.
                setTimeout(() => window.location.reload(), 1500);
            } else {
                showFeedback("error", "Erro ao criar categoria.");
            }
        }
        setIsLoading(false);
        (e.target as HTMLFormElement).reset();
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Tem certeza? Skills atreladas a esta categoria ficarão órfãs!")) return;
        setIsLoading(true);
        const success = await deleteSkillCategory(id);
        if (success) {
            setCategories(categories.filter(c => c.id !== id));
            showFeedback("success", "Excluída com sucesso.");
        } else {
            showFeedback("error", "Erro ao excluir.");
        }
        setIsLoading(false);
    };

    const handleMoveCategory = async (index: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === categories.length - 1)) return;
        
        const newCats = [...categories];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        
        const temp = newCats[index];
        newCats[index] = newCats[swapIndex];
        newCats[swapIndex] = temp;
        
        // Atualiza indexes locais
        newCats.forEach((c, i) => c.order_index = i);
        setCategories(newCats);
        
        // Background sync db
        await reorderSkillCategories(newCats.map(c => c.id));
    };

    // --- SKILL ACTIONS ---
    const handleSaveSkill = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (categories.length === 0) {
            showFeedback("error", "Crie ao menos uma categoria antes de adicionar Skills!");
            return;
        }

        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const icon_name = formData.get("icon_name") as string;
        const category_id = formData.get("category_id") as string;
        
        if (editingSkill?.id) {
            const success = await updateSkillAdmin(editingSkill.id, { name, icon_name, category_id });
            if (success) {
                setSkills(skills.map(s => s.id === editingSkill.id ? { ...s, name, icon_name, category_id } : s));
                showFeedback("success", "Skill atualizada. (Recarregue para ver mudança de categoria)");
                setEditingSkill(null);
            } else {
                showFeedback("error", "Erro ao atualizar.");
            }
        } else {
            const order_index = skills.filter(s => s.category_id === category_id).length;
            const success = await createSkillAdmin({ name, icon_name, category_id, order_index });
            if (success) {
                showFeedback("success", "Skill criada! Recarregue a página para gerenciar adequadamente.");
                setTimeout(() => window.location.reload(), 1500);
            } else {
                showFeedback("error", "Erro ao criar skill.");
            }
        }
        setIsLoading(false);
        (e.target as HTMLFormElement).reset();
    };

    const handleDeleteSkill = async (id: string) => {
        if (!confirm("Excluir esta tecnologia?")) return;
        setIsLoading(true);
        const success = await deleteSkillAdmin(id);
        if (success) {
            setSkills(skills.filter(s => s.id !== id));
            showFeedback("success", "Skill excluída.");
        } else {
            showFeedback("error", "Erro ao excluir.");
        }
        setIsLoading(false);
    };

    const handleMoveSkill = async (id: string, category_id: string, direction: 'up' | 'down') => {
        // Encontra skills da mesma categoria ordenadas
        const catSkills = skills.filter(s => s.category_id === category_id).sort((a,b) => a.order_index - b.order_index);
        const index = catSkills.findIndex(s => s.id === id);
        
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === catSkills.length - 1)) return;
        
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        
        // Swap IDs
        const newCatSkills = [...catSkills];
        const temp = newCatSkills[index];
        newCatSkills[index] = newCatSkills[swapIndex];
        newCatSkills[swapIndex] = temp;
        
        // Background sync (simplificado: reordena todas da cat)
        await reorderSkillsAdmin(newCatSkills.map(s => s.id));
        
        // Otimistic local update
        const updatedSkills = skills.map(s => {
            if (s.category_id !== category_id) return s;
            const newOrderIndex = newCatSkills.findIndex(ncs => ncs.id === s.id);
            return { ...s, order_index: newOrderIndex };
        });
        setSkills(updatedSkills.sort((a,b) => a.order_index - b.order_index));
    };


    return (
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                    <CardTitle className="text-white text-xl">Linguagens & Ferramentas</CardTitle>
                    <CardDescription className="text-gray-400">
                        Gerencie as categorias e as tags de tecnologias usando SkillIcons.dev.
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent>
                {/* Internal Tabs Switcher */}
                <div className="flex w-full mb-6 border-b border-gray-700">
                    <button 
                        onClick={() => setActiveTab("skills")}
                        className={`flex items-center px-4 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === "skills" ? "border-purple-500 text-purple-400" : "border-transparent text-gray-400 hover:text-gray-200"}`}
                    >
                        <Code className="w-4 h-4 mr-2" />
                        Suas Tecnologias
                    </button>
                    <button 
                        onClick={() => setActiveTab("categories")}
                        className={`flex items-center px-4 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === "categories" ? "border-purple-500 text-purple-400" : "border-transparent text-gray-400 hover:text-gray-200"}`}
                    >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Categorias (Grupos)
                    </button>
                </div>

                {feedback && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${feedback.type === "success" ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-red-500/20 text-red-300 border border-red-500/30"}`}>
                        {feedback.message}
                    </div>
                )}

                {/* VISUALIZAÇÃO DE CATEGORIAS */}
                {activeTab === "categories" && (
                    <div className="space-y-8 animate-fadeIn">
                        <form onSubmit={handleSaveCategory} className="flex gap-4 items-end bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                            <div className="flex-1 space-y-2">
                                <Label className="text-gray-300">
                                    {editingCategory ? `Editando Grupo: ${editingCategory.name}` : "Criar Novo Grupo de Skills"}
                                </Label>
                                <Input 
                                    name="name" 
                                    placeholder="Ex: Frameworks, Ferramentas DevOps..." 
                                    defaultValue={editingCategory?.name || ""}
                                    required 
                                    className="bg-gray-800 border-gray-700 text-white"
                                />
                            </div>
                            <div className="flex gap-2">
                                {editingCategory && (
                                    <Button type="button" variant="outline" onClick={() => setEditingCategory(null)} className="border-gray-600">
                                        Cancelar
                                    </Button>
                                )}
                                <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white">
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingCategory ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />)}
                                    {editingCategory ? "Salvar" : "Adicionar"}
                                </Button>
                            </div>
                        </form>

                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Grupos Existentes</h3>
                            {categories.length === 0 ? (
                                <p className="text-gray-500 text-sm">Nenhum grupo cadastrado.</p>
                            ) : (
                                categories.map((cat, idx) => (
                                    <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col gap-1 pr-3 border-r border-gray-700">
                                                <button onClick={() => handleMoveCategory(idx, 'up')} disabled={idx === 0} className="text-gray-500 hover:text-white disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                                                <button onClick={() => handleMoveCategory(idx, 'down')} disabled={idx === categories.length - 1} className="text-gray-500 hover:text-white disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                                            </div>
                                            <span className="text-white font-medium">{cat.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button size="icon" variant="ghost" className="text-blue-400 hover:bg-blue-400/10 hover:text-blue-300" onClick={() => setEditingCategory(cat)}>
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="text-red-400 hover:bg-red-400/10 hover:text-red-300" onClick={() => handleDeleteCategory(cat.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* VISUALIZAÇÃO DE SKILLS (TAGS) */}
                {activeTab === "skills" && (
                    <div className="space-y-8 animate-fadeIn">
                        <form onSubmit={handleSaveSkill} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                            <div className="space-y-2 md:col-span-1">
                                <Label className="text-gray-300">Nova Tecnologia (Título)</Label>
                                <Input 
                                    name="name" 
                                    placeholder="Ex: JavaScript" 
                                    defaultValue={editingSkill?.name || ""}
                                    required 
                                    className="bg-gray-800 border-gray-700 text-white"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-1">
                                <Label className="text-gray-300">SkillIcons (Tag)</Label>
                                <Input 
                                    name="icon_name" 
                                    placeholder="Ex: js" 
                                    defaultValue={editingSkill?.icon_name || ""}
                                    required 
                                    className="bg-gray-800 border-gray-700 text-white"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-1">
                                <Label className="text-gray-300">Grupo / Categoria</Label>
                                <select 
                                    name="category_id" 
                                    required 
                                    defaultValue={editingSkill?.category_id || ""}
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="" disabled>Selecione...</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-2 h-10 md:col-span-1 items-end justify-end">
                                {editingSkill && (
                                    <Button type="button" variant="outline" onClick={() => setEditingSkill(null)} className="border-gray-600 bg-transparent flex-1">
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                                <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white flex-1">
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingSkill ? "Salvar" : "Adicionar")}
                                </Button>
                            </div>
                        </form>

                        <div className="space-y-6">
                            {categories.map((cat) => {
                                const catSkills = skills.filter(s => s.category_id === cat.id).sort((a,b) => a.order_index - b.order_index);
                                
                                return (
                                    <div key={cat.id} className="space-y-3">
                                        <h3 className="text-sm font-semibold text-gray-400 border-b border-gray-700 pb-2">{cat.name}</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {catSkills.length === 0 ? (
                                                <p className="text-gray-600 text-xs col-span-full">Vazio</p>
                                            ) : (
                                                catSkills.map((skill, idx) => (
                                                    <div key={skill.id} className="group relative flex flex-col items-center justify-center p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-purple-500 transition-all">
                                                        {/* AÇÕES (Aparecem no hover) */}
                                                        <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button title="Mover para esquerda" onClick={() => handleMoveSkill(skill.id, cat.id, 'up')} disabled={idx===0} className="bg-gray-900 p-1 rounded hover:text-white text-gray-400 disabled:opacity-0"><ArrowUp className="w-3 h-3 -rotate-90"/></button>
                                                            <button title="Excluir" onClick={() => handleDeleteSkill(skill.id)} className="bg-red-900/50 p-1 rounded text-red-400 hover:text-red-300"><Trash2 className="w-3 h-3"/></button>
                                                            <button title="Mover para direita" onClick={() => handleMoveSkill(skill.id, cat.id, 'down')} disabled={idx===catSkills.length-1} className="bg-gray-900 p-1 rounded hover:text-white text-gray-400 disabled:opacity-0"><ArrowDown className="w-3 h-3 -rotate-90"/></button>
                                                        </div>
                                                        <button title="Editar" onClick={() => setEditingSkill(skill)} className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 bg-blue-900/50 p-1 rounded text-blue-400 hover:text-blue-300 transition-opacity">
                                                            <Edit2 className="w-3 h-3" />
                                                        </button>

                                                        <div className="w-10 h-10 mb-2">
                                                            <Image
                                                                src={`https://skillicons.dev/icons?i=${skill.icon_name}`}
                                                                alt={skill.name}
                                                                width={40} height={40} className="w-full h-full object-contain"
                                                            />
                                                        </div>
                                                        <span className="text-xs text-center text-gray-300 truncate w-full">{skill.name}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
