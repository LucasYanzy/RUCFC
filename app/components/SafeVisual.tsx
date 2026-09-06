"use client";

import React from "react";

/**
 * A decorative WebGL layer must never be able to take the page down with it.
 *
 * LightRays builds an ogl Renderer in an effect. When a context cannot be
 * created -- GPU blocklist, WebGL switched off, low memory, a headless capture
 * -- that throws, and with no boundary above it React unwinds the entire tree:
 * the site renders as "Application error" rather than as a site with a plain
 * background. Verified with `chrome --headless --disable-3d-apis`, which
 * produced the error page and no hero at all.
 */
export default class SafeVisual extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[SafeVisual] decorative layer failed, dropping it:", error);
    }
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Probes for a usable context before we ever construct the renderer. The
 *  boundary above is the backstop; this avoids the throw in the common case. */
export function useWebGLSupport(): boolean {
  const [supported, setSupported] = React.useState(false);
  React.useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      setSupported(Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl")));
    } catch {
      setSupported(false);
    }
  }, []);
  return supported;
}
