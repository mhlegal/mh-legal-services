import { useSeo } from "@/hooks/use-seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { Mail, Phone, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const recipients = [
  {
    id: "company",
    label: "General Company Enquiry",
    name: "MH LEGAL SERVICES Pty Ltd",
    email: siteConfig.contact.company,
    role: "Company Email",
    description: "General enquiries about our services, partnerships, or corporate matters.",
  },
  {
    id: "provincial",
    label: "Provincial Manager",
    name: "Simangaliso Ngobese",
    email: siteConfig.contact.provincial,
    role: "Provincial Manager — KwaZulu-Natal & Mpumalanga",
    description: "Enquiries about agent network, market operations, in-service training, or KZN and Mpumalanga-based activities.",
  },
  {
    id: "field",
    label: "Field Manager",
    name: "Field Operations",
    email: siteConfig.contact.fieldManager,
    role: "Field Manager",
    description: "On-the-ground queries related to market activations, agent performance, or field-level operations.",
  },
  {
    id: "head",
    label: "Head of Field Operations",
    name: "Thulane David Phiri",
    email: siteConfig.contact.headOfField,
    role: "Head of Field Operations",
    description: "Strategic operational matters, compliance queries, or senior-level partnership discussions.",
  },
];

export default function Contact() {
  useSeo({
    title: "Contact Us | MH LEGAL SERVICES Pty Ltd",
    description: "Get in touch with MH LEGAL SERVICES Pty Ltd. Select the right contact — company email, Provincial Manager, Field Manager, or Head of Field Operations."
  });

  const [selected, setSelected] = useState<string | null>(null);

  const selectedRecipient = recipients.find((r) => r.id === selected);

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
            <span className="text-accent uppercase tracking-widest text-sm font-semibold">Get in Touch</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold leading-tight"
          >
            Contact <br /><span className="text-gray-500 font-light italic">the Right Person.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-xl text-gray-400 max-w-2xl font-light leading-relaxed"
          >
            Select who you need to speak to. We route enquiries directly to the relevant person — no switchboards, no delays.
          </motion.p>
        </div>
      </section>

      {/* Email Selector */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

            {/* Selector */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-2xl font-serif font-bold mb-8">Who would you like to contact?</h2>
              {recipients.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelected(r.id)}
                  className={`w-full text-left border p-6 transition-all duration-200 group flex items-start gap-5 ${
                    selected === r.id
                      ? "border-accent bg-zinc-50 shadow-md"
                      : "border-zinc-200 hover:border-zinc-400 bg-white"
                  }`}
                >
                  <div className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    selected === r.id ? "border-accent bg-accent" : "border-zinc-300"
                  }`}>
                    {selected === r.id && <div className="w-2 h-2 bg-black rounded-full" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base">{r.label}</h3>
                      <ChevronRight size={16} className={`text-accent transition-transform ${selected === r.id ? "translate-x-1" : ""}`} />
                    </div>
                    <p className="text-xs text-accent uppercase tracking-widest font-semibold mt-0.5 mb-2">{r.role}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{r.description}</p>
                  </div>
                </button>
              ))}

              {/* Action panel */}
              {selectedRecipient && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black text-white p-8 mt-6"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-accent flex items-center justify-center shrink-0">
                      <Mail className="text-black" size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-accent uppercase tracking-widest font-semibold">{selectedRecipient.role}</div>
                      <div className="text-xl font-serif font-bold mt-0.5">{selectedRecipient.name}</div>
                      <div className="text-gray-400 text-sm mt-1">{selectedRecipient.email}</div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      asChild
                      className="bg-accent text-black hover:bg-white hover:text-black rounded-none h-12 px-8 font-bold transition-all"
                    >
                      <a href={`mailto:${selectedRecipient.email}`}>
                        Open Email Client
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-zinc-600 text-white hover:border-white rounded-none h-12 px-6 font-semibold transition-all"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedRecipient.email);
                      }}
                    >
                      Copy Email Address
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Info panel */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h3 className="text-xl font-serif font-bold mb-6">Other Ways to Reach Us</h3>

                <div className="space-y-5">
                  <a
                    href={siteConfig.contact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 bg-zinc-100 flex items-center justify-center group-hover:bg-[#25D366] transition-colors">
                      <Phone className="text-black group-hover:text-white transition-colors" size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">WhatsApp</div>
                      <div className="font-bold text-black">{siteConfig.contact.whatsapp}</div>
                    </div>
                  </a>

                  <a href={`mailto:${siteConfig.contact.company}`} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-zinc-100 flex items-center justify-center group-hover:bg-black transition-colors">
                      <Mail className="text-black group-hover:text-accent transition-colors" size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Company Email</div>
                      <div className="font-bold text-black">{siteConfig.contact.company}</div>
                    </div>
                  </a>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-100 flex items-center justify-center">
                      <MapPin className="text-black" size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Location</div>
                      <div className="font-bold text-black">{siteConfig.contact.location}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-zinc-50 border border-zinc-200 p-8">
                <h4 className="font-bold mb-3">Prefer WhatsApp?</h4>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  For immediate responses, our team is reachable on WhatsApp during business hours.
                </p>
                <Button asChild className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white rounded-none h-12 font-bold">
                  <a href={siteConfig.contact.whatsappUrl} target="_blank" rel="noopener noreferrer">
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>

              {/* Careers redirect */}
              <div className="bg-black text-white p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-10 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <div className="w-8 h-[2px] bg-accent mb-4" />
                  <h4 className="font-serif font-bold text-lg mb-3">Looking to Apply?</h4>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    For in-service training or youth employment applications, visit our Careers page.
                  </p>
                  <Button asChild variant="outline" className="border-zinc-600 text-white hover:border-accent hover:text-accent rounded-none h-10 px-6 text-sm font-bold transition-all">
                    <a href="/careers">Go to Careers</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
