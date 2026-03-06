"use server";

// Uses the service-role bypass client to skip RLS, allowing admin CRUD operations
// without being blocked by the row-level security policies that restrict public access.
import { createBypassClient } from "../supabase/bypass";
import type { Hackathons, Projects, Experiences } from "../supabase/types";

// Re-export so consumers of this module can stay in sync with canonical types
export type { Hackathons, Projects, Experiences };

// HACKATHONS
export async function getHackathons(): Promise<Hackathons[]> {
    const supabase = createBypassClient();

    const { data, error } = await supabase
        .from("hackathons")
        .select("*")
        .order("order_index", { ascending: true });

    if (error) {
        console.error("Error fetching hackathons:", error);
        return [];
    }

    return data || [];
}

export async function createHackathon(
    hackathon: Omit<Hackathons, "id" | "created_at" | "updated_at">
): Promise<boolean> {
    const supabase = createBypassClient();

    const { error } = await supabase
        .from("hackathons")
        .insert([hackathon]);

    if (error) {
        console.error("Error creating hackathon:", error);
        return false;
    }

    return true;
}

export async function updateHackathon(
    id: string,
    updates: Partial<Hackathons>
): Promise<boolean> {
    const supabase = createBypassClient();

    const { error } = await supabase
        .from("hackathons")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);

    if (error) {
        console.error("Error updating hackathon:", error);
        return false;
    }

    return true;
}

export async function deleteHackathon(id: string): Promise<boolean> {
    const supabase = createBypassClient();

    const { error } = await supabase
        .from("hackathons")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting hackathon:", error);
        return false;
    }

    return true;
}

export async function reorderHackathons(ids: string[]): Promise<boolean> {
    const supabase = createBypassClient();

    const { error } = await supabase.rpc("reorder_hackathons", {
        hackathon_ids: ids,
    });

    if (error) {
        console.error("Error reordering hackathons:", error);
        return false;
    }

    return true;
}

// PROJECTS
export async function createProject(
    project: Omit<Projects, "id" | "created_at" | "updated_at">
): Promise<boolean> {
    const supabase = createBypassClient();

    const { error } = await supabase
        .from("projects")
        .insert([project]);

    if (error) {
        console.error("Error creating project:", error);
        return false;
    }

    return true;
}

export async function updateProject(
    id: string,
    updates: Partial<Projects>
): Promise<boolean> {
    const supabase = createBypassClient();

    const { error } = await supabase
        .from("projects")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);

    if (error) {
        console.error("Error updating project:", error);
        return false;
    }

    return true;
}

export async function deleteProject(id: string): Promise<boolean> {
    const supabase = createBypassClient();

    const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting project:", error);
        return false;
    }

    return true;
}

export async function reorderProjects(ids: string[]): Promise<boolean> {
    const supabase = createBypassClient();

    const { error } = await supabase.rpc("reorder_projects", {
        project_ids: ids,
    });

    if (error) {
        console.error("Error reordering projects:", error);
        return false;
    }

    return true;
}

// EXPERIENCES
export async function createExperience(
    experience: Omit<Experiences, "id" | "created_at">
): Promise<boolean> {
    const supabase = createBypassClient();

    const { error } = await supabase
        .from("experiences")
        .insert([experience]);

    if (error) {
        console.error("Error creating experience:", error);
        return false;
    }

    return true;
}

export async function updateExperience(
    id: string,
    updates: Partial<Experiences>
): Promise<boolean> {
    const supabase = createBypassClient();

    const { error } = await supabase
        .from("experiences")
        .update(updates)
        .eq("id", id);

    if (error) {
        console.error("Error updating experience:", error);
        return false;
    }

    return true;
}

export async function deleteExperience(id: string): Promise<boolean> {
    const supabase = createBypassClient();

    const { error } = await supabase
        .from("experiences")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting experience:", error);
        return false;
    }

    return true;
}

export async function reorderExperiences(ids: string[]): Promise<boolean> {
    const supabase = createBypassClient();

    const { error } = await supabase.rpc("reorder_experiences", {
        experience_ids: ids,
    });

    if (error) {
        console.error("Error reordering experiences:", error);
        return false;
    }

    return true;
}

// LINKS
export async function reorderLinks(ids: string[]): Promise<boolean> {
    const supabase = createBypassClient();
    
    const { error } = await supabase.rpc("reorder_links", { link_ids: ids });

    if (error) {
        console.error("Error reordering links:", error);
        return false;
    }

    return true;
}
