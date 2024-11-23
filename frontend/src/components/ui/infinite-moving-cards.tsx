"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        scrollerRef.current?.appendChild(duplicatedItem);
      });

      const animationDuration =
        speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";

      containerRef.current.style.setProperty(
        "--animation-duration",
        animationDuration
      );

      const directionAnimation =
        direction === "left" ? "forwards" : "reverse";
      containerRef.current.style.setProperty(
        "--animation-direction",
        directionAnimation
      );
    }
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden max-w-7xl [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex gap-4 py-4 w-max animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            key={idx}
            className="w-[350px] bg-zinc-800 p-6 rounded-lg border border-zinc-700"
          >
            <blockquote>
              <p className="text-white text-sm">{item.quote}</p>
              <div className="mt-4">
                <p className="text-yellow-500 font-bold">{item.name}</p>
                <p className="text-zinc-400 text-sm">{item.title}</p>
              </div>
              {/* Add stars */}
              <div className="flex mt-2 text-yellow-500">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <span key={i} className="text-lg">
                      ★
                    </span>
                  ))}
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
