import { motion } from "framer-motion";
import { Scale, Users, Handshake, Cog } from "lucide-react";
import { Link } from "wouter";

const services = [
  {
    title: "Business Solutions",
    description: "Structured frameworks, policies, and processes that move from reactive problem-solving to proactive systems. Built to scale with your enterprise, not slow it down.",
    icon: <Scale className="w-8 h-8" />,
    link: "/contact"
  },
  {
    title: "In-Service Training",
    description: "Your systems are only as robust as the people executing them. We develop comprehensive training programs that align workforce capabilities with strategic objectives.",
    icon: <Users className="w-8 h-8" />,
    link: "/contact"
  },
  {
    title: "Strategic Partnerships",
    description: "We do not merely advise; we integrate. By partnering with executive teams, we align operational strategy directly with commercial viability and growth objectives.",
    icon: <Handshake className="w-8 h-8" />,
    link: "/contact"
  },
  {
    title: "Operational Efficiency",
    description: "Identifying friction points across day-to-day operations and implementing precise, structured processes that enhance productivity and reduce institutional risk.",
    icon: <Cog className="w-8 h-8" />,
    link: "/contact"
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
              Engineering <span className="text-gray-400 font-light italic">Scalability</span>
            </h2>
          </div>
          <p className="text-gray-600 max-w-md md:text-right leading-relaxed">
            MH LEGAL is a multi-disciplinary professional services firm. We blend operational know-how, business strategy, and people development to give growing enterprises a structural advantage.
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
