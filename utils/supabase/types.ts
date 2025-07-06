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
    category: string;
    proficiency: number;
    icon_name: string | null;
    created_at: string;
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