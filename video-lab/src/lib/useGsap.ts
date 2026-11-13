import { useLayoutEffect, useRef, useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import gsap from 'gsap';

/**
 * يبني خط GSAP زمني متوقف، ويقفز فيه كل فريم للحظة frame/fps.
 * كذا Remotion هو اللي يتحكم بالوقت والتصدير يطلع مضبوط فريم بفريم.
 */
export const useGsap = (build: (tl: gsap.core.Timeline) => void) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scope = useRef<HTMLDivElement>(null);
  const [tl, setTl] = useState<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const t = gsap.timeline({ paused: true });
      build(t);
      setTl(t);
    }, scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    tl?.seek(frame / fps, false);
  }, [tl, frame, fps]);

  return scope;
};
