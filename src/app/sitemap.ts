import type { MetadataRoute } from "next";

const SITE_URL = "https://www.willowvibe.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/services", "/products", "/work-with-us", "/about", "/contact", "/privacy", "/terms"];
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
