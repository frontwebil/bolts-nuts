"use client";

import { useState, useEffect, useRef } from "react";
import "../HeroBanner/style.css";
import { HERO_BANNERS_SLIDES } from "@/generalConfigs/SITE_CONFIG";

export function HeroBanner() {
  const slides = HERO_BANNERS_SLIDES;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef(0);

  // autoplay
  useEffect(() => {
    if (paused) return;

    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(intervalRef.current!);
  }, [paused, slides.length]);

  const nextSlide = () => setActive((p) => (p + 1) % slides.length);
  const prevSlide = () =>
    setActive((p) => (p - 1 + slides.length) % slides.length);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const delta = endX - touchStartX.current;

    if (delta > 80) prevSlide();
    if (delta < -80) nextSlide();
  };

  return (
    <section
      className="HeroBanner"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="HeroBanner-track"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="HeroBanner-slide"
            style={
              {
                "--bg-xl": `url(${slide.bg.xl})`,
                "--bg-lg": `url(${slide.bg.lg})`,
                "--bg-md": `url(${slide.bg.md})`,
                "--bg-sm": `url(${slide.bg.sm})`,
                "--bg-xs": `url(${slide.bg.xs})`,
              } as React.CSSProperties
            }
          >
            <div className="HeroBanner-content">
              <p className="HeroBanner-title">{slide.title}</p>
              <h2 className="HeroBanner-sub">{slide.subTitle}</h2>
              <button className="HeroBanner-btn">
                Check It Out <span className="italic">now</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="HeroBanner-pagination">
        {slides.map((_, i) => (
          <span
            key={i}
            className={i === active ? "dot active" : "dot"}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </section>
  );
}
