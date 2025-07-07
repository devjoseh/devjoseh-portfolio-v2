import { MetadataRoute } from "next";
import { appConfig } from "@/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = appConfig.baseUrl;
    
    return [
        {
            url: `${baseUrl}/`,
        },
        {
            url: `${baseUrl}/sign-in`,
        },
        {
            url: `${baseUrl}/links`,
        }
    ]
}