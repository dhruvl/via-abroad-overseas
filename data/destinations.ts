export type Destination = {
  name: string;
  slug: string;
  countryCode: string;
  flag: string;
  tagline: string;
  overview: string;
  popularAreas: string[];
  highlights: string[];
  relatedServiceSlugs: string[];
};

export const destinations: Destination[] = [
  {
    name: "United States",
    slug: "usa",
    countryCode: "US",
    flag: "🇺🇸",
    tagline: "Diverse universities and flexible course structures.",
    overview:
      "The United States is home to a vast range of universities offering flexibility in course selection, research opportunities, and campus life across every region of the country.",
    popularAreas: ["Business & Management", "Computer Science", "Engineering", "Data Science"],
    highlights: [
      "Wide range of university sizes and specializations",
      "Flexible credit-based course structures",
      "Strong research and industry connections at many institutions",
    ],
    relatedServiceSlugs: ["study-abroad", "visa-assistance"],
  },
  {
    name: "Canada",
    slug: "canada",
    countryCode: "CA",
    flag: "🇨🇦",
    tagline: "Welcoming environment with strong post-study pathways.",
    overview:
      "Canada is known for its welcoming approach to international students, quality public universities and colleges, and structured post-study work options.",
    popularAreas: ["Engineering", "Business", "Healthcare Programs", "Information Technology"],
    highlights: [
      "Strong network of public universities and colleges",
      "Structured post-study work permit framework",
      "Multicultural, student-friendly cities",
    ],
    relatedServiceSlugs: ["study-abroad", "visa-assistance"],
  },
  {
    name: "United Kingdom",
    slug: "uk",
    countryCode: "GB",
    flag: "🇬🇧",
    tagline: "Globally recognized universities with shorter course durations.",
    overview:
      "The United Kingdom offers a long academic heritage, globally recognized universities, and typically shorter postgraduate course durations compared to many other destinations.",
    popularAreas: ["Business & Finance", "Law", "Engineering", "Design"],
    highlights: [
      "One-year postgraduate programs at many universities",
      "Long-standing academic reputation across disciplines",
      "Graduate route options for post-study experience",
    ],
    relatedServiceSlugs: ["study-abroad", "visa-assistance"],
  },
  {
    name: "Australia",
    slug: "australia",
    countryCode: "AU",
    flag: "🇦🇺",
    tagline: "Quality education with a high standard of living.",
    overview:
      "Australia combines internationally ranked universities with a high standard of living, making it a popular destination for students across a wide range of disciplines.",
    popularAreas: ["Engineering", "Healthcare", "Business", "Information Technology"],
    highlights: [
      "Globally ranked universities across major cities",
      "Post-study work options for eligible graduates",
      "Strong support systems for international students",
    ],
    relatedServiceSlugs: ["study-abroad", "visa-assistance"],
  },
  {
    name: "New Zealand",
    slug: "new-zealand",
    countryCode: "NZ",
    flag: "🇳🇿",
    tagline: "Safe, scenic, and research-driven education system.",
    overview:
      "New Zealand offers a safe environment, a research-oriented education system, and a close-knit international student community across its universities.",
    popularAreas: ["Agriculture Sciences", "Business", "Engineering", "Environmental Studies"],
    highlights: [
      "Small class sizes with close faculty interaction",
      "Consistently ranked among the safest countries globally",
      "Research-driven university culture",
    ],
    relatedServiceSlugs: ["study-abroad", "visa-assistance"],
  },
  {
    name: "Germany",
    slug: "germany",
    countryCode: "DE",
    flag: "🇩🇪",
    tagline: "Strong engineering focus with low-cost public universities.",
    overview:
      "Germany is well regarded for engineering and applied sciences, with many public universities offering low or no tuition fees for eligible programs.",
    popularAreas: ["Mechanical Engineering", "Automotive Engineering", "Computer Science", "Renewable Energy"],
    highlights: [
      "Low-cost or tuition-free public university options",
      "Strong industry ties in engineering and manufacturing",
      "Central location for exploring the wider European region",
    ],
    relatedServiceSlugs: ["study-abroad", "visa-assistance"],
  },
  {
    name: "Ireland",
    slug: "ireland",
    countryCode: "IE",
    flag: "🇮🇪",
    tagline: "English-speaking gateway to Europe with a growing tech sector.",
    overview:
      "Ireland offers English-taught programs, a growing technology and pharmaceutical industry presence, and a compact, welcoming higher education system.",
    popularAreas: ["Computer Science", "Pharmaceutical Sciences", "Business", "Data Analytics"],
    highlights: [
      "Home to European offices of major global technology companies",
      "English-speaking academic environment",
      "Stay-back options for eligible graduates",
    ],
    relatedServiceSlugs: ["study-abroad", "visa-assistance"],
  },
  {
    name: "France",
    slug: "france",
    countryCode: "FR",
    flag: "🇫🇷",
    tagline: "Rich academic tradition with growing English-taught programs.",
    overview:
      "France combines a rich academic tradition with an increasing number of English-taught programs, particularly in business and specialized graduate schools.",
    popularAreas: ["Business Management", "Fashion & Design", "Culinary Arts", "Engineering"],
    highlights: [
      "Renowned business and grande école institutions",
      "Growing number of English-taught graduate programs",
      "Central access to the wider European continent",
    ],
    relatedServiceSlugs: ["study-abroad", "visa-assistance"],
  },
  {
    name: "Italy",
    slug: "italy",
    countryCode: "IT",
    flag: "🇮🇹",
    tagline: "Historic universities with strengths in design and heritage fields.",
    overview:
      "Italy is home to some of the world's oldest universities, with particular strengths in design, architecture, and cultural heritage-related programs.",
    popularAreas: ["Architecture", "Design", "Fine Arts", "Business"],
    highlights: [
      "Some of the oldest universities in the world",
      "Strong reputation in design and creative disciplines",
      "Affordable tuition at many public institutions",
    ],
    relatedServiceSlugs: ["study-abroad", "visa-assistance"],
  },
  {
    name: "Netherlands",
    slug: "netherlands",
    countryCode: "NL",
    flag: "🇳🇱",
    tagline: "Highly ranked, English-taught programs across disciplines.",
    overview:
      "The Netherlands offers a large number of English-taught programs at highly ranked universities, with a practical, research-oriented teaching style.",
    popularAreas: ["Business & Economics", "Engineering", "Environmental Science", "Data Science"],
    highlights: [
      "Large selection of English-taught bachelor's and master's programs",
      "Highly ranked research universities and universities of applied sciences",
      "Compact country with excellent connectivity",
    ],
    relatedServiceSlugs: ["study-abroad", "visa-assistance"],
  },
  {
    name: "Sweden",
    slug: "sweden",
    countryCode: "SE",
    flag: "🇸🇪",
    tagline: "Innovation-focused education with a strong quality of life.",
    overview:
      "Sweden is recognized for its innovation-driven education system, sustainability focus, and high overall quality of life for international students.",
    popularAreas: ["Sustainable Engineering", "Design", "Information Technology", "Business"],
    highlights: [
      "Strong focus on innovation and sustainability",
      "English-taught master's programs at leading universities",
      "High quality of life and safety standards",
    ],
    relatedServiceSlugs: ["study-abroad", "visa-assistance"],
  },
  {
    name: "Singapore",
    slug: "singapore",
    countryCode: "SG",
    flag: "🇸🇬",
    tagline: "Asia's global education and business hub.",
    overview:
      "Singapore combines globally ranked universities with proximity to India, strong industry connections, and a well-established international student ecosystem.",
    popularAreas: ["Business Analytics", "Finance", "Engineering", "Information Technology"],
    highlights: [
      "Globally ranked universities in a major Asian financial hub",
      "Strong regional industry and internship connections",
      "Shorter travel distance and time-zone proximity from India",
    ],
    relatedServiceSlugs: ["study-abroad", "visa-assistance"],
  },
  {
    name: "UAE",
    slug: "uae",
    countryCode: "AE",
    flag: "🇦🇪",
    tagline: "Growing hub for international university campuses.",
    overview:
      "The UAE hosts a growing number of international branch campuses and universities, offering globally recognized degrees within a shorter travel distance from India.",
    popularAreas: ["Business", "Engineering", "Hospitality Management", "Information Technology"],
    highlights: [
      "International branch campuses of globally recognized universities",
      "Shorter travel distance and lower relative living costs",
      "Multicultural, business-oriented environment",
    ],
    relatedServiceSlugs: ["study-abroad", "visa-assistance"],
  },
  {
    name: "Malaysia",
    slug: "malaysia",
    countryCode: "MY",
    flag: "🇲🇾",
    tagline: "Affordable, quality education with international branch campuses.",
    overview:
      "Malaysia offers affordable tuition and living costs alongside branch campuses of well-known international universities, making it a practical entry point to global education.",
    popularAreas: ["Business", "Engineering", "Hospitality", "Information Technology"],
    highlights: [
      "Branch campuses of recognized international universities",
      "Comparatively affordable tuition and living costs",
      "Culturally familiar and welcoming environment for Indian students",
    ],
    relatedServiceSlugs: ["study-abroad", "visa-assistance"],
  },
];

export function getDestinationBySlug(slug: string) {
  return destinations.find((destination) => destination.slug === slug);
}

/**
 * The eight destinations the homepage and footer feature by name, per the
 * approved brief. All 14 destinations remain fully browsable and linked
 * from /destinations and internal pages — this list only curates the
 * homepage/footer spotlight.
 */
export const featuredDestinationSlugs = [
  "uk",
  "usa",
  "australia",
  "canada",
  "germany",
  "ireland",
  "new-zealand",
  "france",
] as const;

export function getFeaturedDestinations() {
  return featuredDestinationSlugs
    .map((slug) => getDestinationBySlug(slug))
    .filter((d): d is Destination => Boolean(d));
}
