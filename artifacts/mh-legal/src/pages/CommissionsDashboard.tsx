import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Shield, LogOut, Trash2, RefreshCw, AlertTriangle,
  CheckCircle, DollarSign, Users, FileText, Calendar, X, Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiJson, BASE } from "@/lib/api";

const PAYMENTS_ALLOWED = ["ngobesesimangaliso47@gmail.com", "mhlopheholdings@gmail.com"];

interface AgentTotal { agent_name: string; total_amount: string; policy_count: string; }
interface Entry {
  id: number; statement_id: number; agent_name: string;
  policy_number: string; client_name: string; amount: string;
  fortnight_start: string; fortnight_end: string;
  file_name: string; uploaded_by: string; statement_uploaded_at: string;
}
interface Statement { id: number; file_name: string; uploaded_by: string; fortnight_start: string; fortnight_end: string; created_at: string; }
interface Fortnight { fortnight_start: string; fortnight_end: string; }
interface Summary { fortnight: { start: string; end: string }; agentTotals: AgentTotal[]; entries: Entry[]; statements: Statement[]; }

function fmt(amount: string | number) {
  return `R ${Number(amount).toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtDateTime(d: string) {
  return new Date(d).toLocaleString("en-ZA", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
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
          <Link href="/admin"><span className="text-accent text-sm hover:underline cursor-pointer">← Back to Dashboard</span></Link>
        </div>
      </div>
    );
  }

  async function handleLogout() { await logout(); setLocation("/login"); }

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
          <div className="flex items-center gap-4">
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
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: "entry" | "statement"; id: number } | null>(null);

  const fetchSummary = useCallback(async (fortnightStart?: string) => {
    setLoading(true);
    setFetchError(null);
    try {
      const params = fortnightStart ? `?fortnightStart=${encodeURIComponent(fortnightStart)}` : "";
      const data = await apiJson<Summary>(`/commissions/summary${params}`);
      setSummary(data);
    } catch (err: any) {
      setFetchError(err?.message ?? "Failed to load commission data");
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

  useEffect(() => { fetchSummary(); fetchFortnights(); }, [fetchSummary, fetchFortnights]);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
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
      // Always read as text first to avoid HTML parse errors
      const text = await res.text();
      let data: any = {};
      try { data = JSON.parse(text); } catch {
        throw new Error(res.ok ? "Server returned an unexpected response" : `Server error (${res.status})`);
      }
      if (!res.ok) throw new Error(data.error ?? `Upload failed (${res.status})`);
      setUploadResult({ success: true, message: `Extracted ${data.entryCount} ${data.entryCount === 1 ? "entry" : "entries"} from "${file.name}".` });
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

  const totalCommission = summary?.agentTotals.reduce((s, a) => s + Number(a.total_amount), 0) ?? 0;

  return (
    <>
      {/* Period selector row */}
      <div className="flex items-center gap-4 mb-10 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-[1px] w-8 bg-accent" />
          <Calendar className="w-4 h-4 text-accent" />
          <span className="text-accent uppercase tracking-widest text-xs font-semibold">
            {summary ? `${fmtDate(summary.fortnight.start)} — ${fmtDate(summary.fortnight.end)}` : "Loading period…"}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {fortnights.length > 0 && (
            <select
              value={selectedFortnight}
              onChange={(e) => { setSelectedFortnight(e.target.value); fetchSummary(e.target.value || undefined); }}
              className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs px-3 py-2 focus:outline-none focus:border-accent"
            >
              <option value="">Current Fortnight</option>
              {fortnights.map((f) => (
                <option key={f.fortnight_start} value={f.fortnight_start}>
                  {fmtDate(f.fortnight_start)} — {fmtDate(f.fortnight_end)}
                </option>
              ))}
            </select>
          )}
          <button onClick={() => fetchSummary(selectedFortnight || undefined)} className="text-zinc-600 hover:text-accent transition-colors p-1">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="border border-accent bg-accent/5 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent/70">Total Commissions</span>
            <DollarSign className="w-4 h-4 text-accent/50" />
          </div>
          <p className="text-2xl font-serif font-bold text-accent">{fmt(totalCommission)}</p>
        </div>
        <div className="border border-zinc-900 bg-zinc-950 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Agents</span>
            <Users className="w-4 h-4 text-zinc-700" />
          </div>
          <p className="text-2xl font-serif font-bold text-white">{summary?.agentTotals.length ?? 0}</p>
        </div>
        <div className="border border-zinc-900 bg-zinc-950 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Policy Entries</span>
            <FileText className="w-4 h-4 text-zinc-700" />
          </div>
          <p className="text-2xl font-serif font-bold text-white">{summary?.entries.length ?? 0}</p>
        </div>
      </div>

      {/* Upload zone */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-[1px] w-6 bg-accent" />
          <span className="text-accent uppercase tracking-widest text-xs font-semibold">Upload Emerald Statement</span>
        </div>
        <label
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center border-2 border-dashed py-12 px-8 cursor-pointer transition-colors ${dragOver ? "border-accent bg-accent/5" : "border-zinc-800 hover:border-zinc-600 bg-zinc-950"}`}
        >
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,image/*,application/pdf"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-3 pointer-events-none">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
              <p className="text-white font-semibold text-sm">Processing with AI…</p>
              <p className="text-zinc-500 text-xs">Extracting agent names, policy numbers, clients and amounts</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-center pointer-events-none">
              <Upload className="w-8 h-8 text-zinc-600" />
              <div>
                <p className="text-white font-semibold text-sm mb-1">Drop statement here or click to browse</p>
                <p className="text-zinc-500 text-xs">PDF · JPG · PNG · WEBP</p>
              </div>
            </div>
          )}
        </label>

        <AnimatePresence>
          {uploadResult && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-3 flex items-start gap-3 px-4 py-3 border text-sm ${uploadResult.success ? "border-green-800 bg-green-900/10 text-green-400" : "border-red-800 bg-red-900/10 text-red-400"}`}
            >
              {uploadResult.success ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />}
              <span>{uploadResult.message}</span>
              <button onClick={() => setUploadResult(null)} className="ml-auto text-zinc-600 hover:text-zinc-400 shrink-0"><X className="w-4 h-4" /></button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main commission table */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-[1px] w-6 bg-accent" />
          <span className="text-accent uppercase tracking-widest text-xs font-semibold">Commission Breakdown</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 border border-zinc-900">
            <Loader2 className="w-6 h-6 text-accent animate-spin" />
          </div>
        ) : fetchError ? (
          <div className="flex items-center gap-3 px-6 py-4 border border-red-900 bg-red-900/10 text-red-400 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {fetchError}
            <button onClick={() => fetchSummary(selectedFortnight || undefined)} className="ml-auto text-xs underline">Retry</button>
          </div>
        ) : !summary || summary.entries.length === 0 ? (
          <div className="text-center py-20 border border-zinc-900">
            <FileText className="w-8 h-8 text-zinc-800 mx-auto mb-3" />
            <p className="text-zinc-600 text-sm uppercase tracking-widest font-semibold">No data for this period</p>
            <p className="text-zinc-700 text-xs mt-1">Upload a statement above to populate this table</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-zinc-900">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-950 border-b border-zinc-800">
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-5 py-4">Agent</th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-4 py-4">Policy Number</th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-4 py-4">Client Name</th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-4 py-4">Statement File</th>
                  <th className="text-right text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-5 py-4">Amount</th>
                  <th className="px-3 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {summary.agentTotals.map((agent, agentIdx) => {
                  const agentEntries = summary.entries.filter((e) => e.agent_name === agent.agent_name);
                  return agentEntries.map((entry, entryIdx) => (
                    <tr
                      key={entry.id}
                      className={`border-b border-zinc-900 hover:bg-zinc-950 transition-colors ${agentIdx % 2 === 0 ? "" : "bg-zinc-950/30"}`}
                    >
                      {/* Agent name only on first row of agent block */}
                      <td className="px-5 py-3.5 align-top">
                        {entryIdx === 0 ? (
                          <span className="text-white font-semibold">{agent.agent_name}</span>
                        ) : (
                          <span className="text-transparent select-none">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-zinc-300">{entry.policy_number || <span className="text-zinc-700">—</span>}</td>
                      <td className="px-4 py-3.5 text-zinc-300">{entry.client_name || <span className="text-zinc-700">—</span>}</td>
                      <td className="px-4 py-3.5 text-zinc-600 text-xs truncate max-w-[160px]">{entry.file_name}</td>
                      <td className="px-5 py-3.5 text-right text-accent font-semibold tabular-nums">{fmt(entry.amount)}</td>
                      <td className="px-3 py-3.5">
                        <button
                          onClick={() => setDeleteConfirm({ type: "entry", id: entry.id })}
                          className="text-zinc-800 hover:text-red-400 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ));
                })}
              </tbody>

              {/* Per-agent subtotals */}
              {summary.agentTotals.length > 1 && (
                <tbody>
                  {summary.agentTotals.map((agent) => (
                    <tr key={`sub-${agent.agent_name}`} className="border-b border-zinc-900 bg-zinc-900/40">
                      <td colSpan={4} className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
                        {agent.agent_name} — subtotal ({agent.policy_count} {Number(agent.policy_count) === 1 ? "policy" : "policies"})
                      </td>
                      <td className="px-5 py-3 text-right font-bold text-white tabular-nums">{fmt(agent.total_amount)}</td>
                      <td className="px-3 py-3"></td>
                    </tr>
                  ))}
                </tbody>
              )}

              {/* Grand total */}
              <tfoot>
                <tr className="bg-accent/10 border-t-2 border-accent/40">
                  <td colSpan={4} className="px-5 py-4 font-bold uppercase tracking-widest text-xs text-accent">
                    Grand Total
                  </td>
                  <td className="px-5 py-4 text-right font-serif font-bold text-accent text-lg tabular-nums">
                    {fmt(totalCommission)}
                  </td>
                  <td className="px-3 py-4"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Uploaded statements list */}
      {summary?.statements && summary.statements.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-6 bg-accent" />
            <span className="text-accent uppercase tracking-widest text-xs font-semibold">Uploaded Statements ({summary.statements.length})</span>
          </div>
          <div className="overflow-x-auto border border-zinc-900">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-950 border-b border-zinc-800">
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-5 py-3">File Name</th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-4 py-3">Uploaded By</th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-4 py-3">Date</th>
                  <th className="px-3 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {summary.statements.map((stmt) => (
                  <tr key={stmt.id} className="border-b border-zinc-900 hover:bg-zinc-950 transition-colors">
                    <td className="px-5 py-3 text-white font-medium">{stmt.file_name}</td>
                    <td className="px-4 py-3 text-zinc-400 text-xs">{stmt.uploaded_by}</td>
                    <td className="px-4 py-3 text-zinc-500 text-xs">{fmtDateTime(stmt.created_at)}</td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => setDeleteConfirm({ type: "statement", id: stmt.id })}
                        className="text-zinc-700 hover:text-red-400 transition-colors"
                        title="Delete statement and all its entries"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
              <AlertTriangle className="w-7 h-7 text-red-400 mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Confirm Delete</h3>
              <p className="text-zinc-500 text-sm mb-6">
                {deleteConfirm.type === "statement"
                  ? "This will delete the statement and all its entries permanently."
                  : "This will delete this commission entry permanently."}
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
