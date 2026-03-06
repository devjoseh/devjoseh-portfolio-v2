"use server";

import { createBypassClient } from "../supabase/bypass";
import { createClient } from "../supabase/server";
import type { Resumes } from "../supabase/types";

export type { Resumes };

const BUCKET_NAME = "resumes";
const MAX_FILE_SIZE_MB = 5;
const ALLOWED_MIME = "application/pdf";

// ─── Public ──────────────────────────────────────────────────────────────────

/** Reads active resumes — used on the landing page (public, cached by Next.js). */
export async function getActiveResumes(): Promise<Resumes[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("is_active", true)
        .order("language", { ascending: true });

    if (error) {
        console.error("Error fetching resumes:", error);
        return [];
    }

    return data || [];
}

// ─── Admin ────────────────────────────────────────────────────────────────────

/** Reads all resumes (active + inactive) — used in the admin panel. */
export async function getAllResumes(): Promise<Resumes[]> {
    const supabase = createBypassClient();

    const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .order("language", { ascending: true });

    if (error) {
        console.error("Error fetching all resumes:", error);
        return [];
    }

    return data || [];
}

export type UploadResumeResult =
    | { success: true; url: string; fileName: string }
    | { success: false; error: string };

/**
 * Uploads a PDF to Supabase Storage and upserts the record in the DB.
 * Uses service-role key to bypass RLS — server-only, never called from client.
 */
export async function uploadAndSaveResume(
    formData: FormData
): Promise<UploadResumeResult> {
    const supabase = createBypassClient();

    const file = formData.get("file") as File | null;
    const language = formData.get("language") as string | null;
    const label = formData.get("label") as string | null;

    // ── Input validation ──────────────────────────────────────────────────────
    if (!file || !language || !label) {
        return { success: false, error: "Campos obrigatórios ausentes." };
    }

    if (file.type !== ALLOWED_MIME) {
        return { success: false, error: "Apenas arquivos PDF são permitidos." };
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
        return {
            success: false,
            error: `Arquivo muito grande. Máximo: ${MAX_FILE_SIZE_MB}MB.`,
        };
    }

    if (!["pt-BR", "en"].includes(language)) {
        return { success: false, error: "Idioma inválido." };
    }

    // ── Storage upload ────────────────────────────────────────────────────────
    // Use a deterministic file name per language so the old file is automatically
    // replaced in Storage without leaving orphaned files.
    const storagePath = `${language}/curriculo.pdf`;

    const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, file, {
            contentType: ALLOWED_MIME,
            upsert: true, // overwrite if exists
        });

    if (uploadError) {
        console.error("Storage upload error:", uploadError);
        return { success: false, error: "Falha ao fazer upload do arquivo." };
    }

    // ── Get public URL ────────────────────────────────────────────────────────
    const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;

    // ── DB upsert ─────────────────────────────────────────────────────────────
    // ON CONFLICT(language) → update existing row
    const { error: dbError } = await supabase
        .from("resumes")
        .upsert(
            {
                language,
                label,
                file_url: publicUrl,
                file_name: file.name,
                is_active: true,
                updated_at: new Date().toISOString(),
            },
            { onConflict: "language" }
        );

    if (dbError) {
        console.error("DB upsert error:", dbError);
        // Clean up orphaned file in Storage
        await supabase.storage.from(BUCKET_NAME).remove([storagePath]);
        return { success: false, error: "Falha ao salvar no banco de dados." };
    }

    return { success: true, url: publicUrl, fileName: file.name };
}

export type DeleteResumeResult =
    | { success: true }
    | { success: false; error: string };

/** Deletes a resume record from the DB and its file from Storage. */
export async function deleteResume(id: string, language: string): Promise<DeleteResumeResult> {
    if (!id || !language) {
        return { success: false, error: "ID e idioma são obrigatórios." };
    }

    const supabase = createBypassClient();
    const storagePath = `${language}/curriculo.pdf`;

    // Delete DB record first
    const { error: dbError } = await supabase
        .from("resumes")
        .delete()
        .eq("id", id);

    if (dbError) {
        console.error("DB delete error:", dbError);
        return { success: false, error: "Falha ao remover do banco de dados." };
    }

    // Then remove from Storage (best-effort — don't fail if file is missing)
    const { error: storageError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([storagePath]);

    if (storageError) {
        console.warn("Storage remove warning (non-fatal):", storageError);
    }

    return { success: true };
}

/** Toggles the is_active flag for a resume. */
export async function toggleResumeActive(
    id: string,
    isActive: boolean
): Promise<boolean> {
    const supabase = createBypassClient();

    const { error } = await supabase
        .from("resumes")
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq("id", id);

    if (error) {
        console.error("Error toggling resume active:", error);
        return false;
    }

    return true;
}
