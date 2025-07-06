import { getActiveLinks, getProfileSettings } from "@/utils/actions/links";
import { LinksPage } from "@/components/index";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "DevJoseH - Links",
    description: "Todos os meus links importantes em um só lugar",
    keywords: "devjoseh, links, portfolio, desenvolvedor backend",
};

export default async function Links() {
    const [links, profileSettings] = await Promise.all([
        getActiveLinks(),
        getProfileSettings(),
    ]);

    return <LinksPage initialLinks={links} profileSettings={profileSettings} />;
}
