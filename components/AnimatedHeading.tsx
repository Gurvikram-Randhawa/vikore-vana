"use client";

import { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { clsx } from "clsx";

export interface HeadingToken {
  text: string;
  className?: string;
}

interface AnimatedHeadingProps {
  text?: string;
  tokens?: HeadingToken[];
  className?: string;
  delay?: number;
}

export function AnimatedHeading({ text, tokens, className, delay = 0 }: AnimatedHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: delay },
    },
  };

  const child: Variants = {
    hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }, // Butter smooth, high-end ease
    },
  };

  const renderWords = (content: string, tokenClassName?: string) => {
    return content.split(" ").map((word, wordIdx) => (
      <span key={wordIdx} className={clsx("inline-block whitespace-nowrap mr-[0.25em]", tokenClassName)}>
        {word.split("").map((char, charIdx) => (
          <motion.span variants={child} key={charIdx} className="inline-block">
            {char}
          </motion.span>
        ))}
      </span>
    ));
  };

  const contentToRender = tokens || (text ? [{ text }] : []);

  return (
    <motion.h2
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={clsx("font-serif flex flex-wrap", className)}
    >
      {contentToRender.map((token, idx) => (
        <span key={idx} className="inline-flex flex-wrap">
          {renderWords(token.text, token.className)}
        </span>
      ))}
    </motion.h2>
  );
}
