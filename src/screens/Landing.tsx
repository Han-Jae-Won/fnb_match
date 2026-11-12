import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { DUMMY_STORES } from '../data/stores'
import { useApp } from '../state/AppContext'
import { ConfirmButton, StoreImage } from '../components/ui'

export default function Landing() {
  const nav = useNavigate()
  const { user, myStore, resetAll } = useApp()
  const collage = [DUMMY_STORES[0], DUMMY_STORES[1], DUMMY_STORES[2], DUMMY_STORES[5]]

  return (
    <div className="flex h-full flex-col overflow-y-auto no-scrollbar">
      <div className="relative h-[46%] shrink-0 overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1.5 p-1.5">
          {collage.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="overflow-hidden rounded-2xl"
            >
              <StoreImage src={s.photos[0]} alt={s.name} seed={i} className="size-full" />
            </motion.div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cream/30 to-cream" />
      </div>

      <div className="relative z-10 -mt-10 flex flex-1 flex-col px-6 pb-8">
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="font-serif text-[44px] font-bold leading-none text-wine">취향잔</div>
          <p className="mt-3 text-[17px] font-semibold leading-snug">
            맛·향·분위기가 통하는
            <br />
            나만의 단골집을 스와이프로 만나보세요
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-cocoa">사장님은 매장의 취향을, 손님은 나의 취향을 등록하면 서로 잘 맞는 곳끼리 매칭해 드려요.</p>
        </motion.div>

        <div className="mt-6 space-y-3">
          <RoleCard
            emoji="🙋"
            title="취향 맞는 가게 찾기"
            desc={user ? `${user.nickname}님, 이어서 둘러보기` : '프로필·취향 입력 후 카드 스와이핑'}
            primary
            onClick={() => nav(user ? '/app/discover' : '/user/onboarding')}
          />
          <RoleCard
            emoji="🏪"
            title="사장님으로 시작하기"
            desc={myStore && !myStore.draft ? `${myStore.name} 정보 수정` : '매장 사진·정보와 추구하는 맛·향 등록'}
            onClick={() => nav('/owner/store')}
          />
        </div>

        <div className="mt-auto pt-6 text-center">
          <ConfirmButton
            label="데모 초기화"
            confirmLabel="한 번 더 누르면 모든 데모 데이터가 지워져요"
            onConfirm={resetAll}
            className="text-xs text-cocoa/70 underline underline-offset-2"
          />
        </div>
      </div>
    </div>
  )
}

function RoleCard({ emoji, title, desc, primary, onClick }: { emoji: string; title: string; desc: string; primary?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-3xl p-4 text-left transition active:scale-[0.98] ${
        primary ? 'bg-terra text-white shadow-[0_12px_24px_-12px_rgb(200_100_59/0.9)]' : 'bg-white ring-1 ring-oat'
      }`}
    >
      <span className={`grid size-12 shrink-0 place-items-center rounded-2xl text-2xl ${primary ? 'bg-white/20' : 'bg-sand'}`}>{emoji}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-bold">{title}</span>
        <span className={`mt-0.5 block truncate text-[13px] ${primary ? 'text-white/85' : 'text-cocoa'}`}>{desc}</span>
      </span>
      <span className="text-xl opacity-70">›</span>
    </button>
  )
}
