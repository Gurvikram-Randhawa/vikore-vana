"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface TextRevealProps {
  children: string;
  /** Delay in ms between each character */
  stagger?: number;
  /** Total animation duration per character in ms */
  duration?: number;
  /** Starting blur amount in px */
  blur?: number;
  /** Extra delay before starting in ms */
  delay?: number;
  /** CSS class for the wrapper span */
  className?: string;
  /** Trigger on scroll (true) or on mount (false) */
  onScroll?: boolean;
  /** HTML tag to render */
  as?: "span" | "p" | "h1" | "h2" | "h3" | "div";
}

export function TextReveal({
  children,
  stagger = 18,
  duration = 380,
  blur = 6,
  delay = 0,
  className = "",
  onScroll = true,
  as: Tag = "span",
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(!onScroll);

  useEffect(() => {
    if (!onScroll) {
      setTriggered(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onScroll]);

  const chars = children.split("");

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      className={className}
      style={{ display: "inline-block" }}
    >
      {chars.map((char, i) => {
        const charDelay = delay + i * stagger;
        return (
          <span
            key={i}
            aria-hidden={char === " " ? undefined : "true"}
            style={{
              display: "inline-block",
              opacity: triggered ? 1 : 0,
              filter: triggered ? "blur(0px)" : `blur(${blur}px)`,
              transform: triggered ? "translateY(0) scale(1)" : "translateY(4px) scale(0.98)",
              transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${charDelay}ms, filter ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${charDelay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${charDelay}ms`,
              willChange: "opacity, filter, transform",
              minWidth: char === " " ? "0.25em" : undefined,
              padding: "0.2em 0",
              margin: "-0.2em 0",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </Tag>
  );
}

/**
 * A variant that accepts ReactNode children (JSX with mixed content).
 * Wraps each text node in TextReveal and passes through non-text children.
 */
interface TextRevealBlockProps {
  children: ReactNode;
  stagger?: number;
  duration?: number;
  blur?: number;
  delay?: number;
  className?: string;
  onScroll?: boolean;
}

export function TextRevealBlock({
  children,
  stagger = 18,
  duration = 380,
  blur = 6,
  delay = 0,
  className = "",
  onScroll = true,
}: TextRevealBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(!onScroll);

  useEffect(() => {
    if (!onScroll) {
      setTriggered(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onScroll]);

  // Flatten children text content to get all characters
  const extractText = (node: ReactNode): string => {
    if (typeof node === "string") return node;
    if (typeof node === "number") return String(node);
    if (!node) return "";
    if (Array.isArray(node)) return node.map(extractText).join("");
    if (typeof node === "object" && node !== null && "props" in node) {
      return extractText((node as any).props.children);
    }
    return "";
  };

  const fullText = extractText(children);
  const chars = fullText.split("");

  return (
    <div ref={ref} className={className} style={{ display: "inline" }}>
      {chars.map((char, i) => {
        const charDelay = delay + i * stagger;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: triggered ? 1 : 0,
              filter: triggered ? "blur(0px)" : `blur(${blur}px)`,
              transform: triggered ? "translateY(0) scale(1)" : "translateY(4px) scale(0.98)",
              transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${charDelay}ms, filter ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${charDelay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${charDelay}ms`,
              willChange: "opacity, filter, transform",
              minWidth: char === " " ? "0.25em" : undefined,
              padding: "0.2em 0",
              margin: "-0.2em 0",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </div>
  );
}
