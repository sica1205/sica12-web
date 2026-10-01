// ===== Projects UI =====
const projectsViewEl = document.getElementById('projectsView');
const projectDetailViewEl = document.getElementById('projectDetailView');

function escapeProjectHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderProjectsMenu() {
  if (!projectsViewEl) return;

  const cardsHtml = PROJECTS.map((project, index) => `
    <button
      class="project-menu-card stagger-in"
      type="button"
      style="animation-delay:${0.12 + index * 0.09}s"
      data-project-id="${escapeProjectHtml(project.id)}"
    >
      <div class="project-menu-card-icon-wrap">
        ${project.icon
          ? `<img class="project-menu-card-icon" src="${escapeProjectHtml(project.icon)}" alt="">`
          : `<span class="project-menu-card-fallback">✦</span>`}
      </div>

      <div class="project-menu-card-copy">
        <span class="project-menu-card-meta">${escapeProjectHtml(project.year || '')}</span>
        <h3>${escapeProjectHtml(project.title)}</h3>
        <p>${escapeProjectHtml(project.shortDescription || '')}</p>
      </div>

      <span class="project-menu-card-arrow">→</span>
    </button>
  `).join('');

  projectsViewEl.innerHTML = `
    <header class="view-header">
      <button class="back-btn" type="button" onclick="showView(homeView)">← Înapoi</button>
      <div>
        <span class="eyebrow">01 · PROJECTS</span>
        <h2>Proiecte <span class="project-count">(${PROJECTS.length})</span></h2>
        <p>O colecție de proiecte la care am lucrat de-a lungul timpului.</p>
      </div>
    </header>

    <div class="project-menu-grid project-menu-grid-all">
      ${cardsHtml || '<p>Momentan nu există proiecte.</p>'}
    </div>
  `;

  projectsViewEl.querySelectorAll('[data-project-id]').forEach(card => {
    card.addEventListener('click', () => {
      openProjectDetail(card.dataset.projectId);
    });
  });
}
function openProjectDetail(projectId) {
  const project = PROJECTS.find(item => item.id === projectId);
  if (!project || !projectDetailViewEl) return;

  renderProjectDetail(project);
  showView(projectDetailViewEl);
}

function renderProjectDetail(project) {
  let mediaHtml = '';

  (project.images || []).forEach((image, index) => {
    mediaHtml += `
      <button
        class="project-detail-image stagger-in"
        type="button"
        style="animation-delay:${0.20 + index * 0.10}s"
        onclick="openProjectLightbox('${escapeProjectHtml(image)}', '${escapeProjectHtml(project.title)}', ${index + 1})"
      >
        <img src="${escapeProjectHtml(image)}" alt="${escapeProjectHtml(project.title)} - Imagine ${index + 1}" loading="lazy">
      </button>
    `;
  });

  if (project.youtubeId) {
    const videoIndex = (project.images || []).length;
    mediaHtml += `
      <button
        class="project-detail-video stagger-in"
        type="button"
        style="animation-delay:${0.20 + videoIndex * 0.10}s"
        onclick="openProjectVideo('${escapeProjectHtml(project.youtubeId)}', '${escapeProjectHtml(project.title)}')"
      >
        <img src="https://img.youtube.com/vi/${escapeProjectHtml(project.youtubeId)}/hqdefault.jpg" alt="${escapeProjectHtml(project.title)} - Video" loading="lazy">
        <span class="project-video-play">▶</span>
      </button>
    `;
  }

  if (!mediaHtml) {
    mediaHtml = `
      <div class="project-detail-media-empty">
        Momentan, proiectul ăsta nu are previzualizări disponibile.
      </div>
    `;
  }

  const descriptionHtml = escapeProjectHtml(project.description || '').replace(/\n/g, '<br>');

  const detailsHtml = (project.details || []).length
    ? `
      <div class="project-detail-extra-grid detail-enter detail-enter-extra">
        ${project.details.map((detail, detailIndex) => `
          <article class="detail-card project-detail-extra-card stagger-in" style="animation-delay:${0.38 + detailIndex * 0.09}s">
            <h3>${escapeProjectHtml(detail.title || '')}</h3>
            <p>${escapeProjectHtml(detail.text || '')}</p>
          </article>
        `).join('')}
      </div>
    `
    : '';

  projectDetailViewEl.innerHTML = `
    <header class="view-header compact-header detail-enter detail-enter-header">
      <button class="back-btn" type="button" onclick="showView(projectsView)">← Proiecte</button>
      <div>
        <span class="eyebrow">PROJECT · ${escapeProjectHtml(project.year || '')}</span>
        <h2>${escapeProjectHtml(project.title)}</h2>
      </div>
    </header>

    <div class="project-detail-content">
      <div class="project-detail-media detail-enter detail-enter-media">
        ${mediaHtml}
      </div>

      <article class="project-detail-description detail-card detail-enter detail-enter-info">
        <span class="detail-label">DESPRE PROIECT</span>
        <p>${descriptionHtml}</p>

        ${(project.tags || []).length ? `
          <div class="tag-row project-detail-tags">
            ${project.tags.map(tag => `<span>${escapeProjectHtml(tag)}</span>`).join('')}
          </div>
        ` : ''}
      </article>

      ${detailsHtml}

      ${project.projectUrl ? `
        <a
          class="project-open-button detail-enter detail-enter-button"
          href="${escapeProjectHtml(project.projectUrl.trim())}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>${escapeProjectHtml(project.projectLabel || 'Accesează proiectul')}</span>
          <span>↗</span>
        </a>
      ` : ''}
    </div>
  `;
}

