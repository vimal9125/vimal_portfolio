document.addEventListener('DOMContentLoaded', () => {

  /* ============ SCROLL PROGRESS ============ */
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress(){
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const height = h.scrollHeight - h.clientHeight;
    scrollProgress.style.width = (height > 0 ? (scrolled / height) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* ============ BACKGROUND PARALLAX ============ */
  const bgFixed = document.querySelector('.bg-fixed');
  window.addEventListener('mousemove', (e) => {
    const px = (e.clientX / window.innerWidth - 0.5) * 2;
    const py = (e.clientY / window.innerHeight - 0.5) * 2;
    bgFixed.style.transform = `translate(${px * 14}px, ${py * 14}px)`;
  });

  /* ============ NAV PILL ============ */
  const navPill = document.getElementById('navPill');
  function moveNavPill(link){
    if (!link || window.innerWidth <= 720){ navPill.style.opacity = '0'; return; }
    const li = link.parentElement;
    const ul = li.parentElement;
    const ulRect = ul.getBoundingClientRect();
    const liRect = li.getBoundingClientRect();
    navPill.style.left = (liRect.left - ulRect.left) + 'px';
    navPill.style.width = liRect.width + 'px';
    navPill.style.opacity = '1';
  }

  /* ============ LOADER ============ */
  const loader = document.getElementById('loader');
  const loaderFill = document.getElementById('loaderFill');
  let progress = 0;
  const loadTimer = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) { progress = 100; clearInterval(loadTimer); }
    loaderFill.style.width = progress + '%';
  }, 120);

  window.addEventListener('load', () => {
    setTimeout(() => {
      loaderFill.style.width = '100%';
      setTimeout(() => {
        loader.classList.add('hide');
        runHeroSequence();
      }, 350);
    }, 500);
  });
  // fallback in case load event already fired
  setTimeout(() => { if (!loader.classList.contains('hide')) { loader.classList.add('hide'); runHeroSequence(); } }, 3000);

  /* ============ HERO ENTRANCE SEQUENCE ============ */
  function runHeroSequence(){
    const line = document.getElementById('heroLine');
    const words = document.querySelectorAll('.hero-name .word');
    const role = document.getElementById('heroRole');
    const typeEl = document.getElementById('heroType');
    const stats = document.getElementById('heroStats');
    const cta = document.getElementById('heroCta');
    const cue = document.getElementById('scrollCue');

    line.style.transition = 'height .6s var(--ease)';
    requestAnimationFrame(() => { line.style.height = '64px'; });

    words.forEach((w, i) => {
      setTimeout(() => {
        w.style.transition = 'opacity .8s var(--ease), transform .8s var(--ease)';
        w.style.opacity = '1';
        w.style.transform = 'translateY(0)';
      }, 500 + i * 180);
    });

    setTimeout(() => {
      role.style.transition = 'opacity .7s var(--ease), transform .7s var(--ease)';
      role.style.opacity = '1';
      role.style.transform = 'translateY(0)';
    }, 1100);

    setTimeout(() => {
      typeEl.style.transition = 'opacity .3s';
      typeEl.style.opacity = '1';
      typewrite();
    }, 1700);

    setTimeout(() => {
      stats.style.transition = 'opacity .7s var(--ease), transform .7s var(--ease)';
      stats.style.opacity = '1';
      stats.style.transform = 'translateY(0)';
      animateCounters(stats.querySelectorAll('.hs-num'));
    }, 3200);

    setTimeout(() => {
      cta.style.transition = 'opacity .7s var(--ease), transform .7s var(--ease)';
      cta.style.opacity = '1';
      cta.style.transform = 'translateY(0)';
      cue.style.transition = 'opacity .6s';
      cue.style.opacity = '1';
    }, 3600);
  }

  function typewrite(){
    const el = document.getElementById('typeText');
    const phrases = [
      'Data Analyst • Machine Learning • Business Intelligence',
      'Python • SQL • Power BI',
      'Turning Raw Data Into Business Decisions'
    ];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion){
      el.textContent = phrases[0];
      return;
    }
    let phraseIdx = 0;
    const typeSpeed = 35;
    const deleteSpeed = 20;
    const holdTime = 1900;

    function typePhrase(){
      const text = phrases[phraseIdx];
      let i = 0;
      (function step(){
        if (i <= text.length){
          el.textContent = text.slice(0, i);
          i++;
          setTimeout(step, typeSpeed);
        } else {
          setTimeout(deletePhrase, holdTime);
        }
      })();
    }

    function deletePhrase(){
      const text = phrases[phraseIdx];
      let i = text.length;
      (function step(){
        if (i >= 0){
          el.textContent = text.slice(0, i);
          i--;
          setTimeout(step, deleteSpeed);
        } else {
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(typePhrase, 300);
        }
      })();
    }

    typePhrase();
  }

  /* ============ COUNTERS ============ */
  function animateCounters(nodes){
    nodes.forEach(node => {
      if (node.dataset.done) return;
      node.dataset.done = '1';
      const target = parseInt(node.dataset.target, 10);
      const suffix = node.dataset.suffix || '';
      const dur = 1400;
      const start = performance.now();
      function tick(now){
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        node.textContent = Math.floor(eased * target).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  /* ============ SCROLL REVEAL ============ */
  const revealEls = document.querySelectorAll('.reveal, .reveal-pop, .reveal-left, .reveal-right, .reveal-zoom, .reveal-flip');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        const counters = entry.target.querySelectorAll('.counter-num');
        if (counters.length) animateCounters(counters);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ============ NAVBAR SCROLL STATE + ACTIVE LINK ============ */
  const navbar = document.getElementById('navbar');
  const navLinksEls = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    document.getElementById('backTop').style.opacity = window.scrollY > 600 ? '1' : '0.5';
  });

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const id = entry.target.getAttribute('id');
        navLinksEls.forEach(a => a.classList.toggle('active', a.dataset.nav === id));
        const activeLink = document.querySelector('.nav-links a.active');
        moveNavPill(activeLink);
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => navObserver.observe(s));

  window.addEventListener('resize', () => {
    moveNavPill(document.querySelector('.nav-links a.active'));
  });
  setTimeout(() => moveNavPill(document.querySelector('.nav-links a.active')), 600);

  /* ============ MOBILE MENU ============ */
  const burger = document.getElementById('navBurger');
  const navLinksWrap = document.getElementById('navLinks');
  burger.addEventListener('click', () => navLinksWrap.classList.toggle('open'));
  navLinksEls.forEach(a => a.addEventListener('click', () => navLinksWrap.classList.remove('open')));

  /* ============ CURSOR GLOW ============ */
  const cursorGlow = document.getElementById('cursorGlow');
  window.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });

  /* ============ GRID CANVAS BACKGROUND ============ */
  const canvas = document.getElementById('grid-canvas');
  const ctx = canvas.getContext('2d');
  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const particles = Array.from({length: 46}, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15,
    r: Math.random() * 1.4 + 0.4
  }));

  function drawGrid(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gap = 64;
    ctx.strokeStyle = 'rgba(255,255,255,0.035)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += gap){
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gap){
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(59,130,246,0.5)';
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(drawGrid);
  }
  drawGrid();

  /* ============ PROJECT CASE-STUDY ACCORDIONS ============ */
  document.querySelectorAll('.pc-accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const key = trigger.dataset.accordion;
      const panel = document.getElementById('panel-' + key);
      const isOpen = trigger.classList.contains('open');
      trigger.classList.toggle('open', !isOpen);
      if (panel) panel.classList.toggle('open', !isOpen);
    });
  });

  /* ============ GITHUB LIVE STATS ============ */
  const GH_USERNAME = 'vimal9125';
  const heatmap = document.getElementById('heatmap');
  const ghHeatStatus = document.getElementById('ghHeatStatus');
  const ghLangStatus = document.getElementById('ghLangStatus');
  const langBar = document.getElementById('langBar');
  const langLegend = document.getElementById('langLegend');
  const ghRepoCount = document.getElementById('ghRepoCount');
  const ghFollowers = document.getElementById('ghFollowers');

  function renderFallbackHeatmap(){
    heatmap.innerHTML = '';
    for (let i = 0; i < 130; i++){
      const cell = document.createElement('span');
      const intensity = Math.random();
      if (intensity > 0.85) cell.style.background = 'var(--accent-2)';
      else if (intensity > 0.65) cell.style.background = 'rgba(34,211,238,0.55)';
      else if (intensity > 0.45) cell.style.background = 'rgba(59,130,246,0.4)';
      heatmap.appendChild(cell);
    }
    if (ghHeatStatus){ ghHeatStatus.textContent = 'sample'; ghHeatStatus.classList.add('offline'); }
  }

  const LANG_COLORS = {
    Python: '#3b82f6', SQL: '#22d3ee', Jupyter: '#f97316', 'Jupyter Notebook': '#f97316',
    JavaScript: '#eab308', HTML: '#f87171', CSS: '#818cf8', R: '#60a5fa', Other: '#475569'
  };

  async function loadGithubStats(){
    // Profile: repo count + followers
    try {
      const profRes = await fetch(`https://api.github.com/users/${GH_USERNAME}`);
      if (!profRes.ok) throw new Error('profile fetch failed');
      const profile = await profRes.json();
      ghRepoCount.textContent = profile.public_repos ?? '—';
      ghFollowers.textContent = profile.followers ?? '—';
    } catch (e) {
      ghRepoCount.textContent = '—';
      ghFollowers.textContent = '—';
    }

    // Languages across public repos
    try {
      const reposRes = await fetch(`https://api.github.com/users/${GH_USERNAME}/repos?per_page=100`);
      if (!reposRes.ok) throw new Error('repos fetch failed');
      const repos = await reposRes.json();
      const counts = {};
      repos.forEach(r => {
        if (!r.language) return;
        counts[r.language] = (counts[r.language] || 0) + 1;
      });
      const total = Object.values(counts).reduce((a,b) => a+b, 0);
      if (total === 0) throw new Error('no language data');

      let entries = Object.entries(counts).sort((a,b) => b[1]-a[1]);
      const top = entries.slice(0, 3);
      const otherCount = entries.slice(3).reduce((sum, [,c]) => sum + c, 0);
      if (otherCount > 0) top.push(['Other', otherCount]);

      langBar.innerHTML = top.map(([lang, count]) => {
        const pct = ((count/total)*100).toFixed(0);
        const color = LANG_COLORS[lang] || '#94a3b8';
        return `<span class="lang-seg" style="width:${pct}%;background:${color}" title="${lang} ${pct}%"></span>`;
      }).join('');
      langLegend.innerHTML = top.map(([lang]) => {
        const color = LANG_COLORS[lang] || '#94a3b8';
        return `<span><i style="background:${color}"></i>${lang}</span>`;
      }).join('');
      if (ghLangStatus) ghLangStatus.textContent = 'live';
    } catch (e) {
      if (ghLangStatus){ ghLangStatus.textContent = 'sample'; ghLangStatus.classList.add('offline'); }
    }

    // Contribution heatmap (community API, unofficial — falls back gracefully)
    try {
      const heatRes = await fetch(`https://github-contributions-api.jogruber.de/v4/${GH_USERNAME}?y=last`);
      if (!heatRes.ok) throw new Error('heatmap fetch failed');
      const data = await heatRes.json();
      const days = (data.contributions || []).slice(-130);
      if (!days.length) throw new Error('no contribution data');
      heatmap.innerHTML = '';
      days.forEach(d => {
        const cell = document.createElement('span');
        const lvl = d.level ?? 0;
        const opacityMap = ['rgba(255,255,255,0.05)', 'rgba(59,130,246,0.35)', 'rgba(59,130,246,0.6)', 'rgba(34,211,238,0.75)', 'var(--accent-2)'];
        cell.style.background = opacityMap[lvl] || opacityMap[0];
        cell.title = `${d.date}: ${d.count} contributions`;
        heatmap.appendChild(cell);
      });
      if (ghHeatStatus) ghHeatStatus.textContent = 'live';
    } catch (e) {
      renderFallbackHeatmap();
    }
  }

  loadGithubStats();

  /* Resume buttons now link directly to resume.pdf — no placeholder needed */

  /* ============ CERTIFICATE GALLERY ============ */
  const certData = [{"title": "AI & Data Scientist", "file": "certificates/ai-and-data-scientist-certificate.pdf", "thumb": "cert-thumbs/ai-and-data-scientist-certificate.png", "type": "pdf", "category": "AI & ML"}, {"title": "Data Analyst", "file": "certificates/data-analyst-certificate.pdf", "thumb": "cert-thumbs/data-analyst-certificate.png", "type": "pdf", "category": "Data Viz & BI"}, {"title": "Deloitte Job Simulation", "file": "certificates/delliote.pdf", "thumb": "cert-thumbs/delliote.png", "type": "pdf", "category": "Other"}, {"title": "TATA \u2014 Data Visualization (Forage)", "file": "certificates/forage-tata.pdf", "thumb": "cert-thumbs/forage-tata.png", "type": "pdf", "category": "Data Viz & BI"}, {"title": "Gen AI \u2014 BCGx (Forage)", "file": "certificates/genai.pdf", "thumb": "cert-thumbs/genai.png", "type": "pdf", "category": "AI & ML"}, {"title": "IBM \u2014 Data Science", "file": "certificates/ibm-ds.pdf", "thumb": "cert-thumbs/ibm-ds.png", "type": "pdf", "category": "IBM"}, {"title": "IBM \u2014 Data Science & AI (Final Certification)", "file": "certificates/ibm-final-certification.pdf", "thumb": "cert-thumbs/ibm-final-certification.png", "type": "pdf", "category": "IBM"}, {"title": "IBM SkillsBuild", "file": "certificates/ibm-skillbuild.pdf", "thumb": "cert-thumbs/ibm-skillbuild.png", "type": "pdf", "category": "IBM"}, {"title": "IBM \u2014 watsonx Orchestrate", "file": "certificates/ibm-watsonx.pdf", "thumb": "cert-thumbs/ibm-watsonx.png", "type": "pdf", "category": "IBM"}, {"title": "IBM Cognos Analytics \u2014 Reporting Essentials", "file": "certificates/ibm-cognos-analytics-v11-1-x-reporting-essentials-badge20250128-26-1sgi9e.pdf", "thumb": "cert-thumbs/ibm-cognos-analytics-v11-1-x-reporting-essentials-badge20250128-26-1sgi9e.png", "type": "pdf", "category": "IBM"}, {"title": "Microsoft Certification", "file": "certificates/microsoft.pdf", "thumb": "cert-thumbs/microsoft.png", "type": "pdf", "category": "Other"}, {"title": "Power BI \u2014 PwC", "file": "certificates/power-bi.pdf", "thumb": "cert-thumbs/power-bi.png", "type": "pdf", "category": "Data Viz & BI"}, {"title": "Power BI Basics", "file": "certificates/power-bi-basics.png", "thumb": "cert-thumbs/power-bi-basics.png", "type": "image", "category": "Data Viz & BI"}, {"title": "SQL Certificate", "file": "certificates/sql-certificate.pdf", "thumb": "cert-thumbs/sql-certificate.png", "type": "pdf", "category": "Data Viz & BI"}, {"title": "AWS API Gateway", "file": "certificates/amazon-api-gateaway-certificate.pdf", "thumb": "cert-thumbs/amazon-api-gateaway-certificate.png", "type": "pdf", "category": "Other"}, {"title": "Artificial Intelligence Certificate", "file": "certificates/certificate-ai.pdf", "thumb": "cert-thumbs/certificate-ai.png", "type": "pdf", "category": "AI & ML"}, {"title": "Data Science Certificate", "file": "certificates/certificate-ds.pdf", "thumb": "cert-thumbs/certificate-ds.png", "type": "pdf", "category": "AI & ML"}, {"title": "IBM Cognos Analytics Badge", "file": "certificates/ibm-cognos-analytics-v11-1-x-reporting-essentials.png", "thumb": "cert-thumbs/ibm-cognos-analytics-v11-1-x-reporting-essentials.png", "type": "image", "category": "IBM"}, {"title": "IBM watsonx Orchestrate Badge", "file": "certificates/ibm-watsonx-orchestrate-build-an-ai-assistant.png", "thumb": "cert-thumbs/ibm-watsonx-orchestrate-build-an-ai-assistant.png", "type": "image", "category": "IBM"}, {"title": "Machine Learning for Data Science Projects", "file": "certificates/machine-learning-for-data-science-projects-1.png", "thumb": "cert-thumbs/machine-learning-for-data-science-projects-1.png", "type": "image", "category": "AI & ML"}, {"title": "Academic Transcript", "file": "certificates/transcript.pdf", "thumb": "cert-thumbs/transcript.png", "type": "pdf", "category": "Other"}];

  const certOverlay = document.getElementById('certOverlay');
  const certGallery = document.getElementById('certGallery');
  const certViewerOverlay = document.getElementById('certViewerOverlay');
  const certViewerBody = document.getElementById('certViewerBody');
  const certViewerTitle = document.getElementById('certViewerTitle');
  const certDownloadLink = document.getElementById('certDownloadLink');
  const certFilterBtns = document.querySelectorAll('.cert-filter-btn');
  let activeFilter = 'All';

  function buildCertGallery(){
    const filtered = activeFilter === 'All' ? certData : certData.filter(c => c.category === activeFilter);
    const indices = filtered.map(c => certData.indexOf(c));
    certGallery.innerHTML = filtered.map((c, i) => `
      <div class="cert-thumb-card" data-index="${indices[i]}" style="animation-delay:${Math.min(i * 0.035, 0.6)}s">
        <div class="cert-thumb-img-wrap"><img src="${c.thumb}" alt="${c.title}" loading="lazy"></div>
        <div class="cert-thumb-name">${c.title}</div>
      </div>
    `).join('');
    certGallery.querySelectorAll('.cert-thumb-card').forEach(card => {
      card.addEventListener('click', () => openCertViewer(certData[parseInt(card.dataset.index, 10)]));
    });
  }

  certFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      certFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      buildCertGallery();
    });
  });

  function openCertViewer(c){
    certViewerTitle.textContent = c.title;
    certDownloadLink.href = c.file;
    if (c.type === 'pdf'){
      certViewerBody.innerHTML = `<iframe src="${c.file}"></iframe>`;
    } else {
      certViewerBody.innerHTML = `<img src="${c.file}" alt="${c.title}">`;
    }
    certViewerOverlay.classList.add('open');
  }

  document.getElementById('viewAllCertsBtn').addEventListener('click', () => {
    activeFilter = 'All';
    certFilterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === 'All'));
    buildCertGallery();
    certOverlay.classList.add('open');
  });
  document.getElementById('certModalClose').addEventListener('click', () => certOverlay.classList.remove('open'));
  certOverlay.addEventListener('click', (e) => { if (e.target === certOverlay) certOverlay.classList.remove('open'); });

  document.getElementById('certViewerClose').addEventListener('click', () => {
    certViewerOverlay.classList.remove('open');
    certViewerBody.innerHTML = '';
  });
  certViewerOverlay.addEventListener('click', (e) => {
    if (e.target === certViewerOverlay){
      certViewerOverlay.classList.remove('open');
      certViewerBody.innerHTML = '';
    }
  });

  /* ============ SPOTLIGHT HOVER ============ */
  const spotlightEls = document.querySelectorAll('.spotlight');
  spotlightEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });

  /* ============ 3D MAGNETIC TILT ============ */
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (!isTouch){
    document.querySelectorAll('.tilt').forEach(el => {
      let ticking = false;
      let lastEvent = null;
      el.addEventListener('mousemove', (e) => {
        lastEvent = e;
        if (!ticking){
          ticking = true;
          requestAnimationFrame(() => {
            const r = el.getBoundingClientRect();
            const px = (lastEvent.clientX - r.left) / r.width - 0.5;
            const py = (lastEvent.clientY - r.top) / r.height - 0.5;
            el.style.transform = `perspective(800px) rotateX(${(-py * 9).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg) translateY(-6px)`;
            ticking = false;
          });
        }
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ============ INTERACTIVE WORKFLOW PIPELINE ============ */
  const pipeSteps = document.querySelectorAll('.pipe-step');
  const pipeDetailNum = document.getElementById('pipeDetailNum');
  const pipeDetailText = document.getElementById('pipeDetailText');
  pipeSteps.forEach(step => {
    step.addEventListener('click', () => {
      const stepNum = parseInt(step.dataset.step, 10);
      pipeSteps.forEach(s => {
        const n = parseInt(s.dataset.step, 10);
        s.classList.toggle('active', n === stepNum);
        s.classList.toggle('done', n < stepNum);
      });
      pipeDetailText.style.opacity = '0';
      setTimeout(() => {
        pipeDetailNum.textContent = step.querySelector('.pipe-num').textContent;
        pipeDetailText.textContent = step.dataset.detail;
        pipeDetailText.style.opacity = '1';
      }, 180);
    });
  });

  /* ============ FLIP CARDS: percentage count-up + touch tap support ============ */
  function animateProfPercents(card){
    if (card.dataset.profAnimated) return;
    card.dataset.profAnimated = '1';
    card.querySelectorAll('.prof-pct').forEach(el => {
      const target = parseInt(el.dataset.pct, 10);
      const dur = 1000;
      const start = performance.now();
      function tick(now){
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.floor(p * target) + '%';
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target + '%';
      }
      requestAnimationFrame(tick);
    });
  }

  document.querySelectorAll('.flip-card').forEach(card => {
    if (isTouch){
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
        if (card.classList.contains('flipped')) animateProfPercents(card);
      });
    } else {
      card.addEventListener('mouseenter', () => animateProfPercents(card));
    }
  });

  /* ============ COPY TO CLIPBOARD (email / phone) ============ */
  function showToast(msg){
    let toast = document.getElementById('copyToast');
    if (!toast){
      toast = document.createElement('div');
      toast.id = 'copyToast';
      toast.className = 'copy-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 2000);
  }

  document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const value = link.href.startsWith('mailto:') ? link.href.replace('mailto:', '') : link.href.replace('tel:', '');
      if (navigator.clipboard){
        navigator.clipboard.writeText(value).then(() => showToast('Copied: ' + value)).catch(() => {});
      }
      // let default mailto/tel behavior still happen
    });
  });

  /* ============ BACK TO TOP ============ */
  document.getElementById('backTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
