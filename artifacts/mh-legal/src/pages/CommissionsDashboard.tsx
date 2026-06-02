import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Shield, LogOut, ChevronDown, ChevronUp,
  Trash2, RefreshCw, AlertTriangle, CheckCircle,
  DollarSign, Users, FileText, Calendar, ArrowRight,
  X, Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiJson, apiFetch, BASE } from "@/lib/api";

const PAYMENTS_ALLOWED = ["ngobesesimangaliso47@gmail.com", "mhlopheholdings@gmail.com"];

interface AgentTotal {
  agent_name: string;
  total_amount: string;
  policy_count: string;
}
interface Entry {
  id: number;
  statement_id: number;
  agent_name: string;
  policy_number: string;
  client_name: string;
  amount: string;
  fortnight_start: string;
  fortnight_end: string;
  file_name: string;
  uploaded_by: string;
  statement_uploaded_at: string;
}
interface Statement {
  id: number;
  file_name: string;
  uploaded_by: string;
  fortnight_start: string;
  fortnight_end: string;
  created_at: string;
}
interface Fortnight {
  fortnight_start: string;
  fortnight_end: string;
}
interface Summary {
  fortnight: { start: string; end: string };
  agentTotals: AgentTotal[];
  entries: Entry[];
  statements: Statement[];
}

