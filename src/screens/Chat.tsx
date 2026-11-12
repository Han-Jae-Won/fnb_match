import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import type { Store } from '../data/stores'
import { useApp, type ChatMessage, type UserProfile } from '../state/AppContext'
import { StoreImage, TopBar } from '../components/ui'

const QUICK = ['예약 가능한가요?', '추천 메뉴가 뭐예요?', '영업시간 알려주세요', '주차 되나요?']

export default function Chat() {
  const { id = '' } = useParams()
  const { storeById, chats, matches, typing, sendMessage, shareContact, contactShared, user } = useApp()
  const store = storeById(id)
  const [text, setText] = useState('')
  const list = useRef<HTMLDivElement>(null)
  const msgs = chats[id] ?? []

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: 'smooth' })
  }, [msgs.length, typing[id]])

  if (!store || !user) return <Navigate to="/app/matches" replace />
  if (!matches.includes(id)) return <Navigate to="/app/matches" replace />

  const submit = (t: string) => {
    if (!t.trim()) return
    sendMessage(id, t)
    setText('')
  }

  return (
    <div className="flex h-full flex-col bg-cream">
      <TopBar
        title={store.name}
        right={
          <button
            disabled={contactShared[id]}
            onClick={() => shareContact(id)}
            className="rounded-full bg-terra px-3 py-1.5 text-xs font-bold text-white disabled:bg-oat disabled:text-cocoa"
          >
            {contactShared[id] ? '연락처 교환 완료' : '📇 연락처 교환'}
          </button>
        }
      />
      <div ref={list} className="flex-1 space-y-2.5 overflow-y-auto px-4 pb-3 pt-1 no-scrollbar">
        <div className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-full bg-white py-1 pl-1 pr-3 text-[12px] text-cocoa ring-1 ring-oat">
          <StoreImage src={store.photos[0]} alt="" className="size-6 rounded-full" />
          {store.category} · {store.area} · 사장 {store.ownerName}
        </div>
        <AnimatePresence initial={false}>
          {msgs.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Bubble m={m} store={store} user={user} />
            </motion.div>
          ))}
        </AnimatePresence>
        {typing[id] && (
          <div className="flex items-end gap-2">
            <StoreImage src={store.photos[0]} alt="" className="size-8 rounded-full" />
            <div className="flex gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 ring-1 ring-oat">
              {[0, 1, 2].map((i) => (
                <span key={i} className="typing-dot size-1.5 rounded-full bg-cocoa" />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="no-scrollbar flex shrink-0 gap-2 overflow-x-auto px-4 pb-2">
        {QUICK.map((q) => (
          <button key={q} onClick={() => submit(q)} className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[12px] font-medium text-cocoa ring-1 ring-oat hover:ring-terra">
            {q}
          </button>
        ))}
      </div>
      <form
        className="flex shrink-0 items-center gap-2 border-t border-oat/70 bg-white px-3 py-3"
        onSubmit={(e) => {
          e.preventDefault()
          submit(text)
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="메시지 보내기"
          className="h-11 flex-1 rounded-full bg-sand px-4 text-[15px] outline-none placeholder:text-cocoa/60"
        />
        <button type="submit" disabled={!text.trim()} aria-label="보내기" className="grid size-11 place-items-center rounded-full bg-terra text-lg text-white disabled:opacity-40">
          ↑
        </button>
      </form>
    </div>
  )
}

function Bubble({ m, store, user }: { m: ChatMessage; store: Store; user: UserProfile }) {
  if (m.from === 'system') {
    return (
      <div className="mx-auto w-fit rounded-full bg-wine/10 px-3 py-1.5 text-center text-[12px] font-medium text-wine">💞 {m.text}</div>
    )
  }
  const mine = m.from === 'me'
  const time = new Date(m.at).toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' })
  const body =
    m.kind === 'contact' ? (
      <ContactCard mine={mine} store={store} user={user} />
    ) : (
      <div className={`max-w-[75%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${mine ? 'rounded-br-md bg-terra text-white' : 'rounded-bl-md bg-white ring-1 ring-oat'}`}>
        {m.text}
      </div>
    )
  return (
    <div className={`flex items-end gap-2 ${mine ? 'flex-row-reverse' : ''}`}>
      {!mine && <StoreImage src={store.photos[0]} alt="" className="size-8 shrink-0 rounded-full" />}
      {body}
      <span className="shrink-0 pb-0.5 text-[10px] text-cocoa/70">{time}</span>
    </div>
  )
}

function ContactCard({ mine, store, user }: { mine: boolean; store: Store; user: UserProfile }) {
  const rows = mine
    ? [
        ['이름', user.nickname],
        ['인스타그램', user.instagram || '@' + user.nickname],
        ['연령대', user.ageGroup],
      ]
    : [
        ['사장님', store.ownerName || '사장님'],
        ['전화', store.phone || '-'],
        ['인스타그램', store.instagram || '-'],
        ['주소', store.address || '-'],
      ]
  return (
    <div className={`w-56 overflow-hidden rounded-2xl ring-1 ${mine ? 'bg-espresso text-cream ring-espresso' : 'bg-white ring-oat'}`}>
      <div className={`px-4 py-2.5 text-[12px] font-bold ${mine ? 'bg-white/10' : 'bg-sand text-wine'}`}>📇 {mine ? '내 연락처' : `${store.name} 연락처`}</div>
      <dl className="space-y-1 px-4 py-3 text-[12px]">
        {rows.map(([k, v]) => (
          <div key={k} className="flex gap-2">
            <dt className={`w-16 shrink-0 ${mine ? 'text-cream/60' : 'text-cocoa'}`}>{k}</dt>
            <dd className="flex-1 break-all font-medium">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
