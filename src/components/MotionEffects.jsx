import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ContourBackdrop } from './ReferenceMotion';

export function OpeningSequence({ complete }) {
  return (
    <AnimatePresence>
      {!complete && (
        <motion.div className="opening-sequence" aria-hidden="true"
          exit={{ opacity: 0, scale: 1.12, filter: 'blur(8px)' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <motion.div className="opening-logo" initial={{ scale: 0.88 }} animate={{ scale: 1 }}
            exit={{ scale: 1.18 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <motion.span className="opening-code" initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65 }}>&lt;/&gt;</motion.span>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.55 }}>Aditya<span>.</span></motion.p>
            <motion.div className="opening-line" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.85, ease: [0.65, 0, 0.35, 1] }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function AmbientScene({ reducedMotion }) {
  return (
    <div className="ambient-scene" aria-hidden="true">
      {!reducedMotion && <ContourBackdrop />}
      <span className="ambient-orb orb-blue" />
      <span className="ambient-orb orb-violet" />
      <span className="ambient-orb orb-cyan" />
      <div className="ambient-stars"><span /><span /><span /><span /><span /><span /></div>
    </div>
  );
}

export function RotatingRole({ enabled, reducedMotion }) {
  const [index, setIndex] = useState(0);
  const roles = ['Web Developer', 'UI/UX Designer'];
  useEffect(() => {
    if (!enabled || reducedMotion) return;
    const interval = window.setInterval(() => setIndex((current) => (current + 1) % 2), 3200);
    return () => window.clearInterval(interval);
  }, [enabled, reducedMotion]);

  return (
    <p className="hero-profession">
      <span className="sr-only">Web Developer &amp; UI/UX Designer</span>
      <span className="role-prefix" aria-hidden="true">I create as a</span>
      <span className="role-rotator" aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={reducedMotion ? 'static' : index}
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
            transition={{ duration: reducedMotion ? 0 : 0.3 }}>
            {reducedMotion ? 'Web Developer & UI/UX Designer' : roles[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </p>
  );
}
