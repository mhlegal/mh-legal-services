import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, CheckCircle, User, CreditCard, MapPin, Mail, AlertCircle, FileText } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { apiFetch, apiJson } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

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
    province: "",
  });

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function uploadFile(file: File): Promise<string | undefined> {
    try {
      const { uploadURL, objectPath } = await apiJson<{ uploadURL: string; objectPath: string }>(
        "/applications/upload-url",
        {
          method: "POST",
          body: JSON.stringify({ fileName: file.name, contentType: file.type || "application/octet-stream" }),
        }
      );

      setUploadProgress(30);
      await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      setUploadProgress(100);
      return objectPath;
    } catch {
      return undefined;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#C9A961]/10 border border-[#C9A961]/30 mb-6">
              <CheckCircle className="w-10 h-10 text-[#C9A961]" />
            </div>
            <h2 className="font-playfair text-4xl text-white mb-4">Application Received</h2>
            <p className="text-white/50 mb-2">
              Thank you, <span className="text-white font-medium">{form.fullNames}</span>.
            </p>
            <p className="text-white/40 text-sm mb-8">
              Your In-Service Training application has been submitted. Our HR team will review it and contact you at <span className="text-white">{form.email}</span> within 3–5 working days.
            </p>
            <button
              onClick={() => { setSubmitted(false); setForm({ fullNames: "", saIdNumber: "", physicalAddress: "", email: "", stipendStatus: false, province: "" }); setSelectedFile(null); }}
              className="border border-white/10 text-white/60 px-6 py-3 rounded-lg hover:border-[#C9A961]/40 hover:text-[#C9A961] transition-colors"
            >
              Submit Another Application
            </button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-[#C9A961]" />
              <span className="text-[#C9A961] text-xs font-medium uppercase tracking-[0.2em]">HR Portal</span>
            </div>
            <h1 className="font-playfair text-5xl text-white mb-4">
              Student <span className="text-[#C9A961]">Application</span>
            </h1>
            <p className="text-white/50">
              Apply for an In-Service Training placement with MH Legal Services. Complete all fields and upload your training letter to submit your application.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#111] border border-white/8 rounded-2xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                    Full Names <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      required
                      value={form.fullNames}
                      onChange={(e) => update("fullNames", e.target.value)}
                      placeholder="As per ID document"
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A961]/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                    SA ID Number <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      required
                      value={form.saIdNumber}
                      onChange={(e) => update("saIdNumber", e.target.value.replace(/\D/g, "").slice(0, 13))}
                      placeholder="13-digit ID number"
                      maxLength={13}
                      pattern="\d{13}"
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A961]/50 transition-colors font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                  Physical Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-white/20" />
                  <textarea
                    required
                    value={form.physicalAddress}
                    onChange={(e) => update("physicalAddress", e.target.value)}
                    placeholder="Street address, suburb, city, postal code"
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A961]/50 transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A961]/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                    Province <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.province}
                    onChange={(e) => update("province", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-[#C9A961]/50 transition-colors appearance-none"
                  >
                    <option value="" className="bg-[#111]">Select province</option>
                    {PROVINCES.map((p) => (
                      <option key={p} value={p} className="bg-[#111]">{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-3">
                  Stipend Status <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-4">
                  {[
                    { label: "Yes — I require a stipend", value: true },
                    { label: "No — No stipend required", value: false },
                  ].map(({ label, value }) => (
                    <button
                      key={String(value)}
                      type="button"
                      onClick={() => update("stipendStatus", value)}
                      className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-all ${
                        form.stipendStatus === value
                          ? "bg-[#C9A961]/10 border-[#C9A961] text-[#C9A961]"
                          : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                  In-Service Training Letter
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    selectedFile
                      ? "border-[#C9A961]/50 bg-[#C9A961]/5"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="w-6 h-6 text-[#C9A961]" />
                      <div className="text-left">
                        <p className="text-white text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-white/30 text-xs">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-white/20 mx-auto mb-3" />
                      <p className="text-white/50 text-sm">Click to upload your training letter</p>
                      <p className="text-white/25 text-xs mt-1">PDF, DOC, DOCX or image — max 20MB</p>
                    </>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                  />
                </div>
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-white/40">
                    <span>Uploading file...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C9A961] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/15 rounded-xl p-4">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-white/50 text-xs leading-relaxed">
                  By submitting this form, you consent to MH Legal Services processing your personal information in accordance with POPIA for the purposes of evaluating your In-Service Training application.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C9A961] text-black font-semibold py-4 rounded-xl hover:bg-[#b8973a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                {loading ? "Submitting Application..." : "Submit Application"}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
