import { BranchLocation, BrandSuggestion, ServicePreset, WorkshopJob } from "./workshopTypes";

export const WORKSHOP_BRANCHES: BranchLocation[] = [
  {
    id: "branch-kammanahalli",
    name: "Kammanahalli Main (Nehru Rd)",
    shortName: "Kammanahalli",
    area: "Kammanahalli, Bengaluru",
    isMain: true,
  },
  {
    id: "branch-indiranagar",
    name: "Indiranagar Express Bay (100ft Rd)",
    shortName: "Indiranagar",
    area: "Indiranagar, Bengaluru",
    isMain: false,
  },
  {
    id: "branch-whitefield",
    name: "Whitefield Tech Hub (ITPB Main)",
    shortName: "Whitefield",
    area: "Whitefield, Bengaluru",
    isMain: false,
  },
  {
    id: "branch-hebbal",
    name: "Hebbal Highway Center (Outer Ring)",
    shortName: "Hebbal",
    area: "Hebbal, Bengaluru",
    isMain: false,
  },
];

export const CAR_BRANDS: BrandSuggestion[] = [
  {
    name: "Maruti Suzuki",
    type: "car",
    popularModels: ["Swift", "Baleno", "Brezza", "Ertiga", "Dzire", "WagonR", "Grand Vitara", "Alto K10", "Fronx", "Jimny"],
  },
  {
    name: "Hyundai",
    type: "car",
    popularModels: ["Creta", "i20", "Venue", "Verna", "Tucson", "Grand i10 Nios", "Exter", "Alcazar", "Ioniq 5"],
  },
  {
    name: "Tata Motors",
    type: "car",
    popularModels: ["Nexon", "Punch", "Harrier", "Safari", "Altroz", "Tiago", "Tigor", "Curvv", "Nexon EV"],
  },
  {
    name: "Mahindra",
    type: "car",
    popularModels: ["Thar", "Scorpio-N", "Scorpio Classic", "XUV700", "XUV300 / XUV 3XO", "Bolero Neo", "XUV400"],
  },
  {
    name: "Toyota",
    type: "car",
    popularModels: ["Innova Crysta", "Innova Hycross", "Fortuner", "Urban Cruiser Hyryder", "Glanza", "Hilux", "Camry"],
  },
  {
    name: "Honda",
    type: "car",
    popularModels: ["City 5th Gen", "Amaze", "Elevate", "Civic", "Jazz", "WR-V"],
  },
  {
    name: "Kia",
    type: "car",
    popularModels: ["Seltos", "Sonet", "Carens", "EV6", "Carnival"],
  },
  {
    name: "Volkswagen",
    type: "car",
    popularModels: ["Virtus", "Taigun", "Polo GT", "Vento", "Tiguan"],
  },
  {
    name: "Skoda",
    type: "car",
    popularModels: ["Slavia", "Kushaq", "Octavia", "Superb", "Kodiaq", "Rapid"],
  },
  {
    name: "BMW",
    type: "car",
    popularModels: ["3 Series", "5 Series", "X1", "X3", "X5", "M340i", "i4"],
  },
  {
    name: "Mercedes-Benz",
    type: "car",
    popularModels: ["C-Class", "E-Class", "GLA", "GLC", "GLE", "A-Class Limousine"],
  },
  {
    name: "Audi",
    type: "car",
    popularModels: ["A4", "A6", "Q3", "Q5", "Q7", "RS5"],
  },
  {
    name: "MG Motor",
    type: "car",
    popularModels: ["Hector", "Astor", "ZS EV", "Comet EV", "Gloster"],
  },
  {
    name: "Renault",
    type: "car",
    popularModels: ["Kwid", "Kiger", "Triber", "Duster"],
  },
  {
    name: "Nissan",
    type: "car",
    popularModels: ["Magnite", "Kicks"],
  },
  {
    name: "Jeep",
    type: "car",
    popularModels: ["Compass", "Meridian", "Wrangler"],
  },
];

