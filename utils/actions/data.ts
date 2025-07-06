"use server";

import { createClient } from "../supabase/server";

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

type Skill = {
    id: string
    name: string
    category: string
    proficiency: number
    icon_name: string | null
    created_at: string
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

// Hackathon interface to match the component expectations
export interface Hackathon {
    id: string;
    title: string;
    date: string;
    coverImage: string;
    placement: string;
    placementType: "winner" | "finalist" | "participant";
    description: string;
    photos: Array<{ id: string; url: string; alt: string }>;
}

export async function getProjects(): Promise<Project[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("order_index", { ascending: true });

    if (error) {
        console.error("Error fetching projects:", error);
        return [];
    }

    return data || [];
}

export async function getFeaturedProjects(): Promise<Project[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("featured", true)
        .order("order_index", { ascending: true });

    if (error) {
        console.error("Error fetching featured projects:", error);
        return [];
    }

    return data || [];
}

export async function getHackathons(): Promise<Hackathon[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("hackathons")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });

    if (error) {
        console.error("Error fetching hackathons:", error);
        return [];
    }

    // Transform database data to match component interface
    return (data || []).map((hackathon) => ({
        id: hackathon.id,
        title: hackathon.title,
        date: hackathon.date,
        coverImage: hackathon.cover_image_url || "/placeholder.svg?height=300&width=400",
        placement: hackathon.placement,
        placementType: hackathon.placement_type as | "winner" | "finalist" | "participant",
        description: hackathon.description,
        photos: Array.isArray(hackathon.photos) ? hackathon.photos : [],
    }));
}

export async function getSkills(): Promise<Skill[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("proficiency", { ascending: false });

    if (error) {
        console.error("Error fetching skills:", error);
        return [];
    }

    return data || [];
}

export async function getExperiences(): Promise<Experience[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("start_date", { ascending: false });

    if (error) {
        console.error("Error fetching experiences:", error);
        return [];
    }

    return data || [];
}

export async function submitContactMessage(
    name: string,
    email: string,
    subject: string,
    message: string
): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase.from("contact_messages").insert([
        {
            name,
            email,
            subject,
            message,
            status: "unread",
        },
    ]);

    if (error) {
        console.error("Error submitting contact message:", error);
        return false;
    }

    return true;
}
