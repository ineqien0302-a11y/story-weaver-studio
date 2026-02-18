import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { VirtualCover } from "@/components/VirtualCover";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockStories } from "@/lib/mock-data";
import { Eye, Heart, Bell, Trophy, Star, Crown, Medal } from "lucide-react";

function formatNum(n: number) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

const rankIcons = [
  <Crown key="1" className="h-5 w-5 text-gold" />,
  <Medal key="2" className="h-5 w-5 text-muted-foreground" />,
  <Medal key="3" className="h-5 w-5 text-muted-foreground/70" />,
];

function RankList({ stories, metric }: { stories: typeof mockStories; metric: "views" | "rating" | "comments" }) {
  const sorted = [...stories].sort((a, b) => b[metric] - a[metric]);
  return (
    <div className="space-y-3">
      {sorted.map((s, i) => (
        <Link key={s.id} to={`/story/${s.id}`} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            {i < 3 ? rankIcons[i] : <span className="text-sm font-bold text-muted-foreground">#{i + 1}</span>}
          </div>
          <VirtualCover title={s.title} color={s.cover_color} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-foreground">{s.title}</p>
            <p className="text-xs text-muted-foreground">{s.author}</p>
            <div className="mt-1 flex gap-2">
              <Badge variant="secondary" className="text-xs gap-1">
                {metric === "views" && <><Eye className="h-3 w-3" /> {formatNum(s.views)}</>}
                {metric === "rating" && <><Star className="h-3 w-3 fill-gold text-gold" /> {s.rating}</>}
                {metric === "comments" && <><Heart className="h-3 w-3" /> {formatNum(s.comments)}</>}
              </Badge>
              <Badge variant="outline" className="text-xs">{s.genre}</Badge>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

const Rankings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-3xl py-8">
        <div className="mb-6 text-center">
          <Trophy className="mx-auto mb-2 h-8 w-8 text-gold" />
          <h1 className="text-2xl font-bold">Bảng Xếp Hạng</h1>
          <p className="mt-1 text-sm text-muted-foreground">Vinh danh những tác phẩm xuất sắc nhất, dẫn đầu xu thế</p>
        </div>

        <Tabs defaultValue="views" className="w-full">
          <TabsList className="mb-6 w-full justify-center">
            <TabsTrigger value="views" className="gap-1.5"><Eye className="h-3.5 w-3.5" /> Top Lượt Xem</TabsTrigger>
            <TabsTrigger value="likes" className="gap-1.5"><Heart className="h-3.5 w-3.5" /> Top Yêu Thích</TabsTrigger>
            <TabsTrigger value="follows" className="gap-1.5"><Bell className="h-3.5 w-3.5" /> Top Theo Dõi</TabsTrigger>
          </TabsList>

          <TabsContent value="views"><RankList stories={mockStories} metric="views" /></TabsContent>
          <TabsContent value="likes"><RankList stories={mockStories} metric="rating" /></TabsContent>
          <TabsContent value="follows"><RankList stories={mockStories} metric="comments" /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Rankings;
