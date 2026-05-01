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
              <div className="h-[1px] w-12 bg-accent" />
              <span className="text-accent uppercase tracking-widest text-sm font-semibold">In-Service Training</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
              Growing the Next Generation of Business Leaders.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed font-light">
              In partnership with Mthashana TVET College, we embed Business Management students directly inside our live sales and brokerage operations. Real clients, real products, real performance — and a career foundation that academic training alone cannot build.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-black text-white hover:bg-accent hover:text-black rounded-none h-14 px-8 text-base font-semibold group transition-all">
                <Link href="/careers">
                  Apply for Training
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white rounded-none h-14 px-8 text-base font-semibold transition-all">
                <Link href="/about">Learn More</Link>
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
            <div className="bg-black p-10 flex flex-col justify-between min-h-[400px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent opacity-20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl" />
              <div className="relative z-10 space-y-6">
                <div className="w-12 h-[2px] bg-accent" />
                <h3 className="text-2xl font-serif text-white font-bold leading-snug">
                  Real brokerage. Real sales. Real growth.
                </h3>
                <p className="text-gray-400 font-light leading-relaxed">
                  A high-energy program for Business Management students who want to step into a live commercial environment from day one.
                </p>
              </div>
              <div className="relative z-10 mt-10 pt-8 border-t border-zinc-700 grid grid-cols-2 gap-6">
                <div>
                  <div className="text-2xl font-serif font-bold text-accent">100+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Active Agents</div>
                </div>
                <div>
                  <div className="text-2xl font-serif font-bold text-accent">TVET</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">College Partnership</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
