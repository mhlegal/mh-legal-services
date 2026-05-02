import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  LogOut, Users, Filter, Download, Shield, RefreshCw,
  CheckCircle, XCircle, MapPin, FileText, ChevronDown,
  Eye, AlertTriangle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiJson } from "@/lib/api";

const PROVINCES = [
  "all", "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
  "Limpopo", "Mpumalanga", "North West", "Northern Cape", "Western Cape",
];

interface Application {
  id: number;
  full_names: string;
  sa_id_number: string;
  physical_address: string;
  email: string;
  stipend_status: boolean;
  province: string;
  training_letter_path: string | null;
  created_at: string;
}

function StatCard({ label, value, icon: Icon, color = "text-[#C9A961]" }: {
  label: string; value: number | string; icon: any; color?: string;
}) {
  return (
    <div className="bg-[#111] border border-white/8 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-white/40 text-xs uppercase tracking-wider">{label}</span>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [stipendFilter, setStipendFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (provinceFilter !== "all") params.set("province", provinceFilter);
      if (stipendFilter !== "all") params.set("stipend", stipendFilter);
      const data = await apiJson<{ applications: Application[] }>(`/applications?${params}`);
      setApplications(data.applications);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [provinceFilter, stipendFilter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  async function handleLogout() {
    await logout();
    setLocation("/login");
  }

  function downloadCSV() {
    const headers = ["ID", "Full Names", "SA ID", "Email", "Province", "Stipend", "Submitted"];
    const rows = applications.map((a) => [
      a.id, `"${a.full_names}"`, a.sa_id_number, a.email,
      a.province, a.stipend_status ? "Yes" : "No",
      new Date(a.created_at).toLocaleDateString("en-ZA"),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mhlegal-applications-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const total = applications.length;
  const withStipend = applications.filter((a) => a.stipend_status).length;
  const withLetter = applications.filter((a) => a.training_letter_path).length;

  const grouped = PROVINCES.filter((p) => p !== "all").reduce<Record<string, Application[]>>((acc, p) => {
    const items = applications.filter((a) => a.province === p);
    if (items.length > 0) acc[p] = items;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/8 bg-[#0a0a0a]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-[#C9A961]/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#C9A961]" />
            </div>
            <div>
              <h1 className="font-playfair text-white text-lg leading-none">Manager Dashboard</h1>
              <p className="text-white/30 text-xs mt-0.5">MH Legal Services Pty Ltd</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-white text-sm font-medium">{user?.email}</p>
              <p className="text-[#C9A961] text-xs">{user?.isMasterAdmin ? "Master Admin" : "Manager"}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors border border-white/10 px-3 py-2 rounded-lg hover:border-white/20"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {user?.isMasterAdmin && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-[#C9A961]/5 border border-[#C9A961]/20 rounded-xl px-5 py-3 flex items-center gap-3"
          >
            <Shield className="w-4 h-4 text-[#C9A961]" />
            <p className="text-[#C9A961] text-sm font-medium">
              You are logged in as Master Admin — full system access active
            </p>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Applications" value={total} icon={Users} />
          <StatCard label="With Stipend" value={withStipend} icon={CheckCircle} color="text-green-400" />
          <StatCard label="No Stipend" value={total - withStipend} icon={XCircle} color="text-white/40" />
          <StatCard label="Letter Uploaded" value={withLetter} icon={FileText} color="text-blue-400" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/30" />
            <span className="text-white/40 text-sm">Filter:</span>
          </div>
          <div className="relative">
            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm appearance-none pr-8 focus:outline-none focus:border-[#C9A961]/50"
            >
              {PROVINCES.map((p) => (
                <option key={p} value={p} className="bg-[#111]">
                  {p === "all" ? "All Provinces" : p}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={stipendFilter}
              onChange={(e) => setStipendFilter(e.target.value)}
              className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm appearance-none pr-8 focus:outline-none focus:border-[#C9A961]/50"
            >
              <option value="all" className="bg-[#111]">All Stipend</option>
              <option value="yes" className="bg-[#111]">Stipend: Yes</option>
              <option value="no" className="bg-[#111]">Stipend: No</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
          </div>
          <button
            onClick={fetchApplications}
            className="flex items-center gap-2 border border-white/10 text-white/40 px-3 py-2 rounded-lg hover:text-white hover:border-white/20 text-sm transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 border border-[#C9A961]/30 text-[#C9A961] px-3 py-2 rounded-lg hover:bg-[#C9A961]/10 text-sm transition-colors ml-auto"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>

        {/* Applications */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-[#C9A961]/30 border-t-[#C9A961] rounded-full animate-spin" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-24">
            <AlertTriangle className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30">No applications found matching your filters.</p>
          </div>
        ) : provinceFilter !== "all" ? (
          /* flat list when filtering by province */
          <div className="space-y-3">
            {applications.map((app) => (
              <ApplicationRow
                key={app.id}
                app={app}
                expanded={expandedId === app.id}
                onToggle={() => setExpandedId(expandedId === app.id ? null : app.id)}
              />
            ))}
          </div>
        ) : (
          /* grouped by province */
          <div className="space-y-8">
            {Object.entries(grouped).map(([province, apps]) => (
              <div key={province}>
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-4 h-4 text-[#C9A961]" />
                  <h2 className="text-[#C9A961] font-medium">{province}</h2>
                  <span className="text-white/20 text-sm">({apps.length})</span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                <div className="space-y-3">
                  {apps.map((app) => (
                    <ApplicationRow
                      key={app.id}
                      app={app}
                      expanded={expandedId === app.id}
                      onToggle={() => setExpandedId(expandedId === app.id ? null : app.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ApplicationRow({
  app, expanded, onToggle,
}: {
  app: Application;
  expanded: boolean;
  onToggle: () => void;
}) {
  const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <div className="bg-[#111] border border-white/8 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-[#C9A961]/10 flex items-center justify-center flex-shrink-0">
          <span className="text-[#C9A961] text-xs font-bold">#{app.id}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium truncate">{app.full_names}</p>
          <p className="text-white/30 text-xs">{app.email}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
            app.stipend_status
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-white/5 border-white/10 text-white/30"
          }`}>
            {app.stipend_status ? "Stipend" : "No Stipend"}
          </span>
          <span className="text-white/20 text-xs hidden md:block">
            {new Date(app.created_at).toLocaleDateString("en-ZA")}
          </span>
          <ChevronDown className={`w-4 h-4 text-white/20 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-white/5 px-4 pb-4 pt-4"
        >
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-white/30 text-xs uppercase tracking-wider mb-1">SA ID Number</p>
              <p className="text-white font-mono">{app.sa_id_number}</p>
            </div>
            <div>
              <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Province</p>
              <p className="text-white">{app.province || "—"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Physical Address</p>
              <p className="text-white">{app.physical_address}</p>
            </div>
            <div>
              <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Submitted</p>
              <p className="text-white">{new Date(app.created_at).toLocaleString("en-ZA")}</p>
            </div>
            <div>
              <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Training Letter</p>
              {app.training_letter_path ? (
                <a
                  href={`${BASE}/api/applications/${app.id}/letter`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#C9A961] hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View / Download
                </a>
              ) : (
                <p className="text-white/20">Not uploaded</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
