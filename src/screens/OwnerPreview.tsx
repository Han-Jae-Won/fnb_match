import { motion } from 'framer-motion'
import { Navigate, useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import { TasteBars } from '../components/RangeSlider'
import { Button, Chip, StoreImage, TopBar } from '../components/ui'

export default function OwnerPreview() {
  const nav = useNavigate()
  const { myStore, user } = useApp()
  if (!myStore || myStore.draft) return <Navigate to="/owner/store" replace />

  return (
    <div className="flex h-full flex-col">
      <TopBar title="등록 완료" back={false} right={<button onClick={() => nav('/owner/store')} className="px-3 text-sm font-semibold text-terra">수정</button>} />
      <div className="flex-1 overflow-y-auto px-5 pb-4 no-scrollbar">
        <motion.div
          initial={{ y: 30, opacity: 0, rotate: -3 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="relative mx-auto aspect-[3/4] w-full overflow-hidden rounded-[28px] shadow-xl"
        >
          <StoreImage src={myStore.photos[0]} alt={myStore.name} className="absolute inset-0 size-full" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-5 pt-24 text-white">
            <div className="text-xs text-white/75">
              {myStore.category} · {myStore.area}
            </div>
            <div className="font-serif text-3xl font-bold">{myStore.name}</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[...myStore.aromas, ...myStore.moods].map((t) => (
                <Chip key={t} tone="glass">
                  {t}
                </Chip>
              ))}
            </div>
            <div className="mt-3">
              <TasteBars taste={myStore.taste} dark />
            </div>
          </div>
        </motion.div>

        <div className="mt-5 rounded-2xl bg-white p-4 ring-1 ring-oat">
          <div className="text-[15px] font-bold">🎉 매장이 매칭 카드로 등록됐어요</div>
          <p className="mt-1 text-[13px] leading-relaxed text-cocoa">
            취향이 맞는 손님의 스와이프 덱에 우선 노출됩니다. 손님이 ♥를 누르면 매칭 알림과 함께 채팅방이 열려요.
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {[
              ['예상 노출', '1,240명'],
              ['취향 일치 손님', '318명'],
              ['반경', '3km'],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-sand py-2.5">
                <div className="text-[15px] font-bold text-wine">{v}</div>
                <div className="text-[11px] text-cocoa">{k}</div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-cocoa/70">* 예상 수치는 프로토타입 시연용 더미 값입니다.</p>
        </div>
      </div>
      <div className="shrink-0 space-y-2 border-t border-oat/70 bg-cream px-5 py-4">
        <Button className="w-full" onClick={() => nav(user ? '/app/discover' : '/user/onboarding')}>
          손님 화면에서 내 카드 확인하기
        </Button>
        <Button variant="ghost" className="h-11 w-full" onClick={() => nav('/')}>
          처음으로
        </Button>
      </div>
    </div>
  )
}
