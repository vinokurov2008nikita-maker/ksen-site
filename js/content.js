const PLACEHOLDER = 'images/placeholder.svg';

function img(src, alt = '') {
    return `<img src="${src || PLACEHOLDER}" alt="${alt}" loading="lazy" onerror="this.src='${PLACEHOLDER}'">`;
}

async function fetchContent() {
    try {
        const res = await fetch('/api/content');
        if (!res.ok) throw new Error('fetch failed');
        return await res.json();
    } catch {
        return null;
    }
}

function applySiteLinks(site) {
    document.querySelectorAll('[data-social]').forEach(el => {
        const key = el.dataset.social;
        if (site[key]) el.href = site[key];
    });
    document.querySelectorAll('.logo').forEach(el => {
        if (site.name) el.textContent = site.name;
    });
}

function collectionUrl(id) {
    return `collection.html?id=${id}`;
}

function renderHome(data) {
    const hero = data.hero;
    const col = data.collections.find(c => c.id === hero.buttonCollectionId) || data.collections[0];

    document.getElementById('hero-section').innerHTML = `
        <div class="hero-image">
            ${img(hero.image, hero.title)}
            <div class="hero-overlay">
                <h1>${hero.title}</h1>
                <p>${hero.subtitle}</p>
                <a href="${col ? collectionUrl(col.id) : '#'}" class="btn-hero">${hero.buttonText}</a>
            </div>
        </div>`;

    const lookbook = data.collections[0];
    const lookbookLink = document.querySelector('[data-lookbook]');
    if (lookbookLink && lookbook) lookbookLink.href = collectionUrl(lookbook.id);

    document.getElementById('collections-grid').innerHTML = data.collections.map((c, i) => `
        <a href="${collectionUrl(c.id)}" class="grid-col reveal${i === data.collections.length - 1 && data.collections.length % 2 === 1 ? ' grid-col-full' : ''}">
            <div class="grid-col-img">${img(c.cover, c.title)}</div>
            <div class="grid-col-info">
                <span class="grid-col-num">${c.number}</span>
                <h2>${c.title}</h2>
            </div>
        </a>`).join('');
}

function renderAbout(data) {
    const a = data.about;
    document.getElementById('about-content').innerHTML = `
        <section class="about-hero reveal">
            <h1>About</h1>
            <p class="lead">${a.lead}</p>
        </section>
        <section class="about-image reveal">
            ${img(a.image, 'KSEN studio')}
        </section>
        <section class="about-content">
            <div class="about-block reveal">
                <h2>Philosophy</h2>
                ${a.philosophy.map(p => `<p>${p}</p>`).join('')}
            </div>
            <div class="about-block reveal">
                <h2>Studio</h2>
                ${a.studio.map((p, i) => i === a.studio.length - 1
                    ? `<p>${p.replace('contact page', '<a href="contact.html" style="color:#1a1a1a;text-decoration:underline;">contact page</a>')}</p>`
                    : `<p>${p}</p>`).join('')}
            </div>
        </section>`;
}

function renderContact(data) {
    document.getElementById('contact-content').innerHTML = `
        <section class="contact-hero reveal">
            <h1>Contact</h1>
            <div class="contact-grid">
                <div class="contact-block">
                    <h2>General</h2>
                    <a href="mailto:${data.site.email}">${data.site.email}</a>
                </div>
                <div class="contact-block">
                    <h2>Press</h2>
                    <a href="mailto:${data.site.press}">${data.site.press}</a>
                </div>
                <div class="contact-block">
                    <h2>Follow</h2>
                    <div class="contact-socials">
                        <a href="${data.site.instagram}" data-social="instagram">Instagram</a>
                        <a href="${data.site.pinterest}" data-social="pinterest">Pinterest</a>
                    </div>
                </div>
            </div>
        </section>`;
}

function renderCollection(data, id) {
    const all = data.collections;
    const c = all.find(x => x.id === id);
    if (!c) {
        document.getElementById('collection-content').innerHTML =
            '<section class="collection-header"><p class="collection-desc">Collection not found.</p></section>';
        return;
    }

    document.title = `${c.code} — ${data.site.name}`;

    const idx = all.findIndex(x => x.id === id);
    const prev = all[(idx - 1 + all.length) % all.length];
    const next = all[(idx + 1) % all.length];

    const looks = (c.looks || []).map((src, i) =>
        `<div class="gallery-item">${img(src, `${c.code} Look ${String(i + 1).padStart(2, '0')}`)}</div>`
    ).join('');

    const videoBlock = c.video
        ? `<video autoplay muted loop playsinline poster="${c.poster || ''}"><source src="${c.video}" type="video/mp4"></video>`
        : '';

    document.getElementById('collection-content').innerHTML = `
        <section class="video-hero">
            <div class="video-placeholder">
                ${videoBlock}
                <img class="video-fallback" src="${c.poster || c.cover || PLACEHOLDER}" alt="${c.title}" onerror="this.src='${PLACEHOLDER}'">
                <div class="video-overlay"><span class="play-hint">▼ Scroll</span></div>
            </div>
        </section>
        ${c.credits ? `<section class="hero-credits"><p>${c.title} Collection — ${c.credits}</p></section>` : ''}
        <section class="collection-header">
            <div class="collection-intro reveal">
                <p class="collection-number">${c.number} — ${c.code}</p>
                <h1>${c.title}</h1>
                <p class="collection-desc">${c.description}</p>
            </div>
        </section>
        <section class="horizontal-gallery" id="gallery">
            <div class="gallery-track">${looks}</div>
        </section>
        <section class="collection-details">
            <button class="details-toggle" aria-expanded="false">More Details</button>
            <div class="details-panel">
                <div class="details-grid">
                    <div class="detail"><h3>Materials</h3><p>${c.details?.materials || ''}</p></div>
                    <div class="detail"><h3>Color Palette</h3><p>${c.details?.colors || ''}</p></div>
                    <div class="detail"><h3>Inspiration</h3><p>${c.details?.inspiration || ''}</p></div>
                </div>
            </div>
        </section>
        <nav class="collection-nav">
            <a href="${collectionUrl(prev.id)}">← ${prev.title}</a>
            <a href="${collectionUrl(next.id)}">${next.title} →</a>
        </nav>`;
}

document.addEventListener('DOMContentLoaded', async () => {
    const page = document.body.dataset.page;
    if (!page) return;

    const data = await fetchContent();
    if (!data) {
        const main = document.querySelector('main') || document.body;
        const notice = document.createElement('div');
        notice.style.cssText = 'padding:120px 48px;text-align:center;color:#666;font-size:14px;line-height:1.8';
        notice.innerHTML = 'Запусти сайт через сервер: <code style="background:#f5f4f2;padding:4px 8px">npm start</code><br>Затем открой <a href="http://localhost:3000">localhost:3000</a>';
        main.prepend(notice);
        return;
    }

    applySiteLinks(data.site);

    if (page === 'home') renderHome(data);
    if (page === 'about') renderAbout(data);
    if (page === 'contact') renderContact(data);
    if (page === 'collection') {
        const id = new URLSearchParams(location.search).get('id') || data.collections[0]?.id;
        renderCollection(data, id);
    }

    document.dispatchEvent(new CustomEvent('content:loaded'));
});
