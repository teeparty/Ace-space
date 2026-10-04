import { EarthLocation } from '../types/game';

// ---------------------------------------------------------------------------
// CORE CURATED GLOBAL VENUES (Iconic Wonders Across 7 Continents)
// ---------------------------------------------------------------------------
export const EARTH_LOCATIONS: EarthLocation[] = [
  {
    id: 'tokyo',
    name: 'Shibuya Neon Crossing',
    country: 'Japan',
    continent: 'Asia',
    lat: 35.6595,
    lng: 139.7005,
    description: 'The pulsing heart of Tokyo. Neon towers, massive video billboards, and thousands of eager pixel fans filling the intersection for the ultimate midnight concert.',
    vibe: 'Cyberpunk Hyper-Pop',
    recommendedBpm: 128,
    bgPalette: {
      skyTop: '#090514',
      skyBottom: '#2d124d',
      stageAccent: '#ec4899',
      neonColor: '#06b6d4',
    },
    pixelLandmark: 'shibuya',
    funFact: 'Over 3,000 people can cross Shibuya intersection at a single green light!',
    visitedCount: 0,
  },
  {
    id: 'pyramids',
    name: 'Great Pyramids of Giza',
    country: 'Egypt',
    continent: 'Africa',
    lat: 29.9792,
    lng: 31.1342,
    description: 'Ancient stone monoliths rising from golden desert dunes under a celestial canopy of constellations. Perform cosmic anthems where pharaohs once gazed at Orion.',
    vibe: 'Mystic Desert Synth',
    recommendedBpm: 104,
    bgPalette: {
      skyTop: '#060d1f',
      skyBottom: '#38220f',
      stageAccent: '#eab308',
      neonColor: '#f97316',
    },
    pixelLandmark: 'pyramids',
    funFact: 'The Great Pyramid was the tallest man-made structure on Earth for over 3,800 years!',
    visitedCount: 0,
  },
  {
    id: 'eiffel',
    name: 'Eiffel Tower at Midnight',
    country: 'France',
    continent: 'Europe',
    lat: 48.8584,
    lng: 2.2945,
    description: 'The City of Light! The wrought-iron Eiffel Tower sparkles with golden strobes as the cosmic sound waves echo across the Champ de Mars.',
    vibe: 'Romantic Electro Waltz',
    recommendedBpm: 115,
    bgPalette: {
      skyTop: '#0a1128',
      skyBottom: '#1c1938',
      stageAccent: '#f59e0b',
      neonColor: '#38bdf8',
    },
    pixelLandmark: 'eiffel',
    funFact: 'Gustave Eiffel included a secret private apartment at the top of the tower for visiting scientists.',
    visitedCount: 0,
  },
  {
    id: 'christ',
    name: 'Christ the Redeemer & Sugarloaf',
    country: 'Brazil',
    continent: 'Americas',
    lat: -22.9519,
    lng: -43.2105,
    description: 'High atop Mount Corcovado overlooking Guanabara Bay and Copacabana Beach. The warm Atlantic breeze blends with Samba synth beats.',
    vibe: 'Tropical Cosmic Samba',
    recommendedBpm: 124,
    bgPalette: {
      skyTop: '#071e22',
      skyBottom: '#1d2a44',
      stageAccent: '#10b981',
      neonColor: '#fbbf24',
    },
    pixelLandmark: 'christ',
    funFact: 'The statue stands 30 meters tall and was assembled piece by piece on the mountain peak.',
    visitedCount: 0,
  },
  {
    id: 'times_square',
    name: 'Times Square Crossroads',
    country: 'USA',
    continent: 'Americas',
    lat: 40.7580,
    lng: -73.9855,
    description: 'Broadway lights, towering digital marquees, and the bustling energy of Manhattan. The biggest outdoor rock & synth stage in the Western hemisphere.',
    vibe: 'High-Voltage Rock Synth',
    recommendedBpm: 132,
    bgPalette: {
      skyTop: '#0b0f19',
      skyBottom: '#241432',
      stageAccent: '#ef4444',
      neonColor: '#3b82f6',
    },
    pixelLandmark: 'times_square',
    funFact: 'Times Square was originally named Longacre Square until The New York Times moved its headquarters there in 1904.',
    visitedCount: 0,
  },
  {
    id: 'sydney',
    name: 'Sydney Opera House Harbour',
    country: 'Australia',
    continent: 'Oceania',
    lat: -33.8568,
    lng: 151.2153,
    description: 'Iconic white sail architecture shimmering across Sydney Harbour under the Southern Cross constellation. Water reflections amplify every arpeggio.',
    vibe: 'Oceanic Synth Odyssey',
    recommendedBpm: 120,
    bgPalette: {
      skyTop: '#081726',
      skyBottom: '#0e3a53',
      stageAccent: '#38bdf8',
      neonColor: '#e0f2fe',
    },
    pixelLandmark: 'sydney',
    funFact: 'The design was inspired by peeling orange segments and contains over one million ceramic roof tiles.',
    visitedCount: 0,
  },
  {
    id: 'aurora',
    name: 'Tromsø Northern Lights Aurora',
    country: 'Norway',
    continent: 'Europe',
    lat: 69.6492,
    lng: 18.9553,
    description: 'Dancing emerald and violet aurora borealis ribbons illuminating Arctic snow peaks. Cold air, crystalline reverbs, and pure northern starlight.',
    vibe: 'Ambient Ethereal Chill',
    recommendedBpm: 88,
    bgPalette: {
      skyTop: '#05111a',
      skyBottom: '#10393b',
      stageAccent: '#34d399',
      neonColor: '#818cf8',
    },
    pixelLandmark: 'aurora',
    funFact: 'Tromsø experiences the Polar Night from late November to mid-January, when the sun never rises above the horizon.',
    visitedCount: 0,
  },
  {
    id: 'fuji',
    name: 'Mount Fuji Lake Kawaguchi',
    country: 'Japan',
    continent: 'Asia',
    lat: 35.3606,
    lng: 138.7274,
    description: 'The snow-capped sacred volcano reflected in Lake Kawaguchi with delicate pink sakura cherry blossoms gently floating across the stage.',
    vibe: 'Zen Pentatonic Harmony',
    recommendedBpm: 98,
    bgPalette: {
      skyTop: '#100c1e',
      skyBottom: '#4a154b',
      stageAccent: '#f472b6',
      neonColor: '#fbcfe8',
    },
    pixelLandmark: 'fuji',
    funFact: 'Mount Fuji is an active volcano composed of three separate volcanoes stacked on top of one another.',
    visitedCount: 0,
  },
  {
    id: 'colosseum',
    name: 'The Roman Colosseum',
    country: 'Italy',
    continent: 'Europe',
    lat: 41.8902,
    lng: 12.4922,
    description: 'The grand arena of classical antiquity. Under dramatic roman torchlight and starlight, your retro synthesizer echoes through 2,000-year-old stone arches.',
    vibe: 'Epic Symphonic March',
    recommendedBpm: 118,
    bgPalette: {
      skyTop: '#090814',
      skyBottom: '#361b17',
      stageAccent: '#f97316',
      neonColor: '#fbbf24',
    },
    pixelLandmark: 'colosseum',
    funFact: 'The Colosseum could accommodate over 50,000 spectators and had 80 entrances.',
    visitedCount: 0,
  },
  {
    id: 'taj_mahal',
    name: 'Taj Mahal Marble Palace',
    country: 'India',
    continent: 'Asia',
    lat: 27.1751,
    lng: 78.0421,
    description: 'The majestic white marble mausoleum reflecting in the tranquil waters of the Yamuna River gardens. A magical venue for expressive sitar-scale synth melodies.',
    vibe: 'Raga Chiptune Fusion',
    recommendedBpm: 106,
    bgPalette: {
      skyTop: '#080e1a',
      skyBottom: '#22233f',
      stageAccent: '#e879f9',
      neonColor: '#67e8f9',
    },
    pixelLandmark: 'taj_mahal',
    funFact: 'The color of the Taj Mahal subtly changes from pinkish in the morning to milky white in the evening and golden under the moon.',
    visitedCount: 0,
  },

  // EXPANDED GLOBAL CATALOG FOR SEARCH & UNLIMITED RANDOM:
  {
    id: 'machu_picchu',
    name: 'Machu Picchu Incan Citadel',
    country: 'Peru',
    continent: 'Americas',
    lat: -13.1631,
    lng: -72.5450,
    description: 'Mystical 15th-century Incan citadel perched on a high ridge above the Sacred Valley, shrouded in drifting mountain mist.',
    vibe: 'Andean Mountain Chime',
    recommendedBpm: 110,
    bgPalette: {
      skyTop: '#0b1d28',
      skyBottom: '#183a37',
      stageAccent: '#10b981',
      neonColor: '#facc15',
    },
    pixelLandmark: 'mountains',
    funFact: 'Machu Picchu was built with dry-stone walls made of huge polished granite blocks fitted together without mortar.',
    visitedCount: 0,
  },
  {
    id: 'grand_canyon',
    name: 'Grand Canyon South Rim',
    country: 'USA',
    continent: 'Americas',
    lat: 36.0544,
    lng: -112.1401,
    description: 'Colossal red rock canyons carved over millions of years by the Colorado River, glowing in shades of crimson and amber at sunset.',
    vibe: 'Desert Rock Echoes',
    recommendedBpm: 116,
    bgPalette: {
      skyTop: '#1a0c1e',
      skyBottom: '#582118',
      stageAccent: '#f97316',
      neonColor: '#fdba74',
    },
    pixelLandmark: 'canyon',
    funFact: 'The Grand Canyon is over 1,800 meters deep and displays nearly two billion years of Earth’s geological history.',
    visitedCount: 0,
  },
  {
    id: 'santorini',
    name: 'Santorini Caldera Cliffside',
    country: 'Greece',
    continent: 'Europe',
    lat: 36.3932,
    lng: 25.4615,
    description: 'Whitewashed villages with cobalt blue domes cascading down volcanic cliffs directly into the azure Aegean Sea.',
    vibe: 'Aegean Breeze Synth',
    recommendedBpm: 122,
    bgPalette: {
      skyTop: '#0a1d37',
      skyBottom: '#1e3a8a',
      stageAccent: '#38bdf8',
      neonColor: '#ffffff',
    },
    pixelLandmark: 'island',
    funFact: 'Santorini is what remains of an enormous volcanic explosion that destroyed early settlements around 1600 BCE.',
    visitedCount: 0,
  },
  {
    id: 'kilimanjaro',
    name: 'Mount Kilimanjaro Summit',
    country: 'Tanzania',
    continent: 'Africa',
    lat: -3.0674,
    lng: 37.3556,
    description: 'The highest freestanding mountain on planet Earth, rising dramatically from golden acacia savannahs to snow-capped glaciers.',
    vibe: 'African Sky Anthem',
    recommendedBpm: 108,
    bgPalette: {
      skyTop: '#0f172a',
      skyBottom: '#312e81',
      stageAccent: '#a855f7',
      neonColor: '#fde047',
    },
    pixelLandmark: 'mountains',
    funFact: 'Kilimanjaro features five distinct ecological zones, from tropical rainforest at the base to arctic conditions at Uhuru Peak.',
    visitedCount: 0,
  },
  {
    id: 'easter_island',
    name: 'Easter Island Moai Monoliths',
    country: 'Chile',
    continent: 'Oceania',
    lat: -27.1127,
    lng: -109.3497,
    description: 'Enigmatic volcanic stone Moai statues standing guard on the isolated grassy slopes of Rapa Nui in the endless South Pacific.',
    vibe: 'Polynesian Starlight Pulse',
    recommendedBpm: 100,
    bgPalette: {
      skyTop: '#050b14',
      skyBottom: '#11293a',
      stageAccent: '#06b6d4',
      neonColor: '#fbbf24',
    },
    pixelLandmark: 'ancient',
    funFact: 'Almost all 900 Moai face inland toward the island villages rather than out to the sea.',
    visitedCount: 0,
  },
  {
    id: 'amundsen_scott',
    name: 'Amundsen-Scott South Pole Station',
    country: 'Antarctica',
    continent: 'Antarctica',
    lat: -90.0000,
    lng: 0.0000,
    description: 'The southernmost point on Earth! Sub-zero ice plateau where astronomers look directly into the cosmic void under crisp starry skies.',
    vibe: 'Polar Sub-Zero Drones',
    recommendedBpm: 84,
    bgPalette: {
      skyTop: '#020617',
      skyBottom: '#0f172a',
      stageAccent: '#38bdf8',
      neonColor: '#bae6fd',
    },
    pixelLandmark: 'arctic',
    funFact: 'The South Pole sits on an ice sheet over 2,800 meters thick that is drifting about 10 meters per year!',
    visitedCount: 0,
  },
  {
    id: 'reykjavik',
    name: 'Reykjavik Geothermal Harpa',
    country: 'Iceland',
    continent: 'Europe',
    lat: 64.1466,
    lng: -21.9426,
    description: 'Volcanic basalt landscapes, bubbling hot springs, and futuristic crystalline glass facades on the edge of the North Atlantic.',
    vibe: 'Glacial Post-Rock Synth',
    recommendedBpm: 112,
    bgPalette: {
      skyTop: '#081726',
      skyBottom: '#1e293b',
      stageAccent: '#06b6d4',
      neonColor: '#34d399',
    },
    pixelLandmark: 'arctic',
    funFact: 'Iceland runs almost 100% on renewable geothermal and hydroelectric energy.',
    visitedCount: 0,
  },
  {
    id: 'honolulu',
    name: 'Waikiki Beach & Diamond Head',
    country: 'USA (Hawaii)',
    continent: 'Oceania',
    lat: 21.2766,
    lng: -157.8273,
    description: 'Swaying palm trees, turquoise Pacific surf, and warm volcanic ocean breezes on the golden shores of Oahu.',
    vibe: 'Tropical Island Lo-Fi',
    recommendedBpm: 92,
    bgPalette: {
      skyTop: '#081c24',
      skyBottom: '#0d4a52',
      stageAccent: '#f43f5e',
      neonColor: '#2dd4bf',
    },
    pixelLandmark: 'tropical',
    funFact: 'Diamond Head is an extinct volcanic tuff cone that formed over 300,000 years ago during a single explosive eruption.',
    visitedCount: 0,
  },
  {
    id: 'serengeti',
    name: 'Serengeti Plains at Sunrise',
    country: 'Tanzania',
    continent: 'Africa',
    lat: -2.3333,
    lng: 34.8333,
    description: 'Vast golden grasslands under an immense violet dawn sky, where millions of wildebeest and zebras traverse the Great Migration.',
    vibe: 'Afro-Centric Poly-Beats',
    recommendedBpm: 105,
    bgPalette: {
      skyTop: '#180728',
      skyBottom: '#5c2214',
      stageAccent: '#eab308',
      neonColor: '#f97316',
    },
    pixelLandmark: 'desert',
    funFact: 'The Maasai call the Serengeti "Siringet", which translates to "the place where the land moves on forever."',
    visitedCount: 0,
  },
  {
    id: 'great_wall',
    name: 'Great Wall at Mutianyu',
    country: 'China',
    continent: 'Asia',
    lat: 40.4319,
    lng: 116.5704,
    description: 'Stone watchtowers winding like a dragon spine across mist-covered pine mountain ridges as lanterns illuminate the ramparts.',
    vibe: 'Imperial Pentatonic Synth',
    recommendedBpm: 114,
    bgPalette: {
      skyTop: '#0b1320',
      skyBottom: '#281c3b',
      stageAccent: '#ef4444',
      neonColor: '#facc15',
    },
    pixelLandmark: 'mountains',
    funFact: 'The Great Wall spans more than 21,000 kilometers when including all of its various branches and trenches.',
    visitedCount: 0,
  },
  {
    id: 'bora_bora',
    name: 'Bora Bora Turquoise Lagoon',
    country: 'French Polynesia',
    continent: 'Oceania',
    lat: -16.5004,
    lng: -151.7415,
    description: 'Overwater bungalows hovering over crystal turquoise barrier reefs with the sharp peaks of Mount Otemanu in the background.',
    vibe: 'Lagoon Chillwave',
    recommendedBpm: 94,
    bgPalette: {
      skyTop: '#06202a',
      skyBottom: '#0e5f6e',
      stageAccent: '#38bdf8',
      neonColor: '#f472b6',
    },
    pixelLandmark: 'island',
    funFact: 'Bora Bora was formed by an ancient volcano that slowly sank over millions of years, leaving behind a barrier coral reef.',
    visitedCount: 0,
  },
  {
    id: 'petra',
    name: 'The Rose City of Petra',
    country: 'Jordan',
    continent: 'Asia',
    lat: 30.3285,
    lng: 35.4444,
    description: 'Hand-carved red sandstone canyon temples of the Nabataeans, glowing with thousands of candle luminaries during midnight performances.',
    vibe: 'Rose Sandstone Trance',
    recommendedBpm: 102,
    bgPalette: {
      skyTop: '#160814',
      skyBottom: '#4a1e20',
      stageAccent: '#f43f5e',
      neonColor: '#fed7aa',
    },
    pixelLandmark: 'canyon',
    funFact: 'Petra remained completely hidden from the Western world for centuries until rediscovered by Swiss explorer Johann Burckhardt in 1812.',
    visitedCount: 0,
  },
];

