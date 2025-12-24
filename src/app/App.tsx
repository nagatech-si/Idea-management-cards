import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DraggableIdeaCard } from "./components/DraggableIdeaCard";
import { Idea } from "./components/IdeaCard";
import { IdeaForm } from "./components/IdeaForm";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Toaster, toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  Zap,
  CheckCircle2,
} from "lucide-react";

export default function App() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProposer, setFilterProposer] = useState("all");

  // ✅ FILTER TANGGAL IDE (BARU)
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  // =========================
  // READ
  // =========================
  const fetchIdeas = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("ideas")
      .select("*")
      .order("created_at", { ascending: false });

    const mapped: Idea[] =
      data?.map((item: any) => ({
        id: item.id,
        proposerName: item.nama_pengusul,
        title: item.judul,
        description: item.deskripsi,
        category: item.kategori,
        priority: item.prioritas,
        status: item.status,
        ideaDate: item.tanggal_ide,
        startDate: item.mulai,
        endDate: item.selesai,
        impact: item.impact,
        edited_at: item.edited_at,
        deleted_at: item.deleted_at,
      })) || [];

    setIdeas(mapped);
    setLoading(false);
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  // =========================
  // CREATE & UPDATE
  // =========================
  const handleSaveIdea = async (idea: Idea) => {
    const payload = {
      nama_pengusul: idea.proposerName,
      judul: idea.title,
      deskripsi: idea.description,
      kategori: idea.category,
      prioritas: idea.priority,
      status: idea.status,
      tanggal_ide: idea.ideaDate,
      mulai: idea.startDate || null,
      selesai: idea.endDate || null,
      impact: idea.impact,
    };

    if (editingIdea) {
      await supabase.from("ideas").update({
        ...payload,
        edited_at: new Date().toISOString(),
      }).eq("id", editingIdea.id);
      toast.success("Ide berhasil diperbarui! ✨");
    } else {
      await supabase.from("ideas").insert(payload);
      toast.success("Ide baru berhasil ditambahkan! 🎉");
    }

    setIsFormOpen(false);
    setEditingIdea(null);
    await fetchIdeas();
  };

  // =========================
  // DELETE
  // =========================
  const handleDeleteIdea = async (id: string) => {
    if (!confirm("Hapus ide ini?")) return;
    await supabase.from("ideas").update({
      deleted_at: new Date().toISOString(),
    }).eq("id", id);
    toast.success("Ide berhasil dihapus! 🗑️");
    await fetchIdeas();
  };

  // =========================
  // FILTERING (DITAMBAH TANGGAL)
  // =========================
  const filteredIdeas = ideas.filter((idea) => {
    // Exclude deleted ideas
    if (idea.deleted_at) return false;

    const q = searchQuery.toLowerCase();

    const ideaDate =
      idea.ideaDate && idea.ideaDate !== ""
        ? new Date(idea.ideaDate)
        : null;

    const fromDate = filterDateFrom ? new Date(filterDateFrom) : null;
    const toDate = filterDateTo ? new Date(filterDateTo) : null;

    const matchDate =
      !fromDate && !toDate
        ? true
        : ideaDate
        ? (!fromDate || ideaDate >= fromDate) &&
          (!toDate || ideaDate <= toDate)
        : true;

    return (
      matchDate &&
      (filterCategory === "all" || idea.category === filterCategory) &&
      (filterPriority === "all" || idea.priority === filterPriority) &&
      (filterStatus === "all" || idea.status === filterStatus) &&
      (filterProposer === "all" || idea.proposerName === filterProposer) &&
      (idea.title.toLowerCase().includes(q) ||
        idea.description.toLowerCase().includes(q) ||
        idea.proposerName.toLowerCase().includes(q))
    );
  });

  const uniqueProposers = Array.from(
    new Set(ideas.map((i) => i.proposerName))
  );

  // =========================
  // RENDER
  // =========================
  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            fontSize: "16px",
            padding: "16px 24px",
            borderRadius: "12px",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
          },
          classNames: {
            toast: "text-lg",
          },
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto p-6 space-y-6">

          {/* HEADER */}
          <div className="rounded-3xl bg-white/80 p-8 shadow">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-700" />
              <h1 className="text-4xl font-bold">Idea Management Board</h1>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="grid grid-cols-4 gap-4">
            <SummaryCard title="Total Ide" value={ideas.length} icon={<Sparkles />} />
            <SummaryCard title="High Priority" value={ideas.filter(i => i.priority === "High").length} icon={<Zap />} />
            <SummaryCard title="Dalam Proses" value={ideas.filter(i => i.status === "Proses").length} icon={<TrendingUp />} />
            <SummaryCard title="Selesai" value={ideas.filter(i => i.status === "Selesai").length} icon={<CheckCircle2 />} />
          </div>

          {/* FILTER */}

          <div className="bg-white/80 rounded-2xl p-4 shadow space-y-4">
            {/* ROW 1: SEARCH + DATE FILTERS */}
            <div className="flex flex-wrap gap-3 items-end">
              {/* SEARCH */}
              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cari ide..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* FILTER TANGGAL DARI */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600">Tanggal Ide Dari</label>
                <Input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="w-[160px]"
                />
              </div>

              {/* FILTER TANGGAL SAMPAI */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600">Tanggal Ide Sampai</label>
                <Input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="w-[160px]"
                />
              </div>
            </div>

            {/* ROW 2: FILTER OPTIONS WITH TITLES */}
            <div className="flex flex-wrap gap-4 items-end">
              {/* FILTER PENGUSUL */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">Nama Pengusul</label>
                <Select value={filterProposer} onValueChange={setFilterProposer}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pengusul" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Pengusul</SelectItem>
                    {uniqueProposers.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* FILTER PRIORITY */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">Prioritas</label>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Prioritas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* FILTER STATUS */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="Belum">Belum</SelectItem>
                    <SelectItem value="Proses">Proses</SelectItem>
                    <SelectItem value="Selesai">Selesai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* ACTION BUTTON */}
          <div className="flex gap-3">
            <Button onClick={() => setIsFormOpen(true)} size="lg" className="text-lg px-8 py-6">
              <Plus /> Tambah Ide
            </Button>
          </div>

          {/* PRO TIP */}
          <div className="bg-blue-100/70 border border-blue-200 rounded-2xl p-4 text-sm text-blue-800">
            💡 <strong>Pro tip:</strong> Gunakan filter tanggal untuk review ide mingguan / bulanan.
          </div>

          {/* GRID */}
          {loading ? (
            <div className="text-center py-20 text-gray-500">
              ⏳ Mengambil data dari Supabase...
            </div>
          ) : filteredIdeas.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              Tidak ada ide sesuai filter
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIdeas.map((idea, index) => (
                <DraggableIdeaCard
                  key={idea.id}
                  idea={idea}
                  index={index}
                  moveCard={() => {}}
                  onEdit={(i) => {
                    setEditingIdea(i);
                    setIsFormOpen(true);
                  }}
                  onDelete={handleDeleteIdea}
                />
              ))}
            </div>
          )}
        </div>

        {/* MODALS */}
        <IdeaForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingIdea(null);
          }}
          onSave={handleSaveIdea}
          editingIdea={editingIdea}
        />
      </div>
    </DndProvider>
  );
}

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white/90 p-5 shadow flex justify-between items-center">
      <div>
        <p className="font-semibold text-gray-700">{title}</p>
        <h2 className="text-3xl font-bold mt-1">{value}</h2>
      </div>
      <div className="text-purple-600">{icon}</div>
    </div>
  );
}

