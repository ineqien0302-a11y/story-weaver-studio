import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, List, Minus, Plus, Settings2, X,
  Bookmark, BookmarkCheck, Sun, Moon, AlignLeft, AlignJustify,
  Type, ChevronUp, ChevronDown, Keyboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { mockStories, mockChapters } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

type BgMode = "white" | "sepia" | "night" | "dark";
type FontFamily = "serif" | "sans";

const BG_MODES: { id: BgMode; label: string; bg: string; text: string; icon: React.ReactNode }[] = [
  { id: "white",  label: "Trắng",  bg: "#ffffff", text: "#1a1a1a", icon: <Sun className="h-4 w-4" /> },
  { id: "sepia",  label: "Sepia",  bg: "#f3ead8", text: "#3d2b1f", icon: <Type className="h-4 w-4" /> },
  { id: "night",  label: "Đêm",    bg: "#1a1a2e", text: "#c8c8e8", icon: <Moon className="h-4 w-4" /> },
  { id: "dark",   label: "Tối",    bg: "#121212", text: "#d4d4d4", icon: <Moon className="h-4 w-4" /> },
];

const Reader = () => {
  const { storyId, chapterNum } = useParams<{ storyId: string; chapterNum: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Settings state
  const [fontSize, setFontSize]       = useState(18);
  const [lineHeight, setLineHeight]   = useState(1.9);
  const [fontFamily, setFontFamily]   = useState<FontFamily>("serif");
  const [bgMode, setBgMode]           = useState<BgMode>("white");
  const [showSettings, setShowSettings] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const lastScrollY = useRef(0);
  const settingsRef = useRef<HTMLDivElement>(null);

  const story    = mockStories.find((s) => s.id === storyId);
  const chapters = storyId ? mockChapters[storyId] || [] : [];
  const chapterNumber = parseInt(chapterNum || "1", 10);
  const chapter  = chapters.find((c) => c.chapter_number === chapterNumber);
  const hasPrev  = chapterNumber > 1;
  const hasNext  = chapterNumber < chapters.length;

  const currentBg = BG_MODES.find(b => b.id === bgMode)!;

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft"  && hasPrev) navigate(`/read/${storyId}/${chapterNumber - 1}`);
      if (e.key === "ArrowRight" && hasNext)  navigate(`/read/${storyId}/${chapterNumber + 1}`);
      if (e.key === "+"  || e.key === "=")   setFontSize(s => Math.min(28, s + 2));
      if (e.key === "-")                      setFontSize(s => Math.max(14, s - 2));
      if (e.key === "b"  || e.key === "B")   handleBookmark();
      if (e.key === "Escape")                 setShowSettings(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterNumber, hasPrev, hasNext, storyId]);

  // Scroll tracking + auto-hide controls
  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    setScrollProgress(docH > 0 ? (y / docH) * 100 : 0);
    setShowControls(y < lastScrollY.current || y < 80);
    lastScrollY.current = y;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => { window.scrollTo(0, 0); }, [chapterNumber]);

  // Close settings on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    };
    if (showSettings) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showSettings]);

  const handleBookmark = () => {
    setIsBookmarked(prev => {
      const next = !prev;
      toast({ title: next ? "Đã đánh dấu chương này!" : "Đã bỏ đánh dấu", description: next ? `Ch. ${chapterNumber} — ${chapter?.title}` : undefined });
      return next;
    });
  };

  if (!story || !chapter) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Không tìm thấy chương.</p>
          <Button asChild variant="link" className="mt-4"><Link to="/">← Trang chủ</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: currentBg.bg, color: currentBg.text }}>
      {/* Top Progress bar */}
      <div className="fixed left-0 right-0 top-0 z-50">
        <div className="h-0.5 w-full" style={{ backgroundColor: `${currentBg.text}20` }}>
          <div className="h-full transition-all duration-150" style={{ width: `${scrollProgress}%`, backgroundColor: "hsl(var(--jade))" }} />
        </div>
      </div>

      {/* Breadcrumb header */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-2 transition-all duration-300 ${showControls ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
        style={{ backgroundColor: `${currentBg.bg}e8`, backdropFilter: "blur(8px)", borderBottom: `1px solid ${currentBg.text}15` }}
      >
        <Link to={`/story/${storyId}`} className="flex items-center gap-1.5 text-xs opacity-60 hover:opacity-100 transition-opacity" style={{ color: currentBg.text }}>
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline max-w-[200px] truncate">{story.title}</span>
          <span className="sm:hidden">Mục lục</span>
        </Link>

        <p className="text-xs opacity-60" style={{ color: currentBg.text }}>
          Ch. {chapterNumber}/{chapters.length} · {Math.round(scrollProgress)}%
        </p>

        <div className="flex items-center gap-1">
          <button
            onClick={handleBookmark}
            className="p-1.5 rounded-md transition-colors hover:bg-black/10"
            style={{ color: isBookmarked ? "hsl(var(--jade))" : currentBg.text }}
          >
            {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setShowSettings(s => !s)}
            className="p-1.5 rounded-md transition-colors hover:bg-black/10"
            style={{ color: currentBg.text }}
          >
            <Settings2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div ref={settingsRef} className="fixed top-14 right-4 z-50 w-72 rounded-xl border shadow-2xl p-4 space-y-4" style={{ backgroundColor: currentBg.bg, borderColor: `${currentBg.text}20`, color: currentBg.text }}>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm">Cài đặt đọc</p>
            <button onClick={() => setShowSettings(false)}><X className="h-4 w-4 opacity-50" /></button>
          </div>

          {/* Font size */}
          <div>
            <p className="text-xs opacity-60 mb-2">Cỡ chữ: {fontSize}px</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setFontSize(s => Math.max(14, s - 2))} className="p-1 rounded hover:bg-black/10"><Minus className="h-3.5 w-3.5" /></button>
              <Slider value={[fontSize]} min={14} max={28} step={2} onValueChange={([v]) => setFontSize(v)} className="flex-1" />
              <button onClick={() => setFontSize(s => Math.min(28, s + 2))} className="p-1 rounded hover:bg-black/10"><Plus className="h-3.5 w-3.5" /></button>
            </div>
          </div>

          {/* Line height */}
          <div>
            <p className="text-xs opacity-60 mb-2">Giãn dòng: {lineHeight.toFixed(1)}</p>
            <div className="flex items-center gap-3">
              <ChevronDown className="h-3.5 w-3.5 shrink-0" />
              <Slider value={[lineHeight]} min={1.4} max={2.4} step={0.1} onValueChange={([v]) => setLineHeight(v)} className="flex-1" />
              <ChevronUp className="h-3.5 w-3.5 shrink-0" />
            </div>
          </div>

          <Separator style={{ backgroundColor: `${currentBg.text}15` }} />

          {/* Font family */}
          <div>
            <p className="text-xs opacity-60 mb-2">Font chữ</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "serif" as FontFamily, label: "Serif", sub: "Merriweather" },
                { id: "sans"  as FontFamily, label: "Sans",  sub: "Inter" },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFontFamily(f.id)}
                  className="rounded-lg border p-2.5 text-left transition-all"
                  style={{
                    borderColor: fontFamily === f.id ? "hsl(var(--jade))" : `${currentBg.text}20`,
                    backgroundColor: fontFamily === f.id ? "hsl(var(--jade) / 0.1)" : "transparent",
                  }}
                >
                  <p className="text-xs font-semibold">{f.label}</p>
                  <p className="text-[10px] opacity-50">{f.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Background */}
          <div>
            <p className="text-xs opacity-60 mb-2">Nền đọc</p>
            <div className="grid grid-cols-4 gap-2">
              {BG_MODES.map(m => (
                <button
                  key={m.id}
                  onClick={() => setBgMode(m.id)}
                  title={m.label}
                  className="h-8 rounded-lg border-2 transition-all"
                  style={{
                    backgroundColor: m.bg,
                    borderColor: bgMode === m.id ? "hsl(var(--jade))" : "transparent",
                    boxShadow: bgMode === m.id ? "0 0 0 1px hsl(var(--jade))" : "none",
                  }}
                />
              ))}
            </div>
            <div className="mt-1 grid grid-cols-4 gap-2">
              {BG_MODES.map(m => (
                <p key={m.id} className="text-center text-[9px] opacity-50">{m.label}</p>
              ))}
            </div>
          </div>

          <Separator style={{ backgroundColor: `${currentBg.text}15` }} />
          <button
            onClick={() => setShowShortcuts(s => !s)}
            className="flex items-center gap-1.5 text-xs opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: currentBg.text }}
          >
            <Keyboard className="h-3.5 w-3.5" /> Phím tắt
          </button>
          {showShortcuts && (
            <div className="rounded-lg p-3 space-y-1.5 text-xs" style={{ backgroundColor: `${currentBg.text}08` }}>
              {[["←  /  →", "Chương trước/sau"], ["+ / -", "Tăng/giảm chữ"], ["B", "Đánh dấu chương"], ["Esc", "Đóng cài đặt"]].map(([k, d]) => (
                <div key={k} className="flex justify-between">
                  <code className="font-mono opacity-70">{k}</code>
                  <span className="opacity-50">{d}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <article className="mx-auto max-w-[720px] px-5 sm:px-8 pb-32 pt-20">
        {/* Chapter header */}
        <div className="mb-10 border-l-4 pl-5" style={{ borderColor: "hsl(var(--jade))" }}>
          <p className="text-xs mb-1 opacity-50">Chương {chapter.chapter_number}</p>
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: fontFamily === "serif" ? "Merriweather, Georgia, serif" : "Inter, system-ui, sans-serif" }}>
            {chapter.title}
          </h1>
          <p className="text-xs mt-2 opacity-40">{(chapter.word_count / 1000).toFixed(1)}k từ</p>
        </div>

        {/* Body */}
        <div style={{
          fontSize: `${fontSize}px`,
          lineHeight: lineHeight,
          fontFamily: fontFamily === "serif" ? "Merriweather, Georgia, serif" : "Inter, system-ui, sans-serif",
          letterSpacing: fontFamily === "serif" ? "0.02em" : "0",
        }}>
          {chapter.content.split("\n\n").map((para, i) => (
            <p key={i} className="mb-6">{para}</p>
          ))}
        </div>

        {/* Bottom navigation */}
        <div className="mt-16 border-t pt-8 flex flex-col items-center gap-5" style={{ borderColor: `${currentBg.text}15` }}>
          <div className="flex items-center gap-3">
            <button
              disabled={!hasPrev}
              onClick={() => navigate(`/read/${storyId}/${chapterNumber - 1}`)}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all disabled:opacity-30 hover:bg-black/10"
              style={{ color: currentBg.text }}
            >
              <ArrowLeft className="h-4 w-4" /> Chương trước
            </button>
            <button
              onClick={() => navigate(`/story/${storyId}`)}
              className="px-4 py-2 rounded-lg text-sm transition-all hover:bg-black/10"
              style={{ color: currentBg.text, opacity: 0.6 }}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              disabled={!hasNext}
              onClick={() => navigate(`/read/${storyId}/${chapterNumber + 1}`)}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all disabled:opacity-30 hover:bg-black/10"
              style={{ color: currentBg.text }}
            >
              Chương sau <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </article>

      {/* Floating bottom bar (auto-hide) */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-1 px-4 py-3 transition-all duration-300 ${showControls ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
        style={{ backgroundColor: `${currentBg.bg}f0`, backdropFilter: "blur(12px)", borderTop: `1px solid ${currentBg.text}12` }}
      >
        <button
          disabled={!hasPrev}
          onClick={() => navigate(`/read/${storyId}/${chapterNumber - 1}`)}
          className="p-2 rounded-lg transition-all disabled:opacity-30 hover:bg-black/10"
          style={{ color: currentBg.text }}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="mx-2 h-4 w-px" style={{ backgroundColor: `${currentBg.text}20` }} />

        <button onClick={() => setFontSize(s => Math.max(14, s - 2))} className="p-2 rounded-lg hover:bg-black/10" style={{ color: currentBg.text }}>
          <AlignLeft className="h-4 w-4" />
        </button>
        <span className="text-[11px] w-6 text-center opacity-50" style={{ color: currentBg.text }}>{fontSize}</span>
        <button onClick={() => setFontSize(s => Math.min(28, s + 2))} className="p-2 rounded-lg hover:bg-black/10" style={{ color: currentBg.text }}>
          <AlignJustify className="h-4 w-4" />
        </button>

        <div className="mx-2 h-4 w-px" style={{ backgroundColor: `${currentBg.text}20` }} />

        <button
          disabled={!hasNext}
          onClick={() => navigate(`/read/${storyId}/${chapterNumber + 1}`)}
          className="p-2 rounded-lg transition-all disabled:opacity-30 hover:bg-black/10"
          style={{ color: currentBg.text }}
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Reader;