let projectLightboxImages = [];
let projectLightboxIndex = 0;
let projectLightboxZoom = 0.75;
let projectLightboxPanX = 0;
let projectLightboxPanY = 0;
let projectLightboxDragging = false;
let projectLightboxDidDrag = false;
let projectLightboxSwitching = false;
let projectLightboxLastX = 0;
let projectLightboxLastY = 0;
let projectLightboxPinchStartDistance = 0;
let projectLightboxPinchStartZoom = 1;
const projectLightboxPointers = new Map();

function ensureProjectLightbox() {
  let lightbox = document.getElementById('projectLightbox');
  if (lightbox) return lightbox;

  lightbox = document.createElement('div');
  lightbox.id = 'projectLightbox';
  lightbox.className = 'project-lightbox';
  lightbox.innerHTML = `
    <button class="project-lightbox-control project-lightbox-close" type="button" aria-label="Închide" title="Închide">×</button>

    <button class="project-lightbox-control project-lightbox-nav project-lightbox-prev" type="button" aria-label="Imaginea anterioară" title="Imaginea anterioară">←</button>

    <div class="project-lightbox-stage" id="projectLightboxStage">
      <img id="projectLightboxImg" src="" alt="" draggable="false">
    </div>

    <button class="project-lightbox-control project-lightbox-nav project-lightbox-next" type="button" aria-label="Imaginea următoare" title="Imaginea următoare">→</button>

    <div class="project-lightbox-controls" aria-label="Controale imagine">
      <button class="project-lightbox-control" type="button" data-lightbox-action="zoom-out" aria-label="Micșorează" title="Micșorează">−</button>
      <span class="project-lightbox-zoom" id="projectLightboxZoom">75%</span>
      <button class="project-lightbox-control" type="button" data-lightbox-action="zoom-in" aria-label="Mărește" title="Mărește">+</button>
      <button class="project-lightbox-control" type="button" data-lightbox-action="reset" aria-label="Resetează zoom-ul" title="Resetează">⟲</button>
    </div>
  `;

  document.body.appendChild(lightbox);

  const stage = lightbox.querySelector('#projectLightboxStage');
  const image = lightbox.querySelector('#projectLightboxImg');

  lightbox.addEventListener('click', event => {
    if ((event.target === lightbox || event.target === stage) && !projectLightboxDidDrag && projectLightboxZoom <= 1) {
      closeProjectLightbox();
    }
    projectLightboxDidDrag = false;
  });

  lightbox.querySelector('.project-lightbox-close').addEventListener('click', closeProjectLightbox);
  lightbox.querySelector('.project-lightbox-prev').addEventListener('click', () => stepProjectLightbox(-1));
  lightbox.querySelector('.project-lightbox-next').addEventListener('click', () => stepProjectLightbox(1));
  lightbox.querySelector('[data-lightbox-action="zoom-out"]').addEventListener('click', () => zoomProjectLightbox(-0.25));
  lightbox.querySelector('[data-lightbox-action="zoom-in"]').addEventListener('click', () => zoomProjectLightbox(0.25));
  lightbox.querySelector('[data-lightbox-action="reset"]').addEventListener('click', resetProjectLightboxZoom);

  image.addEventListener('click', event => event.stopPropagation());
  image.addEventListener('dblclick', event => {
    event.preventDefault();
    if (projectLightboxZoom > 1) resetProjectLightboxZoom();
    else setProjectLightboxZoom(2);
  });

  stage.addEventListener('wheel', event => {
    if (!lightbox.classList.contains('open')) return;
    event.preventDefault();
    zoomProjectLightbox(event.deltaY < 0 ? 0.25 : -0.25);
  }, { passive: false });

  stage.addEventListener('pointerdown', handleProjectLightboxPointerDown);
  stage.addEventListener('pointermove', handleProjectLightboxPointerMove);
  stage.addEventListener('pointerup', handleProjectLightboxPointerUp);
  stage.addEventListener('pointercancel', handleProjectLightboxPointerUp);
  stage.addEventListener('lostpointercapture', handleProjectLightboxPointerUp);

  window.addEventListener('resize', () => {
    if (!lightbox.classList.contains('open')) return;
    clampProjectLightboxPan();
    applyProjectLightboxTransform(false);
  });

  return lightbox;
}

