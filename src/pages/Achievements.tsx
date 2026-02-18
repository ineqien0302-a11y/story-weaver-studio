import { useState } from "react";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy, BookOpen, MessageSquare, Star, Heart, Clock, Flame, Zap,
  Shield, Award, Target, Gem, Crown, Calendar, TrendingUp, Gift
} from "lucide-react";

interface Achievement {
  id: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  progress: number;
  max: number;
  current: number;
  unlocked: boolean;
  color: string;
  category: "reading" | "social" | "special";
  xp: number;
}

const achievements: Achievement[] = [
  { id: "a1", icon: <BookOpen className="h-5 w-5" />, title: "Mọt Sách",      desc: "Đọc 10 truyện",                  progress: 70,  max: 10, current: 7,  unlocked: false, color: "jade",     category: "reading", xp: 100 },
  { id: "a2", icon: <BookOpen className="h-5 w-5" />, title: "Thư Viện Sống", desc: "Đọc 50 truyện",                  progress: 14,  max: 50, current: 7,  unlocked: false, color: "jade",     category: "reading", xp: 500 },
  { id: "a3", icon: <Zap       className="h-5 w-5" />, title: "Tốc Đọc",      desc: "Đọc hết 1 truyện trong 24h",     progress: 0,   max: 1,  current: 0,  unlocked: false, color: "gold",     category: "reading", xp: 200 },
  { id: "a4", icon: <Clock     className="h-5 w-5" />, title: "Đọc Xuyên Đêm",desc: "Đọc sau 12h đêm",                progress: 100, max: 1,  current: 1,  unlocked: true,  color: "imperial", category: "reading", xp: 50  },
  { id: "a5", icon: <Target    className="h-5 w-5" />, title: "Đọc 100 Chương",desc: "Đọc tổng cộng 100 chương",      progress: 43,  max: 100,current: 43, unlocked: false, color: "jade",     category: "reading", xp: 300 },
  { id: "a6", icon: <MessageSquare className="h-5 w-5" />, title: "Nhà Bình Luận",  desc: "Viết 50 bình luận",         progress: 40,  max: 50, current: 20, unlocked: false, color: "imperial", category: "social",  xp: 150 },
  { id: "a7", icon: <Star      className="h-5 w-5" />, title: "Người Đánh Giá",desc: "Đánh giá 20 truyện",            progress: 100, max: 20, current: 20, unlocked: true,  color: "gold",     category: "social",  xp: 200 },
  { id: "a8", icon: <Heart     className="h-5 w-5" />, title: "Người Hâm Mộ", desc: "Yêu thích 15 truyện",           progress: 60,  max: 15, current: 9,  unlocked: false, color: "imperial", category: "social",  xp: 100 },
  { id: "a9", icon: <Gift      className="h-5 w-5" />, title: "Bảo Trợ",      desc: "Tặng quà cho 5 tác giả",        progress: 20,  max: 5,  current: 1,  unlocked: false, color: "gold",     category: "social",  xp: 300 },
  { id: "a10",icon: <Flame     className="h-5 w-5" />, title: "Streak 7 Ngày",  desc: "Điểm danh 7 ngày liên tiếp",  progress: 100, max: 7,  current: 7,  unlocked: true,  color: "gold",     category: "special", xp: 100 },
  { id: "a11",icon: <Flame     className="h-5 w-5" />, title: "Streak 30 Ngày", desc: "Điểm danh 30 ngày liên tiếp", progress: 23,  max: 30, current: 7,  unlocked: false, color: "imperial", category: "special", xp: 500 },
  { id: "a12",icon: <Shield    className="h-5 w-5" />, title: "OG Reader",      desc: "Thành viên từ ngày đầu",        progress: 100, max: 1,  current: 1,  unlocked: true,  color: "jade",     category: "special", xp: 1000},
  { id: "a13",icon: <Crown     className="h-5 w-5" />, title: "Top 100",        desc: "Vào top 100 người đọc nhiều nhất",progress: 0, max: 1,  current: 0,  unlocked: false, color: "gold",     category: "special", xp: 500 },
  { id: "a14",icon: <Gem       className="h-5 w-5" />, title: "Huyền Thoại",   desc: "Mở khoá tất cả thành tựu",    progress: 28,  max: 14, current: 4,  unlocked: false, color: "gold",     category: "special", xp: 2000},
];

const colorMap: Record<string, { ring: string; bg: string; text: string }> = {
  jade:     { ring: "border-jade",     bg: "bg-jade/10",     text: "text-jade"     },
  gold:     { ring: "border-gold",     bg: "bg-gold/10",     text: "text-gold"     },
  imperial: { ring: "border-imperial", bg: "bg-imperial/10", text: "text-imperial" },
};

