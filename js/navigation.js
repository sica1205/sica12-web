const homeView = document.getElementById('homeView');
const projectsView = document.getElementById('projectsView');
const projectDetailView = document.getElementById('projectDetailView');
const resourcesView = document.getElementById('resourcesView');
const aboutView = document.getElementById('aboutView');
const allViews = [homeView, projectsView, projectDetailView, resourcesView, aboutView];
const scrollPositions = {};
let viewTransitionTimer = null;

function showView(view) {
  if (!view) return;
  if (viewTransitionTimer) clearTimeout(viewTransitionTimer);

  const currentView = allViews.find(v => v.classList.contains('active'));
  if (currentView && currentView !== view) scrollPositions[currentView.id] = window.scrollY;

  const activate = function () {

    allViews.forEach(v => {
      v.classList.remove('active', 'closing');
    });

    view.classList.add('active');

    if (view === resourcesView && typeof renderResources === 'function') {
      renderResources();
    }

    window.scrollTo(
      0,
      scrollPositions[view.id] ?? 0
    );

    viewTransitionTimer = null;

  };

  if (currentView && currentView !== view) {
    currentView.classList.add('closing');
    viewTransitionTimer = setTimeout(activate, 280);
  } else {
    activate();
  }
}
