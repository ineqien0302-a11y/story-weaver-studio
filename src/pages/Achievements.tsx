import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, BookOpen, MessageSquare, Star, Heart, Clock, Flame, Zap, Shield, Award } from "lucide-react";

const achievements = [
  { id: "a1", icon: <BookOpen className="h-5 w-5" />, title: "Mọt Sách", desc: "Đọc 10 truyện", progress: 70, max: 10, current: 7, unlocked: false, color: "text-jade" },
  { id: "a2", icon: <MessageSquare className="h-5 w-5" />, title: "Nhà Bình Luận", desc: "Viết 50 bình luận", progress: 40, max: 50, current: 20, unlocked: false, color: "text-imperial" },
  { id: "a3", icon: <Star className="h-5 w-5" />, title: "Người Đánh Giá", desc: "Đánh giá 20 truyện", progress: 100, max: 20, current: 20, unlocked: true, color: "text-gold" },
  { id: "a4", icon: <Heart className="h-5 w-5" />, title: "Người Hâm Mộ", desc: "Yêu thích 15 truyện", progress: 60, max: 15, current: 9, unlocked: false, color: "text-imperial" },
  { id: "a5", icon: <Flame className="h-5 w-5" />, title: "Điểm Danh 7 Ngày", desc: "Điểm danh 7 ngày liên tiếp", progress: 100, max: 7, current: 7, unlocked: true, color: "text-gold" },
  { id: "a6", icon: <Clock className="h-5 w-5" />, title: "Đọc Xuyên Đêm", desc: "Đọc truyện sau 12h đêm", progress: 100, max: 1, current: 1, unlocked: true, color: "text-jade" },
  { id: "a7", icon: <Zap className="h-5 w-5" />, title: "Tốc Độ", desc: "Đọc hết 1 truyện trong 1 ngày", progress: 0, max: 1, current: 0, unlocked: false, color: "text-muted-foreground" },
  { id: "a8", icon: <Shield className="h-5 w-5" />, title: "Bảo Trợ", desc: "Tặng quà cho 5 tác giả", progress: 20, max: 5, current: 1, unlocked: false, color: "text-jade" },
  { id: "a9", icon: <Award className="h-5 w-5" />, title: "Huyền Thoại", desc: "Đạt tất cả thành tựu", progress: 33, max: 8, current: 3, unlocked: false, color: "text-gold" },
];

const Achievements = () => {
  const unlocked = achievements.filter(a => a.unlocked).length;
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-3xl py-8">
        <div className="mb-6 text-center">
          <Trophy className="mx-auto mb-2 h-8 w-8 text-gold" />
          <h1 className="text-2xl font-bold">Thành Tựu</h1>
          <p className="mt-1 text-sm text-muted-foreground">Hoàn thành thử thách để nhận huy hiệu và phần thưởng</p>
          <Badge variant="secondary" className="mt-3 text-sm">{unlocked}/{achievements.length} đã mở khoá</Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {achievements.map(a => (
            <div key={a.id} className={`rounded-lg border p-4 transition-colors ${a.unlocked ? "border-gold/40 bg-gold/5" : "border-border bg-card"}`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${a.unlocked ? "bg-gold/20" : "bg-muted"} ${a.color}`}>
                  {a.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{a.title}</p>
                    {a.unlocked && <Badge className="bg-gold text-white text-[10px] px-1.5 py-0">Đã mở</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{a.current}/{a.max}</span>
                  <span>{a.progress}%</span>
                </div>
                <Progress value={a.progress} className="h-1.5" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Achievements;
