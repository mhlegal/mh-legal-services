import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, Shield } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      setLocation("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top bar */}
      <div className="border-b border-zinc-900 px-8 py-5 flex items-center justify-between">
        <div className="font-bold text-lg tracking-wider flex items-center gap-1">
          <span className="text-white">MH LEGAL</span>
          <span style={{ color: "#C9A961" }} className="ml-1">SERVICES</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex">
        {/* Left — branding panel */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 bg-zinc-950 border-r border-zinc-900 p-16 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: "#C9A961" }} />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-12">
              <Shield className="w-8 h-8" style={{ color: "#C9A961" }} />
              <div className="h-[1px] w-12" style={{ background: "#C9A961" }} />
              <span className="uppercase tracking-widest text-xs font-semibold" style={{ color: "#C9A961" }}>Secure Access</span>
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-6">
              Manager Portal.<br />
              <span className="text-zinc-600 font-light italic">Authorised Access Only.</span>
            </h2>
            <p className="text-zinc-500 leading-relaxed">
              Access is restricted to authorised managers of MH LEGAL SERVICES Pty Ltd. All login activity is monitored, logged, and reported.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            {["Session-based authentication", "Activity logging on every login", "IP address recorded"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#C9A961" }} />
                <span className="text-zinc-500 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — login form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-white mb-2">Sign in</h1>
              <p className="text-zinc-500 text-sm">Enter your credentials to access the manager portal.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-zinc-400 text-xs uppercase tracking-widest font-semibold">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="manager@mhlegal.co.za"
                    className="w-full bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-700 rounded-lg pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-zinc-600 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-zinc-400 text-xs uppercase tracking-widest font-semibold">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-700 rounded-lg pl-11 pr-12 py-3.5 text-sm focus:outline-none focus:border-zinc-600 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-950/40 border border-red-900/50 rounded-lg px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed text-black"
                style={{ background: loading ? "#a08040" : "#C9A961" }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  "Sign In to Portal"
                )}
              </button>
            </form>

            <p className="text-zinc-700 text-xs text-center mt-8">
              MH Legal Services Pty Ltd · All sessions are monitored
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
