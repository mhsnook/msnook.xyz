// Foreign military bases data with approximate establishment years
// Sources: Wikipedia, DOD Base Structure Reports, academic research
// This is a representative (not exhaustive) dataset focused on major installations

export interface MilitaryBase {
  name: string
  country: string // host country
  operator: string // operating country
  lat: number
  lng: number
  established: number // year
  closed?: number // year closed, if applicable
}

export const bases: MilitaryBase[] = [
  // === UNITED STATES BASES ===
  // Europe
  { name: 'Ramstein Air Base', country: 'Germany', operator: 'US', lat: 49.4369, lng: 7.6003, established: 1953 },
  { name: 'Landstuhl', country: 'Germany', operator: 'US', lat: 49.4061, lng: 7.5644, established: 1953 },
  { name: 'Spangdahlem Air Base', country: 'Germany', operator: 'US', lat: 49.9726, lng: 6.6925, established: 1953 },
  { name: 'Grafenwoehr', country: 'Germany', operator: 'US', lat: 49.6983, lng: 11.9400, established: 1951 },
  { name: 'Stuttgart (EUCOM)', country: 'Germany', operator: 'US', lat: 48.7270, lng: 9.1153, established: 1953 },
  { name: 'Wiesbaden', country: 'Germany', operator: 'US', lat: 50.0496, lng: 8.2733, established: 1953 },
  { name: 'Aviano Air Base', country: 'Italy', operator: 'US', lat: 46.0319, lng: 12.5965, established: 1955 },
  { name: 'Naval Air Station Sigonella', country: 'Italy', operator: 'US', lat: 37.4017, lng: 14.9222, established: 1959 },
  { name: 'Camp Darby', country: 'Italy', operator: 'US', lat: 43.6833, lng: 10.3333, established: 1952 },
  { name: 'Naval Station Rota', country: 'Spain', operator: 'US', lat: 36.6333, lng: -6.3500, established: 1955 },
  { name: 'Moron Air Base', country: 'Spain', operator: 'US', lat: 37.1750, lng: -5.6150, established: 1953 },
  { name: 'RAF Lakenheath', country: 'UK', operator: 'US', lat: 52.4093, lng: 0.5610, established: 1950 },
  { name: 'RAF Mildenhall', country: 'UK', operator: 'US', lat: 52.3613, lng: 0.4864, established: 1950 },
  { name: 'RAF Fairford', country: 'UK', operator: 'US', lat: 51.6822, lng: -1.7900, established: 1950 },
  { name: 'RAF Croughton', country: 'UK', operator: 'US', lat: 51.9942, lng: -1.2058, established: 1950 },
  { name: 'Souda Bay', country: 'Greece', operator: 'US', lat: 35.4875, lng: 24.1181, established: 1969 },
  { name: 'Incirlik Air Base', country: 'Turkey', operator: 'US', lat: 37.0017, lng: 35.4258, established: 1955 },
  { name: 'Izmir Air Station', country: 'Turkey', operator: 'US', lat: 38.4300, lng: 27.1536, established: 1954 },
  { name: 'Keflavik', country: 'Iceland', operator: 'US', lat: 63.9850, lng: -22.6056, established: 1951, closed: 2006 },
  { name: 'Thule Air Base', country: 'Greenland', operator: 'US', lat: 76.5312, lng: -68.7031, established: 1951 },
  { name: 'Lajes Field', country: 'Portugal (Azores)', operator: 'US', lat: 38.7618, lng: -27.0908, established: 1954 },
  { name: 'Deveselu', country: 'Romania', operator: 'US', lat: 44.0275, lng: 24.3642, established: 2016 },
  { name: 'Redzikowo', country: 'Poland', operator: 'US', lat: 54.4778, lng: 17.1000, established: 2024 },
  { name: 'Bezmer Air Base', country: 'Bulgaria', operator: 'US', lat: 42.4556, lng: 26.3519, established: 2006 },
  { name: 'Mihail Kogalniceanu', country: 'Romania', operator: 'US', lat: 44.3569, lng: 28.4875, established: 2003 },
  { name: 'Camp Bondsteel', country: 'Kosovo', operator: 'US', lat: 42.3600, lng: 21.2486, established: 1999 },
  { name: 'Wheelus Air Base', country: 'Libya', operator: 'US', lat: 32.8922, lng: 13.2764, established: 1950, closed: 1970 },

  // Pacific / Asia
  { name: 'Yokota Air Base', country: 'Japan', operator: 'US', lat: 35.7486, lng: 139.3486, established: 1950 },
  { name: 'Yokosuka Naval Base', country: 'Japan', operator: 'US', lat: 35.2836, lng: 139.6550, established: 1950 },
  { name: 'Kadena Air Base', country: 'Japan (Okinawa)', operator: 'US', lat: 26.3516, lng: 127.7693, established: 1950 },
  { name: 'Marine Corps Air Station Futenma', country: 'Japan (Okinawa)', operator: 'US', lat: 26.2742, lng: 127.7558, established: 1950 },
  { name: 'Camp Hansen', country: 'Japan (Okinawa)', operator: 'US', lat: 26.5031, lng: 127.8281, established: 1950 },
  { name: 'Sasebo Naval Base', country: 'Japan', operator: 'US', lat: 33.1603, lng: 129.7111, established: 1950 },
  { name: 'Misawa Air Base', country: 'Japan', operator: 'US', lat: 40.7033, lng: 141.3686, established: 1950 },
  { name: 'Camp Humphreys', country: 'South Korea', operator: 'US', lat: 36.9631, lng: 127.0311, established: 1950 },
  { name: 'Osan Air Base', country: 'South Korea', operator: 'US', lat: 37.0906, lng: 127.0297, established: 1952 },
  { name: 'Kunsan Air Base', country: 'South Korea', operator: 'US', lat: 35.9038, lng: 126.6159, established: 1951 },
  { name: 'Camp Casey', country: 'South Korea', operator: 'US', lat: 37.8900, lng: 127.0500, established: 1952, closed: 2025 },
  { name: 'Andersen Air Force Base', country: 'Guam', operator: 'US', lat: 13.5840, lng: 144.9248, established: 1950 },
  { name: 'Naval Base Guam', country: 'Guam', operator: 'US', lat: 13.4443, lng: 144.6588, established: 1950 },
  { name: 'Clark Air Base', country: 'Philippines', operator: 'US', lat: 15.1860, lng: 120.5592, established: 1950, closed: 1991 },
  { name: 'Subic Bay', country: 'Philippines', operator: 'US', lat: 14.7944, lng: 120.2722, established: 1950, closed: 1992 },
  { name: 'Diego Garcia', country: 'British Indian Ocean Territory', operator: 'US', lat: -7.3195, lng: 72.4229, established: 1971 },
  { name: 'Pine Gap', country: 'Australia', operator: 'US', lat: -23.7990, lng: 133.7370, established: 1970 },
  { name: 'Northwest Cape', country: 'Australia', operator: 'US', lat: -21.8161, lng: 114.1654, established: 1963 },
  { name: 'EDCA Basa Air Base', country: 'Philippines', operator: 'US', lat: 15.1860, lng: 120.5592, established: 2023 },
  { name: 'EDCA Fort Magsaysay', country: 'Philippines', operator: 'US', lat: 15.5400, lng: 121.1100, established: 2023 },
  { name: 'Camp Lemonnier', country: 'Djibouti', operator: 'US', lat: 11.5469, lng: 43.1558, established: 2003 },

  // Middle East
  { name: 'Al Udeid Air Base', country: 'Qatar', operator: 'US', lat: 25.1174, lng: 51.3150, established: 2001 },
  { name: 'Al Dhafra Air Base', country: 'UAE', operator: 'US', lat: 24.2486, lng: 54.5475, established: 2001 },
  { name: 'Camp Arifjan', country: 'Kuwait', operator: 'US', lat: 29.1017, lng: 48.0833, established: 1991 },
  { name: 'Ali Al Salem Air Base', country: 'Kuwait', operator: 'US', lat: 29.3467, lng: 47.5208, established: 1991 },
  { name: 'Naval Support Activity Bahrain', country: 'Bahrain', operator: 'US', lat: 26.2361, lng: 50.6522, established: 1971 },
  { name: 'Prince Sultan Air Base', country: 'Saudi Arabia', operator: 'US', lat: 24.0627, lng: 47.5802, established: 2019 },
  { name: 'Eskan Village', country: 'Saudi Arabia', operator: 'US', lat: 24.6550, lng: 46.7100, established: 1991, closed: 2003 },
  { name: 'Dhahran Airfield', country: 'Saudi Arabia', operator: 'US', lat: 26.2653, lng: 50.1522, established: 1950, closed: 1962 },

  // Central Asia / Afghanistan
  { name: 'Bagram Airfield', country: 'Afghanistan', operator: 'US', lat: 34.9461, lng: 69.2650, established: 2001, closed: 2021 },
  { name: 'Kandahar Airfield', country: 'Afghanistan', operator: 'US', lat: 31.5058, lng: 65.8478, established: 2001, closed: 2021 },
  { name: 'Manas Air Base', country: 'Kyrgyzstan', operator: 'US', lat: 43.0617, lng: 74.4777, established: 2001, closed: 2014 },
  { name: 'K2 (Karshi-Khanabad)', country: 'Uzbekistan', operator: 'US', lat: 38.8336, lng: 65.9214, established: 2001, closed: 2005 },

  // Africa
  { name: 'Camp Simba', country: 'Kenya', operator: 'US', lat: -2.2642, lng: 40.9017, established: 2004 },
  { name: 'Cooperative Security Location Ouagadougou', country: 'Burkina Faso', operator: 'US', lat: 12.3532, lng: -1.5124, established: 2007, closed: 2023 },
  { name: 'Air Base 201', country: 'Niger', operator: 'US', lat: 16.9775, lng: 7.9897, established: 2014, closed: 2024 },
  { name: 'Air Base 101', country: 'Niger', operator: 'US', lat: 13.4817, lng: 2.1833, established: 2013, closed: 2024 },

  // Americas
  { name: 'Guantanamo Bay', country: 'Cuba', operator: 'US', lat: 19.9022, lng: -75.0969, established: 1950 },
  { name: 'Soto Cano Air Base', country: 'Honduras', operator: 'US', lat: 14.3828, lng: -87.6225, established: 1982 },
  { name: 'Curacao (FOL Hato)', country: 'Curacao', operator: 'US', lat: 12.1696, lng: -68.9596, established: 2000 },
  { name: 'Aruba (FOL Reina Beatrix)', country: 'Aruba', operator: 'US', lat: 12.5013, lng: -70.0152, established: 2000 },

  // Vietnam War era (closed)
  { name: 'Cam Ranh Bay', country: 'Vietnam', operator: 'US', lat: 11.9981, lng: 109.2194, established: 1965, closed: 1972 },
  { name: 'Da Nang Air Base', country: 'Vietnam', operator: 'US', lat: 16.0440, lng: 108.1997, established: 1965, closed: 1972 },
  { name: 'U-Tapao', country: 'Thailand', operator: 'US', lat: 12.6800, lng: 101.0050, established: 1966, closed: 1976 },
  { name: 'Korat Air Base', country: 'Thailand', operator: 'US', lat: 14.9344, lng: 102.0786, established: 1962, closed: 1976 },

  // Panama
  { name: 'Howard Air Force Base', country: 'Panama', operator: 'US', lat: 8.9167, lng: -79.6000, established: 1950, closed: 1999 },
  { name: 'Fort Clayton', country: 'Panama', operator: 'US', lat: 9.0000, lng: -79.5833, established: 1950, closed: 1999 },

  // === RUSSIA / USSR BASES ===
  { name: 'Sevastopol Naval Base', country: 'Ukraine (Crimea)', operator: 'Russia', lat: 44.6167, lng: 33.5254, established: 1950 },
  { name: 'Tartus Naval Facility', country: 'Syria', operator: 'Russia', lat: 34.8900, lng: 35.8867, established: 1971 },
  { name: 'Khmeimim Air Base', country: 'Syria', operator: 'Russia', lat: 35.4108, lng: 35.9486, established: 2015 },
  { name: 'Gyumri (102nd Base)', country: 'Armenia', operator: 'Russia', lat: 40.7842, lng: 43.8453, established: 1995 },
  { name: 'Kant Air Base', country: 'Kyrgyzstan', operator: 'Russia', lat: 42.8533, lng: 74.8464, established: 2003 },
  { name: 'Baikonur', country: 'Kazakhstan', operator: 'Russia', lat: 45.6200, lng: 63.3050, established: 1955 },
  { name: '201st Military Base', country: 'Tajikistan', operator: 'Russia', lat: 38.5592, lng: 68.7736, established: 1993 },
  { name: 'Cam Ranh Bay', country: 'Vietnam', operator: 'Russia', lat: 11.9981, lng: 109.2194, established: 1979, closed: 2002 },
  { name: 'Lourdes SIGINT', country: 'Cuba', operator: 'Russia', lat: 22.9833, lng: -82.5167, established: 1964, closed: 2001 },
  { name: 'Gabala Radar Station', country: 'Azerbaijan', operator: 'Russia', lat: 40.8817, lng: 47.7825, established: 1985, closed: 2012 },
  // Soviet-era Eastern Europe (closed)
  { name: 'Wunsdorf (Soviet HQ Germany)', country: 'East Germany', operator: 'Russia', lat: 52.1667, lng: 13.4667, established: 1950, closed: 1994 },
  { name: 'Legnica', country: 'Poland', operator: 'Russia', lat: 51.2100, lng: 16.1619, established: 1950, closed: 1993 },
  { name: 'Milovice', country: 'Czechoslovakia', operator: 'Russia', lat: 50.2267, lng: 14.8894, established: 1968, closed: 1991 },
  { name: 'Tokol Air Base', country: 'Hungary', operator: 'Russia', lat: 47.3572, lng: 18.9775, established: 1956, closed: 1991 },

  // === FRANCE BASES ===
  { name: 'Djibouti (FFDj)', country: 'Djibouti', operator: 'France', lat: 11.5478, lng: 43.1528, established: 1977 },
  { name: 'Reunion Island', country: 'Reunion', operator: 'France', lat: -21.1151, lng: 55.5364, established: 1950 },
  { name: 'New Caledonia', country: 'New Caledonia', operator: 'France', lat: -22.2558, lng: 166.4505, established: 1950 },
  { name: 'French Polynesia (Papeete)', country: 'French Polynesia', operator: 'France', lat: -17.5516, lng: -149.5585, established: 1950 },
  { name: 'Martinique', country: 'Martinique', operator: 'France', lat: 14.5950, lng: -61.0653, established: 1950 },
  { name: 'French Guiana (Kourou)', country: 'French Guiana', operator: 'France', lat: 5.1594, lng: -52.6503, established: 1950 },
  { name: 'Dakar', country: 'Senegal', operator: 'France', lat: 14.7399, lng: -17.4902, established: 1960, closed: 2010 },
  { name: 'Libreville', country: 'Gabon', operator: 'France', lat: 0.3924, lng: 9.4536, established: 1960 },
  { name: 'Abidjan (Port Bouet)', country: 'Ivory Coast', operator: 'France', lat: 5.2610, lng: -3.9264, established: 1960 },
  { name: 'N\'Djamena', country: 'Chad', operator: 'France', lat: 12.1336, lng: 15.0355, established: 1986 },
  { name: 'Niamey', country: 'Niger', operator: 'France', lat: 13.4817, lng: 2.1050, established: 2013, closed: 2023 },
  { name: 'UAE (Al Dhafra)', country: 'UAE', operator: 'France', lat: 24.2286, lng: 54.5675, established: 2009 },

  // === UK BASES ===
  { name: 'Akrotiri', country: 'Cyprus', operator: 'UK', lat: 34.5839, lng: 32.9880, established: 1960 },
  { name: 'Dhekelia', country: 'Cyprus', operator: 'UK', lat: 34.9833, lng: 33.7500, established: 1960 },
  { name: 'Mount Pleasant', country: 'Falkland Islands', operator: 'UK', lat: -51.8228, lng: -59.2275, established: 1985 },
  { name: 'Gibraltar', country: 'Gibraltar', operator: 'UK', lat: 36.1408, lng: -5.3536, established: 1950 },
  { name: 'British Forces Brunei', country: 'Brunei', operator: 'UK', lat: 4.9674, lng: 114.8517, established: 1962 },
  { name: 'Ascension Island', country: 'Ascension Island', operator: 'UK', lat: -7.9467, lng: -14.3559, established: 1982 },
  { name: 'Duqm (Oman)', country: 'Oman', operator: 'UK', lat: 19.6669, lng: 57.7044, established: 2019 },
  { name: 'Sembawang (Singapore)', country: 'Singapore', operator: 'UK', lat: 1.4604, lng: 103.8251, established: 1971 },
  { name: 'BIOT (Diego Garcia support)', country: 'British Indian Ocean Territory', operator: 'UK', lat: -7.3300, lng: 72.4100, established: 1971 },
  { name: 'Aden', country: 'Yemen', operator: 'UK', lat: 12.8333, lng: 45.0333, established: 1950, closed: 1967 },
  { name: 'Suez Canal Zone', country: 'Egypt', operator: 'UK', lat: 30.5833, lng: 32.2667, established: 1950, closed: 1956 },

  // === CHINA BASES ===
  { name: 'PLA Support Base Djibouti', country: 'Djibouti', operator: 'China', lat: 11.5892, lng: 43.0481, established: 2017 },
  { name: 'Ream Naval Base', country: 'Cambodia', operator: 'China', lat: 10.5100, lng: 103.6333, established: 2024 },

  // === TURKEY BASES ===
  { name: 'Camp Bashiqa', country: 'Iraq', operator: 'Turkey', lat: 36.4917, lng: 43.3833, established: 2015 },
  { name: 'TURKSOM', country: 'Qatar', operator: 'Turkey', lat: 25.3167, lng: 51.4333, established: 2015 },
  { name: 'Camp TURKSOM Mogadishu', country: 'Somalia', operator: 'Turkey', lat: 2.0469, lng: 45.3175, established: 2017 },
  { name: 'Northern Cyprus', country: 'Northern Cyprus', operator: 'Turkey', lat: 35.1856, lng: 33.3823, established: 1974 },

  // === INDIA ===
  { name: 'Farkhor Air Base', country: 'Tajikistan', operator: 'India', lat: 37.4903, lng: 69.3786, established: 2004, closed: 2013 },
  { name: 'Assumption Island (planned)', country: 'Seychelles', operator: 'India', lat: -9.7422, lng: 46.5075, established: 2019 },
  { name: 'Agalega', country: 'Mauritius', operator: 'India', lat: -10.4167, lng: 56.6667, established: 2021 },

  // === JAPAN ===
  { name: 'Djibouti (JSDF)', country: 'Djibouti', operator: 'Japan', lat: 11.5561, lng: 43.1594, established: 2011 },

  // === UAE ===
  { name: 'Assab', country: 'Eritrea', operator: 'UAE', lat: 13.0667, lng: 42.7333, established: 2015 },

  // === SAUDI ARABIA ===
  { name: 'Al Anad Air Base', country: 'Yemen', operator: 'Saudi Arabia', lat: 13.1750, lng: 44.7667, established: 2015 },

  // === ITALY ===
  { name: 'Djibouti (Italian)', country: 'Djibouti', operator: 'Italy', lat: 11.5550, lng: 43.1450, established: 2013 },

  // === GERMANY ===
  { name: 'Djibouti (German)', country: 'Djibouti', operator: 'Germany', lat: 11.5500, lng: 43.1600, established: 2002, closed: 2010 },
]

// Color palette for operators
export const operatorColors: Record<string, string> = {
  US: '#3b82f6',      // blue
  Russia: '#ef4444',  // red
  France: '#a855f7',  // purple
  UK: '#f59e0b',      // amber
  China: '#f97316',   // orange
  Turkey: '#10b981',  // emerald
  India: '#06b6d4',   // cyan
  Japan: '#ec4899',   // pink
  UAE: '#84cc16',     // lime
  'Saudi Arabia': '#fbbf24', // yellow
  Italy: '#6366f1',   // indigo
  Germany: '#78716c', // stone
}
