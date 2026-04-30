import { useSeo } from "@/hooks/use-seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { Mail, MapPin, Phone, MessageSquare } from "lucide-react";
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

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  company: z.string().min(2, "Company name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters.")
});

export default function Contact() {
  useSeo({
    title: "Partner With Us | Contact",
    description: "Initiate a consultation with MH LEGAL. We partner with South African businesses to optimize legal systems and operational efficiency."
  });

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      message: ""
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Inquiry Submitted Successfully",
      description: "A representative from MH LEGAL will contact you shortly to arrange a consultation.",
    });
    form.reset();
  }

  return (
    <SiteLayout>
      <section className="bg-black text-white pt-32 pb-20 md:pt-48 md:pb-32">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="h-[1px] w-12 bg-accent"></div>
              <span className="text-accent uppercase tracking-widest text-sm font-semibold">Engage Our Firm</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-serif font-bold leading-tight"
            >
              Initiate <span className="text-gray-500 font-light italic">Partnership.</span>
            </motion.h1>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Contact Info */}
            <div className="lg:col-span-4 space-y-12">
              <div>
                <h3 className="text-2xl font-serif font-bold mb-6">Direct Channels</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Connect with our executive team to discuss systems auditing, legal frameworks, or operational scaling.
                </p>
                
                <div className="space-y-6">
                  <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-zinc-100 flex items-center justify-center group-hover:bg-black transition-colors">
                      <Mail className="text-black group-hover:text-accent transition-colors" size={20} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 font-medium">Corporate Email</div>
                      <div className="font-semibold text-black">{siteConfig.contact.email}</div>
                    </div>
                  </a>
                  
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-zinc-100 flex items-center justify-center group-hover:bg-black transition-colors">
                      <Phone className="text-black group-hover:text-accent transition-colors" size={20} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 font-medium">Direct Line</div>
                      <div className="font-semibold text-black">{siteConfig.contact.whatsapp}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-zinc-100 flex items-center justify-center group-hover:bg-black transition-colors">
                      <MapPin className="text-black group-hover:text-accent transition-colors" size={20} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 font-medium">Headquarters</div>
                      <div className="font-semibold text-black">{siteConfig.contact.location}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-zinc-50 border border-zinc-200">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <MessageSquare size={18} className="text-accent" />
                  Immediate Response
                </h4>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  For urgent operational inquiries, our team is directly accessible via WhatsApp.
                </p>
                <Button asChild className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white rounded-none h-12 font-semibold">
                  <a href={siteConfig.contact.whatsappUrl} target="_blank" rel="noopener noreferrer">
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-8 bg-zinc-50 p-8 md:p-12 border border-zinc-200">
              <h3 className="text-2xl font-serif font-bold mb-2">Submit Formal Inquiry</h3>
              <p className="text-gray-500 mb-8">Provide initial details regarding your corporate requirements.</p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase text-xs tracking-wider text-black font-semibold">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" className="h-12 rounded-none border-zinc-300 focus-visible:ring-accent bg-white" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase text-xs tracking-wider text-black font-semibold">Company / Enterprise</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Logistics Ltd." className="h-12 rounded-none border-zinc-300 focus-visible:ring-accent bg-white" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-xs tracking-wider text-black font-semibold">Corporate Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john@acme.co.za" className="h-12 rounded-none border-zinc-300 focus-visible:ring-accent bg-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-xs tracking-wider text-black font-semibold">Operational Requirements</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Briefly describe your current operational challenges or systems requirements..." 
                            className="min-h-[150px] rounded-none border-zinc-300 focus-visible:ring-accent bg-white resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full md:w-auto bg-black text-white hover:bg-accent hover:text-black rounded-none h-14 px-10 text-base font-semibold transition-colors">
                    Submit Inquiry
                  </Button>
                </form>
              </Form>
            </div>
            
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
