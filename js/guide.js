(() => {
  const MODULE_ID = 'windows-guide';
  const MODULE_URL = 'modules/guide1.html';

  let loading = false;

  function getResourcesView() {
    return document.getElementById('resourcesView');
  }


  // ==========================================
  // Windows Guide — accordion
  // ==========================================

  function initAccordion(root) {
    const titles = root.querySelectorAll('.step-title');

    titles.forEach(title => {
      title.setAttribute('role', 'button');
      title.setAttribute('tabindex', '0');
      title.setAttribute('aria-expanded', 'false');

      const toggle = () => {
        const step = title.closest('.step');

        if (!step) return;

        const isOpen = step.classList.toggle('open');

        title.setAttribute(
          'aria-expanded',
          String(isOpen)
        );
      };

      title.addEventListener('click', toggle);

      title.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') {
          return;
        }

        event.preventDefault();
        toggle();
      });
    });
  }


  // ==========================================
  // Loading state
  // ==========================================

  function setLoading(active) {
    document.body.classList.toggle(
      'guide-loading',
      active
    );
  }


  // ==========================================
  // Open Windows Guide
  // ==========================================

  async function openGuide() {
    if (loading) return;

    const view = getResourcesView();

    if (!view) return;

    loading = true;
    setLoading(true);

    try {
      const response = await fetch(MODULE_URL, {
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();

      view.innerHTML = `
        <div class="guide-view">

          <header class="view-header detail-enter detail-enter-header">

            <button
              class="back-btn"
              id="guideBackBtn"
              type="button"
            >
              ← Înapoi la resurse
            </button>

            <div>
              <span class="eyebrow">
                · GUIDE
              </span>

              <p>
                Ghidul ăsta a fost conceput să fie cât mai ușor posibil și să fie pe înțelesul tuturor.<br> 
                Dacă nu ai înțeles pașii pe care ți-i oferă ghidul, ori nu știu eu să explic așa cum trebuie, ori e posibil să fii bătut în cap.

              </p>
            </div>

          </header>


          <article class="guide-content detail-enter">
            ${html}
          </article>

        </div>
      `;


      // ========================================
      // Accordion
      // ========================================

      initAccordion(view);


      // ========================================
      // Back
      // ========================================

      const backButton =
        document.getElementById('guideBackBtn');

      if (backButton) {
        backButton.addEventListener(
          'click',
          () => {
            renderResources();

            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }
        );
      }


      // ========================================
      // Scroll top
      // ========================================

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    } catch (error) {

      console.error(
        'Windows Guide failed to load:',
        error
      );

      view.innerHTML = `
        <div class="guide-view">

          <header class="view-header">

            <button
              class="back-btn"
              id="guideErrorBack"
              type="button"
            >
              ← Înapoi la resurse
            </button>

            <div>
              <span class="eyebrow">
                02 · RESOURCE · ERROR
              </span>

              <h2>
                Nu am putut încărca ghidul
              </h2>

              <p>
                Fișierul guide1.html nu a putut fi încărcat.
              </p>
            </div>

          </header>

        </div>
      `;


      document
        .getElementById('guideErrorBack')
        ?.addEventListener(
          'click',
          () => {
            renderResources();
          }
        );

    } finally {
      loading = false;

      window.setTimeout(() => {
        setLoading(false);
      }, 120);
    }
  }


  // ==========================================
  // Resource click interception
  // ==========================================

  document.addEventListener('click', event => {

    const card =
      event.target.closest(
        `[data-module="${MODULE_ID}"]`
      );

    if (!card) return;

    event.preventDefault();

    openGuide();
  });

})();