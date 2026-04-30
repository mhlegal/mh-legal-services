import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-black text-white overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-80"></div>
        {/* Subtle grid pattern for corporate feel */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwem0yMCAyMGgyMHYyMEgyMHoiIGZpbGw9IiMzMzMiIGZpbGwtb3BhY2l0eT0iMC4wNSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-8 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <div className="h-[1px] w-12 bg-accent"></div>
            <span className="text-accent uppercase tracking-widest text-sm font-semibold">MH Legal & Consulting</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] tracking-tight"
          >
            We Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-600">Systems.</span><br />
            We Develop People.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl font-light leading-relaxed"
          >
            A multi-disciplinary professional services firm. We equip growing South African businesses with the operational systems and trained people needed to protect what matters, sharpen execution, and scale with confidence.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Button asChild size="lg" className="bg-accent text-black hover:bg-white hover:text-black transition-all duration-300 rounded-none h-14 px-8 text-base font-semibold group">
              <Link href="/contact">
                Partner With Us
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800 hover:text-white rounded-none h-14 px-8 text-base font-semibold transition-all">
              <Link href="/about">Discover Our Approach</Link>
            </Button>
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-accent to-transparent"></div>
      </motion.div>
    </section>
  );
}
