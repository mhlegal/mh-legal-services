import { useSeo } from "@/hooks/use-seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { motion } from "framer-motion";
import { PartnershipCTA } from "@/components/sections/PartnershipCTA";
import { ShieldCheck, Megaphone, TrendingUp, GraduationCap, BookOpen, FileCheck, ArrowRight } from "lucide-react";

const services = [
  {
    icon: <ShieldCheck className="w-10 h-10" />,
    title: "Product Distribution",
    description: "We distribute insurance and financial products across KwaZulu-Natal through a licensed network of 100+ agents. Our distribution model is structured for reach, accountability, and compliance — built to get the right products in front of the right clients at scale.",
    points: [
      "Structured distribution across KZN communities",
      "100+ licensed, trained agent network",
      "Full policy lifecycle management",
    ]
  },
  {
    icon: <Megaphone className="w-10 h-10" />,
    title: "Market Activation",
    description: "We identify and open new markets — reaching client segments that conventional brokerage rarely activates. Our on-the-ground teams run targeted activations, build pipeline, and establish the firm's presence in new territories with speed and professionalism.",
    points: [
      "Territory scoping and market entry strategy",
      "On-ground activation campaigns",
      "Pipeline generation and lead qualification",
    ]
  },
  {
    icon: <TrendingUp className="w-10 h-10" />,
    title: "Sales Representation",
    description: "Professional sales representation with full accountability. We manage KPIs, maintain reporting cadence, and convert client-facing activity into measurable revenue. Our sales reps are trained, compliant, and supported by an active management structure.",
    points: [
      "KPI-driven sales management",
      "Structured reporting and performance tracking",
      "Revenue conversion accountability",
    ]
  },
  {
    icon: <GraduationCap className="w-10 h-10" />,
    title: "Agent Training",
    description: "Rigorous training for new and existing agents covering product knowledge, sales methodology, compliance standards, and client relationship management. Trained agents perform better, stay longer, and represent the firm with greater professionalism.",
    points: [
      "Product knowledge and FSCA compliance training",
      "High-performance sales technique",
      "Client relationship and retention skills",
    ]
  },
  {
    icon: <BookOpen className="w-10 h-10" />,
    title: "In-Service Training",
    description: "Business Management students from Mthashana TVET College are embedded directly in our sales and brokerage operations. They gain real commercial experience in a live, regulated environment — not a simulation. Applications open to qualifying students.",
    points: [
      "In-partnership with Mthashana TVET College",
      "Embedded inside live sales and brokerage teams",
      "Structured progression with field manager oversight",
    ]
  },
  {
    icon: <FileCheck className="w-10 h-10" />,
    title: "Compliance Management",
    description: "End-to-end compliance oversight that keeps our agents, policies, and operations fully aligned with FSCA requirements and industry standards. Compliance is not an afterthought — it is built into every service line we operate.",
    points: [
      "FSCA regulatory alignment",
      "Policy and agent compliance auditing",
      "Ongoing compliance monitoring and reporting",
    ]
  },
];

export default function Services() {
  useSeo({
    title: "Our Services | MHLOPHE HOLDINGS LEGAL SERVICES",
    description: "Six focused service lines: Product Distribution, Market Activation, Sales Representation, Agent Training, In-Service Training, and Compliance Management."
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
            <span className="text-accent uppercase tracking-widest text-sm font-semibold">What We Do</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold leading-tight"
          >
            Six Service Lines. <br /><span className="text-gray-500 font-light italic">One Focused Firm.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-xl text-gray-400 max-w-2xl font-light leading-relaxed"
          >
            From product distribution and market activation to compliance management and in-service training — every service line is built around the same mandate: grow the business, develop the people.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: (idx % 2) * 0.1 }}
                className="group border border-zinc-100 p-10 hover:border-accent/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-black group-hover:text-accent transition-colors mb-6">
                  {service.icon}
                </div>
                <div className="w-10 h-[2px] bg-zinc-200 group-hover:bg-accent transition-colors mb-6" />
                <h3 className="text-2xl font-serif font-bold mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-8">{service.description}</p>
                <ul className="space-y-3">
                  {service.points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <ArrowRight size={14} className="text-accent shrink-0 mt-0.5" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent opacity-5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-accent" />
              <span className="text-accent uppercase tracking-widest text-sm font-semibold">Our Approach</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">How We Work</h2>
            <p className="text-gray-400 max-w-2xl">
              A focused three-phase methodology — from understanding the opportunity to deploying agents and services that produce results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Assess", desc: "We map the market opportunity, identify distribution gaps, and assess the compliance posture. Whether it's a new territory or a new client segment, we start with clarity." },
              { step: "02", title: "Deploy", desc: "We activate our service lines — agents, sales reps, market activators — with a structured plan, defined KPIs, and full accountability at every level of the operation." },
              { step: "03", title: "Develop", desc: "We embed our training programs alongside the work. Agents improve. In-service trainees progress. The firm's output compound over time." }
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

      <PartnershipCTA />
    </SiteLayout>
  );
}
