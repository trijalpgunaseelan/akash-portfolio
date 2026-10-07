/* akshthetics.jpg · Akash M portfolio */
(() => {
  'use strict';

  /* ── Contact ───────────────────────────────────────────────────────── */
  const CONTACT = {
    instagram: 'akshthetics.jpg',
    email: 'ashthetics.jpg@gmail.com',
    whatsapp: '918939331561', // digits only, with country code
  };
  const waLink = (text) => `https://wa.me/${CONTACT.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

  const IMG = 'assets/img/';

  /* ── Photo projects (Behance) ──────────────────────────────────────── */
  const PROJECTS = [
    {
      slug: 'ilaiyaraaja', title: 'Ilaiyaraaja', sub: '“Truly Live” in concert',
      tags: ['Concert', 'Photography'], meta: 'Live concert · Chennai',
      desc: 'Isaignani live with his orchestra. Akash worked the concert, photographing the maestro at his harmonium, the flute solos and the singers under warm stage light.',
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
      tags: ['Concert', 'Photography', 'Reel'], meta: 'VGP Golden Beach Resort · 2 Aug 2025',
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
      desc: 'Recharge 2024, REC’s three-day cultural fest. The HHT headline concert brought pyro, confetti cannons and light beams, and Akash covered the whole set.',
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
      desc: 'The grand annual cultural fiesta of Chennai Institute of Technology, where Akash’s videography started. He covered the main event: headline singers, smoke, lights and a packed crowd.',
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

  /* Instagram categories shown on the site ('personal' stays hidden) */
  const CATS = {
    concert: 'Concerts', film: 'Film events', celebrity: 'Celebrity', portrait: 'Portraits & shoots',
    campus: 'Campus', brand: 'Brand content', creator: 'Creator',
  };
  const LABEL = { concert: 'Concert', film: 'Film event', celebrity: 'Celebrity', portrait: 'Portrait', campus: 'Campus', brand: 'Brand', creator: 'Creator' };
  const WORK = ['concert', 'film', 'celebrity', 'portrait', 'campus', 'brand'];
  const BTS = [
    { code: 'DV_pKqvDzqZ', cap: 'With Andrea Jeremiah', sub: 'Andrea live · videography' },
    { code: 'Dcvz6jxI1as', cap: 'With Soori', sub: 'Mandaadi audio launch' },
    { code: 'Dd66trnEl0T', cap: 'With Hip Hop Tamizha Adhi', sub: 'Meesaya Murukku 2 success meet' },
  ];

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ICON = {
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    expand: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>',
    cam: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.4"/></svg>',
    stack: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="7" width="13" height="13" rx="2"/><path d="M4 16V5a1 1 0 0 1 1-1h11"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6"/></svg>',
  };

  /* number formats: 326981 → 3.27L, 62555 → 62.5K */
  const fmtLikes = (n) => {
    if (n == null) return '';
    if (n >= 1e5) return `${(n / 1e5).toFixed(n >= 1e6 ? 1 : 2).replace(/\.?0+$/, '')}L`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(1).replace(/\.0$/, '')}K`;
    return String(n);
  };
  const fmtMonth = (iso) => new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  // posts that went up long after the event carry a curated year (null = unknown)
  const when = (p) => ('year' in p ? (p.year || '') : fmtMonth(p.takenAt));
  const isNew = (iso) => Date.now() - Date.parse(iso) < 21 * 864e5;

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
  ['work', 'latest', 'archive', 'services', 'about', 'creator', 'credits', 'contact']
    .forEach((id) => { const el = document.getElementById(id); if (el) spy.observe(el); });

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
    barEls[i].className = reduceMotion ? 'done' : 'on';
    const [x, y] = SLIDES[i].f;
    focus.style.left = x + '%';
    focus.style.top = y + '%';
    focus.classList.remove('lock'); void focus.offsetWidth; focus.classList.add('lock');
    $('#vf-idx').textContent = `${pad(i + 1)} / ${pad(SLIDES.length)}`;
    $('#vf-title').textContent = SLIDES[i].cap;
  };
  show(0);
  if (!reduceMotion) setInterval(() => { if (!document.hidden) show((cur + 1) % SLIDES.length); }, DUR);

  const tc = $('#vf-tc');
  const t0 = performance.now();
  const tick = () => {
    const t = (performance.now() - t0) / 1000;
    tc.textContent = `${pad(Math.floor(t / 3600))}:${pad(Math.floor(t / 60) % 60)}:${pad(Math.floor(t) % 60)}:${pad(Math.floor(t * 25) % 25)}`;
    if (!reduceMotion) requestAnimationFrame(tick);
  };
  tick();

  /* ── Lightbox (any set of images) ──────────────────────────────────── */
  const lb = $('#lightbox');
  const lbImg = $('#lb-img');
  const lbThumbs = $('#lb-thumbs');
  const lbIg = $('#lb-ig');
  let lbSet = null, lbI = 0, lbToken = 0, lastFocus = null;

  const lbRender = () => {
    const it = lbSet.items[lbI];
    const token = ++lbToken;
    lbImg.classList.add('loading');
    const next = new Image();
    next.src = it.src;
    next.decode().catch(() => {}).then(() => {
      if (token !== lbToken) return; // a newer photo was requested meanwhile
      lbImg.src = next.src;
      lbImg.alt = it.alt || lbSet.title;
      lbImg.classList.remove('loading');
    });
    $('#lb-title').textContent = lbSet.title;
    $('#lb-count').textContent = `${pad(lbI + 1)} / ${pad(lbSet.items.length)}`;
    $('#lb-cap').textContent = it.video ? `${lbSet.caption || ''}  ·  ▶ This one is a video. Watch it on Instagram.` : (lbSet.caption || it.alt || '');
    $$('button', lbThumbs).forEach((b, k) => {
      b.classList.toggle('on', k === lbI);
      if (k === lbI) b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    [lbI + 1, lbI - 1].forEach((k) => { if (lbSet.items[k]) new Image().src = lbSet.items[k].src; });
  };
  const lbOpen = (set, at = 0) => {
    lastFocus = document.activeElement;
    lbSet = set; lbI = at;
    lbThumbs.innerHTML = set.items.map((it, k) =>
      `<button type="button" data-k="${k}" aria-label="Photo ${k + 1}"><img src="${it.thumb}" alt="" loading="lazy"></button>`).join('');
    lbThumbs.hidden = set.items.length < 2;
    $('#lb-prev').hidden = $('#lb-next').hidden = set.items.length < 2;
    lbIg.hidden = !set.link;
    if (set.link) lbIg.href = set.link;
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
    const n = lbSet.items.length;
    lbI = (lbI + d + n) % n;
    lbRender();
  };
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
    if (tx === null || lbSet.items.length < 2) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 45) lbStep(dx < 0 ? 1 : -1);
    tx = null;
  });

  /* ── Behance projects ──────────────────────────────────────────────── */
  const projectSet = (p) => ({
    title: p.title,
    items: Array.from({ length: COUNTS[p.slug] }, (_, k) => ({ src: src(p.slug, k + 1), thumb: src(p.slug, k + 1, true), alt: p.alts[k] })),
  });
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
        <span class="p-num">${pad(i + 1)}</span>
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
  projectsEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-open]');
    if (b) lbOpen(projectSet(PROJECTS[+b.dataset.open]), +b.dataset.at);
  });

  /* ── Instagram player ──────────────────────────────────────────────── */
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
  $('#ig-close').addEventListener('click', igClose);
  ig.addEventListener('click', (e) => { if (e.target === ig) igClose(); });

  addEventListener('keydown', (e) => {
    if (!lb.hidden) {
      if (e.key === 'Escape') lbClose();
      if (e.key === 'ArrowRight' && lbSet.items.length > 1) lbStep(1);
      if (e.key === 'ArrowLeft' && lbSet.items.length > 1) lbStep(-1);
    } else if (!ig.hidden && e.key === 'Escape') igClose();
    else if (!menu.hidden && e.key === 'Escape') setMenu(false);
  });

  /* ── Rails (shared prev/next buttons) ──────────────────────────────── */
  $$('.rail-ctrl').forEach((ctrl) => {
    const rail = document.getElementById(ctrl.dataset.rail);
    const [prev, next] = $$('button', ctrl);
    const step = () => ((rail.querySelector('.reel')?.offsetWidth || 260) + 18) * 2;
    prev.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: 'smooth' }));
    const sync = () => {
      prev.disabled = rail.scrollLeft < 8;
      next.disabled = rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8;
    };
    rail.addEventListener('scroll', sync, { passive: true });
    addEventListener('resize', sync);
    rail._sync = sync;
    sync();
  });

  /* ── Instagram-driven sections ─────────────────────────────────────── */
  let POSTS = [];
  const byCode = new Map();
  const postSet = (p) => ({
    title: p.title,
    caption: [p.who, p.venue || p.location, when(p)].filter(Boolean).join(' · '),
    link: `https://www.instagram.com/p/${p.code}/`,
    items: p.media.map((m, k) => ({ src: m.src, thumb: m.thumb, video: m.video, alt: `${p.title}${p.who ? `, ${p.who}` : ''} (${k + 1} of ${p.media.length})` })),
  });
  const openPost = (code) => {
    const p = byCode.get(code);
    if (!p) return igOpen(code);
    if (p.type === 'reel') igOpen(code); else lbOpen(postSet(p));
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-post]');
    if (b) { e.preventDefault(); openPost(b.dataset.post); }
  });

  const badgeRow = (p) => `
    <span class="r-top">
      <span class="r-badges">
        ${isNew(p.takenAt) ? '<span class="r-chip new">New</span>' : ''}
        ${p.likes ? `<span class="r-chip">${ICON.heart}${fmtLikes(p.likes)}</span>` : ''}
      </span>
      <span class="r-chip ghost">${p.type === 'reel' ? 'Reel' : p.media.length > 1 ? `${ICON.stack}${p.media.length}` : 'Photo'}</span>
    </span>`;

  const reelCard = (p) => `
    <button type="button" class="reel" data-post="${p.code}" aria-label="${esc(p.title)}: ${esc(p.who || '')}${p.type === 'reel' ? ', watch reel' : ', open photos'}">
      <img src="${p.media[0].thumb}" alt="" loading="lazy" decoding="async">
      ${badgeRow(p)}
      <span class="r-play${p.type === 'reel' ? '' : ' cam'}">${p.type === 'reel' ? ICON.play : ICON.cam}</span>
      <span class="r-body">
        <span class="r-role">${esc(p.role || LABEL[p.category] || '')}</span>
        <span class="r-title">${esc(p.title)}</span>
        <span class="r-who">${esc(p.who || p.venue || p.location || when(p))}</span>
      </span>
    </button>`;
  const endCard = `
    <a class="reel end" href="https://www.instagram.com/${CONTACT.instagram}/" target="_blank" rel="noopener">
      ${ICON.ig}
      <b>More on<br>Instagram</b>
      <span>@${CONTACT.instagram} ↗</span>
    </a>`;

  const gridCard = (p) => `
    <button type="button" class="tile" data-post="${p.code}" aria-label="${esc(p.title)}${p.who ? `: ${esc(p.who)}` : ''}">
      <img src="${p.media[0].thumb}" alt="" loading="lazy" decoding="async">
      ${badgeRow(p)}
      ${p.type === 'reel' ? `<span class="t-play">${ICON.play}</span>` : ''}
      <span class="t-body">
        <span class="r-role">${esc([LABEL[p.category], when(p)].filter(Boolean).join(' · '))}</span>
        <span class="t-title">${esc(p.title)}</span>
        ${p.who || p.venue || p.location ? `<span class="r-who">${esc(p.who || p.venue || p.location)}</span>` : ''}
      </span>
    </button>`;

  const renderInstagram = (data, cur) => {
    const curPosts = cur.posts || {};
    POSTS = (data.posts || [])
      .map((p) => ({ ...p, ...(p.auto || {}), ...(curPosts[p.code] || {}) }))
      .filter((p) => p.category && p.category !== 'personal' && !p.hide && p.media?.length)
      .sort((a, b) => b.takenAt.localeCompare(a.takenAt));
    POSTS.forEach((p) => byCode.set(p.code, p));
    const work = POSTS.filter((p) => WORK.includes(p.category));

    // 02 · latest work posts
    $('#rail-latest').innerHTML = work.slice(0, 10).map(reelCard).join('') + endCard;
    if (data.updatedAt) {
      $('#synced').textContent = `Synced with Instagram ${new Date(data.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · ${data.posts.length} posts`;
    }

    // 03 · archive grid with filters
    const filters = $('#filters');
    const grid = $('#grid');
    const more = $('#grid-more');
    const counts = Object.fromEntries(WORK.map((c) => [c, work.filter((p) => p.category === c).length]));
    filters.innerHTML = [['all', 'All work', work.length], ...WORK.filter((c) => counts[c]).map((c) => [c, CATS[c], counts[c]])]
      .map(([key, label, n], i) => `<button type="button" role="tab" class="filter${i ? '' : ' on'}" data-cat="${key}" aria-selected="${!i}">${label}<small>${n}</small></button>`).join('');
    let cat = 'all', shown = 12;
    const drawGrid = () => {
      let list = cat === 'all'
        ? [...work.filter((p) => p.featured), ...work.filter((p) => !p.featured)]
        : work.filter((p) => p.category === cat);
      grid.innerHTML = list.slice(0, shown).map(gridCard).join('');
      more.hidden = list.length <= shown;
      more.textContent = `Show more (${list.length - shown})`;
    };
    filters.addEventListener('click', (e) => {
      const b = e.target.closest('[data-cat]');
      if (!b) return;
      cat = b.dataset.cat; shown = 12;
      $$('.filter', filters).forEach((f) => { f.classList.toggle('on', f === b); f.setAttribute('aria-selected', f === b); });
      drawGrid();
    });
    more.addEventListener('click', () => { shown += 12; drawGrid(); });
    drawGrid();

    // 06 · creator rail: featured first, then most liked
    const creator = POSTS.filter((p) => p.category === 'creator')
      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.likes || 0) - (a.likes || 0));
    $('#rail-creator').innerHTML = creator.slice(0, 12).map(reelCard).join('') + endCard;

    $$('.rail-ctrl').forEach((c) => document.getElementById(c.dataset.rail)._sync?.());

    // stats
    const liked = POSTS.filter((p) => p.likes);
    const top = liked.reduce((a, b) => (b.likes > (a?.likes || 0) ? b : a), null);
    const total = (data.posts || []).reduce((s, p) => s + (p.likes || 0), 0);
    const setStat = (id, value) => {
      const el = document.getElementById(id);
      if (!el || !value) return;
      const m = value.match(/^([\d.]+)(.*)$/);
      el.dataset.count = m ? m[1] : '';
      el.dataset.suffix = m ? m[2] : '';
      el.textContent = value;
    };
    if (top) {
      setStat('st-top', `${fmtLikes(top.likes)}+`);
      $('#st-top-l').textContent = `Likes on one ${top.type === 'reel' ? 'reel' : 'post'} · ${top.title}`;
      $('#proof-text').textContent = `${fmtLikes(top.likes).replace('L', ' lakh')} likes on a single ${top.type === 'reel' ? 'reel' : 'post'}`;
    }
    if (total) {
      setStat('st-total', `${fmtLikes(Math.floor(total / 1e4) * 1e4)}+`);
      $('#st-total-l').textContent = `Likes across ${data.posts.length} posts`;
    }

    // 07 · credits, grouped by event
    const groups = new Map();
    for (const p of work) {
      const ev = 'event' in p ? p.event : p.title;
      if (!ev) continue;
      const date = p.date || p.takenAt;
      const g = groups.get(ev) || { event: ev, roles: new Set(), venue: null, date, year: undefined };
      if (p.role) g.roles.add(p.role);
      g.venue = g.venue || p.venue || p.location || null;
      if (date > g.date) g.date = date;
      if ('year' in p) g.year = p.year; // curated: the post went up long after the event
      groups.set(ev, g);
    }
    const credits = [
      ...[...groups.values()].map((g) => ({ event: g.event, role: [...g.roles].join(' · '), venue: g.venue, date: g.date, year: g.year === undefined ? g.date.slice(0, 4) : g.year })),
      ...(cur.extraCredits || []).map((c) => ({ ...c, year: c.year ?? null })),
    ].sort((a, b) => b.date.localeCompare(a.date));
    const list = $('#credit-list');
    const creditsMore = $('#credits-more');
    let allCredits = false;
    const drawCredits = () => {
      list.innerHTML = credits.slice(0, allCredits ? credits.length : 12).map((c) => `
        <li><span class="c-ev">${esc(c.event)}</span><span class="c-role">${esc(c.role || '')}</span>
        <span class="c-where">${esc([c.venue, c.year].filter(Boolean).join(' · '))}</span></li>`).join('');
      creditsMore.hidden = allCredits || credits.length <= 12;
      creditsMore.textContent = `Show all ${credits.length} credits`;
    };
    creditsMore.addEventListener('click', () => { allCredits = true; drawCredits(); });
    drawCredits();
    setStat('st-events', `${credits.length}+`);

    // stars marquee (doubled for a seamless loop)
    if (cur.stars?.length) {
      const half = Math.ceil(cur.stars.length / 2);
      const fill = (el, names) => {
        el.innerHTML = names.map((n) => `<span>${esc(n)}</span>`).join('') +
          names.map((n) => `<span aria-hidden="true">${esc(n)}</span>`).join('');
      };
      fill($('#stars-a'), cur.stars.slice(0, half));
      fill($('#stars-b'), cur.stars.slice(half));
    }
  };

  // BTS polaroids use the first frame of those posts
  $('#bts-row').innerHTML = BTS.map((b) => `
    <button type="button" class="polaroid" data-post="${b.code}" aria-label="${b.cap}: open photos" data-reveal>
      <span class="pi"><img src="${IMG}ig/${b.code}/1-t.webp" alt="Akash ${b.cap.toLowerCase()}" loading="lazy" decoding="async"></span>
      <span>${b.cap}</span><small>${b.sub}</small>
    </button>`).join('');

  const fail = () => {
    $('#rail-latest').innerHTML = endCard;
    $('#rail-creator').innerHTML = endCard;
    $('#grid').innerHTML = `<p class="grid-empty">The archive loads from Instagram data. <a href="https://www.instagram.com/${CONTACT.instagram}/" target="_blank" rel="noopener">See every post on Instagram ↗</a></p>`;
  };
  Promise.all([
    fetch('data/instagram.json', { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
    fetch('data/curation.json', { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : {})).catch(() => ({})),
  ]).then(([data, cur]) => renderInstagram(data, cur)).catch(fail).finally(observeReveals);

  /* ── Booking brief ─────────────────────────────────────────────────── */
  const form = $('#brief');
  const toast = (msg) => {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => t.classList.remove('show'), 3800);
  };
  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); return true; } catch (_) {
      const ta = Object.assign(document.createElement('textarea'), { value: text });
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.append(ta); ta.select();
      const ok = document.execCommand('copy'); ta.remove(); return ok;
    }
  };
  const go = (url) => { const w = window.open(url, '_blank', 'noopener'); if (!w) location.href = url; };

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

    const via = e.submitter?.dataset.via || 'whatsapp';
    if (via === 'whatsapp') {
      go(waLink(brief));
      toast('Opening WhatsApp with your brief. Just press send.');
    } else if (via === 'email') {
      location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent('Shoot enquiry: ' + d.get('type'))}&body=${encodeURIComponent(brief)}`;
    } else {
      const ok = await copy(brief);
      toast(ok ? 'Brief copied. Paste it into the Instagram DM.' : 'Opening Instagram. Copy your brief from the form.');
      go(`https://ig.me/m/${CONTACT.instagram}`);
    }
  });

  // floating WhatsApp: shows after the hero, hides at the contact section
  const fab = $('#wa-fab');
  fab.href = waLink('Hi Akash! I saw your portfolio and I’d like to book a shoot.');
  let pastHero = false, atContact = false;
  const fabSync = () => fab.classList.toggle('show', pastHero && !atContact);
  new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; fabSync(); }).observe($('.hero'));
  new IntersectionObserver(([e]) => { atContact = e.isIntersecting; fabSync(); }, { threshold: .15 }).observe($('#contact'));

  /* ── Reveal on scroll ──────────────────────────────────────────────── */
  const countUp = (el) => {
    if (!parseFloat(el.dataset.count)) return;
    const t0c = performance.now();
    const run = (now) => {
      const k = Math.min(1, (now - t0c) / 1400);
      const to = parseFloat(el.dataset.count); // may change when Instagram data arrives
      const dec = (el.dataset.count.split('.')[1] || '').length;
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
  function observeReveals() { $$('[data-reveal]:not(.in)').forEach((el) => io.observe(el)); }
  observeReveals();
})();
