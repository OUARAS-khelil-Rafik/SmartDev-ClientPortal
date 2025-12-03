import React, { useEffect, useRef } from 'react';

const isInteractive = (el: EventTarget | null) => {
  if (!(el instanceof Element)) return false;
  return (
    el.closest('a, button, input, textarea, select, label, [role="button"], .cursor-pointer') !== null
  );
};

const CustomCursor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const target = useRef({ x: pos.current.x, y: pos.current.y });
  const pressed = useRef(false);
  const hovered = useRef(false);
  const rafRef = useRef<number | null>(null);
  const hueRef = useRef(190);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Respect reduced motion and touch devices
    const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = matchMedia('(pointer: fine)').matches;
    if (!finePointer) return; // don't run on touch
    if (!containerRef.current || !ringRef.current || !dotRef.current) return;

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      // quick position for dot using left/top so CSS transform (centering/scale) remains active
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const onDown = (e: PointerEvent) => {
      pressed.current = true;
      containerRef.current?.setAttribute('data-pressed', 'true');
      createRipple(e.clientX, e.clientY);
    };

    const onUp = () => {
      pressed.current = false;
      containerRef.current?.setAttribute('data-pressed', 'false');
    };

    const onOver = (e: PointerEvent) => {
      const hover = isInteractive(e.target);
      hovered.current = hover;
      containerRef.current?.setAttribute('data-hover', hover ? 'true' : 'false');
    };

    const onOut = (e: PointerEvent) => {
      const hover = isInteractive(e.relatedTarget);
      hovered.current = hover;
      containerRef.current?.setAttribute('data-hover', hover ? 'true' : 'false');
    };

    const animate = (now?: number) => {
      // smooth-follow for ring (use left/top instead of transform to preserve CSS scale rules)
      pos.current.x += (target.current.x - pos.current.x) * 0.18;
      pos.current.y += (target.current.y - pos.current.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.left = `${pos.current.x}px`;
        ringRef.current.style.top = `${pos.current.y}px`;
      }

      // Color cycling: update hue based on time delta
      const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReduced) {
        const t = now ?? performance.now();
        const last = lastTimeRef.current ?? t;
        const dt = Math.max(0, (t - last) / 1000);
        lastTimeRef.current = t;
        // degrees per second
        const speed = 28; // gentle rotation
        hueRef.current = (hueRef.current + dt * speed) % 360;
        const color = `hsl(${Math.round(hueRef.current)}, 85%, 50%)`;
        if (ringRef.current) ringRef.current.style.borderColor = color;
        if (dotRef.current) {
          dotRef.current.style.background = color;
          dotRef.current.style.boxShadow = `0 6px 18px rgba(0,0,0,0.08), 0 2px 8px ${color}33`;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    const createRipple = (x: number, y: number) => {
      if (prefersReduced) return;
      const el = document.createElement('div');
      el.className = 'cursor-ripple';
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      document.body.appendChild(el);
      const remove = () => { if (el.parentNode) el.parentNode.removeChild(el); };
      el.addEventListener('animationend', remove, { once: true });
      // safety cleanup
      setTimeout(remove, 700);
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerout', onOut);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="custom-cursor" data-pressed="false" data-hover="false" aria-hidden>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
};

export default CustomCursor;
