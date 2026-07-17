"use client";

import { useEffect, useRef } from "react";
import { LANDING_CSS, LANDING_MARKUP } from "./landing-source";

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap";

/**
 * Renders the original landing page HTML/CSS/JS inside a Shadow Root so
 * app globals.css cannot override shared class names (.hero, .btn, .msg, …).
 */
export function LandingPage() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Same Google Fonts as the original HTML <head>
    let fontLink = document.querySelector<HTMLLinkElement>(
      'link[data-landing-fonts="1"]'
    );
    if (!fontLink) {
      const preconnect = document.createElement("link");
      preconnect.rel = "preconnect";
      preconnect.href = "https://fonts.googleapis.com";
      preconnect.setAttribute("data-landing-fonts", "1");
      document.head.appendChild(preconnect);

      fontLink = document.createElement("link");
      fontLink.rel = "stylesheet";
      fontLink.href = FONT_HREF;
      fontLink.setAttribute("data-landing-fonts", "1");
      document.head.appendChild(fontLink);
    }

    const prevHtmlOverflow = document.documentElement.style.overflowX;
    const prevHtmlScroll = document.documentElement.style.scrollBehavior;
    const prevBodyBg = document.body.style.background;
    const prevBodyOverflow = document.body.style.overflowX;
    document.documentElement.style.overflowX = "hidden";
    document.documentElement.style.scrollBehavior = "smooth";
    document.body.style.background = "#ffffff";
    document.body.style.overflowX = "hidden";

    const shadow =
      host.shadowRoot ?? host.attachShadow({ mode: "open" });
    shadow.innerHTML = `<style>${LANDING_CSS}</style>${LANDING_MARKUP}`;

    const root = shadow;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      document.documentElement.style.scrollBehavior = "auto";
    }

    // Hash links (#features, …) resolve against the document, not the shadow tree
    const onHashClick = (e: Event) => {
      const target = e.target as Element | null;
      const a = target?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;
      const el = root.querySelector(href);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    };
    root.addEventListener("click", onHashClick);

    const timers: number[] = [];
    const intervals: number[] = [];
    const rafs: number[] = [];
    const cleanups: Array<() => void> = [
      () => root.removeEventListener("click", onHashClick),
    ];

    /* ——— identical behavior to original <script> ——— */

    const nav = root.getElementById("nav");
    if (nav) {
      const onScroll = () =>
        nav.classList.toggle("scrolled", window.scrollY > 24);
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      cleanups.push(() => window.removeEventListener("scroll", onScroll));
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    root.querySelectorAll(".rv,.rv-l,.rv-r").forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    function countUp(el: HTMLElement) {
      const target = parseFloat(el.dataset.count || "0");
      const decimals = parseInt(el.dataset.decimal || "0", 10);
      const suffix = el.dataset.suffix || "";
      if (reduceMotion) {
        el.textContent =
          target.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }) + suffix;
        return;
      }
      const dur = 1600;
      const t0 = performance.now();
      function tick(t: number) {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent =
          (target * eased).toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }) + suffix;
        if (p < 1) rafs.push(requestAnimationFrame(tick));
      }
      rafs.push(requestAnimationFrame(tick));
    }
    const statIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            countUp(e.target as HTMLElement);
            statIO.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    root
      .querySelectorAll<HTMLElement>("[data-count]")
      .forEach((el) => statIO.observe(el));
    cleanups.push(() => statIO.disconnect());

    const steps = [
      ...root.querySelectorAll<HTMLElement>("#chatBody [data-step]"),
    ].sort((a, b) => Number(a.dataset.step) - Number(b.dataset.step));
    const typing = root.querySelector<HTMLElement>("#chatBody .typing");
    const inputText = root.getElementById("chatInputText");
    const inputPhrases = [
      "Yes, draft the letter",
      "How much can I recover?",
      "What should I document?",
    ];
    let phraseIdx = 0;
    let chatLoopActive = true;

    function typeInput(text: string, done?: () => void) {
      if (!inputText) return;
      if (reduceMotion) {
        inputText.innerHTML = text + '<span class="caret"></span>';
        done?.();
        return;
      }
      let i = 0;
      inputText.innerHTML = '<span class="caret"></span>';
      const iv = window.setInterval(() => {
        if (!chatLoopActive) {
          clearInterval(iv);
          return;
        }
        i++;
        inputText.innerHTML =
          text.slice(0, i) + '<span class="caret"></span>';
        if (i >= text.length) {
          clearInterval(iv);
          done?.();
        }
      }, 55);
      intervals.push(iv);
    }

    function runChat() {
      if (!chatLoopActive || !typing) return;
      steps.forEach((s) => s.classList.remove("show"));
      typing.classList.remove("show");
      if (reduceMotion) {
        steps.forEach((s) => {
          if (!s.classList.contains("typing")) s.classList.add("show");
        });
        return;
      }
      const timeline: Array<[number, () => void]> = [
        [600, () => steps[0]?.classList.add("show")],
        [1400, () => typing.classList.add("show")],
        [
          3000,
          () => {
            typing.classList.remove("show");
            steps[2]?.classList.add("show");
          },
        ],
        [4000, () => steps[3]?.classList.add("show")],
        [5200, () => steps[4]?.classList.add("show")],
        [
          6000,
          () => typeInput(inputPhrases[phraseIdx++ % inputPhrases.length]),
        ],
        [11500, runChat],
      ];
      timeline.forEach(([t, fn]) => {
        timers.push(
          window.setTimeout(() => {
            if (chatLoopActive) fn();
          }, t)
        );
      });
    }

    const chatWindow = root.getElementById("chatWindow");
    if (chatWindow) {
      const chatIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              runChat();
              chatIO.unobserve(e.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      chatIO.observe(chatWindow);
      cleanups.push(() => chatIO.disconnect());

      if (!reduceMotion && window.matchMedia("(pointer:fine)").matches) {
        const wrap = chatWindow.parentElement;
        if (wrap) {
          const onMove = (e: MouseEvent) => {
            const r = chatWindow.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            chatWindow.style.transform = `perspective(1100px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
          };
          const onLeave = () => {
            chatWindow.style.transform =
              "perspective(1100px) rotateY(0deg) rotateX(0deg)";
          };
          wrap.addEventListener("mousemove", onMove);
          wrap.addEventListener("mouseleave", onLeave);
          cleanups.push(() => {
            wrap.removeEventListener("mousemove", onMove);
            wrap.removeEventListener("mouseleave", onLeave);
          });
        }
      }
    }

    return () => {
      chatLoopActive = false;
      timers.forEach(clearTimeout);
      intervals.forEach(clearInterval);
      rafs.forEach(cancelAnimationFrame);
      cleanups.forEach((fn) => fn());
      shadow.innerHTML = "";
      document.documentElement.style.overflowX = prevHtmlOverflow;
      document.documentElement.style.scrollBehavior = prevHtmlScroll;
      document.body.style.background = prevBodyBg;
      document.body.style.overflowX = prevBodyOverflow;
    };
  }, []);

  return (
    <div
      ref={hostRef}
      id="landing-host"
      style={{ display: "block", minHeight: "100vh" }}
    />
  );
}
