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
    },
    {
        question: "What is the ICAO code for Piarco International Airport in Trinidad?",
        options: {
            A: "TTPP",
            B: "TTCP",
            C: "TTPI",
            D: "TTPA"
        },
        correctAnswer: "A",
        explanation: "Piarco International Airport’s ICAO code is TTPP."
    }
    ,
    {
        question: "A.N.R. Robinson International Airport in Tobago uses which ICAO code?",
        options: {
            A: "TTPT",
            B: "TTCP",
            C: "TTPB",
            D: "TTTO"
        },
        correctAnswer: "B",
        explanation: "Tobago’s A.N.R. Robinson International is TTCP."
    }
    ,
    {
        question: "What is the IATA code for Ian Fleming International Airport near Ocho Rios, Jamaica?",
        options: {
            A: "OCJ",
            B: "KIN",
            C: "MBJ",
            D: "KTP"
        },
        correctAnswer: "A",
        explanation: "Ian Fleming International uses the IATA code OCJ."
    }
    ,
    {
        question: "Which airport in Cuba uses the ICAO code MUVR and IATA VRA?",
        options: {
            A: "Holguín – Frank País",
            B: "Varadero – Juan Gualberto Gómez",
            C: "Santa Clara – Abel Santamaría",
            D: "Havana – José Martí"
        },
        correctAnswer: "B",
        explanation: "Varadero is MUVR with IATA code VRA."
    }
    ,
    {
        question: "What is the IATA code for Grand Case L'Espérance Airport on the French side of St. Martin?",
        options: {
            A: "SFG",
            B: "SBH",
            C: "SXM",
            D: "AXA"
        },
        correctAnswer: "A",
        explanation: "Grand Case uses IATA code SFG."
    }
    ,
    {
        question: "Bequia’s J.F. Mitchell Airport uses which ICAO and IATA codes?",
        options: {
            A: "TVSB / BQU",
            B: "TVSU / UNI",
            C: "TVSM / MQS",
            D: "TVSC / CIW"
        },
        correctAnswer: "A",
        explanation: "Bequia is TVSB with IATA code BQU."
    }
    ,
    {
        question: "Union Island Airport in St. Vincent & the Grenadines uses which IATA code?",
        options: {
            A: "UNI",
            B: "BQU",
            C: "MQS",
            D: "CIW"
        },
        correctAnswer: "A",
        explanation: "Union Island’s IATA code is UNI (ICAO TVSU)."
    }
    ,
    {
        question: "Mustique Airport is identified by which IATA code?",
        options: {
            A: "MQS",
            B: "BQU",
            C: "UNI",
            D: "CIW"
        },
        correctAnswer: "A",
        explanation: "Mustique is TVSM with IATA code MQS."
    }
    ,
    {
        question: "Cayman Brac’s Gerrard Smith International uses which IATA code?",
        options: {
            A: "CYB",
            B: "LYB",
            C: "GCM",
            D: "MWC"
        },
        correctAnswer: "A",
        explanation: "Cayman Brac is MWCB with IATA code CYB."
    }
    ,
    {
        question: "Little Cayman’s Edward Bodden Airfield is known by which IATA code?",
        options: {
            A: "LYB",
            B: "CYB",
            C: "GCM",
            D: "PLS"
        },
        correctAnswer: "A",
        explanation: "Little Cayman is MWCL with IATA code LYB."
    }
    ,
    {
        question: "Freeport, Bahamas is served by which IATA code?",
        options: {
            A: "FPO",
            B: "NAS",
            C: "GGT",
            D: "MHH"
        },
        correctAnswer: "A",
        explanation: "Freeport is MYGF with IATA code FPO."
    }
    ,
    {
        question: "George Town, Exuma in The Bahamas uses which IATA code?",
        options: {
            A: "GGT",
            B: "ELH",
            C: "TCB",
            D: "MHH"
        },
        correctAnswer: "A",
        explanation: "Exuma International is MYEF, IATA GGT."
    }
    ,
    {
        question: "Marsh Harbour Airport in Abaco uses which IATA code?",
        options: {
            A: "MHH",
            B: "TCB",
            C: "BIM",
            D: "ELH"
        },
        correctAnswer: "A",
        explanation: "Marsh Harbour’s IATA code is MHH (ICAO MYAM)."
    }
    ,
    {
        question: "North Eleuthera Airport in The Bahamas uses which IATA code?",
        options: {
            A: "ELH",
            B: "GGT",
            C: "NAS",
            D: "FPO"
        },
        correctAnswer: "A",
        explanation: "North Eleuthera is MYEH with IATA code ELH."
    }
    ,
    {
        question: "Bimini’s main airport uses which IATA code?",
        options: {
            A: "BIM",
            B: "TCB",
            C: "GGT",
            D: "MHH"
        },
        correctAnswer: "A",
        explanation: "South Bimini Airport is MYBS, IATA BIM."
    }
    ,
    {
        question: "Grand Turk’s JAGS McCartney International uses which IATA code?",
        options: {
            A: "GDT",
            B: "PLS",
            C: "NCA",
            D: "XSC"
        },
        correctAnswer: "A",
        explanation: "Grand Turk is MBGT with IATA code GDT."
    }
    ,
    {
        question: "Providenciales International in Turks & Caicos uses which IATA code?",
        options: {
            A: "PLS",
            B: "GDT",
            C: "NCA",
            D: "XSC"
        },
        correctAnswer: "A",
        explanation: "Providenciales is MBPV, IATA PLS."
    }
    ,
    {
        question: "Cap-Haïtien International in Haiti uses which IATA code?",
        options: {
            A: "CAP",
            B: "PAP",
            C: "JAK",
            D: "CAY"
        },
        correctAnswer: "A",
        explanation: "Cap-Haïtien is MTCH with IATA code CAP."
    }
    ,
    {
        question: "Samaná El Catey International in the Dominican Republic uses which IATA code?",
        options: {
            A: "AZS",
            B: "LRM",
            C: "JBQ",
            D: "STI"
        },
        correctAnswer: "A",
        explanation: "El Catey (MDCY) uses IATA code AZS."
    }
    ,
    {
        question: "La Romana – Casa de Campo International uses which IATA code?",
        options: {
            A: "LRM",
            B: "JBQ",
            C: "PUJ",
            D: "POP"
        },
        correctAnswer: "A",
        explanation: "La Romana is MDLR with IATA LRM."
    }
    ,
    {
        question: "Santo Domingo’s secondary airport La Isabela is known by which IATA code?",
        options: {
            A: "JBQ",
            B: "SDQ",
            C: "PUJ",
            D: "STI"
        },
        correctAnswer: "A",
        explanation: "La Isabela (MDJB) uses IATA code JBQ."
    }
    ,
    {
        question: "Dominica’s capital-area airport Canefield uses which IATA code?",
        options: {
            A: "DCF",
            B: "DOM",
            C: "ANU",
            D: "SLU"
        },
        correctAnswer: "A",
        explanation: "Canefield is TDCF with IATA DCF."
    }
    ,
    {
        question: "Dominica Douglas–Charles Airport uses which IATA code?",
        options: {
            A: "DOM",
            B: "DCF",
            C: "SVD",
            D: "UVF"
        },
        correctAnswer: "A",
        explanation: "Douglas–Charles is TDPD with IATA DOM."
    }
    ,
    {
        question: "George F. L. Charles Airport in Castries, St. Lucia uses which ICAO code?",
        options: {
            A: "TLPC",
            B: "TLPL",
            C: "TFFF",
            D: "TAPA"
        },
        correctAnswer: "A",
        explanation: "Castries airport uses ICAO TLPC and IATA SLU."
    }
    ,
    {
        question: "Grenada’s Maurice Bishop International uses which IATA code?",
        options: {
            A: "GND",
            B: "SVD",
            C: "BGI",
            D: "UVF"
        },
        correctAnswer: "A",
        explanation: "Grenada’s airport is TGPY with IATA GND."
    }
    ,
    {
        question: "Which airline used the IATA code LI in the Caribbean?",
        options: {
            A: "LIAT",
            B: "Air Caraïbes",
            C: "Bahamasair",
            D: "Winair"
        },
        correctAnswer: "A",
        explanation: "LIAT historically used the IATA code LI."
    }
    ,
    {
        question: "What was Insel Air’s IATA code before ceasing operations?",
        options: {
            A: "7I",
            B: "BW",
            C: "JM",
            D: "WM"
        },
        correctAnswer: "A",
        explanation: "Insel Air operated under IATA code 7I."
    }
    ,
    {
        question: "Which IATA code did BWIA West Indies Airways use prior to Caribbean Airlines?",
        options: {
            A: "BW",
            B: "JM",
            C: "UP",
            D: "TX"
        },
        correctAnswer: "A",
        explanation: "BWIA used IATA code BW, later used by Caribbean Airlines."
    }
    ,
    {
        question: "Surinam Airways uses which IATA code?",
        options: {
            A: "PY",
            B: "SX",
            C: "SR",
            D: "SN"
        },
        correctAnswer: "A",
        explanation: "Surinam Airways is IATA PY."
    }
    ,
    {
        question: "Which aircraft registration prefix is used by Trinidad and Tobago?",
        options: {
            A: "9Y-",
            B: "8P-",
            C: "6Y-",
            D: "C6-"
        },
        correctAnswer: "A",
        explanation: "Trinidad and Tobago aircraft carry the 9Y- registration prefix."
    }
    ,
    {
        question: "Which aircraft registration prefix is used by Jamaica?",
        options: {
            A: "6Y-",
            B: "9Y-",
            C: "8P-",
            D: "VP-C"
        },
        correctAnswer: "A",
        explanation: "Jamaica uses the registration prefix 6Y-."
    }
    ,
    {
        question: "Which aircraft registration prefix is used by The Bahamas?",
        options: {
            A: "C6-",
            B: "VP-B",
            C: "P4-",
            D: "PJ-"
        },
        correctAnswer: "A",
        explanation: "The Bahamas uses the prefix C6-."
    }
    ,
    {
        question: "Which aircraft registration prefix is used by Aruba?",
        options: {
            A: "P4-",
            B: "PJ-",
            C: "VP-C",
            D: "VP-B"
        },
        correctAnswer: "A",
        explanation: "Aruba-registered aircraft carry the P4- prefix."
    }
    ,
    {
        question: "Which aircraft registration prefix is used by the Cayman Islands?",
        options: {
            A: "VP-C",
            B: "VP-B",
            C: "VQ-B",
            D: "C6-"
        },
        correctAnswer: "A",
        explanation: "Cayman Islands use the VP-C prefix."
    }
    ,
    {
        question: "Which aircraft registration prefix is commonly associated with Bermuda?",
        options: {
            A: "VP-B",
            B: "9Y-",
            C: "HI-",
            D: "HH-"
        },
        correctAnswer: "A",
        explanation: "Bermuda registrations often use the VP-B prefix."
    }
    ,
    {
        question: "Which aircraft registration prefix is used by Cuba?",
        options: {
            A: "CU-",
            B: "HI-",
            C: "HH-",
            D: "PJ-"
        },
        correctAnswer: "A",
        explanation: "Cuba uses the CU- registration prefix."
    }
    ,
    {
        question: "Which aircraft registration prefix is used by the Dominican Republic?",
        options: {
            A: "HI-",
            B: "HH-",
            C: "PJ-",
            D: "P4-"
        },
        correctAnswer: "A",
        explanation: "Dominican Republic uses the HI- prefix."
    }
    ,
    {
        question: "Which aircraft registration prefix is used by Haiti?",
        options: {
            A: "HH-",
            B: "HI-",
            C: "C6-",
            D: "VP-C"
        },
        correctAnswer: "A",
        explanation: "Haiti uses the HH- aircraft registration prefix."
    }
    ,
    {
        question: "Which ICAO prefix is used by the Cayman Islands?",
        options: {
            A: "MW",
            B: "MY",
            C: "MU",
            D: "MK"
        },
        correctAnswer: "A",
        explanation: "Cayman Islands airports use the MW prefix (e.g., MWCR)."
    }
    ,
    {
        question: "Which ICAO prefix is used by Turks & Caicos Islands?",
        options: {
            A: "MB",
            B: "MY",
            C: "TN",
            D: "TT"
        },
        correctAnswer: "A",
        explanation: "Turks & Caicos airports use the MB prefix (e.g., MBPV)."
    }
    ,
    {
        question: "Which ICAO prefix is used by Haiti?",
        options: {
            A: "MT",
            B: "MD",
            C: "MU",
            D: "MK"
        },
        correctAnswer: "A",
        explanation: "Haiti uses the MT prefix (e.g., MTPP, MTCH)."
    }
    ,
    {
        question: "Which ICAO prefix is used by Jamaica?",
        options: {
            A: "MK",
            B: "MD",
            C: "MU",
            D: "MY"
        },
        correctAnswer: "A",
        explanation: "Jamaican airports use the MK prefix (e.g., MKJP, MKJS)."
    }
    ,
    {
        question: "Which ICAO prefix 'TN' corresponds to which Caribbean region?",
        options: {
            A: "Dutch Caribbean (Aruba, Bonaire, Curaçao, Sint Maarten, Saba, St. Eustatius)",
            B: "French Antilles",
            C: "Bahamas",
            D: "Greater Antilles"
        },
        correctAnswer: "A",
        explanation: "TN covers the Dutch Caribbean territories."
    }
    ,
    {
        question: "The 'TF' ICAO region (e.g., TFFR, TFFJ) primarily covers which territories?",
        options: {
            A: "French Antilles (Guadeloupe, Martinique, St. Barth, St. Martin)",
            B: "Dutch Caribbean",
            C: "Bahamas",
            D: "Cayman Islands"
        },
        correctAnswer: "A",
        explanation: "TF codes apply to the French Antilles in the Caribbean."
    }
    ,
    {
        question: "In FAA/ATC terms, San Juan’s combined facility is a CERAP. What does CERAP stand for?",
        options: {
            A: "Combined Enroute Radar Approach Control",
            B: "Central Enroute Approach Program",
            C: "Controlled Enroute Radar and Procedures",
            D: "Consolidated Enroute Radar Approach Planning"
        },
        correctAnswer: "A",
        explanation: "CERAP means Combined Enroute Radar Approach Control."
    }
    ,
    {
        question: "What is the FAA facility identifier for the San Juan CERAP?",
        options: {
            A: "ZSU",
            B: "ZNY",
            C: "ZMA",
            D: "ZJU"
        },
        correctAnswer: "A",
        explanation: "San Juan CERAP uses the facility identifier ZSU."
    }
    ,
    {
        question: "On VATSIM, which identifier is commonly associated with the Piarco FIR ACC position?",
        options: {
            A: "TTZP_CTR",
            B: "MKJK_CTR",
            C: "MUFH_CTR",
            D: "MDPP_APP"
        },
        correctAnswer: "A",
        explanation: "Piarco ACC is represented as TTZP_CTR on VATSIM."
    }
    ,
    {
        question: "At Princess Juliana (TNCM), the famous beach approach is to which runway?",
        options: {
            A: "Runway 10",
            B: "Runway 28",
            C: "Runway 07",
            D: "Runway 25"
        },
        correctAnswer: "A",
        explanation: "The iconic Maho Beach approach is to Runway 10."
    }
    ,
    {
        question: "St. Barthélemy’s Gustaf III Airport (TFFJ) is notable for what feature?",
        options: {
            A: "A steep hill on short final and a beach at the far end",
            B: "A floating runway",
            C: "Three parallel runways",
            D: "Operations restricted to jets only"
        },
        correctAnswer: "A",
        explanation: "TFFJ features a hill on approach and a beach close to the runway end."
    }
    ,
    {
        question: "Which airport serves Santiago de Cuba and uses IATA code SCU?",
        options: {
            A: "Antonio Maceo International",
            B: "Abel Santamaría",
            C: "Frank País",
            D: "Ignacio Agramonte"
        },
        correctAnswer: "A",
        explanation: "Santiago de Cuba is served by Antonio Maceo International (MUCU), IATA SCU."
    }
    ,
    {
        question: "Holguín, Cuba is served by which IATA code?",
        options: {
            A: "HOG",
            B: "VRA",
            C: "SNU",
            D: "HAV"
        },
        correctAnswer: "A",
        explanation: "Holguín’s Frank País Airport uses IATA HOG (MUHG)."
    }
    ,
    {
        question: "Santa Clara, Cuba (Abel Santamaría) uses which IATA code?",
        options: {
            A: "SNU",
            B: "HOG",
            C: "VRA",
            D: "CFG"
        },
        correctAnswer: "A",
        explanation: "Abel Santamaría International is MUSC with IATA SNU."
    }
    ,
    {
        question: "Which IATA code is used by Capodocia—trick! Which code is used by Cayo Coco, Cuba instead?",
        options: {
            A: "CCC",
            B: "CUC",
            C: "CCO",
            D: "CBQ"
        },
        correctAnswer: "A",
        explanation: "Jardines del Rey (Cayo Coco) uses IATA CCC (MUCC)."
    }
    ,
    {
        question: "Which IATA code is used by St. Croix’s Henry E. Rohlsen Airport?",
        options: {
            A: "STX",
            B: "STT",
            C: "EIS",
            D: "AXA"
        },
        correctAnswer: "A",
        explanation: "St. Croix uses IATA STX (ICAO TISX)."
    }
    ,
    {
        question: "Which IATA code is used by St. Thomas’s Cyril E. King Airport?",
        options: {
            A: "STT",
            B: "STX",
            C: "SJU",
            D: "BQN"
        },
        correctAnswer: "A",
        explanation: "St. Thomas uses IATA STT (ICAO TIST)."
    }
    ,
    {
        question: "Which IATA code is used by Ceiba’s José Aponte de la Torre Airport in Puerto Rico?",
        options: {
            A: "RVR",
            B: "BQN",
            C: "PSE",
            D: "SIG"
        },
        correctAnswer: "A",
        explanation: "Ceiba uses IATA RVR (ICAO TJRV)."
    }
    ,
    {
        question: "Vieques’ Antonio Rivera Rodríguez Airport uses which IATA code?",
        options: {
            A: "VQS",
            B: "CPX",
            C: "SIG",
            D: "VQZ"
        },
        correctAnswer: "A",
        explanation: "Vieques is TJVG with IATA VQS."
    }
    ,
    {
        question: "Culebra’s Benjamin Rivera Noriega Airport uses which IATA code?",
        options: {
            A: "CPX",
            B: "VQS",
            C: "SIG",
            D: "SJU"
        },
        correctAnswer: "A",
        explanation: "Culebra is TJCP with IATA CPX."
    }
    ,
    {
        question: "Which IATA code is used by Aruba’s Queen Beatrix International?",
        options: {
            A: "AUA",
            B: "CUR",
            C: "BON",
            D: "SXM"
        },
        correctAnswer: "A",
        explanation: "Aruba uses the IATA code AUA."
    }
    ,
    {
        question: "Which IATA code is used by Bonaire’s Flamingo International?",
        options: {
            A: "BON",
            B: "CUR",
            C: "AUA",
            D: "EUX"
        },
        correctAnswer: "A",
        explanation: "Bonaire’s airport uses IATA BON."
    }
    ,
    {
        question: "Which airport serves Paramaribo, Suriname for most international flights?",
        options: {
            A: "SMJP – Johan Adolf Pengel (IATA PBM)",
            B: "SMZO – Zorg en Hoop (IATA ORG)",
            C: "TNCC – Hato (IATA CUR)",
            D: "SMNI – Nickerie (IATA ICK)"
        },
        correctAnswer: "A",
        explanation: "Paramaribo’s main international airport is SMJP (PBM)."
    }
    ,
    {
        question: "Which IATA code is used by Georgetown’s secondary/commuter airport in Guyana?",
        options: {
            A: "OGL",
            B: "GEO",
            C: "PBM",
            D: "ANU"
        },
        correctAnswer: "A",
        explanation: "Eugene F. Correia (Ogle) uses IATA OGL."
    }
    ,
    {
        question: "Which Caribbean airport uses ICAO MWCB and serves Cayman Brac?",
        options: {
            A: "Gerrard Smith International",
            B: "Owen Roberts International",
            C: "Edward Bodden Airfield",
            D: "Hato International"
        },
        correctAnswer: "A",
        explanation: "MWCB is Gerrard Smith International (CYB)."
    }
    ,
    {
        question: "Which airport uses ICAO MBGT and serves Grand Turk?",
        options: {
            A: "JAGS McCartney International",
            B: "Providenciales International",
            C: "North Caicos Airport",
            D: "South Caicos Airport"
        },
        correctAnswer: "A",
        explanation: "MBGT is JAGS McCartney International on Grand Turk."
    }
    ,
    {
        question: "Which ICAO prefix applies to the Bahamas?",
        options: {
            A: "MY",
            B: "MB",
            C: "MW",
            D: "MU"
        },
        correctAnswer: "A",
        explanation: "Bahamas airports use the MY prefix (e.g., MYNN)."
    }
    ,
    {
        question: "Which capital city in the Caribbean is served by JBQ and SDQ airports?",
        options: {
            A: "Santo Domingo, Dominican Republic",
            B: "Port-au-Prince, Haiti",
            C: "Havana, Cuba",
            D: "Kingston, Jamaica"
        },
        correctAnswer: "A",
        explanation: "Santo Domingo is served by JBQ (La Isabela) and SDQ (Las Américas)."
    }
    ,
    {
        question: "Which IATA code is used by the airport serving Kingstown, St. Vincent?",
        options: {
            A: "SVD",
            B: "BGI",
            C: "GND",
            D: "UVF"
        },
        correctAnswer: "A",
        explanation: "Argyle International serves Kingstown with IATA SVD."
    }
    ,
    {
        question: "Which IATA code is used by George F. L. Charles Airport near Castries?",
        options: {
            A: "SLU",
            B: "UVF",
            C: "SVD",
            D: "BGI"
        },
        correctAnswer: "A",
        explanation: "Castries’ airport uses IATA SLU (ICAO TLPC)."
    },
    {
        question: "Which IATA code is used by North Caicos Airport in Turks & Caicos?",
        options: {
            A: "NCA",
            B: "GDT",
            C: "PLS",
            D: "XSC"
        },
        correctAnswer: "A",
        explanation: "North Caicos uses IATA code NCA."
    },
    {
        question: "Which IATA code is used by South Caicos Airport?",
        options: {
            A: "XSC",
            B: "GDT",
            C: "NCA",
            D: "PLS"
        },
        correctAnswer: "A",
        explanation: "South Caicos uses IATA code XSC."
    },
    {
        question: "Which ICAO code identifies Punta Cana International?",
        options: {
            A: "MDPC",
            B: "MDSD",
            C: "MDPP",
            D: "MDJB"
        },
        correctAnswer: "A",
        explanation: "Punta Cana is MDPC (IATA PUJ)."
    },
  {
    question: "Which IATA code is used by Puerto Plata’s Gregorio Luperón International?",
    options: {
      A: "POP",
      B: "STI",
      C: "SDQ",
      D: "PUJ"
    },
    correctAnswer: "A",
    explanation: "Puerto Plata’s airport is MDPP with IATA POP."
  }
