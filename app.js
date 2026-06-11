const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const sideNav = document.getElementById('sideNav');
const closeSideNav = document.getElementById('closeSideNav');
const navOverlay = document.getElementById('navOverlay');
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

function setMobileNav(open) {
  if (!sideNav || !navOverlay || !menuToggle) return;
  sideNav.classList.toggle('open', open);
  navOverlay.classList.toggle('show', open);
  document.body.classList.toggle('nav-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.textContent = open ? '✕' : '☰';
}

if (menuToggle && sideNav && closeSideNav && navOverlay) {
  menuToggle.addEventListener('click', () => setMobileNav(!sideNav.classList.contains('open')));
  closeSideNav.addEventListener('click', () => setMobileNav(false));
  navOverlay.addEventListener('click', () => setMobileNav(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMobileNav(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) setMobileNav(false);
  });
}

if (themeToggle) {
  const stored = localStorage.getItem('al-dine-theme');
  if (stored === 'dark') document.documentElement.classList.add('dark');
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('al-dine-theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    themeToggle.textContent = document.documentElement.classList.contains('dark') ? '☀️ الوضع النهاري' : '🌙 الوضع الليلي';
  });
  themeToggle.textContent = document.documentElement.classList.contains('dark') ? '☀️ الوضع النهاري' : '🌙 الوضع الليلي';
}

function renderHadiths() {
  const grid = document.getElementById('hadithGrid');
  const filterGroup = document.getElementById('filterGroup');
  if (!grid || !filterGroup) return;

  fetch('data/hadiths.json')
    .then((res) => res.json())
    .then((data) => {
      const categories = ['الكل', ...new Set(data.items.map((item) => item.category))];
      filterGroup.innerHTML = categories.map((cat) => `<button class="pill ${cat === 'الكل' ? 'active' : ''}" data-filter="${cat}">${cat}</button>`).join('');

      const render = (selected = 'الكل') => {
        const items = selected === 'الكل' ? data.items : data.items.filter((item) => item.category === selected);
        grid.innerHTML = items.map((item) => `
          <article class="item-card">
            <span class="badge">${item.category}</span>
            <h3>${item.title}</h3>
            <p>${item.text}</p>
            <p class="lede">المصدر: ${item.source} — ${item.reference}</p>
            <a class="text-link" href="${item.sourceUrl}" target="_blank" rel="noopener">المصدر</a>
          </article>
        `).join('');
      };

      render();
      filterGroup.querySelectorAll('.pill').forEach((btn) => {
        btn.addEventListener('click', () => {
          filterGroup.querySelectorAll('.pill').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          render(btn.dataset.filter);
        });
      });
    })
    .catch(() => {
      grid.innerHTML = '<article class="item-card">تعذر تحميل الأحاديث الحالية.</article>';
    });
}

function renderQuestions() {
  const grid = document.getElementById('questionsGrid');
  if (!grid) return;
  fetch('data/questions.json')
    .then((res) => res.json())
    .then((data) => {
      grid.innerHTML = data.items.map((item) => `
        <article class="item-card">
          <span class="badge">${item.category}</span>
          <h3>${item.question}</h3>
          <p>${item.answer}</p>
          <p class="lede">${item.tags.join(' • ')}</p>
        </article>
      `).join('');
    });
}

function renderNawafil() {
  const grid = document.getElementById('nawafilGrid');
  if (!grid) return;
  fetch('data/nawafil.json')
    .then((res) => res.json())
    .then((data) => {
      grid.innerHTML = data.items.map((item) => `
        <article class="item-card">
          <span class="badge">${item.name}</span>
          <h3>${item.time}</h3>
          <p>${item.howToPerform}</p>
          <p class="lede">السور المقترحة: ${item.recommendedSurahs.join(' • ')}</p>
          <p>${item.benefit}</p>
        </article>
      `).join('');
    });
}

function renderQuran() {
  const grid = document.getElementById('quranGrid');
  if (!grid) return;
  fetch('data/quran-ward.json')
    .then((res) => res.json())
    .then((data) => {
      const daily = data.dailySelections.map((item) => `<article class="item-card"><span class="badge">${item.title}</span><h3>${item.description}</h3><p>${item.surahs.join(' • ')}</p></article>`).join('');
      const juz = data.juz.map((item) => `<article class="item-card"><span class="badge">${item.label}</span><h3>${item.mood}</h3><p>${item.range}</p></article>`).join('');
      const surahs = data.surahs.map((item) => `<article class="item-card"><span class="badge">${item.name}</span><h3>${item.theme}</h3><p>${item.recommendedFor}</p></article>`).join('');
      grid.innerHTML = daily + juz + surahs;
    });
}

function renderDhikr() {
  const grid = document.getElementById('dhikrGrid');
  const filterGroup = document.getElementById('dhikrFilterGroup');
  if (!grid || !filterGroup) return;

  fetch('data/dhikr.json')
    .then((res) => res.json())
    .then((data) => {
      const categories = ['الكل', ...new Set(data.items.map((item) => item.category))];
      filterGroup.innerHTML = categories.map((cat) => `<button class="pill ${cat === 'الكل' ? 'active' : ''}" data-filter="${cat}">${cat}</button>`).join('');

      const render = (selected = 'الكل') => {
        const items = selected === 'الكل' ? data.items : data.items.filter((item) => item.category === selected);
        grid.innerHTML = items.map((item) => `
          <article class="item-card">
            <span class="badge">${item.category}</span>
            <h3>${item.title}</h3>
            <p>${item.text}</p>
            <p class="lede">${item.note}</p>
            <div class="counter-row">
              <span class="counter-chip">العدّاد: <strong id="count-${item.id}">0</strong> / ${item.repeat}</span>
              <button class="counter-btn" data-id="${item.id}" type="button">+1</button>
            </div>
          </article>
        `).join('');

        grid.querySelectorAll('.counter-btn').forEach((btn) => {
          btn.addEventListener('click', () => {
            const id = Number(btn.dataset.id);
            const chip = document.getElementById(`count-${id}`);
            const current = Number(chip.textContent || 0);
            const max = data.items.find((item) => item.id === id)?.repeat || 1;
            if (current < max) {
              chip.textContent = String(current + 1);
            }
          });
        });
      };

      render();
      filterGroup.querySelectorAll('.pill').forEach((btn) => {
        btn.addEventListener('click', () => {
          filterGroup.querySelectorAll('.pill').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          render(btn.dataset.filter);
        });
      });
    });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form || !note) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    note.textContent = `شكرًا ${data.get('name')}، تم استلام رسالتك بنجاح. سنعاود التواصل على ${data.get('email')}.`;
    form.reset();
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch((error) => {
      console.warn('Service Worker registration failed:', error);
    });
  });
}

renderHadiths();
renderQuestions();
renderNawafil();
renderQuran();
renderDhikr();
initContactForm();
