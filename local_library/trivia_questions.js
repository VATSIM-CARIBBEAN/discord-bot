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