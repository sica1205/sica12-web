const perfBtn = document.getElementById('perfBtn');
const perfIconOff = document.getElementById('perfIconOff');
const perfIconOn = document.getElementById('perfIconOn');
const PERF_KEY = 'sica-hub-perf';
let isPerfOn = localStorage.getItem(PERF_KEY) === 'on';

function setPerformance(on) {
  isPerfOn = on;
  document.body.classList.toggle('perf-on', on);
  perfBtn.classList.toggle('active', on);
  perfIconOff.classList.toggle('hidden', on);
  perfIconOn.classList.toggle('hidden', !on);
  localStorage.setItem(PERF_KEY, on ? 'on' : 'off');
  if (on) destroyParticles(); else createParticles();
}

function togglePerformance() { setPerformance(!isPerfOn); }
document.addEventListener('DOMContentLoaded', function () { setPerformance(isPerfOn); });
