import { HashRouter, MemoryRouter, NavLink, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AppProvider, useApp } from './state/AppContext'
import { PhoneFrame } from './components/PhoneFrame'
import Landing from './screens/Landing'
import OwnerStore from './screens/OwnerStore'
import OwnerTaste from './screens/OwnerTaste'
import OwnerPreview from './screens/OwnerPreview'
import UserOnboarding from './screens/UserOnboarding'
import Discover from './screens/Discover'
import Matches from './screens/Matches'
import Chat from './screens/Chat'
import Profile from './screens/Profile'

// Artifact viewers only pass plain #name hashes, so that build keeps routes in memory.
const Router = import.meta.env.MODE === 'artifact' ? MemoryRouter : HashRouter

function TabLayout() {
  const { matches, chats } = useApp()
  const unread = matches.filter((id) => {
    const m = chats[id] ?? []
    return m[m.length - 1]?.from === 'store'
  }).length
  const tabs = [
    { to: '/app/discover', icon: '🃏', label: '탐색' },
    { to: '/app/matches', icon: '💬', label: '매칭', badge: unread },
    { to: '/app/profile', icon: '🙋', label: '프로필' },
  ]
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <Outlet />
      </div>
      <nav className="flex h-16 shrink-0 border-t border-oat/70 bg-cream pb-1">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) => `relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${isActive ? 'text-terra' : 'text-cocoa/60'}`}
          >
            {({ isActive }) => (
              <>
                <span className={`text-xl transition ${isActive ? '' : 'grayscale opacity-60'}`}>{t.icon}</span>
                {t.label}
                {!!t.badge && <span className="absolute right-[30%] top-2 grid size-4 place-items-center rounded-full bg-terra text-[10px] text-white">{t.badge}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <PhoneFrame>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/owner/store" element={<OwnerStore />} />
            <Route path="/owner/taste" element={<OwnerTaste />} />
            <Route path="/owner/preview" element={<OwnerPreview />} />
            <Route path="/user/onboarding" element={<UserOnboarding />} />
            <Route path="/app" element={<TabLayout />}>
              <Route path="discover" element={<Discover />} />
              <Route path="matches" element={<Matches />} />
              <Route path="profile" element={<Profile />} />
              <Route index element={<Navigate to="discover" replace />} />
            </Route>
            <Route path="/app/chat/:id" element={<Chat />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PhoneFrame>
      </Router>
    </AppProvider>
  )
}
