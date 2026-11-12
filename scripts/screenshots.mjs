// Captures every prototype screen as 390x844 @2x PNGs into ./screenshots.
// Usage: start the app (npm run dev, or npm run preview) then
//   node scripts/screenshots.mjs [baseUrl]
// Uses the locally installed Chrome (or Edge) via playwright-core.
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE = (process.argv[2] ?? 'http://localhost:5173/').replace(/\/?$/, '/') + '?shot'
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'screenshots')
mkdirSync(OUT, { recursive: true })

const errors = []
let browser
for (const channel of ['chrome', 'msedge']) {
  try {
    browser = await chromium.launch({ channel })
    break
  } catch {
    /* try next */
  }
}
if (!browser) throw new Error('Chrome or Edge not found')

const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'ko-KR' })
const page = await ctx.newPage()
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`))

const wait = (ms) => page.waitForTimeout(ms)
const go = async (hash) => {
  await page.goto(BASE + '#' + hash)
  await wait(400)
}
const imagesReady = () =>
  page.evaluate(() =>
    Promise.all([...document.images].map((i) => (i.complete ? 1 : new Promise((r) => ((i.onload = r), (i.onerror = r)))))),
  )
let n = 0
const shot = async (name) => {
  await imagesReady()
  await wait(700)
  const file = join(OUT, `${String(++n).padStart(2, '0')}_${name}.png`)
  await page.screenshot({ path: file })
  console.log('saved', file)
}
const click = (text) => page.getByRole('button', { name: text }).first().click()

// fresh state
await page.goto(BASE)
await page.evaluate(() => localStorage.clear())

await go('/')
await wait(800)
await shot('landing')

// ── Owner ──
await go('/owner/store')
await click('예시 채우기')
await shot('owner_store_info')
await click('다음 · 취향과 특성 설정')
await click('예시 채우기')
await shot('owner_taste_keywords')
await click('등록 완료 · 내 매장 카드 보기')
await wait(600)
await shot('owner_card_preview')

// ── User ──
await go('/user/onboarding')
await click('예시 채우기')
await shot('user_profile_basic')
await click('다음')
await wait(400)
await shot('user_taste_range')
await click('다음')
await wait(400)
await shot('user_aroma_mood')
await click('취향 매칭 시작하기 ✨')
await wait(800)
await shot('swipe_deck_my_store')

// pass on own store card, then show the next card mid-drag
await click('별로예요')
await wait(900)
const card = page.locator('.absolute.inset-0.select-none').last()
const box = await card.boundingBox()
const cx = box.x + box.width / 2
const cy = box.y + box.height / 2
await page.mouse.move(cx, cy)
await page.mouse.down()
for (let i = 1; i <= 10; i++) await page.mouse.move(cx + i * 10, cy - i * 1.5)
await shot('swipe_dragging_like')
for (let i = 11; i <= 30; i++) await page.mouse.move(cx + i * 10, cy - i * 1.5)
await page.mouse.up()
await wait(1500)
await shot('match_success')

// chat
await click('사장님과 대화 시작하기')
await wait(2800)
await click('추천 메뉴가 뭐예요?')
await wait(2600)
await click('연락처 교환')
await wait(3500)
await shot('chat_contact_exchange')

// detail sheet on the next card
await go('/app/discover')
await wait(600)
await page.getByRole('button', { name: '매장 상세 보기' }).last().click()
await wait(900)
await shot('store_detail_sheet')

// like a couple more so the match list looks alive
await page.mouse.click(195, 30) // tap backdrop to close the sheet
await wait(700)
await click('꼭 가볼래요')
await wait(1200)
await click('계속 둘러보기')
await wait(500)

await go('/app/matches')
await shot('match_list')
await go('/app/profile')
await shot('user_profile_summary')

// desktop presentation view (phone mockup + flow guide)
const desk = await browser.newContext({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 2, locale: 'ko-KR' })
const dp = await desk.newPage()
await dp.goto(BASE.replace('?shot', ''))
await dp.evaluate((s) => localStorage.setItem('chwihyang-demo-v1', s), await page.evaluate(() => localStorage.getItem('chwihyang-demo-v1')))
await dp.goto(BASE.replace('?shot', '') + '#/app/discover')
await dp.reload()
await dp.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? 1 : new Promise((r) => ((i.onload = r), (i.onerror = r)))))))
await dp.waitForTimeout(1200)
await dp.screenshot({ path: join(OUT, `${String(++n).padStart(2, '0')}_desktop_presentation.png`) })
console.log('saved desktop_presentation')

await browser.close()
if (errors.length) {
  console.log('\nBrowser errors:\n' + errors.join('\n'))
  process.exitCode = 1
} else console.log('\nNo browser errors.')
