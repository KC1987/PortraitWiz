import { getAllPosts, getAllCategories } from "@/lib/blog/utils"
import { BlogListingClient } from "@/components/blog/BlogListingClient"
import { BookOpen } from "lucide-react"

export default function BlogPage() {
  const allPosts = getAllPosts()
  const categories = getAllCategories()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-primary/10 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold md:text-5xl">Blog</h1>
          </div>
          <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto">
            Tips, tutorials, and best practices for creating stunning AI
            portraits with Supershoot
          </p>
        </div>
      </section>

      <BlogListingClient posts={allPosts} categories={categories} />
    </div>
  )
}
