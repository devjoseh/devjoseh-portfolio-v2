import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = `https://devjoseh.com.br`
    
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