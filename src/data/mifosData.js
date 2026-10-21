// Dữ liệu mô phỏng Mifos X Core Banking - Takashimaya Bank (TKB) Sandbox
// Được trích xuất trực tiếp 100% từ file SQL thực tế: mifos_full_backup_15102026_Final_Edu.sql

export const INITIAL_BANK_INFO = {
  bankName: "Takashimaya Bank (TKB)",
  code: "TKB",
  headOfficeId: "1",
  currency: "VND",
  timezone: "Asia/Ho_Chi_Minh"
};

// Initial configured currencies matching Image 1: media_1792378783895_68079546.png
export const INITIAL_CONFIGURED_CURRENCIES = [
  { code: "CNY", name: "Chinese Yuan Renminbi" },
  { code: "IDR", name: "Indonesian Rupiah" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "USD", name: "US Dollar" },
  { code: "VND", name: "Vietnamese Dong" }
];

// World ISO currencies available in Mifos X matching Image 2 autocomplete list
export const ALL_ISO_CURRENCIES = [
  { code: "AED", name: "UAE Dirham" },
  { code: "AFN", name: "Afghani" },
  { code: "ALL", name: "Lek" },
  { code: "AMD", name: "Armenian Dram" },
  { code: "ANG", name: "Netherlands Antillean Guilder" },
  { code: "AOA", name: "Kwanza" },
  { code: "ARS", name: "Argentine Peso" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "AWG", name: "Aruban Florin" },
  { code: "AZN", name: "Azerbaijanian Manat" },
  { code: "BAM", name: "Bosnia and Herzegovina Convertible Marks" },
  { code: "BBD", name: "Barbados Dollar" },
  { code: "BDT", name: "Taka" },
  { code: "BGN", name: "Bulgarian Lev" },
  { code: "BHD", name: "Bahraini Dinar" },
  { code: "BIF", name: "Burundi Franc" },
  { code: "BMD", name: "Bermudian Dollar" },
  { code: "BND", name: "Brunei Dollar" },
  { code: "BOB", name: "Bolivian Boliviano" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "BSD", name: "Bahamian Dollar" },
  { code: "BTN", name: "Ngultrum" },
  { code: "BWP", name: "Pula" },
  { code: "BYN", name: "Belarusian Ruble" },
  { code: "BZD", name: "Belize Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "CDF", name: "Congolese Franc" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CLP", name: "Chilean Peso" },
  { code: "CNY", name: "Chinese Yuan Renminbi" },
  { code: "COP", name: "Colombian Peso" },
  { code: "CRC", name: "Costa Rican Colon" },
  { code: "CUC", name: "Peso Convertible" },
  { code: "CUP", name: "Cuban Peso" },
  { code: "CVE", name: "Cape Verde Escudo" },
  { code: "CZK", name: "Czech Koruna" },
  { code: "DJF", name: "Djibouti Franc" },
  { code: "DKK", name: "Danish Krone" },
  { code: "DOP", name: "Dominican Peso" },
  { code: "DZD", name: "Algerian Dinar" },
  { code: "EGP", name: "Egyptian Pound" },
  { code: "ERN", name: "Nakfa" },
  { code: "ETB", name: "Ethiopian Birr" },
  { code: "EUR", name: "Euro" },
  { code: "FJD", name: "Fiji Dollar" },
  { code: "FKP", name: "Falkland Islands Pound" },
  { code: "GBP", name: "Pound Sterling" },
  { code: "GEL", name: "Lari" },
  { code: "GHS", name: "Ghana Cedi" },
  { code: "GIP", name: "Gibraltar Pound" },
  { code: "GMD", name: "Dalasi" },
  { code: "GNF", name: "Guinea Franc" },
  { code: "GTQ", name: "Quetzal" },
  { code: "GYD", name: "Guyana Dollar" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "HNL", name: "Lempira" },
  { code: "HRK", name: "Kuna" },
  { code: "HTG", name: "Gourde" },
  { code: "HUF", name: "Forint" },
  { code: "IDR", name: "Indonesian Rupiah" },
  { code: "ILS", name: "New Israeli Sheqel" },
  { code: "INR", name: "Indian Rupee" },
  { code: "IQD", name: "Iraqi Dinar" },
  { code: "IRR", name: "Iranian Rial" },
  { code: "ISK", name: "Iceland Krona" },
  { code: "JMD", name: "Jamaican Dollar" },
  { code: "JOD", name: "Jordanian Dinar" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "KES", name: "Kenyan Shilling" },
  { code: "KGS", name: "Som" },
  { code: "KHR", name: "Riel" },
  { code: "KMF", name: "Comoro Franc" },
  { code: "KPW", name: "North Korean Won" },
  { code: "KRW", name: "Won" },
  { code: "KWD", name: "Kuwaiti Dinar" },
  { code: "KYD", name: "Cayman Islands Dollar" },
  { code: "KZT", name: "Tenge" },
  { code: "LAK", name: "Kip" },
  { code: "LBP", name: "Lebanese Pound" },
  { code: "LKR", name: "Sri Lanka Rupee" },
  { code: "LRD", name: "Liberian Dollar" },
  { code: "LSL", name: "Loti" },
  { code: "LYD", name: "Libyan Dinar" },
  { code: "MAD", name: "Moroccan Dirham" },
  { code: "MDL", name: "Moldovan Leu" },
  { code: "MGA", name: "Malagasy Ariary" },
  { code: "MKD", name: "Denar" },
  { code: "MMK", name: "Kyat" },
  { code: "MNT", name: "Tugrik" },
  { code: "MOP", name: "Pataca" },
  { code: "MRU", name: "Ouguiya" },
  { code: "MUR", name: "Mauritius Rupee" },
  { code: "MVR", name: "Rufiyaa" },
  { code: "MWK", name: "Malawi Kwacha" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "MYR", name: "Malaysian Ringgit" },
  { code: "MZN", name: "Mozambique Metical" },
  { code: "NAD", name: "Namibia Dollar" },
  { code: "NGN", name: "Naira" },
  { code: "NIO", name: "Cordoba Oro" },
  { code: "NOK", name: "Norwegian Krone" },
  { code: "NPR", name: "Nepalese Rupee" },
  { code: "NZD", name: "New Zealand Dollar" },
  { code: "OMR", name: "Rial Omani" },
  { code: "PAB", name: "Balboa" },
  { code: "PEN", name: "Sol" },
  { code: "PGK", name: "Kina" },
  { code: "PHP", name: "Philippine Peso" },
  { code: "PKR", name: "Pakistan Rupee" },
  { code: "PLN", name: "Zloty" },
  { code: "PYG", name: "Guarani" },
  { code: "QAR", name: "Qatari Rial" },
  { code: "RON", name: "Romanian Leu" },
  { code: "RSD", name: "Serbian Dinar" },
  { code: "RUB", name: "Russian Ruble" },
  { code: "RWF", name: "Rwanda Franc" },
  { code: "SAR", name: "Saudi Riyal" },
  { code: "SBD", name: "Solomon Islands Dollar" },
  { code: "SCR", name: "Seychelles Rupee" },
  { code: "SDG", name: "Sudanese Pound" },
  { code: "SEK", name: "Swedish Krona" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "SHP", name: "Saint Helena Pound" },
  { code: "SLL", name: "Leone" },
  { code: "SOS", name: "Somali Shilling" },
  { code: "SRD", name: "Surinam Dollar" },
  { code: "SSP", name: "South Sudanese Pound" },
  { code: "STN", name: "Dobra" },
  { code: "SVC", name: "El Salvador Colon" },
  { code: "SYP", name: "Syrian Pound" },
  { code: "SZL", name: "Lilangeni" },
  { code: "THB", name: "Baht" },
  { code: "TJS", name: "Somoni" },
  { code: "TMT", name: "Turkmenistan New Manat" },
  { code: "TND", name: "Tunisian Dinar" },
  { code: "TOP", name: "Pa'anga" },
  { code: "TRY", name: "Turkish Lira" },
  { code: "TTD", name: "Trinidad and Tobago Dollar" },
  { code: "TWD", name: "New Taiwan Dollar" },
  { code: "TZS", name: "Tanzanian Shilling" },
  { code: "UAH", name: "Hryvnia" },
  { code: "UGX", name: "Uganda Shilling" },
  { code: "USD", name: "US Dollar" },
  { code: "UYU", name: "Peso Uruguayo" },
  { code: "UZS", name: "Uzbekistan Sum" },
  { code: "VES", name: "Bolivar Soberano" },
  { code: "VND", name: "Vietnamese Dong" },
  { code: "VUV", name: "Vatu" },
  { code: "WST", name: "Tala" },
  { code: "XAF", name: "CFA Franc BEAC" },
  { code: "XCD", name: "East Caribbean Dollar" },
  { code: "XOF", name: "CFA Franc BCEAO" },
  { code: "XPF", name: "CFP Franc" },
  { code: "YER", name: "Yemeni Rial" },
  { code: "ZAR", name: "Rand" },
  { code: "ZMW", name: "Zambian Kwacha" },
  { code: "ZWL", name: "Zimbabwe Dollar" }
];

