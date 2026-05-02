import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import {
  LogOut, Users, Filter, Download, Shield,
  RefreshCw, CheckCircle, XCircle, MapPin,
  FileText, ChevronDown, Eye, AlertTriangle, ArrowRight
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

function StatCard({ label, value, icon: Icon, accent = false }: {
  label: string; value: number | string; icon: any; accent?: boolean;
}) {
  return (
    <div className={`border p-8 ${accent ? "bg-accent border-accent" : "bg-zinc-950 border-zinc-900"}`}>
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-semibold uppercase tracking-widest ${accent ? "text-black/60" : "text-zinc-600"}`}>
          {label}
        </span>
        <Icon className={`w-4 h-4 ${accent ? "text-black/50" : "text-zinc-700"}`} />
      </div>
      <p className={`text-4xl font-serif font-bold ${accent ? "text-black" : "text-white"}`}>{value}</p>
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

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

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
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-900 sticky top-0 z-40 bg-black">
        <div className="container mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/">
              <div className="font-serif font-bold text-base tracking-wider cursor-pointer flex items-center gap-1">
                <span className="text-white">MHLOPHE HOLDINGS</span>
                <span className="text-accent ml-1">LEGAL</span>
              </div>
            </Link>
            <div className="h-5 w-px bg-zinc-800" />
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Manager Dashboard
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:block text-right">
              <p className="text-white text-sm font-medium">{user?.email}</p>
              <p className="text-accent text-xs font-semibold uppercase tracking-wider">
                {user?.isMasterAdmin ? "Master Admin" : "Manager"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-zinc-800 text-zinc-400 hover:border-white hover:text-white text-xs uppercase tracking-wider px-4 py-2 transition-colors font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
        {/* Gold accent bar */}
        <div className="h-[2px] bg-gradient-to-r from-accent via-accent/50 to-transparent" />
      </header>

      <main className="container mx-auto px-4 md:px-8 py-12">
        {/* Master Admin badge */}
        {user?.isMasterAdmin && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center gap-4 border border-accent/20 bg-accent/5 px-6 py-4"
          >
            <div className="h-[1px] w-8 bg-accent" />
            <Shield className="w-4 h-4 text-accent" />
            <p className="text-accent text-sm font-semibold uppercase tracking-widest">
              Master Admin — Full system access active
            </p>
          </motion.div>
        )}

        {/* Section label */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-[1px] w-12 bg-accent" />
          <span className="text-accent uppercase tracking-widest text-xs font-semibold">Overview</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard label="Total Applications" value={total} icon={Users} accent />
          <StatCard label="With Stipend" value={withStipend} icon={CheckCircle} />
          <StatCard label="No Stipend" value={total - withStipend} icon={XCircle} />
          <StatCard label="Letter Uploaded" value={withLetter} icon={FileText} />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-8 bg-accent" />
            <span className="text-accent uppercase tracking-widest text-xs font-semibold">Applications</span>
          </div>

          <div className="flex items-center gap-3 ml-auto flex-wrap">
            <Filter className="w-3.5 h-3.5 text-zinc-600" />

            <div className="relative">
              <select
                value={provinceFilter}
                onChange={(e) => setProvinceFilter(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 px-4 py-2 text-white text-xs appearance-none pr-8 focus:outline-none focus:border-accent uppercase tracking-wider font-semibold"
              >
                {PROVINCES.map((p) => (
                  <option key={p} value={p} className="bg-black normal-case font-normal">
                    {p === "all" ? "All Provinces" : p}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={stipendFilter}
                onChange={(e) => setStipendFilter(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 px-4 py-2 text-white text-xs appearance-none pr-8 focus:outline-none focus:border-accent uppercase tracking-wider font-semibold"
              >
                <option value="all" className="bg-black font-normal normal-case">All Stipend</option>
                <option value="yes" className="bg-black font-normal normal-case">Stipend: Yes</option>
                <option value="no" className="bg-black font-normal normal-case">Stipend: No</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600 pointer-events-none" />
            </div>

            <button
              onClick={fetchApplications}
              className="flex items-center gap-2 border border-zinc-800 text-zinc-500 hover:border-white hover:text-white text-xs uppercase tracking-wider px-4 py-2 transition-colors font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>

            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 bg-accent text-black text-xs uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Applications list */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-zinc-800 border-t-accent animate-spin" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-32 border border-zinc-900">
            <AlertTriangle className="w-10 h-10 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-600 text-sm uppercase tracking-widest font-semibold">
              No applications found
            </p>
          </div>
        ) : provinceFilter !== "all" ? (
          <div className="space-y-2">
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
          <div className="space-y-10">
            {Object.entries(grouped).map(([province, apps]) => (
              <div key={province}>
                <div className="flex items-center gap-4 mb-4">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="text-accent font-semibold text-sm uppercase tracking-widest">{province}</span>
                  <span className="text-zinc-700 text-xs">({apps.length})</span>
                  <div className="flex-1 h-px bg-zinc-900" />
                </div>
                <div className="space-y-2">
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

function ApplicationRow({ app, expanded, onToggle }: {
  app: Application; expanded: boolean; onToggle: () => void;
}) {
  const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <div className="border border-zinc-900 hover:border-zinc-700 transition-colors">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-6 px-6 py-4 text-left hover:bg-zinc-950 transition-colors"
      >
        <span className="text-accent font-serif font-bold text-sm w-10 shrink-0">#{app.id}</span>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{app.full_names}</p>
          <p className="text-zinc-600 text-xs">{app.email}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 border ${
            app.stipend_status
              ? "border-accent/40 text-accent bg-accent/5"
              : "border-zinc-800 text-zinc-600"
          }`}>
            {app.stipend_status ? "Stipend" : "No Stipend"}
          </span>
          <span className="text-zinc-700 text-xs hidden md:block">
            {new Date(app.created_at).toLocaleDateString("en-ZA")}
          </span>
          <ChevronDown className={`w-4 h-4 text-zinc-700 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="border-t border-zinc-900 px-6 py-6"
        >
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-2">SA ID Number</p>
              <p className="text-white font-mono">{app.sa_id_number}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-2">Province</p>
              <p className="text-white">{app.province || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-2">Submitted</p>
              <p className="text-white">{new Date(app.created_at).toLocaleString("en-ZA")}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-2">Physical Address</p>
              <p className="text-white">{app.physical_address}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-2">Training Letter</p>
              {app.training_letter_path ? (
                <a
                  href={`${BASE}/api/applications/${app.id}/letter`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-accent hover:text-white transition-colors text-sm font-semibold uppercase tracking-wider"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View / Download
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              ) : (
                <p className="text-zinc-700 text-xs uppercase tracking-wider">Not uploaded</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