,
  {
    question: "Which airport in the Dominican Republic uses IATA STI?",
    options: {
      A: "Santiago – Cibao International",
      B: "Santo Domingo – Las Américas",
      C: "Puerto Plata – Gregorio Luperón",
      D: "La Romana – Casa de Campo"
    },
    correctAnswer: "A",
    explanation: "Santiago de los Caballeros is served by Cibao International (MDST), IATA STI."
  }
,
  {
    question: "What is the ICAO code for Kingston’s Sangster International Airport?",
    options: {
      A: "MKJS",
      B: "MKJP",
      C: "MKJM",
      D: "MKJK"
    },
    correctAnswer: "A",
    explanation: "Sangster International in Montego Bay uses ICAO MKJS."
  }
,
  {
    question: "Which IATA code is used by Curaçao’s main international airport?",
    options: {
      A: "CUR",
      B: "BON",
      C: "AUA",
      D: "SXM"
    },
    correctAnswer: "A",
    explanation: "Curaçao Hato International is TNCC with IATA CUR."
  }
,
  {
    question: "What is the ICAO code for Guadeloupe’s main airport Pointe-à-Pitre?",
    options: {
      A: "TFFR",
      B: "TFFF",
      C: "TFFJ",
      D: "TFFM"
    },
    correctAnswer: "A",
    explanation: "Guadeloupe’s Pointe-à-Pitre International uses ICAO TFFR."
  }
