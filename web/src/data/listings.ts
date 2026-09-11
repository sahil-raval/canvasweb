import laraImg from "@/assets/canvas/listing-lara.jpg";
import armstrong1Img from "@/assets/canvas/listing-armstrong1.jpg";
import armstrong2Img from "@/assets/canvas/listing-armstrong2.jpg";
import officeImg from "@/assets/canvas/office-1.jpg";
import office2Img from "@/assets/canvas/office-2.jpg";
import office3Img from "@/assets/canvas/office-3.jpg";
import office4Img from "@/assets/canvas/office-4.jpg";
import heroImg from "@/assets/canvas/geelong-hero.jpg";
import teamImg from "@/assets/canvas/agent-team.jpg";

export interface ComparableSale {
  address: string;
  suburb: string;
  saleDate: string;
  salePrice: string;
  beds: number;
  baths: number;
  land: string;
}

export interface StatementOfInformation {
  method: "Private Sale" | "Auction";
  indicativeRange: string;
  comparableSales: ComparableSale[];
}

export interface Listing {
  slug: string;
  address: string;
  suburb: string;
  state: string;
  price: string;
  beds: number;
  baths: number;
  cars: number;
  land: string;
  type: string;
  status: string;
  heroImage: string;
  gallery: string[];
  description: string[];
  features: string[];
  agent: string;
  agents?: string[];
  soi: StatementOfInformation;
  statementOfInformationPdf?: string;
  floorPlanImage?: string;
  floorPlanPdf?: string;
}

