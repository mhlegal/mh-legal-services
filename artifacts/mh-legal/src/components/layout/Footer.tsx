import { Link } from "wouter";
import { siteConfig } from "@/lib/site-config";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background py-16 md:py-24 border-t-4 border-accent">
      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24">
        
        <div className="md:col-span-5 space-y-6">
          <Link href="/">
            <div className="font-serif font-bold text-3xl tracking-wider cursor-pointer">
              MH <span className="text-accent">LEGAL</span>
            </div>
          </Link>
          <p className="text-gray-400 text-lg max-w-md">
            {siteConfig.tagline}
          </p>
          <p className="text-gray-500 max-w-md leading-relaxed">
            {siteConfig.description}
          </p>
        </div>

        <div className="md:col-span-3 space-y-6">
          <h4 className="font-serif font-bold text-xl">Quick Links</h4>
          <ul className="space-y-4">
            {siteConfig.nav.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>
                  <div className="text-gray-400 hover:text-accent transition-colors flex items-center gap-2 cursor-pointer group">
                    <ArrowRight size={14} className="text-accent opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item.name}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4 space-y-6">
          <h4 className="font-serif font-bold text-xl">Contact</h4>
          <ul className="space-y-4">
            <li>
              <a href={`mailto:${siteConfig.contact.email}`} className="text-gray-400 hover:text-white transition-colors flex items-start gap-3">
                <Mail size={20} className="text-accent mt-0.5 shrink-0" />
                <span>{siteConfig.contact.email}</span>
              </a>
            </li>
            <li>
              <a href={siteConfig.contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-start gap-3">
                <Phone size={20} className="text-accent mt-0.5 shrink-0" />
                <span>{siteConfig.contact.whatsapp}</span>
              </a>
            </li>
            <li className="flex items-start gap-3 text-gray-400">
              <MapPin size={20} className="text-accent mt-0.5 shrink-0" />
              <span>{siteConfig.contact.location}</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>© {currentYear} {siteConfig.name}. All rights reserved.</p>
        <p className="flex items-center gap-2">
          Based in <span className="text-white font-medium">South Africa</span>
        </p>
      </div>
    </footer>
  );
}
