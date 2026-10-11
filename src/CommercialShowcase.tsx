"use client";

import { useEffect, useState } from "react";

type AdWork = {
  no: string;
  title: string;
  en: string;
  duration: string;
  src: string;
  poster: string;
};

const adWorks: AdWork[] = [
  { no: "A01", title: "变脸", en: "BIAN LIAN", duration: "00:28", src: "/ads/videos/bian-lian.mp4", poster: "/ads/posters/bian-lian.jpg" },
  { no: "A02", title: "佛女", en: "FO NV", duration: "00:29", src: "/ads/videos/fo-nv.mp4", poster: "/ads/posters/fo-nv.jpg" },
  { no: "A03", title: "水墨", en: "SHUI MO", duration: "00:33", src: "/ads/videos/shui-mo.mp4", poster: "/ads/posters/shui-mo.jpg" },
  { no: "A04", title: "游览", en: "YOU LAN", duration: "00:28", src: "/ads/videos/you-lan.mp4", poster: "/ads/posters/you-lan.jpg" },
];

const services = [
  ["01", "品牌故事", "BRAND STORY"],
  ["02", "产品叙事", "PRODUCT NARRATIVE"],
  ["03", "社交短片", "SOCIAL SHORTS"],
];

function AdCard({ work, onOpen }: { work: AdWork; onOpen: () => void }) {
  return (
    <article className="commercial-case">
      <button type="button" onClick={onOpen} aria-label={`播放广告短篇《${work.title}》`}>
        <span className="commercial-case-media">
          <img src={work.poster} alt={`${work.title}广告短篇海报`} loading="lazy" />
          <span className="commercial-case-shade" aria-hidden="true" />
          <span className="commercial-case-index">{work.no}</span>
          <span className="play-glyph" aria-hidden="true"><i /></span>
          <span className="commercial-case-play">点击播放 <i>PLAY FILM</i></span>
        </span>
        <span className="commercial-case-info">
          <span><strong>{work.title}</strong><small>{work.en}</small></span>
          <small>广告短篇 · {work.duration}</small>
          <span aria-hidden="true">↗</span>
        </span>
      </button>
    </article>
  );
}

export function CommercialShowcase() {
  const [selected, setSelected] = useState<AdWork | null>(null);

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
    <section className="commercial" id="commercial">
      <div className="commercial-heading">
        <p className="section-index">03 / 广告短篇</p>
        <p>BRANDED STORIES<br />&amp; COMMERCIAL SHORTS</p>
      </div>

      <div className="commercial-intro">
        <h2><span>让品牌</span><span>成为故事。</span></h2>
        <div className="commercial-copy">
          <p>把商业目标变成观众愿意看完的内容。我们以漫剧的叙事效率、电影的镜头意识和适配社交平台的节奏，为品牌制作短而完整的视觉故事。</p>
          <a href="mailto:hello@wildfield.studio?subject=%E5%B9%BF%E5%91%8A%E7%9F%AD%E7%AF%87%E5%90%88%E4%BD%9C%E5%92%A8%E8%AF%A2">
            <span>发起广告合作</span><i aria-hidden="true">↗</i>
          </a>
        </div>
      </div>

      <div className="commercial-gallery">
        {adWorks.map((work) => (
          <AdCard key={work.src} work={work} onOpen={() => setSelected(work)} />
        ))}
      </div>

      <div className="commercial-services" aria-label="广告短篇服务类型">
        {services.map(([no, title, en]) => (
          <div key={no}><span>{no}</span><strong>{title}</strong><small>{en}</small></div>
        ))}
      </div>

      <div className="commercial-ribbon" aria-hidden="true">
        <span>STRATEGY</span><i>×</i><span>WRITING</span><i>×</i><span>VISUAL</span><i>×</i><span>PRODUCTION</span>
      </div>

      {selected && (
        <div className="player-modal" role="dialog" aria-modal="true" aria-labelledby="commercial-player-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <div className="player-topline">
            <div><span>{selected.no}</span><h3 id="commercial-player-title">{selected.title}</h3><p>{selected.en}</p></div>
            <button type="button" onClick={() => setSelected(null)} aria-label="关闭视频">关闭 <i>×</i></button>
          </div>
          <div className="player-frame">
            <video key={selected.src} src={selected.src} poster={selected.poster} controls autoPlay playsInline onLoadedMetadata={(event) => { event.currentTarget.volume = 0.35; }} />
          </div>
          <p className="player-hint">ESC 关闭 · 使用播放器控制声音与进度</p>
        </div>
      )}
    </section>
  );
}
