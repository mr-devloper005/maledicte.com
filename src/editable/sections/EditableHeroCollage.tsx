'use client'

import { useEffect, useState } from 'react'

/*
  Full-screen single-image slideshow for the home hero.
  Crossfades through the pool of post images with a cinematic 2s transition.
  Server render is deterministic (index = 0) → no hydration mismatch.
  Rotation is disabled for prefers-reduced-motion users.
*/
export function EditableHeroCollage({ images }: { images: string[] }) {
  const pool = images.length ? images : ['/placeholder.svg?height=1080&width=1920']
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (pool.length <= 1) return
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % pool.length)
    }, 5500)
    return () => clearInterval(id)
  }, [pool.length])

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {pool.slice(0, 7).map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[2200ms] ease-in-out ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
          loading={i === 0 ? 'eager' : 'lazy'}
          {...(i === 0 ? { fetchPriority: 'high' as const } : {})}
        />
      ))}

      {/* Slide position indicators */}
      {pool.length > 1 && (
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
          {pool.slice(0, 7).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Go to image ${i + 1}`}
              className={`rounded-full transition-all duration-700 ${
                i === current
                  ? 'h-[5px] w-8 bg-white/80'
                  : 'h-[5px] w-[5px] bg-white/30 hover:bg-white/55'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