,
  {
    question: "What is the ICAO code for Martinique Aimé Césaire International?",
    options: {
      A: "TFFF",
      B: "TFFR",
      C: "TFFM",
      D: "TFFJ"
    },
    correctAnswer: "A",
    explanation: "Martinique Aimé Césaire International Airport is TFFF."
  }
,
  {
    question: "Which French Caribbean airport has the ICAO code TFFJ?",
    options: {
      A: "St. Barthélemy – Gustaf III Airport",
      B: "St. Martin – Grand Case",
      C: "Martinique – Aimé Césaire",
      D: "Guadeloupe – Pointe-à-Pitre"
    },
    correctAnswer: "A",
    explanation: "St. Barthélemy’s Gustaf III Airport uses ICAO TFFJ."
  }
,
  {
    question: "What is the ICAO code for St. Martin’s Grand Case Airport?",
    options: {
      A: "TFFG",
      B: "TFFJ",
      C: "TNCM",
      D: "TFFF"
    },
    correctAnswer: "A",
    explanation: "Grand Case on the French side of St. Martin is TFFG."
  }
,
  {
    question: "Which Caribbean island is served by Clayton J. Lloyd International (TQPF)?",
    options: {
      A: "Anguilla",
      B: "Antigua",
      C: "Aruba",
      D: "St. Kitts"
    },
    correctAnswer: "A",
    explanation: "Clayton J. Lloyd International (TQPF) serves Anguilla."
  }
