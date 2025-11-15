"use client"

import { useState } from "react"
import { BlogPostCard } from "@/components/blog/BlogPostCard"
import { CategoryFilter } from "@/components/blog/CategoryFilter"
import { BookOpen } from "lucide-react"
import { BlogPost } from "@/lib/blog/types"

interface BlogListingClientProps {
  posts: BlogPost[]
  categories: string[]
}

export function BlogListingClient({ posts, categories }: BlogListingClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category === selectedCategory)
    : posts

  return (
    <>
      {/* Category Filter & Posts */}
      <section className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground mb-4">
            FILTER BY CATEGORY
          </h2>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground">
              Check back soon for new content!
            </p>
          </div>
        )}
      </section>
    </>
  )
}
