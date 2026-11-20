"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ChatBot = dynamic(() => import("./ChatBot").then((mod) => mod.ChatBot), {
  ssr: false,
});

export function ChatBotLoader() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const mount = () => setReady(true);

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(mount, { timeout: 2500 });
    } else {
      timeoutId = setTimeout(mount, 2500);
    }

    return () => {
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  if (!ready) return null;

  return <ChatBot />;
}
