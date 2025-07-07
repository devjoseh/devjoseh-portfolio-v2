import { MetadataRoute } from "next";
import { appConfig } from "@/config";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: appConfig.routes.protected
            }
        ],
        sitemap: `${appConfig.baseUrl}/sitemap.xml`,
    }
}