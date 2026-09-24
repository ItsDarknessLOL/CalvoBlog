/* Interacciones progresivas para El Apunte. Sin dependencias externas. */
(() => {
  const articles = window.EL_APUNTE_ARTICLES || [];
  const escape = value => String(value).replace(/[&<>'"]/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" })[char]);
  const prefix = window.location.pathname.includes('/tutoriales/') ? '../' : '';
  const header = document.querySelector('header.nav');
  if (header) {
    header.innerHTML = `<a class="nav__logo" href="${prefix}index.html">Calvo<span>Blog</span></a><button class="nav__toggle" type="button" aria-label="Abrir menú" aria-expanded="false" data-menu-button>Menú</button><nav class="nav__links" aria-label="Navegación principal" data-menu><a href="${prefix}tutoriales.html">Tutoriales</a><a href="${prefix}recursos.html">Recursos</a><a href="${prefix}buscar.html">Buscar</a><a href="${prefix}index.html#autor">Sobre el proyecto</a></nav><a href="${prefix}index.html#suscribete" class="btn btn--small">Colabora</a>`;
  }
  document.title = document.title.replace('El Apunte', 'Calvo Blog');
  const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let textNode;
  while ((textNode = textWalker.nextNode())) textNode.nodeValue = textNode.nodeValue.replaceAll('El Apunte', 'Calvo Blog');
  document.querySelectorAll('.footer__big').forEach(element => element.textContent = 'Calvo Blog');
  document.querySelectorAll('.footer__row span').forEach(element => element.textContent = element.textContent.replace('El Apunte', 'Calvo Blog'));

  const card = item => {
    const href = `articulo.html?slug=${encodeURIComponent(item.slug)}`;
    return `
    <a id="${escape(item.slug)}" href="${href}" class="card" data-cat="${escape(item.cat)}">
      <div class="card__meta"><span class="card__cat">${escape(item.catLabel)}</span><span>${escape(item.minutes)} min</span></div>
      <h3 class="card__title">${escape(item.title)}</h3>
      <p class="card__excerpt">${escape(item.excerpt)}</p>
      <span class="card__detail">${escape(item.level)} · ${escape(item.date)}</span>
    </a>`;
  };

  document.querySelectorAll('[data-article-grid]').forEach(grid => {
    const limit = Number(grid.dataset.limit) || articles.length;
    grid.innerHTML = articles.slice(0, limit).map(card).join('');
  });
  document.querySelectorAll('.filter__btn').forEach(button => button.addEventListener('click', () => {
    const scope = button.closest('section, main') || document;
    scope.querySelectorAll('.filter__btn').forEach(item => item.classList.remove('is-active'));
    button.classList.add('is-active');
    const selected = button.dataset.filter;
    scope.querySelectorAll('.card').forEach(item => item.hidden = selected !== 'todos' && item.dataset.cat !== selected);
  }));

  const searchForm = document.querySelector('[data-search-form]');
  searchForm?.addEventListener('submit', event => {
    event.preventDefault();
    const term = new FormData(searchForm).get('q').trim();
    window.location.href = `buscar.html?q=${encodeURIComponent(term)}`;
  });
  const searchInput = document.querySelector('[data-search-input]');
  const results = document.querySelector('[data-search-results]');
  const resultLabel = document.querySelector('[data-search-label]');
  const renderResults = query => {
    if (!results) return;
    const normalized = query.toLocaleLowerCase('es');
    const found = normalized ? articles.filter(item => [item.title, item.excerpt, item.catLabel, item.type, item.level].join(' ').toLocaleLowerCase('es').includes(normalized)) : [];
    resultLabel.textContent = normalized ? `${found.length} resultado${found.length === 1 ? '' : 's'} para “${query}”` : 'Escribe una búsqueda para explorar el contenido.';
    results.innerHTML = found.length ? found.map(card).join('') : normalized ? '<div class="empty-state"><h2>No encontramos coincidencias.</h2><p>Prueba con “Python”, “Git”, “servidores” o “PostgreSQL”.</p></div>' : '';
  };
  if (searchInput && results) {
    const initial = new URLSearchParams(window.location.search).get('q') || '';
    searchInput.value = initial; renderResults(initial);
    searchInput.addEventListener('input', () => renderResults(searchInput.value.trim()));
  }

  const articlePage = document.querySelector('[data-article-page]');
  if (articlePage) {
    const slug = new URLSearchParams(window.location.search).get('slug');
    const item = articles.find(article => article.slug === slug);
    if (!item) {
      articlePage.innerHTML = '<div class="empty-state"><h1>Este contenido no existe.</h1><p>Puede que el enlace haya cambiado o que el artículo todavía no esté publicado.</p><a class="btn" href="tutoriales.html">Explorar tutoriales</a></div>';
    } else {
      document.title = `${item.title} — Calvo Blog`;
      articlePage.innerHTML = `<nav class="breadcrumbs" aria-label="Migas de pan"><a href="index.html">Inicio</a><span>/</span><a href="tutoriales.html">Tutoriales</a><span>/</span><a href="tutoriales.html#${escape(item.slug)}">${escape(item.catLabel)}</a></nav><p class="eyebrow">${escape(item.type)} · ${escape(item.catLabel)}</p><h1>${escape(item.title)}</h1><p class="article__deck">${escape(item.excerpt)}</p><dl class="article-meta"><div><dt>Nivel</dt><dd>${escape(item.level)}</dd></div><div><dt>Lectura</dt><dd>${escape(item.minutes)} minutos</dd></div><div><dt>Publicado</dt><dd>${escape(item.date)}</dd></div></dl><div class="callout callout--note"><strong>En preparación</strong><p>Esta ficha ya tiene una URL estable. El contenido completo, imágenes WebP, fragmentos de código y recursos relacionados se añadirán desde la fuente editorial, sin duplicar plantillas HTML.</p></div><section class="related"><p class="eyebrow">Explora mientras tanto</p><a href="tutoriales.html">Ver todos los tutoriales →</a></section>`;
    }
  }

  const menuButton = document.querySelector('[data-menu-button]');
  const menu = document.querySelector('[data-menu]');
  const closeMenu = () => { menu?.classList.remove('is-open'); menuButton?.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); };
  menuButton?.addEventListener('click', () => { const open = menu?.classList.toggle('is-open'); menuButton.setAttribute('aria-expanded', String(open)); document.body.classList.toggle('menu-open', open); });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  const observer = 'IntersectionObserver' in window && new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
  document.querySelectorAll('[data-reveal]').forEach(element => observer ? observer.observe(element) : element.classList.add('is-visible'));
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => nav?.classList.toggle('is-scrolled', window.scrollY > 40), { passive: true });

  document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    const code = button.closest('.code-block')?.querySelector('code')?.innerText;
    if (!code) return;
    try { await navigator.clipboard.writeText(code); button.textContent = 'Copiado'; setTimeout(() => button.textContent = 'Copiar', 1800); } catch { button.textContent = 'Selecciona el código'; }
  }));
})();