function openProjectLightbox(src, title, index) {
  const project = PROJECTS.find(item => item.title === title);
  projectLightboxImages = project?.images?.length ? [...project.images] : [src];
  projectLightboxIndex = Math.max(0, Math.min((index || 1) - 1, projectLightboxImages.length - 1));

  const lightbox = ensureProjectLightbox();
  lightbox.dataset.projectTitle = title;
  resetProjectLightboxZoom();
  updateProjectLightboxImage();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function updateProjectLightboxImage() {
  const lightbox = ensureProjectLightbox();
  const image = lightbox.querySelector('#projectLightboxImg');
  const title = lightbox.dataset.projectTitle || 'Proiect';
  const src = projectLightboxImages[projectLightboxIndex];

  if (!src) return;

  image.src = src;
  image.alt = `${title} - Imagine ${projectLightboxIndex + 1}`;

  const multiple = projectLightboxImages.length > 1;
  lightbox.querySelector('.project-lightbox-prev').classList.toggle('hidden-control', !multiple);
  lightbox.querySelector('.project-lightbox-next').classList.toggle('hidden-control', !multiple);
}

function stepProjectLightbox(direction) {
  if (projectLightboxImages.length <= 1 || projectLightboxSwitching) return;

  const lightbox = ensureProjectLightbox();
  const image = lightbox.querySelector('#projectLightboxImg');
  projectLightboxSwitching = true;

  const outClass = direction > 0 ? 'lightbox-slide-out-left' : 'lightbox-slide-out-right';
  const inClass = direction > 0 ? 'lightbox-slide-in-right' : 'lightbox-slide-in-left';

  image.classList.remove('lightbox-slide-in-left', 'lightbox-slide-in-right', 'lightbox-slide-out-left', 'lightbox-slide-out-right');
  image.classList.add(outClass);

  window.setTimeout(() => {
    projectLightboxIndex = (projectLightboxIndex + direction + projectLightboxImages.length) % projectLightboxImages.length;
    resetProjectLightboxZoom();
    updateProjectLightboxImage();

    image.classList.remove(outClass);
    image.classList.add(inClass);

    window.setTimeout(() => {
      image.classList.remove(inClass);
      projectLightboxSwitching = false;
    }, 240);
  }, 135);
}

function setProjectLightboxZoom(value) {
  projectLightboxZoom = Math.min(2, Math.max(0.5, value));
  if (projectLightboxZoom <= 1) {
    projectLightboxPanX = 0;
    projectLightboxPanY = 0;
  }
  clampProjectLightboxPan();
  applyProjectLightboxTransform(true);
}

function zoomProjectLightbox(delta) {
  setProjectLightboxZoom(projectLightboxZoom + delta);
}

function resetProjectLightboxZoom() {
  projectLightboxZoom = 0.75;
  projectLightboxPanX = 0;
  projectLightboxPanY = 0;
  projectLightboxPointers.clear();
  projectLightboxDragging = false;
  applyProjectLightboxTransform(true);
}

function clampProjectLightboxPan() {
  const lightbox = document.getElementById('projectLightbox');
  if (!lightbox) return;

  const stage = lightbox.querySelector('#projectLightboxStage');
  const image = lightbox.querySelector('#projectLightboxImg');
  if (!stage || !image || projectLightboxZoom <= 1) {
    projectLightboxPanX = 0;
    projectLightboxPanY = 0;
    return;
  }

  const scaledWidth = image.offsetWidth * projectLightboxZoom;
  const scaledHeight = image.offsetHeight * projectLightboxZoom;
  const maxX = Math.max(0, (scaledWidth - stage.clientWidth) / 2);
  const maxY = Math.max(0, (scaledHeight - stage.clientHeight) / 2);

  projectLightboxPanX = Math.max(-maxX, Math.min(maxX, projectLightboxPanX));
  projectLightboxPanY = Math.max(-maxY, Math.min(maxY, projectLightboxPanY));
}

function applyProjectLightboxTransform(animate = false) {
  const lightbox = document.getElementById('projectLightbox');
  if (!lightbox) return;

  const image = lightbox.querySelector('#projectLightboxImg');
  const stage = lightbox.querySelector('#projectLightboxStage');
  const zoom = lightbox.querySelector('#projectLightboxZoom');

  if (image) {
    image.classList.toggle('is-zoomed', projectLightboxZoom > 1);
    image.classList.toggle('is-dragging', projectLightboxDragging);
    image.style.transition = animate ? 'transform .18s cubic-bezier(.2,.8,.2,1)' : 'none';
    image.style.transform = `translate3d(${projectLightboxPanX}px, ${projectLightboxPanY}px, 0) scale(${projectLightboxZoom})`;
  }

  if (stage) stage.classList.toggle('can-pan', projectLightboxZoom > 1);
  if (zoom) zoom.textContent = `${Math.round(projectLightboxZoom * 100)}%`;
}

function handleProjectLightboxPointerDown(event) {
  const lightbox = document.getElementById('projectLightbox');
  if (!lightbox?.classList.contains('open')) return;

  const stage = lightbox.querySelector('#projectLightboxStage');
  if (!stage) return;

  projectLightboxPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  try { stage.setPointerCapture(event.pointerId); } catch (_) {}

  if (projectLightboxPointers.size === 2) {
    const [a, b] = [...projectLightboxPointers.values()];
    projectLightboxPinchStartDistance = Math.hypot(b.x - a.x, b.y - a.y);
    projectLightboxPinchStartZoom = projectLightboxZoom;
    projectLightboxDragging = false;
    applyProjectLightboxTransform(false);
    return;
  }

  if (projectLightboxZoom > 1) {
    projectLightboxDragging = true;
    projectLightboxDidDrag = false;
    projectLightboxLastX = event.clientX;
    projectLightboxLastY = event.clientY;
    applyProjectLightboxTransform(false);
  }
}

function handleProjectLightboxPointerMove(event) {
  if (!projectLightboxPointers.has(event.pointerId)) return;

  const previous = projectLightboxPointers.get(event.pointerId);
  projectLightboxPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

  if (projectLightboxPointers.size >= 2) {
    event.preventDefault();
    const [a, b] = [...projectLightboxPointers.values()].slice(0, 2);
    const distance = Math.hypot(b.x - a.x, b.y - a.y);

    if (projectLightboxPinchStartDistance > 0) {
      projectLightboxZoom = Math.min(2, Math.max(1, projectLightboxPinchStartZoom * (distance / projectLightboxPinchStartDistance)));
      clampProjectLightboxPan();
      projectLightboxDidDrag = true;
      applyProjectLightboxTransform(false);
    }
    return;
  }

  if (!projectLightboxDragging || projectLightboxZoom <= 1) return;

  event.preventDefault();
  const dx = event.clientX - (previous?.x ?? projectLightboxLastX);
  const dy = event.clientY - (previous?.y ?? projectLightboxLastY);

  if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) projectLightboxDidDrag = true;

  projectLightboxPanX += dx;
  projectLightboxPanY += dy;
  projectLightboxLastX = event.clientX;
  projectLightboxLastY = event.clientY;

  clampProjectLightboxPan();
  applyProjectLightboxTransform(false);
}

