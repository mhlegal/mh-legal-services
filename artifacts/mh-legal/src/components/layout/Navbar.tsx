import { Link, useLocation } from "wouter";
import { siteConfig } from "@/lib/site-config";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent ${
        isScrolled ? "bg-background/95 backdrop-blur-md border-border shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link href="/">
          <div className="font-serif font-bold text-lg md:text-xl tracking-wider cursor-pointer flex items-center gap-1 leading-tight">
            <span className="text-white">MH LEGAL</span>
            <span className="text-accent ml-1">SERVICES</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {siteConfig.nav.map((item) => (
            <Link key={item.path} href={item.path}>
              <div
                className={`text-xs font-semibold tracking-widest uppercase cursor-pointer transition-colors relative group ${
                  location === item.path
                    ? "text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {item.name}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] bg-accent transition-all duration-300 ${
                    location === item.path ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </div>
            </Link>
          ))}
          <Button asChild className="bg-accent text-black hover:bg-white hover:text-black font-bold rounded-none px-6 h-10 text-xs tracking-widest uppercase">
            <Link href="/careers">Apply Now</Link>
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg py-4 px-4 flex flex-col gap-1">
          {siteConfig.nav.map((item) => (
            <Link key={item.path} href={item.path}>
              <div
                className={`text-base font-semibold py-3 border-b border-border/50 uppercase tracking-wide ${
                  location === item.path ? "text-accent" : "text-foreground"
                }`}
              >
                {item.name}
              </div>
            </Link>
          ))}
          <Button asChild className="w-full bg-accent text-black hover:bg-black hover:text-accent rounded-none mt-4 h-12 font-bold tracking-widest uppercase">
            <Link href="/careers">Apply Now</Link>
          </Button>
        </div>
      )}
    </header>
  );
}
