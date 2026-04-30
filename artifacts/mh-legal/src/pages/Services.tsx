import { useSeo } from "@/hooks/use-seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { motion } from "framer-motion";
import { PartnershipCTA } from "@/components/sections/PartnershipCTA";
import { Settings, TrendingUp, Users, ArrowRight } from "lucide-react";

export default function Services() {
  useSeo({
    title: "Business Solutions & Support | Services",
    description: "MH LEGAL provides flexible operational support, business development, and staffing solutions built to scale."
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
            Business Solutions, <br /><span className="text-gray-500 font-light italic">Built To Scale.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-xl text-gray-400 max-w-2xl font-light leading-relaxed"
          >
            MH LEGAL provides flexible operational support and business solutions that evolve with your enterprise. We do not impose rigid frameworks; we integrate and adapt to drive efficiency.
          </motion.p>
        </div>
      </section>

      {/* Core Offering Block */}
      <section className="py-24 bg-white text-black border-b border-zinc-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-8">
              Business Solutions & Support is our <span className="text-accent">core offering.</span>
            </h2>
            <div className="w-full h-[1px] bg-zinc-200 mb-8"></div>
            <p className="text-xl font-medium text-gray-600 leading-relaxed">
              We recognize that every business possesses unique operational DNA. Our mandate is to analyze your structural needs and deploy targeted solutions—whether that means managing a dealership desk, optimizing sales pipelines, or providing trained personnel to reinforce your team.
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
              <Settings className="w-10 h-10 text-black group-hover:text-accent transition-colors mb-6" />
              <h3 className="text-2xl font-serif font-bold mb-4">Operational Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive day-to-day operations assistance. From specialized dealership desk management to implementing robust workflow systems, we ensure the administrative engine of your business runs flawlessly.
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
              <h3 className="text-2xl font-serif font-bold mb-4">Business Development</h3>
              <p className="text-gray-600 leading-relaxed">
                Strategic systems thinking applied to commercial growth. We help businesses identify new market opportunities, unlock latent revenue streams, and build the pipelines necessary to scale sustainably.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-10 border border-zinc-100 hover:border-accent/50 transition-colors group"
            >
              <Users className="w-10 h-10 text-black group-hover:text-accent transition-colors mb-6" />
              <h3 className="text-2xl font-serif font-bold mb-4">Staffing Solutions</h3>
              <p className="text-gray-600 leading-relaxed">
                Providing capable human capital directly from our rigorous In-Service Training program. We place well-trained, motivated individuals into client teams to execute systems and drive results.
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
            <p className="text-gray-400 max-w-2xl">A systematic methodology for engaging with and optimizing enterprise operations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Discover", desc: "We conduct a thorough audit of your existing processes, personnel, and operational bottlenecks to define the scope of required support." },
              { step: "02", title: "Design", desc: "We engineer customized solutions—whether deploying new desk management protocols or strategizing business development frameworks." },
              { step: "03", title: "Deploy", desc: "We integrate directly into your operations, executing the designed systems alongside your team and providing ongoing adjustments as needed." }
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