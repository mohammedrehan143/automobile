import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://indianwheelalignment.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/worker", "/portal"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
