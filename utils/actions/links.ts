"use server";

import { createClient } from "../supabase/server";
import type { Links, LinkClicks, ProfileSettings } from "../supabase/types";

// Re-export canonical types for convenience
export type { Links, LinkClicks, ProfileSettings };

// Type for analytics query result (join between link_clicks and links)
export interface LinkAnalyticsEntry {
    clicked_at: string;
    links: Array<{
        title: string;
        id: string;
    }> | null;
}

// NOTE: reorderLinks also exists in utils/actions/admin.ts using the bypass (service-role)
// client. That version is for admin use where RLS must be bypassed. This version uses the
// standard authenticated client for non-privileged operations.

export async function getActiveLinks(): Promise<Links[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("links")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });

    if (error) {
        console.error("Error fetching links:", error);
        return [];
    }

    return data || [];
}

export async function getAllLinks(): Promise<Links[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("links")
        .select("*")
        .order("order_index", { ascending: true });

    if (error) {
        console.error("Error fetching all links:", error);
        return [];
    }

    return data || [];
}

export async function getProfileSettings(): Promise<ProfileSettings | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("profile_settings")
        .select("*")
        .limit(1)
        .single();

    if (error) {
        console.error("Error fetching profile settings:", error);
        return null;
    }

    return data;
}

export async function trackLinkClick(
    linkId: string,
    userAgent?: string,
    referrer?: string
): Promise<void> {
    const supabase = await createClient();

    try {
        await supabase.rpc("increment_link_clicks", { link_id: linkId });

        await supabase
            .from("link_clicks")
            .insert([
                {
                    link_id: linkId,
                    user_agent: userAgent,
                    referrer: referrer,
                },
            ]);
    } catch (error) {
        console.error("Error tracking link click:", error);
    }
}

export async function updateLink(
    linkId: string,
    updates: Partial<Links>
): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("links")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", linkId);

    if (error) {
        console.error("Error updating link:", error);
        return false;
    }

    return true;
}

export async function createLink(
    link: Omit<Links, "id" | "created_at" | "updated_at" | "click_count">
): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("links")
        .insert([link]);

    if (error) {
        console.error("Error creating link:", error);
        return false;
    }

    return true;
}

export async function deleteLink(linkId: string): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("links")
        .delete()
        .eq("id", linkId);

    if (error) {
        console.error("Error deleting link:", error);
        return false;
    }

    return true;
}

export async function updateProfileSettings(
    updates: Partial<ProfileSettings>
): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("profile_settings")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("type", "base")

    if (error) {
        console.error("Error updating profile settings:", error);
        return false;
    }

    return true;
}

export async function getLinkAnalytics(days = 30): Promise<LinkAnalyticsEntry[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("link_clicks")
        .select(`
            clicked_at,
            links (
                title,
                id
            )
        `)
        .gte("clicked_at", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order("clicked_at", { ascending: false });

    if (error) {
        console.error("Error fetching analytics:", error);
        return [];
    }

    return data || [];
}

export async function reorderLinks(ids: string[]): Promise<boolean> {
    const supabase = await createClient();
    
    const { error } = await supabase.rpc("reorder_links", { link_ids: ids });

    if (error) {
        console.error("Error reordering links:", error);
        return false;
    }
    
    return true;
}
