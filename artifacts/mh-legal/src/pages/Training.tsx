import { useSeo } from "@/hooks/use-seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { motion } from "framer-motion";
import { CheckCircle2, GraduationCap, Briefcase, Award, MessageSquare, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { siteConfig } from "@/lib/site-config";

export default function Training() {
  useSeo({
    title: "In-Service Training | Talent Development",
    description: "We develop talent while building businesses. Join our In-Service Training program to gain real-world business and sales experience."
  });

  return (
    <SiteLayout>
      {/* Page Header */}
      <section className="bg-black text-white pt-32 pb-20 md:pt-48 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-80"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-[1px] w-12 bg-accent"></div>
            <span className="text-accent uppercase tracking-widest text-sm font-semibold">In-Service Training</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold leading-tight"
          >
            We Develop Talent While <br /><span className="text-gray-500 font-light italic">Building Businesses.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-xl text-gray-400 max-w-2xl font-light leading-relaxed"
          >
            A rigorous program designed to embed ambitious students into active corporate environments. We bridge the gap between academic theory and commercial execution.
          </motion.p>
        </div>
      </section>

      {/* What It Is */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Program Overview</h2>
              <div className="w-20 h-[2px] bg-accent mb-8"></div>
            </div>
            <div className="lg:col-span-7">
              <p className="text-xl text-gray-600 leading-relaxed">
                The MH LEGAL In-Service Training program is an immersive initiative that provides real-world business and sales experience for Business Management students and related disciplines. Participants are not sidelined with administrative tasks; they are embedded within a working professional services firm, gaining direct exposure to operational scaling and client engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements & Qualities */}
      <section className="py-24 bg-zinc-50 border-y border-zinc-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            
            {/* Basic Requirements */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-white flex items-center justify-center border border-zinc-200">
                  <GraduationCap className="text-accent" />
                </div>
                <h3 className="text-2xl font-serif font-bold">Basic Requirements</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Currently studying or completed Business Management (or related field)",
                  "Based in South Africa",
                  "Valid South African ID",
                  "Access to a smartphone and reliable internet"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-gray-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Preferred Qualities */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-white flex items-center justify-center border border-zinc-200">
                  <Award className="text-accent" />
                </div>
                <h3 className="text-2xl font-serif font-bold">Preferred Qualities</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Strong communication and articulation skills",
                  "Confidence when speaking with corporate clients",
                  "Basic understanding of sales pipelines or business operations",
                  "A highly professional attitude and demeanor",
                  "Genuine willingness to learn, adapt, and grow"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-gray-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Expectations vs Offerings */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            <div className="bg-black text-white p-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <Briefcase className="w-10 h-10 text-accent mb-6" />
              <h3 className="text-2xl font-serif font-bold mb-6">Role Expectations</h3>
              <div className="space-y-6">
                <p className="text-gray-400 font-light border-b border-zinc-800 pb-4">Participate actively in sales initiatives and business development activities.</p>
                <p className="text-gray-400 font-light border-b border-zinc-800 pb-4">Represent MH LEGAL with the highest degree of professionalism.</p>
                <p className="text-gray-400 font-light border-b border-zinc-800 pb-4">Work alongside the executive team to generate tangible business opportunities.</p>
                <p className="text-gray-400 font-light">Learn and apply real business operations in a high-stakes environment.</p>
              </div>
            </div>

            <div className="bg-zinc-100 text-black p-12 border border-zinc-200 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="w-10 h-10 bg-black flex items-center justify-center mb-6">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-6">What We Offer</h3>
              <div className="space-y-6">
                <p className="text-gray-600 font-medium border-b border-zinc-300 pb-4">Unfiltered real-world business and sales experience.</p>
                <p className="text-gray-600 font-medium border-b border-zinc-300 pb-4">The opportunity to formally join the MH LEGAL sales team.</p>
                <p className="text-gray-600 font-medium border-b border-zinc-300 pb-4">Direct exposure to live corporate partnerships and operational ecosystems.</p>
                <p className="text-gray-600 font-medium">Potential long-term placement within our network based on performance metrics.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How To Apply / CTA */}
      <section className="py-24 bg-black border-t-4 border-accent text-center relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-8">Ready to Advance Your Career?</h2>
            <p className="text-gray-400 text-lg mb-12">
              Applications are currently open. When reaching out, please ensure you include a short introduction, details of your current studies, your motivation for joining MH LEGAL, and your contact information.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent text-black hover:bg-white hover:text-black rounded-none h-14 px-8 text-base font-semibold transition-all">
                <Link href="/contact">Apply via Contact Form</Link>
              </Button>
              <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#1DA851] text-white rounded-none h-14 px-8 text-base font-semibold transition-all flex items-center gap-2">
                <a href={siteConfig.contact.whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageSquare size={18} />
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </SiteLayout>
  );
}