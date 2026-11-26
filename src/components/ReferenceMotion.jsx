import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function GhostCursor({ reducedMotion }) {
  const [visible, setVisible] = useState(false);
  const targetX = useMotionValue(-100);
  const targetY = useMotionValue(-100);
  const targetScale = useMotionValue(1);
  const x = useSpring(targetX, { stiffness: 230, damping: 24 });
  const y = useSpring(targetY, { stiffness: 230, damping: 24 });
  const scale = useSpring(targetScale, { stiffness: 350, damping: 23 });

  useEffect(() => {
    if (reducedMotion) return;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const move = (event) => {
      if (!finePointer.matches || event.pointerType !== 'mouse') {
        setVisible(false);
        return;
      }
      targetX.set(event.clientX + 14);
      targetY.set(event.clientY + 14);
      targetScale.set(event.target.closest('a, button, [role="button"]') ? 1.2 : 1);
      setVisible(true);
    };
    const hide = () => setVisible(false);
    const press = () => targetScale.set(0.8);
    const release = () => targetScale.set(1);
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    window.addEventListener('pointerdown', press, { passive: true });
    window.addEventListener('pointerup', release, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
      window.removeEventListener('pointerdown', press);
      window.removeEventListener('pointerup', release);
    };
  }, [reducedMotion, targetX, targetY, targetScale]);

  if (reducedMotion) return null;
  return (
    <motion.div className="ghost-cursor" aria-hidden="true" style={{ x, y, scale }}
      animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: 0.18 }}>
      <span className="ghost-cursor-glow" />
      <span className="ghost-character">👻</span>
    </motion.div>
  );
}

const paths = [
  [
    'M-90-50C220 40 0 150 135 255S360 345 180 455 20 670 230 900',
    'M-90-50C80 80 240 160 105 280S160 400 230 500 0 720 230 900',
  ],
  [
    'M380-90C690 80 220 150 405 275S680 395 470 505 330 740 580 930',
    'M380-90C480 90 610 170 440 300S390 420 530 540 650 760 580 930',
  ],
  [
    'M900-80C620 80 1150 190 920 310S680 430 950 535 1130 740 870 940',
    'M900-80C1090 100 720 140 880 300S1130 440 900 560 700 750 870 940',
  ],
];

export function ContourBackdrop() {
  return (
    <svg className="contour-field" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"
      aria-hidden="true" focusable="false" fill="none">
      {paths.map(([from, to], group) => (
        <g key={group}>
          {[0, 24, 48, 72].map((offset) => (
            <motion.path key={offset} d={from} transform={'translate(' + offset + ', 0)'}
              animate={{ d: [from, to, from] }}
              transition={{ duration: 28 + group * 5, repeat: Infinity, ease: 'easeInOut' }}
              vectorEffect="non-scaling-stroke" />
          ))}
        </g>
      ))}
    </svg>
  );
}
