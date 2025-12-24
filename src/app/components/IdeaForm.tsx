import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Idea } from "./IdeaCard";
import { Sparkles } from "lucide-react";

interface IdeaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (idea: Omit<Idea, "id">) => void;
  editingIdea?: Idea | null;
}

export function IdeaForm({
  isOpen,
  onClose,
  onSave,
  editingIdea,
}: IdeaFormProps) {
  const [formData, setFormData] = useState<Omit<Idea, "id">>({
    proposerName: "",
    title: "",
    description: "",
    category: "Cost Saving",
    priority: "Medium",
    status: "Belum",
    ideaDate: "",        // YYYY-MM-DD
    startDate: null,     // YYYY-MM-DD | null
    endDate: null,       // YYYY-MM-DD | null
    impact: "",
  });

  // =========================
  // LOAD DATA SAAT EDIT
  // =========================
  useEffect(() => {
    if (editingIdea) {
      setFormData({
        proposerName: editingIdea.proposerName,
        title: editingIdea.title,
        description: editingIdea.description,
        category: editingIdea.category,
        priority: editingIdea.priority,
        status: editingIdea.status,
        ideaDate: editingIdea.ideaDate ?? "",
        startDate: editingIdea.startDate || null,
        endDate: editingIdea.endDate || null,
        impact: editingIdea.impact,
      });
    } else {
      setFormData({
        proposerName: "",
        title: "",
        description: "",
        category: "Cost Saving",
        priority: "Medium",
        status: "Belum",
        ideaDate: "",
        startDate: null,
        endDate: null,
        impact: "",
      });
    }
  }, [editingIdea, isOpen]);

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <div>
              <DialogTitle>
                {editingIdea ? "Edit Ide" : "Tambah Ide"}
              </DialogTitle>
              <DialogDescription>
                Isi informasi ide secara singkat dan jelas
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">

          {/* Nama Pengusul */}
          <div>
            <Label>Nama Pengusul</Label>
            <Input
              value={formData.proposerName}
              onChange={(e) =>
                setFormData({ ...formData, proposerName: e.target.value })
              }
              required
            />
          </div>

          {/* Judul */}
          <div>
            <Label>Judul Ide</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          {/* Deskripsi */}
          <div>
            <Label>Deskripsi</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          {/* KATEGORI / PRIORITAS / STATUS */}
<div className="grid grid-cols-3 gap-4">

  {/* KATEGORI */}
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      Kategori
    </label>
    <Select
      value={formData.category}
      onValueChange={(value) =>
        setFormData({ ...formData, category: value })
      }
    >
      <SelectTrigger className="bg-white">
        <SelectValue placeholder="Pilih kategori" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Cost Saving">Cost Saving</SelectItem>
        <SelectItem value="Revenue Growth">Revenue Growth</SelectItem>
        <SelectItem value="Both">Both</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* PRIORITAS */}
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      Prioritas
    </label>
    <Select
      value={formData.priority}
      onValueChange={(value) =>
        setFormData({ ...formData, priority: value })
      }
    >
      <SelectTrigger className="bg-white">
        <SelectValue placeholder="Pilih prioritas" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="High">High</SelectItem>
        <SelectItem value="Medium">Medium</SelectItem>
        <SelectItem value="Low">Low</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* STATUS */}
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      Status
    </label>
    <Select
      value={formData.status}
      onValueChange={(value) =>
        setFormData({ ...formData, status: value })
      }
    >
      <SelectTrigger className="bg-white">
        <SelectValue placeholder="Pilih status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Belum">Belum</SelectItem>
        <SelectItem value="Proses">Proses</SelectItem>
        <SelectItem value="Selesai">Selesai</SelectItem>
      </SelectContent>
    </Select>
  </div>

</div>


         {/* TANGGAL */}
<div className="grid grid-cols-3 gap-4">

  {/* TANGGAL IDE */}
  <div className="flex flex-col gap-1">
    <label htmlFor="ideaDate" className="text-sm font-medium text-gray-700">
      Tanggal Ide
    </label>
    <input
      id="ideaDate"
      name="ideaDate"
      type="date"
      value={formData.ideaDate}
      onChange={(e) =>
        setFormData({
          ...formData,
          ideaDate: e.target.value,
        })
      }
      required
      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
    />
  </div>

  {/* MULAI */}
  <div className="flex flex-col gap-1">
    <label htmlFor="startDate" className="text-sm font-medium text-gray-700">
      Mulai
    </label>
    <input
      id="startDate"
      name="startDate"
      type="date"
      value={formData.startDate ?? ""}
      onChange={(e) =>
        setFormData({
          ...formData,
          startDate: e.target.value || null,
        })
      }
      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
    />
  </div>

  {/* SELESAI */}
  <div className="flex flex-col gap-1">
    <label htmlFor="endDate" className="text-sm font-medium text-gray-700">
      Selesai
    </label>
    <input
      id="endDate"
      name="endDate"
      type="date"
      value={formData.endDate ?? ""}
      onChange={(e) =>
        setFormData({
          ...formData,
          endDate: e.target.value || null,
        })
      }
      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
    />
  </div>

</div>


          {/* Impact */}
          <div>
            <Label>Impact ke Kantor</Label>
            <Textarea
              value={formData.impact}
              onChange={(e) =>
                setFormData({ ...formData, impact: e.target.value })
              }
            />
          </div>

          {/* ACTION */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              {editingIdea ? "Simpan" : "Tambah"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
