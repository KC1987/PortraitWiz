import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, User } from "lucide-react"
import { BlogPost } from "@/lib/blog/types"

interface PostLayoutProps {
  post: BlogPost
  children: React.ReactNode
}

export function PostLayout({ post, children }: PostLayoutProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <article className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{post.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <header className="mb-8">
        <Badge className="mb-4" variant="secondary">
          {post.category}
        </Badge>
        <h1 className="text-4xl font-bold mb-4 md:text-5xl">{post.title}</h1>
        <p className="text-xl text-muted-foreground mb-6">{post.description}</p>

        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{post.author}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{post.readingTime}</span>
          </div>
        </div>
      </header>

      <Separator className="mb-8" />

      {/* Content with typography */}
      <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-h2:text-3xl prose-h3:text-2xl prose-p:text-base prose-p:leading-7 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
        {children}
      </div>
    </article>
  )
}
