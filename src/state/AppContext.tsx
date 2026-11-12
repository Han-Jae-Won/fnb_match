import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { DUMMY_STORES, AUTO_REPLIES, GENERIC_REPLIES, type Store } from '../data/stores'
import type { TasteRange } from '../data/keywords'
import { matchScore, INSTANT_MATCH_THRESHOLD } from '../lib/match'

export interface UserProfile {
  nickname: string
  ageGroup: string
  region: string
  instagram: string
  menuTypes: string[]
  aromas: string[]
  moods: string[]
  taste: TasteRange
}

export type SwipeDir = 'like' | 'nope' | 'super'

export interface ChatMessage {
  id: string
  from: 'me' | 'store' | 'system'
  text: string
  at: number
  kind?: 'text' | 'contact'
}

interface State {
  user: UserProfile | null
  myStore: Store | null
  swiped: Record<string, SwipeDir>
  matches: string[]
  pending: string[]
  chats: Record<string, ChatMessage[]>
  contactShared: Record<string, boolean>
  typing: Record<string, boolean>
}

const EMPTY: State = {
  user: null,
  myStore: null,
  swiped: {},
  matches: [],
  pending: [],
  chats: {},
  contactShared: {},
  typing: {},
}

type Action =
  | { type: 'setUser'; user: UserProfile }
  | { type: 'setMyStore'; store: Store }
  | { type: 'swipe'; id: string; dir: SwipeDir; matched: boolean }
  | { type: 'push'; id: string; msg: ChatMessage }
  | { type: 'typing'; id: string; on: boolean }
  | { type: 'shareContact'; id: string }
  | { type: 'resetSwipes' }
  | { type: 'reset' }

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'setUser':
      return { ...s, user: a.user }
    case 'setMyStore':
      return { ...s, myStore: a.store }
    case 'swipe': {
      const swiped = { ...s.swiped, [a.id]: a.dir }
      if (a.dir === 'nope') return { ...s, swiped }
      if (a.matched) return { ...s, swiped, matches: [a.id, ...s.matches.filter((x) => x !== a.id)] }
      return { ...s, swiped, pending: [a.id, ...s.pending] }
    }
    case 'push':
      return { ...s, chats: { ...s.chats, [a.id]: [...(s.chats[a.id] ?? []), a.msg] } }
    case 'typing':
      return { ...s, typing: { ...s.typing, [a.id]: a.on } }
    case 'shareContact':
      return { ...s, contactShared: { ...s.contactShared, [a.id]: true } }
    case 'resetSwipes':
      return { ...s, swiped: {}, matches: [], pending: [], chats: {}, contactShared: {} }
    case 'reset':
      return EMPTY
  }
}

const KEY = 'chwihyang-demo-v1'

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...EMPTY, ...JSON.parse(raw), typing: {} }
  } catch {
    /* ignore */
  }
  return EMPTY
}

const uid = () => Math.random().toString(36).slice(2, 10)

interface Ctx extends State {
  stores: Store[]
  storeById: (id: string) => Store | undefined
  setUser: (u: UserProfile) => void
  setMyStore: (s: Store) => void
  swipe: (id: string, dir: SwipeDir) => boolean
  sendMessage: (id: string, text: string) => void
  shareContact: (id: string) => void
  resetSwipes: () => void
  resetAll: () => void
}

const AppCtx = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      const { typing: _t, ...persist } = state
      localStorage.setItem(KEY, JSON.stringify(persist))
    } catch {
      /* quota or private mode — demo still works in memory */
    }
  }, [state])

  const stores = useMemo(() => {
    return state.myStore && !state.myStore.draft ? [state.myStore, ...DUMMY_STORES] : DUMMY_STORES
  }, [state.myStore])

  const storeById = useCallback((id: string) => stores.find((s) => s.id === id), [stores])

  const ownerReply = useCallback(
    (id: string, text: string, delay = 1400) => {
      dispatch({ type: 'typing', id, on: true })
      setTimeout(() => {
        dispatch({ type: 'typing', id, on: false })
        dispatch({ type: 'push', id, msg: { id: uid(), from: 'store', text, at: Date.now() } })
      }, delay)
    },
    [],
  )

  const swipe = useCallback(
    (id: string, dir: SwipeDir) => {
      const store = stores.find((s) => s.id === id)
      if (!store) return false
      const { score } = matchScore(state.user, store)
      const matched = dir === 'super' || (dir === 'like' && score >= INSTANT_MATCH_THRESHOLD)
      dispatch({ type: 'swipe', id, dir, matched })
      if (matched) {
        dispatch({
          type: 'push',
          id,
          msg: { id: uid(), from: 'system', text: `${store.name}와(과) 취향이 통했어요 · 취향 일치 ${score}%`, at: Date.now() },
        })
        const nick = state.user?.nickname ?? '고객'
        ownerReply(id, `안녕하세요 ${nick}님! ${store.name} 사장 ${store.ownerName}입니다 🙌 저희 가게 좋아해 주셔서 감사해요. 궁금한 거 있으면 편하게 물어봐 주세요!`, 2200)
      }
      return matched
    },
    [stores, state.user, ownerReply],
  )

  const sendMessage = useCallback(
    (id: string, text: string) => {
      const store = stores.find((s) => s.id === id)
      if (!store || !text.trim()) return
      dispatch({ type: 'push', id, msg: { id: uid(), from: 'me', text: text.trim(), at: Date.now() } })
      const rule = AUTO_REPLIES.find((r) => r.match.test(text))
      const reply = rule ? rule.reply(store) : GENERIC_REPLIES[Math.floor(Math.random() * GENERIC_REPLIES.length)]
      ownerReply(id, reply, 1100 + Math.random() * 900)
    },
    [stores, ownerReply],
  )

  const shareContact = useCallback(
    (id: string) => {
      const store = stores.find((s) => s.id === id)
      if (!store) return
      dispatch({ type: 'shareContact', id })
      dispatch({ type: 'push', id, msg: { id: uid(), from: 'me', text: 'contact', kind: 'contact', at: Date.now() } })
      setTimeout(() => {
        dispatch({ type: 'push', id, msg: { id: uid(), from: 'store', text: 'contact', kind: 'contact', at: Date.now() } })
        ownerReply(id, '연락처 남겨드렸어요! 방문 전에 연락 주시면 자리 맡아둘게요 📞', 1200)
      }, 900)
    },
    [stores, ownerReply],
  )

  const value: Ctx = {
    ...state,
    stores,
    storeById,
    setUser: (user) => dispatch({ type: 'setUser', user }),
    setMyStore: (store) => dispatch({ type: 'setMyStore', store }),
    swipe,
    sendMessage,
    shareContact,
    resetSwipes: () => dispatch({ type: 'resetSwipes' }),
    resetAll: () => dispatch({ type: 'reset' }),
  }

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

export function useApp() {
  const c = useContext(AppCtx)
  if (!c) throw new Error('useApp outside provider')
  return c
}