export const FULL_BACKUP_OFFICES = [
  {
    "id": "1",
    "name": "Takashimaya Bank (TKB) - HO",
    "externalId": "TKB - HO - 001",
    "parentId": null,
    "parentName": null,
    "openingDate": "2026-08-01",
    "hierarchy": "."
  },
  {
    "id": "31",
    "name": "Long Xuyen Transaction Office",
    "externalId": "TKB-TO-AGI-01",
    "parentId": "16",
    "parentName": "Angiang Branch",
    "openingDate": "2026-08-04",
    "hierarchy": ".3.16.31."
  },
  {
    "id": "5",
    "name": "Hanoi Branch",
    "externalId": "TKB - BR - HAN",
    "parentId": "2",
    "parentName": "TKB - Nothern Region Office",
    "openingDate": "2026-08-03",
    "hierarchy": ".2.5."
  },
  {
    "id": "6",
    "name": "Hue Branch",
    "externalId": "TKB - BR - HUE",
    "parentId": "4",
    "parentName": "TKB - Central Region Office",
    "openingDate": "2026-08-03",
    "hierarchy": ".4.6."
  },
  {
    "id": "7",
    "name": "Thuan Hoa Transaction Office",
    "externalId": "TKB - TO - HUE - 01",
    "parentId": "6",
    "parentName": "Hue Branch",
    "openingDate": "2026-08-04",
    "hierarchy": ".4.6.7."
  },
  {
    "id": "8",
    "name": "Haiphong Branch",
    "externalId": "TKB - BR - HPH",
    "parentId": "2",
    "parentName": "TKB - Nothern Region Office",
    "openingDate": "2026-08-03",
    "hierarchy": ".2.8."
  },
  {
    "id": "32",
    "name": "Cao Lanh Transaction Office",
    "externalId": "TKB-TO-DTH-01",
    "parentId": "17",
    "parentName": "Dongthap Branch",
    "openingDate": "2026-08-04",
    "hierarchy": ".3.17.32."
  },
  {
    "id": "10",
    "name": "Danang Branch",
    "externalId": "TKB-BR-DNG",
    "parentId": "4",
    "parentName": "TKB - Central Region Office",
    "openingDate": "2026-08-03",
    "hierarchy": ".4.10."
  },
  {
    "id": "26",
    "name": "Thu Duc Transaction Office",
    "externalId": "TKB-TO-HCM-02",
    "parentId": "12",
    "parentName": "Hochiminh Branch",
    "openingDate": "2026-08-04",
    "hierarchy": ".3.12.26."
  },
  {
    "id": "11",
    "name": "Khanhhoa Branch",
    "externalId": "TKB-BR-KHA",
    "parentId": "4",
    "parentName": "TKB - Central Region Office",
    "openingDate": "2026-08-03",
    "hierarchy": ".4.11."
  },
  {
    "id": "12",
    "name": "Hochiminh Branch",
    "externalId": "TKB-BR-HCM",
    "parentId": "3",
    "parentName": "TKB - Southern Region Office",
    "openingDate": "2026-08-03",
    "hierarchy": ".3.12."
  },
  {
    "id": "13",
    "name": "Dongnai Branch",
    "externalId": "TKB-BR-DNI",
    "parentId": "3",
    "parentName": "TKB - Southern Region Office",
    "openingDate": "2026-08-03",
    "hierarchy": ".3.13."
  },
  {
    "id": "14",
    "name": "Tayninh Branch",
    "externalId": "TKB-BR-TNI",
    "parentId": "3",
    "parentName": "TKB - Southern Region Office",
    "openingDate": "2026-08-03",
    "hierarchy": ".3.14."
  },
  {
    "id": "15",
    "name": "Cantho Branch",
    "externalId": "TKB-BR-CTO",
    "parentId": "3",
    "parentName": "TKB - Southern Region Office",
    "openingDate": "2026-08-03",
    "hierarchy": ".3.15."
  },
  {
    "id": "16",
    "name": "Angiang Branch",
    "externalId": "TKB-BR-AGI",
    "parentId": "3",
    "parentName": "TKB - Southern Region Office",
    "openingDate": "2026-08-03",
    "hierarchy": ".3.16."
  },
  {
    "id": "17",
    "name": "Dongthap Branch",
    "externalId": "TKB-BR-DTH",
    "parentId": "3",
    "parentName": "TKB - Southern Region Office",
    "openingDate": "2026-08-03",
    "hierarchy": ".3.17."
  },
  {
    "id": "2",
    "name": "TKB - Nothern Region Office",
    "externalId": "TKB - REG - NOR",
    "parentId": "1",
    "parentName": "Takashimaya Bank (TKB) - HO",
    "openingDate": "2026-08-02",
    "hierarchy": ".2."
  },
  {
    "id": "3",
    "name": "TKB - Southern Region Office",
    "externalId": "TKB - REG - SOU",
    "parentId": "1",
    "parentName": "Takashimaya Bank (TKB) - HO",
    "openingDate": "2026-08-02",
    "hierarchy": ".3."
  },
  {
    "id": "4",
    "name": "TKB - Central Region Office",
    "externalId": "TKB - REG - CEN",
    "parentId": "1",
    "parentName": "Takashimaya Bank (TKB) - HO",
    "openingDate": "2026-08-02",
    "hierarchy": ".4."
  },
  {
    "id": "18",
    "name": "Quangninh Branch",
    "externalId": "TKB-BR-QNI",
    "parentId": "2",
    "parentName": "TKB - Nothern Region Office",
    "openingDate": "2026-09-03",
    "hierarchy": ".2.18."
  },
  {
    "id": "9",
    "name": "Hong Bang Transaction Office",
    "externalId": "TKB - TO  - HPH - 01",
    "parentId": "8",
    "parentName": "Haiphong Branch",
    "openingDate": "2026-08-04",
    "hierarchy": ".2.8.9."
  },
  {
    "id": "19",
    "name": "Hoan Kiem Transaction Office",
    "externalId": "TKB-TO-HAN-01",
    "parentId": "5",
    "parentName": "Hanoi Branch",
    "openingDate": "2026-10-04",
    "hierarchy": ".2.5.19."
  },
  {
    "id": "20",
    "name": "Cau Giay Transaction Office",
    "externalId": "TKB-TO-HAN-02",
    "parentId": "5",
    "parentName": "Hanoi Branch",
    "openingDate": "2026-10-04",
    "hierarchy": ".2.5.20."
  },
  {
    "id": "21",
    "name": "Ha Long Transaction Office",
    "externalId": "TKB-TO-QNI-01",
    "parentId": "18",
    "parentName": "Quangninh Branch",
    "openingDate": "2026-08-04",
    "hierarchy": ".2.18.21."
  },
  {
    "id": "22",
    "name": "Hai Chau Transaction Office",
    "externalId": "TKB-TO-DNG-01",
    "parentId": "10",
    "parentName": "Danang Branch",
    "openingDate": "2026-08-04",
    "hierarchy": ".4.10.22."
  },
  {
    "id": "25",
    "name": "Nha Trang Transaction Office",
    "externalId": "TKB-TO-KHA-01",
    "parentId": "11",
    "parentName": "Khanhhoa Branch",
    "openingDate": "2026-08-04",
    "hierarchy": ".4.11.25."
  },
  {
    "id": "27",
    "name": "Bien Hoa Transaction Office",
    "externalId": "TKB-TO-DNI-01",
    "parentId": "13",
    "parentName": "Dongnai Branch",
    "openingDate": "2026-08-04",
    "hierarchy": ".3.13.27."
  },
  {
    "id": "28",
    "name": "Trang Bang Transaction Office",
    "externalId": "TKB-TO-TNI-01",
    "parentId": "14",
    "parentName": "Tayninh Branch",
    "openingDate": "2026-08-04",
    "hierarchy": ".3.14.28."
  },
  {
    "id": "29",
    "name": "Ninh Kieu Transaction Office",
    "externalId": "TKB-TO-CTO-01",
    "parentId": "15",
    "parentName": "Cantho Branch",
    "openingDate": "2026-08-04",
    "hierarchy": ".3.15.29."
  },
  {
    "id": "30",
    "name": "Cai Rang Transaction Office",
    "externalId": "TKB-TO-CTO-02",
    "parentId": "15",
    "parentName": "Cantho Branch",
    "openingDate": "2026-08-04",
    "hierarchy": ".3.15.30."
  }
];

export const DEFAULT_SYSTEM_OFFICES = [];

export const INITIAL_OFFICES = [...FULL_BACKUP_OFFICES];

export const REGIONAL_OFFICES_SAMPLE = [
  {
    "id": "2",
    "name": "TKB - Northern Region Office",
    "externalId": "TKB - RO - NORTH",
    "parentId": "1",
    "parentName": "Takashimaya Bank (TKB) - HO",
    "openingDate": "2026-08-02",
    "hierarchy": ".1.2."
  },
  {
    "id": "4",
    "name": "TKB - Central Region Office",
    "externalId": "TKB - RO - CENTRAL",
    "parentId": "1",
    "parentName": "Takashimaya Bank (TKB) - HO",
    "openingDate": "2026-08-02",
    "hierarchy": ".1.4."
  },
  {
    "id": "3",
    "name": "TKB - Southern Region Office",
    "externalId": "TKB - RO - SOUTH",
    "parentId": "1",
    "parentName": "Takashimaya Bank (TKB) - HO",
    "openingDate": "2026-08-02",
    "hierarchy": ".1.3."
  }
];

export const DEFAULT_SYSTEM_ROLES = [
  {
    "id": "1",
    "name": "Super user",
    "description": "This role provides all application permissions.",
    "disabled": false
  },
  {
    "id": "2",
    "name": "Self Service User",
    "description": "self service user role",
    "disabled": true
  }
];

export const INITIAL_ROLES = [...DEFAULT_SYSTEM_ROLES];

