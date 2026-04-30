import { useSeo } from "@/hooks/use-seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { motion } from "framer-motion";
import { PartnershipCTA } from "@/components/sections/PartnershipCTA";
import { siteConfig } from "@/lib/site-config";
import { Linkedin, Mail } from "lucide-react";

export default function About() {
  useSeo({
    title: "About Us | Philosophy & Vision",
    description: "MH LEGAL is a multi-disciplinary professional services firm in South Africa. Led by Managing Director Philani Mbooi, we build operational systems and develop the people who run them."
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
            A Multi-Disciplinary <br /><span className="text-gray-500 font-light italic">Professional Services Firm.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-xl text-gray-400 max-w-2xl font-light leading-relaxed"
          >
            MH LEGAL exists at the intersection of structured systems and capable people. We help South African businesses operate with discipline, scale with intent, and develop the talent required to sustain both.
          </motion.p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 md:py-32 bg-white text-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            <div className="lg:col-span-5">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8 leading-tight">
                Systems Thinking Applied to Real Businesses.
              </h2>
              <div className="w-full h-[1px] bg-zinc-200 mb-8"></div>
              <p className="text-xl font-medium text-black leading-relaxed">
                We saw a recurring pattern across South African enterprises: businesses treat operations, compliance, and people as separate obstacles rather than parts of a single, structural foundation.
              </p>
            </div>
            <div className="lg:col-span-7 space-y-8 text-gray-600 leading-relaxed">
              <p>
                MH LEGAL was founded on a singular premise: a business cannot scale effectively on fragile operational infrastructure. Reactive problem-solving creates noise; proactive systems create capacity. We engineer the latter.
              </p>
              <p>
                Our methodology bridges the gap between strategy and day-to-day execution. By auditing your existing processes, we identify vulnerabilities and implement structured frameworks that protect assets, sharpen compliance, and streamline operations across the business.
              </p>
              <p>
                However, systems are inert without competent execution. This is why our dual mandate—<strong className="text-black font-semibold">We Build Systems. We Develop People.</strong>—is inseparable. Through rigorous in-service training, we align your workforce with the operating models we put in place, ensuring sustainable implementation long after the engagement.
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
            <p className="text-gray-600">The operating tenets that govern our engagements and shape how we work alongside the businesses we serve.</p>
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

      {/* Leadership */}
      <section className="py-24 md:py-32 bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent opacity-5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-12 bg-accent"></div>
                <span className="text-accent uppercase tracking-widest text-sm font-semibold">Leadership</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-6">
                The Team Steering <br /><span className="text-gray-500 font-light italic">the Firm.</span>
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Leadership at MH LEGAL is hands-on. We work shoulder-to-shoulder with the businesses we partner with — present in the detail, accountable to the outcome.
              </p>
            </div>

            <div className="lg:col-span-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-zinc-900/60 border border-zinc-800 hover:border-accent/50 transition-colors p-10 md:p-12"
              >
                <div className="flex flex-col md:flex-row gap-10 items-start">
                  <div className="shrink-0">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-accent/30 to-zinc-800 border border-accent/40 flex items-center justify-center">
                      <span className="font-serif text-4xl md:text-5xl font-bold text-accent">PM</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-accent uppercase tracking-widest text-xs font-semibold">{siteConfig.leadership.managingDirector.title}</span>
                    <h3 className="text-3xl md:text-4xl font-serif font-bold mt-3 mb-6">
                      {siteConfig.leadership.managingDirector.name}
                    </h3>
                    <div className="w-12 h-[2px] bg-accent mb-6"></div>
                    <p className="text-gray-400 leading-relaxed mb-4">
                      Philani Mbooi leads MH LEGAL as Managing Director, setting the strategic direction of the firm and overseeing every major engagement. His focus is straightforward: build operational systems that hold up under pressure, and develop the people who run them day to day.
                    </p>
                    <p className="text-gray-400 leading-relaxed mb-8">
                      Under his leadership, MH LEGAL has grown into a multi-disciplinary professional services firm trusted by corporates, SMEs, and growth-stage enterprises across South Africa.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <a 
                        href={`mailto:${siteConfig.contact.email}`} 
                        className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-accent transition-colors border border-zinc-700 hover:border-accent px-4 py-2"
                      >
                        <Mail size={14} />
                        Contact the MD
                      </a>
                      <a 
                        href={siteConfig.contact.whatsappUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-accent transition-colors border border-zinc-700 hover:border-accent px-4 py-2"
                      >
                        <Linkedin size={14} />
                        Connect on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <PartnershipCTA />
    </SiteLayout>
  );
}
