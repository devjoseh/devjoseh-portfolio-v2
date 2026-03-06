"use server";

import { createBypassClient } from "../supabase/bypass";
import { createClient } from "../supabase/server";
import type { AboutSettings } from "../supabase/types";

const BUCKET_NAME = "portfolio_assets";
const MAX_FILE_SIZE_MB = 5;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

// ─── Public ──────────────────────────────────────────────────────────────────

/** Reads About Settings — used on the landing page (public, cached by Next.js). */
export async function getAboutSettings(): Promise<AboutSettings | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("about_settings")
        .select("*")
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') // ignore "no rows returned" error
    {
        console.error("Error fetching about settings:", error);
        return null; // Silent catch
    }

    return data || null;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export type UpdateAboutSettingsResult =
    | { success: true; newData: AboutSettings }
    | { success: false; error: string };

/**
 * Updates About Settings text properties, Social Links and performs an Image Upsert if provided.
 * Uses service-role key to bypass RLS — server-only, never called from client.
 */
export async function updateAboutSettings(
    formData: FormData
): Promise<UpdateAboutSettingsResult> {
    const supabase = createBypassClient();

    const id = formData.get("id") as string | null;
    const bio = formData.get("bio") as string | null;
    const socialLinksStr = formData.get("social_links") as string | null;
    const file = formData.get("file") as File | null;
    let oldImageUrl = formData.get("old_image_url") as string | null;

    if (!bio || !socialLinksStr) {
        return { success: false, error: "Bio e Social Links são obrigatórios." };
    }

    let parsedLinks = [];
    try {
        parsedLinks = JSON.parse(socialLinksStr);
    } catch {
        return { success: false, error: "Formato de Links inválido." };
    }

    let publicUrl = oldImageUrl;

    // ── Storage upload (Apenas se receber arquivo novo) ────────────────────────────────────────────────────────
    if (file && file.size > 0 && file.name) {
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            return { success: false, error: "Apenas imagens PNG, JPEG e WEBP são permitidas." };
        }

        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > MAX_FILE_SIZE_MB) {
            return {
                success: false,
                error: `Arquivo muito grande. Máximo: ${MAX_FILE_SIZE_MB}MB.`,
            };
        }

        // Generate dynamic file name to avoid cache locking
        const fileExt = file.name.split('.').pop();
        const fileName = `profile-${Date.now()}.${fileExt}`;
        const storagePath = `images/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(storagePath, file, {
                contentType: file.type,
                upsert: true,
            });

        if (uploadError) {
            console.error("Storage upload error:", uploadError);
            return { success: false, error: "Falha ao fazer upload da imagem." };
        }

        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(storagePath);
        
        publicUrl = urlData.publicUrl;
    }

    // ── DB mutation ─────────────────────────────────────────────────────────────
    const payload = {
        bio,
        profile_image_url: publicUrl,
        social_links: parsedLinks,
        updated_at: new Date().toISOString(),
    };

    let resultData;

    if (id && id !== "new") {
        // Atualiza Row Existente
        const { data, error: dbError } = await supabase
            .from("about_settings")
            .update(payload)
            .eq("id", id)
            .select()
            .single();

        if (dbError) {
            console.error("DB update error:", dbError);
            return { success: false, error: "Falha ao salvar no banco de dados." };
        }
        resultData = data;
    } else {
        // Inspeciona se rolou bypass para Insert único.
        // Já que garantimos que há apenas "1" about page no dashboard limit point
        // Delete all beforehand se existiam (singleton pattern fallback)
        await supabase.from("about_settings").delete().neq('id', '00000000-0000-0000-0000-000000000000'); 
        
        const { data, error: dbError } = await supabase
            .from("about_settings")
            .insert([payload])
            .select()
            .single();

        if (dbError) {
            console.error("DB insert error:", dbError);
            return { success: false, error: "Falha ao criar o painel de sobre mim no banco." };
        }
        resultData = data;
    }

    return { success: true, newData: resultData };
}