,
  {
    question: "Which IATA code is used by St. Kitts’ Robert L. Bradshaw International?",
    options: {
      A: "SKB",
      B: "NEV",
      C: "ANU",
      D: "SVD"
    },
    correctAnswer: "A",
    explanation: "Robert L. Bradshaw International is TKPK, IATA SKB."
  }
,
  {
    question: "Which IATA code is used by Nevis’ Vance W. Amory International?",
    options: {
      A: "NEV",
      B: "SKB",
      C: "ANU",
      D: "DOM"
    },
    correctAnswer: "A",
    explanation: "Nevis’ airport is TKPN, IATA NEV."
  }
,
  {
    question: "Which Caribbean airport has ICAO code TAPA?",
    options: {
      A: "Antigua – V.C. Bird International",
      B: "Anguilla – Clayton J. Lloyd International",
      C: "Dominica – Douglas-Charles",
      D: "St. Kitts – Robert L. Bradshaw"
    },
    correctAnswer: "A",
    explanation: "Antigua’s V.C. Bird International uses ICAO TAPA."
  }
,
  {
    question: "Which IATA code is used by Barbados’ Grantley Adams International?",
    options: {
      A: "BGI",
      B: "POS",
      C: "ANU",
      D: "GND"
    },
    correctAnswer: "A",
    explanation: "Grantley Adams International in Barbados is TBPB, IATA BGI."
  }
,
  {
    question: "Which airline used the IATA code JM before ceasing operations?",
    options: {
      A: "Air Jamaica",
      B: "LIAT",
      C: "Caribbean Airlines",
      D: "Bahamasair"
    },
    correctAnswer: "A",
    explanation: "Air Jamaica used the IATA code JM."
  }
,
  {
    question: "Which IATA code is used by Bahamasair?",
    options: {
      A: "UP",
      B: "BW",
      C: "LI",
      D: "PY"
    },
    correctAnswer: "A",
    explanation: "Bahamasair uses the IATA code UP."
  }
,
  {
    question: "Which IATA code is used by Air Caraïbes?",
    options: {
      A: "TX",
      B: "UP",
      C: "PY",
      D: "CA"
    },
    correctAnswer: "A",
    explanation: "Air Caraïbes uses the IATA code TX."
  }
,
  {
    question: "Which IATA code is used by Winair (Windward Islands Airways)?",
    options: {
      A: "WM",
      B: "UP",
      C: "LI",
      D: "TX"
    },
    correctAnswer: "A",
    explanation: "Winair uses the IATA code WM."
  }
,
  {
    question: "Which Caribbean airline has the callsign 'Caribbean'?",
    options: {
      A: "Caribbean Airlines",
      B: "Air Jamaica",
      C: "LIAT",
      D: "Bahamasair"
    },
    correctAnswer: "A",
    explanation: "Caribbean Airlines uses the callsign 'Caribbean'."
  }
,
  {
    question: "Which airline was based in Antigua and once provided extensive inter-island service before ceasing operations in 2020?",
    options: {
      A: "LIAT",
      B: "Winair",
      C: "Air Caraïbes",
      D: "Bahamasair"
    },
    correctAnswer: "A",
    explanation: "LIAT (Leeward Islands Air Transport) was based in Antigua."
  }
,
  {
    question: "Which Caribbean airline had a hub in Curaçao and ceased operations in 2019?",
    options: {
      A: "Insel Air",
      B: "Caribbean Airlines",
      C: "LIAT",
      D: "Winair"
    },
    correctAnswer: "A",
    explanation: "Insel Air was based in Curaçao and shut down in 2019."
  }
,
  {
    question: "Which FIR is responsible for the airspace covering Puerto Rico?",
    options: {
      A: "San Juan FIR",
      B: "Piarco FIR",
      C: "Havana FIR",
      D: "Kingston FIR"
    },
    correctAnswer: "A",
    explanation: "Puerto Rico is covered by the San Juan FIR."
  }
,
  {
    question: "Which FIR is responsible for the airspace around Trinidad & Tobago?",
    options: {
      A: "Piarco FIR",
      B: "San Juan FIR",
      C: "Havana FIR",
      D: "Curacao FIR"
    },
    correctAnswer: "A",
    explanation: "Trinidad & Tobago is covered by the Piarco FIR."
  }
,
  {
    question: "Which FIR controls Cuban airspace?",
    options: {
      A: "Havana FIR",
      B: "San Juan FIR",
      C: "Kingston FIR",
      D: "Piarco FIR"
    },
    correctAnswer: "A",
    explanation: "Cuba is covered by the Havana FIR."
  }
,
  {
    question: "Which FIR covers Jamaica?",
    options: {
      A: "Kingston FIR",
      B: "Havana FIR",
      C: "San Juan FIR",
      D: "Piarco FIR"
    },
    correctAnswer: "A",
    explanation: "Jamaica is covered by the Kingston FIR."
  }
,
  {
    question: "Which ICAO prefix is assigned to airports in the Bahamas?",
    options: {
      A: "MY",
      B: "MB",
      C: "MU",
      D: "MK"
    },
    correctAnswer: "A",
    explanation: "Bahamas airports use the ICAO prefix MY."
  }
,
  {
    question: "Which ICAO prefix is assigned to airports in Cuba?",
    options: {
      A: "MU",
      B: "MK",
      C: "MD",
      D: "MT"
    },
    correctAnswer: "A",
    explanation: "Cuban airports use the ICAO prefix MU."
  }
,
  {
    question: "Which ICAO prefix is assigned to airports in the Dominican Republic?",
    options: {
      A: "MD",
      B: "MU",
      C: "MT",
      D: "MK"
    },
    correctAnswer: "A",
    explanation: "Dominican Republic airports use the ICAO prefix MD."
  }
,
  {
    question: "Which ICAO prefix is assigned to airports in Haiti?",
    options: {
      A: "MT",
      B: "MD",
      C: "MU",
      D: "MK"
    },
    correctAnswer: "A",
    explanation: "Haitian airports use the ICAO prefix MT."
  }
,
  {
    question: "Which ICAO prefix is assigned to airports in Jamaica?",
    options: {
      A: "MK",
      B: "MD",
      C: "MU",
      D: "MY"
    },
    correctAnswer: "A",
    explanation: "Jamaican airports use the ICAO prefix MK."
  }
,
  {
    question: "Which ICAO prefix is used by airports in Trinidad & Tobago?",
    options: {
      A: "TT",
      B: "TB",
      C: "TV",
      D: "TK"
    },
    correctAnswer: "A",
    explanation: "Trinidad & Tobago uses ICAO prefix TT."
  }
,
  {
    question: "Which ICAO prefix is assigned to Barbados?",
    options: {
      A: "TB",
      B: "TT",
      C: "TV",
      D: "TK"
    },
    correctAnswer: "A",
    explanation: "Barbados uses ICAO prefix TB."
  }
,
  {
    question: "Which ICAO prefix is used for airports in St. Vincent & the Grenadines?",
    options: {
      A: "TV",
      B: "TT",
      C: "TB",
      D: "TK"
    },
    correctAnswer: "A",
    explanation: "St. Vincent & the Grenadines use ICAO prefix TV."
  }
,
  {
    question: "Which ICAO prefix is used for airports in St. Kitts & Nevis?",
    options: {
      A: "TK",
      B: "TV",
      C: "TB",
      D: "TT"
    },
    correctAnswer: "A",
    explanation: "St. Kitts & Nevis use ICAO prefix TK."
  }
,
  {
    question: "Which ICAO prefix is used for airports in the French Antilles?",
    options: {
      A: "TF",
      B: "TN",
      C: "TK",
      D: "TV"
    },
    correctAnswer: "A",
    explanation: "French Antilles use ICAO prefix TF."
  }
,
  {
    question: "Which ICAO prefix is used for airports in the Dutch Caribbean?",
    options: {
      A: "TN",
      B: "TF",
      C: "TT",
      D: "MK"
    },
    correctAnswer: "A",
    explanation: "Dutch Caribbean territories use ICAO prefix TN."
  }
,
  {
    question: "Which ICAO prefix is assigned to Cayman Islands airports?",
    options: {
      A: "MW",
      B: "MB",
      C: "MY",
      D: "MU"
    },
    correctAnswer: "A",
    explanation: "Cayman Islands airports use ICAO prefix MW."
  }
,
  {
    question: "Which ICAO prefix is assigned to Turks & Caicos airports?",
    options: {
      A: "MB",
      B: "MW",
      C: "MY",
      D: "MU"
    },
    correctAnswer: "A",
    explanation: "Turks & Caicos use ICAO prefix MB."
  }
