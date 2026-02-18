import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Trophy, TrendingUp, Sparkles } from "lucide-react";
import { mockRankings } from "@/lib/mock-data";

const tabs = [
  { id: "weekly", label: "TOP WEEKLY", icon: Trophy },
  { id: "trending", label: "TRENDING", icon: TrendingUp },
  { id: "new", label: "NEW", icon: Sparkles },
] as const;

export function RankingSidebar() {
  const [activeTab, setActiveTab] = useState<string>("weekly");

  return (
    <aside className="w-72 shrink-0 space-y-6">
      {/* Rankings */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 flex-col items-center gap-1 px-2 py-3 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="divide-y divide-border">
          {mockRankings.map((story, i) => (
            <Link
              key={story.id}
              to={`/story/${story.id}`}
              className="flex items-start gap-3 px-3 py-3 transition-colors hover:bg-muted/30"
            >
              <span className="mt-0.5 text-sm font-bold text-muted-foreground">{i + 1}</span>
              <div
                className="flex h-10 w-8 shrink-0 items-center justify-center rounded-sm border border-border font-story text-sm font-bold text-foreground/30"
                style={{ backgroundColor: story.cover_color }}
              >
                {story.title.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">{story.title}</p>
                <p className="text-[10px] text-muted-foreground">{story.author}</p>
              </div>
              <span className="flex shrink-0 items-center gap-0.5 text-[10px] text-muted-foreground">
                <Star className="h-3 w-3" /> {story.rating}
              </span>
            </Link>
          ))}
        </div>

        <div className="border-t border-border px-3 py-2 text-center">
          <Link to="/rankings" className="text-xs text-muted-foreground hover:text-primary cursor-pointer">
            VIEW ALL RANKINGS →
          </Link>
        </div>
      </div>

      {/* Hot Pick chart */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-foreground">
          TOP THI SĨ HOT PICK
        </h3>
        <div className="flex justify-center gap-4 text-[10px] font-semibold text-muted-foreground">
          <span className="text-primary">NGÀY</span>
          <span>TUẦN</span>
        </div>
        <div className="mt-4 space-y-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((rank) => {
            const width = Math.max(20, 100 - rank * 10);
            const colors = ["bg-jade", "bg-jade", "bg-imperial", "bg-gold", "bg-muted-foreground", "bg-muted-foreground", "bg-muted-foreground", "bg-muted-foreground"];
            return (
              <div key={rank} className="flex items-center gap-2">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold text-white ${
                    rank <= 3 ? colors[rank - 1] : "bg-muted text-muted-foreground"
                  }`}
                >
                  {rank}
                </span>
                <div className="h-3 rounded-sm bg-muted flex-1">
                  <div
                    className={`h-full rounded-sm ${rank <= 3 ? colors[rank - 1] : "bg-muted-foreground/30"}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
