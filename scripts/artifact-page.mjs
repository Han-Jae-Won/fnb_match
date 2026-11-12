// Turns dist-artifact/index.html into the body-only page the Artifact host expects.
import { readFileSync, writeFileSync } from 'node:fs'
const html = readFileSync('dist-artifact/index.html', 'utf8')
const head = html.match(/<head>([\s\S]*?)<\/head>/)[1]
const body = html.match(/<body>([\s\S]*?)<\/body>/)[1]
const keep = head
  .split('\n')
  .filter((l) => /<title>|<script|<link rel="stylesheet"|<link rel="icon"|theme-color/.test(l))
  .join('\n')
const page0 = `<meta name="claude:viewport-fit-sides" content="cover">\n${keep}\n<style>html,body{background:#eadcc8}</style>\n${body}`
const page = page0.replace(/<title>[^<]*<\/title>/, '<title>취향잔 프로토타입</title>')
writeFileSync('dist-artifact/artifact.html', page)
console.log('wrote dist-artifact/artifact.html')
