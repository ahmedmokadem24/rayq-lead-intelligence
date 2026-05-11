export const countries = [
  "UAE",
  "Saudi Arabia",
  "Kuwait",
  "Qatar",
  "Bahrain",
  "Oman",
  "Egypt",
  "Jordan",
  "Lebanon",
  "Morocco",
  "Germany",
  "United Kingdom",
  "United States",
  "France",
  "Other"
];

export const gccCities: Record<string, string[]> = {
  UAE: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Dammam", "Khobar", "Mecca", "Medina"],
  Kuwait: ["Kuwait City", "Salmiya", "Hawalli"],
  Qatar: ["Doha", "Al Wakra", "Al Rayyan"],
  Bahrain: ["Manama", "Muharraq", "Riffa"],
  Egypt: ["Cairo", "Alexandria", "Giza", "New Cairo", "6th October City"],
  Jordan: ["Amman", "Zarqa", "Irbid"]
};

export const industries = [
  "Fashion",
  "Beauty & Skincare",
  "Beauty Clinic",
  "Medical Clinic",
  "Restaurant",
  "Cafe",
  "Furniture & Home Decor",
  "Interior Design",
  "Gym & Fitness",
  "Real Estate",
  "Jewelry",
  "Concept Store",
  "Luxury Brand",
  "Hospitality",
  "Online Store / E-commerce",
  "Local Service Business",
  "E-commerce",
  "Startup",
  "New Launch",
  "Other"
];

export const businessTypes = [
  "E-commerce brand",
  "Brick & mortar",
  "Service business",
  "Local business",
  "High-ticket service",
  "B2B",
  "Marketplace",
  "Consumer brand",
  "Franchise"
];

export const servicesToPitch = [
  "Performance Marketing",
  "Meta Ads",
  "Google Ads",
  "TikTok Ads",
  "Snapchat Ads",
  "Website Creation",
  "CRO",
  "Media Buying",
  "AI Image / Video Creation",
  "Social Media Management",
  "Email & WhatsApp Marketing",
  "Growth Strategy",
  "Tracking & Analytics"
];

export const leadSources = [
  "Google Places",
  "Search API / SerpAPI",
  "Instagram Discovery",
  "Manual Research",
  "Referral",
  "CSV import",
  "LinkedIn",
  "WhatsApp",
  "Other",
  "DEMO mode"
];

export const automatedDiscoverySources = ["Google Places", "Search API / SerpAPI", "DEMO"] as const;

export const assistedSocialSources = [
  "Manual Instagram URL input",
  "Manual LinkedIn company/founder URL input",
  "Website URL paste list",
  "CSV import"
] as const;

export const enrichmentPlaceholders = [
  "Hunter.io",
  "Apollo",
  "Snov.io",
  "BuiltWith",
  "Clearbit or similar"
] as const;

export const diagnosisTags = [
  "No website",
  "Broken website",
  "Weak CTA",
  "Weak landing page",
  "No WhatsApp button",
  "Weak product descriptions",
  "Weak SEO",
  "Poor mobile experience",
  "No clear funnel",
  "Weak social proof",
  "No email capture",
  "No retargeting setup",
  "Tracking unclear",
  "Not running ads",
  "Weak branding",
  "Inconsistent social content",
  "No online store",
  "Strong Instagram, weak funnel"
];

export const instagramIndustryKeywords: Record<string, string[]> = {
  Fashion: ["fashion boutique", "fashion brand", "clothing store", "fashion influencer", "style brand"],
  "Beauty & Skincare": ["beauty brand", "skincare brand", "cosmetics", "beauty influencer"],
  "Beauty Clinic": ["beauty clinic", "laser clinic", "aesthetics clinic", "skin clinic", "glam clinic"],
  "Medical Clinic": ["medical clinic", "health clinic", "specialist clinic", "dermatologist"],
  Restaurant: ["restaurant", "fine dining", "casual dining", "food brand"],
  Cafe: ["cafe", "coffee shop", "specialty coffee", "brunch spot"],
  "Furniture & Home Decor": ["furniture store", "home decor", "interior furniture", "home design brand"],
  "Interior Design": ["interior design studio", "interior designer", "home styling"],
  "Gym & Fitness": ["gym", "fitness studio", "personal trainer", "CrossFit", "yoga studio"],
  "Real Estate": ["real estate", "property developer", "luxury apartments", "real estate agent"],
  Jewelry: ["jewelry brand", "jewellery", "gold jewelry", "diamond jewelry", "luxury jewelry"],
  "Concept Store": ["concept store", "lifestyle store", "multi-brand store"],
  "Luxury Brand": ["luxury brand", "luxury lifestyle", "premium brand"],
  Hospitality: ["hotel", "resort", "luxury hotel", "boutique hotel"],
  "Online Store / E-commerce": ["online store", "e-commerce brand", "shop online", "delivery brand"],
  "Local Service Business": ["local services", "home services", "cleaning service", "maintenance"],
  "E-commerce": ["e-commerce", "online brand", "drop shipping", "shop"],
  Startup: ["startup", "new brand", "growing brand"],
  "New Launch": ["new opening", "grand opening", "just launched", "new brand"]
};