export const BIKE_BRANDS: BrandSuggestion[] = [
  {
    name: "Royal Enfield",
    type: "bike",
    popularModels: ["Classic 350", "Hunter 350", "Bullet 350", "Meteor 350", "Himalayan 450", "Interceptor 650", "Continental GT 650", "Shotgun 650", "Guerrilla 450"],
  },
  {
    name: "Yamaha",
    type: "bike",
    popularModels: ["R15 V4", "MT-15 V2", "FZ-S V4", "Aerox 155", "RayZR 125", "Fascino 125", "R3", "FZ-X"],
  },
  {
    name: "Honda 2-Wheelers",
    type: "bike",
    popularModels: ["Activa 6G / 125", "Shine 125", "SP 125", "Unicorn", "CB350 H'ness", "CB350RS", "Dio 125", "Hornet 2.0", "Transalp"],
  },
  {
    name: "Bajaj Auto",
    type: "bike",
    popularModels: ["Pulsar 150 / 200", "Pulsar NS200 / NS400", "Pulsar RS200", "Dominar 400", "Dominar 250", "Platina 110", "Chetak EV", "Avenger 220"],
  },
  {
    name: "TVS Motor",
    type: "bike",
    popularModels: ["Apache RTR 160 4V", "Apache RTR 200 4V", "Apache RR 310", "Apache RTR 310", "Jupiter 125", "Ntorq 125", "Raider 125", "Ronin 225", "iQube EV"],
  },
  {
    name: "KTM",
    type: "bike",
    popularModels: ["Duke 390", "Duke 250", "Duke 200", "RC 390", "RC 200", "390 Adventure"],
  },
  {
    name: "Suzuki 2-Wheelers",
    type: "bike",
    popularModels: ["Access 125", "Gixxer SF 250", "Gixxer 150", "Burgman Street 125", "V-Strom SX 250", "Avenis 125"],
  },
  {
    name: "Hero MotoCorp",
    type: "bike",
    popularModels: ["Splendor Plus", "HF Deluxe", "Glamour Xtec", "Passion Plus", "Xpulse 200 4V", "Xtreme 160R 4V", "Mavrick 440", "Vida V1"],
  },
  {
    name: "Jawa / Yezdi",
    type: "bike",
    popularModels: ["Jawa 42 / 42 Bobber", "Jawa 350", "Yezdi Roadster", "Yezdi Scrambler", "Yezdi Adventure"],
  },
  {
    name: "Triumph",
    type: "bike",
    popularModels: ["Speed 400", "Scrambler 400X", "Street Triple 765", "Tiger 900", "Trident 660"],
  },
  {
    name: "Kawasaki",
    type: "bike",
    popularModels: ["Ninja 300", "Ninja 500", "Ninja ZX-4R", "Ninja 650", "Z650", "Z900"],
  },
  {
    name: "Ather Energy",
    type: "bike",
    popularModels: ["Ather 450X Gen 3", "Ather 450S", "Ather Apex", "Ather Rizta"],
  },
  {
    name: "Ola Electric",
    type: "bike",
    popularModels: ["Ola S1 Pro Gen 2", "Ola S1 Air", "Ola S1 X+"],
  },
];

export const PRESET_SERVICES: ServicePreset[] = [
  {
    id: "tig-welding",
    label: "TIG Welding & Fabrication",
    category: "welding",
    vehicleType: "both",
    defaultPrice: 850,
    popular: true,
  },
  {
    id: "rim-bend-removal",
    label: "Rim Bend Removal & Truing",
    category: "rim",
    vehicleType: "both",
    defaultPrice: 750,
    popular: true,
  },
  {
    id: "tyre-change",
    label: "Tyre Change & Bead Seal",
    category: "tyre",
    vehicleType: "both",
    defaultPrice: 350,
    popular: true,
  },
  {
    id: "wheel-alignment-3d",
    label: "3D Computerized Laser Alignment",
    category: "alignment",
    vehicleType: "car",
    defaultPrice: 650,
    popular: true,
  },
  {
    id: "wheel-balancing",
    label: "Dynamic High-Speed Wheel Balancing",
    category: "alignment",
    vehicleType: "both",
    defaultPrice: 450,
    popular: true,
  },
  {
    id: "handle-fork-alignment",
    label: "Fork Straightening & T-Stem Alignment",
    category: "alignment",
    vehicleType: "bike",
    defaultPrice: 600,
    popular: true,
  },
  {
    id: "suspension-overhaul",
    label: "Suspension Checks & Damper Overhaul",
    category: "suspension",
    vehicleType: "both",
    defaultPrice: 1800,
    popular: false,
  },
  {
    id: "alloy-crack-weld",
    label: "Alloy Rim Crack TIG Arc Welding",
    category: "welding",
    vehicleType: "both",
    defaultPrice: 1400,
    popular: true,
  },
];

// Pure empty initial state - all data is loaded dynamically from Supabase database
export const SEED_WORKSHOP_JOBS: WorkshopJob[] = [];
