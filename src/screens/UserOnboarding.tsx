import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AGE_GROUPS, AROMAS, DEFAULT_TASTE, MENU_TYPES, MOODS, REGIONS } from '../data/keywords'
import { useApp, type UserProfile } from '../state/AppContext'
import { KeywordChips } from '../components/KeywordChips'
import { TasteRangeEditor } from '../components/RangeSlider'
import { Button, Field, Section, StepBar, TopBar, inputCls } from '../components/ui'

const EMPTY_USER: UserProfile = {
  nickname: '',
  ageGroup: '20대 후반',
  region: '성수',
  instagram: '',
  menuTypes: [],
  aromas: [],
  moods: [],
  taste: DEFAULT_TASTE,
}

const SAMPLE: Partial<UserProfile> = {
  nickname: '라떼러버',
  instagram: '@latte.lover',
  menuTypes: ['스페셜티 커피', '핸드드립', '내추럴 와인', '디저트'],
  aromas: ['플로럴', '시트러스', '베리'],
  moods: ['감성적인', '조용한', '대화하기 좋은'],
  taste: { sweet: [20, 55], acidity: [50, 90], bitter: [10, 45], body: [15, 55], alcohol: [0, 50] },
}

const STEPS = ['기본 프로필', '좋아하는 메뉴와 맛', '향과 분위기']

export default function UserOnboarding() {
  const nav = useNavigate()
  const { user, setUser } = useApp()
  const [u, setU] = useState<UserProfile>(user ?? EMPTY_USER)
  const [step, setStep] = useState(0)
  const set = <K extends keyof UserProfile>(k: K, v: UserProfile[K]) => setU((p) => ({ ...p, [k]: v }))

  const canNext = [u.nickname.trim().length > 0, u.menuTypes.length > 0, u.aromas.length > 0 && u.moods.length > 0][step]

  const next = () => {
    if (step < 2) setStep(step + 1)
    else {
      setUser(u)
      nav('/app/discover', { replace: true })
    }
  }

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="내 취향 프로필"
        right={
          <button onClick={() => setU((p) => ({ ...p, ...SAMPLE }))} className="rounded-full bg-sand px-3 py-1.5 text-xs font-semibold text-cocoa">
            예시 채우기
          </button>
        }
      />
      <StepBar step={step + 1} total={3} label={STEPS[step]} />
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 overflow-y-auto px-5 pt-4 no-scrollbar"
          >
            {step === 0 && (
              <>
                <div className="mb-6 flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-oat">
                  <div className="grid size-16 place-items-center rounded-full bg-sand text-3xl">🙋</div>
                  <div className="text-[13px] leading-relaxed text-cocoa">
                    취향을 알려주시면
                    <br />
                    <b className="text-espresso">딱 맞는 카페·바</b>를 카드로 추천해 드려요.
                  </div>
                </div>
                <Field label="닉네임 *">
                  <input className={inputCls} placeholder="매장 사장님에게 보여질 이름" value={u.nickname} onChange={(e) => set('nickname', e.target.value)} />
                </Field>
                <Field label="연령대">
                  <div className="flex flex-wrap gap-2">
                    {AGE_GROUPS.map((a) => (
                      <Pill key={a} on={u.ageGroup === a} onClick={() => set('ageGroup', a)}>
                        {a}
                      </Pill>
                    ))}
                  </div>
                </Field>
                <Field label="주로 다니는 동네">
                  <div className="flex flex-wrap gap-2">
                    {REGIONS.map((r) => (
                      <Pill key={r} on={u.region === r} onClick={() => set('region', r)}>
                        {r}
                      </Pill>
                    ))}
                  </div>
                </Field>
                <Field label="인스타그램 (선택 · 매칭 후 연락처 교환 시 공개)">
                  <input className={inputCls} placeholder="@my.account" value={u.instagram} onChange={(e) => set('instagram', e.target.value)} />
                </Field>
              </>
            )}
            {step === 1 && (
              <>
                <Section title="자주 찾는 메뉴" hint="최대 5개">
                  <KeywordChips options={MENU_TYPES} value={u.menuTypes} onChange={(v) => set('menuTypes', v)} max={5} />
                </Section>
                <Section title="내가 좋아하는 맛의 범위" hint="범위가 겹치는 매장일수록 일치도가 올라가요">
                  <TasteRangeEditor value={u.taste} onChange={(v) => set('taste', v)} />
                </Section>
              </>
            )}
            {step === 2 && (
              <>
                <Section title="끌리는 향" hint="최대 4개">
                  <KeywordChips options={AROMAS} value={u.aromas} onChange={(v) => set('aromas', v)} max={4} />
                </Section>
                <Section title="좋아하는 매장 분위기" hint="최대 4개">
                  <KeywordChips options={MOODS} value={u.moods} onChange={(v) => set('moods', v)} max={4} />
                </Section>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex shrink-0 gap-2 border-t border-oat/70 bg-cream px-5 py-4">
        {step > 0 && (
          <Button variant="outline" className="w-24" onClick={() => setStep(step - 1)}>
            이전
          </Button>
        )}
        <Button className="flex-1" disabled={!canNext} onClick={next}>
          {step < 2 ? '다음' : '취향 매칭 시작하기 ✨'}
        </Button>
      </div>
    </div>
  )
}

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-3.5 py-2.5 text-[14px] font-medium ring-1 transition ${on ? 'bg-espresso text-cream ring-espresso' : 'bg-white ring-oat'}`}
    >
      {children}
    </button>
  )
}
