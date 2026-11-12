import { Navigate, useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import { TasteBars } from '../components/RangeSlider'
import { Button, Chip, ConfirmButton } from '../components/ui'

export default function Profile() {
  const nav = useNavigate()
  const { user, matches, pending, swiped, myStore, resetSwipes, resetAll } = useApp()
  if (!user) return <Navigate to="/user/onboarding" replace />

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 shrink-0 items-center px-5">
        <h1 className="text-[20px] font-bold">내 프로필</h1>
      </header>
      <div className="flex-1 overflow-y-auto px-5 pb-6 no-scrollbar">
        <div className="flex items-center gap-4 rounded-3xl bg-white p-5 ring-1 ring-oat">
          <div className="grid size-16 place-items-center rounded-full bg-sand text-3xl">🙋</div>
          <div className="flex-1">
            <div className="text-[18px] font-bold">{user.nickname}</div>
            <div className="text-[13px] text-cocoa">
              {user.ageGroup} · {user.region} {user.instagram && `· ${user.instagram}`}
            </div>
          </div>
          <button onClick={() => nav('/user/onboarding')} className="rounded-full bg-sand px-3 py-1.5 text-xs font-semibold">
            수정
          </button>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[
            ['둘러본 가게', Object.keys(swiped).length],
            ['매칭', matches.length],
            ['응답 대기', pending.length],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-white py-3 ring-1 ring-oat">
              <div className="text-[20px] font-bold text-wine">{v}</div>
              <div className="text-[11px] text-cocoa">{k}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-3xl bg-white p-5 ring-1 ring-oat">
          <div className="mb-3 text-[13px] font-bold text-cocoa">나의 맛 취향</div>
          <TasteBars taste={user.taste} />
          <div className="mb-2 mt-5 text-[13px] font-bold text-cocoa">향 · 분위기 · 메뉴</div>
          <div className="flex flex-wrap gap-1.5">
            {user.aromas.map((a) => (
              <Chip key={a} tone="terra">
                {a}
              </Chip>
            ))}
            {[...user.moods, ...user.menuTypes].map((a) => (
              <Chip key={a}>{a}</Chip>
            ))}
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <Button variant="dark" className="w-full" onClick={() => nav(myStore && !myStore.draft ? '/owner/preview' : '/owner/store')}>
            🏪 사장님 모드로 전환
          </Button>
          <Button variant="outline" className="w-full" onClick={resetSwipes}>
            스와이프 기록 초기화
          </Button>
          <ConfirmButton
            label="데모 전체 초기화"
            confirmLabel="한 번 더 누르면 모든 데모 데이터가 지워져요"
            onConfirm={() => {
              resetAll()
              nav('/')
            }}
            className="h-11 w-full text-[13px] text-cocoa underline underline-offset-2"
          />
        </div>
      </div>
    </div>
  )
}
