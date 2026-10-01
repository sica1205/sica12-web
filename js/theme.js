const themeBtn = document.getElementById('themeBtn');
const themeIconSun = document.getElementById('themeIconSun');
const themeIconMoon = document.getElementById('themeIconMoon');
const THEME_KEY = 'sica-hub-theme';
// First visit (no saved choice) starts dark; an explicit "light" choice is remembered.
let isDarkMode = localStorage.getItem(THEME_KEY) !== 'light';

function applyTheme(dark) {
  isDarkMode = dark;
  document.body.classList.toggle('dark-mode', dark);
  themeBtn.classList.toggle('dark', dark);
  themeIconSun.classList.toggle('hidden', !dark);
  themeIconMoon.classList.toggle('hidden', dark);
}

function toggleTheme() {
  applyTheme(!isDarkMode);
  localStorage.setItem(THEME_KEY, isDarkMode ? 'dark' : 'light');
}

document.addEventListener('DOMContentLoaded', function () { applyTheme(isDarkMode); });
