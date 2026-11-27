import { useId, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function SpiderPortrait() {
  const [active, setActive] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 4000, height: 6000 });
  const reducedMotion = useReducedMotion();
  const id = useId().replace(/:/g, '');
  const face = {
    x: imageSize.width * 0.413,
    y: imageSize.height * 0.348,
    width: imageSize.width * 0.127,
    height: imageSize.height * 0.092,
  };

  return (
    <>
      <button type="button" className="portrait-frame spider-portrait"
        data-spider={active} aria-pressed={active}
        aria-label={active ? 'Tampilkan wajah asli' : 'Ubah wajah menjadi Spider-Man'}
        onPointerEnter={(event) => { if (event.pointerType === 'mouse') setActive(true); }}
        onPointerLeave={(event) => { if (event.pointerType === 'mouse') setActive(false); }}
        onClick={() => setActive((current) => !current)}
        onBlur={() => setActive(false)}>
        <img src="/profile.png" alt="Aditya Nur Arif" fetchPriority="high"
          onLoad={(event) => setImageSize({
            width: event.currentTarget.naturalWidth,
            height: event.currentTarget.naturalHeight,
          })} />
        <svg className="spider-overlay" viewBox={'0 0 ' + imageSize.width + ' ' + imageSize.height}
          preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
          <svg x={face.x} y={face.y} width={face.width} height={face.height}
            viewBox="0 0 120 160" overflow="visible">
            <defs>
              <radialGradient id={id + '-red'} cx="40%" cy="35%" r="75%">
                <stop stopColor="#f34343" /><stop offset=".65" stopColor="#ce1427" /><stop offset="1" stopColor="#790c20" />
              </radialGradient>
              <clipPath id={id + '-outline'}>
                <path d="M60 3C28 1 10 24 11 62L14 99C17 121 34 144 60 156C86 144 103 121 106 99L109 62C110 24 92 1 60 3Z" />
              </clipPath>
              <clipPath id={id + '-reveal'}>
                <motion.rect width="120" initial={false}
                  animate={{ height: active ? 160 : 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }} />
              </clipPath>
            </defs>
            <g clipPath={'url(#' + id + '-reveal)'}>
              <g clipPath={'url(#' + id + '-outline)'}>
                <path d="M0 0H120V160H0Z" fill={'url(#' + id + '-red)'} />
                <g stroke="#301324" strokeWidth="1.6" fill="none" opacity=".85">
                  <path d="M60 79V0M60 79 23 0M60 79 0 29M60 79 0 67M60 79 0 119M60 79 23 160M60 79V160M60 79 97 160M60 79 120 119M60 79 120 67M60 79 120 29M60 79 97 0" />
                  <path d="M45 48Q60 57 75 48M29 26Q60 42 91 26M17 5Q60 24 103 5M34 63Q44 49 45 48M75 48Q77 57 86 63M18 57Q23 37 29 26M91 26Q98 43 102 57M18 57Q21 76 14 88M102 57Q97 76 106 88M34 63Q37 78 30 94M86 63Q83 78 90 94M30 94Q45 98 46 116Q60 110 74 116Q76 100 90 94M14 88Q27 99 23 123Q43 126 43 146Q60 135 77 146Q77 127 97 123Q94 99 106 88M46 116Q54 126 60 135Q66 126 74 116M43 146Q51 150 60 156Q69 150 77 146" />
                </g>
                <path d="M17 56C30 64 40 67 53 79C48 95 38 102 28 93C21 86 18 72 17 56Z" fill="#eaf4ff" stroke="#171b2a" strokeWidth="7" strokeLinejoin="round" />
                <path d="M103 56C90 64 80 67 67 79C72 95 82 102 92 93C99 86 102 72 103 56Z" fill="#eaf4ff" stroke="#171b2a" strokeWidth="7" strokeLinejoin="round" />
                <path d="M25 65Q39 71 47 81M95 65Q81 71 73 81" fill="none" stroke="white" strokeWidth="2.5" opacity=".85" />
              </g>
              <path d="M60 3C28 1 10 24 11 62L14 99C17 121 34 144 60 156C86 144 103 121 106 99L109 62C110 24 92 1 60 3Z" fill="none" stroke="#65101b" strokeWidth="2" />
            </g>
          </svg>
        </svg>
        <span className="spider-flash" aria-hidden="true" />
      </button>
      <span className="portrait-hint" aria-hidden="true">{active ? '🕷 Spider-Man mode' : 'Sorot atau ketuk foto 🕷'}</span>
    </>
  );
}
