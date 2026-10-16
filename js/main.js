/* ============================================================
   作品集逻辑：渲染网格、分类筛选、大图查看
   一般情况下你不需要改这个文件。
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. 读取并规范化作品数据 ---------- */

  var raw = Array.isArray(window.WORKS) ? window.WORKS : [];

  var works = raw
    .filter(function (w) { return w && (w.src || w.cover || w.image); })
    .map(function (w, i) {
      var src = w.src || w.cover || w.image;
      return {
        id: w.id || 'work-' + (i + 1),
        title: w.title || '未命名作品',
        category: w.category || '未分类',
        year: w.year || '',
        src: src,
        full: w.full || src,
        ratio: w.ratio || '4 / 3',
        featured: !!w.featured,
        tags: Array.isArray(w.tags) ? w.tags : [],
        desc: w.desc || '',
        alt: w.alt || w.title || ''
      };
    });

  if (!works.length) {
    console.warn('[works] 没有读到任何作品，请检查 data/works.js');
  }

  /* ---------- 2. 分类按钮 ---------- */

  var categories = [];
  var forced = Array.isArray(window.CATEGORY_ORDER) ? window.CATEGORY_ORDER : [];
  forced.forEach(function (c) { if (categories.indexOf(c) === -1) categories.push(c); });
  works.forEach(function (w) {
    if (categories.indexOf(w.category) === -1) categories.push(w.category);
  });

  var counts = {};
  works.forEach(function (w) { counts[w.category] = (counts[w.category] || 0) + 1; });

  var filterEl = document.getElementById('filter');
  var gridEl = document.getElementById('grid');
  var emptyEl = document.getElementById('empty');

  var filterValues = ['全部'].concat(categories);
  var filterButtons = {};

  filterValues.forEach(function (value) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip';
    btn.setAttribute('aria-pressed', value === '全部' ? 'true' : 'false');

    var n = value === '全部' ? works.length : (counts[value] || 0);
    btn.innerHTML = '<span>' + esc(value) + '</span><span class="chip__n">' + n + '</span>';

    btn.addEventListener('click', function () { applyFilter(value); });
    filterEl.appendChild(btn);
    filterButtons[value] = btn;
  });

  /* ---------- 3. 渲染网格 ---------- */

  var cardEls = [];

  works.forEach(function (w, i) {
    var card = document.createElement('article');
    card.className = 'card' + (w.featured ? ' card--wide' : '');
    card.dataset.category = w.category;
    card.dataset.index = String(i);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'card__btn';
    btn.setAttribute('aria-label', '查看大图：' + w.title);

    var media = document.createElement('span');
    media.className = 'card__media';
    media.style.setProperty('--ar', w.ratio);

    var img = document.createElement('img');
    img.src = w.src;
    img.alt = w.alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.draggable = false;

    media.appendChild(img);

    var cap = document.createElement('span');
    cap.className = 'card__cap';
    cap.innerHTML =
      '<span class="card__title">' + esc(w.title) + '</span>' +
      '<span class="card__meta">' + esc(w.category) + (w.year ? ' · ' + esc(w.year) : '') + '</span>';

    btn.appendChild(media);
    btn.appendChild(cap);
    card.appendChild(btn);
    gridEl.appendChild(card);

    btn.addEventListener('click', function () { openLightbox(i); });
    cardEls.push(card);
  });

  document.getElementById('workCount').textContent = String(works.length);

  /* ---------- 4. 筛选 ---------- */

  var activeFilter = '全部';

  function applyFilter(value) {
    if (value === activeFilter) return;
    activeFilter = value;

    Object.keys(filterButtons).forEach(function (k) {
      filterButtons[k].setAttribute('aria-pressed', k === value ? 'true' : 'false');
    });

    var visible = 0;
    cardEls.forEach(function (card) {
      var match = value === '全部' || card.dataset.category === value;
      if (match) {
        card.classList.remove('is-hidden');
        card.style.setProperty('--d', Math.min(visible * 45, 420) + 'ms');
        // 重新触发入场动画
        card.style.animation = 'none';
        void card.offsetWidth;
        card.style.animation = '';
        visible++;
      } else {
        card.classList.add('is-hidden');
      }
    });

    emptyEl.hidden = visible > 0;
    window.__visibleWorks = visible;
  }

  /* ---------- 5. 大图查看 ---------- */

  var lb = document.getElementById('lightbox');
  var lbImage = document.getElementById('lbImage');
  var lbTitle = document.getElementById('lbTitle');
  var lbMeta = document.getElementById('lbMeta');
  var lbDesc = document.getElementById('lbDesc');
  var lbTags = document.getElementById('lbTags');
  var lbCounter = document.getElementById('lbCounter');
  var lbClose = document.getElementById('lbClose');

  var list = [];       // 当前可见的作品下标
  var pos = 0;         // 在 list 中的位置
  var isOpen = false;
  var lastFocus = null;
  var touchX = 0;

  function visibleIndices() {
    var out = [];
    cardEls.forEach(function (card) {
      if (!card.classList.contains('is-hidden')) out.push(Number(card.dataset.index));
    });
    return out;
  }

  function openLightbox(workIndex) {
    list = visibleIndices();
    pos = list.indexOf(workIndex);
    if (pos === -1) { list = [workIndex]; pos = 0; }

    lastFocus = document.activeElement;
    isOpen = true;
    lockScroll(true);
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    render();
    preload();
    lbClose.focus();
  }

  function closeLightbox() {
    isOpen = false;
    lockScroll(false);
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    lbImage.removeAttribute('src');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function step(dir) {
    if (!list.length) return;
    pos = (pos + dir + list.length) % list.length;
    render();
    preload();
  }

  function render() {
    var w = works[list[pos]];
    if (!w) return;

    lb.classList.add('is-loading');
    lbImage.onload = function () { lb.classList.remove('is-loading'); };
    lbImage.src = w.full;
    lbImage.alt = w.alt;

    lbTitle.textContent = w.title;
    lbMeta.textContent = [w.category, w.year].filter(Boolean).join(' · ');
    lbCounter.textContent = (pos + 1) + ' / ' + list.length;

    lbDesc.textContent = w.desc || '';
    lbDesc.hidden = !w.desc;

    lbTags.innerHTML = w.tags.map(function (t) {
      return '<li>' + esc(t) + '</li>';
    }).join('');
    lbTags.hidden = !w.tags.length;

    var many = list.length > 1;
    document.getElementById('lbPrev').hidden = !many;
    document.getElementById('lbNext').hidden = !many;
  }

  function preload() {
    [-1, 1].forEach(function (d) {
      var w = works[list[(pos + d + list.length) % list.length]];
      if (w) { var im = new Image(); im.src = w.full; }
    });
  }

  /* 滚动锁定（含滚动条宽度补偿，避免页面跳动） */
  function lockScroll(on) {
    if (on) {
      var gap = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = gap > 0 ? gap + 'px' : '';
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
      document.body.style.paddingRight = '';
    }
  }

  /* ---------- 6. 事件绑定 ---------- */

  lbClose.addEventListener('click', closeLightbox);
  document.getElementById('lbPrev').addEventListener('click', function () { step(-1); });
  document.getElementById('lbNext').addEventListener('click', function () { step(1); });

  lb.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-close') || e.target.closest('[data-close]')) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!isOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    else if (e.key === 'Tab') trapFocus(e);
  });

  /* 手机上左右滑动切换 */
  lb.addEventListener('touchstart', function (e) {
    touchX = e.changedTouches[0].clientX;
  }, { passive: true });

  lb.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  }, { passive: true });

  function trapFocus(e) {
    var focusables = lb.querySelectorAll('button:not([hidden])');
    if (!focusables.length) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* 顶栏滚动状态 */
  var header = document.getElementById('header');
  var onScroll = function () {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 导航高亮（滚动到哪一节就亮哪个） */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var sections = ['works', 'about', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* 页脚年份 */
  document.getElementById('year').textContent = String(new Date().getFullYear());

  /* 图片加载失败时的兜底提示 */
  gridEl.addEventListener('error', function (e) {
    var img = e.target;
    if (img && img.tagName === 'IMG') {
      img.closest('.card').classList.add('is-broken');
      console.warn('[works] 图片加载失败：' + img.getAttribute('src'));
    }
  }, true);

  /* ---------- 工具 ---------- */

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
})();