// Helper to build Google Earth 3D URL
export function getGoogleEarthUrl(lat: number, lng: number): string {
  return `https://earth.google.com/web/@${lat.toFixed(5)},${lng.toFixed(5)},280a,35y,0h,45t,0r`;
}

// ---------------------------------------------------------------------------
// PROCEDURAL VENUE GENERATOR & CLIMATE DETECTOR
// Turns ANY search query or coordinates on Earth into an EarthLocation
// ---------------------------------------------------------------------------
export function createCustomEarthLocation(
  name: string,
  lat: number,
  lng: number,
  country = 'Planet Earth',
  continent?: string
): EarthLocation {
  const detectedContinent = continent || guessContinent(lat, lng);
  const detectedBiome = guessBiome(lat, lng, name);

  let bgPalette = {
    skyTop: '#0a1024',
    skyBottom: '#1e293b',
    stageAccent: '#06b6d4',
    neonColor: '#38bdf8',
  };

  let pixelLandmark = 'metropolis';
  let vibe = 'Global Orbit Sound';
  let recommendedBpm = 120;

  if (detectedBiome === 'arctic') {
    pixelLandmark = 'arctic';
    vibe = 'Arctic Glacial Chill';
    recommendedBpm = 90;
    bgPalette = { skyTop: '#020617', skyBottom: '#0e2538', stageAccent: '#38bdf8', neonColor: '#bae6fd' };
  } else if (detectedBiome === 'tropical' || detectedBiome === 'island') {
    pixelLandmark = 'tropical';
    vibe = 'Tropical Island Beats';
    recommendedBpm = 104;
    bgPalette = { skyTop: '#071b26', skyBottom: '#0f4859', stageAccent: '#f43f5e', neonColor: '#2dd4bf' };
  } else if (detectedBiome === 'desert') {
    pixelLandmark = 'desert';
    vibe = 'Mystic Desert Trance';
    recommendedBpm = 108;
    bgPalette = { skyTop: '#160814', skyBottom: '#4a2512', stageAccent: '#eab308', neonColor: '#f97316' };
  } else if (detectedBiome === 'mountains' || detectedBiome === 'canyon') {
    pixelLandmark = 'mountains';
    vibe = 'Alpine Altitude Anthem';
    recommendedBpm = 118;
    bgPalette = { skyTop: '#0b1424', skyBottom: '#1e2840', stageAccent: '#10b981', neonColor: '#facc15' };
  }

  const cleanId = `loc_${lat.toFixed(3)}_${lng.toFixed(3)}_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

  return {
    id: cleanId,
    name,
    country,
    continent: detectedContinent,
    lat,
    lng,
    description: `A live cosmic concert venue set right at ${name}, surrounded by Earth's atmospheric wonders and glowing under the stars.`,
    vibe,
    recommendedBpm,
    bgPalette,
    pixelLandmark,
    funFact: `Coordinates: ${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'} in ${detectedContinent}.`,
    visitedCount: 0,
  };
}

