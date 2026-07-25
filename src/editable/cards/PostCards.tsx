import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'

/* ─── Utility helpers ─── */

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

// Strip HTML/entities to plain text for card excerpts.
export function toPlainText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof post?.summary === 'string' && post.summary) ||
    (typeof content.body === 'string' && content.body) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    ''
  const clean = toPlainText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/* ─── Card 1: Editorial Feature — full-bleed image with overlay text ─── */
export function EditorialFeatureCard({ post, href, label = 'Featured' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className="group block min-w-0 overflow-hidden">
      <div className="relative min-h-[560px] lg:min-h-[640px]">
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_28%,rgba(10,8,6,0.94)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 p-8 lg:p-11">
          <p className="text-[10px] font-medium uppercase tracking-[0.42em] text-[var(--slot4-accent)]">{label}</p>
          <h3 className="editable-display mt-4 max-w-2xl text-[36px] font-light italic leading-[1.05] text-white sm:text-[48px] lg:text-[56px]">
            {post.title}
          </h3>
          <p className="mt-4 max-w-xl text-[13px] leading-7 text-white/50">
            {getEditableExcerpt(post, 160)}
          </p>
          <span className="mt-6 inline-flex items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.35em] text-white/45 transition-colors duration-300 group-hover:text-white/90">
            Read story <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ─── Card 2: Rail Post — portrait card for horizontal scrollers ─── */
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className="group block w-[240px] shrink-0 snap-start overflow-hidden sm:w-[270px]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          loading="lazy"
        />
        <span className="absolute left-4 top-4 text-[10px] font-light tracking-[0.3em] text-white/50">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(10,8,6,0.90)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--slot4-accent)]">
            {getEditableCategory(post)}
          </p>
          <h3 className="editable-display mt-1.5 line-clamp-2 text-[18px] font-light italic leading-snug text-white">
            {post.title}
          </h3>
        </div>
      </div>
    </Link>
  )
}

/* ─── Card 3: Compact Index — numbered list item with horizontal layout ─── */
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-5 border-b border-[var(--editable-border)] py-5 last:border-0 transition-opacity hover:opacity-75"
    >
      <span className="editable-display mt-0.5 w-9 shrink-0 text-[28px] font-light italic leading-none text-[var(--slot4-accent)] opacity-55">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--slot4-muted-text)]">
          {getEditableCategory(post)}
        </p>
        <h3 className="editable-display mt-1.5 line-clamp-2 text-[19px] font-light italic leading-snug text-[var(--slot4-page-text)]">
          {post.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[12px] leading-6 text-[var(--slot4-soft-muted-text)]">
          {getEditableExcerpt(post, 95)}
        </p>
      </div>
    </Link>
  )
}

/* ─── Card 4: Article List — wide horizontal card with thumbnail ─── */
export function ArticleListCard({ post, href, index: _index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className="group grid min-w-0 overflow-hidden border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition-shadow duration-400 hover:shadow-[0_16px_50px_rgba(0,0,0,0.55)] sm:grid-cols-[200px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--slot4-media-bg)] sm:aspect-auto sm:min-h-[210px]">
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col justify-center px-6 py-6 lg:px-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-[var(--slot4-accent)]">
          {getEditableCategory(post)}
        </p>
        <h2 className="editable-display mt-3 line-clamp-2 text-[24px] font-light italic leading-snug text-[var(--slot4-page-text)] sm:text-[28px]">
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-3 text-[13px] leading-7 text-[var(--slot4-muted-text)]">
          {getEditableExcerpt(post, 155)}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-muted-text)] transition-colors duration-300 group-hover:text-[var(--slot4-accent)]">
          View post <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}
