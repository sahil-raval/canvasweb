import laraImg       from "@/assets/canvas/listing-lara.jpg";
import arm1Img       from "@/assets/canvas/listing-armstrong1.jpg";
import arm2Img       from "@/assets/canvas/listing-armstrong2.jpg";
import office1Img    from "@/assets/canvas/office-1.jpg";
import office2Img    from "@/assets/canvas/office-2.jpg";
import office3Img    from "@/assets/canvas/office-3.jpg";
import office4Img    from "@/assets/canvas/office-4.jpg";
import heroImg       from "@/assets/canvas/geelong-hero.jpg";

export interface Rental {
  slug: string;
  address: string;
  suburb: string;
  state: string;
  rentPw: string;
  bond: string;
  available: string;
  leaseLength: string;
  beds: number;
  baths: number;
  cars: number;
  land: string;
  type: string;
  furnished: boolean;
  petsConsidered: boolean;
  heroImage: string;
  gallery: string[];
  description: string[];
  features: string[];
  agent: string;
}

export const rentals: Rental[] = [
  {
    slug: "8-lakewood-boulevard-lara",
    address: "8 Lakewood Boulevard",
    suburb: "Lara",
    state: "VIC 3212",
    rentPw: "$480 / week",
    bond: "$1,920",
    available: "Now",
    leaseLength: "12 months",
    beds: 3,
    baths: 2,
    cars: 1,
    land: "395 m²",
    type: "House",
    furnished: false,
    petsConsidered: true,
    heroImage: laraImg,
    gallery: [office1Img, office3Img, arm1Img, office4Img],
    description: [
      "Presented in immaculate condition, 8 Lakewood Boulevard is a beautifully maintained family home nestled in one of Lara's most sought-after pockets. From the moment you arrive, the impressive street presence sets the tone for what awaits inside.",
      "The thoughtfully designed floor plan features three generous bedrooms, two full bathrooms, and a bright open-plan living and dining zone that flows effortlessly to a private alfresco entertaining area — perfect for year-round enjoyment.",
      "Positioned within walking distance of Lara's vibrant township, leading schools, and public transport links, this home offers a lifestyle of convenience and comfort that is rarely matched at this price point.",
    ],
    features: [
      "3 bedrooms, master with ensuite and walk-in robe",
      "Open-plan kitchen, living and dining",
      "Quality stone benchtops and stainless steel appliances",
      "Private alfresco entertaining area",
      "Ducted heating and evaporative cooling",
      "Single remote-controlled garage",
      "Low-maintenance 395m² allotment",
      "Walking distance to Lara township and schools",
      "Pet-friendly (subject to approval)",
    ],
    agent: "pooja",
  },
  {
    slug: "14-verdant-circuit-armstrong-creek",
    address: "14 Verdant Circuit",
    suburb: "Armstrong Creek",
    state: "VIC 3217",
    rentPw: "$620 / week",
    bond: "$2,480",
    available: "15 Aug 2026",
    leaseLength: "12 months",
    beds: 4,
    baths: 2,
    cars: 2,
    land: "510 m²",
    type: "House",
    furnished: false,
    petsConsidered: false,
    heroImage: arm1Img,
    gallery: [laraImg, office2Img, heroImg, office4Img],
    description: [
      "14 Verdant Circuit presents a rare opportunity to lease a premium family home in the heart of Armstrong Creek's prestigious Armstrong Estate — a community celebrated for its parks, schools, and exceptional quality of life.",
      "Inside, the home delivers four spacious bedrooms, a master suite complete with ensuite and walk-in robe, and a series of interconnected living and dining zones anchored by a stunning gourmet kitchen featuring Caesarstone benchtops and 900mm appliances.",
      "The outdoor entertaining space is second to none, with a covered alfresco area overlooking a beautifully maintained garden — a space the whole family will gravitate toward through every season.",
    ],
    features: [
      "4 bedrooms, master with ensuite and walk-in robe",
      "Gourmet kitchen with Caesarstone benchtops",
      "900mm cooking appliances",
      "Multiple living and dining zones",
      "Covered alfresco entertaining area",
      "Ducted refrigerated heating and cooling",
      "Double remote-controlled garage",
      "Fully landscaped 510m² allotment",
    ],
    agent: "chandra",
  },
  {
    slug: "22-flagstaff-street-armstrong-creek",
    address: "22 Flagstaff Street",
    suburb: "Armstrong Creek",
    state: "VIC 3217",
    rentPw: "$580 / week",
    bond: "$2,320",
    available: "Now",
    leaseLength: "12 months",
    beds: 4,
    baths: 2,
    cars: 2,
    land: "540 m²",
    type: "House",
    furnished: false,
    petsConsidered: true,
    heroImage: arm2Img,
    gallery: [arm1Img, office3Img, laraImg, office2Img],
    description: [
      "Positioned in the thriving Warralily Estate, 22 Flagstaff Street is a spacious and beautifully appointed family home available for immediate lease. With four bedrooms, a flowing floor plan and outstanding outdoor living, this property ticks every box.",
      "The heart of the home is a stone benchtop kitchen with island bench and stainless steel appliances, opening directly to the combined family and dining zone. A separate formal lounge offers a quiet retreat for those moments that call for peace and privacy.",
      "Outside, the private alfresco entertaining area and fully landscaped 540m² garden provide the perfect backdrop for family life at its best. A double lock-up garage completes this outstanding rental opportunity.",
    ],
    features: [
      "4 bedrooms, master with ensuite and walk-in robe",
      "Stone benchtop kitchen with island bench",
      "Separate formal lounge and open-plan family zone",
      "Private alfresco entertaining area",
      "Ducted heating and evaporative cooling",
      "Double garage with internal access",
      "Fully landscaped 540m² allotment",
      "Pet-friendly (subject to approval)",
    ],
    agent: "pooja",
  },
  {
    slug: "5-sorrento-drive-geelong-west",
    address: "5 Sorrento Drive",
    suburb: "Geelong West",
    state: "VIC 3218",
    rentPw: "$520 / week",
    bond: "$2,080",
    available: "1 Sep 2026",
    leaseLength: "12 months",
    beds: 3,
    baths: 1,
    cars: 1,
    land: "360 m²",
    type: "House",
    furnished: false,
    petsConsidered: false,
    heroImage: heroImg,
    gallery: [office1Img, office2Img, arm2Img, laraImg],
    description: [
      "Brimming with character and charm, 5 Sorrento Drive is a beautifully maintained home in the highly sought-after suburb of Geelong West — just minutes from Pakington Street's eclectic café culture, boutique shopping and vibrant dining scene.",
      "Inside, you'll find three light-filled bedrooms, a stylishly appointed bathroom, and a functional kitchen with quality appliances that opens to a comfortable living and dining area. The rear garden provides a private and tranquil outdoor escape.",
      "With public transport, schools, Geelong CBD and the Waterfront all within easy reach, this home places everything you need right at your doorstep — a lifestyle opportunity not to be missed.",
    ],
    features: [
      "3 bedrooms with built-in robes",
      "Stylishly appointed bathroom",
      "Updated kitchen with quality appliances",
      "Light-filled living and dining area",
      "Private rear garden",
      "Single off-street parking",
      "Minutes to Pakington Street café strip",
      "Close to Geelong CBD and Waterfront",
    ],
    agent: "chandra",
  },
];

export function getRentalBySlug(slug: string): Rental | undefined {
  return rentals.find((r) => r.slug === slug);
}
