import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Shield, Gavel, FileText, CreditCard, Scale, ChevronRight, X, User, Mail, PhoneCall } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { apiJson } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

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
    color: "#C9A961",
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
    color: "#C9A961",
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
    color: "#C9A961",
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
    color: "#C9A961",
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
    color: "#C9A961",
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
      toast({ title: "Enquiry sent!", description: "Our team will contact you within 24 hours." });
      onClose();
    } catch {
      toast({ title: "Failed to send enquiry", description: "Please call us directly.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h3 className="font-playfair text-xl text-white">{service.title}</h3>
            <p className="text-white/40 text-sm mt-0.5">Request a callback or consultation</p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 border-b border-white/5">
          <div className="flex gap-3">
            <a
              href={`tel:${DURBAN_HQ}`}
              className="flex-1 flex items-center gap-2 bg-[#C9A961]/10 border border-[#C9A961]/20 rounded-lg px-4 py-3 hover:bg-[#C9A961]/20 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-[#C9A961]" />
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Durban HQ</p>
                <p className="text-white text-sm font-medium">{DURBAN_DISPLAY}</p>
              </div>
            </a>
            <a
              href={`tel:${NATIONAL}`}
              className="flex-1 flex items-center gap-2 bg-[#C9A961]/10 border border-[#C9A961]/20 rounded-lg px-4 py-3 hover:bg-[#C9A961]/20 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-[#C9A961]" />
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">National</p>
                <p className="text-white text-sm font-medium">{NATIONAL_DISPLAY}</p>
              </div>
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-white/40 text-xs uppercase tracking-wider">Or send an enquiry</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                required
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-9 pr-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A961]/50"
              />
            </div>
            <div className="relative">
              <PhoneCall className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                required
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-9 pr-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A961]/50"
              />
            </div>
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-4 h-4 text-white/20" />
            <input
              required
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-9 pr-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A961]/50"
            />
          </div>
          <textarea
            placeholder="Briefly describe your matter (optional)"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A961]/50 resize-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C9A961] text-black font-semibold py-3 rounded-lg hover:bg-[#b8973a] transition-colors disabled:opacity-50"
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

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-[#C9A961]" />
              <span className="text-[#C9A961] text-xs font-medium uppercase tracking-[0.2em]">Legal Services</span>
            </div>
            <h1 className="font-playfair text-5xl text-white mb-6">
              Comprehensive Legal<br />
              <span className="text-[#C9A961]">Protection</span>
            </h1>
            <p className="text-white/50 text-lg max-w-2xl">
              MH Legal Services Pty Ltd provides affordable, professional legal solutions for individuals and businesses across South Africa.
            </p>
            <div className="flex gap-4 mt-8">
              <a
                href={`tel:${DURBAN_HQ}`}
                className="flex items-center gap-2 bg-[#C9A961] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#b8973a] transition-colors"
              >
                <Phone className="w-4 h-4" />
                {DURBAN_DISPLAY}
              </a>
              <a
                href={`tel:${NATIONAL}`}
                className="flex items-center gap-2 border border-[#C9A961]/40 text-[#C9A961] px-6 py-3 rounded-lg font-semibold hover:bg-[#C9A961]/10 transition-colors"
              >
                <Phone className="w-4 h-4" />
                {NATIONAL_DISPLAY}
              </a>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="group bg-[#111] border border-white/8 rounded-2xl p-6 hover:border-[#C9A961]/30 transition-all duration-300 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#C9A961]/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#C9A961]" />
                    </div>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-[#C9A961] bg-[#C9A961]/10 px-2.5 py-1 rounded-full border border-[#C9A961]/20">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="font-playfair text-xl text-white mb-2">{service.title}</h3>
                  <p className="text-[#C9A961] text-sm mb-3">{service.tagline}</p>
                  <p className="text-white/40 text-sm leading-relaxed mb-5 flex-1">{service.description}</p>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                        <div className="w-1 h-1 rounded-full bg-[#C9A961] flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <a
                      href={`tel:${DURBAN_HQ}`}
                      className="flex items-center justify-center gap-1.5 bg-[#C9A961] text-black text-xs font-semibold py-2.5 rounded-lg hover:bg-[#b8973a] transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Durban HQ
                    </a>
                    <button
                      onClick={() => setSelectedService(service)}
                      className="flex items-center justify-center gap-1.5 border border-white/10 text-white/60 text-xs font-medium py-2.5 rounded-lg hover:border-[#C9A961]/40 hover:text-[#C9A961] transition-colors"
                    >
                      Enquire
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-playfair text-3xl text-white mb-4">Need Immediate Assistance?</h2>
          <p className="text-white/40 mb-8">Our legal team is available during business hours. Call directly for urgent matters.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${DURBAN_HQ}`}
              className="flex items-center justify-center gap-3 bg-[#C9A961] text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#b8973a] transition-colors"
            >
              <Phone className="w-5 h-5" />
              <div className="text-left">
                <div className="text-xs opacity-70 font-normal">Durban HQ</div>
                <div>{DURBAN_DISPLAY}</div>
              </div>
            </a>
            <a
              href={`tel:${NATIONAL}`}
              className="flex items-center justify-center gap-3 border-2 border-[#C9A961] text-[#C9A961] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#C9A961]/10 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <div className="text-left">
                <div className="text-xs opacity-70 font-normal">National Line</div>
                <div>{NATIONAL_DISPLAY}</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {selectedService && (
        <LeadModal service={selectedService} onClose={() => setSelectedService(null)} />
      )}
    </div>
  );
}
