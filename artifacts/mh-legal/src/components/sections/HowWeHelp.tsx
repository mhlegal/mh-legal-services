import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, TrendingUp, FileCheck } from "lucide-react";

export function HowWeHelp() {
  return (
    <section className="py-24 md:py-32 bg-zinc-50 border-t border-zinc-200 relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-3xl mb-16 lg:mb-24">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-12 bg-accent" />
            <span className="text-accent uppercase tracking-widest text-sm font-semibold">How We Operate</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-6">
            Brokerage. Sales. Compliance.
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Three operational pillars that underpin all six service lines. Every agent, every market activation, and every in-service placement is measured against the same standard: performance within a fully compliant framework.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 border border-zinc-100 hover:border-accent/50 transition-colors group"
          >
            <ShieldCheck className="w-10 h-10 text-black group-hover:text-accent transition-colors mb-6" />
            <h3 className="text-2xl font-bold font-serif mb-4">Insurance Brokerage</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Product distribution across KZN through 100+ licensed agents. We match clients to the right cover, manage renewals, and handle the full policy lifecycle.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700">Personal and commercial insurance lines</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700">100+ licensed agents across KZN</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white p-10 border border-zinc-100 hover:border-accent/50 transition-colors group"
          >
            <TrendingUp className="w-10 h-10 text-black group-hover:text-accent transition-colors mb-6" />
            <h3 className="text-2xl font-bold font-serif mb-4">Sales Representation</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Structured sales representation with full KPI accountability. We design the process, run the cadence, and drive conversion at every stage of the pipeline.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700">KPI-driven performance management</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700">Market activation and pipeline generation</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white p-10 border border-zinc-100 hover:border-accent/50 transition-colors group"
          >
            <FileCheck className="w-10 h-10 text-black group-hover:text-accent transition-colors mb-6" />
            <h3 className="text-2xl font-bold font-serif mb-4">Compliance Management</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Full FSCA compliance oversight across all operations. Our agents operate within a tightly managed regulatory framework — no shortcuts, no exceptions.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700">FSCA regulatory alignment</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700">Ongoing compliance monitoring</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
