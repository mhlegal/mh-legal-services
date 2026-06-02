import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Shield, LogOut, Trash2, RefreshCw, AlertTriangle,
  CheckCircle, DollarSign, Users, FileText, Calendar, X,
  Loader2, Plus, Edit2, Lock, Unlock, ChevronDown, Search,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiJson, BASE } from "@/lib/api";

const PAYMENTS_ALLOWED = ["ngobesesimangaliso47@gmail.com", "mhlopheholdings@gmail.com"];

interface Period {
  id: number; label: string;
  period_start: string; period_end: string;
  status: "active" | "finalised";
  payment_date: string | null;
  finalised_by: string | null; finalised_at: string | null;
  notes: string | null; created_by: string; created_at: string;
  entry_count: string; total_amount: string; statement_count: string;
}
interface AgentTotal {
  agent_name: string; total_amount: string; policy_count: string;
  reg26a_amount: string; private_order_amount: string; unknown_amount: string;
  reg26a_count: string; private_order_count: string;
}
interface TypeTotals {
  reg26a_total: string; private_order_total: string; unknown_total: string;
  reg26a_count: string; private_order_count: string;
}
interface Entry {
  id: number; statement_id: number; agent_name: string;
  policy_number: string; client_name: string; amount: string;
  sale_type: "reg26a" | "private_order" | "unknown";
  file_name: string;
}
interface Statement { id: number; file_name: string; uploaded_by: string; created_at: string; }
interface Summary { period: Period; agentTotals: AgentTotal[]; entries: Entry[]; statements: Statement[]; typeTotals: TypeTotals; }

