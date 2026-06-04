import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, CheckCircle, User, CreditCard, MapPin, Mail, ArrowRight, FileText, AlertCircle } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { apiJson } from "@/lib/api";
import { uploadFile as uploadToStorage } from "@/lib/upload";
import { useToast } from "@/hooks/use-toast";
import { useSeo } from "@/hooks/use-seo";

const PROVINCES = [
  "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
  "Limpopo", "Mpumalanga", "North West", "Northern Cape", "Western Cape",
];

export default function StudentPortal() {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    fullNames: "",
    saIdNumber: "",
    physicalAddress: "",
    email: "",
    stipendStatus: false,
    willingToRelocate: false,
    province: "",
  });

  useSeo({
    title: "Student HR Portal | MH LEGAL SERVICES Pty Ltd",
    description: "Apply for an In-Service Training placement with MH Legal Services."
  });

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function uploadFile(file: File): Promise<string | undefined> {
    try {
      setUploadProgress(20);
      const url = await uploadToStorage(file, () => setUploadProgress(60));
      setUploadProgress(100);
      return url;
    } catch (err: any) {
      toast({
        title: "File upload failed",
        description: err.message ?? "Could not upload your letter. Your application will still be submitted without it.",
        variant: "destructive",
      });
      return undefined;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullNames.trim() || !form.saIdNumber.trim() || !form.physicalAddress.trim() || !form.email.trim()) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    if (!form.province) {
      toast({ title: "Please select your province", variant: "destructive" });
      return;
    }
    setLoading(true);
    setUploadProgress(0);
    try {
      let trainingLetterPath: string | undefined;
      if (selectedFile) {
        setUploadProgress(10);
        trainingLetterPath = await uploadFile(selectedFile);
      }
      await apiJson("/applications", {
        method: "POST",
        body: JSON.stringify({ ...form, trainingLetterPath }),
      });
      setSubmitted(true);
    } catch (err: any) {
      toast({
        title: "Submission failed",
        description: err.message ?? "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  }

  if (submitted) {
    return (
      <SiteLayout>
        <section className="bg-black text-white min-h-[80vh] flex items-center relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <CheckCircle className="w-10 h-10 text-accent" />
                <div className="h-[1px] flex-1 bg-zinc-800" />
              </div>
              <h2 className="text-5xl font-serif font-bold mb-6 leading-tight">
                Application <br />
                <span className="text-gray-500 font-light italic">Received.</span>
              </h2>
              <p className="text-gray-400 text-lg font-light leading-relaxed mb-2">
                Thank you, <span className="text-white font-semibold">{form.fullNames}</span>.
              </p>
              <p className="text-gray-500 leading-relaxed mb-10">
                Your In-Service Training application has been submitted. Our HR team will review it and contact you at <span className="text-white">{form.email}</span> within 3–5 working days.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ fullNames: "", saIdNumber: "", physicalAddress: "", email: "", stipendStatus: false, willingToRelocate: false, province: "" });
                  setSelectedFile(null);
                }}
                className="flex items-center gap-3 border border-white/20 text-white px-8 py-3 hover:border-accent hover:text-accent transition-colors text-sm uppercase tracking-wider font-semibold"
              >
                Submit Another Application
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </section>
      </SiteLayout>
    );
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
            <span className="text-accent uppercase tracking-widest text-sm font-semibold">HR Portal</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold leading-tight"
          >
            Student <br />
            <span className="text-gray-500 font-light italic">Application.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-xl text-gray-400 max-w-2xl font-light leading-relaxed"
          >
            Apply for an In-Service Training placement with MH Legal Services. Complete all fields and upload your training letter to submit your application.
          </motion.p>
        </div>
      </section>

      {/* Form */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Full Names */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                    Full Names <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                    <input
                      required
                      value={form.fullNames}
                      onChange={(e) => update("fullNames", e.target.value)}
                      placeholder="As per ID document"
                      className="w-full border border-zinc-200 py-3 pl-10 pr-4 text-black text-sm placeholder-zinc-300 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                {/* SA ID */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                    SA ID Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                    <input
                      required
                      value={form.saIdNumber}
                      onChange={(e) => update("saIdNumber", e.target.value.replace(/\D/g, "").slice(0, 13))}
                      placeholder="13-digit ID number"
                      maxLength={13}
                      pattern="\d{13}"
                      className="w-full border border-zinc-200 py-3 pl-10 pr-4 text-black text-sm placeholder-zinc-300 focus:outline-none focus:border-black transition-colors font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="mb-8">
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                  Physical Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-zinc-300" />
                  <textarea
                    required
                    value={form.physicalAddress}
                    onChange={(e) => update("physicalAddress", e.target.value)}
                    placeholder="Street address, suburb, city, postal code"
                    rows={3}
                    className="w-full border border-zinc-200 py-3 pl-10 pr-4 text-black text-sm placeholder-zinc-300 focus:outline-none focus:border-black transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="your@email.com"
                      className="w-full border border-zinc-200 py-3 pl-10 pr-4 text-black text-sm placeholder-zinc-300 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                {/* Province */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                    Province <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.province}
                    onChange={(e) => update("province", e.target.value)}
                    className="w-full border border-zinc-200 py-3 px-4 text-black text-sm focus:outline-none focus:border-black transition-colors appearance-none bg-white"
                  >
                    <option value="">Select province</option>
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stipend */}
              <div className="mb-8">
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                  Stipend Status <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Yes — I require a stipend", value: true },
                    { label: "No — No stipend required", value: false },
                  ].map(({ label, value }) => (
                    <button
                      key={String(value)}
                      type="button"
                      onClick={() => update("stipendStatus", value)}
                      className={`py-3 px-4 border text-sm font-semibold transition-all uppercase tracking-wider ${
                        form.stipendStatus === value
                          ? "bg-accent border-accent text-black"
                          : "border-zinc-200 text-zinc-400 hover:border-zinc-400"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Willing to Relocate */}
              <div className="mb-8">
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                  Willing to Relocate <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Yes — Open to relocation", value: true },
                    { label: "No — Not willing to relocate", value: false },
                  ].map(({ label, value }) => (
                    <button
                      key={String(value)}
                      type="button"
                      onClick={() => update("willingToRelocate", value)}
                      className={`py-3 px-4 border text-sm font-semibold transition-all uppercase tracking-wider ${
                        form.willingToRelocate === value
                          ? "bg-accent border-accent text-black"
                          : "border-zinc-200 text-zinc-400 hover:border-zinc-400"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* File Upload */}
              <div className="mb-8">
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                  In-Service Training Letter
                </label>
                <label
                  htmlFor="training-letter-portal"
                  className={`block border-2 border-dashed p-10 text-center cursor-pointer transition-all ${
                    selectedFile
                      ? "border-accent bg-accent/5"
                      : "border-zinc-200 hover:border-zinc-400"
                  }`}
                >
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-4">
                      <FileText className="w-8 h-8 text-accent" />
                      <div className="text-left">
                        <p className="text-black font-semibold">{selectedFile.name}</p>
                        <p className="text-zinc-400 text-sm">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
                      <p className="text-zinc-500 text-sm font-semibold">Click to upload your training letter</p>
                      <p className="text-zinc-300 text-xs mt-1">PDF, DOC, DOCX or image — max 20MB</p>
                    </>
                  )}
                  <input
                    id="training-letter-portal"
                    ref={fileRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>

              {/* Upload progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-zinc-400 mb-1">
                    <span>Uploading file...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1 bg-zinc-100 overflow-hidden">
                    <div className="h-full bg-accent transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              {/* POPIA notice */}
              <div className="flex items-start gap-3 border border-zinc-100 p-5 mb-8 bg-zinc-50">
                <AlertCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <p className="text-zinc-500 text-xs leading-relaxed">
                  By submitting this form, you consent to MH Legal Services processing your personal information in accordance with POPIA for the purposes of evaluating your In-Service Training application.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-3 w-full bg-accent text-black font-bold py-4 hover:bg-black hover:text-white transition-colors disabled:opacity-50 text-sm uppercase tracking-wider"
              >
                {loading ? "Submitting..." : (
                  <>
                    Submit Application
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
