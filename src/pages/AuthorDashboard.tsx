import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { VirtualCover } from "@/components/VirtualCover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { mockStories, mockChapters } from "@/lib/mock-data";
import {
  BarChart3, BookOpen, FileText, Eye, Star, Clock, Plus, ExternalLink,
  Layers, TrendingUp, Bell, Heart, Target, Award, Edit3, Trash2,
  CheckCircle2, AlertCircle, Circle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const myStories = mockStories.slice(0, 4);
const totalViews    = myStories.reduce((s, st) => s + st.views, 0);
const totalChapters = myStories.reduce((s, st) => s + st.chapter_count, 0);
const avgRating     = (myStories.reduce((s, st) => s + st.rating, 0) / myStories.length).toFixed(1);
const totalFollowers = 1247;
const totalFavorites = 876;

const recentChapters = Object.entries(mockChapters).flatMap(([storyId, chs]) =>
  chs.map(ch => ({ ...ch, storyTitle: mockStories.find(s => s.id === storyId)?.title || "" }))
).slice(0, 5);

// Mock weekly view data
const weeklyData = [
  { day: "T2", views: 320 },
  { day: "T3", views: 480 },
  { day: "T4", views: 290 },
  { day: "T5", views: 610 },
  { day: "T6", views: 540 },
  { day: "T7", views: 780 },
  { day: "CN", views: 920 },
];
const maxViews = Math.max(...weeklyData.map(d => d.views));

function formatNum(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

function EditIcon(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

const statusIcon = {
  ongoing:   <CheckCircle2 className="h-3.5 w-3.5 text-jade" />,
  completed: <CheckCircle2 className="h-3.5 w-3.5 text-imperial" />,
  hiatus:    <AlertCircle  className="h-3.5 w-3.5 text-gold" />,
};

// Mock notifications
const notifications = [
  { id: "n1", icon: <Heart className="h-4 w-4 text-imperial" />, text: 'Tiểu Thư A đã yêu thích "Ascension of the Eternal Emperor"', time: "5 phút trước" },
  { id: "n2", icon: <Star className="h-4 w-4 text-gold" />, text: "Đọc Truyện 24/7 đánh giá 5⭐ cho truyện của bạn", time: "1 giờ trước" },
  { id: "n3", icon: <Bell className="h-4 w-4 text-jade" />, text: "25 người mới theo dõi trong ngày hôm nay", time: "3 giờ trước" },
  { id: "n4", icon: <Eye className="h-4 w-4 text-jade" />, text: "Truyện của bạn đạt 125K lượt xem!", time: "Hôm qua" },
  { id: "n5", icon: <Award className="h-4 w-4 text-gold" />, text: "Bạn đã vào top 10 tác giả nổi bật tuần này", time: "Hôm qua" },
];

const AuthorDashboard = () => {
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="border-l-4 border-jade pl-4 text-2xl font-bold">Quản lý tác phẩm</h1>
            <p className="mt-1 pl-4 text-sm text-muted-foreground">Chào mừng trở lại, Tác Giả!</p>
          </div>
          <Button asChild className="bg-jade text-white hover:bg-jade/90">
            <Link to="/editor/new"><Plus className="mr-1.5 h-4 w-4" /> Tạo truyện mới</Link>
          </Button>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-6 w-full justify-start gap-1 bg-transparent p-0 border-b border-border rounded-none overflow-x-auto">
            {[
              { value: "overview",  icon: <BarChart3 className="h-3.5 w-3.5" />, label: "Tổng quan" },
              { value: "stories",   icon: <BookOpen  className="h-3.5 w-3.5" />, label: "Truyện" },
              { value: "chapters",  icon: <Layers    className="h-3.5 w-3.5" />, label: "Chương" },
              { value: "notif",     icon: <Bell      className="h-3.5 w-3.5" />, label: "Thông báo" },
            ].map(t => (
              <TabsTrigger key={t.value} value={t.value}
                className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-jade data-[state=active]:bg-transparent data-[state=active]:shadow-none whitespace-nowrap"
              >
                {t.icon} {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: <BookOpen className="h-5 w-5 text-jade" />,     label: "Tổng truyện",  value: myStories.length,        sub: "tác phẩm" },
                { icon: <Eye     className="h-5 w-5 text-jade" />,      label: "Lượt đọc",     value: formatNum(totalViews),   sub: "lượt xem" },
                { icon: <Bell    className="h-5 w-5 text-imperial" />,  label: "Theo dõi",     value: formatNum(totalFollowers), sub: "người dùng" },
                { icon: <Star    className="h-5 w-5 text-gold" />,      label: "Rating TB",    value: avgRating,                sub: "/ 5.0" },
              ].map((stat, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-4 text-center">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-muted">{stat.icon}</div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-[10px] text-muted-foreground/60">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Weekly chart */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-jade" /> Lượt xem 7 ngày
                </h3>
                <Badge variant="secondary" className="text-xs">+23% so với tuần trước</Badge>
              </div>
              <div className="flex items-end gap-2 h-32">
                {weeklyData.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-[9px] text-muted-foreground">{d.views}</span>
                    <div
                      className="w-full rounded-t-md bg-jade/70 hover:bg-jade transition-all cursor-default"
                      style={{ height: `${(d.views / maxViews) * 100}%` }}
                      title={`${d.day}: ${d.views} lượt`}
                    />
                    <span className="text-[9px] text-muted-foreground">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Goal tracking */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Target className="h-4 w-4 text-gold" /> Mục tiêu tháng</h3>
              <div className="space-y-4">
                {[
                  { label: "Lượt đọc",    current: 3940, target: 5000, unit: "lượt" },
                  { label: "Chương mới",  current: 3,    target: 8,    unit: "chương" },
                  { label: "Người theo dõi", current: 1247, target: 1500, unit: "người" },
                ].map((g, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-foreground font-medium">{g.label}</span>
                      <span className="text-muted-foreground">{formatNum(g.current)} / {formatNum(g.target)} {g.unit}</span>
                    </div>
                    <Progress value={(g.current / g.target) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div>
              <h3 className="mb-3 text-xs font-semibold text-muted-foreground uppercase">Hoạt động gần đây</h3>
              <div className="space-y-2">
                {myStories.slice(0, 3).map(s => (
                  <div key={s.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate"><span className="font-medium">{s.title}</span> — cập nhật lần cuối</p>
                      <p className="text-xs text-muted-foreground">{s.updated_at}</p>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {s.status === "completed" ? "Hoàn thành" : s.status === "hiatus" ? "Tạm dừng" : "Đang ra"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* STORIES */}
          <TabsContent value="stories" className="space-y-3">
            {myStories.map(s => (
              <div key={s.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:bg-muted/20 transition-colors">
                <VirtualCover title={s.title} color={s.cover_color} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {statusIcon[s.status]}
                    <p className="font-semibold truncate">{s.title}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-0.5"><FileText className="h-3 w-3" /> {s.chapter_count} chương</span>
                    <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" /> {formatNum(s.views)}</span>
                    <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-gold text-gold" /> {s.rating}</span>
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <Button asChild size="sm" variant="outline" className="text-xs gap-1 h-7 px-2.5">
                    <Link to={`/editor/${s.id}`}><Edit3 className="h-3 w-3" /> Sửa</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="text-xs gap-1 h-7 px-2.5">
                    <Link to={`/editor/${s.id}?tab=chapters&action=new`}><Plus className="h-3 w-3" /> Chương</Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost" className="text-xs h-7 w-7 p-0">
                    <Link to={`/story/${s.id}`}><ExternalLink className="h-3 w-3" /></Link>
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* CHAPTERS */}
          <TabsContent value="chapters" className="space-y-2">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">{recentChapters.length} chương gần đây</p>
              <Button asChild size="sm" className="bg-jade text-white hover:bg-jade/90 gap-1">
                <Link to="/editor/1?tab=chapters&action=new"><Plus className="h-3.5 w-3.5" /> Thêm chương</Link>
              </Button>
            </div>
            {recentChapters.map(ch => (
              <div key={ch.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                    {ch.chapter_number}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{ch.title}</p>
                    <p className="text-xs text-muted-foreground">{ch.storyTitle} · {(ch.word_count / 1000).toFixed(1)}k chữ</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Đã đăng</Badge>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive hover:text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* NOTIFICATIONS */}
          <TabsContent value="notif" className="space-y-2">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">{notifications.length} thông báo mới</p>
              <button className="text-xs text-jade hover:underline">Đánh dấu tất cả đã đọc</button>
            </div>
            {notifications.map(n => (
              <div key={n.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:bg-muted/20 transition-colors">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">{n.icon}</div>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">{n.text}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
                </div>
                <div className="h-2 w-2 rounded-full bg-jade shrink-0 mt-2" />
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AuthorDashboard;