,
  {
    question: "Which Caribbean capital city is served by Grantley Adams International (BGI)?",
    options: {
      A: "Bridgetown, Barbados",
      B: "Castries, St. Lucia",
      C: "Kingstown, St. Vincent",
      D: "Port of Spain, Trinidad"
    },
    correctAnswer: "A",
    explanation: "Grantley Adams International serves Bridgetown, Barbados."
  }
,
  {
    question: "Which Caribbean capital city is served by Cheddi Jagan International (GEO)?",
    options: {
      A: "Georgetown, Guyana",
      B: "Paramaribo, Suriname",
      C: "Port of Spain, Trinidad",
      D: "Kingston, Jamaica"
    },
    correctAnswer: "A",
    explanation: "Cheddi Jagan International serves Georgetown, Guyana."
  }
,
  {
    question: "Which Caribbean capital city is served by José Martí International (HAV)?",
    options: {
      A: "Havana, Cuba",
      B: "Santo Domingo, Dominican Republic",
      C: "Port-au-Prince, Haiti",
      D: "San Juan, Puerto Rico"
    },
    correctAnswer: "A",
    explanation: "José Martí International serves Havana, Cuba."
  }
,
  {
    question: "Which Caribbean capital is served by Toussaint Louverture International (PAP)?",
    options: {
      A: "Port-au-Prince, Haiti",
      B: "Havana, Cuba",
      C: "Santo Domingo, Dominican Republic",
      D: "Kingston, Jamaica"
    },
    correctAnswer: "A",
    explanation: "Toussaint Louverture International serves Port-au-Prince, Haiti."
  }
,
  {
    question: "Which Caribbean capital is served by Luis Muñoz Marín International (SJU)?",
    options: {
      A: "San Juan, Puerto Rico",
      B: "Santo Domingo, Dominican Republic",
      C: "Kingston, Jamaica",
      D: "Port of Spain, Trinidad"
    },
    correctAnswer: "A",
    explanation: "Luis Muñoz Marín International serves San Juan, Puerto Rico."
  }
,
  {
    question: "Which Caribbean capital is served by Norman Manley International (KIN)?",
    options: {
      A: "Kingston, Jamaica",
      B: "Montego Bay, Jamaica",
      C: "Havana, Cuba",
      D: "Santo Domingo, Dominican Republic"
    },
    correctAnswer: "A",
    explanation: "Norman Manley International serves Kingston, Jamaica."
  }
,
  {
    question: "Which Caribbean capital is served by Piarco International (POS)?",
    options: {
      A: "Port of Spain, Trinidad",
      B: "Castries, St. Lucia",
      C: "Bridgetown, Barbados",
      D: "Georgetown, Guyana"
    },
    correctAnswer: "A",
    explanation: "Piarco International serves Port of Spain, Trinidad."
  }
,
  {
    question: "Which Caribbean capital is served by V.C. Bird International (ANU)?",
    options: {
      A: "St. John’s, Antigua",
      B: "Basseterre, St. Kitts",
      C: "Kingstown, St. Vincent",
      D: "Castries, St. Lucia"
    },
    correctAnswer: "A",
    explanation: "V.C. Bird International serves St. John’s, Antigua."
  }
,
  {
    question: "Which Caribbean capital is served by Argyle International (SVD)?",
    options: {
      A: "Kingstown, St. Vincent",
      B: "Castries, St. Lucia",
      C: "Bridgetown, Barbados",
      D: "St. George’s, Grenada"
    },
    correctAnswer: "A",
    explanation: "Argyle International serves Kingstown, St. Vincent."
  }
,
  {
    question: "Which Caribbean capital is served by Maurice Bishop International (GND)?",
    options: {
      A: "St. George’s, Grenada",
      B: "Castries, St. Lucia",
      C: "Kingstown, St. Vincent",
      D: "Bridgetown, Barbados"
    },
    correctAnswer: "A",
    explanation: "Maurice Bishop International serves St. George’s, Grenada."
  }
,
  {
    question: "Which Caribbean capital is served by Hewanorra International (UVF)?",
    options: {
      A: "Castries, St. Lucia",
      B: "Bridgetown, Barbados",
      C: "St. George’s, Grenada",
      D: "Kingstown, St. Vincent"
    },
    correctAnswer: "A",
    explanation: "Hewanorra International serves Castries, St. Lucia."
  },
  {
    question: "Which Caribbean FIR is responsible for the majority of oceanic airspace east of the Lesser Antilles?",
    options: {
      A: "Piarco FIR",
      B: "San Juan FIR",
      C: "Atlantico FIR",
      D: "Curacao FIR"
    },
    correctAnswer: "C",
    explanation: "Atlantico FIR covers the oceanic sector east of the Lesser Antilles, connecting Caribbean routes with Africa and Europe."
  }
,
  {
    question: "Which hurricane in 2017 caused catastrophic damage to Sint Maarten’s Princess Juliana International Airport?",
    options: {
      A: "Hurricane Maria",
      B: "Hurricane Irma",
      C: "Hurricane Dorian",
      D: "Hurricane Ivan"
    },
    correctAnswer: "B",
    explanation: "Hurricane Irma struck in September 2017 and destroyed much of TNCM’s terminal and facilities."
  }
,
  {
    question: "What major Caribbean airline was formerly known as BWIA?",
    options: {
      A: "Caribbean Airlines",
      B: "Air Jamaica",
      C: "LIAT",
      D: "Bahamasair"
    },
    correctAnswer: "A",
    explanation: "Caribbean Airlines was formed in 2006 after the closure of BWIA West Indies Airways."
  }
,
  {
    question: "Which Caribbean airport is famous for its challenging short runway perched between cliffs and the sea?",
    options: {
      A: "TNCS – Juancho E. Yrausquin, Saba",
      B: "TFFJ – Gustaf III, St. Barth",
      C: "TVSV – Argyle, St. Vincent",
      D: "TQPF – Clayton J. Lloyd, Anguilla"
    },
    correctAnswer: "A",
    explanation: "TNCS in Saba has the world’s shortest commercial runway at 400m, surrounded by cliffs."
  }
,
  {
    question: "What Caribbean airline had the slogan 'The Caribbean Airline' before ceasing operations in 2015?",
    options: {
      A: "Insel Air",
      B: "BWIA",
      C: "Air Jamaica",
      D: "LIAT"
    },
    correctAnswer: "C",
    explanation: "Air Jamaica marketed itself as 'The Caribbean Airline' before merging into Caribbean Airlines in 2010."
  }
,
  {
    question: "Which Caribbean island’s airport is built almost entirely on reclaimed land extending into the sea?",
    options: {
      A: "St. Kitts – Robert L. Bradshaw",
      B: "Antigua – V.C. Bird",
      C: "Grenada – Maurice Bishop",
      D: "Cayman Islands – Owen Roberts"
    },
    correctAnswer: "C",
    explanation: "Maurice Bishop International Airport in Grenada was constructed with runways projecting over reclaimed coastal land."
  }
,
  {
    question: "Which ICAO prefix do all French overseas Caribbean territories use?",
    options: {
      A: "TF",
      B: "TN",
      C: "TB",
      D: "TT"
    },
    correctAnswer: "A",
    explanation: "Guadeloupe, Martinique, St. Barthélemy, and St. Martin (French side) use the TF prefix."
  }
,
  {
    question: "Which Caribbean FIR is managed by the FAA from Puerto Rico?",
    options: {
      A: "San Juan FIR",
      B: "Havana FIR",
      C: "Curacao FIR",
      D: "Kingston FIR"
    },
    correctAnswer: "A",
    explanation: "The FAA operates the San Juan FIR from Puerto Rico, covering vast areas of the northeast Caribbean."
  }
,
  {
    question: "Which Caribbean airline operated the final scheduled McDonnell Douglas MD-80 flights in the region?",
    options: {
      A: "Insel Air",
      B: "LIAT",
      C: "Caribbean Airlines",
      D: "Bahamasair"
    },
    correctAnswer: "A",
    explanation: "Insel Air, based in Curaçao, operated MD-80 aircraft until its shutdown in 2019."
  }
,
  {
    question: "Which Caribbean nation’s airports use the ICAO prefix 'MW'?",
    options: {
      A: "Cayman Islands",
      B: "Bahamas",
      C: "Turks and Caicos",
      D: "Bermuda"
    },
    correctAnswer: "A",
    explanation: "The Cayman Islands (Owen Roberts and Gerrard-Smith airports) use ICAO codes beginning with MW."
  }