function guessContinent(lat: number, lng: number): string {
  if (lat < -60) return 'Antarctica';
  if (lat > 35 && lng > -25 && lng < 45) return 'Europe';
  if (lat > 5 && lng >= 45 && lng <= 180) return 'Asia';
  if (lat >= -35 && lat <= 37 && lng >= -20 && lng <= 55) return 'Africa';
  if (lat >= -55 && lat <= 12 && lng >= -85 && lng <= -34) return 'Americas';
  if (lat > 12 && lng >= -170 && lng <= -50) return 'Americas';
  if (lat < 0 && lng > 100 && lng < 180) return 'Oceania';
  return 'Americas';
}

function guessBiome(lat: number, lng: number, name: string): 'arctic' | 'tropical' | 'desert' | 'mountains' | 'island' | 'canyon' | 'metropolis' {
  const n = name.toLowerCase();
  if (n.includes('island') || n.includes('beach') || n.includes('reef') || n.includes('atoll') || n.includes('lagoon')) return 'island';
  if (n.includes('mountain') || n.includes('mount') || n.includes('peak') || n.includes('alps') || n.includes('himalaya') || n.includes('fuji')) return 'mountains';
  if (n.includes('desert') || n.includes('dune') || n.includes('sahara') || n.includes('canyon')) return 'desert';
  if (n.includes('ice') || n.includes('glacier') || n.includes('pole') || n.includes('arctic') || n.includes('antarctic') || n.includes('aurora') || Math.abs(lat) > 65) return 'arctic';
  if (Math.abs(lat) < 23.5) return 'tropical';
  return 'metropolis';
}

