"use client";

import { useEffect, useRef, useState } from "react";

export default function PersonalVisualStory() {
  const storyRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const story = storyRef.current;
    if (!story) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { rootMargin: "-16% 0px", threshold: 0.2 },
    );
    observer.observe(story);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={storyRef}
      className={`obs-personal-story${isActive ? " is-active" : ""}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 760 560"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="obs-repulsor-beam" x1="300" y1="0" x2="0" y2="0">
            <stop stopColor="#F6CF72" stopOpacity="0.9" />
            <stop offset="1" stopColor="#E86A2B" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="obs-cosmic-well">
            <stop stopColor="#05070A" />
            <stop offset="0.56" stopColor="#111A2C" />
            <stop offset="1" stopColor="#6F8FFF" stopOpacity="0" />
          </radialGradient>
          <filter
            id="obs-story-glow"
            x="-80%"
            y="-80%"
            width="260%"
            height="260%"
          >
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="obs-story-stars">
          <circle cx="86" cy="78" r="1.5" />
          <circle cx="234" cy="118" r="1" />
          <circle cx="673" cy="91" r="1.4" />
          <circle cx="702" cy="376" r="1" />
          <circle cx="572" cy="482" r="1.3" />
          <circle cx="154" cy="447" r="1" />
          <circle cx="338" cy="62" r="0.9" />
        </g>

        <g className="obs-story-group obs-story-armored">
          <path
            className="obs-story-silhouette"
            pathLength="1"
            d="M465 482C463 429 474 380 503 345C524 319 553 303 586 297L639 315C671 342 688 398 689 482"
          />
          <path
            className="obs-story-silhouette"
            pathLength="1"
            d="M526 301L513 240L532 184L585 158L638 184L658 240L644 300L615 326H557L526 301Z"
          />
          <path pathLength="1" d="M533 215L560 199H610L638 215" />
          <path pathLength="1" d="M540 234L565 248H605L632 234" />
          <path pathLength="1" d="M548 274L572 284H600L625 274" />
          <path className="obs-story-visor" d="M542 229L568 234" />
          <path className="obs-story-visor" d="M628 229L602 234" />
          <path
            className="obs-story-silhouette obs-armored-body"
            pathLength="1"
            d="M628 345C649 319 656 284 647 244"
          />
          <path
            className="obs-story-silhouette obs-armored-body"
            pathLength="1"
            d="M647 371C675 332 676 287 661 247"
          />
          <g className="obs-story-reactor">
            <circle cx="590" cy="380" r="23" />
            <circle cx="590" cy="380" r="11" />
            <path d="M590 357V403M567 380H613M574 364L606 396M606 364L574 396" />
          </g>

          <g className="obs-story-palm">
            <circle cx="656" cy="229" r="27" />
            <circle cx="656" cy="229" r="10" />
            <path d="M638 209L629 178" />
            <path d="M648 203L645 169" />
            <path d="M658 202L662 166" />
            <path d="M667 205L679 173" />
            <path d="M676 211L696 184" />
          </g>
          <path
            className="obs-story-beam-cone"
            d="M668 216L760 164V294L668 242Z"
          />
          <path className="obs-story-beam" d="M668 229H760" />
        </g>

        <g className="obs-story-group obs-story-timekeeper">
          <path
            className="obs-story-silhouette"
            pathLength="1"
            d="M397 474C399 412 418 371 453 348L479 336H553L580 348C615 371 636 412 639 474"
          />
          <path
            className="obs-story-silhouette"
            pathLength="1"
            d="M452 326L438 249L463 196L515 170L567 196L593 249L578 326L550 350H481L452 326Z"
          />
          <path
            className="obs-story-horn"
            pathLength="1"
            d="M470 202C424 179 383 132 367 73C361 48 364 27 377 10C383 82 414 123 475 148"
          />
          <path
            className="obs-story-horn"
            pathLength="1"
            d="M560 202C606 179 647 132 663 73C669 48 666 27 653 10C647 82 616 123 555 148"
          />
          <path pathLength="1" d="M463 246L492 229H538L567 246" />
          <path pathLength="1" d="M476 274L497 284H533L554 274" />
          <path className="obs-story-eye" d="M478 248L501 253" />
          <path className="obs-story-eye" d="M552 248L529 253" />
          <path
            className="obs-story-ribbon obs-story-ribbon-a"
            pathLength="1"
            d="M70 382C173 290 257 394 340 302C405 230 374 142 282 105"
          />
          <path
            className="obs-story-ribbon obs-story-ribbon-b"
            pathLength="1"
            d="M109 457C195 351 286 477 372 378C443 296 407 218 350 173"
          />
          <path
            className="obs-story-ribbon obs-story-ribbon-c"
            pathLength="1"
            d="M683 389C621 341 619 276 675 225C710 194 722 151 704 116"
          />
        </g>

        <g className="obs-story-group obs-story-cosmic">
          <ellipse
            className="obs-cosmic-well"
            cx="498"
            cy="266"
            rx="112"
            ry="112"
            fill="url(#obs-cosmic-well)"
          />
          <ellipse cx="498" cy="266" rx="154" ry="52" />
          <ellipse cx="498" cy="266" rx="134" ry="39" />
          <ellipse cx="498" cy="266" rx="60" ry="22" />
          <path className="obs-cosmic-beam" d="M303 401L470 286" />
          <path className="obs-cosmic-beam" d="M526 246L692 132" />
          <circle className="obs-cosmic-pulse" cx="498" cy="266" r="28" />

          <g className="obs-story-tree">
            <path pathLength="1" d="M648 520C644 461 646 407 650 347" />
            <path pathLength="1" d="M649 438C609 409 580 378 567 337" />
            <path pathLength="1" d="M648 421C687 390 711 355 716 310" />
            <path pathLength="1" d="M649 390C612 359 598 322 603 281" />
            <path pathLength="1" d="M650 372C680 342 685 305 675 267" />
            <path pathLength="1" d="M603 281C581 255 570 228 572 199" />
            <path pathLength="1" d="M675 267C704 242 718 214 716 184" />
            <circle cx="567" cy="337" r="4" />
            <circle cx="716" cy="310" r="4" />
            <circle cx="572" cy="199" r="4" />
            <circle cx="716" cy="184" r="4" />
          </g>
        </g>
      </svg>
    </div>
  );
}
