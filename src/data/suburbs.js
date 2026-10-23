// Suburb landing pages (/locations/{slug}). Grouped by region so each page can link to its neighbours.

const STATE_NAMES = {
  NSW: 'New South Wales',
  VIC: 'Victoria',
  QLD: 'Queensland',
  WA: 'Western Australia',
  SA: 'South Australia',
  ACT: 'Australian Capital Territory',
  TAS: 'Tasmania',
  NT: 'Northern Territory'
};

const REGIONS = [
  { state: 'NSW', city: 'Sydney', region: 'Sydney CBD & Inner City', suburbs: [['Sydney', '2000'], ['Surry Hills', '2010'], ['Pyrmont', '2009'], ['Newtown', '2042']] },
  { state: 'NSW', city: 'Sydney', region: 'Eastern Suburbs', suburbs: [['Bondi', '2026'], ['Bondi Junction', '2022'], ['Paddington', '2021'], ['Randwick', '2031'], ['Coogee', '2034'], ['Maroubra', '2035']] },
  { state: 'NSW', city: 'Sydney', region: 'Inner West', suburbs: [['Marrickville', '2204'], ['Leichhardt', '2040'], ['Five Dock', '2046'], ['Concord', '2137'], ['Burwood', '2134'], ['Strathfield', '2135']] },
  { state: 'NSW', city: 'Sydney', region: 'North Shore', suburbs: [['North Sydney', '2060'], ['Mosman', '2088'], ['Lane Cove', '2066'], ['Chatswood', '2067'], ['Wahroonga', '2076'], ['Hornsby', '2077'], ['Ryde', '2112'], ['Epping', '2121']] },
  { state: 'NSW', city: 'Sydney', region: 'Northern Beaches', suburbs: [['Manly', '2095'], ['Dee Why', '2099']] },
  { state: 'NSW', city: 'Sydney', region: 'Hills District', suburbs: [['Castle Hill', '2154'], ['Baulkham Hills', '2153'], ['Bella Vista', '2153'], ['Kellyville', '2155'], ['Rouse Hill', '2155'], ['Cherrybrook', '2126']] },
  { state: 'NSW', city: 'Sydney', region: 'Western Sydney', suburbs: [['Parramatta', '2150'], ['Blacktown', '2148'], ['Schofields', '2762'], ['Marsden Park', '2765'], ['Mount Druitt', '2770'], ['St Marys', '2760'], ['Penrith', '2750']] },
  { state: 'NSW', city: 'Sydney', region: 'South West Sydney', suburbs: [['Bankstown', '2200'], ['Fairfield', '2165'], ['Cabramatta', '2166'], ['Liverpool', '2170'], ['Campbelltown', '2560'], ['Narellan', '2567'], ['Camden', '2570'], ['Oran Park', '2570']] },
  { state: 'NSW', city: 'Sydney', region: 'St George & Sutherland Shire', suburbs: [['Hurstville', '2220'], ['Kogarah', '2217'], ['Rockdale', '2216'], ['Sutherland', '2232'], ['Miranda', '2228'], ['Cronulla', '2230']] },
  { state: 'NSW', city: 'Regional NSW', region: 'Central Coast, Hunter & Illawarra', suburbs: [['Gosford', '2250'], ['Terrigal', '2260'], ['Newcastle', '2300'], ['Maitland', '2320'], ['Wollongong', '2500']] },
  { state: 'VIC', city: 'Melbourne', region: 'Inner Melbourne', suburbs: [['Melbourne', '3000'], ['Carlton', '3053'], ['Fitzroy', '3065'], ['Richmond', '3121'], ['South Yarra', '3141'], ['St Kilda', '3182'], ['Brunswick', '3056']] },
  { state: 'VIC', city: 'Melbourne', region: 'Eastern Melbourne', suburbs: [['Hawthorn', '3122'], ['Camberwell', '3124'], ['Box Hill', '3128'], ['Doncaster', '3108'], ['Glen Waverley', '3150'], ['Ringwood', '3134']] },
  { state: 'VIC', city: 'Melbourne', region: 'Bayside & South East Melbourne', suburbs: [['Brighton', '3186'], ['Frankston', '3199'], ['Dandenong', '3175'], ['Berwick', '3806'], ['Cranbourne', '3977'], ['Clyde North', '3978']] },
  { state: 'VIC', city: 'Melbourne', region: 'Western & Northern Melbourne', suburbs: [['Footscray', '3011'], ['Point Cook', '3030'], ['Werribee', '3030'], ['Tarneit', '3029'], ['Craigieburn', '3064'], ['Sunbury', '3429']] },
  { state: 'VIC', city: 'Regional Victoria', region: 'Regional Victoria', suburbs: [['Geelong', '3220'], ['Ballarat', '3350'], ['Bendigo', '3550']] },
  { state: 'QLD', city: 'Brisbane', region: 'Brisbane', suburbs: [['Brisbane City', '4000'], ['Fortitude Valley', '4006'], ['New Farm', '4005'], ['South Brisbane', '4101'], ['Paddington', '4064'], ['Indooroopilly', '4068'], ['Chermside', '4032'], ['Carindale', '4152']] },
  { state: 'QLD', city: 'Brisbane', region: 'Greater Brisbane', suburbs: [['North Lakes', '4509'], ['Redcliffe', '4020'], ['Springfield Lakes', '4300'], ['Ipswich', '4305'], ['Cleveland', '4163']] },
  { state: 'QLD', city: 'Gold Coast', region: 'Gold Coast', suburbs: [['Southport', '4215'], ['Surfers Paradise', '4217'], ['Burleigh Heads', '4220'], ['Robina', '4226'], ['Coomera', '4209']] },
  { state: 'QLD', city: 'Sunshine Coast', region: 'Sunshine Coast', suburbs: [['Maroochydore', '4558'], ['Caloundra', '4551'], ['Noosa Heads', '4567']] },
  { state: 'QLD', city: 'Regional Queensland', region: 'Regional Queensland', suburbs: [['Toowoomba', '4350'], ['Townsville', '4810'], ['Cairns', '4870']] },
  { state: 'WA', city: 'Perth', region: 'Perth', suburbs: [['Perth', '6000'], ['Subiaco', '6008'], ['Cottesloe', '6011'], ['Scarborough', '6019'], ['Joondalup', '6027'], ['Fremantle', '6160'], ['Midland', '6056'], ['Ellenbrook', '6069'], ['Cannington', '6107'], ['Armadale', '6112'], ['Rockingham', '6168'], ['Baldivis', '6171'], ['Mandurah', '6210']] },
  { state: 'SA', city: 'Adelaide', region: 'Adelaide', suburbs: [['Adelaide', '5000'], ['Unley', '5061'], ['Norwood', '5067'], ['Prospect', '5082'], ['Glenelg', '5045'], ['Marion', '5043'], ['Modbury', '5092'], ['Mawson Lakes', '5095'], ['Salisbury', '5108'], ['Mount Barker', '5251']] },
  { state: 'ACT', city: 'Canberra', region: 'Canberra', suburbs: [['Canberra', '2601'], ['Kingston', '2604'], ['Belconnen', '2617'], ['Gungahlin', '2912']] },
  { state: 'TAS', city: 'Tasmania', region: 'Tasmania', suburbs: [['Hobart', '7000'], ['Sandy Bay', '7005'], ['Launceston', '7250']] },
  { state: 'NT', city: 'Darwin', region: 'Top End', suburbs: [['Darwin', '0800'], ['Palmerston', '0830']] }
];

const toSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export const SUBURBS = REGIONS.flatMap(({ suburbs, ...region }) =>
  suburbs.map(([name, postcode]) => ({
    ...region,
    name,
    postcode,
    stateName: STATE_NAMES[region.state],
    slug: `${toSlug(name)}-${region.state.toLowerCase()}`
  }))
);

export const STATES = Object.keys(STATE_NAMES).map((code) => ({
  code,
  name: STATE_NAMES[code],
  regions: REGIONS.filter((r) => r.state === code).map((r) => r.region)
}));

export function getSuburb(slug) {
  return SUBURBS.find((s) => s.slug === slug) || null;
}

export function nearbySuburbs(suburb, count = 8) {
  const sameRegion = SUBURBS.filter((s) => s.region === suburb.region && s.slug !== suburb.slug);
  const sameCity = SUBURBS.filter((s) => s.city === suburb.city && s.region !== suburb.region);
  return [...sameRegion, ...sameCity].slice(0, count);
}

/** Stable small number per suburb, used to vary featured designs between pages. */
export function suburbSeed(slug) {
  let h = 0;
  for (const ch of slug) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}
