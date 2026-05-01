export const siteConfig = {
  name: "MHLOPHE HOLDINGS LEGAL SERVICES",
  shortName: "MHLS",
  tagline: "We Build Systems. We Develop People.",
  description: "A corporate insurance brokerage operating across South Africa with a network of 100+ agents. We distribute products, activate markets, and develop the next generation of sales and compliance professionals.",
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
    { name: "Team", path: "/team" },
    { name: "Careers", path: "/careers" },
    { name: "Contact Us", path: "/contact" }
  ]
};

export type SiteConfig = typeof siteConfig;
