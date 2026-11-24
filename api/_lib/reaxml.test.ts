// Run: npm run test:feed
// Fixture copies the shape of the real FeedSync output (agent/contact details shortened).
import assert from 'node:assert/strict'
import {isPublishable, parseFeed} from './reaxml.ts'

const xml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE propertyList SYSTEM "http://reaxml.realestate.com.au/propertyList.dtd">
<propertyList>
  <residential modTime="2026-06-12 14:01:05" status="current">
    <agentID>CVRE07</agentID>
    <uniqueID>1P0012</uniqueID>
    <isMultiple/>
    <price display="yes">800000</price>
    <priceView>$779,000 - $829,000</priceView>
    <underOffer value="no"/>
    <landDetails><area unit="squareMeter">400</area><frontage unit="meter">0</frontage></landDetails>
    <listingAgent id="1"><name>Pooja Patel</name><email>PPatel@canvasrealestate.com.au</email></listingAgent>
    <address display="yes" streetview="yes">
      <subNumber/><lotNumber/><streetNumber>30</streetNumber><street>Flagstaff Street</street>
      <suburb display="yes">Armstrong Creek</suburb><state>VIC</state><postcode>3217</postcode><country>AUS</country>
    </address>
    <category name="House"/>
    <features>
      <openSpaces>2</openSpaces><bedrooms>4</bedrooms><bathrooms>2</bathrooms><garages>0</garages>
      <carports>0</carports><toilets>2</toilets><ensuite>1</ensuite><airConditioning>1</airConditioning><balcony>0</balcony>
      <otherFeatures>Walk-in pantry, Alfresco</otherFeatures>
    </features>
    <headline>Premium Family Home Offer</headline>
    <description>Designed with families in mind.

Second paragraph here.</description>
    <objects>
      <img modTime="2025-11-26-16:42:50" id="a" url="https://cdn.example/1P0012/a.jpg" format="jpg"/>
      <img modTime="2025-11-26-16:42:46" id="m" url="https://cdn.example/1P0012/m.jpg" format="jpg"/>
      <img id="b"/>
      <floorplan modTime="2025-11-26-16:41:25" id="1" url="https://cdn.example/1P0012/fp.jpg" format="jpg"/>
      <floorplan id="2"/>
    </objects>
    <media><attachment usage="statementOfInformation" contentType="application/pdf" id="abc" url="https://cdn.example/soi.pdf"/></media>
    <extraFields name="streetAddress" value="30 Flagstaff Street"/>
    <extraFields name="hiddenListing" value="0"/>
    <extraFields name="OffMarketListing" value="1"/>
  </residential>
  <residential modTime="2026-06-10 12:41:21" status="sold">
    <uniqueID>1P0002</uniqueID>
    <priceView>$1,299,000 - $1,349,000</priceView>
    <soldDetails><soldPrice display="yes">1260000</soldPrice><soldDate>2026-04-19</soldDate></soldDetails>
    <address><streetNumber>15</streetNumber><street>Generosa Grove</street><suburb>Tarneit</suburb><state>VIC</state><postcode>3029</postcode></address>
    <category name="House"/>
    <features><bedrooms>4</bedrooms></features>
    <description>Display home.</description>
    <objects><img id="m" modTime="x" url="https://cdn.example/1P0002/m.jpg"/></objects>
  </residential>
  <residential modTime="2026-06-10 12:41:21" status="withdrawn">
    <uniqueID>1P0099</uniqueID>
    <address><streetNumber>1</streetNumber><street>Old Road</street><suburb>Lara</suburb></address>
  </residential>
  <land modTime="2026-07-14 01:30:51" status="current">
    <uniqueID>1P0029</uniqueID>
    <priceView>$445,000 - $465,000</priceView>
    <landDetails><area unit="squareMeter">528</area></landDetails>
    <address><streetNumber>19</streetNumber><street>Wattlebird Drive</street><suburb>Lara</suburb><state>VIC</state><postcode>3212</postcode></address>
    <landCategory name="Residential"/>
    <description>Land.</description>
    <objects><img id="m" modTime="x" url="https://cdn.example/1P0029/m.jpg"/></objects>
  </land>
</propertyList>`

const props = parseFeed(xml)
assert.equal(props.length, 4)

const [house, sold, withdrawn, land] = props
assert.equal(house.slug, '30-flagstaff-street-armstrong-creek')
assert.equal(house.state, 'VIC 3217')
assert.equal(house.type, 'House')
assert.equal(house.beds, 4)
assert.equal(house.baths, 2)
assert.equal(house.cars, 2)
assert.equal(house.land, '400 m²')
assert.equal(house.price, '$779,000 - $829,000')
assert.equal(house.status, 'For Sale')
assert.deepEqual(house.description, ['Premium Family Home Offer', 'Designed with families in mind.', 'Second paragraph here.'])
assert.deepEqual(house.features, ['Ensuite', 'Air Conditioning', 'Walk-in pantry', 'Alfresco'])
assert.deepEqual(house.images.map((i) => i.url.split('/').pop()), ['m.jpg', 'a.jpg'])
assert.equal(house.floorPlan?.url, 'https://cdn.example/1P0012/fp.jpg')
assert.equal(house.soiPdf?.url, 'https://cdn.example/soi.pdf')
assert.deepEqual(house.agents, [{name: 'Pooja Patel', email: 'ppatel@canvasrealestate.com.au'}])

assert.equal(isPublishable(house), true) // off market is still shown
assert.equal(sold.status, 'Sold')
assert.equal(sold.price, 'Sold $1,260,000')
assert.equal(isPublishable(sold), true)
assert.equal(isPublishable(withdrawn), false)

assert.equal(land.type, 'Land')
assert.equal(land.slug, '19-wattlebird-drive-lara')
assert.equal(land.kind, 'listing')

console.log('reaxml parser: all checks passed')
