"use client";

import { useEffect, useRef } from "react";

type TiltOptions = {
  maxTilt?: number;
  scale?: number;
  gyroTilt?: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function useInteractiveTilt({
  maxTilt = 3.5,
  scale = 1.025,
  gyroTilt = 2,
}: TiltOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const applyTilt = (rotateX: number, rotateY: number, scaleValue: number) => {
      if (frame.current) cancelAnimationFrame(frame.current);

      frame.current = requestAnimationFrame(() => {
        el.style.setProperty("--tilt-rotate-x", `${rotateX.toFixed(2)}deg`);
        el.style.setProperty("--tilt-rotate-y", `${rotateY.toFixed(2)}deg`);
        el.style.setProperty("--tilt-scale", scaleValue.toFixed(3));
      });
    };

    const resetTilt = () => applyTilt(0, 0, 1);

    const onPointerMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      applyTilt(
        clamp(-y * maxTilt * 2, -maxTilt, maxTilt),
        clamp(x * maxTilt * 2, -maxTilt, maxTilt),
        scale
      );
    };

    const onDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (document.visibilityState !== "visible") return;
      if (event.beta == null || event.gamma == null) return;

      const beta = clamp(event.beta, -18, 18) / 18;
      const gamma = clamp(event.gamma, -18, 18) / 18;
      applyTilt(
        clamp(-beta * gyroTilt, -gyroTilt, gyroTilt),
        clamp(gamma * gyroTilt, -gyroTilt, gyroTilt),
        1.012
      );
    };

    el.addEventListener("pointermove", onPointerMove, { passive: true });
    el.addEventListener("pointerleave", resetTilt);
    el.addEventListener("pointercancel", resetTilt);
    window.addEventListener("deviceorientation", onDeviceOrientation, { passive: true });

    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", resetTilt);
      el.removeEventListener("pointercancel", resetTilt);
      window.removeEventListener("deviceorientation", onDeviceOrientation);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [gyroTilt, maxTilt, scale]);

  return ref;
}