const fmt = (v: string | number) =>
  `R ${Number(v).toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
const fmtDateTime = (d: string) =>
  new Date(d).toLocaleString("en-ZA", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const toDateInput = (d: string) => new Date(d).toISOString().slice(0, 16); // "yyyy-MM-ddTHH:mm"

// ─── Page shell ─────────────────────────────────────────────────────────────

export default function CommissionsDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  if (!user || !PAYMENTS_ALLOWED.includes(user.email)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center border border-zinc-900 p-16 max-w-md">
          <Shield className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-white mb-3">Access Restricted</h2>
          <p className="text-zinc-500 text-sm mb-6">Only authorised administrators may access this page.</p>
          <Link href="/admin"><span className="text-accent text-sm hover:underline cursor-pointer">← Back to Dashboard</span></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-900 sticky top-0 z-40 bg-black">
        <div className="container mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/"><div className="font-serif font-bold text-base tracking-wider cursor-pointer flex items-center gap-1"><span className="text-white">MH LEGAL</span><span className="text-accent ml-1">SERVICES</span></div></Link>
            <div className="h-5 w-px bg-zinc-800" />
            <div className="flex items-center gap-3"><DollarSign className="w-4 h-4 text-accent" /><span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Commission Payments</span></div>
          </div>
          <div className="flex items-center gap-3">
            <SearchButton />
            <Link href="/admin"><span className="text-zinc-600 text-xs uppercase tracking-wider hover:text-accent transition-colors cursor-pointer hidden sm:block">← Manager Dashboard</span></Link>
            <button onClick={async () => { await logout(); setLocation("/login"); }} className="flex items-center gap-2 border border-zinc-800 text-zinc-400 hover:border-white hover:text-white text-xs uppercase tracking-wider px-4 py-2 transition-colors font-semibold">
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

// ─── Main content ────────────────────────────────────────────────────────────

function CommissionsContent() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState<number | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [periodsLoading, setPeriodsLoading] = useState(true);

  // Modals
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);
  const [showFinaliseModal, setShowFinaliseModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: "entry" | "statement" | "period"; id: number } | null>(null);

  // Upload
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const fetchPeriods = useCallback(async () => {
    setPeriodsLoading(true);
    try {
      const data = await apiJson<{ periods: Period[] }>("/commissions/periods");
      setPeriods(data.periods);
      // Auto-select the most recent active period
      if (!selectedPeriodId && data.periods.length > 0) {
        const active = data.periods.find(p => p.status === "active") ?? data.periods[0];
        setSelectedPeriodId(active.id);
      }
    } catch {}
    setPeriodsLoading(false);
  }, [selectedPeriodId]);

  const fetchSummary = useCallback(async (periodId: number) => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await apiJson<Summary>(`/commissions/summary/${periodId}`);
      setSummary(data);
    } catch (err: any) {
      setFetchError(err?.message ?? "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPeriods(); }, []);
  useEffect(() => { if (selectedPeriodId) fetchSummary(selectedPeriodId); }, [selectedPeriodId, fetchSummary]);

  const [uploadProgress, setUploadProgress] = useState<string>("");

  async function handleFiles(incoming: FileList | File[]) {
    const fileArr = Array.from(incoming).slice(0, 10);
    if (!selectedPeriodId) { setUploadResult({ success: false, message: "Please select or create a period first." }); return; }
    const period = periods.find(p => p.id === selectedPeriodId);
    if (period?.status === "finalised") { setUploadResult({ success: false, message: "This period is finalised. Reopen it to add more entries." }); return; }
    const invalid = fileArr.find(f => !f.type.startsWith("image/") && f.type !== "application/pdf");
    if (invalid) { setUploadResult({ success: false, message: `"${invalid.name}" is not a supported file type. Use PDF, JPG, PNG or WEBP.` }); return; }
    setUploading(true); setUploadResult(null);
    setUploadProgress(fileArr.length === 1 ? "Reading with AI…" : `Reading ${fileArr.length} files with AI…`);
    try {
      const formData = new FormData();
      fileArr.forEach(f => formData.append("files", f));
      formData.append("period_id", String(selectedPeriodId));
      const res = await fetch(`${BASE}/api/commissions/upload`, { method: "POST", credentials: "include", body: formData });
      const text = await res.text();
      let data: any = {};
      try { data = JSON.parse(text); } catch { throw new Error(res.ok ? "Unexpected server response" : `Server error (${res.status})`); }
      if (!res.ok) throw new Error(data.error ?? `Upload failed (${res.status})`);
      const skipped = data.skippedCount ?? 0;
      const fc = data.fileCount ?? fileArr.length;
      const fileLabel = fc === 1 ? `"${fileArr[0].name}"` : `${fc} files`;
      const skipNote = skipped > 0 ? ` ${skipped} duplicate ${skipped === 1 ? "policy" : "policies"} skipped.` : "";
      setUploadResult({ success: true, message: `Extracted ${data.entryCount} new ${data.entryCount === 1 ? "entry" : "entries"} from ${fileLabel}.${skipNote}` });
      await fetchPeriods();
      await fetchSummary(selectedPeriodId);
    } catch (err: any) {
      setUploadResult({ success: false, message: err.message ?? "Upload failed. Please try again." });
    } finally { setUploading(false); setUploadProgress(""); }
  }

  async function handleDelete(type: "entry" | "statement" | "period", id: number) {
    try {
      if (type === "period") {
        await apiJson(`/commissions/periods/${id}`, { method: "DELETE" });
        setSelectedPeriodId(null); setSummary(null);
      } else {
        await apiJson(`/commissions/${type === "entry" ? "entries" : "statements"}/${id}`, { method: "DELETE" });
        if (selectedPeriodId) { await fetchSummary(selectedPeriodId); await fetchPeriods(); }
      }
      setShowDeleteConfirm(null);
    } catch {}
  }

  async function handleReopen() {
    if (!selectedPeriodId) return;
    try {
      await apiJson(`/commissions/periods/${selectedPeriodId}`, { method: "PUT", body: JSON.stringify({ action: "reopen" }) });
      await fetchPeriods();
      await fetchSummary(selectedPeriodId);
    } catch {}
  }

  const selectedPeriod = periods.find(p => p.id === selectedPeriodId);
  const isFinalised = selectedPeriod?.status === "finalised";
  const totalCommission = summary?.agentTotals.reduce((s, a) => s + Number(a.total_amount), 0) ?? 0;

  return (
    <>
      {/* ── Period selector bar ── */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-[1px] w-6 bg-accent" />
          <Calendar className="w-4 h-4 text-accent" />
          <span className="text-accent uppercase tracking-widest text-xs font-semibold">Period</span>
        </div>

        {periodsLoading ? (
          <Loader2 className="w-4 h-4 text-zinc-600 animate-spin" />
        ) : periods.length === 0 ? (
          <span className="text-zinc-600 text-xs">No periods yet — create one to begin</span>
        ) : (
          <div className="relative">
            <select
              value={selectedPeriodId ?? ""}
              onChange={e => setSelectedPeriodId(Number(e.target.value))}
              className="appearance-none bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs px-4 py-2.5 pr-8 focus:outline-none focus:border-accent cursor-pointer"
            >
              {periods.map(p => (
                <option key={p.id} value={p.id}>
                  {p.label} ({fmtDate(p.period_start)} → {fmtDate(p.period_end)}){p.status === "finalised" ? " ✓ PAID" : ""}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto flex-wrap">
          <button onClick={() => { setEditingPeriod(null); setShowPeriodModal(true); }} className="flex items-center gap-1.5 border border-accent/40 text-accent text-xs uppercase tracking-wider px-3 py-2 hover:bg-accent/10 transition-colors font-semibold">
            <Plus className="w-3.5 h-3.5" /> New Period
          </button>
          {selectedPeriod && !isFinalised && (
            <button onClick={() => { setEditingPeriod(selectedPeriod); setShowPeriodModal(true); }} className="flex items-center gap-1.5 border border-zinc-700 text-zinc-400 text-xs uppercase tracking-wider px-3 py-2 hover:border-white hover:text-white transition-colors font-semibold">
              <Edit2 className="w-3.5 h-3.5" /> Edit Period
            </button>
          )}
          {selectedPeriod && !isFinalised && Number(selectedPeriod.entry_count) > 0 && (
            <button onClick={() => setShowFinaliseModal(true)} className="flex items-center gap-1.5 border border-green-700 text-green-400 text-xs uppercase tracking-wider px-3 py-2 hover:bg-green-900/20 transition-colors font-semibold">
              <Lock className="w-3.5 h-3.5" /> Finalise &amp; Mark Paid
            </button>
          )}
          {selectedPeriod && isFinalised && (
            <button onClick={handleReopen} className="flex items-center gap-1.5 border border-zinc-700 text-zinc-500 text-xs uppercase tracking-wider px-3 py-2 hover:border-zinc-400 hover:text-zinc-300 transition-colors font-semibold">
              <Unlock className="w-3.5 h-3.5" /> Reopen
            </button>
          )}
          {selectedPeriod && (
            <button onClick={() => selectedPeriodId && setShowDeleteConfirm({ type: "period", id: selectedPeriodId })} className="text-zinc-700 hover:text-red-400 transition-colors p-2">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => selectedPeriodId && fetchSummary(selectedPeriodId)} className="text-zinc-600 hover:text-accent transition-colors p-2">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Finalised badge ── */}
      {isFinalised && selectedPeriod && (
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-4 px-6 py-4 border border-green-800 bg-green-900/10">
          <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
          <div>
            <p className="text-green-400 font-semibold text-sm">Period Finalised — Payment Processed</p>
            <p className="text-green-600 text-xs mt-0.5">
              Paid on <strong>{selectedPeriod.payment_date ? fmtDate(selectedPeriod.payment_date) : "—"}</strong>
              {" · "}Finalised by <strong>{selectedPeriod.finalised_by}</strong>
              {" · "}{fmtDateTime(selectedPeriod.finalised_at!)}
              {selectedPeriod.notes && <span className="ml-2 italic">· "{selectedPeriod.notes}"</span>}
            </p>
          </div>
        </motion.div>
      )}

      {/* ── Stats ── */}
      {selectedPeriodId && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className={`border p-6 ${isFinalised ? "border-green-800 bg-green-900/5" : "border-accent bg-accent/5"}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent/70">Total Commissions</span>
                <DollarSign className="w-4 h-4 text-accent/50" />
              </div>
              <p className="text-2xl font-serif font-bold text-accent">{fmt(totalCommission)}</p>
              {isFinalised && selectedPeriod?.payment_date && (
                <p className="text-green-500 text-[10px] uppercase tracking-wider mt-2 font-semibold">Paid {fmtDate(selectedPeriod.payment_date)}</p>
              )}
            </div>
            <div className="border border-zinc-900 bg-zinc-950 p-6">
              <div className="flex items-center justify-between mb-3"><span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Agents</span><Users className="w-4 h-4 text-zinc-700" /></div>
              <p className="text-2xl font-serif font-bold text-white">{summary?.agentTotals.length ?? 0}</p>
            </div>
            <div className="border border-zinc-900 bg-zinc-950 p-6">
              <div className="flex items-center justify-between mb-3"><span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Policy Entries</span><FileText className="w-4 h-4 text-zinc-700" /></div>
              <p className="text-2xl font-serif font-bold text-white">{summary?.entries.length ?? 0}</p>
            </div>
          </div>
          {/* ── Sale type split ── */}
          {summary && (summary.entries.length > 0) && (
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="border border-zinc-800 bg-zinc-950 p-5 flex items-center gap-5">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block text-[9px] font-bold uppercase tracking-widest bg-amber-900/30 text-amber-400 border border-amber-800/50 px-2 py-0.5">Reg 26A</span>
                    <span className="text-zinc-700 text-[10px]">{summary.typeTotals.reg26a_count} {Number(summary.typeTotals.reg26a_count) === 1 ? "policy" : "policies"}</span>
                  </div>
                  <p className="text-xl font-serif font-bold text-amber-400">{fmt(summary.typeTotals.reg26a_total)}</p>
                </div>
                <div className="h-12 w-px bg-zinc-800" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block text-[9px] font-bold uppercase tracking-widest bg-blue-900/30 text-blue-400 border border-blue-800/50 px-2 py-0.5">Private Order</span>
                    <span className="text-zinc-700 text-[10px]">{summary.typeTotals.private_order_count} {Number(summary.typeTotals.private_order_count) === 1 ? "policy" : "policies"}</span>
                  </div>
                  <p className="text-xl font-serif font-bold text-blue-400">{fmt(summary.typeTotals.private_order_total)}</p>
                </div>
              </div>
              <div className="border border-zinc-900 bg-zinc-950/50 p-5 flex items-center">
                <div className="w-full">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">Type Breakdown</p>
                  <div className="space-y-2">
                    {Number(summary.typeTotals.reg26a_total) > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 bg-amber-500/70 rounded-full" style={{ width: `${Math.round(Number(summary.typeTotals.reg26a_total) / totalCommission * 100)}%`, minWidth: "4px", maxWidth: "100%" }} />
                        <span className="text-zinc-500 text-[10px] whitespace-nowrap">{Math.round(Number(summary.typeTotals.reg26a_total) / totalCommission * 100)}% Reg 26A</span>
                      </div>
                    )}
                    {Number(summary.typeTotals.private_order_total) > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 bg-blue-500/70 rounded-full" style={{ width: `${Math.round(Number(summary.typeTotals.private_order_total) / totalCommission * 100)}%`, minWidth: "4px", maxWidth: "100%" }} />
                        <span className="text-zinc-500 text-[10px] whitespace-nowrap">{Math.round(Number(summary.typeTotals.private_order_total) / totalCommission * 100)}% Private Order</span>
                      </div>
                    )}
                    {Number(summary.typeTotals.unknown_total) > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 bg-zinc-600/70 rounded-full" style={{ width: `${Math.round(Number(summary.typeTotals.unknown_total) / totalCommission * 100)}%`, minWidth: "4px", maxWidth: "100%" }} />
                        <span className="text-zinc-500 text-[10px] whitespace-nowrap">{Math.round(Number(summary.typeTotals.unknown_total) / totalCommission * 100)}% Unclassified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {!(summary && summary.entries.length > 0) && <div className="mb-10" />}
        </>
      )}

      {/* ── Upload zone (only for active periods) ── */}
      {selectedPeriod && !isFinalised && (
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-6 bg-accent" />
            <span className="text-accent uppercase tracking-widest text-xs font-semibold">Upload Emerald Statement</span>
          </div>
          <label
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files); }}
            className={`relative flex flex-col items-center justify-center border-2 border-dashed py-10 px-8 cursor-pointer transition-colors ${dragOver ? "border-accent bg-accent/5" : "border-zinc-800 hover:border-zinc-600 bg-zinc-950"}`}
          >
            <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,image/*,application/pdf" multiple
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              onChange={e => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ""; }}
              disabled={uploading} />
            {uploading ? (
              <div className="flex flex-col items-center gap-3 pointer-events-none">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
                <p className="text-white font-semibold text-sm">{uploadProgress || "Processing with AI…"}</p>
                <p className="text-zinc-500 text-xs">Extracting agents, policy numbers, clients and amounts</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center pointer-events-none">
                <Upload className="w-8 h-8 text-zinc-600" />
                <div>
                  <p className="text-white font-semibold text-sm mb-1">Drop up to 10 images here or click to browse</p>
                  <p className="text-zinc-500 text-xs">PDF · JPG · PNG · WEBP — select multiple files at once</p>
                </div>
              </div>
            )}
          </label>
          <AnimatePresence>
            {uploadResult && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`mt-3 flex items-start gap-3 px-4 py-3 border text-sm ${uploadResult.success ? "border-green-800 bg-green-900/10 text-green-400" : "border-red-800 bg-red-900/10 text-red-400"}`}>
                {uploadResult.success ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />}
                <span>{uploadResult.message}</span>
                <button onClick={() => setUploadResult(null)} className="ml-auto text-zinc-600 hover:text-zinc-400 shrink-0"><X className="w-4 h-4" /></button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── No period selected ── */}
      {!selectedPeriodId && !periodsLoading && (
        <div className="text-center py-24 border border-zinc-900">
          <Calendar className="w-10 h-10 text-zinc-800 mx-auto mb-4" />
          <p className="text-zinc-500 text-sm font-semibold uppercase tracking-widest mb-2">No period selected</p>
          <p className="text-zinc-700 text-xs mb-6">Create a new period to start tracking commissions</p>
          <button onClick={() => setShowPeriodModal(true)} className="inline-flex items-center gap-2 border border-accent/40 text-accent text-xs uppercase tracking-wider px-4 py-2.5 hover:bg-accent/10 transition-colors font-semibold">
            <Plus className="w-3.5 h-3.5" /> Create First Period
          </button>
        </div>
      )}

      {/* ── Commission breakdown table ── */}
      {selectedPeriodId && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-6 bg-accent" />
            <span className="text-accent uppercase tracking-widest text-xs font-semibold">Commission Breakdown</span>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-20 border border-zinc-900"><Loader2 className="w-6 h-6 text-accent animate-spin" /></div>
          ) : fetchError ? (
            <div className="flex items-center gap-3 px-6 py-4 border border-red-900 bg-red-900/10 text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />{fetchError}
              <button onClick={() => selectedPeriodId && fetchSummary(selectedPeriodId)} className="ml-auto text-xs underline">Retry</button>
            </div>
          ) : !summary || summary.entries.length === 0 ? (
            <div className="text-center py-16 border border-zinc-900">
              <FileText className="w-8 h-8 text-zinc-800 mx-auto mb-3" />
              <p className="text-zinc-600 text-sm uppercase tracking-widest font-semibold">No entries yet</p>
              <p className="text-zinc-700 text-xs mt-1">{isFinalised ? "This period was finalised with no entries." : "Upload a statement above to populate this table."}</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-zinc-900">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-zinc-950 border-b border-zinc-800">
                    <th className="text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-5 py-4">Agent</th>
                    <th className="text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-4 py-4">Type</th>
                    <th className="text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-4 py-4">Policy Number</th>
                    <th className="text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-4 py-4">Client Name</th>
                    <th className="text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-4 py-4">Statement</th>
                    <th className="text-right text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-5 py-4">Amount</th>
                    {!isFinalised && <th className="px-3 py-4"></th>}
                  </tr>
                </thead>
                <tbody>
                  {summary.agentTotals.map((agent, ai) =>
                    summary.entries
                      .filter(e => e.agent_name === agent.agent_name)
                      .map((entry, ei) => (
                        <tr key={entry.id} className={`border-b border-zinc-900 hover:bg-zinc-950 transition-colors ${ai % 2 === 1 ? "bg-zinc-950/30" : ""}`}>
                          <td className="px-5 py-3.5 align-top">
                            {ei === 0 ? <span className="text-white font-semibold">{agent.agent_name}</span> : <span className="invisible">·</span>}
                          </td>
                          <td className="px-4 py-3.5">
                            {entry.sale_type === "reg26a" && (
                              <span className="inline-block text-[9px] font-bold uppercase tracking-widest bg-amber-900/30 text-amber-400 border border-amber-800/50 px-2 py-0.5 whitespace-nowrap">Reg 26A</span>
                            )}
                            {entry.sale_type === "private_order" && (
                              <span className="inline-block text-[9px] font-bold uppercase tracking-widest bg-blue-900/30 text-blue-400 border border-blue-800/50 px-2 py-0.5 whitespace-nowrap">Private Order</span>
                            )}
                            {(entry.sale_type === "unknown" || !entry.sale_type) && (
                              <span className="text-zinc-700 text-[10px]">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 font-mono text-xs text-zinc-300">{entry.policy_number || <span className="text-zinc-700">—</span>}</td>
                          <td className="px-4 py-3.5 text-zinc-300">{entry.client_name || <span className="text-zinc-700">—</span>}</td>
                          <td className="px-4 py-3.5 text-zinc-600 text-xs truncate max-w-[140px]">{entry.file_name}</td>
                          <td className="px-5 py-3.5 text-right text-accent font-semibold tabular-nums">{fmt(entry.amount)}</td>
                          {!isFinalised && (
                            <td className="px-3 py-3.5">
                              <button onClick={() => setShowDeleteConfirm({ type: "entry", id: entry.id })} className="text-zinc-800 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                            </td>
                          )}
                        </tr>
                      ))
                  )}
                </tbody>
                {summary.agentTotals.length > 1 && (
                  <tbody>
                    {summary.agentTotals.map(agent => (
                      <tr key={`sub-${agent.agent_name}`} className="border-b border-zinc-900 bg-zinc-900/40">
                        <td className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
                          {agent.agent_name}
                        </td>
                        <td colSpan={4} className="px-4 py-3 text-[10px] text-zinc-600 space-x-3">
                          {Number(agent.reg26a_amount) > 0 && (
                            <span><span className="text-amber-600">Reg 26A</span> {fmt(agent.reg26a_amount)} ({agent.reg26a_count})</span>
                          )}
                          {Number(agent.private_order_amount) > 0 && (
                            <span><span className="text-blue-600">Private</span> {fmt(agent.private_order_amount)} ({agent.private_order_count})</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-right font-bold text-white tabular-nums">{fmt(agent.total_amount)}</td>
                        {!isFinalised && <td className="px-3 py-3"></td>}
                      </tr>
                    ))}
                  </tbody>
                )}
                <tfoot>
                  <tr className="bg-zinc-900/60 border-t border-zinc-800">
                    <td className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Type Totals</td>
                    <td colSpan={4} className="px-4 py-3 text-[10px] text-zinc-500 space-x-4">
                      {Number(summary.typeTotals.reg26a_total) > 0 && (
                        <span><span className="text-amber-500">Reg 26A:</span> {fmt(summary.typeTotals.reg26a_total)}</span>
                      )}
                      {Number(summary.typeTotals.private_order_total) > 0 && (
                        <span><span className="text-blue-400">Private Order:</span> {fmt(summary.typeTotals.private_order_total)}</span>
                      )}
                    </td>
                    <td className="px-5 py-3" />
                    {!isFinalised && <td className="px-3 py-3" />}
                  </tr>
                  <tr className="bg-accent/10 border-t-2 border-accent/40">
                    <td colSpan={5} className="px-5 py-4 font-bold uppercase tracking-widest text-xs text-accent">Grand Total</td>
                    <td className="px-5 py-4 text-right font-serif font-bold text-accent text-lg tabular-nums">{fmt(totalCommission)}</td>
                    {!isFinalised && <td className="px-3 py-4"></td>}
                  </tr>
                  {isFinalised && selectedPeriod?.payment_date && (
                    <tr className="bg-green-900/10 border-t border-green-900">
                      <td colSpan={6} className="px-5 py-3 text-xs text-green-400 font-semibold">
                        ✓ Payment of {fmt(totalCommission)} processed on {fmtDate(selectedPeriod.payment_date)} by {selectedPeriod.finalised_by}
                      </td>
                    </tr>
                  )}
                </tfoot>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Statements list ── */}
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
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-5 py-3">File</th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-4 py-3">Uploaded By</th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-4 py-3">Date</th>
                  {!isFinalised && <th className="px-3 py-3"></th>}
                </tr>
              </thead>
              <tbody>
                {summary.statements.map(stmt => (
                  <tr key={stmt.id} className="border-b border-zinc-900 hover:bg-zinc-950 transition-colors">
                    <td className="px-5 py-3 text-white font-medium">{stmt.file_name}</td>
                    <td className="px-4 py-3 text-zinc-400 text-xs">{stmt.uploaded_by}</td>
                    <td className="px-4 py-3 text-zinc-500 text-xs">{fmtDateTime(stmt.created_at)}</td>
                    {!isFinalised && (
                      <td className="px-3 py-3">
                        <button onClick={() => setShowDeleteConfirm({ type: "statement", id: stmt.id })} className="text-zinc-700 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODALS ── */}

      {/* Create / Edit Period */}
      <AnimatePresence>
        {showPeriodModal && (
          <PeriodModal
            editing={editingPeriod}
            onClose={() => { setShowPeriodModal(false); setEditingPeriod(null); }}
            onSaved={async (period) => {
              setShowPeriodModal(false); setEditingPeriod(null);
              await fetchPeriods();
              setSelectedPeriodId(period.id);
            }}
          />
        )}
      </AnimatePresence>

      {/* Finalise Period */}
      <AnimatePresence>
        {showFinaliseModal && selectedPeriod && (
          <FinaliseModal
            period={selectedPeriod}
            totalAmount={totalCommission}
            agentTotals={summary?.agentTotals ?? []}
            onClose={() => setShowFinaliseModal(false)}
            onFinalised={async () => {
              setShowFinaliseModal(false);
              await fetchPeriods();
              if (selectedPeriodId) await fetchSummary(selectedPeriodId);
            }}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-zinc-950 border border-zinc-800 p-8 max-w-sm w-full">
              <AlertTriangle className="w-7 h-7 text-red-400 mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Confirm Delete</h3>
              <p className="text-zinc-500 text-sm mb-6">
                {showDeleteConfirm.type === "period"
                  ? "This will permanently delete the period and ALL its statements and entries."
                  : showDeleteConfirm.type === "statement"
                    ? "This will delete the statement and all its entries permanently."
                    : "This will delete this entry permanently."}
              </p>
              <div className="flex gap-3">
                <button onClick={() => handleDelete(showDeleteConfirm.type, showDeleteConfirm.id)} className="flex-1 bg-red-700 hover:bg-red-600 text-white text-xs uppercase tracking-wider font-bold px-4 py-3 transition-colors">Delete</button>
                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 border border-zinc-700 text-zinc-400 hover:border-white hover:text-white text-xs uppercase tracking-wider font-bold px-4 py-3 transition-colors">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Period create/edit modal ─────────────────────────────────────────────────

function PeriodModal({ editing, onClose, onSaved }: {
  editing: Period | null;
  onClose: () => void;
  onSaved: (p: Period) => void;
}) {
  const [label, setLabel] = useState(editing?.label ?? "");
  const [start, setStart] = useState(editing ? toDateInput(editing.period_start) : "");
  const [end, setEnd] = useState(editing ? toDateInput(editing.period_end) : "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    if (!label.trim()) { setError("A label is required"); return; }
    if (!start || !end) { setError("Both start and end dates are required"); return; }
    if (new Date(start) >= new Date(end)) { setError("Start must be before end"); return; }
    setSaving(true); setError("");
    try {
      let data: { period: Period };
      if (editing) {
        data = await apiJson<{ period: Period }>(`/commissions/periods/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify({ label: label.trim(), period_start: new Date(start).toISOString(), period_end: new Date(end).toISOString() }),
        });
      } else {
        data = await apiJson<{ period: Period }>("/commissions/periods", {
          method: "POST",
          body: JSON.stringify({ label: label.trim(), period_start: new Date(start).toISOString(), period_end: new Date(end).toISOString() }),
        });
      }
      onSaved(data.period);
    } catch (err: any) {
      setError(err?.message ?? "Failed to save period");
    } finally { setSaving(false); }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-zinc-950 border border-zinc-800 p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-serif text-xl">{editing ? "Edit Period" : "New Commission Period"}</h3>
          <button onClick={onClose} className="text-zinc-600 hover:text-zinc-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Period Label</label>
            <input
              type="text" value={label} onChange={e => setLabel(e.target.value)}
              placeholder="e.g. Fortnight 1 — June 2026"
              className="w-full bg-black border border-zinc-800 text-white text-sm px-4 py-3 focus:outline-none focus:border-accent placeholder:text-zinc-700"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Start Date &amp; Time</label>
              <input
                type="datetime-local" value={start} onChange={e => setStart(e.target.value)}
                className="w-full bg-black border border-zinc-800 text-white text-sm px-4 py-3 focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">End Date &amp; Time</label>
              <input
                type="datetime-local" value={end} onChange={e => setEnd(e.target.value)}
                className="w-full bg-black border border-zinc-800 text-white text-sm px-4 py-3 focus:outline-none focus:border-accent"
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-xs flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5 shrink-0" />{error}</p>}
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={save} disabled={saving} className="flex-1 bg-accent hover:bg-accent/90 text-black text-xs uppercase tracking-wider font-bold px-4 py-3 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}{editing ? "Save Changes" : "Create Period"}
          </button>
          <button onClick={onClose} className="flex-1 border border-zinc-700 text-zinc-400 hover:border-white hover:text-white text-xs uppercase tracking-wider font-bold px-4 py-3 transition-colors">Cancel</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Search ───────────────────────────────────────────────────────────────────

interface SearchResult {
  id: number; agent_name: string; policy_number: string; client_name: string;
  amount: string; sale_type: "reg26a" | "private_order" | "unknown";
  file_name: string; period_id: number; period_label: string;
  period_start: string; period_end: string;
  period_status: "active" | "finalised"; payment_date: string | null;
  created_at: string;
}

function SearchButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 border border-zinc-800 text-zinc-400 hover:border-accent hover:text-accent text-xs uppercase tracking-wider px-3 py-2 transition-colors font-semibold"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Policy Search</span>
      </button>
      <AnimatePresence>
        {open && <SearchModal onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  async function doSearch(q: string) {
    if (q.trim().length < 2) { setResults(null); return; }
    setSearching(true); setError("");
    try {
      const data = await apiJson<{ results: SearchResult[] }>(`/commissions/search?q=${encodeURIComponent(q.trim())}`);
      setResults(data.results);
    } catch (err: any) {
      setError(err?.message ?? "Search failed");
    } finally { setSearching(false); }
  }

  useEffect(() => {
    const t = setTimeout(() => { if (query.trim().length >= 2) doSearch(query); else setResults(null); }, 350);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/85 z-50 flex flex-col"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
        className="bg-zinc-950 border-b border-zinc-800 px-6 py-5"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-4">
            <Search className="w-5 h-5 text-accent shrink-0" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Escape" && onClose()}
              placeholder="Search by policy number, client name or agent…"
              className="flex-1 bg-transparent text-white text-base placeholder:text-zinc-600 focus:outline-none"
            />
            {searching && <Loader2 className="w-4 h-4 text-accent animate-spin shrink-0" />}
            <button onClick={onClose} className="text-zinc-600 hover:text-zinc-300 shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-zinc-700 text-[10px] uppercase tracking-widest mt-2 ml-9">
            Searches across all periods · min 2 characters
          </p>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-4xl px-6 py-6">
          {error && (
            <div className="flex items-center gap-3 px-4 py-3 border border-red-900 bg-red-900/10 text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />{error}
            </div>
          )}

          {!error && results === null && query.length < 2 && (
            <div className="text-center py-20">
              <Search className="w-10 h-10 text-zinc-800 mx-auto mb-4" />
              <p className="text-zinc-600 text-sm font-semibold uppercase tracking-widest">Search any sale</p>
              <p className="text-zinc-700 text-xs mt-2">Enter a policy number, client name or agent to check if a sale was captured</p>
            </div>
          )}

          {!error && results !== null && results.length === 0 && (
            <div className="text-center py-20">
              <AlertTriangle className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm font-semibold uppercase tracking-widest">No results found</p>
              <p className="text-zinc-700 text-xs mt-2">"{query}" did not match any entries across any period</p>
            </div>
          )}

          {!error && results && results.length > 0 && (
            <>
              <p className="text-zinc-600 text-xs uppercase tracking-widest mb-4 font-semibold">
                {results.length} {results.length === 1 ? "result" : "results"} for "{query}"
              </p>
              <div className="border border-zinc-900 overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-zinc-950 border-b border-zinc-800">
                      <th className="text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-5 py-3">Period</th>
                      <th className="text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-4 py-3">Status</th>
                      <th className="text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-4 py-3">Agent</th>
                      <th className="text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-4 py-3">Type</th>
                      <th className="text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-4 py-3">Policy #</th>
                      <th className="text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-4 py-3">Client</th>
                      <th className="text-right text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-5 py-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map(r => (
                      <tr key={r.id} className="border-b border-zinc-900 hover:bg-zinc-900 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="text-white font-medium text-xs">{r.period_label}</p>
                          <p className="text-zinc-600 text-[10px] mt-0.5">{fmtDate(r.period_start)} → {fmtDate(r.period_end)}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          {r.period_status === "finalised" ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest bg-green-900/30 text-green-400 border border-green-800/50 px-2 py-0.5">
                              <CheckCircle className="w-2.5 h-2.5" /> Paid
                            </span>
                          ) : (
                            <span className="inline-block text-[9px] font-bold uppercase tracking-widest bg-zinc-900 text-zinc-400 border border-zinc-700 px-2 py-0.5">
                              Active
                            </span>
                          )}
                          {r.period_status === "finalised" && r.payment_date && (
                            <p className="text-green-700 text-[10px] mt-0.5">{fmtDate(r.payment_date)}</p>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-zinc-300 font-medium">{r.agent_name}</td>
                        <td className="px-4 py-3.5">
                          {r.sale_type === "reg26a" && (
                            <span className="inline-block text-[9px] font-bold uppercase tracking-widest bg-amber-900/30 text-amber-400 border border-amber-800/50 px-2 py-0.5">Reg 26A</span>
                          )}
                          {r.sale_type === "private_order" && (
                            <span className="inline-block text-[9px] font-bold uppercase tracking-widest bg-blue-900/30 text-blue-400 border border-blue-800/50 px-2 py-0.5">Private</span>
                          )}
                          {(r.sale_type === "unknown" || !r.sale_type) && (
                            <span className="text-zinc-700 text-[10px]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs text-zinc-300">{r.policy_number || <span className="text-zinc-700">—</span>}</td>
                        <td className="px-4 py-3.5 text-zinc-300">{r.client_name || <span className="text-zinc-700">—</span>}</td>
                        <td className="px-5 py-3.5 text-right text-accent font-semibold tabular-nums">{fmt(r.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Finalise modal ───────────────────────────────────────────────────────────

function FinaliseModal({ period, totalAmount, agentTotals, onClose, onFinalised }: {
  period: Period;
  totalAmount: number;
  agentTotals: AgentTotal[];
  onClose: () => void;
  onFinalised: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [paymentDate, setPaymentDate] = useState(today);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function finalise() {
    if (!paymentDate) { setError("Payment date is required"); return; }
    setSaving(true); setError("");
    try {
      await apiJson(`/commissions/periods/${period.id}`, {
        method: "PUT",
        body: JSON.stringify({ action: "finalise", payment_date: new Date(paymentDate).toISOString(), notes: notes.trim() || null }),
      });
      onFinalised();
    } catch (err: any) {
      setError(err?.message ?? "Failed to finalise period");
      setSaving(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-zinc-950 border border-zinc-800 p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-serif text-xl">Finalise &amp; Mark Paid</h3>
          <button onClick={onClose} className="text-zinc-600 hover:text-zinc-300"><X className="w-5 h-5" /></button>
        </div>

        <p className="text-zinc-400 text-sm mb-6">
          Finalising locks this period for future reference. You can reopen it later if needed.
        </p>

        {/* Payment summary */}
        <div className="border border-zinc-800 mb-6">
          <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-900">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Payment Summary — {period.label}</p>
            <p className="text-zinc-600 text-xs mt-0.5">{fmtDate(period.period_start)} to {fmtDate(period.period_end)}</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-900">
                <th className="text-left text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-5 py-3">Agent</th>
                <th className="text-center text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-4 py-3">Policies</th>
                <th className="text-right text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-5 py-3">Commission</th>
              </tr>
            </thead>
            <tbody>
              {agentTotals.map(a => (
                <tr key={a.agent_name} className="border-b border-zinc-900">
                  <td className="px-5 py-3 text-white font-medium">{a.agent_name}</td>
                  <td className="px-4 py-3 text-zinc-500 text-center">{a.policy_count}</td>
                  <td className="px-5 py-3 text-right text-accent font-semibold tabular-nums">{fmt(a.total_amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-accent/10">
                <td colSpan={2} className="px-5 py-3 text-xs font-bold uppercase tracking-widest text-accent">Total</td>
                <td className="px-5 py-3 text-right font-serif font-bold text-accent text-base tabular-nums">{fmt(totalAmount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Payment Date</label>
            <input
              type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)}
              className="w-full bg-black border border-zinc-800 text-white text-sm px-4 py-3 focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Notes <span className="text-zinc-700 normal-case tracking-normal">(optional)</span></label>
            <textarea
              value={notes} onChange={e => setNotes(e.target.value)}
              rows={2} placeholder="Any notes about this payment run…"
              className="w-full bg-black border border-zinc-800 text-white text-sm px-4 py-3 focus:outline-none focus:border-accent placeholder:text-zinc-700 resize-none"
            />
          </div>
          {error && <p className="text-red-400 text-xs flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5 shrink-0" />{error}</p>}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={finalise} disabled={saving} className="flex-1 bg-green-700 hover:bg-green-600 text-white text-xs uppercase tracking-wider font-bold px-4 py-3 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />} Confirm &amp; Finalise
          </button>
          <button onClick={onClose} className="flex-1 border border-zinc-700 text-zinc-400 hover:border-white hover:text-white text-xs uppercase tracking-wider font-bold px-4 py-3 transition-colors">Cancel</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