,
  {
    question: "Which VATSIM division covers Cuba, Jamaica, Trinidad, and surrounding FIRs?",
    options: {
      A: "VATCAR",
      B: "VATUSA",
      C: "VATNAF",
      D: "VATEUD"
    },
    correctAnswer: "A",
    explanation: "VATCAR (Caribbean Division) manages VATSIM operations across the Caribbean including Havana, Kingston, and Piarco FIRs."
  }
,
  {
    question: "Which Caribbean airport’s runway is aligned almost directly with prevailing trade winds, making landings smoother?",
    options: {
      A: "Grantley Adams International (Barbados)",
      B: "Norman Manley International (Jamaica)",
      C: "Luis Muñoz Marín International (Puerto Rico)",
      D: "V.C. Bird International (Antigua)"
    },
    correctAnswer: "A",
    explanation: "Grantley Adams International in Barbados is designed with runway orientation aligned to trade winds."
  }
,
  {
    question: "Which Caribbean island is divided between two nations, each with its own airport codes?",
    options: {
      A: "St. Martin/Sint Maarten",
      B: "St. Kitts/Nevis",
      C: "Antigua/Barbuda",
      D: "Trinidad/Tobago"
    },
    correctAnswer: "A",
    explanation: "St. Martin (French, TFFG) and Sint Maarten (Dutch, TNCM) share one island but have separate airports."
  }
,
  {
    question: "Which Caribbean airport is known for approaches over Maho Beach?",
    options: {
      A: "TNCM – Princess Juliana",
      B: "TFFJ – Gustaf III",
      C: "TQPF – Anguilla",
      D: "TBPB – Barbados"
    },
    correctAnswer: "A",
    explanation: "TNCM is world-famous for low approaches over Maho Beach."
  }
,
  {
    question: "Which Caribbean airline had a fleet dominated by De Havilland Dash 8 aircraft before ceasing operations?",
    options: {
      A: "LIAT",
      B: "Air Jamaica",
      C: "Bahamasair",
      D: "Insel Air"
    },
    correctAnswer: "A",
    explanation: "LIAT’s inter-island fleet was almost entirely Dash 8 aircraft."
  }
,
  {
    question: "Which Caribbean airport was originally built as a U.S. military airbase during World War II?",
    options: {
      A: "V.C. Bird International – Antigua",
      B: "Grantley Adams – Barbados",
      C: "Luis Muñoz Marín – Puerto Rico",
      D: "Maurice Bishop – Grenada"
    },
    correctAnswer: "A",
    explanation: "V.C. Bird International in Antigua began as a U.S. military base in 1941."
  }
,
  {
    question: "Which Caribbean capital airport was once called Seawell Airport?",
    options: {
      A: "Bridgetown, Barbados",
      B: "Port of Spain, Trinidad",
      C: "Castries, St. Lucia",
      D: "Georgetown, Guyana"
    },
    correctAnswer: "A",
    explanation: "Grantley Adams International in Barbados was formerly known as Seawell Airport."
  }
,
  {
    question: "Which airline was once jointly owned by multiple Caribbean governments to provide inter-island service?",
    options: {
      A: "LIAT",
      B: "Air Jamaica",
      C: "Caribbean Airlines",
      D: "BWIA"
    },
    correctAnswer: "A",
    explanation: "LIAT was owned by several Caribbean states including Antigua, Barbados, and St. Vincent."
  }
,
  {
    question: "Which major Caribbean FIR borders New York Oceanic to the north?",
    options: {
      A: "San Juan FIR",
      B: "Piarco FIR",
      C: "Havana FIR",
      D: "Kingston FIR"
    },
    correctAnswer: "A",
    explanation: "San Juan FIR borders New York Oceanic airspace to the north."
  }
,
  {
    question: "Which Caribbean airport is famous for its sloping runway that descends towards the sea?",
    options: {
      A: "TFFJ – Gustaf III, St. Barth",
      B: "TNCS – Saba",
      C: "TQPF – Anguilla",
      D: "TVSV – St. Vincent"
    },
    correctAnswer: "A",
    explanation: "St. Barthélemy’s Gustaf III Airport has a sloped runway leading downhill toward the ocean."
  }
,
  {
    question: "Which Caribbean island had its international airport named after former Prime Minister Eric Gairy?",
    options: {
      A: "Grenada",
      B: "Barbados",
      C: "Antigua",
      D: "St. Lucia"
    },
    correctAnswer: "A",
    explanation: "Grenada’s airport was originally named Point Salines, later renamed Maurice Bishop International, after Gairy’s successor."
  }
,
  {
    question: "Which Caribbean airport was central to the 1983 U.S. invasion of Grenada?",
    options: {
      A: "Point Salines (now Maurice Bishop International)",
      B: "Grantley Adams",
      C: "Piarco",
      D: "V.C. Bird"
    },
    correctAnswer: "A",
    explanation: "Point Salines International was a key objective during the U.S. invasion of Grenada in 1983."
  }
,
  {
    question: "Which Caribbean country’s aviation sector was heavily disrupted by Hurricane Dorian in 2019?",
    options: {
      A: "Bahamas",
      B: "Jamaica",
      C: "Cuba",
      D: "Puerto Rico"
    },
    correctAnswer: "A",
    explanation: "Hurricane Dorian devastated the Bahamas, damaging airports in Abaco and Grand Bahama."
  }
,
  {
    question: "Which Caribbean airport is one of the few with parallel runways?",
    options: {
      A: "Santo Domingo – Las Américas",
      B: "San Juan – Luis Muñoz Marín",
      C: "Havana – José Martí",
      D: "Piarco – Trinidad"
    },
    correctAnswer: "D",
    explanation: "Piarco International has two parallel runways 10/28."
  }
,
  {
    question: "Which Caribbean island is home to the only Concorde museum outside of Europe?",
    options: {
      A: "Barbados",
      B: "Trinidad",
      C: "Jamaica",
      D: "Cuba"
    },
    correctAnswer: "A",
    explanation: "Grantley Adams International in Barbados houses Concorde G-BOAE in a dedicated museum."
  }
,
  {
    question: "Which Caribbean airport is located closest to the equator?",
    options: {
      A: "Cheddi Jagan International – Guyana",
      B: "Johan Adolf Pengel – Suriname",
      C: "Piarco – Trinidad",
      D: "Grantley Adams – Barbados"
    },
    correctAnswer: "B",
    explanation: "Johan Adolf Pengel International in Suriname is closer to the equator than other Caribbean airports."
  }
,
  {
    question: "Which Caribbean airline painted one of its aircraft in a special steelpan-themed livery?",
    options: {
      A: "Caribbean Airlines",
      B: "Air Jamaica",
      C: "Bahamasair",
      D: "LIAT"
    },
    correctAnswer: "A",
    explanation: "Caribbean Airlines featured a steelpan design on one of its Boeing 737s."
  }
,
  {
    question: "Which Caribbean FIR directly interfaces with New York Oceanic and Miami Oceanic?",
    options: {
      A: "Havana FIR",
      B: "San Juan FIR",
      C: "Piarco FIR",
      D: "Kingston FIR"
    },
    correctAnswer: "B",
    explanation: "San Juan FIR connects to both New York and Miami Oceanic."
  }
,
  {
    question: "Which Caribbean airline operated a fleet of Airbus A340s for long-haul flights to Europe?",
    options: {
      A: "Air Caraïbes",
      B: "Caribbean Airlines",
      C: "Insel Air",
      D: "Bahamasair"
    },
    correctAnswer: "A",
    explanation: "Air Caraïbes operated Airbus A340s on routes from the Caribbean to Paris."
  }
,
  {
    question: "Which Caribbean airport requires a steep approach over a hilltop with aircraft landing downhill?",
    options: {
      A: "St. Barthélemy – Gustaf III",
      B: "Saba – Juancho E. Yrausquin",
      C: "St. Kitts – Robert L. Bradshaw",
      D: "St. Lucia – Hewanorra"
    },
    correctAnswer: "A",
    explanation: "St. Barth’s Gustaf III requires a steep approach over a hilltop with a downhill runway."
  }
,
  {
    question: "Which Caribbean FIR covers airspace from Trinidad northward through Barbados and the Lesser Antilles?",
    options: {
      A: "Piarco FIR",
      B: "San Juan FIR",
      C: "Curacao FIR",
      D: "Havana FIR"
    },
    correctAnswer: "A",
    explanation: "The Piarco FIR covers Trinidad, Tobago, Barbados, and the Eastern Caribbean."
  }
,
  {
    question: "Which Caribbean island was once a major refueling stop for transatlantic flights before jets had longer range?",
    options: {
      A: "Gander, Newfoundland",
      B: "Bermuda",
      C: "Puerto Rico",
      D: "Trinidad"
    },
    correctAnswer: "B",
    explanation: "Bermuda was a key refueling stop for transatlantic piston and early jet flights."
  }