export const listings: Listing[] = [
  {
    slug: "19-wattlebird-drive-lara",
    address: "19 Wattlebird Drive",
    suburb: "Lara",
    state: "VIC 3212",
    price: "$445,000 – $465,000",
    beds: 3,
    baths: 2,
    cars: 1,
    land: "420 m²",
    type: "House",
    status: "For Sale",
    heroImage: laraImg,
    gallery: [armstrong1Img, office3Img, office4Img, armstrong2Img],
    description: [
      "Welcome to 19 Wattlebird Drive, a beautifully presented family home nestled in the heart of Lara, one of Geelong's most sought-after growth corridors. This property delivers a perfect blend of contemporary design, comfortable living, and exceptional convenience.",
      "The thoughtfully designed floor plan offers three generous bedrooms, two full bathrooms, and open-plan living and dining that flows seamlessly to a private alfresco entertaining area. The kitchen is a standout, appointed with quality stone benchtops, stainless steel appliances, and an abundance of storage.",
      "Located within walking distance of Lara's vibrant township, schools, parks, and just minutes from Geelong's CBD and the Princes Freeway, this home represents outstanding value in a thriving community.",
    ],
    features: [
      "3 bedrooms, master with ensuite and walk-in robe",
      "Open-plan kitchen, living and dining",
      "Quality stone benchtops and stainless steel appliances",
      "Alfresco entertaining area",
      "Ducted heating and evaporative cooling",
      "Single remote-controlled garage",
      "Low-maintenance 420m² allotment",
      "Walking distance to Lara township & schools",
      "Easy access to Princes Freeway",
    ],
    agent: "pooja",
    soi: {
      method: "Private Sale",
      indicativeRange: "$445,000 – $465,000",
      comparableSales: [
        { address: "12 Thornton Rise", suburb: "Lara", saleDate: "Nov 2024", salePrice: "$452,000", beds: 3, baths: 2, land: "405 m²" },
        { address: "7 Sandpiper Court", suburb: "Lara", saleDate: "Oct 2024", salePrice: "$461,500", beds: 3, baths: 2, land: "435 m²" },
        { address: "31 Pelican Avenue", suburb: "Lara", saleDate: "Sep 2024", salePrice: "$438,000", beds: 3, baths: 1, land: "398 m²" },
      ],
    },
  },
  {
    slug: "25-forbes-street-armstrong-creek",
    address: "25 Forbes Street",
    suburb: "Armstrong Creek",
    state: "VIC 3217",
    price: "$729,000 – $779,000",
    beds: 4,
    baths: 2,
    cars: 2,
    land: "520 m²",
    type: "House",
    status: "For Sale",
    heroImage: armstrong1Img,
    gallery: [laraImg, office2Img, heroImg, office4Img],
    description: [
      "25 Forbes Street is a standout residence in Armstrong Creek's premium Armstrong Estate, offering four bedrooms, sophisticated finishes, and a lifestyle of effortless comfort that is rarely available at this price point.",
      "From the moment you arrive, the street presence is impressive. Step inside to discover a spacious, light-filled interior featuring a master suite with ensuite and walk-in robe, three further bedrooms with built-in storage, and a central family bathroom finished to the highest standard.",
      "The heart of the home is the gourmet kitchen, a culinary showpiece with Caesarstone benchtops, 900mm cooking appliances, butler's pantry, and a large island bench that opens to multiple living and dining zones. Outside, the alfresco area is perfectly positioned for year-round entertaining.",
    ],
    features: [
      "4 bedrooms, master with ensuite and walk-in robe",
      "Gourmet kitchen with butler's pantry and island bench",
      "Caesarstone benchtops and 900mm appliances",
      "Multiple living and dining zones",
      "Covered alfresco entertaining area",
      "Ducted refrigerated heating and cooling",
      "Double remote-controlled garage with internal access",
      "Landscaped 520m² allotment",
      "Armstrong Estate, walking distance to schools and parks",
    ],
    agent: "chandra",
    soi: {
      method: "Private Sale",
      indicativeRange: "$729,000 – $779,000",
      comparableSales: [
        { address: "18 Buranda Boulevard", suburb: "Armstrong Creek", saleDate: "Dec 2024", salePrice: "$752,000", beds: 4, baths: 2, land: "508 m²" },
        { address: "44 Verdant Circuit", suburb: "Armstrong Creek", saleDate: "Nov 2024", salePrice: "$741,500", beds: 4, baths: 2, land: "525 m²" },
        { address: "9 Halcyon Way", suburb: "Armstrong Creek", saleDate: "Oct 2024", salePrice: "$768,000", beds: 4, baths: 2, land: "512 m²" },
      ],
    },
  },
  {
    slug: "30-flagstaff-street-armstrong-creek",
    address: "30 Flagstaff Street",
    suburb: "Armstrong Creek",
    state: "VIC 3217",
    price: "$779,000 – $829,000",
    beds: 4,
    baths: 2,
    cars: 2,
    land: "560 m²",
    type: "House",
    status: "For Sale",
    heroImage: armstrong2Img,
    gallery: [armstrong1Img, office2Img, office3Img, laraImg],
    description: [
      "Introducing 30 Flagstaff Street, an exceptional family home in the prestigious Warralily Estate, designed for those who demand more. Presented to an exceptional standard throughout, this home is ready to move straight into and begin the next chapter of your story.",
      "Generous proportions define every room: four bedrooms, two bathrooms, and a thoughtfully zoned floor plan that accommodates growing families with grace. The kitchen is the true heart of the home, with stone benchtops, stainless steel appliances, and a large island bench anchoring the open-plan living and dining space.",
      "Set on a private 560m² allotment, the rear entertainer's alfresco is destined to become the favourite gathering point for family and friends across every season. Double lock-up garage, ducted heating and cooling, and quality window furnishings complete this impeccable package.",
    ],
    features: [
      "4 bedrooms, master with full ensuite and walk-in robe",
      "Stone benchtop kitchen with island bench",
      "Stainless steel appliances including dishwasher",
      "Separate formal lounge and open-plan family zone",
      "Private alfresco entertaining area",
      "Ducted heating and evaporative cooling",
      "Double remote garage with internal access",
      "560m² allotment, fully landscaped",
      "Warralily Estate, near schools, shops and parks",
    ],
    agent: "pooja",
    soi: {
      method: "Private Sale",
      indicativeRange: "$779,000 – $829,000",
      comparableSales: [
        { address: "22 Warralily Promenade", suburb: "Armstrong Creek", saleDate: "Jan 2025", salePrice: "$812,000", beds: 4, baths: 2, land: "548 m²" },
        { address: "5 Settlers Lane", suburb: "Armstrong Creek", saleDate: "Dec 2024", salePrice: "$798,500", beds: 4, baths: 2, land: "572 m²" },
        { address: "37 Kingswood Drive", suburb: "Armstrong Creek", saleDate: "Nov 2024", salePrice: "$821,000", beds: 4, baths: 2, land: "555 m²" },
      ],
    },
  },
  {
    slug: "15-generosa-grove-tarneit",
    address: "15 Generosa Grove",
    suburb: "Tarneit",
    state: "VIC 3029",
    price: "$1,399,000 – $1,449,000",
    beds: 5,
    baths: 4,
    cars: 2,
    land: "680 m²",
    type: "House",
    status: "For Sale",
    heroImage: armstrong1Img,
    gallery: [laraImg, armstrong2Img, heroImg, teamImg],
    description: [
      "15 Generosa Grove is a truly distinguished residence in one of Tarneit's most prestigious pockets, a masterclass in luxury living where architectural excellence meets family functionality. From the grand façade to the resort-style rear, every detail has been considered with precision and care.",
      "Five bedrooms, four bathrooms, and a home theatre create a living experience that goes beyond the ordinary. The master suite is a private sanctuary unto itself, featuring a lavish ensuite with freestanding bath, double vanity, floor-to-ceiling tiling, and an expansive walk-in dressing room.",
      "The chef's kitchen is nothing short of spectacular, with premium Smeg appliances, marble-look benchtops, a full butler's pantry, and an oversized island bench that serves as the centrepiece for grand entertaining. Alfresco dining flows to a beautifully landscaped garden, making this home as impressive outside as it is within.",
    ],
    features: [
      "5 bedrooms including grand master with dressing room",
      "4 luxurious bathrooms with premium finishes",
      "Chef's kitchen with Smeg appliances and butler's pantry",
      "Marble-look benchtops and oversized island bench",
      "Home theatre / formal sitting room",
      "Resort-style alfresco entertaining area",
      "Fully ducted refrigerated climate control",
      "Double garage with epoxy floor finish",
      "Landscaped 680m² allotment in prestigious pocket",
    ],
    agent: "chandra",
    soi: {
      method: "Private Sale",
      indicativeRange: "$1,399,000 – $1,449,000",
      comparableSales: [
        { address: "8 Marigold Boulevard", suburb: "Tarneit", saleDate: "Jan 2025", salePrice: "$1,420,000", beds: 5, baths: 4, land: "665 m²" },
        { address: "23 Grandview Circuit", suburb: "Tarneit", saleDate: "Dec 2024", salePrice: "$1,385,000", beds: 5, baths: 3, land: "690 m²" },
        { address: "11 Crestwood Parade", suburb: "Tarneit", saleDate: "Nov 2024", salePrice: "$1,445,000", beds: 5, baths: 4, land: "672 m²" },
      ],
    },
  },
];

export function getListingBySlug(slug: string): Listing | undefined {
  return listings.find((l) => l.slug === slug);
}
