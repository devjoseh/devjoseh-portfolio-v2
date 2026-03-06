"use server";

import { createClient } from "../supabase/server";
import type { Projects, Skills, Experiences } from "../supabase/types";

// Re-export for convenience
export type { Projects, Skills, Experiences };

// Public-facing DTO for hackathons (camelCase, mapped from DB snake_case)
export interface HackathonDTO {
    id: string;
    title: string;
    date: string;
    coverImage: string;
    placement: string;
    placementType: "winner" | "finalist" | "participant";
    description: string;
    photos: Array<{ id: string; url: string; alt: string }>;
}

export async function getProjects(): Promise<Projects[]> {
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

export async function getFeaturedProjects(): Promise<Projects[]> {
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

export async function getHackathons(): Promise<HackathonDTO[]> {
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

export async function getSkills(): Promise<Skills[]> {
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

export async function getExperiences(): Promise<Experiences[]> {
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

    const { error } = await supabase
        .from("contact_messages")
        .insert([
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
