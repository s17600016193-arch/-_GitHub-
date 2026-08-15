"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const films = [
  { title: "忘川拳场", subtitle: "FORGOTTEN RIVER ARENA", src: "/videos/hei-quan.mp4" },
  { title: "楼道回响", subtitle: "ECHOES IN THE HALL", src: "/videos/lou-dao-hui-xiang.mp4" },
  { title: "卯蚀", subtitle: "MAO ECLIPSE", src: "/videos/mao-shi.mp4" },
];

const wechatInlinePlaybackAttributes = {
  "webkit-playsinline": "true",
  "x5-playsinline": "true",
  "x5-video-player-type": "h5",
  "x5-video-player-fullscreen": "false",
} as Record<string, string>;

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  // Prefer low-volume sound, then fall back to muted autoplay before showing a play control.
  const [muted, setMuted] = useState(false);
  const [needsPlayGesture, setNeedsPlayGesture] = useState(false);
  const [interlude, setInterlude] = useState(false);
  const [heroMostlyVisible, setHeroMostlyVisible] = useState(true);
  const heroRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const attemptPlayback = useCallback(async (video: HTMLVideoElement) => {
    video.volume = 0.12;

    try {
      await video.play();
      setNeedsPlayGesture(false);
    } catch {
      if (!video.muted) {
        video.muted = true;
        video.setAttribute("muted", "");
        try {
          await video.play();
          setMuted(true);
          setNeedsPlayGesture(false);
          return;
        } catch {
          video.muted = false;
          video.removeAttribute("muted");
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
    const video = videoRef.current;
    if (!video) return;
    video.volume = 0.12;
    video.muted = muted;
    if (muted) video.setAttribute("muted", "");
    else video.removeAttribute("muted");
  }, [muted]);

  useEffect(() => {
    const current = videoRef.current;
    if (!current) return;

    if (interlude || !heroMostlyVisible) {
      current.pause();
      return;
    }

    current.muted = muted;
    void attemptPlayback(current);
  }, [active, attemptPlayback, heroMostlyVisible, interlude, muted]);

  useEffect(() => {
    const resumeAfterWeChatReady = () => {
      const current = videoRef.current;
      if (!current || interlude || !heroMostlyVisible) return;
      const bridge = (window as Window & {
        WeixinJSBridge?: {
          invoke?: (method: string, options: Record<string, never>, callback: () => void) => void;
        };
      }).WeixinJSBridge;

      if (bridge?.invoke) {
        bridge.invoke("getNetworkType", {}, () => {
          void attemptPlayback(current);
        });
        return;
      }

      void attemptPlayback(current);
    };

    document.addEventListener("WeixinJSBridgeReady", resumeAfterWeChatReady);
    resumeAfterWeChatReady();
    return () => document.removeEventListener("WeixinJSBridgeReady", resumeAfterWeChatReady);
  }, [active, attemptPlayback, heroMostlyVisible, interlude]);

  useEffect(() => {
    const resumeOnFirstTouch = () => {
      const current = videoRef.current;
      if (!current || interlude || !heroMostlyVisible) return;
      void attemptPlayback(current);
    };

    document.addEventListener("touchstart", resumeOnFirstTouch, { once: true, passive: true });
    return () => document.removeEventListener("touchstart", resumeOnFirstTouch);
  }, [active, attemptPlayback, heroMostlyVisible, interlude]);

  useEffect(() => {
    const resumeVisibleVideo = () => {
      const current = videoRef.current;
      if (!current || interlude || !heroMostlyVisible || document.visibilityState === "hidden") return;
      void attemptPlayback(current);
    };
    const resumeAfterVisibilityChange = () => {
      if (document.visibilityState === "visible") resumeVisibleVideo();
    };

    window.addEventListener("pageshow", resumeVisibleVideo);
    window.addEventListener("focus", resumeVisibleVideo);
    document.addEventListener("visibilitychange", resumeAfterVisibilityChange);
    return () => {
      window.removeEventListener("pageshow", resumeVisibleVideo);
      window.removeEventListener("focus", resumeVisibleVideo);
      document.removeEventListener("visibilitychange", resumeAfterVisibilityChange);
    };
  }, [active, attemptPlayback, heroMostlyVisible, interlude]);

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
    if (index === active && videoRef.current) videoRef.current.currentTime = 0;
    setActive(index);
    setInterlude(false);
    setNeedsPlayGesture(false);
  };

  const toggleSound = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    const current = videoRef.current;
    if (current) {
      current.muted = nextMuted;
      current.volume = 0.12;
      if (!interlude && heroMostlyVisible) void attemptPlayback(current);
    }
  };

  const playFromGesture = () => {
    const current = videoRef.current;
    if (!current) return;
    current.muted = false;
    current.removeAttribute("muted");
    current.volume = 0.12;
    setMuted(false);
    void attemptPlayback(current);
  };

  const currentFilm = films[active];

  const resumeWhenReady = (video: HTMLVideoElement) => {
    if (interlude || !heroMostlyVisible) return;
    video.muted = muted;
    void attemptPlayback(video);
  };

  return (
    <section ref={heroRef} className="hero" id="top" aria-label="沃野香田作品视频轮播">
      <div className="video-stage">
        <video
          key={currentFilm.src}
          ref={(node) => {
            videoRef.current = node;
            if (!node) return;
            node.autoplay = true;
            node.defaultMuted = muted;
            node.muted = muted;
            node.volume = 0.12;
            node.setAttribute("autoplay", "");
            node.setAttribute("playsinline", "");
            node.setAttribute("webkit-playsinline", "true");
            if (muted) node.setAttribute("muted", "");
            else node.removeAttribute("muted");
          }}
          className={!interlude ? "hero-video is-active" : "hero-video"}
          src={currentFilm.src}
          poster="/hero-wild-field.png"
          preload="auto"
          playsInline
          autoPlay
          muted={muted}
          {...wechatInlinePlaybackAttributes}
          onLoadedMetadata={(event) => resumeWhenReady(event.currentTarget)}
          onLoadedData={(event) => resumeWhenReady(event.currentTarget)}
          onCanPlay={(event) => resumeWhenReady(event.currentTarget)}
          onPlaying={() => setNeedsPlayGesture(false)}
          onEnded={() => {
            setNeedsPlayGesture(false);
            setInterlude(true);
          }}
          aria-label={`${currentFilm.title}作品视频`}
        />
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
        <button className="hero-play-fallback" type="button" onClick={playFromGesture} aria-label="有声播放首页视频">
          <span aria-hidden="true"><i /></span>
          <small>点击播放 · 有声</small>
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
          <span>{muted ? "声音已关闭" : "音量 · 12%"}</span>
        </button>
      </div>
    </section>
  );
}