export const FULL_BACKUP_ROLES = [
  {
    "id": "1",
    "name": "Super user",
    "description": "This role provides all application permissions.",
    "disabled": false
  },
  {
    "id": "2",
    "name": "Self Service User",
    "description": "self service user role",
    "disabled": true
  },
  {
    "id": "4",
    "name": "TKB_ACCOUNTING_MAKER",
    "description": "Responsible for initiating accounting transactions and journal entries, subject to approval by authorized accounting checkers.",
    "disabled": false
  },
  {
    "id": "5",
    "name": "TKB_ACCOUNTING_CHECKER",
    "description": "Responsible for reviewing, approving, or rejecting accounting transactions initiated by authorized makers, ensuring accuracy and compliance with internal accounting controls.",
    "disabled": false
  },
  {
    "id": "7",
    "name": "TKB_ACCOUNTING_MANAGER",
    "description": "Responsible for overseeing accounting operations, managing authorized accounting configurations, monitoring financial transactions, and ensuring compliance with internal financial controls.",
    "disabled": false
  },
  {
    "id": "8",
    "name": "TKB_SAVINGS_OFFICER",
    "description": "Responsible for initiating and maintaining authorized customer savings operations.",
    "disabled": false
  },
  {
    "id": "9",
    "name": "TKB_SAVINGS_SUPERVISOR",
    "description": "Responsible for reviewing and supervising customer deposit operations.",
    "disabled": false
  },
  {
    "id": "10",
    "name": "TKB_LOAN_OFFICER",
    "description": "Responsible for initiating loan applications and maintaining assigned loan portfolios.",
    "disabled": false
  },
  {
    "id": "11",
    "name": "TKB_LOAN_APPROVER",
    "description": "Responsible for reviewing and approving eligible loan applications within assigned authority.",
    "disabled": false
  },
  {
    "id": "12",
    "name": "TKB_TELLER_CASHIER",
    "description": "Responsible for authorized cash transactions and teller operations.",
    "disabled": false
  },
  {
    "id": "13",
    "name": "TKB_CASH_SUPERVISOR",
    "description": "Responsible for supervising teller cash management and cash allocation activities.",
    "disabled": false
  },
  {
    "id": "14",
    "name": "TKB_CUSTOMER_SERVICE",
    "description": "Responsible for creating and maintaining customer information within assigned authority.",
    "disabled": false
  },
  {
    "id": "15",
    "name": "TKB_RISK_VIEWER",
    "description": "Responsible for reviewing financial and portfolio information for risk monitoring purposes.",
    "disabled": false
  },
  {
    "id": "16",
    "name": "TKB_IT_SUPPORT",
    "description": "Responsible for viewing system information and supporting authorized operational activities.",
    "disabled": false
  },
  {
    "id": "17",
    "name": "TKB_USER_ADMIN",
    "description": "Responsible for creating and maintaining application users and assigning authorized roles.",
    "disabled": false
  },
  {
    "id": "18",
    "name": "TKB_AUDITOR_READONLY",
    "description": "Responsible for independently reviewing accounting and operational records without modification rights.",
    "disabled": false
  }
];

export const SYSTEM_ADMIN = {
  id: "1",
  username: "mifos",
  firstname: "bank",
  lastname: "Administrator",
  email: "admin@tkb.org",
  officeId: "1",
  officeName: "Takashimaya Bank (TKB) - HO",
  roles: ["Super user"],
  enabled: true
};

export const DEFAULT_SYSTEM_USERS = [
  {
    "id": "1",
    "username": "mifos",
    "firstname": "bank",
    "lastname": "Administrator",
    "email": "admin@tkb.org",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "roles": [
      "Super user"
    ],
    "enabled": true
  },
  {
    "id": "2",
    "username": "system",
    "firstname": "system",
    "lastname": "system",
    "email": "demomfi@mifos.org",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "roles": [
      "Viewer"
    ],
    "enabled": true
  }
];

export const INITIAL_USERS = [...DEFAULT_SYSTEM_USERS];

export const isDefaultSystemUser = (u) => {
  if (!u) return false;
  return u.username === 'mifos' || u.username === 'system' || u.id === '1' || u.id === '2';
};

export const isDefaultSystemRole = (r) => {
  if (!r) return false;
  return r.name === 'Super user' || r.name === 'Self Service User' || r.id === '1' || r.id === '2';
};

export const FULL_BACKUP_USERS = [
  {
    "id": "2",
    "username": "system",
    "firstname": "system",
    "lastname": "system",
    "email": "demomfi@mifos.org",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "roles": [
      "Viewer"
    ],
    "enabled": true
  },
  {
    "id": "3",
    "username": "3_DELETED_Đỗ Như Quỳnh",
    "firstname": "Do Nhu",
    "lastname": "Quynh",
    "email": "030240240119@st.buh.edu.vn",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "roles": [
      "Viewer"
    ],
    "enabled": false
  },
  {
    "id": "1",
    "username": "mifos",
    "firstname": "bank",
    "lastname": "Administrator",
    "email": "admin@tkb.org",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "roles": [
      "Super user"
    ],
    "enabled": true
  },
  {
    "id": "4",
    "username": "tkb.acc.maker01",
    "firstname": "An",
    "lastname": "Nguyen",
    "email": "annguyen.tkb@HO.org",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "roles": [
      "TKB_ACCOUNTING_MAKER"
    ],
    "enabled": true
  },
  {
    "id": "5",
    "username": "tkb.acc.checker01",
    "firstname": "Binh",
    "lastname": "Tran",
    "email": "binhtran.tkb@HO.org",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "roles": [
      "TKB_ACCOUNTING_CHECKER"
    ],
    "enabled": true
  },
  {
    "id": "6",
    "username": "tkb.acc.manager01",
    "firstname": "Chi",
    "lastname": "Le",
    "email": "chile.tkb@HO.org",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "roles": [
      "TKB_ACCOUNTING_MANAGER"
    ],
    "enabled": true
  },
  {
    "id": "9",
    "username": "tkb.sav.manager01",
    "firstname": "Linh",
    "lastname": "Do",
    "email": "linhdo.tkb@HO.org",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "roles": [
      "TKB_SAVINGS_SUPERVISOR"
    ],
    "enabled": true
  },
  {
    "id": "11",
    "username": "tkb.loan.approver01",
    "firstname": "Nam",
    "lastname": "Bui",
    "email": "nambui.tkb@HCM.org",
    "officeId": "12",
    "officeName": "Hochiminh Branch",
    "roles": [
      "TKB_LOAN_APPROVER"
    ],
    "enabled": true
  },
  {
    "id": "10",
    "username": "tkb.loan.officer01",
    "firstname": "Minh",
    "lastname": "Ho",
    "email": "minhho.tkb@HCM.org",
    "officeId": "12",
    "officeName": "Hochiminh Branch",
    "roles": [
      "TKB_LOAN_OFFICER"
    ],
    "enabled": true
  },
  {
    "id": "7",
    "username": "tkb.sav.officer01",
    "firstname": "Duy",
    "lastname": "Pham",
    "email": "duypham.tkb@HN.org",
    "officeId": "5",
    "officeName": "Hanoi Branch",
    "roles": [
      "TKB_SAVINGS_OFFICER"
    ],
    "enabled": true
  },
  {
    "id": "8",
    "username": "tkb.sav.checker01",
    "firstname": "Ha",
    "lastname": "Vo",
    "email": "havo.tkb@HN.org",
    "officeId": "5",
    "officeName": "Hanoi Branch",
    "roles": [
      "TKB_SAVINGS_SUPERVISOR"
    ],
    "enabled": true
  },
  {
    "id": "13",
    "username": "tkb.tre.teller01",
    "firstname": "Quan",
    "lastname": "Dang",
    "email": "quandang.tkb@TDTO.org",
    "officeId": "26",
    "officeName": "Thu Duc Transaction Office",
    "roles": [
      "TKB_TELLER_CASHIER"
    ],
    "enabled": true
  },
  {
    "id": "14",
    "username": "tkb.tre.vault01",
    "firstname": "Son",
    "lastname": "Mai",
    "email": "sonmai.tkb@TDTO.org",
    "officeId": "26",
    "officeName": "Thu Duc Transaction Office",
    "roles": [
      "TKB_CASH_SUPERVISOR"
    ],
    "enabled": true
  },
  {
    "id": "15",
    "username": "tkb.tre.manager01",
    "firstname": "Thao",
    "lastname": "Cao",
    "email": "thaocao.tkb@HO.org",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "roles": [
      "TKB_CASH_SUPERVISOR"
    ],
    "enabled": true
  },
  {
    "id": "16",
    "username": "tkb.cus.officer01",
    "firstname": "Uyen",
    "lastname": "Nguyen",
    "email": "uyennguyen.tkb@HKTO.org",
    "officeId": "19",
    "officeName": "Hoan Kiem Transaction Office",
    "roles": [
      "TKB_CUSTOMER_SERVICE"
    ],
    "enabled": true
  },
  {
    "id": "17",
    "username": "tkb.cus.officer02",
    "firstname": "Viet",
    "lastname": "Le",
    "email": "vietle.tkb@HN.org",
    "officeId": "5",
    "officeName": "Hanoi Branch",
    "roles": [
      "TKB_CUSTOMER_SERVICE"
    ],
    "enabled": true
  },
  {
    "id": "18",
    "username": "tkb.cus.manager01",
    "firstname": "Yen",
    "lastname": "Tran",
    "email": "yentran.tkb@HCM.org",
    "officeId": "12",
    "officeName": "Hochiminh Branch",
    "roles": [
      "TKB_CUSTOMER_SERVICE"
    ],
    "enabled": true
  },
  {
    "id": "19",
    "username": "tkb.risk.analyst01",
    "firstname": "Bao",
    "lastname": "Phan",
    "email": "baophan.tkb@DN.org",
    "officeId": "10",
    "officeName": "Danang Branch",
    "roles": [
      "TKB_RISK_VIEWER"
    ],
    "enabled": true
  },
  {
    "id": "20",
    "username": "tkb.risk.compliance01",
    "firstname": "Gia",
    "lastname": "Nguyen",
    "email": "gianguyen.tkb@HO.org",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "roles": [
      "TKB_RISK_VIEWER"
    ],
    "enabled": true
  },
  {
    "id": "21",
    "username": "tkb.risk.manager01",
    "firstname": "Huy",
    "lastname": "Lam",
    "email": "huylam.tkb@HO.org",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "roles": [
      "TKB_RISK_VIEWER"
    ],
    "enabled": true
  },
  {
    "id": "22",
    "username": "tkb.it.support01",
    "firstname": "Khanh",
    "lastname": "Vu",
    "email": "khanhvu.tkb@DN.org",
    "officeId": "10",
    "officeName": "Danang Branch",
    "roles": [
      "TKB_IT_SUPPORT"
    ],
    "enabled": true
  },
  {
    "id": "23",
    "username": "tkb.it.admin01",
    "firstname": "Long",
    "lastname": "Ngo",
    "email": "longngo.tkb@HO.org",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "roles": [
      "TKB_USER_ADMIN"
    ],
    "enabled": true
  },
  {
    "id": "24",
    "username": "tkb.it.manager01",
    "firstname": "Mai",
    "lastname": "Duong",
    "email": "maiduong.tkb@HO.org",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "roles": [
      "TKB_IT_SUPPORT"
    ],
    "enabled": true
  },
  {
    "id": "25",
    "username": "tkb.audit.junior01",
    "firstname": "Nhi",
    "lastname": "Ly",
    "email": "nhily.tkb@HO.org",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "roles": [
      "TKB_AUDITOR_READONLY"
    ],
    "enabled": true
  },
  {
    "id": "26",
    "username": "tkb.audit.senior01",
    "firstname": "Oanh",
    "lastname": "Pham",
    "email": "oanhpham.tkb@HO.org",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "roles": [
      "TKB_AUDITOR_READONLY"
    ],
    "enabled": true
  },
  {
    "id": "27",
    "username": "tkb.audit.manager01",
    "firstname": "Tuan",
    "lastname": "Dao",
    "email": "tuandao.tkb@HO.org",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "roles": [
      "TKB_AUDITOR_READONLY"
    ],
    "enabled": true
  },
  {
    "id": "12",
    "username": "tkb.loan.manager01",
    "firstname": "Phuc",
    "lastname": "Truong",
    "email": "phuctruoc.tkb@HO.org",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "roles": [
      "TKB_LOAN_APPROVER"
    ],
    "enabled": true
  }
];