,
  {
    question: "Which Caribbean airline was formed after the collapse of Air Jamaica?",
    options: {
      A: "Caribbean Airlines",
      B: "LIAT",
      C: "Insel Air",
      D: "Winair"
    },
    correctAnswer: "A",
    explanation: "Caribbean Airlines absorbed Air Jamaica’s operations after its collapse."
  }
,
  {
    question: "Which VATSIM sector is known for its heavy cross-Atlantic traffic into the Caribbean region?",
    options: {
      A: "Piarco Oceanic",
      B: "San Juan CERAP",
      C: "Atlantico FIR",
      D: "Kingston Oceanic"
    },
    correctAnswer: "C",
    explanation: "Atlantico FIR manages oceanic traffic across the Atlantic into the Caribbean."
  }
,
  {
    question: "Which Caribbean airport is located in a valley surrounded by high terrain, requiring special approaches?",
    options: {
      A: "Dominica – Douglas-Charles",
      B: "St. Vincent – Argyle",
      C: "St. Lucia – Hewanorra",
      D: "Grenada – Maurice Bishop"
    },
    correctAnswer: "A",
    explanation: "Dominica’s Douglas-Charles Airport is in a mountainous valley requiring special procedures."
  }
,
  {
    question: "Which Caribbean country once operated a flag carrier named 'Guyana Airways'?",
    options: {
      A: "Guyana",
      B: "Suriname",
      C: "Trinidad",
      D: "Barbados"
    },
    correctAnswer: "A",
    explanation: "Guyana Airways operated as the country’s national carrier before going defunct in the 1990s."
  }
,
  {
    question: "Which Caribbean FIR is known for extensive oceanic ATC responsibilities as well as island control?",
    options: {
      A: "Piarco FIR",
      B: "San Juan FIR",
      C: "Havana FIR",
      D: "Curacao FIR"
    },
    correctAnswer: "A",
    explanation: "Piarco FIR controls both domestic island approaches and large oceanic areas."
  }
,
  {
    question: "Which Caribbean island’s airport was renamed after Maurice Bishop?",
    options: {
      A: "Grenada",
      B: "Barbados",
      C: "Trinidad",
      D: "St. Vincent"
    },
    correctAnswer: "A",
    explanation: "Grenada’s Point Salines Airport was renamed Maurice Bishop International."
  }
,
  {
    question: "Which Caribbean country’s aviation was once supported heavily by Pan Am through regional hubs?",
    options: {
      A: "Puerto Rico",
      B: "Jamaica",
      C: "Bahamas",
      D: "Trinidad"
    },
    correctAnswer: "A",
    explanation: "Pan Am had a large Caribbean hub in San Juan, Puerto Rico."
  }
,
  {
    question: "Which Caribbean island’s airport is known for having no instrument approaches, relying on visual landings?",
    options: {
      A: "Saba – TNCS",
      B: "St. Barth – TFFJ",
      C: "Anguilla – TQPF",
      D: "St. Kitts – TKPK"
    },
    correctAnswer: "B",
    explanation: "St. Barth’s Gustaf III requires only visual approaches due to terrain."
  }
,
  {
    question: "Which Caribbean airport has the highest passenger traffic in the region?",
    options: {
      A: "San Juan – Luis Muñoz Marín",
      B: "Punta Cana – MDPC",
      C: "Havana – José Martí",
      D: "Montego Bay – Sangster"
    },
    correctAnswer: "B",
    explanation: "Punta Cana International handles the highest volume of international tourists in the Caribbean."
  }
,
  {
    question: "Which Caribbean capital’s airport is located on a peninsula jutting into the sea?",
    options: {
      A: "Kingston, Jamaica – Norman Manley",
      B: "Bridgetown, Barbados – Grantley Adams",
      C: "San Juan, Puerto Rico – Luis Muñoz Marín",
      D: "Port of Spain, Trinidad – Piarco"
    },
    correctAnswer: "A",
    explanation: "Norman Manley International in Kingston sits on the Palisadoes peninsula."
  }
,
  {
    question: "Which Caribbean airline painted its planes with bright hummingbird logos?",
    options: {
      A: "Caribbean Airlines",
      B: "Air Jamaica",
      C: "Bahamasair",
      D: "LIAT"
    },
    correctAnswer: "A",
    explanation: "Caribbean Airlines features the hummingbird as its signature logo."
  }
,
  {
    question: "Which Caribbean island is home to VC Bird International Airport?",
    options: {
      A: "Antigua",
      B: "Barbados",
      C: "Grenada",
      D: "St. Kitts"
    },
    correctAnswer: "A",
    explanation: "Antigua’s main airport is V.C. Bird International."
  }
,
  {
    question: "Which Caribbean FIR is often the transition point for flights crossing the Atlantic from Europe into South America?",
    options: {
      A: "Piarco FIR",
      B: "San Juan FIR",
      C: "Curacao FIR",
      D: "Havana FIR"
    },
    correctAnswer: "A",
    explanation: "Piarco FIR handles significant transatlantic traffic to South America."
  }
,
  {
    question: "Which Caribbean airline once used the slogan 'One Caribbean'?",
    options: {
      A: "LIAT",
      B: "Insel Air",
      C: "Caribbean Airlines",
      D: "Air Jamaica"
    },
    correctAnswer: "A",
    explanation: "LIAT promoted itself as 'One Caribbean' airline."
  }
,
  {
    question: "Which Caribbean nation has an airspace sector called Kingston FIR?",
    options: {
      A: "Jamaica",
      B: "Barbados",
      C: "Trinidad",
      D: "Bahamas"
    },
    correctAnswer: "A",
    explanation: "Kingston FIR covers Jamaica’s airspace."
  }
,
  {
    question: "Which Caribbean airport has a runway directly abutting the sea with frequent saltwater spray?",
    options: {
      A: "Sint Maarten – TNCM",
      B: "Dominica – TDPD",
      C: "St. Lucia – TLPL",
      D: "Grenada – TGPY"
    },
    correctAnswer: "D",
    explanation: "Maurice Bishop International in Grenada sits at the coast with runway ends near the sea."
  }
,
  {
    question: "Which Caribbean FIR includes Haiti and the Dominican Republic?",
    options: {
      A: "Port-au-Prince FIR",
      B: "Santo Domingo FIR",
      C: "San Juan FIR",
      D: "Kingston FIR"
    },
    correctAnswer: "B",
    explanation: "Santo Domingo FIR covers the Dominican Republic, while Haiti has Port-au-Prince FIR."
  }
,
  {
    question: "Which Caribbean airline was based in Curaçao?",
    options: {
      A: "Insel Air",
      B: "LIAT",
      C: "Air Caraïbes",
      D: "Bahamasair"
    },
    correctAnswer: "A",
    explanation: "Insel Air was headquartered in Curaçao until it ceased operations."
  }
,
  {
    question: "Which Caribbean country’s aviation regulator is called CAD?",
    options: {
      A: "Barbados",
      B: "Jamaica",
      C: "Trinidad and Tobago",
      D: "Bahamas"
    },
    correctAnswer: "A",
    explanation: "The Civil Aviation Department (CAD) is the regulator in Barbados."
  }
,
  {
    question: "Which Caribbean airport has one of the most difficult approaches due to mountainous terrain and short runway?",
    options: {
      A: "St. Lucia – George F. L. Charles",
      B: "St. Vincent – Argyle",
      C: "Dominica – Douglas-Charles",
      D: "St. Kitts – Robert L. Bradshaw"
    },
    correctAnswer: "C",
    explanation: "Douglas-Charles in Dominica has a short runway surrounded by mountains."
  }
,
  {
    question: "Which Caribbean nation’s FIR was historically managed from Miami until regional ATC centers took over?",
    options: {
      A: "Bahamas",
      B: "Jamaica",
      C: "Barbados",
      D: "Haiti"
    },
    correctAnswer: "A",
    explanation: "The Bahamas FIR was once controlled by Miami Center before transitioning locally."
  }
,
  {
    question: "Which Caribbean island’s airport is named after Nobel Laureate Derek Walcott?",
    options: {
      A: "St. Lucia",
      B: "Barbados",
      C: "Trinidad",
      D: "Antigua"
    },
    correctAnswer: "A",
    explanation: "Castries airport in St. Lucia was renamed George F. L. Charles Airport but has a terminal honoring Derek Walcott."
  }
,
  {
    question: "Which Caribbean FIR has the ICAO code MTEG?",
    options: {
      A: "Guatemala FIR",
      B: "Curacao FIR",
      C: "Tegucigalpa FIR",
      D: "Havana FIR"
    },
    correctAnswer: "C",
    explanation: "MTEG corresponds to Tegucigalpa FIR, covering Central America adjacent to the Caribbean."
  }
