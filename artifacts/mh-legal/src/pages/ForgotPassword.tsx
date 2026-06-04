import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle, Shield } from "lucide-react";
import { apiJson } from "@/lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiJson("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top bar */}
      <div className="border-b border-zinc-900 px-8 py-5 flex items-center justify-between">
        <Link href="/">
          <div className="font-serif font-bold text-lg tracking-wider cursor-pointer flex items-center gap-1">
            <span className="text-white">MH LEGAL</span>
            <span className="text-accent ml-1">SERVICES</span>
          </div>
        </Link>
        <Link href="/login">
          <span className="text-zinc-600 text-xs uppercase tracking-widest hover:text-accent transition-colors cursor-pointer">
            ← Back to login
          </span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {submitted ? (
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-accent mx-auto mb-6" />
              <h1 className="font-serif text-3xl font-bold text-white mb-3">Check your email</h1>
              <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                If <span className="text-white">{email}</span> is an authorised manager email, a
                reset link has been sent. It expires in 15 minutes.
              </p>
              <p className="text-zinc-700 text-xs leading-relaxed mb-6">
                Check your spam folder if you don't see it. The shared password reset applies to
                all managers.
              </p>
              <Link href="/login">
                <span className="text-accent text-sm hover:underline cursor-pointer">← Back to login</span>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-8">
                <Shield className="w-5 h-5 text-accent" />
                <div className="h-[1px] flex-1 bg-zinc-900" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-white mb-2">Forgot password?</h1>
              <p className="text-zinc-600 text-sm mb-10">
                Enter your authorised manager email and we'll send a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                    Manager Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="manager@example.com"
                      autoComplete="email"
                      className="w-full bg-zinc-950 border border-zinc-800 py-3 pl-10 pr-4 text-white text-sm placeholder-zinc-700 focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-red-900/50 bg-red-950/20 px-4 py-3 text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-3 w-full bg-accent text-black font-bold py-3 hover:bg-white transition-colors disabled:opacity-50 text-sm uppercase tracking-wider mt-2"
                >
                  {loading ? "Sending..." : (
                    <>
                      Send Reset Link
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