function handleProjectLightboxPointerUp(event) {
  const lightbox = document.getElementById('projectLightbox');
  const stage = lightbox?.querySelector('#projectLightboxStage');

  projectLightboxPointers.delete(event.pointerId);
  if (stage) {
    try { stage.releasePointerCapture(event.pointerId); } catch (_) {}
  }

  if (projectLightboxPointers.size < 2) {
    projectLightboxPinchStartDistance = 0;
    projectLightboxPinchStartZoom = projectLightboxZoom;
  }

  if (projectLightboxPointers.size === 1) {
    const remaining = [...projectLightboxPointers.values()][0];
    projectLightboxLastX = remaining.x;
    projectLightboxLastY = remaining.y;
    projectLightboxDragging = projectLightboxZoom > 1;
  } else {
    projectLightboxDragging = false;
  }

  clampProjectLightboxPan();
  applyProjectLightboxTransform(false);
}

function closeProjectLightbox() {
  const lightbox = document.getElementById('projectLightbox');
  if (!lightbox) return;
  lightbox.classList.remove('open');
  projectLightboxPointers.clear();
  projectLightboxDragging = false;
  projectLightboxDidDrag = false;
  projectLightboxSwitching = false;
  resetProjectLightboxZoom();
  document.body.style.overflow = '';
}

