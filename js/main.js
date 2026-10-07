/* akshthetics.jpg · Akash M portfolio */
(() => {
  'use strict';

  /* ── Contact settings ──────────────────────────────────────────────────
     Add Akash's email and/or WhatsApp number to switch on those buttons.
     whatsapp: digits only with country code, e.g. '919876543210'.        */
  const CONTACT = {
    instagram: 'akshthetics.jpg',
    email: '',
    whatsapp: '',
  };

  const IMG = 'assets/img/';

  /* ── Photo projects (Behance) ──────────────────────────────────────── */
  const PROJECTS = [
    {
      slug: 'ilaiyaraaja', title: 'Ilaiyaraaja', sub: '“Truly Live” in concert',
      tags: ['Concert', 'Photography'], meta: 'Live concert · Chennai',
      desc: 'Isaignani live with his orchestra. I worked the concert, photographing the maestro at his harmonium, the flute solos and the singers under warm stage light.',
      alts: [
        'Ilaiyaraaja at the harmonium under warm golden stage light',
        'Ilaiyaraaja at the harmonium in front of a blue LED wall',
        'Ilaiyaraaja singing in front of a wall of stage bulbs',
        'Flautist from the orchestra mid-solo',
        'Singer in a floral blazer performing at a music stand',
        'Ilaiyaraaja gesturing to the orchestra from the harmonium',
        'Singer with purple hair performing in front of an LED wall',
        'Ilaiyaraaja singing into the microphone',
        'Singer in an orange outfit performing at the mic stand',
      ],
    },
    {
      slug: 'sathyabama', title: 'Yuvan Concert', sub: 'at the Sathyabama wedding',
      tags: ['Celebrity event', 'Photography'], meta: 'Sathyabama family wedding · Chennai',
      desc: 'Yuvan Shankar Raja performing live at the Sathyabama family wedding: suits, a grand piano in stage haze, and Thalapathy Vijay among the guests.',
      alts: [
        'Yuvan Shankar Raja singing in a black suit and sunglasses',
        'Singer in a red racing jacket singing to the sky',
        'Singer in a pink gown smiling on stage',
        'Yuvan Shankar Raja at a grand piano in red stage haze',
        'Singer in a velvet blazer performing',
        'Guest greeting the crowd with folded hands',
        'Singer in a blue gown on stage',
        'Thalapathy Vijay with a guest at the wedding',
        'Performer in a red racing jacket and sunglasses',
        'Thalapathy Vijay waving to the crowd',
      ],
    },
    {
      slug: 'chinmayi', title: 'Chinmayi Live', sub: 'on the beach, in Chennai',
      tags: ['Concert', 'Photography', 'Reel'], meta: 'VGP Golden Beach Resort · Chennai',
      desc: 'Chinmayi’s first-ever solo concert in Chennai, on the open-air beach arena. Muththa Mazhai, the greatest hits and celebrity guests, Samantha Ruth Prabhu among them.',
      alts: [
        'Chinmayi singing on stage in a red outfit',
        'Samantha Ruth Prabhu in the audience, lit in red',
        'Singer in a floral shirt reaching out to the crowd',
        'Samantha Ruth Prabhu smiling in the crowd',
        'Chinmayi smiling on stage',
        'Guest singing on stage',
        'Samantha Ruth Prabhu laughing on stage',
        'Singer in a purple dress performing with eyes closed',
        'Singer speaking on stage',
        'Guest watching the concert',
      ],
    },
    {
      slug: 'recharge', title: 'HHT Concert', sub: 'Recharge 2024',
      tags: ['Concert', 'College fest'], meta: 'Rajalakshmi Engineering College · 21–23 Mar 2024',
      desc: 'Recharge 2024, REC’s three-day cultural fest. The HHT headline concert brought pyro, confetti cannons and light beams, and I covered the whole set.',
      alts: [
        'Performer under a storm of confetti',
        'Performer in a green shirt and white sunglasses under blue light beams',
        'Performer between columns of fire and smoke',
        'Performer dancing in confetti and light beams',
        'Close shot of the performer pointing to the crowd',
        'Black and white shot of the performer singing in smoke',
        'Performer in profile between two pyro flames',
        'Performer singing through smoke and confetti',
        'Grainy black and white close-up of the performer',
      ],
    },
    {
      slug: 'takshashila', title: 'Takshashila', sub: '2025 · Main event',
      tags: ['College fest', 'Event'], meta: 'Chennai Institute of Technology',
      desc: 'The grand annual cultural fiesta of Chennai Institute of Technology. I covered the main event: headline singers, smoke, lights and a packed crowd.',
      alts: [
        'Singer in sunglasses performing in purple haze',
        'Singer with fist raised under a blue spotlight',
        'Host smiling on stage with a microphone',
        'Singer performing under red stage lights',
        'Singer in a white tee performing in front of LED panels',
        'Performer in a white blazer dancing in smoke',
        'Singer looking up into the lights',
        'Singer in a silver gown smiling on stage',
        'Singer in a patterned shirt and round glasses',
        'Duet at the keyboard on stage',
        'Speaker on stage against a red backdrop',
      ],
    },
  ];
  const COUNTS = { ilaiyaraaja: 9, sathyabama: 10, chinmayi: 10, recharge: 9, takshashila: 11 };
  const src = (slug, n, thumb) => `${IMG}work/${slug}/${String(n).padStart(2, '0')}${thumb ? '-t' : ''}.webp`;

  /* ── Hero viewfinder slides (f = focus box position, % of frame) ───── */
  const SLIDES = [
    { slug: 'ilaiyaraaja', n: 1, cap: 'Ilaiyaraaja · Truly Live', f: [36, 23] },
    { slug: 'chinmayi', n: 2, cap: 'Samantha Ruth Prabhu · Chinmayi Live', f: [33, 18] },
    { slug: 'recharge', n: 1, cap: 'HHT Concert · Recharge 2024', f: [40, 26] },
    { slug: 'sathyabama', n: 1, cap: 'Yuvan Shankar Raja · Sathyabama wedding', f: [42, 17] },
    { slug: 'takshashila', n: 1, cap: 'Takshashila 2025 · CIT', f: [39, 23] },
    { slug: 'sathyabama', n: 2, cap: 'Live at the Sathyabama wedding', f: [59, 20] },
  ];

  /* ── Instagram reels & posts ───────────────────────────────────────── */
  const REELS = [
    { code: 'DW13wzqE5QZ', video: true, title: 'LIK Pre-Release', who: 'Nayanthara & Vignesh Shivan', role: 'Reel', likes: '3.27L' },
    { code: 'DM-yQx_Sh-y', video: true, title: 'Chinmayi Live', who: 'Samantha Ruth Prabhu at Chinmayi’s concert', role: 'Video & edit', likes: '1.2L' },
    { code: 'DX5_YI2kS4G', title: 'Thalapathy Vijay', who: 'Sathyabama family wedding', role: 'Photography', likes: '62.5K' },
    { code: 'DdEmubxowZx', title: 'SIGMA Pre-Launch', who: 'Mahendra College, Salem: Jason Sanjay’s first stage', role: 'Photo & video', likes: '36.4K' },
    { code: 'DdjvAEMo7b5', title: 'Paradise Press Meet', who: 'Nani · Taj Coromandel, Chennai', role: 'Photography', likes: '2.3K' },
    { code: 'Dc-URjlgjcK', video: true, title: 'Mandaadi Audio Launch', who: 'Soori · Chennai Trade Centre', role: 'Reel' },
    { code: 'Dc7sHPUAVJZ', video: true, title: 'Sardar 2 Audio Launch', who: 'Karthi', role: 'Reel' },
  ];
  const BTS = [
    { code: 'DV_pKqvDzqZ', cap: 'With Andrea Jeremiah', sub: 'Andrea live · videography' },
    { code: 'Dcvz6jxI1as', cap: 'With Soori', sub: 'Mandaadi audio launch' },
    { code: 'Dd66trnEl0T', cap: 'With Hip Hop Tamizha Adhi', sub: 'Meesaya Murukku 2 success meet' },
  ];

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ICON = {
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    expand: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>',
    cam: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.4"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6"/></svg>',
  };

  /* ── Header: scrolled state, active link, mobile menu ──────────────── */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const links = $$('.nav-links a');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['work', 'reels', 'services', 'about', 'credits', 'contact'].forEach((id) => spy.observe(document.getElementById(id)));

  const menuBtn = $('#menu-btn');
  const menu = $('#mobile-menu');
  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', open);
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));

  /* ── Hero viewfinder ───────────────────────────────────────────────── */
  const slidesEl = $('#vf-slides');
  const focus = $('#vf-focus');
  const bars = $('#vf-bars');
  const DUR = 4500;
  slidesEl.innerHTML = SLIDES.map((s, i) =>
    `<img src="${src(s.slug, s.n)}" alt="${s.cap}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async">`).join('');
  bars.innerHTML = SLIDES.map(() => '<i></i>').join('');
  bars.style.setProperty('--dur', DUR + 'ms');
  const imgs = $$('img', slidesEl);
  const barEls = $$('i', bars);
  let cur = -1;
  const show = (i) => {
    cur = i;
    imgs.forEach((im, k) => im.classList.toggle('on', k === i));
    barEls.forEach((b, k) => { b.className = k < i ? 'done' : ''; });
    void barEls[i].offsetWidth; // restart the bar animation
    if (!reduceMotion) barEls[i].className = 'on'; else barEls[i].className = 'done';
    const [x, y] = SLIDES[i].f;
    focus.style.left = x + '%';
    focus.style.top = y + '%';
    focus.classList.remove('lock'); void focus.offsetWidth; focus.classList.add('lock');
    $('#vf-idx').textContent = `${String(i + 1).padStart(2, '0')} / ${String(SLIDES.length).padStart(2, '0')}`;
    $('#vf-title').textContent = SLIDES[i].cap;
  };
  show(0);
  if (!reduceMotion) setInterval(() => { if (!document.hidden) show((cur + 1) % SLIDES.length); }, DUR);

  // running timecode (25 fps)
  const tc = $('#vf-tc');
  const t0 = performance.now();
  const pad = (n) => String(n).padStart(2, '0');
  const tick = () => {
    const t = (performance.now() - t0) / 1000;
    tc.textContent = `${pad(Math.floor(t / 3600))}:${pad(Math.floor(t / 60) % 60)}:${pad(Math.floor(t) % 60)}:${pad(Math.floor(t * 25) % 25)}`;
    if (!reduceMotion) requestAnimationFrame(tick);
  };
  tick();

  /* ── Projects ──────────────────────────────────────────────────────── */
  const projectsEl = $('#projects');
  projectsEl.innerHTML = PROJECTS.map((p, i) => {
    const n = COUNTS[p.slug];
    const thumbs = [2, 3, 4, 5].map((k, j) => {
      const more = j === 3 && n > 5 ? ` class="more" data-more="+${n - 4}"` : '';
      return `<button type="button"${more} data-open="${i}" data-at="${k - 1}" aria-label="Open photo ${k} of ${p.title}">
        <img src="${src(p.slug, k, true)}" alt="" loading="lazy" decoding="async"></button>`;
    }).join('');
    return `<article class="project" data-reveal>
      <button type="button" class="p-cover" data-open="${i}" data-at="0" aria-label="Open ${p.title} gallery, ${n} photos">
        <img src="${src(p.slug, 1)}" alt="${p.alts[0]}" loading="lazy" decoding="async">
        <span class="p-num">${String(i + 1).padStart(2, '0')}</span>
        <span class="vf-corner tl"></span><span class="vf-corner tr"></span><span class="vf-corner bl"></span><span class="vf-corner br"></span>
        <span class="p-count">${ICON.expand}${n} frames</span>
      </button>
      <div class="p-body">
        <div class="tags">${p.tags.map((t, k) => `<span class="tag${k ? '' : ' hot'}">${t}</span>`).join('')}</div>
        <h3 class="p-title">${p.title}<span class="p-sub">${p.sub}</span></h3>
        <p class="p-meta">${p.meta}</p>
        <p class="p-desc">${p.desc}</p>
        <div class="p-thumbs">${thumbs}</div>
        <button type="button" class="link-btn" data-open="${i}" data-at="0">Open gallery ${ICON.arrow}</button>
      </div>
    </article>`;
  }).join('');

  /* ── Lightbox ──────────────────────────────────────────────────────── */
  const lb = $('#lightbox');
  const lbImg = $('#lb-img');
  const lbThumbs = $('#lb-thumbs');
  let lbP = 0, lbI = 0, lastFocus = null;

  let lbToken = 0;
  const lbRender = () => {
    const p = PROJECTS[lbP];
    const n = COUNTS[p.slug];
    const token = ++lbToken;
    lbImg.classList.add('loading');
    const next = new Image();
    next.src = src(p.slug, lbI + 1);
    next.decode().catch(() => {}).then(() => {
      if (token !== lbToken) return; // a newer photo was requested meanwhile
      lbImg.src = next.src;
      lbImg.alt = p.alts[lbI] || p.title;
      lbImg.classList.remove('loading');
    });
    $('#lb-title').textContent = p.title;
    $('#lb-count').textContent = `${pad(lbI + 1)} / ${pad(n)}`;
    $('#lb-cap').textContent = p.alts[lbI] || '';
    $$('button', lbThumbs).forEach((b, k) => {
      b.classList.toggle('on', k === lbI);
      if (k === lbI) b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    // warm the neighbours
    [lbI + 1, lbI - 1].forEach((k) => { if (k >= 0 && k < n) new Image().src = src(p.slug, k + 1); });
  };
  const lbOpen = (pi, at) => {
    lastFocus = document.activeElement;
    lbP = pi; lbI = at;
    const p = PROJECTS[pi];
    lbThumbs.innerHTML = Array.from({ length: COUNTS[p.slug] }, (_, k) =>
      `<button type="button" data-k="${k}" aria-label="Photo ${k + 1}"><img src="${src(p.slug, k + 1, true)}" alt="" loading="lazy"></button>`).join('');
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lbRender();
    $('#lb-close').focus();
  };
  const lbClose = () => {
    lb.hidden = true;
    document.body.style.overflow = '';
    lastFocus && lastFocus.focus();
  };
  const lbStep = (d) => {
    const n = COUNTS[PROJECTS[lbP].slug];
    lbI = (lbI + d + n) % n;
    lbRender();
  };
  projectsEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-open]');
    if (b) lbOpen(+b.dataset.open, +b.dataset.at);
  });
  lbThumbs.addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (b) { lbI = +b.dataset.k; lbRender(); }
  });
  $('#lb-close').addEventListener('click', lbClose);
  $('#lb-prev').addEventListener('click', () => lbStep(-1));
  $('#lb-next').addEventListener('click', () => lbStep(1));
  lb.addEventListener('click', (e) => { if (e.target.classList.contains('lb-stage')) lbClose(); });
  let tx = null;
  lb.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 45) lbStep(dx < 0 ? 1 : -1);
    tx = null;
  });

  /* ── Reels rail + Instagram player ─────────────────────────────────── */
  const rail = $('#rail');
  rail.innerHTML = REELS.map((r) => `
    <button type="button" class="reel" data-ig="${r.code}" aria-label="Watch ${r.title}: ${r.who}">
      <img src="${IMG}ig/${r.code}.webp" alt="" loading="lazy" decoding="async">
      <span class="r-top">
        ${r.likes ? `<span class="r-chip">${ICON.heart}${r.likes}</span>` : '<span></span>'}
        <span class="r-chip ghost">${r.video ? 'Reel' : 'Post'}</span>
      </span>
      <span class="r-play${r.video ? '' : ' cam'}">${r.video ? ICON.play : ICON.cam}</span>
      <span class="r-body">
        <span class="r-role">${r.role}</span>
        <span class="r-title">${r.title}</span>
        <span class="r-who">${r.who}</span>
      </span>
    </button>`).join('') + `
    <a class="reel end" href="https://www.instagram.com/${CONTACT.instagram}/" target="_blank" rel="noopener">
      ${ICON.ig}
      <b>More on<br>Instagram</b>
      <span>@${CONTACT.instagram} ↗</span>
    </a>`;

  const step = () => (rail.querySelector('.reel')?.offsetWidth || 260) + 18;
  $('#rail-prev').addEventListener('click', () => rail.scrollBy({ left: -step() * 2, behavior: 'smooth' }));
  $('#rail-next').addEventListener('click', () => rail.scrollBy({ left: step() * 2, behavior: 'smooth' }));
  const railBtns = () => {
    $('#rail-prev').disabled = rail.scrollLeft < 8;
    $('#rail-next').disabled = rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8;
  };
  rail.addEventListener('scroll', railBtns, { passive: true });
  addEventListener('resize', railBtns);
  railBtns();

  $('#bts-row').innerHTML = BTS.map((b) => `
    <button type="button" class="polaroid" data-ig="${b.code}" aria-label="${b.cap}: open on Instagram" data-reveal>
      <span class="pi"><img src="${IMG}ig/${b.code}.webp" alt="Akash ${b.cap.toLowerCase()}" loading="lazy" decoding="async"></span>
      <span>${b.cap}</span><small>${b.sub}</small>
    </button>`).join('');

  const ig = $('#ig-modal');
  const igFrame = $('#ig-frame');
  const igOpen = (code) => {
    lastFocus = document.activeElement;
    igFrame.src = `https://www.instagram.com/p/${code}/embed/`;
    $('#ig-open').href = `https://www.instagram.com/p/${code}/`;
    ig.hidden = false;
    document.body.style.overflow = 'hidden';
    $('#ig-close').focus();
  };
  const igClose = () => {
    ig.hidden = true;
    igFrame.src = 'about:blank';
    document.body.style.overflow = '';
    lastFocus && lastFocus.focus();
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ig]');
    if (b) igOpen(b.dataset.ig);
  });
  $('#ig-close').addEventListener('click', igClose);
  ig.addEventListener('click', (e) => { if (e.target === ig) igClose(); });

  addEventListener('keydown', (e) => {
    if (!lb.hidden) {
      if (e.key === 'Escape') lbClose();
      if (e.key === 'ArrowRight') lbStep(1);
      if (e.key === 'ArrowLeft') lbStep(-1);
    } else if (!ig.hidden && e.key === 'Escape') igClose();
    else if (!menu.hidden && e.key === 'Escape') setMenu(false);
  });

  /* ── Booking brief ─────────────────────────────────────────────────── */
  const form = $('#brief');
  if (CONTACT.email) {
    $$('.cfg-email').forEach((el) => { el.hidden = false; });
    $('#email-link').href = `mailto:${CONTACT.email}`;
    $('#email-text').textContent = CONTACT.email;
  }
  if (CONTACT.whatsapp) $$('.cfg-wa').forEach((el) => { el.hidden = false; });

  const toast = (msg) => {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => t.classList.remove('show'), 3600);
  };
  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); return true; } catch (_) {
      const ta = Object.assign(document.createElement('textarea'), { value: text });
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.append(ta); ta.select();
      const ok = document.execCommand('copy'); ta.remove(); return ok;
    }
  };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const name = (d.get('name') || '').trim();
    const nameEl = $('#f-name');
    if (!name) {
      nameEl.classList.add('invalid'); nameEl.focus();
      toast('Add your name so Akash knows who’s asking.');
      return;
    }
    nameEl.classList.remove('invalid');
    const date = d.get('date')
      ? new Date(d.get('date') + 'T00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'TBC';
    const lines = [
      'Hi Akash! I’d like to book you for a shoot.',
      '',
      `Name: ${name}`,
      `Event: ${d.get('type')}`,
      `Date: ${date}`,
      `Venue / city: ${(d.get('city') || '').trim() || 'TBC'}`,
      `Need: ${d.getAll('need').join(', ') || 'Not sure yet'}`,
    ];
    const msg = (d.get('msg') || '').trim();
    if (msg) lines.push(`Details: ${msg}`);
    const brief = lines.join('\n');

    const via = e.submitter?.dataset.via || 'instagram';
    if (via === 'email') {
      location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent('Shoot enquiry: ' + d.get('type'))}&body=${encodeURIComponent(brief)}`;
      return;
    }
    if (via === 'whatsapp') {
      window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(brief)}`, '_blank', 'noopener');
      return;
    }
    const ok = await copy(brief);
    toast(ok ? 'Brief copied. Paste it into the Instagram DM.' : 'Opening Instagram. Copy your brief from the form.');
    setTimeout(() => window.open(`https://ig.me/m/${CONTACT.instagram}`, '_blank', 'noopener'), 650);
  });

  /* ── Reveal on scroll ──────────────────────────────────────────────── */
  const countUp = (el) => {
    const to = parseFloat(el.dataset.count);
    const dec = el.dataset.count.includes('.') ? 1 : 0;
    const t0c = performance.now();
    const run = (now) => {
      const k = Math.min(1, (now - t0c) / 1400);
      el.textContent = (to * (1 - Math.pow(1 - k, 3))).toFixed(dec) + el.dataset.suffix;
      if (k < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      const num = e.target.querySelector('[data-count]');
      if (num && !reduceMotion) countUp(num);
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  $$('[data-reveal]').forEach((el) => io.observe(el));
})();
