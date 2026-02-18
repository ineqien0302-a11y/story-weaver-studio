import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, List, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { mockStories, mockChapters } from "@/lib/mock-data";

const Reader = () => {
  const { storyId, chapterNum } = useParams<{ storyId: string; chapterNum: string }>();
  const navigate = useNavigate();
  const [fontSize, setFontSize] = useState(18);
  const [scrollProgress, setScrollProgress] = useState(0);

  const story = mockStories.find((s) => s.id === storyId);
  const chapters = storyId ? mockChapters[storyId] || [] : [];
  const chapterNumber = parseInt(chapterNum || "1", 10);
  const chapter = chapters.find((c) => c.chapter_number === chapterNumber);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [chapterNumber]);

  if (!story || !chapter) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Chapter not found.</p>
          <Button asChild variant="link" className="mt-4">
            <Link to="/">← Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const hasPrev = chapterNumber > 1;
  const hasNext = chapterNumber < chapters.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Progress bar */}
      <div className="fixed left-0 right-0 top-0 z-50">
        <Progress value={scrollProgress} className="h-0.5 rounded-none bg-transparent [&>div]:bg-primary" />
      </div>

      {/* Floating controls */}
      <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-card/95 px-2 py-1.5 shadow-lg backdrop-blur">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={!hasPrev}
          onClick={() => navigate(`/read/${storyId}/${chapterNumber - 1}`)}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link to={`/story/${storyId}`}>
            <List className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <div className="mx-1 h-4 w-px bg-border" />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setFontSize((s) => Math.max(14, s - 2))}
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <span className="w-6 text-center text-[10px] text-muted-foreground">{fontSize}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setFontSize((s) => Math.min(28, s + 2))}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
        <div className="mx-1 h-4 w-px bg-border" />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={!hasNext}
          onClick={() => navigate(`/read/${storyId}/${chapterNumber + 1}`)}
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Content */}
      <article className="mx-auto max-w-[750px] px-6 pb-24 pt-12">
        <Link to={`/story/${storyId}`} className="mb-8 inline-flex items-center text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-3 w-3" /> {story.title}
        </Link>

        <h1 className="border-l-4 border-imperial pl-4 font-story text-2xl font-bold tracking-tight">
          {chapter.title}
        </h1>
        <p className="mt-2 pl-4 text-xs text-muted-foreground">
          Chapter {chapter.chapter_number} · {(chapter.word_count / 1000).toFixed(1)}k words
        </p>

        <div
          className="mt-10 font-story text-foreground/90"
          style={{ fontSize: `${fontSize}px` }}
        >
          {chapter.content.split("\n\n").map((paragraph, i) => (
            <p key={i} className="mb-6 leading-[1.8] tracking-[0.02em]">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Navigation at bottom */}
        <div className="mt-16 flex items-center justify-between border-t border-border pt-6">
          {hasPrev ? (
            <Button variant="outline" size="sm" asChild>
              <Link to={`/read/${storyId}/${chapterNumber - 1}`}>
                <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Previous
              </Link>
            </Button>
          ) : (
            <div />
          )}
          {hasNext ? (
            <Button variant="outline" size="sm" asChild>
              <Link to={`/read/${storyId}/${chapterNumber + 1}`}>
                Next <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link to={`/story/${storyId}`}>Back to Story</Link>
            </Button>
          )}
        </div>
      </article>
    </div>
  );
};

export default Reader;
