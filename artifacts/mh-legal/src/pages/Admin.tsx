import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

export default function Admin() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  async function handleLogout() {
    await logout();
    setLocation("/login");
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="border-b border-zinc-900 px-8 py-5 flex items-center justify-between">
        <div className="font-bold text-lg tracking-wider">
          <span className="text-white">MH LEGAL</span>
          <span style={{ color: "#C9A961" }} className="ml-1">SERVICES</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-zinc-500 text-sm">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="text-zinc-500 hover:text-white text-sm transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "#C9A961" + "20", border: "1px solid #C9A961" + "40" }}>
            <span className="text-2xl" style={{ color: "#C9A961" }}>✓</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Manager Portal</h1>
          <p className="text-zinc-500">Welcome, {user?.email}</p>
          {user?.isMasterAdmin && (
            <span className="inline-block mt-2 text-xs uppercase tracking-widest px-3 py-1 rounded-full" style={{ color: "#C9A961", background: "#C9A961" + "15", border: "1px solid #C9A961" + "30" }}>
              Master Admin
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
