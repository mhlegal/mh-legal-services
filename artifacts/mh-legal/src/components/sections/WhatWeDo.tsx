import { motion } from "framer-motion";
import { ShieldCheck, TrendingUp, Cog, GraduationCap } from "lucide-react";
import { Link } from "wouter";

const services = [
  {
    title: "Insurance Brokerage",
    description: "Tailored insurance brokerage that protects what your business has built. We match clients to the right cover, manage the relationship, and turn insurance into a strategic advantage rather than an afterthought.",
    icon: <ShieldCheck className="w-8 h-8" />,
    link: "/services"
  },
  {
    title: "Sales Operations",
    description: "Structured sales management that converts effort into measurable revenue. We build pipelines, sharpen processes, and embed the discipline that high-performing sales teams need to scale.",
    icon: <TrendingUp className="w-8 h-8" />,
    link: "/services"
  },
  {
    title: "Business Solutions",
    description: "Practical, growth-oriented business solutions — operating procedures, administrative systems, and frameworks that move enterprises from reactive to proactive.",
    icon: <Cog className="w-8 h-8" />,
    link: "/services"
  },
  {
    title: "In-Service Training",
    description: "We grow the next generation of business leaders. Business Management students embed inside our sales and brokerage teams to gain real commercial experience under real pressure.",
    icon: <GraduationCap className="w-8 h-8" />,
    link: "/training"
  }
];

export function WhatWeDo() {
  return (
    <section className="py-24 md:py-32 bg-white text-black relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 lg:mb-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-accent"></div>
              <span className="text-accent uppercase tracking-widest text-sm font-semibold">Service Pillars</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
              Building Businesses. <span className="text-gray-400 font-light italic">Building Careers.</span>
            </h2>
          </div>
          <p className="text-gray-600 max-w-md md:text-right leading-relaxed">
            MH LEGAL is a brokerage firm with a wider mandate. We sell insurance, run high-performing sales operations, and build business solutions — and we develop the people who deliver them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col h-full"
            >
              <div className="mb-6 text-black group-hover:text-accent transition-colors duration-300">
                {service.icon}
              </div>
              <div className="w-8 h-[2px] bg-black mb-6 group-hover:bg-accent transition-colors duration-300"></div>
              <h3 className="text-xl font-bold font-serif mb-4">{service.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-grow">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
