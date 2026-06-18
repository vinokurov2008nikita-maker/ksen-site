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
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Horizontal Gallery Drag & Arrow ──
function smoothScrollTo(el, targetX, duration) {
    const start = el.scrollLeft;
    const distance = targetX - start;
    const startTime = performance.now();
    function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.scrollLeft = start + distance * ease;
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

function initGalleries() {
document.querySelectorAll('.gallery-section').forEach(section => {
    const track = section.querySelector('.gallery-track');
    const galleryScroll = section.querySelector('.horizontal-gallery');
    if (!track || !galleryScroll) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    track.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - track.offsetLeft;
        scrollLeft = galleryScroll.scrollLeft;
        track.style.cursor = 'grabbing';
    });

    track.addEventListener('mouseleave', () => {
        isDown = false;
        track.style.cursor = 'grab';
    });

    track.addEventListener('mouseup', () => {
        isDown = false;
        track.style.cursor = 'grab';
    });

    track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.5;
        galleryScroll.scrollLeft = scrollLeft - walk;
    });

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - track.offsetLeft;
        scrollLeft = galleryScroll.scrollLeft;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX - track.offsetLeft;
        const walk = (x - startX) * 1.5;
        galleryScroll.scrollLeft = scrollLeft - walk;
    }, { passive: true });

    const leftBtn = section.querySelector('.gallery-arrow-left');
    const rightBtn = section.querySelector('.gallery-arrow-right');

    function scrollGallery(dir) {
        const item = track.querySelector('.gallery-item');
        if (!item) return;
        const itemWidth = item.offsetWidth;
        const gap = 16;
        const scrollAmount = itemWidth + gap;
        const targetX = galleryScroll.scrollLeft + dir * scrollAmount;
        smoothScrollTo(galleryScroll, targetX, 500);
    }

    if (leftBtn) leftBtn.addEventListener('click', () => scrollGallery(-1));
    if (rightBtn) rightBtn.addEventListener('click', () => scrollGallery(1));
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
    if (!localStorage.getItem('ksen_loaded')) {
        localStorage.setItem('ksen_loaded', '1');
        saveCollections(DEFAULT_COLLECTIONS);
    }
    return DEFAULT_COLLECTIONS;
}

function saveCollections(cols) {
    localStorage.setItem('ksen_collections', JSON.stringify(cols));
}

function getProducts() {
    const stored = localStorage.getItem('ksen_products');
    if (stored) { try { return JSON.parse(stored); } catch(e) {} }
    if (!localStorage.getItem('ksen_loaded')) {
        localStorage.setItem('ksen_loaded', '1');
        saveProducts(DEFAULT_PRODUCTS);
    }
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
        if (col.id === 4) {
            const spacer = document.createElement('div');
            spacer.style.height = '60vh';
            container.appendChild(spacer);
        }
        if (col.video && col.id !== 4) {
            const vidSec = document.createElement('section');
            vidSec.className = 'video-break';
            vidSec.innerHTML = `<video class="full-video" autoplay muted loop playsinline poster="images/hero.jpg"><source src="${col.video}" type="video/mp4"></video>`;
            container.appendChild(vidSec);
        }
        const sec = document.createElement('section');
        sec.className = 'gallery-section';
        sec.id = `col-${col.id}`;
        const itemsHtml = items.map((p, pi) => {
            const idx = products.indexOf(p);
            const h = p.height || 600;
            return `<div class="gallery-item" data-product="${idx}">
                <img src="${p.image}" class="gallery-img" style="min-width: ${380 + pi * 30}px; height: ${h}px;">
            </div>`;
        }).join('');
        sec.innerHTML = col.id === 4
            ? `<h2 class="collection-right-title">${col.name}</h2>
                <section class="video-break" style="height:80vh;position:relative;">
                    <video class="full-video" autoplay muted loop playsinline poster="images/hero.jpg"><source src="images/cellection2.mp4" type="video/mp4"></video>
                    <div style="position:absolute;top:24px;left:24px;z-index:3;font-size:13px;font-weight:300;letter-spacing:4px;text-transform:uppercase;color:#fff;text-shadow:0 2px 12px rgba(0,0,0,0.5);background:rgba(0,0,0,0.3);padding:6px 14px;">${col.name}</div>
                </section>
                <div class="horizontal-gallery"><div class="gallery-track">${itemsHtml}</div></div>
                <button class="gallery-arrow gallery-arrow-left" aria-label="Previous">&#8592;</button>
                <button class="gallery-arrow gallery-arrow-right" aria-label="Next">&#8594;</button>`
            : `<h2 class="collection-right-title">${col.name}</h2>
                <div class="horizontal-gallery"><div class="gallery-track">${itemsHtml}</div></div>
                <button class="gallery-arrow gallery-arrow-left" aria-label="Previous">&#8592;</button>
                <button class="gallery-arrow gallery-arrow-right" aria-label="Next">&#8594;</button>`;
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
