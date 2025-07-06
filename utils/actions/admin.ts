"use server";

import { createBypassClient } from "../supabase/bypass";

// Extend the database types
export interface Hackathon {
    id: string;
    title: string;
    date: string;
    cover_image_url: string | null;
    placement: string;
    placement_type: "winner" | "finalist" | "participant";
    description: string;
    photos: Array<{ id: string; url: string; alt: string }>;
    order_index: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

type Project = {
    id: string
    title: string
    description: string
    long_description: string | null
    technologies: string[]
    github_url: string | null
    live_url: string | null
    image_url: string | null
    featured: boolean
    order_index: number
    created_at: string
    updated_at: string
}

type Experience = {
    id: string
    company: string
    position: string
    description: string
    start_date: string
    end_date: string | null
    is_current: boolean
    location: string | null
    technologies: string[]
    created_at: string
}

// Hackathon functions
export async function getHackathons(): Promise<Hackathon[]> {
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
    hackathon: Omit<Hackathon, "id" | "created_at" | "updated_at">
): Promise<boolean> {
    const supabase = createBypassClient();

    const { error } = await supabase.from("hackathons").insert([hackathon]);

    if (error) {
        console.error("Error creating hackathon:", error);
        return false;
    }

    return true;
}

export async function updateHackathon(
    id: string,
    updates: Partial<Hackathon>
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

    const { error } = await supabase.from("hackathons").delete().eq("id", id);

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

// Project functions
export async function createProject(
    project: Omit<Project, "id" | "created_at" | "updated_at">
): Promise<boolean> {
    const supabase = createBypassClient();

    const { error } = await supabase.from("projects").insert([project]);

    if (error) {
        console.error("Error creating project:", error);
        return false;
    }

    return true;
}

export async function updateProject(
    id: string,
    updates: Partial<Project>
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

    const { error } = await supabase.from("projects").delete().eq("id", id);

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

// Experience functions
export async function createExperience(
    experience: Omit<Experience, "id" | "created_at">
): Promise<boolean> {
    const supabase = createBypassClient();

    const { error } = await supabase.from("experiences").insert([experience]);

    if (error) {
        console.error("Error creating experience:", error);
        return false;
    }

    return true;
}

export async function updateExperience(
    id: string,
    updates: Partial<Experience>
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

    const { error } = await supabase.from("experiences").delete().eq("id", id);

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

// Reorder links function
export async function reorderLinks(ids: string[]): Promise<boolean> {
    const supabase = createBypassClient();
    
    const { error } = await supabase.rpc("reorder_links", { link_ids: ids });

    if (error) {
        console.error("Error reordering links:", error);
        return false;
    }

    return true;
}
