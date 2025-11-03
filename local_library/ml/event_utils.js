// local_library/ml_event_utils.js
// Utility functions for VATSIM event integration

/**
 * Map ICAO airport code to facility name
 * Based on FIR (Flight Information Region) assignments
 */
function mapAirportToFacility(icao) {
  const facilityMap = {
    // Caribbean (CARI_FSS)
    // Note: No specific airports, general region

    // Curacao FIR (ABC Islands)
    'TNCC': 'Curacao', // Hato International (Curacao)
    'TNCA': 'Curacao', // Queen Beatrix (Aruba)
    'TNCB': 'Curacao', // Flamingo (Bonaire)
    'TNCF': 'Curacao', // Curacao (alternative)

    // Havana FIR (Cuba)
    'MUHA': 'Havana', // Jose Marti
    'MUCU': 'Havana', // Antonio Maceo (Santiago)
    'MUSC': 'Havana', // Abel Santamaria (Santa Clara)
    'MUCM': 'Havana', // Ignacio Agramonte (Camaguey)
    'MUVR': 'Havana', // Juan Gualberto Gomez (Varadero)
    'MUCC': 'Havana', // Jardines del Rey
    'MUCL': 'Havana', // Cayo Largo del Sur
    'MUCF': 'Havana', // Jaime Gonzalez (Cienfuegos)
    'MUHG': 'Havana', // Frank Pais (Holguin)
    'MUBA': 'Havana', // Gustavo Rizo (Baracoa)
    'MUGT': 'Havana', // Mariana Grajales (Guantanamo)
    'MUMZ': 'Havana', // Sierra Maestra (Manzanillo)
    'MUNG': 'Havana', // Maximo Gomez (Cayo Coco)
    'MUPB': 'Havana', // Playa Baracoa

    // Kingston FIR (Jamaica & Cayman Islands)
    'MKJP': 'Kingston', // Norman Manley (Kingston)
    'MKJS': 'Kingston', // Sangster International (Montego Bay)
    'MWCR': 'Kingston', // Owen Roberts (Grand Cayman)
    'MWCB': 'Kingston', // Charles Kirkconnell (Cayman Brac)

    // Nassau FIR (Bahamas & Turks and Caicos)
    'MYNN': 'Nassau', // Lynden Pindling (Nassau)
    'MYGF': 'Nassau', // Grand Bahama International (Freeport)
    'MBPV': 'Nassau', // Providenciales International
    'MBGT': 'Nassau', // JAGS McCartney (Grand Turk)
    'MYAB': 'Nassau', // Marsh Harbour
    'MYEF': 'Nassau', // Governor's Harbour
    'MYEG': 'Nassau', // George Town (Exuma)
    'MYER': 'Nassau', // Rock Sound
    'MYGW': 'Nassau', // Great Exuma
    'MYLS': 'Nassau', // San Salvador

    // Port-au-Prince FIR (Haiti)
    'MTPP': 'Port-au-Prince', // Toussaint Louverture
    'MTCH': 'Port-au-Prince', // Hugo Chavez (Cap-Haitien)

    // San Juan FIR (Puerto Rico, USVI, BVI, Leeward Islands north)
    'TJSJ': 'San Juan', // Luis Munoz Marin
    'TJIG': 'San Juan', // Fernando Luis Ribas Dominicci (Isla Grande)
    'TJBQ': 'San Juan', // Rafael Hernandez (Aguadilla)
    'TIST': 'San Juan', // Cyril E. King (St. Thomas)
    'TISX': 'San Juan', // Henry E. Rohlsen (St. Croix)
    'TUPJ': 'San Juan', // Terrance B. Lettsome (Beef Island, BVI)
    'TNCM': 'San Juan', // Princess Juliana (St. Maarten)
    'TQPF': 'San Juan', // Clayton J. Lloyd (Anguilla)
    'TKPK': 'San Juan', // Robert L. Bradshaw (St. Kitts)
    'TKPN': 'San Juan', // Vance W. Amory (Nevis)
    'TAPA': 'San Juan', // V.C. Bird (Antigua)
    'TFFR': 'San Juan', // Pointe-a-Pitre (Guadeloupe)
    'TFFF': 'San Juan', // Martinique Aime Cesaire

    // Santo Domingo FIR (Dominican Republic)
    'MDSD': 'Santo Domingo', // Las Americas International
    'MDJB': 'Santo Domingo', // La Isabela International
    'MDPC': 'Santo Domingo', // Punta Cana International
    'MDPP': 'Santo Domingo', // Gregorio Luperon (Puerto Plata)
    'MDLR': 'Santo Domingo', // La Romana International
    'MDCY': 'Santo Domingo', // Samana El Catey
    'MDST': 'Santo Domingo', // Cibao International (Santiago)
    'MDBH': 'Santo Domingo', // Maria Montez (Barahona)

    // Piarco FIR (Trinidad & Tobago, Windward Islands, Leeward Islands south)
    'TTPP': 'Piarco', // Piarco International (Trinidad)
    'TTCP': 'Piarco', // Arthur Napoleon Raymond Robinson (Tobago)
    'TGPY': 'Piarco', // Maurice Bishop (Grenada)
    'TVSA': 'Piarco', // Argyle International (St. Vincent)
    'TVSC': 'Piarco', // Canouan
    'TBPB': 'Piarco', // Grantley Adams (Barbados)
    'TLPL': 'Piarco', // George F. L. Charles (St. Lucia)
    'TDPD': 'Piarco', // Douglas-Charles (Dominica)

    // Miami Center (ZMO_CTR - technically US but covers Bahamas airspace)
    // Mapped to Nassau since it covers Bahamas area
  };

  return facilityMap[icao.toUpperCase()] || null;
}

/**
 * Get all unique facilities affected by an event's airport list
 * @param {Array<{icao: string}>} airports - Array of airport objects from VATSIM API
 * @returns {Array<string>} - Unique list of facility names
 */
function getAffectedFacilities(airports) {
  const facilities = new Set();

  for (const airport of airports) {
    const facility = mapAirportToFacility(airport.icao);
    if (facility) {
      facilities.add(facility);
    }
  }

  return Array.from(facilities);
}

module.exports = {
  mapAirportToFacility,
  getAffectedFacilities,
};
