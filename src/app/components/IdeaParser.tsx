import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
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

interface ParsedIdea {
  title: string;
  description: string;
  category: "Cost Saving" | "Revenue Growth" | "Both";
  priority: "High" | "Medium" | "Low";
}

interface IdeaParserProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ideas: Omit<Idea, "id">[]) => void;
  rawText: string;
}

export function IdeaParser({ isOpen, onClose, onSave, rawText }: IdeaParserProps) {
  const [parsedIdeas, setParsedIdeas] = useState<ParsedIdea[]>([]);
  const [proposerName, setProposerName] = useState("");
  const [ideaDate, setIdeaDate] = useState(
    new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  );

  useState(() => {
    // Simple parsing logic
    const lines = rawText.split("\n").filter((line) => line.trim());
    const ideas: ParsedIdea[] = [];

    // Try to extract date
    const dateMatch = lines[0]?.match(/\d{1,2}\s+\w{3}\s+\d{4}/);
    if (dateMatch) {
      setIdeaDate(dateMatch[0]);
      lines.shift();
    }

    // Try to extract proposer name
    if (lines[0] && !lines[0].startsWith("-")) {
      setProposerName(lines[0].trim());
      lines.shift();
    }

    // Extract bullet points as ideas
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("-") || trimmed.startsWith("•")) {
        const text = trimmed.substring(1).trim();
        if (text) {
          // Auto-categorize based on keywords
          let category: "Cost Saving" | "Revenue Growth" | "Both" = "Both";
          let priority: "High" | "Medium" | "Low" = "Medium";

          const lowerText = text.toLowerCase();
          if (
            lowerText.includes("hemat") ||
            lowerText.includes("efisien") ||
            lowerText.includes("kurang") ||
            lowerText.includes("otomasi") ||
            lowerText.includes("automasi")
          ) {
            category = "Cost Saving";
          } else if (
            lowerText.includes("jual") ||
            lowerText.includes("revenue") ||
            lowerText.includes("penjualan") ||
            lowerText.includes("pasar") ||
            lowerText.includes("market")
          ) {
            category = "Revenue Growth";
          }

          if (
            lowerText.includes("urgent") ||
            lowerText.includes("penting") ||
            lowerText.includes("segera")
          ) {
            priority = "High";
          }

          // Generate title (first 50 chars)
          const title = text.length > 50 ? text.substring(0, 50) + "..." : text;

          ideas.push({
            title,
            description: text,
            category,
            priority,
          });
        }
      }
    });

    setParsedIdeas(ideas);
  });

  const handleUpdateIdea = (index: number, field: keyof ParsedIdea, value: string) => {
    const updated = [...parsedIdeas];
    updated[index] = { ...updated[index], [field]: value };
    setParsedIdeas(updated);
  };

  const handleRemoveIdea = (index: number) => {
    setParsedIdeas(parsedIdeas.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalIdeas: Omit<Idea, "id">[] = parsedIdeas.map((idea) => ({
      proposerName,
      title: idea.title,
      description: idea.description,
      category: idea.category,
      priority: idea.priority,
      status: "Belum",
      ideaDate,
      startDate: "",
      endDate: "",
      impact: `Berpotensi memberikan dampak positif melalui ${
        idea.category === "Cost Saving"
          ? "penghematan biaya"
          : idea.category === "Revenue Growth"
          ? "peningkatan revenue"
          : "efisiensi operasional dan peningkatan revenue"
      }.`,
    }));
    onSave(finalIdeas);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review & Edit Kartu Ide</DialogTitle>
          <DialogDescription>
            Tinjau dan edit ide yang terdeteksi sebelum menyimpannya ke board.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="proposerName">Nama Pengusul *</Label>
              <Input
                id="proposerName"
                value={proposerName}
                onChange={(e) => setProposerName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="ideaDate">Tanggal Ide *</Label>
              <Input
                id="ideaDate"
                value={ideaDate}
                onChange={(e) => setIdeaDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-4">
              Ide yang Terdeteksi ({parsedIdeas.length})
            </h3>
            <div className="space-y-6">
              {parsedIdeas.map((idea, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">Ide #{index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveIdea(index)}
                      className="text-red-600"
                    >
                      Hapus
                    </Button>
                  </div>

                  <div>
                    <Label>Judul Ide</Label>
                    <Input
                      value={idea.title}
                      onChange={(e) =>
                        handleUpdateIdea(index, "title", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label>Deskripsi</Label>
                    <Textarea
                      value={idea.description}
                      onChange={(e) =>
                        handleUpdateIdea(index, "description", e.target.value)
                      }
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Kategori</Label>
                      <Select
                        value={idea.category}
                        onValueChange={(value: any) =>
                          handleUpdateIdea(index, "category", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cost Saving">Cost Saving</SelectItem>
                          <SelectItem value="Revenue Growth">
                            Revenue Growth
                          </SelectItem>
                          <SelectItem value="Both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Prioritas</Label>
                      <Select
                        value={idea.priority}
                        onValueChange={(value: any) =>
                          handleUpdateIdea(index, "priority", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={parsedIdeas.length === 0}>
              Simpan {parsedIdeas.length} Ide
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}