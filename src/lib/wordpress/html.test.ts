// Run: npm test
import assert from 'node:assert/strict'
import {htmlToSections, mapCategory, niceSlug, stripBrand, tidySections} from './html.ts'

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
assert.equal(mapCategory(['Geelong Landlord’s Guide']), 'Renting & Investing')
assert.equal(mapCategory(['How much is your Geelong home worth?']), 'Selling Guide')
assert.equal(mapCategory(['News']), 'Market Insights')
assert.equal(niceSlug('blog-13', 'Geelong property market growth'), 'geelong-property-market-growth')
assert.equal(niceSlug('budget-2026', 'Budget 2026'), 'budget-2026')
assert.deepEqual(tidySections([{type: 'heading', text: 'Budget 2026!'}, {type: 'paragraph', text: 'Share this post'}, {type: 'paragraph', text: 'Real text'}], 'Budget 2026'), [{type: 'paragraph', text: 'Real text'}])
assert.equal(stripBrand('Budget 2026 - Canvas Real Estate'), 'Budget 2026')
console.log('wordpress html: ok')
