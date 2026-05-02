export const siteConfig = {
  name: "MH LEGAL SERVICES Pty Ltd",
  shortName: "MHLS",
  tagline: "Altimate Chance To Freedom",
  description: "Professional legal assistance for individuals and businesses across South Africa — from legal cover and labour law to contract drafting, debt collection, and civil rights.",
  url: "https://mhlopheholdings.co.za",
  team: {
    leadership: [
      { name: "Philani Mbooi", title: "MD & Founder", initials: "PM" },
      { name: "Thulane David Phiri", title: "Head of Operations", initials: "TP" },
      { name: "Simangaliso Ngobese", title: "Provincial Manager", initials: "SN" },
    ],
    fieldManagers: [
      { name: "Bongisipho Mfusi", title: "Field Manager", initials: "BM" },
      { name: "Khulekani Gumede", title: "Field Manager", initials: "KG" },
      { name: "Nqobile Miya", title: "Field Manager", initials: "NM" },
      { name: "Sbongimpilo Miya", title: "Field Manager", initials: "SM" },
      { name: "Ncamisile Lusenga", title: "Field Manager", initials: "NL" },
    ]
  },
  contact: {
    company: "mhlopheholdings@gmail.com",
    provincial: "ngobesesimangaliso47@gmail.com",
    fieldManager: "Bongisiphoandile2@gmail.com",
    headOfField: "phirid871@gmail.com",
    whatsapp: "+27 73 785 3867",
    whatsappUrl: "https://wa.me/27737853867",
    location: "KwaZulu-Natal, South Africa"
  },
  nav: [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Legal Services", path: "/legal-services" },
    { name: "Team", path: "/team" },
    { name: "Careers", path: "/careers" },
    { name: "Contact Us", path: "/contact" }
  ],
  phones: {
    durbanHQ: "+27310027797",
    national: "0870060205",
    durbanDisplay: "+27 31 002 7797",
    nationalDisplay: "087 006 0205",
  }
};

export type SiteConfig = typeof siteConfig;