function ensureProjectVideoLightbox() {
  let lightbox = document.getElementById('projectVideoLightbox');
  if (lightbox) return lightbox;

  lightbox = document.createElement('div');
  lightbox.id = 'projectVideoLightbox';
  lightbox.className = 'project-video-lightbox';
  lightbox.innerHTML = `
    <button class="project-lightbox-close" type="button" aria-label="Închide">×</button>
    <div class="project-video-frame-wrap">
      <iframe id="projectVideoFrame" src="" title="" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
    </div>
  `;

  document.body.appendChild(lightbox);

  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) closeProjectVideo();
  });
  lightbox.querySelector('.project-lightbox-close').addEventListener('click', closeProjectVideo);

  return lightbox;
}

function openProjectVideo(videoId, title) {
  const lightbox = ensureProjectVideoLightbox();
  const frame = lightbox.querySelector('#projectVideoFrame');
  frame.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
  frame.title = `${title} - Video`;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProjectVideo() {
  const lightbox = document.getElementById('projectVideoLightbox');
  if (!lightbox) return;
  const frame = lightbox.querySelector('#projectVideoFrame');
  if (frame) frame.src = '';
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', event => {
  const lightbox = document.getElementById('projectLightbox');
  const lightboxOpen = lightbox?.classList.contains('open');

  if (event.key === 'Escape') {
    closeProjectLightbox();
    closeProjectVideo();
    return;
  }

  if (!lightboxOpen) return;

  if (event.key === 'ArrowLeft') stepProjectLightbox(-1);
  if (event.key === 'ArrowRight') stepProjectLightbox(1);
  if (event.key === '+' || event.key === '=') zoomProjectLightbox(0.25);
  if (event.key === '-') zoomProjectLightbox(-0.25);
  if (event.key === '0') resetProjectLightboxZoom();
});

renderProjectsMenu();
