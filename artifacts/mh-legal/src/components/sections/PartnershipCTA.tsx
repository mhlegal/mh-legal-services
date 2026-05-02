import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function PartnershipCTA() {
  return (
    <section className="bg-zinc-100 py-24 md:py-32 border-t border-zinc-200">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto bg-black text-white p-10 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-16 h-16 border border-accent/30 flex items-center justify-center rotate-45 mb-4"
            >
              <div className="w-8 h-8 bg-accent -rotate-45" />
            </motion.div>

            <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
              Your Altimate Chance To Freedom.
            </h2>

            <p className="text-gray-400 text-lg max-w-2xl font-light leading-relaxed">
              Whether you need legal cover, CCMA representation, a watertight contract, or someone to fight for your rights — MH LEGAL SERVICES Pty Ltd is ready.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent text-black hover:bg-white hover:text-black rounded-none h-14 px-8 text-base font-bold group transition-all">
                <Link href="/legal-services">
                  View Legal Services
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-zinc-600 text-white hover:border-white rounded-none h-14 px-8 text-base font-semibold transition-all">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