export const INITIAL_GL_ACCOUNTS = [
  {
    "id": "22",
    "glCode": "120101",
    "name": "Retail Loan Principal",
    "typeId": "1",
    "typeName": "Asset",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "7",
    "description": ""
  },
  {
    "id": "3",
    "glCode": "300000",
    "name": "TOTAL EQUITY",
    "typeId": "3",
    "typeName": "Equity",
    "usage": "Header",
    "manualEntriesAllowed": false,
    "parentId": null,
    "description": "Root account for shareholders' equity, retained earings, and accumulated financial results of Takashimaya Bank"
  },
  {
    "id": "1",
    "glCode": "100000",
    "name": "TOTAL ASSETS",
    "typeId": "1",
    "typeName": "Asset",
    "usage": "Header",
    "manualEntriesAllowed": false,
    "parentId": null,
    "description": "Root account for all assets of Takashimaya Bank\\n"
  },
  {
    "id": "4",
    "glCode": "400000",
    "name": "TOTAL INCOME",
    "typeId": "4",
    "typeName": "Income",
    "usage": "Header",
    "manualEntriesAllowed": false,
    "parentId": null,
    "description": "Root account for all interest  income,  fee income, and other operating revenus generated by Takashimaya Bank"
  },
  {
    "id": "6",
    "glCode": "110000",
    "name": "CASH AND BANK BALANCES",
    "typeId": "1",
    "typeName": "Asset",
    "usage": "Header",
    "manualEntriesAllowed": false,
    "parentId": "1",
    "description": "Groups cash holdings, vault and teller balances, and funds maintained with banks and settlement institutions.\\n\\n"
  },
  {
    "id": "7",
    "glCode": "120000",
    "name": "LOAN ASSETS",
    "typeId": "1",
    "typeName": "Asset",
    "usage": "Header",
    "manualEntriesAllowed": false,
    "parentId": "1",
    "description": "Groups outstanding loan principal, accrued loan receivables, and related valuation allowances.\\n\\n"
  },
  {
    "id": "8",
    "glCode": "130000",
    "name": "OTHER ASSETS",
    "typeId": "1",
    "typeName": "Asset",
    "usage": "Header",
    "manualEntriesAllowed": false,
    "parentId": "1",
    "description": "Groups clearing receivables, interbranch receivables, and other financial or operating assets.\\n\\n"
  },
  {
    "id": "23",
    "glCode": "120102",
    "name": "Corporate Loan Principal",
    "typeId": "1",
    "typeName": "Asset",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "7",
    "description": ""
  },
  {
    "id": "10",
    "glCode": "220000",
    "name": "FUNDING AND CLEARING",
    "typeId": "2",
    "typeName": "Liability",
    "usage": "Header",
    "manualEntriesAllowed": false,
    "parentId": "2",
    "description": "Groups interbank funding liabilities, clearing payables, and other settlement obligations.\\n\\n"
  },
  {
    "id": "11",
    "glCode": "310000",
    "name": "CAPITAL AND RESERVES",
    "typeId": "3",
    "typeName": "Equity",
    "usage": "Header",
    "manualEntriesAllowed": false,
    "parentId": "3",
    "description": "Groups contributed capital, retained earnings, reserves, and accumulated financial results.\\n\\n"
  },
  {
    "id": "12",
    "glCode": "410000",
    "name": "INTEREST INCOME",
    "typeId": "4",
    "typeName": "Income",
    "usage": "Header",
    "manualEntriesAllowed": false,
    "parentId": "4",
    "description": "Groups interest income earned from lending, interbank placements, and other interest-bearing assets.\\n\\n"
  },
  {
    "id": "15",
    "glCode": "520000",
    "name": "CREDIT LOSS EXPENSES",
    "typeId": "5",
    "typeName": "Expense",
    "usage": "Header",
    "manualEntriesAllowed": false,
    "parentId": "5",
    "description": "Groups credit impairment charges, credit loss expenses, and related adjustments.\\n\\n"
  },
  {
    "id": "16",
    "glCode": "530000",
    "name": "OPERATING EXPENSES",
    "typeId": "5",
    "typeName": "Expense",
    "usage": "Header",
    "manualEntriesAllowed": false,
    "parentId": "5",
    "description": "Groups personnel, administrative, technology, and other operating expenses.\\n\\n"
  },
  {
    "id": "9",
    "glCode": "210000",
    "name": "CUSTOMER DEPOSITS",
    "typeId": "2",
    "typeName": "Liability",
    "usage": "Header",
    "manualEntriesAllowed": false,
    "parentId": "2",
    "description": "Groups customer savings, current and term deposits, and related interest payable obligations.\\n\\n"
  },
  {
    "id": "18",
    "glCode": "110102",
    "name": "Cash at Teller",
    "typeId": "1",
    "typeName": "Asset",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "6",
    "description": ""
  },
  {
    "id": "20",
    "glCode": "110202",
    "name": "Central Bank Balance",
    "typeId": "1",
    "typeName": "Asset",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "6",
    "description": ""
  },
  {
    "id": "21",
    "glCode": "110301",
    "name": "Interbank Placements",
    "typeId": "1",
    "typeName": "Asset",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "6",
    "description": ""
  },
  {
    "id": "24",
    "glCode": "120201",
    "name": "Loan Interest Receivable",
    "typeId": "1",
    "typeName": "Asset",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "7",
    "description": ""
  },
  {
    "id": "25",
    "glCode": "120202",
    "name": "Loan Fee Receivable",
    "typeId": "1",
    "typeName": "Asset",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "7",
    "description": ""
  },
  {
    "id": "26",
    "glCode": "120203",
    "name": "Loan Penalty Receivable",
    "typeId": "1",
    "typeName": "Asset",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "7",
    "description": ""
  },
  {
    "id": "27",
    "glCode": "120301",
    "name": "Allowance for Credit Losses",
    "typeId": "1",
    "typeName": "Asset",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "7",
    "description": ""
  },
  {
    "id": "28",
    "glCode": "130101",
    "name": "Clearing Receivable",
    "typeId": "1",
    "typeName": "Asset",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "8",
    "description": ""
  },
  {
    "id": "29",
    "glCode": "130102",
    "name": "Interbranch Receivable",
    "typeId": "1",
    "typeName": "Asset",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "8",
    "description": ""
  },
  {
    "id": "30",
    "glCode": "130103",
    "name": "Loan Transfer Suspense",
    "typeId": "1",
    "typeName": "Asset",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "8",
    "description": ""
  },
  {
    "id": "31",
    "glCode": "210101",
    "name": "Savings Deposits",
    "typeId": "2",
    "typeName": "Liability",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "9",
    "description": ""
  },
  {
    "id": "32",
    "glCode": "210102",
    "name": "Current Account Deposits",
    "typeId": "2",
    "typeName": "Liability",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "9",
    "description": ""
  },
  {
    "id": "33",
    "glCode": "210103",
    "name": "Fixed Deposits",
    "typeId": "2",
    "typeName": "Liability",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "9",
    "description": ""
  },
  {
    "id": "34",
    "glCode": "210104",
    "name": "Recurring Deposits",
    "typeId": "2",
    "typeName": "Liability",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "9",
    "description": ""
  },
  {
    "id": "35",
    "glCode": "210201",
    "name": "Savings Interest Payable",
    "typeId": "2",
    "typeName": "Liability",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "9",
    "description": ""
  },
  {
    "id": "36",
    "glCode": "210202",
    "name": "Fixed Deposit Interest Payable",
    "typeId": "2",
    "typeName": "Liability",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "9",
    "description": ""
  },
  {
    "id": "37",
    "glCode": "220101",
    "name": "Interbank Borrowings",
    "typeId": "2",
    "typeName": "Liability",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "10",
    "description": ""
  },
  {
    "id": "38",
    "glCode": "220201",
    "name": "Clearing Payable",
    "typeId": "2",
    "typeName": "Liability",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "10",
    "description": ""
  },
  {
    "id": "40",
    "glCode": "220203",
    "name": "Unapplied Customer Funds",
    "typeId": "2",
    "typeName": "Liability",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "10",
    "description": ""
  },
  {
    "id": "41",
    "glCode": "220204",
    "name": "Loan Overpayment Liability",
    "typeId": "2",
    "typeName": "Liability",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "10",
    "description": ""
  },
  {
    "id": "43",
    "glCode": "310102",
    "name": "Retained Earnings",
    "typeId": "3",
    "typeName": "Equity",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "11",
    "description": ""
  },
  {
    "id": "44",
    "glCode": "310103",
    "name": "Current Year Result",
    "typeId": "3",
    "typeName": "Equity",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "11",
    "description": ""
  },
  {
    "id": "46",
    "glCode": "410101",
    "name": "Loan Interest Income",
    "typeId": "4",
    "typeName": "Income",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "12",
    "description": ""
  },
  {
    "id": "47",
    "glCode": "410102",
    "name": "Interbank Interest Income",
    "typeId": "4",
    "typeName": "Income",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "12",
    "description": ""
  },
  {
    "id": "48",
    "glCode": "420101",
    "name": "Loan Processing Fee Income",
    "typeId": "4",
    "typeName": "Income",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "13",
    "description": ""
  },
  {
    "id": "49",
    "glCode": "420102",
    "name": "Savings Service Fee Income",
    "typeId": "4",
    "typeName": "Income",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "13",
    "description": ""
  },
  {
    "id": "50",
    "glCode": "420103",
    "name": "Loan Penalty Income",
    "typeId": "4",
    "typeName": "Income",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "13",
    "description": ""
  },
  {
    "id": "52",
    "glCode": "420105",
    "name": "Loan Recovery Income",
    "typeId": "4",
    "typeName": "Income",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "13",
    "description": ""
  },
  {
    "id": "53",
    "glCode": "510101",
    "name": "Savings Interest Expense",
    "typeId": "5",
    "typeName": "Expense",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "14",
    "description": ""
  },
  {
    "id": "56",
    "glCode": "510103",
    "name": "Interbank Funding Expense",
    "typeId": "5",
    "typeName": "Expense",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "14",
    "description": ""
  },
  {
    "id": "59",
    "glCode": "520102",
    "name": "Credit Impairment Expense",
    "typeId": "5",
    "typeName": "Expense",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "15",
    "description": ""
  },
  {
    "id": "19",
    "glCode": "110201",
    "name": "Settlement Bank Account",
    "typeId": "1",
    "typeName": "Asset",
    "usage": "Detail",
    "manualEntriesAllowed": true,
    "parentId": "6",
    "description": ""
  },
  {
    "id": "14",
    "glCode": "510000",
    "name": "INTEREST EXPENSES",
    "typeId": "5",
    "typeName": "Expense",
    "usage": "Header",
    "manualEntriesAllowed": false,
    "parentId": "5",
    "description": "Groups interest expenses incurred on customer deposits and other funding sources.\\n\\n"
  },
  {
    "id": "57",
    "glCode": "510102",
    "name": "Fixed Deposit Interest Expense",
    "typeId": "5",
    "typeName": "Expense",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "14",
    "description": ""
  },
  {
    "id": "45",
    "glCode": "310199",
    "name": "Opening Balance Contra",
    "typeId": "3",
    "typeName": "Equity",
    "usage": "Detail",
    "manualEntriesAllowed": true,
    "parentId": "11",
    "description": ""
  },
  {
    "id": "13",
    "glCode": "420000",
    "name": "FEE AND OTHER INCOME",
    "typeId": "4",
    "typeName": "Income",
    "usage": "Header",
    "manualEntriesAllowed": false,
    "parentId": "4",
    "description": "Groups service fees, loan processing fees, penalties, and other non-interest income.\\n\\n"
  },
  {
    "id": "17",
    "glCode": "110101",
    "name": "Cash at Vault",
    "typeId": "1",
    "typeName": "Asset",
    "usage": "Detail",
    "manualEntriesAllowed": true,
    "parentId": "6",
    "description": ""
  },
  {
    "id": "42",
    "glCode": "310101",
    "name": "Contributed Capital",
    "typeId": "3",
    "typeName": "Equity",
    "usage": "Detail",
    "manualEntriesAllowed": true,
    "parentId": "11",
    "description": ""
  },
  {
    "id": "60",
    "glCode": "530101",
    "name": "Operating Expense",
    "typeId": "5",
    "typeName": "Expense",
    "usage": "Detail",
    "manualEntriesAllowed": true,
    "parentId": "16",
    "description": ""
  },
  {
    "id": "2",
    "glCode": "200000",
    "name": "TOTAL LIABILITIES",
    "typeId": "2",
    "typeName": "Liability",
    "usage": "Header",
    "manualEntriesAllowed": false,
    "parentId": null,
    "description": "Root account for all financial liabilities and obligations of Takashimaya Bank"
  },
  {
    "id": "5",
    "glCode": "500000",
    "name": "TOTAL EXPENSES",
    "typeId": "5",
    "typeName": "Expense",
    "usage": "Header",
    "manualEntriesAllowed": false,
    "parentId": null,
    "description": "Root account for all  interest , operating costs, impairment  losses , and other expense incurred  by Takashimaya Bank"
  },
  {
    "id": "58",
    "glCode": "520101",
    "name": "Loan Write-off Expense",
    "typeId": "5",
    "typeName": "Expense",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "15",
    "description": ""
  },
  {
    "id": "51",
    "glCode": "420104",
    "name": "Payment Service Fee Income",
    "typeId": "4",
    "typeName": "Income",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "13",
    "description": ""
  },
  {
    "id": "62",
    "glCode": "530103",
    "name": "Bank Charges Expense",
    "typeId": "5",
    "typeName": "Expense",
    "usage": "Detail",
    "manualEntriesAllowed": true,
    "parentId": "16",
    "description": ""
  },
  {
    "id": "61",
    "glCode": "530102",
    "name": "Salary Expense",
    "typeId": "5",
    "typeName": "Expense",
    "usage": "Detail",
    "manualEntriesAllowed": true,
    "parentId": "16",
    "description": ""
  },
  {
    "id": "65",
    "glCode": "220301",
    "name": "Accrued Operating Expenses Payable",
    "typeId": "2",
    "typeName": "Liability",
    "usage": "Detail",
    "manualEntriesAllowed": true,
    "parentId": "10",
    "description": "Records operating expenses incurred but not yet paid to suppliers or service providers."
  },
  {
    "id": "66",
    "glCode": "420107",
    "name": "Fixed Deposit Penalty Income",
    "typeId": "4",
    "typeName": "Income",
    "usage": "Detail",
    "manualEntriesAllowed": true,
    "parentId": "13",
    "description": "Records penalty income arising from applicable fixed deposit transactions, according to the bank's deposit policies."
  },
  {
    "id": "39",
    "glCode": "220202",
    "name": "Loan Overpayment Liability",
    "typeId": "2",
    "typeName": "Liability",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "10",
    "description": ""
  },
  {
    "id": "67",
    "glCode": "420108",
    "name": "Recurring Deposit Penalty Income",
    "typeId": "4",
    "typeName": "Income",
    "usage": "Detail",
    "manualEntriesAllowed": true,
    "parentId": "13",
    "description": "Records penalty income arising from recurring deposit transactions."
  },
  {
    "id": "69",
    "glCode": "420110",
    "name": "Loan Recovery Income",
    "typeId": "4",
    "typeName": "Income",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "13",
    "description": ""
  },
  {
    "id": "68",
    "glCode": "420109",
    "name": "Loan Fee Income",
    "typeId": "4",
    "typeName": "Income",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "13",
    "description": ""
  },
  {
    "id": "70",
    "glCode": "520104",
    "name": "Loan Goodwill Credit Expense",
    "typeId": "5",
    "typeName": "Expense",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "15",
    "description": ""
  },
  {
    "id": "71",
    "glCode": "520105",
    "name": "Loan Charge-off Expense",
    "typeId": "5",
    "typeName": "Expense",
    "usage": "Detail",
    "manualEntriesAllowed": false,
    "parentId": "15",
    "description": ""
  },
  {
    "id": "72",
    "glCode": "520106",
    "name": "Loan Fraud Charge-off Expense",
    "typeId": "5",
    "typeName": "Expense",
    "usage": "Detail",
    "manualEntriesAllowed": true,
    "parentId": "15",
    "description": ""
  },
  {
    "id": "77",
    "glCode": "220401",
    "name": "Interbank Borrowings",
    "typeId": "2",
    "typeName": "Liability",
    "usage": "Detail",
    "manualEntriesAllowed": true,
    "parentId": "10",
    "description": ""
  },
  {
    "id": "78",
    "glCode": "510201",
    "name": "Interbank Interest Expense",
    "typeId": "5",
    "typeName": "Expense",
    "usage": "Detail",
    "manualEntriesAllowed": true,
    "parentId": "14",
    "description": ""
  }
];

