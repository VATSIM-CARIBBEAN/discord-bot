// local_library/trivia_questions.js

const QUESTIONS = [
  // Airports
  {
    question: "Which Caribbean airport has the famous approach over Maho Beach where aircraft pass just meters above beachgoers?",
    options: {
      A: "TFFF – Martinique Aimé Césaire Intl",
      B: "TJSJ – San Juan Luis Muñoz Marín Intl",
      C: "TNCM – Princess Juliana Intl",
      D: "MKJP – Norman Manley Intl"
    },
    correctAnswer: "C",
    explanation: "Princess Juliana International Airport in St. Maarten is world-famous for its approach over Maho Beach on Runway 10, where large aircraft pass extremely low over sunbathers."
  },
  {
    question: "What is the IATA code for Piarco International Airport in Trinidad?",
    options: {
      A: "POS",
      B: "TRI",
      C: "PIA",
      D: "TTD"
    },
    correctAnswer: "A",
    explanation: "Piarco International Airport uses the IATA code POS, which stands for Port of Spain, the capital of Trinidad and Tobago."
  },
  {
    question: "Which airport serves as the primary hub for Barbados?",
    options: {
      A: "TBPB – Grantley Adams Intl",
      B: "TDPD – Douglas-Charles Airport",
      C: "TLPL – Hewanorra Intl",
      D: "TVSA – Argyle Intl"
    },
    correctAnswer: "A",
    explanation: "Grantley Adams International Airport (TBPB) is Barbados' only commercial airport and serves as a major hub for the Eastern Caribbean."
  },
  {
    question: "What is unique about the runway at Juancho E. Yrausquin Airport (TNCS) in Saba?",
    options: {
      A: "It's the longest runway in the Caribbean",
      B: "It's the shortest commercial runway in the world",
      C: "It's built entirely over water",
      D: "It has no control tower"
    },
    correctAnswer: "B",
    explanation: "Juancho E. Yrausquin Airport has the shortest commercial runway in the world at only 1,300 feet (400m), flanked by cliffs on both sides."
  },
  {
    question: "Which Caribbean airport has the ICAO code MKJP?",
    options: {
      A: "Sangster International Airport",
      B: "Norman Manley International Airport",
      C: "Owen Roberts International Airport",
      D: "Ian Fleming International Airport"
    },
    correctAnswer: "B",
    explanation: "MKJP is Norman Manley International Airport in Kingston, Jamaica. Sangster International in Montego Bay uses MKJS."
  },

  // Airlines
  {
    question: "Which airline is the flag carrier of Trinidad and Tobago?",
    options: {
      A: "LIAT",
      B: "Caribbean Airlines",
      C: "Bahamasair",
      D: "Air Jamaica"
    },
    correctAnswer: "B",
    explanation: "Caribbean Airlines is the flag carrier of Trinidad and Tobago, headquartered at Piarco International Airport. It was formed in 2006 and later merged with Air Jamaica."
  },
  {
    question: "What does LIAT stand for?",
    options: {
      A: "Low Islands Air Transport",
      B: "Leeward Islands Air Transport",
      C: "Lesser Islands Aviation Transit",
      D: "Linking Islands Across Territory"
    },
    correctAnswer: "B",
    explanation: "LIAT stands for Leeward Islands Air Transport. The airline was a major inter-island carrier in the Eastern Caribbean before ceasing operations in 2020."
  },
  {
    question: "Which airline operates from Pointe-à-Pitre, Guadeloupe as its main hub?",
    options: {
      A: "Air Caraïbes",
      B: "Air France",
      C: "Corsair",
      D: "French Bee"
    },
    correctAnswer: "A",
    explanation: "Air Caraïbes is based in Guadeloupe and operates throughout the French Caribbean and to metropolitan France, with its main hub at Pointe-à-Pitre (TFFR)."
  },
  {
    question: "What is the IATA code for Caribbean Airlines?",
    options: {
      A: "CA",
      B: "BW",
      C: "CR",
      D: "CB"
    },
    correctAnswer: "B",
    explanation: "Caribbean Airlines uses the IATA code BW and callsign 'Caribbean'. The airline operates an all-Boeing fleet including 737s and 767s."
  },
  {
    question: "Which Caribbean airline ceased operations in 2015 after 24 years of service?",
    options: {
      A: "BWIA West Indies Airways",
      B: "Air Jamaica",
      C: "Winair",
      D: "Insel Air"
    },
    correctAnswer: "D",
    explanation: "Insel Air, based in Curaçao, ceased operations in 2015. The airline operated MD-80s and Fokker 50s throughout the Dutch Caribbean."
  },

  // Routes & Geography
  {
    question: "Which Caribbean FIR (Flight Information Region) is the largest by area?",
    options: {
      A: "Kingston FIR",
      B: "San Juan FIR",
      C: "Havana FIR",
      D: "Piarco FIR"
    },
    correctAnswer: "C",
    explanation: "Havana FIR (MUFH) is the largest Caribbean FIR, covering Cuba and surrounding oceanic airspace in the northwest Caribbean."
  },
  {
    question: "What is the busiest international route from Trinidad?",
    options: {
      A: "Port of Spain to Miami",
      B: "Port of Spain to New York JFK",
      C: "Port of Spain to Toronto",
      D: "Port of Spain to London"
    },
    correctAnswer: "C",
    explanation: "The Port of Spain (POS) to Toronto (YYZ) route is extremely busy due to the large Trinidadian diaspora in Canada, with multiple daily frequencies."
  },
  {
    question: "Which island nation has the ICAO prefix 'TB'?",
    options: {
      A: "Trinidad and Tobago",
      B: "Barbados",
      C: "Bahamas",
      D: "Bermuda"
    },
    correctAnswer: "B",
    explanation: "Barbados uses the ICAO prefix 'TB'. Examples include TBPB (Grantley Adams International). Trinidad uses 'TT', Bahamas uses 'MY', and Bermuda uses 'TX'."
  },
  {
    question: "What is the capital of Antigua and Barbuda?",
    options: {
      A: "Bridgetown",
      B: "Castries",
      C: "St. John's",
      D: "Kingstown"
    },
    correctAnswer: "C",
    explanation: "St. John's is the capital of Antigua and Barbuda. The main airport is V.C. Bird International (TAPA), named after the nation's first Prime Minister."
  },
  {
    question: "Which two Caribbean islands share the same landmass but have different controlling nations?",
    options: {
      A: "Trinidad and Tobago",
      B: "Antigua and Barbuda",
      C: "Saint Martin/Sint Maarten",
      D: "Saint Kitts and Nevis"
    },
    correctAnswer: "C",
    explanation: "Saint Martin (French side, TFFG) and Sint Maarten (Dutch side, TNCM) share the same island but are controlled by France and the Netherlands respectively."
  },

  // History & Unique Facts
  {
    question: "Which airline was Trinidad and Tobago's former flag carrier before Caribbean Airlines?",
    options: {
      A: "Trinidad Airways",
      B: "BWIA West Indies Airways",
      C: "Air Trinidad",
      D: "West Indies Air"
    },
    correctAnswer: "B",
    explanation: "BWIA (British West Indian Airways) was Trinidad and Tobago's flag carrier from 1940 to 2006. It was replaced by Caribbean Airlines when the government formed a new airline."
  },
  {
    question: "What ATC challenge is unique to Princess Juliana Airport (TNCM)?",
    options: {
      A: "High terrain on all sides",
      B: "Extreme crosswinds year-round",
      C: "Runway threshold displacement over a public road",
      D: "No radar coverage"
    },
    correctAnswer: "C",
    explanation: "Princess Juliana's Runway 10 threshold begins immediately after a public beach road, creating unique coordination challenges. Aircraft on approach pass extremely low over vehicles and beachgoers."
  },
  {
    question: "Which Caribbean airport was completely destroyed by Hurricane Irma in 2017 and rebuilt?",
    options: {
      A: "TIST – Cyril E. King Airport",
      B: "TNCM – Princess Juliana Intl",
      C: "TQPF – Clayton J. Lloyd Intl",
      D: "TUPJ – Terrance B. Lettsome Intl"
    },
    correctAnswer: "B",
    explanation: "Princess Juliana International Airport in Sint Maarten suffered catastrophic damage during Hurricane Irma in September 2017. The terminal was destroyed and required extensive rebuilding."
  },
  {
    question: "What is the highest elevation airport in the Caribbean?",
    options: {
      A: "MKJS – Sangster Intl, Jamaica",
      B: "MDCY – Samaná El Catey Intl, Dominican Republic",
      C: "MUCF – Cienfuegos, Cuba",
      D: "TNCE – F.D. Roosevelt Airport, St. Eustatius"
    },
    correctAnswer: "D",
    explanation: "F.D. Roosevelt Airport (TNCE) on St. Eustatius sits at approximately 1,312 feet (400m) elevation, making it one of the highest airports in the Caribbean region."
  },
  {
    question: "Which Caribbean territory uses the radio callsign prefix '8P' for aircraft registration?",
    options: {
      A: "Bahamas",
      B: "Barbados",
      C: "Bermuda",
      D: "British Virgin Islands"
    },
    correctAnswer: "B",
    explanation: "Barbados uses the aircraft registration prefix 8P. For example, a Caribbean Airlines aircraft registered in Barbados would be 8P-XXX."
  },

  // More Technical/ATC Questions
  {
    question: "Which oceanic control area borders the Caribbean region to the east?",
    options: {
      A: "New York Oceanic",
      B: "Houston Oceanic",
      C: "San Juan CERAP",
      D: "Atlantico FIR"
    },
    correctAnswer: "D",
    explanation: "Atlantico FIR (operated by Spain) borders the eastern Caribbean, handling oceanic traffic crossing the Atlantic between Africa/Europe and the Caribbean."
  },
  {
    question: "What is the primary approach type used at Piarco International Airport (TTPP)?",
    options: {
      A: "ILS to both runways",
      B: "RNAV only",
      C: "VOR/DME",
      D: "Visual approaches only"
    },
    correctAnswer: "A",
    explanation: "Piarco International Airport is equipped with ILS approaches to both Runway 10 and Runway 28, providing precision approaches in either direction."
  },
  {
    question: "Which Caribbean airport has the longest runway?",
    options: {
      A: "TJSJ – San Juan, Puerto Rico (9,800 ft)",
      B: "MDSD – Las Américas, Dominican Republic (10,991 ft)",
      C: "MKJP – Norman Manley, Jamaica (8,911 ft)",
      D: "TTPP – Piarco, Trinidad (10,200 ft)"
    },
    correctAnswer: "B",
    explanation: "Las Américas International Airport (MDSD) in Santo Domingo has the longest runway in the Caribbean at 10,991 feet (3,350m) on Runway 17/35."
  },
  {
    question: "What frequency is commonly used for Caribbean FSS (Flight Service Station)?",
    options: {
      A: "121.5 MHz",
      B: "122.2 MHz",
      C: "126.7 MHz",
      D: "Varies by FIR"
    },
    correctAnswer: "D",
    explanation: "Caribbean FSS frequencies vary by FIR. For example, Piarco FSS (TTZO_FSS) uses different frequencies than San Juan or Kingston areas. Always check NOTAMs and charts for current frequencies."
  },
  {
    question: "Which VATSIM division covers the Caribbean region?",
    options: {
      A: "Americas Division",
      B: "VATCAR – Caribbean Division",
      C: "VATUSA – USA Division",
      D: "VATSCA – Scandinavian Division"
    },
    correctAnswer: "B",
    explanation: "VATCAR (VATSIM Caribbean Division) covers all Caribbean FIRs including Havana, Kingston, Nassau, Port-au-Prince, San Juan, Santo Domingo, Piarco, and Curacao."
  },

  // ---- ADDITIONAL QUESTIONS ----
  {
    question: "What is the IATA code for Grantley Adams International Airport in Barbados?",
    options: {
      A: "BGI",
      B: "GEO",
      C: "ANU",
      D: "UVF"
    },
    correctAnswer: "A",
    explanation: "Grantley Adams International Airport uses the IATA code BGI."
  },
  {
    question: "Which airport uses the ICAO code TAPA?",
    options: {
      A: "V.C. Bird International, Antigua",
      B: "Hewanorra International, St. Lucia",
      C: "Pointe-à-Pitre, Guadeloupe",
      D: "José Martí International, Cuba"
    },
    correctAnswer: "A",
    explanation: "TAPA is V.C. Bird International Airport serving St. John's, Antigua."
  },
  {
    question: "Which airline is the national carrier of The Bahamas?",
    options: {
      A: "Bahamasair",
      B: "Cayman Airways",
      C: "interCaribbean Airways",
      D: "Winair"
    },
    correctAnswer: "A",
    explanation: "Bahamasair is the flag carrier airline of The Bahamas."
  },
  {
    question: "What is the IATA code for San Juan Luis Muñoz Marín International Airport?",
    options: {
      A: "POS",
      B: "SJU",
      C: "KIN",
      D: "GCM"
    },
    correctAnswer: "B",
    explanation: "San Juan uses the IATA code SJU."
  },
  {
    question: "Which Caribbean airport serves Castries and uses the IATA code SLU?",
    options: {
      A: "TLPL – Hewanorra International",
      B: "TLPC – George F. L. Charles Airport",
      C: "TFFF – Fort-de-France",
      D: "TBPB – Grantley Adams"
    },
    correctAnswer: "B",
    explanation: "George F. L. Charles Airport (TLPC) near Castries uses IATA code SLU."
  },
  {
    question: "Cayman Airways is based at which airport?",
    options: {
      A: "MWCR – Owen Roberts International",
      B: "MYNN – Lynden Pindling International",
      C: "MKJS – Sangster International",
      D: "TUPJ – Terrance B. Lettsome"
    },
    correctAnswer: "A",
    explanation: "Cayman Airways is based in Grand Cayman at Owen Roberts International (MWCR)."
  },
  {
    question: "What is the callsign of Bahamasair?",
    options: {
      A: "BAHAMAS",
      B: "BEE-LINE",
      C: "CARIBBEAN",
      D: "ISLANDER"
    },
    correctAnswer: "A",
    explanation: "Bahamasair operates with the radiotelephony callsign “BAHAMAS.”"
  },
  {
    question: "Which island’s main airport uses the ICAO code TFFJ and is famous for a steep hill departure?",
    options: {
      A: "Saba",
      B: "St. Barthélemy",
      C: "Montserrat",
      D: "Anguilla"
    },
    correctAnswer: "B",
    explanation: "St. Barthélemy Airport (TFFJ) has a short runway with a downhill approach over a hill."
  },
  {
    question: "Which airline’s IATA code is KX?",
    options: {
      A: "Cayman Airways",
      B: "Bahamasair",
      C: "Winair",
      D: "LIAT"
    },
    correctAnswer: "A",
    explanation: "Cayman Airways uses the IATA code KX."
  },
  {
    question: "The ICAO prefix 'MD' corresponds to which country?",
    options: {
      A: "Dominican Republic",
      B: "Dominica",
      C: "Montserrat",
      D: "Martinique"
    },
    correctAnswer: "A",
    explanation: "Airports in the Dominican Republic use the ICAO prefix MD (e.g., MDSD, MDPC)."
  },
  {
    question: "Which airport is known by the IATA code MBJ?",
    options: {
      A: "Norman Manley Intl, Kingston",
      B: "Sangster Intl, Montego Bay",
      C: "Owen Roberts Intl, Grand Cayman",
      D: "Lynden Pindling Intl, Nassau"
    },
    correctAnswer: "B",
    explanation: "MBJ is Sangster International Airport in Montego Bay, Jamaica."
  },
  {
    question: "Winair primarily serves which subregion of the Caribbean?",
    options: {
      A: "Greater Antilles",
      B: "Leeward Islands",
      C: "Windward Islands",
      D: "Bahamas"
    },
    correctAnswer: "B",
    explanation: "Winair (WM) is based in Sint Maarten and focuses on the Leeward Islands."
  },
  {
    question: "Which airport serves St. Vincent and the Grenadines as its main international gateway?",
    options: {
      A: "TVSC – Canouan",
      B: "TVSB – J.F. Mitchell, Bequia",
      C: "TVSA – Argyle International",
      D: "TVSU – Union Island"
    },
    correctAnswer: "C",
    explanation: "Argyle International (TVSA) is the primary gateway for St. Vincent and the Grenadines."
  },
  {
    question: "What is the IATA code for Nassau’s Lynden Pindling International Airport?",
    options: {
      A: "GCM",
      B: "NAS",
      C: "FPO",
      D: "MIA"
    },
    correctAnswer: "B",
    explanation: "Nassau uses the IATA code NAS."
  },
  {
    question: "Cubana de Aviación uses which IATA code?",
    options: {
      A: "CU",
      B: "CB",
      C: "CA",
      D: "CN"
    },
    correctAnswer: "A",
    explanation: "Cubana’s IATA code is CU."
  },
  {
    question: "The ICAO code MTPP refers to which airport?",
    options: {
      A: "Port-au-Prince Toussaint Louverture Intl",
      B: "Punta Cana International",
      C: "Las Américas International",
      D: "Santo Domingo La Isabela"
    },
    correctAnswer: "A",
    explanation: "MTPP is Toussaint Louverture International in Port-au-Prince, Haiti."
  },
  {
    question: "Which airline’s callsign is “CAYMAN”?",
    options: {
      A: "Cayman Airways",
      B: "Caribbean Airlines",
      C: "Bahamasair",
      D: "InterCaribbean Airways"
    },
    correctAnswer: "A",
    explanation: "Cayman Airways uses the callsign “CAYMAN.”"
  },
  {
    question: "Which airport serves Tortola in the British Virgin Islands?",
    options: {
      A: "TIST – St. Thomas",
      B: "TUPJ – Terrance B. Lettsome",
      C: "TQPF – Anguilla",
      D: "TNCM – Sint Maarten"
    },
    correctAnswer: "B",
    explanation: "Terrance B. Lettsome International (TUPJ) serves Tortola."
  },
  {
    question: "The IATA code ANU belongs to which Caribbean airport?",
    options: {
      A: "Antigua – V.C. Bird Intl",
      B: "Aruba – Queen Beatrix Intl",
      C: "Anguilla – Clayton J. Lloyd",
      D: "Anegada – Auguste George"
    },
    correctAnswer: "A",
    explanation: "ANU is the IATA code for V.C. Bird International in Antigua."
  },
  {
    question: "Which country uses the ICAO prefix 'MU' for its airports?",
    options: {
      A: "Curaçao",
      B: "Cuba",
      C: "Cayman Islands",
      D: "Costa Rica"
    },
    correctAnswer: "B",
    explanation: "Cuban airports use the ICAO prefix MU (e.g., MUHA)."
  },
  {
    question: "What is the primary international airport of Curaçao?",
    options: {
      A: "TNCC – Hato International",
      B: "TNCB – Flamingo International",
      C: "TNCM – Princess Juliana",
      D: "TFFR – Pointe-à-Pitre"
    },
    correctAnswer: "A",
    explanation: "Hato International Airport (TNCC) serves Willemstad, Curaçao."
  },
  {
    question: "Which airline operates the callsign “WINDWARD”?",
    options: {
      A: "Winair",
      B: "LIAT",
      C: "Air Antilles",
      D: "Bahamasair"
    },
    correctAnswer: "A",
    explanation: "Winair’s callsign is “WINDWARD.”"
  },
  {
    question: "What is the IATA code for Punta Cana International Airport?",
    options: {
      A: "PUJ",
      B: "SDQ",
      C: "POP",
      D: "STI"
    },
    correctAnswer: "A",
    explanation: "Punta Cana’s IATA code is PUJ."
  },
  {
    question: "Which airport uses the ICAO code MDPC?",
    options: {
      A: "Santiago de los Caballeros",
      B: "Puerto Plata",
      C: "Punta Cana",
      D: "Santo Domingo – La Isabela"
    },
    correctAnswer: "C",
    explanation: "MDPC is Punta Cana International in the Dominican Republic."
  },
  {
    question: "interCaribbean Airways primarily focuses on which type of network?",
    options: {
      A: "Long-haul transatlantic",
      B: "Inter-island regional routes",
      C: "Ultra-long-haul cargo",
      D: "Polar operations"
    },
    correctAnswer: "B",
    explanation: "interCaribbean focuses on regional inter-island services across the northern and eastern Caribbean."
  },
  {
    question: "Which airport’s IATA code is GEO, often linked to Caribbean regional networks?",
    options: {
      A: "Paramaribo – Johan Adolf Pengel",
      B: "Georgetown – Cheddi Jagan",
      C: "Port of Spain – Piarco",
      D: "Bridgetown – Grantley Adams"
    },
    correctAnswer: "B",
    explanation: "Cheddi Jagan International Airport in Guyana uses the IATA code GEO."
  },
  {
    question: "What is the IATA code for Aruba’s Queen Beatrix International Airport?",
    options: {
      A: "AUA",
      B: "BON",
      C: "CUR",
      D: "SXM"
    },
    correctAnswer: "A",
    explanation: "Aruba’s international airport uses the IATA code AUA."
  },
  {
    question: "Which island is served by Flamingo International Airport (TNCB)?",
    options: {
      A: "Aruba",
      B: "Bonaire",
      C: "Curaçao",
      D: "Barbados"
    },
    correctAnswer: "B",
    explanation: "TNCB is Flamingo International on Bonaire."
  },
  {
    question: "Which airport has the ICAO code MKJS?",
    options: {
      A: "Norman Manley Intl",
      B: "Sangster Intl",
      C: "Ian Fleming Intl",
      D: "V.C. Bird Intl"
    },
    correctAnswer: "B",
    explanation: "MKJS is Sangster International in Montego Bay, Jamaica."
  },
  {
    question: "The IATA code GCM belongs to which airport?",
    options: {
      A: "Owen Roberts International – Grand Cayman",
      B: "Grantley Adams – Barbados",
      C: "Piarco – Trinidad",
      D: "Sangster – Montego Bay"
    },
    correctAnswer: "A",
    explanation: "GCM is Owen Roberts International on Grand Cayman."
  },
  {
    question: "Which airline’s IATA code is WM?",
    options: {
      A: "Winair",
      B: "Bahamasair",
      C: "LIAT",
      D: "Air Antilles"
    },
    correctAnswer: "A",
    explanation: "Winair uses the IATA code WM."
  },
  {
    question: "What is the ICAO code for St. Kitts’ Robert L. Bradshaw International Airport?",
    options: {
      A: "TKPK",
      B: "TKPN",
      C: "TFFR",
      D: "TNCE"
    },
    correctAnswer: "A",
    explanation: "St. Kitts uses TKPK; nearby Nevis uses TKPN."
  },
  {
    question: "Which airport serves Grenada as its main international gateway?",
    options: {
      A: "TBPB – Grantley Adams",
      B: "TGPY – Maurice Bishop Intl",
      C: "TLPL – Hewanorra",
      D: "TFFF – Aimé Césaire"
    },
    correctAnswer: "B",
    explanation: "Maurice Bishop International (TGPY) is Grenada’s primary airport."
  },
  {
    question: "Which Caribbean airport is known for a sloped runway ending at a beach in St. Barthélemy?",
    options: {
      A: "TNCS",
      B: "TFFJ",
      C: "TQPF",
      D: "TNCM"
    },
    correctAnswer: "B",
    explanation: "TFFJ (St. Barth) is famous for its hilltop approach and beach-end runway."
  },
  {
    question: "Air Caraïbes primarily connects the French Caribbean with which region?",
    options: {
      A: "North Africa",
      B: "Metropolitan France",
      C: "South America",
      D: "Pacific Islands"
    },
    correctAnswer: "B",
    explanation: "Air Caraïbes links the French Antilles with metropolitan France."
  },
  {
    question: "Which airport uses the IATA code KIN?",
    options: {
      A: "Montego Bay – Sangster",
      B: "Kingston – Norman Manley",
      C: "Negril – Aerodrome",
      D: "Ocho Rios – Ian Fleming"
    },
    correctAnswer: "B",
    explanation: "KIN is the IATA code for Norman Manley International in Kingston."
  },
  {
    question: "What is the ICAO prefix for airports in The Bahamas?",
    options: {
      A: "MY",
      B: "MB",
      C: "MU",
      D: "MD"
    },
    correctAnswer: "A",
    explanation: "Bahamas airports use the MY prefix, e.g., MYNN (Nassau)."
  },
  {
    question: "Which airline’s IATA code is UP?",
    options: {
      A: "Bahamasair",
      B: "Cayman Airways",
      C: "LIAT",
      D: "interCaribbean Airways"
    },
    correctAnswer: "A",
    explanation: "Bahamasair uses the IATA code UP."
  },
  {
    question: "Which airport serves as the primary gateway for Martinique?",
    options: {
      A: "TFFF – Aimé Césaire International",
      B: "TFFR – Le Raizet",
      C: "TFFJ – St. Barth",
      D: "TLPC – George F. L. Charles"
    },
    correctAnswer: "A",
    explanation: "Martinique’s main airport is Fort-de-France Aimé Césaire (TFFF)."
  },
  {
    question: "Which Caribbean island’s main airport is named Hewanorra International?",
    options: {
      A: "Barbados",
      B: "St. Lucia",
      C: "Grenada",
      D: "Dominica"
    },
    correctAnswer: "B",
    explanation: "Hewanorra International Airport (TLPL) serves southern St. Lucia."
  },
  {
    question: "The ICAO code MDST refers to which airport?",
    options: {
      A: "Santo Domingo",
      B: "Santiago de los Caballeros – Cibao Intl",
      C: "Puerto Plata",
      D: "Punta Cana"
    },
    correctAnswer: "B",
    explanation: "MDST is Cibao International in Santiago de los Caballeros."
  },
  {
    question: "Which airline’s callsign is “CARIBBEAN”?",
    options: {
      A: "Caribbean Airlines",
      B: "Bahamasair",
      C: "Cayman Airways",
      D: "LIAT"
    },
    correctAnswer: "A",
    explanation: "Caribbean Airlines uses the callsign “CARIBBEAN.”"
  },
  {
    question: "What is the IATA code for Tobago’s A.N.R. Robinson International Airport?",
    options: {
      A: "TAB",
      B: "POS",
      C: "EIS",
      D: "NEV"
    },
    correctAnswer: "A",
    explanation: "Tobago’s airport uses the IATA code TAB."
  },
  {
    question: "Which island’s main airport uses the ICAO code TDPD?",
    options: {
      A: "Dominican Republic",
      B: "Dominica",
      C: "St. Kitts",
      D: "St. Vincent"
    },
    correctAnswer: "B",
    explanation: "TDPD is Dominica’s Douglas–Charles Airport."
  },
  {
    question: "The IATA code EIS is associated with which airport?",
    options: {
      A: "St. Thomas",
      B: "Tortola – Terrance B. Lettsome",
      C: "Antigua",
      D: "Anguilla"
    },
    correctAnswer: "B",
    explanation: "EIS is the IATA code for Terrance B. Lettsome International (TUPJ)."
  },
  {
    question: "Which airport serves Anguilla and uses the ICAO code TQPF?",
    options: {
      A: "Clayton J. Lloyd International",
      B: "Princess Juliana International",
      C: "F.D. Roosevelt Airport",
      D: "Robert L. Bradshaw International"
    },
    correctAnswer: "A",
    explanation: "Anguilla is served by Clayton J. Lloyd International (TQPF)."
  },
  {
    question: "What is the IATA code for St. Maarten’s Princess Juliana International Airport?",
    options: {
      A: "SXM",
      B: "AXA",
      C: "SBH",
      D: "ANU"
    },
    correctAnswer: "A",
    explanation: "Princess Juliana uses IATA code SXM."
  },
  {
    question: "Which airport is identified by the ICAO code TIST?",
    options: {
      A: "St. Croix – Henry E. Rohlsen",
      B: "St. Thomas – Cyril E. King",
      C: "San Juan – Luis Muñoz Marín",
      D: "Ponce – Mercedita"
    },
    correctAnswer: "B",
    explanation: "TIST is Cyril E. King Airport on St. Thomas, U.S. Virgin Islands."
  },
  {
    question: "Which Caribbean airline uses the IATA code JY?",
    options: {
      A: "interCaribbean Airways",
      B: "Air Antilles",
      C: "Winair",
      D: "LIAT"
    },
    correctAnswer: "A",
    explanation: "interCaribbean Airways uses IATA code JY."
  },
  {
    question: "The ICAO code MWCR refers to which facility?",
    options: {
      A: "Grand Cayman – Owen Roberts Intl",
      B: "Curaçao – Hato Intl",
      C: "Aruba – Queen Beatrix",
      D: "Bonaire – Flamingo Intl"
    },
    correctAnswer: "A",
    explanation: "MWCR is Owen Roberts International Airport in Grand Cayman."
  },
  {
    question: "Which island’s main airport is named Vance W. Amory International (TKPN)?",
    options: {
      A: "Nevis",
      B: "St. Kitts",
      C: "Anguilla",
      D: "Montserrat"
    },
    correctAnswer: "A",
    explanation: "TKPN serves Nevis and is named Vance W. Amory International."
  },
  {
    question: "The IATA code CUR belongs to which airport?",
    options: {
      A: "Curaçao – Hato International",
      B: "Cuba – José Martí",
      C: "Curaçao – Flamingo",
      D: "Cuba – Varadero"
    },
    correctAnswer: "A",
    explanation: "CUR is the IATA code for Hato International in Curaçao."
  },
  {
    question: "Which airport serves Dominica’s capital region but has a shorter runway suited to turboprops?",
    options: {
      A: "TDPD – Douglas–Charles",
      B: "TDCF – Canefield",
      C: "TLPL – Hewanorra",
      D: "TBPB – Grantley Adams"
    },
    correctAnswer: "B",
    explanation: "Canefield (TDCF) near Roseau has a short runway mainly for turboprops."
  },
  {
    question: "Which airline uses the IATA code TX?",
    options: {
      A: "Air Caraïbes",
      B: "Air Antilles",
      C: "Caribbean Airlines",
      D: "Cayman Airways"
    },
    correctAnswer: "A",
    explanation: "Air Caraïbes uses IATA code TX."
  },
  {
    question: "Which airport has the IATA code STI?",
    options: {
      A: "Santiago de los Caballeros – Cibao Intl",
      B: "Santo Domingo – Las Américas",
      C: "Punta Cana",
      D: "Puerto Plata – Gregorio Luperón"
    },
    correctAnswer: "A",
    explanation: "STI corresponds to Cibao International serving Santiago, DR."
  },
  {
    question: "The ICAO prefix 'TJ' applies to which territory’s airports?",
    options: {
      A: "Barbados",
      B: "Puerto Rico",
      C: "Bahamas",
      D: "Bermuda"
    },
    correctAnswer: "B",
    explanation: "Puerto Rico airports (e.g., TJSJ) use the TJ prefix."
  },
  {
    question: "Which airport uses the ICAO code TFFF?",
    options: {
      A: "Guadeloupe – Pointe-à-Pitre",
      B: "Martinique – Aimé Césaire",
      C: "St. Barth – Gustaf III",
      D: "St. Martin – Grand Case"
    },
    correctAnswer: "B",
    explanation: "TFFF is Fort-de-France Aimé Césaire in Martinique."
  },
  {
    question: "What is the IATA code for Port of Spain’s airport commonly used by Caribbean Airlines?",
    options: {
      A: "BGI",
      B: "POS",
      C: "KIN",
      D: "SJU"
    },
    correctAnswer: "B",
    explanation: "Port of Spain’s Piarco International uses IATA POS."
  },
  {
    question: "Which airline primarily connects Guadeloupe and Martinique with nearby islands under IATA code 3S?",
    options: {
      A: "Air Antilles",
      B: "Air Caraïbes",
      C: "Winair",
      D: "LIAT"
    },
    correctAnswer: "A",
    explanation: "Air Antilles uses IATA code 3S for regional services."
  },
  {
    question: "The IATA code POP belongs to which airport?",
    options: {
      A: "Ponce – Mercedita",
      B: "Puerto Plata – Gregorio Luperón",
      C: "Port-au-Prince – Toussaint Louverture",
      D: "Port of Spain – Piarco"
    },
    correctAnswer: "B",
    explanation: "POP is Puerto Plata in the Dominican Republic."
  },
  {
    question: "Which Caribbean airport is known by ICAO code MDPP?",
    options: {
      A: "Puerto Plata",
      B: "Punta Cana",
      C: "Santo Domingo – Las Américas",
      D: "San Juan – Isla Grande"
    },
    correctAnswer: "A",
    explanation: "MDPP is Gregorio Luperón International (Puerto Plata)."
  },
  {
    question: "Which airport serves St. Croix in the U.S. Virgin Islands?",
    options: {
      A: "TIST – Cyril E. King",
      B: "TISX – Henry E. Rohlsen",
      C: "TUPJ – Terrance B. Lettsome",
      D: "TQPF – Clayton J. Lloyd"
    },
    correctAnswer: "B",
    explanation: "St. Croix is served by Henry E. Rohlsen Airport (TISX)."
  },
  {
    question: "Which island’s airport uses the ICAO code TRPG?",
    options: {
      A: "Grenada",
      B: "Dominica",
      C: "Montserrat – John A. Osborne",
      D: "St. Lucia"
    },
    correctAnswer: "C",
    explanation: "TRPG is John A. Osborne Airport on Montserrat."
  },
  {
    question: "What is the IATA code for St. Kitts’ Robert L. Bradshaw International Airport?",
    options: {
      A: "SKB",
      B: "NEV",
      C: "AXA",
      D: "SBH"
    },
    correctAnswer: "A",
    explanation: "St. Kitts uses the IATA code SKB."
  },
  {
    question: "Which airport uses the ICAO code TVSC?",
    options: {
      A: "Union Island",
      B: "Canouan",
      C: "Bequia",
      D: "Mustique"
    },
    correctAnswer: "B",
    explanation: "TVSC is Canouan Airport in St. Vincent and the Grenadines."
  },
  {
    question: "Which airline uses the callsign “FRENCH WEST” on some long-haul services?",
    options: {
      A: "Air Caraïbes",
      B: "French Bee",
      C: "Air Antilles",
      D: "Corsair"
    },
    correctAnswer: "A",
    explanation: "Air Caraïbes has used “FRENCH WEST” for certain operations."
  },
  {
    question: "The IATA code AXA is associated with which island airport?",
    options: {
      A: "Anguilla – Clayton J. Lloyd",
      B: "Antigua – V.C. Bird",
      C: "Anegada – Auguste George",
      D: "Aruba – Queen Beatrix"
    },
    correctAnswer: "A",
    explanation: "AXA is Anguilla’s Clayton J. Lloyd International."
  },
  {
    question: "Which airport is identified by the ICAO code MKTP?",
    options: {
      A: "Tinson Pen Aerodrome, Kingston",
      B: "Ian Fleming International",
      C: "Sangster International",
      D: "Norman Manley International"
    },
    correctAnswer: "A",
    explanation: "MKTP is Tinson Pen, the domestic aerodrome in Kingston."
  },
  {
    question: "What is the IATA code for Bonaire’s Flamingo International Airport?",
    options: {
      A: "BON",
      B: "CUR",
      C: "AUA",
      D: "EUX"
    },
    correctAnswer: "A",
    explanation: "Bonaire’s airport uses IATA code BON."
  },
  {
    question: "Which island’s airport uses the IATA code EUX?",
    options: {
      A: "Saba",
      B: "St. Eustatius",
      C: "St. Martin",
      D: "St. Kitts"
    },
    correctAnswer: "B",
    explanation: "EUX is the IATA code for F.D. Roosevelt Airport on St. Eustatius."
  },
  {
    question: "Which airport serves as the main gateway to Guadeloupe and uses IATA code PTP?",
    options: {
      A: "Fort-de-France",
      B: "Pointe-à-Pitre – Le Raizet",
      C: "St. Barth",
      D: "St. Martin – Grand Case"
    },
    correctAnswer: "B",
    explanation: "PTP is the IATA code for Pointe-à-Pitre in Guadeloupe."
  },
  {
    question: "Which airline with IATA code 2L historically linked the French Antilles regionally?",
    options: {
      A: "LIAT",
      B: "Air Antilles Express",
      C: "Helvetic Airways",
      D: "Air Caraïbes"
    },
    correctAnswer: "B",
    explanation: "Air Antilles Express has been referenced with the code 2L in some systems for regional operations."
  },
  {
    question: "Which airport uses the ICAO code TJBQ in Puerto Rico?",
    options: {
      A: "Ponce – Mercedita",
      B: "Aguadilla – Rafael Hernández",
      C: "San Juan – Luis Muñoz Marín",
      D: "Ceiba – José Aponte de la Torre"
    },
    correctAnswer: "B",
    explanation: "TJBQ is Rafael Hernández Airport in Aguadilla."
  },
  {
    question: "The IATA code NEV corresponds to which airport?",
    options: {
      A: "Nevis – Vance W. Amory",
      B: "Nassau – Lynden Pindling",
      C: "Negril – Aerodrome",
      D: "New Providence – North Field"
    },
    correctAnswer: "A",
    explanation: "NEV is the IATA code for Nevis (TKPN)."
  },
  {
    question: "Which airport is known by ICAO code TDCF?",
    options: {
      A: "Dominica – Canefield",
      B: "Dominica – Douglas–Charles",
      C: "St. Lucia – George F. L. Charles",
      D: "Grenada – Lauriston"
    },
    correctAnswer: "A",
    explanation: "TDCF is Canefield Airport in Dominica."
  },
  {
    question: "Which Caribbean capital city is served by MUHA?",
    options: {
      A: "Havana – José Martí International",
      B: "Santo Domingo – Las Américas",
      C: "Port-au-Prince – Toussaint Louverture",
      D: "Kingston – Norman Manley"
    },
    correctAnswer: "A",
    explanation: "MUHA is José Martí International serving Havana, Cuba."
  },
  {
    question: "The IATA code SVD corresponds to which airport?",
    options: {
      A: "Saint Vincent – Argyle International",
      B: "St. Kitts – Robert L. Bradshaw",
      C: "St. Lucia – Hewanorra",
      D: "St. Maarten – Princess Juliana"
    },
    correctAnswer: "A",
    explanation: "SVD is the IATA code for Argyle International in St. Vincent."
  },
  {
    question: "Which airline historically used the IATA code JM in the Caribbean?",
    options: {
      A: "Air Jamaica",
      B: "Jamaica Air Shuttle",
      C: "Jamaica Express",
      D: "Jamaica Link"
    },
    correctAnswer: "A",
    explanation: "Air Jamaica used the IATA code JM."
  },
  {
    question: "Which airport is identified as MDLR in the Dominican Republic?",
    options: {
      A: "La Romana – Casa de Campo Intl",
      B: "Las Américas – Santo Domingo",
      C: "Cibao – Santiago",
      D: "Gregorio Luperón – Puerto Plata"
    },
    correctAnswer: "A",
    explanation: "MDLR is La Romana International (Casa de Campo)."
  },
  {
    question: "What is the ICAO code for Barbados’ Grantley Adams International?",
    options: {
      A: "TBPB",
      B: "TAPA",
      C: "TLPL",
      D: "TFFF"
    },
    correctAnswer: "A",
    explanation: "Barbados uses TBPB for Grantley Adams International."
  },
  {
    question: "Which Caribbean airport’s IATA code is EIS and ICAO is TUPJ?",
    options: {
      A: "Anguilla",
      B: "Tortola – British Virgin Islands",
      C: "St. Thomas",
      D: "St. Kitts"
    },
    correctAnswer: "B",
    explanation: "EIS/TUPJ is Terrance B. Lettsome International on Tortola."
  },
  {
    question: "Which island uses the ICAO code TFFR for its primary airport?",
    options: {
      A: "Guadeloupe",
      B: "Martinique",
      C: "St. Martin",
      D: "Barbados"
    },
    correctAnswer: "A",
    explanation: "TFFR is Pointe-à-Pitre in Guadeloupe."
  },
  {
    question: "Which airline operates extensively between Providenciales and other Caribbean islands with IATA code JY as a common competitor?",
    options: {
      A: "interCaribbean Airways",
      B: "Winair",
      C: "Bahamasair",
      D: "Cayman Airways"
    },
    correctAnswer: "A",
    explanation: "interCaribbean (JY) operates a hub at Providenciales in the Turks & Caicos."
  },
  {
    question: "Which airport uses the IATA code PSE in Puerto Rico?",
    options: {
      A: "Ponce – Mercedita",
      B: "San Juan – Isla Grande",
      C: "Aguadilla – Rafael Hernández",
      D: "Ceiba – José Aponte de la Torre"
    },
    correctAnswer: "A",
    explanation: "PSE is Mercedita Airport in Ponce, Puerto Rico."
  },
  {
    question: "Which airport is identified by the ICAO code TJIG?",
    options: {
      A: "San Juan – Luis Muñoz Marín",
      B: "San Juan – Fernando Luis Ribas Dominicci (Isla Grande)",
      C: "Ponce – Mercedita",
      D: "Aguadilla – Rafael Hernández"
    },
    correctAnswer: "B",
    explanation: "TJIG is Isla Grande Airport near Old San Juan."
  },
  {
    question: "The airport serving St. Barthélemy uses which IATA code?",
    options: {
      A: "SBH",
      B: "AXA",
      C: "EUX",
      D: "SXM"
    },
    correctAnswer: "A",
    explanation: "SBH is the IATA code for Gustaf III Airport (TFFJ) in St. Barth."
  },
  {
    question: "Which airport’s ICAO code is MDJB in the Dominican Republic?",
    options: {
      A: "La Isabela – Dr. Joaquin Balaguer",
      B: "La Romana – Casa de Campo",
      C: "Santo Domingo – Las Américas",
      D: "Samana – El Catey"
    },
    correctAnswer: "A",
    explanation: "MDJB is La Isabela, Santo Domingo’s secondary airport."
  },
  {
    question: "Which airline’s IATA code is 3S operating in the French Antilles?",
    options: {
      A: "Air Antilles",
      B: "LIAT",
      C: "Winair",
      D: "Caribbean Airlines"
    },
    correctAnswer: "A",
    explanation: "Air Antilles uses the IATA code 3S."
  },
  {
    question: "What is the ICAO code for Turks and Caicos’ Providenciales International Airport?",
    options: {
      A: "MBPV",
      B: "MYNN",
      C: "MWCR",
      D: "TNCC"
    },
    correctAnswer: "A",
    explanation: "Providenciales International uses MBPV."
  },
  {
    question: "Which airport uses the IATA code FDF?",
    options: {
      A: "Pointe-à-Pitre",
      B: "Fort-de-France – Martinique",
      C: "Castries – George F. L. Charles",
      D: "Hewanorra – St. Lucia"
    },
    correctAnswer: "B",
    explanation: "FDF is Fort-de-France Aimé Césaire in Martinique."
  },
  {
    question: "Which Caribbean island’s main airport is José Martí International (MUHA)?",
    options: {
      A: "Haiti",
      B: "Cuba",
      C: "Jamaica",
      D: "Dominican Republic"
    },
    correctAnswer: "B",
    explanation: "MUHA is José Martí International serving Havana, Cuba."
  },
  {
    question: "Which airline mainly serves St. Barth, Saba, and St. Eustatius from SXM with small aircraft?",
    options: {
      A: "LIAT",
      B: "Winair",
      C: "Air Antilles",
      D: "interCaribbean"
    },
    correctAnswer: "B",
    explanation: "Winair operates STOL-capable turboprops on these short routes."
  },
  {
    question: "Which airport’s IATA code is SDQ?",
    options: {
      A: "Punta Cana",
      B: "Santiago – Cibao",
      C: "Santo Domingo – Las Américas",
      D: "Puerto Plata"
    },
    correctAnswer: "C",
    explanation: "SDQ is Las Américas International in Santo Domingo."
  },
  {
    question: "Which airport serves the island of St. Martin’s French side?",
    options: {
      A: "TFFJ – St. Barth",
      B: "TFFG – Grand Case – L'Espérance",
      C: "TNCM – Princess Juliana",
      D: "TQPF – Anguilla"
    },
    correctAnswer: "B",
    explanation: "TFFG is Grand Case on the French side of St. Martin."
  },
  {
    question: "Which island’s airport uses the IATA code UVF?",
    options: {
      A: "St. Lucia – Hewanorra International",
      B: "St. Vincent – Argyle",
      C: "Barbados – Grantley Adams",
      D: "Grenada – Maurice Bishop"
    },
    correctAnswer: "A",
    explanation: "UVF is Hewanorra International (TLPL) in St. Lucia."
  },
  {
    question: "Which Caribbean capital is served by the airport with IATA code PAP?",
    options: {
      A: "Port of Spain",
      B: "Port-au-Prince",
      C: "Pointe-à-Pitre",
      D: "Panama City"
    },
    correctAnswer: "B",
    explanation: "PAP is Toussaint Louverture International serving Port-au-Prince, Haiti."
  },
  {
    question: "Which airline primarily uses Twin Otters for short runways in the northeastern Caribbean?",
    options: {
      A: "Winair",
      B: "Caribbean Airlines",
      C: "Bahamasair",
      D: "Cayman Airways"
    },
    correctAnswer: "A",
    explanation: "Winair commonly operates DHC-6 Twin Otters to airports like SBH and Saba."
  },
  {
    question: "Which airport in Jamaica has the IATA code KTP?",
    options: {
      A: "Kingston – Tinson Pen Aerodrome",
      B: "Kingston – Norman Manley Intl",
      C: "Montego Bay – Sangster",
      D: "Ocho Rios – Ian Fleming"
    },
    correctAnswer: "A",
    explanation: "KTP is the IATA code for Tinson Pen Aerodrome in Kingston."
  },
  {
    question: "Which airport uses the ICAO code MDPC and IATA PUJ, a major tourist gateway?",
    options: {
      A: "Punta Cana, Dominican Republic",
      B: "Ponce, Puerto Rico",
      C: "Providenciales, Turks & Caicos",
      D: "Port of Spain, Trinidad"
    },
    correctAnswer: "A",
    explanation: "MDPC/PUJ is Punta Cana International."
  }
];

function getRandomQuestion() {
  const randomIndex = Math.floor(Math.random() * QUESTIONS.length);
  return QUESTIONS[randomIndex];
}

module.exports = {
  getRandomQuestion,
  QUESTIONS
};
