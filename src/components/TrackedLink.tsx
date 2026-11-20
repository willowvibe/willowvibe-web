"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { track } from "@vercel/analytics";

type TrackedLinkProps = {
  href: string;
  event: string;
  props?: Record<string, string | number | boolean | null | undefined>;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "children" | "onClick">;

export function TrackedLink({ href, event, props, children, ...rest }: TrackedLinkProps) {
  const handleClick = () => {
    track(event, props);
  };

  const isInternal = href.startsWith("/") && !href.startsWith("//");

  if (isInternal) {
    return (
      <Link href={href} onClick={handleClick} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