export const INITIAL_LOAN_PRODUCTS = [
  {
    "id": "1",
    "name": "TKB Personal Loan",
    "shortName": "TKPL",
    "description": "Personal installment loan with monthly repayments and declining balance interest calculation.",
    "currencyCode": "VND",
    "currencyName": "Dong",
    "principal": 10000000.0,
    "minPrincipal": 1000000.0,
    "maxPrincipal": 50000000.0,
    "numberOfRepayments": 12,
    "repaymentFrequency": "Tháng (Months)",
    "interestRatePerPeriod": 12.0,
    "annualInterestRate": 12.0,
    "interestType": "Flat",
    "accountingRule": "Accrual (Periodic)",
    "status": "Active"
  }
];

export const INITIAL_SAVINGS_PRODUCTS = [
  {
    "id": "1",
    "name": "TKB Current Account",
    "shortName": "TKCA",
    "description": "Basic VND CASA Product · Demo",
    "currencyCode": "VND",
    "depositType": "Savings (Tiền gửi thanh toán)",
    "depositTypeId": "100",
    "nominalAnnualInterestRate": 0.0,
    "minBalanceForInterest": 0.0,
    "accountingRule": "Cash Based"
  },
  {
    "id": "2",
    "name": "TKB Fixed Deposit",
    "shortName": "TKFD",
    "description": "A VND fixed-term deposit product offered by Takashimaya Bank, supporting 3, 6, and 12-month deposit terms with tiered annual interest rates. Designed for secure savings, interest accrual, and maturity-based withdrawals.",
    "currencyCode": "VND",
    "depositType": "Fixed Deposit (Tiết kiệm có kỳ hạn)",
    "depositTypeId": "200",
    "nominalAnnualInterestRate": 0.0,
    "minBalanceForInterest": 0.0,
    "accountingRule": "Cash Based"
  },
  {
    "id": "3",
    "name": "TKB Goal Savings",
    "shortName": "TKGS",
    "description": "A recurring deposit product designed to help customers achieve savings goals through regular monthly contributions.",
    "currencyCode": "VND",
    "depositType": "Recurring Deposit (Tiết kiệm gửi góp)",
    "depositTypeId": "300",
    "nominalAnnualInterestRate": 0.0,
    "minBalanceForInterest": 0.0,
    "accountingRule": "Cash Based"
  }
];