function fmt(amount: string | number) {
  return `R ${Number(amount).toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function CommissionsDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  if (!user || !PAYMENTS_ALLOWED.includes(user.email)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center border border-zinc-900 p-16 max-w-md">
          <Shield className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-white mb-3">Access Restricted</h2>
          <p className="text-zinc-500 text-sm mb-6">This page is only accessible to authorised administrators.</p>
          <Link href="/admin">
            <span className="text-accent text-sm hover:underline cursor-pointer">← Back to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  async function handleLogout() {
    await logout();
    setLocation("/login");
  }

  return (
    <div className="min-h-screen bg-black text-white">
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
              <DollarSign className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Commission Payments</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/admin">
              <span className="text-zinc-600 text-xs uppercase tracking-wider hover:text-accent transition-colors cursor-pointer hidden sm:block">← Manager Dashboard</span>
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 border border-zinc-800 text-zinc-400 hover:border-white hover:text-white text-xs uppercase tracking-wider px-4 py-2 transition-colors font-semibold">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
        <div className="h-[2px] bg-gradient-to-r from-accent via-accent/50 to-transparent" />
      </header>

      <main className="container mx-auto px-4 md:px-8 py-12">
        <CommissionsContent />
      </main>
    </div>
  );
}

function CommissionsContent() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [fortnights, setFortnights] = useState<Fortnight[]>([]);
  const [selectedFortnight, setSelectedFortnight] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: "entry" | "statement"; id: number } | null>(null);

  const fetchSummary = useCallback(async (fortnightStart?: string) => {
    setLoading(true);
    try {
      const params = fortnightStart ? `?fortnightStart=${encodeURIComponent(fortnightStart)}` : "";
      const data = await apiJson<Summary>(`/commissions/summary${params}`);
      setSummary(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFortnights = useCallback(async () => {
    try {
      const data = await apiJson<{ fortnights: Fortnight[] }>("/commissions/fortnights");
      setFortnights(data.fortnights);
    } catch {}
  }, []);

  useEffect(() => {
    fetchSummary();
    fetchFortnights();
  }, [fetchSummary, fetchFortnights]);

  async function handleFile(file: File) {
    const allowed = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic", "image/heif"];
    if (!allowed.includes(file.type) && !file.type.startsWith("image/")) {
      setUploadResult({ success: false, message: "Only PDF or image files are supported (JPG, PNG, PDF, WEBP)." });
      return;
    }
    setUploading(true);
    setUploadResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${BASE}/api/commissions/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setUploadResult({ success: true, message: `Extracted ${data.entryCount} entries from "${file.name}".` });
      await fetchSummary(selectedFortnight || undefined);
      await fetchFortnights();
    } catch (err: any) {
      setUploadResult({ success: false, message: err.message ?? "Upload failed. Please try again." });
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(type: "entry" | "statement", id: number) {
    try {
      await apiJson(`/commissions/${type === "entry" ? "entries" : "statements"}/${id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      await fetchSummary(selectedFortnight || undefined);
    } catch {}
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  const totalCommission = summary?.agentTotals.reduce((sum, a) => sum + Number(a.total_amount), 0) ?? 0;
  const agentCount = summary?.agentTotals.length ?? 0;
  const policyCount = summary?.entries.length ?? 0;

  return (
    <>
      {/* Fortnight selector */}
      <div className="flex items-center gap-4 mb-10 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="h-[1px] w-12 bg-accent" />
          <Calendar className="w-4 h-4 text-accent" />
          <span className="text-accent uppercase tracking-widest text-xs font-semibold">
            {summary ? `${fmtDate(summary.fortnight.start)} — ${fmtDate(summary.fortnight.end)}` : "Loading..."}
          </span>
        </div>
        {fortnights.length > 0 && (
          <select
            value={selectedFortnight}
            onChange={(e) => {
              setSelectedFortnight(e.target.value);
              fetchSummary(e.target.value || undefined);
            }}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs uppercase tracking-wide px-4 py-2 focus:outline-none focus:border-accent ml-auto"
          >
            <option value="">Current Fortnight</option>
            {fortnights.map((f) => (
              <option key={f.fortnight_start} value={f.fortnight_start}>
                {fmtDate(f.fortnight_start)} — {fmtDate(f.fortnight_end)}
              </option>
            ))}
          </select>
        )}
        <button onClick={() => fetchSummary(selectedFortnight || undefined)} className="text-zinc-600 hover:text-accent transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        <div className="border border-accent bg-accent/5 p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent/70">Total Commissions</span>
            <DollarSign className="w-4 h-4 text-accent/50" />
          </div>
          <p className="text-3xl font-serif font-bold text-accent">{fmt(totalCommission)}</p>
        </div>
        <div className="border border-zinc-900 bg-zinc-950 p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-600">Agents</span>
            <Users className="w-4 h-4 text-zinc-700" />
          </div>
          <p className="text-3xl font-serif font-bold text-white">{agentCount}</p>
        </div>
        <div className="border border-zinc-900 bg-zinc-950 p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-600">Policy Entries</span>
            <FileText className="w-4 h-4 text-zinc-700" />
          </div>
          <p className="text-3xl font-serif font-bold text-white">{policyCount}</p>
        </div>
      </div>

      {/* Upload zone */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] w-8 bg-accent" />
          <span className="text-accent uppercase tracking-widest text-xs font-semibold">Upload Statement</span>
        </div>
        <label
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center border-2 border-dashed py-16 px-8 cursor-pointer transition-colors ${dragOver ? "border-accent bg-accent/5" : "border-zinc-800 hover:border-zinc-600 bg-zinc-950"}`}
        >
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.heif,image/*,application/pdf"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-accent animate-spin" />
              <p className="text-white font-semibold text-sm">Processing statement with AI...</p>
              <p className="text-zinc-500 text-xs">Extracting agent names, policy numbers, client names and amounts</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center">
              <Upload className="w-10 h-10 text-zinc-600" />
              <div>
                <p className="text-white font-semibold text-sm mb-1">Drop your Emerald statement here</p>
                <p className="text-zinc-500 text-xs">Supports PDF documents and images (JPG, PNG, WEBP) from your gallery or drive</p>
              </div>
              <span className="text-accent text-xs font-semibold uppercase tracking-wider border border-accent/30 px-4 py-2 mt-2">
                Browse Files
              </span>
            </div>
          )}
        </label>

        <AnimatePresence>
          {uploadResult && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-4 flex items-start gap-3 px-5 py-4 border ${uploadResult.success ? "border-green-800 bg-green-900/10 text-green-400" : "border-red-800 bg-red-900/10 text-red-400"}`}
            >
              {uploadResult.success ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />}
              <span className="text-sm">{uploadResult.message}</span>
              <button onClick={() => setUploadResult(null)} className="ml-auto text-zinc-600 hover:text-zinc-400"><X className="w-4 h-4" /></button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Agent totals */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      ) : summary?.agentTotals.length === 0 ? (
        <div className="text-center py-24 border border-zinc-900">
          <FileText className="w-10 h-10 text-zinc-800 mx-auto mb-4" />
          <p className="text-zinc-600 text-sm uppercase tracking-widest font-semibold">No commission data for this period</p>
          <p className="text-zinc-700 text-xs mt-2">Upload a statement above to populate this dashboard</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-8 bg-accent" />
            <span className="text-accent uppercase tracking-widest text-xs font-semibold">Agent Commissions</span>
          </div>
          <div className="space-y-2 mb-16">
            {summary?.agentTotals.map((agent) => {
              const agentEntries = summary.entries.filter((e) => e.agent_name === agent.agent_name);
              const isExpanded = expandedAgent === agent.agent_name;
              return (
                <div key={agent.agent_name} className="border border-zinc-900 hover:border-zinc-700 transition-colors">
                  <button
                    onClick={() => setExpandedAgent(isExpanded ? null : agent.agent_name)}
                    className="w-full flex items-center gap-6 px-6 py-5 text-left hover:bg-zinc-950 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-base">{agent.agent_name}</p>
                      <p className="text-zinc-600 text-xs mt-0.5">{agent.policy_count} {Number(agent.policy_count) === 1 ? "policy" : "policies"}</p>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="text-right">
                        <p className="text-accent font-serif font-bold text-xl">{fmt(agent.total_amount)}</p>
                        <p className="text-zinc-700 text-xs uppercase tracking-wider">Total Commission</p>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-600" /> : <ChevronDown className="w-4 h-4 text-zinc-600" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-zinc-900 px-6 py-4">
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-zinc-900">
                                  <th className="text-left text-[10px] font-semibold uppercase tracking-widest text-zinc-600 pb-3 pr-4">Policy Number</th>
                                  <th className="text-left text-[10px] font-semibold uppercase tracking-widest text-zinc-600 pb-3 pr-4">Client Name</th>
                                  <th className="text-right text-[10px] font-semibold uppercase tracking-widest text-zinc-600 pb-3 pr-4">Amount</th>
                                  <th className="text-left text-[10px] font-semibold uppercase tracking-widest text-zinc-600 pb-3 pr-4">Statement</th>
                                  <th className="pb-3"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {agentEntries.map((entry) => (
                                  <tr key={entry.id} className="border-b border-zinc-900/50 hover:bg-zinc-950/50">
                                    <td className="py-3 pr-4 text-white font-mono text-xs">{entry.policy_number || "—"}</td>
                                    <td className="py-3 pr-4 text-zinc-300">{entry.client_name || "—"}</td>
                                    <td className="py-3 pr-4 text-accent font-semibold text-right">{fmt(entry.amount)}</td>
                                    <td className="py-3 pr-4 text-zinc-600 text-xs truncate max-w-[180px]">{entry.file_name}</td>
                                    <td className="py-3">
                                      <button
                                        onClick={() => setDeleteConfirm({ type: "entry", id: entry.id })}
                                        className="text-zinc-700 hover:text-red-400 transition-colors"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot>
                                <tr>
                                  <td colSpan={2} className="pt-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Total</td>
                                  <td className="pt-4 text-accent font-serif font-bold text-base text-right">{fmt(agent.total_amount)}</td>
                                  <td colSpan={2}></td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Uploaded statements list */}
          {summary?.statements && summary.statements.length > 0 && (
            <>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-8 bg-accent" />
                <span className="text-accent uppercase tracking-widest text-xs font-semibold">Uploaded Statements</span>
              </div>
              <div className="space-y-2">
                {summary.statements.map((stmt) => (
                  <div key={stmt.id} className="flex items-center gap-4 px-6 py-4 border border-zinc-900 hover:border-zinc-700 transition-colors">
                    <FileText className="w-4 h-4 text-zinc-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{stmt.file_name}</p>
                      <p className="text-zinc-600 text-xs">Uploaded by {stmt.uploaded_by} · {fmtDate(stmt.created_at)}</p>
                    </div>
                    <button
                      onClick={() => setDeleteConfirm({ type: "statement", id: stmt.id })}
                      className="text-zinc-700 hover:text-red-400 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-950 border border-zinc-800 p-8 max-w-sm w-full"
            >
              <AlertTriangle className="w-8 h-8 text-red-400 mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Confirm Delete</h3>
              <p className="text-zinc-500 text-sm mb-6">
                {deleteConfirm.type === "statement"
                  ? "This will delete the statement and all its entries. This cannot be undone."
                  : "This will delete this entry. This cannot be undone."}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(deleteConfirm.type, deleteConfirm.id)}
                  className="flex-1 bg-red-700 hover:bg-red-600 text-white text-xs uppercase tracking-wider font-bold px-4 py-3 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 border border-zinc-700 text-zinc-400 hover:border-white hover:text-white text-xs uppercase tracking-wider font-bold px-4 py-3 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
