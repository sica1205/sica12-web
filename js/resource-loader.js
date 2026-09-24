(() => {

  const RESOURCE_MODULES = {
    'hex-picker': 'modules/hex.html',
    'password-generator': 'modules/password-generator.html'
  };


  let loading = false;


  function getResourcesView() {
    return document.getElementById('resourcesView');
  }


  function setLoading(active) {
    document.body.classList.toggle(
      'resource-loading',
      active
    );
  }


  async function openResourceModule(
    moduleId,
    moduleUrl
  ) {

    if (loading) return;


    const view =
      getResourcesView();

    if (!view) return;


    loading = true;

    setLoading(true);


    try {

      const response =
        await fetch(
          moduleUrl,
          {
            cache: 'no-cache'
          }
        );


      if (!response.ok) {

        throw new Error(
          `HTTP ${response.status}`
        );

      }


      const html =
        await response.text();


      view.innerHTML = `

        <div class="resource-module-view">

          <header
            class="view-header detail-enter detail-enter-header"
          >

            <button
              class="back-btn"
              id="resourceModuleBackBtn"
              type="button"
            >
              ← Înapoi la resurse
            </button>


            <div>

              <span class="eyebrow">
                02 · RESOURCE
              </span>

            </div>

          </header>


          <article
            class="resource-module-content detail-enter"
          >

            ${html}

          </article>

        </div>

      `;


      document
        .getElementById(
          'resourceModuleBackBtn'
        )
        ?.addEventListener(
          'click',
          () => {

            renderResources();


            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });

          }
        );


      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });


    }

    catch (error) {

      console.error(
        `${moduleId} failed to load:`,
        error
      );


      view.innerHTML = `

        <div class="resource-module-view">

          <header class="view-header">

            <button
              class="back-btn"
              id="resourceModuleErrorBack"
              type="button"
            >
              ← Înapoi la resurse
            </button>


            <div>

              <span class="eyebrow">
                02 · RESOURCE · ERROR
              </span>


              <h2>
                Nu am putut încărca resursa
              </h2>


              <p>
                Fișierul resursei nu a putut fi încărcat.
              </p>

            </div>

          </header>

        </div>

      `;


      document
        .getElementById(
          'resourceModuleErrorBack'
        )
        ?.addEventListener(
          'click',
          () => {

            renderResources();

          }
        );

    }


    finally {

      loading = false;


      window.setTimeout(
        () => {

          setLoading(false);

        },
        120
      );

    }

  }


  document.addEventListener(
    'click',
    event => {

      const card =
        event.target.closest(
          '[data-module]'
        );


      if (!card) return;


      const moduleId =
        card.dataset.module;


      const moduleUrl =
        RESOURCE_MODULES[moduleId];


      if (!moduleUrl) return;


      event.preventDefault();


      openResourceModule(
        moduleId,
        moduleUrl
      );

    }
  );

})();