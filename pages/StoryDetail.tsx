import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, Hash, FileText, Star, Heart, Gift, Bell, MessageSquare, Send, ThumbsUp } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { mockStories, mockChapters } from "@/lib/mock-data";

const StoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const story = mockStories.find((s) => s.id === id);
  const chapters = id ? mockChapters[id] || [] : [];

  const [isFollowing, setIsFollowing] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([
    { id: "c1", user: "Độc Giả 1", text: "Truyện hay quá! Mong tác giả ra chương mới sớm.", time: "2 giờ trước", likes: 5 },
    { id: "c2", user: "Tiểu Thư A", text: "Nhân vật chính rất cuốn hút, plot twist cũng bất ngờ.", time: "5 giờ trước", likes: 12 },
    { id: "c3", user: "Đọc Truyện 24/7", text: "Đã theo dõi từ chương 1, không bao giờ thất vọng!", time: "1 ngày trước", likes: 8 },
  ]);

  if (!story) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container flex flex-col items-center py-20">
          <p className="text-muted-foreground">Story not found.</p>
          <Button asChild variant="link" className="mt-4">
            <Link to="/">← Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleComment = () => {
    if (!commentText.trim()) return;
    setComments(prev => [
      { id: `c${Date.now()}`, user: "Bạn", text: commentText, time: "Vừa xong", likes: 0 },
      ...prev,
    ]);
    setCommentText("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-3xl py-8">
        <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground">
          <Link to="/"><ArrowLeft className="mr-1 h-3.5 w-3.5" /> Quay lại</Link>
        </Button>

        <h1 className="border-l-4 border-imperial pl-4 text-3xl font-bold tracking-tight">{story.title}</h1>
        <p className="mt-2 pl-4 text-sm text-muted-foreground">
          bởi <Link to={`/author/${encodeURIComponent(story.author)}`} className="text-jade hover:underline">{story.author}</Link>
        </p>

        {/* Rating */}
        <div className="mt-4 flex items-center gap-2 pl-4">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} className={`h-4 w-4 ${s <= Math.round(story.rating) ? "fill-gold text-gold" : "text-muted-foreground/30"}`} />
            ))}
          </div>
          <span className="text-sm font-semibold text-gold">{story.rating}</span>
          <span className="text-xs text-muted-foreground">({story.comments} đánh giá)</span>
        </div>

        {/* Tags & Metadata */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge variant="secondary" className="gap-1"><Hash className="h-3 w-3" /> {story.genre}</Badge>
          {story.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
          <Badge variant={story.status === "completed" ? "default" : "outline"} className="gap-1">
            <Clock className="h-3 w-3" /> {story.status === "completed" ? "Hoàn thành" : story.status === "hiatus" ? "Tạm dừng" : "Đang ra"}
          </Badge>
          <Badge variant="secondary" className="gap-1"><FileText className="h-3 w-3" /> {(story.word_count / 1000).toFixed(0)}k chữ</Badge>
          <Badge variant="secondary" className="gap-1"><BookOpen className="h-3 w-3" /> {story.chapter_count} chương</Badge>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            variant={isFollowing ? "default" : "outline"}
            onClick={() => setIsFollowing(!isFollowing)}
            className={isFollowing ? "bg-jade text-white hover:bg-jade/90" : "border-jade text-jade hover:bg-jade/10"}
          >
            <Bell className="mr-1.5 h-4 w-4" /> {isFollowing ? "Đang theo dõi" : "Theo dõi"}
          </Button>
          <Button
            variant={isFavorited ? "default" : "outline"}
            onClick={() => setIsFavorited(!isFavorited)}
            className={isFavorited ? "bg-imperial text-white hover:bg-imperial/90" : "border-imperial text-imperial hover:bg-imperial/10"}
          >
            <Heart className={`mr-1.5 h-4 w-4 ${isFavorited ? "fill-current" : ""}`} /> {isFavorited ? "Đã yêu thích" : "Yêu thích"}
          </Button>
          <Button variant="outline" className="border-gold text-gold hover:bg-gold/10">
            <Gift className="mr-1.5 h-4 w-4" /> Tặng quà
          </Button>
        </div>

        {/* Synopsis */}
        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Tóm tắt</h2>
          <p className="mt-3 font-story text-base leading-relaxed text-foreground/90">{story.description}</p>
        </div>

        <Separator className="my-8 bg-gold/20" />

        {/* Chapters */}
        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Mục lục</h2>
          {chapters.length > 0 ? (
            <div className="space-y-1">
              {chapters.map((ch) => (
                <Link key={ch.id} to={`/read/${story.id}/${ch.chapter_number}`}
                  className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-muted/50">
                  <span>
                    <span className="mr-2 text-muted-foreground">Ch. {ch.chapter_number}</span>
                    <span className="font-medium">{ch.title}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{(ch.word_count / 1000).toFixed(1)}k</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">Chưa có chương nào.</p>
          )}
        </div>

        {chapters.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" className="bg-imperial text-white hover:bg-imperial/90">
              <Link to={`/read/${story.id}/1`}><BookOpen className="mr-2 h-4 w-4" /> Đọc ngay</Link>
            </Button>
          </div>
        )}

        <Separator className="my-8 bg-gold/20" />

        {/* Comments */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <MessageSquare className="h-4 w-4" /> Bình luận ({comments.length})
          </h2>

          <div className="mb-6 flex gap-3">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Viết bình luận của bạn..."
              className="min-h-[80px] resize-none"
            />
            <Button onClick={handleComment} size="icon" className="mt-auto bg-jade text-white hover:bg-jade/90 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{c.user}</span>
                  <span className="text-xs text-muted-foreground">{c.time}</span>
                </div>
                <p className="mt-2 text-sm text-foreground/80">{c.text}</p>
                <button className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-jade transition-colors">
                  <ThumbsUp className="h-3 w-3" /> {c.likes}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StoryDetail;