export const INITIAL_CLIENTS = [
  {
    "id": "1",
    "accountNo": "000000001",
    "externalId": "TKB-CUS-001",
    "displayName": "Minh Nguyen",
    "firstname": "Minh",
    "lastname": "Nguyen",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "status": "Pending Approval",
    "activationDate": null,
    "mobileNo": null
  },
  {
    "id": "2",
    "accountNo": "000000002",
    "externalId": "TKB-CUS-002",
    "displayName": "Lan Tran",
    "firstname": "Lan",
    "lastname": "Tran",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "status": "Pending Approval",
    "activationDate": null,
    "mobileNo": null
  },
  {
    "id": "3",
    "accountNo": "000000003",
    "externalId": "TKB-CUS-003",
    "displayName": "Anh Le",
    "firstname": "Anh",
    "lastname": "Le",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "status": "Pending Approval",
    "activationDate": null,
    "mobileNo": null
  },
  {
    "id": "4",
    "accountNo": "000000004",
    "externalId": "TKB-CUS-004",
    "displayName": "Hoa Pham",
    "firstname": "Hoa",
    "lastname": "Pham",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "status": "Pending Approval",
    "activationDate": null,
    "mobileNo": null
  },
  {
    "id": "5",
    "accountNo": "000000005",
    "externalId": "TKB-CUS-005",
    "displayName": "Tuan Vo",
    "firstname": "Tuan",
    "lastname": "Vo",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "status": "Pending Approval",
    "activationDate": null,
    "mobileNo": null
  },
  {
    "id": "6",
    "accountNo": "000000006",
    "externalId": "TKB-CUS-006",
    "displayName": "Linh Dang",
    "firstname": "Linh",
    "lastname": "Dang",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "status": "Pending Approval",
    "activationDate": null,
    "mobileNo": null
  },
  {
    "id": "7",
    "accountNo": "000000007",
    "externalId": "TKB-CUS-007",
    "displayName": "Nam Bui",
    "firstname": "Nam",
    "lastname": "Bui",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "status": "Pending Approval",
    "activationDate": null,
    "mobileNo": null
  },
  {
    "id": "8",
    "accountNo": "000000008",
    "externalId": "TKB-CUS-008",
    "displayName": "Mai Hoang",
    "firstname": "Mai",
    "lastname": "Hoang",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "status": "Pending Approval",
    "activationDate": null,
    "mobileNo": null
  },
  {
    "id": "9",
    "accountNo": "000000009",
    "externalId": "TKB-CUS-009",
    "displayName": "Khang Do",
    "firstname": "Khang",
    "lastname": "Do",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "status": "Pending Approval",
    "activationDate": null,
    "mobileNo": null
  },
  {
    "id": "10",
    "accountNo": "000000010",
    "externalId": "TKB-CUS-0010",
    "displayName": "Thao Phan",
    "firstname": "Thao",
    "lastname": "Phan",
    "officeId": "1",
    "officeName": "Takashimaya Bank (TKB) - HO",
    "status": "Pending Approval",
    "activationDate": null,
    "mobileNo": null
  },
  {
    "id": "11",
    "accountNo": "000000011",
    "externalId": "TKB-CIF-TDU-001",
    "displayName": "Minh Quang Tran",
    "firstname": "Minh",
    "lastname": "Tran",
    "officeId": "26",
    "officeName": "Thu Duc Transaction Office",
    "status": "Active",
    "activationDate": "2026-10-13",
    "mobileNo": "955738216",
    "email": "quang2004@gmail.com",
    "staffName": "Dang, Quan"
  },
  {
    "id": "12",
    "accountNo": "000000012",
    "externalId": "TKB-CIF-TDU-002",
    "displayName": "Lan Ngoc Pham",
    "firstname": "Lan",
    "lastname": "Pham",
    "officeId": "26",
    "officeName": "Thu Duc Transaction Office",
    "status": "Active",
    "activationDate": "2026-10-13",
    "mobileNo": "94462817"
  }
];

export const INITIAL_TELLERS = [
  {
    id: "1",
    name: "Thu Duc Teller 01",
    officeId: "26",
    officeName: "Thu Duc Transaction Office",
    validFrom: "2026-08-05",
    validTo: null,
    state: "Active (Mở quầy)",
    cashierName: "Staff #1 (Nguyễn Văn Thu Ngân)",
    startDate: "2026-08-05",
    endDate: "2026-11-05",
    currentCashBalance: 50000000
  }
];

export const INITIAL_FINANCIAL_ACTIVITIES = [
  {
    id: "1",
    activityCode: "102",
    activityName: "Cash At Teller",
    accountType: "ASSET",
    accountCode: "110102",
    accountName: "Cash at Teller"
  },
  {
    id: "2",
    activityCode: "100",
    activityName: "Asset Transfer",
    accountType: "ASSET",
    accountCode: "130101",
    accountName: "Clearing Receivable"
  },
  {
    id: "3",
    activityCode: "200",
    activityName: "Liability Transfer",
    accountType: "LIABILITY",
    accountCode: "220201",
    accountName: "Clearing Payable"
  },
  {
    id: "4",
    activityCode: "103",
    activityName: "Fund Source",
    accountType: "ASSET",
    accountCode: "110201",
    accountName: "Settlement Bank Account"
  },
  {
    id: "5",
    activityCode: "300",
    activityName: "Opening Balances Transfer Contra",
    accountType: "EQUITY",
    accountCode: "310199",
    accountName: "Opening Balance Contra"
  },
  {
    id: "6",
    activityCode: "101",
    activityName: "Cash At Main Vault",
    accountType: "ASSET",
    accountCode: "110101",
    accountName: "Cash at Vault"
  }
];

export const INITIAL_ACCOUNTING_RULES = [
  {
    id: "1",
    name: "Operating Expense Accrual",
    officeId: "1",
    officeName: "Takashimaya Bank (TKB) - HO",
    debitAccount: "530101 - General Administrative Expenses",
    creditAccount: "220101 - Accounts Payable Accrual",
    description: "Records operating expenses incurred but not yet paid, ensuring consistent accrual accounting entries."
  }
];

export const INITIAL_GL_CLOSURES = [
  {
    id: "1",
    officeName: "Takashimaya Bank (TKB) - HO",
    closingDate: "2026-08-31",
    comments: "Month-end accounting closure for August 2026. Closing date established for testing posting restrictions.",
    closedBy: "mifos (Super user)"
  }
];

export const INITIAL_LOANS = [
  {
    id: "1",
    accountNo: "000000001",
    externalId: "TKB-LN-0001",
    clientId: "11",
    clientName: "Minh Quang Tran",
    productId: "1",
    productName: "TKB Personal Loan",
    principal: 10000000,
    annualInterestRate: 12.0,
    termMonths: 12,
    status: "Active (Đã giải ngân)",
    disbursementDate: "2026-08-15",
    totalRepaid: 888487.89,
    outstandingBalance: 9773366.75,
    schedule: [
      { installment: 1, dueDate: "2026-09-15", principal: 833333, interest: 100000, total: 933333, status: "Paid" },
      { installment: 2, dueDate: "2026-10-15", principal: 833333, interest: 100000, total: 933333, status: "Paid" },
      { installment: 3, dueDate: "2026-11-15", principal: 833333, interest: 100000, total: 933333, status: "Pending" },
      { installment: 4, dueDate: "2026-12-15", principal: 833333, interest: 100000, total: 933333, status: "Pending" }
    ]
  }
];

