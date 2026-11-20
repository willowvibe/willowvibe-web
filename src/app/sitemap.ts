import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/services";

const SITE_URL = "https://www.willowvibe.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/services",
    ...SERVICES.map((service) => `/services/${service.slug}`),
    "/products",
    "/work-with-us",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ];
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
