import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Pencil, Trash2, GripVertical } from "lucide-react";

export interface Idea {
  id: string;
  proposerName: string;
  title: string;
  description: string;
  category: "Cost Saving" | "Revenue Growth" | "Both";
  priority: "High" | "Medium" | "Low";
  status: "Belum" | "Proses" | "Selesai";
  ideaDate: string;
  startDate?: string;
  endDate?: string;
  impact: string;
  edited_at?: string | null;
  deleted_at?: string | null;
}

interface IdeaCardProps {
  idea: Idea;
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}

export function IdeaCard({ idea, onEdit, onDelete, isDragging }: IdeaCardProps) {
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case "Cost Saving":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "Revenue Growth":
        return "bg-green-50 text-green-600 border-green-200";
      case "Both":
        return "bg-purple-50 text-purple-600 border-purple-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case "Cost Saving":
        return "💸";
      case "Revenue Growth":
        return "🚀";
      case "Both":
        return "🔥";
      default:
        return "💡";
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-600 border-red-200";
      case "Medium":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "Low":
        return "bg-slate-50 text-slate-600 border-slate-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getPriorityEmoji = (priority: string) => {
    switch (priority) {
      case "High":
        return "🔴";
      case "Medium":
        return "🟡";
      case "Low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Selesai":
        return "bg-teal-50 text-teal-600 border-teal-200";
      case "Proses":
        return "bg-orange-50 text-orange-600 border-orange-200";
      case "Belum":
        return "bg-gray-50 text-gray-600 border-gray-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case "Selesai":
        return "✅";
      case "Proses":
        return "🛠️";
      case "Belum":
        return "⏳";
      default:
        return "📋";
    }
  };

  const getCardBackground = () => {
    const backgrounds = [
      "bg-gradient-to-br from-pink-50/80 via-white to-purple-50/80",
      "bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/80",
      "bg-gradient-to-br from-green-50/80 via-white to-emerald-50/80",
      "bg-gradient-to-br from-amber-50/80 via-white to-orange-50/80",
      "bg-gradient-to-br from-violet-50/80 via-white to-indigo-50/80",
    ];
    const index = parseInt(idea.id, 36) % backgrounds.length;
    return backgrounds[index];
  };

  return (
    <Card
      className={`p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 rounded-3xl ${getCardBackground()} backdrop-blur-sm relative group ${
        isDragging ? "opacity-50 rotate-2" : ""
      }`}
    >
      {/* Drag Handle */}
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-purple-100 border-2 border-purple-200 rounded-full p-2 cursor-grab active:cursor-grabbing shadow-md">
          <GripVertical className="w-4 h-4 text-purple-600" />
        </div>
      </div>

      <div className="flex justify-between items-start mb-5">
        <div className="flex gap-2 flex-wrap">
          <Badge
            className={`${getCategoryStyle(idea.category)} rounded-full px-3 py-1.5 shadow-sm font-medium`}
            variant="outline"
          >
            <span className="mr-1">{getCategoryEmoji(idea.category)}</span>
            {idea.category}
          </Badge>
          <Badge
            className={`${getPriorityStyle(idea.priority)} rounded-full px-3 py-1.5 shadow-sm font-medium`}
            variant="outline"
          >
            <span className="mr-1">{getPriorityEmoji(idea.priority)}</span>
            {idea.priority}
          </Badge>
          <Badge
            className={`${getStatusStyle(idea.status)} rounded-full px-3 py-1.5 shadow-sm font-medium`}
            variant="outline"
          >
            <span className="mr-1">{getStatusEmoji(idea.status)}</span>
            {idea.status}
          </Badge>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(idea)}
            className="h-9 w-9 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(idea.id)}
            className="h-9 w-9 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1 font-medium">
            <span>👤</span> Nama Pengusul
          </p>
          <p className="font-semibold text-gray-800">{idea.proposerName}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1 font-medium">
            <span>💡</span> Judul Ide
          </p>
          <h3 className="font-bold text-lg text-gray-900 leading-snug">
            {idea.title}
          </h3>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1 font-medium">
            <span>📝</span> Deskripsi
          </p>
          <p className="text-gray-700 leading-relaxed">{idea.description}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1 font-medium">
            <span>📅</span> Tanggal Ide
          </p>
          <p className="text-gray-700">{idea.ideaDate}</p>
        </div>

        {(idea.startDate || idea.endDate) && (
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1 font-medium">
              <span>📆</span> Timeline
            </p>
            <p className="text-gray-700">
              {idea.startDate || "–"} / {idea.endDate || "–"}
            </p>
          </div>
        )}

        {idea.impact && (
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1 font-medium">
              <span>🎯</span> Impact ke Kantor
            </p>
            <p className="text-gray-700 bg-amber-50/50 p-3 rounded-2xl border border-amber-100">
              {idea.impact}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
