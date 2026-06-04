import { motion } from "framer-motion";
import { ShieldCheck, Megaphone, TrendingUp, GraduationCap, BookOpen, FileCheck, Shield, Gavel, FileText, CreditCard, Scale } from "lucide-react";
import { Link } from "wouter";

const services = [
  { title: "Legal Cover", blurb: "R200,000 legal benefit pool — criminal, civil, and family cover.", icon: <Shield className="w-6 h-6" />, tag: "Legal" },
  { title: "CCMA & Labour Law", blurb: "Expert representation for unfair dismissals and wage disputes.", icon: <Gavel className="w-6 h-6" />, tag: "Legal" },
  { title: "Contract Drafting", blurb: "Watertight SLAs, leases, and employment contracts.", icon: <FileText className="w-6 h-6" />, tag: "Legal" },
  { title: "Debt Collection", blurb: "Professional recovery on amounts from R15,000 and above.", icon: <CreditCard className="w-6 h-6" />, tag: "Legal" },
  { title: "Civil Rights", blurb: "Constitutional protection against discrimination and injustice.", icon: <Scale className="w-6 h-6" />, tag: "Legal" },
  { title: "Product Distribution", blurb: "Insurance products delivered through 100+ licensed agents across all 9 provinces.", icon: <ShieldCheck className="w-6 h-6" />, tag: "Business" },
  { title: "Market Activation", blurb: "Opening new territories and reaching untapped client bases.", icon: <Megaphone className="w-6 h-6" />, tag: "Business" },
  { title: "Sales Representation", blurb: "KPI-driven sales with full accountability from pipeline to close.", icon: <TrendingUp className="w-6 h-6" />, tag: "Business" },
  { title: "Agent Training", blurb: "Product knowledge, compliance, and high-performance technique.", icon: <GraduationCap className="w-6 h-6" />, tag: "Business" },
  { title: "In-Service Training", blurb: "Students embedded in live brokerage operations from day one.", icon: <BookOpen className="w-6 h-6" />, tag: "Business" },
  { title: "Compliance Management", blurb: "Full FSCA oversight — no shortcuts, no exceptions.", icon: <FileCheck className="w-6 h-6" />, tag: "Business" },
];

export function WhatWeDo() {
  return (
    <section id="what-we-do" className="py-16 md:py-20 bg-white text-black relative">
      <div className="container mx-auto px-4 md:px-8">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-accent" />
              <span className="text-accent uppercase tracking-widest text-sm font-semibold">What We Do</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
              Legal. Business. <span className="text-gray-400 font-light italic">All Under One Roof.</span>
            </h2>
          </div>
          <p className="text-gray-500 max-w-xs leading-relaxed text-sm">
            From constitutional rights to compliance management — one firm, every service you need.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group flex flex-col p-6 border border-zinc-100 hover:border-accent/50 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-black group-hover:text-accent transition-colors duration-300">
                  {service.icon}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 ${
                  service.tag === "Legal"
                    ? "bg-accent/10 text-accent"
                    : "bg-zinc-100 text-zinc-500"
                }`}>
                  {service.tag}
                </span>
              </div>
              <h3 className="text-base font-bold font-serif mb-2 leading-snug">{service.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{service.blurb}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between border-t border-zinc-100 pt-8">
          <p className="text-sm text-gray-400">Explore each service in detail on our dedicated pages.</p>
          <div className="flex gap-6">
            <Link href="/legal-services">
              <span className="text-sm font-semibold uppercase tracking-widest text-accent hover:underline cursor-pointer">
                Legal Services →
              </span>
            </Link>
            <Link href="/services">
              <span className="text-sm font-semibold uppercase tracking-widest text-zinc-400 hover:text-black hover:underline cursor-pointer">
                Business Services →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
