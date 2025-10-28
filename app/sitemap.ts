import type { MetadataRoute } from "next"

import { getSiteUrl } from "@/lib/seo"

const baseUrl = getSiteUrl()

const routes: Array<{ path: string; changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"] }> =
  [
    { path: "/", changeFrequency: "weekly" },
    { path: "/about", changeFrequency: "monthly" },
    { path: "/pricing", changeFrequency: "weekly" },
    { path: "/contact", changeFrequency: "monthly" },
    { path: "/enter", changeFrequency: "monthly" },
    { path: "/register", changeFrequency: "monthly" },
    { path: "/dashboard", changeFrequency: "daily" },
    { path: "/privacy", changeFrequency: "yearly" },
    { path: "/terms", changeFrequency: "yearly" },
    { path: "/success", changeFrequency: "monthly" },
  ]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return routes.map(({ path, changeFrequency }) => ({
    url: `${baseUrl}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency,
    priority: path === "/" ? 1 : 0.7,
  }))
}