// ---------------------------------------------------------------------------
// REAL GLOBAL SEARCH ENGINE (Searches Catalog + OpenStreetMap Geocoding API)
// ---------------------------------------------------------------------------
export async function searchAnywhereOnEarth(query: string): Promise<EarthLocation[]> {
  const q = query.trim();
  if (!q) return EARTH_LOCATIONS.slice(0, 10);

  const qLower = q.toLowerCase();

  // 1. First, search curated catalogue
  const catalogMatches = EARTH_LOCATIONS.filter(
    (l) =>
      l.name.toLowerCase().includes(qLower) ||
      l.country.toLowerCase().includes(qLower) ||
      l.continent.toLowerCase().includes(qLower) ||
      l.vibe.toLowerCase().includes(qLower)
  );

  // 2. Query OpenStreetMap Nominatim for real global search
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&q=${encodeURIComponent(q)}`,
      {
        signal: controller.signal,
        headers: {
          'Accept-Language': 'en',
        },
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const geoLocations: EarthLocation[] = data.map((item: { display_name: string; lat: string; lon: string; address?: { country?: string } }) => {
          const lat = parseFloat(item.lat);
          const lng = parseFloat(item.lon);
          const parts = item.display_name.split(',');
          const mainTitle = parts[0] ? parts[0].trim() : q;
          const country = item.address?.country || (parts.length > 1 ? parts[parts.length - 1].trim() : 'Earth');

          return createCustomEarthLocation(
            mainTitle,
            lat,
            lng,
            country
          );
        });

        // Combine catalog and geocoder, deduping by approximate lat/lng
        const combined = [...catalogMatches];
        geoLocations.forEach((geo) => {
          const exists = combined.some((c) => Math.abs(c.lat - geo.lat) < 0.2 && Math.abs(c.lng - geo.lng) < 0.2);
          if (!exists) {
            combined.push(geo);
          }
        });

        return combined;
      }
    }
  } catch {
    // If offline or timeout, fall back smoothly
  }

  // 3. Fallback: If no network match but user typed a search, generate procedural location for their place!
  if (catalogMatches.length === 0 && q.length > 2) {
    // Hash query to consistent coordinates on land
    let hash = 0;
    for (let i = 0; i < q.length; i++) {
      hash = (hash << 5) - hash + q.charCodeAt(i);
      hash |= 0;
    }
    const lat = ((Math.abs(hash) % 11000) / 100) - 45; // -45 to +65
    const lng = ((Math.abs(hash * 31) % 36000) / 100) - 180; // -180 to +180

    return [createCustomEarthLocation(q.toUpperCase(), lat, lng, 'Planet Earth')];
  }

  return catalogMatches.length > 0 ? catalogMatches : EARTH_LOCATIONS.slice(0, 10);
}

// ---------------------------------------------------------------------------
// UNLIMITED RANDOM TO ANYWHERE ON GOOGLE EARTH GENERATOR
// ---------------------------------------------------------------------------
export function generateUnlimitedRandomLocation(currentId?: string): EarthLocation {
  // Pool of land-based landmark templates across every continent
  const randomWonderBases = [
    { name: 'Salar de Uyuni Salt Flats', country: 'Bolivia', continent: 'Americas', lat: -20.1338, lng: -67.4891, biome: 'desert' },
    { name: 'Stonehenge Ancient Monoliths', country: 'United Kingdom', continent: 'Europe', lat: 51.1789, lng: -1.8262, biome: 'ancient' },
    { name: 'Angkor Wat Temple Towers', country: 'Cambodia', continent: 'Asia', lat: 13.4125, lng: 103.8670, biome: 'ancient' },
    { name: 'Cappadocia Fairy Chimneys', country: 'Turkey', continent: 'Asia', lat: 38.6431, lng: 34.8289, biome: 'canyon' },
    { name: 'Galapagos Marine Sanctuary', country: 'Ecuador', continent: 'Americas', lat: -0.9538, lng: -90.9656, biome: 'island' },
    { name: 'Victoria Falls Devil’s Pool', country: 'Zambia / Zimbabwe', continent: 'Africa', lat: -17.9243, lng: 25.8572, biome: 'tropical' },
    { name: 'Banff Moraine Lake', country: 'Canada', continent: 'Americas', lat: 51.3217, lng: -116.1860, biome: 'mountains' },
    { name: 'Dead Sea Floating Salt Basin', country: 'Jordan / Israel', continent: 'Asia', lat: 31.5590, lng: 35.4732, biome: 'desert' },
    { name: 'Maldives Crystal Atoll', country: 'Maldives', continent: 'Asia', lat: 3.2028, lng: 73.2207, biome: 'island' },
    { name: 'Matterhorn Alpine Peak', country: 'Switzerland', continent: 'Europe', lat: 45.9765, lng: 7.6585, biome: 'mountains' },
    { name: 'Ha Long Bay Emerald Karsts', country: 'Vietnam', continent: 'Asia', lat: 20.9101, lng: 107.1839, biome: 'island' },
    { name: 'Great Barrier Reef Coral Garden', country: 'Australia', continent: 'Oceania', lat: -18.2871, lng: 147.6992, biome: 'island' },
    { name: 'Sahara Erg Chebbi Oasis', country: 'Morocco', continent: 'Africa', lat: 31.1492, lng: -3.9875, biome: 'desert' },
    { name: 'Mount Everest Khumbu Camp', country: 'Nepal', continent: 'Asia', lat: 27.9881, lng: 86.9250, biome: 'mountains' },
    { name: 'Rio de Janeiro Copacabana', country: 'Brazil', continent: 'Americas', lat: -22.9698, lng: -43.1822, biome: 'tropical' },
    { name: 'Dubrovnik Old City Ramparts', country: 'Croatia', continent: 'Europe', lat: 42.6412, lng: 18.1070, biome: 'ancient' },
    { name: 'Table Mountain Summit', country: 'South Africa', continent: 'Africa', lat: -33.9628, lng: 18.4098, biome: 'mountains' },
    { name: 'Fiji Coral Coast Cove', country: 'Fiji', continent: 'Oceania', lat: -18.1416, lng: 177.6253, biome: 'tropical' },
    { name: 'Mount Rainier Alpine Ridge', country: 'USA', continent: 'Americas', lat: 46.8523, lng: -121.7603, biome: 'mountains' },
    { name: 'Kyoto Arashiyama Bamboo Grove', country: 'Japan', continent: 'Asia', lat: 35.0116, lng: 135.6777, biome: 'tropical' },
    { name: 'Uluru Sacred Sandstone Rock', country: 'Australia', continent: 'Oceania', lat: -25.3444, lng: 131.0369, biome: 'desert' },
    { name: 'Bermuda Crystal Pink Beach', country: 'Bermuda', continent: 'Americas', lat: 32.3078, lng: -64.7505, biome: 'island' },
    { name: 'Reykjavik Blue Lagoon Crater', country: 'Iceland', continent: 'Europe', lat: 63.8804, lng: -22.4495, biome: 'arctic' },
  ];

  // Also can pick from expanded EARTH_LOCATIONS
  const allCandidates = [...EARTH_LOCATIONS, ...randomWonderBases.map((r) => 
    createCustomEarthLocation(r.name, r.lat, r.lng, r.country, r.continent)
  )].filter((l) => l.id !== currentId);

  // Pick random or generate procedural coordinate
  const roll = Math.random();
  if (roll < 0.85 && allCandidates.length > 0) {
    const picked = allCandidates[Math.floor(Math.random() * allCandidates.length)];
    return {
      ...picked,
      visitedCount: 0,
    };
  }

  // Pure unlimited procedural generator anywhere on Earth landmasses
  const regions = [
    { name: 'Patagonia Glacial Ridge', country: 'Argentina / Chile', lat: -49.33, lng: -73.05, continent: 'Americas' },
    { name: 'Gobi Desert Starlight Dunes', country: 'Mongolia', lat: 43.88, lng: 104.99, continent: 'Asia' },
    { name: 'Madagascar Baobab Forest', country: 'Madagascar', lat: -20.25, lng: 44.42, continent: 'Africa' },
    { name: 'New Zealand Milford Sound', country: 'New Zealand', lat: -44.67, lng: 167.92, continent: 'Oceania' },
    { name: 'Svalbard Arctic Outpost', country: 'Norway', lat: 78.22, lng: 15.65, continent: 'Europe' },
    { name: 'Hawaii Mauna Kea Observatory', country: 'USA (Hawaii)', lat: 19.82, lng: -155.47, continent: 'Oceania' },
  ];
  const reg = regions[Math.floor(Math.random() * regions.length)];
  // Add micro-offset to guarantee unique coordinates every time
  const offsetLat = (Math.random() - 0.5) * 0.4;
  const offsetLng = (Math.random() - 0.5) * 0.4;

  return createCustomEarthLocation(
    reg.name,
    reg.lat + offsetLat,
    reg.lng + offsetLng,
    reg.country,
    reg.continent
  );
}
