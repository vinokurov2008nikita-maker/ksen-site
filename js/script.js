// ── Mobile Menu ──
const toggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (toggle) {
    toggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// ── Scroll Nav ──
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 80) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// ── Reveal Animations ──
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Gallery (image click) ──
function initGalleries() {
document.querySelectorAll('.gallery-section').forEach(section => {
    section.querySelectorAll('.gallery-img').forEach(img => {
        img.addEventListener('click', () => {
            const src = img.getAttribute('src');
            if (!src) return;
            const ov = document.createElement('div');
            ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
            const full = document.createElement('img');
            full.src = src;
            full.style.cssText = 'max-width:95vw;max-height:95vh;object-fit:contain;';
            ov.appendChild(full);
            ov.addEventListener('click', () => ov.remove());
            document.body.appendChild(ov);
        });
    });
});
}

// ── Collections & Products Data ──
const DEFAULT_COLLECTIONS = [
    { id: 0, name: "June", video: "" },
    { id: 1, name: "July", video: "" },
    { id: 2, name: "August", video: "" },
    { id: 3, name: "0'9", video: "" },
    { id: 4, name: "1'0", video: "images/cellection2.mp4" }
];

const DEFAULT_PRODUCTS = [
    { id: 0, image: "images/june.jpg", look: "Look 01", name: "Wool Tailored Blazer", desc: "Single-breasted blazer cut from Italian virgin wool. Structured shoulders with a softened waist.", materials: "100% Virgin Wool, Horn Buttons, Cupro lining", model: "Anna, 178 cm", fit: "True to size", height: 600, size: "small", collectionId: 0 },
    { id: 1, image: "images/gallery-3.jpg", look: "Look 02", name: "Organic Cotton Shirt", desc: "Oversized button-down in organic cotton poplin. Extended cuffs, hidden placket.", materials: "100% Organic Cotton, Mother-of-Pearl Buttons", model: "Maria, 174 cm", fit: "Oversized fit", height: 600, size: "small", collectionId: 0 },
    { id: 2, image: "images/gallery-3.jpg", look: "Look 03", name: "Silk Drape Dress", desc: "Floor-length dress in liquid silk crepe. Asymmetric neckline with a single draped sleeve.", materials: "100% Silk Crepe, Silk Organza trim", model: "Sofia, 176 cm", fit: "True to size", height: 600, size: "small", collectionId: 1 },
    { id: 3, image: "images/July.jpg", look: "Look 04", name: "Linen Wide Trousers", desc: "High-waisted wide-leg trousers in linen blend. Pleated front with side pockets.", materials: "70% Linen, 30% Cotton, Cotton waistband", model: "Anna, 178 cm", fit: "True to size. High-waisted cut", height: 600, size: "small", collectionId: 1 },
    { id: 4, image: "images/July (2).jpg", look: "Look 05", name: "Slate Double-Breasted Jacket", desc: "Double-breasted jacket in heavy wool crepe. Notched lapel, flap pockets.", materials: "100% Wool Crepe, Viscose lining", model: "Maria, 174 cm", fit: "Tailored fit", height: 600, size: "small", collectionId: 2 },
    { id: 5, image: "images/june.jpg", look: "Look 06", name: "Ivory Silk Blouse", desc: "Relaxed blouse in ivory silk charmeuse. Deep V-neck with a self-tie front closure.", materials: "100% Silk Charmeuse, Shell Buttons", model: "Sofia, 176 cm", fit: "Relaxed fit", height: 600, size: "small", collectionId: 2 },
    { id: 6, image: "images/june.jpg", look: "Look 07", name: "June Look", desc: "Light summer silhouette in soft ivory.", materials: "100% Linen", model: "—", fit: "Relaxed fit", height: 600, size: "small", collectionId: 0 },
    { id: 7, image: "images/July.jpg", look: "Look 08", name: "Dark Silhouette", desc: "Bold black and red composition.", materials: "100% Wool", model: "—", fit: "Tailored fit", height: 600, size: "small", collectionId: 4 },
    { id: 8, image: "images/July (2).jpg", look: "Look 09", name: "Pink Door Frame", desc: "Soft silhouette with architectural detail.", materials: "100% Linen", model: "—", fit: "Relaxed fit", height: 600, size: "small", collectionId: 3 }
];

