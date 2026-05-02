import { useSeo } from "@/hooks/use-seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Mail, Upload } from "lucide-react";
import { useRef, useState } from "react";

const WORD_LIMIT = 150;

function wordCount(str: string): number {
  return str.trim() === "" ? 0 : str.trim().split(/\s+/).length;
}

const formSchema = z.object({
  fullNames: z.string().min(3, "Please enter your full names."),
  idNumber: z.string().length(13, "ID number must be 13 digits.").regex(/^\d+$/, "ID number must contain digits only."),
  homeAddress: z.string().min(5, "Please enter your home address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  email: z.string().email("Please enter a valid email address."),
  willingToRelocate: z.enum(["yes", "no"], { required_error: "Please indicate if you are willing to relocate." }),
  aboutYou: z.string().min(10, "Please tell us a little about yourself.")
    .refine((val) => wordCount(val) <= WORD_LIMIT, { message: `Maximum ${WORD_LIMIT} words allowed.` }),
});

export default function Careers() {
  useSeo({
    title: "Careers & Training | MH LEGAL SERVICES Pty Ltd",
    description: "Apply for In-Service Training at MH LEGAL SERVICES Pty Ltd. Embedded inside a live corporate insurance brokerage in partnership with Mthashana TVET College."
  });

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");
  const [wordCountVal, setWordCountVal] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullNames: "",
      idNumber: "",
      homeAddress: "",
      phone: "",
      email: "",
      willingToRelocate: undefined,
      aboutYou: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const subject = encodeURIComponent("In-Service Training Application — MH LEGAL SERVICES Pty Ltd");
    const body = encodeURIComponent(
      `IN-SERVICE TRAINING APPLICATION\n` +
      `================================\n\n` +
      `Full Names: ${values.fullNames}\n` +
      `ID Number: ${values.idNumber}\n` +
      `Home Address: ${values.homeAddress}\n` +
      `Phone: ${values.phone}\n` +
      `Email: ${values.email}\n` +
      `Willing to Relocate: ${values.willingToRelocate === "yes" ? "Yes" : "No"}\n\n` +
      `About the Applicant:\n${values.aboutYou}\n\n` +
      (fileName ? `Training Letter Attached: ${fileName}\n` : `No training letter file attached via form — applicant should attach separately.\n`) +
      `\n--- Submitted via MH LEGAL SERVICES Pty Ltd website ---`
    );
    window.location.href = `mailto:${siteConfig.contact.provincial}?subject=${subject}&body=${body}`;
    toast({
      title: "Application Ready to Send",
      description: "Your email client will open with the application pre-filled. Please attach your In-Service Training Letter and send.",
    });
    form.reset();
    setFileName("");
    setWordCountVal(0);
  }

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
            Two pathways into MH LEGAL SERVICES Pty Ltd — an in-service training placement for Business Management students, and a youth employment opportunity for candidates aged 18–30.
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
                    "Work alongside field managers and senior agents in the KZN market",
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

      {/* Application Form */}
      <section className="py-24 bg-zinc-50 border-b border-zinc-200" id="apply">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-accent" />
              <span className="text-accent uppercase tracking-widest text-sm font-semibold">Apply Now</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">In-Service Training Application</h2>
            <p className="text-gray-500 mb-10 leading-relaxed">
              Complete the form below. On submission, your email client will open with all details pre-filled and addressed to our Provincial Manager. Please attach your In-Service Training Letter before sending.
            </p>

            <div className="bg-white border border-zinc-200 p-8 md:p-12">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullNames"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase text-xs tracking-wider text-black font-bold">Full Names *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Sipho Nkosi" className="h-12 rounded-none border-zinc-300 focus-visible:ring-accent bg-white" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="idNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase text-xs tracking-wider text-black font-bold">ID Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="13-digit SA ID number" maxLength={13} className="h-12 rounded-none border-zinc-300 focus-visible:ring-accent bg-white" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="homeAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-xs tracking-wider text-black font-bold">Home Address *</FormLabel>
                        <FormControl>
                          <Input placeholder="Street, Town, Province" className="h-12 rounded-none border-zinc-300 focus-visible:ring-accent bg-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase text-xs tracking-wider text-black font-bold">Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 082 000 0000" className="h-12 rounded-none border-zinc-300 focus-visible:ring-accent bg-white" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase text-xs tracking-wider text-black font-bold">Email Address *</FormLabel>
                          <FormControl>
                            <Input placeholder="your@email.com" className="h-12 rounded-none border-zinc-300 focus-visible:ring-accent bg-white" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="willingToRelocate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-xs tracking-wider text-black font-bold">Willing to Relocate? *</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 gap-4 mt-1">
                            {[
                              { label: "Yes — Open to relocation", value: "yes" },
                              { label: "No — Not willing to relocate", value: "no" },
                            ].map(({ label, value }) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() => field.onChange(value)}
                                className={`py-3 px-4 border text-sm font-semibold transition-all uppercase tracking-wider ${
                                  field.value === value
                                    ? "bg-accent border-accent text-black"
                                    : "border-zinc-300 text-zinc-400 hover:border-zinc-500"
                                }`}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* File Upload */}
                  <div>
                    <label className="block uppercase text-xs tracking-wider text-black font-bold mb-2">
                      In-Service Training Letter (Upload)
                    </label>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-zinc-300 hover:border-accent transition-colors p-6 flex flex-col items-center gap-3 cursor-pointer bg-zinc-50 hover:bg-white"
                    >
                      <Upload size={22} className="text-accent" />
                      <span className="text-sm text-gray-600 font-medium">
                        {fileName ? fileName : "Click to upload your training letter (PDF, Word, or image)"}
                      </span>
                      {!fileName && <span className="text-xs text-gray-400">You can also attach it directly when your email opens</span>}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setFileName(file ? file.name : "");
                      }}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="aboutYou"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-end justify-between mb-2">
                          <FormLabel className="uppercase text-xs tracking-wider text-black font-bold">Tell Us About Yourself *</FormLabel>
                          <span className={`text-xs font-semibold ${wordCountVal > WORD_LIMIT ? "text-red-500" : "text-gray-400"}`}>
                            {wordCountVal} / {WORD_LIMIT} words
                          </span>
                        </div>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us who you are, why you want to join MH LEGAL SERVICES Pty Ltd, and what you hope to gain from the in-service training programme. Maximum 150 words."
                            className="min-h-[140px] rounded-none border-zinc-300 focus-visible:ring-accent bg-white resize-none"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setWordCountVal(wordCount(e.target.value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full md:w-auto bg-black text-white hover:bg-accent hover:text-black rounded-none h-14 px-12 text-base font-bold transition-colors"
                    >
                      Submit Application
                    </Button>
                    <p className="text-xs text-gray-400 mt-4">
                      Your email client will open with all details pre-filled and addressed to our Provincial Manager (ngobesesimangaliso47@gmail.com). Please attach your training letter and hit send.
                    </p>
                  </div>
                </form>
              </Form>
            </div>
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
