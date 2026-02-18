import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [mode, setMode]         = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [showPw, setShowPw]     = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signin") {
      toast({ title: "Đăng nhập thành công!", description: "Chào mừng trở lại 👋" });
    } else if (mode === "signup") {
      toast({ title: "Tạo tài khoản thành công!", description: "Bắt đầu hành trình đọc truyện nào!" });
    } else {
      toast({ title: "Đã gửi email!", description: "Kiểm tra hộp thư để đặt lại mật khẩu." });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container flex items-center justify-center py-16">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-imperial/10">
              <BookOpen className="h-7 w-7 text-imperial" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              {mode === "signin" ? "Đăng nhập" : mode === "signup" ? "Tạo tài khoản" : "Quên mật khẩu"}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {mode === "signin"  ? "Đăng nhập để theo dõi truyện & lưu tiến độ đọc"
                : mode === "signup" ? "Tham gia mStories — đọc, viết, khám phá thế giới truyện"
                : "Nhập email để nhận link đặt lại mật khẩu"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Tên hiển thị</Label>
                <Input
                  id="name"
                  placeholder="Tên của bạn..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            {mode !== "forgot" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                  {mode === "signin" && (
                    <button type="button" onClick={() => setMode("forgot")} className="text-xs text-jade hover:underline">
                      Quên mật khẩu?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(s => !s)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full bg-imperial text-white hover:bg-imperial/90 gap-2">
              {mode === "signin"  ? "Đăng nhập"
                : mode === "signup" ? "Tạo tài khoản"
                : "Gửi email đặt lại"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {mode !== "forgot" && (
            <>
              <div className="my-5 flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">hoặc</span>
                <Separator className="flex-1" />
              </div>

              <p className="text-center text-sm text-muted-foreground">
                {mode === "signin" ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
                <button
                  onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                  className="font-semibold text-jade hover:underline"
                >
                  {mode === "signin" ? "Đăng ký ngay" : "Đăng nhập"}
                </button>
              </p>
            </>
          )}

          {mode === "forgot" && (
            <p className="mt-5 text-center text-sm text-muted-foreground">
              <button onClick={() => setMode("signin")} className="font-semibold text-jade hover:underline">
                ← Quay lại đăng nhập
              </button>
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Auth;
