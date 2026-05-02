import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import {
  LogOut, Users, Filter, Download, Shield,
  RefreshCw, CheckCircle, XCircle, MapPin,
  FileText, ChevronDown, Eye, AlertTriangle, ArrowRight,
  BarChart2, UserCheck, Plus, Trash2, Activity, TrendingUp,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiJson } from "@/lib/api";

const PROVINCES = [
  "all", "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
  "Limpopo", "Mpumalanga", "North West", "Northern Cape", "Western Cape",
];

const PROVINCES_FORM = PROVINCES.filter((p) => p !== "all");

type Tab = "applications" | "agents" | "traffic";

interface Application {
  id: number; full_names: string; sa_id_number: string;
  physical_address: string; email: string; stipend_status: boolean;
  province: string; training_letter_path: string | null; created_at: string;
}
interface AgentReport {
  id: number; submitted_by: string; agent_count: number;
  province: string; period: string; notes: string | null; created_at: string;
}
interface TrafficData {
  totalVisits: number;
  byPage: { path: string; count: number }[];
  daily: { day: string; count: number }[];
  recent: { path: string; visited_at: string }[];
}

function StatCard({ label, value, icon: Icon, accent = false }: {
  label: string; value: number | string; icon: any; accent?: boolean;
}) {
  return (
    <div className={`border p-8 ${accent ? "bg-accent border-accent" : "bg-zinc-950 border-zinc-900"}`}>
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-semibold uppercase tracking-widest ${accent ? "text-black/60" : "text-zinc-600"}`}>{label}</span>
        <Icon className={`w-4 h-4 ${accent ? "text-black/50" : "text-zinc-700"}`} />
      </div>
      <p className={`text-4xl font-serif font-bold ${accent ? "text-black" : "text-white"}`}>{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<Tab>("applications");

  async function handleLogout() {
    await logout();
    setLocation("/login");
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-900 sticky top-0 z-40 bg-black">
        <div className="container mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/">
              <div className="font-serif font-bold text-base tracking-wider cursor-pointer flex items-center gap-1">
                <span className="text-white">MH LEGAL</span>
                <span className="text-accent ml-1">SERVICES</span>
              </div>
            </Link>
            <div className="h-5 w-px bg-zinc-800" />
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Manager Dashboard</span>
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
        <div className="h-[2px] bg-gradient-to-r from-accent via-accent/50 to-transparent" />
      </header>

      <main className="container mx-auto px-4 md:px-8 py-12">
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

        {/* Tabs */}
        <div className="flex items-center gap-0 border-b border-zinc-900 mb-10">
          {([
            { id: "applications", label: "Applications", icon: FileText },
            { id: "agents", label: "Agent Reports", icon: UserCheck },
            { id: "traffic", label: "Site Traffic", icon: BarChart2 },
          ] as { id: Tab; label: string; icon: any }[]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-semibold uppercase tracking-widest transition-colors border-b-2 -mb-px ${
                tab === id
                  ? "border-accent text-accent"
                  : "border-transparent text-zinc-600 hover:text-zinc-400"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {tab === "applications" && <ApplicationsTab />}
        {tab === "agents" && <AgentReportsTab currentEmail={user?.email ?? ""} />}
        {tab === "traffic" && <TrafficTab />}
      </main>
    </div>
  );
}

/* ─── APPLICATIONS TAB ─── */
function ApplicationsTab() {
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
    } catch { } finally { setLoading(false); }
  }, [provinceFilter, stipendFilter]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

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
    a.href = url; a.download = `mhlegal-applications-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  const total = applications.length;
  const withStipend = applications.filter((a) => a.stipend_status).length;
  const withLetter = applications.filter((a) => a.training_letter_path).length;
  const grouped = PROVINCES_FORM.reduce<Record<string, Application[]>>((acc, p) => {
    const items = applications.filter((a) => a.province === p);
    if (items.length > 0) acc[p] = items;
    return acc;
  }, {});

  return (
    <>
      <div className="flex items-center gap-4 mb-10">
        <div className="h-[1px] w-12 bg-accent" />
        <span className="text-accent uppercase tracking-widest text-xs font-semibold">Overview</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard label="Total Applications" value={total} icon={Users} accent />
        <StatCard label="With Stipend" value={withStipend} icon={CheckCircle} />
        <StatCard label="No Stipend" value={total - withStipend} icon={XCircle} />
        <StatCard label="Letter Uploaded" value={withLetter} icon={FileText} />
      </div>

      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-[1px] w-8 bg-accent" />
          <span className="text-accent uppercase tracking-widest text-xs font-semibold">Applications</span>
        </div>
        <div className="flex items-center gap-3 ml-auto flex-wrap">
          <Filter className="w-3.5 h-3.5 text-zinc-600" />
          <div className="relative">
            <select value={provinceFilter} onChange={(e) => setProvinceFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 px-4 py-2 text-white text-xs appearance-none pr-8 focus:outline-none focus:border-accent uppercase tracking-wider font-semibold">
              {PROVINCES.map((p) => <option key={p} value={p} className="bg-black normal-case font-normal">{p === "all" ? "All Provinces" : p}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600 pointer-events-none" />
          </div>
          <div className="relative">
            <select value={stipendFilter} onChange={(e) => setStipendFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 px-4 py-2 text-white text-xs appearance-none pr-8 focus:outline-none focus:border-accent uppercase tracking-wider font-semibold">
              <option value="all" className="bg-black font-normal normal-case">All Stipend</option>
              <option value="yes" className="bg-black font-normal normal-case">Stipend: Yes</option>
              <option value="no" className="bg-black font-normal normal-case">Stipend: No</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600 pointer-events-none" />
          </div>
          <button onClick={fetchApplications}
            className="flex items-center gap-2 border border-zinc-800 text-zinc-500 hover:border-white hover:text-white text-xs uppercase tracking-wider px-4 py-2 transition-colors font-semibold">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button onClick={downloadCSV}
            className="flex items-center gap-2 bg-accent text-black text-xs uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors font-bold">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-zinc-800 border-t-accent animate-spin" />
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-32 border border-zinc-900">
          <AlertTriangle className="w-10 h-10 text-zinc-800 mx-auto mb-4" />
          <p className="text-zinc-600 text-sm uppercase tracking-widest font-semibold">No applications found</p>
        </div>
      ) : provinceFilter !== "all" ? (
        <div className="space-y-2">
          {applications.map((app) => (
            <ApplicationRow key={app.id} app={app} expanded={expandedId === app.id} onToggle={() => setExpandedId(expandedId === app.id ? null : app.id)} />
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
                  <ApplicationRow key={app.id} app={app} expanded={expandedId === app.id} onToggle={() => setExpandedId(expandedId === app.id ? null : app.id)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function ApplicationRow({ app, expanded, onToggle }: { app: Application; expanded: boolean; onToggle: () => void }) {
  const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <div className="border border-zinc-900 hover:border-zinc-700 transition-colors">
      <button onClick={onToggle} className="w-full flex items-center gap-6 px-6 py-4 text-left hover:bg-zinc-950 transition-colors">
        <span className="text-accent font-serif font-bold text-sm w-10 shrink-0">#{app.id}</span>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{app.full_names}</p>
          <p className="text-zinc-600 text-xs">{app.email}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 border ${app.stipend_status ? "border-accent/40 text-accent bg-accent/5" : "border-zinc-800 text-zinc-600"}`}>
            {app.stipend_status ? "Stipend" : "No Stipend"}
          </span>
          <span className="text-zinc-700 text-xs hidden md:block">{new Date(app.created_at).toLocaleDateString("en-ZA")}</span>
          <ChevronDown className={`w-4 h-4 text-zinc-700 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </button>
      {expanded && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="border-t border-zinc-900 px-6 py-6">
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
                <a href={`${BASE}/api/applications/${app.id}/letter`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-accent hover:text-white transition-colors text-sm font-semibold uppercase tracking-wider">
                  <Eye className="w-3.5 h-3.5" /> View / Download <ArrowRight className="w-3.5 h-3.5" />
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

/* ─── AGENT REPORTS TAB ─── */
function AgentReportsTab({ currentEmail }: { currentEmail: string }) {
  const [reports, setReports] = useState<AgentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ agentCount: "", province: "", period: currentPeriod(), notes: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function currentPeriod() {
    return new Date().toLocaleString("default", { month: "long", year: "numeric" });
  }

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiJson<{ reports: AgentReport[] }>("/agent-reports");
      setReports(data.reports);
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess("");
    const count = parseInt(form.agentCount);
    if (isNaN(count) || count < 0) { setError("Agent count must be a valid number."); return; }
    if (!form.province) { setError("Please select a province."); return; }
    if (!form.period.trim()) { setError("Please enter a period."); return; }
    setSubmitting(true);
    try {
      await apiJson("/agent-reports", {
        method: "POST",
        body: JSON.stringify({ agentCount: count, province: form.province, period: form.period, notes: form.notes || undefined }),
      });
      setSuccess("Report submitted successfully.");
      setForm({ agentCount: "", province: "", period: currentPeriod(), notes: "" });
      setShowForm(false);
      fetchReports();
    } catch {
      setError("Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this report?")) return;
    try {
      await apiJson(`/agent-reports/${id}`, { method: "DELETE" });
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch { }
  }

  const totalAgents = reports.reduce((sum, r) => sum + r.agent_count, 0);
  const byProvince = PROVINCES_FORM.reduce<Record<string, number>>((acc, p) => {
    const latest = reports.filter((r) => r.province === p).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    if (latest) acc[p] = latest.agent_count;
    return acc;
  }, {});

  return (
    <>
      <div className="flex items-center gap-4 mb-10 flex-wrap">
        <div className="h-[1px] w-12 bg-accent" />
        <span className="text-accent uppercase tracking-widest text-xs font-semibold">Agent Reports</span>
        <button onClick={() => setShowForm((v) => !v)}
          className="ml-auto flex items-center gap-2 bg-accent text-black text-xs uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors font-bold">
          <Plus className="w-3.5 h-3.5" /> Submit Report
        </button>
      </div>

      {success && (
        <div className="mb-6 flex items-center gap-3 border border-accent/30 bg-accent/5 px-5 py-3 text-accent text-sm font-semibold">
          <CheckCircle className="w-4 h-4" /> {success}
        </div>
      )}

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="mb-10 border border-zinc-800 bg-zinc-950 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-8 bg-accent" />
            <span className="text-accent uppercase tracking-widest text-xs font-semibold">New Agent Report</span>
          </div>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Number of Agents *</label>
              <input type="number" min="0" value={form.agentCount} onChange={(e) => setForm((f) => ({ ...f, agentCount: e.target.value }))}
                className="w-full bg-black border border-zinc-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="e.g. 12" required />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Province *</label>
              <div className="relative">
                <select value={form.province} onChange={(e) => setForm((f) => ({ ...f, province: e.target.value }))}
                  className="w-full bg-black border border-zinc-800 text-white px-4 py-3 text-sm appearance-none pr-8 focus:outline-none focus:border-accent transition-colors">
                  <option value="">Select province…</option>
                  {PROVINCES_FORM.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Period *</label>
              <input type="text" value={form.period} onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
                className="w-full bg-black border border-zinc-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="e.g. May 2026" required />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Notes (optional)</label>
              <input type="text" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="w-full bg-black border border-zinc-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="Any additional context" />
            </div>
            {error && (
              <div className="md:col-span-2 flex items-center gap-2 text-red-400 text-xs font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" /> {error}
              </div>
            )}
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={submitting}
                className="bg-accent text-black text-xs uppercase tracking-wider px-6 py-3 hover:bg-white transition-colors font-bold disabled:opacity-50">
                {submitting ? "Submitting…" : "Submit Report"}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="border border-zinc-800 text-zinc-500 hover:border-white hover:text-white text-xs uppercase tracking-wider px-6 py-3 transition-colors font-semibold">
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Province summary */}
      {Object.keys(byProvince).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard label="Total Agents Reported" value={totalAgents} icon={UserCheck} accent />
          {Object.entries(byProvince).slice(0, 3).map(([p, count]) => (
            <StatCard key={p} label={p} value={count} icon={MapPin} />
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-zinc-800 border-t-accent animate-spin" />
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-32 border border-zinc-900">
          <UserCheck className="w-10 h-10 text-zinc-800 mx-auto mb-4" />
          <p className="text-zinc-600 text-sm uppercase tracking-widest font-semibold">No reports yet</p>
          <p className="text-zinc-700 text-xs mt-2">Click "Submit Report" to log your agent count</p>
        </div>
      ) : (
        <div className="border border-zinc-900 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-900">
                {["Manager", "Province", "Period", "Agents", "Notes", "Submitted", ""].map((h) => (
                  <th key={h} className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-b border-zinc-900/50 hover:bg-zinc-950 transition-colors">
                  <td className="px-5 py-4 text-zinc-300 text-xs">{r.submitted_by}</td>
                  <td className="px-5 py-4 text-white font-medium text-xs">{r.province}</td>
                  <td className="px-5 py-4 text-zinc-400 text-xs">{r.period}</td>
                  <td className="px-5 py-4">
                    <span className="text-accent font-serif font-bold text-xl">{r.agent_count}</span>
                  </td>
                  <td className="px-5 py-4 text-zinc-500 text-xs max-w-[180px] truncate">{r.notes || "—"}</td>
                  <td className="px-5 py-4 text-zinc-600 text-xs">{new Date(r.created_at).toLocaleDateString("en-ZA")}</td>
                  <td className="px-5 py-4">
                    {r.submitted_by === currentEmail && (
                      <button onClick={() => handleDelete(r.id)}
                        className="text-zinc-700 hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

/* ─── TRAFFIC TAB ─── */
function TrafficTab() {
  const [traffic, setTraffic] = useState<TrafficData | null>(null);
  const [loading, setLoading] = useState(true);

  const PAGE_LABELS: Record<string, string> = {
    "/": "Home",
    "/about": "About Us",
    "/services": "Services",
    "/legal-services": "Legal Services",
    "/team": "Team",
    "/careers": "Careers",
    "/contact": "Contact",
    "/student-portal": "Student Portal",
    "/login": "Login",
  };

  const fetchTraffic = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiJson<TrafficData>("/analytics/traffic");
      setTraffic(data);
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchTraffic(); }, [fetchTraffic]);

  const maxCount = traffic ? Math.max(...traffic.byPage.map((p) => p.count), 1) : 1;
  const maxDaily = traffic ? Math.max(...traffic.daily.map((d) => d.count), 1) : 1;

  return (
    <>
      <div className="flex items-center gap-4 mb-10 flex-wrap">
        <div className="h-[1px] w-12 bg-accent" />
        <span className="text-accent uppercase tracking-widest text-xs font-semibold">Site Traffic</span>
        <button onClick={fetchTraffic}
          className="ml-auto flex items-center gap-2 border border-zinc-800 text-zinc-500 hover:border-white hover:text-white text-xs uppercase tracking-wider px-4 py-2 transition-colors font-semibold">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-zinc-800 border-t-accent animate-spin" />
        </div>
      ) : !traffic ? (
        <div className="text-center py-32 border border-zinc-900">
          <Activity className="w-10 h-10 text-zinc-800 mx-auto mb-4" />
          <p className="text-zinc-600 text-sm uppercase tracking-widest font-semibold">No traffic data yet</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="Total Page Views" value={traffic.totalVisits.toLocaleString()} icon={TrendingUp} accent />
            <StatCard label="Pages Tracked" value={traffic.byPage.length} icon={BarChart2} />
            <StatCard label="Last 30 Days" value={traffic.daily.reduce((s, d) => s + d.count, 0).toLocaleString()} icon={Activity} />
          </div>

          {/* By page bar chart */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-8 bg-accent" />
              <span className="text-accent uppercase tracking-widest text-xs font-semibold">Views by Page</span>
            </div>
            <div className="space-y-3">
              {traffic.byPage.map((p) => (
                <div key={p.path} className="flex items-center gap-4">
                  <div className="w-36 text-xs text-zinc-400 font-medium truncate shrink-0">
                    {PAGE_LABELS[p.path] ?? p.path}
                  </div>
                  <div className="flex-1 h-7 bg-zinc-950 border border-zinc-900 relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(p.count / maxCount) * 100}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="absolute inset-y-0 left-0 bg-accent/80"
                    />
                  </div>
                  <span className="text-white font-serif font-bold text-sm w-12 text-right shrink-0">{p.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily sparkline (last 30 days) */}
          {traffic.daily.length > 0 && (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-8 bg-accent" />
                <span className="text-accent uppercase tracking-widest text-xs font-semibold">Daily Views — Last 30 Days</span>
              </div>
              <div className="border border-zinc-900 bg-zinc-950 p-6">
                <div className="flex items-end gap-1 h-24">
                  {traffic.daily.map((d) => (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group relative" title={`${d.day}: ${d.count} views`}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.count / maxDaily) * 100}%` }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full bg-accent/70 group-hover:bg-accent transition-colors min-h-[2px]"
                      />
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-zinc-800 text-white text-[9px] px-2 py-0.5 whitespace-nowrap z-10">
                        {d.count}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-zinc-700 text-[10px]">
                  <span>{traffic.daily[0]?.day}</span>
                  <span>{traffic.daily[traffic.daily.length - 1]?.day}</span>
                </div>
              </div>
            </div>
          )}

          {/* Recent visits */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-8 bg-accent" />
              <span className="text-accent uppercase tracking-widest text-xs font-semibold">Recent Visits</span>
            </div>
            <div className="border border-zinc-900 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-900">
                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-600">Page</th>
                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-600">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {traffic.recent.map((v, i) => (
                    <tr key={i} className="border-b border-zinc-900/50 hover:bg-zinc-950 transition-colors">
                      <td className="px-5 py-3 text-zinc-300 text-xs">{PAGE_LABELS[v.path] ?? v.path}</td>
                      <td className="px-5 py-3 text-zinc-600 text-xs">{new Date(v.visited_at).toLocaleString("en-ZA")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
