import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState, type ReactNode } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import type { Store } from '../data/stores'
import { matchScore } from '../lib/match'
import { useApp, type SwipeDir } from '../state/AppContext'
import { SwipeCard } from '../components/SwipeCard'
import { MatchModal } from '../components/MatchModal'
import { TasteBars } from '../components/RangeSlider'
import { Button, Chip, StoreImage } from '../components/ui'

export default function Discover() {
  const nav = useNavigate()
  const { user, stores, swiped, swipe, resetSwipes } = useApp()
  const [forced, setForced] = useState<SwipeDir | null>(null)
  const [matched, setMatched] = useState<{ store: Store; score: number } | null>(null)
  const [detail, setDetail] = useState<Store | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const deck = useMemo(() => {
    return stores
      .filter((s) => !swiped[s.id])
      .map((s, i) => ({ store: s, ...matchScore(user, s), seed: i }))
      .sort((a, b) => Number(!!b.store.isMine) - Number(!!a.store.isMine) || b.score - a.score)
  }, [stores, swiped, user])

  if (!user) return <Navigate to="/user/onboarding" replace />

  const top = deck[0]

  const onSwiped = (dir: SwipeDir) => {
    setForced(null)
    if (!top) return
    const ok = swipe(top.store.id, dir)
    if (ok) setMatched({ store: top.store, score: top.score })
    else if (dir !== 'nope') {
      setToast(`${top.store.name}에 좋아요를 보냈어요 · 사장님 응답 대기 중`)
      setTimeout(() => setToast(null), 2200)
    }
  }

  const press = (dir: SwipeDir) => {
    if (top && !forced) setForced(dir)
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between px-5">
        <div className="font-serif text-[26px] font-bold text-wine">취향잔</div>
        <div className="flex items-center gap-2">
          <Chip>📍 {user.region} · 5km</Chip>
          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-terra ring-1 ring-oat">{deck.length}곳</span>
        </div>
      </header>

      <div className="relative mx-4 mt-1 flex-1">
        {deck.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-[28px] bg-white text-center ring-1 ring-oat">
            <div className="text-5xl">🍵</div>
            <p className="mt-3 text-[16px] font-bold">오늘의 추천을 모두 확인했어요</p>
            <p className="mt-1 text-[13px] text-cocoa">매칭된 가게와 대화를 시작해 보세요</p>
            <div className="mt-5 flex gap-2">
              <Button variant="outline" className="h-11" onClick={resetSwipes}>
                처음부터 다시
              </Button>
              <Button className="h-11" onClick={() => nav('/app/matches')}>
                매칭 보기
              </Button>
            </div>
          </div>
        ) : (
          deck
            .slice(0, 3)
            .reverse()
            .map((c) => {
              const depth = deck.indexOf(c)
              return (
                <SwipeCard
                  key={c.store.id}
                  store={c.store}
                  score={c.score}
                  shared={c.shared}
                  seed={c.seed}
                  depth={depth}
                  isTop={depth === 0}
                  forced={depth === 0 ? forced : null}
                  onSwiped={onSwiped}
                  onOpenDetail={() => setDetail(c.store)}
                />
              )
            })
        )}
      </div>

      <div className="flex shrink-0 items-center justify-center gap-5 py-4">
        <RoundBtn label="별로예요" onClick={() => press('nope')} className="size-16 text-3xl text-nope">
          ✕
        </RoundBtn>
        <RoundBtn label="꼭 가볼래요" onClick={() => press('super')} className="size-12 text-xl text-super">
          ★
        </RoundBtn>
        <RoundBtn label="좋아요" onClick={() => press('like')} className="size-16 text-3xl text-like">
          ♥
        </RoundBtn>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="absolute inset-x-5 top-16 z-40 rounded-2xl bg-espresso px-4 py-3 text-center text-[13px] font-medium text-cream shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <DetailSheet
        store={detail}
        score={detail ? matchScore(user, detail).score : 0}
        onClose={() => setDetail(null)}
        onAction={(dir) => {
          setDetail(null)
          setTimeout(() => press(dir), 250)
        }}
        canAct={!!detail && detail.id === top?.store.id}
      />

      <MatchModal
        store={matched?.store ?? null}
        score={matched?.score ?? 0}
        nickname={user.nickname}
        onClose={() => setMatched(null)}
        onChat={() => {
          const id = matched!.store.id
          setMatched(null)
          nav(`/app/chat/${id}`)
        }}
      />
    </div>
  )
}

function RoundBtn({ label, onClick, className, children }: { label: string; onClick: () => void; className: string; children: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`grid place-items-center rounded-full bg-white font-bold shadow-[0_8px_20px_-8px_rgb(43_29_22/0.35)] ring-1 ring-oat ${className}`}
    >
      {children}
    </motion.button>
  )
}

function DetailSheet({
  store,
  score,
  onClose,
  onAction,
  canAct,
}: {
  store: Store | null
  score: number
  onClose: () => void
  onAction: (d: SwipeDir) => void
  canAct: boolean
}) {
  return (
    <AnimatePresence>
      {store && (
        <>
          <motion.div className="absolute inset-0 z-40 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="absolute inset-x-0 bottom-0 z-50 max-h-[88%] overflow-y-auto rounded-t-[28px] bg-cream no-scrollbar"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, i) => i.offset.y > 120 && onClose()}
          >
            <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-oat" />
            <div className="no-scrollbar mt-3 flex snap-x gap-2 overflow-x-auto px-5">
              {store.photos.map((p, i) => (
                <StoreImage key={i} src={p} alt={`${store.name} ${i + 1}`} seed={i} className="h-44 w-60 shrink-0 snap-start rounded-2xl" />
              ))}
            </div>
            <div className="px-5 pb-6 pt-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-cocoa">
                    {store.category} · {store.area} · {store.distanceKm}km
                  </div>
                  <h3 className="font-serif text-2xl font-bold">{store.name}</h3>
                </div>
                <div className="rounded-2xl bg-wine px-3 py-2 text-center text-white">
                  <div className="text-lg font-bold leading-none">{score}%</div>
                  <div className="mt-0.5 text-[10px] text-white/75">취향 일치</div>
                </div>
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-espresso/85">{store.intro}</p>

              <Block title="맛 프로필">
                <TasteBars taste={store.taste} />
              </Block>
              <Block title="메뉴 · 향 · 분위기">
                <div className="flex flex-wrap gap-1.5">
                  {store.menuTypes.map((m) => (
                    <Chip key={m} tone="terra">
                      {m}
                    </Chip>
                  ))}
                  {[...store.aromas, ...store.moods].map((m) => (
                    <Chip key={m}>{m}</Chip>
                  ))}
                </div>
              </Block>
              <Block title="매장 정보">
                <dl className="space-y-1.5 text-[13px]">
                  <Row k="시그니처" v={store.signature || '-'} />
                  <Row k="영업시간" v={store.hours || '-'} />
                  <Row k="주소" v={store.address || '-'} />
                  <Row k="연락처" v="🔒 매칭 후 공개" />
                </dl>
              </Block>

              {canAct && (
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => onAction('nope')}>
                    ✕ 다음에요
                  </Button>
                  <Button onClick={() => onAction('like')}>♥ 좋아요</Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-5 rounded-2xl bg-white p-4 ring-1 ring-oat">
      <div className="mb-3 text-[13px] font-bold text-cocoa">{title}</div>
      {children}
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-16 shrink-0 text-cocoa">{k}</dt>
      <dd className="flex-1">{v}</dd>
    </div>
  )
}
