import { AnimatePresence, motion } from 'framer-motion'
import type { Store } from '../data/stores'
import { Button, StoreImage } from './ui'

export function MatchModal({
  store,
  score,
  nickname,
  onChat,
  onClose,
}: {
  store: Store | null
  score: number
  nickname: string
  onChat: () => void
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {store && (
        <motion.div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-wine/95 to-espresso/95 px-8 text-center text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {Array.from({ length: 14 }, (_, i) => (
            <span
              key={i}
              className="heart-particle pointer-events-none absolute bottom-0 text-2xl"
              style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 7) * 0.35}s`, color: i % 2 ? '#f3a77f' : '#ffffff' }}
            >
              ♥
            </span>
          ))}

          <motion.p initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-sm font-medium tracking-[0.3em] text-white/70">
            IT&apos;S A MATCH
          </motion.p>
          <motion.h2
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.15 }}
            className="mt-2 font-serif text-[40px] font-bold leading-tight"
          >
            취향이
            <br />
            통했어요!
          </motion.h2>

          <div className="relative mt-8 flex items-center">
            <motion.div
              initial={{ x: -60, rotate: -20, opacity: 0 }}
              animate={{ x: 12, rotate: -8, opacity: 1 }}
              transition={{ type: 'spring', delay: 0.25 }}
              className="grid size-28 place-items-center rounded-3xl bg-cream text-5xl shadow-xl ring-4 ring-white"
            >
              🙋
            </motion.div>
            <motion.div
              initial={{ x: 60, rotate: 20, opacity: 0 }}
              animate={{ x: -12, rotate: 8, opacity: 1 }}
              transition={{ type: 'spring', delay: 0.3 }}
              className="size-28 overflow-hidden rounded-3xl shadow-xl ring-4 ring-white"
            >
              <StoreImage src={store.photos[0]} alt={store.name} className="size-full" />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.5 }}
              className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-terra text-xl shadow-lg ring-4 ring-white"
            >
              ♥
            </motion.div>
          </div>

          <p className="mt-6 text-[15px] leading-relaxed text-white/85">
            <b className="text-white">{nickname}</b>님과 <b className="text-white">{store.name}</b>의
            <br />
            취향 일치도는 <b className="text-[#f3a77f]">{score}%</b> 예요
          </p>

          <div className="mt-8 w-full space-y-2.5">
            <Button className="w-full" onClick={onChat}>
              💬 사장님과 대화 시작하기
            </Button>
            <button onClick={onClose} className="h-12 w-full rounded-2xl text-[15px] font-semibold text-white/80 hover:bg-white/10">
              계속 둘러보기
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
