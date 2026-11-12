import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useApp } from '../state/AppContext'

const FLOW = [
  { to: '/', label: '① 시작 · 역할 선택' },
  { to: '/owner/store', label: '② 사장님 · 매장 등록' },
  { to: '/owner/taste', label: '③ 사장님 · 취향·특성 설정' },
  { to: '/user/onboarding', label: '④ 사용자 · 프로필·취향' },
  { to: '/app/discover', label: '⑤ 카드 스와이핑' },
  { to: '/app/matches', label: '⑥ 매칭 목록' },
]

/** Desktop: phone mockup + flow guide. Mobile (or ?shot): full-screen app. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  const { matches } = useApp()
  const flow = [...FLOW, { to: matches[0] ? `/app/chat/${matches[0]}` : '/app/matches', label: '⑦ 채팅 · 연락처 교환' }]
  const shot = new URLSearchParams(window.location.search).has('shot')
  if (shot) {
    return <div className="relative h-full w-full overflow-hidden bg-cream">{children}</div>
  }
  return (
    <div className="flex min-h-full items-center justify-center gap-14 sm:p-6">
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="font-serif text-4xl font-bold text-wine">취향잔</div>
        <p className="mt-2 text-[15px] leading-relaxed text-cocoa">
          맛·향·분위기 취향으로 나와 맞는
          <br />
          카페·바를 스와이프로 찾는 매칭 서비스
        </p>
        <div className="mt-8 text-xs font-bold tracking-widest text-cocoa/70">프로토타입 화면 흐름</div>
        <nav className="mt-3 space-y-1">
          {flow.map((f) => (
            <NavLink
              key={f.label}
              to={f.to}
              end
              className={({ isActive }) =>
                `block rounded-xl px-3 py-2 text-[14px] font-medium transition ${isActive ? 'bg-white text-terra-dark shadow-sm' : 'text-espresso/80 hover:bg-white/50'}`
              }
            >
              {f.label}
            </NavLink>
          ))}
        </nav>
        <p className="mt-8 text-xs leading-relaxed text-cocoa/70">
          ※ 정부지원사업 증빙용 프론트엔드 프로토타입입니다.
          <br />
          모든 매장·대화 데이터는 더미이며 브라우저에만 저장됩니다.
        </p>
      </aside>

      <div className="relative h-dvh w-full overflow-hidden bg-cream sm:h-[844px] sm:w-[390px] sm:rounded-[48px] sm:shadow-[0_40px_80px_-30px_rgb(43_29_22/0.55),0_0_0_10px_#2b1d16,0_0_0_12px_#5a463a]">
        {children}
      </div>
    </div>
  )
}
