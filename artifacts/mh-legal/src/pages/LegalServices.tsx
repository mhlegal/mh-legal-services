import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Shield, Gavel, FileText, CreditCard, Scale, ArrowRight, X, User, Mail, PhoneCall } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { apiJson } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useSeo } from "@/hooks/use-seo";

const DURBAN_HQ = "+27310027797";
const NATIONAL = "0870060205";
const DURBAN_DISPLAY = "+27 31 002 7797";
const NATIONAL_DISPLAY = "087 006 0205";

const SERVICES = [
  {
    id: "legal-cover",
    icon: Shield,
    title: "R200,000 Legal Cover",
    badge: "Most Popular",
    tagline: "Comprehensive legal protection for you and your family",
    description:
      "Our flagship legal cover plan provides R200,000 in legal assistance for criminal defence, civil disputes, labour matters, and more. One flat monthly premium — no hidden costs.",
    features: [
      "R200,000 legal benefit pool per year",
      "Criminal defence representation",
      "Civil litigation coverage",
      "24/7 legal advice hotline",
      "Family members included",
      "Nationwide attorney network",
    ],
  },
  {
    id: "ccma",
    icon: Gavel,
    title: "CCMA & Labour Law",
    badge: "High Demand",
    tagline: "Expert representation at the CCMA and Labour Court",
    description:
      "Unfair dismissal, retrenchment disputes, wage claims — our labour law specialists represent employees and employers at the CCMA and Labour Court with a proven track record.",
    features: [
      "CCMA conciliation and arbitration",
      "Unfair dismissal claims",
      "Constructive dismissal cases",
      "Retrenchment disputes",
      "Wage and benefit claims",
      "Labour Court representation",
    ],
  },
  {
    id: "contracts",
    icon: FileText,
    title: "Contract Drafting",
    badge: "SLA & Lease",
    tagline: "Watertight contracts drafted by qualified attorneys",
    description:
      "Service Level Agreements, lease agreements, employment contracts, supplier agreements — our attorneys draft and review contracts that protect your interests and withstand legal scrutiny.",
    features: [
      "Service Level Agreements (SLA)",
      "Commercial & residential leases",
      "Employment contracts",
      "Supplier & vendor agreements",
      "Independent contractor agreements",
      "Contract review & redlining",
    ],
  },
  {
    id: "debt",
    icon: CreditCard,
    title: "Debt Collection",
    badge: "R15,000+",
    tagline: "Professional debt recovery from R15,000 and above",
    description:
      "Outstanding invoices, unpaid rent, dishonoured agreements — our debt recovery specialists pursue amounts from R15,000 upward through demand letters, summons, and judgement enforcement.",
    features: [
      "Formal letter of demand",
      "Magistrates Court summons",
      "Default judgement applications",
      "Warrant of execution",
      "Garnishee orders",
      "Emolument attachment orders",
    ],
  },
  {
    id: "civil-rights",
    icon: Scale,
    title: "Civil Rights",
    badge: "Constitutional",
    tagline: "Protecting your fundamental rights under the Constitution",
    description:
      "Discrimination, unlawful detention, police brutality, administrative injustice — our civil rights practice holds authorities and individuals accountable under the South African Constitution.",
    features: [
      "Constitutional rights defence",
      "Discrimination claims",
      "Unlawful arrest & detention",
      "Administrative justice disputes",
      "Interdicts & urgent relief",
      "Human rights tribunal cases",
    ],
  },
];

interface LeadModalProps {
  service: (typeof SERVICES)[0];
  onClose: () => void;
}

