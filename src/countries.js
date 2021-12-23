var countries_code_key = { AF: 'AFGHANISTAN',  AL: 'ALBANIA',  DZ: 'ALGERIA',  AS: 'AMERICAN SAMOA',  AD: 'ANDORRA',  AO: 'ANGOLA',  AI: 'ANGUILLA',  AQ: 'ANTARCTICA',  AG: 'ANTIGUA AND BARBUDA',  AR: 'ARGENTINA',  AM: 'ARMENIA',  AW: 'ARUBA',  AU: 'AUSTRALIA',  AT: 'AUSTRIA',  AZ: 'AZERBAIJAN',  BS: 'BAHAMAS',  BH: 'BAHRAIN',  BD: 'BANGLADESH',  BB: 'BARBADOS',  BY: 'BELARUS',  BE: 'BELGIUM',  BZ: 'BELIZE',  BJ: 'BENIN',  BM: 'BERMUDA',  BT: 'BHUTAN',  BO: 'BOLIVIA',  BQ: 'BONAIRE, SINT EUSTATIUS AND SABA',  BA: 'BOSNIA AND HERZEGOVINA',  BW: 'BOTSWANA',  BV: 'BOUVET ISLAND',  BR: 'BRAZIL',  IO: 'BRITISH INDIAN OCEAN TERRITORY',  BN: 'BRUNEI DARUSSALAM',  BG: 'BULGARIA',  BF: 'BURKINA FASO',  BI: 'BURUNDI',  CV: 'CABO VERDE',  KH: 'CAMBODIA',  CM: 'CAMEROON',  CA: 'CANADA',  KY: 'CAYMAN ISLANDS',  CF: 'CENTRAL AFRICAN REPUBLIC',  TD: 'CHAD',  CL: 'CHILE',  CN: 'CHINA',  CX: 'CHRISTMAS ISLAND',  CC: 'COCOS (KEELING) ISLANDS',  CO: 'COLOMBIA',  KM: 'COMOROS',  CG: 'CONGO',  CD: 'CONGO, THE DEMOCRATIC REPUBLIC OF THE',  CK: 'COOK ISLANDS',  CR: 'COSTA RICA',  HR: 'CROATIA',  CU: 'CUBA',  CW: 'CURAÇAO',  CY: 'CYPRUS',  CZ: 'CZECHIA',  CI: 'CÔTE D’IVOIRE',  DK: 'DENMARK',  DJ: 'DJIBOUTI',  DM: 'DOMINICA',  DO: 'DOMINICAN REPUBLIC',  EC: 'ECUADOR',  EG: 'EGYPT',  SV: 'EL SALVADOR',  GQ: 'EQUATORIAL GUINEA',  ER: 'ERITREA',  EE: 'ESTONIA',  ET: 'ETHIOPIA',  FK: 'FALKLAND ISLANDS (MALVINAS)',  FO: 'FAROE ISLANDS',  FJ: 'FIJI',  FI: 'FINLAND',  FR: 'FRANCE',  GF: 'FRENCH GUIANA',  PF: 'FRENCH POLYNESIA',  TF: 'FRENCH SOUTHERN TERRITORIES',  GA: 'GABON',  GM: 'GAMBIA',  GE: 'GEORGIA',  DE: 'GERMANY',  GH: 'GHANA',  GI: 'GIBRALTAR',  GR: 'GREECE',  GL: 'GREENLAND',  GD: 'GRENADA',  GP: 'GUADELOUPE',  GU: 'GUAM',  GT: 'GUATEMALA',  GG: 'GUERNSEY',  GN: 'GUINEA',  GW: 'GUINEA-BISSAU',  GY: 'GUYANA',  HT: 'HAITI',  HM: 'HEARD ISLAND AND MCDONALD ISLANDS',  HN: 'HONDURAS',  HK: 'HONG KONG',  HU: 'HUNGARY',  IS: 'ICELAND',  IN: 'INDIA',  ID: 'INDONESIA',  IR: 'IRAN (ISLAMIC REPUBLIC OF)',  IQ: 'IRAQ',  IE: 'IRELAND',  IM: 'ISLE OF MAN',  IL: 'ISRAEL',  IT: 'ITALY',  JM: 'JAMAICA',  JP: 'JAPAN',  JE: 'JERSEY',  JO: 'JORDAN',  KZ: 'KAZAKHSTAN',  KE: 'KENYA',  KI: 'KIRIBATI',  KP: 'KOREA, DEMOCRATIC PEOPLE’S REPUBLIC OF',  KR: 'KOREA, REPUBLIC OF',  XK: 'KOSOVO',  KW: 'KUWAIT',  KG: 'KYRGYZSTAN',  LA: 'LAO PEOPLE’S DEMOCRATIC REPUBLIC',  LV: 'LATVIA',  LB: 'LEBANON',  LS: 'LESOTHO',  LR: 'LIBERIA',  LY: 'LIBYA',  LI: 'LIECHTENSTEIN',  LT: 'LITHUANIA',  LU: 'LUXEMBOURG',  MO: 'MACAO',  MK: 'MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF',  MG: 'MADAGASCAR',  MW: 'MALAWI',  MY: 'MALAYSIA',  MV: 'MALDIVES',  ML: 'MALI',  MT: 'MALTA',  MH: 'MARSHALL ISLANDS',  MQ: 'MARTINIQUE',  MR: 'MAURITANIA',  MU: 'MAURITIUS',  YT: 'MAYOTTE',  MX: 'MEXICO',  FM: 'MICRONESIA, FEDERATED STATES OF',  MD: 'MOLDOVA, REPUBLIC OF',  MC: 'MONACO',  MN: 'MONGOLIA',  ME: 'MONTENEGRO',  MS: 'MONTSERRAT',  MA: 'MOROCCO',  MZ: 'MOZAMBIQUE',  MM: 'MYANMAR',  NA: 'NAMIBIA',  NR: 'NAURU',  NP: 'NEPAL',  NL: 'NETHERLANDS',  NC: 'NEW CALEDONIA',  NZ: 'NEW ZEALAND',  NI: 'NICARAGUA',  NE: 'NIGER',  NG: 'NIGERIA',  NU: 'NIUE',  NF: 'NORFOLK ISLAND',  MP: 'NORTHERN MARIANA ISLANDS',  NO: 'NORWAY',  OM: 'OMAN',  PK: 'PAKISTAN',  PW: 'PALAU',  PS: 'PALESTINE, STATE OF',  PA: 'PANAMA',  PG: 'PAPUA NEW GUINEA',  PY: 'PARAGUAY',  PE: 'PERU',  PH: 'PHILIPPINES',  PN: 'PITCAIRN',  PL: 'POLAND',  PT: 'PORTUGAL',  PR: 'PUERTO RICO',  QA: 'QATAR',  RE: 'REUNION',  RO: 'ROMANIA',  RU: 'RUSSIAN FEDERATION',  RW: 'RWANDA',  BL: 'SAINT BARTHELEMY',  SH: 'SAINT HELENA',  KN: 'SAINT KITTS AND NEVIS',  LC: 'SAINT LUCIA',  MF: 'SAINT MARTIN (FRENCH PART)',  PM: 'SAINT PIERRE AND MIQUELON',  VC: 'SAINT VINCENT AND THE GRENADINES',  WS: 'SAMOA',  SM: 'SAN MARINO',  ST: 'SAO TOME AND PRINCIPE',  SA: 'SAUDI ARABIA',  SN: 'SENEGAL',  RS: 'SERBIA',  SC: 'SEYCHELLES',  SL: 'SIERRA LEONE',  SG: 'SINGAPORE',  SX: 'SINT MAARTEN (DUTCH PART)',  SK: 'SLOVAKIA',  SI: 'SLOVENIA',  SB: 'SOLOMON ISLANDS',  SO: 'SOMALIA',  ZA: 'SOUTH AFRICA',  GS: 'SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS',  SS: 'SOUTH SUDAN',  ES: 'SPAIN',  LK: 'SRI LANKA',  SD: 'SUDAN',  SR: 'SURINAME',  SJ: 'SVALBARD AND JAN MAYEN',  SZ: 'SWAZILAND',  SE: 'SWEDEN',  CH: 'SWITZERLAND',  SY: 'SYRIAN ARAB REPUBLIC',  TW: 'TAIWAN',  TJ: 'TAJIKISTAN',  TZ: 'TANZANIA, UNITED REPUBLIC OF',  TH: 'THAILAND',  TL: 'TIMOR-LESTE',  TG: 'TOGO',  TK: 'TOKELAU',  TO: 'TONGA',  TT: 'TRINIDAD AND TOBAGO',  TN: 'TUNISIA',  TR: 'TURKEY',  TM: 'TURKMENISTAN',  TC: 'TURKS AND CAICOS ISLANDS',  TV: 'TUVALU',  UG: 'UGANDA',  UA: 'UKRAINE',  AE: 'UNITED ARAB EMIRATES',  GB: 'UNITED KINGDOM',  US: 'UNITED STATES',  UM: 'UNITED STATES MINOR OUTLYING ISLANDS',  UY: 'URUGUAY',  UZ: 'UZBEKISTAN',  VU: 'VANUATU',  VA: 'VATICAN CITY STATE (HOLY SEE)',  VE: 'VENEZUELA',  VN: 'VIET NAM',  VG: 'VIRGIN ISLANDS (BRITISH)',  VI: 'VIRGIN ISLANDS (U.S.)',  WF: 'WALLIS AND FUTUNA',  EH: 'WESTERN SAHARA',  YE: 'YEMEN',  ZM: 'ZAMBIA',  ZW: 'ZIMBABWE',  AX: 'ÅLAND ISLANDS' };