export const INITIAL_SAVINGS_ACCOUNTS = [
  {
    id: "1",
    accountNo: "000000001",
    clientId: "11",
    clientName: "Minh Quang Tran",
    productId: "1",
    productName: "TKB Current Account",
    accountType: "Savings (Thanh toán)",
    balance: 12000000,
    lastActive: "2026-10-15",
    status: "Active",
    openedDate: "2026-08-10"
  },
  {
    id: "2",
    accountNo: "000000002",
    clientId: "12",
    clientName: "Lan Ngoc Pham",
    productId: "1",
    productName: "TKB Current Account",
    accountType: "Savings (Thanh toán)",
    balance: 8200000,
    status: "Active",
    openedDate: "2026-08-12"
  },
  {
    id: "3",
    accountNo: "000000003",
    clientId: "11",
    clientName: "Minh Quang Tran",
    productId: "2",
    productName: "TKB Fixed Deposit",
    accountType: "Fixed Deposit (Có kỳ hạn)",
    balance: 1000000,
    lastActive: "2026-10-13",
    status: "Active",
    termMonths: 6,
    interestRate: 6.5,
    openedDate: "2026-08-15"
  },
  {
    id: "4",
    accountNo: "000000004",
    clientId: "12",
    clientName: "Lan Ngoc Pham",
    productId: "3",
    productName: "TKB Goal Savings",
    accountType: "Recurring Deposit (Gửi góp)",
    balance: 12000000,
    status: "Active",
    monthlyDeposit: 2000000,
    openedDate: "2026-08-20"
  }
];

