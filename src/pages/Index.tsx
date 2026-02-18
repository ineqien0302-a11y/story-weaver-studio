import { useState } from "react";
import { Header } from "@/components/Header";
import { Marquee } from "@/components/Marquee";
import { HeroBanner } from "@/components/HeroBanner";
import { RecentAuthors } from "@/components/RecentAuthors";
import { NewChaptersCarousel } from "@/components/NewChaptersCarousel";
import { StoryCard } from "@/components/StoryCard";
import { RankingSidebar } from "@/components/RankingSidebar";
import { FilterSidebar, type FilterState } from "@/components/FilterSidebar";
import { mockStories } from "@/lib/mock-data";
import { LayoutGrid, LayoutList, Shuffle, Flame, Sparkles, Clock, MessageCircle } from "lucide-react";

type ViewMode = "list" | "grid";

const FILTER_TABS = [
  { id: "Xào trộn",  icon: <Shuffle    className="h-3 w-3" />, color: "bg-jade text-white" },
  { id: "Nổi bật",   icon: <Flame      className="h-3 w-3" />, color: "bg-imperial text-white" },
  { id: "Mới nhất",  icon: <Sparkles   className="h-3 w-3" />, color: "bg-gold text-white" },
  { id: "Cập nhật",  icon: <Clock      className="h-3 w-3" />, color: "bg-secondary text-secondary-foreground" },
  { id: "Thảo luận", icon: <MessageCircle className="h-3 w-3" />, color: "bg-secondary text-secondary-foreground" },
];

function applyFilters(stories: typeof mockStories, filters: FilterState) {
  return stories.filter((s) => {
    if (filters.genres.length && !filters.genres.includes(s.genre)) return false;
    if (filters.statuses.length) {
      const ok = filters.statuses.some(st => st.toLowerCase() === s.status);
      if (!ok) return false;
    }
    if (filters.wordCounts.length) {
      const match = filters.wordCounts.some((wc) => {
        if (wc === "< 50k")       return s.word_count < 50_000;
        if (wc === "50k - 100k")  return s.word_count >= 50_000  && s.word_count < 100_000;
        if (wc === "100k - 200k") return s.word_count >= 100_000 && s.word_count < 200_000;
        if (wc === "200k+")       return s.word_count >= 200_000;
        return true;
      });
      if (!match) return false;
    }
    return true;
  });
}

function sortStories(stories: typeof mockStories, tab: string) {
  const copy = [...stories];
  switch (tab) {
    case "Nổi bật":   return copy.sort((a, b) => b.views - a.views);
    case "Mới nhất":  return copy.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    case "Cập nhật":  return copy.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    case "Thảo luận": return copy.sort((a, b) => b.comments - a.comments);
    default:          return copy.sort(() => Math.random() - 0.5);
  }
}

const Index = () => {
  const [filters, setFilters] = useState<FilterState>({ genres: [], statuses: [], wordCounts: [] });
  const [activeTab, setActiveTab]   = useState("Xào trộn");
  const [viewMode, setViewMode]     = useState<ViewMode>("list");

  const filtered = applyFilters(mockStories, filters);
  const sorted   = sortStories(filtered, activeTab);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Marquee />
      <HeroBanner />
      <RecentAuthors />
      <NewChaptersCarousel />

      <main className="container py-6">
        <div className="flex gap-6">
          {/* Left: Filter + Stories */}
          <div className="min-w-0 flex-1">
            {/* Tab bar + view toggle */}
            <div className="mb-4 flex items-center gap-2 border-b border-border pb-3 flex-wrap">
              <span className="mr-1 text-sm font-semibold text-foreground">📝 Bài viết</span>
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    activeTab === tab.id ? tab.color : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {tab.icon} {tab.id}
                </button>
              ))}
              {/* View mode toggle */}
              <div className="ml-auto flex items-center gap-0.5 rounded-md border border-border p-0.5">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded transition-colors ${viewMode === "list" ? "bg-muted" : "hover:bg-muted/50"}`}
                  aria-label="Dạng danh sách"
                >
                  <LayoutList className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded transition-colors ${viewMode === "grid" ? "bg-muted" : "hover:bg-muted/50"}`}
                  aria-label="Dạng lưới"
                >
                  <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Filter Sidebar (inline, hidden on mobile) */}
            <div className="mb-4 hidden md:block">
              <FilterSidebar filters={filters} onFiltersChange={setFilters} />
            </div>

            {/* Story list / grid */}
            {sorted.length > 0 ? (
              viewMode === "list" ? (
                <div className="rounded-lg border border-border bg-card">
                  {sorted.map(story => <StoryCard key={story.id} story={story} variant="list" />)}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {sorted.map(story => <StoryCard key={story.id} story={story} variant="grid" />)}
                </div>
              )
            ) : (
              <div className="rounded-lg border border-border bg-card py-16 text-center">
                <p className="text-sm text-muted-foreground">Không có truyện phù hợp với bộ lọc.</p>
              </div>
            )}

            {/* Load more placeholder */}
            <div className="mt-6 text-center">
              <button className="rounded-full border border-border px-6 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors">
                Xem thêm truyện
              </button>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="hidden lg:block w-[220px] shrink-0">
            <RankingSidebar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
