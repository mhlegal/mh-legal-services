import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

export function Hero() {
  const handleLearnMore = () => {
    const el = document.getElementById("what-we-do");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-black text-white overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: "linear-gradient(#C9A961 1px, transparent 1px), linear-gradient(90deg, #C9A961 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-accent opacity-[0.06] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent opacity-[0.05] rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
      </div>

      {/* Left gold bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />

      <div className="container mx-auto px-4 md:px-8 pt-32 pb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-10"
        >
          <div className="h-[1px] w-16 bg-accent" />
          <span className="text-accent uppercase tracking-[0.2em] text-xs font-bold">
            Corporate Insurance Brokerage · South Africa
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold leading-[1.05] mb-6 max-w-5xl"
        >
          We Build <span className="text-accent">Systems.</span>
          <br />
          We Develop <span className="italic font-light text-gray-300">People.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed mb-12 font-light"
        >
          MHLOPHE HOLDINGS LEGAL SERVICES is a corporate insurance brokerage with a network of 100+ agents across South Africa. We distribute products, activate markets, and develop the professionals who carry the work forward.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            onClick={handleLearnMore}
            size="lg"
            className="bg-accent text-black hover:bg-white hover:text-black rounded-none h-14 px-10 text-base font-bold tracking-wide group transition-all"
          >
            Learn More
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black rounded-none h-14 px-10 text-base font-bold tracking-wide transition-all"
          >
            <Link href="/careers">Apply Now</Link>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-20 pt-10 border-t border-zinc-800 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-2xl"
        >
          {[
            { value: "100+", label: "Licensed Agents" },
            { value: "6", label: "Service Lines" },
            { value: "KZN", label: "Provincial Reach" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl md:text-4xl font-serif font-bold text-accent">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600"
      >
        <ChevronDown size={20} className="animate-bounce" />
      </motion.div>
    </section>
  );
}
