export interface Expert {
  id: string;
  name: string;
  role: string;
  emoji: string;
  focus: string[];
  category: string;
  tier?: "lead" | "designer" | "technical" | "advisor";
  signature?: string;
}

/** Duże grono ekspertów — projekt Oaza Spokoju */
export const domainExperts: Expert[] = [
  { id: "landscape", name: "Anna K.", role: "Architekt krajobrazu", emoji: "🌿", category: "Krajobraz", tier: "lead", focus: ["ogród", "kaskada", "drenaż", "taras"], signature: "czy dom siada naturalnie w działce" },
  { id: "energy", name: "Tomasz W.", role: "Architekt energetyczny PHPP", emoji: "⚡", category: "Energia", tier: "lead", focus: ["izolacja", "HST", "poddasze", "PV"], signature: "komfort zimowy i letni bez przewymiarowania" },
  { id: "interior", name: "Yuki M.", role: "Projektant Japandi", emoji: "🏠", category: "Wnętrza", tier: "lead", focus: ["wnętrza", "materiały", "oś lasu"], signature: "spokój, proporcje, naturalne materiały" },
  { id: "hvac", name: "Piotr S.", role: "Inżynier instalacji", emoji: "🔧", category: "Technika", tier: "technical", focus: ["rekuperacja", "piony", "kotłownia"], signature: "czy instalacje da się wykonać bez walki z układem" },
  { id: "urban", name: "Magda L.", role: "Urbanistka MPZP", emoji: "📋", category: "Prawo", tier: "lead", focus: ["odległości", "linia zabudowy", "zgodność"], signature: "zgodność z planem i granicami" },
  { id: "acoustic", name: "Jan R.", role: "Akustyk budowlany", emoji: "🔇", category: "Komfort", tier: "technical", focus: ["ściana N", "garaż", "sypialnie"], signature: "cisza od drogi i sąsiadów" },
  { id: "garden", name: "Ewa P.", role: "Ogrodnik krajobrazowy", emoji: "🌳", category: "Krajobraz", tier: "technical", focus: ["nasłonecznienie", "PsIV", "nawodnienie"], signature: "realny ogród na glebie PsIV" },
  { id: "daylight", name: "Karol D.", role: "Specjalista światła", emoji: "☀️", category: "Komfort", tier: "technical", focus: ["okna", "rolety", "biuro N"], signature: "światło dzienne bez przegrzewania" },
  { id: "cost", name: "Marek B.", role: "Kosztorysant", emoji: "💰", category: "Budżet", tier: "lead", focus: ["budżet", "value engineering"], signature: "największy efekt za najmniejsze pieniądze" },
  { id: "geo", name: "Irena G.", role: "Geotechnik", emoji: "⛰️", category: "Teren", tier: "lead", focus: ["fundamenty", "NMT", "woda", "badania"], signature: "grunt, woda, spadki i ryzyko wykopów" },

  { id: "flw", name: "Frank Lloyd Wright", role: "Persona: dom organiczny", emoji: "🏡", category: "Top projektanci", tier: "designer", focus: ["organiczność", "horyzont", "relacja z terenem"], signature: "dom jako część krajobrazu" },
  { id: "murcutt", name: "Glenn Murcutt", role: "Persona: lekki dom klimatyczny", emoji: "🌬️", category: "Top projektanci", tier: "designer", focus: ["przewietrzanie", "cień", "lekkość"], signature: "dotknąć ziemi lekko" },
  { id: "ando", name: "Tadao Ando", role: "Persona: światło i cisza", emoji: "◻️", category: "Top projektanci", tier: "designer", focus: ["światło", "beton", "oś widokowa"], signature: "cisza, światło, precyzyjna ściana" },
  { id: "zumthor", name: "Peter Zumthor", role: "Persona: atmosfera domu", emoji: "🪵", category: "Top projektanci", tier: "designer", focus: ["materiał", "zapach", "akustyka"], signature: "atmosfera ważniejsza niż efekt renderu" },
  { id: "kundig", name: "Olson Kundig", role: "Persona: dom w naturze", emoji: "🪟", category: "Top projektanci", tier: "designer", focus: ["HST", "stal", "krajobraz"], signature: "duże otwarcia, ale z mechaniką i logiką" },
  { id: "ban", name: "Shigeru Ban", role: "Persona: prostota konstrukcji", emoji: "📐", category: "Top projektanci", tier: "designer", focus: ["konstrukcja", "moduł", "oszczędność"], signature: "lekka konstrukcja i humanistyczna prostota" },

  { id: "architect-lead", name: "Natalia R.", role: "Architekt prowadzący adaptację", emoji: "✏️", category: "Architektura", tier: "lead", focus: ["bryła", "program", "PZT"], signature: "czy decyzje są spójne z celem inwestora" },
  { id: "architect-local", name: "Robert C.", role: "Architekt lokalny Cieszyn", emoji: "🏘️", category: "Architektura", tier: "advisor", focus: ["lokalny kontekst", "urzędowanie", "MPZP"], signature: "co przejdzie w realnym urzędzie" },
  { id: "structure", name: "Krzysztof M.", role: "Konstruktor", emoji: "🏗️", category: "Technika", tier: "technical", focus: ["stropy", "HST", "dach"], signature: "czy piękna kreska ma sens konstrukcyjny" },
  { id: "roof", name: "Alicja D.", role: "Ekspert dachu i poddasza", emoji: "⛩️", category: "Technika", tier: "technical", focus: ["dach", "kalenica", "okapy"], signature: "prosty dach bez kosztownych pułapek" },
  { id: "facade", name: "Michał F.", role: "Projektant elewacji", emoji: "🧱", category: "Architektura", tier: "advisor", focus: ["elewacja", "rytm okien", "proporcje"], signature: "czy elewacja będzie spokojna za 20 lat" },
  { id: "kitchen", name: "Ola Z.", role: "Projektant kuchni", emoji: "🍳", category: "Wnętrza", tier: "technical", focus: ["kuchnia", "spiżarnia", "jadalnia"], signature: "codzienna ergonomia, nie tylko katalog" },
  { id: "bath", name: "Beata N.", role: "Projektant łazienek", emoji: "🚿", category: "Wnętrza", tier: "technical", focus: ["łazienki", "piony", "pralnia"], signature: "krótkie instalacje i łatwe sprzątanie" },
  { id: "storage", name: "Adam H.", role: "Ekspert przechowywania", emoji: "📦", category: "Wnętrza", tier: "advisor", focus: ["garderoby", "garaż", "schowki"], signature: "każdy sezon ma swoje miejsce" },
  { id: "fireplace", name: "Paweł T.", role: "Kominki i atmosfera", emoji: "🔥", category: "Komfort", tier: "advisor", focus: ["kominek", "ciąg", "salon"], signature: "ognisko bez konfliktu z rekuperacją" },
  { id: "stairs", name: "Monika S.", role: "Schody i komunikacja", emoji: "↕️", category: "Wnętrza", tier: "technical", focus: ["schody", "hol", "komunikacja"], signature: "dom bez martwych metrów korytarza" },
  { id: "accessibility", name: "Dorota P.", role: "Dostępność i starzenie się domu", emoji: "♿", category: "Komfort", tier: "advisor", focus: ["parter", "gabinet", "prysznic"], signature: "dom wygodny za 30 lat" },
  { id: "privacy", name: "Marcin J.", role: "Prywatność i widoki", emoji: "👁️", category: "Komfort", tier: "advisor", focus: ["48R", "okna", "taras"], signature: "widok na las bez widoku od sąsiada" },
  { id: "water", name: "Łukasz O.", role: "Odwodnienie i retencja", emoji: "💧", category: "Teren", tier: "technical", focus: ["deszczówka", "drenaż", "spływ"], signature: "woda ma mieć projekt, nie przypadek" },
  { id: "surveyor", name: "Ewelina G.", role: "Geodeta", emoji: "📍", category: "Teren", tier: "technical", focus: ["granice", "rzędne", "osnowa"], signature: "co jest pewne, a co tylko z mapy online" },
  { id: "soil-lab", name: "Andrzej W.", role: "Laboratorium gruntu", emoji: "🧪", category: "Teren", tier: "technical", focus: ["gliny", "woda", "nośność"], signature: "fundament zaczyna się od próbek" },
  { id: "solar", name: "Sara E.", role: "PV i zacienienie", emoji: "🔋", category: "Energia", tier: "technical", focus: ["PV", "dach", "cień"], signature: "dach ma zarabiać i nie psuć bryły" },
  { id: "heatpump", name: "Grzegorz P.", role: "Pompa ciepła", emoji: "♨️", category: "Energia", tier: "technical", focus: ["PC", "hałas", "miejsce"], signature: "jednostka zewnętrzna nie może rządzić ogrodem" },
  { id: "smart-home", name: "Rafał I.", role: "Smart home", emoji: "📱", category: "Technika", tier: "advisor", focus: ["rolety", "czujniki", "sceny"], signature: "automatyka ma upraszczać życie" },
  { id: "security", name: "Kinga B.", role: "Bezpieczeństwo domu", emoji: "🛡️", category: "Technika", tier: "advisor", focus: ["wejście", "widoczność", "alarm"], signature: "bezpieczny dom bez efektu bunkra" },
  { id: "contractor", name: "Wojciech K.", role: "Kierownik budowy", emoji: "👷", category: "Budżet", tier: "technical", focus: ["wykonalność", "kolejność", "ryzyko"], signature: "czy ekipa zrobi to bez improwizacji" },
  { id: "procurement", name: "Joanna L.", role: "Zakupy i materiały", emoji: "🧾", category: "Budżet", tier: "advisor", focus: ["dostępność", "zamienniki", "terminy"], signature: "piękny detal musi być kupowalny" },
  { id: "law", name: "Mec. Marta P.", role: "Prawo budowlane", emoji: "⚖️", category: "Prawo", tier: "technical", focus: ["WT", "zgłoszenia", "uzgodnienia"], signature: "ryzyka formalne przed złożeniem projektu" },
  { id: "mpzp", name: "Hubert U.", role: "Specjalista MPZP", emoji: "🗺️", category: "Prawo", tier: "technical", focus: ["67MN", "linie zabudowy", "wskaźniki"], signature: "symbol planu to dopiero początek" },
  { id: "fire-safety", name: "Eryk C.", role: "Ppoż. i odległości", emoji: "🚒", category: "Prawo", tier: "technical", focus: ["4 m", "granice", "ściany"], signature: "odległość od granicy bez domysłów" },
  { id: "investor-ux", name: "Lena Q.", role: "UX decyzji inwestora", emoji: "🧭", category: "Strategia", tier: "advisor", focus: ["warianty", "porównanie", "decyzje"], signature: "aplikacja ma pomagać wybrać, nie mnożyć chaos" },
  { id: "wellbeing", name: "Maja C.", role: "Biophilic wellbeing", emoji: "🍃", category: "Strategia", tier: "advisor", focus: ["sen", "światło", "natura"], signature: "dom ma regulować układ nerwowy" },
  { id: "resale", name: "Filip A.", role: "Wartość odsprzedaży", emoji: "📈", category: "Strategia", tier: "advisor", focus: ["uniwersalność", "rynek", "koszty"], signature: "osobisty dom, ale nie zbyt osobliwy" },
];