function getCollections() {
    const stored = localStorage.getItem('ksen_collections');
    if (stored) { try { return JSON.parse(stored); } catch(e) {} }
    return DEFAULT_COLLECTIONS;
}

function saveCollections(cols) {
    localStorage.setItem('ksen_collections', JSON.stringify(cols));
}

function getProducts() {
    const stored = localStorage.getItem('ksen_products');
    if (stored) { try { return JSON.parse(stored); } catch(e) {} }
    return DEFAULT_PRODUCTS;
}

function saveProducts(products) {
    localStorage.setItem('ksen_products', JSON.stringify(products));
}

// ── Visit Counter ──
const counterEl = document.getElementById('visit-counter');
if (counterEl) {
    let count = localStorage.getItem('ksen_visit_count') || 0;
    count = parseInt(count) + 1;
    localStorage.setItem('ksen_visit_count', count);
    counterEl.textContent = count;
}

// ── Dynamic Gallery Renderer ──
function renderCollections() {
    const container = document.getElementById('collections-container');
    const nav = document.getElementById('collectionNav');
    if (!container) return;
    const collections = getCollections();
    const products = getProducts();
    const cols = [...collections].sort((a, b) => a.id - b.id);
    container.innerHTML = '';
    const navHtml = [];
    cols.forEach(col => {
        const items = products.filter(p => p.collectionId === col.id);
        if (!items.length) return;
        if (col.video) {
            const vidSec = document.createElement('section');
            vidSec.className = col.id === 4 ? 'video-break video-break-lg' : 'video-break';
            vidSec.innerHTML = `<video class="full-video" autoplay muted loop playsinline poster="images/hero.jpg"><source src="${col.video}" type="video/mp4"></video>
                <div class="video-collection-title"><span>${col.name}</span></div>`;
            container.appendChild(vidSec);
        }
        const sec = document.createElement('section');
        sec.className = 'gallery-section';
        sec.id = `col-${col.id}`;
        sec.innerHTML = `<h2 class="collection-right-title">${col.name}</h2>
            <div class="gallery-grid">
                ${items.map(p => {
                    const idx = products.indexOf(p);
                    const size = p.size || 'small';
                    const h = p.height || 600;
                    const cls = size !== 'small' ? ' gallery-item size-' + size : ' gallery-item';
                    return `<div class="${cls}" data-product="${idx}">
                        <img src="${p.image}" class="gallery-img" style="height: ${h}px;">
                    </div>`;
                }).join('')}
            </div>`;
        container.appendChild(sec);
        navHtml.push(`<a href="#col-${col.id}" onclick="event.preventDefault();document.getElementById('col-${col.id}').scrollIntoView({behavior:'smooth'});return false;">${col.name}</a>`);
    });
    if (nav) nav.innerHTML = navHtml.join('');
    initGalleries();
    if (window.location.hash) {
        const hash = window.location.hash.slice(1);
        setTimeout(() => {
            const el = document.getElementById(hash);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
                const links = nav ? nav.querySelectorAll('a') : [];
                links.forEach(a => { if (a.getAttribute('href') === '#' + hash) a.classList.add('active'); });
            }
        }, 300);
    }
}

// Init galleries on index page (static), render on collection page (dynamic)
if (document.getElementById('collections-container')) {
    const id = new URLSearchParams(location.search).get('id');
    if (id) {
        const col = getCollections().find(c => c.id === parseInt(id));
        const heroTitle = document.getElementById('heroTitle');
        if (col && heroTitle) heroTitle.textContent = col.name;
    }
    renderCollections();
} else {
    initGalleries();
}

// ── Parallax Hero ──
const hero = document.querySelector('.hero-image');
if (hero && window.innerWidth > 768) {
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const img = hero.querySelector('.hero-placeholder');
        if (img) {
            img.style.transform = `scale(1.05) translate(${x * 10}px, ${y * 10}px)`;
        }
    });

    hero.addEventListener('mouseleave', () => {
        const img = hero.querySelector('.hero-placeholder');
        if (img) {
            img.style.transform = 'scale(1) translate(0, 0)';
        }
    });
}
