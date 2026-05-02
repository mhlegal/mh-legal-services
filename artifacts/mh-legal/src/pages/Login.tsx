import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, Shield, ArrowRight } from "lucide-react";

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
    } catch (err: any) {
      setError(err.message ?? "Login failed. Please check your credentials.");
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
            <span className="text-white">MHLOPHE HOLDINGS</span>
            <span className="text-accent ml-1">LEGAL</span>
          </div>
        </Link>
        <Link href="/">
          <span className="text-zinc-600 text-xs uppercase tracking-widest hover:text-accent transition-colors cursor-pointer">
            ← Back to site
          </span>
        </Link>
      </div>

      {/* Body */}
      <div className="flex-1 flex">
        {/* Left — branding panel */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 bg-zinc-950 border-r border-zinc-900 p-16 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent opacity-5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-12">
              <Shield className="w-8 h-8 text-accent" />
              <div className="h-[1px] w-12 bg-accent" />
              <span className="text-accent uppercase tracking-widest text-xs font-semibold">Secure Access</span>
            </div>
            <h2 className="font-serif text-4xl font-bold text-white leading-tight mb-6">
              Manager Portal.<br />
              <span className="text-zinc-600 font-light italic">Authorised Access Only.</span>
            </h2>
            <p className="text-zinc-500 leading-relaxed">
              Access is restricted to the four authorised managers of MH Legal Services Pty Ltd. All login activity is monitored, logged, and reported.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            {[
              "Session-based secure authentication",
              "Activity logged to audit trail",
              "Security alerts sent to master admin",
              "8-hour session timeout",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-zinc-500">
                <div className="w-1 h-1 bg-accent shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-accent" />
              <span className="text-accent uppercase tracking-widest text-xs font-semibold">Sign In</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-white mb-2">Manager Login</h1>
            <p className="text-zinc-600 text-sm mb-10">Enter your authorised email and shared password.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                  Email Address
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

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Admin password"
                    autoComplete="current-password"
                    className="w-full bg-zinc-950 border border-zinc-800 py-3 pl-10 pr-12 text-white text-sm placeholder-zinc-700 focus:outline-none focus:border-accent transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
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
                {loading ? "Verifying..." : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-zinc-700 text-xs text-center mt-8 leading-relaxed">
              Access is restricted to authorised personnel only.<br />All logins are monitored and logged.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
