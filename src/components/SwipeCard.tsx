import { animate, motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { Store } from '../data/stores'
import type { SwipeDir } from '../state/AppContext'
import { Chip, StoreImage } from './ui'

interface Props {
  store: Store
  score: number
  shared: string[]
  isTop: boolean
  depth: number
  forced: SwipeDir | null
  onSwiped: (dir: SwipeDir) => void
  onOpenDetail: () => void
  seed: number
}

const THRESHOLD = 110

export function SwipeCard({ store, score, shared, isTop, depth, forced, onSwiped, onOpenDetail, seed }: Props) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useTransform(x, [-300, 0, 300], [-16, 0, 16])
  const likeOpacity = useTransform(x, [20, THRESHOLD], [0, 1])
  const nopeOpacity = useTransform(x, [-THRESHOLD, -20], [1, 0])
  const superOpacity = useTransform(y, [-THRESHOLD, -30], [1, 0])
  const [photo, setPhoto] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const fly = (dir: SwipeDir) => {
    if (leaving) return
    setLeaving(true)
    const opts = { duration: 0.32, ease: 'easeIn' as const }
    if (dir === 'super') animate(y, -900, opts)
    else animate(x, dir === 'like' ? 520 : -520, opts)
    setTimeout(() => onSwiped(dir), 300)
  }

  useEffect(() => {
    if (forced && isTop) fly(forced)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forced])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info
    if (offset.x > THRESHOLD || velocity.x > 700) fly('like')
    else if (offset.x < -THRESHOLD || velocity.x < -700) fly('nope')
    else if (offset.y < -THRESHOLD * 1.3 || velocity.y < -900) fly('super')
    else {
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 })
      animate(y, 0, { type: 'spring', stiffness: 400, damping: 30 })
    }
  }

  const onTap = (e: MouseEvent | TouchEvent | PointerEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect || !('clientX' in e)) return
    const rel = (e.clientX - rect.left) / rect.width
    if (rel < 0.4) setPhoto((p) => Math.max(0, p - 1))
    else setPhoto((p) => Math.min(store.photos.length - 1, p + 1))
  }

  const tags = [...store.aromas, ...store.moods]

  return (
    <motion.div
      ref={ref}
      className="absolute inset-0 select-none overflow-hidden rounded-[28px] bg-espresso shadow-[0_18px_40px_-18px_rgb(43_29_22/0.55)]"
      style={{ x, y, rotate, zIndex: 10 - depth, touchAction: 'none' }}
      initial={false}
      animate={{ scale: 1 - depth * 0.045, translateY: depth * 14 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      drag={isTop && !leaving}
      dragMomentum={false}
      onDragEnd={onDragEnd}
      onTap={isTop ? onTap : undefined}
      whileDrag={{ cursor: 'grabbing' }}
    >
      <StoreImage src={store.photos[photo]} alt={store.name} seed={seed + photo} className="pointer-events-none absolute inset-0 size-full" />

      {/* photo progress */}
      <div className="absolute inset-x-3 top-3 flex gap-1">
        {store.photos.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i === photo ? 'bg-white' : 'bg-white/40'}`} />
        ))}
      </div>

      {/* score badge */}
      <div className="absolute right-3 top-7 rounded-full bg-white/90 px-3 py-1.5 text-[13px] font-bold text-wine shadow backdrop-blur">
        취향 일치 {score}%
      </div>
      {store.isMine && (
        <div className="absolute left-3 top-7 rounded-full bg-terra px-3 py-1.5 text-[12px] font-bold text-white shadow">내 매장 미리보기</div>
      )}

      {/* stamps */}
      <motion.div style={{ opacity: likeOpacity }} className="absolute left-6 top-16 -rotate-12 rounded-xl border-4 border-like px-3 py-1 text-3xl font-black tracking-wider text-like">
        LIKE
      </motion.div>
      <motion.div style={{ opacity: nopeOpacity }} className="absolute right-6 top-16 rotate-12 rounded-xl border-4 border-nope px-3 py-1 text-3xl font-black tracking-wider text-nope">
        NOPE
      </motion.div>
      <motion.div style={{ opacity: superOpacity }} className="absolute inset-x-0 bottom-52 mx-auto w-max -rotate-6 rounded-xl border-4 border-super px-3 py-1 text-2xl font-black text-super">
        꼭 가볼래요
      </motion.div>

      {/* info */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-5 pb-5 pt-28 text-white">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-white/75">
              {store.category} · {store.area} · {store.distanceKm}km
            </div>
            <h3 className="mt-0.5 truncate font-serif text-[28px] font-bold leading-tight">{store.name}</h3>
          </div>
          <button
            type="button"
            aria-label="매장 상세 보기"
            onPointerDownCapture={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation()
              onOpenDetail()
            }}
            className="pointer-events-auto grid size-9 shrink-0 place-items-center rounded-full bg-white/20 text-lg backdrop-blur-md"
          >
            ⓘ
          </button>
        </div>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-white/85">{store.intro}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.slice(0, 6).map((t) =>
            shared.includes(t) ? (
              <span key={t} className="rounded-full bg-terra px-2.5 py-1 text-xs font-semibold text-white">
                ♥ {t}
              </span>
            ) : (
              <Chip key={t} tone="glass">
                {t}
              </Chip>
            ),
          )}
        </div>
        <div className="mt-3 text-[12px] text-white/70">
          시그니처 · <span className="font-semibold text-white">{store.signature}</span>
        </div>
      </div>
    </motion.div>
  )
}
