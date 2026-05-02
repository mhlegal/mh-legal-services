import { motion } from "framer-motion";
import { ShieldCheck, Megaphone, TrendingUp, GraduationCap, BookOpen, FileCheck } from "lucide-react";
import { Link } from "wouter";

const services = [
  {
    title: "Product Distribution",
    description: "Structured distribution of insurance and financial products across KwaZulu-Natal through a network of 100+ trained, licensed agents.",
    icon: <ShieldCheck className="w-7 h-7" />,
  },
  {
    title: "Market Activation",
    description: "On-the-ground market activation strategies that open new territories, reach untapped client segments, and generate pipeline at scale.",
    icon: <Megaphone className="w-7 h-7" />,
  },
  {
    title: "Sales Representation",
    description: "Professional sales representation with full accountability — KPIs, reporting, and a disciplined cadence that converts activity into revenue.",
    icon: <TrendingUp className="w-7 h-7" />,
  },
  {
    title: "Agent Training",
    description: "Rigorous training for new and existing agents covering product knowledge, compliance standards, and high-performance sales technique.",
    icon: <GraduationCap className="w-7 h-7" />,
  },
  {
    title: "In-Service Training",
    description: "Business Management students are embedded directly in our sales and brokerage operations — gaining real commercial experience in a live corporate environment.",
    icon: <BookOpen className="w-7 h-7" />,
  },
  {
    title: "Compliance Management",
    description: "End-to-end compliance oversight ensuring agents, policies, and operations remain fully aligned with FSCA and industry regulatory requirements.",
    icon: <FileCheck className="w-7 h-7" />,
  },
];

export function WhatWeDo() {
  return (
    <section id="what-we-do" className="py-16 md:py-20 bg-white text-black relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 lg:mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-accent" />
              <span className="text-accent uppercase tracking-widest text-sm font-semibold">What We Do</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
              Six Service Lines. <span className="text-gray-400 font-light italic">One Focused Firm.</span>
            </h2>
          </div>
          <p className="text-gray-600 max-w-sm md:text-right leading-relaxed">
            From product distribution and agent training to compliance management and in-service development — every service line works together.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group flex flex-col p-8 border border-zinc-100 hover:border-accent/60 hover:shadow-lg transition-all duration-300"
            >
              <div className="mb-5 text-black group-hover:text-accent transition-colors duration-300">
                {service.icon}
              </div>
              <div className="w-8 h-[2px] bg-black mb-5 group-hover:bg-accent transition-colors duration-300" />
              <h3 className="text-lg font-bold font-serif mb-3">{service.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-grow">{service.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/services">
            <span className="text-sm font-semibold uppercase tracking-widest text-accent hover:underline cursor-pointer">
              View Full Services →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
