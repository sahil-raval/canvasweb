import office1  from "@/assets/canvas/office-1.jpg";
import office2  from "@/assets/canvas/office-2.jpg";
import office3  from "@/assets/canvas/office-3.jpg";
import office4  from "@/assets/canvas/office-4.jpg";
import heroImg  from "@/assets/canvas/geelong-hero.jpg";
import arm1     from "@/assets/canvas/listing-armstrong1.jpg";
import poojaImg from "@/assets/canvas/agent-pooja-new.jpg";
import chandraImg from "@/assets/canvas/agent-chandra-new.jpg";

export type BlockType =
  | { type: "paragraph"; text: string }
  | { type: "pullquote"; text: string }
  | { type: "heading"; text: string }
  | { type: "divider" };

export interface Article {
  slug: string;
  category: string;
  categoryColor: string;
  title: string;
  subtitle: string;
  excerpt: string;
  body: BlockType[];
  author: string;
  date: string;
  readTime: number;
  image: string;
  featured: boolean;
}

export const authors = {
  pooja: {
    name: "Pooja Patel",
    role: "Director & Lead Agent",
    image: poojaImg,
    bio: "Pooja brings over a decade of Geelong market expertise with an instinct for matching discerning buyers to exceptional homes.",
  },
  chandra: {
    name: "Chandra Bhatt",
    role: "Senior Property Consultant",
    image: chandraImg,
    bio: "Chandra's deep roots in the Geelong community and analytical approach to market dynamics make him an indispensable guide for buyers and sellers alike.",
  },
};

