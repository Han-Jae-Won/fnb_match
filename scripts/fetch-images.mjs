// Downloads every Unsplash photo referenced in src/data + OwnerStore into public/img (via local Chrome).
import { chromium } from 'playwright-core'
import { readFileSync, writeFileSync } from 'node:fs'
const src = readFileSync('src/data/stores.ts', 'utf8') + readFileSync('src/screens/OwnerStore.tsx', 'utf8')
const ids = [...new Set([...src.matchAll(/u\('([0-9a-f-]+)'\)/g)].map((m) => m[1]))]
let browser
for (const channel of ['chrome', 'msedge']) { try { browser = await chromium.launch({ channel }); break } catch {} }
const page = await browser.newPage()
await page.goto('https://images.unsplash.com/')
for (const id of ids) {
  const b64 = await page.evaluate(async (id) => {
    const r = await fetch(`https://images.unsplash.com/photo-${id}?auto=format&fm=jpg&fit=crop&w=900&q=70`)
    const buf = new Uint8Array(await r.arrayBuffer())
    let s = ''; for (const c of buf) s += String.fromCharCode(c)
    return btoa(s)
  }, id)
  writeFileSync(`public/img/${id}.jpg`, Buffer.from(b64, 'base64'))
  console.log(id, Math.round(b64.length * 0.75 / 1024) + 'KB')
}
await browser.close()