var countries = { "AFGHANISTAN": "AF", "ALBANIA": "AL", "ALGERIA": "DZ", "AMERICAN SAMOA": "AS", "ANDORRA": "AD", "ANGOLA": "AO", "ANGUILLA": "AI", "ANTARCTICA": "AQ", "ANTIGUA AND BARBUDA": "AG", "ARGENTINA": "AR", "ARMENIA": "AM", "ARUBA": "AW", "AUSTRALIA": "AU", "AUSTRIA": "AT", "AZERBAIJAN": "AZ", "BAHAMAS": "BS", "BAHRAIN": "BH", "BANGLADESH": "BD", "BARBADOS": "BB", "BELARUS": "BY", "BELGIUM": "BE", "BELIZE": "BZ", "BENIN": "BJ", "BERMUDA": "BM", "BHUTAN": "BT", "BOLIVIA": "BO", "BONAIRE, SINT EUSTATIUS AND SABA": "BQ", "BOSNIA AND HERZEGOVINA": "BA", "BOTSWANA": "BW", "BOUVET ISLAND": "BV", "BRAZIL": "BR", "BRITISH INDIAN OCEAN TERRITORY": "IO", "BRUNEI DARUSSALAM": "BN", "BULGARIA": "BG", "BURKINA FASO": "BF", "BURUNDI": "BI", "CABO VERDE": "CV", "CAMBODIA": "KH", "CAMEROON": "CM", "CANADA": "CA", "CAYMAN ISLANDS": "KY", "CENTRAL AFRICAN REPUBLIC": "CF", "CHAD": "TD", "CHILE": "CL", "CHINA": "CN", "CHRISTMAS ISLAND": "CX", "COCOS (KEELING) ISLANDS": "CC", "COLOMBIA": "CO", "COMOROS": "KM", "CONGO": "CG", "CONGO, THE DEMOCRATIC REPUBLIC OF THE": "CD", "COOK ISLANDS": "CK", "COSTA RICA": "CR", "CROATIA": "HR", "CUBA": "CU", "CURAÇAO": "CW", "CYPRUS": "CY", "CZECHIA": "CZ", "CÔTE D’IVOIRE": "CI", "DENMARK": "DK", "DJIBOUTI": "DJ", "DOMINICA": "DM", "DOMINICAN REPUBLIC": "DO", "ECUADOR": "EC", "EGYPT": "EG", "EL SALVADOR": "SV", "EQUATORIAL GUINEA": "GQ", "ERITREA": "ER", "ESTONIA": "EE", "ETHIOPIA": "ET", "FALKLAND ISLANDS (MALVINAS)": "FK", "FAROE ISLANDS": "FO", "FIJI": "FJ", "FINLAND": "FI", "FRANCE": "FR", "FRENCH GUIANA": "GF", "FRENCH POLYNESIA": "PF", "FRENCH SOUTHERN TERRITORIES": "TF", "GABON": "GA", "GAMBIA": "GM", "GEORGIA": "GE", "GERMANY": "DE", "GHANA": "GH", "GIBRALTAR": "GI", "GREECE": "GR", "GREENLAND": "GL", "GRENADA": "GD", "GUADELOUPE": "GP", "GUAM": "GU", "GUATEMALA": "GT", "GUERNSEY": "GG", "GUINEA": "GN", "GUINEA-BISSAU": "GW", "GUYANA": "GY", "HAITI": "HT", "HEARD ISLAND AND MCDONALD ISLANDS": "HM", "HONDURAS": "HN", "HONG KONG": "HK", "HUNGARY": "HU", "ICELAND": "IS", "INDIA": "IN", "INDONESIA": "ID", "IRAN (ISLAMIC REPUBLIC OF)": "IR", "IRAQ": "IQ", "IRELAND": "IE", "ISLE OF MAN": "IM", "ISRAEL": "IL", "ITALY": "IT", "JAMAICA": "JM", "JAPAN": "JP", "JERSEY": "JE", "JORDAN": "JO", "KAZAKHSTAN": "KZ", "KENYA": "KE", "KIRIBATI": "KI", "KOREA, DEMOCRATIC PEOPLE’S REPUBLIC OF": "KP", "KOREA, REPUBLIC OF": "KR", "KOSOVO": "XK", "KUWAIT": "KW", "KYRGYZSTAN": "KG", "LAO PEOPLE’S DEMOCRATIC REPUBLIC": "LA", "LATVIA": "LV", "LEBANON": "LB", "LESOTHO": "LS", "LIBERIA": "LR", "LIBYA": "LY", "LIECHTENSTEIN": "LI", "LITHUANIA": "LT", "LUXEMBOURG": "LU", "MACAO": "MO", "MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF": "MK", "MADAGASCAR": "MG", "MALAWI": "MW", "MALAYSIA": "MY", "MALDIVES": "MV", "MALI": "ML", "MALTA": "MT", "MARSHALL ISLANDS": "MH", "MARTINIQUE": "MQ", "MAURITANIA": "MR", "MAURITIUS": "MU", "MAYOTTE": "YT", "MEXICO": "MX", "MICRONESIA, FEDERATED STATES OF": "FM", "MOLDOVA, REPUBLIC OF": "MD", "MONACO": "MC", "MONGOLIA": "MN", "MONTENEGRO": "ME", "MONTSERRAT": "MS", "MOROCCO": "MA", "MOZAMBIQUE": "MZ", "MYANMAR": "MM", "NAMIBIA": "NA", "NAURU": "NR", "NEPAL": "NP", "NETHERLANDS": "NL", "NEW CALEDONIA": "NC", "NEW ZEALAND": "NZ", "NICARAGUA": "NI", "NIGER": "NE", "NIGERIA": "NG", "NIUE": "NU", "NORFOLK ISLAND": "NF", "NORTHERN MARIANA ISLANDS": "MP", "NORWAY": "NO", "OMAN": "OM", "PAKISTAN": "PK", "PALAU": "PW", "PALESTINE, STATE OF": "PS", "PANAMA": "PA", "PAPUA NEW GUINEA": "PG", "PARAGUAY": "PY", "PERU": "PE", "PHILIPPINES": "PH", "PITCAIRN": "PN", "POLAND": "PL", "PORTUGAL": "PT", "PUERTO RICO": "PR", "QATAR": "QA", "REUNION": "RE", "ROMANIA": "RO", "RUSSIAN FEDERATION": "RU", "RWANDA": "RW", "SAINT BARTHELEMY": "BL", "SAINT HELENA": "SH", "SAINT KITTS AND NEVIS": "KN", "SAINT LUCIA": "LC", "SAINT MARTIN (FRENCH PART)": "MF", "SAINT PIERRE AND MIQUELON": "PM", "SAINT VINCENT AND THE GRENADINES": "VC", "SAMOA": "WS", "SAN MARINO": "SM", "SAO TOME AND PRINCIPE": "ST", "SAUDI ARABIA": "SA", "SENEGAL": "SN", "SERBIA": "RS", "SEYCHELLES": "SC", "SIERRA LEONE": "SL", "SINGAPORE": "SG", "SINT MAARTEN (DUTCH PART)": "SX", "SLOVAKIA": "SK", "SLOVENIA": "SI", "SOLOMON ISLANDS": "SB", "SOMALIA": "SO", "SOUTH AFRICA": "ZA", "SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS": "GS", "SOUTH SUDAN": "SS", "SPAIN": "ES", "SRI LANKA": "LK", "SUDAN": "SD", "SURINAME": "SR", "SVALBARD AND JAN MAYEN": "SJ", "SWAZILAND": "SZ", "SWEDEN": "SE", "SWITZERLAND": "CH", "SYRIAN ARAB REPUBLIC": "SY", "TAIWAN": "TW", "TAJIKISTAN": "TJ", "TANZANIA, UNITED REPUBLIC OF": "TZ", "THAILAND": "TH", "TIMOR-LESTE": "TL", "TOGO": "TG", "TOKELAU": "TK", "TONGA": "TO", "TRINIDAD AND TOBAGO": "TT", "TUNISIA": "TN", "TURKEY": "TR", "TURKMENISTAN": "TM", "TURKS AND CAICOS ISLANDS": "TC", "TUVALU": "TV", "UGANDA": "UG", "UKRAINE": "UA", "UNITED ARAB EMIRATES": "AE", "UNITED KINGDOM": "GB", "UNITED STATES": "US", "UNITED STATES MINOR OUTLYING ISLANDS": "UM", "URUGUAY": "UY", "UZBEKISTAN": "UZ", "VANUATU": "VU", "VATICAN CITY STATE (HOLY SEE)": "VA", "VENEZUELA": "VE", "VIET NAM": "VN", "VIRGIN ISLANDS (BRITISH)": "VG", "VIRGIN ISLANDS (U.S.)": "VI", "WALLIS AND FUTUNA": "WF", "WESTERN SAHARA": "EH", "YEMEN": "YE", "ZAMBIA": "ZM", "ZIMBABWE": "ZW", "ÅLAND ISLANDS": "AX" }

var countries_enum = Object.keys(countries).map(function(k, index) {
  return { const: k, title: countries[k] }
});

export default countries;
