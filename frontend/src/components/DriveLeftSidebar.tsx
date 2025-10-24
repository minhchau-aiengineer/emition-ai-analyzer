import { useState } from "react";
import "../types/drive-sidebar.css"
import {
  Plus, Home, Folder, Monitor, Users, Clock, Star,
  AlertCircle, Trash2, Cloud, ChevronRight, ChevronDown, Settings, HelpCircle,
  Upload, Video, Music,
  FileText, Mic, Image, Layers, Film
} from "lucide-react";

type ItemKey =
  | "dashboard" | "new-analysis"
  // core analysis pages (replaced old drive-like keys)
  | "text-sentiment" | "audio-sentiment" | "vision-sentiment" | "fused-model" | "max-fusion"
  | "spam" | "trash" | "storage";

type SidebarItem = {
  key: ItemKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  className?: string;
};

const PRIMARY: SidebarItem[] = [
  // core app pages
  { key: "dashboard", label: "Dashboard", icon: Home },

  // Sentiment analysis feature pages (replacing previous drive items)
  { key: "text-sentiment", label: "Text Sentiment", icon: FileText },
  { key: "audio-sentiment", label: "Audio Sentiment", icon: Mic },
  { key: "vision-sentiment", label: "Vision Sentiment", icon: Image },
  { key: "fused-model", label: "Fused Model", icon: Layers },
  { key: "max-fusion", label: "Max Fusion (Video)", icon: Film },

  { key: "spam", label: "Discarded", icon: AlertCircle },
  { key: "trash", label: "Trash", icon: Trash2 },
  { key: "storage", label: "Storage", icon: Cloud, badge: "" },
];

export interface DriveLeftSidebarProps {
  active?: ItemKey;
  onChange?: (key: ItemKey) => void;
  usedStorageGB?: number;   // ví dụ 13.39
  totalStorageGB?: number;  // ví dụ 2048 (2TB)
  className?: string;
  // optional callbacks so App can wire actions to the main UI without
  // changing existing onChange behavior.
  onUploadClick?: () => void;
  onRecord?: (mode: 'video' | 'audio') => void;
}

export default function DriveLeftSidebar({
  active = "text-sentiment",
  onChange,
  usedStorageGB = 13.39,
  totalStorageGB = 2048,
  className = "",
  onUploadClick,
  onRecord,
}: DriveLeftSidebarProps) {
  const [open, setOpen] = useState(true); // mở/đóng nhóm menu (mobile)

  const pct = Math.min(100, Math.round((usedStorageGB / totalStorageGB) * 10000) / 100); // 2 chữ số
  const storageText = `${usedStorageGB.toLocaleString("vi-VN")} GB trong tổng số ${(totalStorageGB / 1024).toLocaleString("vi-VN")} TB`;

  const Item = ({ item }: { item: SidebarItem }) => {
    const Icon = item.icon;
    const isActive = active === item.key;
    return (
      <button
        onClick={() => onChange?.(item.key)}
        className={`sb-btn w-full flex items-center gap-3 rounded-lg text-sm transition
          ${isActive ? "bg-blue-600/10 text-blue-400 ring-1 ring-inset ring-blue-600/30" : "text-gray-300 hover:bg-gray-700/40"}
          ${item.className ?? ""}`}
      >
        <Icon className="sb-icon shrink-0" />
        <span className="flex-1 text-left">{item.label}</span>
        {item.badge && (
          <span className="sb-badge text-gray-400">{item.badge}</span>
        )}
      </button>
    );
  };

  return (
    <aside className={`drive-sidebar h-full w-72 min-w-56 max-w-80 bg-gray-900/40 border-r border-gray-800 px-3 py-3 ${className}`}>
      {/* Header: quick actions + toggler mobile */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2 items-center">
          <button
            className="sb-btn inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow"
            onClick={() => onChange?.("new-analysis")}
            aria-label="New Analysis"
          >
            <Plus className="sb-icon" />
            <span className="font-medium">New Analysis</span>
          </button>
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-800 text-gray-300"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick action bar (upload / record) */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <button
          onClick={() => onUploadClick ? onUploadClick() : onChange?.("text-sentiment")}
          className="flex flex-col items-center gap-1 p-2 rounded bg-gray-800 hover:bg-gray-700 text-xs"
          title="Upload file"
        >
          <Upload className="w-5 h-5 text-blue-400" />
          <span>Upload</span>
        </button>
        <button
          onClick={() => onRecord ? onRecord('video') : onChange?.("max-fusion")}
          className="flex flex-col items-center gap-1 p-2 rounded bg-gray-800 hover:bg-gray-700 text-xs"
          title="Record video"
        >
          <Video className="w-5 h-5 text-green-400" />
          <span>Video</span>
        </button>
        <button
          onClick={() => onRecord ? onRecord('audio') : onChange?.("audio-sentiment")}
          className="flex flex-col items-center gap-1 p-2 rounded bg-gray-800 hover:bg-gray-700 text-xs"
          title="Record audio"
        >
          <Music className="w-5 h-5 text-red-400" />
          <span>Audio</span>
        </button>
      </div>

      {/* Menu */}
      <nav className={`${open ? "block" : "hidden md:block"} space-y-1`}>
        {PRIMARY.slice(0, 8).map((item) => (
          <Item key={item.key} item={item} />
        ))}

        {/* Storage block */}
        <div className="pt-2 mt-2 border-t border-gray-800">
          <Item item={PRIMARY[8]} />
          <div className="px-3 py-2">
            <div className="sb-progress w-full bg-gray-800 overflow-hidden">
              <div
                className="h-full bg-blue-500" style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-gray-400">{storageText}</div>
            <button
              className="sb-btn mt-2 w-full text-center text-sm rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 transition"
              onClick={() => onChange?.("storage")}
            >
              Mua thêm bộ nhớ
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-3 flex items-center justify-between px-1 text-gray-400">
          <button className="sb-btn flex items-center gap-2 rounded hover:bg-gray-800">
            <Settings className="sb-icon" />

            <span className="text-sm">Cài đặt</span>
          </button>
          <button className="sb-btn flex items-center gap-2 rounded hover:bg-gray-800">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm">Trợ giúp</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
