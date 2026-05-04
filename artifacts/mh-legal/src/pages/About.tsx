import { useSeo } from "@/hooks/use-seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { motion } from "framer-motion";
import { PartnershipCTA } from "@/components/sections/PartnershipCTA";
import { siteConfig } from "@/lib/site-config";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Users, Award, MapPin } from "lucide-react";

export default function About() {
  useSeo({
    title: "About Us | MH LEGAL SERVICES Pty Ltd",
    description: "MH LEGAL SERVICES Pty Ltd is a corporate insurance brokerage with 100+ agents across all 9 provinces of South Africa — bridging education and employment through structured in-service training with a stipend for Business Management students."
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
            <span className="text-accent uppercase tracking-widest text-sm font-semibold">Who We Are</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold leading-tight"
          >
            A Corporate Insurance <br />
            <span className="text-gray-500 font-light italic">Brokerage Built to Last.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-xl text-gray-400 max-w-2xl font-light leading-relaxed"
          >
            Headquartered in Durban, MH LEGAL SERVICES Pty Ltd operates a network of 100+ licensed agents across all 9 provinces of South Africa. We distribute products, activate markets, develop talent, and build the compliance infrastructure that holds it all together.
          </motion.p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-accent py-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "100+", label: "Agents Nationwide" },
              { value: "6", label: "Service Lines" },
              { value: "TVET", label: "Student Placements" },
              { value: "9", label: "Provinces Covered" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-serif font-bold text-black">{s.value}</div>
                <div className="text-xs text-black/70 uppercase tracking-widest mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-24 md:py-32 bg-white text-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            <div className="lg:col-span-5">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8 leading-tight">
                Brokerage at the Core. People at the Heart.
              </h2>
              <div className="w-full h-[1px] bg-zinc-200 mb-8" />
              <p className="text-xl font-medium text-black leading-relaxed">
                We are not just a brokerage that sells policies. We are a firm that builds commercial capacity — in every engagement, every partnership, and every training placement.
              </p>
            </div>
            <div className="lg:col-span-7 space-y-6 text-gray-600 leading-relaxed text-base">
              <p>
                MH LEGAL SERVICES Pty Ltd is a corporate insurance brokerage headquartered in Durban, KwaZulu-Natal, with a licensed agent network operating across all 9 provinces of South Africa. Our agents are deployed in every province, extending the firm's reach into communities and markets that traditional brokerage operations rarely serve.
              </p>
              <p>
                Our business is built on six service lines — Product Distribution, Market Activation, Sales Representation, Agent Training, In-Service Training, and Compliance Management. Each line supports the others. Trained agents distribute products. Market activation generates new pipeline. Compliance management keeps the entire operation above board.
              </p>
              <p>
                We operate as a <strong className="text-black">bridge between education and employment</strong>. Business Management students from recognised TVET Colleges and institutions are welcomed into our firm for structured in-service training — embedded inside live sales and brokerage teams, supported by a monthly stipend, and mentored by experienced field managers from day one.
              </p>
              <p>
                Our mandate is straightforward: <strong className="text-black">We Build Systems. We Develop People.</strong> Every operational decision and every training placement is an expression of that commitment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Education & Employment Bridge */}
      <section className="py-24 bg-zinc-50 border-t border-zinc-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-12 bg-accent" />
                <span className="text-accent uppercase tracking-widest text-sm font-semibold">Education Meets Employment</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight">
                A Bridge Between the Classroom and the Commercial World.
              </h2>
              <p className="text-gray-600 leading-relaxed">
                MH LEGAL SERVICES Pty Ltd actively welcomes Business Management students from recognised TVET Colleges and tertiary institutions across South Africa. We believe that the gap between academic training and real-world employment should not be a barrier — it should be a bridge, and we are that bridge.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Qualifying students are embedded inside our live sales and brokerage teams, supported by a monthly stipend for the full duration of their placement, and mentored by experienced field managers. You do not observe our operation — you become part of it.
              </p>
              <Button asChild className="bg-black text-white hover:bg-accent hover:text-black rounded-none h-12 px-8 font-bold transition-all">
                <Link href="/careers">Apply for In-Service Training</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {[
                { icon: <Users className="w-5 h-5 text-accent" />, title: "Embedded in Live Teams", desc: "Students join active sales and brokerage teams — not simulations. Every day is a real commercial operation with real clients and real stakes." },
                { icon: <Award className="w-5 h-5 text-accent" />, title: "Monthly Stipend Included", desc: "We provide a monthly stipend for the duration of the in-service placement — because your contribution has value from day one." },
                { icon: <MapPin className="w-5 h-5 text-accent" />, title: "A Pathway to Employment", desc: "High-performing trainees are considered for permanent placement. For many, in-service training at MH LEGAL is where a career begins." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 bg-white border border-zinc-100 p-6">
                  <div className="mt-0.5 shrink-0">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Foundational Principles */}
      <section className="py-24 bg-white border-t border-zinc-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Foundational Principles</h2>
            <p className="text-gray-600">The operating tenets that govern every engagement, every placement, and every agent we put in the field.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: "01",
                title: "Structural Integrity",
                desc: "Brokerage advice, sales processes, and compliance frameworks are built to hold up under real market pressure — not just audits."
              },
              {
                number: "02",
                title: "Commercial Discipline",
                desc: "Speed and professionalism are not in conflict. We run fast, compliant, and accountable operations across all six service lines."
              },
              {
                number: "03",
                title: "Human Capital First",
                desc: "The network of 100+ agents and our in-service training programme are proof: we grow the firm by growing the people inside it."
              }
            ].map((p, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-zinc-50 p-10 border border-zinc-100 hover:border-accent/50 transition-colors group"
              >
                <div className="text-4xl font-serif text-zinc-200 group-hover:text-accent transition-colors font-bold mb-6">{p.number}</div>
                <h3 className="text-xl font-bold mb-4">{p.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PartnershipCTA />
    </SiteLayout>
  );
}
