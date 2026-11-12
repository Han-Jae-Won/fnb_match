import { useNavigate } from 'react-router-dom'
import { matchScore } from '../lib/match'
import { useApp } from '../state/AppContext'
import { Button, StoreImage } from '../components/ui'

export default function Matches() {
  const nav = useNavigate()
  const { matches, pending, chats, storeById, user } = useApp()
  const matched = matches.map(storeById).filter(Boolean) as NonNullable<ReturnType<typeof storeById>>[]
  const waiting = pending.map(storeById).filter(Boolean) as typeof matched

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 shrink-0 items-center px-5">
        <h1 className="text-[20px] font-bold">매칭</h1>
        <span className="ml-2 rounded-full bg-terra px-2 py-0.5 text-xs font-bold text-white">{matched.length}</span>
      </header>
      <div className="flex-1 overflow-y-auto pb-4 no-scrollbar">
        {matched.length === 0 ? (
          <div className="mx-5 mt-10 rounded-3xl bg-white p-8 text-center ring-1 ring-oat">
            <div className="text-5xl">💌</div>
            <p className="mt-3 font-bold">아직 매칭된 가게가 없어요</p>
            <p className="mt-1 text-[13px] text-cocoa">카드를 오른쪽으로 넘겨 좋아요를 보내보세요</p>
            <Button className="mt-5 h-11" onClick={() => nav('/app/discover')}>
              둘러보러 가기
            </Button>
          </div>
        ) : (
          <>
            <div className="px-5 text-[13px] font-bold text-cocoa">새로운 매칭</div>
            <div className="no-scrollbar mt-2 flex gap-3 overflow-x-auto px-5 pb-2">
              {matched.map((s) => (
                <button key={s.id} onClick={() => nav(`/app/chat/${s.id}`)} className="w-[76px] shrink-0 text-center">
                  <div className="relative">
                    <StoreImage src={s.photos[0]} alt={s.name} className="aspect-[3/4] w-full rounded-2xl ring-2 ring-terra ring-offset-2 ring-offset-cream" />
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full bg-wine px-1.5 text-[10px] font-bold text-white">
                      {matchScore(user, s).score}%
                    </span>
                  </div>
                  <div className="mt-2.5 truncate text-[12px] font-semibold">{s.name}</div>
                </button>
              ))}
            </div>

            <div className="mt-4 px-5 text-[13px] font-bold text-cocoa">대화</div>
            <ul className="mt-1">
              {matched.map((s) => {
                const msgs = (chats[s.id] ?? []).filter((m) => m.from !== 'system')
                const last = msgs[msgs.length - 1]
                const preview = !last ? '대화를 시작해 보세요' : last.kind === 'contact' ? '📇 연락처를 공유했어요' : last.text
                return (
                  <li key={s.id}>
                    <button onClick={() => nav(`/app/chat/${s.id}`)} className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-sand/60">
                      <StoreImage src={s.photos[0]} alt={s.name} className="size-14 shrink-0 rounded-full" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-[15px] font-bold">{s.name}</span>
                          <span className="text-[11px] text-cocoa">{s.category}</span>
                        </div>
                        <div className={`truncate text-[13px] ${last?.from === 'store' ? 'font-semibold text-espresso' : 'text-cocoa'}`}>{preview}</div>
                      </div>
                      {last?.from === 'store' && <span className="size-2.5 rounded-full bg-terra" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          </>
        )}

        {waiting.length > 0 && (
          <>
            <div className="mt-5 px-5 text-[13px] font-bold text-cocoa">사장님 응답 대기 중 · {waiting.length}</div>
            <div className="mt-2 grid grid-cols-4 gap-2 px-5">
              {waiting.map((s) => (
                <div key={s.id} className="text-center opacity-80">
                  <StoreImage src={s.photos[0]} alt={s.name} className="aspect-square w-full rounded-2xl blur-[1.5px] grayscale-[40%]" />
                  <div className="mt-1 truncate text-[11px]">{s.name}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
