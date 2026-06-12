// Service-area data shared by /service-areas pages, sitemap, and JSON-LD.
// Travel fee tiers = one-way PEAK drive time from the Alsip base:
// 0-30 min: $0 | 31-45 min: $25 | 46-60 min: $50 | 61-75 min: $100

export const TRAVEL_TIERS = {
  free: { label: "No travel fee", detail: "within about 30 minutes of our Alsip base, so most bookings here have no travel fee" },
  t1: { label: "$25 travel fee", detail: "about 31–45 minutes from our Alsip base at peak traffic, so a $25 travel fee typically applies" },
  t2: { label: "$50 travel fee", detail: "about 46–60 minutes from our Alsip base at peak traffic, so a $50 travel fee typically applies" },
};

export const SERVICE_AREAS = [
  {
    slug: "chicago",
    name: "Chicago",
    county: "Cook County",
    tier: "t1",
    blurb:
      "From South Side block parties to downtown office celebrations, our trucks roll through every corner of Chicago all summer long. We handle city event logistics regularly — tight loading docks, plaza setups, and multi-shift corporate days are all familiar territory.",
    popularEvents: ["corporate events & office parks", "block parties", "school field days", "festivals & street fests"],
  },
  {
    slug: "oak-lawn",
    name: "Oak Lawn",
    county: "Cook County",
    tier: "free",
    blurb:
      "Oak Lawn is right in our backyard — just minutes from our Alsip home base. That means flexible scheduling, easy add-on visits, and no travel fee for birthday parties, school events, and neighborhood gatherings across Oak Lawn.",
    popularEvents: ["birthday parties", "school events", "park district events", "block parties"],
  },
  {
    slug: "evergreen-park",
    name: "Evergreen Park",
    county: "Cook County",
    tier: "free",
    blurb:
      "We've served Evergreen Park families and businesses for years. With our warehouse only a short drive away, Evergreen Park bookings are some of the easiest to schedule — even on busy summer weekends.",
    popularEvents: ["family celebrations", "church & community events", "school events", "employee appreciation days"],
  },
  {
    slug: "burbank",
    name: "Burbank",
    county: "Cook County",
    tier: "free",
    blurb:
      "Burbank block parties and school events are a Windy City Ice Cream staple. Being this close to home base means we can often accommodate short-notice requests during the season.",
    popularEvents: ["block parties", "school events", "graduation parties", "sports team celebrations"],
  },
  {
    slug: "palos-hills",
    name: "Palos Hills",
    county: "Cook County",
    tier: "free",
    blurb:
      "From backyard parties in the Palos area to campus events, we bring the classic ice cream truck experience to Palos Hills, Palos Heights, and Palos Park with no travel fee for most addresses.",
    popularEvents: ["backyard parties", "campus & school events", "community festivals", "corporate picnics"],
  },
  {
    slug: "orland-park",
    name: "Orland Park",
    county: "Cook County",
    tier: "free",
    blurb:
      "Orland Park's busy calendar of corporate gatherings, school celebrations, and family parties keeps our trucks rolling there all season. Most Orland Park addresses fall inside our no-travel-fee zone.",
    popularEvents: ["corporate events", "school celebrations", "birthday parties", "neighborhood HOA events"],
  },
  {
    slug: "tinley-park",
    name: "Tinley Park",
    county: "Cook County",
    tier: "free",
    blurb:
      "Tinley Park events — from company picnics to graduation parties — are an easy run for our trucks. We know the area well and most bookings here carry no travel fee.",
    popularEvents: ["company picnics", "graduation parties", "park district events", "fundraisers"],
  },
  {
    slug: "oak-forest",
    name: "Oak Forest",
    county: "Cook County",
    tier: "free",
    blurb:
      "Oak Forest schools, churches, and neighborhoods have trusted Windy City Ice Cream for years. Close to our Alsip base, Oak Forest enjoys flexible time slots and no travel fee on most bookings.",
    popularEvents: ["school events & fundraisers", "church events", "block parties", "family reunions"],
  },
  {
    slug: "joliet",
    name: "Joliet",
    county: "Will County",
    tier: "t1",
    blurb:
      "As one of the largest cities in Will County, Joliet hosts everything from large corporate campuses to community festivals — and our trucks and pushcarts cover them all, including multi-shift and high-volume events.",
    popularEvents: ["corporate & warehouse appreciation events", "community festivals", "school events", "sports tournaments"],
  },
  {
    slug: "bolingbrook",
    name: "Bolingbrook",
    county: "Will County",
    tier: "t1",
    blurb:
      "Bolingbrook's corporate parks and family neighborhoods are regular stops on our summer routes. We bring nut-free and custom menu options that work well for Bolingbrook school and company events.",
    popularEvents: ["corporate park events", "school celebrations", "birthday parties", "community events"],
  },
  {
    slug: "naperville",
    name: "Naperville",
    county: "DuPage County",
    tier: "t2",
    blurb:
      "Naperville's corporate corridor and active park districts make it one of our most requested DuPage County destinations. Book early — Naperville summer dates fill quickly, especially for company events.",
    popularEvents: ["corporate headquarters events", "park district events", "school field days", "private celebrations"],
  },
  {
    slug: "downers-grove",
    name: "Downers Grove",
    county: "DuPage County",
    tier: "t1",
    blurb:
      "Downers Grove offices, schools, and neighborhoods welcome our trucks every summer. It's an easy run up from Alsip, making scheduling straightforward for both weekday corporate events and weekend parties.",
    popularEvents: ["office celebrations", "school events", "block parties", "graduation parties"],
  },
  {
    slug: "oak-brook",
    name: "Oak Brook",
    county: "DuPage County",
    tier: "t1",
    blurb:
      "Home to major corporate headquarters, Oak Brook is a favorite for employee appreciation days and client events. Our professional, uniformed drivers and customizable menus fit corporate standards.",
    popularEvents: ["employee appreciation days", "client & campus events", "corporate milestones", "summer office parties"],
  },
];

export function getServiceArea(slug) {
  return SERVICE_AREAS.find((a) => a.slug === slug);
}
