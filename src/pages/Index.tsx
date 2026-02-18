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

const FILTER_TABS = ["Xào trộn", "Ngẫu nhiên", "Mới", "Đầu trang", "Thảo luận"] as const;

function applyFilters(stories: typeof mockStories, filters: FilterState) {
  return stories.filter((s) => {
    if (filters.genres.length && !filters.genres.includes(s.genre)) return false;
    if (filters.statuses.length) {
      const statusMatch = filters.statuses.some(
        (st) => st.toLowerCase() === s.status
      );
      if (!statusMatch) return false;
    }
    if (filters.wordCounts.length) {
      const match = filters.wordCounts.some((wc) => {
        if (wc === "< 50k") return s.word_count < 50000;
        if (wc === "50k - 100k") return s.word_count >= 50000 && s.word_count < 100000;
        if (wc === "100k - 200k") return s.word_count >= 100000 && s.word_count < 200000;
        if (wc === "200k+") return s.word_count >= 200000;
        return true;
      });
      if (!match) return false;
    }
    return true;
  });
}

const Index = () => {
  const [filters, setFilters] = useState<FilterState>({
    genres: [],
    statuses: [],
    wordCounts: [],
  });
  const [activeTab, setActiveTab] = useState("Xào trộn");

  const filtered = applyFilters(mockStories, filters);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Marquee />
      <HeroBanner />
      <RecentAuthors />
      <NewChaptersCarousel />

      {/* Main content area */}
      <main className="container py-6">
        <div className="flex gap-6">
          {/* Left: Filter + Stories */}
          <div className="min-w-0 flex-1">
            {/* Tab bar */}
            <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
              <span className="mr-2 text-sm font-semibold text-foreground">📝 Bài viết</span>
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    activeTab === tab
                      ? tab === "Xào trộn"
                        ? "bg-jade text-white"
                        : tab === "Ngẫu nhiên"
                        ? "bg-imperial text-white"
                        : "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Story list */}
            <div className="rounded-lg border border-border bg-card">
              {filtered.length > 0 ? (
                filtered.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))
              ) : (
                <p className="py-12 text-center text-sm text-muted-foreground">
                  Không có truyện phù hợp với bộ lọc.
                </p>
              )}
            </div>
          </div>

          {/* Right sidebar: Rankings */}
          <div className="hidden lg:block">
            <RankingSidebar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