/** Wzorce UX 2026 od produktów referencyjnych (Figma AI, Morpholio, Houzz Pro, Linear, Notion AI, RoomGPT, ArchDaily, Pinterest Lens, Miro, Cursor) */
export const productPatterns2026 = [
  "Panel ekspertów z oceną 1–10 i jedną kluczową zmianą",
  "Import linku + pole intencji (np. lustrzane odbicie)",
  "Warianty projektu zapisywane lokalnie z historią",
  "Podgląd transformacji na mapie działki w czasie rzeczywistym",
  "Recenzja wielu ekspertów równolegle (batch review)",
  "Porównanie wariant vs baseline obok siebie",
  "Quick actions: mirror, shift, rotate intent",
  "Referencje z internetu jako kontekst recenzji",
  "Eksport wariantu jako JSON do architekta",
  "Mobile-first przełączanie paneli",
  "Kategorie ekspertów z filtrem: architektura, teren, energia, budżet, prawo",
  "Karty wizualizacji: twarde dane, ryzyka, następna decyzja",
  "Persona review: znany projektant jako soczewka, nie autorytet techniczny",
  "Overlay geodezyjny: EGiB, NMT, setbacks i sąsiedzi na jednym widoku",
];

export const expertCategories = Array.from(new Set(domainExperts.map((expert) => expert.category)));

export const topDesignerExperts = domainExperts.filter((expert) => expert.category === "Top projektanci");
