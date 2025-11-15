import type { MetadataRoute } from "next"

import { getSiteUrl } from "@/lib/seo"
import { getAllPosts, getAllCategories } from "@/lib/blog/utils"

const baseUrl = getSiteUrl()

const routes: Array<{ path: string; changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"] }> =
  [
    { path: "/", changeFrequency: "weekly" },
    { path: "/about", changeFrequency: "monthly" },
    { path: "/blog", changeFrequency: "weekly" },
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

  // Static routes
  const staticRoutes = routes.map(({ path, changeFrequency }) => ({
    url: `${baseUrl}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency,
    priority: path === "/" ? 1 : 0.7,
  }))

  // Blog post routes
  const posts = getAllPosts()
  const blogPostRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  // Category routes
  const categories = getAllCategories()
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/blog/category/${category.toLowerCase()}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }))

  return [...staticRoutes, ...blogPostRoutes, ...categoryRoutes]
}
