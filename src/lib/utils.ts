import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { WheelEventHandler } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const scrollOnHover: WheelEventHandler<HTMLElement> = event => {
  const container = event.currentTarget;
  const delta = event.deltaY;

  if (delta === 0) return;

  const canScrollUp = container.scrollTop > 0;
  const canScrollDown = container.scrollTop + container.clientHeight < container.scrollHeight - 1;
  const scrollingDown = delta > 0;

  if ((scrollingDown && canScrollDown) || (!scrollingDown && canScrollUp)) {
    event.preventDefault();
    container.scrollTop += delta;
  }
};
