export const siteConfig = {
  name: "MH LEGAL",
  tagline: "We Build Systems. We Develop People.",
  description: "A South African brokerage firm building businesses and careers. MH LEGAL combines insurance brokerage, sales operations, and business solutions with an in-service training program that develops the next generation of business leaders.",
  url: "https://mhlegal.co.za", // Placeholder
  leadership: {
    managingDirector: {
      name: "Philani Mbooi",
      title: "Managing Director"
    }
  },
  contact: {
    email: "info@mhlegal.co.za",
    whatsapp: "+27 73 785 3867",
    whatsappUrl: "https://wa.me/27737853867",
    location: "South Africa"
  },
  nav: [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Training", path: "/training" },
    { name: "Partnerships", path: "/partnerships" },
    { name: "Contact", path: "/contact" }
  ]
};

export type SiteConfig = typeof siteConfig;
