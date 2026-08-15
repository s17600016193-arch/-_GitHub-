"use client";

import { useEffect, useState } from "react";

type Work = {
  no: string;
  title: string;
  en: string;
  meta: string;
  src: string;
  poster: string;
  orientation: "landscape" | "portrait";
};

const landscapeWorks: Work[] = [
  { no: "01", title: "忘川拳场", en: "FORGOTTEN RIVER ARENA", meta: "动作漫剧 · 16:9", src: "/videos/hei-quan.mp4", poster: "/posters/hei-quan-final.jpg", orientation: "landscape" },
  { no: "02", title: "楼道回响", en: "ECHOES IN THE HALL", meta: "悬疑漫剧 · 16:9", src: "/videos/lou-dao-hui-xiang.mp4", poster: "/posters/lou-dao-hui-xiang.jpg", orientation: "landscape" },
  { no: "03", title: "卯蚀", en: "MAO ECLIPSE", meta: "科幻漫剧 · 16:9", src: "/videos/mao-shi.mp4", poster: "/posters/mao-shi-final.jpg", orientation: "landscape" },
];

const portraitWorks: Work[] = [
  { no: "04", title: "对你着迷", en: "OBSESSED WITH YOU", meta: "竖屏试片 · 31:54", src: "/videos/dui-ni-zhao-mi.mp4", poster: "/posters/dui-ni-zhao-mi-v2.jpg", orientation: "portrait" },
  { no: "05", title: "他的替身", en: "HIS STAND-IN", meta: "竖屏试片 · 31:54", src: "/videos/ta-de-ti-shen.mp4", poster: "/posters/ta-de-ti-shen.jpg", orientation: "portrait" },
  { no: "06", title: "忘川拳场", en: "FORGOTTEN RIVER ARENA", meta: "竖屏试片 · 31:54", src: "/videos/wang-chuan-quan-chang.mp4", poster: "/posters/wang-chuan-quan-chang-final.jpg", orientation: "portrait" },
];

function PosterCard({ work, featured = false, onOpen }: { work: Work; featured?: boolean; onOpen: () => void }) {
  return (
    <article className={`poster-card ${featured ? "is-featured" : ""} is-${work.orientation}`}>
      <button type="button" onClick={onOpen} aria-label={`播放《${work.title}》`}>
        <span className="poster-media">
          <img src={work.poster} alt={`${work.title}视频海报`} loading="lazy" />
          <span className="poster-shade" aria-hidden="true" />
          <span className="poster-index">{work.no}</span>
          <span className="play-glyph" aria-hidden="true"><i /></span>
          <span className="poster-action">点击播放 <i>PLAY FILM</i></span>
        </span>
        <span className="poster-info">
          <span><strong>{work.title}</strong><small>{work.en}</small></span>
          <small>{work.meta}</small>
          <span className="poster-arrow" aria-hidden="true">↗</span>
        </span>
      </button>
    </article>
  );
}

export function WorkShowcase() {
  const [selected, setSelected] = useState<Work | null>(null);

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selected]);

  return (
    <>
      <div className="landscape-gallery">
        <PosterCard work={landscapeWorks[0]} featured onOpen={() => setSelected(landscapeWorks[0])} />
        <div className="landscape-stack">
          {landscapeWorks.slice(1).map((work) => (
            <PosterCard key={work.src} work={work} onOpen={() => setSelected(work)} />
          ))}
        </div>
      </div>

      <div className="format-divider">
        <span>VERTICAL STORIES</span>
        <p>为手机屏幕生长的故事</p>
        <span>31 : 54</span>
      </div>

      <div className="portrait-gallery">
        {portraitWorks.map((work) => (
          <PosterCard key={work.src} work={work} onOpen={() => setSelected(work)} />
        ))}
      </div>

      {selected && (
        <div className="player-modal" role="dialog" aria-modal="true" aria-labelledby="player-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <div className="player-topline">
            <div><span>{selected.no}</span><h3 id="player-title">{selected.title}</h3><p>{selected.en}</p></div>
            <button type="button" onClick={() => setSelected(null)} aria-label="关闭视频">关闭 <i>×</i></button>
          </div>
          <div className={`player-frame is-${selected.orientation}`}>
            <video key={selected.src} src={selected.src} poster={selected.poster} controls autoPlay playsInline onLoadedMetadata={(event) => { event.currentTarget.volume = 0.35; }} />
          </div>
          <p className="player-hint">ESC 关闭 · 使用播放器控制声音与进度</p>
        </div>
      )}
    </>
  );
}
