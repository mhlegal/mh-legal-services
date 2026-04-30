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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent ${
        isScrolled ? "bg-background/95 backdrop-blur-md border-border shadow-sm py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link href="/">
          <div className="font-serif font-bold text-2xl tracking-wider cursor-pointer flex items-center gap-2">
            MH <span className="text-accent">LEGAL</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {siteConfig.nav.map((item) => (
            <Link key={item.path} href={item.path}>
              <div 
                className={`text-sm font-medium tracking-wide uppercase cursor-pointer transition-colors relative group
                  ${location === item.path ? "text-foreground" : "text-muted-foreground hover:text-foreground"}
                `}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 h-[2px] bg-accent transition-all duration-300 ${location === item.path ? "w-full" : "w-0 group-hover:w-full"}`} />
              </div>
            </Link>
          ))}
          <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground font-semibold rounded-none px-6">
            <Link href="/contact">Partner With Us</Link>
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg py-4 px-4 flex flex-col gap-4">
          {siteConfig.nav.map((item) => (
            <Link key={item.path} href={item.path}>
              <div className={`text-lg font-medium py-2 border-b border-border/50 ${location === item.path ? "text-accent" : "text-foreground"}`}>
                {item.name}
              </div>
            </Link>
          ))}
          <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-none mt-2">
            <Link href="/contact">Partner With Us</Link>
          </Button>
        </div>
      )}
    </header>
  );
}
