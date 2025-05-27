import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface AnimatedTextProps {
  text: string;
  shouldAnimate?: boolean;
}

export function AnimatedText({
  text,
  shouldAnimate = true,
}: AnimatedTextProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset hasAnimated when text changes
  useEffect(() => {
    setHasAnimated(false);
  }, [text]);

  // Determine if we should animate based on props and internal state
  const animate = shouldAnimate && !hasAnimated;

  useEffect(() => {
    if (animate && containerRef.current) {
      const words = text.split(" ");
      const container = containerRef.current;

      // Clear the container and create word spans
      container.innerHTML = "";

      words.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        span.style.opacity = "0";
        span.style.transform = "translateY(10px)";
        span.style.display = "inline-block";
        container.appendChild(span);
      });

      // Animate each word
      const wordSpans = container.children;
      gsap.to(wordSpans, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.02,
        ease: "power2.out",
        onComplete: () => setHasAnimated(true),
      });
    } else if (!animate && containerRef.current) {
      // If not animating, just show the text immediately
      containerRef.current.innerHTML = text
        .split(" ")
        .map(
          (word) =>
            `<span style="opacity: 1; transform: translateY(0)">${word} </span>`
        )
        .join("");
    }
  }, [animate, text]);

  return <div ref={containerRef} className="inline" />;
}
