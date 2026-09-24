const resources = [
  {
    index: '01',
    type: 'GUIDE',
    title: 'Windows 10 LTSC Install Guide',
    description: 'Ghid de instalare și setup pentru Windows 10, respectiv 10 IoT LTSC 2021.',
    href: 'modules/guide1.html',
    module: 'windows-guide'
  },
  {
    index: '02',
    type: 'UTILITY',
    title: 'HEX Color Picker',
    description: 'Picker rapid pentru HEX, RGB și HSL.',
    href: 'modules/hex.html',
    module: 'hex-picker'
  },
  {
    index: '03',
    type: 'UTILITY',
    title: 'Password Generator',
    description: 'Generator simplu pentru parole random și configurabile.',
    href: 'modules/password-generator.html',
    module: 'password-generator'
  }
];


function renderResources() {
  const view = document.getElementById('resourcesView');

  if (!view) return;

  view.innerHTML = `
    <header class="view-header detail-enter detail-enter-header">
      <button
        class="back-btn"
        onclick="showView(homeView)"
        type="button"
      >
        ← Înapoi
      </button>

      <div>
        <span class="eyebrow">02 · RESOURCES</span>
        <h2>Resurse</h2>
        <p>
          Lucruri făcute pentru mine, dar care pot fi utile și altcuiva.
        </p>
      </div>
    </header>

    <div class="resource-grid">
      ${resources.map((resource, index) => `
        <button
          class="resource-card stagger-in"
          type="button"
          data-module="${resource.module || ''}"
          data-href="${resource.href}"
          style="animation-delay:${0.12 + index * 0.09}s"
        >
          <span class="resource-index">
            ${resource.index}
          </span>

          <div>
            <span class="resource-type">
              ${resource.type}
            </span>

            <h3>
              ${resource.title}
            </h3>

            <p>
              ${resource.description}
            </p>
          </div>

          <span class="resource-open">
            →
          </span>
        </button>
      `).join('')}
    </div>
  `;
}


renderResources();