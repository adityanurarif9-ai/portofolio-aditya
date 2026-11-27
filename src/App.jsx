import { useState, useEffect } from 'react';
import './App.css';
import { motion, AnimatePresence, MotionConfig, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { AmbientScene, OpeningSequence, RotatingRole } from './components/MotionEffects';
import { CursorRing } from './components/ReferenceMotion';
import SpiderPortrait from './components/SpiderPortrait';

function ProjectImage({ project, className }) {
  const [failed, setFailed] = useState(false);
  if (!project.image || failed) {
    return <div className="project-placeholder"><span>{project.type}</span><strong>{project.title}</strong></div>;
  }
  return <img src={project.image} alt={project.title} className={className} loading="lazy" onError={() => setFailed(true)} />;
}

export default function App() {
  const reducedMotion = useReducedMotion();
  const [introComplete, setIntroComplete] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches || (Boolean(window.location.hash) && window.location.hash !== '#home'),
  );
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 160, damping: 30 });

  useEffect(() => {
    if (introComplete) return;
    const timer = window.setTimeout(() => setIntroComplete(true), 1400);
    return () => window.clearTimeout(timer);
  }, [introComplete]);

  const [activeSection, setActiveSection] = useState('home');
  const [formStatus, setFormStatus] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'education', 'skills', 'portfolio', 'experience', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.getBoundingClientRect().top + window.scrollY;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
          }
        }
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const dialog = document.querySelector('[role="dialog"]');
    const closeButton = dialog?.querySelector('button');
    closeButton?.focus();
    const handleKey = (event) => {
      if (event.key === 'Escape') setSelectedProject(null);
      if (event.key === 'Tab') {
        event.preventDefault();
        closeButton?.focus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
      previousFocus?.focus();
    };
  }, [selectedProject]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const subject = String(fields.get('subject')).trim();
    const body = [String(fields.get('message')).trim(), '',
      String(fields.get('name')).trim(), String(fields.get('email')).trim()].join(String.fromCharCode(10));
    window.location.href = 'mailto:adityanurarif9@gmail.com?subject=' +
      encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    setFormStatus('Lanjutkan pengiriman pesan melalui aplikasi email kamu.');
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 28, filter: reducedMotion ? 'none' : 'blur(5px)' },
    visible: {
      opacity: 1, y: 0, filter: 'blur(0px)',
      transition: { duration: reducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };


  return (
    <MotionConfig reducedMotion="user">
    <div className={'portfolio-site text-slate-100 font-sans min-h-screen selection:bg-blue-500 selection:text-white overflow-x-clip relative ' + (introComplete ? 'is-ready' : 'is-opening')}>
      <OpeningSequence complete={introComplete} />
      <AmbientScene reducedMotion={reducedMotion} />
      <CursorRing reducedMotion={reducedMotion} />
      <motion.div className="reading-progress" aria-hidden="true"
        style={{ scaleX: reducedMotion ? scrollYProgress : smoothProgress }} />

      {/* NAVIGATION */}
      <motion.header className="site-header" style={{ x: '-50%' }}
        initial={reducedMotion ? false : { opacity: 0, y: -15 }}
        animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: -15 }}
        transition={{ duration: 0.65, delay: 0.15 }}>
        <a href="#home" className="site-logo" aria-label="Aditya, kembali ke beranda">
          <span aria-hidden="true">&lt;/&gt;</span> Aditya<span className="logo-dot">.</span>
        </a>
        <nav className="pill-nav" aria-label="Navigasi utama">
          {['Home', 'About', 'Portfolio', 'Contact'].map((item) => {
            const sectionId = item.toLowerCase();
            const isActive = activeSection === sectionId ||
              (sectionId === 'about' && ['education', 'skills', 'experience'].includes(activeSection));
            return (
              <a key={item} href={'#' + sectionId} aria-current={isActive ? 'location' : undefined}
                onClick={() => setActiveSection(sectionId)}>
                {isActive && <motion.span className="nav-active" layoutId="navigation-pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span className="nav-label">{item}</span>
              </a>
            );
          })}
        </nav>
        <a href="https://github.com/adityanurarif9-ai" className="header-github"
          target="_blank" rel="noreferrer" aria-label="GitHub Aditya">
          <i className="fa-brands fa-github" aria-hidden="true" />
        </a>
      </motion.header>

      {/* HERO */}
      <section id="home" className="reference-hero">
        <motion.div className="hero-intro" initial="hidden" animate={introComplete ? 'visible' : 'hidden'} variants={fadeInUp}>
          <p className="hero-greeting">Hi, I'm</p>
          <h1><span className="name-line">Aditya</span><span className="name-line">Nur Arif<span className="name-period">.</span></span></h1>
          <RotatingRole enabled={introComplete} reducedMotion={reducedMotion} />
          <a href="/cv_aditya.pdf" download="CV_Aditya_Nur_Arif.pdf" className="blue-button">
            <i className="fa-regular fa-file-lines" aria-hidden="true" /> View CV
          </a>
          <div className="hero-socials">
            <a href="https://github.com/adityanurarif9-ai" target="_blank" rel="noreferrer" aria-label="GitHub Aditya">
              <i className="fa-brands fa-github" aria-hidden="true" />
            </a>
            <a href="mailto:adityanurarif9@gmail.com" aria-label="Email Aditya">
              <i className="fa-regular fa-envelope" aria-hidden="true" />
            </a>
          </div>
        </motion.div>

        <motion.div className="hero-photo"
          initial={reducedMotion ? false : { opacity: 0, y: 35, scale: 0.96 }}
          animate={introComplete ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 35, scale: 0.96 }}
          transition={{ duration: 1.05, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
          <div className="photo-glow" aria-hidden="true" />
          <div className="photo-orbit" aria-hidden="true" />
          <span className="hero-symbol code-symbol" aria-hidden="true">&lt;/&gt;</span>
          <span className="hero-symbol star-symbol" aria-hidden="true">✦</span>
          <SpiderPortrait />
        </motion.div>

        <motion.div className="hero-description" initial="hidden" animate={introComplete ? 'visible' : 'hidden'} variants={fadeInUp}>
          <p>Saya Aditya Nur Arif, fokus pada pengembangan web dan desain antarmuka. Saat ini sedang menempuh pendidikan di SMK Telkom Purwokerto dengan spesialisasi Rekayasa Perangkat Lunak.</p>
          <p className="hero-location"><i className="fa-solid fa-location-dot" aria-hidden="true" /> Banyumas, Jawa Tengah</p>
          <a href="#portfolio" className="blue-button subtle-button">
            <i className="fa-regular fa-folder-open" aria-hidden="true" /> View Projects
          </a>
        </motion.div>
        <a className="scroll-cue" href="#about"><span className="scroll-mouse"><span /></span>Scroll to explore</a>
      </section>

      {/* ABOUT ME SECTION */}
      <section id="about" className="py-20 relative z-10 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="text-3xl font-bold text-white mb-3">About Me</h2>
            <p className="text-slate-400 text-base">Background dan minat saya</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12 items-start">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="lg:col-span-7 space-y-4 text-slate-300 text-base leading-relaxed"
            >
              <p>
                Saya memiliki ketertarikan dalam merancang antarmuka yang user-friendly dan membangun sistem backend yang solid. Dari menulis kode hingga membuat prototype desain, saya menikmati setiap tahap dalam proses pengembangan aplikasi.
              </p>
              <p className="text-slate-400">
                Aktif dalam organisasi seperti Majelis Perwakilan Kelas (MPK), Pramuka, Paskibraka, dan pernah menjadi Brand Ambassador sekolah.
              </p>
              <div className="pt-4">
                <h4 className="text-sm font-semibold text-white mb-3">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {['Football & Futsal', 'Traditional Arts', 'Jogging'].map((hobby) => (
                    <span key={hobby} className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700 text-sm text-slate-300">
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="lg:col-span-5 space-y-4"
            >
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 transition-all hover:border-slate-700">
                <h4 className="font-semibold text-white mb-1.5">Tech Enthusiast</h4>
                <p className="text-sm text-slate-400">Mengeksplorasi framework modern, bahasa pemrograman, dan engine game interaktif.</p>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 transition-all hover:border-slate-700">
                <h4 className="font-semibold text-white mb-1.5">Leadership & Public Speaking</h4>
                <p className="text-sm text-slate-400">Berpengalaman memimpin organisasi dan berkomunikasi di depan publik.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="career-layout">
      {/* EDUCATION SECTION */}
      <section id="education" className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Education</h2>
            <p className="text-slate-400 text-base">Latar belakang pendidikan</p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="timeline-entry"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white">SMK Telkom Purwokerto</h3>
                <p className="text-sm text-slate-400 mt-1">Purwokerto, Jawa Tengah</p>
              </div>
              <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium border border-slate-700">
                Rekayasa Perangkat Lunak
              </span>
            </div>
            <p className="text-slate-300 text-base leading-relaxed">
              Fokus pada pengembangan web, manajemen basis data, desain UI/UX, dan pemrograman berorientasi objek.
            </p>
          </motion.div>
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section id="experience" className="py-24 bg-slate-950/40 relative z-10 border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Experience</h2>
            <p className="text-slate-400 text-base">Organisasi dan kepemimpinan</p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                title: "Wakil Ketua Majelis Perwakilan Kelas (MPK)",
                inst: "SMK Telkom Purwokerto",
                desc: "Mengoordinasikan pengawasan program kerja OSIS, menampung aspirasi siswa, dan menyusun agenda strategis sekolah."
              },
              {
                title: "Brand Ambassador Sekolah",
                inst: "SMK Telkom Purwokerto",
                desc: "Mewakili institusi dalam public speaking, pembuatan konten promosi, dan presentasi sekolah."
              },
              {
                title: "Anggota Paskibraka (Pastema) & Pramuka",
                inst: "SMK Telkom Purwokerto",
                desc: "Melatih kedisiplinan, kerja sama tim, dan kepemimpinan dalam kegiatan upacara resmi."
              }
            ].map((exp, idx) => (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="timeline-entry"
              >
                <h3 className="text-lg font-bold text-white">{exp.title}</h3>
                <p className="text-xs font-semibold text-cyan-400 uppercase mt-0.5 mb-2">{exp.inst}</p>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{exp.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      </div>

    {/* SKILLS SECTION (MARQUEE ANIMATION & CLEAN LOGOS) */}
      <section id="skills" className="py-20 relative z-10 border-t border-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="text-3xl font-bold text-white mb-3">Skills</h2>
            <p className="text-slate-400 text-base">Tech stack & tools yang saya gunakan</p>
          </motion.div>
        </div>

        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden flex flex-col gap-6">

          {/* Gradient Blur di Pinggir */}
          <div className="absolute left-0 inset-y-0 w-24 bg-gradient-to-r from-[#030712] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 inset-y-0 w-24 bg-gradient-to-l from-[#030712] to-transparent z-10 pointer-events-none"></div>

          {/* Baris 1: Berjalan ke Kiri */}
          <div className="flex overflow-hidden whitespace-nowrap">
            <motion.div
              animate={{ x: ["-50%", "0%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 30, repeatType: "loop" }}
              className="flex gap-5 items-center shrink-0 pr-5"
            >
              {[
                { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
                { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
                { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
                { name: "PHP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
                { name: "Laravel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg" },
                { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
                { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
                { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
                // Duplikasi untuk looping mulus
                { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
                { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
                { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
                { name: "PHP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
                { name: "Laravel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg" },
                { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
                { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
                { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
              ].map((tech, idx) => (
                <div key={idx} className="flex items-center gap-3.5 bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/50 px-6 py-3.5 rounded-2xl shadow-xl transition-all">
                  <img src={tech.icon} alt={tech.name} className="w-7 h-7 object-contain drop-shadow" />
                  <span className="text-sm font-semibold text-slate-200 tracking-wide">{tech.name}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Baris 2: Berjalan ke Kanan */}
          <div className="flex overflow-hidden whitespace-nowrap">
            <motion.div
              animate={{ x: ["-50%", "0%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
              className="flex gap-6 items-center shrink-0 pr-6"
            >
              {[
                { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
                { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
                // Menggunakan logo GitHub putih terang agar jelas di background gelap
                { name: "GitHub", icon: "https://api.iconify.design/logos:github-icon.svg" },
                { name: "VS Code", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
                { name: "XAMPP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg" },
                { name: "Canva", icon: "https://www.vectorlogo.zone/logos/canva/canva-icon.svg" },
                { name: "Tailwind CSS", icon: "https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" },
                { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
                // Duplikasi untuk looping mulus
                { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
                { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
                { name: "GitHub", icon: "https://api.iconify.design/logos:github-icon.svg" },
                { name: "VS Code", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
                { name: "XAMPP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg" },
                { name: "Canva", icon: "https://www.vectorlogo.zone/logos/canva/canva-icon.svg" },
                { name: "Tailwind CSS", icon: "https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" },
                { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
              ].map((tech, idx) => (
                <div key={idx} className="flex items-center gap-3.5 bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/50 px-6 py-3.5 rounded-2xl shadow-xl transition-all">
                  <img src={tech.icon} alt={tech.name} className="w-7 h-7 object-contain drop-shadow" />
                  <span className="text-sm font-semibold text-slate-200 tracking-wide">{tech.name}</span>
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </section>

      {/* PORTFOLIO SECTION (DENGAN IMAGE & ANIMASI) */}
      <section id="portfolio" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-3">Portfolio</h2>
              <p className="text-slate-400 text-base">Project yang pernah saya kerjakan</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Bar Bar Es Duren",
                type: "Web App E-Commerce",
                desc: "Aplikasi web e-commerce berbasis Laravel lengkap dengan integrasi gateway pembayaran Midtrans.",
                tags: ["Laravel", "Midtrans", "MySQL"],
                badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
                image: "/es-duren.png",
                details: "Platform e-commerce kuliner untuk pemesanan es duren online. Dilengkapi keranjang belanja dinamis, admin panel, database relasional MySQL, dan integrasi Midtrans Payment Gateway."
              },
              {
                title: "PPDB SMK Telkom",
                type: "Web Application",
                desc: "Antarmuka web Penerimaan Peserta Didik Baru interaktif dengan formulir pendaftaran multi-step.",
                tags: ["HTML5", "Tailwind CSS", "JavaScript"],
                badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
                image: "/ppdb.png",
                details: "Sistem web PPDB online untuk pengalaman pendaftaran sekolah yang interaktif, user-friendly, dan responsif."
              },
              {
                title: "GDevelop Game",
                type: "Interactive Game",
                desc: "Game 2D seru dengan mekanika permainan interaktif, grafis kustom, dan sistem skoring.",
                tags: ["GDevelop Engine", "Game Design"],
                badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
                image: "/game.png",
                details: "Proyek pengembangan game 2D mandiri menggunakan GDevelop dengan kontrol mulus dan sistem skor tinggi."
              },
              {
                title: "Prime Atelier Hair Tonic",
                type: "Visual Branding",
                desc: "Perancangan identitas produk, kemasan box, cetak label stiker, dan konsep visual marketing.",
                tags: ["Figma", "Illustrator", "Branding"],
                badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
                image: null,
                details: "Karya desain grafis komprehensif mulai dari konsep logo, kemasan box produk, label botol, hingga materi promosi digital."
              }
            ].map((project, idx) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={reducedMotion ? undefined : { y: -8, scale: 1.01 }}
                whileTap={reducedMotion ? undefined : { scale: 0.985 }}
                onClick={() => setSelectedProject(project)}
                role="button"
                tabIndex={0}
                aria-label={'Lihat detail ' + project.title}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedProject(project);
                  }
                }}
                className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between group"
              >
                {/* CONTAINER GAMBAR PROJECT */}
                <div className="w-full h-48 bg-slate-950 overflow-hidden relative border-b border-slate-800">
                  <ProjectImage project={project} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border backdrop-blur-md ${project.badgeColor}`}>
                      {project.type}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-sm text-slate-400 mb-4 leading-relaxed">{project.desc}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-slate-800/50 border border-slate-700 rounded-md text-xs text-slate-300 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="lg:col-span-5 space-y-4">
            <h2 className="text-3xl font-bold text-white mb-3">Get in Touch</h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Punya ide proyek atau ingin bekerja sama? Silakan hubungi saya.
            </p>
            <div className="pt-2 text-sm text-slate-300 space-y-2">
              <p>Banyumas, Jawa Tengah, Indonesia</p>
              <p>adityanurarif9@gmail.com</p>
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-xl p-6 sm:p-8">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required name="name" aria-label="Nama Lengkap" type="text" placeholder="Nama Lengkap" className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-600 transition-all" />
                <input required name="email" aria-label="Alamat Email" type="email" placeholder="Alamat Email" className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-600 transition-all" />
              </div>
              <input required name="subject" aria-label="Subjek Pesan" type="text" placeholder="Subjek Pesan" className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-600 transition-all" />
              <textarea required name="message" aria-label="Pesan" rows="4" placeholder="Tuliskan pesan..." className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-600 resize-none transition-all"></textarea>

              {formStatus && (
                <div role="status" className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 text-sm text-center">
                  {formStatus}
                </div>
              )}

              <button type="submit" className="w-full py-3 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-all">
                Buka di Email
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-slate-950 border-t border-slate-900 text-center text-xs text-slate-500 relative z-10">
        <p>© 2026 Aditya Nur Arif. All rights reserved.</p>
      </footer>

      {/* MODAL / TAB DETAIL PROJECT */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: reducedMotion ? 0 : 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.97, opacity: 0, y: reducedMotion ? 0 : 10 }}
              transition={{ type: 'spring', stiffness: 310, damping: 28 }}
              role="dialog" aria-modal="true" aria-labelledby="project-dialog-title"
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button aria-label="Tutup detail proyek" onClick={() => setSelectedProject(null)} className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800/60 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                ✕
              </button>

              {/* GAMBAR DI MODAL */}
              <div className="w-full h-40 sm:h-52 bg-slate-950 rounded-2xl overflow-hidden mb-5 border border-slate-800">
                <ProjectImage key={selectedProject.title} project={selectedProject} className="w-full h-full object-cover" />
              </div>

              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold border mb-3 ${selectedProject.badgeColor}`}>
                {selectedProject.type}
              </span>
              <h3 id="project-dialog-title" className="text-2xl font-bold text-white mb-2">{selectedProject.title}</h3>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">{selectedProject.desc}</p>

              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 mb-4">
                <h4 className="text-xs font-bold uppercase text-cyan-400 mb-1">Detail Fitur:</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{selectedProject.details}</p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                {selectedProject.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-md text-xs text-cyan-300 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
    </MotionConfig>
  );
}