const streakDays = [true, true, true, true, true, true, true, false, false, false, false, false, false, false];

function AchievementCard({ a }: { a: Achievement }) {
  const c = colorMap[a.color];
  return (
    <div className={`rounded-xl border p-4 transition-all duration-200 ${a.unlocked ? `${c.ring} ${c.bg}` : "border-border bg-card opacity-80 hover:opacity-100"}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${a.unlocked ? c.bg : "bg-muted"} ${c.text}`}>
          {a.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="font-semibold text-sm text-foreground">{a.title}</p>
            {a.unlocked
              ? <Badge className="bg-gold text-white text-[9px] px-1.5 py-0 h-4">✓ Đã mở</Badge>
              : <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">+{a.xp} XP</Badge>
            }
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>{a.current}/{a.max}</span>
          <span>{a.progress}%</span>
        </div>
        <Progress value={a.progress} className={`h-1.5 ${a.unlocked ? "[&>div]:bg-jade" : ""}`} />
      </div>
    </div>
  );
}

const Achievements = () => {
  const unlocked = achievements.filter(a => a.unlocked).length;
  const totalXP  = achievements.filter(a => a.unlocked).reduce((s, a) => s + a.xp, 0);
  const level    = Math.floor(totalXP / 500) + 1;
  const xpToNext = 500 - (totalXP % 500);
  const [activeTab, setActiveTab] = useState("all");

  const filtered = activeTab === "all" ? achievements : achievements.filter(a => a.category === activeTab);
  const unlockedFiltered = filtered.filter(a => a.unlocked);
  const lockedFiltered   = filtered.filter(a => !a.unlocked);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-3xl py-8">
        {/* Profile XP header */}
        <div className="mb-6 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-jade via-gold to-imperial" />
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-jade to-jade/60 text-white">
                <Crown className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">Độc Giả Cấp {level}</h1>
                  <Badge className="bg-gold/20 text-gold border-gold/30 text-xs">{totalXP} XP</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">Còn {xpToNext} XP để lên cấp {level + 1}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gold">{unlocked}</p>
                <p className="text-xs text-muted-foreground">/ {achievements.length} huy hiệu</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Cấp {level}</span><span>Cấp {level + 1}</span>
              </div>
              <Progress value={(totalXP % 500) / 5} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-jade [&>div]:to-gold" />
            </div>
          </div>
        </div>

        {/* Streak calendar */}
        <div className="mb-6 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="h-4 w-4 text-imperial" />
            <p className="font-semibold text-sm">Streak Điểm Danh</p>
            <Badge variant="secondary" className="ml-auto text-xs gap-1"><Calendar className="h-3 w-3" /> 7 ngày liên tiếp</Badge>
          </div>
          <div className="flex gap-1.5">
            {streakDays.map((active, i) => (
              <div
                key={i}
                title={`Ngày ${i + 1}`}
                className={`h-7 flex-1 rounded-md transition-colors ${active ? "bg-imperial/80" : "bg-muted"}`}
              />
            ))}
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">14 ngày gần nhất</p>
        </div>

        {/* Stats row */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          {[
            { icon: <BookOpen className="h-4 w-4 text-jade" />, label: "Truyện đọc", value: "7" },
            { icon: <TrendingUp className="h-4 w-4 text-gold" />, label: "Chương đọc", value: "43" },
            { icon: <MessageSquare className="h-4 w-4 text-imperial" />, label: "Bình luận", value: "20" },
          ].map((s, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-3 text-center">
              <div className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-muted">{s.icon}</div>
              <p className="text-lg font-bold">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-4 w-4 text-gold" />
          <h2 className="font-bold">Thành Tựu</h2>
          <Badge variant="secondary" className="text-xs">{unlocked}/{achievements.length}</Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full grid grid-cols-4">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="reading">Đọc</TabsTrigger>
            <TabsTrigger value="social">Xã hội</TabsTrigger>
            <TabsTrigger value="special">Đặc biệt</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {unlockedFiltered.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Đã mở khoá ({unlockedFiltered.length})</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {unlockedFiltered.map(a => <AchievementCard key={a.id} a={a} />)}
                </div>
              </div>
            )}
            {lockedFiltered.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-2 mt-4">Chưa mở ({lockedFiltered.length})</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {lockedFiltered.map(a => <AchievementCard key={a.id} a={a} />)}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Achievements;
