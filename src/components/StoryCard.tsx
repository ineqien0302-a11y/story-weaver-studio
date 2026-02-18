import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, MessageSquare, Star, BookOpen, Heart, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Story } from "@/lib/mock-data";

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

const statusConfig: Record<string, { label: string; className: string }> = {
  ongoing:   { label: "Đang ra",     className: "bg-jade text-white" },
  completed: { label: "Hoàn thành",  className: "bg-imperial text-white" },
  hiatus:    { label: "Tạm dừng",    className: "bg-muted text-muted-foreground" },
};

// ── LIST variant (default) ──────────────────────────────────────────────────
function StoryCardList({ story }: { story: Story }) {
  const [liked, setLiked] = useState(false);
  const st = statusConfig[story.status] ?? statusConfig.ongoing;

  return (
    <div className="group relative flex gap-4 border-b border-border px-4 py-5 transition-colors hover:bg-muted/30">
      <Link to={`/story/${story.id}`} className="absolute inset-0 z-0" aria-label={story.title} />

      {/* Cover */}
      <div
        className="relative flex h-[88px] w-[66px] shrink-0 items-center justify-center rounded-md border border-border/50 font-story text-2xl font-bold text-foreground/25 transition-all group-hover:shadow-md group-hover:scale-[1.02]"
        style={{ backgroundColor: story.cover_color }}
      >
        {story.title.charAt(0)}
        <span className={`absolute -top-1.5 -right-1.5 rounded px-1.5 py-0.5 text-[9px] font-bold ${st.className}`}>{st.label}</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold text-foreground group-hover:text-jade transition-colors line-clamp-1">
            {story.title}
          </h3>
          {/* Quick like button */}
          <button
            onClick={e => { e.preventDefault(); setLiked(l => !l); }}
            className="relative z-10 shrink-0 p-1 rounded-md hover:bg-imperial/10 transition-colors"
            aria-label="Yêu thích"
          >
            <Heart className={`h-3.5 w-3.5 transition-colors ${liked ? "fill-imperial text-imperial" : "text-muted-foreground"}`} />
          </button>
        </div>

        <Link
          to={`/author/${encodeURIComponent(story.author)}`}
          className="relative z-10 text-xs text-muted-foreground hover:text-jade hover:underline transition-colors"
        >
          {story.author}
        </Link>

        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-foreground/70">
          {story.description}
        </p>

        <div className="mt-2.5 flex items-center gap-3">
          <div className="flex flex-wrap gap-1">
            {story.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded px-1.5 py-0.5 text-[10px] font-medium text-jade bg-jade/10">
                {tag}
              </span>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2.5 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" /> {formatCount(story.views)}</span>
            <span className="flex items-center gap-0.5"><MessageSquare className="h-3 w-3" /> {formatCount(story.comments)}</span>
            <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-gold text-gold" /> {story.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── GRID variant ────────────────────────────────────────────────────────────
function StoryCardGrid({ story }: { story: Story }) {
  const [liked, setLiked] = useState(false);
  const st = statusConfig[story.status] ?? statusConfig.ongoing;

  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
      <Link to={`/story/${story.id}`} className="absolute inset-0 z-0" aria-label={story.title} />

      {/* Cover */}
      <div
        className="relative flex h-36 w-full items-center justify-center font-story text-5xl font-bold text-foreground/20"
        style={{ backgroundColor: story.cover_color }}
      >
        {story.title.charAt(0)}
        <span className={`absolute top-2 left-2 rounded px-1.5 py-0.5 text-[9px] font-bold ${st.className}`}>{st.label}</span>
        <button
          onClick={e => { e.preventDefault(); setLiked(l => !l); }}
          className="relative z-10 absolute top-2 right-2 p-1.5 rounded-md bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <Heart className={`h-3.5 w-3.5 ${liked ? "fill-imperial text-imperial" : "text-muted-foreground"}`} />
        </button>
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-sm font-bold text-foreground group-hover:text-jade transition-colors line-clamp-1">{story.title}</h3>
        <Link
          to={`/author/${encodeURIComponent(story.author)}`}
          className="relative z-10 text-xs text-muted-foreground hover:text-jade transition-colors mt-0.5 line-clamp-1"
        >
          {story.author}
        </Link>
        <p className="mt-2 text-[11px] leading-relaxed text-foreground/60 line-clamp-2 flex-1">{story.description}</p>
        <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="flex items-center gap-0.5"><BookOpen className="h-3 w-3" /> {story.chapter_count}ch</span>
          <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" /> {formatCount(story.views)}</span>
          <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-gold text-gold" /> {story.rating}</span>
        </div>
      </div>
    </div>
  );
}

// ── COMPACT variant (for sidebars etc.) ────────────────────────────────────
function StoryCardCompact({ story }: { story: Story }) {
  return (
    <Link
      to={`/story/${story.id}`}
      className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
    >
      <div
        className="flex h-10 w-8 shrink-0 items-center justify-center rounded text-sm font-bold text-foreground/30"
        style={{ backgroundColor: story.cover_color }}
      >
        {story.title.charAt(0)}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold truncate">{story.title}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
          <Clock className="h-2.5 w-2.5" /> {story.updated_at}
        </p>
      </div>
    </Link>
  );
}

// ── Exported main component — defaults to list mode ─────────────────────────
export function StoryCard({ story, variant = "list" }: { story: Story; variant?: "list" | "grid" | "compact" }) {
  if (variant === "grid")    return <StoryCardGrid story={story} />;
  if (variant === "compact") return <StoryCardCompact story={story} />;
  return <StoryCardList story={story} />;
}
