const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const musicIconOn = document.getElementById('musicIconOn');
const musicIconOff = document.getElementById('musicIconOff');
const MUSIC_VOLUME = 0.04;
const MUSIC_MUTED_KEY = 'sica-hub-music-muted';

bgMusic.volume = MUSIC_VOLUME;

function isMusicMutedByUser() { return localStorage.getItem(MUSIC_MUTED_KEY) === 'true'; }
function setMusicMutedPreference(isMuted) { localStorage.setItem(MUSIC_MUTED_KEY, String(isMuted)); }
function updateMusicUI() {
  const isPlaying = !bgMusic.paused;
  musicBtn.classList.toggle('playing', isPlaying);
  musicIconOn.classList.toggle('hidden', !isPlaying);
  musicIconOff.classList.toggle('hidden', isPlaying);
}

async function playMusic() {
  if (isMusicMutedByUser()) { updateMusicUI(); return false; }
  try { await bgMusic.play(); updateMusicUI(); return true; }
  catch (_) { updateMusicUI(); return false; }
}

async function toggleMusic() {
  if (bgMusic.paused) {
    setMusicMutedPreference(false);
    try { await bgMusic.play(); updateMusicUI(); removeInteractionListeners(); }
    catch (_) { updateMusicUI(); }
  } else {
    bgMusic.pause();
    setMusicMutedPreference(true);
    updateMusicUI();
    removeInteractionListeners();
  }
}

async function startMusicOnInteraction(event) {
  if (isMusicMutedByUser()) { removeInteractionListeners(); return; }
  if (event.target.closest('#musicBtn')) return;
  if (await playMusic()) removeInteractionListeners();
}

function removeInteractionListeners() {
  document.removeEventListener('pointerdown', startMusicOnInteraction);
  document.removeEventListener('keydown', startMusicOnInteraction);
}

if (!isMusicMutedByUser()) {
  playMusic().then(function (started) { if (started) removeInteractionListeners(); });
  document.addEventListener('pointerdown', startMusicOnInteraction);
  document.addEventListener('keydown', startMusicOnInteraction);
}

bgMusic.addEventListener('play', updateMusicUI);
bgMusic.addEventListener('pause', updateMusicUI);
updateMusicUI();
