import { notFound } from "next/navigation"
import Link from "next/link"
import { getPostsByCategory, getAllCategories } from "@/lib/blog/utils"
import { BlogPostCard } from "@/components/blog/BlogPostCard"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FolderOpen } from "lucide-react"
import { Metadata } from "next"
import { getSiteUrl } from "@/lib/seo"

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

// Generate static params for all categories
export async function generateStaticParams() {
  const categories = getAllCategories()
  return categories.map((category) => ({
    category: category.toLowerCase(),
  }))
}

// Generate metadata for each category
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)
  const formattedCategory =
    decodedCategory.charAt(0).toUpperCase() + decodedCategory.slice(1)

  const siteUrl = getSiteUrl()
  const categoryUrl = `${siteUrl}/blog/category/${category}`

  return {
    title: `${formattedCategory} | PortraitWiz Blog`,
    description: `Browse all posts in the ${formattedCategory} category`,
    openGraph: {
      title: `${formattedCategory} Posts`,
      description: `Browse all posts in the ${formattedCategory} category`,
      type: "website",
      url: categoryUrl,
    },
    twitter: {
      card: "summary",
      title: `${formattedCategory} Posts`,
      description: `Browse all posts in the ${formattedCategory} category`,
    },
    alternates: {
      canonical: categoryUrl,
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)

  // Find the exact category match (case-insensitive)
  const allCategories = getAllCategories()
  const exactCategory = allCategories.find(
    (cat) => cat.toLowerCase() === decodedCategory.toLowerCase()
  )

  if (!exactCategory) {
    notFound()
  }

  const posts = getPostsByCategory(exactCategory)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-primary/10 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <Link href="/blog" className="inline-block mb-6">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          <div className="flex items-center justify-center gap-2 mb-4">
            <FolderOpen className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold md:text-5xl">{exactCategory}</h1>
          </div>
          <p className="text-center text-lg text-muted-foreground">
            {posts.length} {posts.length === 1 ? "post" : "posts"} in this
            category
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="container mx-auto px-4 py-12">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FolderOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground mb-6">
              There are no posts in this category yet.
            </p>
            <Link href="/blog">
              <Button>Browse All Posts</Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
