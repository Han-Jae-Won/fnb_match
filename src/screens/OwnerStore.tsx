import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES, DEFAULT_TASTE } from '../data/keywords'
import { u, type Store } from '../data/stores'
import { useApp } from '../state/AppContext'
import { PhotoUploader } from '../components/PhotoUploader'
import { Button, Field, Section, StepBar, TopBar, inputCls } from '../components/ui'

const SAMPLE_PHOTOS = [u('1453614512568-c4024d13c247'), u('1554118811-1e0d58224f24')]

export function blankStore(): Store {
  return {
    id: 'mine',
    name: '',
    category: '카페',
    area: '성수',
    distanceKm: 0.3,
    address: '',
    hours: '',
    intro: '',
    photos: [],
    menuTypes: [],
    signature: '',
    taste: DEFAULT_TASTE,
    aromas: [],
    moods: [],
    ownerName: '',
    phone: '',
    instagram: '',
    isMine: true,
    draft: true,
  }
}

export default function OwnerStore() {
  const nav = useNavigate()
  const { myStore, setMyStore } = useApp()
  const [s, setS] = useState<Store>(myStore ?? blankStore())
  const set = <K extends keyof Store>(k: K, v: Store[K]) => setS((p) => ({ ...p, [k]: v }))

  const fillDemo = () =>
    setS((p) => ({
      ...p,
      name: '오후의 정원 카페',
      category: '카페',
      area: '성수',
      address: '서울 성동구 서울숲2길 18',
      hours: '매일 11:00 – 21:00',
      intro: '식물로 가득한 온실 같은 공간에서 직접 블렌딩한 허브티와 산미 있는 핸드드립을 내립니다.',
      signature: '라벤더 콜드브루',
      ownerName: '서하린',
      phone: '010-1234-5678',
      instagram: '@afternoon.garden',
      photos: p.photos.length ? p.photos : SAMPLE_PHOTOS,
    }))

  const valid = s.name.trim() && s.photos.length > 0

  return (
    <div className="flex h-full flex-col">
      <TopBar title="매장 등록" right={<button onClick={fillDemo} className="rounded-full bg-sand px-3 py-1.5 text-xs font-semibold text-cocoa">예시 채우기</button>} />
      <StepBar step={1} total={2} label="매장 기본 정보" />
      <div className="flex-1 overflow-y-auto px-5 pt-4 no-scrollbar">
        <Section title="매장 사진" hint="첫 번째 사진이 카드 대표 이미지로 노출돼요 (최대 5장)">
          <PhotoUploader value={s.photos} onChange={(v) => set('photos', v)} samples={SAMPLE_PHOTOS} />
        </Section>

        <Section title="기본 정보">
          <Field label="매장 이름 *">
            <input className={inputCls} placeholder="예) 온도 커피랩" value={s.name} onChange={(e) => set('name', e.target.value)} />
          </Field>
          <Field label="업종">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set('category', c)}
                  className={`rounded-xl px-4 py-2.5 text-[14px] font-medium ring-1 transition ${s.category === c ? 'bg-espresso text-cream ring-espresso' : 'bg-white ring-oat'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Field>
          <Field label="주소">
            <input className={inputCls} placeholder="도로명 주소" value={s.address} onChange={(e) => set('address', e.target.value)} />
          </Field>
          <Field label="영업 시간">
            <input className={inputCls} placeholder="예) 매일 10:00 – 21:00" value={s.hours} onChange={(e) => set('hours', e.target.value)} />
          </Field>
          <Field label="시그니처 메뉴">
            <input className={inputCls} placeholder="예) 예가체프 핸드드립" value={s.signature} onChange={(e) => set('signature', e.target.value)} />
          </Field>
          <Field label="매장 소개">
            <textarea
              className={`${inputCls} min-h-24 resize-none`}
              maxLength={120}
              placeholder="손님에게 보여줄 한두 줄 소개"
              value={s.intro}
              onChange={(e) => set('intro', e.target.value)}
            />
          </Field>
        </Section>

        <Section title="사장님 연락처" hint="매칭된 손님과 연락처 교환 시에만 공개돼요">
          <div className="grid grid-cols-2 gap-2">
            <input className={inputCls} placeholder="사장님 성함" value={s.ownerName} onChange={(e) => set('ownerName', e.target.value)} />
            <input className={inputCls} placeholder="전화번호" value={s.phone} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <input className={`${inputCls} mt-2`} placeholder="인스타그램 @계정" value={s.instagram} onChange={(e) => set('instagram', e.target.value)} />
        </Section>
      </div>
      <div className="shrink-0 border-t border-oat/70 bg-cream px-5 py-4">
        <Button
          className="w-full"
          disabled={!valid}
          onClick={() => {
            setMyStore({ ...s, area: s.address.match(/(성수|연남|망원|을지로|한남|서촌|문래)/)?.[0] ?? s.area })
            nav('/owner/taste')
          }}
        >
          다음 · 취향과 특성 설정
        </Button>
      </div>
    </div>
  )
}
