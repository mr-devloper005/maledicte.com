import Link from 'next/link'
import { ArrowRight, ArrowDown } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref, toPlainText } from '@/editable/cards/PostCards'
import { EditableHeroCollage } from '@/editable/sections/EditableHeroCollage'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function getExcerpt(post?: SitePost | null, limit = 130) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
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

function categoryOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || ''
}

function latestPostImages(posts: SitePost[], max = 8) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const post of posts) {
    const img = getEditablePostImage(post)
    if (!img || img.includes('placeholder') || seen.has(img)) continue
    seen.add(img)
    out.push(img)
    if (out.length >= max) break
  }
  return out
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

/* ═══════════════════════════════════════════════════════════════
   HERO — Full-viewport cinematic image slideshow
   Pulls up behind the sticky navbar via -mt-[76px]
═══════════════════════════════════════════════════════════════ */
export function EditableHomeHero({ primaryTask: _primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const heroImages = latestPostImages(pool)
  const categories = SITE_CONFIG.tasks.filter((task) => task.enabled).slice(0, 5)

  return (
    <section className="relative -mt-[76px] h-screen min-h-[560px] w-full overflow-hidden">
      {/* Background image slideshow */}
      <EditableHeroCollage images={heroImages} />

      {/* Gradient layers: darken top (for nav readability) + darken bottom */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,6,0.42)_0%,rgba(10,8,6,0.0)_35%,rgba(10,8,6,0.0)_55%,rgba(10,8,6,0.62)_100%)]" />

      {/* Centered hero identity — positioned below the navbar */}
      <div className="absolute inset-x-0 bottom-0 top-[76px] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[10px] font-light uppercase tracking-[0.5em] text-white/45">
          {pagesContent.home.hero.badge}
        </p>
        <h1 className="editable-display mt-4 max-w-4xl text-[clamp(52px,9vw,136px)] font-light italic leading-[0.88] tracking-[0.01em] text-white">
          {SITE_CONFIG.name}
        </h1>
        <p className="mt-5 max-w-sm text-[13px] font-light leading-6 tracking-[0.06em] text-white/45">
          {SITE_CONFIG.tagline}
        </p>
        <Link
          href={primaryRoute}
          className="mt-9 inline-flex items-center gap-3 border border-white/20 px-8 py-3 text-[10px] font-light uppercase tracking-[0.4em] text-white/70 transition-all duration-400 hover:border-white/50 hover:bg-white/8 hover:text-white/95"
        >
          Explore <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Bottom bar: site label, category links, scroll hint */}
      <div className="absolute bottom-16 left-0 right-0 z-10 flex items-end justify-between px-8 lg:px-12">
        <span className="hidden text-[10px] font-light uppercase tracking-[0.35em] text-white/30 sm:block">
          {SITE_CONFIG.name}
        </span>
        <div className="mx-auto flex items-center gap-7 sm:gap-10">
          {categories.map((task) => (
            <Link
              key={task.key}
              href={task.route}
              className="text-[10px] font-light uppercase tracking-[0.3em] text-white/35 transition-opacity duration-300 hover:text-white/75"
            >
              {task.label}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-1.5 text-[10px] font-light uppercase tracking-[0.3em] text-white/30 sm:flex">
          <ArrowDown className="h-3 w-3" />
          <span>Scroll</span>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   STORY RAIL — Horizontal scrolling portrait cards
═══════════════════════════════════════════════════════════════ */
function PortraitCard({ post, href }: { post: SitePost; href: string }) {
  const image = getEditablePostImage(post)
  const category = categoryOf(post)
  return (
    <Link
      href={href}
      className="group relative w-[250px] shrink-0 snap-start overflow-hidden sm:w-[290px]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img
          src={image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(10,8,6,0.90)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          {category ? (
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.32em] text-[var(--slot4-accent)]">
              {category}
            </p>
          ) : null}
          <h3 className="editable-display line-clamp-2 text-[19px] font-light italic leading-snug text-white">
            {post.title}
          </h3>
        </div>
      </div>
    </Link>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)]).slice(0, 10)
  if (!pool.length) return null
  return (
    <section className="border-t border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <div className={`py-14 sm:py-16 ${container}`}>
        <div className="mb-9 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.38em] text-[var(--slot4-accent)]">
              Featured
            </p>
            <h2 className="editable-display mt-2.5 text-[32px] font-light italic sm:text-[38px]">
              From the collection
            </h2>
          </div>
          <Link
            href={primaryRoute}
            className="hidden items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-muted-text)] transition-colors hover:text-[var(--slot4-page-text)] sm:inline-flex"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="flex snap-x gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {pool.map((post) => (
            <PortraitCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAGAZINE SPLIT — Editorial asymmetric feature + stack
═══════════════════════════════════════════════════════════════ */
function LargeFeatureCard({ post, href }: { post: SitePost; href: string }) {
  const image = getEditablePostImage(post)
  const category = categoryOf(post)
  return (
    <Link href={href} className="group relative block overflow-hidden">
      <div className="relative min-h-[480px] overflow-hidden bg-[var(--slot4-media-bg)] lg:min-h-[580px]">
        <img
          src={image}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_25%,rgba(10,8,6,0.94)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 p-8 lg:p-10">
          {category ? (
            <p className="text-[10px] font-medium uppercase tracking-[0.38em] text-[var(--slot4-accent)]">
              {category}
            </p>
          ) : null}
          <h3 className="editable-display mt-3 text-[32px] font-light italic leading-[1.08] text-white sm:text-[38px] lg:text-[44px]">
            {post.title}
          </h3>
          <p className="mt-3 line-clamp-2 max-w-lg text-[13px] leading-7 text-white/50">
            {getExcerpt(post, 130)}
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.32em] text-white/50 transition-colors duration-300 group-hover:text-white/85">
            Read more <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function StackCard({ post, href }: { post: SitePost; href: string }) {
  const image = getEditablePostImage(post)
  const category = categoryOf(post)
  return (
    <Link
      href={href}
      className="group flex gap-4 border-b border-[var(--editable-border)] pb-5 last:border-0 last:pb-0"
    >
      <div className="relative h-[78px] w-[78px] shrink-0 overflow-hidden bg-[var(--slot4-media-bg)] sm:h-[88px] sm:w-[88px]">
        <img
          src={image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          loading="lazy"
        />
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        {category ? (
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--slot4-accent)]">
            {category}
          </p>
        ) : null}
        <h3 className="editable-display mt-1 line-clamp-2 text-[18px] font-light italic leading-snug text-[var(--slot4-page-text)]">
          {post.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-[12px] leading-5 text-[var(--slot4-muted-text)]">
          {getExcerpt(post, 65)}
        </p>
      </div>
    </Link>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  if (!pool.length) return null
  const [featured, ...rest] = pool
  const stack = rest.slice(0, 4)
  return (
    <section className="border-t border-[var(--editable-border)] bg-[var(--slot4-panel-bg)]">
      <div className={`py-16 sm:py-20 ${container}`}>
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.38em] text-[var(--slot4-accent)]">
              Latest
            </p>
            <h2 className="editable-display mt-2.5 text-[32px] font-light italic sm:text-[38px]">
              Recent work
            </h2>
          </div>
          <Link
            href={primaryRoute}
            className="hidden items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-muted-text)] transition-colors hover:text-[var(--slot4-page-text)] sm:inline-flex"
          >
            All posts <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] lg:items-stretch">
          <LargeFeatureCard post={featured} href={postHref(primaryTask, featured, primaryRoute)} />
          {stack.length ? (
            <div className="flex flex-col justify-center gap-5">
              {stack.map((post) => (
                <StackCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TIME COLLECTIONS — Alternating editorial grid sections
═══════════════════════════════════════════════════════════════ */
function GridCard({ post, href, tall = false }: { post: SitePost; href: string; tall?: boolean }) {
  const image = getEditablePostImage(post)
  const category = categoryOf(post)
  return (
    <Link
      href={href}
      className="group block overflow-hidden border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition-shadow duration-400 hover:shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
    >
      <div className={`relative overflow-hidden bg-[var(--slot4-media-bg)] ${tall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img
          src={image}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          loading="lazy"
        />
        {category ? (
          <span className="absolute left-4 top-4 bg-[rgba(10,8,6,0.78)] px-3 py-1 text-[9px] font-medium uppercase tracking-[0.3em] text-white/80 backdrop-blur-sm">
            {category}
          </span>
        ) : null}
      </div>
      <div className="p-5">
        <h3 className="editable-display line-clamp-2 text-[20px] font-light italic leading-snug text-[var(--slot4-page-text)]">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[12px] leading-6 text-[var(--slot4-muted-text)]">
          {getExcerpt(post, 100)}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)] opacity-70 transition-opacity group-hover:opacity-100">
          View <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

const sectionCopy: Record<string, { eyebrow: string; title: string }> = {
  spotlight: { eyebrow: 'New this week', title: 'Fresh arrivals' },
  browse: { eyebrow: 'Trending', title: 'Popular right now' },
  index: { eyebrow: 'Archive', title: 'From the collection' },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((s) => s.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, index) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'Discover', title: 'More to explore' }
        const bgClass = index % 2 === 0 ? 'bg-[var(--slot4-page-bg)]' : 'bg-[var(--slot4-panel-bg)]'
        return (
          <section key={section.key} className={`${bgClass} border-t border-[var(--editable-border)]`}>
            <div className={`py-14 sm:py-16 ${container}`}>
              <div className="mb-9 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.38em] text-[var(--slot4-accent)]">
                    {copy.eyebrow}
                  </p>
                  <h2 className="editable-display mt-2.5 text-[30px] font-light italic sm:text-[36px]">
                    {copy.title}
                  </h2>
                </div>
                <Link
                  href={section.href || primaryRoute}
                  className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-muted-text)] transition-colors hover:text-[var(--slot4-page-text)]"
                >
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.posts.slice(0, 8).map((post, i) => (
                  <GridCard
                    key={post.id || post.slug}
                    post={post}
                    href={postHref(primaryTask, post, primaryRoute)}
                    tall={i === 0}
                  />
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════
   CTA BAND — Minimal closing section
═══════════════════════════════════════════════════════════════ */
export function EditableHomeCta() {
  return (
    <section className="border-t border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]">
      <div className={`flex flex-col items-center gap-7 py-20 text-center sm:py-24 ${container}`}>
        <p className="text-[10px] font-medium uppercase tracking-[0.42em] text-[var(--slot4-accent)]">
          {pagesContent.home.cta.badge}
        </p>
        <h2 className="editable-display max-w-2xl text-[32px] font-light italic sm:text-[42px] lg:text-[52px]">
          {pagesContent.home.cta.title}
        </h2>
        <p className="max-w-md text-[14px] leading-7 text-[var(--slot4-muted-text)]">
          {pagesContent.home.cta.description}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
          <Link
            href="/create"
            className="inline-flex items-center gap-2 border border-[var(--slot4-accent)] bg-[var(--slot4-accent)] px-9 py-3.5 text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--slot4-on-accent)] transition-opacity hover:opacity-85"
          >
            Submit content
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border border-[var(--editable-border)] px-9 py-3.5 text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--slot4-muted-text)] transition hover:border-[var(--slot4-accent)]/45 hover:text-[var(--slot4-page-text)]"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </section>
  )
}
