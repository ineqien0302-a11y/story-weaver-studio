import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, BookOpen, Clock, Hash, FileText, Star, Heart, Gift,
  Bell, MessageSquare, Send, ThumbsUp, Share2, Copy, Check,
  ChevronDown, ChevronUp, Eye, BookMarked, Zap
} from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { StoryCard } from "@/components/StoryCard";
import { mockStories, mockChapters } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

const StoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const story = mockStories.find((s) => s.id === id);
  const chapters = id ? mockChapters[id] || [] : [];

  const [isFollowing,  setIsFollowing]  = useState(false);
  const [isFavorited,  setIsFavorited]  = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userRating,   setUserRating]   = useState(0);
  const [hoverRating,  setHoverRating]  = useState(0);
  const [commentText,  setCommentText]  = useState("");
  const [showAllChapters, setShowAllChapters] = useState(false);
  const [copied, setCopied] = useState(false);
  const [comments, setComments] = useState([
    { id: "c1", user: "Độc Giả 1", avatar: "Đ", text: "Truyện hay quá! Mong tác giả ra chương mới sớm.", time: "2 giờ trước", likes: 5, liked: false },
    { id: "c2", user: "Tiểu Thư A", avatar: "T", text: "Nhân vật chính rất cuốn hút, plot twist cũng bất ngờ.", time: "5 giờ trước", likes: 12, liked: false },
    { id: "c3", user: "Đọc Truyện 24/7", avatar: "Đ", text: "Đã theo dõi từ chương 1, không bao giờ thất vọng!", time: "1 ngày trước", likes: 8, liked: false },
  ]);

  if (!story) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container flex flex-col items-center py-20">
          <p className="text-muted-foreground">Không tìm thấy truyện.</p>
          <Button asChild variant="link" className="mt-4"><Link to="/">← Trang chủ</Link></Button>
        </div>
      </div>
    );
  }

  // Related stories (same genre, different story)
  const related = mockStories.filter(s => s.genre === story.genre && s.id !== story.id).slice(0, 3);

  const handleComment = () => {
    if (!commentText.trim()) return;
    setComments(prev => [
      { id: `c${Date.now()}`, user: "Bạn", avatar: "B", text: commentText, time: "Vừa xong", likes: 0, liked: false },
      ...prev,
    ]);
    setCommentText("");
    toast({ title: "Đã đăng bình luận!" });
  };

  const handleLikeComment = (cid: string) => {
    setComments(prev => prev.map(c =>
      c.id === cid ? { ...c, likes: c.liked ? c.likes - 1 : c.likes + 1, liked: !c.liked } : c
    ));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Đã sao chép link!" });
  };

  const handleRate = (star: number) => {
    setUserRating(star);
    toast({ title: `Bạn đã đánh giá ${star} sao!`, description: story.title });
  };

  const displayedChapters = showAllChapters ? chapters : chapters.slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-3xl py-8">
        <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground">
          <Link to="/"><ArrowLeft className="mr-1 h-3.5 w-3.5" /> Quay lại</Link>
        </Button>

        {/* Title + author */}
        <h1 className="border-l-4 border-imperial pl-4 text-3xl font-bold tracking-tight">{story.title}</h1>
        <p className="mt-2 pl-4 text-sm text-muted-foreground">
          bởi <Link to={`/author/${encodeURIComponent(story.author)}`} className="text-jade hover:underline font-medium">{story.author}</Link>
        </p>

        {/* Rating display + user rating */}
        <div className="mt-4 flex flex-wrap items-center gap-4 pl-4">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} className={`h-4 w-4 ${s <= Math.round(story.rating) ? "fill-gold text-gold" : "text-muted-foreground/30"}`} />
            ))}
            <span className="text-sm font-semibold text-gold ml-1">{story.rating}</span>
            <span className="text-xs text-muted-foreground">({story.comments} đánh giá)</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Eye className="h-3.5 w-3.5" /> {formatNum(story.views)} lượt xem
          </div>
        </div>

        {/* Rate widget */}
        <div className="mt-3 pl-4">
          <p className="text-xs text-muted-foreground mb-1.5">Đánh giá của bạn:</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(s => (
              <button
                key={s}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleRate(s)}
                className="transition-transform hover:scale-110"
              >
                <Star className={`h-5 w-5 transition-colors ${s <= (hoverRating || userRating) ? "fill-gold text-gold" : "text-muted-foreground/30"}`} />
              </button>
            ))}
            {userRating > 0 && (
              <span className="ml-2 text-xs text-gold self-center">Bạn đã đánh giá {userRating}★</span>
            )}
          </div>
        </div>

        {/* Tags & Metadata */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge variant="secondary" className="gap-1"><Hash className="h-3 w-3" /> {story.genre}</Badge>
          {story.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
          <Badge variant={story.status === "completed" ? "default" : "outline"} className="gap-1">
            <Clock className="h-3 w-3" />
            {story.status === "completed" ? "Hoàn thành" : story.status === "hiatus" ? "Tạm dừng" : "Đang ra"}
          </Badge>
          <Badge variant="secondary" className="gap-1"><FileText className="h-3 w-3" /> {(story.word_count / 1000).toFixed(0)}k chữ</Badge>
          <Badge variant="secondary" className="gap-1"><BookOpen className="h-3 w-3" /> {story.chapter_count} chương</Badge>
        </div>

        {/* Reading progress (mock) */}
        <div className="mt-5 rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <BookMarked className="h-3.5 w-3.5" /> Tiến độ đọc
            </p>
            <span className="text-xs text-muted-foreground">Ch. 0 / {story.chapter_count}</span>
          </div>
          <Progress value={0} className="h-1.5" />
          <p className="mt-2 text-[10px] text-muted-foreground">Bạn chưa bắt đầu đọc truyện này</p>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-wrap gap-2.5">
          {chapters.length > 0 && (
            <Button asChild size="sm" className="bg-imperial text-white hover:bg-imperial/90 gap-1.5">
              <Link to={`/read/${story.id}/1`}><Zap className="h-3.5 w-3.5" /> Đọc ngay</Link>
            </Button>
          )}
          <Button
            size="sm" variant={isFollowing ? "default" : "outline"}
            onClick={() => { setIsFollowing(!isFollowing); toast({ title: isFollowing ? "Đã bỏ theo dõi" : "Đang theo dõi truyện!" }); }}
            className={isFollowing ? "bg-jade text-white hover:bg-jade/90" : "border-jade text-jade hover:bg-jade/10"}
          >
            <Bell className="mr-1.5 h-3.5 w-3.5" /> {isFollowing ? "Đang theo dõi" : "Theo dõi"}
          </Button>
          <Button
            size="sm" variant={isFavorited ? "default" : "outline"}
            onClick={() => { setIsFavorited(!isFavorited); toast({ title: isFavorited ? "Đã bỏ yêu thích" : "Đã thêm vào yêu thích!" }); }}
            className={isFavorited ? "bg-imperial text-white hover:bg-imperial/90" : "border-imperial text-imperial hover:bg-imperial/10"}
          >
            <Heart className={`mr-1.5 h-3.5 w-3.5 ${isFavorited ? "fill-current" : ""}`} /> {isFavorited ? "Yêu thích" : "Yêu thích"}
          </Button>
          <Button
            size="sm" variant={isBookmarked ? "default" : "outline"}
            onClick={() => { setIsBookmarked(!isBookmarked); toast({ title: isBookmarked ? "Đã bỏ đánh dấu" : "Đã đánh dấu truyện!" }); }}
            className={isBookmarked ? "bg-gold text-white hover:bg-gold/90" : "border-gold text-gold hover:bg-gold/10"}
          >
            <BookMarked className="mr-1.5 h-3.5 w-3.5" /> Đánh dấu
          </Button>
          <Button size="sm" variant="outline" className="border-gold text-gold hover:bg-gold/10">
            <Gift className="mr-1.5 h-3.5 w-3.5" /> Tặng quà
          </Button>
          <Button size="sm" variant="ghost" onClick={handleCopyLink} className="text-muted-foreground ml-auto">
            {copied ? <Check className="h-3.5 w-3.5 text-jade" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>

        {/* Synopsis */}
        <div className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Tóm tắt</h2>
          <p className="font-story text-base leading-relaxed text-foreground/90">{story.description}</p>
        </div>

        <Separator className="my-8 bg-gold/20" />

        {/* Chapters */}
        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span>Mục lục ({chapters.length} chương)</span>
            {chapters.length > 0 && (
              <Link to={`/read/${story.id}/1`} className="text-jade hover:underline normal-case font-normal">Đọc từ đầu →</Link>
            )}
          </h2>
          {chapters.length > 0 ? (
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              {displayedChapters.map((ch) => (
                <Link key={ch.id} to={`/read/${story.id}/${ch.chapter_number}`}
                  className="flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-muted/50 border-b border-border last:border-0"
                >
                  <span>
                    <span className="mr-2 text-muted-foreground text-xs">Ch. {ch.chapter_number}</span>
                    <span className="font-medium">{ch.title}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{(ch.word_count / 1000).toFixed(1)}k</span>
                </Link>
              ))}
              {chapters.length > 5 && (
                <button
                  onClick={() => setShowAllChapters(s => !s)}
                  className="flex w-full items-center justify-center gap-1.5 py-3 text-xs text-muted-foreground hover:bg-muted/50 transition-colors"
                >
                  {showAllChapters ? <><ChevronUp className="h-3.5 w-3.5" /> Thu gọn</> : <><ChevronDown className="h-3.5 w-3.5" /> Xem tất cả {chapters.length} chương</>}
                </button>
              )}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">Chưa có chương nào.</p>
          )}
        </div>

        <Separator className="my-8 bg-gold/20" />

        {/* Related stories */}
        {related.length > 0 && (
          <div>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Truyện liên quan</h2>
            <div className="rounded-lg border border-border bg-card">
              {related.map(s => <StoryCard key={s.id} story={s} variant="list" />)}
            </div>
            <Separator className="my-8 bg-gold/20" />
          </div>
        )}

        {/* Comments */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <MessageSquare className="h-4 w-4" /> Bình luận ({comments.length})
          </h2>

          <div className="mb-6 flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-jade text-white text-sm font-bold">B</div>
            <div className="flex-1">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                className="min-h-[80px] resize-none text-sm"
              />
              <div className="mt-2 flex justify-end gap-2">
                <Button onClick={handleComment} size="sm" className="bg-jade text-white hover:bg-jade/90 gap-1.5">
                  <Send className="h-3.5 w-3.5" /> Đăng
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-foreground">
                    {c.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{c.user}</span>
                      <span className="text-xs text-muted-foreground">{c.time}</span>
                    </div>
                    <p className="mt-1 text-sm text-foreground/80 leading-relaxed">{c.text}</p>
                    <button
                      onClick={() => handleLikeComment(c.id)}
                      className={`mt-2 flex items-center gap-1 text-xs transition-colors ${c.liked ? "text-jade" : "text-muted-foreground hover:text-jade"}`}
                    >
                      <ThumbsUp className={`h-3 w-3 ${c.liked ? "fill-current" : ""}`} /> {c.likes}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StoryDetail;