function LeadModal({ service, onClose }: LeadModalProps) {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiJson("/leads", {
        method: "POST",
        body: JSON.stringify({ ...form, service: service.title }),
      });
      toast({ title: "Enquiry sent", description: "Our team will contact you within 24 hours." });
      onClose();
    } catch {
      toast({ title: "Failed to send enquiry", description: "Please call us directly.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-lg border border-zinc-200"
      >
        {/* Modal header */}
        <div className="flex items-start justify-between p-8 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[2px] w-8 bg-accent" />
              <span className="text-accent uppercase tracking-widest text-xs font-semibold">{service.badge}</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-black">{service.title}</h3>
          </div>
          <button onClick={onClose} className="text-zinc-300 hover:text-black transition-colors mt-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Direct call */}
        <div className="p-8 border-b border-zinc-100">
          <p className="text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-4">Call Us Directly</p>
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${DURBAN_HQ}`}
              className="flex items-center gap-3 border border-zinc-200 px-4 py-3 hover:border-accent hover:bg-accent/5 transition-all group"
            >
              <PhoneCall className="w-4 h-4 text-accent shrink-0" />
              <div>
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Durban HQ</p>
                <p className="text-black text-sm font-semibold">{DURBAN_DISPLAY}</p>
              </div>
            </a>
            <a
              href={`tel:${NATIONAL}`}
              className="flex items-center gap-3 border border-zinc-200 px-4 py-3 hover:border-accent hover:bg-accent/5 transition-all group"
            >
              <PhoneCall className="w-4 h-4 text-accent shrink-0" />
              <div>
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider">National</p>
                <p className="text-black text-sm font-semibold">{NATIONAL_DISPLAY}</p>
              </div>
            </a>
          </div>
        </div>

        {/* Lead form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <p className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">Or Send an Enquiry</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
              <input
                required
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-zinc-200 py-2.5 pl-9 pr-3 text-black text-sm placeholder-zinc-300 focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <div className="relative">
              <PhoneCall className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
              <input
                required
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-zinc-200 py-2.5 pl-9 pr-3 text-black text-sm placeholder-zinc-300 focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-300" />
            <input
              required
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-zinc-200 py-2.5 pl-9 pr-3 text-black text-sm placeholder-zinc-300 focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <textarea
            placeholder="Briefly describe your matter (optional)"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={3}
            className="w-full border border-zinc-200 py-2.5 px-3 text-black text-sm placeholder-zinc-300 focus:outline-none focus:border-black transition-colors resize-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-black font-bold py-3 hover:bg-black hover:text-white transition-colors disabled:opacity-50 text-sm uppercase tracking-wider"
          >
            {loading ? "Sending..." : "Send Enquiry"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function LegalServices() {
  const [selectedService, setSelectedService] = useState<(typeof SERVICES)[0] | null>(null);

  useSeo({
    title: "Legal Services | MH Legal Services Pty Ltd",
    description: "Comprehensive legal protection — R200k Legal Cover, CCMA, Contract Drafting, Debt Collection, Civil Rights."
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
            <span className="text-accent uppercase tracking-widest text-sm font-semibold">Legal Services</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold leading-tight"
          >
            Comprehensive Legal <br />
            <span className="text-gray-500 font-light italic">Protection.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-xl text-gray-400 max-w-2xl font-light leading-relaxed"
          >
            MH Legal Services Pty Ltd delivers affordable, professional legal solutions for individuals and businesses across South Africa.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 mt-10"
          >
            <a
              href={`tel:${DURBAN_HQ}`}
              className="flex items-center gap-3 bg-accent text-black px-6 py-3 font-bold hover:bg-white transition-colors text-sm uppercase tracking-wider"
            >
              <Phone className="w-4 h-4" />
              {DURBAN_DISPLAY} — Durban HQ
            </a>
            <a
              href={`tel:${NATIONAL}`}
              className="flex items-center gap-3 border border-white/20 text-white px-6 py-3 font-semibold hover:border-accent hover:text-accent transition-colors text-sm uppercase tracking-wider"
            >
              <Phone className="w-4 h-4" />
              {NATIONAL_DISPLAY} — National
            </a>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SERVICES.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: (idx % 2) * 0.1 }}
                  className="group border border-zinc-100 p-10 hover:border-accent/50 hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="text-black group-hover:text-accent transition-colors">
                      <Icon className="w-10 h-10" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-accent border border-accent/30 px-2.5 py-1">
                      {service.badge}
                    </span>
                  </div>
                  <div className="w-10 h-[2px] bg-zinc-200 group-hover:bg-accent transition-colors mb-6" />
                  <h3 className="text-2xl font-serif font-bold text-black mb-2">{service.title}</h3>
                  <p className="text-accent text-sm font-semibold mb-4">{service.tagline}</p>
                  <p className="text-gray-600 leading-relaxed mb-8 flex-1">{service.description}</p>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                        <ArrowRight size={14} className="text-accent shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <a
                      href={`tel:${DURBAN_HQ}`}
                      className="flex items-center justify-center gap-2 bg-accent text-black text-xs font-bold py-3 hover:bg-black hover:text-white transition-colors uppercase tracking-wider"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call Durban HQ
                    </a>
                    <button
                      onClick={() => setSelectedService(service)}
                      className="flex items-center justify-center gap-2 border border-zinc-200 text-black text-xs font-semibold py-3 hover:border-accent hover:text-accent transition-colors uppercase tracking-wider"
                    >
                      Enquire
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent opacity-5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-[1px] w-12 bg-accent" />
            <span className="text-accent uppercase tracking-widest text-sm font-semibold">Need Urgent Help?</span>
            <div className="h-[1px] w-12 bg-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Our Legal Team Is Ready.
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-10 font-light">
            Available during business hours for consultations, urgent matters, and immediate legal advice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${DURBAN_HQ}`}
              className="flex items-center justify-center gap-3 bg-accent text-black px-10 py-4 font-bold hover:bg-white transition-colors text-sm uppercase tracking-wider"
            >
              <Phone className="w-5 h-5" />
              {DURBAN_DISPLAY} — Durban HQ
            </a>
            <a
              href={`tel:${NATIONAL}`}
              className="flex items-center justify-center gap-3 border border-white/20 text-white px-10 py-4 font-semibold hover:border-accent hover:text-accent transition-colors text-sm uppercase tracking-wider"
            >
              <Phone className="w-5 h-5" />
              {NATIONAL_DISPLAY} — National
            </a>
          </div>
        </div>
      </section>

      {selectedService && (
        <LeadModal service={selectedService} onClose={() => setSelectedService(null)} />
      )}
    </SiteLayout>
  );
}
