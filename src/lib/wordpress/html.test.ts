// Run: npm test
import assert from 'node:assert/strict'
import {htmlToSections, mapCategory} from './html.ts'

const s = htmlToSections(`<div class="wrap"><h2>Why Geelong &amp; Surf Coast?</h2>
<p>Prices rose <strong>5%</strong>&nbsp;this year.</p><figure><img src="x.jpg"></figure>
<ul><li>Close to Melbourne</li><li>Great schools</li></ul><hr><blockquote><p>Buy the street.</p></blockquote>
<script>alert(1)</script><p></p></div>`)
assert.deepEqual(s.map((x) => [x.type, x.text]), [
  ['heading', 'Why Geelong & Surf Coast?'],
  ['paragraph', 'Prices rose 5% this year.'],
  ['paragraph', '• Close to Melbourne\n• Great schools'],
  ['divider', undefined],
  ['pullquote', 'Buy the street.'],
])
assert.ok(s.every((x) => x._key.length === 12))
assert.equal(mapCategory(['Uncategorized', 'First home buyer tips']), 'Buying Guide')
assert.equal(mapCategory(['News']), 'Market Insights')
console.log('wordpress html: ok')
