import type { Variants } from "framer-motion";

export const fadeUp: Variants = {
  initial: { y: 30, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { y: -20, opacity: 0, transition: { duration: 0.4, ease: "easeIn" } },
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const fadeDown: Variants = {
  initial: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0, transition: { duration: 0.4, ease: "easeIn" } },
};

export const slideUpSpring: Variants = {
  initial: { y: 40, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
  exit: { y: 40, opacity: 0 },
};

export const scaleIn: Variants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
  exit: { scale: 0.9, opacity: 0 },
};
