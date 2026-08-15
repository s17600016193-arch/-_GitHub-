"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const films = [
  { title: "黑拳", subtitle: "BLACK FIST", src: "/videos/hei-quan.mp4" },
  { title: "楼道回响", subtitle: "ECHOES IN THE HALL", src: "/videos/lou-dao-hui-xiang.mp4" },
  { title: "卯蚀", subtitle: "MAO ECLIPSE", src: "/videos/mao-shi.mp4" },
];

const wechatInlinePlaybackAttributes = {
  "webkit-playsinline": "true",
  "x5-playsinline": "true",
  "x5-video-player-type": "h5-page",
  "x5-video-player-fullscreen": "false",
} as Record<string, string>;

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  // Mobile browsers only permit reliable autoplay when media starts muted.
  const [muted, setMuted] = useState(true);
  const [needsPlayGesture, setNeedsPlayGesture] = useState(false);
  const [interlude, setInterlude] = useState(false);
  const [heroMostlyVisible, setHeroMostlyVisible] = useState(true);
  const heroRef = useRef<HTMLElement | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  const attemptPlayback = useCallback(async (video: HTMLVideoElement, forceMuted = false) => {
    video.volume = 0.12;
    if (forceMuted) {
      video.muted = true;
      video.setAttribute("muted", "");
      setMuted(true);
    }

    try {
      await video.play();
      setNeedsPlayGesture(false);
      return;
    } catch {
      if (!video.muted) {
        video.muted = true;
        video.setAttribute("muted", "");
        setMuted(true);
        try {
          await video.play();
          setNeedsPlayGesture(false);
          return;
        } catch {
          // Some WeChat WebViews still require a real touch gesture.
        }
      }
      setNeedsPlayGesture(true);
    }
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroMostlyVisible(entry.intersectionRatio >= 0.5),
      { threshold: [0, 0.49, 0.5, 1] },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (!video) return;
      video.volume = 0.12;
      video.muted = muted;
    });
  }, [muted]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === active) video.currentTime = 0;
      else video.pause();
    });
  }, [active]);

  useEffect(() => {
    const current = videoRefs.current[active];
    if (!current) return;

    if (interlude || !heroMostlyVisible) {
      current.pause();
      return;
    }

    current.muted = muted;
    void attemptPlayback(current);
    const fallbackTimer = window.setTimeout(() => {
      if (current.paused && !interlude && heroMostlyVisible) setNeedsPlayGesture(true);
    }, 2200);
    return () => window.clearTimeout(fallbackTimer);
  }, [active, attemptPlayback, heroMostlyVisible, interlude, muted]);

  useEffect(() => {
    const resumeAfterWeChatReady = () => {
      const current = videoRefs.current[active];
      if (!current || interlude || !heroMostlyVisible) return;
      void attemptPlayback(current, true);
    };

    document.addEventListener("WeixinJSBridgeReady", resumeAfterWeChatReady);
    if ("WeixinJSBridge" in window) resumeAfterWeChatReady();
    return () => document.removeEventListener("WeixinJSBridgeReady", resumeAfterWeChatReady);
  }, [active, attemptPlayback, heroMostlyVisible, interlude]);

  useEffect(() => {
    if (!needsPlayGesture) return;
    const resumeOnFirstTouch = () => {
      const current = videoRefs.current[active];
      if (!current || interlude || !heroMostlyVisible) return;
      void attemptPlayback(current, true);
    };

    document.addEventListener("touchstart", resumeOnFirstTouch, { once: true, passive: true });
    return () => document.removeEventListener("touchstart", resumeOnFirstTouch);
  }, [active, attemptPlayback, heroMostlyVisible, interlude, needsPlayGesture]);

  useEffect(() => {
    if (!interlude) return;
    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % films.length);
      setInterlude(false);
      setNeedsPlayGesture(false);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [interlude]);

  const chooseFilm = (index: number) => {
    const selected = videoRefs.current[index];
    if (selected) selected.currentTime = 0;
    setActive(index);
    setInterlude(false);
    setNeedsPlayGesture(false);
  };

  const toggleSound = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    const current = videoRefs.current[active];
    if (current) {
      current.muted = nextMuted;
      current.volume = 0.12;
      if (!interlude && heroMostlyVisible) void attemptPlayback(current);
    }
  };

  const playFromGesture = () => {
    const current = videoRefs.current[active];
    if (!current) return;
    void attemptPlayback(current, true);
  };

  return (
    <section ref={heroRef} className="hero" id="top" aria-label="沃野香田作品视频轮播">
      <div className="video-stage">
        {films.map((film, index) => (
          <video
            key={film.src}
            ref={(node) => { videoRefs.current[index] = node; }}
            className={index === active && !interlude ? "hero-video is-active" : "hero-video"}
            src={film.src}
            poster="/hero-wild-field.png"
            preload={index === active ? "auto" : "metadata"}
            playsInline
            autoPlay={index === 0}
            muted={muted}
            {...wechatInlinePlaybackAttributes}
            onCanPlay={(event) => {
              if (index !== active || interlude || !heroMostlyVisible) return;
              event.currentTarget.muted = muted;
              void attemptPlayback(event.currentTarget);
            }}
            onEnded={() => setInterlude(true)}
            aria-label={`${film.title}作品视频`}
          />
        ))}
        <div className={interlude ? "brand-interlude is-active" : "brand-interlude"} aria-hidden={!interlude}>
          <div>
            <p>WILD FIELD STUDIO</p>
            <h2><span>让故事</span><span>在旷野生长</span></h2>
            <small>下一部作品即将开始</small>
          </div>
        </div>
      </div>
      <div className="video-shade" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      {needsPlayGesture && !interlude && (
        <button className="hero-play-fallback" type="button" onClick={playFromGesture} aria-label="播放首页视频">
          <span aria-hidden="true"><i /></span>
          <small>点击播放</small>
        </button>
      )}

      <div className={interlude ? "film-caption is-hidden" : "film-caption"} aria-live="polite">
        <p>{String(active + 1).padStart(2, "0")} / {String(films.length).padStart(2, "0")}</p>
        <h1>{films[active].title}</h1>
        <span>{films[active].subtitle}</span>
      </div>

      <a className="scroll-cue" href="#manifesto" aria-label="向下浏览">
        <span className="scroll-cue-icon" aria-hidden="true" />
        <small>SCROLL</small>
      </a>

      <div className="carousel-bar">
        <p>{interlude ? "WILD FIELD STUDIO · 05 SEC" : "SELECTED WORKS · 2026"}</p>
        <div className="carousel-dots" role="tablist" aria-label="选择视频">
          {films.map((film, index) => (
            <button
              key={film.src}
              type="button"
              role="tab"
              aria-selected={active === index && !interlude}
              aria-label={`播放《${film.title}》`}
              className={active === index && !interlude ? "dot is-active" : "dot"}
              onClick={() => chooseFilm(index)}
            ><span /></button>
          ))}
        </div>
        <button className="sound-control" type="button" onClick={toggleSound} aria-label={muted ? "打开声音" : "静音"}>
          <span className={muted ? "sound-bars is-muted" : "sound-bars"} aria-hidden="true"><i /><i /><i /></span>
          <span>{muted ? (needsPlayGesture ? "点击播放视频" : "声音已关闭") : "音量 · 12%"}</span>
        </button>
      </div>
    </section>
  );
}
