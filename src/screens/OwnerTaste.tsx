import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AROMAS, MENU_TYPES, MOODS } from '../data/keywords'
import type { Store } from '../data/stores'
import { useApp } from '../state/AppContext'
import { KeywordChips } from '../components/KeywordChips'
import { TasteRangeEditor } from '../components/RangeSlider'
import { Button, Section, StepBar, TopBar } from '../components/ui'

export default function OwnerTaste() {
  const nav = useNavigate()
  const { myStore, setMyStore } = useApp()
  const [s, setS] = useState<Store | null>(myStore)
  if (!s) return <Navigate to="/owner/store" replace />
  const set = <K extends keyof Store>(k: K, v: Store[K]) => setS((p) => (p ? { ...p, [k]: v } : p))

  const fillDemo = () =>
    setS({
      ...s,
      menuTypes: ['스페셜티 커피', '핸드드립', '티/차'],
      aromas: ['플로럴', '허브', '시트러스'],
      moods: ['자연친화', '감성적인', '조용한'],
      taste: { sweet: [20, 55], acidity: [50, 85], bitter: [10, 40], body: [15, 50], alcohol: [0, 5] },
    })

  const valid = s.menuTypes.length > 0 && s.aromas.length > 0 && s.moods.length > 0

  return (
    <div className="flex h-full flex-col">
      <TopBar title="매장 취향·특성" right={<button onClick={fillDemo} className="rounded-full bg-sand px-3 py-1.5 text-xs font-semibold text-cocoa">예시 채우기</button>} />
      <StepBar step={2} total={2} label="우리 가게가 추구하는 맛과 분위기" />
      <div className="flex-1 overflow-y-auto px-5 pt-4 no-scrollbar">
        <Section title="주로 다루는 메뉴" hint="최대 4개">
          <KeywordChips options={MENU_TYPES} value={s.menuTypes} onChange={(v) => set('menuTypes', v)} max={4} />
        </Section>
        <Section title="선호하는 맛의 범위" hint="양 끝 핸들을 움직여 우리 가게 메뉴의 맛 범위를 정해주세요">
          <TasteRangeEditor value={s.taste} onChange={(v) => set('taste', v)} />
        </Section>
        <Section title="대표 향" hint="최대 4개">
          <KeywordChips options={AROMAS} value={s.aromas} onChange={(v) => set('aromas', v)} max={4} />
        </Section>
        <Section title="추구하는 매장 이미지" hint="최대 4개">
          <KeywordChips options={MOODS} value={s.moods} onChange={(v) => set('moods', v)} max={4} />
        </Section>
      </div>
      <div className="shrink-0 border-t border-oat/70 bg-cream px-5 py-4">
        <Button
          className="w-full"
          disabled={!valid}
          onClick={() => {
            setMyStore({ ...s, draft: false })
            nav('/owner/preview')
          }}
        >
          등록 완료 · 내 매장 카드 보기
        </Button>
      </div>
    </div>
  )
}
