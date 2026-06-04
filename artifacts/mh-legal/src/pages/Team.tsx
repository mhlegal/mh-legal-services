import { useSeo } from "@/hooks/use-seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { motion } from "framer-motion";
import { PartnershipCTA } from "@/components/sections/PartnershipCTA";
import { siteConfig } from "@/lib/site-config";
import { Mail } from "lucide-react";

export default function Team() {
  useSeo({
    title: "Our Team | MH LEGAL SERVICES Pty Ltd",
    description: "Meet the leadership and field management team at MH LEGAL SERVICES Pty Ltd — the people building, managing, and activating the firm's 100+ agent network."
  });

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-black text-white pt-32 pb-20 md:pt-48 md:pb-32 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent opacity-5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-[1px] w-12 bg-accent" />
            <span className="text-accent uppercase tracking-widest text-sm font-semibold">The People Behind the Firm</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold leading-tight"
          >
            Meet the <br /><span className="text-gray-500 font-light italic">Team.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-xl text-gray-400 max-w-2xl font-light leading-relaxed"
          >
            Leadership that is hands-on. Field managers who are in the work every day. A team built around accountability, performance, and the development of every person they lead.
          </motion.p>
        </div>
      </section>

      {/* Executive Leadership */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-accent" />
            <span className="text-accent uppercase tracking-widest text-sm font-semibold">Executive Leadership</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-16">Leadership Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {siteConfig.team.leadership.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div className="bg-black p-10 mb-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-accent/30 to-zinc-800 border border-accent/40 flex items-center justify-center mb-6">
                      <span className="font-serif text-2xl font-bold text-accent">{member.initials}</span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-accent text-sm font-semibold uppercase tracking-widest">{member.title}</p>
                  </div>
                </div>
                {idx === 0 && (
                  <p className="text-gray-600 text-sm leading-relaxed px-2">
                    Philani Mbooi founded MH LEGAL SERVICES Pty Ltd with a single goal: build a brokerage firm that develops the people inside it as aggressively as it grows the business. As MD, he sets strategy, leads the agent network, and oversees the in-service training programme directly.
                  </p>
                )}
                {idx === 1 && (
                  <p className="text-gray-600 text-sm leading-relaxed px-2">
                    Thulane David Phiri manages the operational backbone of the firm — ensuring that the agent network, sales operations, and compliance processes run with precision across all service lines.
                  </p>
                )}
                {idx === 2 && (
                  <p className="text-gray-600 text-sm leading-relaxed px-2">
                    Simangaliso Ngobese leads provincial operations across KwaZulu-Natal and Mpumalanga, coordinating field managers, activating markets, and maintaining the performance standards that define the firm's agent network.
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Field Managers */}
      <section className="py-24 bg-zinc-50 border-t border-zinc-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-accent" />
            <span className="text-accent uppercase tracking-widest text-sm font-semibold">Field Leadership</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Field Managers</h2>
          <p className="text-gray-600 max-w-xl mb-16 leading-relaxed">
            Our field managers are the operational heartbeat of the firm. They lead agents on the ground, run market activations, and maintain the performance standards that define our 100+ agent network.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteConfig.team.fieldManagers.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white border border-zinc-100 hover:border-accent/50 transition-colors p-8 group"
              >
                <div className="w-14 h-14 bg-zinc-100 group-hover:bg-black transition-colors flex items-center justify-center mb-6">
                  <span className="font-serif font-bold text-xl text-zinc-500 group-hover:text-accent transition-colors">{member.initials}</span>
                </div>
                <h3 className="text-xl font-serif font-bold mb-1">{member.name}</h3>
                <p className="text-accent text-xs font-semibold uppercase tracking-widest">{member.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join the Team */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 justify-center mb-8">
              <div className="h-[1px] w-12 bg-accent" />
              <span className="text-accent uppercase tracking-widest text-sm font-semibold">Join Us</span>
              <div className="h-[1px] w-12 bg-accent" />
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
              The Team Is Always Growing.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-10 font-light">
              Whether you are a Business Management student looking for in-service placement or a young professional seeking your first career opportunity — there is a path for you at MH LEGAL SERVICES Pty Ltd.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/careers"
                className="inline-flex items-center justify-center gap-2 bg-accent text-black hover:bg-white rounded-none h-14 px-10 text-base font-bold tracking-wide transition-all"
              >
                Apply for Training
              </a>
              <a
                href={`mailto:${siteConfig.contact.provincial}`}
                className="inline-flex items-center justify-center gap-2 border border-zinc-600 text-white hover:border-white rounded-none h-14 px-10 text-base font-semibold transition-all"
              >
                <Mail size={16} />
                Email the Provincial Manager
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <PartnershipCTA />
    </SiteLayout>
  );
}
