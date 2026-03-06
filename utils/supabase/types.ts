// Canonical types matching the Supabase database schema.
// All server actions should import from here — do NOT redefine types locally.

export type Projects = {
    id: string;
    title: string;
    description: string;
    long_description: string | null;
    technologies: string[];
    github_url: string | null;
    live_url: string | null;
    image_url: string | null;
    featured: boolean;
    order_index: number;
    created_at: string;
    updated_at: string;
}

export type Skills = {
    id: string;
    name: string;
    category?: string; // (Depreciado em favor do category_id)
    category_id: string | null;
    proficiency?: number;
    icon_name: string | null;
    order_index: number;
    created_at: string;
}

export type SkillCategories = {
    id: string;
    name: string;
    order_index: number;
    created_at: string;
    updated_at: string;
}

export type Experiences = {
    id: string;
    company: string;
    position: string;
    description: string;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    location: string | null;
    technologies: string[];
    created_at: string;
    image_url: string;
}

export type Hackathons = {
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

export type Links = {
    id: string;
    title: string;
    url: string;
    description: string | null;
    icon_name: string | null;
    background_color: string;
    text_color: string;
    is_active: boolean;
    order_index: number;
    click_count: number;
    created_at: string;
    updated_at: string;
}

export type LinkClicks = {
    id: string;
    link_id: string;
    clicked_at: string;
    user_agent: string | null;
    ip_address: string | null;
    referrer: string | null;
}

export type ProfileSettings = {
    id: string;
    profile_name: string;
    profile_bio: string;
    profile_image_url: string | null;
    background_type: string;
    background_value: string;
    theme: string;
    custom_css: string | null;
    type: string;
    created_at: string;
    updated_at: string;
}

export type Resumes = {
    id: string;
    language: string;     // 'pt-BR' | 'en'
    label: string;        // 'Português' | 'English'
    file_url: string;
    file_name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type AboutSettings = {
    id: string;
    bio: string;
    profile_image_url: string | null;
    social_links: Array<{ icon: string; name: string; url: string }>;
    created_at: string;
    updated_at: string;
}
