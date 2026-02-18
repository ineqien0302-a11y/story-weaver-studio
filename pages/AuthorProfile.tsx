import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { StoryCard } from "@/components/StoryCard";
import { mockStories, mockAuthors } from "@/lib/mock-data";
import { BookOpen, Eye, Star, Clock, Award, Users, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

const AuthorProfile = () => {
  const { authorName } = useParams<{ authorName: string }>();
  const decodedName = decodeURIComponent(authorName || "");

  // Find author in mockAuthors or derive from stories
  const author = mockAuthors.find((a) => a.name === decodedName);
  const authorStories = mockStories.filter((s) => s.author === decodedName);

  // Aggregate stats
  const totalWords = authorStories.reduce((sum, s) => sum + s.word_count, 0);
  const totalViews = authorStories.reduce((sum, s) => sum + s.views, 0);
  const totalChapters = authorStories.reduce((sum, s) => sum + s.chapter_count, 0);
  const avgRating =
    authorStories.length > 0
      ? authorStories.reduce((sum, s) => sum + s.rating, 0) / authorStories.length
      : 0;

  const initial = author?.initial || decodedName.charAt(0).toUpperCase();
  const color = author?.color || "hsl(210 50% 50%)";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6">
        {/* Back */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Trang chủ
        </Link>

        {/* Profile header */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Avatar */}
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white shadow-md"
              style={{ backgroundColor: color }}
            >
              {initial}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-foreground">{decodedName}</h1>
                {author?.badge && (
                  <Badge variant="outline" className="border-gold text-gold text-xs">
                    <Award className="mr-1 h-3 w-3" />
                    {author.badge}
                  </Badge>
                )}
              </div>
              {author && (
                <p className="mt-1 text-xs text-muted-foreground">
                  <Clock className="mr-1 inline h-3 w-3" />
                  Hoạt động {author.lastActive}
                </p>
              )}
              <p className="mt-2 text-sm text-foreground/70">
                Tác giả của {authorStories.length} tác phẩm trên mStories.
              </p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard icon={<BookOpen className="h-4 w-4 text-jade" />} label="Tác phẩm" value={String(authorStories.length)} />
            <StatCard icon={<Eye className="h-4 w-4 text-jade" />} label="Lượt xem" value={formatNumber(totalViews)} />
            <StatCard icon={<Star className="h-4 w-4 text-gold" />} label="Đánh giá TB" value={avgRating.toFixed(1)} />
            <StatCard icon={<Users className="h-4 w-4 text-imperial" />} label="Chương" value={formatNumber(totalChapters)} />
          </div>
        </div>

        {/* Stories */}
        <section className="mt-8">
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            📚 Tác phẩm ({authorStories.length})
          </h2>
          {authorStories.length > 0 ? (
            <div className="rounded-lg border border-border bg-card">
              {authorStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card py-16 text-center">
              <p className="text-sm text-muted-foreground">Tác giả chưa có tác phẩm nào.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-muted/30 p-3 text-center">
      <div className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-background">
        {icon}
      </div>
      <p className="text-lg font-bold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

export default AuthorProfile;
