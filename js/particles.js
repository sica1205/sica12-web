const particlesContainer = document.getElementById('particles');
const particleCount = 26;

function createParticles() {
  if (!particlesContainer || particlesContainer.children.length > 0) return;
  if (localStorage.getItem('sica-hub-perf') === 'on') return;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 12 + 8;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 9 + 7) + 's';
    particle.style.animationDelay = (Math.random() * 10) + 's';
    particlesContainer.appendChild(particle);
  }
}

function destroyParticles() {
  if (particlesContainer) particlesContainer.replaceChildren();
}

if (localStorage.getItem('sica-hub-perf') !== 'on') createParticles();
