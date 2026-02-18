import { useState } from "react";
import { Header } from "@/components/Header";
import { StoryCard } from "@/components/StoryCard";
import { mockStories } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Heart, Bookmark, BookOpen } from "lucide-react";

const Library = () => {
  // Mock library data
  const [followed] = useState(mockStories.slice(0, 3));
  const [favorites] = useState(mockStories.slice(1, 4));
  const [bookmarked] = useState(mockStories.slice(2, 5));
  const [history] = useState(mockStories.slice(0, 4));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl py-8">
        <h1 className="mb-6 border-l-4 border-jade pl-4 text-2xl font-bold">Tủ truyện của tôi</h1>

        <Tabs defaultValue="following" className="w-full">
          <TabsList className="mb-6 w-full justify-start gap-1 bg-transparent p-0 border-b border-border rounded-none">
            <TabsTrigger value="following" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-jade data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <Bell className="h-3.5 w-3.5" /> Theo dõi
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-imperial data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <Heart className="h-3.5 w-3.5" /> Yêu thích
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <Bookmark className="h-3.5 w-3.5" /> Đánh dấu
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <BookOpen className="h-3.5 w-3.5" /> Lịch sử đọc
            </TabsTrigger>
          </TabsList>

          {[
            { value: "following", data: followed, empty: "Bạn chưa theo dõi truyện nào." },
            { value: "favorites", data: favorites, empty: "Bạn chưa yêu thích truyện nào." },
            { value: "bookmarks", data: bookmarked, empty: "Bạn chưa đánh dấu truyện nào." },
            { value: "history", data: history, empty: "Bạn chưa đọc truyện nào." },
          ].map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="rounded-lg border border-border bg-card">
                {tab.data.length > 0 ? tab.data.map(s => <StoryCard key={s.id} story={s} />) : (
                  <p className="py-12 text-center text-sm text-muted-foreground">{tab.empty}</p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default Library;
