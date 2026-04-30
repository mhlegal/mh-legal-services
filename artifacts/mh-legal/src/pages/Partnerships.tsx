import { useSeo } from "@/hooks/use-seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { motion } from "framer-motion";
import { Handshake, Building2, School, CheckCircle2, MessageSquare, Cog, UserPlus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { siteConfig } from "@/lib/site-config";

export default function Partnerships() {
  useSeo({
    title: "Partnerships | Collaborate With Us",
    description: "Partner with MH LEGAL. We provide scalable business solutions, operational assistance, and trained personnel to support your corporate growth."
  });

  return (
    <SiteLayout>
      {/* Page Header */}
      <section className="bg-black text-white pt-32 pb-20 md:pt-48 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-80"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-[1px] w-12 bg-accent"></div>
            <span className="text-accent uppercase tracking-widest text-sm font-semibold">Partnerships</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold leading-tight"
          >
            Partner With <br /><span className="text-gray-500 font-light italic">MH LEGAL.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-xl text-gray-400 max-w-2xl font-light leading-relaxed"
          >
            We view our clients as partners. By opening doors to long-term collaboration, we align our strategic expertise and human capital directly with your commercial objectives.
          </motion.p>
        </div>
      </section>

      {/* Who We Work With */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Who We Work With</h2>
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
              We collaborate with forward-thinking enterprises that recognize the value of robust operational frameworks and invested human capital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Building2 className="w-8 h-8" />, title: "Corporate Clients", desc: "Established organizations looking to tighten administrative systems, governance, and operational discipline." },
              { icon: <TrendingUp className="w-8 h-8" />, title: "SMEs", desc: "Small to medium businesses requiring structured operational scaling and reliable back-office support." },
              { icon: <Cog className="w-8 h-8" />, title: "Growth Companies", desc: "Enterprises focused on improving operational efficiency, sales execution, and team capacity." },
              { icon: <School className="w-8 h-8" />, title: "Training Institutions", desc: "Colleges seeking professional placement environments and structured in-service experiences for their students." }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-zinc-50 p-8 border border-zinc-200 hover:border-accent/50 transition-colors group"
              >
                <div className="mb-6 text-black group-hover:text-accent transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements & Expectations */}
      <section className="py-24 bg-zinc-50 border-y border-zinc-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            
            {/* Basic Requirements */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-serif font-bold mb-8 flex items-center gap-4">
                <div className="w-2 h-8 bg-black"></div>
                Basic Requirements
              </h3>
              <ul className="space-y-4">
                {[
                  "Registered business or recognized operating entity",
                  "A clear, identifiable operational need (sales, staffing, systems, etc.)",
                  "An executive team open to collaboration and external strategic support"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-gray-700 leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* What We Expect */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-2xl font-serif font-bold mb-8 flex items-center gap-4">
                <div className="w-2 h-8 bg-accent"></div>
                What We Expect
              </h3>
              <ul className="space-y-4">
                {[
                  "Clear, transparent communication regarding business challenges",
                  "A defined problem statement or strategic objective",
                  "Genuine willingness to implement recommended solutions",
                  "A highly professional working relationship"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-black shrink-0 mt-0.5" />
                    <span className="text-gray-700 leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Partnership Models */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Partnership Models</h2>
            <p className="text-gray-600 text-lg">We offer distinct avenues of collaboration, each designed to integrate seamlessly with your corporate structure.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-black text-white p-10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <Cog className="w-10 h-10 text-accent mb-6" />
              <h3 className="text-2xl font-serif font-bold mb-4">Service-Based</h3>
              <p className="text-gray-400 leading-relaxed">
                Direct intervention. We assist with your business operations, auditing current workflows and implementing resilient administrative or legal systems.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-accent text-black p-10 shadow-lg relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <UserPlus className="w-10 h-10 text-black mb-6" />
              <h3 className="text-2xl font-serif font-bold mb-4">Placement-Based</h3>
              <p className="text-zinc-800 font-medium leading-relaxed">
                Human capital augmentation. We provide capable, trained individuals from our In-Service program to directly reinforce your teams and execute operational tasks.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-black text-white p-10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <Handshake className="w-10 h-10 text-accent mb-6" />
              <h3 className="text-2xl font-serif font-bold mb-4">Growth Partnerships</h3>
              <p className="text-gray-400 leading-relaxed">
                Comprehensive, long-term strategic collaboration. We align our systems architecture and talent development fully with your enterprise's expansion goals.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What MH LEGAL Provides & Onboarding */}
      <section className="py-24 bg-zinc-50 border-t border-zinc-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            <div>
              <h2 className="text-3xl font-serif font-bold mb-8">What We Bring to the Table</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white border border-zinc-200 flex items-center justify-center shrink-0">
                    <span className="font-serif font-bold text-accent">01</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Business Support Solutions</h4>
                    <p className="text-gray-600">Actionable interventions designed to stabilize and grow corporate entities.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white border border-zinc-200 flex items-center justify-center shrink-0">
                    <span className="font-serif font-bold text-accent">02</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Targeted Operational Assistance</h4>
                    <p className="text-gray-600">Specialized oversight across administrative workflows, sales pipelines, and recurring back-office functions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white border border-zinc-200 flex items-center justify-center shrink-0">
                    <span className="font-serif font-bold text-accent">03</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Trained Personnel Access</h4>
                    <p className="text-gray-600">Direct integration of driven individuals sourced from our rigorous training initiative.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white border border-zinc-200 flex items-center justify-center shrink-0">
                    <span className="font-serif font-bold text-accent">04</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Scalable Flexibility</h4>
                    <p className="text-gray-600">Operational support dynamically shaped to match your evolving business requirements.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 md:p-12 border border-zinc-200">
              <h3 className="text-2xl font-serif font-bold mb-6 text-black">Onboarding Protocol</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                When you initiate contact regarding a partnership, our team requires baseline context to assess the scope of the engagement. Please prepare:
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-black font-medium border-b border-zinc-100 pb-3">
                  <div className="w-2 h-2 bg-accent"></div>
                  A brief description of your enterprise
                </li>
                <li className="flex items-center gap-3 text-black font-medium border-b border-zinc-100 pb-3">
                  <div className="w-2 h-2 bg-accent"></div>
                  Current operational challenges or objectives
                </li>
                <li className="flex items-center gap-3 text-black font-medium border-b border-zinc-100 pb-3">
                  <div className="w-2 h-2 bg-accent"></div>
                  The preferred model of support
                </li>
                <li className="flex items-center gap-3 text-black font-medium pb-3">
                  <div className="w-2 h-2 bg-accent"></div>
                  Primary contact person details
                </li>
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="flex-1 bg-black text-white hover:bg-accent hover:text-black rounded-none h-14 font-semibold transition-colors">
                  <Link href="/contact">Partner With Us</Link>
                </Button>
                <Button asChild className="flex-1 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-none h-14 font-semibold transition-colors flex items-center justify-center gap-2">
                  <a href={siteConfig.contact.whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageSquare size={18} />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

    </SiteLayout>
  );
}