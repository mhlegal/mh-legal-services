import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function TrainingHighlight() {
  return (
    <section className="py-24 bg-white border-t border-zinc-200">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-12 bg-accent"></div>
              <span className="text-accent uppercase tracking-widest text-sm font-semibold">Human Capital</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
              Growing the Next Generation of Business Leaders.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed font-light">
              Our In-Service Training program embeds ambitious Business Management students directly inside our sales and brokerage teams. We sell insurance every day — and we develop the professionals who will sell, broker, and lead for the next generation.
            </p>
            <div className="pt-4">
              <Button asChild size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white rounded-none h-14 px-8 text-base font-semibold group transition-all">
                <Link href="/training">
                  Learn About Our Training
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square max-w-md mx-auto bg-black p-10 flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 space-y-6">
                <div className="w-12 h-[2px] bg-accent"></div>
                <h3 className="text-2xl font-serif text-white font-bold leading-snug">
                  Real brokerage. Real sales. Real growth.
                </h3>
                <p className="text-gray-400 font-light">
                  A high-energy program built for Business Management students hungry to step into a real commercial environment.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}