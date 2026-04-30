import { motion } from "framer-motion";
import { CheckCircle2, ClipboardList, Briefcase, Cog } from "lucide-react";

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
            How We Help Businesses
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            We provide concrete operational support to stabilize and scale growing businesses. Our interventions are designed to integrate seamlessly with your existing infrastructure, regardless of industry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 border border-zinc-100 hover:border-accent/50 transition-colors group"
          >
            <ClipboardList className="w-10 h-10 text-black group-hover:text-accent transition-colors mb-6" />
            <h3 className="text-2xl font-bold font-serif mb-4">Business Administrative Solutions</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Structured administrative support that removes friction from day-to-day operations. We design clean workflows, document the work, and own the recurring tasks so leadership can focus on growth.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700">Process documentation and SOPs</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700">Pipeline and administrative oversight</span>
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
            <Briefcase className="w-10 h-10 text-black group-hover:text-accent transition-colors mb-6" />
            <h3 className="text-2xl font-bold font-serif mb-4">Desk Management</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Taking ownership of critical administrative and operational workflows so your executive team can focus on overarching strategic goals rather than daily friction.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700">Workflow restructuring</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700">Day-to-day administrative control</span>
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
            <h3 className="text-2xl font-bold font-serif mb-4">Operational Efficiency</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Auditing existing systems and deploying robust frameworks to mitigate risk, accelerate output, and establish a foundation for scalable growth.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700">Systems auditing</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700">Framework deployment</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}