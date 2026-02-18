import { useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { mockStories, mockChapters } from "@/lib/mock-data";
import { ArrowLeft, Save, BookOpen, Plus, FileText, Settings, Lock, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GENRES = ["Fantasy", "Romance", "Sci-Fi", "Horror", "Mystery", "Slice of Life"];

function EditIcon(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

const StoryEditor = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isNew = id === "new";
  const existingStory = !isNew ? mockStories.find(s => s.id === id) : null;
  const existingChapters = id && !isNew ? mockChapters[id] || [] : [];
  const { toast } = useToast();

  const defaultTab = searchParams.get("tab") || "info";
  const showNewChapter = searchParams.get("action") === "new";

  const [title, setTitle] = useState(existingStory?.title || "");
  const [description, setDescription] = useState(existingStory?.description || "");
  const [genre, setGenre] = useState(existingStory?.genre || "Fantasy");
  const [status, setStatus] = useState<string>(existingStory?.status || "ongoing");
  const [tags, setTags] = useState(existingStory?.tags.join(", ") || "");

  const [showChapterForm, setShowChapterForm] = useState(showNewChapter);
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterNumber, setChapterNumber] = useState(existingChapters.length + 1);
  const [chapterContent, setChapterContent] = useState("");
  const [chapterPart, setChapterPart] = useState("");
  const [flowerPrice, setFlowerPrice] = useState("");
  const [isLocked, setIsLocked] = useState(false);

  const handleSaveStory = () => {
    if (!title.trim()) {
      toast({ title: "Lỗi", description: "Vui lòng nhập tiêu đề truyện.", variant: "destructive" });
      return;
    }
    toast({ title: "Thành công", description: isNew ? "Truyện đã được tạo!" : "Truyện đã được cập nhật!" });
  };

  const handlePublishChapter = () => {
    if (!chapterTitle.trim() || !chapterContent.trim()) {
      toast({ title: "Lỗi", description: "Vui lòng nhập tiêu đề và nội dung chương.", variant: "destructive" });
      return;
    }
    toast({ title: "Thành công", description: `Chương ${chapterNumber} đã được đăng!` });
    setChapterTitle("");
    setChapterContent("");
    setShowChapterForm(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-3xl py-8">
        <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground">
          <Link to="/dashboard"><ArrowLeft className="mr-1 h-3.5 w-3.5" /> Quay lại quản lý</Link>
        </Button>

        <h1 className="mb-6 border-l-4 border-jade pl-4 text-2xl font-bold">
          {isNew ? "Tạo truyện mới" : `Chỉnh sửa: ${existingStory?.title}`}
        </h1>

        <Tabs defaultValue={defaultTab}>
          <TabsList className="mb-6 w-full justify-start gap-1 bg-transparent p-0 border-b border-border rounded-none">
            <TabsTrigger value="info" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-jade data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <Settings className="h-3.5 w-3.5" /> Thông tin
            </TabsTrigger>
            <TabsTrigger value="chapters" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-jade data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <BookOpen className="h-3.5 w-3.5" /> Chương ({existingChapters.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề *</Label>
              <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Nhập tiêu đề truyện..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Mô tả</Label>
              <Textarea id="desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="Nhập mô tả truyện..." className="min-h-[120px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Thể loại</Label>
                <Select value={genre} onValueChange={setGenre}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {GENRES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ongoing">Đang ra</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="hiatus">Tạm dừng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
              <Input id="tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="Xianxia, Action, Adventure..." />
            </div>
            {tags && (
              <div className="flex flex-wrap gap-1.5">
                {tags.split(",").map((t, i) => t.trim() && <Badge key={i} variant="secondary" className="text-xs">{t.trim()}</Badge>)}
              </div>
            )}
            <Button onClick={handleSaveStory} className="bg-jade text-white hover:bg-jade/90">
              <Save className="mr-1.5 h-4 w-4" /> {isNew ? "Tạo truyện" : "Lưu thay đổi"}
            </Button>
          </TabsContent>

          <TabsContent value="chapters" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{existingChapters.length} chương đã đăng</p>
              <Button size="sm" onClick={() => setShowChapterForm(true)} className="bg-jade text-white hover:bg-jade/90 gap-1">
                <Plus className="h-3.5 w-3.5" /> Thêm chương mới
              </Button>
            </div>

            {existingChapters.length > 0 && (
              <div className="space-y-2">
                {existingChapters.map(ch => (
                  <div key={ch.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="text-sm font-medium">Ch. {ch.chapter_number}: {ch.title}</p>
                      <p className="text-xs text-muted-foreground">{(ch.word_count / 1000).toFixed(1)}k chữ</p>
                    </div>
                    <div className="flex gap-1.5">
                      <Button size="sm" variant="ghost" className="text-xs"><EditIcon className="h-3 w-3" /></Button>
                      <Button size="sm" variant="ghost" className="text-xs text-destructive"><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showChapterForm && (
              <div className="rounded-lg border-2 border-jade/30 bg-jade/5 p-5 space-y-4">
                <h3 className="font-semibold flex items-center gap-2"><FileText className="h-4 w-4 text-jade" /> Đăng chương mới</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tiêu đề chương *</Label>
                    <Input value={chapterTitle} onChange={e => setChapterTitle(e.target.value)} placeholder="Tiêu đề chương..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Số thứ tự</Label>
                    <Input type="number" value={chapterNumber} onChange={e => setChapterNumber(Number(e.target.value))} min={1} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phần (nếu có)</Label>
                    <Input value={chapterPart} onChange={e => setChapterPart(e.target.value)} placeholder="VD: Phần 1 - Khởi đầu" />
                  </div>
                  <div className="space-y-2">
                    <Label>Giá Sương Hoa (nếu có)</Label>
                    <Input type="number" value={flowerPrice} onChange={e => setFlowerPrice(e.target.value)} placeholder="0" min={0} />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Switch checked={isLocked} onCheckedChange={setIsLocked} />
                  <Label className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" /> Khoá chương (yêu cầu Sương Hoa)
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label>Nội dung chương *</Label>
                  <Textarea value={chapterContent} onChange={e => setChapterContent(e.target.value)}
                    placeholder="Viết nội dung chương tại đây..."
                    className="min-h-[300px] font-story text-base leading-relaxed" />
                  <p className="text-xs text-muted-foreground text-right">
                    {chapterContent.split(/\s+/).filter(Boolean).length} từ
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handlePublishChapter} className="bg-imperial text-white hover:bg-imperial/90">
                    <Save className="mr-1.5 h-4 w-4" /> Đăng chương
                  </Button>
                  <Button variant="outline" onClick={() => setShowChapterForm(false)}>Huỷ</Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StoryEditor;
