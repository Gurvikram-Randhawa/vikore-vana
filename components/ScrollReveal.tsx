"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealDirection = "up" | "left" | "right";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 700,
  distance = 40,
  className = "",
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  const getTransform = () => {
    if (isVisible) return "translate3d(0, 0, 0)";
    switch (direction) {
      case "up":
        return `translate3d(0, ${distance}px, 0)`;
      case "left":
        return `translate3d(${distance}px, 0, 0)`;
      case "right":
        return `translate3d(-${distance}px, 0, 0)`;
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: [
          `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
          `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        ].join(", "),
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

/**
 * A staggered reveal wrapper — each direct child gets a cascading delay.
 */
interface StaggerRevealProps {
  children: ReactNode;
  stagger?: number;
  direction?: RevealDirection;
  duration?: number;
  distance?: number;
  className?: string;
  childClassName?: string;
}

export function StaggerReveal({
  children,
  stagger = 100,
  direction = "up",
  duration = 700,
  distance = 40,
  className = "",
  childClassName = "",
}: StaggerRevealProps) {
  const items = Array.isArray(children) ? children : [children];

  return (
    <div className={className}>
      {items.map((child, i) => (
        <ScrollReveal
          key={i}
          direction={direction}
          delay={i * stagger}
          duration={duration}
          distance={distance}
          className={childClassName}
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}
