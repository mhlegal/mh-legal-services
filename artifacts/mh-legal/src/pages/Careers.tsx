import { useSeo } from "@/hooks/use-seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Careers() {
  useSeo({
    title: "Careers & Training | MH LEGAL SERVICES Pty Ltd",
    description: "Apply for In-Service Training at MH LEGAL SERVICES Pty Ltd. Embedded inside a live corporate insurance brokerage in partnership with Mthashana TVET College."
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
            <span className="text-accent uppercase tracking-widest text-sm font-semibold">Join the Firm</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold leading-tight"
          >
            Careers &amp; <br /><span className="text-gray-500 font-light italic">In-Service Training.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-xl text-gray-400 max-w-2xl font-light leading-relaxed"
          >
            Two pathways into MH LEGAL SERVICES Pty Ltd — an in-service training placement for Business Management students, and a youth employment opportunity for candidates aged 18–30. Our agents operate across all 9 provinces, so we welcome applicants from anywhere in South Africa.
          </motion.p>
        </div>
      </section>

      {/* In-Service Training Overview */}
      <section className="py-24 bg-white border-b border-zinc-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-12 bg-accent" />
                <span className="text-accent uppercase tracking-widest text-sm font-semibold">In-Service Training</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 leading-tight">
                Train Inside a Live Brokerage Operation.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                In partnership with Mthashana TVET College, we embed qualifying Business Management students directly inside our sales and brokerage teams. You are not placed in a classroom environment — you work alongside our agents, field managers, and sales leads in a real, high-performance commercial operation.
              </p>
              <p className="text-gray-600 leading-relaxed mb-10">
                The program covers product distribution, market activation, sales representation, and compliance — giving you a comprehensive foundation in corporate brokerage operations. All training is structured, supervised, and tied directly to FSCA-regulated environments.
              </p>

              <h3 className="font-bold text-lg mb-5">You must meet the following criteria to apply:</h3>
              <ul className="space-y-4">
                {[
                  "Currently enrolled in a Business Management programme at a recognized TVET College or tertiary institution",
                  "A valid In-Service Training Letter from your institution is required",
                  "South African citizen with a valid ID document",
                  "Available for full in-service placement (duration as per institution requirements)",
                ].map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="bg-zinc-50 border border-zinc-100 p-8">
                <h3 className="font-serif font-bold text-xl mb-4">What You Will Do</h3>
                <ul className="space-y-3">
                  {[
                    "Participate in live product distribution and client-facing sales activity",
                    "Work alongside field managers and senior agents across South Africa's 9 provinces",
                    "Learn FSCA compliance requirements in a regulated brokerage environment",
                    "Develop sales and client relationship skills under active mentorship",
                    "Contribute to market activation campaigns and pipeline reporting",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-black text-white p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-10 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <div className="w-10 h-[2px] bg-accent mb-4" />
                  <h3 className="font-serif font-bold text-xl mb-3">What We Offer</h3>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li>— Structured in-service placement in a live brokerage firm</li>
                    <li>— Direct mentorship from field managers and operations leadership</li>
                    <li>— Real commercial experience across six service lines</li>
                    <li>— Partnership with Mthashana TVET College for academic alignment</li>
                    <li>— A pathway to permanent placement for high performers</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apply CTA */}
      <section className="py-24 bg-zinc-50 border-b border-zinc-200" id="apply">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-accent" />
              <span className="text-accent uppercase tracking-widest text-sm font-semibold">Apply Now</span>
              <div className="h-[1px] w-12 bg-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Ready to Apply?</h2>
            <p className="text-gray-500 mb-10 leading-relaxed max-w-xl mx-auto">
              Submit your In-Service Training application through our secure Student HR Portal. Have your SA ID number, physical address, and training letter ready before you start.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-black text-white hover:bg-accent hover:text-black rounded-none h-14 px-12 text-base font-bold tracking-wide transition-all group"
            >
              <Link href="/student-portal">
                Go to Application Portal
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <p className="text-xs text-gray-400 mt-6">
              Applications are reviewed by our HR team within 3–5 working days. You will be contacted at the email address you provide.
            </p>
          </div>
        </div>
      </section>

      {/* Youth Employment */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-12 bg-accent" />
                <span className="text-accent uppercase tracking-widest text-sm font-semibold">Youth Employment</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight">
                Ages 18–30: Start Your Career Here.
              </h2>
              <p className="text-gray-400 leading-relaxed">
                If you are between 18 and 30 years old and looking for your first real career opportunity in sales, insurance, or business operations — MH LEGAL SERVICES Pty Ltd wants to hear from you.
              </p>
              <p className="text-gray-400 leading-relaxed">
                We are actively developing young South African professionals through our agent training programme and field operations. No experience is required — only hunger, commitment, and the willingness to work hard in a structured, high-performance environment.
              </p>
              <div className="bg-zinc-900 border border-zinc-800 p-6">
                <h3 className="font-bold mb-3 text-white">How to Apply</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  Send your CV to our Provincial Manager. In the subject line, write <strong className="text-white">"Youth Employment Application — [Your Name]"</strong>. Include a brief cover note telling us who you are and why you want to work in the insurance brokerage sector.
                </p>
                <a
                  href={`mailto:${siteConfig.contact.provincial}?subject=Youth%20Employment%20Application&body=Dear%20Provincial%20Manager%2C%0A%0AI%20would%20like%20to%20apply%20for%20a%20youth%20employment%20opportunity%20at%20MH%20LEGAL%20SERVICES%20Pty%20Ltd.%0A%0A`}
                  className="inline-flex items-center gap-2 bg-accent text-black hover:bg-white rounded-none h-12 px-8 font-bold text-sm transition-all"
                >
                  <Mail size={16} />
                  Email Your CV Now
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <div className="text-6xl font-serif font-bold text-accent">18–30</div>
                <div className="text-gray-500 uppercase tracking-widest text-sm mt-2">Age Range</div>
              </div>
              {[
                { title: "No Experience Required", desc: "We train from the ground up. What we look for is attitude, energy, and commitment." },
                { title: "Structured Career Path", desc: "From agent to field manager — our internal progression model creates real career trajectories." },
                { title: "Real Earning Potential", desc: "Sales-driven roles with performance-linked income. Your growth is tied directly to your output." },
              ].map((item, i) => (
                <div key={i} className="border border-zinc-800 hover:border-accent/50 transition-colors p-6">
                  <h4 className="font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
