import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { toPlainText } from '@/editable/cards/PostCards'
import { pagesContent } from '@/editable/content/pages.content'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''

const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}

const summaryOf = (post: SitePost) => {
  const content = getContent(post)
  return toPlainText(
    (typeof post.summary === 'string' && post.summary) ||
    compactRaw(content.description) ||
    compactRaw(content.excerpt) ||
    compactRaw(content.body) ||
    '',
  )
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post }: { post: SitePost }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'

  return (
    <Link
      href={href}
      className="group block overflow-hidden border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition-shadow duration-400 hover:shadow-[0_20px_56px_rgba(0,0,0,0.6)]"
    >
      {image ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(10,8,6,0.75)_100%)]" />
          <span className="absolute left-4 top-4 bg-[rgba(10,8,6,0.72)] px-3 py-1 text-[9px] font-medium uppercase tracking-[0.3em] text-white/80 backdrop-blur-sm">
            {taskLabel}
          </span>
        </div>
      ) : null}
      <div className="p-5">
        {!image ? (
          <span className="text-[9px] font-medium uppercase tracking-[0.32em] text-[var(--slot4-accent)]">{taskLabel}</span>
        ) : null}
        <h2 className="editable-display mt-3 line-clamp-2 text-[22px] font-light italic leading-snug text-[var(--slot4-page-text)]">
          {post.title}
        </h2>
        {summary ? (
          <p className="mt-2 line-clamp-2 text-[12px] leading-6 text-[var(--slot4-muted-text)]">{summary}</p>
        ) : null}
        <span className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)] opacity-65 transition-opacity group-hover:opacity-100">
          Open <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">

        {/* Search hero */}
        <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-panel-bg)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-6 py-16 lg:px-10 lg:py-20">
            <p className="text-[10px] font-medium uppercase tracking-[0.42em] text-[var(--slot4-accent)]">
              {pagesContent.search.hero.badge}
            </p>
            <h1 className="editable-display mt-4 max-w-2xl text-[clamp(36px,5vw,60px)] font-light italic leading-[1.04]">
              {pagesContent.search.hero.title}
            </h1>
            <form action="/search" className="mt-8 flex max-w-xl overflow-hidden border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]">
              <input type="hidden" name="master" value="1" />
              <div className="flex flex-1 items-center gap-3 px-5">
                <Search className="h-4 w-4 shrink-0 text-[var(--slot4-muted-text)]" />
                <input
                  name="q"
                  defaultValue={query}
                  placeholder={pagesContent.search.hero.placeholder}
                  className="min-w-0 flex-1 bg-transparent py-4 text-[15px] font-light text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-muted-text)]"
                />
              </div>
              <select
                name="task"
                defaultValue={task}
                className="hidden appearance-none border-l border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 text-[12px] font-medium text-[var(--slot4-muted-text)] outline-none [color-scheme:dark] sm:block"
              >
                <option value="">All types</option>
                {enabledTasks.map((item) => (
                  <option key={item.key} value={item.key}>{item.label}</option>
                ))}
              </select>
              <button
                type="submit"
                className="shrink-0 border-l border-[var(--slot4-accent)] bg-[var(--slot4-accent)] px-7 text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--slot4-on-accent)] transition hover:opacity-90"
              >
                Search
              </button>
            </form>
          </div>
        </section>

        {/* Results */}
        <section className="mx-auto max-w-[var(--editable-container)] px-6 py-14 lg:px-10">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--slot4-muted-text)]">
                {results.length} result{results.length !== 1 ? 's' : ''}
              </p>
              <h2 className="editable-display mt-2 text-[28px] font-light italic">
                {query ? `Results for "${query}"` : pagesContent.search.resultsTitle}
              </h2>
            </div>
            <Link
              href="/article"
              className="hidden items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)] sm:inline-flex"
            >
              Browse latest <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {results.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((post) => (
                <SearchResultCard key={post.id || post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-8 py-16 text-center">
              <p className="editable-display text-[28px] font-light italic">No matching posts found.</p>
              <p className="mt-3 text-[13px] leading-6 text-[var(--slot4-muted-text)]">
                Try a different keyword, content type, or category.
              </p>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
