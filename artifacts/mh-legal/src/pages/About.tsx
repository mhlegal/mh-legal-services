import { useSeo } from "@/hooks/use-seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { motion } from "framer-motion";
import { PartnershipCTA } from "@/components/sections/PartnershipCTA";

export default function About() {
  useSeo({
    title: "About Us | Philosophy & Vision",
    description: "Discover how MH LEGAL applies systems thinking to legal and business operations for enterprise optimization."
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
            <span className="text-accent uppercase tracking-widest text-sm font-semibold">Corporate Identity</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold"
          >
            Beyond Traditional <br /><span className="text-gray-500 font-light italic">Legal Counsel.</span>
          </motion.h1>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 md:py-32 bg-white text-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            <div className="lg:col-span-5">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8 leading-tight">
                Systems Thinking Applied to Corporate Law.
              </h2>
              <div className="w-full h-[1px] bg-zinc-200 mb-8"></div>
              <p className="text-xl font-medium text-black leading-relaxed">
                We observed a critical failure in the corporate landscape: businesses treat legal requirements as isolated obstacles rather than structural foundations.
              </p>
            </div>
            <div className="lg:col-span-7 space-y-8 text-gray-600 leading-relaxed">
              <p>
                MH LEGAL was founded on a singular premise: a business cannot scale effectively on weak operational or legal infrastructure. Traditional law firms provide reactive solutions to immediate problems. We engineer proactive systems designed for durability and growth.
              </p>
              <p>
                Our methodology bridges the gap between legal theory and commercial reality. By auditing your existing processes, we identify vulnerabilities and implement structured frameworks that protect assets, ensure compliance, and streamline operations. 
              </p>
              <p>
                However, systems are inert without competent execution. This is why our dual mandate—<strong className="text-black font-semibold">We Build Systems. We Develop People.</strong>—is inseparable. Through rigorous in-service training, we align your workforce with the newly engineered operational models, ensuring sustainable implementation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-24 bg-zinc-50 border-t border-zinc-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Foundational Principles</h2>
            <p className="text-gray-600">The operational tenets that govern our engagements and dictate our approach to corporate consulting.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: "01",
                title: "Structural Integrity",
                desc: "We prioritize long-term stability over short-term fixes. Every contract, policy, and protocol is drafted to withstand corporate expansion and market volatility."
              },
              {
                number: "02",
                title: "Commercial Pragmatism",
                desc: "Legal frameworks must facilitate business, not hinder it. We balance rigorous compliance with the need for operational agility and speed to market."
              },
              {
                number: "03",
                title: "Human Capital Alignment",
                desc: "We invest in the personnel responsible for executing your systems. Comprehensive training ensures that strategic objectives are realized at every level of the organization."
              }
            ].map((principle, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-10 border border-zinc-100 hover:border-accent/50 transition-colors group"
              >
                <div className="text-4xl font-serif text-zinc-200 group-hover:text-accent transition-colors font-bold mb-6">{principle.number}</div>
                <h3 className="text-xl font-bold mb-4">{principle.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{principle.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PartnershipCTA />
    </SiteLayout>
  );
}