export const articles: Article[] = [
  {
    slug: "geelong-effect-why-discerning-buyers-are-arriving",
    category: "Market Insights",
    categoryColor: "#6b3a52",
    title: "The Geelong Effect: Why Australia's Discerning Buyers Are Arriving",
    subtitle: "A city once overlooked is now the quiet ambition of those seeking space, culture, and value without compromise.",
    excerpt:
      "Geelong's transformation from industrial port city to lifestyle capital is not accidental. It is the result of deliberate investment, cultural awakening, and a generation of buyers who refuse to settle for less.",
    body: [
      { type: "paragraph", text: "There is a particular quality of light over Corio Bay at dusk — amber and unhurried, the kind that makes you pause mid-sentence. It is the quality of a city that has found its confidence. Geelong, for decades cast in Melbourne's considerable shadow, is no longer content to play second city. It has become a destination in its own right." },
      { type: "paragraph", text: "The numbers confirm what the streets already whisper. Prestige property enquiries from Melbourne and Sydney have risen sharply over the past three years, while median price growth in Geelong's blue-chip pockets has outpaced many metropolitan equivalents. But statistics alone do not capture the texture of what is happening." },
      { type: "pullquote", text: "Geelong is not Melbourne's satellite. It is its own gravity — drawing people in rather than reflecting light borrowed from elsewhere." },
      { type: "heading", text: "The Infrastructure Dividend" },
      { type: "paragraph", text: "The regional rail upgrade has compressed the commute from Geelong to Melbourne's CBD to under an hour. Combined with the normalisation of hybrid work arrangements, this connectivity has fundamentally redrawn the calculus for buyers who once felt compelled to remain within ten kilometres of the city. A substantial home in Newtown or Highton — with garden, study, and proximity to Geelong's flourishing dining scene — now competes meaningfully with a terrace in Fitzroy." },
      { type: "paragraph", text: "The investment in cultural infrastructure has been equally significant. The Gallery of Geelong's expansion, the Geelong Convention and Events Centre, and the ongoing activation of the waterfront precinct have created the conditions for a cultural life that genuinely sustains its residents rather than offering a pale imitation of metropolitan experience." },
      { type: "heading", text: "What Buyers Are Seeking" },
      { type: "paragraph", text: "The profile of the Geelong prestige buyer has shifted. They are not retreating from ambition — they are redefining it. They want space that breathes: high ceilings, generous gardens, rooms that hold light well into the afternoon. They want schools of genuine quality within a reasonable drive. And they want a community with edges, with character, with the kind of independent restaurants and galleries that signal a place tending to its own identity." },
      { type: "pullquote", text: "The question is no longer whether Geelong can compete. The question is whether the rest of the country can keep up." },
      { type: "paragraph", text: "At Canvas, we have been watching this shift with particular attention. The buyers arriving at our listings are thoughtful, research-driven, and often deeply familiar with Geelong before they walk through a door. They have done their homework. Our role is to show them what the numbers cannot." },
    ],
    author: "pooja",
    date: "12 July 2026",
    readTime: 7,
    image: heroImg,
    featured: true,
  },
  {
    slug: "art-of-the-appraisal-what-your-home-is-truly-worth",
    category: "Buying Guide",
    categoryColor: "#3d4a2e",
    title: "The Art of the Appraisal: What Your Home Is Truly Worth",
    subtitle: "A property valuation is not simply arithmetic. It is interpretation, context, and craft.",
    excerpt:
      "Most appraisals tell you a number. The best appraisals tell you a story — the story of your property's position within a living, breathing market.",
    body: [
      { type: "paragraph", text: "Every property is a singular thing. The way morning light enters the kitchen. The particular privacy of a rear garden. The school catchment that changes the family maths entirely. These are not incidental details — they are the architecture of value, and any appraisal that ignores them is, at best, an educated guess." },
      { type: "paragraph", text: "The formal process of appraisal draws on comparable sales data: what similar homes in similar streets have recently achieved. This is essential and necessary. But it is the beginning of the analysis, not the end." },
      { type: "pullquote", text: "A number without context is not an appraisal. It is a starting point." },
      { type: "heading", text: "The Variables That Move the Market" },
      { type: "paragraph", text: "Seasonality matters more than most sellers acknowledge. The Geelong prestige market typically sees its most competitive buying conditions in late winter and spring, when stock is limited and motivated buyers have been circling for months. Listing in this window, at the right price, with the right campaign, can be worth tens of thousands of dollars against an identical home listed in the post-Christmas lull." },
      { type: "paragraph", text: "Presentation is the other lever most sellers underestimate. A considered styling investment — not a wholesale renovation, but a thoughtful curation — can shift the perceived category of a property. Buyers make emotional decisions first and justify them with logic. A home that feels premium at the point of inspection will be appraised as premium, regardless of the numbers on the spreadsheet." },
      { type: "heading", text: "What to Ask Your Agent" },
      { type: "paragraph", text: "When you invite an agent to appraise your property, come with questions. Ask them to walk you through their comparable sales in detail. Ask them what they would change about the presentation before listing. Ask them about buyer enquiry levels in your suburb right now. An agent who answers these questions with confidence and specificity is an agent worth trusting." },
      { type: "pullquote", text: "The appraisal conversation is your first interview with your future agent. Treat it as such." },
    ],
    author: "chandra",
    date: "28 June 2026",
    readTime: 6,
    image: office2,
    featured: false,
  },
  {
    slug: "quiet-luxury-design-trend-reshaping-geelong-prestige",
    category: "Design",
    categoryColor: "#2a3d4f",
    title: "Quiet Luxury: The Design Trend Reshaping Geelong's Prestige Market",
    subtitle: "The era of the statement home is giving way to something more considered, more permanent, more rare.",
    excerpt:
      "In the most coveted Geelong homes right now, you will find no bold gestures, no maximalist excess — only an almost painful precision of material and proportion.",
    body: [
      { type: "paragraph", text: "There is a particular aesthetic emerging in Geelong's premier residential streets that those in the architectural world have been calling, with increasing frequency, 'quiet luxury.' The term is borrowed from fashion — where it describes the preference for exceptional quality and restraint over visible branding — and it translates with surprising fidelity into the language of residential design." },
      { type: "paragraph", text: "The hallmarks are consistent across addresses: natural stone surfaces that reward close inspection, joinery with reveals so precise they read as sculpture, a palette anchored in warm neutrals that allow the architecture itself to carry the room. These homes do not announce themselves. They wait to be discovered." },
      { type: "pullquote", text: "The most extraordinary homes in Geelong right now are the ones you would not notice from the street." },
      { type: "heading", text: "Material Permanence" },
      { type: "paragraph", text: "The shift toward natural materials — honed limestone, textured render, brushed brass, aged oak — reflects a broader appetite for permanence. Buyers in the prestige market are increasingly asking not what a home looks like today, but how it will look in twenty years. Timber deepens. Stone acquires patina. The materials that age gracefully are the materials that hold value." },
      { type: "paragraph", text: "Geelong's light — coastal, diffuse, generous — particularly rewards this material palette. The same limestone that looks cold in a European setting develops a warmth here that is almost unexpected." },
      { type: "heading", text: "What This Means for Sellers" },
      { type: "paragraph", text: "If you are preparing a prestige property for sale, the implications are clear. Buyers who can afford to be selective are choosing homes that feel considered and curated rather than decorated. A restrained update — quality over quantity, less over more — will resonate more deeply than a high-spend renovation that arrives at the wrong aesthetic conclusion." },
    ],
    author: "pooja",
    date: "14 June 2026",
    readTime: 5,
    image: office4,
    featured: false,
  },
  {
    slug: "waterfront-living-corio-bay-coveted-addresses",
    category: "Lifestyle",
    categoryColor: "#1e3a4a",
    title: "Waterfront Living: Corio Bay's Most Coveted Addresses",
    subtitle: "On the water's edge between Geelong's culture and Bellarine's ease, a handful of addresses hold a particular kind of gravity.",
    excerpt:
      "There is a short list of streets in Geelong where the combination of water, light, and proximity to everything creates something genuinely irreplaceable.",
    body: [
      { type: "paragraph", text: "Corio Bay does not announce itself with drama. It is not the wild Southern Ocean or the churning Bass Strait. It is something quieter and, to those who know it, more captivating: a protected inland sea with a temper as mild as the bay towns that line its shores. The light here, particularly in the golden hour, is the kind that photographers travel to find." },
      { type: "paragraph", text: "The properties that sit closest to this water are, predictably, among the most sought after in the Geelong region. But within that category, there is considerable variation. The premium addresses are those where the view arrives unobstructed — where the bay fills the largest windows and the sound of water is present at breakfast and at midnight." },
      { type: "pullquote", text: "A waterfront address is not merely a location. It is a daily relationship with one of Geelong's greatest natural assets." },
      { type: "heading", text: "Eastern Beach and Surrounds" },
      { type: "paragraph", text: "The Eastern Beach precinct represents one of the most complete lifestyle propositions in regional Victoria. Walkable to Geelong's CBD, with the restored Art Deco bathing pavilion as its centrepiece, the streets behind the promenade offer a blend of period character and contemporary renovation that is increasingly difficult to find." },
      { type: "paragraph", text: "Demand in this precinct is structural rather than cyclical. When a property becomes available here, the pool of qualified buyers is immediate and motivated. The holding pattern for prestige waterfront stock in Geelong remains extremely short by historical standards." },
      { type: "heading", text: "The Bellarine as Counterpoint" },
      { type: "paragraph", text: "For buyers who want the water without the city adjacency, the Bellarine Peninsula offers an alternative of genuine distinction. Ocean Grove and Barwon Heads have developed restaurant and gallery scenes that no longer require apology — they are destinations. The homes here, particularly those with dual-bay access or private jetty arrangements, represent long-term value propositions that the broader market is only beginning to appreciate." },
    ],
    author: "chandra",
    date: "2 June 2026",
    readTime: 6,
    image: office3,
    featured: false,
  },
  {
    slug: "from-offer-to-settlement-a-buyers-guide",
    category: "Buying Guide",
    categoryColor: "#3d4a2e",
    title: "From Offer to Settlement: A Complete Buyer's Roadmap",
    subtitle: "The distance between making an offer and holding the keys is rarely straightforward. Here is how to navigate it with confidence.",
    excerpt:
      "The contract of sale is signed. What follows is the period most buyers are least prepared for — a sequence of critical steps, legal obligations, and quiet anxieties.",
    body: [
      { type: "paragraph", text: "The moment an offer is accepted, many buyers exhale with relief, believing the hard work is done. In truth, the work has shifted registers. The competition is behind you. What lies ahead is a sequence of legal, financial, and logistical obligations that, if navigated poorly, can unwind even the most promising purchase." },
      { type: "paragraph", text: "Understanding the post-offer process is not merely practical — it is the difference between a buyer who is in control of their purchase and one who is controlled by it." },
      { type: "pullquote", text: "The contract is signed. Now the real preparation begins." },
      { type: "heading", text: "The Cooling-Off Period" },
      { type: "paragraph", text: "In Victoria, buyers purchasing through private sale have a three-business-day cooling-off period from the date of signing. This is your last formal opportunity to withdraw without significant financial penalty. Use it: engage a conveyancer immediately, review the contract of sale in detail, and satisfy yourself that the Section 32 Vendor's Statement contains nothing unexpected. Do not wait until day two." },
      { type: "heading", text: "Building and Pest Inspections" },
      { type: "paragraph", text: "Even for properties that appear impeccable at inspection, a professional building and pest report is not optional — it is foundational due diligence. A quality inspector will assess the structural integrity of the building, the condition of roofing and drainage, the presence of any moisture or timber pest activity, and any compliance issues. The cost is modest; the potential savings are considerable." },
      { type: "heading", text: "Finance Confirmation and Settlement" },
      { type: "paragraph", text: "If your purchase is subject to finance, your lender will require a formal valuation of the property before confirming your loan. This can take up to two weeks. Maintain close communication with your broker or bank throughout this period. Any delays here can affect your settlement date and, in a vendor's market, your relationship with the selling agent." },
      { type: "pullquote", text: "The buyers who settle with confidence are the ones who treated every step with equal seriousness." },
    ],
    author: "chandra",
    date: "19 May 2026",
    readTime: 8,
    image: office1,
    featured: false,
  },
  {
    slug: "armstrong-creek-geelongs-most-exciting-suburb",
    category: "Market Insights",
    categoryColor: "#6b3a52",
    title: "Armstrong Creek: Geelong's Most Ambitious New Address",
    subtitle: "What began as a master-planned corridor has matured into a genuine community — and one of Geelong's most compelling investment stories.",
    excerpt:
      "Five years ago, buyers arriving in Armstrong Creek were pioneers. Today, they are following a market that has validated every instinct they brought with them.",
    body: [
      { type: "paragraph", text: "Master-planned communities carry a certain ambiguity in the Australian property conversation. The promise is often greater than the delivery: the streetscapes can feel provisional, the community infrastructure arrives late, and the sense of place takes longer to establish than the developer brochures suggest. Armstrong Creek, to its considerable credit, has largely avoided these pitfalls." },
      { type: "paragraph", text: "The suburb — or more accurately, the collection of suburbs occupying the southwestern growth corridor between Geelong and the Surf Coast — has grown with a speed and coherence that has surprised even its most optimistic advocates. The retail spine along Warralily Boulevard has filled with operators of genuine quality. The school network is extensive and improving. The parks are used." },
      { type: "pullquote", text: "Armstrong Creek is no longer a bet on the future. It is evidence of how the future, done well, looks." },
      { type: "heading", text: "Price Growth and Demand Dynamics" },
      { type: "paragraph", text: "The median price trajectory in Armstrong Creek over the past four years has been among the strongest in greater Geelong, driven by a combination of strong owner-occupier demand, improving infrastructure, and — critically — a gradual narrowing of the price gap with established Geelong suburbs. As that gap continues to narrow, the fundamental value proposition only strengthens." },
      { type: "heading", text: "The Surf Coast Effect" },
      { type: "paragraph", text: "Armstrong Creek's proximity to Torquay and the broader Surf Coast has become an increasingly important part of its appeal. For families who want the practicality of Geelong schooling and services with weekend access to world-class surf breaks and coastal towns, the geography is almost too convenient. This buyer profile — active, design-conscious, with young children — is among the most motivated in the Geelong market." },
      { type: "paragraph", text: "At Canvas, Armstrong Creek accounts for a meaningful share of our buyer enquiry, and the quality of that enquiry continues to rise. The suburb has graduated from an early-adopter story to something more durable: a community with genuine momentum and a property market to match." },
    ],
    author: "pooja",
    date: "5 May 2026",
    readTime: 6,
    image: arm1,
    featured: false,
  },
];