// Danh sách bài học / Sổ tay hướng dẫn giáo dục từng phân hệ (Edu Walkthrough)
export const EDU_MODULES = [
  {
    id: "gl-part-1",
    moduleNumber: "01",
    moduleTitle: "Phân hệ 01: Accounting / GL",
    partNumber: "1",
    name: "Phần 1: Thiết Lập Đơn Vị Tiền Tệ (Currency Config)",
    shortLabel: "Phần 1: Đơn vị tiền tệ",
    title: "Thiết Lập Đơn Vị Tiền Tệ (Currency Configuration)",
    objective: "Khai báo và cấu hình các loại tiền tệ hoạt động (Currencies) trong ngân hàng Takashimaya Bank (TKB) nhằm phục vụ các sản phẩm tiền gửi, cho vay và hạch toán kế toán đa tiền tệ.",
    targetMenu: "admin-currency-config",
    subPath: "currency"
  },
  {
    id: "gl-part-2",
    moduleNumber: "01",
    moduleTitle: "Phân hệ 01: Accounting / GL",
    partNumber: "2",
    name: "Phần 2: Thiết Lập GL Header Cấp 1 (Chart of Accounts)",
    shortLabel: "Phần 2: GL Header Cấp 1",
    title: "Thiết Lập 5 Tài Khoản GL Header Cấp 1 (Root Chart of Accounts)",
    objective: "Khai báo 5 tài khoản Tổng hợp cấp 1 cao nhất (Root GL Headers: 100000 TOTAL ASSETS, 200000 TOTAL LIABILITIES, 300000 TOTAL EQUITY, 400000 TOTAL INCOME, 500000 TOTAL EXPENSES) theo đúng chuẩn Mifos X để làm nền tảng xương sống cho toàn bộ cây tài khoản kế toán ngân hàng Takashimaya Bank.",
    targetMenu: "accounting",
    subPath: "coa"
  },
  {
    id: "gl-part-3",
    moduleNumber: "01",
    moduleTitle: "Phân hệ 01: Accounting / GL",
    partNumber: "3",
    name: "Phần 3: Thiết Lập GL Cấp 2 (Chart of Accounts Level 2)",
    shortLabel: "Phần 3: GL Cấp 2",
    title: "Thiết Lập Tài Khoản GL Cấp 2 (Chart of Accounts Level 2)",
    objective: "Khai báo các tài khoản Tổng hợp GL Cấp 2 thuộc 5 nhóm tài khoản chính (Asset, Liability, Equity, Income, Expense) có liên kết Parent Account theo đúng 5 Header Cấp 1 tương ứng.",
    targetMenu: "accounting",
    subPath: "coa-level-2"
  },
  {
    id: "gl-part-4",
    moduleNumber: "01",
    moduleTitle: "Phân hệ 01: Accounting / GL",
    partNumber: "4",
    name: "Phần 4: Thiết Lập GL Chi Tiết (Chart of Accounts Details)",
    shortLabel: "Phần 4: GL Chi Tiết",
    title: "Thiết Lập Tài Khoản GL Chi Tiết (Chart of Accounts Detail Accounts)",
    objective: "Khai báo các tài khoản GL Chi tiết (Detail Accounts) thuộc 5 nhóm tài khoản chính có liên kết Parent Header theo đúng các tài khoản GL Cấp 2 tương ứng, phục vụ hạch toán nghiệp vụ ngân hàng.",
    targetMenu: "accounting",
    subPath: "coa-details"
  },
  {
    id: "gl-part-5",
    moduleNumber: "01",
    moduleTitle: "Phân hệ 01: Accounting / GL",
    partNumber: "5",
    name: "Phần 5: Ánh Xạ Hoạt Động Tài Chính (Financial Activity Mappings)",
    shortLabel: "Phần 5: Financial Activity Mapping",
    title: "Ánh Xạ Hoạt Động Tài Chính (Financial Activity Mappings)",
    objective: "Khai báo và liên kết 6 hoạt động tài chính tự động (Opening Balance Contra, Cash at Main Vault, Cash at Teller, Fund Source, Asset Transfer, Liability Transfer) tới các tài khoản GL chi tiết tương ứng, phục vụ hạch toán tự động trong hệ thống ngân hàng.",
    targetMenu: "accounting",
    subPath: "activities"
  },
  {
    id: "gl-part-6",
    moduleNumber: "01",
    moduleTitle: "Phân hệ 01: Accounting / GL",
    partNumber: "6",
    name: "Phần 6: Khởi Tạo Số Dư Đầu Kỳ (Opening Balance Migration)",
    shortLabel: "Phần 6: Opening Balance Migration",
    title: "Khởi Tạo Số Dư Đầu Kỳ & Tra Cứu Nhật Ký Bút Toán (Opening Balance Migration & Journal Entries)",
    objective: "Kích hoạt cấu hình tài khoản đối ứng (Contra Account), khởi tạo số dư đầu kỳ cho các tài khoản tiền mặt, tiền gửi thanh toán và vốn góp tại Hội sở, sau đó tra cứu đối soát nhật ký sổ cái (Journal Entries).",
    targetMenu: "accounting",
    subPath: "opening-balances"
  },
  {
    id: "gl-part-7",
    moduleNumber: "01",
    moduleTitle: "Phân hệ 01: Accounting / GL",
    partNumber: "7",
    name: "Phần 7: Ghi Nhận Bút Toán Thủ Công (Manual Journal Entries)",
    shortLabel: "Phần 7: Manual Journal Entries",
    title: "Ghi Nhận Bút Toán Thủ Công Trực Tiếp Vào Sổ Cái (Manual Journal Entries)",
    objective: "Ghi nhận nghiệp vụ kế toán thủ công trực tiếp vào sổ cái cho chi phí vận hành dồn tích (Nợ TK 530101 Operating Expense / Có TK 220301 Accrued Operating Expenses Payable: 2.000.000 VND), sau đó tra cứu và đối soát nhật ký trong Search Journal Entries.",
    targetMenu: "accounting",
    subPath: "create-journal"
  },
  {
    id: "gl-part-8",
    moduleNumber: "01",
    moduleTitle: "Phân hệ 01: Accounting / GL",
    partNumber: "8",
    name: "Phần 8: Quy Tắc Định Khoản (Accounting Rules)",
    shortLabel: "Phần 8: Accounting Rules",
    title: "Thiết Lập Quy Tắc Định Khoản Nghiệp Vụ Mẫu (Accounting Rules)",
    objective: "Thiết lập quy tắc định khoản tự động (Accounting Rule) cho nghiệp vụ trích trước chi phí vận hành (Operating Expense Accrual): Nợ TK 530101 (Ghi tăng chi phí hoạt động khi ngân hàng phát sinh chi phí) và Có TK 220301 (Ghi tăng nghĩa vụ phải trả do ngân hàng chưa thực hiện thanh toán), sau đó xem chi tiết quy tắc vừa tạo.",
    targetMenu: "accounting",
    subPath: "accounting-rules"
  },
  {
    id: "gl-part-9",
    moduleNumber: "01",
    moduleTitle: "Phân hệ 01: Accounting / GL",
    partNumber: "9",
    name: "Phần 9: Định Khoản Thường Xuyên (Frequent Postings)",
    shortLabel: "Phần 9: Frequent Postings",
    title: "Ghi Nhận Bút Toán Thường Xuyên Theo Quy Tắc (Frequent Postings)",
    objective: "Sử dụng quy tắc định khoản mẫu (Operating Expense Accrual) để ghi nhận chi phí bảo trì hệ thống CNTT phát sinh định kỳ (5.000.000 VND), sinh tự động bút toán Nợ TK 530101 / Có TK 220301 và kiểm tra giao dịch hoàn tất.",
    targetMenu: "accounting",
    subPath: "frequent-postings"
  },
  {
    id: "part-1",
    moduleNumber: "user-access",
    moduleTitle: "User & Access Management",
    partNumber: "1",
    name: "User & Access Management: Thiết lập quyền và nhân viên làm việc",
    shortLabel: "User & Access Management",
    title: "User & Access Management: Thiết lập quyền và nhân viên làm việc",
    objective: "Thiết lập các vai trò tác nghiệp (Roles & Permissions) và khởi tạo tài khoản nhân viên (Users) làm việc trong ngân hàng Takashimaya Bank (TKB), phân định rõ quyền hạn theo chuẩn kiểm soát kép (Dual Control / Maker - Checker).",
    targetMenu: "admin-users",
    subPath: "users"
  },
  {
    id: "part-2",
    moduleNumber: "00",
    moduleTitle: "Foundation Setup: Thiết Lập Nền Tảng",
    partNumber: "2",
    name: "Foundation 2: Cơ Cấu Tổ Chức (Hội Sở, Chi Nhánh, TO)",
    shortLabel: "Foundation: Hội sở, Chi nhánh, TO",
    title: "Cơ Cấu Tổ Chức: Hội Sở, Chi Nhánh & Phòng Giao Dịch (TO)",
    objective: "Khởi tạo và thiết lập phân cấp mạng lưới hoạt động ngân hàng gồm Hội sở chính (Head Office), Chi nhánh khu vực (Branch) và Phòng giao dịch (Transaction Office - TO).",
    targetMenu: "admin-offices",
    subPath: "offices"
  },
  {
    id: "casa-part-1",
    moduleNumber: "02",
    moduleTitle: "Phân hệ 02: Account / CASA",
    partNumber: "1",
    name: "Phần 1: Tạo Sản Phẩm CASA (Create Savings/CASA Product)",
    shortLabel: "Phần 1: Tạo SP CASA",
    title: "Thiết Lập Sản Phẩm Tiền Gửi Thanh Toán CASA (TKB Current Account - TKCA)",
    objective: "Khai báo sản phẩm tiền gửi thanh toán cá nhân TKB Current Account (Short Name: TKCA), cấu hình đơn vị tiền tệ VND, lãi suất danh nghĩa 0%, chu kỳ tính lãi hàng ngày (Daily Balance) ghi có hàng tháng (Monthly), và phương thức hạch toán Cash Based kết nối với các tài khoản GL tương ứng.",
    targetMenu: "admin-savings-products",
    subPath: "savings-products"
  },
  {
    id: "casa-part-2",
    moduleNumber: "02",
    moduleTitle: "Phân hệ 02: Account / CASA",
    partNumber: "2",
    name: "Phần 2: Tạo Hồ Sơ Khách Hàng CIF (Create Client CIF)",
    shortLabel: "Phần 2: Tạo CIF",
    title: "Tạo Mới Hồ Sơ Khách Hàng Cá Nhân CIF (Minh Quang Tran - TKB-CIF-TDU-001)",
    objective: "Khởi tạo thông tin định danh khách hàng cá nhân (CIF) tại Phòng giao dịch Thủ Đức (Thu Duc Transaction Office) cho khách hàng Minh Quang Tran, gán mã định danh External ID: TKB-CIF-TDU-001, cán bộ quản lý Dang, Quan và kích hoạt hồ sơ.",
    targetMenu: "clients",
    subPath: "create-client"
  },
  {
    id: "casa-part-3",
    moduleNumber: "02",
    moduleTitle: "Phân hệ 02: Account / CASA",
    partNumber: "3",
    name: "Phần 3: Nạp Tiền Vào Tài Khoản CASA (Deposit To Saving Account)",
    shortLabel: "Phần 3: Nạp tiền CASA",
    title: "Nạp Tiền Vào Tài Khoản Tiền Gửi CASA (Minh Quang Tran - Account 000000001)",
    objective: "Thực hiện nghiệp vụ nộp tiền 5.000.000 VND vào tài khoản CASA 000000001 của khách hàng Minh Quang Tran qua hình thức Money Transfer và theo dõi biến động số dư, ghi nhận giao dịch tại tab Transactions.",
    targetMenu: "clients",
    subPath: "savings-detail"
  },
  {
    id: "casa-part-4",
    moduleNumber: "02",
    moduleTitle: "Phân hệ 02: Account / CASA",
    partNumber: "4",
    name: "Phần 4: Rút Tiền Khỏi Tài Khoản CASA (Withdraw From Saving Account)",
    shortLabel: "Phần 4: Rút tiền CASA",
    title: "Rút Tiền Khỏi Tài Khoản Tiền Gửi CASA (Minh Quang Tran - Account 000000001)",
    objective: "Thực hiện nghiệp vụ rút tiền 2.000.000 VND từ tài khoản CASA 000000001 của khách hàng Minh Quang Tran qua hình thức Money Transfer, đối soát số dư còn lại 3.000.000 VND và kiểm tra đối chiếu lịch sử giao dịch tại tab Transactions.",
    targetMenu: "clients",
    subPath: "savings-withdraw"
  },
  {
    id: "casa-part-5",
    moduleNumber: "02",
    moduleTitle: "Phân hệ 02: Account / CASA",
    partNumber: "5",
    name: "Phần 5: Chuyển Khoản Nội Bộ (Account Transfer: Minh Quang Tran -> Lan Ngoc Pham)",
    shortLabel: "Phần 5: Chuyển khoản nội bộ",
    title: "Chuyển Khoản Nội Bộ Giữa 2 Khách Hàng CASA (Minh Quang Tran -> Lan Ngoc Pham)",
    objective: "Thực hiện nghiệp vụ chuyển khoản nội bộ (Account Transfer) số tiền 1.000.000 VND từ tài khoản CASA 000000001 (Minh Quang Tran) sang tài khoản CASA 000000002 (Lan Ngoc Pham). Kiểm tra biến động số dư của 2 tài khoản và đối soát 4 bút toán tự động hạch toán trong Sổ Nhật ký chung (Journal Entries).",
    targetMenu: "clients",
    subPath: "account-transfer"
  },
  {
    id: "saving-part-1",
    moduleNumber: "03",
    moduleTitle: "Phân hệ 03: Saving",
    partNumber: "1",
    name: "Phần 1: Tạo Sản Phẩm Tiền Gửi Có Kỳ Hạn (Create Fixed Deposit Product)",
    shortLabel: "Phần 1: Tạo SP Fixed Deposit",
    title: "Thiết Lập Sản Phẩm Tiền Gửi Tiết Kiệm Có Kỳ Hạn (TKB Fixed Deposit - TKFD)",
    objective: "Thiết lập sản phẩm tiền gửi tiết kiệm có kỳ hạn TKB Fixed Deposit (TKFD) theo chuẩn Core Banking Mifos X, cấu hình đơn vị tiền tệ VND, định mức số tiền gửi 1.000.000 - 1.000.000.000 VND, kỳ hạn gửi từ 3 đến 12 tháng, và khởi tạo Biểu lãi suất tiết kiệm có kỳ hạn (Interest Rate Chart).",
    targetMenu: "admin-fixed-deposit-products",
    subPath: "fixed-deposit-products"
  },
  {
    id: "saving-part-2",
    moduleNumber: "03",
    moduleTitle: "Phân hệ 03: Saving",
    partNumber: "2",
    name: "Phần 2: Mở Tài Khoản Tiền Gửi Tiết Kiệm Có Kỳ Hạn (New Fixed Deposits Account)",
    shortLabel: "Phần 2: Mở TK Fixed Deposit",
    title: "Mở Tài Khoản Tiết Kiệm Có Kỳ Hạn Cho Khách Hàng (Minh Quang Tran - TKB Fixed Deposit)",
    objective: "Thực hiện nghiệp vụ mở tài khoản tiền gửi tiết kiệm có kỳ hạn TKB Fixed Deposit cho khách hàng Minh Quang Tran với số tiền gửi 1.000.000 VND, kỳ hạn 6 tháng, áp dụng lãi suất bậc 2 (4.5% p.a.), ngày gửi 13/10/2026, ngày đáo hạn 13/04/2027 với số tiền đáo hạn dự tính 1.022.653 VND.",
    targetMenu: "clients",
    subPath: "create-fixed-deposit-account"
  },
  {
    id: "saving-part-3",
    moduleNumber: "03",
    moduleTitle: "Phân hệ 03: Saving",
    partNumber: "3",
    name: "Phần 3: Tạo Sản Phẩm Tiền Gửi Góp (TKB Goal Savings - TKGS)",
    shortLabel: "Phần 3: Tạo SP Goal Savings",
    title: "Thiết Lập Sản Phẩm Tiền Gửi Tiết Kiệm Gửi Góp (TKB Goal Savings - TKGS)",
    objective: "Thiết lập sản phẩm tiền gửi tiết kiệm gửi góp TKB Goal Savings (TKGS) theo chuẩn Core Banking Mifos X. Cấu hình các thông tin cơ bản: Tên sản phẩm TKB Goal Savings, mã viết tắt TKGS, đồng tiền VND, hạn mức gửi từ 100.000 đến 10.000.000 VND, mặc định 500.000 VND, chu kỳ tính lãi hàng tháng, chế độ gửi bắt buộc (Mandatory Deposit) kỳ hạn 12 tháng, và khởi tạo Biểu lãi suất tiết kiệm gửi góp (Interest Rate Chart) 2026.",
    targetMenu: "admin-products",
    subPath: "recurring-deposit-products"
  }
];
