import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, TrendingUp, Cog } from "lucide-react";

export function HowWeHelp() {
  return (
    <section className="py-24 md:py-32 bg-zinc-50 border-t border-zinc-200 relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-3xl mb-16 lg:mb-24">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-12 bg-accent"></div>
            <span className="text-accent uppercase tracking-widest text-sm font-semibold">Practical Application</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-6">
            How We Help Businesses Grow
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            We bring brokerage expertise, sales discipline, and business solutions into every engagement — paired with trained talent ready to execute. The result is growth you can measure.
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
            <h3 className="text-2xl font-bold font-serif mb-4">Brokerage Services</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Tailored insurance brokerage for individuals and businesses. We assess risk, structure the right cover, and stay engaged long after the policy is signed.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700">Personal and commercial insurance lines</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700">Risk assessment and policy structuring</span>
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
            <h3 className="text-2xl font-bold font-serif mb-4">Sales Management</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Disciplined sales operations that turn pipeline activity into closed revenue. We design the process, run the rhythm, and lead the team to consistent performance.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700">Pipeline structure and conversion tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700">Team coaching and performance cadence</span>
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
            <Cog className="w-10 h-10 text-black group-hover:text-accent transition-colors mb-6" />
            <h3 className="text-2xl font-bold font-serif mb-4">Business Solutions</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Operating procedures, administrative systems, and the back-office structure growing businesses need. Built for clarity, accountability, and scale.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700">Process documentation and SOPs</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700">Administrative oversight and reporting</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
