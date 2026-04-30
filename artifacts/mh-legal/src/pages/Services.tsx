import { useSeo } from "@/hooks/use-seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { motion } from "framer-motion";
import { PartnershipCTA } from "@/components/sections/PartnershipCTA";
import { ShieldCheck, TrendingUp, Cog, ArrowRight } from "lucide-react";

export default function Services() {
  useSeo({
    title: "Insurance Brokerage, Sales & Business Solutions | Services",
    description: "MH LEGAL is a South African brokerage firm offering insurance brokerage, sales operations, and business solutions designed to grow your enterprise."
  });

  return (
    <SiteLayout>
      {/* Page Header */}
      <section className="bg-black text-white pt-32 pb-20 md:pt-48 md:pb-32 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-[1px] w-12 bg-accent"></div>
            <span className="text-accent uppercase tracking-widest text-sm font-semibold">What We Do</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold leading-tight"
          >
            Brokerage. Sales. <br /><span className="text-gray-500 font-light italic">Business Solutions.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-xl text-gray-400 max-w-2xl font-light leading-relaxed"
          >
            Three sharply focused service lines, one growth-oriented firm. MH LEGAL delivers insurance brokerage, sales operations, and business solutions that move South African enterprises forward.
          </motion.p>
        </div>
      </section>

      {/* Core Offering Block */}
      <section className="py-24 bg-white text-black border-b border-zinc-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-8">
              We sell insurance. We grow <span className="text-accent">businesses and leaders.</span>
            </h2>
            <div className="w-full h-[1px] bg-zinc-200 mb-8"></div>
            <p className="text-xl font-medium text-gray-600 leading-relaxed">
              MH LEGAL is, at its core, a brokerage. But brokerage on its own is not enough. We pair our insurance practice with hands-on sales management and structured business solutions — and back the whole thing with trained, ambitious talent from our In-Service Training program. The result is a firm that protects what you have built, sells with discipline, and develops the people who carry the work forward.
            </p>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-24 bg-zinc-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 border border-zinc-100 hover:border-accent/50 transition-colors group"
            >
              <ShieldCheck className="w-10 h-10 text-black group-hover:text-accent transition-colors mb-6" />
              <h3 className="text-2xl font-serif font-bold mb-4">Insurance Brokerage</h3>
              <p className="text-gray-600 leading-relaxed">
                Tailored insurance brokerage for individuals and businesses across South Africa. We assess risk, structure the right cover, and stay engaged through claims and renewals — turning insurance into a strategic asset.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-10 border border-zinc-100 hover:border-accent/50 transition-colors group"
            >
              <TrendingUp className="w-10 h-10 text-black group-hover:text-accent transition-colors mb-6" />
              <h3 className="text-2xl font-serif font-bold mb-4">Sales Operations</h3>
              <p className="text-gray-600 leading-relaxed">
                High-energy sales management built around discipline and accountability. We design pipelines, run the cadence, coach the team, and drive measurable conversion across every revenue line.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-10 border border-zinc-100 hover:border-accent/50 transition-colors group"
            >
              <Cog className="w-10 h-10 text-black group-hover:text-accent transition-colors mb-6" />
              <h3 className="text-2xl font-serif font-bold mb-4">Business Solutions</h3>
              <p className="text-gray-600 leading-relaxed">
                Operating procedures, administrative systems, and the structural support that growing businesses need. Practical frameworks that protect performance today and unlock capacity for tomorrow.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent opacity-5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Our Approach</h2>
            <p className="text-gray-400 max-w-2xl">A focused methodology that moves from understanding the business to deploying brokerage, sales, and business solutions that produce results.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Discover", desc: "We get under the hood of the business — risk profile, sales engine, administrative load. We identify where brokerage cover is needed, where sales conversion is leaking, and where structure is missing." },
              { step: "02", title: "Design", desc: "We build the right mix: insurance brokerage cover, sales management frameworks, and business solutions tuned to the engagement. Practical, sequenced, growth-oriented." },
              { step: "03", title: "Deploy", desc: "We execute alongside your team. Brokers manage policies, our sales operators run the rhythm, and trained in-service talent reinforces the work day to day." }
            ].map((phase, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                <div className="text-6xl font-serif text-zinc-800 font-bold mb-6">{phase.step}</div>
                <h3 className="text-xl font-bold mb-4 text-white">{phase.title}</h3>
                <p className="text-gray-400 leading-relaxed">{phase.desc}</p>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-8 -right-6 text-zinc-700">
                    <ArrowRight size={32} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Flexibility Note */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-12 border-l-4 border-accent bg-zinc-50 shadow-sm"
            >
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-6 text-black">
                Radical Flexibility
              </h3>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light">
                "Services evolve based on client needs — we shape our support around your operation, not the other way around. Agility is our defining characteristic in a rigid corporate world."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <PartnershipCTA />
    </SiteLayout>
  );
}