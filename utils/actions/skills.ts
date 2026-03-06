"use server";

import { createBypassClient } from "../supabase/bypass";
import { createClient } from "../supabase/server";
import type { Skills, SkillCategories } from "../supabase/types";

// Tipo auxiliar para retornar na UI com o nome da Categoria populado do BD
export type SkillWithCategory = Skills & {
    skill_categories?: { name: string } | null;
};

// ─── Públicos (Landing Page) ────────────────────────────────────────────────────────

/** Busca as categorias ordenadas para os botões de Filtro. */
export async function getSkillCategories(): Promise<SkillCategories[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("skill_categories")
        .select("*")
        .order("order_index", { ascending: true });

    if (error) {
        console.error("Error fetching skill categories:", error);
        return [];
    }

    return data || [];
}

/** Busca todas as skills relacionadas às suas categorias ordenadas. */
export async function getSkillsPublic(): Promise<SkillWithCategory[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("skills")
        .select(`
            id, name, icon_name, order_index, category_id, created_at,
            skill_categories ( name )
        `)
        .order("order_index", { ascending: true });

    if (error) {
        console.error("Error fetching skills:", error);
        return [];
    }

    return (data as unknown as SkillWithCategory[]) || [];
}

// ─── ADMIN (Bypass Privado) ────────────────────────────────────────────────────────

// - CATEGORIAS ----------------------------------------------------------------------
export async function createSkillCategory(
    categoryData: Omit<SkillCategories, "id" | "created_at" | "updated_at">
): Promise<boolean> {
    const supabase = createBypassClient();

    const { error } = await supabase.from("skill_categories").insert([categoryData]);

    if (error) {
        console.error("Error creating skill category:", error);
        return false;
    }
    return true;
}

export async function updateSkillCategory(
    id: string,
    updates: Partial<SkillCategories>
): Promise<boolean> {
    const supabase = createBypassClient();

    const { error } = await supabase
        .from("skill_categories")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);

    if (error) {
        console.error("Error updating skill category:", error);
        return false;
    }
    return true;
}

export async function deleteSkillCategory(id: string): Promise<boolean> {
    const supabase = createBypassClient();

    const { error } = await supabase.from("skill_categories").delete().eq("id", id);

    if (error) {
        console.error("Error deleting skill category:", error);
        return false;
    }
    return true;
}

export async function reorderSkillCategories(ids: string[]): Promise<boolean> {
    const supabase = createBypassClient();
    
    // Fallback reorder manual pra caso não haj script de SQL trigger pro reorder gerado
    for (let i = 0; i < ids.length; i++) {
        const { error } = await supabase
            .from("skill_categories")
            .update({ order_index: i })
            .eq("id", ids[i]);

        if (error) {
             console.error("Error reordering skill categories manual loop:", error);
             return false;
        }
    }
    return true;
}

// - SKILLS ----------------------------------------------------------------------
export async function createSkillAdmin(
    skillData: Omit<Skills, "id" | "created_at">
): Promise<boolean> {
    const supabase = createBypassClient();

    const { error } = await supabase.from("skills").insert([{
        name: skillData.name,
        category_id: skillData.category_id,
        icon_name: skillData.icon_name,
        order_index: skillData.order_index || 0,
        category: "" // Fallback caso NOT NULL não tenha sido dropado
    }]);

    if (error) {
        console.error("Error creating skill:", error);
        return false;
    }
    return true;
}

export async function updateSkillAdmin(
    id: string,
    updates: Partial<Skills>
): Promise<boolean> {
    const supabase = createBypassClient();

    const { error } = await supabase
        .from("skills")
        .update(updates)
        .eq("id", id);

    if (error) {
        console.error("Error updating skill:", error);
        return false;
    }
    return true;
}

export async function deleteSkillAdmin(id: string): Promise<boolean> {
    const supabase = createBypassClient();

    const { error } = await supabase.from("skills").delete().eq("id", id);

    if (error) {
        console.error("Error deleting skill:", error);
        return false;
    }
    return true;
}

export async function reorderSkillsAdmin(ids: string[]): Promise<boolean> {
    const supabase = createBypassClient();
    
    // Manual loop para as skills individuais
    for (let i = 0; i < ids.length; i++) {
        const { error } = await supabase
            .from("skills")
            .update({ order_index: i })
            .eq("id", ids[i]);

        if (error) {
             console.error("Error reordering skills manual loop:", error);
             return false;
        }
    }
    return true;
}