,
  {
    question: "Which Caribbean island nation is home to Hewanorra International Airport?",
    options: {
      A: "St. Lucia",
      B: "St. Vincent",
      C: "Grenada",
      D: "Antigua"
    },
    correctAnswer: "A",
    explanation: "Hewanorra International serves St. Lucia."
  }
,
  {
    question: "Which Caribbean FIR is based in Havana?",
    options: {
      A: "Havana FIR",
      B: "Curacao FIR",
      C: "San Juan FIR",
      D: "Kingston FIR"
    },
    correctAnswer: "A",
    explanation: "Havana FIR covers Cuba and surrounding airspace."
  }
,
  {
    question: "Which Caribbean airline was nicknamed 'The Airline That Wouldn’t Die'?",
    options: {
      A: "LIAT",
      B: "Insel Air",
      C: "Air Jamaica",
      D: "Bahamasair"
    },
    correctAnswer: "A",
    explanation: "LIAT earned the nickname due to its multiple restructurings and survival attempts."
  }
,
  {
    question: "Which Caribbean airport has a control tower located directly adjacent to its terminal rooftop?",
    options: {
      A: "St. Barth – TFFJ",
      B: "St. Kitts – TKPK",
      C: "Grenada – TGPY",
      D: "Barbados – TBPB"
    },
    correctAnswer: "A",
    explanation: "St. Barth’s Gustaf III has a tower positioned directly on top of the terminal."
  }
,
  {
    question: "Which Caribbean FIR is geographically the smallest by area?",
    options: {
      A: "Curacao FIR",
      B: "San Juan FIR",
      C: "Kingston FIR",
      D: "Port-au-Prince FIR"
    },
    correctAnswer: "D",
    explanation: "Port-au-Prince FIR is the smallest, covering only Haiti’s limited airspace."
  }
,
  {
    question: "Which Caribbean island’s airport was once operated by Pan Am?",
    options: {
      A: "Puerto Rico",
      B: "Bahamas",
      C: "Barbados",
      D: "Jamaica"
    },
    correctAnswer: "B",
    explanation: "Pan Am developed Nassau as a major regional hub."
  }
,
  {
    question: "Which Caribbean island’s main airport has a runway built parallel to its coastlines for maximum wind alignment?",
    options: {
      A: "Antigua – V.C. Bird",
      B: "Barbados – Grantley Adams",
      C: "St. Lucia – Hewanorra",
      D: "Grenada – Maurice Bishop"
    },
    correctAnswer: "B",
    explanation: "Barbados’ Grantley Adams runway runs parallel to its southeast coast."
  }
,
  {
    question: "Which Caribbean airport has a displaced threshold due to a public road running across its approach path?",
    options: {
      A: "TNCM – Sint Maarten",
      B: "TFFJ – St. Barth",
      C: "TQPF – Anguilla",
      D: "TVSV – St. Vincent"
    },
    correctAnswer: "A",
    explanation: "Princess Juliana’s Runway 10 approach crosses a public road and beach."
  }
,
  {
    question: "Which Caribbean airline’s fleet was once entirely composed of Boeing 727 aircraft?",
    options: {
      A: "Bahamasair",
      B: "Air Jamaica",
      C: "BWIA",
      D: "Guyana Airways"
    },
    correctAnswer: "B",
    explanation: "Air Jamaica initially operated a fleet of Boeing 727s before expanding."
  }
,
  {
    question: "Which Caribbean FIR often coordinates traffic from South America into Miami and New York centers?",
    options: {
      A: "Piarco FIR",
      B: "Curacao FIR",
      C: "Kingston FIR",
      D: "Havana FIR"
    },
    correctAnswer: "A",
    explanation: "Piarco FIR acts as a handoff point for South America–U.S. traffic."
  }
,
  {
    question: "Which Caribbean airline famously painted aircraft in a colorful 'Reggae Bird' livery?",
    options: {
      A: "Air Jamaica",
      B: "Caribbean Airlines",
      C: "Bahamasair",
      D: "Insel Air"
    },
    correctAnswer: "A",
    explanation: "Air Jamaica’s 'Reggae Bird' livery became iconic across the region."
  }
,
  {
    question: "Which Caribbean island has two international airports: Hewanorra and George F. L. Charles?",
    options: {
      A: "St. Lucia",
      B: "St. Vincent",
      C: "Grenada",
      D: "Barbados"
    },
    correctAnswer: "A",
    explanation: "St. Lucia has Hewanorra for long-haul and George F. L. Charles for inter-island flights."
  }
,
  {
    question: "Which Caribbean FIR handles the approach into Guadeloupe and Martinique?",
    options: {
      A: "Piarco FIR",
      B: "San Juan FIR",
      C: "Atlantico FIR",
      D: "Curacao FIR"
    },
    correctAnswer: "A",
    explanation: "Piarco FIR is responsible for French Caribbean approaches."
  }
,
  {
    question: "Which Caribbean island nation’s flag carrier was BWIA?",
    options: {
      A: "Trinidad and Tobago",
      B: "Jamaica",
      C: "Barbados",
      D: "Guyana"
    },
    correctAnswer: "A",
    explanation: "British West Indian Airways was Trinidad and Tobago’s national airline."
  }
,
  {
    question: "Which Caribbean airport was once used as a NASA Space Shuttle emergency landing site?",
    options: {
      A: "San Juan – TJSJ",
      B: "Piarco – TTPP",
      C: "Grantley Adams – TBPB",
      D: "Las Américas – MDSD"
    },
    correctAnswer: "D",
    explanation: "Las Américas in the Dominican Republic was designated as a Shuttle alternate landing site."
  }
,
  {
    question: "Which Caribbean FIR has coordination with Dakar FIR across the Atlantic?",
    options: {
      A: "Piarco FIR",
      B: "San Juan FIR",
      C: "Atlantico FIR",
      D: "Havana FIR"
    },
    correctAnswer: "C",
    explanation: "Atlantico FIR links traffic between West Africa and the Caribbean."
  }
,
  {
    question: "Which Caribbean island’s airport was renamed Argyle International in 2017?",
    options: {
      A: "St. Vincent",
      B: "Grenada",
      C: "Antigua",
      D: "Barbados"
    },
    correctAnswer: "A",
    explanation: "St. Vincent opened Argyle International in 2017, replacing E.T. Joshua Airport."
  }
,
  {
    question: "Which Caribbean island has an airport named after Nobel Laureate V.C. Bird?",
    options: {
      A: "Antigua",
      B: "St. Lucia",
      C: "Jamaica",
      D: "Bahamas"
    },
    correctAnswer: "A",
    explanation: "Antigua’s airport honors Prime Minister Vere Cornwall Bird."
  }
,
  {
    question: "Which Caribbean FIR borders Curacao FIR to the west?",
    options: {
      A: "Piarco FIR",
      B: "Bogota FIR",
      C: "Panama FIR",
      D: "Havana FIR"
    },
    correctAnswer: "B",
    explanation: "Curacao FIR borders Bogota FIR over northern South America."
  }
,
  {
    question: "Which Caribbean airline operated Boeing 747s briefly for transatlantic flights?",
    options: {
      A: "Air Jamaica",
      B: "LIAT",
      C: "Caribbean Airlines",
      D: "Bahamasair"
    },
    correctAnswer: "A",
    explanation: "Air Jamaica briefly operated 747s on flights to London."
  }
,
  {
    question: "Which Caribbean nation’s aviation authority is the TTCAA?",
    options: {
      A: "Trinidad and Tobago",
      B: "Jamaica",
      C: "Barbados",
      D: "Guyana"
    },
    correctAnswer: "A",
    explanation: "The Trinidad and Tobago Civil Aviation Authority regulates aviation there."
  }
,
  {
    question: "Which Caribbean island’s airport is closest to South America?",
    options: {
      A: "Trinidad – Piarco",
      B: "Grenada – Maurice Bishop",
      C: "Barbados – Grantley Adams",
      D: "Curacao – Hato"
    },
    correctAnswer: "A",
    explanation: "Trinidad’s Piarco International is the closest to South America."
  }
,
  {
    question: "Which Caribbean FIR interfaces directly with Miami Oceanic?",
    options: {
      A: "Havana FIR",
      B: "Kingston FIR",
      C: "San Juan FIR",
      D: "Curacao FIR"
    },
    correctAnswer: "A",
    explanation: "Havana FIR borders Miami Oceanic airspace."
  }
,
  {
    question: "Which Caribbean airline was famous for serving meals with authentic local cuisine?",
    options: {
      A: "Air Jamaica",
      B: "Caribbean Airlines",
      C: "LIAT",
      D: "Bahamasair"
    },
    correctAnswer: "A",
    explanation: "Air Jamaica was known for offering Caribbean dishes on board."
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
