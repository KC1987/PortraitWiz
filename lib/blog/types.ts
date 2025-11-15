export interface BlogPostFrontmatter {
  title: string
  description: string
  date: string
  author: string
  category: string
  image?: string
  tags?: string[]
}

export interface BlogPost extends BlogPostFrontmatter {
  slug: string
  content: string
  readingTime: string
}

export type BlogCategory =
  | "AI Tips"
  | "Prompt Engineering"
  | "Use Cases"
  | "Portrait Photography"
  | "Tutorials"
  | "Best Practices"
