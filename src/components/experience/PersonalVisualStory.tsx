export default function PersonalVisualStory() {
  return (
    <div className="obs-personal-story" aria-hidden="true">
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
          <path
            className="obs-story-silhouette obs-armored-body"
            pathLength="1"
            d="M504 352L430 320L365 300L323 294"
          />
          <path
            className="obs-story-silhouette obs-armored-body"
            pathLength="1"
            d="M493 379L420 350L355 330L320 310"
          />
          <path className="obs-story-core" d="M571 364L608 364L590 397Z" />

          <g className="obs-story-palm">
            <circle cx="308" cy="300" r="27" />
            <circle cx="308" cy="300" r="10" />
            <path d="M291 281L275 254" />
            <path d="M300 275L294 244" />
            <path d="M309 273L310 239" />
            <path d="M318 276L329 246" />
            <path d="M326 282L346 259" />
          </g>
          <path
            className="obs-story-beam-cone"
            d="M297 286L0 247V353L297 314Z"
          />
          <path className="obs-story-beam" d="M297 300H0" />
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
            <path pathLength="1" d="M176 498V334" />
            <path pathLength="1" d="M176 411C146 378 116 348 69 340" />
            <path pathLength="1" d="M176 393C205 357 226 317 229 269" />
            <path pathLength="1" d="M176 367C144 327 139 280 153 237" />
            <path pathLength="1" d="M176 350C202 328 208 297 207 265" />
            <circle cx="69" cy="340" r="4" />
            <circle cx="153" cy="237" r="4" />
            <circle cx="207" cy="265" r="4" />
            <circle cx="229" cy="269" r="4" />
          </g>
        </g>
      </svg>
    </div>
  );
}
