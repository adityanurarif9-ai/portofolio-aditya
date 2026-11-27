import { useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

export default function SpiderPortrait() {
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [photoReady, setPhotoReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const radius = useMotionValue(80);
  const revealMask = useMotionTemplate`radial-gradient(circle ${radius}px at ${pointerX}px ${pointerY}px, #000 0%, #000 48%, transparent 100%)`;

  function positionReveal(event) {
    const frame = event.currentTarget;
    const bounds = frame.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) * frame.clientWidth / bounds.width);
    pointerY.set((event.clientY - bounds.top) * frame.clientHeight / bounds.height);
    radius.set(Math.min(100, Math.max(40, frame.clientWidth * 0.22)));
  }

  function toggleFromKeyboard(event) {
    if (event.detail !== 0) return;
    const frame = event.currentTarget;
    const photo = frame.querySelector('.portrait-original');
    const width = frame.clientWidth;
    const height = frame.clientHeight;
    const cover = Math.max(width / photo.naturalWidth, height / photo.naturalHeight);
    const imageWidth = photo.naturalWidth * cover;
    const imageHeight = photo.naturalHeight * cover;
    pointerX.set((0.476 * imageWidth + (width - imageWidth) / 2 - width * 0.5) * 1.9 + width * 0.5);
    pointerY.set((0.394 * imageHeight + (height - imageHeight) / 2 - height * 0.59) * 1.9 + height * 0.59);
    radius.set(Math.min(100, Math.max(40, width * 0.22)));
    setActive((current) => !current);
  }

  return (
    <>
      <button type="button" className="portrait-frame spider-portrait"
        data-spider={active && ready && photoReady} aria-pressed={active && ready && photoReady} disabled={!ready || !photoReady}
        aria-label="Tampilkan efek sapuan kostum Spider-Man pada foto"
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') {
            positionReveal(event);
            setActive(true);
          }
        }}
        onPointerMove={(event) => {
          if (event.pointerType === 'mouse' || active) positionReveal(event);
        }}
        onPointerDown={(event) => {
          positionReveal(event);
          setActive(true);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse') setActive(false);
        }}
        onPointerCancel={() => setActive(false)}
        onClick={toggleFromKeyboard}
        onBlur={() => setActive(false)}>
        <img className="portrait-original" src="/profile.png" alt="Aditya Nur Arif" fetchPriority="high" onLoad={() => setPhotoReady(true)} />
        <motion.span className="spider-reveal-layer" aria-hidden="true"
          style={{ maskImage: revealMask, WebkitMaskImage: revealMask }}>
          <img src="/profile-spider.png" alt="" decoding="async"
            onLoad={() => setReady(true)} onError={() => setFailed(true)} />
        </motion.span>
      </button>
      <span className="portrait-hint" aria-hidden="true">
        {failed ? 'Efek belum tersedia' : ready && photoReady ? 'Gerakkan kursor atau sentuh foto 🕷' : 'Menyiapkan efek…'}
      </span>
    </>
  );
}
